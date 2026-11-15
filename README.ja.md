# TurboWarp Plus Editor Fonts

[English](README.md)

TurboWarp Plus Editor の Web フォント。作品は、Google Fonts の小さなカタログからフォントを ID で選び、URL は持たない。Web フォントを使う作品を開くときは、`fonts.gstatic.com` から何かを取得する前に一度だけ利用者に確かめる。断ったときやオフラインのときは、各フォントの代替フォントで開く。Packager で書き出した作品は、常に代替フォントを使う。

## 入口

| import | 内容 |
| --- | --- |
| `.`・`./web-fonts` | `webFonts`（カタログ）、`installWebFonts(vm, approve)`（VM のフォントの管理につなぎ、取得の前に `approve` で確かめ、作品に参照を残す）、`webFontEditor(manager)`、`withPackagerFontFallbacks(vm, run)`、`webFontOwnsKeyEvent(event)` |
| `./web-font-dialogs` | `WebFontButton`、`WebFontForm`（カタログのフォントを代替フォントとともに追加する）、`WebFontApproval`（取得の前に確かめる。枠はホストが `DialogFrame` で渡す）、`webFontLabel` |
| `./paint-fonts-button` | ペイントエディターのツールバーの **フォント…** ボタン。ホストが `onOpen` を渡さないときは何も描画しない |
| `./styles.css` | ダイアログとボタンのスタイルシート |

関数は VM とそのフォントの管理を構造的な型で受け取るので、このパッケージは VM も GUI も import しない。`@kubohiroya/turbowarp-plus-editor-fonts/styles.css` をグローバルなスタイルシートとして読み込む。ダイアログのボタンは `tw-plus-dialog-actions` の並びを使い、その見た目は `@kubohiroya/turbowarp-plus-editor-windows` の `styles.css` が持つ。

Editor は GUI の React 16 にこれらを描画するので、React 16.14 以降に対応する。

## 検証

`npm test` でビルドし、部品を描画し、React 16.14 より新しい API を使っていないことを確かめる。VM の実際のフォントの管理と組み合わせた振る舞いは、turbowarp-plus-editor でテストしている。

## ライセンス

MPL-2.0。turbowarp-plus-editor の `packages/editor-ui` から移したコードで、同じ作者が書いたもの。移すときに GPL-3.0 から MPL-2.0 にした。由来の監査は [turbowarp-plus-packages の移行計画](https://github.com/kubohiroya/turbowarp-plus-packages/blob/main/docs/editor-migration-plan.ja.md)の「由来の監査（7b）」にある。
