# Asset requirements

Target game version: **0.5.4**

Generated deterministically from `data/normalized/base-items.json` and `data/crafting/currency-index.json`. No timestamp is included.

Regenerate with `node tools/build-asset-requirements.mjs` and verify with `node tools/build-asset-requirements.mjs --check`.

## Asset conventions

- Concrete base art: `assets/item-bases/<baseId>.png`
- Craft icons: `assets/icons/<iconId>.png`
- “Current” excludes definitions whose implementation status is `deprecated_for_target_version`.
- Asset status uses exact file names so the report remains valid on case-sensitive GitHub Pages hosting.

## Summary

| Requirement | Total | Existing | Missing |
|---|---:|---:|---:|
| Mapped concrete-base assets | 1759 | 1 | 1758 |
| Known craft-icon assets | 521 | 11 | 510 |
| Current craft-icon assets | 512 | 11 | 501 |
| Supported craft-icon assets | 405 | 10 | 395 |

- Simulator pools: **65**
- Mapped concrete bases: **1759** (1757 selectable; 2 unselectable)
- Craft definitions: **531 known**, **522 current**, **415 supported**, **522 visible**

## Concrete-base assets

Selectable is derived from the normalized `unmodifiable` flag. Every mapped base is listed, including unselectable bases that still require art for a complete asset set.

| Base ID | Display name | Pool(s) | Selectable | Required asset | Status | Metadata key |
|---:|---|---|:---:|---|---|---|
| 369 | Golden Blade | `one_hand_swords` | yes | `assets/item-bases/369.png` | missing | `Metadata/items/Weapons/OneHandWeapons/OneHandSwords/OneHandSwordDemigods1` |
| 371 | Golden Hoop | `rings` | yes | `assets/item-bases/371.png` | missing | `Metadata/Items/Rings/RingDemigods1` |
| 372 | Golden Obi | `belts` | yes | `assets/item-bases/372.png` | missing | `Metadata/Items/Belts/BeltDemigods1` |
| 373 | Golden Flame | `shields_str_dex_int` | yes | `assets/item-bases/373.png` | missing | `Metadata/Items/Armours/Shields/ShieldDemigods` |
| 376 | Golden Mantle | `body_armours_str_dex_int` | yes | `assets/item-bases/376.png` | missing | `Metadata/Items/Armours/BodyArmours/BodyDemigods1` |
| 614 | Ruby | `ruby` | yes | `assets/item-bases/614.png` | missing | `Metadata/Items/Jewels/JewelStr` |
| 615 | Emerald | `emerald` | yes | `assets/item-bases/615.png` | missing | `Metadata/Items/Jewels/JewelDex` |
| 616 | Sapphire | `sapphire` | yes | `assets/item-bases/616.png` | missing | `Metadata/Items/Jewels/JewelInt` |
| 617 | Diamond | `diamond` | yes | `assets/item-bases/617.png` | missing | `Metadata/Items/Jewels/JewelDiamond` |
| 618 | Time-Lost Ruby | `time_lost_ruby` | yes | `assets/item-bases/618.png` | missing | `Metadata/Items/Jewels/JewelRadiusStr` |
| 619 | Time-Lost Emerald | `time_lost_emerald` | yes | `assets/item-bases/619.png` | missing | `Metadata/Items/Jewels/JewelRadiusDex` |
| 620 | Time-Lost Sapphire | `time_lost_sapphire` | yes | `assets/item-bases/620.png` | missing | `Metadata/Items/Jewels/JewelRadiusInt` |
| 621 | Time-Lost Diamond | `time_lost_diamond` | yes | `assets/item-bases/621.png` | missing | `Metadata/Items/Jewels/JewelRadiusDiamond` |
| 1463 | Energy Blade | `one_hand_swords` | yes | `assets/item-bases/1463.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/StormBladeOneHand` |
| 1464 | Energy Blade | `two_hand_swords` | yes | `assets/item-bases/1464.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/StormBladeTwoHand` |
| 1938 | Shortsword | `one_hand_swords` | yes | `assets/item-bases/1938.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSword1` |
| 1939 | Broadsword | `one_hand_swords` | yes | `assets/item-bases/1939.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSword2` |
| 1940 | Vampiric Blade | `one_hand_swords` | yes | `assets/item-bases/1940.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSword3` |
| 1941 | Scimitar | `one_hand_swords` | yes | `assets/item-bases/1941.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSword4` |
| 1942 | Charred Shortsword | `one_hand_swords` | yes | `assets/item-bases/1942.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSword5` |
| 1943 | Sickle Sword | `one_hand_swords` | yes | `assets/item-bases/1943.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSword6` |
| 1944 | Falchion | `one_hand_swords` | yes | `assets/item-bases/1944.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSword7` |
| 1945 | Treasured Blade | `one_hand_swords` | yes | `assets/item-bases/1945.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSword8` |
| 1946 | Cutlass | `one_hand_swords` | yes | `assets/item-bases/1946.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSword9` |
| 1947 | Runic Shortsword | `one_hand_swords` | yes | `assets/item-bases/1947.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSword10` |
| 1948 | Messer | `one_hand_swords` | yes | `assets/item-bases/1948.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSword11` |
| 1949 | Commander Sword | `one_hand_swords` | yes | `assets/item-bases/1949.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSword12` |
| 1950 | Dark Blade | `one_hand_swords` | yes | `assets/item-bases/1950.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSword13` |
| 1959 | Corroded Longsword | `two_hand_swords` | yes | `assets/item-bases/1959.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/FourTwoHandSword1` |
| 1960 | Iron Greatsword | `two_hand_swords` | yes | `assets/item-bases/1960.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/FourTwoHandSword2` |
| 1961 | Blessed Claymore | `two_hand_swords` | yes | `assets/item-bases/1961.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/FourTwoHandSword3` |
| 1962 | Broad Greatsword | `two_hand_swords` | yes | `assets/item-bases/1962.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/FourTwoHandSword4` |
| 1963 | Rippled Greatsword | `two_hand_swords` | yes | `assets/item-bases/1963.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/FourTwoHandSword5` |
| 1964 | Arced Longsword | `two_hand_swords` | yes | `assets/item-bases/1964.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/FourTwoHandSword6` |
| 1965 | Stone Greatsword | `two_hand_swords` | yes | `assets/item-bases/1965.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/FourTwoHandSword7` |
| 1966 | Obsidian Greatsword | `two_hand_swords` | yes | `assets/item-bases/1966.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/FourTwoHandSword8` |
| 1967 | Keen Greatsword | `two_hand_swords` | yes | `assets/item-bases/1967.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/FourTwoHandSword9` |
| 1968 | Ancient Greatblade | `two_hand_swords` | yes | `assets/item-bases/1968.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/FourTwoHandSword10` |
| 1969 | Flanged Greatblade | `two_hand_swords` | yes | `assets/item-bases/1969.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/FourTwoHandSword11` |
| 1970 | Regalia Longsword | `two_hand_swords` | yes | `assets/item-bases/1970.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/FourTwoHandSword12` |
| 1971 | Ultra Greatsword | `two_hand_swords` | yes | `assets/item-bases/1971.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandSwords/FourTwoHandSword13` |
| 1980 | Dull Hatchet | `one_hand_axes` | yes | `assets/item-bases/1980.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/FourOneHandAxe1` |
| 1981 | Hook Axe | `one_hand_axes` | yes | `assets/item-bases/1981.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/FourOneHandAxe2` |
| 1982 | Bearded Axe | `one_hand_axes` | yes | `assets/item-bases/1982.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/FourOneHandAxe3` |
| 1983 | Extended Cleaver | `one_hand_axes` | yes | `assets/item-bases/1983.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/FourOneHandAxe4` |
| 1984 | Bandit Hatchet | `one_hand_axes` | yes | `assets/item-bases/1984.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/FourOneHandAxe5` |
| 1985 | Crescent Axe | `one_hand_axes` | yes | `assets/item-bases/1985.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/FourOneHandAxe6` |
| 1986 | Carving Hatchet | `one_hand_axes` | yes | `assets/item-bases/1986.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/FourOneHandAxe7` |
| 1987 | Sacrificial Axe | `one_hand_axes` | yes | `assets/item-bases/1987.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/FourOneHandAxe8` |
| 1988 | Boarding Hatchet | `one_hand_axes` | yes | `assets/item-bases/1988.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/FourOneHandAxe9` |
| 1989 | Fury Cleaver | `one_hand_axes` | yes | `assets/item-bases/1989.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/FourOneHandAxe10` |
| 1990 | Battle Axe | `one_hand_axes` | yes | `assets/item-bases/1990.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/FourOneHandAxe11` |
| 1991 | Profane Cleaver | `one_hand_axes` | yes | `assets/item-bases/1991.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/FourOneHandAxe12` |
| 1992 | Dread Hatchet | `one_hand_axes` | yes | `assets/item-bases/1992.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandAxes/FourOneHandAxe13` |
| 2001 | Splitting Greataxe | `two_hand_axes` | yes | `assets/item-bases/2001.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/FourTwoHandAxe1` |
| 2002 | Light Halberd | `two_hand_axes` | yes | `assets/item-bases/2002.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/FourTwoHandAxe2` |
| 2003 | Executioner Greataxe | `two_hand_axes` | yes | `assets/item-bases/2003.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/FourTwoHandAxe3` |
| 2004 | Arched Greataxe | `two_hand_axes` | yes | `assets/item-bases/2004.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/FourTwoHandAxe4` |
| 2005 | Elegant Glaive | `two_hand_axes` | yes | `assets/item-bases/2005.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/FourTwoHandAxe5` |
| 2006 | Savage Greataxe | `two_hand_axes` | yes | `assets/item-bases/2006.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/FourTwoHandAxe6` |
| 2007 | Rending Halberd | `two_hand_axes` | yes | `assets/item-bases/2007.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/FourTwoHandAxe7` |
| 2008 | Jagged Greataxe | `two_hand_axes` | yes | `assets/item-bases/2008.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/FourTwoHandAxe8` |
| 2009 | Reaver Glaive | `two_hand_axes` | yes | `assets/item-bases/2009.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/FourTwoHandAxe9` |
| 2010 | Ember Greataxe | `two_hand_axes` | yes | `assets/item-bases/2010.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/FourTwoHandAxe10` |
| 2011 | Ceremonial Halberd | `two_hand_axes` | yes | `assets/item-bases/2011.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/FourTwoHandAxe11` |
| 2012 | Monument Greataxe | `two_hand_axes` | yes | `assets/item-bases/2012.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/FourTwoHandAxe12` |
| 2013 | Vile Greataxe | `two_hand_axes` | yes | `assets/item-bases/2013.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandAxes/FourTwoHandAxe13` |
| 2022 | Wooden Club | `one_hand_maces` | yes | `assets/item-bases/2022.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace1` |
| 2023 | Smithing Hammer | `one_hand_maces` | yes | `assets/item-bases/2023.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace2` |
| 2024 | Slim Mace | `one_hand_maces` | yes | `assets/item-bases/2024.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace3` |
| 2025 | Spiked Club | `one_hand_maces` | yes | `assets/item-bases/2025.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace4` |
| 2026 | Warpick | `one_hand_maces` | yes | `assets/item-bases/2026.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace5` |
| 2027 | Plated Mace | `one_hand_maces` | yes | `assets/item-bases/2027.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace6` |
| 2028 | Brigand Mace | `one_hand_maces` | yes | `assets/item-bases/2028.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace7` |
| 2029 | Construct Hammer | `one_hand_maces` | yes | `assets/item-bases/2029.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace8` |
| 2030 | Morning Star | `one_hand_maces` | yes | `assets/item-bases/2030.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace9` |
| 2031 | Jade Club | `one_hand_maces` | yes | `assets/item-bases/2031.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace10` |
| 2032 | Lumen Mace | `one_hand_maces` | yes | `assets/item-bases/2032.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace11` |
| 2033 | Execratus Hammer | `one_hand_maces` | yes | `assets/item-bases/2033.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace12` |
| 2034 | Torment Club | `one_hand_maces` | yes | `assets/item-bases/2034.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace13` |
| 2035 | Runemastered Torment Club | `one_hand_maces` | yes | `assets/item-bases/2035.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace13VerisiumUnique1` |
| 2036 | Runemastered Torment Club | `one_hand_maces` | yes | `assets/item-bases/2036.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace13VerisiumUnique2` |
| 2037 | Runemastered Torment Club | `one_hand_maces` | yes | `assets/item-bases/2037.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace13VerisiumUnique3` |
| 2038 | Runemastered Torment Club | `one_hand_maces` | yes | `assets/item-bases/2038.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace13VerisiumUnique4` |
| 2039 | Runemastered Torment Club | `one_hand_maces` | yes | `assets/item-bases/2039.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace13VerisiumUnique5` |
| 2040 | Runemastered Torment Club | `one_hand_maces` | yes | `assets/item-bases/2040.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace13VerisiumUnique6` |
| 2041 | Kalguuran Forgehammer | `one_hand_maces` | yes | `assets/item-bases/2041.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace14` |
| 2042 | Felled Greatclub | `two_hand_maces` | yes | `assets/item-bases/2042.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace1` |
| 2043 | Oak Greathammer | `two_hand_maces` | yes | `assets/item-bases/2043.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace2` |
| 2044 | Forge Maul | `two_hand_maces` | yes | `assets/item-bases/2044.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace3` |
| 2045 | Studded Greatclub | `two_hand_maces` | yes | `assets/item-bases/2045.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace4` |
| 2046 | Cultist Greathammer | `two_hand_maces` | yes | `assets/item-bases/2046.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace5` |
| 2047 | Temple Maul | `two_hand_maces` | yes | `assets/item-bases/2047.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace6` |
| 2048 | Leaden Greathammer | `two_hand_maces` | yes | `assets/item-bases/2048.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace7` |
| 2049 | Crumbling Maul | `two_hand_maces` | yes | `assets/item-bases/2049.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace8` |
| 2050 | Pointed Maul | `two_hand_maces` | yes | `assets/item-bases/2050.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace9` |
| 2051 | Totemic Greatclub | `two_hand_maces` | yes | `assets/item-bases/2051.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace10` |
| 2052 | Greatmace | `two_hand_maces` | yes | `assets/item-bases/2052.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace11` |
| 2053 | Precise Greathammer | `two_hand_maces` | yes | `assets/item-bases/2053.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace12` |
| 2054 | Giant Maul | `two_hand_maces` | yes | `assets/item-bases/2054.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace13` |
| 2055 | Hardwood Spear | `spears` | yes | `assets/item-bases/2055.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear1` |
| 2056 | Ironhead Spear | `spears` | yes | `assets/item-bases/2056.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear2` |
| 2057 | Hunting Spear | `spears` | yes | `assets/item-bases/2057.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear3` |
| 2058 | Winged Spear | `spears` | yes | `assets/item-bases/2058.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear4` |
| 2059 | War Spear | `spears` | yes | `assets/item-bases/2059.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear5` |
| 2060 | Forked Spear | `spears` | yes | `assets/item-bases/2060.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear6` |
| 2061 | Barbed Spear | `spears` | yes | `assets/item-bases/2061.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear7` |
| 2062 | Broad Spear | `spears` | yes | `assets/item-bases/2062.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear8` |
| 2063 | Crossblade Spear | `spears` | yes | `assets/item-bases/2063.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear9` |
| 2064 | Seaglass Spear | `spears` | yes | `assets/item-bases/2064.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear10` |
| 2065 | Sword Spear | `spears` | yes | `assets/item-bases/2065.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear11` |
| 2066 | Striking Spear | `spears` | yes | `assets/item-bases/2066.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear12` |
| 2067 | Helix Spear | `spears` | yes | `assets/item-bases/2067.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear13` |
| 2068 | Crude Claw | `claws` | yes | `assets/item-bases/2068.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Claws/FourClaw1` |
| 2069 | Pict Claw | `claws` | yes | `assets/item-bases/2069.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Claws/FourClaw2` |
| 2070 | Wolfbone Claw | `claws` | yes | `assets/item-bases/2070.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Claws/FourClaw3` |
| 2071 | Forked Claw | `claws` | yes | `assets/item-bases/2071.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Claws/FourClaw4` |
| 2072 | Plated Claw | `claws` | yes | `assets/item-bases/2072.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Claws/FourClaw5` |
| 2073 | Edged Claw | `claws` | yes | `assets/item-bases/2073.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Claws/FourClaw6` |
| 2074 | Arced Claw | `claws` | yes | `assets/item-bases/2074.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Claws/FourClaw7` |
| 2075 | Hooked Claw | `claws` | yes | `assets/item-bases/2075.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Claws/FourClaw8` |
| 2076 | Razorglass Claw | `claws` | yes | `assets/item-bases/2076.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Claws/FourClaw9` |
| 2077 | Sharktooth Claw | `claws` | yes | `assets/item-bases/2077.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Claws/FourClaw10` |
| 2078 | Armoured Claw | `claws` | yes | `assets/item-bases/2078.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Claws/FourClaw11` |
| 2079 | Piercing Claw | `claws` | yes | `assets/item-bases/2079.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Claws/FourClaw12` |
| 2080 | Talon Claw | `claws` | yes | `assets/item-bases/2080.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Claws/FourClaw13` |
| 2081 | Glass Shank | `daggers` | yes | `assets/item-bases/2081.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Daggers/FourDagger1` |
| 2082 | Crone Knife | `daggers` | yes | `assets/item-bases/2082.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Daggers/FourDagger2` |
| 2083 | Simple Dagger | `daggers` | yes | `assets/item-bases/2083.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Daggers/FourDagger3` |
| 2084 | Skinning Knife | `daggers` | yes | `assets/item-bases/2084.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Daggers/FourDagger4` |
| 2085 | Moon Dagger | `daggers` | yes | `assets/item-bases/2085.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Daggers/FourDagger5` |
| 2086 | Engraved Knife | `daggers` | yes | `assets/item-bases/2086.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Daggers/FourDagger6` |
| 2087 | Obsidian Dagger | `daggers` | yes | `assets/item-bases/2087.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Daggers/FourDagger7` |
| 2088 | Bloodletting Dagger | `daggers` | yes | `assets/item-bases/2088.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Daggers/FourDagger8` |
| 2089 | Mail Breaker | `daggers` | yes | `assets/item-bases/2089.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Daggers/FourDagger9` |
| 2090 | Kris Knife | `daggers` | yes | `assets/item-bases/2090.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Daggers/FourDagger10` |
| 2091 | Parrying Dagger | `daggers` | yes | `assets/item-bases/2091.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Daggers/FourDagger11` |
| 2092 | Arcane Dirk | `daggers` | yes | `assets/item-bases/2092.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Daggers/FourDagger12` |
| 2093 | Cinquedea | `daggers` | yes | `assets/item-bases/2093.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Daggers/FourDagger13` |
| 2102 | Wrapped Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2102.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff1` |
| 2103 | Long Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2103.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff2` |
| 2104 | Gothic Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2104.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff3` |
| 2105 | Crackling Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2105.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff4` |
| 2106 | Crescent Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2106.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff5` |
| 2107 | Steelpoint Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2107.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff6` |
| 2108 | Slicing Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2108.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff7` |
| 2109 | Barrier Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2109.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff8` |
| 2110 | Hefty Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2110.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff9` |
| 2111 | Smooth Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2111.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff10` |
| 2112 | Anima Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2112.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff11` |
| 2113 | Graceful Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2113.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff12` |
| 2114 | Wyrm Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2114.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff13` |
| 2115 | Splintered Flail | `flails` | yes | `assets/item-bases/2115.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Flails/FourFlail1` |
| 2116 | Chain Flail | `flails` | yes | `assets/item-bases/2116.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Flails/FourFlail2` |
| 2117 | Holy Flail | `flails` | yes | `assets/item-bases/2117.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Flails/FourFlail3` |
| 2118 | Iron Flail | `flails` | yes | `assets/item-bases/2118.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Flails/FourFlail4` |
| 2119 | Twin Flail | `flails` | yes | `assets/item-bases/2119.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Flails/FourFlail5` |
| 2120 | Slender Flail | `flails` | yes | `assets/item-bases/2120.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Flails/FourFlail6` |
| 2121 | Stone Flail | `flails` | yes | `assets/item-bases/2121.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Flails/FourFlail7` |
| 2122 | Ring Flail | `flails` | yes | `assets/item-bases/2122.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Flails/FourFlail8` |
| 2123 | Guarded Flail | `flails` | yes | `assets/item-bases/2123.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Flails/FourFlail9` |
| 2124 | Icicle Flail | `flails` | yes | `assets/item-bases/2124.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Flails/FourFlail10` |
| 2125 | Tearing Flail | `flails` | yes | `assets/item-bases/2125.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Flails/FourFlail11` |
| 2126 | Great Flail | `flails` | yes | `assets/item-bases/2126.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Flails/FourFlail12` |
| 2127 | Abyssal Flail | `flails` | yes | `assets/item-bases/2127.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Flails/FourFlail13` |
| 2136 | Withered Wand | `wands` | yes | `assets/item-bases/2136.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWand1` |
| 2137 | Bone Wand | `wands` | yes | `assets/item-bases/2137.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWand2` |
| 2138 | Attuned Wand | `wands` | yes | `assets/item-bases/2138.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWand3` |
| 2139 | Siphoning Wand | `wands` | yes | `assets/item-bases/2139.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWand4` |
| 2140 | Volatile Wand | `wands` | yes | `assets/item-bases/2140.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWand5` |
| 2141 | Galvanic Wand | `wands` | yes | `assets/item-bases/2141.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWand6` |
| 2142 | Acrid Wand | `wands` | yes | `assets/item-bases/2142.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWand7` |
| 2143 | Offering Wand | `wands` | yes | `assets/item-bases/2143.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWand8` |
| 2144 | Frigid Wand | `wands` | yes | `assets/item-bases/2144.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWand9` |
| 2145 | Torture Wand | `wands` | yes | `assets/item-bases/2145.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWand10` |
| 2146 | Critical Wand | `wands` | yes | `assets/item-bases/2146.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWand11` |
| 2147 | Primordial Wand | `wands` | yes | `assets/item-bases/2147.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWand12` |
| 2148 | Dueling Wand | `wands` | yes | `assets/item-bases/2148.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWand13` |
| 2149 | Twisted Wand | `wands` | yes | `assets/item-bases/2149.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWandUnique1` |
| 2150 | Runic Fork | `wands` | yes | `assets/item-bases/2150.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWandUnique2` |
| 2151 | Runemastered Runic Fork | `wands` | yes | `assets/item-bases/2151.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWandUnique2VerisiumUnique1` |
| 2152 | Runemastered Runic Fork | `wands` | yes | `assets/item-bases/2152.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWandUnique2VerisiumUnique2` |
| 2153 | Runemastered Runic Fork | `wands` | yes | `assets/item-bases/2153.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Wands/FourWandUnique2VerisiumUnique3` |
| 2154 | Ashen Staff | `staves` | yes | `assets/item-bases/2154.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff1` |
| 2155 | Gelid Staff | `staves` | yes | `assets/item-bases/2155.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff2` |
| 2156 | Voltaic Staff | `staves` | yes | `assets/item-bases/2156.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff3` |
| 2157 | Spriggan Staff | `staves` | yes | `assets/item-bases/2157.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff4` |
| 2158 | Pyrophyte Staff | `staves` | yes | `assets/item-bases/2158.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff5` |
| 2159 | Chiming Staff | `staves` | yes | `assets/item-bases/2159.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff6` |
| 2160 | Rending Staff | `staves` | yes | `assets/item-bases/2160.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff7` |
| 2161 | Reaping Staff | `staves` | yes | `assets/item-bases/2161.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff8` |
| 2162 | Icicle Staff | `staves` | yes | `assets/item-bases/2162.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff9` |
| 2163 | Roaring Staff | `staves` | yes | `assets/item-bases/2163.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff10` |
| 2164 | Paralysing Staff | `staves` | yes | `assets/item-bases/2164.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff11` |
| 2165 | Sanctified Staff | `staves` | yes | `assets/item-bases/2165.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff12` |
| 2166 | Dark Staff | `staves` | yes | `assets/item-bases/2166.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff13` |
| 2167 | Ravenous Staff | `staves` | yes | `assets/item-bases/2167.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaff14` |
| 2168 | Permafrost Staff | `staves` | yes | `assets/item-bases/2168.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaffUnique1` |
| 2170 | Reflecting Staff | `staves` | yes | `assets/item-bases/2170.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaffUnique3` |
| 2171 | Perching Staff | `staves` | yes | `assets/item-bases/2171.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourStaffUnique4` |
| 2173 | Crude Bow | `bows` | yes | `assets/item-bases/2173.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow1` |
| 2174 | Shortbow | `bows` | yes | `assets/item-bases/2174.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow2` |
| 2175 | Warden Bow | `bows` | yes | `assets/item-bases/2175.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow3` |
| 2176 | Recurve Bow | `bows` | yes | `assets/item-bases/2176.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow4` |
| 2177 | Composite Bow | `bows` | yes | `assets/item-bases/2177.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow5` |
| 2178 | Dualstring Bow | `bows` | yes | `assets/item-bases/2178.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow6` |
| 2179 | Cultist Bow | `bows` | yes | `assets/item-bases/2179.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow7` |
| 2180 | Zealot Bow | `bows` | yes | `assets/item-bases/2180.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow8` |
| 2181 | Artillery Bow | `bows` | yes | `assets/item-bases/2181.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow9` |
| 2182 | Tribal Bow | `bows` | yes | `assets/item-bases/2182.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow10` |
| 2183 | Greatbow | `bows` | yes | `assets/item-bases/2183.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow11` |
| 2184 | Double Limb Bow | `bows` | yes | `assets/item-bases/2184.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow12` |
| 2185 | Heavy Bow | `bows` | yes | `assets/item-bases/2185.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow13` |
| 2186 | Makeshift Crossbow | `crossbows` | yes | `assets/item-bases/2186.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow1` |
| 2187 | Tense Crossbow | `crossbows` | yes | `assets/item-bases/2187.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow2` |
| 2188 | Sturdy Crossbow | `crossbows` | yes | `assets/item-bases/2188.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow3` |
| 2189 | Varnished Crossbow | `crossbows` | yes | `assets/item-bases/2189.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow4` |
| 2190 | Dyad Crossbow | `crossbows` | yes | `assets/item-bases/2190.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow5` |
| 2191 | Alloy Crossbow | `crossbows` | yes | `assets/item-bases/2191.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow6` |
| 2192 | Bombard Crossbow | `crossbows` | yes | `assets/item-bases/2192.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow7` |
| 2193 | Construct Crossbow | `crossbows` | yes | `assets/item-bases/2193.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow8` |
| 2194 | Blackfire Crossbow | `crossbows` | yes | `assets/item-bases/2194.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow9` |
| 2195 | Piercing Crossbow | `crossbows` | yes | `assets/item-bases/2195.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow10` |
| 2196 | Cumbrous Crossbow | `crossbows` | yes | `assets/item-bases/2196.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow11` |
| 2197 | Dedalian Crossbow | `crossbows` | yes | `assets/item-bases/2197.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow12` |
| 2198 | Esoteric Crossbow | `crossbows` | yes | `assets/item-bases/2198.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow13` |
| 2199 | Rattling Sceptre | `sceptres` | yes | `assets/item-bases/2199.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre1` |
| 2200 | Stoic Sceptre | `sceptres` | yes | `assets/item-bases/2200.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre2` |
| 2201 | Lupine Sceptre | `sceptres` | yes | `assets/item-bases/2201.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre3` |
| 2202 | Omen Sceptre | `sceptres` | yes | `assets/item-bases/2202.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre4` |
| 2203 | Ochre Sceptre | `sceptres` | yes | `assets/item-bases/2203.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre5` |
| 2204 | Shrine Sceptre | `sceptres` | yes | `assets/item-bases/2204.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre6a` |
| 2205 | Shrine Sceptre | `sceptres` | yes | `assets/item-bases/2205.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre6b` |
| 2206 | Shrine Sceptre | `sceptres` | yes | `assets/item-bases/2206.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre6c` |
| 2207 | Devouring Sceptre | `sceptres` | yes | `assets/item-bases/2207.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre7` |
| 2208 | Clasped Sceptre | `sceptres` | yes | `assets/item-bases/2208.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre8` |
| 2209 | Devotional Sceptre | `sceptres` | yes | `assets/item-bases/2209.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre9` |
| 2210 | Wrath Sceptre | `sceptres` | yes | `assets/item-bases/2210.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre10` |
| 2211 | Aromatic Sceptre | `sceptres` | yes | `assets/item-bases/2211.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre11` |
| 2212 | Pious Sceptre | `sceptres` | yes | `assets/item-bases/2212.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre12` |
| 2213 | Hallowed Sceptre | `sceptres` | yes | `assets/item-bases/2213.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptre13` |
| 2214 | Shrine Sceptre | `sceptres` | yes | `assets/item-bases/2214.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/Sceptres/FourSceptreUnique1` |
| 2241 | Rusted Cuirass | `body_armours_str` | yes | `assets/item-bases/2241.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr1` |
| 2242 | Fur Plate | `body_armours_str` | yes | `assets/item-bases/2242.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr2` |
| 2243 | Iron Cuirass | `body_armours_str` | yes | `assets/item-bases/2243.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr3` |
| 2244 | Raider Plate | `body_armours_str` | yes | `assets/item-bases/2244.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr4` |
| 2245 | Maraketh Cuirass | `body_armours_str` | yes | `assets/item-bases/2245.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr5` |
| 2246 | Steel Plate | `body_armours_str` | yes | `assets/item-bases/2246.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr6` |
| 2247 | Full Plate | `body_armours_str` | yes | `assets/item-bases/2247.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr7` |
| 2248 | Vaal Cuirass | `body_armours_str` | yes | `assets/item-bases/2248.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr8` |
| 2249 | Juggernaut Plate | `body_armours_str` | yes | `assets/item-bases/2249.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr9` |
| 2250 | Chieftain Cuirass | `body_armours_str` | yes | `assets/item-bases/2250.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr10` |
| 2251 | Colosseum Plate | `body_armours_str` | yes | `assets/item-bases/2251.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr11` |
| 2252 | Champion Cuirass | `body_armours_str` | yes | `assets/item-bases/2252.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr12` |
| 2253 | Glorious Plate | `body_armours_str` | yes | `assets/item-bases/2253.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr13` |
| 2254 | Conqueror Plate | `body_armours_str` | yes | `assets/item-bases/2254.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr14` |
| 2255 | Abyssal Cuirass | `body_armours_str` | yes | `assets/item-bases/2255.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr15` |
| 2256 | Leather Vest | `body_armours_dex` | yes | `assets/item-bases/2256.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex1` |
| 2257 | Quilted Vest | `body_armours_dex` | yes | `assets/item-bases/2257.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex2` |
| 2258 | Pathfinder Coat | `body_armours_dex` | yes | `assets/item-bases/2258.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex3` |
| 2259 | Shrouded Vest | `body_armours_dex` | yes | `assets/item-bases/2259.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex4` |
| 2260 | Rhoahide Coat | `body_armours_dex` | yes | `assets/item-bases/2260.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex5` |
| 2261 | Studded Vest | `body_armours_dex` | yes | `assets/item-bases/2261.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex6` |
| 2262 | Scout's Vest | `body_armours_dex` | yes | `assets/item-bases/2262.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex7` |
| 2263 | Serpentscale Coat | `body_armours_dex` | yes | `assets/item-bases/2263.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex8` |
| 2264 | Corsair Vest | `body_armours_dex` | yes | `assets/item-bases/2264.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex9` |
| 2265 | Smuggler Coat | `body_armours_dex` | yes | `assets/item-bases/2265.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex10` |
| 2266 | Strider Vest | `body_armours_dex` | yes | `assets/item-bases/2266.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex11` |
| 2267 | Hardleather Coat | `body_armours_dex` | yes | `assets/item-bases/2267.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex12` |
| 2268 | Exquisite Vest | `body_armours_dex` | yes | `assets/item-bases/2268.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex13` |
| 2269 | Mail Coat | `body_armours_dex` | yes | `assets/item-bases/2269.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex14` |
| 2270 | Armoured Vest | `body_armours_dex` | yes | `assets/item-bases/2270.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex15` |
| 2271 | Tattered Robe | `body_armours_int` | yes | `assets/item-bases/2271.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt1` |
| 2272 | Feathered Robe | `body_armours_int` | yes | `assets/item-bases/2272.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt2` |
| 2273 | Hexer's Robe | `body_armours_int` | yes | `assets/item-bases/2273.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt3` |
| 2274 | Bone Raiment | `body_armours_int` | yes | `assets/item-bases/2274.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt4` |
| 2275 | Silk Robe | `body_armours_int` | yes | `assets/item-bases/2275.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt5` |
| 2276 | Keth Raiment | `body_armours_int` | yes | `assets/item-bases/2276.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt6` |
| 2277 | Votive Raiment | `body_armours_int` | yes | `assets/item-bases/2277.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt7` |
| 2278 | Altar Robe | `body_armours_int` | yes | `assets/item-bases/2278.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt8` |
| 2279 | Elementalist Robe | `body_armours_int` | yes | `assets/item-bases/2279.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt9` |
| 2280 | Mystic Raiment | `body_armours_int` | yes | `assets/item-bases/2280.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt10` |
| 2281 | Imperial Robe | `body_armours_int` | yes | `assets/item-bases/2281.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt11` |
| 2282 | Plated Raiment | `body_armours_int` | yes | `assets/item-bases/2282.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt12` |
| 2283 | Havoc Raiment | `body_armours_int` | yes | `assets/item-bases/2283.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt13` |
| 2284 | Enlightened Robe | `body_armours_int` | yes | `assets/item-bases/2284.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt14` |
| 2285 | Arcane Raiment | `body_armours_int` | yes | `assets/item-bases/2285.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt15` |
| 2286 | Chain Mail | `body_armours_str_dex` | yes | `assets/item-bases/2286.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex1` |
| 2287 | Rogue Armour | `body_armours_str_dex` | yes | `assets/item-bases/2287.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex2` |
| 2288 | Vagabond Armour | `body_armours_str_dex` | yes | `assets/item-bases/2288.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex3` |
| 2289 | Cloaked Mail | `body_armours_str_dex` | yes | `assets/item-bases/2289.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex4` |
| 2290 | Explorer Armour | `body_armours_str_dex` | yes | `assets/item-bases/2290.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex5` |
| 2291 | Scale Mail | `body_armours_str_dex` | yes | `assets/item-bases/2291.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex6` |
| 2292 | Knight Armour | `body_armours_str_dex` | yes | `assets/item-bases/2292.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex7` |
| 2293 | Ancestral Mail | `body_armours_str_dex` | yes | `assets/item-bases/2293.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex8` |
| 2294 | Lamellar Mail | `body_armours_str_dex` | yes | `assets/item-bases/2294.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex9` |
| 2295 | Gladiator Armour | `body_armours_str_dex` | yes | `assets/item-bases/2295.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex10` |
| 2296 | Heroic Armour | `body_armours_str_dex` | yes | `assets/item-bases/2296.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex11` |
| 2297 | Tournament Mail | `body_armours_str_dex` | yes | `assets/item-bases/2297.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex12a` |
| 2298 | Tournament Mail | `body_armours_str_dex` | yes | `assets/item-bases/2298.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex12b` |
| 2299 | Tournament Mail | `body_armours_str_dex` | yes | `assets/item-bases/2299.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex12c` |
| 2300 | Slayer Armour | `body_armours_str_dex` | yes | `assets/item-bases/2300.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex13` |
| 2301 | Pilgrim Vestments | `body_armours_str_int` | yes | `assets/item-bases/2301.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt1` |
| 2302 | Pelt Mantle | `body_armours_str_int` | yes | `assets/item-bases/2302.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt2` |
| 2303 | Mail Vestments | `body_armours_str_int` | yes | `assets/item-bases/2303.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt3` |
| 2304 | Shaman Mantle | `body_armours_str_int` | yes | `assets/item-bases/2304.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt4` |
| 2305 | Ironclad Vestments | `body_armours_str_int` | yes | `assets/item-bases/2305.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt5` |
| 2306 | Sacrificial Mantle | `body_armours_str_int` | yes | `assets/item-bases/2306.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt6` |
| 2307 | Cleric Vestments | `body_armours_str_int` | yes | `assets/item-bases/2307.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt7` |
| 2308 | Tideseer Mantle | `body_armours_str_int` | yes | `assets/item-bases/2308.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt8` |
| 2309 | Gilded Vestments | `body_armours_str_int` | yes | `assets/item-bases/2309.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt9` |
| 2310 | Venerated Mantle | `body_armours_str_int` | yes | `assets/item-bases/2310.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt10` |
| 2311 | Revered Vestments | `body_armours_str_int` | yes | `assets/item-bases/2311.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt11` |
| 2312 | Corvus Mantle | `body_armours_str_int` | yes | `assets/item-bases/2312.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt12` |
| 2313 | Zenith Vestments | `body_armours_str_int` | yes | `assets/item-bases/2313.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt13` |
| 2314 | Ornate Ringmail | `body_armours_str_int` | yes | `assets/item-bases/2314.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrIntUnique1` |
| 2315 | Ancient Mail | `body_armours_str_int` | yes | `assets/item-bases/2315.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrIntUnique2` |
| 2316 | Hermit Garb | `body_armours_dex_int` | yes | `assets/item-bases/2316.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt1` |
| 2317 | Waxed Jacket | `body_armours_dex_int` | yes | `assets/item-bases/2317.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt2` |
| 2318 | Marabout Garb | `body_armours_dex_int` | yes | `assets/item-bases/2318.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt3` |
| 2319 | Wayfarer Jacket | `body_armours_dex_int` | yes | `assets/item-bases/2319.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt4` |
| 2320 | Anchorite Garb | `body_armours_dex_int` | yes | `assets/item-bases/2320.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt5` |
| 2321 | Scalper's Jacket | `body_armours_dex_int` | yes | `assets/item-bases/2321.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt6` |
| 2322 | Scoundrel Jacket | `body_armours_dex_int` | yes | `assets/item-bases/2322.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt7` |
| 2323 | Ascetic Garb | `body_armours_dex_int` | yes | `assets/item-bases/2323.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt8` |
| 2324 | Clandestine Jacket | `body_armours_dex_int` | yes | `assets/item-bases/2324.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt9` |
| 2325 | Monastic Garb | `body_armours_dex_int` | yes | `assets/item-bases/2325.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt10` |
| 2326 | Torment Jacket | `body_armours_dex_int` | yes | `assets/item-bases/2326.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt11` |
| 2327 | Devout Garb | `body_armours_dex_int` | yes | `assets/item-bases/2327.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt12` |
| 2328 | Assassin Garb | `body_armours_dex_int` | yes | `assets/item-bases/2328.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt13` |
| 2329 | Rusted Greathelm | `helmets_str` | yes | `assets/item-bases/2329.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr1` |
| 2330 | Soldier Greathelm | `helmets_str` | yes | `assets/item-bases/2330.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr2` |
| 2331 | Wrapped Greathelm | `helmets_str` | yes | `assets/item-bases/2331.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr3` |
| 2332 | Spired Greathelm | `helmets_str` | yes | `assets/item-bases/2332.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr4` |
| 2333 | Elite Greathelm | `helmets_str` | yes | `assets/item-bases/2333.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr5` |
| 2334 | Warrior Greathelm | `helmets_str` | yes | `assets/item-bases/2334.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr6` |
| 2335 | Commander Greathelm | `helmets_str` | yes | `assets/item-bases/2335.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr7` |
| 2336 | Fierce Greathelm | `helmets_str` | yes | `assets/item-bases/2336.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr8` |
| 2337 | Sentinel Greathelm | `helmets_str` | yes | `assets/item-bases/2337.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr9` |
| 2338 | Goliath Greathelm | `helmets_str` | yes | `assets/item-bases/2338.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr10` |
| 2339 | Guardian Greathelm | `helmets_str` | yes | `assets/item-bases/2339.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr11` |
| 2340 | Shabby Hood | `helmets_dex` | yes | `assets/item-bases/2340.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex1` |
| 2341 | Felt Cap | `helmets_dex` | yes | `assets/item-bases/2341.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex2` |
| 2342 | Lace Hood | `helmets_dex` | yes | `assets/item-bases/2342.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex3` |
| 2343 | Swathed Cap | `helmets_dex` | yes | `assets/item-bases/2343.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex4` |
| 2344 | Hunter Hood | `helmets_dex` | yes | `assets/item-bases/2344.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex5` |
| 2345 | Viper Cap | `helmets_dex` | yes | `assets/item-bases/2345.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex6` |
| 2346 | Corsair Cap | `helmets_dex` | yes | `assets/item-bases/2346.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex7` |
| 2347 | Leatherbound Hood | `helmets_dex` | yes | `assets/item-bases/2347.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex8` |
| 2348 | Velvet Cap | `helmets_dex` | yes | `assets/item-bases/2348.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex9` |
| 2349 | Covert Hood | `helmets_dex` | yes | `assets/item-bases/2349.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex10` |
| 2350 | Armoured Cap | `helmets_dex` | yes | `assets/item-bases/2350.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex11` |
| 2351 | Twig Circlet | `helmets_int` | yes | `assets/item-bases/2351.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt1` |
| 2352 | Wicker Tiara | `helmets_int` | yes | `assets/item-bases/2352.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt2` |
| 2353 | Beaded Circlet | `helmets_int` | yes | `assets/item-bases/2353.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt3` |
| 2354 | Chain Tiara | `helmets_int` | yes | `assets/item-bases/2354.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt4` |
| 2355 | Feathered Tiara | `helmets_int` | yes | `assets/item-bases/2355.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt5` |
| 2356 | Gold Circlet | `helmets_int` | yes | `assets/item-bases/2356.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt6` |
| 2357 | Vermeil Circlet | `helmets_int` | yes | `assets/item-bases/2357.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt7` |
| 2358 | Jade Tiara | `helmets_int` | yes | `assets/item-bases/2358.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt8` |
| 2359 | Noble Circlet | `helmets_int` | yes | `assets/item-bases/2359.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt9` |
| 2360 | Twilight Tiara | `helmets_int` | yes | `assets/item-bases/2360.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt10` |
| 2361 | Magus Tiara | `helmets_int` | yes | `assets/item-bases/2361.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt11` |
| 2362 | Brimmed Helm | `helmets_str_dex` | yes | `assets/item-bases/2362.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex1` |
| 2363 | Guarded Helm | `helmets_str_dex` | yes | `assets/item-bases/2363.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex2` |
| 2364 | Visored Helm | `helmets_str_dex` | yes | `assets/item-bases/2364.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex3` |
| 2365 | Cowled Helm | `helmets_str_dex` | yes | `assets/item-bases/2365.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex4` |
| 2366 | Shielded Helm | `helmets_str_dex` | yes | `assets/item-bases/2366.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex5` |
| 2367 | Closed Helm | `helmets_str_dex` | yes | `assets/item-bases/2367.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex6` |
| 2368 | Decorated Helm | `helmets_str_dex` | yes | `assets/item-bases/2368.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex7` |
| 2369 | Gallant Helm | `helmets_str_dex` | yes | `assets/item-bases/2369.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex8` |
| 2370 | Ancient Visor | `helmets_str_dex` | yes | `assets/item-bases/2370.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDexUnique1` |
| 2371 | Iron Crown | `helmets_str_int` | yes | `assets/item-bases/2371.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt1` |
| 2372 | Horned Crown | `helmets_str_int` | yes | `assets/item-bases/2372.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt2` |
| 2373 | Cultist Crown | `helmets_str_int` | yes | `assets/item-bases/2373.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt3` |
| 2374 | Martyr Crown | `helmets_str_int` | yes | `assets/item-bases/2374.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt4` |
| 2375 | Heavy Crown | `helmets_str_int` | yes | `assets/item-bases/2375.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt5` |
| 2376 | Spiritbone Crown | `helmets_str_int` | yes | `assets/item-bases/2376.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt6` |
| 2377 | Lavish Crown | `helmets_str_int` | yes | `assets/item-bases/2377.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt7` |
| 2378 | Archon Crown | `helmets_str_int` | yes | `assets/item-bases/2378.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt8` |
| 2379 | Tenebrous Crown | `helmets_str_int` | yes | `assets/item-bases/2379.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrIntUnique1` |
| 2380 | Hewn Mask | `helmets_dex_int` | yes | `assets/item-bases/2380.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt1` |
| 2381 | Face Mask | `helmets_dex_int` | yes | `assets/item-bases/2381.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt2` |
| 2382 | Hooded Mask | `helmets_dex_int` | yes | `assets/item-bases/2382.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt3` |
| 2383 | Veiled Mask | `helmets_dex_int` | yes | `assets/item-bases/2383.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt4` |
| 2384 | Tribal Mask | `helmets_dex_int` | yes | `assets/item-bases/2384.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt5` |
| 2385 | Solid Mask | `helmets_dex_int` | yes | `assets/item-bases/2385.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt6` |
| 2386 | Shaded Mask | `helmets_dex_int` | yes | `assets/item-bases/2386.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt7` |
| 2387 | Death Mask | `helmets_dex_int` | yes | `assets/item-bases/2387.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt8` |
| 2388 | Stocky Mitts | `gloves_str` | yes | `assets/item-bases/2388.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr1` |
| 2389 | Riveted Mitts | `gloves_str` | yes | `assets/item-bases/2389.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr2` |
| 2390 | Tempered Mitts | `gloves_str` | yes | `assets/item-bases/2390.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr3` |
| 2391 | Bolstered Mitts | `gloves_str` | yes | `assets/item-bases/2391.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr4` |
| 2392 | Moulded Mitts | `gloves_str` | yes | `assets/item-bases/2392.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr5` |
| 2393 | Detailed Mitts | `gloves_str` | yes | `assets/item-bases/2393.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr6` |
| 2394 | Titan Mitts | `gloves_str` | yes | `assets/item-bases/2394.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr7` |
| 2395 | Grand Mitts | `gloves_str` | yes | `assets/item-bases/2395.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr8` |
| 2396 | Suede Bracers | `gloves_dex` | yes | `assets/item-bases/2396.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex1` |
| 2397 | Firm Bracers | `gloves_dex` | yes | `assets/item-bases/2397.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex2` |
| 2398 | Bound Bracers | `gloves_dex` | yes | `assets/item-bases/2398.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex3` |
| 2399 | Sectioned Bracers | `gloves_dex` | yes | `assets/item-bases/2399.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex4` |
| 2400 | Spined Bracers | `gloves_dex` | yes | `assets/item-bases/2400.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex5` |
| 2401 | Fine Bracers | `gloves_dex` | yes | `assets/item-bases/2401.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex6` |
| 2402 | Hardened Bracers | `gloves_dex` | yes | `assets/item-bases/2402.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex7` |
| 2403 | Engraved Bracers | `gloves_dex` | yes | `assets/item-bases/2403.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex8` |
| 2404 | Torn Gloves | `gloves_int` | yes | `assets/item-bases/2404.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt1` |
| 2405 | Sombre Gloves | `gloves_int` | yes | `assets/item-bases/2405.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt2` |
| 2406 | Stitched Gloves | `gloves_int` | yes | `assets/item-bases/2406.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt3` |
| 2407 | Jewelled Gloves | `gloves_int` | yes | `assets/item-bases/2407.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt4` |
| 2408 | Intricate Gloves | `gloves_int` | yes | `assets/item-bases/2408.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt5` |
| 2409 | Pauascale Gloves | `gloves_int` | yes | `assets/item-bases/2409.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt6` |
| 2410 | Embroidered Gloves | `gloves_int` | yes | `assets/item-bases/2410.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt7` |
| 2411 | Adorned Gloves | `gloves_int` | yes | `assets/item-bases/2411.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt8` |
| 2412 | Ringmail Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2412.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex1` |
| 2413 | Layered Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2413.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex2` |
| 2414 | Doubled Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2414.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex3` |
| 2415 | Plate Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2415.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex4` |
| 2416 | Burnished Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2416.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex5` |
| 2417 | Ornate Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2417.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex6` |
| 2418 | Ancient Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2418.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDexUnique1` |
| 2419 | Rope Cuffs | `gloves_str_int` | yes | `assets/item-bases/2419.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt1` |
| 2420 | Aged Cuffs | `gloves_str_int` | yes | `assets/item-bases/2420.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt2` |
| 2421 | Goldcast Cuffs | `gloves_str_int` | yes | `assets/item-bases/2421.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt3` |
| 2422 | Kalguuran Cuffs | `gloves_str_int` | yes | `assets/item-bases/2422.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt4` |
| 2423 | Righteous Cuffs | `gloves_str_int` | yes | `assets/item-bases/2423.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt5` |
| 2424 | Signet Cuffs | `gloves_str_int` | yes | `assets/item-bases/2424.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt6` |
| 2425 | Gauze Wraps | `gloves_dex_int` | yes | `assets/item-bases/2425.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt1` |
| 2426 | Linen Wraps | `gloves_dex_int` | yes | `assets/item-bases/2426.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt2` |
| 2427 | Spiral Wraps | `gloves_dex_int` | yes | `assets/item-bases/2427.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt3` |
| 2428 | Buckled Wraps | `gloves_dex_int` | yes | `assets/item-bases/2428.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt4` |
| 2429 | Furtive Wraps | `gloves_dex_int` | yes | `assets/item-bases/2429.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt5` |
| 2430 | Utility Wraps | `gloves_dex_int` | yes | `assets/item-bases/2430.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt6` |
| 2431 | Rough Greaves | `boots_str` | yes | `assets/item-bases/2431.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr1` |
| 2432 | Iron Greaves | `boots_str` | yes | `assets/item-bases/2432.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr2` |
| 2433 | Bronze Greaves | `boots_str` | yes | `assets/item-bases/2433.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr3` |
| 2434 | Trimmed Greaves | `boots_str` | yes | `assets/item-bases/2434.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr4` |
| 2435 | Stone Greaves | `boots_str` | yes | `assets/item-bases/2435.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr5` |
| 2436 | Reefsteel Greaves | `boots_str` | yes | `assets/item-bases/2436.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr6` |
| 2437 | Monument Greaves | `boots_str` | yes | `assets/item-bases/2437.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr7` |
| 2438 | Totemic Greaves | `boots_str` | yes | `assets/item-bases/2438.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr8` |
| 2439 | Rawhide Boots | `boots_dex` | yes | `assets/item-bases/2439.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex1` |
| 2440 | Laced Boots | `boots_dex` | yes | `assets/item-bases/2440.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex2` |
| 2441 | Embossed Boots | `boots_dex` | yes | `assets/item-bases/2441.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex3` |
| 2442 | Steeltoe Boots | `boots_dex` | yes | `assets/item-bases/2442.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex4` |
| 2443 | Lizardscale Boots | `boots_dex` | yes | `assets/item-bases/2443.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex5` |
| 2444 | Flared Boots | `boots_dex` | yes | `assets/item-bases/2444.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex6` |
| 2445 | Leatherplate Boots | `boots_dex` | yes | `assets/item-bases/2445.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex7` |
| 2446 | Embroidered Boots | `boots_dex` | yes | `assets/item-bases/2446.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex8` |
| 2447 | Straw Sandals | `boots_int` | yes | `assets/item-bases/2447.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt1` |
| 2448 | Wrapped Sandals | `boots_int` | yes | `assets/item-bases/2448.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt2` |
| 2449 | Lattice Sandals | `boots_int` | yes | `assets/item-bases/2449.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt3` |
| 2450 | Silk Slippers | `boots_int` | yes | `assets/item-bases/2450.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt4` |
| 2451 | Feathered Sandals | `boots_int` | yes | `assets/item-bases/2451.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt5` |
| 2452 | Flax Sandals | `boots_int` | yes | `assets/item-bases/2452.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt6` |
| 2453 | Studded Sandals | `boots_int` | yes | `assets/item-bases/2453.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt7` |
| 2454 | Elaborate Sandals | `boots_int` | yes | `assets/item-bases/2454.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt8` |
| 2455 | Mail Sabatons | `boots_str_dex` | yes | `assets/item-bases/2455.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex1` |
| 2456 | Braced Sabatons | `boots_str_dex` | yes | `assets/item-bases/2456.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex2` |
| 2457 | Stacked Sabatons | `boots_str_dex` | yes | `assets/item-bases/2457.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex3` |
| 2458 | Covered Sabatons | `boots_str_dex` | yes | `assets/item-bases/2458.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex4` |
| 2459 | Flexile Sabatons | `boots_str_dex` | yes | `assets/item-bases/2459.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex5` |
| 2460 | Bold Sabatons | `boots_str_dex` | yes | `assets/item-bases/2460.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex6` |
| 2461 | Padded Leggings | `boots_str_int` | yes | `assets/item-bases/2461.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt1` |
| 2462 | Secured Leggings | `boots_str_int` | yes | `assets/item-bases/2462.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt2` |
| 2463 | Pelt Leggings | `boots_str_int` | yes | `assets/item-bases/2463.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt3` |
| 2464 | Weaver Leggings | `boots_str_int` | yes | `assets/item-bases/2464.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt4` |
| 2465 | Gilt Leggings | `boots_str_int` | yes | `assets/item-bases/2465.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt5` |
| 2466 | Pious Leggings | `boots_str_int` | yes | `assets/item-bases/2466.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt6` |
| 2467 | Ancient Leggings | `boots_str_int` | yes | `assets/item-bases/2467.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrIntUnique1` |
| 2468 | Frayed Shoes | `boots_dex_int` | yes | `assets/item-bases/2468.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt1` |
| 2469 | Threaded Shoes | `boots_dex_int` | yes | `assets/item-bases/2469.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt2` |
| 2470 | Hunting Shoes | `boots_dex_int` | yes | `assets/item-bases/2470.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt3` |
| 2471 | Steelpoint Shoes | `boots_dex_int` | yes | `assets/item-bases/2471.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt4` |
| 2472 | Velour Shoes | `boots_dex_int` | yes | `assets/item-bases/2472.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt5` |
| 2473 | Bladed Shoes | `boots_dex_int` | yes | `assets/item-bases/2473.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt6` |
| 2474 | Splintered Tower Shield | `shields_str` | yes | `assets/item-bases/2474.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr1` |
| 2475 | Painted Tower Shield | `shields_str` | yes | `assets/item-bases/2475.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr2` |
| 2476 | Braced Tower Shield | `shields_str` | yes | `assets/item-bases/2476.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr3` |
| 2477 | Barricade Tower Shield | `shields_str` | yes | `assets/item-bases/2477.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr4` |
| 2478 | Effigial Tower Shield | `shields_str` | yes | `assets/item-bases/2478.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr5` |
| 2479 | Rampart Tower Shield | `shields_str` | yes | `assets/item-bases/2479.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr6` |
| 2480 | Heraldric Tower Shield | `shields_str` | yes | `assets/item-bases/2480.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr7` |
| 2481 | Stone Tower Shield | `shields_str` | yes | `assets/item-bases/2481.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr8` |
| 2482 | Crucible Tower Shield | `shields_str` | yes | `assets/item-bases/2482.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr9` |
| 2483 | Ancestor Tower Shield | `shields_str` | yes | `assets/item-bases/2483.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr10` |
| 2484 | Phalanx Tower Shield | `shields_str` | yes | `assets/item-bases/2484.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr11` |
| 2485 | Defiant Tower Shield | `shields_str` | yes | `assets/item-bases/2485.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr12` |
| 2486 | Blacksteel Tower Shield | `shields_str` | yes | `assets/item-bases/2486.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr13` |
| 2487 | Hardwood Targe | `shields_str_dex` | yes | `assets/item-bases/2487.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex1` |
| 2488 | Pelage Targe | `shields_str_dex` | yes | `assets/item-bases/2488.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex2` |
| 2489 | Studded Targe | `shields_str_dex` | yes | `assets/item-bases/2489.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex3` |
| 2490 | Crescent Targe | `shields_str_dex` | yes | `assets/item-bases/2490.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex4` |
| 2491 | Chiseled Targe | `shields_str_dex` | yes | `assets/item-bases/2491.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex5` |
| 2492 | Feathered Targe | `shields_str_dex` | yes | `assets/item-bases/2492.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex6` |
| 2493 | Stratified Targe | `shields_str_dex` | yes | `assets/item-bases/2493.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex7` |
| 2494 | Carved Targe | `shields_str_dex` | yes | `assets/item-bases/2494.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex8` |
| 2495 | Mosaic Targe | `shields_str_dex` | yes | `assets/item-bases/2495.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex9` |
| 2496 | Aureate Targe | `shields_str_dex` | yes | `assets/item-bases/2496.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex10` |
| 2497 | Grand Targe | `shields_str_dex` | yes | `assets/item-bases/2497.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex11` |
| 2498 | Blazon Crest Shield | `shields_str_int` | yes | `assets/item-bases/2498.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt1` |
| 2499 | Sigil Crest Shield | `shields_str_int` | yes | `assets/item-bases/2499.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt2` |
| 2500 | Emblem Crest Shield | `shields_str_int` | yes | `assets/item-bases/2500.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt3` |
| 2501 | Jingling Crest Shield | `shields_str_int` | yes | `assets/item-bases/2501.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt4` |
| 2502 | Sectarian Crest Shield | `shields_str_int` | yes | `assets/item-bases/2502.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt5` |
| 2503 | Omen Crest Shield | `shields_str_int` | yes | `assets/item-bases/2503.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt6` |
| 2504 | Wayward Crest Shield | `shields_str_int` | yes | `assets/item-bases/2504.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt7` |
| 2505 | Seer Crest Shield | `shields_str_int` | yes | `assets/item-bases/2505.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt8` |
| 2506 | Stoic Crest Shield | `shields_str_int` | yes | `assets/item-bases/2506.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt9` |
| 2507 | Empyreal Crest Shield | `shields_str_int` | yes | `assets/item-bases/2507.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt10` |
| 2508 | Deified Crest Shield | `shields_str_int` | yes | `assets/item-bases/2508.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt11` |
| 2509 | Leather Buckler | `bucklers` | yes | `assets/item-bases/2509.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex1` |
| 2510 | Wooden Buckler | `bucklers` | yes | `assets/item-bases/2510.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex2` |
| 2511 | Plated Buckler | `bucklers` | yes | `assets/item-bases/2511.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex3` |
| 2512 | Iron Buckler | `bucklers` | yes | `assets/item-bases/2512.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex4` |
| 2513 | Ridged Buckler | `bucklers` | yes | `assets/item-bases/2513.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex5` |
| 2514 | Spiked Buckler | `bucklers` | yes | `assets/item-bases/2514.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex6` |
| 2515 | Ringed Buckler | `bucklers` | yes | `assets/item-bases/2515.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex7` |
| 2516 | Edged Buckler | `bucklers` | yes | `assets/item-bases/2516.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex8` |
| 2517 | Laminate Buckler | `bucklers` | yes | `assets/item-bases/2517.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex9` |
| 2518 | Pearl Buckler | `bucklers` | yes | `assets/item-bases/2518.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex10` |
| 2519 | Ornate Buckler | `bucklers` | yes | `assets/item-bases/2519.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex11` |
| 2520 | Array Buckler | `bucklers` | yes | `assets/item-bases/2520.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex12` |
| 2521 | Aegis Buckler | `bucklers` | yes | `assets/item-bases/2521.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex13` |
| 2522 | Twig Focus | `foci` | yes | `assets/item-bases/2522.png` | missing | `Metadata/Items/Armours/Focii/FourFocus1` |
| 2523 | Woven Focus | `foci` | yes | `assets/item-bases/2523.png` | missing | `Metadata/Items/Armours/Focii/FourFocus2` |
| 2524 | Antler Focus | `foci` | yes | `assets/item-bases/2524.png` | missing | `Metadata/Items/Armours/Focii/FourFocus3` |
| 2525 | Engraved Focus | `foci` | yes | `assets/item-bases/2525.png` | missing | `Metadata/Items/Armours/Focii/FourFocus4` |
| 2526 | Tonal Focus | `foci` | yes | `assets/item-bases/2526.png` | missing | `Metadata/Items/Armours/Focii/FourFocus5` |
| 2527 | Crystal Focus | `foci` | yes | `assets/item-bases/2527.png` | missing | `Metadata/Items/Armours/Focii/FourFocus6` |
| 2528 | Voodoo Focus | `foci` | yes | `assets/item-bases/2528.png` | missing | `Metadata/Items/Armours/Focii/FourFocus7` |
| 2529 | Plumed Focus | `foci` | yes | `assets/item-bases/2529.png` | missing | `Metadata/Items/Armours/Focii/FourFocus8` |
| 2530 | Runed Focus | `foci` | yes | `assets/item-bases/2530.png` | missing | `Metadata/Items/Armours/Focii/FourFocus9` |
| 2531 | Whorl Focus | `foci` | yes | `assets/item-bases/2531.png` | missing | `Metadata/Items/Armours/Focii/FourFocus10` |
| 2532 | Elegant Focus | `foci` | yes | `assets/item-bases/2532.png` | missing | `Metadata/Items/Armours/Focii/FourFocus11` |
| 2533 | Attuned Focus | `foci` | yes | `assets/item-bases/2533.png` | missing | `Metadata/Items/Armours/Focii/FourFocus12` |
| 2534 | Magus Focus | `foci` | yes | `assets/item-bases/2534.png` | missing | `Metadata/Items/Armours/Focii/FourFocus13` |
| 2535 | Broadhead Quiver | `quivers` | yes | `assets/item-bases/2535.png` | missing | `Metadata/Items/Quivers/FourQuiver1` |
| 2536 | Fire Quiver | `quivers` | yes | `assets/item-bases/2536.png` | missing | `Metadata/Items/Quivers/FourQuiver2` |
| 2537 | Sacral Quiver | `quivers` | yes | `assets/item-bases/2537.png` | missing | `Metadata/Items/Quivers/FourQuiver3` |
| 2538 | Two-Point Quiver | `quivers` | yes | `assets/item-bases/2538.png` | missing | `Metadata/Items/Quivers/FourQuiver4` |
| 2539 | Blunt Quiver | `quivers` | yes | `assets/item-bases/2539.png` | missing | `Metadata/Items/Quivers/FourQuiver5` |
| 2540 | Toxic Quiver | `quivers` | yes | `assets/item-bases/2540.png` | missing | `Metadata/Items/Quivers/FourQuiver6` |
| 2541 | Serrated Quiver | `quivers` | yes | `assets/item-bases/2541.png` | missing | `Metadata/Items/Quivers/FourQuiver7` |
| 2542 | Primed Quiver | `quivers` | yes | `assets/item-bases/2542.png` | missing | `Metadata/Items/Quivers/FourQuiver8` |
| 2543 | Penetrating Quiver | `quivers` | yes | `assets/item-bases/2543.png` | missing | `Metadata/Items/Quivers/FourQuiver9` |
| 2544 | Volant Quiver | `quivers` | yes | `assets/item-bases/2544.png` | missing | `Metadata/Items/Quivers/FourQuiver10` |
| 2545 | Visceral Quiver | `quivers` | yes | `assets/item-bases/2545.png` | missing | `Metadata/Items/Quivers/FourQuiver11` |
| 2546 | Crimson Amulet | `amulets` | yes | `assets/item-bases/2546.png` | missing | `Metadata/Items/Amulets/FourAmulet1` |
| 2547 | Azure Amulet | `amulets` | yes | `assets/item-bases/2547.png` | missing | `Metadata/Items/Amulets/FourAmulet2` |
| 2548 | Amber Amulet | `amulets` | yes | `assets/item-bases/2548.png` | missing | `Metadata/Items/Amulets/FourAmulet3` |
| 2549 | Jade Amulet | `amulets` | yes | `assets/item-bases/2549.png` | missing | `Metadata/Items/Amulets/FourAmulet4` |
| 2550 | Lapis Amulet | `amulets` | yes | `assets/item-bases/2550.png` | missing | `Metadata/Items/Amulets/FourAmulet5` |
| 2551 | Lunar Amulet | `amulets` | yes | `assets/item-bases/2551.png` | missing | `Metadata/Items/Amulets/FourAmulet6` |
| 2552 | Bloodstone Amulet | `amulets` | yes | `assets/item-bases/2552.png` | missing | `Metadata/Items/Amulets/FourAmulet7` |
| 2553 | Stellar Amulet | `amulets` | yes | `assets/item-bases/2553.png` | missing | `Metadata/Items/Amulets/FourAmulet8` |
| 2554 | Solar Amulet | `amulets` | yes | `assets/item-bases/2554.png` | missing | `Metadata/Items/Amulets/FourAmulet9` |
| 2555 | Gold Amulet | `amulets` | yes | `assets/item-bases/2555.png` | missing | `Metadata/Items/Amulets/FourAmulet10` |
| 2556 | Pearlescent Amulet | `amulets` | yes | `assets/item-bases/2556.png` | missing | `Metadata/Items/Amulets/FourAmulet11` |
| 2557 | Veridical Chain | `amulets` | yes | `assets/item-bases/2557.png` | missing | `Metadata/Items/Amulets/FourAmuletUnique1` |
| 2558 | Runemastered Veridical Chain | `amulets` | yes | `assets/item-bases/2558.png` | missing | `Metadata/Items/Amulets/FourAmuletUnique1VerisiumUnique1` |
| 2559 | Runemastered Veridical Chain | `amulets` | yes | `assets/item-bases/2559.png` | missing | `Metadata/Items/Amulets/FourAmuletUnique1VerisiumUnique2` |
| 2560 | Runemastered Veridical Chain | `amulets` | yes | `assets/item-bases/2560.png` | missing | `Metadata/Items/Amulets/FourAmuletUnique1VerisiumUnique3` |
| 2561 | Lament Amulet | `amulets` | yes | `assets/item-bases/2561.png` | missing | `Metadata/Items/Amulets/FourAmuletB1a` |
| 2562 | Portent Amulet | `amulets` | yes | `assets/item-bases/2562.png` | missing | `Metadata/Items/Amulets/FourAmuletB1b` |
| 2563 | Absent Amulet | `amulets` | yes | `assets/item-bases/2563.png` | existing | `Metadata/Items/Amulets/FourAmuletB1c` |
| 2564 | Corona Amulet | `amulets` | yes | `assets/item-bases/2564.png` | missing | `Metadata/Items/Amulets/FourAmuletB2` |
| 2565 | Iron Ring | `rings` | yes | `assets/item-bases/2565.png` | missing | `Metadata/Items/Rings/FourRing1` |
| 2566 | Lazuli Ring | `rings` | yes | `assets/item-bases/2566.png` | missing | `Metadata/Items/Rings/FourRing2` |
| 2567 | Ruby Ring | `rings` | yes | `assets/item-bases/2567.png` | missing | `Metadata/Items/Rings/FourRing3` |
| 2568 | Sapphire Ring | `rings` | yes | `assets/item-bases/2568.png` | missing | `Metadata/Items/Rings/FourRing4` |
| 2569 | Topaz Ring | `rings` | yes | `assets/item-bases/2569.png` | missing | `Metadata/Items/Rings/FourRing5` |
| 2570 | Amethyst Ring | `rings` | yes | `assets/item-bases/2570.png` | missing | `Metadata/Items/Rings/FourRing6` |
| 2571 | Emerald Ring | `rings` | yes | `assets/item-bases/2571.png` | missing | `Metadata/Items/Rings/FourRing7` |
| 2572 | Pearl Ring | `rings` | yes | `assets/item-bases/2572.png` | missing | `Metadata/Items/Rings/FourRing8` |
| 2573 | Prismatic Ring | `rings` | yes | `assets/item-bases/2573.png` | missing | `Metadata/Items/Rings/FourRing9` |
| 2574 | Gold Ring | `rings` | yes | `assets/item-bases/2574.png` | missing | `Metadata/Items/Rings/FourRing10` |
| 2575 | Unset Ring | `rings` | yes | `assets/item-bases/2575.png` | missing | `Metadata/Items/Rings/FourRing11` |
| 2576 | Abyssal Signet | `rings` | yes | `assets/item-bases/2576.png` | missing | `Metadata/Items/Rings/FourRing12` |
| 2577 | Two-Stone Ring | `rings` | yes | `assets/item-bases/2577.png` | missing | `Metadata/Items/Rings/FourRing13a` |
| 2578 | Two-Stone Ring | `rings` | yes | `assets/item-bases/2578.png` | missing | `Metadata/Items/Rings/FourRing13b` |
| 2579 | Two-Stone Ring | `rings` | yes | `assets/item-bases/2579.png` | missing | `Metadata/Items/Rings/FourRing13c` |
| 2580 | Biostatic Ring | `rings` | yes | `assets/item-bases/2580.png` | missing | `Metadata/Items/Rings/FourRingB1` |
| 2581 | Vitalic Ring | `rings` | yes | `assets/item-bases/2581.png` | missing | `Metadata/Items/Rings/FourRingB2` |
| 2582 | Mnemonic Ring | `rings` | yes | `assets/item-bases/2582.png` | missing | `Metadata/Items/Rings/FourRingB3` |
| 2583 | Kinetic Ring | `rings` | yes | `assets/item-bases/2583.png` | missing | `Metadata/Items/Rings/FourRingB4` |
| 2584 | Oneiric Ring | `rings` | yes | `assets/item-bases/2584.png` | missing | `Metadata/Items/Rings/FourRingB5` |
| 2585 | Grasping Ring | `rings` | yes | `assets/item-bases/2585.png` | missing | `Metadata/Items/Rings/FourRingB6` |
| 2586 | Rawhide Belt | `belts` | yes | `assets/item-bases/2586.png` | missing | `Metadata/Items/Belts/FourBelt1` |
| 2587 | Linen Belt | `belts` | yes | `assets/item-bases/2587.png` | missing | `Metadata/Items/Belts/FourBelt2` |
| 2588 | Wide Belt | `belts` | yes | `assets/item-bases/2588.png` | missing | `Metadata/Items/Belts/FourBelt3` |
| 2589 | Long Belt | `belts` | yes | `assets/item-bases/2589.png` | missing | `Metadata/Items/Belts/FourBelt4` |
| 2590 | Plate Belt | `belts` | yes | `assets/item-bases/2590.png` | missing | `Metadata/Items/Belts/FourBelt5` |
| 2591 | Ornate Belt | `belts` | yes | `assets/item-bases/2591.png` | missing | `Metadata/Items/Belts/FourBelt6` |
| 2592 | Mail Belt | `belts` | yes | `assets/item-bases/2592.png` | missing | `Metadata/Items/Belts/FourBelt7` |
| 2593 | Double Belt | `belts` | yes | `assets/item-bases/2593.png` | missing | `Metadata/Items/Belts/FourBelt8` |
| 2594 | Heavy Belt | `belts` | yes | `assets/item-bases/2594.png` | missing | `Metadata/Items/Belts/FourBelt9` |
| 2595 | Runemastered Heavy Belt | `belts` | yes | `assets/item-bases/2595.png` | missing | `Metadata/Items/Belts/FourBelt9VerisiumUnique1` |
| 2596 | Runemastered Heavy Belt | `belts` | yes | `assets/item-bases/2596.png` | missing | `Metadata/Items/Belts/FourBelt9VerisiumUnique2` |
| 2597 | Runemastered Heavy Belt | `belts` | yes | `assets/item-bases/2597.png` | missing | `Metadata/Items/Belts/FourBelt9VerisiumUnique3` |
| 2598 | Runemastered Heavy Belt | `belts` | yes | `assets/item-bases/2598.png` | missing | `Metadata/Items/Belts/FourBelt9VerisiumUnique4` |
| 2599 | Utility Belt | `belts` | yes | `assets/item-bases/2599.png` | missing | `Metadata/Items/Belts/FourBelt10` |
| 2600 | Fine Belt | `belts` | yes | `assets/item-bases/2600.png` | missing | `Metadata/Items/Belts/FourBelt11` |
| 2601 | Stalking Belt | `belts` | yes | `assets/item-bases/2601.png` | missing | `Metadata/Items/Belts/FourBeltB1` |
| 2602 | Invoking Belt | `belts` | yes | `assets/item-bases/2602.png` | missing | `Metadata/Items/Belts/FourBeltB2` |
| 2603 | Sinew Belt | `belts` | yes | `assets/item-bases/2603.png` | missing | `Metadata/Items/Belts/FourBeltB3` |
| 2604 | Forking Belt | `belts` | yes | `assets/item-bases/2604.png` | missing | `Metadata/Items/Belts/FourBeltB4` |
| 2605 | Lesser Life Flask | `life_flasks` | yes | `assets/item-bases/2605.png` | missing | `Metadata/Items/Flasks/FourFlaskLife1` |
| 2606 | Medium Life Flask | `life_flasks` | yes | `assets/item-bases/2606.png` | missing | `Metadata/Items/Flasks/FourFlaskLife2` |
| 2607 | Greater Life Flask | `life_flasks` | yes | `assets/item-bases/2607.png` | missing | `Metadata/Items/Flasks/FourFlaskLife3` |
| 2608 | Grand Life Flask | `life_flasks` | yes | `assets/item-bases/2608.png` | missing | `Metadata/Items/Flasks/FourFlaskLife4` |
| 2609 | Giant Life Flask | `life_flasks` | yes | `assets/item-bases/2609.png` | missing | `Metadata/Items/Flasks/FourFlaskLife5` |
| 2610 | Colossal Life Flask | `life_flasks` | yes | `assets/item-bases/2610.png` | missing | `Metadata/Items/Flasks/FourFlaskLife6` |
| 2611 | Gargantuan Life Flask | `life_flasks` | yes | `assets/item-bases/2611.png` | missing | `Metadata/Items/Flasks/FourFlaskLife7` |
| 2612 | Transcendent Life Flask | `life_flasks` | yes | `assets/item-bases/2612.png` | missing | `Metadata/Items/Flasks/FourFlaskLife8` |
| 2613 | Ultimate Life Flask | `life_flasks` | yes | `assets/item-bases/2613.png` | missing | `Metadata/Items/Flasks/FourFlaskLife9` |
| 2614 | Lesser Mana Flask | `mana_flasks` | yes | `assets/item-bases/2614.png` | missing | `Metadata/Items/Flasks/FourFlaskMana1` |
| 2615 | Medium Mana Flask | `mana_flasks` | yes | `assets/item-bases/2615.png` | missing | `Metadata/Items/Flasks/FourFlaskMana2` |
| 2616 | Greater Mana Flask | `mana_flasks` | yes | `assets/item-bases/2616.png` | missing | `Metadata/Items/Flasks/FourFlaskMana3` |
| 2617 | Grand Mana Flask | `mana_flasks` | yes | `assets/item-bases/2617.png` | missing | `Metadata/Items/Flasks/FourFlaskMana4` |
| 2618 | Giant Mana Flask | `mana_flasks` | yes | `assets/item-bases/2618.png` | missing | `Metadata/Items/Flasks/FourFlaskMana5` |
| 2619 | Colossal Mana Flask | `mana_flasks` | yes | `assets/item-bases/2619.png` | missing | `Metadata/Items/Flasks/FourFlaskMana6` |
| 2620 | Gargantuan Mana Flask | `mana_flasks` | yes | `assets/item-bases/2620.png` | missing | `Metadata/Items/Flasks/FourFlaskMana7` |
| 2621 | Transcendent Mana Flask | `mana_flasks` | yes | `assets/item-bases/2621.png` | missing | `Metadata/Items/Flasks/FourFlaskMana8` |
| 2622 | Ultimate Mana Flask | `mana_flasks` | yes | `assets/item-bases/2622.png` | missing | `Metadata/Items/Flasks/FourFlaskMana9` |
| 2623 | Thawing Charm | `charms` | yes | `assets/item-bases/2623.png` | missing | `Metadata/Items/Flasks/FourCharm1` |
| 2624 | Staunching Charm | `charms` | yes | `assets/item-bases/2624.png` | missing | `Metadata/Items/Flasks/FourCharm2` |
| 2625 | Antidote Charm | `charms` | yes | `assets/item-bases/2625.png` | missing | `Metadata/Items/Flasks/FourCharm3` |
| 2626 | Dousing Charm | `charms` | yes | `assets/item-bases/2626.png` | missing | `Metadata/Items/Flasks/FourCharm4` |
| 2627 | Grounding Charm | `charms` | yes | `assets/item-bases/2627.png` | missing | `Metadata/Items/Flasks/FourCharm5` |
| 2628 | Stone Charm | `charms` | yes | `assets/item-bases/2628.png` | missing | `Metadata/Items/Flasks/FourCharm6` |
| 2629 | Silver Charm | `charms` | yes | `assets/item-bases/2629.png` | missing | `Metadata/Items/Flasks/FourCharm7` |
| 2630 | Ruby Charm | `charms` | yes | `assets/item-bases/2630.png` | missing | `Metadata/Items/Flasks/FourCharm8` |
| 2631 | Sapphire Charm | `charms` | yes | `assets/item-bases/2631.png` | missing | `Metadata/Items/Flasks/FourCharm9` |
| 2632 | Topaz Charm | `charms` | yes | `assets/item-bases/2632.png` | missing | `Metadata/Items/Flasks/FourCharm10` |
| 2633 | Amethyst Charm | `charms` | yes | `assets/item-bases/2633.png` | missing | `Metadata/Items/Flasks/FourCharm11` |
| 2634 | Golden Charm | `charms` | yes | `assets/item-bases/2634.png` | missing | `Metadata/Items/Flasks/FourCharm12` |
| 2635 | Cleansing Charm | `charms` | yes | `assets/item-bases/2635.png` | missing | `Metadata/Items/Flasks/FourCharm13` |
| 2636 | Ring | `rings` | yes | `assets/item-bases/2636.png` | missing | `Metadata/Items/Rings/FourRingBase` |
| 2637 | Dusk Ring | `rings` | yes | `assets/item-bases/2637.png` | missing | `Metadata/Items/Rings/FourRingLake1` |
| 2638 | Gloam Ring | `rings` | yes | `assets/item-bases/2638.png` | missing | `Metadata/Items/Rings/FourRingLake2` |
| 2639 | Penumbra Ring | `rings` | yes | `assets/item-bases/2639.png` | missing | `Metadata/Items/Rings/FourRingLake3` |
| 2640 | Tenebrous Ring | `rings` | yes | `assets/item-bases/2640.png` | missing | `Metadata/Items/Rings/FourRingLake4` |
| 2641 | Dusk Amulet | `amulets` | yes | `assets/item-bases/2641.png` | missing | `Metadata/Items/Amulets/FourAmuletLake1` |
| 2642 | Gloam Amulet | `amulets` | yes | `assets/item-bases/2642.png` | missing | `Metadata/Items/Amulets/FourAmuletLake2` |
| 2643 | Penumbra Amulet | `amulets` | yes | `assets/item-bases/2643.png` | missing | `Metadata/Items/Amulets/FourAmuletLake3` |
| 2644 | Tenebrous Amulet | `amulets` | yes | `assets/item-bases/2644.png` | missing | `Metadata/Items/Amulets/FourAmuletLake4` |
| 2645 | Twisted Amulet | `amulets` | yes | `assets/item-bases/2645.png` | missing | `Metadata/Items/Amulets/FourAmuletDelirium1` |
| 2646 | Distorted Amulet | `amulets` | yes | `assets/item-bases/2646.png` | missing | `Metadata/Items/Amulets/FourAmuletDelirium2` |
| 2647 | Garment | `body_armours_str_dex_int` | yes | `assets/item-bases/2647.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDexIntBase` |
| 2648 | Grand Regalia | `body_armours_str_dex_int` | yes | `assets/item-bases/2648.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDexInt1` |
| 2649 | Sacrificial Regalia | `body_armours_str_dex_int` | yes | `assets/item-bases/2649.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDexInt2` |
| 2660 | Grand Visage | `helmets_str_dex_int` | yes | `assets/item-bases/2660.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDexInt1` |
| 2661 | Grand Manchettes | `gloves_str_dex_int` | yes | `assets/item-bases/2661.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDexInt1` |
| 2662 | Grand Cuisses | `boots_str_dex_int` | yes | `assets/item-bases/2662.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDexInt1` |
| 2667 | Golden Shield | `shields_str_dex_int` | yes | `assets/item-bases/2667.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDemigod` |
| 2668 | Golden Blade | `one_hand_swords` | yes | `assets/item-bases/2668.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSwords/FourOneHandSwordDemigod` |
| 2669 | Breach Ring | `rings` | yes | `assets/item-bases/2669.png` | missing | `Metadata/Items/Rings/FourRingBreach` |
| 2670 | Refined Breach Ring | `rings` | yes | `assets/item-bases/2670.png` | missing | `Metadata/Items/Rings/FourRingBreach2` |
| 2723 | Calescent Hammer | `one_hand_maces` | yes | `assets/item-bases/2723.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace2Cruel` |
| 2724 | Flared Mace | `one_hand_maces` | yes | `assets/item-bases/2724.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace3Cruel` |
| 2725 | Battle Pick | `one_hand_maces` | yes | `assets/item-bases/2725.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace5Cruel` |
| 2726 | Marching Mace | `one_hand_maces` | yes | `assets/item-bases/2726.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace6Cruel` |
| 2727 | Runeforged Marching Mace | `one_hand_maces` | yes | `assets/item-bases/2727.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace6CruelVerisiumUnique1` |
| 2728 | Bandit Mace | `one_hand_maces` | yes | `assets/item-bases/2728.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace7Cruel` |
| 2729 | Structured Hammer | `one_hand_maces` | yes | `assets/item-bases/2729.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace8Cruel` |
| 2730 | Snakewood Greathammer | `two_hand_maces` | yes | `assets/item-bases/2730.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace2Cruel` |
| 2731 | Blacksmith Maul | `two_hand_maces` | yes | `assets/item-bases/2731.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace3Cruel` |
| 2732 | Zealot Greathammer | `two_hand_maces` | yes | `assets/item-bases/2732.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace5Cruel` |
| 2733 | Solemn Maul | `two_hand_maces` | yes | `assets/item-bases/2733.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace6Cruel` |
| 2734 | Heavy Greathammer | `two_hand_maces` | yes | `assets/item-bases/2734.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace7Cruel` |
| 2735 | Disintegrating Maul | `two_hand_maces` | yes | `assets/item-bases/2735.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace8Cruel` |
| 2736 | Reaching Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2736.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff2Cruel` |
| 2737 | Barbarous Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2737.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff3Cruel` |
| 2738 | Arcing Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2738.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff4Cruel` |
| 2739 | Waxing Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2739.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff5Cruel` |
| 2740 | Bladed Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2740.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff7Cruel` |
| 2741 | Guardian Quarterstaff | `quarterstaves` | yes | `assets/item-bases/2741.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff8Cruel` |
| 2742 | Snakewood Shortbow | `bows` | yes | `assets/item-bases/2742.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow2Cruel` |
| 2743 | Protector Bow | `bows` | yes | `assets/item-bases/2743.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow3Cruel` |
| 2744 | Rider Bow | `bows` | yes | `assets/item-bases/2744.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow5Cruel` |
| 2745 | Twin Bow | `bows` | yes | `assets/item-bases/2745.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow6Cruel` |
| 2746 | Adherent Bow | `bows` | yes | `assets/item-bases/2746.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow7Cruel` |
| 2747 | Militant Bow | `bows` | yes | `assets/item-bases/2747.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow8Cruel` |
| 2748 | Taut Crossbow | `crossbows` | yes | `assets/item-bases/2748.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow2Cruel` |
| 2749 | Robust Crossbow | `crossbows` | yes | `assets/item-bases/2749.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow3Cruel` |
| 2750 | Painted Crossbow | `crossbows` | yes | `assets/item-bases/2750.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow4Cruel` |
| 2751 | Twin Crossbow | `crossbows` | yes | `assets/item-bases/2751.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow5Cruel` |
| 2752 | Cannonade Crossbow | `crossbows` | yes | `assets/item-bases/2752.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow7Cruel` |
| 2753 | Bleak Crossbow | `crossbows` | yes | `assets/item-bases/2753.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow8Cruel` |
| 2754 | Steelhead Spear | `spears` | yes | `assets/item-bases/2754.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear2Cruel` |
| 2755 | Coursing Spear | `spears` | yes | `assets/item-bases/2755.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear3Cruel` |
| 2756 | Swift Spear | `spears` | yes | `assets/item-bases/2756.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear5Cruel` |
| 2757 | Branched Spear | `spears` | yes | `assets/item-bases/2757.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear6Cruel` |
| 2758 | Jagged Spear | `spears` | yes | `assets/item-bases/2758.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear7Cruel` |
| 2759 | Massive Spear | `spears` | yes | `assets/item-bases/2759.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear8Cruel` |
| 2763 | Barbarian Plate | `body_armours_str` | yes | `assets/item-bases/2763.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr2Cruel` |
| 2764 | Rugged Cuirass | `body_armours_str` | yes | `assets/item-bases/2764.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr3Cruel` |
| 2765 | Sandsworn Cuirass | `body_armours_str` | yes | `assets/item-bases/2765.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr5Cruel` |
| 2766 | Elegant Plate | `body_armours_str` | yes | `assets/item-bases/2766.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr6Cruel` |
| 2767 | Heavy Plate | `body_armours_str` | yes | `assets/item-bases/2767.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr7Cruel` |
| 2768 | Stone Cuirass | `body_armours_str` | yes | `assets/item-bases/2768.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr8Cruel` |
| 2769 | Patchwork Vest | `body_armours_dex` | yes | `assets/item-bases/2769.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex2Cruel` |
| 2770 | Hunting Coat | `body_armours_dex` | yes | `assets/item-bases/2770.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex3Cruel` |
| 2771 | Riding Coat | `body_armours_dex` | yes | `assets/item-bases/2771.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex5Cruel` |
| 2772 | Layered Vest | `body_armours_dex` | yes | `assets/item-bases/2772.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex6Cruel` |
| 2773 | Runner Vest | `body_armours_dex` | yes | `assets/item-bases/2773.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex7Cruel` |
| 2774 | Lizardscale Coat | `body_armours_dex` | yes | `assets/item-bases/2774.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex8Cruel` |
| 2775 | Avian Robe | `body_armours_int` | yes | `assets/item-bases/2775.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt2Cruel` |
| 2776 | Cursespeaker's Robe | `body_armours_int` | yes | `assets/item-bases/2776.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt3Cruel` |
| 2777 | Luxurious Robe | `body_armours_int` | yes | `assets/item-bases/2777.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt5Cruel` |
| 2778 | River Raiment | `body_armours_int` | yes | `assets/item-bases/2778.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt6Cruel` |
| 2779 | Adherent's Raiment | `body_armours_int` | yes | `assets/item-bases/2779.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt7Cruel` |
| 2780 | Ceremonial Robe | `body_armours_int` | yes | `assets/item-bases/2780.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt8Cruel` |
| 2781 | Ring Mail | `body_armours_str_dex` | yes | `assets/item-bases/2781.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex1Cruel` |
| 2782 | Scoundrel Armour | `body_armours_str_dex` | yes | `assets/item-bases/2782.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex2Cruel` |
| 2783 | Wanderer Armour | `body_armours_str_dex` | yes | `assets/item-bases/2783.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex3Cruel` |
| 2784 | Mantled Mail | `body_armours_str_dex` | yes | `assets/item-bases/2784.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex4Cruel` |
| 2785 | Trailblazer Armour | `body_armours_str_dex` | yes | `assets/item-bases/2785.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex5Cruel` |
| 2786 | Golden Mail | `body_armours_str_dex` | yes | `assets/item-bases/2786.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex6Cruel` |
| 2787 | Templar Vestments | `body_armours_str_int` | yes | `assets/item-bases/2787.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt1Cruel` |
| 2788 | Bearskin Mantle | `body_armours_str_int` | yes | `assets/item-bases/2788.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt2Cruel` |
| 2789 | Chain Vestments | `body_armours_str_int` | yes | `assets/item-bases/2789.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt3Cruel` |
| 2790 | Occultist Mantle | `body_armours_str_int` | yes | `assets/item-bases/2790.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt4Cruel` |
| 2791 | Plated Vestments | `body_armours_str_int` | yes | `assets/item-bases/2791.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt5Cruel` |
| 2792 | Heartcarver Mantle | `body_armours_str_int` | yes | `assets/item-bases/2792.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt6Cruel` |
| 2793 | Ascetic Garb | `body_armours_dex_int` | yes | `assets/item-bases/2793.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt1Cruel` |
| 2794 | Oiled Jacket | `body_armours_dex_int` | yes | `assets/item-bases/2794.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt2Cruel` |
| 2795 | Evangelist Garb | `body_armours_dex_int` | yes | `assets/item-bases/2795.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt3Cruel` |
| 2796 | Itinerant Jacket | `body_armours_dex_int` | yes | `assets/item-bases/2796.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt4Cruel` |
| 2797 | Hatungo Garb | `body_armours_dex_int` | yes | `assets/item-bases/2797.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt5Cruel` |
| 2798 | Hawker's Jacket | `body_armours_dex_int` | yes | `assets/item-bases/2798.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt6Cruel` |
| 2799 | Corroded Greathelm | `helmets_str` | yes | `assets/item-bases/2799.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr1Cruel` |
| 2800 | Mercenary Greathelm | `helmets_str` | yes | `assets/item-bases/2800.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr2Cruel` |
| 2801 | Homeguard Greathelm | `helmets_str` | yes | `assets/item-bases/2801.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr3Cruel` |
| 2802 | Elegant Greathelm | `helmets_str` | yes | `assets/item-bases/2802.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr4Cruel` |
| 2803 | Noble Greathelm | `helmets_str` | yes | `assets/item-bases/2803.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr5Cruel` |
| 2804 | Rotted Hood | `helmets_dex` | yes | `assets/item-bases/2804.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex1Cruel` |
| 2805 | Wool Cap | `helmets_dex` | yes | `assets/item-bases/2805.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex2Cruel` |
| 2806 | Narrow Hood | `helmets_dex` | yes | `assets/item-bases/2806.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex3Cruel` |
| 2807 | Wrapped Cap | `helmets_dex` | yes | `assets/item-bases/2807.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex4Cruel` |
| 2808 | Deerstalker Hood | `helmets_dex` | yes | `assets/item-bases/2808.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex5Cruel` |
| 2809 | Druidic Circlet | `helmets_int` | yes | `assets/item-bases/2809.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt1Cruel` |
| 2810 | Avian Tiara | `helmets_int` | yes | `assets/item-bases/2810.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt2Cruel` |
| 2811 | Desert Circlet | `helmets_int` | yes | `assets/item-bases/2811.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt3Cruel` |
| 2812 | Sandsworn Tiara | `helmets_int` | yes | `assets/item-bases/2812.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt4Cruel` |
| 2813 | Jungle Tiara | `helmets_int` | yes | `assets/item-bases/2813.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt5Cruel` |
| 2814 | Domed Helm | `helmets_str_dex` | yes | `assets/item-bases/2814.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex1Cruel` |
| 2815 | Engraved Helm | `helmets_str_dex` | yes | `assets/item-bases/2815.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex2Cruel` |
| 2816 | Soldier Helm | `helmets_str_dex` | yes | `assets/item-bases/2816.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex3Cruel` |
| 2817 | Cabalist Helm | `helmets_str_dex` | yes | `assets/item-bases/2817.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex4Cruel` |
| 2818 | Cassis Helm | `helmets_str_dex` | yes | `assets/item-bases/2818.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex5Cruel` |
| 2819 | Mailed Crown | `helmets_str_int` | yes | `assets/item-bases/2819.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt1Cruel` |
| 2820 | Forest Crown | `helmets_str_int` | yes | `assets/item-bases/2820.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt2Cruel` |
| 2821 | Zealot Crown | `helmets_str_int` | yes | `assets/item-bases/2821.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt3Cruel` |
| 2822 | Hallowed Crown | `helmets_str_int` | yes | `assets/item-bases/2822.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt4Cruel` |
| 2823 | Inquisitor Crown | `helmets_str_int` | yes | `assets/item-bases/2823.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt5Cruel` |
| 2824 | Oak Mask | `helmets_dex_int` | yes | `assets/item-bases/2824.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt1Cruel` |
| 2825 | Bandit Mask | `helmets_dex_int` | yes | `assets/item-bases/2825.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt2Cruel` |
| 2826 | Skulking Mask | `helmets_dex_int` | yes | `assets/item-bases/2826.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt3Cruel` |
| 2827 | Pariah Mask | `helmets_dex_int` | yes | `assets/item-bases/2827.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt4Cruel` |
| 2828 | Avian Mask | `helmets_dex_int` | yes | `assets/item-bases/2828.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt5Cruel` |
| 2829 | Plated Mitts | `gloves_str` | yes | `assets/item-bases/2829.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr2Cruel` |
| 2830 | Elegant Mitts | `gloves_str` | yes | `assets/item-bases/2830.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr3Cruel` |
| 2831 | Ancient Mitts | `gloves_str` | yes | `assets/item-bases/2831.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr4Cruel` |
| 2832 | Feathered Mitts | `gloves_str` | yes | `assets/item-bases/2832.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr5Cruel` |
| 2833 | Hunting Bracers | `gloves_dex` | yes | `assets/item-bases/2833.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex2Cruel` |
| 2834 | Swift Bracers | `gloves_dex` | yes | `assets/item-bases/2834.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex3Cruel` |
| 2835 | Refined Bracers | `gloves_dex` | yes | `assets/item-bases/2835.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex4Cruel` |
| 2836 | Spiked Bracers | `gloves_dex` | yes | `assets/item-bases/2836.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex5Cruel` |
| 2837 | Ominous Gloves | `gloves_int` | yes | `assets/item-bases/2837.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt2Cruel` |
| 2838 | Embellished Gloves | `gloves_int` | yes | `assets/item-bases/2838.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt3Cruel` |
| 2839 | Baroque Gloves | `gloves_int` | yes | `assets/item-bases/2839.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt4Cruel` |
| 2840 | Gold Gloves | `gloves_int` | yes | `assets/item-bases/2840.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt5Cruel` |
| 2841 | Ironmail Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2841.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex1Cruel` |
| 2842 | Captain Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2842.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex2Cruel` |
| 2843 | Zealot Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2843.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex3Cruel` |
| 2844 | Braided Cuffs | `gloves_str_int` | yes | `assets/item-bases/2844.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt1Cruel` |
| 2845 | Heirloom Cuffs | `gloves_str_int` | yes | `assets/item-bases/2845.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt2Cruel` |
| 2846 | Ornate Cuffs | `gloves_str_int` | yes | `assets/item-bases/2846.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt3Cruel` |
| 2847 | Bandage Wraps | `gloves_dex_int` | yes | `assets/item-bases/2847.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt1Cruel` |
| 2848 | Cambric Wraps | `gloves_dex_int` | yes | `assets/item-bases/2848.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt2Cruel` |
| 2849 | Adorned Wraps | `gloves_dex_int` | yes | `assets/item-bases/2849.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt3Cruel` |
| 2850 | Plated Greaves | `boots_str` | yes | `assets/item-bases/2850.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr2Cruel` |
| 2851 | Lionheart Greaves | `boots_str` | yes | `assets/item-bases/2851.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr3Cruel` |
| 2852 | Elegant Greaves | `boots_str` | yes | `assets/item-bases/2852.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr4Cruel` |
| 2853 | Carved Greaves | `boots_str` | yes | `assets/item-bases/2853.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr5Cruel` |
| 2854 | Bound Boots | `boots_dex` | yes | `assets/item-bases/2854.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex2Cruel` |
| 2855 | Sleek Boots | `boots_dex` | yes | `assets/item-bases/2855.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex3Cruel` |
| 2856 | Studded Boots | `boots_dex` | yes | `assets/item-bases/2856.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex4Cruel` |
| 2857 | Serpentscale Boots | `boots_dex` | yes | `assets/item-bases/2857.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex5Cruel` |
| 2858 | Laced Sandals | `boots_int` | yes | `assets/item-bases/2858.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt2Cruel` |
| 2859 | Bangled Sandals | `boots_int` | yes | `assets/item-bases/2859.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt3Cruel` |
| 2860 | Elegant Slippers | `boots_int` | yes | `assets/item-bases/2860.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt4Cruel` |
| 2861 | Dunerunner Sandals | `boots_int` | yes | `assets/item-bases/2861.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt5Cruel` |
| 2862 | Soldiering Sabatons | `boots_str_dex` | yes | `assets/item-bases/2862.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex1Cruel` |
| 2863 | Goldwork Sabatons | `boots_str_dex` | yes | `assets/item-bases/2863.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex2Cruel` |
| 2864 | Bastion Sabatons | `boots_str_dex` | yes | `assets/item-bases/2864.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex3Cruel` |
| 2865 | Adherent Leggings | `boots_str_int` | yes | `assets/item-bases/2865.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt1Cruel` |
| 2866 | Bound Leggings | `boots_str_int` | yes | `assets/item-bases/2866.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt2Cruel` |
| 2867 | Shamanistic Leggings | `boots_str_int` | yes | `assets/item-bases/2867.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt3Cruel` |
| 2868 | Wayfarer Shoes | `boots_dex_int` | yes | `assets/item-bases/2868.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt1Cruel` |
| 2869 | Silverbuckled Shoes | `boots_dex_int` | yes | `assets/item-bases/2869.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt2Cruel` |
| 2870 | Treerunner Shoes | `boots_dex_int` | yes | `assets/item-bases/2870.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt3Cruel` |
| 2871 | Aged Tower Shield | `shields_str` | yes | `assets/item-bases/2871.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr2Cruel` |
| 2872 | Metalworked Tower Shield | `shields_str` | yes | `assets/item-bases/2872.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr3Cruel` |
| 2873 | Cultist Tower Shield | `shields_str` | yes | `assets/item-bases/2873.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr5Cruel` |
| 2874 | Bulwark Tower Shield | `shields_str` | yes | `assets/item-bases/2874.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr6Cruel` |
| 2875 | Noble Tower Shield | `shields_str` | yes | `assets/item-bases/2875.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr7Cruel` |
| 2876 | Goldworked Tower Shield | `shields_str` | yes | `assets/item-bases/2876.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr8Cruel` |
| 2877 | Ironwood Targe | `shields_str_dex` | yes | `assets/item-bases/2877.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex1Cruel` |
| 2878 | Fur-lined Targe | `shields_str_dex` | yes | `assets/item-bases/2878.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex2Cruel` |
| 2879 | Mercenary Targe | `shields_str_dex` | yes | `assets/item-bases/2879.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex3Cruel` |
| 2880 | Polished Targe | `shields_str_dex` | yes | `assets/item-bases/2880.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex4Cruel` |
| 2881 | Stone Targe | `shields_str_dex` | yes | `assets/item-bases/2881.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex5Cruel` |
| 2882 | Avian Targe | `shields_str_dex` | yes | `assets/item-bases/2882.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex6Cruel` |
| 2883 | Painted Crest Shield | `shields_str_int` | yes | `assets/item-bases/2883.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt1Cruel` |
| 2884 | Engraved Crest Shield | `shields_str_int` | yes | `assets/item-bases/2884.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt2Cruel` |
| 2885 | Descry Crest Shield | `shields_str_int` | yes | `assets/item-bases/2885.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt3Cruel` |
| 2886 | Dekharan Crest Shield | `shields_str_int` | yes | `assets/item-bases/2886.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt4Cruel` |
| 2887 | Quartered Crest Shield | `shields_str_int` | yes | `assets/item-bases/2887.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt5Cruel` |
| 2888 | Glowering Crest Shield | `shields_str_int` | yes | `assets/item-bases/2888.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt6Cruel` |
| 2889 | Oak Buckler | `bucklers` | yes | `assets/item-bases/2889.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex2Cruel` |
| 2890 | Painted Buckler | `bucklers` | yes | `assets/item-bases/2890.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex3Cruel` |
| 2891 | Coiled Buckler | `bucklers` | yes | `assets/item-bases/2891.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex5Cruel` |
| 2892 | Spikeward Buckler | `bucklers` | yes | `assets/item-bases/2892.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex6Cruel` |
| 2893 | Jingling Buckler | `bucklers` | yes | `assets/item-bases/2893.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex7Cruel` |
| 2894 | Bladeguard Buckler | `bucklers` | yes | `assets/item-bases/2894.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex8Cruel` |
| 2895 | Wreath Focus | `foci` | yes | `assets/item-bases/2895.png` | missing | `Metadata/Items/Armours/Focii/FourFocus2Cruel` |
| 2896 | Staghorn Focus | `foci` | yes | `assets/item-bases/2896.png` | missing | `Metadata/Items/Armours/Focii/FourFocus3Cruel` |
| 2897 | Jingling Focus | `foci` | yes | `assets/item-bases/2897.png` | missing | `Metadata/Items/Armours/Focii/FourFocus5Cruel` |
| 2898 | Arrayed Focus | `foci` | yes | `assets/item-bases/2898.png` | missing | `Metadata/Items/Armours/Focii/FourFocus6Cruel` |
| 2899 | Cultist Focus | `foci` | yes | `assets/item-bases/2899.png` | missing | `Metadata/Items/Armours/Focii/FourFocus7Cruel` |
| 2900 | Hallowed Focus | `foci` | yes | `assets/item-bases/2900.png` | missing | `Metadata/Items/Armours/Focii/FourFocus8Cruel` |
| 2901 | Soldier Cuirass | `body_armours_str` | yes | `assets/item-bases/2901.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr3Endgame` |
| 2902 | Ornate Plate | `body_armours_str` | yes | `assets/item-bases/2902.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr6Endgame` |
| 2903 | Utzaal Cuirass | `body_armours_str` | yes | `assets/item-bases/2903.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr8Endgame` |
| 2904 | Warlord Cuirass | `body_armours_str` | yes | `assets/item-bases/2904.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr10Endgame` |
| 2905 | Swiftstalker Coat | `body_armours_dex` | yes | `assets/item-bases/2905.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex3Endgame` |
| 2906 | Slipstrike Vest | `body_armours_dex` | yes | `assets/item-bases/2906.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex6Endgame` |
| 2907 | Wyrmscale Coat | `body_armours_dex` | yes | `assets/item-bases/2907.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex8Endgame` |
| 2908 | Corsair Coat | `body_armours_dex` | yes | `assets/item-bases/2908.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex10Endgame` |
| 2909 | Vile Robe | `body_armours_int` | yes | `assets/item-bases/2909.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt3Endgame` |
| 2910 | Flowing Raiment | `body_armours_int` | yes | `assets/item-bases/2910.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt6Endgame` |
| 2911 | Sacramental Robe | `body_armours_int` | yes | `assets/item-bases/2911.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt8Endgame` |
| 2912 | Feathered Raiment | `body_armours_int` | yes | `assets/item-bases/2912.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt10Endgame` |
| 2913 | Dastard Armour | `body_armours_str_dex` | yes | `assets/item-bases/2913.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex2Endgame` |
| 2914 | Shrouded Mail | `body_armours_str_dex` | yes | `assets/item-bases/2914.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex4aEndgame` |
| 2915 | Shrouded Mail | `body_armours_str_dex` | yes | `assets/item-bases/2915.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex4bEndgame` |
| 2916 | Shrouded Mail | `body_armours_str_dex` | yes | `assets/item-bases/2916.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex4cEndgame` |
| 2917 | Death Mail | `body_armours_str_dex` | yes | `assets/item-bases/2917.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex6Endgame` |
| 2918 | Thane Mail | `body_armours_str_dex` | yes | `assets/item-bases/2918.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex8Endgame` |
| 2919 | Wolfskin Mantle | `body_armours_str_int` | yes | `assets/item-bases/2919.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt2Endgame` |
| 2920 | Conjurer Mantle | `body_armours_str_int` | yes | `assets/item-bases/2920.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt4Endgame` |
| 2921 | Death Mantle | `body_armours_str_int` | yes | `assets/item-bases/2921.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt6Endgame` |
| 2922 | Seastorm Mantle | `body_armours_str_int` | yes | `assets/item-bases/2922.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt8Endgame` |
| 2923 | Sleek Jacket | `body_armours_dex_int` | yes | `assets/item-bases/2923.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt2Endgame` |
| 2924 | Rambler Jacket | `body_armours_dex_int` | yes | `assets/item-bases/2924.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt4Endgame` |
| 2925 | Falconer's Jacket | `body_armours_dex_int` | yes | `assets/item-bases/2925.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt6Endgame` |
| 2926 | Austere Garb | `body_armours_dex_int` | yes | `assets/item-bases/2926.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt8Endgame` |
| 2927 | Primal Markings | `body_armours_dex_int` | yes | `assets/item-bases/2927.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexIntUnique1` |
| 2928 | Warmonger Greathelm | `helmets_str` | yes | `assets/item-bases/2928.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr2Endgame` |
| 2929 | Masked Greathelm | `helmets_str` | yes | `assets/item-bases/2929.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr4Endgame` |
| 2930 | Paragon Greathelm | `helmets_str` | yes | `assets/item-bases/2930.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr5Endgame` |
| 2931 | Imperial Greathelm | `helmets_str` | yes | `assets/item-bases/2931.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr7Endgame` |
| 2932 | Woven Cap | `helmets_dex` | yes | `assets/item-bases/2932.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex2Endgame` |
| 2933 | Desert Cap | `helmets_dex` | yes | `assets/item-bases/2933.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex4Endgame` |
| 2934 | Trapper Hood | `helmets_dex` | yes | `assets/item-bases/2934.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex5Endgame` |
| 2935 | Freebooter Cap | `helmets_dex` | yes | `assets/item-bases/2935.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex7Endgame` |
| 2936 | Skycrown Tiara | `helmets_int` | yes | `assets/item-bases/2936.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt2Endgame` |
| 2937 | Sorcerous Tiara | `helmets_int` | yes | `assets/item-bases/2937.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt4Endgame` |
| 2938 | Kamasan Tiara | `helmets_int` | yes | `assets/item-bases/2938.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt5Endgame` |
| 2939 | Ancestral Tiara | `helmets_int` | yes | `assets/item-bases/2939.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt8Endgame` |
| 2940 | Warded Helm | `helmets_str_dex` | yes | `assets/item-bases/2940.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex2Endgame` |
| 2941 | Cryptic Helm | `helmets_str_dex` | yes | `assets/item-bases/2941.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex4Endgame` |
| 2942 | Champion Helm | `helmets_str_dex` | yes | `assets/item-bases/2942.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex5Endgame` |
| 2943 | Gladiatorial Helm | `helmets_str_dex` | yes | `assets/item-bases/2943.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex6Endgame` |
| 2944 | Druidic Crown | `helmets_str_int` | yes | `assets/item-bases/2944.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt2Endgame` |
| 2945 | Saintly Crown | `helmets_str_int` | yes | `assets/item-bases/2945.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt4Endgame` |
| 2946 | Divine Crown | `helmets_str_int` | yes | `assets/item-bases/2946.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt5Endgame` |
| 2947 | Cryptic Crown | `helmets_str_int` | yes | `assets/item-bases/2947.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt6Endgame` |
| 2948 | Brigand Mask | `helmets_dex_int` | yes | `assets/item-bases/2948.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt2Endgame` |
| 2949 | Faridun Mask | `helmets_dex_int` | yes | `assets/item-bases/2949.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt4Endgame` |
| 2950 | Soaring Mask | `helmets_dex_int` | yes | `assets/item-bases/2950.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt5Endgame` |
| 2951 | Grinning Mask | `helmets_dex_int` | yes | `assets/item-bases/2951.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt6Endgame` |
| 2952 | Knightly Mitts | `gloves_str` | yes | `assets/item-bases/2952.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr2Endgame` |
| 2953 | Ornate Mitts | `gloves_str` | yes | `assets/item-bases/2953.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr4Endgame` |
| 2954 | Vaal Mitts | `gloves_str` | yes | `assets/item-bases/2954.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr5Endgame` |
| 2955 | Massive Mitts | `gloves_str` | yes | `assets/item-bases/2955.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr6Endgame` |
| 2956 | Stalking Bracers | `gloves_dex` | yes | `assets/item-bases/2956.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex2Endgame` |
| 2957 | Grand Bracers | `gloves_dex` | yes | `assets/item-bases/2957.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex4Endgame` |
| 2958 | Barbed Bracers | `gloves_dex` | yes | `assets/item-bases/2958.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex5Endgame` |
| 2959 | Polished Bracers | `gloves_dex` | yes | `assets/item-bases/2959.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex6Endgame` |
| 2960 | Grim Gloves | `gloves_int` | yes | `assets/item-bases/2960.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt2Endgame` |
| 2961 | Opulent Gloves | `gloves_int` | yes | `assets/item-bases/2961.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt4Endgame` |
| 2962 | Vaal Gloves | `gloves_int` | yes | `assets/item-bases/2962.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt5Endgame` |
| 2963 | Sirenscale Gloves | `gloves_int` | yes | `assets/item-bases/2963.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt6Endgame` |
| 2964 | Steelmail Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2964.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex1Endgame` |
| 2965 | Commander Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2965.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex2Endgame` |
| 2966 | Cultist Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2966.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex3Endgame` |
| 2967 | Blacksteel Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/2967.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex4Endgame` |
| 2968 | Bound Cuffs | `gloves_str_int` | yes | `assets/item-bases/2968.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt1Endgame` |
| 2969 | Ancient Cuffs | `gloves_str_int` | yes | `assets/item-bases/2969.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt2Endgame` |
| 2970 | Gleaming Cuffs | `gloves_str_int` | yes | `assets/item-bases/2970.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt3Endgame` |
| 2971 | Adherent Cuffs | `gloves_str_int` | yes | `assets/item-bases/2971.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt4Endgame` |
| 2972 | Tethering Bands | `gloves_str_int` | yes | `assets/item-bases/2972.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrIntUnique1` |
| 2973 | War Wraps | `gloves_dex_int` | yes | `assets/item-bases/2973.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt1Endgame` |
| 2974 | Elegant Wraps | `gloves_dex_int` | yes | `assets/item-bases/2974.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt2Endgame` |
| 2975 | Vaal Wraps | `gloves_dex_int` | yes | `assets/item-bases/2975.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt3Endgame` |
| 2976 | Secured Wraps | `gloves_dex_int` | yes | `assets/item-bases/2976.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt4Endgame` |
| 2977 | Fists of Stone | `gloves_dex_int` | no | `assets/item-bases/2977.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexIntAscendancy` |
| 2978 | Runeforged Fists of Stone | `gloves_dex_int` | no | `assets/item-bases/2978.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexIntAscendancyVerisium` |
| 2979 | Bulwark Greaves | `boots_str` | yes | `assets/item-bases/2979.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr2Endgame` |
| 2980 | Ornate Greaves | `boots_str` | yes | `assets/item-bases/2980.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr4Endgame` |
| 2981 | Vaal Greaves | `boots_str` | yes | `assets/item-bases/2981.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr5Endgame` |
| 2982 | Tasalian Greaves | `boots_str` | yes | `assets/item-bases/2982.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr6Endgame` |
| 2983 | Cinched Boots | `boots_dex` | yes | `assets/item-bases/2983.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex2Endgame` |
| 2984 | Cavalry Boots | `boots_dex` | yes | `assets/item-bases/2984.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex4Endgame` |
| 2985 | Dragonscale Boots | `boots_dex` | yes | `assets/item-bases/2985.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex5Endgame` |
| 2986 | Drakeskin Boots | `boots_dex` | yes | `assets/item-bases/2986.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex6Endgame` |
| 2987 | Bound Sandals | `boots_int` | yes | `assets/item-bases/2987.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt2Endgame` |
| 2988 | Luxurious Slippers | `boots_int` | yes | `assets/item-bases/2988.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt4Endgame` |
| 2989 | Sandsworn Sandals | `boots_int` | yes | `assets/item-bases/2989.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt5Endgame` |
| 2990 | Sekhema Sandals | `boots_int` | yes | `assets/item-bases/2990.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt6Endgame` |
| 2991 | Veteran Sabatons | `boots_str_dex` | yes | `assets/item-bases/2991.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex1Endgame` |
| 2992 | Noble Sabatons | `boots_str_dex` | yes | `assets/item-bases/2992.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex2Endgame` |
| 2993 | Fortress Sabatons | `boots_str_dex` | yes | `assets/item-bases/2993.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex3Endgame` |
| 2994 | Blacksteel Sabatons | `boots_str_dex` | yes | `assets/item-bases/2994.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex4Endgame` |
| 2995 | Faithful Leggings | `boots_str_int` | yes | `assets/item-bases/2995.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt1Endgame` |
| 2996 | Apostle Leggings | `boots_str_int` | yes | `assets/item-bases/2996.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt2Endgame` |
| 2997 | Warlock Leggings | `boots_str_int` | yes | `assets/item-bases/2997.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt3Endgame` |
| 2998 | Cryptic Leggings | `boots_str_int` | yes | `assets/item-bases/2998.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt4Endgame` |
| 2999 | Wanderer Shoes | `boots_dex_int` | yes | `assets/item-bases/2999.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt1Endgame` |
| 3000 | Charmed Shoes | `boots_dex_int` | yes | `assets/item-bases/3000.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt2Endgame` |
| 3001 | Quickslip Shoes | `boots_dex_int` | yes | `assets/item-bases/3001.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt3Endgame` |
| 3002 | Daggerfoot Shoes | `boots_dex_int` | yes | `assets/item-bases/3002.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt4Endgame` |
| 3003 | Royal Tower Shield | `shields_str` | yes | `assets/item-bases/3003.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr3Endgame` |
| 3004 | Fortress Tower Shield | `shields_str` | yes | `assets/item-bases/3004.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr6Endgame` |
| 3005 | Vaal Tower Shield | `shields_str` | yes | `assets/item-bases/3005.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr8Endgame` |
| 3006 | Tawhoan Tower Shield | `shields_str` | yes | `assets/item-bases/3006.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr10Endgame` |
| 3007 | Glacial Fortress | `shields_str` | yes | `assets/item-bases/3007.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrUnique1` |
| 3008 | Mammoth Targe | `shields_str_dex` | yes | `assets/item-bases/3008.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex2Endgame` |
| 3009 | Baroque Targe | `shields_str_dex` | yes | `assets/item-bases/3009.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex4Endgame` |
| 3010 | Soaring Targe | `shields_str_dex` | yes | `assets/item-bases/3010.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex6Endgame` |
| 3011 | Golden Targe | `shields_str_dex` | yes | `assets/item-bases/3011.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex10Endgame` |
| 3012 | Venerable Defender | `shields_str_dex` | yes | `assets/item-bases/3012.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDexUnique1` |
| 3013 | Intricate Crest Shield | `shields_str_int` | yes | `assets/item-bases/3013.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt2Endgame` |
| 3014 | Sekheman Crest Shield | `shields_str_int` | yes | `assets/item-bases/3014.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt4Endgame` |
| 3015 | Vaal Crest Shield | `shields_str_int` | yes | `assets/item-bases/3015.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt6Endgame` |
| 3016 | Blacksteel Crest Shield | `shields_str_int` | yes | `assets/item-bases/3016.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt7Endgame` |
| 3017 | Ornate Buckler | `bucklers` | yes | `assets/item-bases/3017.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex3Endgame` |
| 3018 | Gutspike Buckler | `bucklers` | yes | `assets/item-bases/3018.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex6Endgame` |
| 3019 | Ancient Buckler | `bucklers` | yes | `assets/item-bases/3019.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex8Endgame` |
| 3020 | Desert Buckler | `bucklers` | yes | `assets/item-bases/3020.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex9Endgame` |
| 3021 | Druidic Focus | `foci` | yes | `assets/item-bases/3021.png` | missing | `Metadata/Items/Armours/Focii/FourFocus3Endgame` |
| 3022 | Leyline Focus | `foci` | yes | `assets/item-bases/3022.png` | missing | `Metadata/Items/Armours/Focii/FourFocus6Endgame` |
| 3023 | Sacred Focus | `foci` | yes | `assets/item-bases/3023.png` | missing | `Metadata/Items/Armours/Focii/FourFocus8Endgame` |
| 3024 | Tasalian Focus | `foci` | yes | `assets/item-bases/3024.png` | missing | `Metadata/Items/Armours/Focii/FourFocus10Endgame` |
| 3025 | Runeforged Rusted Cuirass | `body_armours_str` | yes | `assets/item-bases/3025.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr1Verisium` |
| 3026 | Runeforged Fur Plate | `body_armours_str` | yes | `assets/item-bases/3026.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr2Verisium` |
| 3027 | Runeforged Iron Cuirass | `body_armours_str` | yes | `assets/item-bases/3027.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr3Verisium` |
| 3028 | Runeforged Raider Plate | `body_armours_str` | yes | `assets/item-bases/3028.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr4Verisium` |
| 3029 | Runeforged Maraketh Cuirass | `body_armours_str` | yes | `assets/item-bases/3029.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr5Verisium` |
| 3030 | Runeforged Steel Plate | `body_armours_str` | yes | `assets/item-bases/3030.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr6Verisium` |
| 3031 | Runeforged Full Plate | `body_armours_str` | yes | `assets/item-bases/3031.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr7Verisium` |
| 3032 | Runeforged Vaal Cuirass | `body_armours_str` | yes | `assets/item-bases/3032.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr8Verisium` |
| 3033 | Runeforged Juggernaut Plate | `body_armours_str` | yes | `assets/item-bases/3033.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr9Verisium` |
| 3034 | Runeforged Chieftain Cuirass | `body_armours_str` | yes | `assets/item-bases/3034.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr10Verisium` |
| 3035 | Runeforged Colosseum Plate | `body_armours_str` | yes | `assets/item-bases/3035.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr11Verisium` |
| 3036 | Runeforged Champion Cuirass | `body_armours_str` | yes | `assets/item-bases/3036.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr12Verisium` |
| 3037 | Runeforged Glorious Plate | `body_armours_str` | yes | `assets/item-bases/3037.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr13Verisium` |
| 3038 | Runeforged Conqueror Plate | `body_armours_str` | yes | `assets/item-bases/3038.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr14Verisium` |
| 3039 | Runeforged Abyssal Cuirass | `body_armours_str` | yes | `assets/item-bases/3039.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr15Verisium` |
| 3040 | Runeforged Leather Vest | `body_armours_dex` | yes | `assets/item-bases/3040.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex1Verisium` |
| 3041 | Runeforged Quilted Vest | `body_armours_dex` | yes | `assets/item-bases/3041.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex2Verisium` |
| 3042 | Runeforged Pathfinder Coat | `body_armours_dex` | yes | `assets/item-bases/3042.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex3Verisium` |
| 3043 | Runeforged Shrouded Vest | `body_armours_dex` | yes | `assets/item-bases/3043.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex4Verisium` |
| 3044 | Runeforged Rhoahide Coat | `body_armours_dex` | yes | `assets/item-bases/3044.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex5Verisium` |
| 3045 | Runeforged Studded Vest | `body_armours_dex` | yes | `assets/item-bases/3045.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex6Verisium` |
| 3046 | Runeforged Scout's Vest | `body_armours_dex` | yes | `assets/item-bases/3046.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex7Verisium` |
| 3047 | Runeforged Serpentscale Coat | `body_armours_dex` | yes | `assets/item-bases/3047.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex8Verisium` |
| 3048 | Runeforged Corsair Vest | `body_armours_dex` | yes | `assets/item-bases/3048.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex9Verisium` |
| 3049 | Runeforged Smuggler Coat | `body_armours_dex` | yes | `assets/item-bases/3049.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex10Verisium` |
| 3050 | Runeforged Strider Vest | `body_armours_dex` | yes | `assets/item-bases/3050.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex11Verisium` |
| 3051 | Runeforged Hardleather Coat | `body_armours_dex` | yes | `assets/item-bases/3051.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex12Verisium` |
| 3052 | Runeforged Exquisite Vest | `body_armours_dex` | yes | `assets/item-bases/3052.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex13Verisium` |
| 3053 | Runeforged Mail Coat | `body_armours_dex` | yes | `assets/item-bases/3053.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex14Verisium` |
| 3054 | Runeforged Armoured Vest | `body_armours_dex` | yes | `assets/item-bases/3054.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex15Verisium` |
| 3055 | Runeforged Tattered Robe | `body_armours_int` | yes | `assets/item-bases/3055.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt1Verisium` |
| 3056 | Runeforged Feathered Robe | `body_armours_int` | yes | `assets/item-bases/3056.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt2Verisium` |
| 3057 | Runeforged Hexer's Robe | `body_armours_int` | yes | `assets/item-bases/3057.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt3Verisium` |
| 3058 | Runeforged Bone Raiment | `body_armours_int` | yes | `assets/item-bases/3058.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt4Verisium` |
| 3059 | Runeforged Silk Robe | `body_armours_int` | yes | `assets/item-bases/3059.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt5Verisium` |
| 3060 | Runeforged Keth Raiment | `body_armours_int` | yes | `assets/item-bases/3060.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt6Verisium` |
| 3061 | Runeforged Votive Raiment | `body_armours_int` | yes | `assets/item-bases/3061.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt7Verisium` |
| 3062 | Runeforged Altar Robe | `body_armours_int` | yes | `assets/item-bases/3062.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt8Verisium` |
| 3063 | Runeforged Elementalist Robe | `body_armours_int` | yes | `assets/item-bases/3063.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt9Verisium` |
| 3064 | Runeforged Mystic Raiment | `body_armours_int` | yes | `assets/item-bases/3064.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt10Verisium` |
| 3065 | Runeforged Imperial Robe | `body_armours_int` | yes | `assets/item-bases/3065.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt11Verisium` |
| 3066 | Runeforged Plated Raiment | `body_armours_int` | yes | `assets/item-bases/3066.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt12Verisium` |
| 3067 | Runeforged Havoc Raiment | `body_armours_int` | yes | `assets/item-bases/3067.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt13Verisium` |
| 3068 | Runeforged Enlightened Robe | `body_armours_int` | yes | `assets/item-bases/3068.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt14Verisium` |
| 3069 | Runeforged Arcane Raiment | `body_armours_int` | yes | `assets/item-bases/3069.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt15Verisium` |
| 3070 | Runeforged Chain Mail | `body_armours_str_dex` | yes | `assets/item-bases/3070.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex1Verisium` |
| 3071 | Runeforged Rogue Armour | `body_armours_str_dex` | yes | `assets/item-bases/3071.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex2Verisium` |
| 3072 | Runeforged Vagabond Armour | `body_armours_str_dex` | yes | `assets/item-bases/3072.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex3Verisium` |
| 3073 | Runeforged Cloaked Mail | `body_armours_str_dex` | yes | `assets/item-bases/3073.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex4Verisium` |
| 3074 | Runeforged Explorer Armour | `body_armours_str_dex` | yes | `assets/item-bases/3074.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex5Verisium` |
| 3075 | Runeforged Scale Mail | `body_armours_str_dex` | yes | `assets/item-bases/3075.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex6Verisium` |
| 3076 | Runeforged Knight Armour | `body_armours_str_dex` | yes | `assets/item-bases/3076.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex7Verisium` |
| 3077 | Runeforged Ancestral Mail | `body_armours_str_dex` | yes | `assets/item-bases/3077.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex8Verisium` |
| 3078 | Runeforged Lamellar Mail | `body_armours_str_dex` | yes | `assets/item-bases/3078.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex9Verisium` |
| 3079 | Runeforged Gladiator Armour | `body_armours_str_dex` | yes | `assets/item-bases/3079.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex10Verisium` |
| 3080 | Runeforged Heroic Armour | `body_armours_str_dex` | yes | `assets/item-bases/3080.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex11Verisium` |
| 3081 | Runeforged Tournament Mail | `body_armours_str_dex` | yes | `assets/item-bases/3081.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex12aVerisium` |
| 3082 | Runeforged Tournament Mail | `body_armours_str_dex` | yes | `assets/item-bases/3082.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex12bVerisium` |
| 3083 | Runeforged Tournament Mail | `body_armours_str_dex` | yes | `assets/item-bases/3083.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex12cVerisium` |
| 3084 | Runeforged Slayer Armour | `body_armours_str_dex` | yes | `assets/item-bases/3084.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex13Verisium` |
| 3085 | Runeforged Pilgrim Vestments | `body_armours_str_int` | yes | `assets/item-bases/3085.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt1Verisium` |
| 3086 | Runeforged Pelt Mantle | `body_armours_str_int` | yes | `assets/item-bases/3086.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt2Verisium` |
| 3087 | Runeforged Mail Vestments | `body_armours_str_int` | yes | `assets/item-bases/3087.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt3Verisium` |
| 3088 | Runeforged Shaman Mantle | `body_armours_str_int` | yes | `assets/item-bases/3088.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt4Verisium` |
| 3089 | Runeforged Ironclad Vestments | `body_armours_str_int` | yes | `assets/item-bases/3089.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt5Verisium` |
| 3090 | Runeforged Sacrificial Mantle | `body_armours_str_int` | yes | `assets/item-bases/3090.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt6Verisium` |
| 3091 | Runeforged Cleric Vestments | `body_armours_str_int` | yes | `assets/item-bases/3091.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt7Verisium` |
| 3092 | Runeforged Tideseer Mantle | `body_armours_str_int` | yes | `assets/item-bases/3092.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt8Verisium` |
| 3093 | Runeforged Gilded Vestments | `body_armours_str_int` | yes | `assets/item-bases/3093.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt9Verisium` |
| 3094 | Runeforged Venerated Mantle | `body_armours_str_int` | yes | `assets/item-bases/3094.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt10Verisium` |
| 3095 | Runeforged Revered Vestments | `body_armours_str_int` | yes | `assets/item-bases/3095.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt11Verisium` |
| 3096 | Runeforged Corvus Mantle | `body_armours_str_int` | yes | `assets/item-bases/3096.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt12Verisium` |
| 3097 | Runeforged Zenith Vestments | `body_armours_str_int` | yes | `assets/item-bases/3097.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt13Verisium` |
| 3098 | Runeforged Hermit Garb | `body_armours_dex_int` | yes | `assets/item-bases/3098.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt1Verisium` |
| 3099 | Runeforged Waxed Jacket | `body_armours_dex_int` | yes | `assets/item-bases/3099.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt2Verisium` |
| 3100 | Runeforged Marabout Garb | `body_armours_dex_int` | yes | `assets/item-bases/3100.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt3Verisium` |
| 3101 | Runeforged Wayfarer Jacket | `body_armours_dex_int` | yes | `assets/item-bases/3101.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt4Verisium` |
| 3102 | Runeforged Anchorite Garb | `body_armours_dex_int` | yes | `assets/item-bases/3102.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt5Verisium` |
| 3103 | Runeforged Scalper's Jacket | `body_armours_dex_int` | yes | `assets/item-bases/3103.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt6Verisium` |
| 3104 | Runeforged Scoundrel Jacket | `body_armours_dex_int` | yes | `assets/item-bases/3104.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt7Verisium` |
| 3105 | Runeforged Ascetic Garb | `body_armours_dex_int` | yes | `assets/item-bases/3105.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt8Verisium` |
| 3106 | Runeforged Clandestine Jacket | `body_armours_dex_int` | yes | `assets/item-bases/3106.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt9Verisium` |
| 3107 | Runeforged Monastic Garb | `body_armours_dex_int` | yes | `assets/item-bases/3107.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt10Verisium` |
| 3108 | Runeforged Torment Jacket | `body_armours_dex_int` | yes | `assets/item-bases/3108.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt11Verisium` |
| 3109 | Runeforged Devout Garb | `body_armours_dex_int` | yes | `assets/item-bases/3109.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt12Verisium` |
| 3110 | Runeforged Assassin Garb | `body_armours_dex_int` | yes | `assets/item-bases/3110.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt13Verisium` |
| 3111 | Runeforged Garment | `body_armours_str_dex_int` | yes | `assets/item-bases/3111.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDexIntBaseVerisium` |
| 3112 | Runeforged Grand Regalia | `body_armours_str_dex_int` | yes | `assets/item-bases/3112.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDexInt1Verisium` |
| 3113 | Runeforged Sacrificial Regalia | `body_armours_str_dex_int` | yes | `assets/item-bases/3113.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDexInt2Verisium1` |
| 3114 | Runeforged Sacrificial Regalia | `body_armours_str_dex_int` | yes | `assets/item-bases/3114.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDexInt2Verisium2` |
| 3115 | Runeforged Sacrificial Regalia | `body_armours_str_dex_int` | yes | `assets/item-bases/3115.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDexInt2Verisium3` |
| 3116 | Runeforged Sacrificial Regalia | `body_armours_str_dex_int` | yes | `assets/item-bases/3116.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDexInt2Verisium4` |
| 3117 | Runeforged Elegant Plate | `body_armours_str` | yes | `assets/item-bases/3117.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr6CruelVerisium` |
| 3118 | Runeforged Heavy Plate | `body_armours_str` | yes | `assets/item-bases/3118.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr7CruelVerisium` |
| 3119 | Runeforged Stone Cuirass | `body_armours_str` | yes | `assets/item-bases/3119.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr8CruelVerisium` |
| 3120 | Runeforged Layered Vest | `body_armours_dex` | yes | `assets/item-bases/3120.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex6CruelVerisium` |
| 3121 | Runeforged Runner Vest | `body_armours_dex` | yes | `assets/item-bases/3121.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex7CruelVerisium` |
| 3122 | Runeforged Lizardscale Coat | `body_armours_dex` | yes | `assets/item-bases/3122.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex8CruelVerisium` |
| 3123 | Runeforged River Raiment | `body_armours_int` | yes | `assets/item-bases/3123.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt6CruelVerisium` |
| 3124 | Runeforged Adherent's Raiment | `body_armours_int` | yes | `assets/item-bases/3124.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt7CruelVerisium` |
| 3125 | Runeforged Ceremonial Robe | `body_armours_int` | yes | `assets/item-bases/3125.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt8CruelVerisium` |
| 3126 | Runeforged Mantled Mail | `body_armours_str_dex` | yes | `assets/item-bases/3126.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex4CruelVerisium` |
| 3127 | Runeforged Trailblazer Armour | `body_armours_str_dex` | yes | `assets/item-bases/3127.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex5CruelVerisium` |
| 3128 | Runeforged Golden Mail | `body_armours_str_dex` | yes | `assets/item-bases/3128.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex6CruelVerisium` |
| 3129 | Runeforged Occultist Mantle | `body_armours_str_int` | yes | `assets/item-bases/3129.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt4CruelVerisium` |
| 3130 | Runeforged Plated Vestments | `body_armours_str_int` | yes | `assets/item-bases/3130.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt5CruelVerisium` |
| 3131 | Runeforged Heartcarver Mantle | `body_armours_str_int` | yes | `assets/item-bases/3131.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt6CruelVerisium` |
| 3132 | Runeforged Itinerant Jacket | `body_armours_dex_int` | yes | `assets/item-bases/3132.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt4CruelVerisium` |
| 3133 | Runeforged Hatungo Garb | `body_armours_dex_int` | yes | `assets/item-bases/3133.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt5CruelVerisium` |
| 3134 | Runeforged Hawker's Jacket | `body_armours_dex_int` | yes | `assets/item-bases/3134.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt6CruelVerisium` |
| 3135 | Runeforged Primal Markings | `body_armours_dex_int` | yes | `assets/item-bases/3135.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexIntUnique1Verisium` |
| 3136 | Runeforged Rusted Greathelm | `helmets_str` | yes | `assets/item-bases/3136.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr1Verisium` |
| 3137 | Runeforged Soldier Greathelm | `helmets_str` | yes | `assets/item-bases/3137.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr2Verisium` |
| 3138 | Runeforged Wrapped Greathelm | `helmets_str` | yes | `assets/item-bases/3138.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr3Verisium` |
| 3139 | Runeforged Spired Greathelm | `helmets_str` | yes | `assets/item-bases/3139.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr4Verisium` |
| 3140 | Runeforged Elite Greathelm | `helmets_str` | yes | `assets/item-bases/3140.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr5Verisium` |
| 3141 | Runeforged Warrior Greathelm | `helmets_str` | yes | `assets/item-bases/3141.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr6Verisium` |
| 3142 | Runeforged Commander Greathelm | `helmets_str` | yes | `assets/item-bases/3142.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr7Verisium` |
| 3143 | Runeforged Fierce Greathelm | `helmets_str` | yes | `assets/item-bases/3143.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr8Verisium` |
| 3144 | Runeforged Sentinel Greathelm | `helmets_str` | yes | `assets/item-bases/3144.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr9Verisium` |
| 3145 | Runeforged Goliath Greathelm | `helmets_str` | yes | `assets/item-bases/3145.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr10Verisium` |
| 3146 | Runeforged Guardian Greathelm | `helmets_str` | yes | `assets/item-bases/3146.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr11Verisium` |
| 3147 | Runeforged Shabby Hood | `helmets_dex` | yes | `assets/item-bases/3147.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex1Verisium` |
| 3148 | Runeforged Felt Cap | `helmets_dex` | yes | `assets/item-bases/3148.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex2Verisium` |
| 3149 | Runeforged Lace Hood | `helmets_dex` | yes | `assets/item-bases/3149.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex3Verisium` |
| 3150 | Runeforged Swathed Cap | `helmets_dex` | yes | `assets/item-bases/3150.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex4Verisium` |
| 3151 | Runeforged Hunter Hood | `helmets_dex` | yes | `assets/item-bases/3151.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex5Verisium` |
| 3152 | Runeforged Viper Cap | `helmets_dex` | yes | `assets/item-bases/3152.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex6Verisium` |
| 3153 | Runeforged Corsair Cap | `helmets_dex` | yes | `assets/item-bases/3153.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex7Verisium` |
| 3154 | Runeforged Leatherbound Hood | `helmets_dex` | yes | `assets/item-bases/3154.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex8Verisium` |
| 3155 | Runeforged Velvet Cap | `helmets_dex` | yes | `assets/item-bases/3155.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex9Verisium` |
| 3156 | Runeforged Covert Hood | `helmets_dex` | yes | `assets/item-bases/3156.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex10Verisium` |
| 3157 | Runeforged Armoured Cap | `helmets_dex` | yes | `assets/item-bases/3157.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex11Verisium` |
| 3158 | Runeforged Twig Circlet | `helmets_int` | yes | `assets/item-bases/3158.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt1Verisium` |
| 3159 | Runeforged Wicker Tiara | `helmets_int` | yes | `assets/item-bases/3159.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt2Verisium` |
| 3160 | Runeforged Beaded Circlet | `helmets_int` | yes | `assets/item-bases/3160.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt3Verisium` |
| 3161 | Runeforged Chain Tiara | `helmets_int` | yes | `assets/item-bases/3161.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt4Verisium` |
| 3162 | Runeforged Feathered Tiara | `helmets_int` | yes | `assets/item-bases/3162.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt5Verisium` |
| 3163 | Runeforged Gold Circlet | `helmets_int` | yes | `assets/item-bases/3163.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt6Verisium` |
| 3164 | Runeforged Vermeil Circlet | `helmets_int` | yes | `assets/item-bases/3164.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt7Verisium` |
| 3165 | Runeforged Jade Tiara | `helmets_int` | yes | `assets/item-bases/3165.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt8Verisium` |
| 3166 | Runeforged Noble Circlet | `helmets_int` | yes | `assets/item-bases/3166.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt9Verisium` |
| 3167 | Runeforged Twilight Tiara | `helmets_int` | yes | `assets/item-bases/3167.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt10Verisium` |
| 3168 | Runeforged Magus Tiara | `helmets_int` | yes | `assets/item-bases/3168.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt11Verisium` |
| 3169 | Runeforged Brimmed Helm | `helmets_str_dex` | yes | `assets/item-bases/3169.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex1Verisium` |
| 3170 | Runeforged Guarded Helm | `helmets_str_dex` | yes | `assets/item-bases/3170.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex2Verisium` |
| 3171 | Runeforged Visored Helm | `helmets_str_dex` | yes | `assets/item-bases/3171.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex3Verisium` |
| 3172 | Runeforged Cowled Helm | `helmets_str_dex` | yes | `assets/item-bases/3172.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex4Verisium` |
| 3173 | Runeforged Shielded Helm | `helmets_str_dex` | yes | `assets/item-bases/3173.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex5Verisium` |
| 3174 | Runeforged Closed Helm | `helmets_str_dex` | yes | `assets/item-bases/3174.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex6Verisium` |
| 3175 | Runeforged Decorated Helm | `helmets_str_dex` | yes | `assets/item-bases/3175.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex7Verisium` |
| 3176 | Runeforged Gallant Helm | `helmets_str_dex` | yes | `assets/item-bases/3176.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex8Verisium` |
| 3177 | Runeforged Iron Crown | `helmets_str_int` | yes | `assets/item-bases/3177.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt1Verisium` |
| 3178 | Runeforged Horned Crown | `helmets_str_int` | yes | `assets/item-bases/3178.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt2Verisium` |
| 3179 | Runeforged Cultist Crown | `helmets_str_int` | yes | `assets/item-bases/3179.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt3Verisium` |
| 3180 | Runeforged Martyr Crown | `helmets_str_int` | yes | `assets/item-bases/3180.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt4Verisium` |
| 3181 | Runeforged Heavy Crown | `helmets_str_int` | yes | `assets/item-bases/3181.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt5Verisium` |
| 3182 | Runeforged Spiritbone Crown | `helmets_str_int` | yes | `assets/item-bases/3182.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt6Verisium` |
| 3183 | Runeforged Lavish Crown | `helmets_str_int` | yes | `assets/item-bases/3183.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt7Verisium` |
| 3184 | Runeforged Archon Crown | `helmets_str_int` | yes | `assets/item-bases/3184.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt8Verisium` |
| 3185 | Runeforged Hewn Mask | `helmets_dex_int` | yes | `assets/item-bases/3185.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt1Verisium` |
| 3186 | Runeforged Face Mask | `helmets_dex_int` | yes | `assets/item-bases/3186.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt2Verisium` |
| 3187 | Runeforged Hooded Mask | `helmets_dex_int` | yes | `assets/item-bases/3187.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt3Verisium` |
| 3188 | Runeforged Veiled Mask | `helmets_dex_int` | yes | `assets/item-bases/3188.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt4Verisium` |
| 3189 | Runeforged Tribal Mask | `helmets_dex_int` | yes | `assets/item-bases/3189.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt5Verisium` |
| 3190 | Runeforged Solid Mask | `helmets_dex_int` | yes | `assets/item-bases/3190.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt6Verisium` |
| 3191 | Runeforged Shaded Mask | `helmets_dex_int` | yes | `assets/item-bases/3191.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt7Verisium` |
| 3192 | Runeforged Death Mask | `helmets_dex_int` | yes | `assets/item-bases/3192.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt8Verisium` |
| 3193 | Runeforged Elegant Greathelm | `helmets_str` | yes | `assets/item-bases/3193.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr4CruelVerisium` |
| 3194 | Runeforged Noble Greathelm | `helmets_str` | yes | `assets/item-bases/3194.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr5CruelVerisium` |
| 3195 | Runeforged Wrapped Cap | `helmets_dex` | yes | `assets/item-bases/3195.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex4CruelVerisium` |
| 3196 | Runeforged Deerstalker Hood | `helmets_dex` | yes | `assets/item-bases/3196.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex5CruelVerisium` |
| 3197 | Runeforged Sandsworn Tiara | `helmets_int` | yes | `assets/item-bases/3197.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt4CruelVerisium` |
| 3198 | Runeforged Jungle Tiara | `helmets_int` | yes | `assets/item-bases/3198.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt5CruelVerisium` |
| 3199 | Runeforged Cabalist Helm | `helmets_str_dex` | yes | `assets/item-bases/3199.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex4CruelVerisium` |
| 3200 | Runeforged Gladiatorial Helm | `helmets_str_dex` | yes | `assets/item-bases/3200.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex5CruelVerisium` |
| 3201 | Runeforged Hallowed Crown | `helmets_str_int` | yes | `assets/item-bases/3201.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt4CruelVerisium` |
| 3202 | Runeforged Inquisitor Crown | `helmets_str_int` | yes | `assets/item-bases/3202.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt5CruelVerisium` |
| 3203 | Runeforged Pariah Mask | `helmets_dex_int` | yes | `assets/item-bases/3203.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt4CruelVerisium` |
| 3204 | Runeforged Avian Mask | `helmets_dex_int` | yes | `assets/item-bases/3204.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt5CruelVerisium` |
| 3205 | Runeforged Grand Visage | `helmets_str_dex_int` | yes | `assets/item-bases/3205.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDexInt1Verisium` |
| 3206 | Runeforged Stocky Mitts | `gloves_str` | yes | `assets/item-bases/3206.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr1Verisium` |
| 3207 | Runeforged Riveted Mitts | `gloves_str` | yes | `assets/item-bases/3207.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr2Verisium` |
| 3208 | Runeforged Tempered Mitts | `gloves_str` | yes | `assets/item-bases/3208.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr3Verisium` |
| 3209 | Runeforged Bolstered Mitts | `gloves_str` | yes | `assets/item-bases/3209.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr4Verisium` |
| 3210 | Runeforged Moulded Mitts | `gloves_str` | yes | `assets/item-bases/3210.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr5Verisium` |
| 3211 | Runeforged Detailed Mitts | `gloves_str` | yes | `assets/item-bases/3211.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr6Verisium` |
| 3212 | Runeforged Titan Mitts | `gloves_str` | yes | `assets/item-bases/3212.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr7Verisium` |
| 3213 | Runeforged Grand Mitts | `gloves_str` | yes | `assets/item-bases/3213.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr8Verisium` |
| 3214 | Runeforged Suede Bracers | `gloves_dex` | yes | `assets/item-bases/3214.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex1Verisium` |
| 3215 | Runeforged Firm Bracers | `gloves_dex` | yes | `assets/item-bases/3215.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex2Verisium` |
| 3216 | Runeforged Bound Bracers | `gloves_dex` | yes | `assets/item-bases/3216.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex3Verisium` |
| 3217 | Runeforged Sectioned Bracers | `gloves_dex` | yes | `assets/item-bases/3217.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex4Verisium` |
| 3218 | Runeforged Spined Bracers | `gloves_dex` | yes | `assets/item-bases/3218.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex5Verisium` |
| 3219 | Runeforged Fine Bracers | `gloves_dex` | yes | `assets/item-bases/3219.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex6Verisium` |
| 3220 | Runeforged Hardened Bracers | `gloves_dex` | yes | `assets/item-bases/3220.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex7Verisium` |
| 3221 | Runeforged Engraved Bracers | `gloves_dex` | yes | `assets/item-bases/3221.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex8Verisium` |
| 3222 | Runeforged Torn Gloves | `gloves_int` | yes | `assets/item-bases/3222.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt1Verisium` |
| 3223 | Runeforged Sombre Gloves | `gloves_int` | yes | `assets/item-bases/3223.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt2Verisium` |
| 3224 | Runeforged Stitched Gloves | `gloves_int` | yes | `assets/item-bases/3224.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt3Verisium` |
| 3225 | Runeforged Jewelled Gloves | `gloves_int` | yes | `assets/item-bases/3225.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt4Verisium` |
| 3226 | Runeforged Intricate Gloves | `gloves_int` | yes | `assets/item-bases/3226.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt5Verisium` |
| 3227 | Runeforged Pauascale Gloves | `gloves_int` | yes | `assets/item-bases/3227.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt6Verisium` |
| 3228 | Runeforged Embroidered Gloves | `gloves_int` | yes | `assets/item-bases/3228.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt7Verisium` |
| 3229 | Runeforged Adorned Gloves | `gloves_int` | yes | `assets/item-bases/3229.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt8Verisium` |
| 3230 | Runeforged Ringmail Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/3230.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex1Verisium` |
| 3231 | Runeforged Layered Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/3231.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex2Verisium` |
| 3232 | Runeforged Doubled Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/3232.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex3Verisium` |
| 3233 | Runeforged Plate Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/3233.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex4Verisium` |
| 3234 | Runeforged Burnished Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/3234.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex5Verisium` |
| 3235 | Runeforged Ornate Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/3235.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex6Verisium` |
| 3236 | Runeforged Rope Cuffs | `gloves_str_int` | yes | `assets/item-bases/3236.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt1Verisium` |
| 3237 | Runeforged Aged Cuffs | `gloves_str_int` | yes | `assets/item-bases/3237.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt2Verisium` |
| 3238 | Runeforged Goldcast Cuffs | `gloves_str_int` | yes | `assets/item-bases/3238.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt3Verisium` |
| 3239 | Runeforged Kalguuran Cuffs | `gloves_str_int` | yes | `assets/item-bases/3239.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt4Verisium` |
| 3240 | Runeforged Righteous Cuffs | `gloves_str_int` | yes | `assets/item-bases/3240.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt5Verisium` |
| 3241 | Runeforged Signet Cuffs | `gloves_str_int` | yes | `assets/item-bases/3241.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt6Verisium` |
| 3242 | Runeforged Gauze Wraps | `gloves_dex_int` | yes | `assets/item-bases/3242.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt1Verisium` |
| 3243 | Runeforged Linen Wraps | `gloves_dex_int` | yes | `assets/item-bases/3243.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt2Verisium` |
| 3244 | Runeforged Spiral Wraps | `gloves_dex_int` | yes | `assets/item-bases/3244.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt3Verisium` |
| 3245 | Runeforged Buckled Wraps | `gloves_dex_int` | yes | `assets/item-bases/3245.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt4Verisium` |
| 3246 | Runeforged Furtive Wraps | `gloves_dex_int` | yes | `assets/item-bases/3246.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt5Verisium` |
| 3247 | Runeforged Utility Wraps | `gloves_dex_int` | yes | `assets/item-bases/3247.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt6Verisium` |
| 3248 | Runeforged Ancient Mitts | `gloves_str` | yes | `assets/item-bases/3248.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr4CruelVerisium` |
| 3249 | Runeforged Feathered Mitts | `gloves_str` | yes | `assets/item-bases/3249.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr5CruelVerisium` |
| 3250 | Runeforged Refined Bracers | `gloves_dex` | yes | `assets/item-bases/3250.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex4CruelVerisium` |
| 3251 | Runeforged Spiked Bracers | `gloves_dex` | yes | `assets/item-bases/3251.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex5CruelVerisium` |
| 3252 | Runeforged Baroque Gloves | `gloves_int` | yes | `assets/item-bases/3252.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt4CruelVerisium` |
| 3253 | Runeforged Gold Gloves | `gloves_int` | yes | `assets/item-bases/3253.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt5CruelVerisium` |
| 3254 | Runeforged Zealot Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/3254.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex3CruelVerisium` |
| 3255 | Runeforged Ornate Cuffs | `gloves_str_int` | yes | `assets/item-bases/3255.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt3CruelVerisium` |
| 3256 | Runeforged Adorned Wraps | `gloves_dex_int` | yes | `assets/item-bases/3256.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt3CruelVerisium` |
| 3257 | Runeforged Grand Manchettes | `gloves_str_dex_int` | yes | `assets/item-bases/3257.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDexInt1Verisium` |
| 3258 | Runeforged Rough Greaves | `boots_str` | yes | `assets/item-bases/3258.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr1Verisium` |
| 3259 | Runeforged Iron Greaves | `boots_str` | yes | `assets/item-bases/3259.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr2Verisium` |
| 3260 | Runeforged Bronze Greaves | `boots_str` | yes | `assets/item-bases/3260.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr3Verisium` |
| 3261 | Runeforged Trimmed Greaves | `boots_str` | yes | `assets/item-bases/3261.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr4Verisium` |
| 3262 | Runeforged Stone Greaves | `boots_str` | yes | `assets/item-bases/3262.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr5Verisium` |
| 3263 | Runeforged Reefsteel Greaves | `boots_str` | yes | `assets/item-bases/3263.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr6Verisium` |
| 3264 | Runeforged Monument Greaves | `boots_str` | yes | `assets/item-bases/3264.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr7Verisium` |
| 3265 | Runeforged Totemic Greaves | `boots_str` | yes | `assets/item-bases/3265.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr8Verisium` |
| 3266 | Runeforged Rawhide Boots | `boots_dex` | yes | `assets/item-bases/3266.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex1Verisium` |
| 3267 | Runeforged Laced Boots | `boots_dex` | yes | `assets/item-bases/3267.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex2Verisium` |
| 3268 | Runeforged Embossed Boots | `boots_dex` | yes | `assets/item-bases/3268.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex3Verisium` |
| 3269 | Runeforged Steeltoe Boots | `boots_dex` | yes | `assets/item-bases/3269.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex4Verisium` |
| 3270 | Runeforged Lizardscale Boots | `boots_dex` | yes | `assets/item-bases/3270.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex5Verisium` |
| 3271 | Runeforged Flared Boots | `boots_dex` | yes | `assets/item-bases/3271.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex6Verisium` |
| 3272 | Runeforged Leatherplate Boots | `boots_dex` | yes | `assets/item-bases/3272.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex7Verisium` |
| 3273 | Runeforged Embroidered Boots | `boots_dex` | yes | `assets/item-bases/3273.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex8Verisium` |
| 3274 | Runeforged Straw Sandals | `boots_int` | yes | `assets/item-bases/3274.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt1Verisium` |
| 3275 | Runeforged Wrapped Sandals | `boots_int` | yes | `assets/item-bases/3275.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt2Verisium` |
| 3276 | Runeforged Lattice Sandals | `boots_int` | yes | `assets/item-bases/3276.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt3Verisium` |
| 3277 | Runeforged Silk Slippers | `boots_int` | yes | `assets/item-bases/3277.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt4Verisium` |
| 3278 | Runeforged Feathered Sandals | `boots_int` | yes | `assets/item-bases/3278.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt5Verisium` |
| 3279 | Runeforged Flax Sandals | `boots_int` | yes | `assets/item-bases/3279.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt6Verisium` |
| 3280 | Runeforged Studded Sandals | `boots_int` | yes | `assets/item-bases/3280.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt7Verisium` |
| 3281 | Runeforged Elaborate Sandals | `boots_int` | yes | `assets/item-bases/3281.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt8Verisium` |
| 3282 | Runeforged Mail Sabatons | `boots_str_dex` | yes | `assets/item-bases/3282.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex1Verisium` |
| 3283 | Runeforged Braced Sabatons | `boots_str_dex` | yes | `assets/item-bases/3283.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex2Verisium` |
| 3284 | Runeforged Stacked Sabatons | `boots_str_dex` | yes | `assets/item-bases/3284.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex3Verisium` |
| 3285 | Runeforged Covered Sabatons | `boots_str_dex` | yes | `assets/item-bases/3285.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex4Verisium` |
| 3286 | Runeforged Flexile Sabatons | `boots_str_dex` | yes | `assets/item-bases/3286.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex5Verisium` |
| 3287 | Runeforged Bold Sabatons | `boots_str_dex` | yes | `assets/item-bases/3287.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex6Verisium` |
| 3288 | Runeforged Padded Leggings | `boots_str_int` | yes | `assets/item-bases/3288.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt1Verisium` |
| 3289 | Runeforged Secured Leggings | `boots_str_int` | yes | `assets/item-bases/3289.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt2Verisium` |
| 3290 | Runeforged Pelt Leggings | `boots_str_int` | yes | `assets/item-bases/3290.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt3Verisium` |
| 3291 | Runeforged Weaver Leggings | `boots_str_int` | yes | `assets/item-bases/3291.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt4Verisium` |
| 3292 | Runeforged Gilt Leggings | `boots_str_int` | yes | `assets/item-bases/3292.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt5Verisium` |
| 3293 | Runeforged Pious Leggings | `boots_str_int` | yes | `assets/item-bases/3293.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt6Verisium` |
| 3294 | Runeforged Frayed Shoes | `boots_dex_int` | yes | `assets/item-bases/3294.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt1Verisium` |
| 3295 | Runeforged Threaded Shoes | `boots_dex_int` | yes | `assets/item-bases/3295.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt2Verisium` |
| 3296 | Runeforged Hunting Shoes | `boots_dex_int` | yes | `assets/item-bases/3296.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt3Verisium` |
| 3297 | Runeforged Steelpoint Shoes | `boots_dex_int` | yes | `assets/item-bases/3297.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt4Verisium` |
| 3298 | Runeforged Velour Shoes | `boots_dex_int` | yes | `assets/item-bases/3298.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt5Verisium` |
| 3299 | Runeforged Bladed Shoes | `boots_dex_int` | yes | `assets/item-bases/3299.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt6Verisium` |
| 3300 | Runeforged Elegant Greaves | `boots_str` | yes | `assets/item-bases/3300.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr4CruelVerisium` |
| 3301 | Runeforged Carved Greaves | `boots_str` | yes | `assets/item-bases/3301.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr5CruelVerisium` |
| 3302 | Runeforged Studded Boots | `boots_dex` | yes | `assets/item-bases/3302.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex4CruelVerisium` |
| 3303 | Runeforged Serpentscale Boots | `boots_dex` | yes | `assets/item-bases/3303.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex5CruelVerisium` |
| 3304 | Runeforged Elegant Slippers | `boots_int` | yes | `assets/item-bases/3304.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt4CruelVerisium` |
| 3305 | Runeforged Dunerunner Sandals | `boots_int` | yes | `assets/item-bases/3305.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt5CruelVerisium` |
| 3306 | Runeforged Bastion Sabatons | `boots_str_dex` | yes | `assets/item-bases/3306.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex3CruelVerisium` |
| 3307 | Runeforged Shamanistic Leggings | `boots_str_int` | yes | `assets/item-bases/3307.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt3CruelVerisium` |
| 3308 | Runeforged Treerunner Shoes | `boots_dex_int` | yes | `assets/item-bases/3308.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt3CruelVerisium` |
| 3309 | Runeforged Grand Cuisses | `boots_str_dex_int` | yes | `assets/item-bases/3309.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDexInt1Verisium` |
| 3310 | Runeforged Splintered Tower Shield | `shields_str` | yes | `assets/item-bases/3310.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr1Verisium` |
| 3311 | Runeforged Painted Tower Shield | `shields_str` | yes | `assets/item-bases/3311.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr2Verisium` |
| 3312 | Runeforged Braced Tower Shield | `shields_str` | yes | `assets/item-bases/3312.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr3Verisium` |
| 3313 | Runeforged Barricade Tower Shield | `shields_str` | yes | `assets/item-bases/3313.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr4Verisium` |
| 3314 | Runeforged Effigial Tower Shield | `shields_str` | yes | `assets/item-bases/3314.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr5Verisium` |
| 3315 | Runeforged Rampart Tower Shield | `shields_str` | yes | `assets/item-bases/3315.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr6Verisium` |
| 3316 | Runeforged Heraldric Tower Shield | `shields_str` | yes | `assets/item-bases/3316.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr7Verisium` |
| 3317 | Runeforged Stone Tower Shield | `shields_str` | yes | `assets/item-bases/3317.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr8Verisium` |
| 3318 | Runeforged Crucible Tower Shield | `shields_str` | yes | `assets/item-bases/3318.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr9Verisium` |
| 3319 | Runeforged Ancestor Tower Shield | `shields_str` | yes | `assets/item-bases/3319.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr10Verisium` |
| 3320 | Runeforged Phalanx Tower Shield | `shields_str` | yes | `assets/item-bases/3320.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr11Verisium` |
| 3321 | Runeforged Defiant Tower Shield | `shields_str` | yes | `assets/item-bases/3321.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr12Verisium` |
| 3322 | Runeforged Blacksteel Tower Shield | `shields_str` | yes | `assets/item-bases/3322.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr13Verisium` |
| 3323 | Runeforged Hardwood Targe | `shields_str_dex` | yes | `assets/item-bases/3323.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex1Verisium` |
| 3324 | Runeforged Pelage Targe | `shields_str_dex` | yes | `assets/item-bases/3324.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex2Verisium` |
| 3325 | Runeforged Studded Targe | `shields_str_dex` | yes | `assets/item-bases/3325.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex3Verisium` |
| 3326 | Runeforged Crescent Targe | `shields_str_dex` | yes | `assets/item-bases/3326.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex4Verisium` |
| 3327 | Runeforged Chiseled Targe | `shields_str_dex` | yes | `assets/item-bases/3327.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex5Verisium` |
| 3328 | Runeforged Feathered Targe | `shields_str_dex` | yes | `assets/item-bases/3328.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex6Verisium` |
| 3329 | Runeforged Stratified Targe | `shields_str_dex` | yes | `assets/item-bases/3329.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex7Verisium` |
| 3330 | Runeforged Carved Targe | `shields_str_dex` | yes | `assets/item-bases/3330.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex8Verisium` |
| 3331 | Runeforged Mosaic Targe | `shields_str_dex` | yes | `assets/item-bases/3331.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex9Verisium` |
| 3332 | Runeforged Aureate Targe | `shields_str_dex` | yes | `assets/item-bases/3332.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex10Verisium` |
| 3333 | Runeforged Grand Targe | `shields_str_dex` | yes | `assets/item-bases/3333.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex11Verisium` |
| 3335 | Runeforged Blazon Crest Shield | `shields_str_int` | yes | `assets/item-bases/3335.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt1Verisium` |
| 3336 | Runeforged Sigil Crest Shield | `shields_str_int` | yes | `assets/item-bases/3336.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt2Verisium` |
| 3337 | Runeforged Emblem Crest Shield | `shields_str_int` | yes | `assets/item-bases/3337.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt3Verisium` |
| 3338 | Runeforged Jingling Crest Shield | `shields_str_int` | yes | `assets/item-bases/3338.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt4Verisium` |
| 3339 | Runeforged Sectarian Crest Shield | `shields_str_int` | yes | `assets/item-bases/3339.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt5Verisium` |
| 3340 | Runeforged Omen Crest Shield | `shields_str_int` | yes | `assets/item-bases/3340.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt6Verisium` |
| 3341 | Runeforged Wayward Crest Shield | `shields_str_int` | yes | `assets/item-bases/3341.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt7Verisium` |
| 3342 | Runeforged Seer Crest Shield | `shields_str_int` | yes | `assets/item-bases/3342.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt8Verisium` |
| 3343 | Runeforged Stoic Crest Shield | `shields_str_int` | yes | `assets/item-bases/3343.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt9Verisium` |
| 3344 | Runeforged Empyreal Crest Shield | `shields_str_int` | yes | `assets/item-bases/3344.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt10Verisium` |
| 3345 | Runeforged Deified Crest Shield | `shields_str_int` | yes | `assets/item-bases/3345.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt11Verisium` |
| 3346 | Runeforged Leather Buckler | `bucklers` | yes | `assets/item-bases/3346.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex1Verisium` |
| 3347 | Runeforged Wooden Buckler | `bucklers` | yes | `assets/item-bases/3347.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex2Verisium` |
| 3348 | Runeforged Plated Buckler | `bucklers` | yes | `assets/item-bases/3348.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex3Verisium` |
| 3349 | Runeforged Iron Buckler | `bucklers` | yes | `assets/item-bases/3349.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex4Verisium` |
| 3350 | Runeforged Ridged Buckler | `bucklers` | yes | `assets/item-bases/3350.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex5Verisium` |
| 3351 | Runeforged Spiked Buckler | `bucklers` | yes | `assets/item-bases/3351.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex6Verisium` |
| 3352 | Runeforged Ringed Buckler | `bucklers` | yes | `assets/item-bases/3352.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex7Verisium` |
| 3353 | Runeforged Edged Buckler | `bucklers` | yes | `assets/item-bases/3353.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex8Verisium` |
| 3354 | Runeforged Laminate Buckler | `bucklers` | yes | `assets/item-bases/3354.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex9Verisium` |
| 3355 | Runeforged Pearl Buckler | `bucklers` | yes | `assets/item-bases/3355.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex10Verisium` |
| 3356 | Runeforged Ornate Buckler | `bucklers` | yes | `assets/item-bases/3356.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex11Verisium` |
| 3357 | Runeforged Array Buckler | `bucklers` | yes | `assets/item-bases/3357.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex12Verisium` |
| 3358 | Runeforged Aegis Buckler | `bucklers` | yes | `assets/item-bases/3358.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex13Verisium` |
| 3359 | Runeforged Bulwark Tower Shield | `shields_str` | yes | `assets/item-bases/3359.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr6CruelVerisium` |
| 3360 | Runeforged Noble Tower Shield | `shields_str` | yes | `assets/item-bases/3360.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr7CruelVerisium` |
| 3361 | Runeforged Goldworked Tower Shield | `shields_str` | yes | `assets/item-bases/3361.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr8CruelVerisium` |
| 3362 | Runeforged Polished Targe | `shields_str_dex` | yes | `assets/item-bases/3362.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex4CruelVerisium` |
| 3363 | Runeforged Stone Targe | `shields_str_dex` | yes | `assets/item-bases/3363.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex5CruelVerisium` |
| 3364 | Runeforged Avian Targe | `shields_str_dex` | yes | `assets/item-bases/3364.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex6CruelVerisium` |
| 3365 | Runeforged Dekharan Crest Shield | `shields_str_int` | yes | `assets/item-bases/3365.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt4CruelVerisium` |
| 3366 | Runeforged Quartered Crest Shield | `shields_str_int` | yes | `assets/item-bases/3366.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt5CruelVerisium` |
| 3367 | Runeforged Glowering Crest Shield | `shields_str_int` | yes | `assets/item-bases/3367.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt6CruelVerisium` |
| 3368 | Runeforged Spikeward Buckler | `bucklers` | yes | `assets/item-bases/3368.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex6CruelVerisium` |
| 3369 | Runeforged Jingling Buckler | `bucklers` | yes | `assets/item-bases/3369.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex7CruelVerisium` |
| 3370 | Runeforged Bladeguard Buckler | `bucklers` | yes | `assets/item-bases/3370.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex8CruelVerisium` |
| 3371 | Runeforged Twig Focus | `foci` | yes | `assets/item-bases/3371.png` | missing | `Metadata/Items/Armours/Focii/FourFocus1Verisium` |
| 3372 | Runeforged Woven Focus | `foci` | yes | `assets/item-bases/3372.png` | missing | `Metadata/Items/Armours/Focii/FourFocus2Verisium` |
| 3373 | Runeforged Antler Focus | `foci` | yes | `assets/item-bases/3373.png` | missing | `Metadata/Items/Armours/Focii/FourFocus3Verisium` |
| 3374 | Runeforged Engraved Focus | `foci` | yes | `assets/item-bases/3374.png` | missing | `Metadata/Items/Armours/Focii/FourFocus4Verisium` |
| 3375 | Runeforged Tonal Focus | `foci` | yes | `assets/item-bases/3375.png` | missing | `Metadata/Items/Armours/Focii/FourFocus5Verisium` |
| 3376 | Runeforged Crystal Focus | `foci` | yes | `assets/item-bases/3376.png` | missing | `Metadata/Items/Armours/Focii/FourFocus6Verisium` |
| 3377 | Runeforged Voodoo Focus | `foci` | yes | `assets/item-bases/3377.png` | missing | `Metadata/Items/Armours/Focii/FourFocus7Verisium` |
| 3378 | Runeforged Plumed Focus | `foci` | yes | `assets/item-bases/3378.png` | missing | `Metadata/Items/Armours/Focii/FourFocus8Verisium` |
| 3379 | Runeforged Runed Focus | `foci` | yes | `assets/item-bases/3379.png` | missing | `Metadata/Items/Armours/Focii/FourFocus9Verisium` |
| 3380 | Runeforged Whorl Focus | `foci` | yes | `assets/item-bases/3380.png` | missing | `Metadata/Items/Armours/Focii/FourFocus10Verisium` |
| 3381 | Runeforged Elegant Focus | `foci` | yes | `assets/item-bases/3381.png` | missing | `Metadata/Items/Armours/Focii/FourFocus11Verisium` |
| 3382 | Runeforged Attuned Focus | `foci` | yes | `assets/item-bases/3382.png` | missing | `Metadata/Items/Armours/Focii/FourFocus12Verisium` |
| 3383 | Runeforged Magus Focus | `foci` | yes | `assets/item-bases/3383.png` | missing | `Metadata/Items/Armours/Focii/FourFocus13Verisium` |
| 3384 | Runeforged Arrayed Focus | `foci` | yes | `assets/item-bases/3384.png` | missing | `Metadata/Items/Armours/Focii/FourFocus6CruelVerisium` |
| 3385 | Runeforged Cultist Focus | `foci` | yes | `assets/item-bases/3385.png` | missing | `Metadata/Items/Armours/Focii/FourFocus7CruelVerisium` |
| 3386 | Runeforged Hallowed Focus | `foci` | yes | `assets/item-bases/3386.png` | missing | `Metadata/Items/Armours/Focii/FourFocus8CruelVerisium` |
| 3387 | Runeforged Soldier Cuirass | `body_armours_str` | yes | `assets/item-bases/3387.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr3EndgameVerisium` |
| 3388 | Runeforged Ornate Plate | `body_armours_str` | yes | `assets/item-bases/3388.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr6EndgameVerisium` |
| 3389 | Runeforged Utzaal Cuirass | `body_armours_str` | yes | `assets/item-bases/3389.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr8EndgameVerisium` |
| 3390 | Runeforged Warlord Cuirass | `body_armours_str` | yes | `assets/item-bases/3390.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr10EndgameVerisium` |
| 3391 | Runeforged Swiftstalker Coat | `body_armours_dex` | yes | `assets/item-bases/3391.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex3EndgameVerisium` |
| 3392 | Runeforged Slipstrike Vest | `body_armours_dex` | yes | `assets/item-bases/3392.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex6EndgameVerisium` |
| 3393 | Runeforged Wyrmscale Coat | `body_armours_dex` | yes | `assets/item-bases/3393.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex8EndgameVerisium` |
| 3394 | Runeforged Corsair Coat | `body_armours_dex` | yes | `assets/item-bases/3394.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex10EndgameVerisium` |
| 3395 | Runeforged Vile Robe | `body_armours_int` | yes | `assets/item-bases/3395.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt3EndgameVerisium` |
| 3396 | Runeforged Flowing Raiment | `body_armours_int` | yes | `assets/item-bases/3396.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt6EndgameVerisium` |
| 3397 | Runeforged Sacramental Robe | `body_armours_int` | yes | `assets/item-bases/3397.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt8EndgameVerisium` |
| 3398 | Runeforged Feathered Raiment | `body_armours_int` | yes | `assets/item-bases/3398.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt10EndgameVerisium` |
| 3399 | Runeforged Dastard Armour | `body_armours_str_dex` | yes | `assets/item-bases/3399.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex2EndgameVerisium` |
| 3400 | Runeforged Shrouded Mail | `body_armours_str_dex` | yes | `assets/item-bases/3400.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex4aEndgameVerisium` |
| 3401 | Runeforged Shrouded Mail | `body_armours_str_dex` | yes | `assets/item-bases/3401.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex4bEndgameVerisium` |
| 3402 | Runeforged Shrouded Mail | `body_armours_str_dex` | yes | `assets/item-bases/3402.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex4cEndgameVerisium` |
| 3403 | Runeforged Death Mail | `body_armours_str_dex` | yes | `assets/item-bases/3403.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex6EndgameVerisium` |
| 3404 | Runeforged Thane Mail | `body_armours_str_dex` | yes | `assets/item-bases/3404.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex8EndgameVerisium` |
| 3405 | Runeforged Wolfskin Mantle | `body_armours_str_int` | yes | `assets/item-bases/3405.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt2EndgameVerisium` |
| 3406 | Runeforged Conjurer Mantle | `body_armours_str_int` | yes | `assets/item-bases/3406.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt4EndgameVerisium` |
| 3407 | Runeforged Death Mantle | `body_armours_str_int` | yes | `assets/item-bases/3407.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt6EndgameVerisium` |
| 3408 | Runeforged Seastorm Mantle | `body_armours_str_int` | yes | `assets/item-bases/3408.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt8EndgameVerisium` |
| 3409 | Runeforged Sleek Jacket | `body_armours_dex_int` | yes | `assets/item-bases/3409.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt2EndgameVerisium` |
| 3410 | Runeforged Rambler Jacket | `body_armours_dex_int` | yes | `assets/item-bases/3410.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt4EndgameVerisium` |
| 3411 | Runeforged Falconer's Jacket | `body_armours_dex_int` | yes | `assets/item-bases/3411.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt6EndgameVerisium` |
| 3412 | Runeforged Austere Garb | `body_armours_dex_int` | yes | `assets/item-bases/3412.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt8EndgameVerisium` |
| 3413 | Runeforged Warmonger Greathelm | `helmets_str` | yes | `assets/item-bases/3413.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr2EndgameVerisium` |
| 3414 | Runeforged Masked Greathelm | `helmets_str` | yes | `assets/item-bases/3414.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr4EndgameVerisium` |
| 3415 | Runeforged Paragon Greathelm | `helmets_str` | yes | `assets/item-bases/3415.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr5EndgameVerisium` |
| 3416 | Runeforged Imperial Greathelm | `helmets_str` | yes | `assets/item-bases/3416.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr7EndgameVerisium` |
| 3417 | Runeforged Woven Cap | `helmets_dex` | yes | `assets/item-bases/3417.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex2EndgameVerisium` |
| 3418 | Runeforged Desert Cap | `helmets_dex` | yes | `assets/item-bases/3418.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex4EndgameVerisium` |
| 3419 | Runeforged Trapper Hood | `helmets_dex` | yes | `assets/item-bases/3419.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex5EndgameVerisium` |
| 3420 | Runeforged Freebooter Cap | `helmets_dex` | yes | `assets/item-bases/3420.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex7EndgameVerisium` |
| 3421 | Runeforged Skycrown Tiara | `helmets_int` | yes | `assets/item-bases/3421.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt2EndgameVerisium` |
| 3422 | Runeforged Sorcerous Tiara | `helmets_int` | yes | `assets/item-bases/3422.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt4EndgameVerisium` |
| 3423 | Runeforged Kamasan Tiara | `helmets_int` | yes | `assets/item-bases/3423.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt5EndgameVerisium` |
| 3424 | Runeforged Ancestral Tiara | `helmets_int` | yes | `assets/item-bases/3424.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt8EndgameVerisium` |
| 3425 | Runeforged Warded Helm | `helmets_str_dex` | yes | `assets/item-bases/3425.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex2EndgameVerisium` |
| 3426 | Runeforged Cryptic Helm | `helmets_str_dex` | yes | `assets/item-bases/3426.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex4EndgameVerisium` |
| 3427 | Runeforged Champion Helm | `helmets_str_dex` | yes | `assets/item-bases/3427.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex5EndgameVerisium` |
| 3428 | Runeforged Gladiatorial Helm | `helmets_str_dex` | yes | `assets/item-bases/3428.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex6EndgameVerisium` |
| 3429 | Runeforged Druidic Crown | `helmets_str_int` | yes | `assets/item-bases/3429.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt2EndgameVerisium` |
| 3430 | Runeforged Saintly Crown | `helmets_str_int` | yes | `assets/item-bases/3430.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt4EndgameVerisium` |
| 3431 | Runeforged Divine Crown | `helmets_str_int` | yes | `assets/item-bases/3431.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt5EndgameVerisium` |
| 3432 | Runeforged Cryptic Crown | `helmets_str_int` | yes | `assets/item-bases/3432.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt6EndgameVerisium` |
| 3433 | Runeforged Brigand Mask | `helmets_dex_int` | yes | `assets/item-bases/3433.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt2EndgameVerisium` |
| 3434 | Runeforged Faridun Mask | `helmets_dex_int` | yes | `assets/item-bases/3434.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt4EndgameVerisium` |
| 3435 | Runeforged Soaring Mask | `helmets_dex_int` | yes | `assets/item-bases/3435.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt5EndgameVerisium` |
| 3436 | Runeforged Grinning Mask | `helmets_dex_int` | yes | `assets/item-bases/3436.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt6EndgameVerisium` |
| 3437 | Runeforged Knightly Mitts | `gloves_str` | yes | `assets/item-bases/3437.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr2EndgameVerisium` |
| 3438 | Runeforged Ornate Mitts | `gloves_str` | yes | `assets/item-bases/3438.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr4EndgameVerisium` |
| 3439 | Runeforged Vaal Mitts | `gloves_str` | yes | `assets/item-bases/3439.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr5EndgameVerisium` |
| 3440 | Runeforged Massive Mitts | `gloves_str` | yes | `assets/item-bases/3440.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr6EndgameVerisium` |
| 3441 | Runeforged Stalking Bracers | `gloves_dex` | yes | `assets/item-bases/3441.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex2EndgameVerisium` |
| 3442 | Runeforged Grand Bracers | `gloves_dex` | yes | `assets/item-bases/3442.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex4EndgameVerisium` |
| 3443 | Runeforged Barbed Bracers | `gloves_dex` | yes | `assets/item-bases/3443.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex5EndgameVerisium` |
| 3444 | Runeforged Polished Bracers | `gloves_dex` | yes | `assets/item-bases/3444.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex6EndgameVerisium` |
| 3445 | Runeforged Grim Gloves | `gloves_int` | yes | `assets/item-bases/3445.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt2EndgameVerisium` |
| 3446 | Runeforged Opulent Gloves | `gloves_int` | yes | `assets/item-bases/3446.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt4EndgameVerisium` |
| 3447 | Runeforged Vaal Gloves | `gloves_int` | yes | `assets/item-bases/3447.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt5EndgameVerisium` |
| 3448 | Runeforged Sirenscale Gloves | `gloves_int` | yes | `assets/item-bases/3448.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt6EndgameVerisium` |
| 3449 | Runeforged Steelmail Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/3449.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex1EndgameVerisium` |
| 3450 | Runeforged Commander Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/3450.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex2EndgameVerisium` |
| 3451 | Runeforged Cultist Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/3451.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex3EndgameVerisium` |
| 3452 | Runeforged Blacksteel Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/3452.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex4EndgameVerisium` |
| 3453 | Runeforged Bound Cuffs | `gloves_str_int` | yes | `assets/item-bases/3453.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt1EndgameVerisium` |
| 3454 | Runeforged Ancient Cuffs | `gloves_str_int` | yes | `assets/item-bases/3454.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt2EndgameVerisium` |
| 3455 | Runeforged Gleaming Cuffs | `gloves_str_int` | yes | `assets/item-bases/3455.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt3EndgameVerisium` |
| 3456 | Runeforged Adherent Cuffs | `gloves_str_int` | yes | `assets/item-bases/3456.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt4EndgameVerisium` |
| 3457 | Runeforged War Wraps | `gloves_dex_int` | yes | `assets/item-bases/3457.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt1EndgameVerisium` |
| 3458 | Runeforged Elegant Wraps | `gloves_dex_int` | yes | `assets/item-bases/3458.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt2EndgameVerisium` |
| 3459 | Runeforged Vaal Wraps | `gloves_dex_int` | yes | `assets/item-bases/3459.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt3EndgameVerisium` |
| 3460 | Runeforged Secured Wraps | `gloves_dex_int` | yes | `assets/item-bases/3460.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt4EndgameVerisium` |
| 3461 | Runeforged Bulwark Greaves | `boots_str` | yes | `assets/item-bases/3461.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr2EndgameVerisium` |
| 3462 | Runeforged Ornate Greaves | `boots_str` | yes | `assets/item-bases/3462.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr4EndgameVerisium` |
| 3463 | Runeforged Vaal Greaves | `boots_str` | yes | `assets/item-bases/3463.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr5EndgameVerisium` |
| 3464 | Runeforged Tasalian Greaves | `boots_str` | yes | `assets/item-bases/3464.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr6EndgameVerisium` |
| 3465 | Runeforged Cinched Boots | `boots_dex` | yes | `assets/item-bases/3465.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex2EndgameVerisium` |
| 3466 | Runeforged Cavalry Boots | `boots_dex` | yes | `assets/item-bases/3466.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex4EndgameVerisium` |
| 3467 | Runeforged Dragonscale Boots | `boots_dex` | yes | `assets/item-bases/3467.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex5EndgameVerisium` |
| 3468 | Runeforged Drakeskin Boots | `boots_dex` | yes | `assets/item-bases/3468.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex6EndgameVerisium` |
| 3469 | Runeforged Bound Sandals | `boots_int` | yes | `assets/item-bases/3469.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt2EndgameVerisium` |
| 3470 | Runeforged Luxurious Slippers | `boots_int` | yes | `assets/item-bases/3470.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt4EndgameVerisium` |
| 3471 | Runeforged Sandsworn Sandals | `boots_int` | yes | `assets/item-bases/3471.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt5EndgameVerisium` |
| 3472 | Runeforged Sekhema Sandals | `boots_int` | yes | `assets/item-bases/3472.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt6EndgameVerisium` |
| 3473 | Runeforged Veteran Sabatons | `boots_str_dex` | yes | `assets/item-bases/3473.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex1EndgameVerisium` |
| 3474 | Runeforged Noble Sabatons | `boots_str_dex` | yes | `assets/item-bases/3474.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex2EndgameVerisium` |
| 3475 | Runeforged Fortress Sabatons | `boots_str_dex` | yes | `assets/item-bases/3475.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex3EndgameVerisium` |
| 3476 | Runeforged Blacksteel Sabatons | `boots_str_dex` | yes | `assets/item-bases/3476.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex4EndgameVerisium` |
| 3477 | Runeforged Faithful Leggings | `boots_str_int` | yes | `assets/item-bases/3477.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt1EndgameVerisium` |
| 3478 | Runeforged Apostle Leggings | `boots_str_int` | yes | `assets/item-bases/3478.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt2EndgameVerisium` |
| 3479 | Runeforged Warlock Leggings | `boots_str_int` | yes | `assets/item-bases/3479.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt3EndgameVerisium` |
| 3480 | Runeforged Cryptic Leggings | `boots_str_int` | yes | `assets/item-bases/3480.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt4EndgameVerisium` |
| 3481 | Runeforged Wanderer Shoes | `boots_dex_int` | yes | `assets/item-bases/3481.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt1EndgameVerisium` |
| 3482 | Runeforged Charmed Shoes | `boots_dex_int` | yes | `assets/item-bases/3482.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt2EndgameVerisium` |
| 3483 | Runeforged Quickslip Shoes | `boots_dex_int` | yes | `assets/item-bases/3483.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt3EndgameVerisium` |
| 3484 | Runeforged Daggerfoot Shoes | `boots_dex_int` | yes | `assets/item-bases/3484.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt4EndgameVerisium` |
| 3485 | Runeforged Royal Tower Shield | `shields_str` | yes | `assets/item-bases/3485.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr3EndgameVerisium` |
| 3486 | Runeforged Fortress Tower Shield | `shields_str` | yes | `assets/item-bases/3486.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr6EndgameVerisium` |
| 3487 | Runeforged Vaal Tower Shield | `shields_str` | yes | `assets/item-bases/3487.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr8EndgameVerisium` |
| 3488 | Runeforged Tawhoan Tower Shield | `shields_str` | yes | `assets/item-bases/3488.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr10EndgameVerisium` |
| 3489 | Runeforged Mammoth Targe | `shields_str_dex` | yes | `assets/item-bases/3489.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex2EndgameVerisium` |
| 3490 | Runeforged Baroque Targe | `shields_str_dex` | yes | `assets/item-bases/3490.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex4EndgameVerisium` |
| 3491 | Runeforged Soaring Targe | `shields_str_dex` | yes | `assets/item-bases/3491.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex6EndgameVerisium` |
| 3492 | Runeforged Golden Targe | `shields_str_dex` | yes | `assets/item-bases/3492.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex10EndgameVerisium` |
| 3493 | Runeforged Intricate Crest Shield | `shields_str_int` | yes | `assets/item-bases/3493.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt2EndgameVerisium` |
| 3494 | Runeforged Sekheman Crest Shield | `shields_str_int` | yes | `assets/item-bases/3494.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt4EndgameVerisium` |
| 3495 | Runeforged Vaal Crest Shield | `shields_str_int` | yes | `assets/item-bases/3495.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt6EndgameVerisium` |
| 3496 | Runeforged Blacksteel Crest Shield | `shields_str_int` | yes | `assets/item-bases/3496.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt7EndgameVerisium` |
| 3497 | Runeforged Ornate Buckler | `bucklers` | yes | `assets/item-bases/3497.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex3EndgameVerisium` |
| 3498 | Runeforged Gutspike Buckler | `bucklers` | yes | `assets/item-bases/3498.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex6EndgameVerisium` |
| 3499 | Runeforged Ancient Buckler | `bucklers` | yes | `assets/item-bases/3499.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex8EndgameVerisium` |
| 3500 | Runeforged Desert Buckler | `bucklers` | yes | `assets/item-bases/3500.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex9EndgameVerisium` |
| 3501 | Runeforged Druidic Focus | `foci` | yes | `assets/item-bases/3501.png` | missing | `Metadata/Items/Armours/Focii/FourFocus3EndgameVerisium` |
| 3502 | Runeforged Leyline Focus | `foci` | yes | `assets/item-bases/3502.png` | missing | `Metadata/Items/Armours/Focii/FourFocus6EndgameVerisium` |
| 3503 | Runeforged Sacred Focus | `foci` | yes | `assets/item-bases/3503.png` | missing | `Metadata/Items/Armours/Focii/FourFocus8EndgameVerisium` |
| 3504 | Runeforged Tasalian Focus | `foci` | yes | `assets/item-bases/3504.png` | missing | `Metadata/Items/Armours/Focii/FourFocus10EndgameVerisium` |
| 3505 | Runeforged Fur Plate | `body_armours_str` | yes | `assets/item-bases/3505.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr2VerisiumUnique1` |
| 3506 | Runeforged Lace Hood | `helmets_dex` | yes | `assets/item-bases/3506.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex3VerisiumUnique1` |
| 3507 | Runeforged Wooden Club | `one_hand_maces` | yes | `assets/item-bases/3507.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMaceVerisium1a` |
| 3508 | Runemastered Wooden Club | `one_hand_maces` | yes | `assets/item-bases/3508.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMaceVerisium1b` |
| 3509 | Runeforged Slim Mace | `one_hand_maces` | yes | `assets/item-bases/3509.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMaceVerisium3` |
| 3510 | Runeforged Spiked Club | `one_hand_maces` | yes | `assets/item-bases/3510.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMaceVerisium4` |
| 3511 | Runeforged Warpick | `one_hand_maces` | yes | `assets/item-bases/3511.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMaceVerisium5` |
| 3512 | Runeforged Kalguuran Forgehammer | `one_hand_maces` | yes | `assets/item-bases/3512.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace14Verisium1` |
| 3513 | Runeforged Kalguuran Forgehammer | `one_hand_maces` | yes | `assets/item-bases/3513.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace14Verisium2` |
| 3514 | Runeforged Kalguuran Forgehammer | `one_hand_maces` | yes | `assets/item-bases/3514.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace14Verisium3` |
| 3515 | Runeforged Kalguuran Forgehammer | `one_hand_maces` | yes | `assets/item-bases/3515.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace14Verisium4` |
| 3516 | Runeforged Morning Star | `one_hand_maces` | yes | `assets/item-bases/3516.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMaceVerisium9` |
| 3517 | Runeforged Felled Greatclub | `two_hand_maces` | yes | `assets/item-bases/3517.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceVerisium1a` |
| 3518 | Runemastered Felled Greatclub | `two_hand_maces` | yes | `assets/item-bases/3518.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceVerisium1b` |
| 3519 | Runeforged Oak Greathammer | `two_hand_maces` | yes | `assets/item-bases/3519.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceVerisium2a` |
| 3520 | Runemastered Oak Greathammer | `two_hand_maces` | yes | `assets/item-bases/3520.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceVerisium2b` |
| 3521 | Runeforged Forge Maul | `two_hand_maces` | yes | `assets/item-bases/3521.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceVerisium3` |
| 3522 | Runeforged Studded Greatclub | `two_hand_maces` | yes | `assets/item-bases/3522.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceVerisium4a` |
| 3523 | Runemastered Studded Greatclub | `two_hand_maces` | yes | `assets/item-bases/3523.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceVerisium4b` |
| 3524 | Runeforged Cultist Greathammer | `two_hand_maces` | yes | `assets/item-bases/3524.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceVerisium5` |
| 3525 | Runeforged Temple Maul | `two_hand_maces` | yes | `assets/item-bases/3525.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceVerisium6` |
| 3526 | Runeforged Leaden Greathammer | `two_hand_maces` | yes | `assets/item-bases/3526.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceVerisium7` |
| 3527 | Runeforged Crumbling Maul | `two_hand_maces` | yes | `assets/item-bases/3527.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceVerisium8` |
| 3528 | Runeforged Pointed Maul | `two_hand_maces` | yes | `assets/item-bases/3528.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceVerisium9` |
| 3529 | Runeforged Hardwood Spear | `spears` | yes | `assets/item-bases/3529.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpearVerisium1` |
| 3530 | Runeforged Ironhead Spear | `spears` | yes | `assets/item-bases/3530.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpearVerisium2a` |
| 3531 | Runemastered Ironhead Spear | `spears` | yes | `assets/item-bases/3531.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpearVerisium2b` |
| 3532 | Runeforged Hunting Spear | `spears` | yes | `assets/item-bases/3532.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpearVerisium3` |
| 3533 | Runeforged Winged Spear | `spears` | yes | `assets/item-bases/3533.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpearVerisium4` |
| 3534 | Runeforged War Spear | `spears` | yes | `assets/item-bases/3534.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpearVerisium5` |
| 3535 | Runeforged Forked Spear | `spears` | yes | `assets/item-bases/3535.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpearVerisium6` |
| 3536 | Runeforged Barbed Spear | `spears` | yes | `assets/item-bases/3536.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpearVerisium7` |
| 3537 | Runeforged Wrapped Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3537.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaffVerisium1` |
| 3538 | Runeforged Long Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3538.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaffVerisium2a` |
| 3539 | Runemastered Long Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3539.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaffVerisium2b` |
| 3540 | Runeforged Gothic Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3540.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaffVerisium3a` |
| 3541 | Runemastered Gothic Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3541.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaffVerisium3b` |
| 3542 | Runeforged Crescent Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3542.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaffVerisium5` |
| 3543 | Runeforged Steelpoint Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3543.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaffVerisium6` |
| 3544 | Runeforged Crude Bow | `bows` | yes | `assets/item-bases/3544.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBowVerisium1` |
| 3545 | Runeforged Shortbow | `bows` | yes | `assets/item-bases/3545.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBowVerisium2a` |
| 3546 | Runeforged Shortbow | `bows` | yes | `assets/item-bases/3546.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBowVerisium2b` |
| 3547 | Runeforged Recurve Bow | `bows` | yes | `assets/item-bases/3547.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBowVerisium4` |
| 3548 | Runeforged Composite Bow | `bows` | yes | `assets/item-bases/3548.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBowVerisium5` |
| 3549 | Runeforged Dualstring Bow | `bows` | yes | `assets/item-bases/3549.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBowVerisium6` |
| 3550 | Runeforged Zealot Bow | `bows` | yes | `assets/item-bases/3550.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBowVerisium8` |
| 3551 | Runeforged Makeshift Crossbow | `crossbows` | yes | `assets/item-bases/3551.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbowVerisium1` |
| 3552 | Runeforged Tense Crossbow | `crossbows` | yes | `assets/item-bases/3552.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbowVerisium2a` |
| 3553 | Runemastered Tense Crossbow | `crossbows` | yes | `assets/item-bases/3553.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbowVerisium2b` |
| 3554 | Runeforged Sturdy Crossbow | `crossbows` | yes | `assets/item-bases/3554.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbowVerisium3` |
| 3555 | Runeforged Dyad Crossbow | `crossbows` | yes | `assets/item-bases/3555.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbowVerisium5a` |
| 3556 | Runemastered Dyad Crossbow | `crossbows` | yes | `assets/item-bases/3556.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbowVerisium5b` |
| 3557 | Runeforged Bombard Crossbow | `crossbows` | yes | `assets/item-bases/3557.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbowVerisium7` |
| 3564 | Flanged Mace | `one_hand_maces` | yes | `assets/item-bases/3564.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace3Endgame` |
| 3565 | Crown Mace | `one_hand_maces` | yes | `assets/item-bases/3565.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace6Endgame` |
| 3566 | Molten Hammer | `one_hand_maces` | yes | `assets/item-bases/3566.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace2Endgame` |
| 3567 | Strife Pick | `one_hand_maces` | yes | `assets/item-bases/3567.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace5Endgame` |
| 3568 | Fortified Hammer | `one_hand_maces` | yes | `assets/item-bases/3568.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace8Endgame` |
| 3569 | Marauding Mace | `one_hand_maces` | yes | `assets/item-bases/3569.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace7Endgame` |
| 3570 | Akoyan Club | `one_hand_maces` | yes | `assets/item-bases/3570.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandMaces/FourOneHandMace10Endgame` |
| 3571 | Anvil Maul | `two_hand_maces` | yes | `assets/item-bases/3571.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace3Endgame` |
| 3572 | Sacred Maul | `two_hand_maces` | yes | `assets/item-bases/3572.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace6Endgame` |
| 3573 | Ironwood Greathammer | `two_hand_maces` | yes | `assets/item-bases/3573.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace2Endgame` |
| 3574 | Fanatic Greathammer | `two_hand_maces` | yes | `assets/item-bases/3574.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace5Endgame` |
| 3575 | Ruination Maul | `two_hand_maces` | yes | `assets/item-bases/3575.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace8Endgame` |
| 3576 | Massive Greathammer | `two_hand_maces` | yes | `assets/item-bases/3576.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace7Endgame` |
| 3577 | Tawhoan Greatclub | `two_hand_maces` | yes | `assets/item-bases/3577.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMace10Endgame` |
| 3578 | Aberrant Sledge | `two_hand_maces` | yes | `assets/item-bases/3578.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceUnique1` |
| 3579 | Runemastered Aberrant Sledge | `two_hand_maces` | yes | `assets/item-bases/3579.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceUnique1VerisiumUnique1` |
| 3580 | Runemastered Aberrant Sledge | `two_hand_maces` | yes | `assets/item-bases/3580.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceUnique1VerisiumUnique2` |
| 3581 | Runemastered Aberrant Sledge | `two_hand_maces` | yes | `assets/item-bases/3581.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceUnique1VerisiumUnique3` |
| 3582 | Runemastered Aberrant Sledge | `two_hand_maces` | yes | `assets/item-bases/3582.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/TwoHandMaces/FourTwoHandMaceUnique1VerisiumUnique4` |
| 3583 | Sinister Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3583.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff3Endgame` |
| 3584 | Lunar Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3584.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff5Endgame` |
| 3585 | Striking Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3585.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff2Endgame` |
| 3586 | Bolting Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3586.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff4Endgame` |
| 3587 | Aegis Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3587.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff8Endgame` |
| 3588 | Razor Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3588.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff7Endgame` |
| 3589 | Skullcrusher Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3589.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff9Endgame` |
| 3590 | Dreaming Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3590.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaff10Endgame` |
| 3591 | Warding Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3591.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaffUnique1` |
| 3592 | Runemastered Warding Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3592.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaffUnique1VerisiumUnique1` |
| 3593 | Runemastered Warding Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3593.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaffUnique1VerisiumUnique2` |
| 3594 | Runemastered Warding Quarterstaff | `quarterstaves` | yes | `assets/item-bases/3594.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Staves/FourQuarterstaffUnique1VerisiumUnique3` |
| 3595 | Ironwood Shortbow | `bows` | yes | `assets/item-bases/3595.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow2Endgame` |
| 3596 | Cavalry Bow | `bows` | yes | `assets/item-bases/3596.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow5Endgame` |
| 3597 | Guardian Bow | `bows` | yes | `assets/item-bases/3597.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow3Endgame` |
| 3598 | Gemini Bow | `bows` | yes | `assets/item-bases/3598.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow6Endgame` |
| 3599 | Fanatic Bow | `bows` | yes | `assets/item-bases/3599.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow7Endgame` |
| 3600 | Warmonger Bow | `bows` | yes | `assets/item-bases/3600.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow8Endgame` |
| 3601 | Obliterator Bow | `bows` | yes | `assets/item-bases/3601.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBow9Endgame` |
| 3602 | Heartwood Shortbow | `bows` | yes | `assets/item-bases/3602.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Bows/FourBowUnique1` |
| 3603 | Stout Crossbow | `crossbows` | yes | `assets/item-bases/3603.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow3Endgame` |
| 3604 | Engraved Crossbow | `crossbows` | yes | `assets/item-bases/3604.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow4Endgame` |
| 3605 | Flexed Crossbow | `crossbows` | yes | `assets/item-bases/3605.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow2Endgame` |
| 3606 | Gemini Crossbow | `crossbows` | yes | `assets/item-bases/3606.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow5Endgame` |
| 3607 | Siege Crossbow | `crossbows` | yes | `assets/item-bases/3607.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow7Endgame` |
| 3608 | Desolate Crossbow | `crossbows` | yes | `assets/item-bases/3608.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow8Endgame` |
| 3609 | Elegant Crossbow | `crossbows` | yes | `assets/item-bases/3609.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow10Endgame` |
| 3610 | Trarthan Cannon | `crossbows` | yes | `assets/item-bases/3610.png` | missing | `Metadata/Items/Weapons/TwoHandWeapons/Crossbows/FourCrossbow14Endgame` |
| 3611 | Orichalcum Spear | `spears` | yes | `assets/item-bases/3611.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear2Endgame` |
| 3612 | Soaring Spear | `spears` | yes | `assets/item-bases/3612.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear4Endgame` |
| 3613 | Pronged Spear | `spears` | yes | `assets/item-bases/3613.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear6Endgame` |
| 3614 | Stalking Spear | `spears` | yes | `assets/item-bases/3614.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear3Endgame` |
| 3615 | Flying Spear | `spears` | yes | `assets/item-bases/3615.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear5Endgame` |
| 3616 | Grand Spear | `spears` | yes | `assets/item-bases/3616.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear8Endgame` |
| 3617 | Spiked Spear | `spears` | yes | `assets/item-bases/3617.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear7Endgame` |
| 3618 | Guardian Spear | `spears` | yes | `assets/item-bases/3618.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear9Endgame` |
| 3619 | Akoyan Spear | `spears` | yes | `assets/item-bases/3619.png` | missing | `Metadata/Items/Weapons/OneHandWeapons/OneHandSpears/FourSpear10Endgame` |
| 5250 | Runemastered Rusted Cuirass | `body_armours_str` | yes | `assets/item-bases/5250.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr1VerisiumUnique1` |
| 5251 | Runemastered Iron Cuirass | `body_armours_str` | yes | `assets/item-bases/5251.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr3VerisiumUnique1` |
| 5252 | Runemastered Raider Plate | `body_armours_str` | yes | `assets/item-bases/5252.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr4VerisiumUnique1` |
| 5253 | Runemastered Maraketh Cuirass | `body_armours_str` | yes | `assets/item-bases/5253.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr5VerisiumUnique1` |
| 5254 | Runemastered Steel Plate | `body_armours_str` | yes | `assets/item-bases/5254.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr6VerisiumUnique1` |
| 5255 | Runemastered Full Plate | `body_armours_str` | yes | `assets/item-bases/5255.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr7VerisiumUnique1` |
| 5256 | Runemastered Vaal Cuirass | `body_armours_str` | yes | `assets/item-bases/5256.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStr8VerisiumUnique1` |
| 5257 | Runemastered Leather Vest | `body_armours_dex` | yes | `assets/item-bases/5257.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex1VerisiumUnique1` |
| 5258 | Runemastered Quilted Vest | `body_armours_dex` | yes | `assets/item-bases/5258.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex2VerisiumUnique1` |
| 5259 | Runemastered Pathfinder Coat | `body_armours_dex` | yes | `assets/item-bases/5259.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex3VerisiumUnique1` |
| 5260 | Runemastered Shrouded Vest | `body_armours_dex` | yes | `assets/item-bases/5260.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex4VerisiumUnique1` |
| 5261 | Runemastered Rhoahide Coat | `body_armours_dex` | yes | `assets/item-bases/5261.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex5VerisiumUnique1` |
| 5262 | Runemastered Studded Vest | `body_armours_dex` | yes | `assets/item-bases/5262.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex6VerisiumUnique1` |
| 5263 | Runemastered Scout's Vest | `body_armours_dex` | yes | `assets/item-bases/5263.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex7VerisiumUnique1` |
| 5264 | Runemastered Serpentscale Coat | `body_armours_dex` | yes | `assets/item-bases/5264.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex8VerisiumUnique1` |
| 5265 | Runemastered Smuggler Coat | `body_armours_dex` | yes | `assets/item-bases/5265.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex10VerisiumUnique1` |
| 5266 | Runemastered Strider Vest | `body_armours_dex` | yes | `assets/item-bases/5266.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex11VerisiumUnique1` |
| 5267 | Runemastered Exquisite Vest | `body_armours_dex` | yes | `assets/item-bases/5267.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex13VerisiumUnique1` |
| 5268 | Runemastered Armoured Vest | `body_armours_dex` | yes | `assets/item-bases/5268.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDex15VerisiumUnique1` |
| 5269 | Runemastered Tattered Robe | `body_armours_int` | yes | `assets/item-bases/5269.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt1VerisiumUnique1` |
| 5270 | Runemastered Feathered Robe | `body_armours_int` | yes | `assets/item-bases/5270.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt2VerisiumUnique1` |
| 5271 | Runemastered Hexer's Robe | `body_armours_int` | yes | `assets/item-bases/5271.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt3VerisiumUnique1` |
| 5272 | Runemastered Bone Raiment | `body_armours_int` | yes | `assets/item-bases/5272.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt4VerisiumUnique1` |
| 5273 | Runemastered Silk Robe | `body_armours_int` | yes | `assets/item-bases/5273.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt5VerisiumUnique1` |
| 5274 | Runemastered Keth Raiment | `body_armours_int` | yes | `assets/item-bases/5274.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt6VerisiumUnique1` |
| 5275 | Runemastered Votive Raiment | `body_armours_int` | yes | `assets/item-bases/5275.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt7VerisiumUnique1` |
| 5276 | Runemastered Altar Robe | `body_armours_int` | yes | `assets/item-bases/5276.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt8VerisiumUnique1` |
| 5277 | Runemastered Elementalist Robe | `body_armours_int` | yes | `assets/item-bases/5277.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt9VerisiumUnique1` |
| 5278 | Runemastered Plated Raiment | `body_armours_int` | yes | `assets/item-bases/5278.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt12VerisiumUnique1` |
| 5279 | Runemastered Havoc Raiment | `body_armours_int` | yes | `assets/item-bases/5279.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt13VerisiumUnique1` |
| 5280 | Runemastered Enlightened Robe | `body_armours_int` | yes | `assets/item-bases/5280.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyInt14VerisiumUnique1` |
| 5281 | Runemastered Chain Mail | `body_armours_str_dex` | yes | `assets/item-bases/5281.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex1VerisiumUnique1` |
| 5282 | Runemastered Rogue Armour | `body_armours_str_dex` | yes | `assets/item-bases/5282.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex2VerisiumUnique1` |
| 5283 | Runemastered Vagabond Armour | `body_armours_str_dex` | yes | `assets/item-bases/5283.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex3VerisiumUnique1` |
| 5284 | Runemastered Cloaked Mail | `body_armours_str_dex` | yes | `assets/item-bases/5284.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex4VerisiumUnique1` |
| 5285 | Runemastered Explorer Armour | `body_armours_str_dex` | yes | `assets/item-bases/5285.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex5VerisiumUnique1` |
| 5286 | Runemastered Scale Mail | `body_armours_str_dex` | yes | `assets/item-bases/5286.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex6VerisiumUnique1` |
| 5287 | Runemastered Knight Armour | `body_armours_str_dex` | yes | `assets/item-bases/5287.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex7VerisiumUnique1` |
| 5288 | Runemastered Ancestral Mail | `body_armours_str_dex` | yes | `assets/item-bases/5288.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex8VerisiumUnique1` |
| 5289 | Runemastered Heroic Armour | `body_armours_str_dex` | yes | `assets/item-bases/5289.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDex11VerisiumUnique1` |
| 5290 | Runemastered Pilgrim Vestments | `body_armours_str_int` | yes | `assets/item-bases/5290.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt1VerisiumUnique1` |
| 5291 | Runemastered Mail Vestments | `body_armours_str_int` | yes | `assets/item-bases/5291.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt3VerisiumUnique1` |
| 5292 | Runemastered Shaman Mantle | `body_armours_str_int` | yes | `assets/item-bases/5292.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt4VerisiumUnique1` |
| 5293 | Runemastered Ironclad Vestments | `body_armours_str_int` | yes | `assets/item-bases/5293.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt5VerisiumUnique1` |
| 5294 | Runemastered Sacrificial Mantle | `body_armours_str_int` | yes | `assets/item-bases/5294.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt6VerisiumUnique1` |
| 5295 | Runemastered Cleric Vestments | `body_armours_str_int` | yes | `assets/item-bases/5295.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt7VerisiumUnique1` |
| 5296 | Runemastered Tideseer Mantle | `body_armours_str_int` | yes | `assets/item-bases/5296.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt8VerisiumUnique1` |
| 5297 | Runemastered Gilded Vestments | `body_armours_str_int` | yes | `assets/item-bases/5297.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt9VerisiumUnique1` |
| 5298 | Runemastered Revered Vestments | `body_armours_str_int` | yes | `assets/item-bases/5298.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt11VerisiumUnique1` |
| 5299 | Runemastered Revered Vestments | `body_armours_str_int` | yes | `assets/item-bases/5299.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt11VerisiumUnique2` |
| 5300 | Runemastered Revered Vestments | `body_armours_str_int` | yes | `assets/item-bases/5300.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt11VerisiumUnique3` |
| 5301 | Runemastered Corvus Mantle | `body_armours_str_int` | yes | `assets/item-bases/5301.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrInt12VerisiumUnique1` |
| 5302 | Runemastered Ornate Ringmail | `body_armours_str_int` | yes | `assets/item-bases/5302.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrIntUnique1VerisiumUnique1` |
| 5303 | Runemastered Ancient Mail | `body_armours_str_int` | yes | `assets/item-bases/5303.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrIntUnique2VerisiumUnique1` |
| 5304 | Runemastered Hermit Garb | `body_armours_dex_int` | yes | `assets/item-bases/5304.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt1VerisiumUnique1` |
| 5305 | Runemastered Waxed Jacket | `body_armours_dex_int` | yes | `assets/item-bases/5305.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt2VerisiumUnique1` |
| 5306 | Runemastered Marabout Garb | `body_armours_dex_int` | yes | `assets/item-bases/5306.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt3VerisiumUnique1` |
| 5307 | Runemastered Wayfarer Jacket | `body_armours_dex_int` | yes | `assets/item-bases/5307.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt4VerisiumUnique1` |
| 5308 | Runemastered Anchorite Garb | `body_armours_dex_int` | yes | `assets/item-bases/5308.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt5VerisiumUnique1` |
| 5309 | Runemastered Scalper's Jacket | `body_armours_dex_int` | yes | `assets/item-bases/5309.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt6VerisiumUnique1` |
| 5310 | Runemastered Assassin Garb | `body_armours_dex_int` | yes | `assets/item-bases/5310.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexInt13VerisiumUnique1` |
| 5311 | Runemastered Garment | `body_armours_str_dex_int` | yes | `assets/item-bases/5311.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDexIntBaseVerisiumUnique1` |
| 5312 | Runemastered Grand Regalia | `body_armours_str_dex_int` | yes | `assets/item-bases/5312.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDexInt1VerisiumUnique1` |
| 5313 | Runemastered Sacrificial Regalia | `body_armours_str_dex_int` | yes | `assets/item-bases/5313.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyStrDexInt2VerisiumUnique1` |
| 5314 | Runemastered Rusted Greathelm | `helmets_str` | yes | `assets/item-bases/5314.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr1VerisiumUnique1` |
| 5315 | Runemastered Soldier Greathelm | `helmets_str` | yes | `assets/item-bases/5315.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr2VerisiumUnique1` |
| 5316 | Runemastered Wrapped Greathelm | `helmets_str` | yes | `assets/item-bases/5316.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr3VerisiumUnique1` |
| 5317 | Runemastered Spired Greathelm | `helmets_str` | yes | `assets/item-bases/5317.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr4VerisiumUnique1` |
| 5318 | Runemastered Elite Greathelm | `helmets_str` | yes | `assets/item-bases/5318.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr5VerisiumUnique1` |
| 5319 | Runemastered Warrior Greathelm | `helmets_str` | yes | `assets/item-bases/5319.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr6VerisiumUnique1` |
| 5320 | Runemastered Fierce Greathelm | `helmets_str` | yes | `assets/item-bases/5320.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStr8VerisiumUnique1` |
| 5321 | Runemastered Shabby Hood | `helmets_dex` | yes | `assets/item-bases/5321.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex1VerisiumUnique1` |
| 5322 | Runemastered Felt Cap | `helmets_dex` | yes | `assets/item-bases/5322.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex2VerisiumUnique1` |
| 5323 | Runemastered Hunter Hood | `helmets_dex` | yes | `assets/item-bases/5323.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex5VerisiumUnique1` |
| 5324 | Runemastered Viper Cap | `helmets_dex` | yes | `assets/item-bases/5324.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex6VerisiumUnique1` |
| 5325 | Runemastered Corsair Cap | `helmets_dex` | yes | `assets/item-bases/5325.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex7VerisiumUnique1` |
| 5326 | Runemastered Leatherbound Hood | `helmets_dex` | yes | `assets/item-bases/5326.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex8VerisiumUnique1` |
| 5327 | Runemastered Velvet Cap | `helmets_dex` | yes | `assets/item-bases/5327.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex9VerisiumUnique1` |
| 5328 | Runemastered Covert Hood | `helmets_dex` | yes | `assets/item-bases/5328.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex10VerisiumUnique1` |
| 5329 | Runemastered Armoured Cap | `helmets_dex` | yes | `assets/item-bases/5329.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDex11VerisiumUnique1` |
| 5330 | Runemastered Twig Circlet | `helmets_int` | yes | `assets/item-bases/5330.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt1VerisiumUnique1` |
| 5331 | Runemastered Wicker Tiara | `helmets_int` | yes | `assets/item-bases/5331.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt2VerisiumUnique1` |
| 5332 | Runemastered Beaded Circlet | `helmets_int` | yes | `assets/item-bases/5332.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt3VerisiumUnique1` |
| 5333 | Runemastered Chain Tiara | `helmets_int` | yes | `assets/item-bases/5333.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt4VerisiumUnique1` |
| 5334 | Runemastered Feathered Tiara | `helmets_int` | yes | `assets/item-bases/5334.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt5VerisiumUnique1` |
| 5335 | Runemastered Gold Circlet | `helmets_int` | yes | `assets/item-bases/5335.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt6VerisiumUnique1` |
| 5336 | Runemastered Vermeil Circlet | `helmets_int` | yes | `assets/item-bases/5336.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt7VerisiumUnique1` |
| 5337 | Runemastered Jade Tiara | `helmets_int` | yes | `assets/item-bases/5337.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt8VerisiumUnique1` |
| 5338 | Runemastered Twilight Tiara | `helmets_int` | yes | `assets/item-bases/5338.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt10VerisiumUnique1` |
| 5339 | Runemastered Magus Tiara | `helmets_int` | yes | `assets/item-bases/5339.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetInt11VerisiumUnique1` |
| 5340 | Runemastered Brimmed Helm | `helmets_str_dex` | yes | `assets/item-bases/5340.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex1VerisiumUnique1` |
| 5341 | Runemastered Guarded Helm | `helmets_str_dex` | yes | `assets/item-bases/5341.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex2VerisiumUnique1` |
| 5342 | Runemastered Visored Helm | `helmets_str_dex` | yes | `assets/item-bases/5342.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex3VerisiumUnique1` |
| 5343 | Runemastered Cowled Helm | `helmets_str_dex` | yes | `assets/item-bases/5343.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex4VerisiumUnique1` |
| 5344 | Runemastered Shielded Helm | `helmets_str_dex` | yes | `assets/item-bases/5344.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex5VerisiumUnique1` |
| 5345 | Runemastered Decorated Helm | `helmets_str_dex` | yes | `assets/item-bases/5345.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDex7VerisiumUnique1` |
| 5346 | Runemastered Ancient Visor | `helmets_str_dex` | yes | `assets/item-bases/5346.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDexVerisiumUnique1` |
| 5347 | Runemastered Iron Crown | `helmets_str_int` | yes | `assets/item-bases/5347.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt1VerisiumUnique1` |
| 5348 | Runemastered Horned Crown | `helmets_str_int` | yes | `assets/item-bases/5348.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt2VerisiumUnique1` |
| 5349 | Runemastered Cultist Crown | `helmets_str_int` | yes | `assets/item-bases/5349.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt3VerisiumUnique1` |
| 5350 | Runemastered Martyr Crown | `helmets_str_int` | yes | `assets/item-bases/5350.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt4VerisiumUnique1` |
| 5351 | Runemastered Heavy Crown | `helmets_str_int` | yes | `assets/item-bases/5351.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt5VerisiumUnique1` |
| 5352 | Runemastered Spiritbone Crown | `helmets_str_int` | yes | `assets/item-bases/5352.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt6VerisiumUnique1` |
| 5353 | Runemastered Spiritbone Crown | `helmets_str_int` | yes | `assets/item-bases/5353.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt6VerisiumUnique2` |
| 5354 | Runemastered Spiritbone Crown | `helmets_str_int` | yes | `assets/item-bases/5354.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrInt6VerisiumUnique3` |
| 5355 | Runemastered Grand Visage | `helmets_str_dex_int` | yes | `assets/item-bases/5355.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrDexInt1VerisiumUnique1` |
| 5356 | Runemastered Tenebrous Crown | `helmets_str_int` | yes | `assets/item-bases/5356.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetStrIntVerisiumUnique1` |
| 5357 | Runemastered Hewn Mask | `helmets_dex_int` | yes | `assets/item-bases/5357.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt1VerisiumUnique1` |
| 5358 | Runemastered Face Mask | `helmets_dex_int` | yes | `assets/item-bases/5358.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt2VerisiumUnique1` |
| 5359 | Runemastered Hooded Mask | `helmets_dex_int` | yes | `assets/item-bases/5359.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt3VerisiumUnique1` |
| 5360 | Runemastered Veiled Mask | `helmets_dex_int` | yes | `assets/item-bases/5360.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt4VerisiumUnique1` |
| 5361 | Runemastered Tribal Mask | `helmets_dex_int` | yes | `assets/item-bases/5361.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt5VerisiumUnique1` |
| 5362 | Runemastered Solid Mask | `helmets_dex_int` | yes | `assets/item-bases/5362.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt6VerisiumUnique1` |
| 5363 | Runemastered Death Mask | `helmets_dex_int` | yes | `assets/item-bases/5363.png` | missing | `Metadata/Items/Armours/Helmets/FourHelmetDexInt8VerisiumUnique1` |
| 5364 | Runemastered Stocky Mitts | `gloves_str` | yes | `assets/item-bases/5364.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr1VerisiumUnique1` |
| 5365 | Runemastered Riveted Mitts | `gloves_str` | yes | `assets/item-bases/5365.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr2VerisiumUnique1` |
| 5366 | Runemastered Tempered Mitts | `gloves_str` | yes | `assets/item-bases/5366.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr3VerisiumUnique1` |
| 5367 | Runemastered Bolstered Mitts | `gloves_str` | yes | `assets/item-bases/5367.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr4VerisiumUnique1` |
| 5368 | Runemastered Moulded Mitts | `gloves_str` | yes | `assets/item-bases/5368.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr5VerisiumUnique1` |
| 5369 | Runemastered Titan Mitts | `gloves_str` | yes | `assets/item-bases/5369.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStr7VerisiumUnique1` |
| 5370 | Runemastered Suede Bracers | `gloves_dex` | yes | `assets/item-bases/5370.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex1VerisiumUnique1` |
| 5371 | Runemastered Firm Bracers | `gloves_dex` | yes | `assets/item-bases/5371.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex2VerisiumUnique1` |
| 5372 | Runemastered Sectioned Bracers | `gloves_dex` | yes | `assets/item-bases/5372.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex4VerisiumUnique1` |
| 5373 | Runemastered Spined Bracers | `gloves_dex` | yes | `assets/item-bases/5373.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex5VerisiumUnique1` |
| 5374 | Runemastered Fine Bracers | `gloves_dex` | yes | `assets/item-bases/5374.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDex6VerisiumUnique1` |
| 5375 | Runemastered Torn Gloves | `gloves_int` | yes | `assets/item-bases/5375.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt1VerisiumUnique1` |
| 5376 | Runemastered Sombre Gloves | `gloves_int` | yes | `assets/item-bases/5376.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt2VerisiumUnique1` |
| 5377 | Runemastered Stitched Gloves | `gloves_int` | yes | `assets/item-bases/5377.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt3VerisiumUnique1` |
| 5378 | Runemastered Jewelled Gloves | `gloves_int` | yes | `assets/item-bases/5378.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt4VerisiumUnique1` |
| 5379 | Runemastered Intricate Gloves | `gloves_int` | yes | `assets/item-bases/5379.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt5VerisiumUnique1` |
| 5380 | Runemastered Pauascale Gloves | `gloves_int` | yes | `assets/item-bases/5380.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt6VerisiumUnique1` |
| 5381 | Runemastered Embroidered Gloves | `gloves_int` | yes | `assets/item-bases/5381.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesInt7VerisiumUnique1` |
| 5382 | Runemastered Ringmail Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/5382.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex1VerisiumUnique1` |
| 5383 | Runemastered Layered Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/5383.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex2VerisiumUnique1` |
| 5384 | Runemastered Doubled Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/5384.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex3VerisiumUnique1` |
| 5385 | Runemastered Plate Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/5385.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex4VerisiumUnique1` |
| 5386 | Runemastered Burnished Gauntlets | `gloves_str_dex` | yes | `assets/item-bases/5386.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDex5VerisiumUnique1` |
| 5387 | Runemastered Rope Cuffs | `gloves_str_int` | yes | `assets/item-bases/5387.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt1VerisiumUnique1` |
| 5388 | Runemastered Aged Cuffs | `gloves_str_int` | yes | `assets/item-bases/5388.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt2VerisiumUnique1` |
| 5389 | Runemastered Goldcast Cuffs | `gloves_str_int` | yes | `assets/item-bases/5389.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt3VerisiumUnique1` |
| 5390 | Runemastered Verisium Cuffs | `gloves_str_int` | yes | `assets/item-bases/5390.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrInt4VerisiumUnique1` |
| 5391 | Runemastered Gauze Wraps | `gloves_dex_int` | yes | `assets/item-bases/5391.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt1VerisiumUnique1` |
| 5392 | Runemastered Linen Wraps | `gloves_dex_int` | yes | `assets/item-bases/5392.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt2VerisiumUnique1` |
| 5393 | Runemastered Spiral Wraps | `gloves_dex_int` | yes | `assets/item-bases/5393.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt3VerisiumUnique1` |
| 5394 | Runemastered Furtive Wraps | `gloves_dex_int` | yes | `assets/item-bases/5394.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt5VerisiumUnique1` |
| 5395 | Runemastered Utility Wraps | `gloves_dex_int` | yes | `assets/item-bases/5395.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesDexInt6VerisiumUnique1` |
| 5396 | Runemastered Grand Manchettes | `gloves_str_dex_int` | yes | `assets/item-bases/5396.png` | missing | `Metadata/Items/Armours/Gloves/FourGlovesStrDexInt1VerisiumUnique1` |
| 5397 | Runemastered Rough Greaves | `boots_str` | yes | `assets/item-bases/5397.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr1VerisiumUnique1` |
| 5398 | Runemastered Iron Greaves | `boots_str` | yes | `assets/item-bases/5398.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr2VerisiumUnique1` |
| 5399 | Runemastered Bronze Greaves | `boots_str` | yes | `assets/item-bases/5399.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr3VerisiumUnique1` |
| 5400 | Runemastered Trimmed Greaves | `boots_str` | yes | `assets/item-bases/5400.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr4VerisiumUnique1` |
| 5401 | Runemastered Stone Greaves | `boots_str` | yes | `assets/item-bases/5401.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStr5VerisiumUnique1` |
| 5402 | Runemastered Laced Boots | `boots_dex` | yes | `assets/item-bases/5402.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex2VerisiumUnique1` |
| 5403 | Runemastered Embossed Boots | `boots_dex` | yes | `assets/item-bases/5403.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex3VerisiumUnique1` |
| 5404 | Runemastered Steeltoe Boots | `boots_dex` | yes | `assets/item-bases/5404.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex4VerisiumUnique1` |
| 5405 | Runemastered Lizardscale Boots | `boots_dex` | yes | `assets/item-bases/5405.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex5VerisiumUnique1` |
| 5406 | Runemastered Cinched Boots | `boots_dex` | yes | `assets/item-bases/5406.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDex2EndgameVerisiumUnique1` |
| 5407 | Runemastered Straw Sandals | `boots_int` | yes | `assets/item-bases/5407.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt1VerisiumUnique1` |
| 5408 | Runemastered Wrapped Sandals | `boots_int` | yes | `assets/item-bases/5408.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt2VerisiumUnique1` |
| 5409 | Runemastered Lattice Sandals | `boots_int` | yes | `assets/item-bases/5409.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt3VerisiumUnique1` |
| 5410 | Runemastered Silk Slippers | `boots_int` | yes | `assets/item-bases/5410.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt4VerisiumUnique1` |
| 5411 | Runemastered Feathered Sandals | `boots_int` | yes | `assets/item-bases/5411.png` | missing | `Metadata/Items/Armours/Boots/FourBootsInt5VerisiumUnique1` |
| 5412 | Runemastered Mail Sabatons | `boots_str_dex` | yes | `assets/item-bases/5412.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex1VerisiumUnique1` |
| 5413 | Runemastered Braced Sabatons | `boots_str_dex` | yes | `assets/item-bases/5413.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex2VerisiumUnique1` |
| 5414 | Runemastered Stacked Sabatons | `boots_str_dex` | yes | `assets/item-bases/5414.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex3VerisiumUnique1` |
| 5415 | Runemastered Covered Sabatons | `boots_str_dex` | yes | `assets/item-bases/5415.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDex4VerisiumUnique1` |
| 5416 | Runemastered Secured Leggings | `boots_str_int` | yes | `assets/item-bases/5416.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrInt2VerisiumUnique1` |
| 5417 | Runemastered Ancient Leggings | `boots_str_int` | yes | `assets/item-bases/5417.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrIntVerisiumUnique1` |
| 5418 | Runemastered Threaded Shoes | `boots_dex_int` | yes | `assets/item-bases/5418.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt2VerisiumUnique1` |
| 5419 | Runemastered Hunting Shoes | `boots_dex_int` | yes | `assets/item-bases/5419.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt3VerisiumUnique1` |
| 5420 | Runemastered Velour Shoes | `boots_dex_int` | yes | `assets/item-bases/5420.png` | missing | `Metadata/Items/Armours/Boots/FourBootsDexInt5VerisiumUnique1` |
| 5421 | Runemastered Splintered Tower Shield | `shields_str` | yes | `assets/item-bases/5421.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr1VerisiumUnique1` |
| 5422 | Runemastered Painted Tower Shield | `shields_str` | yes | `assets/item-bases/5422.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr2VerisiumUnique1` |
| 5423 | Runemastered Braced Tower Shield | `shields_str` | yes | `assets/item-bases/5423.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr3VerisiumUnique1` |
| 5424 | Runemastered Barricade Tower Shield | `shields_str` | yes | `assets/item-bases/5424.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr4VerisiumUnique1` |
| 5425 | Runemastered Effigial Tower Shield | `shields_str` | yes | `assets/item-bases/5425.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr5VerisiumUnique1` |
| 5426 | Runemastered Rampart Tower Shield | `shields_str` | yes | `assets/item-bases/5426.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr6VerisiumUnique1` |
| 5427 | Runemastered Heraldric Tower Shield | `shields_str` | yes | `assets/item-bases/5427.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr7VerisiumUnique1` |
| 5428 | Runemastered Grand Cuisses | `boots_str_dex_int` | yes | `assets/item-bases/5428.png` | missing | `Metadata/Items/Armours/Boots/FourBootsStrDexInt1VerisiumUnique1` |
| 5429 | Runemastered Crucible Tower Shield | `shields_str` | yes | `assets/item-bases/5429.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr9VerisiumUnique1` |
| 5430 | Runemastered Crucible Tower Shield | `shields_str` | yes | `assets/item-bases/5430.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr9VerisiumUnique2` |
| 5431 | Runemastered Crucible Tower Shield | `shields_str` | yes | `assets/item-bases/5431.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr9VerisiumUnique3` |
| 5432 | Runemastered Crucible Tower Shield | `shields_str` | yes | `assets/item-bases/5432.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr9VerisiumUnique4` |
| 5433 | Runemastered Blacksteel Tower Shield | `shields_str` | yes | `assets/item-bases/5433.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr13VerisiumUnique1` |
| 5434 | Runemastered Vaal Tower Shield | `shields_str` | yes | `assets/item-bases/5434.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStr8EndgameVerisiumUnique1` |
| 5435 | Runemastered Glacial Fortress | `shields_str` | yes | `assets/item-bases/5435.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrUnique1VerisiumUnique1` |
| 5436 | Runemastered Hardwood Targe | `shields_str_dex` | yes | `assets/item-bases/5436.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex1VerisiumUnique1` |
| 5437 | Runemastered Crescent Targe | `shields_str_dex` | yes | `assets/item-bases/5437.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDex4VerisiumUnique1` |
| 5438 | Runemastered Blazon Crest Shield | `shields_str_int` | yes | `assets/item-bases/5438.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt1VerisiumUnique1` |
| 5439 | Runemastered Sigil Crest Shield | `shields_str_int` | yes | `assets/item-bases/5439.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt2VerisiumUnique1` |
| 5440 | Runemastered Emblem Crest Shield | `shields_str_int` | yes | `assets/item-bases/5440.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt3VerisiumUnique1` |
| 5441 | Runemastered Jingling Crest Shield | `shields_str_int` | yes | `assets/item-bases/5441.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt4VerisiumUnique1` |
| 5442 | Runemastered Omen Crest Shield | `shields_str_int` | yes | `assets/item-bases/5442.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt6VerisiumUnique1` |
| 5443 | Runemastered Leather Buckler | `bucklers` | yes | `assets/item-bases/5443.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex1VerisiumUnique1` |
| 5444 | Runemastered Wooden Buckler | `bucklers` | yes | `assets/item-bases/5444.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex2VerisiumUnique1` |
| 5445 | Runemastered Plated Buckler | `bucklers` | yes | `assets/item-bases/5445.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex3VerisiumUnique1` |
| 5446 | Runemastered Iron Buckler | `bucklers` | yes | `assets/item-bases/5446.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex4VerisiumUnique1` |
| 5447 | Runemastered Ridged Buckler | `bucklers` | yes | `assets/item-bases/5447.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex5VerisiumUnique1` |
| 5448 | Runemastered Spiked Buckler | `bucklers` | yes | `assets/item-bases/5448.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex6VerisiumUnique1` |
| 5449 | Runemastered Ornate Buckler | `bucklers` | yes | `assets/item-bases/5449.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex11VerisiumUnique1` |
| 5450 | Runemastered Array Buckler | `bucklers` | yes | `assets/item-bases/5450.png` | missing | `Metadata/Items/Armours/Shields/FourShieldDex12VerisiumUnique1` |
| 5451 | Runemastered Venerable Defender | `shields_str_dex` | yes | `assets/item-bases/5451.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDexUnique1VerisiumUnique1` |
| 5452 | Runemastered Venerable Defender | `shields_str_dex` | yes | `assets/item-bases/5452.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDexUnique1VerisiumUnique2` |
| 5454 | Runemastered Venerable Defender | `shields_str_dex` | yes | `assets/item-bases/5454.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrDexUnique1VerisiumUnique4` |
| 5455 | Runemastered Intricate Crest Shield | `shields_str_int` | yes | `assets/item-bases/5455.png` | missing | `Metadata/Items/Armours/Shields/FourShieldStrInt2EndgameVerisiumUnique1` |
| 5456 | Runemastered Twig Focus | `foci` | yes | `assets/item-bases/5456.png` | missing | `Metadata/Items/Armours/Focii/FourFocus1VerisiumUnique1` |
| 5457 | Runemastered Woven Focus | `foci` | yes | `assets/item-bases/5457.png` | missing | `Metadata/Items/Armours/Focii/FourFocus2VerisiumUnique1` |
| 5458 | Runemastered Antler Focus | `foci` | yes | `assets/item-bases/5458.png` | missing | `Metadata/Items/Armours/Focii/FourFocus3VerisiumUnique1` |
| 5459 | Runemastered Engraved Focus | `foci` | yes | `assets/item-bases/5459.png` | missing | `Metadata/Items/Armours/Focii/FourFocus4VerisiumUnique1` |
| 5460 | Runemastered Tonal Focus | `foci` | yes | `assets/item-bases/5460.png` | missing | `Metadata/Items/Armours/Focii/FourFocus5VerisiumUnique1` |
| 5461 | Runemastered Crystal Focus | `foci` | yes | `assets/item-bases/5461.png` | missing | `Metadata/Items/Armours/Focii/FourFocus6VerisiumUnique1` |
| 5462 | Runemastered Voodoo Focus | `foci` | yes | `assets/item-bases/5462.png` | missing | `Metadata/Items/Armours/Focii/FourFocus7VerisiumUnique1` |
| 5463 | Runemastered Plumed Focus | `foci` | yes | `assets/item-bases/5463.png` | missing | `Metadata/Items/Armours/Focii/FourFocus8VerisiumUnique1` |
| 5464 | Runemastered Primal Markings | `body_armours_dex_int` | yes | `assets/item-bases/5464.png` | missing | `Metadata/Items/Armours/BodyArmours/FourBodyDexIntUnique1VerisiumUnique1` |

## Craft-icon assets

All known definitions are grouped by their shared `iconId`. Definition entries include stable IDs, source item IDs when available, display names, categories, implementation status, and current/supported flags.

| Icon ID | Required asset | Status | Known definitions | Current | Supported | Definitions |
|---|---|---|---:|---:|---:|---|
| `abyss-essence` | `assets/icons/abyss-essence.png` | missing | 1 | 1 | 1 | `essence-abyss`; source `143` — Essence of the Abyss (abyss; implemented; supported; current) |
| `abyssal-echoes` | `assets/icons/abyssal-echoes.png` | missing | 1 | 1 | 1 | `omen-abyssal-echoes`; source `4449` — Omen of Abyssal Echoes (ritual; implemented; supported; current) |
| `alchemy` | `assets/icons/alchemy.png` | existing | 1 | 1 | 1 | `alchemy`; source `9` — Orb of Alchemy (currency; implemented; supported; current) |
| `ancient-collarbone` | `assets/icons/ancient-collarbone.png` | missing | 1 | 1 | 1 | `ancient-collarbone`; source `4863` — Ancient Collarbone (abyss; implemented; supported; current) |
| `ancient-jawbone` | `assets/icons/ancient-jawbone.png` | missing | 1 | 1 | 1 | `ancient-jawbone`; source `4857` — Ancient Jawbone (abyss; implemented; supported; current) |
| `ancient-rib` | `assets/icons/ancient-rib.png` | missing | 1 | 1 | 1 | `ancient-rib`; source `4860` — Ancient Rib (abyss; implemented; supported; current) |
| `annulment` | `assets/icons/annulment.png` | existing | 1 | 1 | 1 | `annulment`; source `196` — Orb of Annulment (currency; implemented; supported; current) |
| `artificers-orb` | `assets/icons/artificers-orb.png` | missing | 1 | 1 | 1 | `artificers-orb`; source `35` — Artificer's Orb (socketing; implemented; supported; current) |
| `augmentation` | `assets/icons/augmentation.png` | existing | 3 | 3 | 3 | `augmentation`; source `24` — Orb of Augmentation (currency; implemented; supported; current)<br>`greater-augmentation`; source `25` — Greater Orb of Augmentation (currency; implemented; supported; current)<br>`perfect-augmentation`; source `26` — Perfect Orb of Augmentation (currency; implemented; supported; current) |
| `blackblooded` | `assets/icons/blackblooded.png` | missing | 1 | 1 | 0 | `omen-blackblooded`; source `4452` — Omen of the Blackblooded (ritual; blocked_missing_data; current) |
| `breach-essence` | `assets/icons/breach-essence.png` | missing | 1 | 1 | 1 | `essence-breach`; source `144` — Essence of the Breach (breach; implemented; supported; current) |
| `chaos` | `assets/icons/chaos.png` | existing | 3 | 3 | 3 | `chaos`; source `3` — Chaos Orb (currency; implemented; supported; current)<br>`greater-chaos`; source `4` — Greater Chaos Orb (currency; implemented; supported; current)<br>`perfect-chaos`; source `5` — Perfect Chaos Orb (currency; implemented; supported; current) |
| `cranium` | `assets/icons/cranium.png` | missing | 1 | 1 | 1 | `preserved-cranium`; source `4864` — Preserved Cranium (abyss; implemented; supported; current) |
| `dextral-annulment` | `assets/icons/dextral-annulment.png` | missing | 1 | 1 | 1 | `omen-dextral-annulment`; source `4428` — Omen of Dextral Annulment (ritual; implemented; supported; current) |
| `dextral-erasure` | `assets/icons/dextral-erasure.png` | missing | 1 | 1 | 1 | `omen-dextral-erasure`; source `4417` — Omen of Dextral Erasure (ritual; implemented; supported; current) |
| `dextral-necromancy` | `assets/icons/dextral-necromancy.png` | missing | 1 | 1 | 1 | `omen-dextral-necromancy`; source `4456` — Omen of Dextral Necromancy (ritual; implemented; supported; current) |
| `divine` | `assets/icons/divine.png` | existing | 1 | 1 | 1 | `divine`; source `36` — Divine Orb (currency; implemented; supported; current) |
| `essence-100` | `assets/icons/essence-100.png` | missing | 1 | 1 | 1 | `essence-100`; source `100` — Essence of the Mind (essences; implemented; supported; current) |
| `essence-101` | `assets/icons/essence-101.png` | missing | 1 | 1 | 1 | `essence-101`; source `101` — Essence of Enhancement (essences; implemented; supported; current) |
| `essence-102` | `assets/icons/essence-102.png` | missing | 1 | 1 | 1 | `essence-102`; source `102` — Essence of Abrasion (essences; implemented; supported; current) |
| `essence-103` | `assets/icons/essence-103.png` | missing | 1 | 1 | 1 | `essence-103`; source `103` — Essence of Flames (essences; implemented; supported; current) |
| `essence-104` | `assets/icons/essence-104.png` | missing | 1 | 1 | 1 | `essence-104`; source `104` — Essence of Ice (essences; implemented; supported; current) |
| `essence-105` | `assets/icons/essence-105.png` | missing | 1 | 1 | 1 | `essence-105`; source `105` — Essence of Electricity (essences; implemented; supported; current) |
| `essence-106` | `assets/icons/essence-106.png` | missing | 1 | 1 | 1 | `essence-106`; source `106` — Essence of Ruin (essences; implemented; supported; current) |
| `essence-107` | `assets/icons/essence-107.png` | missing | 1 | 1 | 1 | `essence-107`; source `107` — Essence of Battle (essences; implemented; supported; current) |
| `essence-108` | `assets/icons/essence-108.png` | missing | 1 | 1 | 1 | `essence-108`; source `108` — Essence of Sorcery (essences; implemented; supported; current) |
| `essence-109` | `assets/icons/essence-109.png` | missing | 1 | 1 | 1 | `essence-109`; source `109` — Essence of Haste (essences; implemented; supported; current) |
| `essence-110` | `assets/icons/essence-110.png` | missing | 1 | 1 | 1 | `essence-110`; source `110` — Essence of the Infinite (essences; implemented; supported; current) |
| `essence-111` | `assets/icons/essence-111.png` | missing | 1 | 1 | 1 | `essence-111`; source `111` — Greater Essence of the Body (essences; implemented; supported; current) |
| `essence-112` | `assets/icons/essence-112.png` | missing | 1 | 1 | 1 | `essence-112`; source `112` — Greater Essence of the Mind (essences; implemented; supported; current) |
| `essence-113` | `assets/icons/essence-113.png` | missing | 1 | 1 | 1 | `essence-113`; source `113` — Greater Essence of Enhancement (essences; implemented; supported; current) |
| `essence-114` | `assets/icons/essence-114.png` | missing | 1 | 1 | 1 | `essence-114`; source `114` — Greater Essence of Abrasion (essences; implemented; supported; current) |
| `essence-115` | `assets/icons/essence-115.png` | missing | 1 | 1 | 1 | `essence-115`; source `115` — Greater Essence of Flames (essences; implemented; supported; current) |
| `essence-116` | `assets/icons/essence-116.png` | missing | 1 | 1 | 1 | `essence-116`; source `116` — Greater Essence of Ice (essences; implemented; supported; current) |
| `essence-117` | `assets/icons/essence-117.png` | missing | 1 | 1 | 1 | `essence-117`; source `117` — Greater Essence of Electricity (essences; implemented; supported; current) |
| `essence-118` | `assets/icons/essence-118.png` | missing | 1 | 1 | 1 | `essence-118`; source `118` — Greater Essence of Ruin (essences; implemented; supported; current) |
| `essence-119` | `assets/icons/essence-119.png` | missing | 1 | 1 | 1 | `essence-119`; source `119` — Greater Essence of Battle (essences; implemented; supported; current) |
| `essence-120` | `assets/icons/essence-120.png` | missing | 1 | 1 | 1 | `essence-120`; source `120` — Greater Essence of Sorcery (essences; implemented; supported; current) |
| `essence-121` | `assets/icons/essence-121.png` | missing | 1 | 1 | 1 | `essence-121`; source `121` — Greater Essence of Haste (essences; implemented; supported; current) |
| `essence-122` | `assets/icons/essence-122.png` | missing | 1 | 1 | 1 | `essence-122`; source `122` — Greater Essence of the Infinite (essences; implemented; supported; current) |
| `essence-123` | `assets/icons/essence-123.png` | missing | 1 | 1 | 1 | `essence-123`; source `123` — Perfect Essence of the Body (essences; implemented; supported; current) |
| `essence-124` | `assets/icons/essence-124.png` | missing | 1 | 1 | 1 | `essence-124`; source `124` — Perfect Essence of the Mind (essences; implemented; supported; current) |
| `essence-125` | `assets/icons/essence-125.png` | missing | 1 | 1 | 1 | `essence-125`; source `125` — Perfect Essence of Enhancement (essences; implemented; supported; current) |
| `essence-126` | `assets/icons/essence-126.png` | missing | 1 | 1 | 1 | `essence-126`; source `126` — Perfect Essence of Abrasion (essences; implemented; supported; current) |
| `essence-127` | `assets/icons/essence-127.png` | missing | 1 | 1 | 1 | `essence-127`; source `127` — Perfect Essence of Flames (essences; implemented; supported; current) |
| `essence-128` | `assets/icons/essence-128.png` | missing | 1 | 1 | 1 | `essence-128`; source `128` — Perfect Essence of Ice (essences; implemented; supported; current) |
| `essence-129` | `assets/icons/essence-129.png` | missing | 1 | 1 | 1 | `essence-129`; source `129` — Perfect Essence of Electricity (essences; implemented; supported; current) |
| `essence-130` | `assets/icons/essence-130.png` | missing | 1 | 1 | 1 | `essence-130`; source `130` — Perfect Essence of Ruin (essences; implemented; supported; current) |
| `essence-131` | `assets/icons/essence-131.png` | missing | 1 | 1 | 1 | `essence-131`; source `131` — Perfect Essence of Battle (essences; implemented; supported; current) |
| `essence-132` | `assets/icons/essence-132.png` | missing | 1 | 1 | 1 | `essence-132`; source `132` — Perfect Essence of Sorcery (essences; implemented; supported; current) |
| `essence-133` | `assets/icons/essence-133.png` | missing | 1 | 1 | 1 | `essence-133`; source `133` — Perfect Essence of Haste (essences; implemented; supported; current) |
| `essence-134` | `assets/icons/essence-134.png` | missing | 1 | 1 | 1 | `essence-134`; source `134` — Perfect Essence of the Infinite (essences; implemented; supported; current) |
| `essence-135` | `assets/icons/essence-135.png` | missing | 1 | 1 | 1 | `essence-135`; source `135` — Lesser Essence of Seeking (essences; implemented; supported; current) |
| `essence-136` | `assets/icons/essence-136.png` | missing | 1 | 1 | 1 | `essence-136`; source `136` — Essence of Seeking (essences; implemented; supported; current) |
| `essence-137` | `assets/icons/essence-137.png` | missing | 1 | 1 | 1 | `essence-137`; source `137` — Greater Essence of Seeking (essences; implemented; supported; current) |
| `essence-138` | `assets/icons/essence-138.png` | missing | 1 | 1 | 1 | `essence-138`; source `138` — Perfect Essence of Seeking (essences; implemented; supported; current) |
| `essence-139` | `assets/icons/essence-139.png` | missing | 1 | 1 | 1 | `essence-139`; source `139` — Essence of Hysteria (essences; implemented; supported; current) |
| `essence-140` | `assets/icons/essence-140.png` | missing | 1 | 1 | 1 | `essence-140`; source `140` — Essence of Delirium (essences; implemented; supported; current) |
| `essence-141` | `assets/icons/essence-141.png` | missing | 1 | 1 | 1 | `essence-141`; source `141` — Essence of Horror (essences; implemented; supported; current) |
| `essence-142` | `assets/icons/essence-142.png` | missing | 1 | 1 | 1 | `essence-142`; source `142` — Essence of Insanity (essences; implemented; supported; current) |
| `essence-145` | `assets/icons/essence-145.png` | missing | 1 | 1 | 1 | `essence-145`; source `145` — Lesser Essence of Insulation (essences; implemented; supported; current) |
| `essence-146` | `assets/icons/essence-146.png` | missing | 1 | 1 | 1 | `essence-146`; source `146` — Essence of Insulation (essences; implemented; supported; current) |
| `essence-147` | `assets/icons/essence-147.png` | missing | 1 | 1 | 1 | `essence-147`; source `147` — Greater Essence of Insulation (essences; implemented; supported; current) |
| `essence-148` | `assets/icons/essence-148.png` | missing | 1 | 1 | 1 | `essence-148`; source `148` — Perfect Essence of Insulation (essences; implemented; supported; current) |
| `essence-149` | `assets/icons/essence-149.png` | missing | 1 | 1 | 1 | `essence-149`; source `149` — Lesser Essence of Thawing (essences; implemented; supported; current) |
| `essence-150` | `assets/icons/essence-150.png` | missing | 1 | 1 | 1 | `essence-150`; source `150` — Essence of Thawing (essences; implemented; supported; current) |
| `essence-151` | `assets/icons/essence-151.png` | missing | 1 | 1 | 1 | `essence-151`; source `151` — Greater Essence of Thawing (essences; implemented; supported; current) |
| `essence-152` | `assets/icons/essence-152.png` | missing | 1 | 1 | 1 | `essence-152`; source `152` — Perfect Essence of Thawing (essences; implemented; supported; current) |
| `essence-153` | `assets/icons/essence-153.png` | missing | 1 | 1 | 1 | `essence-153`; source `153` — Lesser Essence of Grounding (essences; implemented; supported; current) |
| `essence-154` | `assets/icons/essence-154.png` | missing | 1 | 1 | 1 | `essence-154`; source `154` — Essence of Grounding (essences; implemented; supported; current) |
| `essence-155` | `assets/icons/essence-155.png` | missing | 1 | 1 | 1 | `essence-155`; source `155` — Greater Essence of Grounding (essences; implemented; supported; current) |
| `essence-156` | `assets/icons/essence-156.png` | missing | 1 | 1 | 1 | `essence-156`; source `156` — Perfect Essence of Grounding (essences; implemented; supported; current) |
| `essence-157` | `assets/icons/essence-157.png` | missing | 1 | 1 | 1 | `essence-157`; source `157` — Lesser Essence of Alacrity (essences; implemented; supported; current) |
| `essence-158` | `assets/icons/essence-158.png` | missing | 1 | 1 | 1 | `essence-158`; source `158` — Essence of Alacrity (essences; implemented; supported; current) |
| `essence-159` | `assets/icons/essence-159.png` | missing | 1 | 1 | 1 | `essence-159`; source `159` — Greater Essence of Alacrity (essences; implemented; supported; current) |
| `essence-160` | `assets/icons/essence-160.png` | missing | 1 | 1 | 1 | `essence-160`; source `160` — Perfect Essence of Alacrity (essences; implemented; supported; current) |
| `essence-161` | `assets/icons/essence-161.png` | missing | 1 | 1 | 1 | `essence-161`; source `161` — Lesser Essence of Opulence (essences; implemented; supported; current) |
| `essence-162` | `assets/icons/essence-162.png` | missing | 1 | 1 | 1 | `essence-162`; source `162` — Essence of Opulence (essences; implemented; supported; current) |
| `essence-163` | `assets/icons/essence-163.png` | missing | 1 | 1 | 1 | `essence-163`; source `163` — Greater Essence of Opulence (essences; implemented; supported; current) |
| `essence-164` | `assets/icons/essence-164.png` | missing | 1 | 1 | 1 | `essence-164`; source `164` — Perfect Essence of Opulence (essences; implemented; supported; current) |
| `essence-165` | `assets/icons/essence-165.png` | missing | 1 | 1 | 1 | `essence-165`; source `165` — Lesser Essence of Command (essences; implemented; supported; current) |
| `essence-166` | `assets/icons/essence-166.png` | missing | 1 | 1 | 1 | `essence-166`; source `166` — Essence of Command (essences; implemented; supported; current) |
| `essence-167` | `assets/icons/essence-167.png` | missing | 1 | 1 | 1 | `essence-167`; source `167` — Greater Essence of Command (essences; implemented; supported; current) |
| `essence-168` | `assets/icons/essence-168.png` | missing | 1 | 1 | 1 | `essence-168`; source `168` — Perfect Essence of Command (essences; implemented; supported; current) |
| `essence-87` | `assets/icons/essence-87.png` | missing | 1 | 1 | 1 | `essence-87`; source `87` — Lesser Essence of the Body (essences; implemented; supported; current) |
| `essence-88` | `assets/icons/essence-88.png` | missing | 1 | 1 | 1 | `essence-88`; source `88` — Lesser Essence of the Mind (essences; implemented; supported; current) |
| `essence-89` | `assets/icons/essence-89.png` | missing | 1 | 1 | 1 | `essence-89`; source `89` — Lesser Essence of Enhancement (essences; implemented; supported; current) |
| `essence-90` | `assets/icons/essence-90.png` | missing | 1 | 1 | 1 | `essence-90`; source `90` — Lesser Essence of Abrasion (essences; implemented; supported; current) |
| `essence-91` | `assets/icons/essence-91.png` | missing | 1 | 1 | 1 | `essence-91`; source `91` — Lesser Essence of Flames (essences; implemented; supported; current) |
| `essence-92` | `assets/icons/essence-92.png` | missing | 1 | 1 | 1 | `essence-92`; source `92` — Lesser Essence of Ice (essences; implemented; supported; current) |
| `essence-93` | `assets/icons/essence-93.png` | missing | 1 | 1 | 1 | `essence-93`; source `93` — Lesser Essence of Electricity (essences; implemented; supported; current) |
| `essence-94` | `assets/icons/essence-94.png` | missing | 1 | 1 | 1 | `essence-94`; source `94` — Lesser Essence of Ruin (essences; implemented; supported; current) |
| `essence-95` | `assets/icons/essence-95.png` | missing | 1 | 1 | 1 | `essence-95`; source `95` — Lesser Essence of Battle (essences; implemented; supported; current) |
| `essence-96` | `assets/icons/essence-96.png` | missing | 1 | 1 | 1 | `essence-96`; source `96` — Lesser Essence of Sorcery (essences; implemented; supported; current) |
| `essence-97` | `assets/icons/essence-97.png` | missing | 1 | 1 | 1 | `essence-97`; source `97` — Lesser Essence of Haste (essences; implemented; supported; current) |
| `essence-98` | `assets/icons/essence-98.png` | missing | 1 | 1 | 1 | `essence-98`; source `98` — Lesser Essence of the Infinite (essences; implemented; supported; current) |
| `essence-99` | `assets/icons/essence-99.png` | missing | 1 | 1 | 1 | `essence-99`; source `99` — Essence of the Body (essences; implemented; supported; current) |
| `exalted` | `assets/icons/exalted.png` | existing | 3 | 3 | 3 | `exalted`; source `18` — Exalted Orb (currency; implemented; supported; current)<br>`greater-exalted`; source `19` — Greater Exalted Orb (currency; implemented; supported; current)<br>`perfect-exalted`; source `20` — Perfect Exalted Orb (currency; implemented; supported; current) |
| `fracturing` | `assets/icons/fracturing.png` | existing | 1 | 1 | 1 | `fracturing`; source `203` — Fracturing Orb (currency; implemented; supported; current) |
| `gnawed-collarbone` | `assets/icons/gnawed-collarbone.png` | missing | 1 | 1 | 1 | `gnawed-collarbone`; source `4861` — Gnawed Collarbone (abyss; implemented; supported; current) |
| `gnawed-jawbone` | `assets/icons/gnawed-jawbone.png` | missing | 1 | 1 | 1 | `gnawed-jawbone`; source `4855` — Gnawed Jawbone (abyss; implemented; supported; current) |
| `gnawed-rib` | `assets/icons/gnawed-rib.png` | missing | 1 | 1 | 1 | `gnawed-rib`; source `4858` — Gnawed Rib (abyss; implemented; supported; current) |
| `hinekora` | `assets/icons/hinekora.png` | existing | 1 | 1 | 1 | `hinekora` — Hinekora's Lock (currency; implemented; supported; current) |
| `liege` | `assets/icons/liege.png` | missing | 1 | 1 | 0 | `omen-liege`; source `4451` — Omen of the Liege (ritual; blocked_missing_data; current) |
| `light` | `assets/icons/light.png` | missing | 1 | 1 | 1 | `omen-light`; source `4454` — Omen of Light (ritual; implemented; supported; current) |
| `omen-dextral-alchemy` | `assets/icons/omen-dextral-alchemy.png` | missing | 1 | 1 | 1 | `omen-dextral-alchemy`; source `4419` — Omen of Dextral Alchemy (ritual; implemented; supported; current) |
| `omen-dextral-coronation` | `assets/icons/omen-dextral-coronation.png` | missing | 1 | 1 | 1 | `omen-dextral-coronation`; source `4421` — Omen of Dextral Coronation (ritual; implemented; supported; current) |
| `omen-dextral-exaltation` | `assets/icons/omen-dextral-exaltation.png` | missing | 1 | 1 | 1 | `omen-dextral-exaltation`; source `4425` — Omen of Dextral Exaltation (ritual; implemented; supported; current) |
| `omen-greater-annulment` | `assets/icons/omen-greater-annulment.png` | missing | 1 | 1 | 1 | `omen-greater-annulment`; source `4426` — Omen of Greater Annulment (ritual; implemented; supported; current) |
| `omen-greater-exaltation` | `assets/icons/omen-greater-exaltation.png` | missing | 1 | 1 | 1 | `omen-greater-exaltation`; source `4423` — Omen of Greater Exaltation (ritual; implemented; supported; current) |
| `omen-sinistral-alchemy` | `assets/icons/omen-sinistral-alchemy.png` | missing | 1 | 1 | 1 | `omen-sinistral-alchemy`; source `4418` — Omen of Sinistral Alchemy (ritual; implemented; supported; current) |
| `omen-sinistral-coronation` | `assets/icons/omen-sinistral-coronation.png` | missing | 1 | 1 | 1 | `omen-sinistral-coronation`; source `4420` — Omen of Sinistral Coronation (ritual; implemented; supported; current) |
| `omen-sinistral-exaltation` | `assets/icons/omen-sinistral-exaltation.png` | missing | 1 | 1 | 1 | `omen-sinistral-exaltation`; source `4424` — Omen of Sinistral Exaltation (ritual; implemented; supported; current) |
| `preserved-collarbone` | `assets/icons/preserved-collarbone.png` | missing | 1 | 1 | 1 | `preserved-collarbone`; source `4862` — Preserved Collarbone (abyss; implemented; supported; current) |
| `preserved-jawbone` | `assets/icons/preserved-jawbone.png` | missing | 1 | 1 | 1 | `preserved-jawbone`; source `4856` — Preserved Jawbone (abyss; implemented; supported; current) |
| `preserved-rib` | `assets/icons/preserved-rib.png` | missing | 1 | 1 | 1 | `preserved-rib`; source `4859` — Preserved Rib (abyss; implemented; supported; current) |
| `regal` | `assets/icons/regal.png` | existing | 3 | 3 | 3 | `greater-regal`; source `22` — Greater Regal Orb (currency; implemented; supported; current)<br>`perfect-regal`; source `23` — Perfect Regal Orb (currency; implemented; supported; current)<br>`regal`; source `21` — Regal Orb (currency; implemented; supported; current) |
| `sanctification` | `assets/icons/sanctification.png` | missing | 1 | 1 | 1 | `omen-sanctification`; source `4445` — Omen of Sanctification (ritual; implemented; supported; current) |
| `sinistral-annulment` | `assets/icons/sinistral-annulment.png` | missing | 1 | 1 | 1 | `omen-sinistral-annulment`; source `4427` — Omen of Sinistral Annulment (ritual; implemented; supported; current) |
| `sinistral-erasure` | `assets/icons/sinistral-erasure.png` | missing | 1 | 1 | 1 | `omen-sinistral-erasure`; source `4416` — Omen of Sinistral Erasure (ritual; implemented; supported; current) |
| `sinistral-necromancy` | `assets/icons/sinistral-necromancy.png` | missing | 1 | 1 | 1 | `omen-sinistral-necromancy`; source `4455` — Omen of Sinistral Necromancy (ritual; implemented; supported; current) |
| `socketable-5072` | `assets/icons/socketable-5072.png` | missing | 1 | 1 | 1 | `socketable-5072`; source `5072` — Lesser Ward Rune (socketing; implemented; supported; current) |
| `socketable-5073` | `assets/icons/socketable-5073.png` | missing | 1 | 1 | 1 | `socketable-5073`; source `5073` — Ward Rune (socketing; implemented; supported; current) |
| `socketable-5074` | `assets/icons/socketable-5074.png` | missing | 1 | 1 | 1 | `socketable-5074`; source `5074` — Greater Ward Rune (socketing; implemented; supported; current) |
| `socketable-5075` | `assets/icons/socketable-5075.png` | missing | 1 | 1 | 1 | `socketable-5075`; source `5075` — Perfect Ward Rune (socketing; implemented; supported; current) |
| `socketable-5076` | `assets/icons/socketable-5076.png` | missing | 1 | 1 | 1 | `socketable-5076`; source `5076` — Lesser Charging Rune (socketing; implemented; supported; current) |
| `socketable-5077` | `assets/icons/socketable-5077.png` | missing | 1 | 1 | 1 | `socketable-5077`; source `5077` — Charging Rune (socketing; implemented; supported; current) |
| `socketable-5078` | `assets/icons/socketable-5078.png` | missing | 1 | 1 | 1 | `socketable-5078`; source `5078` — Greater Charging Rune (socketing; implemented; supported; current) |
| `socketable-5079` | `assets/icons/socketable-5079.png` | missing | 1 | 1 | 1 | `socketable-5079`; source `5079` — Perfect Charging Rune (socketing; implemented; supported; current) |
| `socketable-5080` | `assets/icons/socketable-5080.png` | missing | 1 | 1 | 1 | `socketable-5080`; source `5080` — Warding Rune of Reinforcement (socketing; implemented; supported; current) |
| `socketable-5081` | `assets/icons/socketable-5081.png` | missing | 1 | 1 | 1 | `socketable-5081`; source `5081` — Warding Rune of Protection (socketing; implemented; supported; current) |
| `socketable-5082` | `assets/icons/socketable-5082.png` | missing | 1 | 1 | 1 | `socketable-5082`; source `5082` — Warding Rune of Disintegration (socketing; implemented; supported; current) |
| `socketable-5083` | `assets/icons/socketable-5083.png` | missing | 1 | 1 | 1 | `socketable-5083`; source `5083` — Warding Rune of Desperation (socketing; implemented; supported; current) |
| `socketable-5084` | `assets/icons/socketable-5084.png` | missing | 1 | 1 | 1 | `socketable-5084`; source `5084` — Warding Rune of Symbiosis (socketing; implemented; supported; current) |
| `socketable-5085` | `assets/icons/socketable-5085.png` | missing | 1 | 1 | 1 | `socketable-5085`; source `5085` — Warding Rune of Courage (socketing; implemented; supported; current) |
| `socketable-5086` | `assets/icons/socketable-5086.png` | missing | 1 | 1 | 1 | `socketable-5086`; source `5086` — Warding Rune of Stability (socketing; implemented; supported; current) |
| `socketable-5087` | `assets/icons/socketable-5087.png` | missing | 1 | 1 | 1 | `socketable-5087`; source `5087` — Warding Rune of Glancing (socketing; implemented; supported; current) |
| `socketable-5088` | `assets/icons/socketable-5088.png` | missing | 1 | 1 | 1 | `socketable-5088`; source `5088` — Warding Rune of Heart (socketing; implemented; supported; current) |
| `socketable-5089` | `assets/icons/socketable-5089.png` | missing | 1 | 1 | 1 | `socketable-5089`; source `5089` — Warding Rune of Nourishment (socketing; implemented; supported; current) |
| `socketable-5090` | `assets/icons/socketable-5090.png` | missing | 1 | 1 | 1 | `socketable-5090`; source `5090` — Warding Rune of Annihilation (socketing; implemented; supported; current) |
| `socketable-5091` | `assets/icons/socketable-5091.png` | missing | 1 | 1 | 1 | `socketable-5091`; source `5091` — Warding Rune of Armature (socketing; implemented; supported; current) |
| `socketable-5092` | `assets/icons/socketable-5092.png` | missing | 1 | 1 | 1 | `socketable-5092`; source `5092` — Warding Rune of Obsession (socketing; implemented; supported; current) |
| `socketable-5093` | `assets/icons/socketable-5093.png` | missing | 1 | 1 | 1 | `socketable-5093`; source `5093` — Warding Rune of Equinox (socketing; implemented; supported; current) |
| `socketable-5094` | `assets/icons/socketable-5094.png` | missing | 1 | 1 | 1 | `socketable-5094`; source `5094` — Warding Rune of Salvaging (socketing; implemented; supported; current) |
| `socketable-5095` | `assets/icons/socketable-5095.png` | missing | 1 | 1 | 1 | `socketable-5095`; source `5095` — Warding Rune of Bodyguards (socketing; implemented; supported; current) |
| `socketable-5096` | `assets/icons/socketable-5096.png` | missing | 1 | 1 | 1 | `socketable-5096`; source `5096` — Warding Rune of Hollowing (socketing; implemented; supported; current) |
| `socketable-5097` | `assets/icons/socketable-5097.png` | missing | 1 | 1 | 1 | `socketable-5097`; source `5097` — Passion of Aldur (socketing; implemented; supported; current) |
| `socketable-5098` | `assets/icons/socketable-5098.png` | missing | 1 | 1 | 1 | `socketable-5098`; source `5098` — Breath of Aldur (socketing; implemented; supported; current) |
| `socketable-5099` | `assets/icons/socketable-5099.png` | missing | 1 | 1 | 1 | `socketable-5099`; source `5099` — Ire of Aldur (socketing; implemented; supported; current) |
| `socketable-5100` | `assets/icons/socketable-5100.png` | missing | 1 | 1 | 1 | `socketable-5100`; source `5100` — Betrayal of Aldur (socketing; implemented; supported; current) |
| `socketable-5101` | `assets/icons/socketable-5101.png` | missing | 1 | 1 | 1 | `socketable-5101`; source `5101` — Ancient Rune of Splinters (socketing; implemented; supported; current) |
| `socketable-5102` | `assets/icons/socketable-5102.png` | missing | 1 | 1 | 1 | `socketable-5102`; source `5102` — Ancient Rune of Dueling (socketing; implemented; supported; current) |
| `socketable-5103` | `assets/icons/socketable-5103.png` | missing | 1 | 1 | 1 | `socketable-5103`; source `5103` — Ancient Rune of the Titan (socketing; implemented; supported; current) |
| `socketable-5104` | `assets/icons/socketable-5104.png` | missing | 1 | 1 | 1 | `socketable-5104`; source `5104` — Ancient Rune of Shattering (socketing; implemented; supported; current) |
| `socketable-5105` | `assets/icons/socketable-5105.png` | missing | 1 | 1 | 1 | `socketable-5105`; source `5105` — Ancient Rune of Prowess (socketing; implemented; supported; current) |
| `socketable-5106` | `assets/icons/socketable-5106.png` | missing | 1 | 1 | 1 | `socketable-5106`; source `5106` — Ancient Rune of Control (socketing; implemented; supported; current) |
| `socketable-5107` | `assets/icons/socketable-5107.png` | missing | 1 | 1 | 1 | `socketable-5107`; source `5107` — Ancient Rune of Discovery (socketing; implemented; supported; current) |
| `socketable-5108` | `assets/icons/socketable-5108.png` | missing | 1 | 1 | 1 | `socketable-5108`; source `5108` — Ancient Rune of Decay (socketing; implemented; supported; current) |
| `socketable-5109` | `assets/icons/socketable-5109.png` | missing | 1 | 1 | 1 | `socketable-5109`; source `5109` — Ancient Rune of Witchcraft (socketing; implemented; supported; current) |
| `socketable-5110` | `assets/icons/socketable-5110.png` | missing | 1 | 1 | 1 | `socketable-5110`; source `5110` — Ancient Rune of the Horde (socketing; implemented; supported; current) |
| `socketable-5111` | `assets/icons/socketable-5111.png` | missing | 1 | 1 | 0 | `socketable-5111`; source `5111` — Ancient Rune of Animosity (socketing; blocked_missing_data; current) |
| `socketable-5112` | `assets/icons/socketable-5112.png` | missing | 1 | 1 | 1 | `socketable-5112`; source `5112` — Ancient Rune of Detonation (socketing; implemented; supported; current) |
| `socketable-5113` | `assets/icons/socketable-5113.png` | missing | 1 | 1 | 1 | `socketable-5113`; source `5113` — Ancient Rune of Retaliation (socketing; implemented; supported; current) |
| `socketable-5114` | `assets/icons/socketable-5114.png` | missing | 1 | 1 | 1 | `socketable-5114`; source `5114` — Rune of Vitality (socketing; implemented; supported; current) |
| `socketable-5115` | `assets/icons/socketable-5115.png` | missing | 1 | 1 | 1 | `socketable-5115`; source `5115` — Rune of the Hunt (socketing; implemented; supported; current) |
| `socketable-5116` | `assets/icons/socketable-5116.png` | missing | 1 | 1 | 1 | `socketable-5116`; source `5116` — Rune of Acrobatics (socketing; implemented; supported; current) |
| `socketable-5117` | `assets/icons/socketable-5117.png` | missing | 1 | 1 | 1 | `socketable-5117`; source `5117` — Rune of Culmination (socketing; implemented; supported; current) |
| `socketable-5118` | `assets/icons/socketable-5118.png` | missing | 1 | 1 | 1 | `socketable-5118`; source `5118` — Rune of Renown (socketing; implemented; supported; current) |
| `socketable-5119` | `assets/icons/socketable-5119.png` | missing | 1 | 1 | 1 | `socketable-5119`; source `5119` — Rune of Accumulation (socketing; implemented; supported; current) |
| `socketable-5120` | `assets/icons/socketable-5120.png` | missing | 1 | 1 | 1 | `socketable-5120`; source `5120` — Rune of Foundations (socketing; implemented; supported; current) |
| `socketable-5121` | `assets/icons/socketable-5121.png` | missing | 1 | 1 | 1 | `socketable-5121`; source `5121` — Rune of the Prism (socketing; implemented; supported; current) |
| `socketable-5122` | `assets/icons/socketable-5122.png` | missing | 1 | 1 | 1 | `socketable-5122`; source `5122` — Rune of the Blossom (socketing; implemented; supported; current) |
| `socketable-5123` | `assets/icons/socketable-5123.png` | missing | 1 | 1 | 1 | `socketable-5123`; source `5123` — Rune of Consistency (socketing; implemented; supported; current) |
| `socketable-5124` | `assets/icons/socketable-5124.png` | missing | 1 | 1 | 1 | `socketable-5124`; source `5124` — Rune of Reach (socketing; implemented; supported; current) |
| `socketable-5125` | `assets/icons/socketable-5125.png` | missing | 1 | 1 | 1 | `socketable-5125`; source `5125` — Rune of Vital Flame (socketing; implemented; supported; current) |
| `socketable-5126` | `assets/icons/socketable-5126.png` | missing | 1 | 1 | 1 | `socketable-5126`; source `5126` — Rune of Confrontation (socketing; implemented; supported; current) |
| `socketable-5136` | `assets/icons/socketable-5136.png` | missing | 1 | 1 | 1 | `socketable-5136`; source `5136` — Serle's Triumph (socketing; implemented; supported; current) |
| `socketable-5137` | `assets/icons/socketable-5137.png` | missing | 1 | 1 | 1 | `socketable-5137`; source `5137` — Cadigan's Epiphany (socketing; implemented; supported; current) |
| `socketable-5138` | `assets/icons/socketable-5138.png` | missing | 1 | 1 | 1 | `socketable-5138`; source `5138` — Astrid's Creativity (socketing; implemented; supported; current) |
| `socketable-5139` | `assets/icons/socketable-5139.png` | missing | 1 | 1 | 1 | `socketable-5139`; source `5139` — Uhtred's Sidereus (socketing; implemented; supported; current) |
| `socketable-5140` | `assets/icons/socketable-5140.png` | missing | 1 | 1 | 1 | `socketable-5140`; source `5140` — Kolr's Hunt (socketing; implemented; supported; current) |
| `socketable-5141` | `assets/icons/socketable-5141.png` | missing | 1 | 1 | 1 | `socketable-5141`; source `5141` — Vorana's Carnage (socketing; implemented; supported; current) |
| `socketable-5142` | `assets/icons/socketable-5142.png` | missing | 1 | 1 | 1 | `socketable-5142`; source `5142` — Thrud's Might (socketing; implemented; supported; current) |
| `socketable-5143` | `assets/icons/socketable-5143.png` | missing | 1 | 1 | 1 | `socketable-5143`; source `5143` — Medved's Tending (socketing; implemented; supported; current) |
| `socketable-5144` | `assets/icons/socketable-5144.png` | missing | 1 | 1 | 1 | `socketable-5144`; source `5144` — Katla's Gloom (socketing; implemented; supported; current) |
| `socketable-5145` | `assets/icons/socketable-5145.png` | missing | 1 | 1 | 1 | `socketable-5145`; source `5145` — Aldur's Legacy (socketing; implemented; supported; current) |
| `socketable-5146` | `assets/icons/socketable-5146.png` | missing | 1 | 1 | 1 | `socketable-5146`; source `5146` — Legacy of Bramblejack (socketing; implemented; supported; current) |
| `socketable-5147` | `assets/icons/socketable-5147.png` | missing | 1 | 1 | 1 | `socketable-5147`; source `5147` — Legacy of Blackbraid (socketing; implemented; supported; current) |
| `socketable-5148` | `assets/icons/socketable-5148.png` | missing | 1 | 1 | 1 | `socketable-5148`; source `5148` — Legacy of Edyrns Tusks (socketing; implemented; supported; current) |
| `socketable-5149` | `assets/icons/socketable-5149.png` | missing | 1 | 1 | 1 | `socketable-5149`; source `5149` — Legacy of Kingsguard (socketing; implemented; supported; current) |
| `socketable-5150` | `assets/icons/socketable-5150.png` | missing | 1 | 1 | 1 | `socketable-5150`; source `5150` — Legacy of Bristleboar (socketing; implemented; supported; current) |
| `socketable-5151` | `assets/icons/socketable-5151.png` | missing | 1 | 1 | 1 | `socketable-5151`; source `5151` — Legacy of Foxshade (socketing; implemented; supported; current) |
| `socketable-5152` | `assets/icons/socketable-5152.png` | missing | 1 | 1 | 1 | `socketable-5152`; source `5152` — Legacy of Ashrend (socketing; implemented; supported; current) |
| `socketable-5153` | `assets/icons/socketable-5153.png` | missing | 1 | 1 | 1 | `socketable-5153`; source `5153` — Legacy of Briskwrap (socketing; implemented; supported; current) |
| `socketable-5154` | `assets/icons/socketable-5154.png` | missing | 1 | 1 | 1 | `socketable-5154`; source `5154` — Legacy of The Unleashed (socketing; implemented; supported; current) |
| `socketable-5155` | `assets/icons/socketable-5155.png` | missing | 1 | 1 | 1 | `socketable-5155`; source `5155` — Legacy of Horns of Bynden (socketing; implemented; supported; current) |
| `socketable-5156` | `assets/icons/socketable-5156.png` | missing | 1 | 1 | 1 | `socketable-5156`; source `5156` — Legacy of Wings of Caelyn (socketing; implemented; supported; current) |
| `socketable-5157` | `assets/icons/socketable-5157.png` | missing | 1 | 1 | 1 | `socketable-5157`; source `5157` — Legacy of Ezomyte Peak (socketing; implemented; supported; current) |
| `socketable-5158` | `assets/icons/socketable-5158.png` | missing | 1 | 1 | 1 | `socketable-5158`; source `5158` — Legacy of Deidbell (socketing; implemented; supported; current) |
| `socketable-5159` | `assets/icons/socketable-5159.png` | missing | 1 | 1 | 1 | `socketable-5159`; source `5159` — Legacy of Elevore (socketing; implemented; supported; current) |
| `socketable-5160` | `assets/icons/socketable-5160.png` | missing | 1 | 1 | 1 | `socketable-5160`; source `5160` — Legacy of Starkonja's Head (socketing; implemented; supported; current) |
| `socketable-5161` | `assets/icons/socketable-5161.png` | missing | 1 | 1 | 1 | `socketable-5161`; source `5161` — Legacy of Crown of Thorns (socketing; implemented; supported; current) |
| `socketable-5162` | `assets/icons/socketable-5162.png` | missing | 1 | 1 | 1 | `socketable-5162`; source `5162` — Legacy of Greymake (socketing; implemented; supported; current) |
| `socketable-5163` | `assets/icons/socketable-5163.png` | missing | 1 | 1 | 1 | `socketable-5163`; source `5163` — Legacy of Erian's Cobble (socketing; implemented; supported; current) |
| `socketable-5164` | `assets/icons/socketable-5164.png` | missing | 1 | 1 | 1 | `socketable-5164`; source `5164` — Legacy of The Smiling Knight (socketing; implemented; supported; current) |
| `socketable-5165` | `assets/icons/socketable-5165.png` | missing | 1 | 1 | 1 | `socketable-5165`; source `5165` — Legacy of The Vile Knight (socketing; implemented; supported; current) |
| `socketable-5166` | `assets/icons/socketable-5166.png` | missing | 1 | 1 | 1 | `socketable-5166`; source `5166` — Legacy of Northpaw (socketing; implemented; supported; current) |
| `socketable-5167` | `assets/icons/socketable-5167.png` | missing | 1 | 1 | 1 | `socketable-5167`; source `5167` — Legacy of Candlemaker (socketing; implemented; supported; current) |
| `socketable-5168` | `assets/icons/socketable-5168.png` | missing | 1 | 1 | 1 | `socketable-5168`; source `5168` — Legacy of Deathblow (socketing; implemented; supported; current) |
| `socketable-5169` | `assets/icons/socketable-5169.png` | missing | 1 | 1 | 1 | `socketable-5169`; source `5169` — Legacy of Legionstride (socketing; implemented; supported; current) |
| `socketable-5170` | `assets/icons/socketable-5170.png` | missing | 1 | 1 | 1 | `socketable-5170`; source `5170` — Legacy of Trampletoe (socketing; implemented; supported; current) |
| `socketable-5171` | `assets/icons/socketable-5171.png` | missing | 1 | 1 | 1 | `socketable-5171`; source `5171` — Legacy of Briarpatch (socketing; implemented; supported; current) |
| `socketable-5172` | `assets/icons/socketable-5172.png` | missing | 1 | 1 | 1 | `socketable-5172`; source `5172` — Legacy of Bushwhack (socketing; implemented; supported; current) |
| `socketable-5173` | `assets/icons/socketable-5173.png` | missing | 1 | 1 | 1 | `socketable-5173`; source `5173` — Legacy of Wanderlust (socketing; implemented; supported; current) |
| `socketable-5174` | `assets/icons/socketable-5174.png` | missing | 1 | 1 | 1 | `socketable-5174`; source `5174` — Legacy of The Knight-errant (socketing; implemented; supported; current) |
| `socketable-5175` | `assets/icons/socketable-5175.png` | missing | 1 | 1 | 1 | `socketable-5175`; source `5175` — Legacy of Obern's Bastion (socketing; implemented; supported; current) |
| `socketable-5176` | `assets/icons/socketable-5176.png` | missing | 1 | 1 | 1 | `socketable-5176`; source `5176` — Legacy of Dionadair (socketing; implemented; supported; current) |
| `socketable-5177` | `assets/icons/socketable-5177.png` | missing | 1 | 1 | 1 | `socketable-5177`; source `5177` — Legacy of Wulfsbane (socketing; implemented; supported; current) |
| `socketable-5178` | `assets/icons/socketable-5178.png` | missing | 1 | 1 | 1 | `socketable-5178`; source `5178` — Legacy of Chernobog's Pillar (socketing; implemented; supported; current) |
| `socketable-5179` | `assets/icons/socketable-5179.png` | missing | 1 | 1 | 1 | `socketable-5179`; source `5179` — Legacy of Alkem Eira (socketing; implemented; supported; current) |
| `socketable-5180` | `assets/icons/socketable-5180.png` | missing | 1 | 1 | 1 | `socketable-5180`; source `5180` — Legacy of Oaksworn (socketing; implemented; supported; current) |
| `socketable-5181` | `assets/icons/socketable-5181.png` | missing | 1 | 1 | 1 | `socketable-5181`; source `5181` — Legacy of Dunkelhalt (socketing; implemented; supported; current) |
| `socketable-5182` | `assets/icons/socketable-5182.png` | missing | 1 | 1 | 1 | `socketable-5182`; source `5182` — Legacy of Rondel de Ezo (socketing; implemented; supported; current) |
| `socketable-5183` | `assets/icons/socketable-5183.png` | missing | 1 | 1 | 1 | `socketable-5183`; source `5183` — Legacy of Brynhand's Mark (socketing; implemented; supported; current) |
| `socketable-5184` | `assets/icons/socketable-5184.png` | missing | 1 | 1 | 1 | `socketable-5184`; source `5184` — Legacy of Trenchtimbre (socketing; implemented; supported; current) |
| `socketable-5185` | `assets/icons/socketable-5185.png` | missing | 1 | 1 | 1 | `socketable-5185`; source `5185` — Legacy of Mjölner (socketing; implemented; supported; current) |
| `socketable-5186` | `assets/icons/socketable-5186.png` | missing | 1 | 1 | 1 | `socketable-5186`; source `5186` — Legacy of Twisted Empyrean (socketing; implemented; supported; current) |
| `socketable-5187` | `assets/icons/socketable-5187.png` | missing | 1 | 1 | 1 | `socketable-5187`; source `5187` — Legacy of Hoghunt (socketing; implemented; supported; current) |
| `socketable-5188` | `assets/icons/socketable-5188.png` | missing | 1 | 1 | 1 | `socketable-5188`; source `5188` — Legacy of Hrimnor's Hymn (socketing; implemented; supported; current) |
| `socketable-5189` | `assets/icons/socketable-5189.png` | missing | 1 | 1 | 1 | `socketable-5189`; source `5189` — Legacy of Brain Rattler (socketing; implemented; supported; current) |
| `socketable-5190` | `assets/icons/socketable-5190.png` | missing | 1 | 1 | 1 | `socketable-5190`; source `5190` — Legacy of Lifesprig (socketing; implemented; supported; current) |
| `socketable-5191` | `assets/icons/socketable-5191.png` | missing | 1 | 1 | 1 | `socketable-5191`; source `5191` — Legacy of Duality (socketing; implemented; supported; current) |
| `socketable-5192` | `assets/icons/socketable-5192.png` | missing | 1 | 1 | 1 | `socketable-5192`; source `5192` — Legacy of Tyranny's Grip (socketing; implemented; supported; current) |
| `socketable-5193` | `assets/icons/socketable-5193.png` | missing | 1 | 1 | 1 | `socketable-5193`; source `5193` — Legacy of The Sentry (socketing; implemented; supported; current) |
| `socketable-5194` | `assets/icons/socketable-5194.png` | missing | 1 | 1 | 1 | `socketable-5194`; source `5194` — Legacy of Adonia's Ego (socketing; implemented; supported; current) |
| `socketable-5195` | `assets/icons/socketable-5195.png` | missing | 1 | 1 | 1 | `socketable-5195`; source `5195` — Legacy of Cursecarver (socketing; implemented; supported; current) |
| `socketable-5196` | `assets/icons/socketable-5196.png` | missing | 1 | 1 | 1 | `socketable-5196`; source `5196` — Legacy of Dusk Vigil (socketing; implemented; supported; current) |
| `socketable-5197` | `assets/icons/socketable-5197.png` | missing | 1 | 1 | 1 | `socketable-5197`; source `5197` — Legacy of The Blood Thorn (socketing; implemented; supported; current) |
| `socketable-5198` | `assets/icons/socketable-5198.png` | missing | 1 | 1 | 1 | `socketable-5198`; source `5198` — Legacy of Quill Rain (socketing; implemented; supported; current) |
| `socketable-5199` | `assets/icons/socketable-5199.png` | missing | 1 | 1 | 1 | `socketable-5199`; source `5199` — Legacy of Ironbound (socketing; implemented; supported; current) |
| `socketable-5200` | `assets/icons/socketable-5200.png` | missing | 1 | 1 | 0 | `socketable-5200`; source `5200` — Legacy of Amor Mandragora (socketing; blocked_missing_data; current) |
| `socketable-5201` | `assets/icons/socketable-5201.png` | missing | 1 | 1 | 0 | `socketable-5201`; source `5201` — Legacy of Spiteful Floret (socketing; blocked_missing_data; current) |
| `socketable-5202` | `assets/icons/socketable-5202.png` | missing | 1 | 1 | 1 | `socketable-5202`; source `5202` — Legacy of Svalinn (socketing; implemented; supported; current) |
| `socketable-5203` | `assets/icons/socketable-5203.png` | missing | 1 | 1 | 1 | `socketable-5203`; source `5203` — Legacy of Keeper of the Arc (socketing; implemented; supported; current) |
| `socketable-5204` | `assets/icons/socketable-5204.png` | missing | 1 | 1 | 1 | `socketable-5204`; source `5204` — Legacy of Olrovasara (socketing; implemented; supported; current) |
| `socketable-5205` | `assets/icons/socketable-5205.png` | missing | 1 | 1 | 1 | `socketable-5205`; source `5205` — Legacy of A Worthy Foe (socketing; implemented; supported; current) |
| `socketable-5206` | `assets/icons/socketable-5206.png` | missing | 1 | 1 | 1 | `socketable-5206`; source `5206` — Legacy of Serle's Grit (socketing; implemented; supported; current) |
| `socketable-5207` | `assets/icons/socketable-5207.png` | missing | 1 | 1 | 1 | `socketable-5207`; source `5207` — Legacy of Runeseeker's Call (socketing; implemented; supported; current) |
| `socketable-5208` | `assets/icons/socketable-5208.png` | missing | 1 | 1 | 1 | `socketable-5208`; source `5208` — Legacy of Facebreaker (socketing; implemented; supported; current) |
| `socketable-624` | `assets/icons/socketable-624.png` | missing | 1 | 1 | 1 | `socketable-624`; source `624` — Desert Rune (socketing; implemented; supported; current) |
| `socketable-625` | `assets/icons/socketable-625.png` | missing | 1 | 1 | 1 | `socketable-625`; source `625` — Glacial Rune (socketing; implemented; supported; current) |
| `socketable-626` | `assets/icons/socketable-626.png` | missing | 1 | 1 | 1 | `socketable-626`; source `626` — Storm Rune (socketing; implemented; supported; current) |
| `socketable-627` | `assets/icons/socketable-627.png` | missing | 1 | 1 | 1 | `socketable-627`; source `627` — Iron Rune (socketing; implemented; supported; current) |
| `socketable-628` | `assets/icons/socketable-628.png` | missing | 1 | 1 | 1 | `socketable-628`; source `628` — Body Rune (socketing; implemented; supported; current) |
| `socketable-629` | `assets/icons/socketable-629.png` | missing | 1 | 1 | 1 | `socketable-629`; source `629` — Mind Rune (socketing; implemented; supported; current) |
| `socketable-630` | `assets/icons/socketable-630.png` | missing | 1 | 1 | 1 | `socketable-630`; source `630` — Rebirth Rune (socketing; implemented; supported; current) |
| `socketable-631` | `assets/icons/socketable-631.png` | missing | 1 | 1 | 1 | `socketable-631`; source `631` — Inspiration Rune (socketing; implemented; supported; current) |
| `socketable-632` | `assets/icons/socketable-632.png` | missing | 1 | 1 | 1 | `socketable-632`; source `632` — Stone Rune (socketing; implemented; supported; current) |
| `socketable-633` | `assets/icons/socketable-633.png` | missing | 1 | 1 | 1 | `socketable-633`; source `633` — Vision Rune (socketing; implemented; supported; current) |
| `socketable-634` | `assets/icons/socketable-634.png` | missing | 1 | 1 | 1 | `socketable-634`; source `634` — Lesser Desert Rune (socketing; implemented; supported; current) |
| `socketable-635` | `assets/icons/socketable-635.png` | missing | 1 | 1 | 1 | `socketable-635`; source `635` — Lesser Glacial Rune (socketing; implemented; supported; current) |
| `socketable-636` | `assets/icons/socketable-636.png` | missing | 1 | 1 | 1 | `socketable-636`; source `636` — Lesser Storm Rune (socketing; implemented; supported; current) |
| `socketable-637` | `assets/icons/socketable-637.png` | missing | 1 | 1 | 1 | `socketable-637`; source `637` — Lesser Iron Rune (socketing; implemented; supported; current) |
| `socketable-638` | `assets/icons/socketable-638.png` | missing | 1 | 1 | 1 | `socketable-638`; source `638` — Lesser Body Rune (socketing; implemented; supported; current) |
| `socketable-639` | `assets/icons/socketable-639.png` | missing | 1 | 1 | 1 | `socketable-639`; source `639` — Lesser Mind Rune (socketing; implemented; supported; current) |
| `socketable-640` | `assets/icons/socketable-640.png` | missing | 1 | 1 | 1 | `socketable-640`; source `640` — Lesser Rebirth Rune (socketing; implemented; supported; current) |
| `socketable-641` | `assets/icons/socketable-641.png` | missing | 1 | 1 | 1 | `socketable-641`; source `641` — Lesser Inspiration Rune (socketing; implemented; supported; current) |
| `socketable-642` | `assets/icons/socketable-642.png` | missing | 1 | 1 | 1 | `socketable-642`; source `642` — Lesser Stone Rune (socketing; implemented; supported; current) |
| `socketable-643` | `assets/icons/socketable-643.png` | missing | 1 | 1 | 1 | `socketable-643`; source `643` — Lesser Vision Rune (socketing; implemented; supported; current) |
| `socketable-644` | `assets/icons/socketable-644.png` | missing | 1 | 1 | 1 | `socketable-644`; source `644` — Greater Desert Rune (socketing; implemented; supported; current) |
| `socketable-645` | `assets/icons/socketable-645.png` | missing | 1 | 1 | 1 | `socketable-645`; source `645` — Greater Glacial Rune (socketing; implemented; supported; current) |
| `socketable-646` | `assets/icons/socketable-646.png` | missing | 1 | 1 | 1 | `socketable-646`; source `646` — Greater Storm Rune (socketing; implemented; supported; current) |
| `socketable-647` | `assets/icons/socketable-647.png` | missing | 1 | 1 | 1 | `socketable-647`; source `647` — Greater Iron Rune (socketing; implemented; supported; current) |
| `socketable-648` | `assets/icons/socketable-648.png` | missing | 1 | 1 | 1 | `socketable-648`; source `648` — Greater Body Rune (socketing; implemented; supported; current) |
| `socketable-649` | `assets/icons/socketable-649.png` | missing | 1 | 1 | 1 | `socketable-649`; source `649` — Greater Mind Rune (socketing; implemented; supported; current) |
| `socketable-650` | `assets/icons/socketable-650.png` | missing | 1 | 1 | 1 | `socketable-650`; source `650` — Greater Rebirth Rune (socketing; implemented; supported; current) |
| `socketable-651` | `assets/icons/socketable-651.png` | missing | 1 | 1 | 1 | `socketable-651`; source `651` — Greater Inspiration Rune (socketing; implemented; supported; current) |
| `socketable-652` | `assets/icons/socketable-652.png` | missing | 1 | 1 | 1 | `socketable-652`; source `652` — Greater Stone Rune (socketing; implemented; supported; current) |
| `socketable-653` | `assets/icons/socketable-653.png` | missing | 1 | 1 | 1 | `socketable-653`; source `653` — Greater Vision Rune (socketing; implemented; supported; current) |
| `socketable-654` | `assets/icons/socketable-654.png` | missing | 1 | 1 | 1 | `socketable-654`; source `654` — Perfect Desert Rune (socketing; implemented; supported; current) |
| `socketable-655` | `assets/icons/socketable-655.png` | missing | 1 | 1 | 1 | `socketable-655`; source `655` — Perfect Glacial Rune (socketing; implemented; supported; current) |
| `socketable-656` | `assets/icons/socketable-656.png` | missing | 1 | 1 | 1 | `socketable-656`; source `656` — Perfect Storm Rune (socketing; implemented; supported; current) |
| `socketable-657` | `assets/icons/socketable-657.png` | missing | 1 | 1 | 1 | `socketable-657`; source `657` — Perfect Iron Rune (socketing; implemented; supported; current) |
| `socketable-658` | `assets/icons/socketable-658.png` | missing | 1 | 1 | 1 | `socketable-658`; source `658` — Perfect Body Rune (socketing; implemented; supported; current) |
| `socketable-659` | `assets/icons/socketable-659.png` | missing | 1 | 1 | 1 | `socketable-659`; source `659` — Perfect Mind Rune (socketing; implemented; supported; current) |
| `socketable-660` | `assets/icons/socketable-660.png` | missing | 1 | 1 | 1 | `socketable-660`; source `660` — Perfect Rebirth Rune (socketing; implemented; supported; current) |
| `socketable-661` | `assets/icons/socketable-661.png` | missing | 1 | 1 | 1 | `socketable-661`; source `661` — Perfect Inspiration Rune (socketing; implemented; supported; current) |
| `socketable-662` | `assets/icons/socketable-662.png` | missing | 1 | 1 | 1 | `socketable-662`; source `662` — Perfect Stone Rune (socketing; implemented; supported; current) |
| `socketable-663` | `assets/icons/socketable-663.png` | missing | 1 | 1 | 1 | `socketable-663`; source `663` — Perfect Vision Rune (socketing; implemented; supported; current) |
| `socketable-664` | `assets/icons/socketable-664.png` | missing | 1 | 1 | 1 | `socketable-664`; source `664` — Lesser Robust Rune (socketing; implemented; supported; current) |
| `socketable-665` | `assets/icons/socketable-665.png` | missing | 1 | 1 | 1 | `socketable-665`; source `665` — Robust Rune (socketing; implemented; supported; current) |
| `socketable-666` | `assets/icons/socketable-666.png` | missing | 1 | 1 | 1 | `socketable-666`; source `666` — Greater Robust Rune (socketing; implemented; supported; current) |
| `socketable-667` | `assets/icons/socketable-667.png` | missing | 1 | 1 | 1 | `socketable-667`; source `667` — Perfect Robust Rune (socketing; implemented; supported; current) |
| `socketable-668` | `assets/icons/socketable-668.png` | missing | 1 | 1 | 1 | `socketable-668`; source `668` — Lesser Adept Rune (socketing; implemented; supported; current) |
| `socketable-669` | `assets/icons/socketable-669.png` | missing | 1 | 1 | 1 | `socketable-669`; source `669` — Adept Rune (socketing; implemented; supported; current) |
| `socketable-670` | `assets/icons/socketable-670.png` | missing | 1 | 1 | 1 | `socketable-670`; source `670` — Greater Adept Rune (socketing; implemented; supported; current) |
| `socketable-671` | `assets/icons/socketable-671.png` | missing | 1 | 1 | 1 | `socketable-671`; source `671` — Perfect Adept Rune (socketing; implemented; supported; current) |
| `socketable-672` | `assets/icons/socketable-672.png` | missing | 1 | 1 | 1 | `socketable-672`; source `672` — Lesser Resolve Rune (socketing; implemented; supported; current) |
| `socketable-673` | `assets/icons/socketable-673.png` | missing | 1 | 1 | 1 | `socketable-673`; source `673` — Resolve Rune (socketing; implemented; supported; current) |
| `socketable-674` | `assets/icons/socketable-674.png` | missing | 1 | 1 | 1 | `socketable-674`; source `674` — Greater Resolve Rune (socketing; implemented; supported; current) |
| `socketable-675` | `assets/icons/socketable-675.png` | missing | 1 | 1 | 1 | `socketable-675`; source `675` — Perfect Resolve Rune (socketing; implemented; supported; current) |
| `socketable-676` | `assets/icons/socketable-676.png` | missing | 1 | 1 | 1 | `socketable-676`; source `676` — Lesser Tempered Rune (socketing; implemented; supported; current) |
| `socketable-677` | `assets/icons/socketable-677.png` | missing | 1 | 1 | 1 | `socketable-677`; source `677` — Tempered Rune (socketing; implemented; supported; current) |
| `socketable-678` | `assets/icons/socketable-678.png` | missing | 1 | 1 | 1 | `socketable-678`; source `678` — Greater Tempered Rune (socketing; implemented; supported; current) |
| `socketable-679` | `assets/icons/socketable-679.png` | missing | 1 | 1 | 1 | `socketable-679`; source `679` — Greater Rune of Leadership (socketing; implemented; supported; current) |
| `socketable-680` | `assets/icons/socketable-680.png` | missing | 1 | 1 | 1 | `socketable-680`; source `680` — Greater Rune of Tithing (socketing; implemented; supported; current) |
| `socketable-681` | `assets/icons/socketable-681.png` | missing | 1 | 1 | 1 | `socketable-681`; source `681` — Greater Rune of Alacrity (socketing; implemented; supported; current) |
| `socketable-682` | `assets/icons/socketable-682.png` | missing | 1 | 1 | 1 | `socketable-682`; source `682` — Greater Rune of Nobility (socketing; implemented; supported; current) |
| `socketable-683` | `assets/icons/socketable-683.png` | missing | 1 | 1 | 1 | `socketable-683`; source `683` — Hedgewitch Assandra's Rune of Wisdom (socketing; implemented; supported; current) |
| `socketable-684` | `assets/icons/socketable-684.png` | missing | 1 | 1 | 1 | `socketable-684`; source `684` — Saqawal's Rune of the Sky (socketing; implemented; supported; current) |
| `socketable-685` | `assets/icons/socketable-685.png` | missing | 1 | 1 | 1 | `socketable-685`; source `685` — Fenumus' Rune of Agony (socketing; implemented; supported; current) |
| `socketable-686` | `assets/icons/socketable-686.png` | missing | 1 | 1 | 1 | `socketable-686`; source `686` — Farrul's Rune of Grace (socketing; implemented; supported; current) |
| `socketable-687` | `assets/icons/socketable-687.png` | missing | 1 | 1 | 1 | `socketable-687`; source `687` — Farrul's Rune of the Chase (socketing; implemented; supported; current) |
| `socketable-688` | `assets/icons/socketable-688.png` | missing | 1 | 1 | 1 | `socketable-688`; source `688` — Craiceann's Rune of Warding (socketing; implemented; supported; current) |
| `socketable-689` | `assets/icons/socketable-689.png` | missing | 1 | 1 | 1 | `socketable-689`; source `689` — Saqawal's Rune of Memory (socketing; implemented; supported; current) |
| `socketable-690` | `assets/icons/socketable-690.png` | missing | 1 | 1 | 1 | `socketable-690`; source `690` — Saqawal's Rune of Erosion (socketing; implemented; supported; current) |
| `socketable-691` | `assets/icons/socketable-691.png` | missing | 1 | 1 | 1 | `socketable-691`; source `691` — Farrul's Rune of the Hunt (socketing; implemented; supported; current) |
| `socketable-692` | `assets/icons/socketable-692.png` | missing | 1 | 1 | 1 | `socketable-692`; source `692` — Craiceann's Rune of Recovery (socketing; implemented; supported; current) |
| `socketable-693` | `assets/icons/socketable-693.png` | missing | 1 | 1 | 1 | `socketable-693`; source `693` — Courtesan Mannan's Rune of Cruelty (socketing; implemented; supported; current) |
| `socketable-694` | `assets/icons/socketable-694.png` | missing | 1 | 1 | 1 | `socketable-694`; source `694` — Thane Grannell's Rune of Mastery (socketing; implemented; supported; current) |
| `socketable-695` | `assets/icons/socketable-695.png` | missing | 1 | 1 | 1 | `socketable-695`; source `695` — Fenumus' Rune of Spinning (socketing; implemented; supported; current) |
| `socketable-696` | `assets/icons/socketable-696.png` | missing | 1 | 1 | 1 | `socketable-696`; source `696` — Countess Seske's Rune of Archery (socketing; implemented; supported; current) |
| `socketable-697` | `assets/icons/socketable-697.png` | missing | 1 | 1 | 1 | `socketable-697`; source `697` — Thane Girt's Rune of Wildness (socketing; implemented; supported; current) |
| `socketable-698` | `assets/icons/socketable-698.png` | missing | 1 | 1 | 1 | `socketable-698`; source `698` — Fenumus' Rune of Draining (socketing; implemented; supported; current) |
| `socketable-699` | `assets/icons/socketable-699.png` | missing | 1 | 1 | 1 | `socketable-699`; source `699` — Thane Myrk's Rune of Summer (socketing; implemented; supported; current) |
| `socketable-700` | `assets/icons/socketable-700.png` | missing | 1 | 1 | 1 | `socketable-700`; source `700` — Lady Hestra's Rune of Winter (socketing; implemented; supported; current) |
| `socketable-701` | `assets/icons/socketable-701.png` | missing | 1 | 1 | 1 | `socketable-701`; source `701` — Thane Leld's Rune of Spring (socketing; implemented; supported; current) |
| `socketable-702` | `assets/icons/socketable-702.png` | missing | 1 | 1 | 1 | `socketable-702`; source `702` — The Greatwolf's Rune of Claws (socketing; implemented; supported; current) |
| `socketable-703` | `assets/icons/socketable-703.png` | missing | 1 | 1 | 1 | `socketable-703`; source `703` — The Greatwolf's Rune of Willpower (socketing; implemented; supported; current) |
| `socketable-704` | `assets/icons/socketable-704.png` | missing | 1 | 1 | 1 | `socketable-704`; source `704` — Masterwork Rune (socketing; implemented; supported; current) |
| `socketable-705` | `assets/icons/socketable-705.png` | missing | 1 | 1 | 1 | `socketable-705`; source `705` — Idol of Sirrius (socketing; implemented; supported; current) |
| `socketable-706` | `assets/icons/socketable-706.png` | missing | 1 | 1 | 1 | `socketable-706`; source `706` — Idol of Thruldana (socketing; implemented; supported; current) |
| `socketable-707` | `assets/icons/socketable-707.png` | missing | 1 | 1 | 1 | `socketable-707`; source `707` — Idol of Grold (socketing; implemented; supported; current) |
| `socketable-708` | `assets/icons/socketable-708.png` | missing | 1 | 1 | 1 | `socketable-708`; source `708` — Idol of Eeshta (socketing; implemented; supported; current) |
| `socketable-709` | `assets/icons/socketable-709.png` | missing | 1 | 1 | 1 | `socketable-709`; source `709` — Idol of Egrin (socketing; implemented; supported; current) |
| `socketable-710` | `assets/icons/socketable-710.png` | missing | 1 | 1 | 1 | `socketable-710`; source `710` — Idol of Maxarius (socketing; implemented; supported; current) |
| `socketable-711` | `assets/icons/socketable-711.png` | missing | 1 | 1 | 1 | `socketable-711`; source `711` — Idol of Ralakesh (socketing; implemented; supported; current) |
| `socketable-712` | `assets/icons/socketable-712.png` | missing | 1 | 1 | 1 | `socketable-712`; source `712` — Idol of Greust (socketing; implemented; supported; current) |
| `socketable-713` | `assets/icons/socketable-713.png` | missing | 1 | 1 | 1 | `socketable-713`; source `713` — Idol of Yeena (socketing; implemented; supported; current) |
| `socketable-714` | `assets/icons/socketable-714.png` | missing | 1 | 1 | 1 | `socketable-714`; source `714` — Idol of Eramir (socketing; implemented; supported; current) |
| `socketable-715` | `assets/icons/socketable-715.png` | missing | 1 | 1 | 1 | `socketable-715`; source `715` — Idol of Oak (socketing; implemented; supported; current) |
| `socketable-716` | `assets/icons/socketable-716.png` | missing | 1 | 1 | 1 | `socketable-716`; source `716` — Idol of Alira (socketing; implemented; supported; current) |
| `socketable-717` | `assets/icons/socketable-717.png` | missing | 1 | 1 | 1 | `socketable-717`; source `717` — Idol of Kraityn (socketing; implemented; supported; current) |
| `socketable-718` | `assets/icons/socketable-718.png` | missing | 1 | 1 | 1 | `socketable-718`; source `718` — Idol of Silk (socketing; implemented; supported; current) |
| `socketable-719` | `assets/icons/socketable-719.png` | missing | 1 | 1 | 1 | `socketable-719`; source `719` — Idol of the Sycophant (socketing; implemented; supported; current) |
| `socketable-720` | `assets/icons/socketable-720.png` | missing | 1 | 1 | 1 | `socketable-720`; source `720` — Idol of the Martyr (socketing; implemented; supported; current) |
| `socketable-721` | `assets/icons/socketable-721.png` | missing | 1 | 1 | 1 | `socketable-721`; source `721` — Idol of the Pharisee (socketing; implemented; supported; current) |
| `socketable-722` | `assets/icons/socketable-722.png` | missing | 1 | 1 | 1 | `socketable-722`; source `722` — Panther Idol (socketing; implemented; supported; current) |
| `socketable-723` | `assets/icons/socketable-723.png` | missing | 1 | 1 | 1 | `socketable-723`; source `723` — Hawk Idol (socketing; implemented; supported; current) |
| `socketable-724` | `assets/icons/socketable-724.png` | missing | 1 | 1 | 1 | `socketable-724`; source `724` — Stoat Idol (socketing; implemented; supported; current) |
| `socketable-725` | `assets/icons/socketable-725.png` | missing | 1 | 1 | 1 | `socketable-725`; source `725` — Hayoxi's Soul Core of Heatproofing (socketing; implemented; supported; current) |
| `socketable-726` | `assets/icons/socketable-726.png` | missing | 1 | 1 | 1 | `socketable-726`; source `726` — Zalatl's Soul Core of Insulation (socketing; implemented; supported; current) |
| `socketable-727` | `assets/icons/socketable-727.png` | missing | 1 | 1 | 1 | `socketable-727`; source `727` — Topotante's Soul Core of Dampening (socketing; implemented; supported; current) |
| `socketable-728` | `assets/icons/socketable-728.png` | missing | 1 | 1 | 1 | `socketable-728`; source `728` — Atmohua's Soul Core of Retreat (socketing; implemented; supported; current) |
| `socketable-729` | `assets/icons/socketable-729.png` | missing | 1 | 1 | 1 | `socketable-729`; source `729` — Quipolatl's Soul Core of Flow (socketing; implemented; supported; current) |
| `socketable-730` | `assets/icons/socketable-730.png` | missing | 1 | 1 | 1 | `socketable-730`; source `730` — Tzamoto's Soul Core of Ferocity (socketing; implemented; supported; current) |
| `socketable-731` | `assets/icons/socketable-731.png` | missing | 1 | 1 | 1 | `socketable-731`; source `731` — Uromoti's Soul Core of Attenuation (socketing; implemented; supported; current) |
| `socketable-732` | `assets/icons/socketable-732.png` | missing | 1 | 1 | 1 | `socketable-732`; source `732` — Opiloti's Soul Core of Assault (socketing; implemented; supported; current) |
| `socketable-733` | `assets/icons/socketable-733.png` | missing | 1 | 1 | 1 | `socketable-733`; source `733` — Guatelitzi's Soul Core of Endurance (socketing; implemented; supported; current) |
| `socketable-734` | `assets/icons/socketable-734.png` | missing | 1 | 1 | 1 | `socketable-734`; source `734` — Xopec's Soul Core of Power (socketing; implemented; supported; current) |
| `socketable-735` | `assets/icons/socketable-735.png` | missing | 1 | 1 | 1 | `socketable-735`; source `735` — Estazunti's Soul Core of Convalescence (socketing; implemented; supported; current) |
| `socketable-736` | `assets/icons/socketable-736.png` | missing | 1 | 1 | 1 | `socketable-736`; source `736` — Tacati's Soul Core of Affliction (socketing; implemented; supported; current) |
| `socketable-737` | `assets/icons/socketable-737.png` | missing | 1 | 1 | 1 | `socketable-737`; source `737` — Cholotl's Soul Core of War (socketing; implemented; supported; current) |
| `socketable-738` | `assets/icons/socketable-738.png` | missing | 1 | 1 | 1 | `socketable-738`; source `738` — Citaqualotl's Soul Core of Foulness (socketing; implemented; supported; current) |
| `socketable-739` | `assets/icons/socketable-739.png` | missing | 1 | 1 | 1 | `socketable-739`; source `739` — Xipocado's Soul Core of Dominion (socketing; implemented; supported; current) |
| `socketable-740` | `assets/icons/socketable-740.png` | missing | 1 | 1 | 1 | `socketable-740`; source `740` — Soul Core of Tacati (socketing; implemented; supported; current) |
| `socketable-741` | `assets/icons/socketable-741.png` | missing | 1 | 1 | 1 | `socketable-741`; source `741` — Soul Core of Opiloti (socketing; implemented; supported; current) |
| `socketable-742` | `assets/icons/socketable-742.png` | missing | 1 | 1 | 1 | `socketable-742`; source `742` — Soul Core of Jiquani (socketing; implemented; supported; current) |
| `socketable-743` | `assets/icons/socketable-743.png` | missing | 1 | 1 | 1 | `socketable-743`; source `743` — Soul Core of Zalatl (socketing; implemented; supported; current) |
| `socketable-744` | `assets/icons/socketable-744.png` | missing | 1 | 1 | 1 | `socketable-744`; source `744` — Soul Core of Citaqualotl (socketing; implemented; supported; current) |
| `socketable-745` | `assets/icons/socketable-745.png` | missing | 1 | 1 | 1 | `socketable-745`; source `745` — Soul Core of Puhuarte (socketing; implemented; supported; current) |
| `socketable-746` | `assets/icons/socketable-746.png` | missing | 1 | 1 | 1 | `socketable-746`; source `746` — Soul Core of Tzamoto (socketing; implemented; supported; current) |
| `socketable-747` | `assets/icons/socketable-747.png` | missing | 1 | 1 | 1 | `socketable-747`; source `747` — Soul Core of Xopec (socketing; implemented; supported; current) |
| `socketable-748` | `assets/icons/socketable-748.png` | missing | 1 | 1 | 1 | `socketable-748`; source `748` — Soul Core of Azcapa (socketing; implemented; supported; current) |
| `socketable-749` | `assets/icons/socketable-749.png` | missing | 1 | 1 | 1 | `socketable-749`; source `749` — Soul Core of Topotante (socketing; implemented; supported; current) |
| `socketable-750` | `assets/icons/socketable-750.png` | missing | 1 | 1 | 1 | `socketable-750`; source `750` — Soul Core of Quipolatl (socketing; implemented; supported; current) |
| `socketable-751` | `assets/icons/socketable-751.png` | missing | 1 | 1 | 1 | `socketable-751`; source `751` — Soul Core of Ticaba (socketing; implemented; supported; current) |
| `socketable-752` | `assets/icons/socketable-752.png` | missing | 1 | 1 | 1 | `socketable-752`; source `752` — Soul Core of Atmohua (socketing; implemented; supported; current) |
| `socketable-753` | `assets/icons/socketable-753.png` | missing | 1 | 1 | 1 | `socketable-753`; source `753` — Soul Core of Cholotl (socketing; implemented; supported; current) |
| `socketable-754` | `assets/icons/socketable-754.png` | missing | 1 | 1 | 1 | `socketable-754`; source `754` — Soul Core of Zantipi (socketing; implemented; supported; current) |
| `socketable-755` | `assets/icons/socketable-755.png` | missing | 1 | 1 | 1 | `socketable-755`; source `755` — Snake Idol (socketing; implemented; supported; current) |
| `socketable-756` | `assets/icons/socketable-756.png` | missing | 1 | 1 | 1 | `socketable-756`; source `756` — Primate Idol (socketing; implemented; supported; current) |
| `socketable-757` | `assets/icons/socketable-757.png` | missing | 1 | 1 | 1 | `socketable-757`; source `757` — Owl Idol (socketing; implemented; supported; current) |
| `socketable-758` | `assets/icons/socketable-758.png` | missing | 1 | 1 | 1 | `socketable-758`; source `758` — Cat Idol (socketing; implemented; supported; current) |
| `socketable-759` | `assets/icons/socketable-759.png` | missing | 1 | 1 | 1 | `socketable-759`; source `759` — Wolf Idol (socketing; implemented; supported; current) |
| `socketable-760` | `assets/icons/socketable-760.png` | missing | 1 | 1 | 1 | `socketable-760`; source `760` — Stag Idol (socketing; implemented; supported; current) |
| `socketable-761` | `assets/icons/socketable-761.png` | missing | 1 | 1 | 1 | `socketable-761`; source `761` — Boar Idol (socketing; implemented; supported; current) |
| `socketable-762` | `assets/icons/socketable-762.png` | missing | 1 | 1 | 1 | `socketable-762`; source `762` — Bear Idol (socketing; implemented; supported; current) |
| `socketable-763` | `assets/icons/socketable-763.png` | missing | 1 | 1 | 1 | `socketable-763`; source `763` — Ox Idol (socketing; implemented; supported; current) |
| `socketable-764` | `assets/icons/socketable-764.png` | missing | 1 | 1 | 1 | `socketable-764`; source `764` — Rabbit Idol (socketing; implemented; supported; current) |
| `socketable-765` | `assets/icons/socketable-765.png` | missing | 1 | 1 | 1 | `socketable-765`; source `765` — Fox Idol (socketing; implemented; supported; current) |
| `socketable-766` | `assets/icons/socketable-766.png` | missing | 1 | 1 | 1 | `socketable-766`; source `766` — Amanamu's Gaze (socketing; implemented; supported; current) |
| `socketable-767` | `assets/icons/socketable-767.png` | missing | 1 | 1 | 1 | `socketable-767`; source `767` — Tecrod's Gaze (socketing; implemented; supported; current) |
| `socketable-768` | `assets/icons/socketable-768.png` | missing | 1 | 1 | 1 | `socketable-768`; source `768` — Kurgal's Gaze (socketing; implemented; supported; current) |
| `socketable-769` | `assets/icons/socketable-769.png` | missing | 1 | 1 | 1 | `socketable-769`; source `769` — Ulaman's Gaze (socketing; implemented; supported; current) |
| `socketable-770` | `assets/icons/socketable-770.png` | missing | 1 | 1 | 1 | `socketable-770`; source `770` — Guatelitzi's Thesis (socketing; implemented; supported; current) |
| `socketable-771` | `assets/icons/socketable-771.png` | missing | 1 | 1 | 1 | `socketable-771`; source `771` — Citaqualotl's Thesis (socketing; implemented; supported; current) |
| `socketable-772` | `assets/icons/socketable-772.png` | missing | 1 | 1 | 1 | `socketable-772`; source `772` — Jiquani's Thesis (socketing; implemented; supported; current) |
| `socketable-773` | `assets/icons/socketable-773.png` | missing | 1 | 1 | 1 | `socketable-773`; source `773` — Quipolatl's Thesis (socketing; implemented; supported; current) |
| `socketable-774` | `assets/icons/socketable-774.png` | missing | 1 | 1 | 1 | `socketable-774`; source `774` — Emergent Vigour (socketing; implemented; supported; current) |
| `socketable-775` | `assets/icons/socketable-775.png` | missing | 1 | 1 | 1 | `socketable-775`; source `775` — Emergent Possibility (socketing; implemented; supported; current) |
| `socketable-776` | `assets/icons/socketable-776.png` | missing | 1 | 1 | 1 | `socketable-776`; source `776` — Emergent Protection (socketing; implemented; supported; current) |
| `socketable-777` | `assets/icons/socketable-777.png` | missing | 1 | 1 | 1 | `socketable-777`; source `777` — Emergent Instinct (socketing; implemented; supported; current) |
| `socketable-778` | `assets/icons/socketable-778.png` | missing | 1 | 1 | 1 | `socketable-778`; source `778` — Carved Cunning (socketing; implemented; supported; current) |
| `socketable-779` | `assets/icons/socketable-779.png` | missing | 1 | 1 | 1 | `socketable-779`; source `779` — Carved Majesty (socketing; implemented; supported; current) |
| `socketable-780` | `assets/icons/socketable-780.png` | missing | 1 | 1 | 1 | `socketable-780`; source `780` — Carved Mischief (socketing; implemented; supported; current) |
| `socketable-781` | `assets/icons/socketable-781.png` | missing | 1 | 1 | 1 | `socketable-781`; source `781` — Carved Tenacity (socketing; implemented; supported; current) |
| `socketable-782` | `assets/icons/socketable-782.png` | missing | 1 | 1 | 1 | `socketable-782`; source `782` — Raven-Touched Shard (socketing; implemented; supported; current) |
| `source-item-0` | `assets/icons/source-item-0.png` | missing | 1 | 1 | 0 | `source-item:0`; source `0` — Blacksmith's Whetstone (quality; blocked_missing_data; current) |
| `source-item-1` | `assets/icons/source-item-1.png` | missing | 1 | 1 | 0 | `source-item:1`; source `1` — Arcanist's Etcher (quality; blocked_missing_data; current) |
| `source-item-1093` | `assets/icons/source-item-1093.png` | missing | 1 | 1 | 0 | `source-item:1093`; source `1093` — Diluted Liquid Ire (delirium; blocked_missing_data; current) |
| `source-item-1094` | `assets/icons/source-item-1094.png` | missing | 1 | 1 | 0 | `source-item:1094`; source `1094` — Diluted Liquid Guilt (delirium; blocked_missing_data; current) |
| `source-item-1095` | `assets/icons/source-item-1095.png` | missing | 1 | 1 | 0 | `source-item:1095`; source `1095` — Diluted Liquid Greed (delirium; blocked_missing_data; current) |
| `source-item-1096` | `assets/icons/source-item-1096.png` | missing | 1 | 1 | 0 | `source-item:1096`; source `1096` — Liquid Paranoia (delirium; blocked_missing_data; current) |
| `source-item-1097` | `assets/icons/source-item-1097.png` | missing | 1 | 1 | 0 | `source-item:1097`; source `1097` — Liquid Envy (delirium; blocked_missing_data; current) |
| `source-item-1098` | `assets/icons/source-item-1098.png` | missing | 1 | 1 | 0 | `source-item:1098`; source `1098` — Liquid Disgust (delirium; blocked_missing_data; current) |
| `source-item-1099` | `assets/icons/source-item-1099.png` | missing | 1 | 1 | 0 | `source-item:1099`; source `1099` — Liquid Despair (delirium; blocked_missing_data; current) |
| `source-item-1100` | `assets/icons/source-item-1100.png` | missing | 1 | 1 | 0 | `source-item:1100`; source `1100` — Concentrated Liquid Fear (delirium; blocked_missing_data; current) |
| `source-item-1101` | `assets/icons/source-item-1101.png` | missing | 1 | 1 | 0 | `source-item:1101`; source `1101` — Concentrated Liquid Suffering (delirium; blocked_missing_data; current) |
| `source-item-1102` | `assets/icons/source-item-1102.png` | missing | 1 | 1 | 0 | `source-item:1102`; source `1102` — Concentrated Liquid Isolation (delirium; blocked_missing_data; current) |
| `source-item-1103` | `assets/icons/source-item-1103.png` | missing | 1 | 1 | 0 | `source-item:1103`; source `1103` — Ancient Diluted Liquid Ire (delirium; blocked_missing_data; current) |
| `source-item-1104` | `assets/icons/source-item-1104.png` | missing | 1 | 1 | 0 | `source-item:1104`; source `1104` — Ancient Diluted Liquid Guilt (delirium; blocked_missing_data; current) |
| `source-item-1105` | `assets/icons/source-item-1105.png` | missing | 1 | 1 | 0 | `source-item:1105`; source `1105` — Ancient Diluted Liquid Greed (delirium; blocked_missing_data; current) |
| `source-item-1106` | `assets/icons/source-item-1106.png` | missing | 1 | 1 | 0 | `source-item:1106`; source `1106` — Ancient Liquid Paranoia (delirium; blocked_missing_data; current) |
| `source-item-1107` | `assets/icons/source-item-1107.png` | missing | 1 | 1 | 0 | `source-item:1107`; source `1107` — Ancient Liquid Envy (delirium; blocked_missing_data; current) |
| `source-item-1108` | `assets/icons/source-item-1108.png` | missing | 1 | 1 | 0 | `source-item:1108`; source `1108` — Ancient Liquid Disgust (delirium; blocked_missing_data; current) |
| `source-item-1109` | `assets/icons/source-item-1109.png` | missing | 1 | 1 | 0 | `source-item:1109`; source `1109` — Ancient Liquid Despair (delirium; blocked_missing_data; current) |
| `source-item-1110` | `assets/icons/source-item-1110.png` | missing | 1 | 1 | 0 | `source-item:1110`; source `1110` — Ancient Concentrated Liquid Fear (delirium; blocked_missing_data; current) |
| `source-item-1111` | `assets/icons/source-item-1111.png` | missing | 1 | 1 | 0 | `source-item:1111`; source `1111` — Ancient Concentrated Liquid Suffering (delirium; blocked_missing_data; current) |
| `source-item-1112` | `assets/icons/source-item-1112.png` | missing | 1 | 1 | 0 | `source-item:1112`; source `1112` — Ancient Concentrated Liquid Isolation (delirium; blocked_missing_data; current) |
| `source-item-1113` | `assets/icons/source-item-1113.png` | missing | 1 | 1 | 0 | `source-item:1113`; source `1113` — Potent Liquid Melancholy (delirium; blocked_missing_data; current) |
| `source-item-1114` | `assets/icons/source-item-1114.png` | missing | 1 | 1 | 0 | `source-item:1114`; source `1114` — Potent Liquid Ferocity (delirium; blocked_missing_data; current) |
| `source-item-1115` | `assets/icons/source-item-1115.png` | missing | 1 | 1 | 0 | `source-item:1115`; source `1115` — Potent Liquid Contempt (delirium; blocked_missing_data; current) |
| `source-item-1116` | `assets/icons/source-item-1116.png` | missing | 1 | 1 | 0 | `source-item:1116`; source `1116` — Ancient Potent Liquid Melancholy (delirium; blocked_missing_data; current) |
| `source-item-1117` | `assets/icons/source-item-1117.png` | missing | 1 | 1 | 0 | `source-item:1117`; source `1117` — Ancient Potent Liquid Ferocity (delirium; blocked_missing_data; current) |
| `source-item-1118` | `assets/icons/source-item-1118.png` | missing | 1 | 1 | 0 | `source-item:1118`; source `1118` — Ancient Potent Liquid Contempt (delirium; blocked_missing_data; current) |
| `source-item-1442` | `assets/icons/source-item-1442.png` | missing | 1 | 1 | 0 | `source-item:1442`; source `1442` — Aldur's Saga (ritual; blocked_missing_data; current) |
| `source-item-1443` | `assets/icons/source-item-1443.png` | missing | 1 | 1 | 0 | `source-item:1443`; source `1443` — Medved's Saga (ritual; blocked_missing_data; current) |
| `source-item-1444` | `assets/icons/source-item-1444.png` | missing | 1 | 1 | 0 | `source-item:1444`; source `1444` — Vorana's Saga (ritual; blocked_missing_data; current) |
| `source-item-1445` | `assets/icons/source-item-1445.png` | missing | 1 | 1 | 0 | `source-item:1445`; source `1445` — Uhtred's Saga (ritual; blocked_missing_data; current) |
| `source-item-1446` | `assets/icons/source-item-1446.png` | missing | 1 | 1 | 0 | `source-item:1446`; source `1446` — Olroth's Saga (ritual; blocked_missing_data; current) |
| `source-item-2191` | `assets/icons/source-item-2191.png` | missing | 1 | 1 | 0 | `source-item:2191`; source `2191` — Alloy Crossbow (runeforging; non_item_currency; current) |
| `source-item-277` | `assets/icons/source-item-277.png` | missing | 1 | 1 | 0 | `source-item:277`; source `277` — Flesh Catalyst (breach; blocked_missing_data; current) |
| `source-item-278` | `assets/icons/source-item-278.png` | missing | 1 | 1 | 0 | `source-item:278`; source `278` — Neural Catalyst (breach; blocked_missing_data; current) |
| `source-item-279` | `assets/icons/source-item-279.png` | missing | 1 | 1 | 0 | `source-item:279`; source `279` — Carapace Catalyst (breach; blocked_missing_data; current) |
| `source-item-28` | `assets/icons/source-item-28.png` | missing | 1 | 1 | 0 | `source-item:28`; source `28` — Glassblower's Bauble (quality; blocked_missing_data; current) |
| `source-item-280` | `assets/icons/source-item-280.png` | missing | 1 | 1 | 0 | `source-item:280`; source `280` — Uul-Netol's Catalyst (breach; blocked_missing_data; current) |
| `source-item-281` | `assets/icons/source-item-281.png` | missing | 1 | 1 | 0 | `source-item:281`; source `281` — Xoph's Catalyst (breach; blocked_missing_data; current) |
| `source-item-282` | `assets/icons/source-item-282.png` | missing | 1 | 1 | 0 | `source-item:282`; source `282` — Tul's Catalyst (breach; blocked_missing_data; current) |
| `source-item-283` | `assets/icons/source-item-283.png` | missing | 1 | 1 | 0 | `source-item:283`; source `283` — Esh's Catalyst (breach; blocked_missing_data; current) |
| `source-item-284` | `assets/icons/source-item-284.png` | missing | 1 | 1 | 0 | `source-item:284`; source `284` — Chayula's Catalyst (breach; blocked_missing_data; current) |
| `source-item-285` | `assets/icons/source-item-285.png` | missing | 1 | 1 | 0 | `source-item:285`; source `285` — Reaver Catalyst (breach; blocked_missing_data; current) |
| `source-item-286` | `assets/icons/source-item-286.png` | missing | 1 | 1 | 0 | `source-item:286`; source `286` — Sibilant Catalyst (breach; blocked_missing_data; current) |
| `source-item-287` | `assets/icons/source-item-287.png` | missing | 1 | 1 | 0 | `source-item:287`; source `287` — Skittering Catalyst (breach; blocked_missing_data; current) |
| `source-item-288` | `assets/icons/source-item-288.png` | missing | 1 | 1 | 0 | `source-item:288`; source `288` — Adaptive Catalyst (breach; blocked_missing_data; current) |
| `source-item-289` | `assets/icons/source-item-289.png` | missing | 1 | 1 | 0 | `source-item:289`; source `289` — Necrotic Catalyst (breach; blocked_missing_data; current) |
| `source-item-290` | `assets/icons/source-item-290.png` | missing | 1 | 1 | 0 | `source-item:290`; source `290` — Refined Flesh Catalyst (breach; blocked_missing_data; current) |
| `source-item-291` | `assets/icons/source-item-291.png` | missing | 1 | 1 | 0 | `source-item:291`; source `291` — Refined Neural Catalyst (breach; blocked_missing_data; current) |
| `source-item-292` | `assets/icons/source-item-292.png` | missing | 1 | 1 | 0 | `source-item:292`; source `292` — Refined Carapace Catalyst (breach; blocked_missing_data; current) |
| `source-item-293` | `assets/icons/source-item-293.png` | missing | 1 | 1 | 0 | `source-item:293`; source `293` — Refined Uul-Netol's Catalyst (breach; blocked_missing_data; current) |
| `source-item-294` | `assets/icons/source-item-294.png` | missing | 1 | 1 | 0 | `source-item:294`; source `294` — Refined Xoph's Catalyst (breach; blocked_missing_data; current) |
| `source-item-295` | `assets/icons/source-item-295.png` | missing | 1 | 1 | 0 | `source-item:295`; source `295` — Refined Tul's Catalyst (breach; blocked_missing_data; current) |
| `source-item-296` | `assets/icons/source-item-296.png` | missing | 1 | 1 | 0 | `source-item:296`; source `296` — Refined Esh's Catalyst (breach; blocked_missing_data; current) |
| `source-item-297` | `assets/icons/source-item-297.png` | missing | 1 | 1 | 0 | `source-item:297`; source `297` — Refined Chayula's Catalyst (breach; blocked_missing_data; current) |
| `source-item-298` | `assets/icons/source-item-298.png` | missing | 1 | 1 | 0 | `source-item:298`; source `298` — Refined Reaver Catalyst (breach; blocked_missing_data; current) |
| `source-item-299` | `assets/icons/source-item-299.png` | missing | 1 | 1 | 0 | `source-item:299`; source `299` — Refined Sibilant Catalyst (breach; blocked_missing_data; current) |
| `source-item-300` | `assets/icons/source-item-300.png` | missing | 1 | 1 | 0 | `source-item:300`; source `300` — Refined Skittering Catalyst (breach; blocked_missing_data; current) |
| `source-item-301` | `assets/icons/source-item-301.png` | missing | 1 | 1 | 0 | `source-item:301`; source `301` — Refined Adaptive Catalyst (breach; blocked_missing_data; current) |
| `source-item-302` | `assets/icons/source-item-302.png` | missing | 1 | 1 | 0 | `source-item:302`; source `302` — Refined Necrotic Catalyst (breach; blocked_missing_data; current) |
| `source-item-4402` | `assets/icons/source-item-4402.png` | missing | 1 | 1 | 0 | `source-item:4402`; source `4402` — Elemental Conflux (runeforging; non_item_currency; current) |
| `source-item-4422` | `assets/icons/source-item-4422.png` | missing | 1 | 0 | 0 | `source-item:4422`; source `4422` — Omen of Corruption (ritual; deprecated_for_target_version) |
| `source-item-4433` | `assets/icons/source-item-4433.png` | missing | 1 | 1 | 0 | `source-item:4433`; source `4433` — Omen of Homogenising Exaltation (ritual; blocked_missing_data; current) |
| `source-item-4434` | `assets/icons/source-item-4434.png` | missing | 1 | 1 | 0 | `source-item:4434`; source `4434` — Omen of Homogenising Coronation (ritual; blocked_missing_data; current) |
| `source-item-4438` | `assets/icons/source-item-4438.png` | missing | 1 | 1 | 0 | `source-item:4438`; source `4438` — Omen of the Blessed (ritual; blocked_missing_data; current) |
| `source-item-4439` | `assets/icons/source-item-4439.png` | missing | 1 | 1 | 0 | `source-item:4439`; source `4439` — Omen of Chaotic Rarity (ritual; blocked_missing_data; current) |
| `source-item-4440` | `assets/icons/source-item-4440.png` | missing | 1 | 1 | 0 | `source-item:4440`; source `4440` — Omen of Chaotic Quantity (ritual; blocked_missing_data; current) |
| `source-item-4441` | `assets/icons/source-item-4441.png` | missing | 1 | 1 | 0 | `source-item:4441`; source `4441` — Omen of Chaotic Monsters (ritual; blocked_missing_data; current) |
| `source-item-4442` | `assets/icons/source-item-4442.png` | missing | 1 | 1 | 0 | `source-item:4442`; source `4442` — Omen of Chaotic Effectiveness (ritual; blocked_missing_data; current) |
| `source-item-4446` | `assets/icons/source-item-4446.png` | missing | 1 | 1 | 0 | `source-item:4446`; source `4446` — Omen of Dextral Crystallisation (ritual; blocked_missing_data; current) |
| `source-item-4447` | `assets/icons/source-item-4447.png` | missing | 1 | 1 | 0 | `source-item:4447`; source `4447` — Omen of Sinistral Crystallisation (ritual; blocked_missing_data; current) |
| `source-item-4448` | `assets/icons/source-item-4448.png` | missing | 1 | 1 | 0 | `source-item:4448`; source `4448` — Omen of Catalysing Exaltation (ritual; blocked_missing_data; current) |
| `source-item-4453` | `assets/icons/source-item-4453.png` | missing | 1 | 1 | 0 | `source-item:4453`; source `4453` — Omen of Putrefaction (ritual; blocked_missing_data; current) |
| `source-item-4479` | `assets/icons/source-item-4479.png` | missing | 1 | 1 | 0 | `source-item:4479`; source `4479` — Sacrifice (corruption; non_item_currency; current) |
| `source-item-4865` | `assets/icons/source-item-4865.png` | missing | 1 | 1 | 0 | `source-item:4865`; source `4865` — Preserved Vertebrae (abyss; blocked_missing_data; current) |
| `source-item-4866` | `assets/icons/source-item-4866.png` | missing | 1 | 1 | 0 | `source-item:4866`; source `4866` — Altered Collarbone (breach; blocked_missing_data; current) |
| `source-item-5049` | `assets/icons/source-item-5049.png` | missing | 1 | 1 | 0 | `source-item:5049`; source `5049` — Runic Alloy (runeforging; blocked_missing_data; current) |
| `source-item-5050` | `assets/icons/source-item-5050.png` | missing | 1 | 1 | 0 | `source-item:5050`; source `5050` — Adaptive Alloy (runeforging; blocked_missing_data; current) |
| `source-item-5051` | `assets/icons/source-item-5051.png` | missing | 1 | 1 | 0 | `source-item:5051`; source `5051` — Protective Alloy (runeforging; blocked_missing_data; current) |
| `source-item-5052` | `assets/icons/source-item-5052.png` | missing | 1 | 1 | 0 | `source-item:5052`; source `5052` — Expansive Alloy (runeforging; blocked_missing_data; current) |
| `source-item-5053` | `assets/icons/source-item-5053.png` | missing | 1 | 1 | 0 | `source-item:5053`; source `5053` — Swift Alloy (runeforging; blocked_missing_data; current) |
| `source-item-5054` | `assets/icons/source-item-5054.png` | missing | 1 | 1 | 0 | `source-item:5054`; source `5054` — Cyclonic Alloy (runeforging; blocked_missing_data; current) |
| `source-item-5055` | `assets/icons/source-item-5055.png` | missing | 1 | 1 | 0 | `source-item:5055`; source `5055` — Prismatic Alloy (runeforging; blocked_missing_data; current) |
| `source-item-5056` | `assets/icons/source-item-5056.png` | missing | 1 | 1 | 0 | `source-item:5056`; source `5056` — Mystic Alloy (runeforging; blocked_missing_data; current) |
| `source-item-5057` | `assets/icons/source-item-5057.png` | missing | 1 | 1 | 0 | `source-item:5057`; source `5057` — Sovereign Alloy (runeforging; blocked_missing_data; current) |
| `source-item-5058` | `assets/icons/source-item-5058.png` | missing | 1 | 1 | 0 | `source-item:5058`; source `5058` — Celestial Alloy (runeforging; blocked_missing_data; current) |
| `source-item-5059` | `assets/icons/source-item-5059.png` | missing | 1 | 1 | 0 | `source-item:5059`; source `5059` — Transcendent Alloy (runeforging; blocked_missing_data; current) |
| `source-item-5060` | `assets/icons/source-item-5060.png` | missing | 1 | 1 | 0 | `source-item:5060`; source `5060` — The Runebinder's Alloy (runeforging; blocked_missing_data; current) |
| `source-item-5061` | `assets/icons/source-item-5061.png` | missing | 1 | 1 | 0 | `source-item:5061`; source `5061` — The Runefather's Alloy (runeforging; blocked_missing_data; current) |
| `source-item-5067` | `assets/icons/source-item-5067.png` | missing | 1 | 1 | 0 | `source-item:5067`; source `5067` — Blazing Flux (runeforging; blocked_missing_data; current) |
| `source-item-5068` | `assets/icons/source-item-5068.png` | missing | 1 | 1 | 0 | `source-item:5068`; source `5068` — Chilling Flux (runeforging; blocked_missing_data; current) |
| `source-item-5069` | `assets/icons/source-item-5069.png` | missing | 1 | 1 | 0 | `source-item:5069`; source `5069` — Crackling Flux (runeforging; blocked_missing_data; current) |
| `source-item-5070` | `assets/icons/source-item-5070.png` | missing | 1 | 1 | 0 | `source-item:5070`; source `5070` — Void Flux (runeforging; blocked_missing_data; current) |
| `source-item-5127` | `assets/icons/source-item-5127.png` | missing | 1 | 0 | 0 | `source-item:5127`; source `5127` — [DNT-Unused] Rune of Wild Ferocity (socketing; deprecated_for_target_version) |
| `source-item-5128` | `assets/icons/source-item-5128.png` | missing | 1 | 0 | 0 | `source-item:5128`; source `5128` — [DNT-Unused] Rune of Partnership (socketing; deprecated_for_target_version) |
| `source-item-5129` | `assets/icons/source-item-5129.png` | missing | 1 | 0 | 0 | `source-item:5129`; source `5129` — [DNT-Unused] Rune of Reverberation (socketing; deprecated_for_target_version) |
| `source-item-5130` | `assets/icons/source-item-5130.png` | missing | 1 | 0 | 0 | `source-item:5130`; source `5130` — [DNT-Unused] Rune of Vital Flame (socketing; deprecated_for_target_version) |
| `source-item-5131` | `assets/icons/source-item-5131.png` | missing | 1 | 0 | 0 | `source-item:5131`; source `5131` — [DNT-Unused] Rune of Confrontation (socketing; deprecated_for_target_version) |
| `source-item-5132` | `assets/icons/source-item-5132.png` | missing | 1 | 0 | 0 | `source-item:5132`; source `5132` — [DNT-Unused] Rune of Chance (socketing; deprecated_for_target_version) |
| `source-item-5133` | `assets/icons/source-item-5133.png` | missing | 1 | 0 | 0 | `source-item:5133`; source `5133` — [DNT-Unused] Rune of Confidence (socketing; deprecated_for_target_version) |
| `source-item-5134` | `assets/icons/source-item-5134.png` | missing | 1 | 0 | 0 | `source-item:5134`; source `5134` — [DNT-Unused] Rune of Duplication (socketing; deprecated_for_target_version) |
| `source-item-54` | `assets/icons/source-item-54.png` | missing | 1 | 1 | 0 | `source-item:54`; source `54` — Architect's Orb (corruption; blocked_missing_data; current) |
| `source-item-57` | `assets/icons/source-item-57.png` | missing | 1 | 1 | 0 | `source-item:57`; source `57` — Ancient Infuser (corruption; blocked_missing_data; current) |
| `source-item-6` | `assets/icons/source-item-6.png` | missing | 1 | 1 | 0 | `source-item:6`; source `6` — Armourer's Scrap (quality; blocked_missing_data; current) |
| `source-item-65` | `assets/icons/source-item-65.png` | missing | 1 | 1 | 0 | `source-item:65`; source `65` — Vaal Armourer's Infuser (quality; blocked_missing_data; current) |
| `source-item-66` | `assets/icons/source-item-66.png` | missing | 1 | 1 | 0 | `source-item:66`; source `66` — Vaal Blacksmith's Infuser (quality; blocked_missing_data; current) |
| `source-item-67` | `assets/icons/source-item-67.png` | missing | 1 | 1 | 0 | `source-item:67`; source `67` — Vaal Arcanist's Infuser (quality; blocked_missing_data; current) |
| `source-item-68` | `assets/icons/source-item-68.png` | missing | 1 | 1 | 0 | `source-item:68`; source `68` — Vaal Catalysing Infuser (quality; blocked_missing_data; current) |
| `sovereign` | `assets/icons/sovereign.png` | missing | 1 | 1 | 0 | `omen-sovereign`; source `4450` — Omen of the Sovereign (ritual; blocked_missing_data; current) |
| `transmutation` | `assets/icons/transmutation.png` | existing | 3 | 3 | 3 | `greater-transmutation`; source `14` — Greater Orb of Transmutation (currency; implemented; supported; current)<br>`perfect-transmutation`; source `15` — Perfect Orb of Transmutation (currency; implemented; supported; current)<br>`transmutation`; source `13` — Orb of Transmutation (currency; implemented; supported; current) |
| `vaal` | `assets/icons/vaal.png` | existing | 1 | 1 | 0 | `vaal`; source `52` — Vaal Orb (corruption; probability_unverified; current) |
| `whittling` | `assets/icons/whittling.png` | missing | 1 | 1 | 1 | `omen-whittling`; source `4415` — Omen of Whittling (ritual; implemented; supported; current) |
