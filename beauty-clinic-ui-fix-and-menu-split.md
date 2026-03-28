# Aoki Beauty Clinic — UI修正 + メニューページ分割 統合指示書

## 概要
画像差し替え完了後のUI修正（5件）と、施術メニューページの7カテゴリ分割を行う。
3言語対応のため、すべての修正を ja/ → en/ → zh/ に横展開する。

---

## 絶対ルール（全Session共通）
- **既存のトラッキングコード4系統（GTM/GA4/Google Ads/Meta Pixel）は絶対に削除・変更しない**
- **git pushは行わない。作業完了報告のみ行う**
- **修正は必ず ja/ で先行実施し、動作確認後に en/ zh/ へ横展開**

---

## Session構成

| Session | 内容 | 対象 |
|---------|------|------|
| D | UI修正（5件）+ 自己診断 | ja/ 全5ページ + CSS/JS |
| E | メニューページ分割（ja版） | ja/menu.html → ja/menu-*.html 7ファイル新規作成 |
| F | メニューページ分割（en版 + zh版）+ UI修正の横展開 | en/ zh/ |

---

# Session D: UI修正 + 自己診断

## 修正1: Hero タイポグラフィ改修

### 対象ファイル
- `ja/index.html` — Heroセクション（line 186付近）
- `assets/css/style.css` — `.hero__title`, `.hero__title em`

### 現状
```html
<h1 class="hero__title">美しさに、<br><em>確かな安心</em>を。</h1>
```
→ 2行に分かれている。「確かな安心」のサイズが他のテキストと同じ。

### 変更後
```html
<h1 class="hero__title">美しさに、<em>確かな安心</em>を。</h1>
```
- `<br>` を削除して1行にする
- `em` のfont-sizeを拡大する（親の約1.3〜1.4倍を目安）

### CSS変更
```css
.hero__title em {
  font-style: normal;
  color: var(--color-gold);
  font-size: 1.35em;  /* 追加: 確かな安心を大きく */
  display: inline;     /* 念のため明示 */
}
```

**SP対応:** clamp() or メディアクエリで375pxでもはみ出さないサイズに調整すること。1行に収まらない場合はSPのみ改行を許容するが、「確かな安心」がfont-size拡大されている状態は維持。

### en/zh版対応
- en/: `Beauty with <em>Confidence</em>.` — 同様にemを拡大
- zh/: `美丽，<em>确实的安心</em>。` — 同様にemを拡大

---

## 修正2: ドクターサムネイルの円形クリップ修正

### 原因
`.doctor-card__image` 内の `<picture>` 要素に `width/height: 100%` が未設定のため、
`<img>` の `width: 100%; height: 100%; object-fit: cover` が正しく機能していない。

### 対象ファイル
- `assets/css/style.css`

### CSS追加
```css
.doctor-card__image picture {
  display: block;
  width: 100%;
  height: 100%;
}
```

### 確認ポイント
- 院長・副院長の顔が円形枠の中央に収まっていること
- 画像がトリミングされて円形内をぴったり埋めていること
- `object-position` の調整が必要な場合は、顔が中央に来るよう微調整

---

## 修正3: ヘッダー常時黒背景固定

### 原因
`.header` のデフォルト背景が `transparent`（またはCSSで未指定）で、
スクロール60px超で `.is-scrolled` クラスが追加されて初めて黒背景になる。

### 対象ファイル
- `assets/css/style.css` — `.header` セクション（line 253付近）

### 現状CSS
```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: var(--z-header);
  /* background未指定 = transparent */
}
.header.is-scrolled {
  background-color: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: var(--space-sm) 0;
  box-shadow: 0 1px 0 rgba(197, 165, 90, 0.15);
}
```

### 変更後CSS
```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: var(--z-header);
  background-color: rgba(10, 10, 10, 0.95);   /* 追加: 常時黒背景 */
  backdrop-filter: blur(12px);                  /* 追加 */
  -webkit-backdrop-filter: blur(12px);          /* 追加 */
  box-shadow: 0 1px 0 rgba(197, 165, 90, 0.15); /* 追加 */
}
/* .header.is-scrolled のpadding変更だけ残し、背景系は不要に */
.header.is-scrolled {
  padding: var(--space-sm) 0;
}
```

