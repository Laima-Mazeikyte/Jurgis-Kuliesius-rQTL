// Toggle sidebar expand/collapse (desktop) / overlay (mobile)
(function () {
  var toggle = document.getElementById('index-toggle');
  var wrapper = document.getElementById('sidebar-wrapper');
  var nav = wrapper && wrapper.querySelector('.sidebar-nav');
  if (!toggle || !wrapper) return;

  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  /** On mobile: scroll so the element sits with offsetFromTop px below the viewport top (breathing room). */
  function scrollToWithOffset(el, offsetFromTop) {
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - offsetFromTop;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
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

  // Sticky bar (44px) + 24px breathing room above section title (must match CSS scroll-margin on mobile)
  var MOBILE_SCROLL_OFFSET = 44 + 24;

  // Clicking #top (site title) scrolls to first section so section title is visible
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href="#top"]');
    if (link) {
      e.preventDefault();
      var firstSection = document.querySelector('main > section');
      if (firstSection) {
        if (isMobile()) {
          scrollToWithOffset(firstSection, MOBILE_SCROLL_OFFSET);
        } else {
          firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo(0, 0);
      }
      if (isMobile() && wrapper.classList.contains('overlay-open')) {
        closeOverlay();
      }
    }
  });

  // When clicking a Contents link: on mobile scroll with breathing room
  if (nav) {
    nav.addEventListener('click', function (e) {
      var anchor = e.target.closest('a[href^="#"]');
      if (!anchor || !anchor.hash) return;
      var id = anchor.hash.slice(1);
      if (id === 'top') return; // handled by site-title handler

      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      if (isMobile()) {
        scrollToWithOffset(target, MOBILE_SCROLL_OFFSET);
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.history.replaceState(null, '', anchor.hash);
      if (isMobile() && wrapper.classList.contains('overlay-open')) {
        closeOverlay();
      }
    });
  }

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

// Citation copy button: copy blockquote text to clipboard
(function () {
  var wrapper = document.querySelector('#about .citation-blockquote-wrapper');
  if (!wrapper) return;
  var blockquote = wrapper.querySelector('blockquote');
  var btn = wrapper.querySelector('.citation-copy-btn');
  if (!blockquote || !btn) return;

  function getCitationText() {
    var clone = blockquote.cloneNode(true);
    var btnClone = clone.querySelector('.citation-copy-btn');
    if (btnClone) btnClone.remove();
    return clone.textContent.trim();
  }
  var citationText = getCitationText();

  btn.addEventListener('click', function () {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }
    navigator.clipboard.writeText(citationText).then(
      function () {
        var label = btn.getAttribute('aria-label');
        btn.textContent = 'Copied!';
        btn.setAttribute('aria-label', 'Citation copied');
        setTimeout(function () {
          btn.textContent = 'Copy';
          if (label) btn.setAttribute('aria-label', label);
        }, 1500);
      },
      function () {}
    );
  });
})();

