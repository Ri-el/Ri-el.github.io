import fs from 'node:fs';

const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const baseCss = fs.readFileSync(new URL('./style.css', import.meta.url), 'utf8');
const desecrateCss = fs.readFileSync(new URL('./desecrate.css', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('./overhaul.css', import.meta.url), 'utf8');
const headerCss = fs.readFileSync(new URL('./header-fix.css', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('./app.js', import.meta.url), 'utf8');
const select = fs.readFileSync(new URL('./select.js', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('./sw.js', import.meta.url), 'utf8');
const browserSmoke = fs.readFileSync(new URL('./tools/browser-smoke.mjs', import.meta.url), 'utf8');
const runtimeData = fs.readFileSync(new URL('./data/runtime.data.js', import.meta.url), 'utf8');
const modDataBuilder = fs.readFileSync(new URL('./tools/build-mod-data.mjs', import.meta.url), 'utf8');
const currencyIndex = JSON.parse(fs.readFileSync(new URL('./data/crafting/currency-index.json', import.meta.url), 'utf8'));
const currencyBrowserSource = fs.readFileSync(new URL('./data/crafting/currency-index.data.js', import.meta.url), 'utf8').trim();
const currencyBrowserPrefix = 'window.CRAFTING_CURRENCY_INDEX=';
const currencyBrowserIndex = JSON.parse(currencyBrowserSource.slice(currencyBrowserPrefix.length, -1));
const knownBrowserSource = fs.readFileSync(new URL('./data/crafting/known-items.data.js', import.meta.url), 'utf8').trim();
const knownBrowserPrefix = 'window.CRAFTING_KNOWN_ITEMS=';
const knownBrowserIndex = JSON.parse(knownBrowserSource.slice(knownBrowserPrefix.length, -1));
const craftTabs = Array.isArray(currencyIndex.craftTabs) ? currencyIndex.craftTabs : [];
const craftRegistry = Array.isArray(currencyIndex.craftRegistry) ? currencyIndex.craftRegistry : [];

let passed = 0;
let failed = 0;

function check(name, condition) {
  if (condition) {
    passed++;
    console.log(`PASS  ${name}`);
  } else {
    failed++;
    console.error(`FAIL  ${name}`);
  }
}

const stylesheetOrder = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)]
  .map(match => match[1]);
check('overhaul.css is the last external stylesheet', stylesheetOrder.at(-1) === 'overhaul.css');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
check('all HTML ids are unique', ids.length === new Set(ids).size);

for (const id of [
  'main-content', 'currency-panel', 'jewel-panel', 'stash-panel',
  'craft-inventory-controls', 'craft-item-search', 'craft-category-filter',
  'craft-applicable-only', 'craft-show-deprecated', 'craft-result-count', 'craft-item-description',
  'craft-item-description-title', 'craft-item-description-text',
  'craft-tab-list', 'craft-tab-panels', 'well-modal', 'stash-grid', 'jewel-tooltip',
  'undo-btn', 'redo-btn', 'reset-btn',
  'item-art-stage', 'item-art', 'item-art-aura',
  'base-detail-list', 'quality-list', 'socket-list', 'implicit-list', 'concrete-base-picker',
  'base-picker-search', 'base-picker-reset', 'base-picker-list',
  'base-picker-attribute-field', 'base-picker-attribute-filter',
  'base-change-confirmation', 'base-confirm-cancel', 'base-confirm-apply',
]) {
  check(`#${id} exists`, ids.includes(id));
}

const expectedTabs = [
  'Currency', 'Quality', 'Socketing / Augments', 'Ritual / Omens', 'Essences',
  'Abyss', 'Breach / Genesis', 'Delirium / Instilling', 'Runeforging',
  'Corruption / Sacrifice',
];
const expectedTabIds = [
  'currency', 'quality', 'socketing', 'ritual', 'essences',
  'abyss', 'breach', 'delirium', 'runeforging', 'corruption',
];
check('all ten crafting tabs are authoritative data in stable order',
  craftTabs.length === 10 &&
  JSON.stringify(craftTabs.map(tab => tab.id)) === JSON.stringify(expectedTabIds) &&
  JSON.stringify(craftTabs.map(tab => tab.label)) === JSON.stringify(expectedTabs));
check('HTML contains structural inventory containers instead of authored tabs or cards',
  /id="craft-tab-list"[^>]*role="tablist"/.test(html) &&
  /id="craft-tab-panels"[^>]*class="craft-tab-panels"/.test(html) &&
  !/data-craft-tab=|data-craft-panel=|data-craft-id=/.test(html));
check('crafting inventory controls are accessible structural markup',
  /id="craft-inventory-controls"[^>]*role="group"[^>]*aria-label=/.test(html) &&
  /id="craft-item-search"[^>]*type="search"/.test(html) &&
  /id="craft-category-filter"/.test(html) &&
  /id="craft-applicable-only"[^>]*type="checkbox"/.test(html) &&
  /name="craft-inventory-mode"[^>]*value="available"[^>]*checked/.test(html) &&
  /name="craft-inventory-mode"[^>]*value="known"/.test(html) &&
  /id="craft-result-count"[^>]*aria-live="polite"/.test(html) &&
  /id="craft-item-description"[^>]*role="status"[^>]*aria-live="polite"/.test(html));

check('obsolete crafting-stash labels are absent',
  !/Workbench items/i.test(html) && !/PoE2 0\.5\.4/i.test(html));
check('Crafting Stash remains present and centred',
  /<h2 class="panel-title">Crafting Stash<\/h2>/.test(html) &&
  /\.crafting-stash-heading\s*\{[\s\S]*?justify-content:\s*center;/.test(css) &&
  /#currency-panel \.crafting-stash-heading \.panel-title\s*\{[\s\S]*?text-align:\s*center;/.test(css));
check('Active Item is absent and Crafting Workbench remains',
  !/Active item/i.test(html) && /<h2>Crafting workbench<\/h2>/i.test(html));
check('workbench heading divider is removed',
  /\.workbench-heading\s*\{[\s\S]*?border-bottom:\s*0;/.test(css));

const ilvlSliderMarkup = html.match(/<div id="ilvl-slider"[^>]*>/)?.[0] || '';
const setupIlvlSliderStart = app.indexOf('function setupIlvlSlider()');
const setupIlvlSliderEnd = setupIlvlSliderStart >= 0
  ? app.indexOf('\n// ============================================================', setupIlvlSliderStart)
  : -1;
const setupIlvlSliderSource = setupIlvlSliderStart >= 0
  ? app.slice(setupIlvlSliderStart, setupIlvlSliderEnd >= 0 ? setupIlvlSliderEnd : app.length)
  : '';
const updateIlvlUIStart = app.indexOf('function updateIlvlUI(ilvl)');
const updateIlvlUISource = updateIlvlUIStart >= 0
  ? app.slice(updateIlvlUIStart, setupIlvlSliderStart >= 0 ? setupIlvlSliderStart : app.length)
  : '';
const ilvlMarkerStart = baseCss.indexOf('.ilvl-knob {');
const ilvlMarkerEnd = baseCss.indexOf('.ilvl-label {', ilvlMarkerStart);
const ilvlMarkerCss = ilvlMarkerStart >= 0
  ? baseCss.slice(ilvlMarkerStart, ilvlMarkerEnd >= 0 ? ilvlMarkerEnd : baseCss.length)
  : '';
check('item-level slider is focusable and exposes complete keyboard operation',
  /role="slider"/.test(ilvlSliderMarkup) && /tabindex="0"/.test(ilvlSliderMarkup) &&
  /slider\.addEventListener\(['"]keydown['"]/.test(setupIlvlSliderSource) &&
  ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'Home', 'End', 'Enter', ' ']
    .every(key => setupIlvlSliderSource.includes(`'${key}'`)) &&
  /event\.preventDefault\(\)/.test(setupIlvlSliderSource) &&
  /applyValue\(/.test(setupIlvlSliderSource));
check('item-level slider names itself and exposes locked state accessibly',
  /aria-label="Item level"/.test(ilvlSliderMarkup) &&
  /aria-valuetext="83, unlocked"/.test(ilvlSliderMarkup) &&
  /setAttribute\(['"]aria-valuetext['"]/.test(updateIlvlUISource) &&
  /ilvlLocked\s*\?\s*`\$\{ilvl\}, locked`\s*:\s*`\$\{ilvl\}, unlocked`/.test(updateIlvlUISource));
check('pointer activation focuses the item-level slider without scrolling',
  /slider\.focus\(\{\s*preventScroll:\s*true\s*\}\)/.test(setupIlvlSliderSource));
check('item-level marker separates a 22px hit target from an 8px diamond',
  /\.ilvl-knob\s*\{[^}]*width:\s*22px;[^}]*height:\s*22px;[^}]*margin-left:\s*0;[^}]*margin-top:\s*0;[^}]*transform:\s*translate\(-50%,\s*-50%\);/s.test(ilvlMarkerCss) &&
  /\.ilvl-knob::before\s*\{[^}]*content:\s*['"]{2};[^}]*width:\s*8px;[^}]*height:\s*8px;[^}]*box-sizing:\s*border-box;[^}]*transform:\s*translate\(-50%,\s*-50%\) rotate\(45deg\) scale\(var\(--ilvl-marker-scale\)\);/s.test(ilvlMarkerCss) &&
  !/radial-gradient|border-radius:\s*50%/.test(ilvlMarkerCss));
check('item-level diamond has stable hover, focus, active, and locked state styling',
  /\.ilvl-slider:hover \.ilvl-knob,[\s\S]*?\.ilvl-slider:focus-visible \.ilvl-knob,[\s\S]*?\.ilvl-slider:active \.ilvl-knob\s*\{[^}]*--ilvl-marker-scale:\s*1\.1[0-5];/s.test(ilvlMarkerCss) &&
  /\.ilvl-slider:focus-visible\s*\{[^}]*outline:\s*none;/s.test(ilvlMarkerCss) &&
  /\.ilvl-knob\.locked\s*\{[^}]*--ilvl-marker-border:[^;}]+;[^}]*--ilvl-marker-glow:[^;}]+;/s.test(ilvlMarkerCss) &&
  !/\.ilvl-(?:slider:hover|knob\.locked)[^{]*\{[^}]*transform\s*:/s.test(ilvlMarkerCss));
check('locked item-level diamond retains a distinct keyboard focus ring',
  /\.ilvl-slider:focus-visible \.ilvl-knob\.locked\s*\{[^}]*--ilvl-marker-border:[^;}]+;[^}]*--ilvl-marker-glow:\s*0 0 0 2px[^;}]+;/s.test(ilvlMarkerCss));
