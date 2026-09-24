/**
 * Jasmine Theme — Main Interactions
 * Based on BlueSun (huang-jerryc.com) behavior
 */

(function () {
  'use strict';

  // ── TOC Scroll Position ──
  function initTOC() {
    var toc = document.getElementById('toc');
    if (!toc) return;

    var tocTop = toc.getBoundingClientRect().top + window.pageYOffset;
    var tocHeight = toc.offsetHeight;

    function onScroll() {
      var scrollY = window.pageYOffset;
      if (scrollY > tocTop - 20) {
        toc.classList.add('fixed');
        toc.style.top = '20px';
      } else {
        toc.classList.remove('fixed');
      }
    }

    window.addEventListener('scroll', onScroll);

    // TOC link active state
    var tocLinks = toc.querySelectorAll('.toc-link');
    if (tocLinks.length === 0) return;

    var headings = [];
    tocLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        var id = href.substring(1);
        var el = document.getElementById(id);
        if (el) headings.push({ el: el, link: link });
      }
    });

    function updateActive() {
      var scrollY = window.pageYOffset + 100;
      var current = null;
      headings.forEach(function (item) {
        if (item.el.offsetTop <= scrollY) {
          current = item;
        }
      });

      tocLinks.forEach(function (link) {
        link.classList.remove('active');
      });
      if (current) {
        current.link.classList.add('active');
      }
    }

    window.addEventListener('scroll', updateActive);
  }

  // ── Back to Top ──
  function initBackTop() {
    var backTop = document.getElementById('backTop');
    if (!backTop) return;

    function toggle() {
      if (window.pageYOffset > 300) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    }

    window.addEventListener('scroll', toggle);

    backTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initial state
    toggle();
  }

  // ── Mobile Modal ──
  function initModal() {
    var mobileBtn = document.getElementById('toolbox-mobile');
    var modal = document.getElementById('modal');
    var cover = document.getElementById('cover');
    var closeBtn = document.getElementById('close');
    var dialog = document.getElementById('modal-dialog');

    if (!mobileBtn || !modal) return;

    mobileBtn.addEventListener('click', function () {
      cover.classList.remove('hide');
      dialog.classList.remove('hide-dialog');
      dialog.classList.add('show-dialog');
    });

    function hideModal() {
      cover.classList.add('hide');
      dialog.classList.remove('show-dialog');
      dialog.classList.add('hide-dialog');
    }

    if (cover) cover.addEventListener('click', hideModal);
    if (closeBtn) closeBtn.addEventListener('click', hideModal);
  }

  // ── Smooth scroll for anchor links ──
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href').substring(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ── Init all ──
  document.addEventListener('DOMContentLoaded', function () {
    initTOC();
    initBackTop();
    initModal();
    initSmoothScroll();
  });
})();
