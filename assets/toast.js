/* ==========================================================================
   AURA HOSPITALITY MANAGEMENT - TOAST NOTIFICATION SYSTEM
   Strict non-alert() user notification system
   ========================================================================== */

class ToastManager {
  constructor() {
    this.container = null;
    this.initContainer();
  }

  initContainer() {
    let container = document.getElementById('aura-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'aura-toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    this.container = container;
  }

  show(title, message, type = 'info', duration = 4000) {
    if (!this.container) this.initContainer();

    const toast = document.createElement('div');
    toast.className = `toast-aura ${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <div class="toast-content">
        <h5>${title}</h5>
        <p>${message}</p>
      </div>
      <button class="toast-close" aria-label="Close Notification">&times;</button>
    `;

    this.container.appendChild(toast);

    // Trigger Entrance animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.dismiss(toast);
    });

    // Auto dismiss timer
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast);
      }, duration);
    }
  }

  dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }
}

// Global Singleton Instance
window.Toast = new ToastManager();
