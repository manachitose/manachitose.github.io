# Popta デザインフォルダ制作者ガイド v1

> design.jsonフォルダ形式の仕様。binding一覧はコードから生成し、掲載する最小例は読み込み検証テストで確認しています。

## 1. デザインフォルダとは

デザインフォルダは、Poptaへバッジまたはポップアップのデザインを1種類追加する自己完結したファイル一式です。共有するときは通常の`.zip`にできます。わんコメテンプレートそのものでも、編集プロジェクト`.popta`でもありません。

パッケージは次の3要素を持ちます。

- `design.json`: デザインの識別情報、初期値、Poptaに表示するフォーム
- `style.css`: Template API v1のDOMとCSS変数を使うデザイン
- 画像素材とサムネイル: 任意。対応形式はSVG、PNG、WebP、JPEG

JavaScriptやHTMLは実行できません。バッジとポップアップは、別々のフォルダとして作成します。

## 2. 最小構成

```text
minimal-badge/
├─ design.json
└─ style.css
```

`design.json`:

```json
{
  "formatVersion": 1,
  "templateApiVersion": 1,
  "id": "example.creator.minimal-badge",
  "name": "シンプルバッジ",
  "author": "Example Creator",
  "description": "背景とアクセントを使うシンプルなバッジ",
  "kind": "stylesheet",
  "target": "badge",
  "stylesheet": "style.css",
  "defaults": {
    "fontSize": 36,
    "baseColor": "#20242c",
    "labelColor": "#ffffff",
    "itemGap": 8
  },
  "controls": [
    {
      "id": "font-size",
      "type": "number",
      "binding": "fontSize",
      "label": "文字サイズ",
      "section": "typography",
      "min": 8,
      "max": 96,
      "step": 1
    },
    {
      "id": "base-color",
      "type": "color",
      "binding": "baseColor",
      "label": "ベースカラー",
      "section": "colors"
    },
    {
      "id": "label-color",
      "type": "color",
      "binding": "labelColor",
      "label": "ラベルカラー",
      "section": "colors"
    },
    {
      "id": "item-gap",
      "type": "number",
      "binding": "itemGap",
      "label": "項目間隔",
      "section": "layout",
      "min": 0,
      "max": 64,
      "step": 1
    },
    {
      "id": "item-accent",
      "type": "color",
      "binding": "items.*.accentColor",
      "label": "アクセントカラー",
      "section": "colors"
    }
  ]
}
```

`style.css`:

```css
.badges {
  display: flex;
  gap: var(--popta-badge-item-gap);
  font-family: var(--popta-badge-font);
  font-size: var(--popta-badge-font-size);
}

.cc-badge {
  padding: 0.35em 0.65em;
  background: var(--popta-badge-base-color);
  color: var(--popta-badge-label-color);
}

.cc-badge-value { margin-left: 0.35em; }
.cc-badge--like .cc-badge-value { color: var(--popta-item-like-badge-value-color); }
.cc-badge--viewer .cc-badge-value { color: var(--popta-item-viewer-badge-value-color); }
.cc-badge--total .cc-badge-value { color: var(--popta-item-total-badge-value-color); }
.cc-badge--firstComment .cc-badge-value { color: var(--popta-item-first-comment-badge-value-color); }
.cc-badge--greeting .cc-badge-value { color: var(--popta-item-greeting-badge-value-color); }
```

項目別変数は`--like`、`--viewer`などの項目クラスごとに宣言します。配布前に全5項目を確認してください。

## 3. design.json

### 必須フィールド

| フィールド | 値 |
|---|---|
| `formatVersion` | `1` |
| `templateApiVersion` | `1` |
| `id` | 不変で一意なID |
| `name` | Poptaのギャラリーに表示する名前 |
| `kind` | `preset`または`stylesheet`。外部作者の新規作成は`stylesheet` |
| `target` | `badge`または`popup` |
| `stylesheet` | design.jsonのあるフォルダ基準の安全な相対パス |
| `defaults` | 初期値オブジェクト。空でも必須 |
| `controls` | フォーム定義配列。空でも必須 |

任意フィールドは`author`、`description`、`thumbnail`、`license`、`homepage`です。指定する場合は空文字にできません。

`kind`はデザインの由来を示すメタデータです。`preset`と`stylesheet`で読込・検証・描画方法は変わらず、どちらもCSSと素材を内包する必要があります。Popta組み込みは`preset`、外部作者がCSSから作るものは`stylesheet`とします。

### ID