### JS変更は不要
`main.js` の `is-scrolled` toggle（line 144-156）はスクロール時のpadding変化に使えるのでそのまま残す。
ただし、背景の変化がなくなるため、transition でpadding変化がスムーズに見えることを確認。

---

## 修正4: 症例写真の下の空白修正

### 原因
修正2と同じ根本原因。`.case-card__img` 内の `<picture>` 要素に `width/height: 100%` が未設定。
`aspect-ratio: 3/4` が `.case-card__img` に設定されているが、`<picture>` がその高さを受け取っていないため、画像の下に空白が生じる。

### 対象ファイル
- `assets/css/style.css`

### CSS追加
```css
.case-card__img picture {
  display: block;
  width: 100%;
  height: 100%;
}
```

### 横展開対象の確認
同じpicture要素の問題が他にもないか、以下をグローバルに確認すること:
```css
/* 全体的なpicture要素のリセットを追加する方が安全 */
picture {
  display: block;
}
/* ただし、意図しない副作用がないかページ全体で目視確認すること */
```

---

## 修正5: 自己診断（超強化版）

修正1-4を完了した後、以下の自己診断を ja/ 全5ページに対して実行する。

```
ja/ 全5ページのHTML/CSS/JSを精読し、以下の観点で問題点を自己診断してください。
各観点ごとに「✅ 問題なし」「⚠️ 軽微」「❌ 要修正」の3段階で報告してください。

━━━ デザイン統一性 ━━━
□ ボタンのpadding/size/color/hover/active/focusが全ページで統一されているか
□ カードのshadow/radius/padding/hoverが統一されているか
□ セクション間余白が設計書の値に沿っているか
□ CSS変数のみ使用されているか（ハードコード色が混在していないか）

━━━ タイポグラフィ ━━━
□ font-family/size/weight/line-height/letter-spacingは設計書通りか
□ テキストと背景のコントラスト比が十分か

━━━ レスポンシブ ━━━
□ 375px幅で表示崩れがないか（はみ出し・重なり・文字切れ）
□ 768px幅でレイアウトが適切に切り替わっているか
□ 画像のアスペクト比が崩れている箇所はないか

━━━ インタラクション ━━━
□ すべてのリンク先が正しいか（#のまま残っていないか）
□ モーダル・ドロワーの開閉が正常か
□ スクロールアニメーションが自然か

━━━ 品質 ━━━
□ コンソールにエラーが出ていないか
□ alt属性の欠落はないか
□ 不要なconsole.log・デバッグコードが残っていないか
□ OGP/faviconは設定されているか

報告後、⚠️と❌の項目について私の承認を得てから修正を実行してください。
```

---

# Session E: メニューページ分割（ja版）

## 作業概要

### 現状
```
ja/menu.html（1337行）
  ├── Hero
  ├── カテゴリナビ（menu-nav）
  ├── menu-eye（line 206-396）: 目元 — 5施術
  ├── menu-nose（line 402-591）: 鼻 — 5施術
  ├── menu-face（line 597-724）: 輪郭 — 4施術
  ├── menu-skin（line 730-835）: 肌 — 6施術
  ├── menu-body（line 841-926）: ボディ — 2施術
  ├── menu-hair（line 932-1021）: 脱毛 — 5施術
  ├── menu-inject（line 1027-1144）: 注入 — 7施術
  ├── 料金一覧テーブル（line 1150-1217）: 全カテゴリ
  └── CTA + Footer
```

### 変更後
```
ja/menu.html（ハブページに改修）
  ├── Hero（既存維持）
  ├── 7カテゴリブロック（カード形式で一覧表示）
  │   各ブロック = ヘッダー画像 + カテゴリ説明 + 代表施術名 + 「詳しく見る →」CTA
  ├── 料金一覧テーブル（全カテゴリ統合版を維持）
  └── CTA + Footer

ja/menu-eye.html（新規作成）
  ├── ヘッダー（共通）
  ├── ページHero（カテゴリ用。menu-cat-eye画像を背景に）
  ├── パンくず: ホーム > 施術メニュー > 目元
  ├── 施術カード群（menu.htmlから移植: line 233-392）
  ├── 料金テーブル（目元の施術のみ抽出）
  ├── 関連症例リンク（cases.html?cat=eye）
  ├── CTA（共通）
  └── フッター（共通）

ja/menu-nose.html, ja/menu-face.html, ja/menu-skin.html,
ja/menu-body.html, ja/menu-hair.html, ja/menu-inject.html
  └── 同上の構造（カテゴリごとに内容が異なる）
```

