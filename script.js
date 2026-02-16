// Toggle sidebar expand/collapse (desktop) / overlay (mobile)
(function () {
  var toggle = document.getElementById('index-toggle');
  var wrapper = document.getElementById('sidebar-wrapper');
  var nav = wrapper && wrapper.querySelector('.sidebar-nav');
  if (!toggle || !wrapper) return;

  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function closeOverlay() {
    wrapper.classList.remove('overlay-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (isMobile()) toggle.setAttribute('aria-label', 'Open menu');
  }

  function openOverlay() {
    wrapper.classList.add('overlay-open');
    toggle.setAttribute('aria-expanded', 'true');
    if (isMobile()) toggle.setAttribute('aria-label', 'Close menu');
  }

  toggle.addEventListener('click', function () {
    if (isMobile()) {
      var isOpen = wrapper.classList.toggle('overlay-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
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

  // Close overlay when resizing to desktop
  window.addEventListener('resize', function () {
    if (!isMobile() && wrapper.classList.contains('overlay-open')) {
      closeOverlay();
    }
  });
})();
