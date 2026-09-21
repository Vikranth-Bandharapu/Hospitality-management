/* ==========================================================================
   AURA HOSPITALITY MANAGEMENT - AUTHENTICATION & ROLE CONTROLLER
   Session state, role switching, client validation, zero plaintext storage
   ========================================================================== */

const AuthController = {
  // Key for session role
  SESSION_KEY: 'aura_user_session',

  // Get Current Active User
  getCurrentUser() {
    const sessionRaw = sessionStorage.getItem(this.SESSION_KEY);
    if (!sessionRaw) {
      // Default to Admin for easy demo testing if not set
      return AuraMockData.users.admin;
    }
    try {
      const session = JSON.parse(sessionRaw);
      return AuraMockData.users[session.role] || AuraMockData.users.admin;
    } catch (e) {
      return AuraMockData.users.admin;
    }
  },

  // Switch Role Session
  switchRole(roleKey) {
    if (!AuraMockData.users[roleKey]) {
      Toast.show("Auth Error", "Invalid role selected.", "error");
      return;
    }

    const sessionObj = {
      role: roleKey,
      token: "aura_jwt_mock_" + Math.random().toString(36).substring(2),
      loginTime: new Date().toISOString()
    };

    // Store token and role in sessionStorage (NO plain-text passwords)
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionObj));

    const user = AuraMockData.users[roleKey];
    Toast.show("Switched Perspective", `Logged in as ${user.name} (${user.role.toUpperCase()})`, "success");

    // If on dashboard or login page, update UI dynamically
    if (window.location.pathname.includes('dashboard.html')) {
      if (typeof DashboardController !== 'undefined') {
        DashboardController.initView();
      } else {
        window.location.reload();
      }
    } else if (window.location.pathname.includes('login.html')) {
      window.location.href = 'dashboard.html';
    }
  },

  // Perform Login Validation & Submission
  handleLogin(email, password, roleKey = 'admin') {
    if (!email || !email.includes('@')) {
      Toast.show("Validation Failed", "Please enter a valid luxury corporate email address.", "error");
      return false;
    }

    if (!password || password.length < 6) {
      Toast.show("Validation Failed", "Password must be at least 6 characters.", "error");
      return false;
    }

    // Fictional authentication check
    const sessionObj = {
      role: roleKey,
      token: "aura_token_" + btoa(email + ":" + Date.now()),
      loginTime: new Date().toISOString()
    };

    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionObj));
    Toast.show("Authentication Successful", `Welcome back, ${AuraMockData.users[roleKey].name}`, "success");

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);

    return true;
  },

  // Logout Handler
  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem('aura_user_email');
    if (typeof Toast !== 'undefined' && Toast.show) {
      Toast.show("Logged Out", "You have been safely logged out. Redirecting to home...", "info", 1200);
    }
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 400);
  }
};

window.AuthController = AuthController;
