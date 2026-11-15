# TurboWarp Plus Editor Fonts

[日本語](README.ja.md)

Web fonts for TurboWarp Plus Editor. A project chooses a font from a small catalog of Google Fonts by its ID, never by a URL. When a project that uses web fonts opens, the user is asked once before anything is fetched from `fonts.gstatic.com`; declining, or being offline, opens the project with each font's fallback. Packaged projects always use the fallbacks.

## Entry points

| Import | Contents |
| --- | --- |
| `.` and `./web-fonts` | `webFonts` (the catalog), `installWebFonts(vm, approve)` (connects the VM's font manager, asks `approve` before fetching, and keeps the references in the project), `webFontEditor(manager)`, `withPackagerFontFallbacks(vm, run)` and `webFontOwnsKeyEvent(event)` |
| `./web-font-dialogs` | `WebFontButton`, `WebFontForm` (adds a catalog font with its fallback), `WebFontApproval` (asks before fetching; the host passes its own `DialogFrame`) and `webFontLabel` |
| `./paint-fonts-button` | The **Fonts…** button for the Paint Editor toolbar. It renders nothing unless the host passes `onOpen` |
| `./styles.css` | The stylesheet for the dialogs and the button |

The functions take the VM and its font manager as structural types, so the package imports neither the VM nor the GUI. Load `@kubohiroya/turbowarp-plus-editor-fonts/styles.css` as a global stylesheet. The dialogs' buttons use the `tw-plus-dialog-actions` row, styled by the `styles.css` of `@kubohiroya/turbowarp-plus-editor-windows`.

React 16.14 or later is supported, because the Editor mounts these components in the GUI's React 16.

## Verification

Run `npm test` to build the package, render the components, and check that they use no React API newer than 16.14. The behavior against the VM's real font manager is tested in turbowarp-plus-editor.

## License

MPL-2.0. This code moved here from `packages/editor-ui` in turbowarp-plus-editor. The same author wrote it, and it changed from GPL-3.0 to MPL-2.0 in the move. The provenance audit is in the "由来の監査（7b）" section of the [migration plan in turbowarp-plus-packages](https://github.com/kubohiroya/turbowarp-plus-packages/blob/main/docs/editor-migration-plan.ja.md).
