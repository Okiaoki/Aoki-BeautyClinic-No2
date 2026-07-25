/**
 * Aoki Beauty Clinic — Cases Filter & Modal
 * カテゴリ/サブカテゴリ フィルタリング + モーダル + B/A スライダー
 */
(function () {
  'use strict';

  /* ── DOM refs ── */
  var tabs = document.querySelectorAll('.cases-filter__tab');
  var subContainer = document.querySelector('.cases-filter__sub');
  var cards = document.querySelectorAll('.case-card');
  var countEl = document.querySelector('.cases-filter__count-num');
  var modal = document.getElementById('cases-modal');
  var totalCount = cards.length;

  if (!tabs.length) return;

  /* ── i18n（表示ラベルのみ言語別。data-type 等の照合キーは日本語のまま） ── */
  var LANG = (document.documentElement.lang || 'ja').slice(0, 2);
  var SUB_LABELS = {
    'すべて': { en: 'All', zh: '全部' },
    '二重埋没': { en: 'Buried Suture', zh: '埋线双眼皮' },
    '二重切開': { en: 'Incisional Method', zh: '切开双眼皮' },
    '目の下たるみ': { en: 'Under-Eye Bags', zh: '眼下松弛' },
    '眼瞼下垂': { en: 'Ptosis', zh: '上睑下垂' },
    '隆鼻術': { en: 'Rhinoplasty', zh: '隆鼻' },
    '小鼻縮小': { en: 'Alar Reduction', zh: '缩鼻翼' },
    '鼻尖形成': { en: 'Nasal Tip Plasty', zh: '鼻尖成形' },
    '鼻中隔延長': { en: 'Septal Extension', zh: '鼻中隔延长' },
    'エラボトックス': { en: 'Jaw Botox', zh: '咬肌肉毒素' },
    '骨切り': { en: 'Bone Contouring', zh: '削骨' },
    '糸リフト': { en: 'Thread Lift', zh: '线雕提拉' },
    '顎プロテーゼ': { en: 'Chin Implant', zh: '下巴假体' },
    'バッカルファット': { en: 'Buccal Fat Removal', zh: '颊脂垫去除' },
    'レーザートーニング': { en: 'Laser Toning', zh: '激光调色' },
    'ピーリング': { en: 'Chemical Peel', zh: '果酸换肤' },
    'ハイフ': { en: 'HIFU', zh: '超声刀' },
    'フォトフェイシャル': { en: 'Photofacial', zh: '光子嫩肤' },
    'ダーマペン': { en: 'Dermapen', zh: '微针' },
    'ヒアルロン酸': { en: 'Hyaluronic Acid', zh: '玻尿酸' },
    'ボトックス': { en: 'Botox', zh: '肉毒素' },
    '全身': { en: 'Full Body', zh: '全身' },
    '顔': { en: 'Face', zh: '面部' },
    'VIO': { en: 'VIO', zh: 'VIO' },
    '豊胸': { en: 'Breast Augmentation', zh: '隆胸' },
    '脂肪吸引': { en: 'Liposuction', zh: '吸脂' }
  };
  function trSub(s) { if (LANG === 'ja') return s; var e = SUB_LABELS[s]; return e && e[LANG] ? e[LANG] : s; }
  var MODAL_LABELS = {
    doctor:      { ja: '担当',           en: 'Doctor',               zh: '主诊' },
    procedure:   { ja: '施術内容',       en: 'Procedure',            zh: '治疗内容' },
    duration:    { ja: '施術時間',       en: 'Duration',             zh: '治疗时间' },
    cost:        { ja: '費用',           en: 'Price',                zh: '费用' },
    risk:        { ja: 'リスク・副作用', en: 'Risks & Side Effects', zh: '风险·副作用' },
    downtime:    { ja: 'ダウンタイム',   en: 'Downtime',             zh: '恢复期' },
    doctorLabel: { ja: '担当医',         en: 'Attending Doctor',     zh: '主诊医生' }
  };
  function trModal(k) { var e = MODAL_LABELS[k]; return e ? (e[LANG] || e.ja) : k; }

  /* ── Sub-filter data ── */
  var subFilters = {
    eye:       ['すべて', '二重埋没', '二重切開', '目の下たるみ', '眼瞼下垂'],
    nose:      ['すべて', '隆鼻術', '小鼻縮小', '鼻尖形成', '鼻中隔延長'],
    face:      ['すべて', 'エラボトックス', '骨切り', '糸リフト', '顎プロテーゼ', 'バッカルファット'],
    skin:      ['すべて', 'レーザートーニング', 'ピーリング', 'ハイフ', 'フォトフェイシャル', 'ダーマペン'],
    injection: ['すべて', 'ヒアルロン酸', 'ボトックス'],
    hair:      ['すべて', '全身', '顔', 'VIO'],
    body:      ['すべて', '豊胸', '脂肪吸引']
  };

  var currentCategory = 'all';
  var currentSubType = 'すべて';

  /* ── Filtering ── */
  function filterCards() {
    var visible = 0;
    cards.forEach(function (card) {
      var cat = card.getAttribute('data-category');
      var sub = card.getAttribute('data-type');
      var show = true;
      if (currentCategory !== 'all' && cat !== currentCategory) show = false;
      if (currentSubType !== 'すべて' && sub !== currentSubType) show = false;
      card.setAttribute('data-hidden', show ? 'false' : 'true');
      if (show) visible++;
    });
    if (countEl) countEl.textContent = visible;
  }

  /* ── Build sub-filter pills ── */
  function buildSubFilters(category) {
    subContainer.innerHTML = '';
    currentSubType = 'すべて';
    if (category === 'all' || !subFilters[category]) {
      subContainer.classList.remove('is-visible');
      return;
    }
    var items = subFilters[category];
    items.forEach(function (label) {
      var btn = document.createElement('button');
      btn.className = 'cases-filter__sub-btn' + (label === 'すべて' ? ' is-active' : '');
      btn.textContent = trSub(label);
      btn.type = 'button';
      btn.addEventListener('click', function () {
        currentSubType = label;
        subContainer.querySelectorAll('.cases-filter__sub-btn').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        filterCards();
      });
      subContainer.appendChild(btn);
    });
    subContainer.classList.add('is-visible');
  }

  /* ── Tab clicks ── */
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      currentCategory = tab.getAttribute('data-filter');
      buildSubFilters(currentCategory);
      filterCards();
    });
  });

  /* Initial count */
  if (countEl) countEl.textContent = totalCount;

  /* ── Sticky filter bar ── */
  var filterBar = document.querySelector('.cases-filter');
  if (filterBar) {
    var stickyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        filterBar.classList.toggle('is-sticky', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    var hero = document.querySelector('.page-hero');
    if (hero) stickyObserver.observe(hero);
  }

  /* ── Modal ── */
  if (!modal) return;
  var modalOverlay = modal.querySelector('.cases-modal__overlay');
  var modalClose = modal.querySelector('.cases-modal__close');
  var modalTitle = modal.querySelector('.cases-modal__title');
  var modalMeta = modal.querySelector('.cases-modal__meta');
  var modalTable = modal.querySelector('.cases-modal__table tbody');
  var modalComment = modal.querySelector('.cases-modal__comment');
  var modalSliderBefore = modal.querySelector('.cases-modal__slider-before');
  var modalSliderAfter = modal.querySelector('.cases-modal__slider-after');
  var sliderRange = modal.querySelector('.cases-modal__slider-range');
  var sliderHandle = modal.querySelector('.cases-modal__slider-handle');

  var focusTrapHandler = null;

  function openModal(card) {
    var data = card.dataset;
    if (modalTitle) modalTitle.textContent = data.caseName || '';
    if (modalMeta) {
      modalMeta.innerHTML =
        '<span>' + (data.casePatient || '') + '</span>' +
        '<span>' + trModal('doctor') + ': ' + (data.caseDoctor || '') + '</span>';
    }
    if (modalTable) {
      modalTable.innerHTML =
        '<tr><th>' + trModal('procedure') + '</th><td>' + (data.caseProcedure || '') + '</td></tr>' +
        '<tr><th>' + trModal('duration') + '</th><td>' + (data.caseDuration || '') + '</td></tr>' +
        '<tr><th>' + trModal('cost') + '</th><td>' + (data.caseCost || '') + '</td></tr>' +
        '<tr><th>' + trModal('risk') + '</th><td>' + (data.caseRisk || '') + '</td></tr>' +
        '<tr><th>' + trModal('downtime') + '</th><td>' + (data.caseDowntime || '') + '</td></tr>';
    }
    if (modalComment) {
      var doctorName = modal.querySelector('.cases-modal__comment-doctor');
      var commentText = modal.querySelector('.cases-modal__comment-text');
      if (doctorName) doctorName.textContent = trModal('doctorLabel') + ': ' + (data.caseDoctor || '');
      if (commentText) commentText.textContent = data.caseComment || '';
    }

    /* Load B/A images from card into slider */
    var cardPictures = card.querySelectorAll('.case-card__img picture');
    if (cardPictures.length >= 2) {
      if (modalSliderBefore) {
        modalSliderBefore.innerHTML = '';
        var beforePic = cardPictures[0].cloneNode(true);
        var beforeImgEl = beforePic.querySelector('img');
        if (beforeImgEl) { beforeImgEl.removeAttribute('loading'); beforeImgEl.removeAttribute('decoding'); }
        modalSliderBefore.appendChild(beforePic);
      }
      if (modalSliderAfter) {
        modalSliderAfter.innerHTML = '';
        var afterPic = cardPictures[1].cloneNode(true);
        var afterImgEl = afterPic.querySelector('img');
        if (afterImgEl) { afterImgEl.removeAttribute('loading'); afterImgEl.removeAttribute('decoding'); }
        modalSliderAfter.appendChild(afterPic);
      }
    }

    /* Reset slider */
    if (sliderRange) {
      sliderRange.value = 50;
      updateSlider(50);
    }

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    /* Focus trap */
    if (modalClose) modalClose.focus();

    focusTrapHandler = function (e) {
      if (e.key !== 'Tab') return;
      var focusable = modal.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    modal.addEventListener('keydown', focusTrapHandler);
  }

  function closeModal() {
    if (focusTrapHandler) {
      modal.removeEventListener('keydown', focusTrapHandler);
      focusTrapHandler = null;
    }
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* Card click → open modal */
  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      openModal(card);
    });
  });

  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  /* ── B/A Slider ── */
  function updateSlider(val) {
    var pct = val + '%';
    if (modalSliderBefore) modalSliderBefore.style.clipPath = 'inset(0 ' + (100 - val) + '% 0 0)';
    if (sliderHandle) sliderHandle.style.left = pct;
  }

  if (sliderRange) {
    sliderRange.addEventListener('input', function () {
      updateSlider(parseInt(this.value, 10));
    });
  }

}());
