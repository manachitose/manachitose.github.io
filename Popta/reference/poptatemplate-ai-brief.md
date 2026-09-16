# AI向け: Poptaデザインテンプレート作成指示 v1

この文書をAIへ渡すときは、作りたい見た目、対象（`badge`または`popup`）、表示名、作者名も一緒に伝える。詳細仕様は`poptatemplate-author-guide.md`、許可bindingは`template-bindings.md`、確認済みCSS変数は`template-css-variables.md`を正本とする。

## 依頼する成果物

次のファイルを作成すること。

```text
template-source/
├─ design.json
├─ style.css
└─ thumbnail.png  # 任意
```

フォルダをそのまま成果物にする。共有用には通常の`.zip`も用意できる。親フォルダ付きZIP、複数デザインの独立フォルダをまとめたセットZIPも読み込める。拡張子を`.poptatemplate`へ変更しない。

## 絶対条件

- `formatVersion`と`templateApiVersion`はどちらも`1`。
- `target`は1デザインフォルダにつき`badge`または`popup`の片方だけ。両方を1つにしない。
- `id`は配布者が管理する不変・一意なID。英数字から始まり英数字で終わる3〜128文字とし、途中は英数字、`.`、`_`、`-`だけを使う。`popta.official.*`を使わない。
- 新規作成では`kind`を`stylesheet`にする。
- JavaScript、HTML、外部URL、`@import`、外部フォントを追加しない。
- CSSはTemplate API v1の公開クラスと`--popta-*`変数だけに依存する。DOM要素を増やさない。
- `html`、`body`、`:root`、`*`やTemplate API外の要素へ作用するセレクタを書かない。
- `controls`にはPoptaが公開するbindingだけを使う。binding名を推測・新設しない。
- 数値Controlには`label`、`min`、`max`、`step`を必ず指定する。安全範囲外を指定しない。
- `defaults`には全体設定の初期値を書く。`extra.*`は`badgeExtra`または`popupExtra`の入れ子オブジェクトへ、`animation.*`は`animation`へ格納する。`items.*.*`やドット付きキーをdefaultsへ直接書かない。色はhex形式。
- `items.*.*`は項目設定、その他は全体設定。両者を同じグループへ無理に混在させない。
- 同じcontrol IDまたはbindingを重複させない。`visibleWhen`は同じdesign.json内で宣言したbindingだけを参照し、循環させない。
- 素材はSVG/PNG/WebP/JPEGだけ。`assets/`などのサブフォルダを利用できる。

## CSSの入口

バッジでは主に`.badges`、`.cc-badge`、`.cc-badge-label`、`.cc-badge-value`、`.cc-badge--{itemKey}`を使う。ポップアップでは`.popup-zone`、`.popup`、`.popup-text`、`.popup--{itemKey}`を使う。

`itemKey`は`like`、`viewer`、`total`、`firstComment`、`greeting`のいずれか。ポップアップのアニメーションには`.popup-enter-from`、`.popup-enter-active`、`.popup-leave-active`、`.popup-leave-to`を使える。

## 作業手順

1. 近い組み込みテンプレートの`design.json`と`style.css`を1組だけ参照する。
2. 対象とIDを先に確定する。
3. 見た目に必要な公開bindingだけ選び、Controlsを宣言する。
4. 全Controlに分かりやすい日本語ラベルと、必要なら短い説明を付ける。
5. `defaults`をControl範囲内に設定する。
6. Template API外へ影響しないCSSを書く。
7. `design.json`またはZIPを「読み込み」、あるいは設定画面の「フォルダから追加」で取り込む。以後はAppData側を編集し、「デザインをリセット」でファイルを再読み込みして検証する。
8. エラーがあればメッセージの全項目を修正する。エラーを無視して別デザインへフォールバックさせない。
9. PoptaのプレビューとOBSの両方で確認する。

## AIに禁止する推測

- 存在しないbindingやCSS変数を、名前の雰囲気から作ること。
- バッジ用bindingをポップアップへ流用すること、またはその逆。
- 任意HTML、任意JavaScript、ネットワーク画像で不足機能を補うこと。
- デザインフォルダと、わんコメの`template.json`やPoptaプロジェクト`.popta`を同じ形式として扱うこと。
- 読み込み成功だけで完成と判断すること。フォーム操作、プレビュー、CSSコピー、OBS表示まで確認する。

## AIの最終報告形式

- 作成した対象、ID、表示名
- 使用した公開セレクタ
- 使用したbindingと、それぞれの用途
- 同梱素材一覧
- Poptaでの読込・操作・プレビュー結果
- OBS確認結果（未確認なら明記）
- 既知の制限