## ハブページ（menu.html）改修仕様

### カテゴリブロックの構造
```html
<section class="menu-hub__category" data-reveal>
  <div class="menu-hub__category-inner">
    <div class="menu-hub__category-image">
      <picture>
        <source srcset="../assets/img/menu-cat-eye.webp" type="image/webp">
        <img src="../assets/img/menu-cat-eye.jpg" alt="目元の施術" loading="lazy" decoding="async">
      </picture>
    </div>
    <div class="menu-hub__category-text">
      <h2 class="menu-hub__category-en">EYES</h2>
      <p class="menu-hub__category-ja">目元</p>
      <p class="menu-hub__category-desc">二重整形から眼瞼下垂手術まで、目元のお悩みを総合的に解決します。</p>
      <ul class="menu-hub__category-list">
        <li>二重埋没法</li>
        <li>二重切開法</li>
        <li>目頭切開</li>
        <li>目の下のたるみ取り</li>
        <li>眼瞼下垂手術</li>
      </ul>
      <a class="btn btn--outline btn--md" href="menu-eye.html">
        目元の施術メニューを詳しく見る
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </div>
</section>
```

### カテゴリブロックのデザイン指針
- 2カラム（画像左 + テキスト右）。偶数番目は左右反転（既存のmenu-category--reverse と同じ）
- 画像は既存のカテゴリヘッダー画像を流用（menu-cat-*.webp/jpg）
- 施術名リストは箇条書きではなく、ゴールドのチェックマーク付きインラインリスト
- CTAボタンはゴールドアウトラインボタン
- ブロック間にゴールド細線セパレータ
- 「こんなお悩みの方に」セクションは**ハブには含めない**（個別ページに移す）
- SP: 1カラム、画像上+テキスト下

### 料金テーブル
- 既存のPRICE LISTセクション（全カテゴリ統合版）をそのまま残す

### ナビ（menu-nav）の扱い
- 既存のスティッキータブバーは残すが、hrefをアンカー（#menu-eye）から個別ページ（menu-eye.html）に変更
- スクロールスパイのJSは無効化（同一ページ内にカテゴリセクションがなくなるため）

## 個別カテゴリページの共通構造

### ファイル命名
| カテゴリ | ファイル名 | ID |
|---------|-----------|-----|
| 目元 | menu-eye.html | eye |
| 鼻 | menu-nose.html | nose |
| 輪郭・小顔 | menu-face.html | face |
| 肌治療 | menu-skin.html | skin |
| ボディ | menu-body.html | body |
| 医療脱毛 | menu-hair.html | hair |
| 注入治療 | menu-inject.html | inject |

### 各ページの構成
1. **ヘッダー** — 共通（menu.htmlと同一）。ナビの「施術メニュー」リンクはmenu.htmlへ
2. **ページHero** — 高さ50vh。背景にカテゴリヘッダー画像（menu-cat-{id}.jpg）を使用。英語カテゴリ名 + 日本語名 + サブテキスト
3. **パンくず** — `ホーム > 施術メニュー・料金 > {カテゴリ名}`
4. **「こんなお悩みの方に」** — menu.htmlから移植
5. **施術カード群** — menu.htmlの該当セクションから移植（既存HTML構造をそのまま使用）
6. **料金テーブル** — 該当カテゴリの施術のみを抽出したテーブル（全カテゴリ統合版ではない）
7. **関連症例リンク** — `この施術の症例を見る → cases.html`（カテゴリフィルタ付きリンク）
8. **CTA** — 共通ゴールドグラデーション帯
9. **フッター** — 共通

### 料金テーブル（カテゴリ別）
menu.htmlの全カテゴリ統合テーブルから、該当カテゴリの行のみ抽出する。

