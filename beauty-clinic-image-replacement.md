# Aoki Beauty Clinic — 画像差し替え指示書

## 概要
プレースホルダー（CSSグラデーション背景）で仮実装されている画像を、ChatGPTで生成済みの実画像（PNG）に差し替える。
併せてPNG→WebP+JPGへの変換・軽量化を行い、picture要素でのフォールバック構成を適用する。

---

## 前提条件

### 画像ソース
- **保存場所**: `/mnt/c/Users/lelie/OneDrive/デスクトップ/AokiBeautyClinic-img/`
- **形式**: すべてPNG（ChatGPT出力のため）
- **命名規則**: 設計書記載のファイル名通りにリネーム済み（拡張子は.png）
- **総数**: 133枚

### プロジェクトディレクトリ
- `AokiBeautyClinic/納品用/` 配下にja/en/zh + assets/が存在
- 画像配置先: `assets/img/`
- 全言語版が `../assets/img/` で同一画像を参照する構造

### 重要ルール
- **既存のトラッキングコード4系統（GTM/GA4/Google Ads/Meta Pixel）は絶対に削除・変更しない**
- **既存のCSS/JS/HTMLの構造・機能は維持する。画像関連のsrc/background変更のみ行う**
- **git pushは行わない。作業完了報告のみ行う**

---

## セッション分割

### Session A: 日本語版 全5ページ（ja/）
- 対象: `ja/index.html`, `ja/cases.html`, `ja/menu.html`, `ja/doctors.html`, `ja/clinic.html`
- **このセッションで画像の最適化（PNG→WebP+JPG）とassets/img/への配置を完了させる**
- ja/ の全HTMLでプレースホルダーを実画像に差し替え

### Session B: 英語版 全5ページ（en/）
- 対象: `en/index.html`, `en/cases.html`, `en/menu.html`, `en/doctors.html`, `en/clinic.html`
- 画像ファイルはSession Aで配置済み（assets/img/は共有）
- en/ の各HTMLでプレースホルダーを実画像に差し替え

### Session C: 中国語版 全5ページ（zh/）
- 対象: `zh/index.html`, `zh/cases.html`, `zh/menu.html`, `zh/doctors.html`, `zh/clinic.html`
- 画像ファイルはSession Aで配置済み（assets/img/は共有）
- zh/ の各HTMLでプレースホルダーを実画像に差し替え

---

## Session A 実行手順（最重要セッション）

### ステップ1: 画像の最適化パイプライン構築

```bash
# sharpをインストール（Node.js画像処理ライブラリ）
npm install sharp

# 最適化スクリプトを作成して実行
# 入力: /mnt/c/Users/lelie/OneDrive/デスクトップ/AokiBeautyClinic-img/*.png
# 出力: assets/img/ に WebP + JPG の2形式で出力
```

**最適化スクリプトの要件:**
1. ソースディレクトリの全PNGファイルを読み込む
2. 各ファイルについて以下を生成:
   - **WebP版**: quality 80, effort 4（メインで使用）
   - **JPG版**: quality 82, mozjpeg圧縮（フォールバック用）
3. リサイズルール（元画像が指定サイズより大きい場合のみ縮小、拡大はしない）:
   - Hero背景画像（hero-main, cases-hero, menu-hero, doctors-hero, clinic-hero）: max-width 1920px
   - ポートレート画像（doctor-aoki-main, doctor-shiraishi-main）: max-width 800px
   - 症例Before/After画像（case-XX-before, case-XX-after）: max-width 600px
   - Instagram画像（instagram-XX）: max-width 500px（正方形維持）
   - カテゴリヘッダー画像（menu-cat-XX）: max-width 800px
   - イラスト画像（menu-illust-XX）: max-width 800px, **透過を維持（WebP+PNG、JPGではなくPNG維持）**
   - 院内ギャラリー大（clinic-interior-01, 05）: max-width 1200px
   - 院内ギャラリー小（clinic-interior-02,03,04,06,07,08）: max-width 600px
   - その他: max-width 1200px
4. 出力ファイル名: 元のファイル名のまま拡張子のみ変更（例: `hero-main.webp`, `hero-main.jpg`）
5. 処理結果のログを出力（ファイル名、元サイズ、出力サイズ、圧縮率）

### ステップ2: 画像ファイルの配置確認

