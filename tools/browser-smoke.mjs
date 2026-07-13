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
      assert.equal(startup.craftRegistryLength, 46, `${target}: available runtime registry length`);
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

          await page.locator('.concrete-base-trigger').click();
          const pickerLayout = await page.evaluate(() => {
            const dialog = document.querySelector('.base-picker-dialog');
            const list = document.getElementById('base-picker-list');
            const filters = document.querySelector('.base-picker-filters');
            const dialogBounds = dialog.getBoundingClientRect();
            const listBounds = list.getBoundingClientRect();
            const dialogStyle = getComputedStyle(dialog);
            const overlayStyle = getComputedStyle(document.getElementById('concrete-base-picker'));
            const lastOption = list.lastElementChild;
            list.scrollTop = list.scrollHeight;
            const lastBounds = lastOption?.getBoundingClientRect();
            return {
              filtersHidden: getComputedStyle(filters).display === 'none',
              dialogTop: dialogBounds.top,
              dialogBottom: dialogBounds.bottom,
              dialogClientHeight: dialog.clientHeight,
              dialogScrollHeight: dialog.scrollHeight,
              listTop: listBounds.top,
              listBottom: listBounds.bottom,
              listClientHeight: list.clientHeight,
              listScrollHeight: list.scrollHeight,
              listScrollTop: list.scrollTop,
              paddingBottom: Number.parseFloat(dialogStyle.paddingBottom) || 0,
              lastTop: lastBounds?.top ?? 0,
              lastBottom: lastBounds?.bottom ?? 0,
              overlayFilter: overlayStyle.backdropFilter || overlayStyle.webkitBackdropFilter || 'none',
              horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
            };
          });
          assert(pickerLayout.filtersHidden, `${target}: Amulet-only picker unexpectedly shows attribute filters`);
          assert(pickerLayout.dialogTop >= 0 && pickerLayout.dialogBottom <= 621,
            `${target}: picker dialog escaped the 1180x620 viewport`);
          assert(pickerLayout.dialogScrollHeight <= pickerLayout.dialogClientHeight + 1,
            `${target}: picker content escaped its framed dialog`);
          assert(pickerLayout.listBottom <= pickerLayout.dialogBottom - pickerLayout.paddingBottom + 1,
            `${target}: picker list broke through the lower dialog border`);
          assert(pickerLayout.listClientHeight >= 96 && pickerLayout.listScrollHeight > pickerLayout.listClientHeight,
            `${target}: picker list did not receive a usable internal scroll viewport`);
          assert(pickerLayout.listScrollTop > 0 && pickerLayout.lastTop >= pickerLayout.listTop - 1 &&
            pickerLayout.lastBottom <= pickerLayout.listBottom + 1,
            `${target}: picker could not scroll its final base inside the list viewport`);
          assert.equal(pickerLayout.overlayFilter, 'none', `${target}: picker retained a full-viewport backdrop filter`);
          assert(pickerLayout.horizontalOverflow <= 2, `${target}: picker introduced horizontal page overflow`);
          await page.locator('#base-picker-close').click();

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

          await page.locator('input[name="craft-inventory-mode"][value="known"]').check();
          await page.waitForFunction(() => Object.keys(window.CraftForge?.getCraftRegistry?.() || {}).length === 531);
          const knownInventory = [];
          for (const [tab, expectedCards] of [['essences', 80], ['runeforging', 19], ['socketing', 288]]) {
            await page.evaluate(value => window.CraftForge.setCraftTab(value), tab);
            knownInventory.push(await page.evaluate(() => ({
              active: window.CraftForge.getActiveCraftTab(),
              cards: document.querySelectorAll('[data-craft-id]').length,
              populatedPanels: [...document.querySelectorAll('[data-craft-panel]')]
                .filter(panel => panel.querySelector('[data-craft-id]')).length,
              count: document.getElementById('craft-result-count')?.textContent || '',
            })));
            assert.equal(knownInventory.at(-1).cards, expectedCards, `${target}: ${tab} known card count`);
            assert.equal(knownInventory.at(-1).populatedPanels, 1, `${target}: ${tab} accumulated inactive card DOM`);
            if (tab === 'essences') {
              const blockedEssence = page.locator('[data-craft-id]').first();
              assert.equal(await blockedEssence.getAttribute('aria-disabled'), 'true', `${target}: blocked Essence is interactive`);
              assert.equal(await blockedEssence.locator('.craft-status').textContent(), 'Blocked',
                `${target}: blocked Essence lacks a textual status`);
              assert((await blockedEssence.getAttribute('title'))?.startsWith('Mechanic blocked because'),
                `${target}: blocked Essence lacks a precise explanation`);
            }
          }
          assert.match(knownInventory[0].count, /0 available .* 80 known/i, `${target}: Essence category count`);
          assert.match(knownInventory[1].count, /0 available .* 19 known/i, `${target}: Runeforging category count`);
          await page.evaluate(() => window.CraftForge.setCraftTab('abyss'));
          assert.equal(await page.locator('.craft-status-inferred').count(), 6, `${target}: inferred Bone status count`);
          assert.equal(await page.evaluate(() => window.CraftForge.getCraftRegistry()['preserved-collarbone']?.supported), true,
            `${target}: inferred Bone has no executable registry path`);
          await page.evaluate(() => window.CraftForge.setCraftTab('socketing'));
          await page.locator('#craft-show-deprecated').check();
          assert.equal(await page.locator('[data-craft-id]').count(), 296, `${target}: deprecated socket audit count`);
          await page.locator('input[name="craft-inventory-mode"][value="available"]').check();
          await page.evaluate(() => window.CraftForge.setCraftTab('runeforging'));
          assert.equal(await page.locator('[data-craft-id]').count(), 0, `${target}: Available Runeforging should be empty`);
          assert.match(await page.locator('.craft-inventory-empty').textContent(), /No implemented Runeforging.*19 known items/i,
            `${target}: empty category explanation`);

          await page.evaluate(() => window.CraftForge.setCraftTab('currency'));
          const wheel = await page.evaluate(() => {
            const strip = document.getElementById('craft-tab-list');
            const activeBefore = window.CraftForge.getActiveCraftTab();
            const fire = (deltaX, deltaY, shiftKey = false) => {
              const before = strip.scrollLeft;
              const event = new WheelEvent('wheel', { deltaX, deltaY, shiftKey, bubbles: true, cancelable: true });
              strip.dispatchEvent(event);
              return { before, after: strip.scrollLeft, prevented: event.defaultPrevented };
            };
            strip.scrollLeft = 0;
            const right = fire(0, 120);
            const left = fire(0, -60);
            strip.scrollLeft = 0;
            const trackpad = fire(90, 0);
            strip.scrollLeft = 0;
            const shifted = fire(0, 75, true);
            strip.scrollLeft = 0;
            const leftBoundary = fire(0, -80);
            strip.scrollLeft = strip.scrollWidth - strip.clientWidth;
            const rightBoundary = fire(0, 80);
            const select = document.getElementById('craft-category-filter');
            const selectValue = select.value;
            select.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true }));
            return {
              overflow: strip.scrollWidth > strip.clientWidth,
              right, left, trackpad, shifted, leftBoundary, rightBoundary,
              activeUnchanged: window.CraftForge.getActiveCraftTab() === activeBefore,
              selectUnchanged: select.value === selectValue,
            };
          });
          assert(wheel.overflow && wheel.right.after > wheel.right.before && wheel.right.prevented,
            `${target}: vertical wheel did not scroll tabs right`);
          assert(wheel.left.after < wheel.left.before && wheel.left.prevented, `${target}: wheel did not scroll tabs left`);
          assert(wheel.trackpad.after > 0 && wheel.trackpad.prevented, `${target}: horizontal trackpad delta was not consumed`);
          assert(wheel.shifted.after > 0 && wheel.shifted.prevented, `${target}: Shift+wheel was not consumed`);
          assert(!wheel.leftBoundary.prevented && !wheel.rightBoundary.prevented, `${target}: tab strip trapped wheel at a boundary`);
          assert(wheel.activeUnchanged && wheel.selectUnchanged, `${target}: scrolling changed active tab or native select`);
          await page.locator('[data-craft-tab="corruption"]').click();
          assert.equal(await page.evaluate(() => window.CraftForge.getActiveCraftTab()), 'corruption',
            `${target}: clicking a scrolled tab did not activate it`);
          await page.locator('[data-craft-tab="currency"]').focus();
          await page.keyboard.press('End');
          assert.equal(await page.evaluate(() => window.CraftForge.getActiveCraftTab()), 'corruption',
            `${target}: keyboard tab navigation failed after scrolling`);
          await page.evaluate(() => window.CraftForge.setCraftTab('currency'));

          await page.locator('[data-craft-id="transmutation"]').click();
          await page.locator('#jewel-tooltip').click();
          assert.equal(await page.locator('#mod-list .mod-line:not(.mod-empty)').count(), 1,
            `${target}: ordinary Amulet Transmutation did not add exactly one modifier`);
          await page.locator('[data-craft-id="regal"]').click();
          await page.locator('#jewel-tooltip').click();
          await page.locator('[data-craft-id="chaos"]').click({ button: 'right' });
          await page.evaluate(() => window.CraftForge.setCraftTab('ritual'));
          await page.evaluate(() => window.CraftForge.setCraftTab('currency'));
          assert(await page.locator('[data-craft-id="chaos"]').evaluate(button => button.classList.contains('sticky')),
            `${target}: sticky state was lost after active-tab rerender`);
          await page.locator('#jewel-tooltip').click();
          await page.locator('#jewel-tooltip').click();
          const sticky = await page.locator('[data-craft-id="chaos"]').evaluate(button => ({
            active: button.classList.contains('sticky'),
            pressed: button.getAttribute('aria-pressed'),
            uses: document.getElementById('craft-counter')?.textContent || '',
          }));
          assert(sticky.active && sticky.pressed === 'true' && /Chaos OrbI×2/.test(sticky.uses), `${target}: sticky currency did not repeat`);
          await page.keyboard.press('Escape');
          assert(!(await page.locator('[data-craft-id="chaos"]').evaluate(button => button.classList.contains('sticky'))),
            `${target}: Escape did not clear sticky currency`);

          for (const viewport of [
            { label: 'mobile', width: 390, height: 844, stacked: true },
            { label: 'common laptop', width: 1366, height: 768, stacked: false },
            { label: 'large desktop', width: 1920, height: 1080, stacked: false },
          ]) {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            const layout = await page.evaluate(() => {
              const rect = selector => {
                const bounds = document.querySelector(selector)?.getBoundingClientRect();
                return bounds ? { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height } : null;
              };
              return {
                horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
                currency: rect('#currency-panel'),
                item: rect('#jewel-panel'),
                stash: rect('#stash-panel'),
                tabs: rect('#craft-tab-list'),
                categorySelect: rect('#craft-category-filter'),
              };
            });
            assert(layout.horizontalOverflow <= 2, `${target}: ${viewport.label} layout overflows horizontally`);
            assert(layout.currency?.width > 0 && layout.item?.width > 0 && layout.stash?.width > 0 && layout.tabs?.width > 0,
              `${target}: ${viewport.label} workbench panels or tabs are not rendered`);
            if (viewport.stacked) {
              assert(layout.item.y < layout.currency.y && layout.currency.y < layout.stash.y,
                `${target}: mobile workbench panels are not stacked in the responsive order`);
              assert(layout.categorySelect?.width > 0, `${target}: mobile category selector is unavailable`);
            } else {
              assert(Math.abs(layout.currency.y - layout.item.y) <= 2 && Math.abs(layout.item.y - layout.stash.y) <= 2,
                `${target}: ${viewport.label} workbench panels do not share the desktop row`);
              assert((layout.categorySelect?.width || 0) === 0,
                `${target}: ${viewport.label} duplicates tabs with the category selector`);
            }
          }
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
      assert.match(magicAbsent.counter, /1 currency use/i, `${target}: successful zero-affix craft was not counted`);

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

      await page.locator('#reset-btn').click();
      await page.locator('.concrete-base-trigger').click();
      await page.locator('#base-picker-search').fill('Crimson Amulet');
      await page.locator('.concrete-base-option', { hasText: 'Crimson Amulet' }).click();
      await page.evaluate(() => window.CraftForge.setCraftTab('currency'));
      await applyCraft('alchemy');
      const omenBaseMods = (await absentState()).mods;
      await page.evaluate(() => window.CraftForge.setCraftTab('ritual'));
      assert.equal(await page.locator('[data-craft-id="omen-greater-exaltation"]').getAttribute('aria-disabled'), 'false',
        `${target}: expanded Greater Exaltation Omen is unavailable on a qualifying Rare item`);
      await page.locator('[data-craft-id="omen-greater-exaltation"]').click();
      await page.evaluate(() => window.CraftForge.setCraftTab('currency'));
      await page.evaluate(() => window.CraftForge.setCraftTab('ritual'));
      assert(await page.locator('[data-craft-id="omen-greater-exaltation"]').evaluate(button => button.classList.contains('active')),
        `${target}: expanded Omen state was lost after tab rerender`);
      await page.evaluate(() => window.CraftForge.setCraftTab('currency'));
      await applyCraft('exalted');
      assert.equal((await absentState()).mods, omenBaseMods + 2, `${target}: Greater Exaltation did not add exactly two modifiers`);
      assert.match((await absentState()).counter, /Omen of Greater Exaltation/i, `${target}: expanded Omen identity missing from history`);
      await page.locator('#undo-btn').click();
      assert.equal((await absentState()).mods, omenBaseMods, `${target}: undo did not restore pre-Omen item`);
      await page.evaluate(() => window.CraftForge.setCraftTab('ritual'));
      assert(await page.locator('[data-craft-id="omen-greater-exaltation"]').evaluate(button => button.classList.contains('active')),
        `${target}: undo did not restore expanded Omen state`);
      await page.locator('#redo-btn').click();
      assert.equal((await absentState()).mods, omenBaseMods + 2, `${target}: redo did not restore expanded Omen result`);

      await page.locator('#reset-btn').click();
      await page.evaluate(() => window.CraftForge.setCraftTab('currency'));
      await applyCraft('alchemy');
      await page.evaluate(() => window.CraftForge.setCraftTab('abyss'));
      assert.equal(await page.locator('[data-craft-id="preserved-collarbone"]').getAttribute('aria-disabled'), 'false',
        `${target}: Preserved Collarbone is unavailable on a qualifying Amulet`);
      await page.locator('[data-craft-id="preserved-collarbone"]').click();
      await page.evaluate(() => window.CraftForge.setCraftTab('currency'));
      await page.evaluate(() => window.CraftForge.setCraftTab('abyss'));
      assert(await page.locator('[data-craft-id="preserved-collarbone"]').evaluate(button => button.classList.contains('armed')),
        `${target}: inferred Bone arm state was lost after tab rerender`);
      await page.locator('#jewel-tooltip').click();
      assert(await page.locator('#reveal-panel').isVisible(), `${target}: Preserved Collarbone did not start Desecration`);
      assert.equal(await page.locator('#mod-list .unrevealed-mod').count(), 1, `${target}: inferred Bone did not place one unrevealed modifier`);
      await page.locator('#undo-btn').click();
      assert(!(await page.locator('#reveal-panel').isVisible()), `${target}: undo did not restore the pre-Bone state`);

      await page.locator('#reset-btn').click();
      await page.evaluate(() => window.CraftForge.setCraftTab('currency'));
      await applyCraft('transmutation');
      await applyCraft('regal');
      await page.locator('[data-craft-id="chaos"]').click({ button: 'right' });
      for (let index = 0; index < 34; index++) await page.locator('#jewel-tooltip').click();
      await page.keyboard.press('Escape');
      await page.locator('[data-craft-id="perfect-chaos"]').click({ button: 'right' });
      for (let index = 0; index < 26; index++) await page.locator('#jewel-tooltip').click();
      await page.keyboard.press('Escape');
      const historyFixture = await page.evaluate(() => ({
        heading: document.querySelector('#craft-counter .cc-total')?.textContent || '',
        chips: [...document.querySelectorAll('#craft-counter .cc-chip')].map(chip => ({
          name: chip.querySelector('.cc-name')?.textContent || '',
          tier: chip.querySelector('.cc-tier')?.textContent || '',
          count: chip.querySelector('.cc-count')?.textContent || '',
          aria: chip.getAttribute('aria-label') || '',
        })),
      }));
      assert.equal(historyFixture.heading, '62 currency uses', `${target}: exact history total wording`);
      assert.equal(historyFixture.chips.length, 4, `${target}: exact history entry count`);
      assert.deepEqual(historyFixture.chips.map(chip => [chip.name, chip.tier, chip.count]), [
        ['Orb of Transmutation', 'I', '×1'],
        ['Regal Orb', 'I', '×1'],
        ['Chaos Orb', 'I', '×34'],
        ['Perfect Chaos Orb', 'III', '×26'],
      ], `${target}: exact history identity/tier/count fixture`);
      assert(historyFixture.chips.every(chip => /tier (?:I|III), \d+ currency use/.test(chip.aria)),
        `${target}: history chips lack exact accessible labels`);

      await page.locator('#back-to-select').click();
      results.push({
        classLabel: 'Absent Amulet regression',
        defaultBase: initialAbsent.name,
        magicCapacity: '0/0',
        rareCapacity: '2/2',
      });

      assert.deepEqual(runtimeErrors, [], `${target}: browser errors`);
      if (/^https?:/i.test(target)) {
        await page.evaluate(async () => {
          await navigator.serviceWorker.register('./sw.js');
          await navigator.serviceWorker.ready;
        });
        await page.reload({ waitUntil: 'load' });
        await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
        const offlineCache = await page.evaluate(async () => {
          const names = await caches.keys();
          const urls = [];
          for (const name of names) {
            const cache = await caches.open(name);
            urls.push(...(await cache.keys()).map(request => new URL(request.url).pathname));
          }
          return { names, urls };
        });
        assert(offlineCache.names.includes('poe2-craft-registry-v5'), `${target}: updated service-worker cache missing`);
        assert(offlineCache.urls.some(url => url.endsWith('/data/crafting/known-items.data.js')),
          `${target}: lazy known-items catalog missing from offline cache`);
        page.removeAllListeners('console');
        page.removeAllListeners('pageerror');
        page.removeAllListeners('response');
        page.removeAllListeners('requestfailed');
        await context.setOffline(true);
        await page.reload({ waitUntil: 'load' });
        assert(await page.locator('#select-view').isVisible(), `${target}: offline reload did not restore the app shell`);
        await page.locator('.cat-card', { hasText: 'Amulets' }).click();
        await page.locator('input[name="craft-inventory-mode"][value="known"]').check();
        await page.waitForFunction(() => Object.keys(window.CraftForge?.getCraftRegistry?.() || {}).length === 531);
        assert.equal(await page.evaluate(() => Object.keys(window.CraftForge.getCraftRegistry()).length), 531,
          `${target}: offline lazy catalog did not restore all definitions`);
        await context.setOffline(false);
      }
      console.log(JSON.stringify({ target, startup, results }, null, 2));
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
