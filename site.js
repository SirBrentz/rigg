/* ============================================================
   RIGG — shared site JS
   ============================================================ */
(function () {
  'use strict';

  // ─── Nav: scroll shadow ────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 8) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─── Mega menu dropdown ────────────────────────────────
  // Hover opens on desktop, click/tap toggles (works everywhere).
  document.querySelectorAll('.nav__item[data-dropdown]').forEach(item => {
    const trigger = item.querySelector('.nav__link');
    const isDesktop = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // click toggles
    trigger?.addEventListener('click', e => {
      e.preventDefault();
      const open = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(open));
    });

    // hover on desktop
    let hoverTimer;
    item.addEventListener('mouseenter', () => {
      if (!isDesktop()) return;
      clearTimeout(hoverTimer);
      item.classList.add('is-open');
      trigger?.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('mouseleave', () => {
      if (!isDesktop()) return;
      hoverTimer = setTimeout(() => {
        item.classList.remove('is-open');
        trigger?.setAttribute('aria-expanded', 'false');
      }, 140);
    });
  });

  // click outside closes all dropdowns
  document.addEventListener('click', e => {
    document.querySelectorAll('.nav__item.is-open').forEach(item => {
      if (!item.contains(e.target)) {
        item.classList.remove('is-open');
        item.querySelector('.nav__link')?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ─── Earnings calculator (landing page) ────────────────
  const slider = document.getElementById('calcSlider');
  const calcVal = document.getElementById('calcVal');
  const calcMonth = document.getElementById('calcMonth');
  const calcYear = document.getElementById('calcYear');

  if (slider && calcVal && calcMonth && calcYear) {
    const fmt = n => '$' + Math.round(n).toLocaleString();
    const paint = () => {
      const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.background =
        `linear-gradient(to right, #E44818 0%, #E44818 ${pct}%, rgba(239,233,220,0.15) ${pct}%, rgba(239,233,220,0.15) 100%)`;
    };
    const update = () => {
      const v = +slider.value;
      calcVal.textContent = fmt(v);
      // gross earnings estimate: ~7.5% monthly utilization of tool value at typical day rate
      const monthGross = v * 0.075;
      const monthNet = monthGross * 0.88; // after 12% fee
      calcMonth.innerHTML = fmt(monthNet) + '<small>/mo</small>';
      calcYear.innerHTML = fmt(monthNet * 12) + '<small>/yr</small>';
      paint();
    };
    slider.addEventListener('input', update);
    update();
  }

  // ─── Listing page: surprise-me badge ───────────────────
  const params = new URLSearchParams(window.location.search);
  if (params.get('surprise') === '1') {
    const badge = document.getElementById('galleryBadge');
    const badgeText = document.getElementById('badgeText');
    if (badge && badgeText) {
      badge.classList.add('gallery__badge--surprise');
      badgeText.textContent = '🎲 Surprise pick';
    }
  }

  // ─── Browse page: price range label ────────────────────
  const priceRange = document.getElementById('priceRange');
  const priceMax = document.getElementById('priceMax');
  if (priceRange && priceMax) {
    const paintRange = () => {
      const pct = ((priceRange.value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
      priceRange.style.background =
        `linear-gradient(to right, #E44818 0%, #E44818 ${pct}%, #D9D1BD ${pct}%, #D9D1BD 100%)`;
    };
    const onPrice = () => {
      priceMax.textContent = 'Up to $' + priceRange.value;
      paintRange();
    };
    priceRange.addEventListener('input', onPrice);
    onPrice();
  }

  // ─── Browse page: mobile filter drawer ─────────────────
  const filterToggle = document.getElementById('filterToggle');
  const filters = document.getElementById('filters');
  if (filterToggle && filters) {
    filterToggle.addEventListener('click', () => {
      filters.classList.toggle('is-open');
    });
    // close on outside click (mobile only)
    document.addEventListener('click', e => {
      if (!filters.classList.contains('is-open')) return;
      if (window.innerWidth > 720) return;
      if (!filters.contains(e.target) && e.target !== filterToggle && !filterToggle.contains(e.target)) {
        filters.classList.remove('is-open');
      }
    });
  }

  // ─── Active chip remove (browse page) ──────────────────
  document.querySelectorAll('.active-chip button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      btn.closest('.active-chip')?.remove();
    });
  });

  // ─── Gallery thumbnail switching (listing page) ────────
  const thumbs = document.querySelectorAll('.gallery__thumb');
  thumbs.forEach(t => {
    t.addEventListener('click', () => {
      thumbs.forEach(x => x.classList.remove('is-active'));
      t.classList.add('is-active');
    });
  });

  // ─── Hero search chip click → fill input ───────────────
  const heroSearch = document.getElementById('heroSearch');
  if (heroSearch) {
    document.querySelectorAll('.chip:not(.chip--ghost)').forEach(chip => {
      chip.addEventListener('click', e => {
        // preserve navigation but also fill the input as feedback
        const text = chip.textContent.trim();
        heroSearch.value = text;
      });
    });
  }

})();
