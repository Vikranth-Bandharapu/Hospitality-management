/* ==========================================================================
   AURA HOSPITALITY MANAGEMENT - ANIMATIONS ENGINE
   GSAP 3.12 + ScrollTrigger Timelines & AOS 2.3.4 Scroll Reveal Setup
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Initialize AOS Engine
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: prefersReducedMotion ? 0 : 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: prefersReducedMotion
    });
  }

  // 2. GSAP ScrollTrigger Sequence (Skip if reduced motion)
  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    AuraAnimations.initGSAP();
  } else {
    // Basic fallback reveal
    document.querySelectorAll('.hero-content, .hero-subtitle, .hero-title').forEach(el => {
      el.style.opacity = '1';
    });
  }

  // 3. Counter Animation Trigger
  AuraAnimations.initCounters();
});

const AuraAnimations = {
  initGSAP() {
    // Hero Entrance Sequence
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

    heroTl
      .from('.hero-subtitle', { y: 30, opacity: 0, delay: 0.2 })
      .from('.hero-title', { y: 40, opacity: 0 }, '-=0.6')
      .from('.hero-desc', { y: 30, opacity: 0 }, '-=0.6')
      .from('.hero-booking-bar', { y: 50, opacity: 0 }, '-=0.4')
      .from('.hero-stat-badge', { scale: 0.8, opacity: 0, stagger: 0.15 }, '-=0.4');

    // Hero Parallax Background ScrollTrigger
    const heroBg = document.querySelector('.hero-parallax-bg');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section-aura',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Scroll-triggered section reveals
    gsap.utils.toArray('.gsap-card-reveal').forEach(card => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  },

  // Animated Number Counters for Performance Metrics
  initCounters() {
    const counterEls = document.querySelectorAll('[data-counter-target]');
    if (counterEls.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter-target'));
          const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
          const suffix = el.getAttribute('data-counter-suffix') || '';
          this.animateCounter(el, target, decimals, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => observer.observe(el));
  },

  animateCounter(el, target, decimals, suffix) {
    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = start.toFixed(decimals) + suffix;
    }, stepTime);
  }
};

window.AuraAnimations = AuraAnimations;
