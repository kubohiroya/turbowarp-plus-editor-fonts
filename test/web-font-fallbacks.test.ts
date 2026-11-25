import assert from 'node:assert/strict';
import test from 'node:test';
import {installWebFonts, webFontEditor, webFonts} from '../dist/web-fonts.js';

const fallback = {system: true, family: 'Press Start 2P', fallback: 'Pixel'};
const known = {...fallback, webFont: {provider: 'google-fonts', id: 'press-start-2p'}};

function makeHost() {
    // A minimal structural fixture for the package's manager port, not a copy of native GUI code.
    let rows: {system: boolean; family: string; fallback: string}[] = [];
    let faces: Record<string, string> = {};
    let changes = 0;
    const renderer = {async setCustomFonts(next: Record<string, string>) { faces = next; }};
    const manager = {
        addSystemFont(family: string, fallback: string) { rows.push({system: true, family, fallback}); },
        async addCustomFont() {},
        getFonts() { return rows.map(({system, family}) => ({system, name: family, family})); },
        hasFont(family: string) { return rows.some(row => row.family.toLowerCase() === family.toLowerCase()); },
        isValidCustomFont(family: string) { return family.length > 0; },
        clear() { rows = []; },
        deleteFont(index: number) { rows.splice(index, 1); },
        serializeJSON() { return rows.map(row => ({...row})); },
        async deserialize(input: unknown) {
            this.clear();
            assert.ok(Array.isArray(input));
            for (const row of input) this.addSystemFont(row.family, row.fallback);
            await this.updateRenderer();
        },
        updateRenderer() { return renderer.setCustomFonts({}); },
        changed() {}
    };
    const vm = {runtime: {fontManager: manager, renderer, emitProjectChanged() { changes++; }}};
    return {manager, vm, faces: () => faces, changes: () => changes};
}

test('unknown or mismatched catalog references do not prompt or read, and keep the system fallback', async t => {
    const {manager, vm, faces} = makeHost();
    t.after(installWebFonts(vm, async () => assert.fail('non-catalog reference prompted'),
        async () => assert.fail('non-catalog reference attempted download')));
    for (const id of ['https://example.invalid/file.woff2', 'roboto-mono']) {
        await manager.deserialize([{...known, webFont: {...known.webFont, id}}]);
        assert.deepEqual(manager.serializeJSON(), [fallback]);
        assert.deepEqual(faces(), {});
    }
});

test('refusal keeps the catalog reference and system fallback without reading bytes', async t => {
    const {manager, vm, faces} = makeHost();
    const asked: string[][] = [];
    t.after(installWebFonts(vm, async families => { asked.push(families); return false; },
        async () => assert.fail('refusal attempted download')));
    await manager.deserialize([known]);
    assert.deepEqual(asked, [[fallback.family]]);
    assert.deepEqual(manager.serializeJSON(), [known]);
    assert.deepEqual(faces(), {});
});

test('a failed catalog download keeps the reference and fallback without installing a face', async t => {
    const {manager, vm, faces} = makeHost();
    const font = webFonts.find(row => row.id === known.webFont.id);
    assert.ok(font);
    const requests: {url: string; options: RequestInit}[] = [];
    t.mock.method(globalThis, 'fetch', async (url: string, options: RequestInit) => {
        requests.push({url, options});
        throw new TypeError('offline');
    });
    t.after(installWebFonts(vm, async () => true));
    await manager.deserialize([known]);
    assert.equal(requests.length, 1);
    const {url, options} = requests[0];
    assert.equal(new URL(url).origin, 'https://fonts.gstatic.com');
    assert.equal(new URL(url).pathname, font.path);
    assert.equal(options.credentials, 'omit');
    assert.equal(options.redirect, 'error');
    assert.deepEqual(manager.serializeJSON(), [known]);
    assert.deepEqual(faces(), {});
});

test('adding an existing web font is a no-op; a new catalog font can be added with only a fallback', async t => {
    const {manager, vm, faces, changes} = makeHost();
    const reads: string[] = [];
    t.after(installWebFonts(vm, async () => false, async font => { reads.push(font.id); return undefined; }));
    await manager.deserialize([known]);
    const editor = webFontEditor(manager);
    assert.ok(editor);
    assert.equal(await editor.add(known.webFont.id, 'Pixel'), false);
    assert.deepEqual(reads, []);
    assert.equal(await editor.add('roboto-mono', 'Sans Serif'), true);
    const font = webFonts.find(row => row.id === 'roboto-mono');
    assert.ok(font);
    assert.deepEqual(reads, [font.id]);
    assert.equal(changes(), 1);
    assert.deepEqual(manager.serializeJSON(), [known, {system: true, family: font.family, fallback: 'Sans Serif',
        webFont: {provider: 'google-fonts', id: font.id}}]);
    assert.deepEqual(faces(), {});
});
