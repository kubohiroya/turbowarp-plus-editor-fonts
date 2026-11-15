import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import PaintFontsButton from '../dist/paint-fonts-button.js';
import webFontDialogs from '../dist/web-font-dialogs.js';
import {webFontOwnsKeyEvent, webFonts} from '../dist/web-fonts.js';

const intl = {formatMessage: (message: {defaultMessage: string}) => message.defaultMessage};

test('the Paint Editor fonts button appears only when the host can open the fonts dialog', () => {
    assert.equal(renderToStaticMarkup(React.createElement(PaintFontsButton, {intl})), '');
    const markup = renderToStaticMarkup(React.createElement(PaintFontsButton, {intl, onOpen() {}}));
    assert.match(markup, /class="tw-paint-fonts-button"/);
    assert.match(markup, /aria-haspopup="dialog"/);
    assert.match(markup, />Fonts…</);
});

test('the dialogs speak the editor language', () => {
    const {WebFontButton, webFontLabel} = webFontDialogs;
    assert.match(renderToStaticMarkup(React.createElement(WebFontButton, {locale: 'en'})), />Add a web font</);
    assert.match(renderToStaticMarkup(React.createElement(WebFontButton, {locale: 'ja-JP'})), />Web フォントを追加</);
    assert.equal(webFontLabel('ja'), 'Web フォント');
});

test('keys typed in the font dialogs stay with them', () => {
    const inside = {closest: (selector: string) => selector === '[data-plus-web-fonts]' ? {} : null};
    assert.equal(webFontOwnsKeyEvent({target: inside}), true);
    assert.equal(webFontOwnsKeyEvent({target: {closest: () => null}}), false);
    assert.equal(webFontOwnsKeyEvent(null), false);
    assert.ok(webFonts.every(font => font.path.startsWith('/s/')));
});
