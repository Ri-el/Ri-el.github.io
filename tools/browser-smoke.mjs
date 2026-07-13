#!/usr/bin/env node

import assert from 'node:assert/strict';

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('Usage: node tools/browser-smoke.mjs <file:///.../index.html|http://localhost:8080/> [...]');
  process.exitCode = 2;
} else {
  const playwrightModule = process.env.PLAYWRIGHT_MODULE || 'playwright';
  const { chromium } = await import(playwrightModule).catch(error => {
    throw new Error(`Browser smoke test requires an existing Playwright installation: ${error.message}`);
  });

  const browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_EXECUTABLE_PATH
      ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH }
      : {}),
  });
  const cases = [
    ['Jewels', 'Ruby'],
    ['Amulets', 'Crimson Amulet'],
    ['Rings', 'Golden Hoop'],
    ['Gloves', 'Stocky Mitts'],
    ['Body Armours', 'Rusted Cuirass'],
    ['Bows', 'Crude Bow'],
    ['Life Flasks', 'Lesser Life Flask'],
    ['Charms', 'Thawing Charm'],
  ];

  try {
    for (const target of targets) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const runtimeErrors = [];
      const isOptionalFallbackAsset = url => {
        try { return new URL(url).pathname.replaceAll('\\', '/').includes('/assets/'); }
        catch (_) { return false; }
      };
      page.on('pageerror', error => runtimeErrors.push(error.message));
      page.on('console', message => {
        if (message.type() !== 'error') return;
        const text = message.text();
        if (/^Failed to load resource: (?:net::ERR_FILE_NOT_FOUND|the server responded with a status of 404)/.test(text)) return;
        runtimeErrors.push(text);
      });
      page.on('response', response => {
        if (response.status() < 400 || isOptionalFallbackAsset(response.url())) return;
        runtimeErrors.push(`${response.status()} ${response.url()}`);
      });
      page.on('requestfailed', request => {
        if (isOptionalFallbackAsset(request.url())) return;
        runtimeErrors.push(`${request.failure()?.errorText || 'request failed'} ${request.url()}`);
      });

      await page.goto(target, { waitUntil: 'load' });
      if (/^https?:/i.test(target)) {
        await page.evaluate(async () => {
          for (const registration of await navigator.serviceWorker.getRegistrations()) await registration.unregister();
          for (const name of await caches.keys()) await caches.delete(name);
        });
        await page.reload({ waitUntil: 'load' });
      }

      const startup = await page.evaluate(() => ({
        modBaseCount: window.MOD_BASES ? Object.keys(window.MOD_BASES).length : 0,
        runtimeDataPresent: !!window.COE_RUNTIME_DATA,
        currencyIndexPresent: !!window.CRAFTING_CURRENCY_INDEX,
        craftRegistryLength: window.CRAFTING_CURRENCY_INDEX?.craftRegistry?.length ?? null,
        craftTabsLength: window.CRAFTING_CURRENCY_INDEX?.craftTabs?.length ?? null,
        craftForgePresent: !!window.CraftForge,
        normalizedCounts: window.CraftForge?.getNormalizedIndexCounts?.() ?? null,
        toast: document.getElementById('error-toast')?.textContent || '',
      }));
      assert(startup.modBaseCount > 0, `${target}: MOD_BASES did not initialize`);
      assert(startup.runtimeDataPresent, `${target}: runtime data did not initialize`);
      assert(startup.currencyIndexPresent, `${target}: currency index did not initialize`);
      assert.equal(startup.craftRegistryLength, 45, `${target}: visible runtime registry length`);
      assert.equal(startup.craftTabsLength, 10, `${target}: tab length`);
      assert(startup.craftForgePresent && startup.normalizedCounts, `${target}: CraftForge bridge/indexes unavailable`);
      assert.equal(startup.toast, '', `${target}: startup toast`);

      const results = [];
      for (const [classLabel, expectedBase] of cases) {
        const card = page.locator('.cat-card').filter({
          has: page.getByText(classLabel, { exact: true }),
        });
        assert.equal(await card.count(), 1, `${target}: ${classLabel} card count`);
        await card.click();
        const entered = await page.evaluate(() => {
          const context = window.CraftForge?.getConcreteBaseContext?.();
          const tooltip = document.getElementById('jewel-tooltip');
          return {
            selectHidden: document.getElementById('select-view')?.hidden === true,
            craftVisible: document.getElementById('craft-view')?.hidden === false,
            engineContext: !!context,
            selectedBaseItemId: context?.selectedBaseItemId ?? null,
            tooltipRendered: !!tooltip && getComputedStyle(tooltip).display !== 'none',
            tooltipName: document.getElementById('item-name')?.textContent?.trim() || '',
            toast: document.getElementById('error-toast')?.textContent || '',
          };
        });
        assert(entered.selectHidden && entered.craftVisible, `${target}: ${classLabel} did not enter craft view`);
        assert(entered.engineContext && entered.selectedBaseItemId != null, `${target}: ${classLabel} has no concrete engine context`);
        assert(entered.tooltipRendered, `${target}: ${classLabel} tooltip did not render`);
        assert.equal(entered.tooltipName, expectedBase, `${target}: ${classLabel} default base`);
        assert.equal(entered.toast, '', `${target}: ${classLabel} error toast`);

        if (classLabel === 'Amulets') {
          await page.setViewportSize({ width: 1180, height: 620 });
          const bounds = await page.evaluate(() => {
            const panel = document.querySelector('.craft-tab-panel:not([hidden])');
            const tooltip = document.getElementById('jewel-tooltip');
            const visibleIcons = [...document.querySelectorAll('[data-craft-id] .currency-icon')]
              .filter(icon => icon.closest('[data-craft-id]')?.getClientRects().length)
              .every(icon => icon.classList.contains('has-real-icon') || !!icon.querySelector('.currency-abbr')?.textContent.trim());
            return {
              panelHeight: panel?.getBoundingClientRect().height || 0,
              panelScrollable: (panel?.scrollHeight || 0) > (panel?.clientHeight || 0),
              tooltipOverflow: (tooltip?.scrollWidth || 0) - (tooltip?.clientWidth || 0),
              visibleIcons,
            };
          });
          assert(bounds.panelHeight >= 160, `${target}: crafting inventory collapsed at 1180x620`);
          assert(bounds.panelScrollable, `${target}: short desktop inventory is not internally scrollable`);
          assert(bounds.tooltipOverflow <= 2, `${target}: tooltip overflows horizontally`);
          assert(bounds.visibleIcons, `${target}: a visible crafting control has neither icon nor fallback`);
          const contextMenus = await page.evaluate(() => {
            const outside = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
            const control = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
            document.querySelector('.workbench-heading h2').dispatchEvent(outside);
            document.querySelector('[data-craft-id="transmutation"]').dispatchEvent(control);
            return { outsidePrevented: outside.defaultPrevented, controlPrevented: control.defaultPrevented };
          });
          assert(!contextMenus.outsidePrevented && contextMenus.controlPrevented,
            `${target}: context-menu prevention is not scoped to crafting controls`);
          await page.keyboard.press('Escape');

          await page.locator('[data-craft-id="transmutation"]').click();
          await page.locator('#jewel-tooltip').click();
          assert.equal(await page.locator('#mod-list .mod-line:not(.mod-empty)').count(), 1,
            `${target}: ordinary Amulet Transmutation did not add exactly one modifier`);
          await page.locator('[data-craft-id="regal"]').click();
          await page.locator('#jewel-tooltip').click();
          await page.locator('[data-craft-id="chaos"]').click({ button: 'right' });
          await page.locator('#jewel-tooltip').click();
          await page.locator('#jewel-tooltip').click();
          const sticky = await page.locator('[data-craft-id="chaos"]').evaluate(button => ({
            active: button.classList.contains('sticky'),
            pressed: button.getAttribute('aria-pressed'),
            uses: document.getElementById('craft-counter')?.textContent || '',
          }));
          assert(sticky.active && sticky.pressed === 'true' && /Chaos2/.test(sticky.uses), `${target}: sticky currency did not repeat`);
          await page.keyboard.press('Escape');
          assert(!(await page.locator('[data-craft-id="chaos"]').evaluate(button => button.classList.contains('sticky'))),
            `${target}: Escape did not clear sticky currency`);
          await page.setViewportSize({ width: 1280, height: 720 });
        }

        if (classLabel === 'Gloves') {
          const beforeNodes = await page.locator('*').count();
          await page.locator('.concrete-base-trigger').click();
          const picker = await page.evaluate(before => {
            const list = document.getElementById('base-picker-list');
            window.__browserSmokePickerFirst = list?.firstElementChild || null;
            return {
              options: list?.querySelectorAll('.concrete-base-option').length || 0,
              nodeDelta: document.querySelectorAll('*').length - before,
              images: list?.querySelectorAll('img').length || 0,
            };
          }, beforeNodes);
          assert.equal(picker.options, 198, `${target}: Gloves concrete-base count`);
          assert(picker.nodeDelta <= picker.options * 4, `${target}: picker DOM is unexpectedly heavy`);
          assert.equal(picker.images, 0, `${target}: picker eagerly created decorative images`);
          await page.locator('#base-picker-close').click();
          await page.locator('.concrete-base-trigger').click();
          assert(await page.evaluate(() => window.__browserSmokePickerFirst === document.getElementById('base-picker-list')?.firstElementChild),
            `${target}: picker rows were rebuilt on reopen`);
          await page.locator('#base-picker-close').click();
        }

        const back = page.locator('#back-to-select');
        assert.equal(await back.count(), 1, `${target}: back button count`);
        await back.click();
        assert(await page.locator('#select-view').isVisible(), `${target}: back button did not restore categories`);
        assert(!(await page.locator('#craft-view').isVisible()), `${target}: back button did not hide workbench`);
        results.push({ classLabel, defaultBase: entered.tooltipName });
      }

      // Absent Amulet is the current normalized base whose implicit deltas make
      // its effective Magic capacity 0/0 while leaving Rare capacity at 2/2.
      // Exercise the real controller so history, stash, Hinekora, sticky mode,
      // currency counters, and disabled reasons are covered on both HTTP and
      // direct file:// targets.
      await page.locator('.cat-card', { hasText: 'Amulets' }).click();
      await page.locator('.concrete-base-trigger').click();
      await page.locator('#base-picker-search').fill('Absent Amulet');
      await page.locator('.concrete-base-option', { hasText: 'Absent Amulet' }).click();
      await page.evaluate(() => window.CraftForge.setCraftingRandomSource(() => 0));

      const absentState = () => page.evaluate(() => {
        const tooltip = document.getElementById('jewel-tooltip');
        const rarityClass = [...tooltip.classList].find(value => value.startsWith('rarity-')) || '';
        return {
          rarity: rarityClass.replace('rarity-', ''),
          name: document.getElementById('item-name')?.textContent?.trim() || '',
          mods: document.querySelectorAll('#mod-list .mod-line:not(.mod-empty)').length,
          empty: !!document.querySelector('#mod-list .mod-empty'),
          counter: document.getElementById('craft-counter')?.textContent || '',
          hinekoraVisible: getComputedStyle(document.getElementById('hinekora-mark')).display !== 'none',
          foresightVisible: !!document.getElementById('foreseen-banner'),
        };
      });
      const applyCraft = async craftId => {
        await page.locator(`[data-craft-id="${craftId}"]`).click();
        await page.locator('#jewel-tooltip').click();
      };

      const initialAbsent = await absentState();
      assert.equal(initialAbsent.rarity, 'normal', `${target}: Absent Amulet did not start Normal`);
      assert.equal(initialAbsent.mods, 0, `${target}: fresh Absent Amulet has explicit modifiers`);
      assert.equal(await page.locator('[data-craft-id="transmutation"]').getAttribute('aria-disabled'), 'false',
        `${target}: Transmutation is disabled on Normal Absent Amulet`);

      await applyCraft('transmutation');
      const magicAbsent = await absentState();
      assert.equal(magicAbsent.rarity, 'magic', `${target}: zero-affix Transmutation did not produce Magic rarity`);
      assert(magicAbsent.empty && magicAbsent.mods === 0, `${target}: zero-affix Transmutation added a modifier`);
      assert.equal(await page.locator('[data-craft-id="augmentation"]').getAttribute('data-disabled-reason'),
        'This base has 0 available Magic affix slots.', `${target}: Augmentation capacity reason`);
      assert.equal(await page.locator('[data-craft-id="regal"]').getAttribute('aria-disabled'), 'false',
        `${target}: Regal is disabled on zero-modifier Magic Absent Amulet`);
      assert.match(magicAbsent.counter, /1 currency used/i, `${target}: successful zero-affix craft was not counted`);

      await page.locator('[data-craft-id="augmentation"]').dispatchEvent('click');
      assert.equal(await page.locator('#error-toast').textContent(), 'This base has 0 available Magic affix slots.',
        `${target}: blocked Augmentation toast`);
      assert.deepEqual(await absentState(), magicAbsent, `${target}: blocked Augmentation mutated the item`);

      await page.locator('#save-btn').click();
      assert.equal(await page.locator('.stash-slot.filled.rarity-magic').count(), 1,
        `${target}: zero-modifier Magic item was not saved to stash`);
      await applyCraft('regal');
      const rareAbsent = await absentState();
      assert.equal(rareAbsent.rarity, 'rare', `${target}: Regal did not produce Rare rarity`);
      assert.equal(rareAbsent.mods, 1, `${target}: Regal did not add exactly one Rare modifier`);

      await page.locator('#undo-btn').click();
      assert.deepEqual(await absentState(), magicAbsent, `${target}: first undo did not restore zero-modifier Magic state`);
      await page.locator('#undo-btn').click();
      const undoneNormal = await absentState();
      assert.equal(undoneNormal.rarity, 'normal', `${target}: second undo did not restore Normal rarity`);
      assert(undoneNormal.empty && undoneNormal.mods === 0, `${target}: second undo restored unexpected modifiers`);
      await page.locator('#redo-btn').click();
      assert.deepEqual(await absentState(), magicAbsent, `${target}: first redo did not restore zero-modifier Magic state`);
      await page.locator('#redo-btn').click();
      assert.deepEqual(await absentState(), rareAbsent, `${target}: second redo did not restore exact Rare state`);

      await page.locator('.stash-slot.filled').click();
      const loadedMagic = await absentState();
      assert.equal(loadedMagic.rarity, 'magic', `${target}: stash load did not restore Magic rarity`);
      assert(loadedMagic.empty && loadedMagic.mods === 0, `${target}: stash load did not preserve zero modifiers`);
      assert.equal(loadedMagic.name, 'Absent Amulet', `${target}: stash load lost concrete base identity`);

      await page.locator('#reset-btn').click();
      const hinekoraDefinition = await page.evaluate(() => window.CraftForge.getCraftRegistry().hinekora);
      await page.evaluate(tab => window.CraftForge.setCraftTab(tab), hinekoraDefinition.tab);
      await applyCraft('hinekora');
      assert((await absentState()).hinekoraVisible, `${target}: Hinekora lock was not applied`);
      const transmutationDefinition = await page.evaluate(() => window.CraftForge.getCraftRegistry().transmutation);
      await page.evaluate(tab => window.CraftForge.setCraftTab(tab), transmutationDefinition.tab);
      await page.locator('[data-craft-id="transmutation"]').click();
      await page.locator('#jewel-tooltip').hover();
      const previewAbsent = await absentState();
      assert(previewAbsent.foresightVisible, `${target}: zero-affix Hinekora preview was not shown`);
      assert.equal(previewAbsent.rarity, 'magic', `${target}: Hinekora preview rarity`);
      assert(previewAbsent.empty && previewAbsent.mods === 0, `${target}: Hinekora preview added a modifier`);
      await page.locator('#jewel-tooltip').click();
      const committedAbsent = await absentState();
      assert.deepEqual(
        { rarity: committedAbsent.rarity, name: committedAbsent.name, mods: committedAbsent.mods, empty: committedAbsent.empty },
        { rarity: previewAbsent.rarity, name: previewAbsent.name, mods: previewAbsent.mods, empty: previewAbsent.empty },
        `${target}: Hinekora commit differed from its zero-affix preview`,
      );
      assert(!committedAbsent.hinekoraVisible, `${target}: Hinekora lock survived committed Transmutation`);

      await page.locator('#reset-btn').click();
      await page.locator('[data-craft-id="transmutation"]').click({ button: 'right' });
      await page.locator('#jewel-tooltip').click();
      assert(!(await page.locator('[data-craft-id="transmutation"]').evaluate(button => button.classList.contains('sticky'))),
        `${target}: sticky Transmutation remained armed after becoming unavailable`);
      const stickyMagic = await absentState();
      assert.equal(stickyMagic.rarity, 'magic', `${target}: sticky zero-affix Transmutation rarity`);
      await page.locator('#jewel-tooltip').click();
      assert.deepEqual(await absentState(), stickyMagic, `${target}: cleared sticky mode allowed a second mutation`);

      await page.locator('#back-to-select').click();
      results.push({
        classLabel: 'Absent Amulet regression',
        defaultBase: initialAbsent.name,
        magicCapacity: '0/0',
        rareCapacity: '2/2',
      });

      assert.deepEqual(runtimeErrors, [], `${target}: browser errors`);
      console.log(JSON.stringify({ target, startup, results }, null, 2));
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
