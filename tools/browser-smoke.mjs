#!/usr/bin/env node

import assert from 'node:assert/strict';

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('Usage: node tools/browser-smoke.mjs <file:///.../index.html|http://localhost:8080/> [...]');
  process.exitCode = 2;
} else {
  const { chromium } = await import('playwright').catch(error => {
    throw new Error(`Browser smoke test requires an existing Playwright installation: ${error.message}`);
  });

  const browser = await chromium.launch({ headless: true });
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
      page.on('pageerror', error => runtimeErrors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error') runtimeErrors.push(message.text());
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
        const card = page.locator('.cat-card', { hasText: classLabel });
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

          await page.getByRole('button', { name: 'Orb of Transmutation', exact: true }).click();
          await page.locator('#jewel-tooltip').click();
          await page.getByRole('button', { name: 'Regal Orb', exact: true }).click();
          await page.locator('#jewel-tooltip').click();
          await page.getByRole('button', { name: 'Chaos Orb', exact: true }).click({ button: 'right' });
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

      assert.deepEqual(runtimeErrors, [], `${target}: browser errors`);
      console.log(JSON.stringify({ target, startup, results }, null, 2));
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
