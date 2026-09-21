/* ==========================================================================
   AURA HOSPITALITY MANAGEMENT - UNIFIED DASHBOARD CONTROLLER
   Dynamic Role View Rendering (Admin, Manager, Staff, Guest) & Chart.js Integration
   ========================================================================== */

if (typeof window.toggleDashboardSidebar !== 'function') {
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
}

const DashboardController = {
  currentChart: null,

  initView() {
    const currentUser = AuthController.getCurrentUser();
    this.renderUserProfile(currentUser);
    this.renderRoleSwitcherBar(currentUser.role);
    this.renderSidebarNav(currentUser.role);
    this.renderMainContent(currentUser);
    this.syncSessionUser();
  },

  syncSessionUser() {
    const savedEmail = sessionStorage.getItem('aura_user_email');
    if (!savedEmail) return;

    let initials = 'US';
    const parts = savedEmail.split('@')[0].split(/[\._\-]/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts[0] && parts[0].length >= 2) {
      initials = parts[0].substring(0, 2).toUpperCase();
    } else {
      initials = savedEmail.substring(0, 2).toUpperCase();
    }

    document.querySelectorAll('.dash-welcome-email-ref, .user-email-display, .sidebar-email-display').forEach(el => {
      el.textContent = savedEmail;
    });

    document.querySelectorAll('.dash-welcome-avatar-ref, .sidebar-avatar-initials').forEach(el => {
      if (!el.querySelector('i')) {
        el.textContent = initials;
      }
    });
  },

  renderUserProfile(user) {
    const avatarEl = document.getElementById('dash-user-avatar');
    const nameEl = document.getElementById('dash-user-name');
    const rolePillEl = document.getElementById('dash-user-role');

    if (avatarEl) avatarEl.src = user.avatar;
    if (nameEl) nameEl.textContent = user.name;
    if (rolePillEl) rolePillEl.textContent = user.role.toUpperCase();
  },

  renderRoleSwitcherBar(activeRole) {
    const container = document.getElementById('role-switcher-container');
    if (!container) return;

    const roles = [
      { key: 'admin', label: 'Admin View' },
      { key: 'manager', label: 'Manager View' },
      { key: 'staff', label: 'Staff View' },
      { key: 'guest', label: 'Guest View' }
    ];

    container.innerHTML = roles.map(r => `
      <button class="role-switch-btn ${r.key === activeRole ? 'active' : ''}" onclick="AuthController.switchRole('${r.key}')">
        ${r.label}
      </button>
    `).join('');
  },

  renderSidebarNav(role) {
    const navEl = document.getElementById('dash-sidebar-nav');
    if (!navEl) return;

    let navItems = [];

    if (role === 'admin') {
      navItems = [
        { label: 'Overview & Analytics', icon: 'fa-chart-pie', id: 'tab-overview' },
        { label: 'Property Portfolio', icon: 'fa-hotel', id: 'tab-portfolio' },
        { label: 'Financial Audits', icon: 'fa-vault', id: 'tab-financials' },
        { label: 'System Permissions', icon: 'fa-user-shield', id: 'tab-security' }
      ];
    } else if (role === 'manager') {
      navItems = [
        { label: 'Room Availability Matrix', icon: 'fa-bed', id: 'tab-rooms' },
        { label: 'Occupancy & Revenue', icon: 'fa-chart-line', id: 'tab-revenue' },
        { label: 'Staff Roster & Shifts', icon: 'fa-users', id: 'tab-roster' },
        { label: 'Guest Escalations', icon: 'fa-bell', id: 'tab-escalations' }
      ];
    } else if (role === 'staff') {
      navItems = [
        { label: 'Housekeeping Tasks', icon: 'fa-broom', id: 'tab-housekeeping' },
        { label: 'Maintenance Log', icon: 'fa-wrench', id: 'tab-maintenance' },
        { label: 'Room Service Queue', icon: 'fa-concierge-bell', id: 'tab-roomservice' }
      ];
    } else {
      // Guest
      navItems = [
        { label: 'My Reservation', icon: 'fa-suitcase', id: 'tab-mybooking' },
        { label: 'Digital Room Key', icon: 'fa-key', id: 'tab-digitalkey' },
        { label: 'Order Room Service', icon: 'fa-utensils', id: 'tab-orderfood' },
        { label: 'Concierge Request', icon: 'fa-headset', id: 'tab-concierge' }
      ];
    }

    navEl.innerHTML = `
      <div class="dash-nav-title">${role.toUpperCase()} CONSOLE</div>
      ${navItems.map((item, idx) => `
        <a class="dash-nav-link ${idx === 0 ? 'active' : ''}" onclick="DashboardController.switchTab(this, '${item.id}')">
          <i class="fa-solid ${item.icon}"></i>
          <span>${item.label}</span>
        </a>
      `).join('')}
    `;
  },

  switchTab(element, tabId) {
    document.querySelectorAll('.dash-nav-link').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    
    const dashSidebar = document.getElementById('dash-sidebar') || document.querySelector('.dash-sidebar');
    const dashBackdrop = document.querySelector('.dash-sidebar-backdrop');
    if (dashSidebar) dashSidebar.classList.remove('open');
    if (dashBackdrop) dashBackdrop.classList.remove('active');
    
    const tabPanels = document.querySelectorAll('.dash-tab-panel');
    if (tabPanels.length > 0) {
      tabPanels.forEach(panel => {
        if (panel.id === tabId) {
          panel.style.display = 'block';
          panel.classList.add('active-panel');
        } else {
          panel.style.display = 'none';
          panel.classList.remove('active-panel');
        }
      });
    }

    const mainScroll = document.querySelector('.dash-main');
    if (mainScroll) mainScroll.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const label = element.querySelector('span') ? element.querySelector('span').textContent : tabId;
    Toast.show("Console View", `Loaded ${label} section`, "info", 1500);
  },

  renderMainContent(user) {
    const mainEl = document.getElementById('dash-main-content');
    if (!mainEl) return;

    if (user.role === 'admin') {
      this.renderAdminDashboard(mainEl);
    } else if (user.role === 'manager') {
      this.renderManagerDashboard(mainEl);
    } else if (user.role === 'staff') {
      this.renderStaffDashboard(mainEl);
    } else {
      this.renderGuestDashboard(mainEl);
    }
  },

  renderAdminDashboard(container) {
    const m = AuraMockData.metrics;

    container.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-info">
            <h6>Monthly Revenue</h6>
            <div class="stat-value">$${m.monthlyRevenue.toLocaleString()}</div>
            <div class="stat-trend up"><i class="fa-solid fa-arrow-trend-up"></i> +14.2% vs last month</div>
          </div>
          <div class="stat-icon-wrapper"><i class="fa-solid fa-sack-dollar"></i></div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <h6>Portfolio Occupancy</h6>
            <div class="stat-value">${m.occupancyRate}%</div>
            <div class="stat-trend up"><i class="fa-solid fa-arrow-trend-up"></i> +3.1% YoY</div>
          </div>
          <div class="stat-icon-wrapper"><i class="fa-solid fa-chart-line"></i></div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <h6>RevPAR Average</h6>
            <div class="stat-value">$${m.revPAR}</div>
            <div class="stat-trend up"><i class="fa-solid fa-arrow-trend-up"></i> +8.5%</div>
          </div>
          <div class="stat-icon-wrapper"><i class="fa-solid fa-bed"></i></div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <h6>Guest Satisfaction</h6>
            <div class="stat-value">${m.guestSatisfactionScore}%</div>
            <div class="stat-trend up"><i class="fa-solid fa-star"></i> Outstanding</div>
          </div>
          <div class="stat-icon-wrapper"><i class="fa-solid fa-face-smile"></i></div>
        </div>
      </div>

      <div class="dash-card">
        <div class="dash-card-header">
          <h3 class="dash-card-title">Portfolio Revenue & Occupancy Trends (Q1 - Q3 2026)</h3>
          <button class="btn-aura btn-sm btn-outline-gold" onclick="DashboardController.downloadReport()"><i class="fa-solid fa-download"></i> Export Report</button>
        </div>
        <div style="height: 320px;">
          <canvas id="adminRevenueChart"></canvas>
        </div>
      </div>

      <div class="dash-card">
        <div class="dash-card-header">
          <h3 class="dash-card-title">System Audit & Governance Log</h3>
          <span class="badge-status badge-occupied">Live Feed</span>
        </div>
        <table class="table-aura">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Executive User</th>
              <th>System Action</th>
            </tr>
          </thead>
          <tbody>
            ${AuraMockData.auditLogs.map(log => `
              <tr>
                <td><strong>${log.time}</strong></td>
                <td>${log.user}</td>
                <td>${log.action}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    setTimeout(() => this.initAdminChart(), 100);
  },

  initAdminChart() {
    const ctx = document.getElementById('adminRevenueChart');
    if (!ctx) return;

    if (this.currentChart) this.currentChart.destroy();

    this.currentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
          {
            label: 'Revenue ($)',
            data: [980000, 1050000, 1120000, 1250000, 1380000, 1420000, 1510000, 1490000, 1482900],
            borderColor: '#C5A059',
            backgroundColor: 'rgba(197, 160, 89, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 3
          },
          {
            label: 'Occupancy Rate (%)',
            data: [85, 88, 90, 92, 95, 96, 98, 95, 94.2],
            borderColor: '#0D9488',
            backgroundColor: 'transparent',
            tension: 0.35,
            borderWidth: 2,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#64748B', font: { family: 'Plus Jakarta Sans' } } }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(15, 23, 42, 0.05)' } }
        }
      }
    });
  },

  renderManagerDashboard(container) {
    container.innerHTML = `
      <div class="dash-card">
        <div class="dash-card-header">
          <h3 class="dash-card-title">Live Room Status Matrix (Grand Vista Resort)</h3>
          <button class="btn-aura btn-sm btn-gold" onclick="DashboardController.showAddRoomModal()"><i class="fa-solid fa-plus"></i> Assign Room</button>
        </div>
        <table class="table-aura">
          <thead>
            <tr>
              <th>Room</th>
              <th>Category</th>
              <th>Current Guest</th>
              <th>Check-Out</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${AuraMockData.roomInventory.map((r, idx) => {
              let badgeClass = 'badge-available';
              if (r.status === 'Occupied') badgeClass = 'badge-occupied';
              if (r.status === 'Cleaning') badgeClass = 'badge-cleaning';
              if (r.status === 'Maintenance') badgeClass = 'badge-maintenance';

              return `
                <tr>
                  <td><strong>${r.roomNumber}</strong></td>
                  <td>${r.category}</td>
                  <td>${r.guestName}</td>
                  <td>${r.checkOut}</td>
                  <td><span class="badge-status ${badgeClass}">${r.status}</span></td>
                  <td>
                    <button class="btn-aura btn-sm btn-outline-gold" onclick="DashboardController.toggleRoomStatus(${idx})">Change Status</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  toggleRoomStatus(index) {
    const room = AuraMockData.roomInventory[index];
    const statuses = ['Available', 'Occupied', 'Cleaning', 'Maintenance'];
    const currentIdx = statuses.indexOf(room.status);
    const nextStatus = statuses[(currentIdx + 1) % statuses.length];

    room.status = nextStatus;
    Toast.show("Room Status Updated", `${room.roomNumber} marked as ${nextStatus}`, "success");
    this.initView();
  },

  renderStaffDashboard(container) {
    container.innerHTML = `
      <div class="dash-card">
        <div class="dash-card-header">
          <h3 class="dash-card-title">Housekeeping & Room Preparation Checklist</h3>
          <button class="btn-aura btn-sm btn-teal" onclick="DashboardController.showNewTaskModal()"><i class="fa-solid fa-plus"></i> Log Task</button>
        </div>
        <div id="staff-checklist-wrapper">
          ${AuraMockData.housekeepingTasks.map(task => `
            <div class="task-item ${task.status === 'Completed' ? 'completed' : ''}" id="task-${task.id}">
              <input type="checkbox" class="task-checkbox" ${task.status === 'Completed' ? 'checked' : ''} onchange="DashboardController.toggleTask('${task.id}')">
              <div style="flex-grow: 1;">
                <strong>${task.room} - ${task.type}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Assigned: ${task.assignedTo} • Priority: ${task.priority}</div>
              </div>
              <span class="badge-status ${task.status === 'Completed' ? 'badge-occupied' : 'badge-cleaning'}">${task.status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  toggleTask(taskId) {
    const task = AuraMockData.housekeepingTasks.find(t => t.id === taskId);
    if (task) {
      task.status = task.status === 'Completed' ? 'In Progress' : 'Completed';
      Toast.show("Task Updated", `Task for ${task.room} set to ${task.status}`, "info");
      this.initView();
    }
  },

  renderGuestDashboard(container) {
    const b = AuraMockData.guestBookings[0];

    container.innerHTML = `
      <div class="dash-card">
        <div class="dash-card-header">
          <h3 class="dash-card-title">Active VIP Reservation</h3>
          <span class="badge-status badge-occupied">${b.status}</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
          <div>
            <h4 style="font-size: 1.4rem; color: var(--brand-navy); margin-bottom: 0.5rem;">${b.propertyName}</h4>
            <p style="color: var(--text-muted);"><i class="fa-solid fa-location-dot"></i> ${b.location}</p>
            <div style="margin-top: 1rem;">
              <strong>Check-In:</strong> ${b.checkIn}<br>
              <strong>Check-Out:</strong> ${b.checkOut}
            </div>
          </div>
          <div style="background: var(--brand-navy); color: #FFF; padding: 1.5rem; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--brand-gold);">
            <i class="fa-solid fa-key" style="font-size: 2.5rem; color: var(--brand-gold); margin-bottom: 0.75rem;"></i>
            <h5>Digital Room Key Active</h5>
            <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-bottom: 1rem;">Hold smartphone near Villa 101 NFC Lock</p>
            <button class="btn-aura btn-gold btn-sm" onclick="Toast.show('NFC Sensor Active', 'Villa 101 unlocked successfully!', 'success')">Unlock Door Now</button>
          </div>
        </div>
      </div>
    `;
  },

  downloadReport() {
    Toast.show("Report Generated", "Downloading Q3 Financial & Operations Audit PDF...", "success");
  }
};

window.DashboardController = DashboardController;

document.addEventListener('DOMContentLoaded', () => {
  DashboardController.syncSessionUser();
});