check('reduced motion disables item-level marker transitions',
  /@media \(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.ilvl-knob::before\s*\{[^}]*transition:\s*none;/s.test(baseCss));

check('crafting inventory classifies every retained source item exactly once',
  currencyIndex.counts.entries === currencyIndex.entries.length &&
  currencyIndex.counts.unclassified === 0 &&
  currencyIndex.entries.every(entry => currencyIndex.allowedClassifications.includes(entry.classification)));
const visibleCraftDefinitions = craftRegistry.filter(definition => definition.visible === true);
const craftIds = visibleCraftDefinitions.map(definition => definition.craftId);
check('authoritative registry audits 531 definitions and exposes all non-deprecated known items',
  currencyIndex.counts.runtimeDefinitions === 419 &&
  Object.keys(currencyIndex.runtimeRegistry).length === 419 &&
  craftRegistry.length === 531 && visibleCraftDefinitions.length === 522 &&
  craftIds.length === new Set(craftIds).size &&
  craftIds.every(id => currencyIndex.runtimeRegistry[id] ||
    craftRegistry.find(definition => definition.craftId === id)?.sourceItemId != null));
check('startup browser registry contains all 415 available definitions',
  currencyBrowserSource.startsWith(currencyBrowserPrefix) &&
  currencyBrowserIndex.craftRegistry.length === 415 &&
  currencyBrowserIndex.craftRegistry.every(definition => definition.supported === true));
check('lazy browser registry contains every retained definition',
  knownBrowserSource.startsWith(knownBrowserPrefix) &&
  knownBrowserIndex.craftRegistry.length === craftRegistry.length &&
  new Set(knownBrowserIndex.craftRegistry.map(definition => definition.craftId)).size === 531);
check('every visible definition has generated-UI metadata and a valid tab',
  visibleCraftDefinitions.every(definition =>
    definition.craftId && definition.displayName && definition.description && definition.iconId &&
    expectedTabIds.includes(definition.tab) && typeof definition.supported === 'boolean'));
check('shared artwork is resolved by registry icon IDs',
  craftRegistry.find(definition => definition.craftId === 'greater-chaos')?.iconId === 'chaos' &&
  craftRegistry.find(definition => definition.craftId === 'essence-abyss')?.iconId === 'abyss-essence');

check('legacy standalone Omens and Abyssal panel is removed', !/id="desecrate-panel"/.test(html));
check('existing Ritual, Abyss, and Corruption controls retain their registry categories',
  craftRegistry.find(definition => definition.craftId === 'omen-whittling')?.tab === 'ritual' &&
  craftRegistry.find(definition => definition.craftId === 'preserved-cranium')?.tab === 'abyss' &&
  craftRegistry.find(definition => definition.craftId === 'essence-abyss')?.tab === 'abyss' &&
  craftRegistry.find(definition => definition.craftId === 'vaal')?.tab === 'corruption');
const implementedEssences = craftRegistry.filter(definition => definition.category === 'essences');
check('implemented Essence definitions are available with exact source identities and handlers',
  implementedEssences.length === 80 &&
  implementedEssences.every(definition =>
    definition.supported && definition.visible && definition.handler === 'applyEssence' &&
    Number(definition.operationOptions?.essenceItemId) === Number(definition.sourceItemId) &&
    ['magic_to_rare_add', 'rare_remove_add'].includes(definition.operationOptions?.transition)) &&
  implementedEssences.filter(definition => definition.confidence === 'verified').length === 57 &&
  implementedEssences.filter(definition => definition.confidence === 'inferred').length === 23);
const implementedSocketing = craftRegistry.filter(definition => definition.category === 'socketing' && definition.supported);
check('implemented socket definitions are visibly inferred and retain exact dispatch identities',
  implementedSocketing.length === 288 &&
  implementedSocketing.every(definition => definition.confidence === 'inferred') &&
  implementedSocketing.filter(definition => definition.handler === 'applyArtificerOrb').length === 1 &&
  implementedSocketing.filter(definition => definition.handler === 'applySocketable').length === 287 &&
  /definition\.confidence === 'inferred'[\s\S]*?\? 'Inferred'/.test(app));
check('unsupported visible definitions carry a specific blocker',
  visibleCraftDefinitions.filter(definition => !definition.supported).length > 0 &&
  visibleCraftDefinitions.filter(definition => !definition.supported).every(definition => {
    const reason = definition.disabledReason || definition.blocker || '';
    return reason.length > 'Unsupported — verification required'.length;
  }));
check('quality audit cards remain visible but cannot dispatch unverified mutations',
  visibleCraftDefinitions.filter(definition => definition.category === 'quality').length === 8 &&
  visibleCraftDefinitions.filter(definition => definition.category === 'quality').every(definition =>
    definition.supported === false && definition.handler == null &&
    /quality|increment|mutation|cap/i.test(definition.disabledReason || definition.blocker || '')));
check('Vaal remains visible but blocked while outcome probabilities are unverified',
  craftRegistry.find(definition => definition.craftId === 'vaal')?.supported === false &&
  craftRegistry.find(definition => definition.craftId === 'vaal')?.handler == null &&
  /Vaal Orb outcomes and probabilities are not verified/i.test(craftRegistry.find(definition => definition.craftId === 'vaal')?.disabledReason || ''));
check('encounter resources are retained for parity but are not workbench controls',
  !visibleCraftDefinitions.some(definition => /verisium|liquid[_-]verisium|hiveblood|wombgift/i.test(
    `${definition.craftId} ${definition.engineAction || ''} ${definition.displayName}`)));

check('Well of Souls starts hidden', /<div id="well-modal" class="well-modal" hidden>/.test(html));
check('hidden state wins over panel rules', /\[hidden\]\s*\{\s*display:\s*none\s*!important;\s*\}/.test(css));
const openWellStart = app.indexOf('function openWell()');
const renderWellStart = app.indexOf('\nfunction renderWell()', openWellStart);
const openWellSource = openWellStart >= 0 && renderWellStart > openWellStart
  ? app.slice(openWellStart, renderWellStart)
  : '';
const closeWellStart = app.indexOf('function closeWell()');
const clearDesecrationStart = app.indexOf('\nfunction clearDesecration()', closeWellStart);
const closeWellSource = closeWellStart >= 0 && clearDesecrationStart > closeWellStart
  ? app.slice(closeWellStart, clearDesecrationStart)
  : '';
const clearDesecrationEnd = app.indexOf('\nfunction showRevealPanel()', clearDesecrationStart);
const clearDesecrationSource = clearDesecrationStart >= 0 && clearDesecrationEnd > clearDesecrationStart
  ? app.slice(clearDesecrationStart, clearDesecrationEnd)
  : '';
const wellModalRuleStart = desecrateCss.indexOf('.well-modal {');
const wellModalRuleEnd = desecrateCss.indexOf('\n}', wellModalRuleStart);
const wellModalRule = wellModalRuleStart >= 0
  ? desecrateCss.slice(wellModalRuleStart, wellModalRuleEnd >= 0 ? wellModalRuleEnd : desecrateCss.length)
  : '';
const wellRevealStart = desecrateCss.indexOf('@keyframes wellReveal');
const wellOptionStart = desecrateCss.indexOf('@keyframes wellOptionIn', wellRevealStart);
const wellRevealKeyframes = wellRevealStart >= 0 && wellOptionStart > wellRevealStart
  ? desecrateCss.slice(wellRevealStart, wellOptionStart)
  : '';
check('opening the Well does not force synchronous layout',
  /wellModal\.hidden\s*=\s*false/.test(openWellSource) &&
  /wellModal\.classList\.add\(['"]well-revealing['"]\)/.test(openWellSource) &&
  !/offsetWidth|offsetHeight|getBoundingClientRect|getComputedStyle/.test(openWellSource));
check('opening and closing the Well pauses and resumes background animation state',
  /document\.body\.classList\.add\(['"]well-open['"]\)/.test(openWellSource) &&
  /document\.body\.classList\.remove\(['"]well-open['"]\)/.test(closeWellSource) &&
  /body\.well-open[\s\S]*?animation-play-state:\s*paused/.test(desecrateCss));
check('Well overlay and reveal animation avoid paint-heavy filters',
  wellModalRule.length > 0 && wellRevealKeyframes.length > 0 &&
  !/(?:backdrop-filter|filter)\s*:/.test(wellModalRule) &&
  !/filter\s*:/.test(wellRevealKeyframes));
check('Well open only renders its choice list, not the item or crafting inventory',
  (openWellSource.match(/\brenderWell\(\)/g) || []).length === 1 &&
  !/renderItem|renderCraft|renderCurrency|renderInventory/.test(openWellSource));
check('clearing Desecration removes stale Well content and controls',
  /wellOptions\.replaceChildren\(\)/.test(clearDesecrationSource) &&
  /wellSub\.textContent\s*=\s*['"]['"]/.test(clearDesecrationSource) &&
  /wellReroll\.hidden\s*=\s*true/.test(clearDesecrationSource));
check('Well and unrevealed animations respect reduced motion',
  /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.well-modal[\s\S]*?\.mod-line\.unrevealed-mod[\s\S]*?animation:\s*none/.test(desecrateCss));
const readyKeyframeStart = css.indexOf('@keyframes workbenchReadyBreath');
const readyKeyframeEnd = css.indexOf('@media (prefers-reduced-motion: reduce)', readyKeyframeStart);
const readyKeyframeCss = css.slice(readyKeyframeStart, readyKeyframeEnd);
check('only the workbench READY dot has the breathing animation',
  /\.workbench-state \.status-dot\s*\{\s*animation:\s*workbenchReadyBreath 2\.8s ease-in-out infinite;\s*\}/.test(css) &&
  /@keyframes workbenchReadyBreath/.test(css) &&
  !/(?:^|\n)\.status-dot\s*\{[^}]*animation\s*:/s.test(css) &&
  !/transform\s*:/.test(readyKeyframeCss));
check('READY text stays static and reduced motion keeps a steady dot',
  /<span class="workbench-state"><i class="status-dot"><\/i> Ready<\/span>/.test(html) &&
  /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.workbench-state \.status-dot\s*\{[\s\S]*?animation:\s*none;/.test(css));
check('desktop workbench keeps crafting stash, item, and item stash in one viewport row',
  /'currency item stash'/.test(css) && /height:\s*calc\(100dvh\s*-\s*74px\)/.test(css));
const requestedViewports = [[1920, 1080], [1440, 900], [1366, 768]];
const desktopGridMinimum = 320 + 430 + 285 + (2 * 12) + (2 * 16);
check('all requested 100% viewports use the compact desktop layout without track overflow',
  /@media \(min-width:\s*1101px\)/.test(css) && /min-height:\s*640px/.test(css) &&
  requestedViewports.every(([width, height]) => width >= 1101 && width >= desktopGridMinimum && height >= 640));
check('crafting panels scroll internally',
  /\.craft-tab-panel\s*\{[\s\S]*?overflow-y:\s*auto;/.test(css));
check('short desktop layout reserves a real scrollable crafting inventory',
  /\.craft-tab-list\s*\{[\s\S]*?display:\s*flex;[\s\S]*?overflow-x:\s*auto;/.test(css) &&
  /\.craft-item-description span\s*\{\s*display:\s*none;\s*\}/.test(css) &&
  /#currency-panel \.crafting-actions\s*\{[\s\S]*?grid-template-columns:/.test(css));
check('desktop does not use CSS zoom or scaled workspace layout',
  !/(?:^|[;{])\s*zoom\s*:/m.test(css) &&
  !/#(?:craft-view|main-content|currency-panel|jewel-panel|stash-panel)[^{]*\{[^}]*transform\s*:\s*scale/m.test(css));

const renderInventoryMatch = app.match(/function (renderCraft(?:ing)?Inventory)\s*\(/);
const renderInventoryStart = renderInventoryMatch ? app.indexOf(`function ${renderInventoryMatch[1]}(`) : -1;
const renderInventoryEnd = renderInventoryStart >= 0 ? app.indexOf('\nfunction ', renderInventoryStart + 10) : -1;
const renderInventoryBody = renderInventoryStart >= 0
  ? app.slice(renderInventoryStart, renderInventoryEnd >= 0 ? renderInventoryEnd : app.length)
  : '';
const createCraftCardStart = app.indexOf('function createCraftCard(');
const createCraftCardEnd = createCraftCardStart >= 0 ? app.indexOf('\nfunction ', createCraftCardStart + 10) : -1;
const createCraftCardSource = createCraftCardStart >= 0
  ? app.slice(createCraftCardStart, createCraftCardEnd >= 0 ? createCraftCardEnd : app.length)
  : '';
const renderInventorySource = createCraftCardSource + renderInventoryBody;
check('craft tabs and controls are rendered from the local authoritative registry',
  renderInventorySource.length > 0 &&
  /CRAFTING_CURRENCY_INDEX(?:\?\.)?\.?(?:craftTabs|craftRegistry)/.test(app) &&
  /createElement\(['"]button['"]\)/.test(renderInventorySource) &&
  /dataset\.craftTab\s*=/.test(renderInventorySource) &&
  /dataset\.craftPanel\s*=/.test(renderInventorySource) &&
  /dataset\.craftId\s*=/.test(renderInventorySource) &&
  /replaceChildren/.test(renderInventorySource));
check('generated tabs retain the tablist and panel accessibility contract',
  /setAttribute\(['"]role['"],\s*['"]tab['"]\)/.test(renderInventorySource) &&
  /setAttribute\(['"]aria-controls['"]/.test(renderInventorySource) &&
  /setAttribute\(['"]role['"],\s*['"]tabpanel['"]\)/.test(renderInventorySource) &&
  /setAttribute\(['"]aria-labelledby['"]/.test(renderInventorySource));
check('crafting search, category, and Applicable-only filters share one filter pass',
  /getElementById\(['"]craft-item-search['"]\)/.test(app) &&
  /getElementById\(['"]craft-category-filter['"]\)/.test(app) &&
  /getElementById\(['"]craft-applicable-only['"]\)/.test(app) &&
  /function filterCraft(?:ing)?Inventory\s*\(/.test(app) &&
  /craftItemSearch[\s\S]*?addEventListener\(['"]input['"]/.test(app) &&
  /craftCategoryFilter[\s\S]*?addEventListener\(['"]change['"]/.test(app) &&
  /craftApplicableOnly[\s\S]*?addEventListener\(['"]change['"]/.test(app));
check('hover and keyboard focus update the persistent registry description',
  /getElementById\(['"]craft-item-description-title['"]\)/.test(app) &&
  /getElementById\(['"]craft-item-description-text['"]\)/.test(app) &&
  /function renderCraft(?:ing)?Description\s*\(/.test(app) &&
  /addEventListener\(['"]focusin['"]/.test(app) &&
  /addEventListener\(['"](?:pointerover|mouseover)['"]/.test(app));
check('tab switching only updates tab presentation and persistence',
  /function setActiveCraftTab\([\s\S]*?panel\.hidden\s*=\s*panel\.dataset\.craftPanel\s*!==\s*tabId;[\s\S]*?localStorage\.setItem\(CRAFT_TAB_STORAGE_KEY/.test(app));
check('tab controls support keyboard navigation',
  /event\.key === 'ArrowRight'[\s\S]*?event\.key === 'Home'[\s\S]*?event\.key === 'End'[\s\S]*?event\.key === 'Enter'/.test(app));
check('tab strip consumes wheel input only while horizontal movement is possible',
  /craftTabList\?\.addEventListener\('wheel'[\s\S]*?scrollWidth <= strip\.clientWidth[\s\S]*?before <= 0[\s\S]*?before >= maximum[\s\S]*?scrollLeft !== before\) event\.preventDefault\(\)[\s\S]*?passive: false/.test(app) &&
  !/document\.addEventListener\('wheel'/.test(app) &&
  !/craftCategoryFilter[^\n]*addEventListener\('wheel'/.test(app));
check('only the active category is rendered and card icons are lazy',
  /function renderActiveCraftPanel\(\)[\s\S]*?panel\.replaceChildren\(\)[\s\S]*?inventoryDefinitionsForTab\(tab\.id\)[\s\S]*?appendCraftCards/.test(app) &&
  /IntersectionObserver[\s\S]*?lazyIconId/.test(app));
check('All known items loads the separate local catalog on demand',
  /function loadKnownCraftDefinitions\(\)[\s\S]*?data\/crafting\/known-items\.data\.js/.test(app) &&
  /control\.value === 'known'[\s\S]*?await loadKnownCraftDefinitions\(\)/.test(app));
check('inventory counts are active-category scoped and statuses are textual',
  /categoryCounts\?\.\[activeCraftTab\][\s\S]*?available[\s\S]*?known/.test(app) &&
  /craft-status-[\s\S]*?textContent = status/.test(app) &&
  /No implemented [\s\S]*?All known items/.test(app));
check('event listener setup is guarded against duplicate binding',
  /if \(eventsBound\) return;[\s\S]*?eventsBound = true;[\s\S]*?setupCraftTabs\(\);/.test(app) &&
  renderInventoryStart >= 0);
const initStart = app.indexOf('async function init()');
const initEnd = app.indexOf('\n// Reset all omen-related UI state', initStart);
const initSource = app.slice(initStart, initEnd);
check('core engine initialization precedes and survives registry UI initialization',
  initSource.indexOf('normalizedIndexes = buildNormalizedDataIndexes') >= 0 &&
  initSource.indexOf('createEngine(currentJewelType)') > initSource.indexOf('normalizedIndexes = buildNormalizedDataIndexes') &&
  initSource.indexOf('renderCraftingInventory()') > initSource.indexOf('createEngine(currentJewelType)') &&
  initSource.indexOf('validateCraftRegistry()') > initSource.indexOf('renderCraftingInventory()') &&
  /catch \(registryError\)[\s\S]*?Crafting inventory unavailable:[\s\S]*?setupEventListeners\(\)/.test(initSource));
check('real-browser entry smoke covers representative released item classes',
  ['Jewels', 'Amulets', 'Rings', 'Gloves', 'Body Armours', 'Bows', 'Life Flasks', 'Charms']
    .every(label => browserSmoke.includes(`['${label}',`)) &&
  /window\.MOD_BASES[\s\S]*?craftRegistryLength[\s\S]*?getNormalizedIndexCounts/.test(browserSmoke) &&
  /selectHidden[\s\S]*?craftVisible[\s\S]*?selectedBaseItemId[\s\S]*?tooltipRendered/.test(browserSmoke) &&
  /#back-to-select/.test(browserSmoke));
check('history snapshots preserve armed and consumed Omen state',
  /omens:\s*Array\.from\(selectedOmens\)[\s\S]*?omenOfLight:\s*omenOfLightActive[\s\S]*?craftOmen:\s*selectedCraftOmen/.test(app) &&
  /selectedOmens\s*=\s*new Set\([\s\S]*?selectedCraftOmen\s*=\s*snap\.craftOmen/.test(app));
check('history uses exact craft IDs, visible tiers, quantities, and currency-use wording',
  /engine\.recordCurrencyUse\(definition\.craftId\)/.test(app) &&
  /CRAFT_DEFINITION_BY_COUNTER_KEY\.set\(definition\.craftId/.test(app) &&
  /tier === 3 \? 'III'[\s\S]*?tier === 2 \? 'II'[\s\S]*?tier === 1 \? 'I'/.test(app) &&
  /currency use\$\{total === 1 \? '' : 's'\}/.test(app) &&
  /aria-label=/.test(app) && /\\u00d7\$\{model\.count\}/.test(app));
const executeCraftStart = app.indexOf('function executeCraftOperation(');
const executeCraftEnd = executeCraftStart >= 0 ? app.indexOf('\nfunction ', executeCraftStart + 10) : -1;
const executeCraftSource = executeCraftStart >= 0
  ? app.slice(executeCraftStart, executeCraftEnd >= 0 ? executeCraftEnd : app.length)
  : '';
const prevalidationIndex = executeCraftSource.search(/(?:resolveCraftDisabledReason|disabledReasonForDefinition|validateCraftTarget)\s*\(/);
const snapshotIndex = executeCraftSource.indexOf('snapshotState(');
const handlerIndex = executeCraftSource.search(/(?:invokeCraftHandler|operationHandlers|definition\.handler)/);
check('central operation pipeline prevalidates before snapshot and mutation dispatch',
  executeCraftSource.length > 0 && prevalidationIndex >= 0 && snapshotIndex > prevalidationIndex &&
  handlerIndex > snapshotIndex && /if\s*\([^)]*(?:reason|validation)[^)]*\)[\s\S]*?return/.test(executeCraftSource));
check('central operation pipeline records history and consumes Omens only after success',
  /result\.success[\s\S]*?pushUndo\(/.test(executeCraftSource) &&
  /result\.success[\s\S]*?consumeCraftOmen\(/.test(executeCraftSource));
check('implemented Essence and socket dispatch forwards each definition exact normalized item ID',
  /case 'applyEssence': return eng\[definition\.handler\]\(definition\.operationOptions\?\.essenceItemId\)/.test(app) &&
  /case 'applyArtificerOrb': return eng\[definition\.handler\]\(\)/.test(app) &&
  /case 'applySocketable': return eng\[definition\.handler\]\(definition\.operationOptions\?\.socketableItemId\)/.test(app) &&
  /engine\.recordCurrencyUse\(definition\.craftId\)/.test(executeCraftSource));
check('ordinary, Greater, and Perfect Essence history keys remain separate in the UI registry',
  ['essence-99', 'essence-111', 'essence-125'].every(craftId =>
    implementedEssences.some(definition => definition.craftId === craftId)) &&
  new Set(['essence-99', 'essence-111', 'essence-125']).size === 3);
check('browser and engine crafting RNG can share an injected deterministic source',
  /window\.CraftForge\.setCraftingRandomSource\s*=/.test(app) &&
  /craftingRandomSource\s*=\s*source[\s\S]*?engine\.setRandomSource\(source\)/.test(app) &&
  /setRandomSource\(rng = null\)/.test(fs.readFileSync(new URL('./crafting.js', import.meta.url), 'utf8')) &&
  /_randomFloat\(\)[\s\S]*?this\._rng \? this\._rng\(\) : Math\.random\(\)/.test(fs.readFileSync(new URL('./crafting.js', import.meta.url), 'utf8')));
const commitForesightStart = app.indexOf('function commitForesight(currency)');
const commitForesightEnd = app.indexOf('\nfunction commitDesecrationForesight', commitForesightStart);
const commitForesightSource = app.slice(commitForesightStart, commitForesightEnd);
check('Essence of the Abyss uses the Hinekora foresight commit path',
  visibleCraftDefinitions.some(definition => definition.craftId === 'essence-abyss' &&
    definition.engineAction === 'essence_abyss' && definition.actionType === 'direct') &&
  /const FORESEEABLE = new Set\(VISIBLE_CRAFT_DEFINITIONS[\s\S]*?definition\.actionType === 'direct'/.test(app) &&
  /engine\.getItem\(\)\.hinekoraLocked && FORESEEABLE\.has\(currency\)[\s\S]*?commitForesight\(currency\)/.test(executeCraftSource));
check('foresight commit preserves undo and consumes Hinekora lock',
  /const before = snapshotState\(engine\.getItem\(\)\);[\s\S]*?engine\.loadItem\(seal\.afterItem, seal\.afterPending\);[\s\S]*?engine\.recordCurrencyUse\(craftIdForAction\(currency\)\);[\s\S]*?engine\.clearHinekoraLock\(\);[\s\S]*?pushUndo\(before\)/.test(commitForesightSource));
check('foresight rollback preserves pending Desecration state',
  /function computeForesight\(currency\)[\s\S]*?const snapshotPending = engine\.getPendingDesecration\(\)[\s\S]*?engine\.loadItem\(snapshot, snapshotPending\)/.test(app) &&
  /function computeDesecrationForesight\(bone\)[\s\S]*?const snapshotPending = engine\.getPendingDesecration\(\)[\s\S]*?engine\.loadItem\(snapshot, snapshotPending\)/.test(app));
check('Omen of Light accepts any eligible Desecrated modifier and is consumed exactly once',
  /omen === 'omen_of_light'[\s\S]*?allItemMods\(item\)\.some\(mod => mod\.desecrated && !mod\.mark && !mod\.fractured\)[\s\S]*?eligible Desecrated modifier/.test(app) &&
  /currency === 'annulment' && omenOfLightActive[\s\S]*?engine\.recordCurrencyUse\(craftIdForOmen\('omen_of_light'\)\)/.test(app) &&
  /engine\.clearHinekoraLock\(\)[\s\S]*?currency === 'annulment' && omenOfLightActive[\s\S]*?engine\.recordCurrencyUse\(craftIdForOmen\('omen_of_light'\)\)/.test(app));
const inventoryEventsMatch = app.match(/function ((?:setup|bind)Craft(?:ing)?InventoryEvents)\s*\(/);
const inventoryEventsStart = inventoryEventsMatch ? app.indexOf(`function ${inventoryEventsMatch[1]}(`) : -1;
const inventoryEventsEnd = inventoryEventsStart >= 0 ? app.indexOf('\nfunction ', inventoryEventsStart + 10) : -1;
const inventoryEventsSource = inventoryEventsStart >= 0
  ? app.slice(inventoryEventsStart, inventoryEventsEnd >= 0 ? inventoryEventsEnd : app.length)
  : '';
check('pointer, contextmenu, and drag interactions use delegated craft-card events',
  inventoryEventsSource.length > 0 &&
  ['click', 'contextmenu', 'dragstart', 'dragend'].every(type =>
    inventoryEventsSource.includes(`addEventListener('${type}'`) ||
    inventoryEventsSource.includes(`addEventListener("${type}"`)) &&
  /closest\(['"]\[data-craft-id\]['"]\)/.test(inventoryEventsSource));
check('keyboard activation reaches the same craft dispatcher as pointer activation',
  /function dispatchCraft(?:ing)?Control\s*\(/.test(app) &&
  /createElement\(['"]button['"]\)/.test(createCraftCardSource) && /button\.type\s*=\s*['"]button['"]/.test(createCraftCardSource) &&
  /addEventListener\(['"]keydown['"][\s\S]*?ArrowRight[\s\S]*?\.focus\(\)/.test(inventoryEventsSource) &&
  /addEventListener\(['"]click['"][\s\S]*?dispatchCraft(?:ing)?Control/.test(inventoryEventsSource));
const setCraftButtonStateStart = app.indexOf('function setCraftButtonState(');
const setCraftButtonStateEnd = setCraftButtonStateStart >= 0
  ? app.indexOf('\nfunction ', setCraftButtonStateStart + 10)
  : -1;
const setCraftButtonStateSource = setCraftButtonStateStart >= 0
  ? app.slice(setCraftButtonStateStart, setCraftButtonStateEnd >= 0 ? setCraftButtonStateEnd : app.length)
  : '';
check('aria-disabled crafting controls remain focusable and expose their exact reason',
  /setAttribute\(['"]aria-disabled['"]/.test(renderInventorySource + setCraftButtonStateSource) &&
  !/button\.disabled\s*=/.test(setCraftButtonStateSource) &&
  /craft-item-card\[aria-disabled="true"\]:focus-visible|\[data-craft-id\]\[aria-disabled="true"\]:focus-visible/.test(css));
check('stable crafting IDs resolve directly through the generated registry',
  /const CRAFTING_CURRENCY_INDEX = window\.CRAFTING_CURRENCY_INDEX/.test(app) &&
  /craftRegistry/.test(app) &&
  /function definitionForElement\(element\)[\s\S]*?element\.dataset\.craftId/.test(app) &&
  !/function directCraft\(|function omenCraft\(/.test(app));
check('legacy labels and data attributes do not select crafting behaviour',
  !/dataset\.(?:currency|bone|omen|craftOmen)\b/.test(app) &&
  !/getAttribute\(['"]data-(?:currency|bone|omen|craft-omen)/.test(app));
check('enabled registry entries require real validators and handlers',
  visibleCraftDefinitions.filter(definition => definition.supported).every(definition =>
    definition.disabledReasonHandler && definition.handler) &&
  /function validateCraftRegistry\(\)[\s\S]*?disabledReasonHandler[\s\S]*?handler/.test(app));
check('unsupported registry entries cannot dispatch mutations',
  visibleCraftDefinitions.filter(definition => !definition.supported).every(definition =>
    !definition.handler && (definition.disabledReason || definition.blocker)) &&
  /if\s*\([^)]*!(?:definition\.supported|definition\.handler)[^)]*\)[\s\S]*?return/.test(executeCraftSource));
check('generic icon loading covers every crafting tab without fetch',
  /document\.querySelectorAll\('\[data-craft-id\]'\)/.test(app) &&
  /assets\/icons\/\$\{iconId\}\.png/.test(app) && !/fetch\s*\(/.test(app));
check('missing icons retain generated placeholders and icon loading is idempotent',
  visibleCraftDefinitions.every(definition => definition.iconFallback) &&
  /currency-abbr/.test(renderInventorySource) &&
  /img\.hidden = true/.test(app) &&
  /addEventListener\('load'[\s\S]*?has-real-icon/.test(app) &&
  /addEventListener\('error'[\s\S]*?img\.remove\(\)/.test(app) &&
  /if \(existing\) return existing/.test(app));
check('custom cursor icon resolution is registry-driven',
  /function iconIdForAction\([\s\S]*?CRAFT_DEFINITION_BY_ACTION/.test(app) &&
  /function setOrbIcon\([\s\S]*?iconIdForAction/.test(app));
check('compiled runtime data loads before the crafting engine',
  html.indexOf('data/runtime.data.js') > html.indexOf('data/desecrated-mods.data.js') &&
  html.indexOf('data/runtime.data.js') < html.indexOf('crafting.js') &&
  !html.includes('data/normalized.data.js'));
check('currency index loads locally before the runtime registry',
  html.indexOf('data/crafting/currency-index.data.js') > html.indexOf('data/runtime.data.js') &&
  html.indexOf('data/crafting/currency-index.data.js') < html.indexOf('app.js'));
check('compiled runtime data replaces the audit bundle in the offline application shell',
  serviceWorker.includes("'./data/runtime.data.js'") &&
  !serviceWorker.includes("'./data/normalized.data.js'"));
check('runtime data is a local classic-script projection with complete base and overlay indexes',
  /^window\.COE_RUNTIME_DATA=/.test(runtimeData) &&
  /"baseItems":/.test(runtimeData) && /"overlayByPool":/.test(runtimeData) &&
  /"sourceModifiers":/.test(runtimeData) && /"implicits":/.test(runtimeData));
check('runtime modifier overlays carry stable identity, display tier, source tier, and class-specific weights',
  /for \(const \[\s*key,\s*modifierId,\s*poolSpawnWeight,\s*displayTier,\s*sourceTier,\s*matchStrategy,\s*classWeights,?\s*\] of rows\)/.test(app) &&
  /stableModifierId:\s*Number\(modifierId\)/.test(app) &&
  /displayTier,\s*sourceTier,/.test(app) &&
  /sourceClassWeights:\s*classWeights \|\| \[\]/.test(app));
check('browser mod data is generated through the minifying JSON builder',
  /JSON\.stringify\(readJson/.test(modDataBuilder) &&
  /data\/mods\.data\.js is stale/.test(modDataBuilder));
check('currency index is included in the offline application shell',
  serviceWorker.includes("'./data/crafting/currency-index.data.js'"));
const loadFromStashStart = app.indexOf('function loadFromStash(index)');
const loadFromStashEnd = app.indexOf('\nfunction removeFromStash', loadFromStashStart);
const loadFromStashSource = app.slice(loadFromStashStart, loadFromStashEnd);
check('stash reload rebuilds the normalized modifier overlay for the saved simulator pool',
  /new CraftingEngine\(\s*modData,\s*savedPoolId,\s*desecData,\s*buildSourceModifierOverlay\(savedPoolId, savedConcreteBase\),\s*null,\s*savedConcreteBase,\s*craftingRandomSource,\s*normalizedData\?\.craftingMechanics,?\s*\)/.test(loadFromStashSource));
check('player-facing affix labels consistently prefer normalized display tiers',
  /const displayTier = mod\.displayTier != null \? mod\.displayTier : mod\.tier;/.test(app) &&
  /const affixLabel = [^;]+displayTier/.test(app) &&
  /hover\.textContent = [^;]+displayTier/.test(app));
check('incompatible stash migration is transactional and preserves the live engine',
  /let candidateEngine;[\s\S]*?try \{[\s\S]*?candidateEngine\.loadItem\(item, pending\);[\s\S]*?catch \(error\)[\s\S]*?showError\(`[\s\S]*?return;[\s\S]*?engine = candidateEngine;/.test(loadFromStashSource));
check('requested performance paths are instrumented',
  ['initial-data-load', 'base-selection', 'item-level-change', 'chaos-with-whittling', 'tab-switch', 'undo', 'redo']
    .every(metric => app.includes(metric)) && /`craft-\$\{baseCurrency\}`/.test(app));
const currencyReasonStart = app.indexOf('function currencyDisabledReason(');
const currencyReasonEnd = app.indexOf('\nfunction unsupportedReason', currencyReasonStart);
const currencyReasonSource = app.slice(currencyReasonStart, currencyReasonEnd);
const consumeOmenStart = app.indexOf('function consumeCraftOmen(');
const consumeOmenEnd = app.indexOf('\nfunction ', consumeOmenStart + 10);
const consumeOmenSource = app.slice(consumeOmenStart, consumeOmenEnd);
check('item-level eligibility helper is scoped to currency validation',
  /const noEligibleModifier\s*=/.test(currencyReasonSource) &&
  /return noEligibleModifier\(['"]magic['"]\)/.test(currencyReasonSource) &&
  !/noEligibleModifier/.test(consumeOmenSource));
check('zero-capacity Magic transitions bypass modifier eligibility while Augmentation reports effective capacity',
  /case 'transmutation':[\s\S]*?magicLimits\.prefixes === 0 && magicLimits\.suffixes === 0\) return '';[\s\S]*?return noEligibleModifier\('magic'\)/.test(currencyReasonSource) &&
  /This base has 0 available Magic affix slots\./.test(currencyReasonSource) &&
  /effective limit: \$\{magicLimits\.prefixes\} Prefix \/ \$\{magicLimits\.suffixes\} Suffix/.test(currencyReasonSource));
check('Whittling blocks unknown modifier levels in the UI',
  /Unsupported — verification required: a removable modifier has no numeric modifier level/.test(app));
check('base search still filters rendered cards',
  /searchInput\.addEventListener\('input', filterCategories\)/.test(select));
check('saved-item stash remains in workbench markup',
  /<div id="stash-grid" class="stash-grid">/.test(html));

const buildCardStart = select.indexOf('function buildCard(item, groupName)');
const buildCardEnd = select.indexOf('\nfunction renderCategories', buildCardStart);
const buildCardSource = select.slice(buildCardStart, buildCardEnd);
const expectedOuterClassIds = [
  'jewels', 'amulets', 'rings', 'belts', 'gloves', 'boots', 'body_armours', 'helmets',
  'quivers', 'shields', 'bucklers', 'foci', 'claws', 'daggers', 'wands',
  'one_hand_swords', 'one_hand_axes', 'one_hand_maces', 'sceptres', 'spears', 'flails',
  'bows', 'staves', 'two_hand_swords', 'two_hand_axes', 'two_hand_maces',
  'quarterstaves', 'crossbows', 'life_flasks', 'mana_flasks', 'charms',
];
check('all 31 outer item classes remain present',
  expectedOuterClassIds.every(id => new RegExp(`\\{ id: '${id}', name:`).test(select)));
check('outer Amulet class still enters the workbench immediately',
  /\{ id: 'amulets', name: 'Amulets'/.test(select) &&
  /const initialBaseId = hasVariants \? item\.variants\[0\]\.id : item\.id;[\s\S]*?enterCraft\(initialBaseId, item\.name\)/.test(buildCardSource) &&
  /craftView\.hidden = false;[\s\S]*?selectView\.hidden = true;/.test(select));
check('outer flow has no required concrete-base selection page',
  !/renderVariants\(item\)/.test(buildCardSource) &&
  /renderWorkbenchBaseSelector\(baseId, classLabel\);[\s\S]*?craftView\.hidden = false;/.test(select));
const jewelSelectorMarkup = html.slice(
  html.indexOf('<div id="jewel-selector"'),
  html.indexOf('</div>', html.indexOf('<div id="jewel-selector"')) + 6,
);
check('exact Ruby Sapphire Emerald Jewel header selector remains',
  (jewelSelectorMarkup.match(/class="jewel-btn/g) || []).length === 3 &&
  ['ruby', 'sapphire', 'emerald'].every(type => jewelSelectorMarkup.includes(`data-type="${type}"`)) &&
  !/data-type="(?:diamond|time_lost)/.test(jewelSelectorMarkup));
const renderWorkbenchStart = select.indexOf('function renderWorkbenchBaseSelector(baseId, classLabel)');
const renderWorkbenchEnd = select.indexOf('\n// Hand the chosen base', renderWorkbenchStart);
const renderWorkbenchSource = select.slice(renderWorkbenchStart, renderWorkbenchEnd);
check('generic non-Jewel concrete selector is inside the workbench heading',
  /ensureWorkbenchBaseSelector\(\)[\s\S]*?#jewel-panel \.workbench-heading/.test(select) &&
  /className = 'base-choice-btn concrete-base-trigger active'/.test(select) &&
  /aria-controls', 'concrete-base-picker'/.test(select) &&
  /baseId === 'jewels'/.test(renderWorkbenchSource) &&
  !/baseId === 'amulets'/.test(renderWorkbenchSource) &&
  /const context = concreteBaseContext\(\)/.test(renderWorkbenchSource));
check('generic selector is populated from normalized indexes, not a hard-coded list',
  /normalizedData\?\.baseItems\?\.simulatorBaseMap\?\.\[simulatorPoolId\]/.test(app) &&
  /normalizedIndexes\.basesById\.get\(id\)/.test(app) &&
  /window\.CraftForge\.getConcreteBaseContext = concreteBaseContext/.test(app) &&
  !/Crimson Amulet/.test(select));
check('deterministic concrete default uses the first selectable normalized mapping record',
  /function defaultConcreteBaseForPool\(simulatorPoolId\)[\s\S]*?concreteBasesForPool\(simulatorPoolId\)\.find\(base => base\.selectable\)/.test(app) &&
  /function createEngine\(type, concreteBase = null\)[\s\S]*?defaultConcreteBaseForPool\(type\)/.test(app));
check('concrete selector supports property-aware search reset and data states',
  /function searchableConcreteBaseValue\(value\)/.test(select) &&
  /basePickerSearch\.addEventListener\('input', filterConcreteBaseOptions\)/.test(select) &&
  /basePickerSearch\.value = '';[\s\S]*?filterConcreteBaseOptions\(\)/.test(select) &&
  /id="base-picker-empty"[^>]*hidden/.test(html) &&
  /id="base-picker-error"[^>]*role="alert"[^>]*hidden/.test(html));
check('source/audit levels and source IDs are absent from the player-facing picker',
  !/id="base-picker-required-filter"/.test(html) &&
  !/id="base-picker-drop-level-filter"/.test(html) &&
  !/Source ID/.test(select) &&
  !/Required level unavailable/.test(select));
check('concrete selector caches rows and uses one delegated selection handler',
  /renderedConcreteBaseSignature/.test(select) &&
  /signature === renderedConcreteBaseSignature/.test(select) &&
  /basePickerList\.addEventListener\('click'/.test(select) &&
  !/button\.addEventListener\('click'/.test(select));
check('attribute family is a contextual filter, never a concrete option',
  /id="base-picker-attribute-field"[^>]*hidden/.test(html) &&
  /families\.length < 2/.test(select) &&
  /button\.dataset\.attributeFamily = base\.attributeFamily/.test(select) &&
  /All attribute families/.test(html) &&
  !/dataset\.baseItemId = base\.attributeFamily/.test(select));
check('unmodifiable bases are disabled with an explicit reason',
  /const selectable = base\.selectable !== false/.test(select) &&
  /button\.disabled = !selectable/.test(select) &&
  /base\.disabledReason \|\| 'Unavailable for crafting'/.test(select) &&
  /\.concrete-base-option:disabled\s*\{/.test(headerCss));
check('concrete selector keyboard contract includes navigation and Escape',
  ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape', 'Enter']
    .every(key => select.includes(`'${key}'`)) &&
  /concreteBasePicker\.addEventListener\('keydown', moveConcreteBaseFocus\)/.test(select) &&
  /event\.target\?\.tagName === 'SELECT'/.test(select) &&
  /\.concrete-base-option:not\(\[hidden\]\):not\(\[disabled\]\)/.test(select));
check('concrete selector labels are dynamic and controls have focus treatment',
  /class="base-picker-search-label">Search concrete bases<\/span>/.test(html) &&
  /basePickerTitle\.textContent = `Choose \$\{classLabel\}`/.test(select) &&
  /basePickerList\.setAttribute\('aria-label', `\$\{classLabel\} concrete bases`\)/.test(select) &&
  /\.base-picker-search:focus-within\s*\{[\s\S]*?border-color:/.test(headerCss));
check('modal focus is trapped and the workbench is inert while a dialog is open',
  /function trapModalFocus\(container, event\)[\s\S]*?event\.key !== 'Tab'/.test(select) &&
  /if \('inert' in app\) app\.inert = active/.test(select) &&
  /setWorkbenchModalIsolation\(true\)/.test(select) &&
  /event\.target === basePickerSearch && event\.key !== 'ArrowDown'/.test(select));
check('concrete selector and confirmation have mobile layouts',
  /@media \(max-width: 768px\)[\s\S]*?\.base-picker-overlay[\s\S]*?\.base-picker-list \{ grid-template-columns: 1fr; \}/.test(headerCss));
const pickerDialogStart = headerCss.indexOf('.base-picker-dialog {');
const pickerDialogEnd = pickerDialogStart >= 0 ? headerCss.indexOf('\n}', pickerDialogStart) : -1;
const pickerDialogCss = pickerDialogStart >= 0
  ? headerCss.slice(pickerDialogStart, pickerDialogEnd >= 0 ? pickerDialogEnd : headerCss.length)
  : '';
const pickerListStart = headerCss.indexOf('.base-picker-list {');
const pickerListEnd = pickerListStart >= 0 ? headerCss.indexOf('\n}', pickerListStart) : -1;
const pickerListCss = pickerListStart >= 0
  ? headerCss.slice(pickerListStart, pickerListEnd >= 0 ? pickerListEnd : headerCss.length)
  : '';
check('concrete selector owns a definite clipped viewport with named result placement',
  /grid-template-areas:[\s\S]*?"header"[\s\S]*?"toolbar"[\s\S]*?"filters"[\s\S]*?"count"[\s\S]*?"results"/.test(pickerDialogCss) &&
  /height:\s*min\([^;]*dvh[^;]*\);/.test(pickerDialogCss) &&
  /overflow:\s*hidden;/.test(pickerDialogCss) &&
  /\.base-picker-header\s*\{[^}]*grid-area:\s*header;/.test(headerCss) &&
  /\.base-picker-toolbar\s*\{[^}]*grid-area:\s*toolbar;/.test(headerCss) &&
  /\.base-picker-filters\s*\{[^}]*grid-area:\s*filters;/.test(headerCss) &&
  /\.base-picker-count\s*\{[^}]*grid-area:\s*count;/.test(headerCss) &&
  /grid-area:\s*results;/.test(pickerListCss));
check('concrete selector scroll is contained inside the dialog border',
  /min-height:\s*0;/.test(pickerListCss) &&
  /overflow-y:\s*auto;/.test(pickerListCss) &&
  /overscroll-behavior:\s*contain;/.test(pickerListCss) &&
  /contain:\s*layout paint;/.test(pickerListCss));
const pickerOverlayStart = headerCss.indexOf('.base-picker-overlay,');
const pickerOverlayEnd = pickerOverlayStart >= 0 ? headerCss.indexOf('\n}', pickerOverlayStart) : -1;
const pickerOverlayCss = pickerOverlayStart >= 0
  ? headerCss.slice(pickerOverlayStart, pickerOverlayEnd >= 0 ? pickerOverlayEnd : headerCss.length)
  : '';
check('concrete selector avoids full-viewport backdrop-filter repainting',
  pickerOverlayCss.length > 0 && !/backdrop-filter\s*:/.test(pickerOverlayCss));
check('crafted base changes require explicit cancel or reset confirmation',
  />Cancel<\/button>/.test(html) &&
  />Change Base and Reset Item<\/button>/.test(html) &&
  /if \(crafted && options\.confirmed !== true\)[\s\S]*?requiresConfirmation: true/.test(app) &&
  /cancel\?\.addEventListener\('click', \(\) => closeBaseConfirmation\(\)\)/.test(select) &&
  /selectConcreteBase\(nextId, \{ confirmed: true \}\)/.test(select));
check('crafted Jewel changes share the generic confirmation dialog',
  /craftforge:base-change-confirmation-requested/.test(app) &&
  /craftforge:base-change-confirmation-requested'[\s\S]*?openBaseConfirmation\(event\.detail\)/.test(select) &&
  /document\.activeElement\?\.matches\?\.\('\.jewel-btn, \.concrete-base-trigger'\)/.test(select) &&
  /\.concrete-base-trigger, \.jewel-btn\.active/.test(select));
check('base switching preserves item level and resets incompatible state',
  /engine\.setConcreteBase\(nextBase, \{ resetItem: true, preserveItemLevel: true \}\)/.test(app) &&
  /resetOmenState\(\);[\s\S]*?clearDesecration\(\);[\s\S]*?foreseenSeals = \{\}/.test(app));
check('history and stash resynchronize concrete base identity',
  /function restoreSnapshot\(snap\)[\s\S]*?syncConcreteBaseTemplateFromItem\(snap\.item\)[\s\S]*?notifyConcreteBaseChange\(\)/.test(app) &&
  /savedConcreteBase[\s\S]*?saved\.baseItemId[\s\S]*?notifyConcreteBaseChange\(\)/.test(loadFromStashSource));
check('tooltip separates concrete details and implicits from explicit modifiers',
  /id="base-detail-list"[^>]*hidden/.test(html) &&
  /id="implicit-list"[^>]*hidden/.test(html) &&
  /renderConcreteBaseDetails\(item\);[\s\S]*?const allMods =/.test(app) &&
  !/Required Level', 'Unavailable in normalized source'/.test(app) &&
  !/Sockets unavailable/.test(app));
check('tooltip renders structured quality without mixing it into explicit modifiers',
  /id="quality-list"[^>]*hidden/.test(html) &&
  /function renderQualityDetails\(item\)[\s\S]*?quality\.type[\s\S]*?quality\.cap/.test(app) &&
  /renderConcreteBaseDetails\(item\);[\s\S]*?renderQualityDetails\(item\);/.test(app));
check('tooltip renders socket state in a dedicated section',
  /id="socket-list"[^>]*hidden/.test(html) &&
  /function renderSocketDetails\(item\)[\s\S]*?socket-line/.test(app) &&
  /renderQualityDetails\(item\);[\s\S]*?renderSocketDetails\(item\);/.test(app) &&
  /\.socket-list/.test(headerCss));
check('Jewel-only flavor text is conditional on Jewel mode',
  /flavorEl\.hidden = !isJewelMode/.test(app) &&
  /Place into an allocated Jewel Socket on the Passive Skill Tree/.test(html));
const itemArtMarkupStart = html.indexOf('id="item-art-stage"');
const itemArtMarkupEnd = itemArtMarkupStart >= 0 ? html.indexOf('</div>', itemArtMarkupStart) : -1;
const itemArtMarkup = itemArtMarkupStart >= 0
  ? html.slice(itemArtMarkupStart, itemArtMarkupEnd >= 0 ? itemArtMarkupEnd : itemArtMarkupStart + 1000)
  : '';
check('item art stage has separate persistent and animated image layers',
  itemArtMarkup.includes('id="item-art"') &&
  itemArtMarkup.includes('id="item-art-aura"'));

const baseArtPathMatch = app.match(
  /function\s+\w*[Aa]rt\w*[Pp]ath\w*\s*\(\s*baseItemId\s*\)\s*\{[\s\S]{0,800}?\n\}/,
);
const baseArtPathSource = baseArtPathMatch?.[0] || '';
check('base artwork resolves from a normalized numeric base ID',
  /Number\(baseItemId\)/.test(baseArtPathSource) &&
  /assets\/item-bases\/\$\{[A-Za-z_$][\w$]*\}\.png/.test(baseArtPathSource) &&
  !/displayName|itemName|replace\(/.test(baseArtPathSource));

const renderItemStart = app.indexOf('function renderItem(');
const renderItemEnd = renderItemStart >= 0 ? app.indexOf('\nfunction triggerCraftAnimation', renderItemStart) : -1;
const renderItemSource = renderItemStart >= 0
  ? app.slice(renderItemStart, renderItemEnd >= 0 ? renderItemEnd : app.length)
  : '';
const itemArtRendererMatch = app.match(/function\s+(render\w*Item\w*Art\w*)\s*\(/i);
const itemArtRendererName = itemArtRendererMatch?.[1] || '';
check('normal item rendering also synchronizes concrete-base artwork',
  Boolean(itemArtRendererName) &&
  new RegExp(`\\b${itemArtRendererName}\\(item\\)`).test(renderItemSource));

const triggerCraftAnimationStart = app.indexOf('function triggerCraftAnimation(');
const triggerCraftAnimationEnd = triggerCraftAnimationStart >= 0
  ? app.indexOf('\nfunction ', triggerCraftAnimationStart + 10)
  : -1;
const triggerCraftAnimationSource = triggerCraftAnimationStart >= 0
  ? app.slice(
    triggerCraftAnimationStart,
    triggerCraftAnimationEnd >= 0 ? triggerCraftAnimationEnd : app.length,
  )
  : '';
check('craft animation colors and restarts the item silhouette stage',
  /itemArtStage\.style\.setProperty\(['"]--craft-color['"],\s*color\)/.test(triggerCraftAnimationSource) &&
  /itemArtStage\.classList\.remove\(['"]craft-active['"]\)/.test(triggerCraftAnimationSource) &&
  /itemArtStage\.classList\.add\(['"]craft-active['"]\)/.test(triggerCraftAnimationSource));
check('craft animation falls back to a tooltip flash when base art is unavailable',
  /tooltip\.classList\.toggle\(['"]craft-fallback['"],\s*!/.test(triggerCraftAnimationSource) ||
  /if\s*\([^)]*(?:available|loaded|ready|hidden)[^)]*\)[\s\S]{0,300}?tooltip\.classList\.add\(['"]craft-fallback['"]\)/i.test(triggerCraftAnimationSource));
check('craft animation no longer paints a radial workbench spotlight',
  !/craftGlow|radial-gradient/.test(triggerCraftAnimationSource));

const itemArtCss = `${baseCss}\n${headerCss}\n${css}`;
check('item artwork glow follows transparent pixels with drop shadows',
  /(?:#item-art(?:-aura)?|\.item-art(?:-aura|\b))[^\{]*\{[^\}]*filter:\s*[^;\}]*drop-shadow\(/.test(itemArtCss));
const itemAuraRuleStart = baseCss.indexOf('.item-art-aura {');
const itemAuraRuleEnd = itemAuraRuleStart >= 0 ? baseCss.indexOf('\n}', itemAuraRuleStart) : -1;
const itemAuraRuleCss = itemAuraRuleStart >= 0
  ? baseCss.slice(itemAuraRuleStart, itemAuraRuleEnd >= 0 ? itemAuraRuleEnd : baseCss.length)
  : '';
const itemFlashKeyframeStart = baseCss.indexOf('@keyframes itemCraftFlash');
const itemAuraKeyframeStart = baseCss.indexOf('@keyframes itemCraftAura');
const itemFallbackKeyframeStart = baseCss.indexOf('@keyframes itemCraftFallback');
const nextItemKeyframeStart = baseCss.indexOf('@keyframes modFadeIn');
const itemFlashKeyframeCss = itemFlashKeyframeStart >= 0 && itemAuraKeyframeStart > itemFlashKeyframeStart
  ? baseCss.slice(itemFlashKeyframeStart, itemAuraKeyframeStart)
  : '';
const itemAuraKeyframeCss = itemAuraKeyframeStart >= 0 && itemFallbackKeyframeStart > itemAuraKeyframeStart
  ? baseCss.slice(itemAuraKeyframeStart, itemFallbackKeyframeStart)
  : '';
const itemFallbackKeyframeCss = itemFallbackKeyframeStart >= 0 && nextItemKeyframeStart > itemFallbackKeyframeStart
  ? baseCss.slice(itemFallbackKeyframeStart, nextItemKeyframeStart)
  : '';
check('item glow pre-rasterizes one silhouette filter on its aura layer',
  (itemAuraRuleCss.match(/drop-shadow\(/g) || []).length === 1 &&
  /will-change:\s*opacity,\s*transform;/.test(itemAuraRuleCss));
check('craft feedback keyframes animate compositor properties only',
  itemFlashKeyframeCss.length > 0 && itemAuraKeyframeCss.length > 0 && itemFallbackKeyframeCss.length > 0 &&
  [itemFlashKeyframeCss, itemAuraKeyframeCss, itemFallbackKeyframeCss]
    .every(source => !/(?:filter|box-shadow|text-shadow)\s*:/.test(source)) &&
  [itemFlashKeyframeCss, itemAuraKeyframeCss]
    .every(source => /opacity\s*:/.test(source) && /transform\s*:/.test(source)) &&
  /opacity\s*:/.test(itemFallbackKeyframeCss));
check('item artwork uses dedicated flash and aura keyframes',
  /@keyframes\s+itemCraftFlash\b/.test(itemArtCss) &&
  /@keyframes\s+itemCraftAura\b/.test(itemArtCss));
check('item artwork animation respects reduced-motion preferences',
  /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?(?:item-art|craft-active)/.test(itemArtCss));
check('Absent Amulet art is installed at its numeric base ID path',
  fs.existsSync(new URL('./assets/item-bases/2563.png', import.meta.url)));
check('runtime selector, socket stylesheet, and performance data are versioned in the offline shell',
  /header-fix\.css\?v=20/.test(select) &&
  /CACHE_NAME = 'poe2-craft-registry-v8'/.test(serviceWorker) &&
  serviceWorker.includes("'./header-fix.css?v=20'") &&
  serviceWorker.includes("'./data/crafting/known-items.data.js'"));
check('Absent Amulet art is available in the versioned offline application shell',
  serviceWorker.includes("'./assets/item-bases/2563.png'"));
check('right-click sticky currency mode is explicit, repeatable, and Escape-safe',
  /intent === 'sticky' && isStickyCurrencyDefinition\(definition\)/.test(app) &&
  /const keepArmed = shiftKey \|\| stickyCurrency === currency/.test(app) &&
  /b\.classList\.toggle\('sticky'/.test(app) &&
  /if \(e\.key === 'Escape'\)[\s\S]*?disarmCurrency\(\)/.test(app) &&
  !/document\.addEventListener\('contextmenu',\s*e => e\.preventDefault\(\)\)/.test(app));

console.log(`\nRESULT: ${passed}/${passed + failed} checks passed`);
if (failed) process.exitCode = 1;