- 3〜128文字を推奨（現行検証器は1文字IDも受理するが、配布用IDには名前空間を含める）
- 先頭と末尾は英数字
- 途中に使えるのは英数字、`.`、`_`、`-`
- 一度配布したデザインの更新ではIDを変えない
- 他者との衝突を避けるため`作者名.作品名`などの名前空間を使う
- `popta.official.*`は組み込み用なので使用しない

表示名`name`はIDではありません。ファイル名とも独立しています。バッジ・ポップアップを通して登録済みIDは追加できません。複数選択内で同じIDがあれば該当デザインをすべて除外します。更新はAppData内のファイルを編集して再読み込みしてください。

### パスと容量

- ZIP内は`/`区切りの相対パスだけを使う
- 絶対パス、ドライブ名、空の区間、`.`、`..`、暗号化ZIPは禁止
- ZIP全体: 圧縮済み最大64 MiB、展開後合計最大128 MiB、最大4096エントリ、最大128デザイン
- 1デザイン: 最大64ファイル、合計最大8 MiB。1ファイル最大4 MiB
- `design.json`最大64 KiB、CSS最大1 MiB
- 対応圧縮方式は無圧縮またはDeflate
- 極端な圧縮率のファイルは拒否される

読み込み側と公式ビルドスクリプトはサブディレクトリを扱えます。素材は`assets/`などへ整理でき、CSSファイルからの相対パスで参照します。

## 4. Controls

Controlsは任意UIではなく、Poptaが許可した設定値へ接続する宣言です。すべてのControlに`id`、`type`、`label`、`section`が必要です。

利用できるsection:

- `position`
- `layout`
- `typography`
- `colors`
- `content`
- `shape`
- `decoration`
- `animation`

共通の任意値として`order`、最大240文字の`description`、`visibleWhen`を指定できます。Control IDは小文字英字で始め、以降は小文字英数字、`.`、`_`、`-`を使い、最大64文字です。パッケージ内で重複できません。

### Controlの種類

| type | 固有の必須値 | 用途 |
|---|---|---|
| `number` | `binding`, `min`, `max`, `step` | 数値＋スライダー |
| `color` | `binding` | hex色 |
| `text` | `binding`, `maxLength` | 文字列 |
| `boolean` | `binding` | ON/OFF |
| `select` | `binding`, 2〜32件の`options` | 定義済み選択肢 |
| `font` | `binding` | フォント |
| `position` | `xBinding`, `yBinding`, `xLabel`, `yLabel` | 2軸位置 |
| `group` | 1件以上の`controls` | 関連設定のまとまり |

`number`では`sliderMax`、`snapPoints`、`maxFromCanvas`、`display`、`invert`を必要な場合だけ使えます。`display`は保存値を変えず、表示上の倍率・単位・刻みを指定します。たとえば内部値をmsで保持し秒表示する場合は`scale: 0.001`、`unit: "秒"`を使います。

`position`の`coordinateMode`は`absolute`または`offset-from-center`、`xPresets`は`canvas`または`none`です。省略時はそれぞれ`absolute`と`canvas`です。

`group.enabledBinding`を指定すると、グループ全体のON/OFFになります。ネストは深くしすぎず、利用者が意味を理解できる単位にします。

### 条件表示

```json
{
  "visibleWhen": {
    "binding": "animation.enterSlide",
    "equals": true
  }
}
```

数値には`greaterThan`、複数条件には`any`または`all`を使えます。条件は最大16子、ネストは最大4段です。参照するbindingも同じControls内で宣言し、型を合わせ、循環参照を作らないでください。

### bindingとdefaults

- `posX`、`fontSize`などはデザイン全体の設定
- `extra.*`は対象固有の全体設定
- `animation.*`はポップアップのアニメーション設定
- `items.*.*`は高評価など各項目の設定

`defaults`は全体設定の初期値です。通常の値は`fontSize`などのキーで指定し、`extra.*`はbadgeなら`badgeExtra`、popupなら`popupExtra`のオブジェクトへ、`animation.*`は`animation`オブジェクトへ入れます。`"extra.cornerRadiusPx"`のようなドット付きキーや`items.*.*`をdefaultsへ直接指定することはできません。未知の名前、対象違い、型違い、Control範囲外、安全範囲外の値はエラーになります。色は`#RGB`、`#RGBA`、`#RRGGBB`、`#RRGGBBAA`のいずれかです。

完全なbinding表は[自動生成binding一覧](template-bindings.md)を参照してください。`TEMPLATE_FIELD_CATALOG`から生成され、同期テストで保護されています。一覧に存在しないbindingを推測しないでください。

## 5. Template API v1

公開DOMクラス:

