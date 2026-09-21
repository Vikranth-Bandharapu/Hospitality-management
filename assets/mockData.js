/* ==========================================================================
   AURA HOSPITALITY MANAGEMENT - MOCK DATA REPOSITORY
   Fictional, Production-Grade Data for Resorts, Rooms, Metrics, & Roles
   ========================================================================== */

const AuraMockData = {
  // Brand Info
  brand: {
    name: "Aura Hospitality Group",
    tagline: "Ultra-Luxe Property & Resort Management",
    founded: 2014,
    propertiesManaged: 34,
    globalLocations: 12
  },

  // Fictional Demo Users / Roles
  users: {
    admin: {
      name: "Eleanor Vance",
      role: "admin",
      title: "Chief Executive Officer & Owner",
      email: "admin@aurahospitality.com",
      avatar: "assets/avatar-admin.webp",
      permissions: ["Full Access", "Financial Audit", "User Provisioning", "System Config"]
    },
    manager: {
      name: "Marcus Sterling",
      role: "manager",
      title: "General Manager - Grand Vista Resort",
      email: "manager@grandvista.com",
      avatar: "assets/avatar-manager.webp",
      permissions: ["Property Operations", "Staff Scheduling", "Rate Management", "Guest Reports"]
    },
    staff: {
      name: "Sophia Martinez",
      role: "staff",
      title: "Head of Housekeeping & Operations",
      email: "housekeeping@grandvista.com",
      avatar: "assets/avatar-staff.webp",
      permissions: ["Task Toggling", "Room Status Update", "Maintenance Logging"]
    },
    guest: {
      name: "Lord Harrison Blake",
      role: "guest",
      title: "VIP Platinum Patron",
      email: "guest@aurahospitality.com",
      avatar: "assets/avatar-guest.webp",
      permissions: ["View Bookings", "Request Services", "Digital Key"]
    }
  },

  // Fictional Properties & Rooms
  properties: [
    {
      id: "prop-01",
      name: "Presidential Ocean Villa",
      type: "Villa",
      location: "Maldives Atoll",
      pricePerNight: 2850,
      rating: 4.98,
      reviewsCount: 142,
      capacity: "6 Guests • 3 Bedrooms • Infinity Pool",
      image: "assets/villa-presidential.webp",
      badge: "Signature Collection",
      featured: true,
      amenities: ["Private Butler", "Infinity Pool", "Helipad Access", "Sub-Ocean Dining", "Spa Suite"],
      description: "Overwater architectural masterpiece featuring panoramic floor-to-ceiling glass, private glass-bottom pool deck, and 24/7 dedicated butler service."
    },
    {
      id: "prop-02",
      name: "Royal Skyline Penthouse",
      type: "Penthouse",
      location: "Dubai Marina",
      pricePerNight: 1950,
      rating: 4.95,
      reviewsCount: 98,
      capacity: "4 Guests • 2 Bedrooms • Private Spa",
      image: "assets/suite-royal.webp",
      badge: "Skyline Luxe",
      featured: true,
      amenities: ["Private Jacuzzi", "Chauffeur Service", "Private Bar", "Smart Home Automation"],
      description: "Dual-level sky penthouse perched on the 64th floor with 360-degree cityscape vistas and private temperature-controlled rooftop infinity pool."
    },
    {
      id: "prop-03",
      name: "Executive Balcony Suite",
      type: "Suite",
      location: "Swiss Alps, St. Moritz",
      pricePerNight: 1200,
      rating: 4.92,
      reviewsCount: 115,
      capacity: "2 Guests • 1 Bedroom • Mountain View",
      image: "assets/suite-executive.webp",
      badge: "Winter Haven",
      featured: true,
      amenities: ["Fireplace", "Ski-in / Ski-out", "Thermal Bath", "Wine Cellar Access"],
      description: "Cozy refined luxury crafted with reclaimed alpine oak, fireplace, private balcony overlooking snow-capped peaks, and direct ski access."
    },
    {
      id: "prop-04",
      name: "Deluxe Oceanfront Haven",
      type: "Deluxe Room",
      location: "Santorini, Greece",
      pricePerNight: 780,
      rating: 4.88,
      reviewsCount: 204,
      capacity: "2 Guests • 1 King Bed • Caldera Sunset View",
      image: "assets/room-deluxe.webp",
      badge: "Caldera View",
      featured: false,
      amenities: ["Plunge Pool", "Artisanal Breakfast", "Sunset Deck", "Marble Bathroom"],
      description: "Cliffside whitewashed retreat featuring handcrafted stone furniture, private plunge pool, and unhindered view of Aegean sunsets."
    }
  ],

  // Admin & Manager Metrics
  metrics: {
    occupancyRate: 94.2,
    revPAR: 642.50,
    monthlyRevenue: 1482900,
    activeBookings: 184,
    staffOnDuty: 48,
    guestSatisfactionScore: 98.6
  },

  // Manager Room Inventory Grid Status
  roomInventory: [
    { roomNumber: "Villa 101", category: "Presidential Villa", guestName: "Lord Harrison Blake", status: "Occupied", checkOut: "2026-09-20" },
    { roomNumber: "Suite 402", category: "Executive Suite", guestName: "Dr. Aris Thorne", status: "Occupied", checkOut: "2026-09-18" },
    { roomNumber: "Suite 405", category: "Royal Penthouse", guestName: "-", status: "Cleaning", checkOut: "-" },
    { roomNumber: "Room 204", category: "Deluxe Room", guestName: "-", status: "Available", checkOut: "-" },
    { roomNumber: "Room 208", category: "Deluxe Room", guestName: "Lady Serena Finch", status: "Occupied", checkOut: "2026-09-22" },
    { roomNumber: "Suite 501", category: "Skyline Suite", guestName: "-", status: "Maintenance", checkOut: "-" }
  ],

  // Staff Housekeeping Checklist Tasks
  housekeepingTasks: [
    { id: "task-1", room: "Villa 101", type: "Turn-Down Service", priority: "High", assignedTo: "Sophia M.", status: "In Progress" },
    { id: "task-2", room: "Suite 405", type: "Deep Clean & Sanitization", priority: "Urgent", assignedTo: "Sophia M.", status: "Pending" },
    { id: "task-3", room: "Room 204", type: "Linen & Towel Refresh", priority: "Normal", assignedTo: "David K.", status: "Completed" },
    { id: "task-4", room: "Suite 501", type: "HVAC Inspection & Clean", priority: "High", assignedTo: "Engineering", status: "Pending" }
  ],

  // Guest Active Reservations & Orders
  guestBookings: [
    {
      bookingId: "AUR-89210",
      propertyName: "Presidential Ocean Villa",
      location: "Maldives Atoll",
      checkIn: "2026-09-15",
      checkOut: "2026-09-22",
      status: "Active Stay",
      totalPaid: 19950
    }
  ],

  // Recent Audit Logs
  auditLogs: [
    { time: "09:14 AM", user: "Eleanor Vance (Admin)", action: "Adjusted Season Q4 Room Rates (+8%)" },
    { time: "08:45 AM", user: "Marcus Sterling (GM)", action: "Approved Housekeeping Shift Schedule" },
    { time: "08:12 AM", user: "Sophia Martinez (Staff)", action: "Marked Room 204 as Clean & Ready" },
    { time: "07:30 AM", user: "System Auto-Sync", action: "Completed Daily Revenue & Tax Audit" }
  ]
};

// Freeze mock data object to prevent unintended mutations
Object.freeze(AuraMockData);
