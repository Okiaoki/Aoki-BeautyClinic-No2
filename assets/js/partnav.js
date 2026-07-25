/**
 * Aoki Beauty Clinic — Part Nav (FACE 年代タブ / BODY) ＋ 引き出し線
 *
 * ★線の位置調整はこの CONFIG の fx / fy（画像に対する％）だけ触ればOK。
 *   fx = 画像左端からの横％、fy = 画像上端からの縦％（線の先端＝部位の点）。
 *   side = 'left'（左カラムのピル）/ 'right'（右カラムのピル）。
 *   ピルの縦位置は配列順（上から）で決まる。
 *   画像・ピル・線はレスポンシブに再計算。SP(<768px)では線は非表示（CSS）。
 */
(function () {
  'use strict';

  var BASE = '../assets/img/';

  /* ラベル多言語対応（ja=既定／en／zh）。fx/fy・href は全言語共通なので触らない */
  var LANG = (document.documentElement.lang || 'ja').slice(0, 2);
  var I18N = {
    '10・20代': { en: 'Teens & 20s', zh: '10・20岁' },
    '30・40代': { en: '30s & 40s', zh: '30・40岁' },
    '50代以上': { en: '50s & Over', zh: '50岁以上' },
    '男性美容': { en: "Men's", zh: '男士美容' },
    '目元・二重': { en: 'Eyes & Double Eyelid', zh: '眼部・双眼皮' },
    '鼻・小鼻': { en: 'Nose', zh: '鼻部' },
    '口元・人中': { en: 'Mouth & Philtrum', zh: '唇部・人中' },
    '輪郭・小顔': { en: 'Face Contour', zh: '轮廓・小脸' },
    'アートメイク': { en: 'Art Makeup', zh: '半永久化妆' },
    '肌治療': { en: 'Skin Care', zh: '肌肤治疗' },
    '額・しわ': { en: 'Forehead & Lines', zh: '额头・皱纹' },
    '目の下・クマ': { en: 'Under-Eye Circles', zh: '眼下・黑眼圈' },
    'リフトアップ・たるみ': { en: 'Lift & Sagging', zh: '提升・松弛' },
    '注入・ヒアルロン酸': { en: 'Injectables', zh: '注射・玻尿酸' },
    '額・こめかみ': { en: 'Forehead & Temples', zh: '额头・太阳穴' },
    '目元（眼瞼下垂）': { en: 'Eyes (Ptosis)', zh: '眼部（上睑下垂）' },
    '肌・シミ': { en: 'Skin & Spots', zh: '肌肤・色斑' },
    '注入・ボリューム': { en: 'Volume Filler', zh: '注射・填充' },
    'ヒゲ脱毛': { en: 'Beard Removal', zh: '胡须脱毛' },
    '鼻': { en: 'Nose', zh: '鼻部' },
    'AGA・薄毛': { en: 'AGA & Hair Loss', zh: 'AGA・脱发' },
    '肌・ニキビ': { en: 'Skin & Acne', zh: '肌肤・痤疮' },
    '輪郭・エラ': { en: 'Contour & Jaw', zh: '轮廓・下颌角' },
    '多汗症・ワキガ': { en: 'Sweat & Odor', zh: '多汗症・狐臭' },
    'バスト': { en: 'Bust', zh: '胸部' },
    'タトゥー除去': { en: 'Tattoo Removal', zh: '纹身去除' },
    '痩身・脂肪吸引': { en: 'Slimming & Lipo', zh: '瘦身・吸脂' },
    'デリケートゾーン': { en: 'Intimate Care', zh: '私密护理' },
    '医療脱毛': { en: 'Hair Removal', zh: '医疗脱毛' }
  };
  function t(s) {
    if (LANG === 'ja') return s;
    var e = I18N[s];
    return e && e[LANG] ? e[LANG] : s;
  }

  var CONFIG = {
    face: {
      fallbackImg: BASE + 'partnav-face.webp',
      tabs: [
        {
          id: '1020', label: '10・20代', img: BASE + 'partnav-face.webp',
          parts: [
            { label: '目元・二重',        href: 'menu-eye.html',     side: 'left',  fx: 43, fy: 40 },
            { label: '鼻・小鼻',          href: 'menu-nose.html',    side: 'left',  fx: 49, fy: 51 },
            { label: '口元・人中',        href: 'menu-mouth.html',   side: 'left',  fx: 47, fy: 63 },
            { label: '輪郭・小顔',        href: 'menu-face.html',    side: 'left',  fx: 40, fy: 71 },
            { label: 'アートメイク',      href: 'menu-artmake.html', side: 'right', fx: 59, fy: 37 },
            { label: '肌治療',            href: 'menu-skin.html',    side: 'right', fx: 61, fy: 55 }
          ]
        },
        {
          id: '3040', label: '30・40代', img: BASE + 'partnav-face-3040.webp',
          parts: [
            { label: '額・しわ',          href: 'menu-forehead.html', side: 'left',  fx: 46, fy: 28 },
            { label: '目の下・クマ',      href: 'menu-undereye.html', side: 'left',  fx: 44, fy: 46 },
            { label: 'リフトアップ・たるみ', href: 'menu-lift.html',  side: 'left',  fx: 39, fy: 68 },
            { label: '肌治療',            href: 'menu-skin.html',     side: 'right', fx: 62, fy: 54 },
            { label: '注入・ヒアルロン酸', href: 'menu-inject.html',  side: 'right', fx: 58, fy: 61 },
            { label: '輪郭・小顔',        href: 'menu-face.html',     side: 'right', fx: 61, fy: 71 }
          ]
        },
        {
          id: '50', label: '50代以上', img: BASE + 'partnav-face-50.webp',
          parts: [
            { label: '額・こめかみ',      href: 'menu-forehead.html', side: 'left',  fx: 42, fy: 30 },
            { label: '目の下・クマ',      href: 'menu-undereye.html', side: 'left',  fx: 44, fy: 46 },
            { label: 'リフトアップ・たるみ', href: 'menu-lift.html',  side: 'left',  fx: 39, fy: 68 },
            { label: '目元（眼瞼下垂）',  href: 'menu-eye.html',      side: 'right', fx: 57, fy: 42 },
            { label: '肌・シミ',          href: 'menu-skin.html',     side: 'right', fx: 62, fy: 53 },
            { label: '注入・ボリューム',  href: 'menu-inject.html',   side: 'right', fx: 60, fy: 62 }
          ]
        },
        {
          id: 'mens', label: '男性美容', img: BASE + 'partnav-face-mens.webp',
          parts: [
            { label: '目の下・クマ',      href: 'menu-undereye.html', side: 'left',  fx: 44, fy: 45 },
            { label: '鼻',                href: 'menu-nose.html',     side: 'left',  fx: 50, fy: 52 },
            { label: 'ヒゲ脱毛',          href: 'menu-mens.html',     side: 'left',  fx: 46, fy: 70 },
            { label: 'AGA・薄毛',         href: 'menu-mens.html',     side: 'right', fx: 56, fy: 24 },
            { label: '肌・ニキビ',        href: 'menu-skin.html',     side: 'right', fx: 62, fy: 55 },
            { label: '輪郭・エラ',        href: 'menu-face.html',     side: 'right', fx: 61, fy: 70 }
          ]
        }
      ]
    },
    body: {
      fallbackImg: BASE + 'partnav-body.webp',
      img: BASE + 'partnav-body.webp',
      parts: [
        { label: '多汗症・ワキガ',    href: 'menu-sweat.html',  side: 'left',  fx: 41, fy: 24 },
        { label: 'バスト',            href: 'menu-bust.html',   side: 'left',  fx: 47, fy: 30 },
        { label: 'タトゥー除去',      href: 'menu-tattoo.html', side: 'left',  fx: 34, fy: 41 },
        { label: '痩身・脂肪吸引',    href: 'menu-body.html',   side: 'right', fx: 51, fy: 41 },
        { label: 'デリケートゾーン',  href: 'menu-vio.html',    side: 'right', fx: 50, fy: 51 },
        { label: '医療脱毛',          href: 'menu-hair.html',   side: 'right', fx: 55, fy: 76 }
      ]
    }
  };

  var SVGNS = 'http://www.w3.org/2000/svg';

  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function svgEl(tag) { return document.createElementNS(SVGNS, tag); }

  function makePill(part) {
    var a = el('a', 'part-nav__pill');
    a.href = part.href;
    a.textContent = t(part.label);
    a.setAttribute('data-fx', part.fx);
    a.setAttribute('data-fy', part.fy);
    a.setAttribute('data-side', part.side);
    return a;
  }

  function renderParts(root, parts, imgEl, fallbackImg) {
    var left = root.querySelector('[data-pills="left"]');
    var right = root.querySelector('[data-pills="right"]');
    left.innerHTML = ''; right.innerHTML = '';
    parts.forEach(function (p) {
      (p.side === 'left' ? left : right).appendChild(makePill(p));
    });
  }

  function setImg(imgEl, src, fallback) {
    imgEl.onerror = function () {
      if (imgEl.src.indexOf(fallback) === -1) { imgEl.onerror = null; imgEl.src = fallback; }
    };
    imgEl.src = src;
  }

  function drawLines(root) {
    var stage = root.querySelector('.part-nav__stage');
    var svg = root.querySelector('[data-partnav-lines]');
    var img = root.querySelector('[data-partnav-img]');
    if (!stage || !svg || !img) return;
    var sr = stage.getBoundingClientRect();
    var ir = img.getBoundingClientRect();
    if (!sr.width || !ir.width) return;
    svg.setAttribute('viewBox', '0 0 ' + Math.round(sr.width) + ' ' + Math.round(sr.height));
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var pills = root.querySelectorAll('.part-nav__pill');
    Array.prototype.forEach.call(pills, function (pill) {
      var fx = parseFloat(pill.getAttribute('data-fx'));
      var fy = parseFloat(pill.getAttribute('data-fy'));
      var side = pill.getAttribute('data-side');
      if (isNaN(fx) || isNaN(fy)) return;
      var pr = pill.getBoundingClientRect();
      var ax = (side === 'left' ? pr.right : pr.left) - sr.left;
      var ay = pr.top + pr.height / 2 - sr.top;
      var tx = ir.left - sr.left + (fx / 100) * ir.width;
      var ty = ir.top - sr.top + (fy / 100) * ir.height;
      // gentle elbow: short horizontal off the pill, then to the target
      var bend = side === 'left' ? 14 : -14;
      var path = svgEl('path');
      path.setAttribute('d', 'M ' + ax + ' ' + ay + ' L ' + (ax + bend) + ' ' + ay + ' L ' + tx + ' ' + ty);
      path.setAttribute('class', 'part-nav__line');
      svg.appendChild(path);
      var dot = svgEl('circle');
      dot.setAttribute('cx', tx); dot.setAttribute('cy', ty); dot.setAttribute('r', 3.5);
      dot.setAttribute('class', 'part-nav__dot');
      svg.appendChild(dot);
    });
  }

  function initFace(root) {
    var cfg = CONFIG.face;
    var tabsWrap = root.querySelector('[data-partnav-tabs]');
    var img = root.querySelector('[data-partnav-img]');
    var caption = root.querySelector('.part-nav__figure-caption');
    var current = 0;

    function activate(i) {
      current = i;
      var tab = cfg.tabs[i];
      Array.prototype.forEach.call(tabsWrap.children, function (b, bi) {
        b.classList.toggle('is-active', bi === i);
        b.setAttribute('aria-selected', bi === i ? 'true' : 'false');
      });
      renderParts(root, tab.parts, img, cfg.fallbackImg);
      setImg(img, tab.img, cfg.fallbackImg);
      if (caption) caption.textContent = t(tab.label);
      // draw after layout / image ready
      requestAnimationFrame(function () { drawLines(root); });
    }

    cfg.tabs.forEach(function (tab, i) {
      var b = el('button', 'part-nav__tab');
      b.type = 'button';
      b.textContent = t(tab.label);
      b.setAttribute('role', 'tab');
      b.addEventListener('click', function () { activate(i); });
      tabsWrap.appendChild(b);
    });

    img.addEventListener('load', function () { drawLines(root); });
    activate(0);
    return function redraw() { drawLines(root); };
  }

  function initBody(root) {
    var cfg = CONFIG.body;
    var img = root.querySelector('[data-partnav-img]');
    renderParts(root, cfg.parts, img, cfg.fallbackImg);
    setImg(img, cfg.img, cfg.fallbackImg);
    img.addEventListener('load', function () { drawLines(root); });
    requestAnimationFrame(function () { drawLines(root); });
    return function redraw() { drawLines(root); };
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var redraws = [];
    var faceRoot = document.querySelector('[data-partnav="face"]');
    var bodyRoot = document.querySelector('[data-partnav="body"]');
    if (faceRoot) redraws.push(initFace(faceRoot));
    if (bodyRoot) redraws.push(initBody(bodyRoot));
    if (!redraws.length) return;

    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { redraws.forEach(function (r) { r(); }); }, 120);
    }, { passive: true });

    // redraw once fonts settle (pill widths can shift)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { redraws.forEach(function (r) { r(); }); });
    }
    // safety redraws
    window.addEventListener('load', function () { setTimeout(function () { redraws.forEach(function (r) { r(); }); }, 200); });
  });
})();