- 共通: `.stage`
- バッジ: `.badges`、`.cc-badge`、`.cc-badge-label`、`.cc-badge-value`、`.cc-badge--{itemKey}`
- ポップアップ: `.popup-zone`、`.popup`、`.popup-text`、`.popup--{itemKey}`
- 遷移: `.popup-enter-from`、`.popup-enter-active`、`.popup-leave-active`、`.popup-leave-to`

`itemKey`は`like`、`viewer`、`total`、`firstComment`、`greeting`です。

CSSのセレクタは`.stage`、`.badges`、`.cc-badge...`、`.popup-zone...`、`.popup...`のいずれかから始めます。`:is()`、`:where()`、`:has()`、`html`、`body`、`:root`、全称セレクタ、契約外ルートは禁止です。

許可されるat-ruleは`@media`、`@supports`、`@keyframes`、`@-webkit-keyframes`だけです。`@import`とネットワークURLは禁止です。

CSS変数は設定名から`--popta-`接頭辞＋kebab-caseで生成されます。例:

- `fontSize` → `--popta-badge-font-size`または`--popta-popup-font-size`
- badgeの`extra.cornerRadiusPx` → `--popta-badge-extra-corner-radius-px`
- popupの`animation.enterDurationSec` → `--popta-popup-animation-enter-duration-sec`
- `items.*.accentColor` → `--popta-item-like-accent-color`など項目別

計算済み変数も提供されます。組み込み28デザインで使用を確認した変数は[自動生成CSS変数一覧](template-css-variables.md)を参照してください。必ず組み込みCSSまたは生成リファレンスに実在する変数だけを使ってください。

## 6. 画像素材

CSSから相対`url(...)`で参照した素材は、読み込み時にData URLへ変換されます。対応拡張子は`.svg`、`.png`、`.webp`、`.jpg`、`.jpeg`です。HTTP、HTTPS、file URL、クエリ、フラグメントは使えません。

SVGではscript、`foreignObject`、DOCTYPE/ENTITY、イベント属性、JavaScript URL、外部参照、`@import`を使えません。フォントファイルは同梱対象外です。

サムネイルを使う場合はdesign.jsonの`thumbnail`へファイル名を書きます。画像はギャラリー表示用であり、デザインCSSへ自動では適用されません。

## 7. 作成・検証手順

1. `resources/design-template-sources`から対象と見た目が近い1種類を作業用フォルダへコピーする。
2. `id`、`name`、作者情報、`target`を変更する。
3. 不要なControls/defaultsを削り、必要な公開bindingだけ残す。
4. `style.css`をTemplate API内で作る。
5. `design.json`と`style.css`を同じフォルダへ置く。共有時は通常の`.zip`にする。外側の梱包フォルダがあってもよく、バッジ・ポップアップの独立フォルダを同じZIPへまとめられる。
6. Popta右上の「読み込み」でZIPまたは`design.json`を選ぶ。フォルダ自体は設定画面の「フォルダから追加」で選ぶ。
7. 全Controlを最小・最大・ON/OFF・条件表示まで操作する。
8. 5項目すべて、横型・縦型、長い文字、日本語、ポップアップ遷移を確認する。
9. CSSコピーが可能で、古いCSSへフォールバックしていないことを確認する。
10. OBSのブラウザソースへCSSを貼り、実際のわんコメテンプレートで確認する。

取り込み時にAppDataへコピーし、ZIPは展開します。取り込み後は元の配布フォルダやZIPを参照しません。管理済みフォルダを選択した場合はコピーせず再読み込みします。

開発中はAppDataのテンプレートフォルダを直接編集できます。デザインカードを右クリックしてファイルを表示し、修正後に「デザインをリセット」を押すと、ディスクから再読込して初期値へ戻します。

設定エラーのあるデザインは一覧へ残りますが、設定フォーム・プレビュー・CSSコピーには使用されません。ID重複や識別不能なZIPは登録されません。問題一覧に出たすべての項目を直してください。

## 8. 配布前チェック

- [ ] IDが固有で、更新時にも維持される
- [ ] バッジとポップアップを別フォルダにし、素材もそれぞれに同梱した
- [ ] すべてのControlに意味の分かるラベルがある
- [ ] 数値範囲と初期値が現実的で一致している
- [ ] 未公開binding/CSS変数を使っていない
- [ ] 外部URL、JavaScript、HTML、フォントを含まない
- [ ] 全素材をパッケージ内に含めた
- [ ] Poptaの問題一覧が空で、全Controlが動く
- [ ] プレビューとCSSコピーを確認した
- [ ] OBSで確認した
- [ ] 作者、ライセンス、配布先をdesign.jsonへ記載した

AIを使って作成する場合は、併せて`poptatemplate-ai-brief.md`をAIへ渡してください。
