/**
 * Aoki Beauty Clinic — Main JavaScript
 * スクロールリビール / カウンター / ヘッダー / ドロワー / ドラッグスクロール / モバイルCTA / トラッキング
 */
(function () {
  'use strict';

  /* ── Tracking helpers (既存 tracking-config.js と連携) ── */
  var config = window.lpTrackingConfig || {};
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  /* GTM */
  if (config.gtmId) {
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(config.gtmId);
    document.head.appendChild(gtmScript);

    var noscriptFrame = document.getElementById('gtm-noscript');
    if (noscriptFrame) {
      noscriptFrame.src = 'https://www.googletagmanager.com/ns.html?id=' + encodeURIComponent(config.gtmId);
    }
  }

  /* GA4 + Google Ads */
  var hasGtag = Boolean(config.ga4Id || config.googleAdsId);
  if (hasGtag) {
    var idForSrc = config.ga4Id || config.googleAdsId;
    var gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(idForSrc);
    document.head.appendChild(gtagScript);
    gtag('js', new Date());
    if (config.ga4Id) gtag('config', config.ga4Id);
    if (config.ga4SecondaryId) gtag('config', config.ga4SecondaryId);
    if (config.googleAdsId) gtag('config', config.googleAdsId);
  }

  /* Meta Pixel */
  if (config.metaPixelId) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js'));
    window.fbq('init', config.metaPixelId);
    window.fbq('track', 'PageView');
  }

  function trackEvent(name, params) {
    var payload = Object.assign({ event: name, page_type: 'corporate' }, params || {});
    window.dataLayer.push(payload);
    if (window.gtag) gtag('event', name, payload);
  }

  function trackConversion(kind) {
    var labelMap = { web: config.googleAdsWebLabel, tel: config.googleAdsTelLabel, line: config.googleAdsLineLabel };
    var label = labelMap[kind];
    if (config.googleAdsId && label && window.gtag) {
      gtag('event', 'conversion', { send_to: config.googleAdsId + '/' + label, value: 1, currency: 'JPY' });
    }
    if (window.fbq) window.fbq('track', 'Lead', { source: kind });
  }

  /* data-track / data-conversion click binding */
  document.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () {
      trackEvent(el.getAttribute('data-track'), {
        cta_text: (el.textContent || '').trim().substring(0, 80),
        cta_type: el.getAttribute('data-conversion') || 'none'
      });
      var conversion = el.getAttribute('data-conversion');
      if (conversion) trackConversion(conversion);
    });
  });

  trackEvent('page_view');

  /* ── Reduced motion check ── */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll Reveal (IntersectionObserver) ── */
  if (!prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal], [data-reveal-left], [data-reveal-right]').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* Reduced motion: show everything immediately */
    document.querySelectorAll('[data-reveal], [data-reveal-left], [data-reveal-right]').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── Number Counter Animation ── */
  function animateCount(el, target, duration) {
    if (isNaN(target)) return;
    if (!duration || duration <= 0) {
      el.textContent = target.toLocaleString();
      return;
    }
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (!isNaN(target)) {
          animateCount(el, target, prefersReducedMotion ? 0 : 2000);
        }
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(function (el) {
    countObserver.observe(el);
  });

  /* ── Header scroll behavior ── */
  var header = document.getElementById('header');
  var lastScrollY = 0;

  function handleHeaderScroll() {
    var scrollY = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', scrollY > 60);
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ── Hamburger & Drawer ── */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('mobile-drawer');
  var _lang = (document.documentElement.lang || 'ja').slice(0, 2);
  var MENU_LABEL = {
    open:  { ja: 'メニューを開く', en: 'Open menu',  zh: '打开菜单' },
    close: { ja: 'メニューを閉じる', en: 'Close menu', zh: '关闭菜单' }
  };
  function _menuLabel(k) { return MENU_LABEL[k][_lang] || MENU_LABEL[k].ja; }

  function openDrawer() {
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', _menuLabel('close'));
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', _menuLabel('open'));
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var isOpen = drawer.classList.contains('is-open');
      isOpen ? closeDrawer() : openDrawer();
    });

    var overlay = drawer.querySelector('.drawer__overlay');
    if (overlay) {
      overlay.addEventListener('click', closeDrawer);
    }

    /* Close on nav link click */
    drawer.querySelectorAll('.drawer__nav a').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    /* Escape key closes drawer */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
        burger.focus();
      }
    });
  }

  /* ── Fixed CTA (mobile bottom bar / PC 追従サイドCTA) show/hide on scroll ── */
  var mobileCta = document.getElementById('mobile-cta');
  var sideCta = document.getElementById('side-cta');
  /* トップは #hero、下層ページは .page-hero を基準にする */
  var ctaAnchor = document.getElementById('hero') || document.querySelector('.page-hero');

  if (mobileCta || sideCta) {
    if (ctaAnchor) {
      var ctaObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          /* ヒーローが見えなくなったら追従CTAを表示 */
          var show = !entry.isIntersecting;
          if (mobileCta) mobileCta.classList.toggle('is-visible', show);
          if (sideCta) sideCta.classList.toggle('is-visible', show);
        });
      }, { threshold: 0 });

      ctaObserver.observe(ctaAnchor);
    } else {
      /* 基準要素が無いページ：一定量スクロールしたら表示 */
      var onScrollCta = function () {
        var show = window.pageYOffset > 400;
        if (mobileCta) mobileCta.classList.toggle('is-visible', show);
        if (sideCta) sideCta.classList.toggle('is-visible', show);
      };
      window.addEventListener('scroll', onScrollCta, { passive: true });
      onScrollCta();
    }
  }

  /* ── Drag Scroll for horizontal containers ── */
  function enableDragScroll(container) {
    var isDown = false;
    var startX;
    var scrollLeft;

    container.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDown = true;
      container.classList.add('is-dragging');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', function () {
      isDown = false;
      container.classList.remove('is-dragging');
    });

    container.addEventListener('mouseup', function () {
      isDown = false;
      container.classList.remove('is-dragging');
    });

    container.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - container.offsetLeft;
      var walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    });
  }

  /* Cases Preview scroll */
  var casesScroll = document.getElementById('cases-scroll');
  if (casesScroll) enableDragScroll(casesScroll);

  /* Cases Preview: Nav arrows (scroll by one card width) */
  var prevBtn = document.querySelector('.cases-preview__nav--prev');
  var nextBtn = document.querySelector('.cases-preview__nav--next');
  if (casesScroll && prevBtn && nextBtn) {
    var getCardWidth = function() {
      var card = casesScroll.querySelector('.case-preview-card');
      return card ? card.offsetWidth + 24 : 360;
    };
    prevBtn.addEventListener('click', function() {
      casesScroll.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function() {
      casesScroll.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    });
  }

  /* Cases Preview: SP tap toggle (Before/After) */
  if (!window.matchMedia('(hover: hover)').matches) {
    var isZh = document.documentElement.lang === 'zh' || document.documentElement.lang === 'zh-CN' || document.documentElement.lang === 'zh-Hans';
    var labelBefore = isZh ? '术前' : 'Before';
    var labelAfter = isZh ? '术后' : 'After';

    document.querySelectorAll('[data-case-toggle]').forEach(function(card) {
      var showingAfter = false;

      card.addEventListener('click', function(e) {
        var afterPic = this.querySelector('.case-preview-card__pic--after');
        var label = this.querySelector('.case-preview-card__label');

        if (!showingAfter) {
          afterPic.style.opacity = '1';
          label.textContent = labelAfter;
          showingAfter = true;
          e.preventDefault();
        } else {
          afterPic.style.opacity = '0';
          label.textContent = labelBefore;
          showingAfter = false;
        }
      });
    });
  }

  /* Cases Preview: PC hover label toggle */
  if (window.matchMedia('(hover: hover)').matches) {
    var isZhPc = document.documentElement.lang === 'zh' || document.documentElement.lang === 'zh-CN' || document.documentElement.lang === 'zh-Hans';
    var lblBefore = isZhPc ? '术前' : 'Before';
    var lblAfter = isZhPc ? '术后' : 'After';

    document.querySelectorAll('[data-case-toggle]').forEach(function(card) {
      var label = card.querySelector('.case-preview-card__label');
      card.addEventListener('mouseenter', function() {
        label.textContent = lblAfter;
      });
      card.addEventListener('mouseleave', function() {
        label.textContent = lblBefore;
      });
    });
  }

  /* Instagram feed scroll */
  var instagramFeed = document.getElementById('instagram-feed');
  if (instagramFeed) enableDragScroll(instagramFeed);

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  /* ── Menu page: scroll-spy for category nav tabs ── */
  var menuNav = document.getElementById('menu-nav');
  if (menuNav) {
    var menuTabs = menuNav.querySelectorAll('.menu-nav__tab');
    var menuSections = [];
    menuTabs.forEach(function (tab) {
      var href = tab.getAttribute('href');
      if (href && href.charAt(0) === '#') {
        var sec = document.getElementById(href.substring(1));
        if (sec) menuSections.push({ el: sec, tab: tab });
      }
    });

    if (menuSections.length) {
      var menuSpyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            menuTabs.forEach(function (t) { t.classList.remove('is-active'); });
            menuSections.forEach(function (item) {
              if (item.el === entry.target) item.tab.classList.add('is-active');
            });
          }
        });
      }, { threshold: 0.15, rootMargin: '-20% 0px -60% 0px' });

      menuSections.forEach(function (item) {
        menuSpyObserver.observe(item.el);
      });
    }

    /* Sticky class for menu nav */
    var menuHero = document.querySelector('.page-hero');
    if (menuHero) {
      var menuStickyObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          menuNav.classList.toggle('is-sticky', !entry.isIntersecting);
        });
      }, { threshold: 0 });
      menuStickyObs.observe(menuHero);
    }
  }

}());
