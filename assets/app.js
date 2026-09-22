/* ==========================================================================
   AURA HOSPITALITY MANAGEMENT - MAIN APPLICATION ENGINE
   Global UI Events, Navbar scroll, Mobile Drawer, Modal Manager, Property Filter Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  init() {
    this.initNavbar();
    this.initMobileDrawer();
    this.initDashboardSidebar();
    this.initModals();
    this.initForms();
    this.initPropertyFilters();
    this.initCTAButtons();
  },

  // Interactive Call-To-Action (CTA) & Filter Pill Handlers
  initCTAButtons() {
    document.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (pill) {
        const parent = pill.closest('div, section');
        if (parent) {
          parent.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
        }
        const filterName = pill.textContent.trim();
        if (typeof Toast !== 'undefined') {
          Toast.show("Filter Applied", "Loaded " + filterName + " records", "info", 1500);
        }
        return;
      }
    });
  },

  // Navbar Scroll Handler
  initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  },

  // Reference-style Mobile Drawer Navigation (Toggle Open/Close)
  initMobileDrawer() {
    const updateToggleIcons = (isOpen) => {
      document.querySelectorAll('.mobile-toggle').forEach(btn => {
        const icon = btn.querySelector('i');
        if (isOpen) {
          btn.classList.add('active');
          if (icon) icon.className = 'fa-solid fa-xmark';
        } else {
          btn.classList.remove('active');
          if (icon) icon.className = 'fa-solid fa-bars-staggered';
        }
      });
    };

    const closeDrawer = () => {
      const drawer = document.querySelector('.mobile-drawer');
      const backdrop = document.querySelector('.drawer-backdrop');
      if (drawer) drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
      updateToggleIcons(false);
    };

    const toggleDrawer = () => {
      const drawer = document.querySelector('.mobile-drawer');
      const backdrop = document.querySelector('.drawer-backdrop');
      if (!drawer) return;

      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        drawer.classList.add('open');
        if (backdrop) backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateToggleIcons(true);
      }
    };

    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.mobile-toggle');
      const closeBtn = e.target.closest('.drawer-close');
      const backdrop = e.target.closest('.drawer-backdrop');
      const drawerNavLink = e.target.closest('.drawer-nav-link');

      if (toggleBtn) {
        e.preventDefault();
        e.stopPropagation();
        toggleDrawer();
      } else if (closeBtn || backdrop || drawerNavLink) {
        closeDrawer();
      }
    });
  },

  // Dashboard Mobile Sidebar Controller (Auto-Close & Tab Reveal on Mobile)
  initDashboardSidebar() {
    window.toggleDashboardSidebar = function(e) {
      if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
      }
      const dashSidebar = document.getElementById('dash-sidebar') || document.querySelector('.dash-sidebar');
      const dashBackdrop = document.querySelector('.dash-sidebar-backdrop');
      if (dashSidebar) {
        const isOpen = dashSidebar.classList.contains('open');
        if (isOpen) {
          dashSidebar.classList.remove('open');
          if (dashBackdrop) dashBackdrop.classList.remove('active');
        } else {
          dashSidebar.classList.add('open');
          if (dashBackdrop) dashBackdrop.classList.add('active');
        }
      }
    };

    document.addEventListener('click', (e) => {
      const dashSidebar = document.getElementById('dash-sidebar') || document.querySelector('.dash-sidebar');
      const dashBackdrop = document.querySelector('.dash-sidebar-backdrop');
      const sidebarLink = e.target.closest('.dash-sidebar a, .dash-sidebar [data-tab], .dash-nav-link, .dash-nav-link-admin, .dash-nav-link-gm');

      // Auto-close sidebar on mobile when ANY tab link is clicked
      if (sidebarLink && dashSidebar) {
        dashSidebar.classList.remove('open');
        if (dashBackdrop) dashBackdrop.classList.remove('active');
      }

      if (e.target.classList.contains('dash-sidebar-backdrop') && dashSidebar) {
        dashSidebar.classList.remove('open');
        e.target.classList.remove('active');
      }
    });
  },

  // Modal Dialog Controller
  initModals() {
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = trigger.getAttribute('data-modal-target');
        this.openModal(targetId);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close')) {
          this.closeModal(modal);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) this.closeModal(activeModal);
      }
    });
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // Form Validation & Handling (NO alert(), custom toasts only)
  initForms() {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit(form);
      });
    });
  },

  handleFormSubmit(form) {
    if (form.getAttribute('onsubmit') && form.getAttribute('onsubmit').includes('Toast.show')) {
      return;
    }
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    });

    if (!isValid) {
      Toast.show("Validation Failed", "Please fill in all required fields accurately.", "error");
      return;
    }

    const formId = form.id;

    if (formId === 'newsletter-form') {
      Toast.show("Subscribed", "Thank you for subscribing to Aura Hospitality Digest.", "success");
      form.reset();
    } else if (formId === 'booking-modal-form') {
      Toast.show("Reservation Confirmed", "Your VIP reservation request has been submitted to Concierge.", "success");
      form.reset();
      const modal = form.closest('.modal-overlay');
      if (modal) this.closeModal(modal);
    } else if (formId === 'login-form') {
      const email = form.querySelector('#login-email').value;
      const password = form.querySelector('#login-password').value;
      const role = form.querySelector('#login-role') ? form.querySelector('#login-role').value : 'admin';
      AuthController.handleLogin(email, password, role);
    } else if (formId === 'hero-booking-form') {
      const selectEl = form.querySelector('select');
      const selectedResort = selectEl ? selectEl.options[selectEl.selectedIndex].text : 'luxury resort';
      Toast.show("Searching Inventories", "Redirecting search query for " + selectedResort + "...", "info", 1000);
      setTimeout(() => {
        window.location.href = '404.html';
      }, 400);
    } else {
      Toast.show("Action Complete", "Your request has been successfully recorded.", "success");
      form.reset();
    }
  },

  initPropertyFilters() {
    const filterContainer = document.getElementById('property-filter-pills');
    if (!filterContainer) return;

    filterContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;

      filterContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const category = pill.getAttribute('data-filter');
      this.filterProperties(category);
    });
  },

  filterProperties(category) {
    const cards = document.querySelectorAll('.property-card-item');
    cards.forEach(card => {
      const type = card.getAttribute('data-type');
      if (category === 'all' || type === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
};

window.filterBlogCategory = function(targetId, categoryName, btn) {
  document.querySelectorAll('#category-pill-bar .filter-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');

  if (targetId === 'all') {
    const el = document.getElementById('latest-insights-grid');
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    Toast.show('Filter Applied', 'Showing All Journal Insights', 'info', 1500);
    return;
  }

  const targetEl = document.getElementById(targetId);
  if (targetEl) {
    const headerOffset = 90;
    const elementPosition = targetEl.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    Toast.show('Filter Applied', 'Loaded ' + categoryName + ' section', 'success', 1500);
  }
};

window.App = App;
