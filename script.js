// Toggle sidebar expand/collapse (desktop) / overlay (mobile)
(function () {
  var toggle = document.getElementById('index-toggle');
  var wrapper = document.getElementById('sidebar-wrapper');
  var nav = wrapper && wrapper.querySelector('.sidebar-nav');
  if (!toggle || !wrapper) return;

  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  // Set initial accessible state on mobile (Index button, overlay closed)
  if (isMobile()) {
    toggle.setAttribute('aria-label', 'Open index');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function closeOverlay() {
    wrapper.classList.remove('overlay-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (isMobile()) toggle.setAttribute('aria-label', 'Open index');
  }

  function openOverlay() {
    wrapper.classList.add('overlay-open');
    toggle.setAttribute('aria-expanded', 'true');
    if (isMobile()) toggle.setAttribute('aria-label', 'Close index');
  }

  toggle.addEventListener('click', function () {
    if (isMobile()) {
      var isOpen = wrapper.classList.toggle('overlay-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close index' : 'Open index');
    } else {
      var isCollapsed = wrapper.classList.toggle('is-collapsed');
      toggle.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
    }
  });

  // Close overlay when a nav link is clicked (mobile)
  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && isMobile() && wrapper.classList.contains('overlay-open')) {
        closeOverlay();
      }
    });
  }

  // Clicking #top (site title) scrolls to first section so section title is visible
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href="#top"]');
    if (link) {
      e.preventDefault();
      var firstSection = document.querySelector('main section');
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo(0, 0);
      }
      if (isMobile() && wrapper.classList.contains('overlay-open')) {
        closeOverlay();
      }
    }
  });

  // Close overlay when resizing to desktop; sync Index button state when resizing to mobile
  window.addEventListener('resize', function () {
    if (!isMobile()) {
      if (wrapper.classList.contains('overlay-open')) closeOverlay();
    } else {
      var isOpen = wrapper.classList.contains('overlay-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close index' : 'Open index');
    }
  });
})();

// Lightbox for figure images
(function () {
  var overlay = null;
  var img = null;
  var closeBtn = null;
  var triggerElement = null;

  function create() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.setAttribute('aria-modal', 'true');
    overlay.hidden = true;

    closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close image viewer');
    closeBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';

    img = document.createElement('img');
    img.className = 'lightbox-img';
    img.alt = '';

    overlay.appendChild(closeBtn);
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    closeBtn.addEventListener('click', close);
  }

  function open(src, alt) {
    if (!overlay) create();
    img.src = src;
    img.alt = alt || '';
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    if (!overlay) return;
    overlay.hidden = true;
    img.src = '';
    document.body.style.overflow = '';
    if (triggerElement) {
      triggerElement.focus();
      triggerElement = null;
    }
  }

  document.addEventListener('click', function (e) {
    var target = e.target.closest('.img-figure img');
    if (!target) return;
    var fullSrc = target.getAttribute('data-full') || target.src;
    triggerElement = target;
    open(fullSrc, target.alt);
  });

  document.addEventListener('keydown', function (e) {
    if (overlay && !overlay.hidden) {
      if (e.key === 'Escape') {
        close();
        e.preventDefault();
      }
      // Trap focus inside overlay
      if (e.key === 'Tab') {
        closeBtn.focus();
        e.preventDefault();
      }
      return;
    }

    // Open lightbox when Enter/Space on a focused figure image
    if (e.key === 'Enter' || e.key === ' ') {
      var focused = document.activeElement;
      if (focused && focused.matches('.img-figure img')) {
        var fullSrc = focused.getAttribute('data-full') || focused.src;
        triggerElement = focused;
        open(fullSrc, focused.alt);
        e.preventDefault();
      }
    }
  });
})();
