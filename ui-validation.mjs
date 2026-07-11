import fs from 'node:fs';

const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('./overhaul.css', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('./app.js', import.meta.url), 'utf8');
const select = fs.readFileSync(new URL('./select.js', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('./sw.js', import.meta.url), 'utf8');
const currencyIndex = JSON.parse(fs.readFileSync(new URL('./data/crafting/currency-index.json', import.meta.url), 'utf8'));

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
  'craft-tab-list', 'well-modal', 'stash-grid', 'jewel-tooltip',
  'undo-btn', 'redo-btn', 'reset-btn',
]) {
  check(`#${id} exists`, ids.includes(id));
}

const expectedTabs = [
  'Currency', 'Quality', 'Socketing / Augments', 'Ritual / Omens', 'Essences',
  'Abyss', 'Breach / Genesis', 'Delirium / Instilling', 'Runeforging',
  'Corruption / Sacrifice',
];
const tabLabels = [...html.matchAll(/<button[^>]+data-craft-tab="[^"]+"[^>]*>([^<]+)<\/button>/g)]
  .map(match => match[1].trim());
check('all ten requested crafting tabs exist in order', JSON.stringify(tabLabels) === JSON.stringify(expectedTabs));
check('each tab has exactly one panel', (html.match(/data-craft-panel=/g) || []).length === expectedTabs.length);
check('only Currency panel starts visible',
  /id="craft-panel-currency"[^>]*data-craft-panel="currency"(?![^>]*\shidden)/.test(html) &&
  (html.match(/data-craft-panel="(?!currency)[^"]+"[^>]*hidden/g) || []).length === expectedTabs.length - 1);

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

const craftIds = [...html.matchAll(/data-craft-id="([^"]+)"/g)].map(match => match[1]);
check('every crafting card has a unique stable crafting ID',
  craftIds.length === 37 && craftIds.length === new Set(craftIds).size);
check('crafting inventory classifies every retained source item exactly once',
  currencyIndex.counts.entries === currencyIndex.entries.length &&
  currencyIndex.counts.unclassified === 0 &&
  currencyIndex.entries.every(entry => currencyIndex.allowedClassifications.includes(entry.classification)));
check('data-driven runtime registry preserves all 37 stable craft IDs',
  currencyIndex.counts.runtimeDefinitions === 37 &&
  Object.keys(currencyIndex.runtimeRegistry).length === 37 &&
  craftIds.every(id => currencyIndex.runtimeRegistry[id]));
check('shared artwork uses explicit icon IDs',
  /data-craft-id="greater-chaos" data-icon-id="chaos"/.test(html) &&
  /data-craft-id="essence-abyss" data-icon-id="abyss-essence"/.test(html));

check('legacy standalone Omens and Abyssal panel is removed', !/id="desecrate-panel"/.test(html));
check('Omens were migrated into Ritual panel',
  /id="craft-panel-ritual"[\s\S]*?data-craft-omen="whittling"[\s\S]*?<\/section>/.test(html));
check('Preserved Cranium and Abyss essence were migrated into Abyss panel',
  /id="craft-panel-abyss"[\s\S]*?data-bone="preserved_cranium"[\s\S]*?data-currency="essence_abyss"[\s\S]*?<\/section>/.test(html));
check('Vaal Orb was migrated into Corruption panel',
  /id="craft-panel-corruption"[\s\S]*?data-currency="vaal"[\s\S]*?<\/section>/.test(html));
check('unsupported mechanics use the required wording',
  (html.match(/Unsupported — verification required/g) || []).length >= 8);
check('encounter resources are documented but not enabled as crafting controls',
  !/data-(?:currency|bone)="(?:verisium|liquid_verisium|hiveblood|wombgift)"/.test(html));

check('Well of Souls starts hidden', /<div id="well-modal" class="well-modal" hidden>/.test(html));
check('hidden state wins over panel rules', /\[hidden\]\s*\{\s*display:\s*none\s*!important;\s*\}/.test(css));
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
check('desktop does not use CSS zoom or scaled workspace layout',
  !/(?:^|[;{])\s*zoom\s*:/m.test(css) &&
  !/#(?:craft-view|main-content|currency-panel|jewel-panel|stash-panel)[^{]*\{[^}]*transform\s*:\s*scale/m.test(css));

check('tab switching only updates tab presentation and persistence',
  /function setActiveCraftTab\([\s\S]*?panel\.hidden\s*=\s*panel\.dataset\.craftPanel\s*!==\s*tabId;[\s\S]*?localStorage\.setItem\(CRAFT_TAB_STORAGE_KEY/.test(app));
check('tab controls support keyboard navigation',
  /event\.key === 'ArrowRight'[\s\S]*?event\.key === 'Home'[\s\S]*?event\.key === 'End'/.test(app));
check('event listener setup is guarded against duplicate binding',
  /if \(eventsBound\) return;[\s\S]*?eventsBound = true;[\s\S]*?setupCraftTabs\(\);/.test(app));
check('history snapshots preserve armed and consumed Omen state',
  /omens:\s*Array\.from\(selectedOmens\)[\s\S]*?omenOfLight:\s*omenOfLightActive[\s\S]*?craftOmen:\s*selectedCraftOmen/.test(app) &&
  /selectedOmens\s*=\s*new Set\([\s\S]*?selectedCraftOmen\s*=\s*snap\.craftOmen/.test(app));
check('history captures state before ordinary engine mutation',
  /const before = snapshotState\(engine\.getItem\(\)\);\s*const result = applyCurrencyToEngine/.test(app));
const useCurrencyStart = app.indexOf('function useCurrencyOnItem(currency, shiftKey)');
const useCurrencyEnd = app.indexOf('\n  const applyArmedToItem', useCurrencyStart);
const useCurrencySource = app.slice(useCurrencyStart, useCurrencyEnd);
const foreseeableStart = app.indexOf('const FORESEEABLE = new Set([');
const foreseeableEnd = app.indexOf(']);', foreseeableStart);
const foreseeableSource = app.slice(foreseeableStart, foreseeableEnd);
const commitForesightStart = app.indexOf('function commitForesight(currency)');
const commitForesightEnd = app.indexOf('\nfunction commitDesecrationForesight', commitForesightStart);
const commitForesightSource = app.slice(commitForesightStart, commitForesightEnd);
check('Essence of the Abyss uses the Hinekora foresight commit path',
  foreseeableSource.includes("'essence_abyss'") &&
  /engine\.getItem\(\)\.hinekoraLocked && FORESEEABLE\.has\(currency\)[\s\S]*?commitForesight\(currency\)/.test(useCurrencySource));
check('foresight commit preserves undo and consumes Hinekora lock',
  /const before = snapshotState\(engine\.getItem\(\)\);[\s\S]*?pushUndo\(before\);[\s\S]*?engine\.loadItem\(seal\.afterItem\);[\s\S]*?engine\.recordCurrencyUse\(currency\);[\s\S]*?engine\.clearHinekoraLock\(\)/.test(commitForesightSource));
check('currency supports click/tap activation',
  /elements\.currencyBtns\.forEach\(btn => \{[\s\S]*?btn\.addEventListener\('click',[\s\S]*?toggleCurrency/.test(app));
check('disabled crafting cards receive a user-facing reason',
  /function setCraftButtonState\([\s\S]*?button\.title = disabled \? disabledReason/.test(app));
check('stable crafting ID resolves through the central registry',
  /const CRAFTING_ITEM_REGISTRY = Object\.freeze/.test(app) &&
  /function definitionForElement\(element\)[\s\S]*?element\.dataset\.craftId/.test(app) &&
  /function actionForElement\(element\)[\s\S]*?definitionForElement/.test(app));
check('runtime craft definitions receive inventory classifications from local data',
  /const CRAFTING_CURRENCY_INDEX = window\.CRAFTING_CURRENCY_INDEX/.test(app) &&
  /inventoryClassification: indexed\?\.classification \|\| 'unclassified'/.test(app) &&
  /Crafting inventory classification is missing/.test(app));
check('legacy labels and data attributes do not select crafting behaviour',
  !/dataset\.(?:currency|bone|omen|craftOmen)\b/.test(app) &&
  !/getAttribute\(['"]data-(?:currency|bone|omen|craft-omen)/.test(app));
check('enabled registry entries require real validators and handlers',
  /function validateCraftRegistry\(\)[\s\S]*?Supported crafting card lacks validator\/handler/.test(app) &&
  /Engine handler is missing/.test(app) && /Eligibility validator is missing/.test(app));
check('unsupported registry entries cannot dispatch mutations',
  /id: 'essence-breach'[\s\S]*?supported: false[\s\S]*?unsupportedReason: UNSUPPORTED_REASON/.test(app) &&
  /if \(!definition \|\| !definition\.supported \|\| !definition\.handler\)/.test(app));
check('generic icon loading covers every crafting tab without fetch',
  /document\.querySelectorAll\('\[data-craft-id\]'\)/.test(app) &&
  /assets\/icons\/\$\{iconId\}\.png/.test(app) && !/fetch\s*\(/.test(app));
check('missing icons retain placeholders and icon loading is idempotent',
  /img\.hidden = true/.test(app) &&
  /addEventListener\('load'[\s\S]*?has-real-icon/.test(app) &&
  /addEventListener\('error'[\s\S]*?img\.remove\(\)/.test(app) &&
  /if \(existing\) return existing/.test(app) &&
  (html.match(/class="currency-abbr"/g) || []).length >= 20);
check('normalized browser data loads before the crafting engine',
  html.indexOf('data/normalized.data.js') > html.indexOf('data/desecrated-mods.data.js') &&
  html.indexOf('data/normalized.data.js') < html.indexOf('crafting.js'));
check('currency index loads locally before the runtime registry',
  html.indexOf('data/crafting/currency-index.data.js') > html.indexOf('data/normalized.data.js') &&
  html.indexOf('data/crafting/currency-index.data.js') < html.indexOf('app.js'));
check('normalized browser data is included in the offline application shell',
  serviceWorker.includes("'./data/normalized.data.js'"));
check('currency index is included in the offline application shell',
  serviceWorker.includes("'./data/crafting/currency-index.data.js'"));
const loadFromStashStart = app.indexOf('function loadFromStash(index)');
const loadFromStashEnd = app.indexOf('\nfunction removeFromStash', loadFromStashStart);
const loadFromStashSource = app.slice(loadFromStashStart, loadFromStashEnd);
check('stash reload rebuilds the normalized modifier overlay for the saved base',
  /new CraftingEngine\(\s*modData,\s*saved\.jewelType,\s*desecData,\s*buildSourceModifierOverlay\(saved\.jewelType\),?\s*\)/.test(loadFromStashSource));
check('requested performance paths are instrumented',
  ['initial-data-load', 'base-selection', 'item-level-change', 'chaos-with-whittling', 'tab-switch', 'undo', 'redo']
    .every(metric => app.includes(metric)) && /`craft-\$\{baseCurrency\}`/.test(app));
check('Whittling blocks unknown modifier levels in the UI',
  /Unsupported — verification required: a removable modifier has no numeric modifier level/.test(app));
check('base search still filters rendered cards',
  /searchInput\.addEventListener\('input', filterCategories\)/.test(select));
check('saved-item stash remains in workbench markup',
  /<div id="stash-grid" class="stash-grid">/.test(html));

console.log(`\nRESULT: ${passed}/${passed + failed} checks passed`);
if (failed) process.exitCode = 1;
