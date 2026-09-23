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
      const target = e.target;
      
      // Allow filter pills to work for category scrolling
      const pill = target.closest('.filter-pill');
      if (pill) {
        return;
      }

      // Allow navigation links pointing to real HTML pages (Login, Register, Home, About, etc.)
      const linkAnchor = target.closest('a[href]');
      if (linkAnchor) {
        const href = linkAnchor.getAttribute('href');
        if (href && (href.endsWith('.html') || href.includes('#'))) {
          if (['login.html', 'signup.html', 'index.html', 'about.html', 'blog.html', 'services.html', 'contact.html', 'events.html', 'gallery.html', 'guest-experience.html', 'offers.html', 'properties.html', '404.html'].includes(href.split('#')[0])) {
            return;
          }
        }
      }

      // Ignore navigation toggles, modal close buttons, brand logos, navbar links, and footer navigation links
      if (target.closest('.mobile-toggle, .drawer-close, .modal-close, .dash-mobile-toggle, #sidebar-toggle-btn, .logo-brand, .nav-links a, .drawer-nav-links a, .footer-links a, .footer-bottom a')) {
        return;
      }

      // Target CTA action buttons, modal trigger buttons, or submit buttons (excluding dashboard actions & auth forms)
      const ctaBtn = target.closest('.btn-aura, .shimmer-btn, [data-modal-target], button[type="submit"]');
      if (ctaBtn) {
        // Skip dashboard action buttons and login form
        const form = ctaBtn.closest('form');
        if (form && form.id === 'login-form') {
          return;
        }
        if (ctaBtn.closest('#admin-dashboard, #manager-dashboard, #staff-dashboard, #dashboard-console, .dash-sidebar, .dash-topbar-section')) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        if (typeof Toast !== 'undefined') {
          Toast.show("Redirecting", "Navigating to 404 page...", "info", 1000);
        }
        setTimeout(() => {
          window.location.href = '404.html';
        }, 300);
      }
    }, true);
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
      document.body.classList.remove('drawer-open');
      document.body.style.overflow = '';
      updateToggleIcons(false);
    };

    const toggleDrawer = () => {
      const drawer = document.querySelector('.mobile-drawer');
      const backdrop = document.querySelector('.drawer-backdrop');
      if (drawer) {
        const isOpen = drawer.classList.contains('open');
        if (isOpen) {
          closeDrawer();
        } else {
          drawer.classList.add('open');
          if (backdrop) backdrop.classList.add('active');
          document.body.classList.add('drawer-open');
          document.body.style.overflow = 'hidden';
          updateToggleIcons(true);
        }
      }
    };

    document.querySelectorAll('.mobile-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDrawer();
      });
    });

    const closeBtn = document.querySelector('.drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    const backdrop = document.querySelector('.drawer-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
  },

  // Dashboard Mobile Sidebar Controller (Auto-Close & Tab Reveal on Mobile)
  initDashboardSidebar() {
    const dashSidebar = document.querySelector('.dash-sidebar');
    const toggleBtns = document.querySelectorAll('.dash-mobile-toggle, #sidebar-toggle-btn');
    
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dashSidebar) {
          dashSidebar.classList.toggle('open');
          let backdrop = document.querySelector('.dash-sidebar-backdrop');
          if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'dash-sidebar-backdrop';
            document.body.appendChild(backdrop);
          }
          backdrop.classList.toggle('active', dashSidebar.classList.contains('open'));
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (dashSidebar && dashSidebar.classList.contains('open') && !dashSidebar.contains(e.target) && !e.target.closest('.dash-mobile-toggle, #sidebar-toggle-btn')) {
        dashSidebar.classList.remove('open');
        const backdrop = document.querySelector('.dash-sidebar-backdrop');
        if (backdrop) backdrop.classList.remove('active');
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
    const formId = form.id;

    if (formId === 'login-form') {
      const email = form.querySelector('#login-email').value;
      const password = form.querySelector('#login-password').value;
      const role = form.querySelector('#login-role') ? form.querySelector('#login-role').value : 'admin';
      AuthController.handleLogin(email, password, role);
    } else {
      if (typeof Toast !== 'undefined') {
        Toast.show("Processing Request", "Redirecting to 404 page...", "info", 1000);
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 300);
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