最適化完了後、assets/img/ 内のファイル一覧を出力し、設計書の画像一覧と突合する。
不足ファイル・余分ファイルがあればログに記録する。

### ステップ3: ja/ 全5ページのHTML修正

各HTMLファイルについて、以下のパターンでプレースホルダーを実画像に差し替える。

#### パターン1: 背景画像のCSS（Heroセクション等）

**変更前（例）:**
```html
<div class="hero" style="background: linear-gradient(135deg, #1a1a1a, #2a2a2a);">
```
または
```css
.hero__bg { background: linear-gradient(...); }
```

**変更後:**
```html
<div class="hero">
  <picture class="hero__bg">
    <source srcset="../assets/img/hero-main.webp" type="image/webp">
    <img src="../assets/img/hero-main.jpg" alt="Aoki Beauty Clinic 受付ラウンジ" loading="eager" decoding="async">
  </picture>
</div>
```
※ Hero画像は `loading="eager"`、それ以外は `loading="lazy"`

#### パターン2: img要素のsrc差し替え（カード内画像等）

**変更前:**
```html
<img src="" alt="..." class="..." style="background: linear-gradient(...);">
```
または
```html
<div class="placeholder" style="background: linear-gradient(...);">
  <span>画像プレースホルダー: ○○</span>
</div>
```

**変更後:**
```html
<picture>
  <source srcset="../assets/img/ファイル名.webp" type="image/webp">
  <img src="../assets/img/ファイル名.jpg" alt="適切なalt文" loading="lazy" decoding="async" class="元のclass">
</picture>
```

#### パターン3: 背景画像として使用（パララックス・テクスチャ等）

CSSのbackground-imageプロパティで使用する場合:
```css
.parallax-section {
  background-image: url('../assets/img/doctors-parallax.jpg');
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}
```
※ パララックスやオーバーレイ背景はCSS background-imageで適用。picture要素は使わない。

---

## 画像ファイル一覧と配置先マッピング

### トップページ（index.html）— 約40枚

| # | ファイル名 | 用途 | 配置先セクション | alt文（日本語版） |
|---|-----------|------|-----------------|-----------------|
| 1 | hero-main | Hero背景 | SEC-01 .hero | Aoki Beauty Clinic 受付ラウンジ |
| 2 | about-counseling | About写真 | SEC-03 .about__image | 院長によるカウンセリング風景 |
| 3 | treatment-cat-eyes | 施術カテゴリ:目元 | SEC-04 .treatment-card:nth(1) | 目元の施術イメージ |
| 4 | treatment-cat-nose | 施術カテゴリ:鼻 | SEC-04 .treatment-card:nth(2) | 鼻の施術イメージ |
| 5 | treatment-cat-contour | 施術カテゴリ:輪郭 | SEC-04 .treatment-card:nth(3) | 輪郭の施術イメージ |
| 6 | treatment-cat-skin | 施術カテゴリ:肌 | SEC-04 .treatment-card:nth(4) | 肌の施術イメージ |
| 7 | treatment-cat-body | 施術カテゴリ:ボディ | SEC-04 .treatment-card:nth(5) | ボディの施術イメージ |
| 8 | treatment-cat-hair | 施術カテゴリ:脱毛 | SEC-04 .treatment-card:nth(6) | 脱毛の施術イメージ |
| 9 | treatment-cat-injection | 施術カテゴリ:注入 | SEC-04 .treatment-card:nth(7) | 注入の施術イメージ |
| 10 | reason-01 | 選ばれる理由1 | SEC-06 .reasons__item:nth(1) | カウンセリング中のドクターと患者 |
| 11 | reason-02 | 選ばれる理由2 | SEC-06 .reasons__item:nth(2) | 最新の医療機器 |
| 12 | reason-03 | 選ばれる理由3 | SEC-06 .reasons__item:nth(3) | 清潔な施術室 |
| 13 | doctor-aoki-circle | ドクター紹介:院長 | SEC-07 院長写真 | 院長 青木誠一 |
| 14 | doctor-shiraishi-circle | ドクター紹介:副院長 | SEC-07 副院長写真 | 副院長 白石美咲 |
| 15 | doctors-bg | ドクターセクション背景 | SEC-07 背景 | クリニック内観 |
| 16-25 | instagram-01〜10 | Instagram帯 | SEC-10 .instagram__item | Instagram投稿（1〜10） |
| 26 | cta-bg | CTA背景（該当する場合） | SEC-13 .cta背景 | 施術室イメージ |