例: menu-eye.html の料金テーブル
```html
<section class="price-list" id="price-list">
  <div class="price-list__inner">
    <h2 class="price-list__title-en" data-reveal>PRICE</h2>
    <p class="price-list__title-ja" data-reveal>目元の施術 料金一覧</p>
    <table class="price-list__table" data-reveal>
      <tr class="cat-header"><td colspan="2">EYES — 目元</td></tr>
      <tr class="item-row"><td class="item-name">二重埋没法（2点留め）</td><td class="item-price">¥96,800</td></tr>
      <tr class="item-row"><td class="item-name">二重埋没法（3点留め）</td><td class="item-price">¥140,800</td></tr>
      <tr class="item-row"><td class="item-name">二重切開法</td><td class="item-price">¥327,800</td></tr>
      <tr class="item-row"><td class="item-name">目頭切開</td><td class="item-price">¥217,800</td></tr>
      <tr class="item-row"><td class="item-name">目の下のたるみ取り</td><td class="item-price">¥437,800〜</td></tr>
      <tr class="item-row"><td class="item-name">眼瞼下垂手術</td><td class="item-price">¥492,800</td></tr>
    </table>
    <div class="price-list__notes">
      <p>※ 表示価格はすべて税込です。</p>
      <p>※ カウンセリングは無料です。</p>
      <p>※ 各施術のリスク・副作用については、カウンセリング時に詳しくご説明いたします。</p>
      <p>※ お支払い方法：現金 / クレジットカード / 医療ローン（最大60回分割）</p>
    </div>
  </div>
</section>
```

## リンク修正マップ

menu.htmlをハブ化し、個別ページを追加するため、以下のリンクを全ページで修正する。

### サイト内リンク修正（全15ページ + 新規7ファイル × 3言語 = 36ファイル）

| 修正箇所 | 変更前 | 変更後 |
|---------|-------|-------|
| トップページの施術カテゴリカード | menu.html#menu-eye | menu-eye.html |
| トップページの「施術メニューを見る」ボタン | menu.html | menu.html（変更なし） |
| 症例カードの施術リンク | menu.html#menu-{cat} | menu-{cat}.html |
| ドクターの得意施術タグリンク | menu.html#menu-{cat} | menu-{cat}.html |
| ハブページのカテゴリCTA | （新規） | menu-{cat}.html |
| 個別ページのヘッダーナビ | 施術メニュー → menu.html | menu.html（変更なし） |
| 個別ページのパンくず | — | 施術メニュー → menu.html |

### hreflang追加（新規7ページ × 3言語）
各個別ページに以下を追加:
```html
<link rel="alternate" hreflang="ja" href="/ja/menu-eye.html">
<link rel="alternate" hreflang="en" href="/en/menu-eye.html">
<link rel="alternate" hreflang="zh" href="/zh/menu-eye.html">
```

### sitemap.xml更新
新規21ページ（7カテゴリ × 3言語）のURLを追加。

### 構造化データ更新
各個別ページにBreadcrumbList JSON-LDを追加。

---

# Session F: en/zh 横展開

## 作業内容
1. Session Dの修正1-4をen/zh版のCSSは共通なので自動適用済み。HTML側の修正（Hero `<br>` 削除等）をen/zh/index.htmlにも適用
2. Session Dの自己診断で発見された問題をen/zh版にも横展開
3. Session Eで作成した ja/menu-*.html 7ファイルを en/ zh/ にコピー
4. テキストを各言語に翻訳（既存のen/menu.html, zh/menu.htmlのテキストを参照して対応）
5. alt属性を各言語版に翻訳
6. hreflang / パンくず / メタ情報を各言語用に調整
7. サイト内リンクを各言語ディレクトリに合わせて修正
8. sitemap.xml更新

---

## 完了報告フォーマット（各Session共通）

### 1. 変更したファイル一覧と変更箇所数
### 2. 新規作成したファイル一覧
### 3. 技術的な判断をした箇所（指示書に明記されていない決定）
### 4. 不具合・懸念事項
### 5. 確認推奨事項

---

## 注意事項

### やるべきこと
- 新規ページのmeta description/title/OGPを適切に設定
- 新規ページにトラッキングコード4系統を正確にコピー
- 新規ページに既存のローディングアニメーション・スクロールアニメーションを適用
- 全ページのナビリンクの整合性を確認

### やってはいけないこと
- 既存の施術データ（料金・リスク・説明文等）を改変する
- 既存のCSS class命名規則を変更する
- 既存のJS機能（フィルタリング・モーダル・ドラッグスクロール等）を壊す
- 画像ファイルのパスを変更する（assets/img/ は維持）
- git push する