**※ 症例プレビュー（SEC-05）はcases.htmlの症例画像を参照するため、独自画像はなし。case-01〜case-08のBefore/After画像を使い回す想定。**

### 症例ページ（cases.html）— 55枚

| # | ファイル名 | 用途 | 備考 |
|---|-----------|------|------|
| 1 | cases-hero | ページHero背景 | 1920×1080 |
| 2-55 | case-01-before〜case-27-after | 27症例×2（Before+After） | 600×800, CASE-28,29,30は画像なし（テキスト代替） |

### メニュー・料金ページ（menu.html）— 15枚

| # | ファイル名 | 用途 | 備考 |
|---|-----------|------|------|
| 1 | menu-hero | ページHero背景 | 1920×1080 |
| 2-8 | menu-cat-eye〜menu-cat-inject | 7カテゴリヘッダー画像 | 800×600 |
| 9-15 | menu-illust-01〜07 | 外科施術の図解イラスト | **透過PNG維持** |

### ドクター紹介ページ（doctors.html）— 4枚

| # | ファイル名 | 用途 | 備考 |
|---|-----------|------|------|
| 1 | doctors-hero | ページHero背景 | 2名の医師集合写真 |
| 2 | doctor-aoki-main | 院長ポートレート | 800×1200 縦長 |
| 3 | doctors-parallax | パララックス帯背景 | CSS background-imageで適用 |
| 4 | doctor-shiraishi-main | 副院長ポートレート | 800×1200 縦長 |

### クリニック情報ページ（clinic.html）— 9枚

| # | ファイル名 | 用途 | 備考 |
|---|-----------|------|------|
| 1 | clinic-hero | ページHero背景 | クリニック外観 |
| 2-9 | clinic-interior-01〜08 | 院内ギャラリー8枚 | マソンリー風グリッド |

**上記合計: 約123枚。残り約10枚は大理石テクスチャ、追加装飾画像等の可能性あり。ソースディレクトリの実ファイル一覧を確認して突合すること。**

---

## Session B / Session C 実行手順

### 共通手順（en/ および zh/）

1. **画像ファイルの追加配置は不要**（assets/img/はSession Aで完了済み）
2. 対象言語ディレクトリの全5ファイルについて、Session Aと同じパターンでプレースホルダーを実画像に差し替え
3. **alt属性のテキストは各言語版に翻訳する**:
   - en/: 英語alt文
   - zh/: 中国語alt文
4. picture要素のsrcパスは `../assets/img/` で全言語共通

---

## 完了報告フォーマット（各Session共通）

### 1. 処理した画像ファイル数
- 最適化済み: XX枚（WebP: XX枚, JPG: XX枚, PNG維持: XX枚）
- 合計ファイルサイズ: XX MB → XX MB（圧縮率: XX%）

### 2. 更新したHTMLファイル一覧
- ファイル名と差し替え箇所数

### 3. 画像突合結果
- 設計書記載で未提供の画像（あれば）
- 設計書に記載のないが存在する画像（あれば）

### 4. 不具合・懸念事項
- プレースホルダーの実装パターンが想定と異なった箇所
- 画像サイズ・アスペクト比の問題
- その他

### 5. 確認推奨事項
- ブラウザ目視確認が必要な箇所
- レスポンシブでの画像表示確認

---

## 注意事項

### やるべきこと
- 全画像にalt属性を設定する（SEO・アクセシビリティ）
- Hero画像には `loading="eager"`、その他は `loading="lazy"` を使い分ける
- `decoding="async"` を全img要素に付与
- 透過画像（イラスト系）はJPGではなくPNG+WebPの組み合わせにする
- 各ページの表示をブラウザプレビュー確認し、画像が正しく表示されることを検証

### やってはいけないこと
- 既存のHTML構造（セクション構成、class名、id名）を変更する
- 既存のCSS・JSファイルの機能を変更する
- トラッキングコード4系統に触れる
- git push する（完了報告のみ）
- CASE-28, 29, 30に画像を追加する（プライバシー保護のためテキスト代替が正）
- 画像のアスペクト比を崩す（object-fit: cover を維持）
