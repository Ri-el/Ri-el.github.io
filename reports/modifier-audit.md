# Modifier Audit

Target game version: **0.5.4**

> The source export does not embed a game version. This report audits the checked-in snapshot against the repository’s explicit 0.5.4 target.

## Result

All 7929 legacy modifier rows map uniquely to normalized stable IDs. 520 rows had an internal sequential tier that disagreed with the player-facing required-level rank.

The former overlay matched 6002 rows, skipped 1453 missing and 474 ambiguous rows, and selected the wrong unique source identity for 6 rows.

The five amulet Spirit rows match uniquely and use the normalized amulet class weights. Spirit is rare because its 2400 total weight competes with a 173650 two-sided denominator, not because of an overlay, tag, or rolling defect.

## Spirit effective rows

| Stable ID | Source key | Source group | Display | Source tier | Required level | Values | Legacy weight | Normalized aggregate | Amulet class weight | Effective | Tags | Unique |
|---:|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|---|
| 1140 | IncreasedSpirit5 | 281 | T1 | 4 | 54 | 47–50 | 400 | null | 400 | 400 | none | yes |
| 1139 | IncreasedSpirit4 | 281 | T2 | 5 | 46 | 43–46 | 500 | 500 | 500 | 500 | none | yes |
| 1138 | IncreasedSpirit3 | 281 | T3 | 6 | 33 | 38–42 | 500 | 500 | 500 | 500 | none | yes |
| 1137 | IncreasedSpirit2 | 281 | T4 | 7 | 25 | 34–37 | 500 | 500 | 500 | 500 | none | yes |
| 1136 | IncreasedSpirit1 | 281 | T5 | 8 | 16 | 30–33 | 500 | 500 | 500 | 500 | none | yes |

## Exact Spirit odds

| Roll pool | Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 | Denominator |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Two-sided | Any Spirit tier | 48/3473 | 1.382090% | 72.354167 | 87.007747% | 49.864288% | 24.864473% | 8.053756% | 173650 |
| Two-sided | T1 Spirit (47–50) | 8/3473 | 0.230348% | 434.125000 | 97.720247% | 89.109249% | 79.404582% | 65.874976% | 173650 |
| Prefix-forcing | Any Spirit tier | 12/361 | 3.324100% | 30.083333 | 71.315224% | 18.446384% | 3.402691% | 0.220089% | 72200 |
| Prefix-forcing | T1 Spirit (47–50) | 2/361 | 0.554017% | 180.500000 | 94.595933% | 75.746459% | 57.375260% | 36.584039% | 72200 |

Seeded simulation: 4161/300000 Spirit hits (observed 1.387000%, exact 1.382090%, absolute difference 0.000049096).

## Currency and state coverage

| Operation/state | Applicable | Rolls | Pool | Any Spirit | T1 Spirit | +1 Projectile | +2 Projectile | +3 Projectile | Note |
|---|---|---:|---|---:|---:|---:|---:|---:|---|
| Orb of Transmutation | yes | 0 | none | n/a | n/a | n/a | n/a | n/a | Absent Amulet has 0 Magic prefix and suffix capacity; it becomes Magic without rolling an affix. |
| Orb of Augmentation | no | 0 | none | n/a | n/a | n/a | n/a | n/a | Blocked because Absent Amulet has no Magic affix slots. |
| Regal Orb | yes | 1 | empty-standard | 1.382090% | 0.230348% | 0.287936% | 0.143968% | 0.057587% |  |
| Regal Orb + Sinistral Coronation | yes | 1 | empty-prefix | 3.324100% | 0.554017% | 0.000000% | 0.000000% | 0.000000% |  |
| Regal Orb + Dextral Coronation | yes | 1 | empty-suffix | 0.000000% | 0.000000% | 0.492854% | 0.246427% | 0.098571% |  |
| Exalted Orb (existing +3 Melee) | yes | 1 | existing-melee | 1.388889% | 0.231481% | 0.289352% | 0.144676% | 0.057870% |  |
| Exalted Orb + Sinistral Exaltation | yes | 1 | existing-melee-prefix | 3.324100% | 0.554017% | 0.000000% | 0.000000% | 0.000000% |  |
| Exalted Orb + Dextral Exaltation | yes | 1 | existing-melee-suffix | 0.000000% | 0.000000% | 0.497018% | 0.248509% | 0.099404% |  |
| Chaos Orb (sole modifier removed) | yes | 1 | empty-standard | 1.382090% | 0.230348% | 0.287936% | 0.143968% | 0.057587% |  |
| Greater Chaos Orb (sole modifier removed) | yes | 1 | empty-greater-chaos | 0.973499% | 0.432666% | 0.000000% | 0.270416% | 0.108167% |  |
| Perfect Chaos Orb (sole modifier removed) | yes | 1 | empty-perfect-chaos | 0.618238% | 0.618238% | 0.000000% | 0.000000% | 0.154560% |  |
| Chaos + Sinistral Erasure (Spirit removed; Melee remains) | yes | 1 | existing-melee | 1.388889% | 0.231481% | 0.289352% | 0.144676% | 0.057870% |  |
| Chaos + Dextral Erasure (Melee removed; Spirit remains) | yes | 1 | existing-spirit | 0.000000% | 0.000000% | 0.291971% | 0.145985% | 0.058394% |  |
| Empty Rare audit state | yes | 1 | empty-standard | 1.382090% | 0.230348% | 0.287936% | 0.143968% | 0.057587% |  |
| Existing Spirit blocker state | yes | 1 | existing-spirit | 0.000000% | 0.000000% | 0.291971% | 0.145985% | 0.058394% |  |
| Existing Melee blocker state | yes | 1 | existing-melee | 1.388889% | 0.231481% | 0.289352% | 0.144676% | 0.057870% |  |
| Prefix slots full state | yes | 1 | prefix-slots-full | 0.000000% | 0.000000% | 0.492854% | 0.246427% | 0.098571% |  |
| Suffix slots full state | yes | 1 | suffix-slots-full | 3.324100% | 0.554017% | 0.000000% | 0.000000% | 0.000000% |  |

## Exact roll pools

Each operation above references one of these deduplicated pools. Every group and every candidate contributing to each denominator is listed.

### empty-standard

Rare item with no existing affixes; both sides open.

Denominator: **173650**; minimum modifier level: **0**; side: **both**; existing source IDs: **none**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 48/3473 | 1.382090% | 72.354167 | 87.007747% | 49.864288% | 24.864473% | 8.053756% |
| T1 Spirit (47–50) | 8/3473 | 0.230348% | 434.125000 | 97.720247% | 89.109249% | 79.404582% | 65.874976% |
| +1 Projectile Skills | 10/3473 | 0.287936% | 347.300000 | 97.157668% | 86.573587% | 74.949860% | 59.338312% |
| +2 Projectile Skills | 5/3473 | 0.143968% | 694.600000 | 98.569614% | 93.049764% | 86.582585% | 77.045858% |
| +3 Projectile Skills | 2/3473 | 0.057587% | 1736.500000 | 99.425619% | 97.160898% | 94.402400% | 90.098860% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| prefix | 281 | BaseSpirit | +{0} to Spirit | 2400 | 48/3473 | 1.382090% | source:1140, source:1139, source:1138, source:1137, source:1136 |
| prefix | 880 | EnergyShieldPercent | {0}% increased maximum Energy Shield | 7000 | 140/3473 | 4.031097% | source:171, source:170, source:169, source:168, source:167, source:166, source:165 |
| prefix | 879 | EvasionRatingPercent | {0}% increased Evasion Rating | 7000 | 140/3473 | 4.031097% | source:164, source:163, source:162, source:161, source:160, source:159, source:158 |
| prefix | 84 | IncreasedAccuracy | +{0} to Accuracy Rating | 6000 | 120/3473 | 3.455226% | source:1004, source:1003, source:1002, source:1001, source:1000, source:999, source:998, source:997 |
| prefix | 877 | IncreasedEnergyShield | +{0} to maximum Energy Shield | 10000 | 200/3473 | 5.758710% | source:150, source:149, source:148, source:147, source:146, source:145, source:144, source:143, source:142, source:141 |
| prefix | 73 | IncreasedLife | +{0} to maximum Life | 9000 | 180/3473 | 5.182839% | source:86, source:85, source:84, source:83, source:82, source:81, source:80, source:79, source:78 |
| prefix | 74 | IncreasedMana | +{0} to maximum Mana | 13000 | 260/3473 | 7.486323% | source:106, source:105, source:104, source:103, source:102, source:101, source:100, source:99, source:98, source:97, source:96, source:95, source:94 |
| prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | {0}% increased Armour | 7000 | 140/3473 | 4.031097% | source:157, source:156, source:155, source:154, source:153, source:152, source:151 |
| prefix | 86 | ItemFoundRarityIncreasePrefix | {0}% increased Rarity of Items found | 3000 | 60/3473 | 1.727613% | source:1117, source:1116, source:1115 |
| prefix | 875 | MaximumLifeIncreasePercent | {0}% increased maximum Life | 900 | 18/3473 | 0.518284% | source:93, source:92, source:91 |
| prefix | 876 | MaximumManaIncreasePercent | {0}% increased maximum Mana | 900 | 18/3473 | 0.518284% | source:121, source:120, source:119 |
| prefix | 883 | SpellDamage | {0}% increased Spell Damage | 6000 | 120/3473 | 3.455226% | source:1354, source:1353, source:1352, source:1351, source:1350, source:1349 |
| suffix | 67 | AllAttributes | +{0} to all Attributes | 7200 | 144/3473 | 4.146271% | source:35, source:34, source:33, source:32, source:31, source:30, source:29, source:28, source:27 |
| suffix | 71 | AllResistances | +{0}% to all Elemental Resistances | 4800 | 96/3473 | 2.764181% | source:65, source:64, source:63, source:62, source:61, source:60 |
| suffix | 72 | ChaosResistance | +{0}% to Chaos Resistance | 1500 | 30/3473 | 0.863807% | source:77, source:76, source:75, source:74, source:73, source:72 |
| suffix | 69 | ColdResistance | +{0}% to Cold Resistance | 8000 | 160/3473 | 4.606968% | source:51, source:50, source:49, source:48, source:47, source:46, source:45, source:44 |
| suffix | 253 | CriticalStrikeChanceIncrease | {0}% increased Critical Hit Chance | 3875 | 155/6946 | 2.231500% | source:1029, source:1028, source:1027, source:1026, source:1025, source:1024 |
| suffix | 347 | CriticalStrikeMultiplier | {0}% increased Critical Damage Bonus | 3875 | 155/6946 | 2.231500% | source:1072, source:1071, source:1070, source:1069, source:1068, source:1067 |
| suffix | 881 | DamageTakenGainedAsLife | {0}% of Damage taken Recouped as Life | 2500 | 50/3473 | 1.439678% | source:1331, source:1330, source:1329, source:1328, source:1327 |
| suffix | 49 | Dexterity | +{0} to Dexterity | 8000 | 160/3473 | 4.606968% | source:16, source:15, source:14, source:13, source:12, source:11, source:10, source:9 |
| suffix | 68 | FireResistance | +{0}% to Fire Resistance | 8000 | 160/3473 | 4.606968% | source:43, source:42, source:41, source:40, source:39, source:38, source:37, source:36 |
| suffix | 126 | IncreasedCastSpeed | {0}% increased Cast Speed | 4800 | 96/3473 | 2.764181% | source:16303, source:16302, source:16301, source:16300, source:16299, source:16298 |
| suffix | 59 | IncreaseSocketedGemLevel | +{0} to Level of all Melee Skills | 850 | 17/3473 | 0.489490% | source:854, source:853, source:852 |
| suffix | 252 | IncreaseSocketedGemLevel | +{0} to Level of all Minion Skills | 850 | 17/3473 | 0.489490% | source:838, source:837, source:836 |
| suffix | 695 | IncreaseSocketedGemLevel | +{0} to Level of all Projectile Skills | 850 | 17/3473 | 0.489490% | source:867, source:866, source:865 |
| suffix | 716 | IncreaseSocketedGemLevel | +{0} to Level of all Spell Skills | 850 | 17/3473 | 0.489490% | source:761, source:760, source:759 |
| suffix | 66 | Intelligence | +{0} to Intelligence | 8000 | 160/3473 | 4.606968% | source:25, source:24, source:23, source:22, source:21, source:20, source:19, source:18 |
| suffix | 85 | ItemFoundRarityIncrease | {0}% increased Rarity of Items found | 3000 | 60/3473 | 1.727613% | source:1112, source:1111, source:1110 |
| suffix | 80 | LifeRegeneration | {0} Life Regeneration per second | 10000 | 200/3473 | 5.758710% | source:887, source:886, source:885, source:884, source:883, source:882, source:881, source:880, source:879, source:878 |
| suffix | 70 | LightningResistance | +{0}% to Lightning Resistance | 8000 | 160/3473 | 4.606968% | source:59, source:58, source:57, source:56, source:55, source:54, source:53, source:52 |
| suffix | 81 | ManaRegeneration | {0}% increased Mana Regeneration Rate | 6000 | 120/3473 | 3.455226% | source:905, source:904, source:903, source:902, source:901, source:900 |
| suffix | 882 | PercentDamageGoesToMana | {0}% of Damage taken Recouped as Mana | 2500 | 50/3473 | 1.439678% | source:1336, source:1335, source:1334, source:1333, source:1332 |
| suffix | 48 | Strength | +{0} to Strength | 8000 | 160/3473 | 4.606968% | source:7, source:6, source:5, source:4, source:3, source:2, source:1, source:0 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 1140 | prefix | 281 | BaseSpirit | T1 | 4 | 54 | +{0} to Spirit | 400 | null | 400 | 8/3473 | 0.230348% |
| 1139 | prefix | 281 | BaseSpirit | T2 | 5 | 46 | +{0} to Spirit | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 1138 | prefix | 281 | BaseSpirit | T3 | 6 | 33 | +{0} to Spirit | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 1137 | prefix | 281 | BaseSpirit | T4 | 7 | 25 | +{0} to Spirit | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 1136 | prefix | 281 | BaseSpirit | T5 | 8 | 16 | +{0} to Spirit | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 171 | prefix | 880 | EnergyShieldPercent | T1 | 1 | 75 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 170 | prefix | 880 | EnergyShieldPercent | T2 | 2 | 65 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 169 | prefix | 880 | EnergyShieldPercent | T3 | 3 | 54 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 168 | prefix | 880 | EnergyShieldPercent | T4 | 4 | 46 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 167 | prefix | 880 | EnergyShieldPercent | T5 | 5 | 33 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 166 | prefix | 880 | EnergyShieldPercent | T6 | 6 | 16 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 165 | prefix | 880 | EnergyShieldPercent | T7 | 7 | 2 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 164 | prefix | 879 | EvasionRatingPercent | T1 | 1 | 77 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 163 | prefix | 879 | EvasionRatingPercent | T2 | 2 | 70 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 162 | prefix | 879 | EvasionRatingPercent | T3 | 3 | 54 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 161 | prefix | 879 | EvasionRatingPercent | T4 | 4 | 46 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 160 | prefix | 879 | EvasionRatingPercent | T5 | 5 | 33 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 159 | prefix | 879 | EvasionRatingPercent | T6 | 6 | 16 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 158 | prefix | 879 | EvasionRatingPercent | T7 | 7 | 2 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1004 | prefix | 84 | IncreasedAccuracy | T1 | 2 | 67 | +{0} to Accuracy Rating | 400 | 400 | 400 | 8/3473 | 0.230348% |
| 1003 | prefix | 84 | IncreasedAccuracy | T2 | 3 | 58 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 1002 | prefix | 84 | IncreasedAccuracy | T3 | 4 | 48 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 1001 | prefix | 84 | IncreasedAccuracy | T4 | 5 | 36 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 1000 | prefix | 84 | IncreasedAccuracy | T5 | 6 | 26 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 999 | prefix | 84 | IncreasedAccuracy | T6 | 7 | 18 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 998 | prefix | 84 | IncreasedAccuracy | T7 | 8 | 11 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 997 | prefix | 84 | IncreasedAccuracy | T8 | 9 | 1 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 150 | prefix | 877 | IncreasedEnergyShield | T1 | 1 | 80 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 149 | prefix | 877 | IncreasedEnergyShield | T2 | 2 | 70 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 148 | prefix | 877 | IncreasedEnergyShield | T3 | 3 | 65 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 147 | prefix | 877 | IncreasedEnergyShield | T4 | 4 | 54 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 146 | prefix | 877 | IncreasedEnergyShield | T5 | 5 | 46 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 145 | prefix | 877 | IncreasedEnergyShield | T6 | 6 | 33 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 144 | prefix | 877 | IncreasedEnergyShield | T7 | 7 | 25 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 143 | prefix | 877 | IncreasedEnergyShield | T8 | 8 | 16 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 142 | prefix | 877 | IncreasedEnergyShield | T9 | 9 | 11 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 141 | prefix | 877 | IncreasedEnergyShield | T10 | 10 | 1 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 86 | prefix | 73 | IncreasedLife | T1 | 5 | 60 | +{0} to maximum Life | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 85 | prefix | 73 | IncreasedLife | T2 | 6 | 54 | +{0} to maximum Life | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 84 | prefix | 73 | IncreasedLife | T3 | 7 | 46 | +{0} to maximum Life | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 83 | prefix | 73 | IncreasedLife | T4 | 8 | 38 | +{0} to maximum Life | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 82 | prefix | 73 | IncreasedLife | T5 | 9 | 33 | +{0} to maximum Life | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 81 | prefix | 73 | IncreasedLife | T6 | 10 | 24 | +{0} to maximum Life | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 80 | prefix | 73 | IncreasedLife | T7 | 11 | 16 | +{0} to maximum Life | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 79 | prefix | 73 | IncreasedLife | T8 | 12 | 6 | +{0} to maximum Life | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 78 | prefix | 73 | IncreasedLife | T9 | 13 | 1 | +{0} to maximum Life | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 106 | prefix | 74 | IncreasedMana | T1 | 1 | 82 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 105 | prefix | 74 | IncreasedMana | T2 | 2 | 75 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 104 | prefix | 74 | IncreasedMana | T3 | 3 | 70 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 103 | prefix | 74 | IncreasedMana | T4 | 4 | 65 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 102 | prefix | 74 | IncreasedMana | T5 | 5 | 60 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 101 | prefix | 74 | IncreasedMana | T6 | 6 | 54 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 100 | prefix | 74 | IncreasedMana | T7 | 7 | 46 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 99 | prefix | 74 | IncreasedMana | T8 | 8 | 38 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 98 | prefix | 74 | IncreasedMana | T9 | 9 | 33 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 97 | prefix | 74 | IncreasedMana | T10 | 10 | 25 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 96 | prefix | 74 | IncreasedMana | T11 | 11 | 16 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 95 | prefix | 74 | IncreasedMana | T12 | 12 | 6 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 94 | prefix | 74 | IncreasedMana | T13 | 13 | 1 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 157 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T1 | 1 | 75 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 156 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T2 | 2 | 65 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 155 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T3 | 3 | 54 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 154 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T4 | 4 | 46 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 153 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T5 | 5 | 33 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 152 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T6 | 6 | 16 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 151 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T7 | 7 | 2 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1117 | prefix | 86 | ItemFoundRarityIncreasePrefix | T1 | 1 | 47 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1116 | prefix | 86 | ItemFoundRarityIncreasePrefix | T2 | 2 | 29 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1115 | prefix | 86 | ItemFoundRarityIncreasePrefix | T3 | 3 | 10 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 93 | prefix | 875 | MaximumLifeIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Life | 300 | 300 | 300 | 6/3473 | 0.172761% |
| 92 | prefix | 875 | MaximumLifeIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Life | 300 | 300 | 300 | 6/3473 | 0.172761% |
| 91 | prefix | 875 | MaximumLifeIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Life | 300 | 300 | 300 | 6/3473 | 0.172761% |
| 121 | prefix | 876 | MaximumManaIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Mana | 300 | 300 | 300 | 6/3473 | 0.172761% |
| 120 | prefix | 876 | MaximumManaIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Mana | 300 | 300 | 300 | 6/3473 | 0.172761% |
| 119 | prefix | 876 | MaximumManaIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Mana | 300 | 300 | 300 | 6/3473 | 0.172761% |
| 1354 | prefix | 883 | SpellDamage | T1 | 1 | 75 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1353 | prefix | 883 | SpellDamage | T2 | 2 | 60 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1352 | prefix | 883 | SpellDamage | T3 | 3 | 46 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1351 | prefix | 883 | SpellDamage | T4 | 4 | 33 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1350 | prefix | 883 | SpellDamage | T5 | 5 | 16 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1349 | prefix | 883 | SpellDamage | T6 | 6 | 1 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 35 | suffix | 67 | AllAttributes | T1 | 1 | 82 | +{0} to all Attributes | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 34 | suffix | 67 | AllAttributes | T2 | 2 | 75 | +{0} to all Attributes | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 33 | suffix | 67 | AllAttributes | T3 | 3 | 66 | +{0} to all Attributes | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 32 | suffix | 67 | AllAttributes | T4 | 4 | 55 | +{0} to all Attributes | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 31 | suffix | 67 | AllAttributes | T5 | 5 | 44 | +{0} to all Attributes | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 30 | suffix | 67 | AllAttributes | T6 | 6 | 33 | +{0} to all Attributes | 800 | null | 800 | 16/3473 | 0.460697% |
| 29 | suffix | 67 | AllAttributes | T7 | 7 | 22 | +{0} to all Attributes | 800 | null | 800 | 16/3473 | 0.460697% |
| 28 | suffix | 67 | AllAttributes | T8 | 8 | 11 | +{0} to all Attributes | 800 | null | 800 | 16/3473 | 0.460697% |
| 27 | suffix | 67 | AllAttributes | T9 | 9 | 1 | +{0} to all Attributes | 800 | null | 800 | 16/3473 | 0.460697% |
| 65 | suffix | 71 | AllResistances | T1 | 1 | 80 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 64 | suffix | 71 | AllResistances | T2 | 2 | 68 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 63 | suffix | 71 | AllResistances | T3 | 3 | 54 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 62 | suffix | 71 | AllResistances | T4 | 4 | 40 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 61 | suffix | 71 | AllResistances | T5 | 5 | 26 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 60 | suffix | 71 | AllResistances | T6 | 6 | 12 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 77 | suffix | 72 | ChaosResistance | T1 | 1 | 81 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3473 | 0.143968% |
| 76 | suffix | 72 | ChaosResistance | T2 | 2 | 68 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3473 | 0.143968% |
| 75 | suffix | 72 | ChaosResistance | T3 | 4 | 56 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3473 | 0.143968% |
| 74 | suffix | 72 | ChaosResistance | T4 | 5 | 44 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3473 | 0.143968% |
| 73 | suffix | 72 | ChaosResistance | T5 | 6 | 30 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3473 | 0.143968% |
| 72 | suffix | 72 | ChaosResistance | T6 | 7 | 16 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3473 | 0.143968% |
| 51 | suffix | 69 | ColdResistance | T1 | 1 | 82 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 50 | suffix | 69 | ColdResistance | T2 | 2 | 71 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 49 | suffix | 69 | ColdResistance | T3 | 3 | 60 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 48 | suffix | 69 | ColdResistance | T4 | 4 | 50 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 47 | suffix | 69 | ColdResistance | T5 | 5 | 38 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 46 | suffix | 69 | ColdResistance | T6 | 6 | 26 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 45 | suffix | 69 | ColdResistance | T7 | 7 | 14 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 44 | suffix | 69 | ColdResistance | T8 | 8 | 1 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 1029 | suffix | 253 | CriticalStrikeChanceIncrease | T1 | 1 | 72 | {0}% increased Critical Hit Chance | 125 | 125 | 125 | 5/6946 | 0.071984% |
| 1028 | suffix | 253 | CriticalStrikeChanceIncrease | T2 | 2 | 58 | {0}% increased Critical Hit Chance | 250 | 250 | 250 | 5/3473 | 0.143968% |
| 1027 | suffix | 253 | CriticalStrikeChanceIncrease | T3 | 3 | 44 | {0}% increased Critical Hit Chance | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 1026 | suffix | 253 | CriticalStrikeChanceIncrease | T4 | 4 | 30 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1025 | suffix | 253 | CriticalStrikeChanceIncrease | T5 | 5 | 20 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1024 | suffix | 253 | CriticalStrikeChanceIncrease | T6 | 6 | 5 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1072 | suffix | 347 | CriticalStrikeMultiplier | T1 | 1 | 74 | {0}% increased Critical Damage Bonus | 125 | 125 | 125 | 5/6946 | 0.071984% |
| 1071 | suffix | 347 | CriticalStrikeMultiplier | T2 | 2 | 59 | {0}% increased Critical Damage Bonus | 250 | 250 | 250 | 5/3473 | 0.143968% |
| 1070 | suffix | 347 | CriticalStrikeMultiplier | T3 | 3 | 45 | {0}% increased Critical Damage Bonus | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 1069 | suffix | 347 | CriticalStrikeMultiplier | T4 | 4 | 31 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1068 | suffix | 347 | CriticalStrikeMultiplier | T5 | 5 | 21 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1067 | suffix | 347 | CriticalStrikeMultiplier | T6 | 6 | 8 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1331 | suffix | 881 | DamageTakenGainedAsLife | T1 | 1 | 79 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 1330 | suffix | 881 | DamageTakenGainedAsLife | T2 | 2 | 68 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 1329 | suffix | 881 | DamageTakenGainedAsLife | T3 | 3 | 56 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 1328 | suffix | 881 | DamageTakenGainedAsLife | T4 | 4 | 44 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 1327 | suffix | 881 | DamageTakenGainedAsLife | T5 | 5 | 30 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 16 | suffix | 49 | Dexterity | T1 | 2 | 74 | +{0} to Dexterity | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 15 | suffix | 49 | Dexterity | T2 | 3 | 66 | +{0} to Dexterity | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 14 | suffix | 49 | Dexterity | T3 | 4 | 55 | +{0} to Dexterity | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 13 | suffix | 49 | Dexterity | T4 | 5 | 44 | +{0} to Dexterity | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 12 | suffix | 49 | Dexterity | T5 | 6 | 33 | +{0} to Dexterity | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 11 | suffix | 49 | Dexterity | T6 | 7 | 22 | +{0} to Dexterity | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 10 | suffix | 49 | Dexterity | T7 | 8 | 11 | +{0} to Dexterity | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 9 | suffix | 49 | Dexterity | T8 | 9 | 1 | +{0} to Dexterity | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 43 | suffix | 68 | FireResistance | T1 | 1 | 82 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 42 | suffix | 68 | FireResistance | T2 | 2 | 71 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 41 | suffix | 68 | FireResistance | T3 | 3 | 60 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 40 | suffix | 68 | FireResistance | T4 | 4 | 48 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 39 | suffix | 68 | FireResistance | T5 | 5 | 36 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 38 | suffix | 68 | FireResistance | T6 | 6 | 24 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 37 | suffix | 68 | FireResistance | T7 | 7 | 12 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 36 | suffix | 68 | FireResistance | T8 | 8 | 1 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 16303 | suffix | 126 | IncreasedCastSpeed | T1 | 3 | 66 | {0}% increased Cast Speed | 800 | 800 | 800 | 16/3473 | 0.460697% |
| 16302 | suffix | 126 | IncreasedCastSpeed | T2 | 4 | 60 | {0}% increased Cast Speed | 800 | null | 800 | 16/3473 | 0.460697% |
| 16301 | suffix | 126 | IncreasedCastSpeed | T3 | 5 | 51 | {0}% increased Cast Speed | 800 | null | 800 | 16/3473 | 0.460697% |
| 16300 | suffix | 126 | IncreasedCastSpeed | T4 | 7 | 35 | {0}% increased Cast Speed | 800 | null | 800 | 16/3473 | 0.460697% |
| 16299 | suffix | 126 | IncreasedCastSpeed | T5 | 9 | 18 | {0}% increased Cast Speed | 800 | null | 800 | 16/3473 | 0.460697% |
| 16298 | suffix | 126 | IncreasedCastSpeed | T6 | 11 | 1 | {0}% increased Cast Speed | 800 | null | 800 | 16/3473 | 0.460697% |
| 854 | suffix | 59 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Melee Skills | 100 | 100 | 100 | 2/3473 | 0.057587% |
| 838 | suffix | 252 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Minion Skills | 100 | 100 | 100 | 2/3473 | 0.057587% |
| 867 | suffix | 695 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Projectile Skills | 100 | 100 | 100 | 2/3473 | 0.057587% |
| 761 | suffix | 716 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Spell Skills | 100 | 100 | 100 | 2/3473 | 0.057587% |
| 853 | suffix | 59 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Melee Skills | 250 | 250 | 250 | 5/3473 | 0.143968% |
| 837 | suffix | 252 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Minion Skills | 250 | 250 | 250 | 5/3473 | 0.143968% |
| 866 | suffix | 695 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Projectile Skills | 250 | 250 | 250 | 5/3473 | 0.143968% |
| 760 | suffix | 716 | IncreaseSocketedGemLevel | T2 | 5 | 41 | +{0} to Level of all Spell Skills | 250 | 250 | 250 | 5/3473 | 0.143968% |
| 759 | suffix | 716 | IncreaseSocketedGemLevel | T3 | 7 | 10 | +{0} to Level of all Spell Skills | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 852 | suffix | 59 | IncreaseSocketedGemLevel | T3 | 7 | 5 | +{0} to Level of all Melee Skills | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 836 | suffix | 252 | IncreaseSocketedGemLevel | T3 | 6 | 5 | +{0} to Level of all Minion Skills | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 865 | suffix | 695 | IncreaseSocketedGemLevel | T3 | 7 | 5 | +{0} to Level of all Projectile Skills | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 25 | suffix | 66 | Intelligence | T1 | 2 | 74 | +{0} to Intelligence | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 24 | suffix | 66 | Intelligence | T2 | 3 | 66 | +{0} to Intelligence | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 23 | suffix | 66 | Intelligence | T3 | 4 | 55 | +{0} to Intelligence | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 22 | suffix | 66 | Intelligence | T4 | 5 | 44 | +{0} to Intelligence | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 21 | suffix | 66 | Intelligence | T5 | 6 | 33 | +{0} to Intelligence | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 20 | suffix | 66 | Intelligence | T6 | 7 | 22 | +{0} to Intelligence | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 19 | suffix | 66 | Intelligence | T7 | 8 | 11 | +{0} to Intelligence | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 18 | suffix | 66 | Intelligence | T8 | 9 | 1 | +{0} to Intelligence | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 1112 | suffix | 85 | ItemFoundRarityIncrease | T1 | 1 | 40 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1111 | suffix | 85 | ItemFoundRarityIncrease | T2 | 2 | 24 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1110 | suffix | 85 | ItemFoundRarityIncrease | T3 | 3 | 3 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 887 | suffix | 80 | LifeRegeneration | T1 | 2 | 75 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 886 | suffix | 80 | LifeRegeneration | T2 | 3 | 68 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 885 | suffix | 80 | LifeRegeneration | T3 | 4 | 58 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 884 | suffix | 80 | LifeRegeneration | T4 | 5 | 47 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 883 | suffix | 80 | LifeRegeneration | T5 | 6 | 35 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 882 | suffix | 80 | LifeRegeneration | T6 | 7 | 26 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 881 | suffix | 80 | LifeRegeneration | T7 | 8 | 17 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 880 | suffix | 80 | LifeRegeneration | T8 | 9 | 11 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 879 | suffix | 80 | LifeRegeneration | T9 | 10 | 5 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 878 | suffix | 80 | LifeRegeneration | T10 | 11 | 1 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 59 | suffix | 70 | LightningResistance | T1 | 1 | 82 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 58 | suffix | 70 | LightningResistance | T2 | 2 | 71 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 57 | suffix | 70 | LightningResistance | T3 | 3 | 60 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 56 | suffix | 70 | LightningResistance | T4 | 4 | 49 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 55 | suffix | 70 | LightningResistance | T5 | 5 | 37 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 54 | suffix | 70 | LightningResistance | T6 | 6 | 25 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 53 | suffix | 70 | LightningResistance | T7 | 7 | 13 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 52 | suffix | 70 | LightningResistance | T8 | 8 | 1 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 905 | suffix | 81 | ManaRegeneration | T1 | 1 | 79 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 904 | suffix | 81 | ManaRegeneration | T2 | 2 | 55 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 903 | suffix | 81 | ManaRegeneration | T3 | 3 | 42 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 902 | suffix | 81 | ManaRegeneration | T4 | 4 | 29 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 901 | suffix | 81 | ManaRegeneration | T5 | 5 | 18 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 900 | suffix | 81 | ManaRegeneration | T6 | 6 | 1 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/3473 | 0.575871% |
| 1336 | suffix | 882 | PercentDamageGoesToMana | T1 | 1 | 80 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 1335 | suffix | 882 | PercentDamageGoesToMana | T2 | 2 | 69 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 1334 | suffix | 882 | PercentDamageGoesToMana | T3 | 3 | 57 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 1333 | suffix | 882 | PercentDamageGoesToMana | T4 | 4 | 45 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 1332 | suffix | 882 | PercentDamageGoesToMana | T5 | 5 | 31 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/3473 | 0.287936% |
| 7 | suffix | 48 | Strength | T1 | 2 | 74 | +{0} to Strength | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 6 | suffix | 48 | Strength | T2 | 3 | 66 | +{0} to Strength | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 5 | suffix | 48 | Strength | T3 | 4 | 55 | +{0} to Strength | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 4 | suffix | 48 | Strength | T4 | 5 | 44 | +{0} to Strength | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 3 | suffix | 48 | Strength | T5 | 6 | 33 | +{0} to Strength | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 2 | suffix | 48 | Strength | T6 | 7 | 22 | +{0} to Strength | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 1 | suffix | 48 | Strength | T7 | 8 | 11 | +{0} to Strength | 1000 | null | 1000 | 20/3473 | 0.575871% |
| 0 | suffix | 48 | Strength | T8 | 9 | 1 | +{0} to Strength | 1000 | null | 1000 | 20/3473 | 0.575871% |

### empty-prefix

Rare item with no existing affixes; prefix-forcing roll.

Denominator: **72200**; minimum modifier level: **0**; side: **prefix**; existing source IDs: **none**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 12/361 | 3.324100% | 30.083333 | 71.315224% | 18.446384% | 3.402691% | 0.220089% |
| T1 Spirit (47–50) | 2/361 | 0.554017% | 180.500000 | 94.595933% | 75.746459% | 57.375260% | 36.584039% |
| +1 Projectile Skills | 0/72200 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +2 Projectile Skills | 0/72200 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +3 Projectile Skills | 0/72200 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| prefix | 281 | BaseSpirit | +{0} to Spirit | 2400 | 12/361 | 3.324100% | source:1140, source:1139, source:1138, source:1137, source:1136 |
| prefix | 880 | EnergyShieldPercent | {0}% increased maximum Energy Shield | 7000 | 35/361 | 9.695291% | source:171, source:170, source:169, source:168, source:167, source:166, source:165 |
| prefix | 879 | EvasionRatingPercent | {0}% increased Evasion Rating | 7000 | 35/361 | 9.695291% | source:164, source:163, source:162, source:161, source:160, source:159, source:158 |
| prefix | 84 | IncreasedAccuracy | +{0} to Accuracy Rating | 6000 | 30/361 | 8.310249% | source:1004, source:1003, source:1002, source:1001, source:1000, source:999, source:998, source:997 |
| prefix | 877 | IncreasedEnergyShield | +{0} to maximum Energy Shield | 10000 | 50/361 | 13.850416% | source:150, source:149, source:148, source:147, source:146, source:145, source:144, source:143, source:142, source:141 |
| prefix | 73 | IncreasedLife | +{0} to maximum Life | 9000 | 45/361 | 12.465374% | source:86, source:85, source:84, source:83, source:82, source:81, source:80, source:79, source:78 |
| prefix | 74 | IncreasedMana | +{0} to maximum Mana | 13000 | 65/361 | 18.005540% | source:106, source:105, source:104, source:103, source:102, source:101, source:100, source:99, source:98, source:97, source:96, source:95, source:94 |
| prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | {0}% increased Armour | 7000 | 35/361 | 9.695291% | source:157, source:156, source:155, source:154, source:153, source:152, source:151 |
| prefix | 86 | ItemFoundRarityIncreasePrefix | {0}% increased Rarity of Items found | 3000 | 15/361 | 4.155125% | source:1117, source:1116, source:1115 |
| prefix | 875 | MaximumLifeIncreasePercent | {0}% increased maximum Life | 900 | 9/722 | 1.246537% | source:93, source:92, source:91 |
| prefix | 876 | MaximumManaIncreasePercent | {0}% increased maximum Mana | 900 | 9/722 | 1.246537% | source:121, source:120, source:119 |
| prefix | 883 | SpellDamage | {0}% increased Spell Damage | 6000 | 30/361 | 8.310249% | source:1354, source:1353, source:1352, source:1351, source:1350, source:1349 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 1140 | prefix | 281 | BaseSpirit | T1 | 4 | 54 | +{0} to Spirit | 400 | null | 400 | 2/361 | 0.554017% |
| 1139 | prefix | 281 | BaseSpirit | T2 | 5 | 46 | +{0} to Spirit | 500 | 500 | 500 | 5/722 | 0.692521% |
| 1138 | prefix | 281 | BaseSpirit | T3 | 6 | 33 | +{0} to Spirit | 500 | 500 | 500 | 5/722 | 0.692521% |
| 1137 | prefix | 281 | BaseSpirit | T4 | 7 | 25 | +{0} to Spirit | 500 | 500 | 500 | 5/722 | 0.692521% |
| 1136 | prefix | 281 | BaseSpirit | T5 | 8 | 16 | +{0} to Spirit | 500 | 500 | 500 | 5/722 | 0.692521% |
| 171 | prefix | 880 | EnergyShieldPercent | T1 | 1 | 75 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 170 | prefix | 880 | EnergyShieldPercent | T2 | 2 | 65 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 169 | prefix | 880 | EnergyShieldPercent | T3 | 3 | 54 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 168 | prefix | 880 | EnergyShieldPercent | T4 | 4 | 46 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 167 | prefix | 880 | EnergyShieldPercent | T5 | 5 | 33 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 166 | prefix | 880 | EnergyShieldPercent | T6 | 6 | 16 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 165 | prefix | 880 | EnergyShieldPercent | T7 | 7 | 2 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 164 | prefix | 879 | EvasionRatingPercent | T1 | 1 | 77 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 163 | prefix | 879 | EvasionRatingPercent | T2 | 2 | 70 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 162 | prefix | 879 | EvasionRatingPercent | T3 | 3 | 54 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 161 | prefix | 879 | EvasionRatingPercent | T4 | 4 | 46 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 160 | prefix | 879 | EvasionRatingPercent | T5 | 5 | 33 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 159 | prefix | 879 | EvasionRatingPercent | T6 | 6 | 16 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 158 | prefix | 879 | EvasionRatingPercent | T7 | 7 | 2 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1004 | prefix | 84 | IncreasedAccuracy | T1 | 2 | 67 | +{0} to Accuracy Rating | 400 | 400 | 400 | 2/361 | 0.554017% |
| 1003 | prefix | 84 | IncreasedAccuracy | T2 | 3 | 58 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 1002 | prefix | 84 | IncreasedAccuracy | T3 | 4 | 48 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 1001 | prefix | 84 | IncreasedAccuracy | T4 | 5 | 36 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 1000 | prefix | 84 | IncreasedAccuracy | T5 | 6 | 26 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 999 | prefix | 84 | IncreasedAccuracy | T6 | 7 | 18 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 998 | prefix | 84 | IncreasedAccuracy | T7 | 8 | 11 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 997 | prefix | 84 | IncreasedAccuracy | T8 | 9 | 1 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 150 | prefix | 877 | IncreasedEnergyShield | T1 | 1 | 80 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 149 | prefix | 877 | IncreasedEnergyShield | T2 | 2 | 70 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 148 | prefix | 877 | IncreasedEnergyShield | T3 | 3 | 65 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 147 | prefix | 877 | IncreasedEnergyShield | T4 | 4 | 54 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 146 | prefix | 877 | IncreasedEnergyShield | T5 | 5 | 46 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 145 | prefix | 877 | IncreasedEnergyShield | T6 | 6 | 33 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 144 | prefix | 877 | IncreasedEnergyShield | T7 | 7 | 25 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 143 | prefix | 877 | IncreasedEnergyShield | T8 | 8 | 16 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 142 | prefix | 877 | IncreasedEnergyShield | T9 | 9 | 11 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 141 | prefix | 877 | IncreasedEnergyShield | T10 | 10 | 1 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 86 | prefix | 73 | IncreasedLife | T1 | 5 | 60 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 85 | prefix | 73 | IncreasedLife | T2 | 6 | 54 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 84 | prefix | 73 | IncreasedLife | T3 | 7 | 46 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 83 | prefix | 73 | IncreasedLife | T4 | 8 | 38 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 82 | prefix | 73 | IncreasedLife | T5 | 9 | 33 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 81 | prefix | 73 | IncreasedLife | T6 | 10 | 24 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 80 | prefix | 73 | IncreasedLife | T7 | 11 | 16 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 79 | prefix | 73 | IncreasedLife | T8 | 12 | 6 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 78 | prefix | 73 | IncreasedLife | T9 | 13 | 1 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 106 | prefix | 74 | IncreasedMana | T1 | 1 | 82 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 105 | prefix | 74 | IncreasedMana | T2 | 2 | 75 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 104 | prefix | 74 | IncreasedMana | T3 | 3 | 70 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 103 | prefix | 74 | IncreasedMana | T4 | 4 | 65 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 102 | prefix | 74 | IncreasedMana | T5 | 5 | 60 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 101 | prefix | 74 | IncreasedMana | T6 | 6 | 54 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 100 | prefix | 74 | IncreasedMana | T7 | 7 | 46 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 99 | prefix | 74 | IncreasedMana | T8 | 8 | 38 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 98 | prefix | 74 | IncreasedMana | T9 | 9 | 33 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 97 | prefix | 74 | IncreasedMana | T10 | 10 | 25 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 96 | prefix | 74 | IncreasedMana | T11 | 11 | 16 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 95 | prefix | 74 | IncreasedMana | T12 | 12 | 6 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 94 | prefix | 74 | IncreasedMana | T13 | 13 | 1 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 157 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T1 | 1 | 75 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 156 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T2 | 2 | 65 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 155 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T3 | 3 | 54 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 154 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T4 | 4 | 46 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 153 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T5 | 5 | 33 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 152 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T6 | 6 | 16 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 151 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T7 | 7 | 2 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1117 | prefix | 86 | ItemFoundRarityIncreasePrefix | T1 | 1 | 47 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1116 | prefix | 86 | ItemFoundRarityIncreasePrefix | T2 | 2 | 29 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1115 | prefix | 86 | ItemFoundRarityIncreasePrefix | T3 | 3 | 10 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 93 | prefix | 875 | MaximumLifeIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Life | 300 | 300 | 300 | 3/722 | 0.415512% |
| 92 | prefix | 875 | MaximumLifeIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Life | 300 | 300 | 300 | 3/722 | 0.415512% |
| 91 | prefix | 875 | MaximumLifeIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Life | 300 | 300 | 300 | 3/722 | 0.415512% |
| 121 | prefix | 876 | MaximumManaIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Mana | 300 | 300 | 300 | 3/722 | 0.415512% |
| 120 | prefix | 876 | MaximumManaIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Mana | 300 | 300 | 300 | 3/722 | 0.415512% |
| 119 | prefix | 876 | MaximumManaIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Mana | 300 | 300 | 300 | 3/722 | 0.415512% |
| 1354 | prefix | 883 | SpellDamage | T1 | 1 | 75 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1353 | prefix | 883 | SpellDamage | T2 | 2 | 60 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1352 | prefix | 883 | SpellDamage | T3 | 3 | 46 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1351 | prefix | 883 | SpellDamage | T4 | 4 | 33 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1350 | prefix | 883 | SpellDamage | T5 | 5 | 16 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1349 | prefix | 883 | SpellDamage | T6 | 6 | 1 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |

### empty-suffix

Rare item with no existing affixes; suffix-forcing roll.

Denominator: **101450**; minimum modifier level: **0**; side: **suffix**; existing source IDs: **none**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 0/101450 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| T1 Spirit (47–50) | 0/101450 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +1 Projectile Skills | 10/2029 | 0.492854% | 202.900000 | 95.179347% | 78.111251% | 61.013676% | 40.890575% |
| +2 Projectile Skills | 5/2029 | 0.246427% | 405.800000 | 97.562880% | 88.394055% | 78.135089% | 63.981065% |
| +3 Projectile Skills | 2/2029 | 0.098571% | 1014.500000 | 99.018654% | 95.188631% | 90.608756% | 83.652322% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| suffix | 67 | AllAttributes | +{0} to all Attributes | 7200 | 144/2029 | 7.097092% | source:35, source:34, source:33, source:32, source:31, source:30, source:29, source:28, source:27 |
| suffix | 71 | AllResistances | +{0}% to all Elemental Resistances | 4800 | 96/2029 | 4.731395% | source:65, source:64, source:63, source:62, source:61, source:60 |
| suffix | 72 | ChaosResistance | +{0}% to Chaos Resistance | 1500 | 30/2029 | 1.478561% | source:77, source:76, source:75, source:74, source:73, source:72 |
| suffix | 69 | ColdResistance | +{0}% to Cold Resistance | 8000 | 160/2029 | 7.885658% | source:51, source:50, source:49, source:48, source:47, source:46, source:45, source:44 |
| suffix | 253 | CriticalStrikeChanceIncrease | {0}% increased Critical Hit Chance | 3875 | 155/4058 | 3.819616% | source:1029, source:1028, source:1027, source:1026, source:1025, source:1024 |
| suffix | 347 | CriticalStrikeMultiplier | {0}% increased Critical Damage Bonus | 3875 | 155/4058 | 3.819616% | source:1072, source:1071, source:1070, source:1069, source:1068, source:1067 |
| suffix | 881 | DamageTakenGainedAsLife | {0}% of Damage taken Recouped as Life | 2500 | 50/2029 | 2.464268% | source:1331, source:1330, source:1329, source:1328, source:1327 |
| suffix | 49 | Dexterity | +{0} to Dexterity | 8000 | 160/2029 | 7.885658% | source:16, source:15, source:14, source:13, source:12, source:11, source:10, source:9 |
| suffix | 68 | FireResistance | +{0}% to Fire Resistance | 8000 | 160/2029 | 7.885658% | source:43, source:42, source:41, source:40, source:39, source:38, source:37, source:36 |
| suffix | 126 | IncreasedCastSpeed | {0}% increased Cast Speed | 4800 | 96/2029 | 4.731395% | source:16303, source:16302, source:16301, source:16300, source:16299, source:16298 |
| suffix | 59 | IncreaseSocketedGemLevel | +{0} to Level of all Melee Skills | 850 | 17/2029 | 0.837851% | source:854, source:853, source:852 |
| suffix | 252 | IncreaseSocketedGemLevel | +{0} to Level of all Minion Skills | 850 | 17/2029 | 0.837851% | source:838, source:837, source:836 |
| suffix | 695 | IncreaseSocketedGemLevel | +{0} to Level of all Projectile Skills | 850 | 17/2029 | 0.837851% | source:867, source:866, source:865 |
| suffix | 716 | IncreaseSocketedGemLevel | +{0} to Level of all Spell Skills | 850 | 17/2029 | 0.837851% | source:761, source:760, source:759 |
| suffix | 66 | Intelligence | +{0} to Intelligence | 8000 | 160/2029 | 7.885658% | source:25, source:24, source:23, source:22, source:21, source:20, source:19, source:18 |
| suffix | 85 | ItemFoundRarityIncrease | {0}% increased Rarity of Items found | 3000 | 60/2029 | 2.957122% | source:1112, source:1111, source:1110 |
| suffix | 80 | LifeRegeneration | {0} Life Regeneration per second | 10000 | 200/2029 | 9.857072% | source:887, source:886, source:885, source:884, source:883, source:882, source:881, source:880, source:879, source:878 |
| suffix | 70 | LightningResistance | +{0}% to Lightning Resistance | 8000 | 160/2029 | 7.885658% | source:59, source:58, source:57, source:56, source:55, source:54, source:53, source:52 |
| suffix | 81 | ManaRegeneration | {0}% increased Mana Regeneration Rate | 6000 | 120/2029 | 5.914243% | source:905, source:904, source:903, source:902, source:901, source:900 |
| suffix | 882 | PercentDamageGoesToMana | {0}% of Damage taken Recouped as Mana | 2500 | 50/2029 | 2.464268% | source:1336, source:1335, source:1334, source:1333, source:1332 |
| suffix | 48 | Strength | +{0} to Strength | 8000 | 160/2029 | 7.885658% | source:7, source:6, source:5, source:4, source:3, source:2, source:1, source:0 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 35 | suffix | 67 | AllAttributes | T1 | 1 | 82 | +{0} to all Attributes | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 34 | suffix | 67 | AllAttributes | T2 | 2 | 75 | +{0} to all Attributes | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 33 | suffix | 67 | AllAttributes | T3 | 3 | 66 | +{0} to all Attributes | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 32 | suffix | 67 | AllAttributes | T4 | 4 | 55 | +{0} to all Attributes | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 31 | suffix | 67 | AllAttributes | T5 | 5 | 44 | +{0} to all Attributes | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 30 | suffix | 67 | AllAttributes | T6 | 6 | 33 | +{0} to all Attributes | 800 | null | 800 | 16/2029 | 0.788566% |
| 29 | suffix | 67 | AllAttributes | T7 | 7 | 22 | +{0} to all Attributes | 800 | null | 800 | 16/2029 | 0.788566% |
| 28 | suffix | 67 | AllAttributes | T8 | 8 | 11 | +{0} to all Attributes | 800 | null | 800 | 16/2029 | 0.788566% |
| 27 | suffix | 67 | AllAttributes | T9 | 9 | 1 | +{0} to all Attributes | 800 | null | 800 | 16/2029 | 0.788566% |
| 65 | suffix | 71 | AllResistances | T1 | 1 | 80 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 64 | suffix | 71 | AllResistances | T2 | 2 | 68 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 63 | suffix | 71 | AllResistances | T3 | 3 | 54 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 62 | suffix | 71 | AllResistances | T4 | 4 | 40 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 61 | suffix | 71 | AllResistances | T5 | 5 | 26 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 60 | suffix | 71 | AllResistances | T6 | 6 | 12 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 77 | suffix | 72 | ChaosResistance | T1 | 1 | 81 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2029 | 0.246427% |
| 76 | suffix | 72 | ChaosResistance | T2 | 2 | 68 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2029 | 0.246427% |
| 75 | suffix | 72 | ChaosResistance | T3 | 4 | 56 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2029 | 0.246427% |
| 74 | suffix | 72 | ChaosResistance | T4 | 5 | 44 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2029 | 0.246427% |
| 73 | suffix | 72 | ChaosResistance | T5 | 6 | 30 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2029 | 0.246427% |
| 72 | suffix | 72 | ChaosResistance | T6 | 7 | 16 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2029 | 0.246427% |
| 51 | suffix | 69 | ColdResistance | T1 | 1 | 82 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 50 | suffix | 69 | ColdResistance | T2 | 2 | 71 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 49 | suffix | 69 | ColdResistance | T3 | 3 | 60 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 48 | suffix | 69 | ColdResistance | T4 | 4 | 50 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 47 | suffix | 69 | ColdResistance | T5 | 5 | 38 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 46 | suffix | 69 | ColdResistance | T6 | 6 | 26 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 45 | suffix | 69 | ColdResistance | T7 | 7 | 14 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 44 | suffix | 69 | ColdResistance | T8 | 8 | 1 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 1029 | suffix | 253 | CriticalStrikeChanceIncrease | T1 | 1 | 72 | {0}% increased Critical Hit Chance | 125 | 125 | 125 | 5/4058 | 0.123213% |
| 1028 | suffix | 253 | CriticalStrikeChanceIncrease | T2 | 2 | 58 | {0}% increased Critical Hit Chance | 250 | 250 | 250 | 5/2029 | 0.246427% |
| 1027 | suffix | 253 | CriticalStrikeChanceIncrease | T3 | 3 | 44 | {0}% increased Critical Hit Chance | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1026 | suffix | 253 | CriticalStrikeChanceIncrease | T4 | 4 | 30 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1025 | suffix | 253 | CriticalStrikeChanceIncrease | T5 | 5 | 20 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1024 | suffix | 253 | CriticalStrikeChanceIncrease | T6 | 6 | 5 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1072 | suffix | 347 | CriticalStrikeMultiplier | T1 | 1 | 74 | {0}% increased Critical Damage Bonus | 125 | 125 | 125 | 5/4058 | 0.123213% |
| 1071 | suffix | 347 | CriticalStrikeMultiplier | T2 | 2 | 59 | {0}% increased Critical Damage Bonus | 250 | 250 | 250 | 5/2029 | 0.246427% |
| 1070 | suffix | 347 | CriticalStrikeMultiplier | T3 | 3 | 45 | {0}% increased Critical Damage Bonus | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1069 | suffix | 347 | CriticalStrikeMultiplier | T4 | 4 | 31 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1068 | suffix | 347 | CriticalStrikeMultiplier | T5 | 5 | 21 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1067 | suffix | 347 | CriticalStrikeMultiplier | T6 | 6 | 8 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1331 | suffix | 881 | DamageTakenGainedAsLife | T1 | 1 | 79 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1330 | suffix | 881 | DamageTakenGainedAsLife | T2 | 2 | 68 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1329 | suffix | 881 | DamageTakenGainedAsLife | T3 | 3 | 56 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1328 | suffix | 881 | DamageTakenGainedAsLife | T4 | 4 | 44 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1327 | suffix | 881 | DamageTakenGainedAsLife | T5 | 5 | 30 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 16 | suffix | 49 | Dexterity | T1 | 2 | 74 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 15 | suffix | 49 | Dexterity | T2 | 3 | 66 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 14 | suffix | 49 | Dexterity | T3 | 4 | 55 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 13 | suffix | 49 | Dexterity | T4 | 5 | 44 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 12 | suffix | 49 | Dexterity | T5 | 6 | 33 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 11 | suffix | 49 | Dexterity | T6 | 7 | 22 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 10 | suffix | 49 | Dexterity | T7 | 8 | 11 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 9 | suffix | 49 | Dexterity | T8 | 9 | 1 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 43 | suffix | 68 | FireResistance | T1 | 1 | 82 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 42 | suffix | 68 | FireResistance | T2 | 2 | 71 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 41 | suffix | 68 | FireResistance | T3 | 3 | 60 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 40 | suffix | 68 | FireResistance | T4 | 4 | 48 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 39 | suffix | 68 | FireResistance | T5 | 5 | 36 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 38 | suffix | 68 | FireResistance | T6 | 6 | 24 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 37 | suffix | 68 | FireResistance | T7 | 7 | 12 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 36 | suffix | 68 | FireResistance | T8 | 8 | 1 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 16303 | suffix | 126 | IncreasedCastSpeed | T1 | 3 | 66 | {0}% increased Cast Speed | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 16302 | suffix | 126 | IncreasedCastSpeed | T2 | 4 | 60 | {0}% increased Cast Speed | 800 | null | 800 | 16/2029 | 0.788566% |
| 16301 | suffix | 126 | IncreasedCastSpeed | T3 | 5 | 51 | {0}% increased Cast Speed | 800 | null | 800 | 16/2029 | 0.788566% |
| 16300 | suffix | 126 | IncreasedCastSpeed | T4 | 7 | 35 | {0}% increased Cast Speed | 800 | null | 800 | 16/2029 | 0.788566% |
| 16299 | suffix | 126 | IncreasedCastSpeed | T5 | 9 | 18 | {0}% increased Cast Speed | 800 | null | 800 | 16/2029 | 0.788566% |
| 16298 | suffix | 126 | IncreasedCastSpeed | T6 | 11 | 1 | {0}% increased Cast Speed | 800 | null | 800 | 16/2029 | 0.788566% |
| 854 | suffix | 59 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Melee Skills | 100 | 100 | 100 | 2/2029 | 0.098571% |
| 838 | suffix | 252 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Minion Skills | 100 | 100 | 100 | 2/2029 | 0.098571% |
| 867 | suffix | 695 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Projectile Skills | 100 | 100 | 100 | 2/2029 | 0.098571% |
| 761 | suffix | 716 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Spell Skills | 100 | 100 | 100 | 2/2029 | 0.098571% |
| 853 | suffix | 59 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Melee Skills | 250 | 250 | 250 | 5/2029 | 0.246427% |
| 837 | suffix | 252 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Minion Skills | 250 | 250 | 250 | 5/2029 | 0.246427% |
| 866 | suffix | 695 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Projectile Skills | 250 | 250 | 250 | 5/2029 | 0.246427% |
| 760 | suffix | 716 | IncreaseSocketedGemLevel | T2 | 5 | 41 | +{0} to Level of all Spell Skills | 250 | 250 | 250 | 5/2029 | 0.246427% |
| 759 | suffix | 716 | IncreaseSocketedGemLevel | T3 | 7 | 10 | +{0} to Level of all Spell Skills | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 852 | suffix | 59 | IncreaseSocketedGemLevel | T3 | 7 | 5 | +{0} to Level of all Melee Skills | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 836 | suffix | 252 | IncreaseSocketedGemLevel | T3 | 6 | 5 | +{0} to Level of all Minion Skills | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 865 | suffix | 695 | IncreaseSocketedGemLevel | T3 | 7 | 5 | +{0} to Level of all Projectile Skills | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 25 | suffix | 66 | Intelligence | T1 | 2 | 74 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 24 | suffix | 66 | Intelligence | T2 | 3 | 66 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 23 | suffix | 66 | Intelligence | T3 | 4 | 55 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 22 | suffix | 66 | Intelligence | T4 | 5 | 44 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 21 | suffix | 66 | Intelligence | T5 | 6 | 33 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 20 | suffix | 66 | Intelligence | T6 | 7 | 22 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 19 | suffix | 66 | Intelligence | T7 | 8 | 11 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 18 | suffix | 66 | Intelligence | T8 | 9 | 1 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 1112 | suffix | 85 | ItemFoundRarityIncrease | T1 | 1 | 40 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1111 | suffix | 85 | ItemFoundRarityIncrease | T2 | 2 | 24 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1110 | suffix | 85 | ItemFoundRarityIncrease | T3 | 3 | 3 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 887 | suffix | 80 | LifeRegeneration | T1 | 2 | 75 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 886 | suffix | 80 | LifeRegeneration | T2 | 3 | 68 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 885 | suffix | 80 | LifeRegeneration | T3 | 4 | 58 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 884 | suffix | 80 | LifeRegeneration | T4 | 5 | 47 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 883 | suffix | 80 | LifeRegeneration | T5 | 6 | 35 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 882 | suffix | 80 | LifeRegeneration | T6 | 7 | 26 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 881 | suffix | 80 | LifeRegeneration | T7 | 8 | 17 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 880 | suffix | 80 | LifeRegeneration | T8 | 9 | 11 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 879 | suffix | 80 | LifeRegeneration | T9 | 10 | 5 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 878 | suffix | 80 | LifeRegeneration | T10 | 11 | 1 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 59 | suffix | 70 | LightningResistance | T1 | 1 | 82 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 58 | suffix | 70 | LightningResistance | T2 | 2 | 71 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 57 | suffix | 70 | LightningResistance | T3 | 3 | 60 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 56 | suffix | 70 | LightningResistance | T4 | 4 | 49 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 55 | suffix | 70 | LightningResistance | T5 | 5 | 37 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 54 | suffix | 70 | LightningResistance | T6 | 6 | 25 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 53 | suffix | 70 | LightningResistance | T7 | 7 | 13 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 52 | suffix | 70 | LightningResistance | T8 | 8 | 1 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 905 | suffix | 81 | ManaRegeneration | T1 | 1 | 79 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 904 | suffix | 81 | ManaRegeneration | T2 | 2 | 55 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 903 | suffix | 81 | ManaRegeneration | T3 | 3 | 42 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 902 | suffix | 81 | ManaRegeneration | T4 | 4 | 29 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 901 | suffix | 81 | ManaRegeneration | T5 | 5 | 18 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 900 | suffix | 81 | ManaRegeneration | T6 | 6 | 1 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1336 | suffix | 882 | PercentDamageGoesToMana | T1 | 1 | 80 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1335 | suffix | 882 | PercentDamageGoesToMana | T2 | 2 | 69 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1334 | suffix | 882 | PercentDamageGoesToMana | T3 | 3 | 57 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1333 | suffix | 882 | PercentDamageGoesToMana | T4 | 4 | 45 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1332 | suffix | 882 | PercentDamageGoesToMana | T5 | 5 | 31 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 7 | suffix | 48 | Strength | T1 | 2 | 74 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 6 | suffix | 48 | Strength | T2 | 3 | 66 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 5 | suffix | 48 | Strength | T3 | 4 | 55 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 4 | suffix | 48 | Strength | T4 | 5 | 44 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 3 | suffix | 48 | Strength | T5 | 6 | 33 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 2 | suffix | 48 | Strength | T6 | 7 | 22 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 1 | suffix | 48 | Strength | T7 | 8 | 11 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 0 | suffix | 48 | Strength | T8 | 9 | 1 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |

### empty-greater-chaos

No remaining blockers after Greater Chaos removal; minimum modifier level 35.

Denominator: **92450**; minimum modifier level: **35**; side: **both**; existing source IDs: **none**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 18/1849 | 0.973499% | 102.722222 | 90.680589% | 61.315695% | 37.596145% | 17.021953% |
| T1 Spirit (47–50) | 8/1849 | 0.432666% | 231.125000 | 95.756612% | 80.508895% | 64.816822% | 45.619949% |
| +1 Projectile Skills | 0/92450 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +2 Projectile Skills | 5/1849 | 0.270416% | 369.800000 | 97.328506% | 87.337404% | 76.278221% | 61.255488% |
| +3 Projectile Skills | 2/1849 | 0.108167% | 924.500000 | 98.923584% | 94.732547% | 89.742555% | 82.210475% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| prefix | 281 | BaseSpirit | +{0} to Spirit | 900 | 18/1849 | 0.973499% | source:1140, source:1139 |
| prefix | 880 | EnergyShieldPercent | {0}% increased maximum Energy Shield | 4000 | 80/1849 | 4.326663% | source:171, source:170, source:169, source:168 |
| prefix | 879 | EvasionRatingPercent | {0}% increased Evasion Rating | 4000 | 80/1849 | 4.326663% | source:164, source:163, source:162, source:161 |
| prefix | 84 | IncreasedAccuracy | +{0} to Accuracy Rating | 2800 | 56/1849 | 3.028664% | source:1004, source:1003, source:1002, source:1001 |
| prefix | 877 | IncreasedEnergyShield | +{0} to maximum Energy Shield | 5000 | 100/1849 | 5.408329% | source:150, source:149, source:148, source:147, source:146 |
| prefix | 73 | IncreasedLife | +{0} to maximum Life | 4000 | 80/1849 | 4.326663% | source:86, source:85, source:84, source:83 |
| prefix | 74 | IncreasedMana | +{0} to maximum Mana | 8000 | 160/1849 | 8.653326% | source:106, source:105, source:104, source:103, source:102, source:101, source:100, source:99 |
| prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | {0}% increased Armour | 4000 | 80/1849 | 4.326663% | source:157, source:156, source:155, source:154 |
| prefix | 86 | ItemFoundRarityIncreasePrefix | {0}% increased Rarity of Items found | 1000 | 20/1849 | 1.081666% | source:1117 |
| prefix | 875 | MaximumLifeIncreasePercent | {0}% increased maximum Life | 600 | 12/1849 | 0.648999% | source:93, source:92 |
| prefix | 876 | MaximumManaIncreasePercent | {0}% increased maximum Mana | 600 | 12/1849 | 0.648999% | source:121, source:120 |
| prefix | 883 | SpellDamage | {0}% increased Spell Damage | 3000 | 60/1849 | 3.244997% | source:1354, source:1353, source:1352 |
| suffix | 67 | AllAttributes | +{0} to all Attributes | 4000 | 80/1849 | 4.326663% | source:35, source:34, source:33, source:32, source:31 |
| suffix | 71 | AllResistances | +{0}% to all Elemental Resistances | 3200 | 64/1849 | 3.461330% | source:65, source:64, source:63, source:62 |
| suffix | 72 | ChaosResistance | +{0}% to Chaos Resistance | 1000 | 20/1849 | 1.081666% | source:77, source:76, source:75, source:74 |
| suffix | 69 | ColdResistance | +{0}% to Cold Resistance | 5000 | 100/1849 | 5.408329% | source:51, source:50, source:49, source:48, source:47 |
| suffix | 253 | CriticalStrikeChanceIncrease | {0}% increased Critical Hit Chance | 875 | 35/3698 | 0.946458% | source:1029, source:1028, source:1027 |
| suffix | 347 | CriticalStrikeMultiplier | {0}% increased Critical Damage Bonus | 875 | 35/3698 | 0.946458% | source:1072, source:1071, source:1070 |
| suffix | 881 | DamageTakenGainedAsLife | {0}% of Damage taken Recouped as Life | 2000 | 40/1849 | 2.163332% | source:1331, source:1330, source:1329, source:1328 |
| suffix | 49 | Dexterity | +{0} to Dexterity | 4000 | 80/1849 | 4.326663% | source:16, source:15, source:14, source:13 |
| suffix | 68 | FireResistance | +{0}% to Fire Resistance | 5000 | 100/1849 | 5.408329% | source:43, source:42, source:41, source:40, source:39 |
| suffix | 126 | IncreasedCastSpeed | {0}% increased Cast Speed | 3200 | 64/1849 | 3.461330% | source:16303, source:16302, source:16301, source:16300 |
| suffix | 59 | IncreaseSocketedGemLevel | +{0} to Level of all Melee Skills | 350 | 7/1849 | 0.378583% | source:854, source:853 |
| suffix | 252 | IncreaseSocketedGemLevel | +{0} to Level of all Minion Skills | 350 | 7/1849 | 0.378583% | source:838, source:837 |
| suffix | 695 | IncreaseSocketedGemLevel | +{0} to Level of all Projectile Skills | 350 | 7/1849 | 0.378583% | source:867, source:866 |
| suffix | 716 | IncreaseSocketedGemLevel | +{0} to Level of all Spell Skills | 350 | 7/1849 | 0.378583% | source:761, source:760 |
| suffix | 66 | Intelligence | +{0} to Intelligence | 4000 | 80/1849 | 4.326663% | source:25, source:24, source:23, source:22 |
| suffix | 85 | ItemFoundRarityIncrease | {0}% increased Rarity of Items found | 1000 | 20/1849 | 1.081666% | source:1112 |
| suffix | 80 | LifeRegeneration | {0} Life Regeneration per second | 5000 | 100/1849 | 5.408329% | source:887, source:886, source:885, source:884, source:883 |
| suffix | 70 | LightningResistance | +{0}% to Lightning Resistance | 5000 | 100/1849 | 5.408329% | source:59, source:58, source:57, source:56, source:55 |
| suffix | 81 | ManaRegeneration | {0}% increased Mana Regeneration Rate | 3000 | 60/1849 | 3.244997% | source:905, source:904, source:903 |
| suffix | 882 | PercentDamageGoesToMana | {0}% of Damage taken Recouped as Mana | 2000 | 40/1849 | 2.163332% | source:1336, source:1335, source:1334, source:1333 |
| suffix | 48 | Strength | +{0} to Strength | 4000 | 80/1849 | 4.326663% | source:7, source:6, source:5, source:4 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 1140 | prefix | 281 | BaseSpirit | T1 | 4 | 54 | +{0} to Spirit | 400 | null | 400 | 8/1849 | 0.432666% |
| 1139 | prefix | 281 | BaseSpirit | T2 | 5 | 46 | +{0} to Spirit | 500 | 500 | 500 | 10/1849 | 0.540833% |
| 171 | prefix | 880 | EnergyShieldPercent | T1 | 1 | 75 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 170 | prefix | 880 | EnergyShieldPercent | T2 | 2 | 65 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 169 | prefix | 880 | EnergyShieldPercent | T3 | 3 | 54 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 168 | prefix | 880 | EnergyShieldPercent | T4 | 4 | 46 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 164 | prefix | 879 | EvasionRatingPercent | T1 | 1 | 77 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 163 | prefix | 879 | EvasionRatingPercent | T2 | 2 | 70 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 162 | prefix | 879 | EvasionRatingPercent | T3 | 3 | 54 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 161 | prefix | 879 | EvasionRatingPercent | T4 | 4 | 46 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 1004 | prefix | 84 | IncreasedAccuracy | T1 | 2 | 67 | +{0} to Accuracy Rating | 400 | 400 | 400 | 8/1849 | 0.432666% |
| 1003 | prefix | 84 | IncreasedAccuracy | T2 | 3 | 58 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/1849 | 0.865333% |
| 1002 | prefix | 84 | IncreasedAccuracy | T3 | 4 | 48 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/1849 | 0.865333% |
| 1001 | prefix | 84 | IncreasedAccuracy | T4 | 5 | 36 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/1849 | 0.865333% |
| 150 | prefix | 877 | IncreasedEnergyShield | T1 | 1 | 80 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 149 | prefix | 877 | IncreasedEnergyShield | T2 | 2 | 70 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 148 | prefix | 877 | IncreasedEnergyShield | T3 | 3 | 65 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 147 | prefix | 877 | IncreasedEnergyShield | T4 | 4 | 54 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 146 | prefix | 877 | IncreasedEnergyShield | T5 | 5 | 46 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 86 | prefix | 73 | IncreasedLife | T1 | 5 | 60 | +{0} to maximum Life | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 85 | prefix | 73 | IncreasedLife | T2 | 6 | 54 | +{0} to maximum Life | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 84 | prefix | 73 | IncreasedLife | T3 | 7 | 46 | +{0} to maximum Life | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 83 | prefix | 73 | IncreasedLife | T4 | 8 | 38 | +{0} to maximum Life | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 106 | prefix | 74 | IncreasedMana | T1 | 1 | 82 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 105 | prefix | 74 | IncreasedMana | T2 | 2 | 75 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 104 | prefix | 74 | IncreasedMana | T3 | 3 | 70 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 103 | prefix | 74 | IncreasedMana | T4 | 4 | 65 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 102 | prefix | 74 | IncreasedMana | T5 | 5 | 60 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 101 | prefix | 74 | IncreasedMana | T6 | 6 | 54 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 100 | prefix | 74 | IncreasedMana | T7 | 7 | 46 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 99 | prefix | 74 | IncreasedMana | T8 | 8 | 38 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 157 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T1 | 1 | 75 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 156 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T2 | 2 | 65 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 155 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T3 | 3 | 54 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 154 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T4 | 4 | 46 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 1117 | prefix | 86 | ItemFoundRarityIncreasePrefix | T1 | 1 | 47 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 93 | prefix | 875 | MaximumLifeIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Life | 300 | 300 | 300 | 6/1849 | 0.324500% |
| 92 | prefix | 875 | MaximumLifeIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Life | 300 | 300 | 300 | 6/1849 | 0.324500% |
| 121 | prefix | 876 | MaximumManaIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Mana | 300 | 300 | 300 | 6/1849 | 0.324500% |
| 120 | prefix | 876 | MaximumManaIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Mana | 300 | 300 | 300 | 6/1849 | 0.324500% |
| 1354 | prefix | 883 | SpellDamage | T1 | 1 | 75 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 1353 | prefix | 883 | SpellDamage | T2 | 2 | 60 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 1352 | prefix | 883 | SpellDamage | T3 | 3 | 46 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 35 | suffix | 67 | AllAttributes | T1 | 1 | 82 | +{0} to all Attributes | 800 | 800 | 800 | 16/1849 | 0.865333% |
| 34 | suffix | 67 | AllAttributes | T2 | 2 | 75 | +{0} to all Attributes | 800 | 800 | 800 | 16/1849 | 0.865333% |
| 33 | suffix | 67 | AllAttributes | T3 | 3 | 66 | +{0} to all Attributes | 800 | 800 | 800 | 16/1849 | 0.865333% |
| 32 | suffix | 67 | AllAttributes | T4 | 4 | 55 | +{0} to all Attributes | 800 | 800 | 800 | 16/1849 | 0.865333% |
| 31 | suffix | 67 | AllAttributes | T5 | 5 | 44 | +{0} to all Attributes | 800 | 800 | 800 | 16/1849 | 0.865333% |
| 65 | suffix | 71 | AllResistances | T1 | 1 | 80 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/1849 | 0.865333% |
| 64 | suffix | 71 | AllResistances | T2 | 2 | 68 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/1849 | 0.865333% |
| 63 | suffix | 71 | AllResistances | T3 | 3 | 54 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/1849 | 0.865333% |
| 62 | suffix | 71 | AllResistances | T4 | 4 | 40 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/1849 | 0.865333% |
| 77 | suffix | 72 | ChaosResistance | T1 | 1 | 81 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1849 | 0.270416% |
| 76 | suffix | 72 | ChaosResistance | T2 | 2 | 68 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1849 | 0.270416% |
| 75 | suffix | 72 | ChaosResistance | T3 | 4 | 56 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1849 | 0.270416% |
| 74 | suffix | 72 | ChaosResistance | T4 | 5 | 44 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1849 | 0.270416% |
| 51 | suffix | 69 | ColdResistance | T1 | 1 | 82 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 50 | suffix | 69 | ColdResistance | T2 | 2 | 71 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 49 | suffix | 69 | ColdResistance | T3 | 3 | 60 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 48 | suffix | 69 | ColdResistance | T4 | 4 | 50 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 47 | suffix | 69 | ColdResistance | T5 | 5 | 38 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 1029 | suffix | 253 | CriticalStrikeChanceIncrease | T1 | 1 | 72 | {0}% increased Critical Hit Chance | 125 | 125 | 125 | 5/3698 | 0.135208% |
| 1028 | suffix | 253 | CriticalStrikeChanceIncrease | T2 | 2 | 58 | {0}% increased Critical Hit Chance | 250 | 250 | 250 | 5/1849 | 0.270416% |
| 1027 | suffix | 253 | CriticalStrikeChanceIncrease | T3 | 3 | 44 | {0}% increased Critical Hit Chance | 500 | 500 | 500 | 10/1849 | 0.540833% |
| 1072 | suffix | 347 | CriticalStrikeMultiplier | T1 | 1 | 74 | {0}% increased Critical Damage Bonus | 125 | 125 | 125 | 5/3698 | 0.135208% |
| 1071 | suffix | 347 | CriticalStrikeMultiplier | T2 | 2 | 59 | {0}% increased Critical Damage Bonus | 250 | 250 | 250 | 5/1849 | 0.270416% |
| 1070 | suffix | 347 | CriticalStrikeMultiplier | T3 | 3 | 45 | {0}% increased Critical Damage Bonus | 500 | 500 | 500 | 10/1849 | 0.540833% |
| 1331 | suffix | 881 | DamageTakenGainedAsLife | T1 | 1 | 79 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/1849 | 0.540833% |
| 1330 | suffix | 881 | DamageTakenGainedAsLife | T2 | 2 | 68 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/1849 | 0.540833% |
| 1329 | suffix | 881 | DamageTakenGainedAsLife | T3 | 3 | 56 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/1849 | 0.540833% |
| 1328 | suffix | 881 | DamageTakenGainedAsLife | T4 | 4 | 44 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/1849 | 0.540833% |
| 16 | suffix | 49 | Dexterity | T1 | 2 | 74 | +{0} to Dexterity | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 15 | suffix | 49 | Dexterity | T2 | 3 | 66 | +{0} to Dexterity | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 14 | suffix | 49 | Dexterity | T3 | 4 | 55 | +{0} to Dexterity | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 13 | suffix | 49 | Dexterity | T4 | 5 | 44 | +{0} to Dexterity | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 43 | suffix | 68 | FireResistance | T1 | 1 | 82 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 42 | suffix | 68 | FireResistance | T2 | 2 | 71 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 41 | suffix | 68 | FireResistance | T3 | 3 | 60 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 40 | suffix | 68 | FireResistance | T4 | 4 | 48 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 39 | suffix | 68 | FireResistance | T5 | 5 | 36 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 16303 | suffix | 126 | IncreasedCastSpeed | T1 | 3 | 66 | {0}% increased Cast Speed | 800 | 800 | 800 | 16/1849 | 0.865333% |
| 16302 | suffix | 126 | IncreasedCastSpeed | T2 | 4 | 60 | {0}% increased Cast Speed | 800 | null | 800 | 16/1849 | 0.865333% |
| 16301 | suffix | 126 | IncreasedCastSpeed | T3 | 5 | 51 | {0}% increased Cast Speed | 800 | null | 800 | 16/1849 | 0.865333% |
| 16300 | suffix | 126 | IncreasedCastSpeed | T4 | 7 | 35 | {0}% increased Cast Speed | 800 | null | 800 | 16/1849 | 0.865333% |
| 854 | suffix | 59 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Melee Skills | 100 | 100 | 100 | 2/1849 | 0.108167% |
| 853 | suffix | 59 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Melee Skills | 250 | 250 | 250 | 5/1849 | 0.270416% |
| 838 | suffix | 252 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Minion Skills | 100 | 100 | 100 | 2/1849 | 0.108167% |
| 837 | suffix | 252 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Minion Skills | 250 | 250 | 250 | 5/1849 | 0.270416% |
| 867 | suffix | 695 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Projectile Skills | 100 | 100 | 100 | 2/1849 | 0.108167% |
| 866 | suffix | 695 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Projectile Skills | 250 | 250 | 250 | 5/1849 | 0.270416% |
| 761 | suffix | 716 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Spell Skills | 100 | 100 | 100 | 2/1849 | 0.108167% |
| 760 | suffix | 716 | IncreaseSocketedGemLevel | T2 | 5 | 41 | +{0} to Level of all Spell Skills | 250 | 250 | 250 | 5/1849 | 0.270416% |
| 25 | suffix | 66 | Intelligence | T1 | 2 | 74 | +{0} to Intelligence | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 24 | suffix | 66 | Intelligence | T2 | 3 | 66 | +{0} to Intelligence | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 23 | suffix | 66 | Intelligence | T3 | 4 | 55 | +{0} to Intelligence | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 22 | suffix | 66 | Intelligence | T4 | 5 | 44 | +{0} to Intelligence | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 1112 | suffix | 85 | ItemFoundRarityIncrease | T1 | 1 | 40 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 887 | suffix | 80 | LifeRegeneration | T1 | 2 | 75 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 886 | suffix | 80 | LifeRegeneration | T2 | 3 | 68 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 885 | suffix | 80 | LifeRegeneration | T3 | 4 | 58 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 884 | suffix | 80 | LifeRegeneration | T4 | 5 | 47 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 883 | suffix | 80 | LifeRegeneration | T5 | 6 | 35 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 59 | suffix | 70 | LightningResistance | T1 | 1 | 82 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 58 | suffix | 70 | LightningResistance | T2 | 2 | 71 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 57 | suffix | 70 | LightningResistance | T3 | 3 | 60 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 56 | suffix | 70 | LightningResistance | T4 | 4 | 49 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 55 | suffix | 70 | LightningResistance | T5 | 5 | 37 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 905 | suffix | 81 | ManaRegeneration | T1 | 1 | 79 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 904 | suffix | 81 | ManaRegeneration | T2 | 2 | 55 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 903 | suffix | 81 | ManaRegeneration | T3 | 3 | 42 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/1849 | 1.081666% |
| 1336 | suffix | 882 | PercentDamageGoesToMana | T1 | 1 | 80 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/1849 | 0.540833% |
| 1335 | suffix | 882 | PercentDamageGoesToMana | T2 | 2 | 69 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/1849 | 0.540833% |
| 1334 | suffix | 882 | PercentDamageGoesToMana | T3 | 3 | 57 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/1849 | 0.540833% |
| 1333 | suffix | 882 | PercentDamageGoesToMana | T4 | 4 | 45 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/1849 | 0.540833% |
| 7 | suffix | 48 | Strength | T1 | 2 | 74 | +{0} to Strength | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 6 | suffix | 48 | Strength | T2 | 3 | 66 | +{0} to Strength | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 5 | suffix | 48 | Strength | T3 | 4 | 55 | +{0} to Strength | 1000 | null | 1000 | 20/1849 | 1.081666% |
| 4 | suffix | 48 | Strength | T4 | 5 | 44 | +{0} to Strength | 1000 | null | 1000 | 20/1849 | 1.081666% |

### empty-perfect-chaos

No remaining blockers after Perfect Chaos removal; minimum modifier level 50.

Denominator: **64700**; minimum modifier level: **50**; side: **both**; existing source IDs: **none**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 4/647 | 0.618238% | 161.750000 | 93.986813% | 73.338937% | 53.785997% | 32.547025% |
| T1 Spirit (47–50) | 4/647 | 0.618238% | 161.750000 | 93.986813% | 73.338937% | 53.785997% | 32.547025% |
| +1 Projectile Skills | 0/64700 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +2 Projectile Skills | 0/64700 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +3 Projectile Skills | 1/647 | 0.154560% | 647.000000 | 98.465111% | 92.557553% | 85.669007% | 75.580708% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| prefix | 281 | BaseSpirit | +{0} to Spirit | 400 | 4/647 | 0.618238% | source:1140 |
| prefix | 880 | EnergyShieldPercent | {0}% increased maximum Energy Shield | 3000 | 30/647 | 4.636785% | source:171, source:170, source:169 |
| prefix | 879 | EvasionRatingPercent | {0}% increased Evasion Rating | 3000 | 30/647 | 4.636785% | source:164, source:163, source:162 |
| prefix | 84 | IncreasedAccuracy | +{0} to Accuracy Rating | 1200 | 12/647 | 1.854714% | source:1004, source:1003 |
| prefix | 877 | IncreasedEnergyShield | +{0} to maximum Energy Shield | 4000 | 40/647 | 6.182380% | source:150, source:149, source:148, source:147 |
| prefix | 73 | IncreasedLife | +{0} to maximum Life | 2000 | 20/647 | 3.091190% | source:86, source:85 |
| prefix | 74 | IncreasedMana | +{0} to maximum Mana | 6000 | 60/647 | 9.273570% | source:106, source:105, source:104, source:103, source:102, source:101 |
| prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | {0}% increased Armour | 3000 | 30/647 | 4.636785% | source:157, source:156, source:155 |
| prefix | 86 | ItemFoundRarityIncreasePrefix | {0}% increased Rarity of Items found | 1000 | 10/647 | 1.545595% | source:1117 |
| prefix | 875 | MaximumLifeIncreasePercent | {0}% increased maximum Life | 600 | 6/647 | 0.927357% | source:93, source:92 |
| prefix | 876 | MaximumManaIncreasePercent | {0}% increased maximum Mana | 600 | 6/647 | 0.927357% | source:121, source:120 |
| prefix | 883 | SpellDamage | {0}% increased Spell Damage | 2000 | 20/647 | 3.091190% | source:1354, source:1353 |
| suffix | 67 | AllAttributes | +{0} to all Attributes | 3200 | 32/647 | 4.945904% | source:35, source:34, source:33, source:32 |
| suffix | 71 | AllResistances | +{0}% to all Elemental Resistances | 2400 | 24/647 | 3.709428% | source:65, source:64, source:63 |
| suffix | 72 | ChaosResistance | +{0}% to Chaos Resistance | 750 | 15/1294 | 1.159196% | source:77, source:76, source:75 |
| suffix | 69 | ColdResistance | +{0}% to Cold Resistance | 4000 | 40/647 | 6.182380% | source:51, source:50, source:49, source:48 |
| suffix | 253 | CriticalStrikeChanceIncrease | {0}% increased Critical Hit Chance | 375 | 15/2588 | 0.579598% | source:1029, source:1028 |
| suffix | 347 | CriticalStrikeMultiplier | {0}% increased Critical Damage Bonus | 375 | 15/2588 | 0.579598% | source:1072, source:1071 |
| suffix | 881 | DamageTakenGainedAsLife | {0}% of Damage taken Recouped as Life | 1500 | 15/647 | 2.318393% | source:1331, source:1330, source:1329 |
| suffix | 49 | Dexterity | +{0} to Dexterity | 3000 | 30/647 | 4.636785% | source:16, source:15, source:14 |
| suffix | 68 | FireResistance | +{0}% to Fire Resistance | 3000 | 30/647 | 4.636785% | source:43, source:42, source:41 |
| suffix | 126 | IncreasedCastSpeed | {0}% increased Cast Speed | 2400 | 24/647 | 3.709428% | source:16303, source:16302, source:16301 |
| suffix | 59 | IncreaseSocketedGemLevel | +{0} to Level of all Melee Skills | 100 | 1/647 | 0.154560% | source:854 |
| suffix | 252 | IncreaseSocketedGemLevel | +{0} to Level of all Minion Skills | 100 | 1/647 | 0.154560% | source:838 |
| suffix | 695 | IncreaseSocketedGemLevel | +{0} to Level of all Projectile Skills | 100 | 1/647 | 0.154560% | source:867 |
| suffix | 716 | IncreaseSocketedGemLevel | +{0} to Level of all Spell Skills | 100 | 1/647 | 0.154560% | source:761 |
| suffix | 66 | Intelligence | +{0} to Intelligence | 3000 | 30/647 | 4.636785% | source:25, source:24, source:23 |
| suffix | 85 | ItemFoundRarityIncrease | {0}% increased Rarity of Items found | 1000 | 10/647 | 1.545595% | source:1112 |
| suffix | 80 | LifeRegeneration | {0} Life Regeneration per second | 3000 | 30/647 | 4.636785% | source:887, source:886, source:885 |
| suffix | 70 | LightningResistance | +{0}% to Lightning Resistance | 3000 | 30/647 | 4.636785% | source:59, source:58, source:57 |
| suffix | 81 | ManaRegeneration | {0}% increased Mana Regeneration Rate | 2000 | 20/647 | 3.091190% | source:905, source:904 |
| suffix | 882 | PercentDamageGoesToMana | {0}% of Damage taken Recouped as Mana | 1500 | 15/647 | 2.318393% | source:1336, source:1335, source:1334 |
| suffix | 48 | Strength | +{0} to Strength | 3000 | 30/647 | 4.636785% | source:7, source:6, source:5 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 1140 | prefix | 281 | BaseSpirit | T1 | 4 | 54 | +{0} to Spirit | 400 | null | 400 | 4/647 | 0.618238% |
| 171 | prefix | 880 | EnergyShieldPercent | T1 | 1 | 75 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 170 | prefix | 880 | EnergyShieldPercent | T2 | 2 | 65 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 169 | prefix | 880 | EnergyShieldPercent | T3 | 3 | 54 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 164 | prefix | 879 | EvasionRatingPercent | T1 | 1 | 77 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 163 | prefix | 879 | EvasionRatingPercent | T2 | 2 | 70 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 162 | prefix | 879 | EvasionRatingPercent | T3 | 3 | 54 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 1004 | prefix | 84 | IncreasedAccuracy | T1 | 2 | 67 | +{0} to Accuracy Rating | 400 | 400 | 400 | 4/647 | 0.618238% |
| 1003 | prefix | 84 | IncreasedAccuracy | T2 | 3 | 58 | +{0} to Accuracy Rating | 800 | 800 | 800 | 8/647 | 1.236476% |
| 150 | prefix | 877 | IncreasedEnergyShield | T1 | 1 | 80 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 149 | prefix | 877 | IncreasedEnergyShield | T2 | 2 | 70 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 148 | prefix | 877 | IncreasedEnergyShield | T3 | 3 | 65 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 147 | prefix | 877 | IncreasedEnergyShield | T4 | 4 | 54 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 86 | prefix | 73 | IncreasedLife | T1 | 5 | 60 | +{0} to maximum Life | 1000 | null | 1000 | 10/647 | 1.545595% |
| 85 | prefix | 73 | IncreasedLife | T2 | 6 | 54 | +{0} to maximum Life | 1000 | null | 1000 | 10/647 | 1.545595% |
| 106 | prefix | 74 | IncreasedMana | T1 | 1 | 82 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 105 | prefix | 74 | IncreasedMana | T2 | 2 | 75 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 104 | prefix | 74 | IncreasedMana | T3 | 3 | 70 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 103 | prefix | 74 | IncreasedMana | T4 | 4 | 65 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 102 | prefix | 74 | IncreasedMana | T5 | 5 | 60 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 101 | prefix | 74 | IncreasedMana | T6 | 6 | 54 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 157 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T1 | 1 | 75 | {0}% increased Armour | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 156 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T2 | 2 | 65 | {0}% increased Armour | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 155 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T3 | 3 | 54 | {0}% increased Armour | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 1117 | prefix | 86 | ItemFoundRarityIncreasePrefix | T1 | 1 | 47 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 93 | prefix | 875 | MaximumLifeIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Life | 300 | 300 | 300 | 3/647 | 0.463679% |
| 92 | prefix | 875 | MaximumLifeIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Life | 300 | 300 | 300 | 3/647 | 0.463679% |
| 121 | prefix | 876 | MaximumManaIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Mana | 300 | 300 | 300 | 3/647 | 0.463679% |
| 120 | prefix | 876 | MaximumManaIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Mana | 300 | 300 | 300 | 3/647 | 0.463679% |
| 1354 | prefix | 883 | SpellDamage | T1 | 1 | 75 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 1353 | prefix | 883 | SpellDamage | T2 | 2 | 60 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 35 | suffix | 67 | AllAttributes | T1 | 1 | 82 | +{0} to all Attributes | 800 | 800 | 800 | 8/647 | 1.236476% |
| 34 | suffix | 67 | AllAttributes | T2 | 2 | 75 | +{0} to all Attributes | 800 | 800 | 800 | 8/647 | 1.236476% |
| 33 | suffix | 67 | AllAttributes | T3 | 3 | 66 | +{0} to all Attributes | 800 | 800 | 800 | 8/647 | 1.236476% |
| 32 | suffix | 67 | AllAttributes | T4 | 4 | 55 | +{0} to all Attributes | 800 | 800 | 800 | 8/647 | 1.236476% |
| 65 | suffix | 71 | AllResistances | T1 | 1 | 80 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 8/647 | 1.236476% |
| 64 | suffix | 71 | AllResistances | T2 | 2 | 68 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 8/647 | 1.236476% |
| 63 | suffix | 71 | AllResistances | T3 | 3 | 54 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 8/647 | 1.236476% |
| 77 | suffix | 72 | ChaosResistance | T1 | 1 | 81 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1294 | 0.386399% |
| 76 | suffix | 72 | ChaosResistance | T2 | 2 | 68 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1294 | 0.386399% |
| 75 | suffix | 72 | ChaosResistance | T3 | 4 | 56 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1294 | 0.386399% |
| 51 | suffix | 69 | ColdResistance | T1 | 1 | 82 | +{0}% to Cold Resistance | 1000 | null | 1000 | 10/647 | 1.545595% |
| 50 | suffix | 69 | ColdResistance | T2 | 2 | 71 | +{0}% to Cold Resistance | 1000 | null | 1000 | 10/647 | 1.545595% |
| 49 | suffix | 69 | ColdResistance | T3 | 3 | 60 | +{0}% to Cold Resistance | 1000 | null | 1000 | 10/647 | 1.545595% |
| 48 | suffix | 69 | ColdResistance | T4 | 4 | 50 | +{0}% to Cold Resistance | 1000 | null | 1000 | 10/647 | 1.545595% |
| 1029 | suffix | 253 | CriticalStrikeChanceIncrease | T1 | 1 | 72 | {0}% increased Critical Hit Chance | 125 | 125 | 125 | 5/2588 | 0.193199% |
| 1028 | suffix | 253 | CriticalStrikeChanceIncrease | T2 | 2 | 58 | {0}% increased Critical Hit Chance | 250 | 250 | 250 | 5/1294 | 0.386399% |
| 1072 | suffix | 347 | CriticalStrikeMultiplier | T1 | 1 | 74 | {0}% increased Critical Damage Bonus | 125 | 125 | 125 | 5/2588 | 0.193199% |
| 1071 | suffix | 347 | CriticalStrikeMultiplier | T2 | 2 | 59 | {0}% increased Critical Damage Bonus | 250 | 250 | 250 | 5/1294 | 0.386399% |
| 1331 | suffix | 881 | DamageTakenGainedAsLife | T1 | 1 | 79 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/647 | 0.772798% |
| 1330 | suffix | 881 | DamageTakenGainedAsLife | T2 | 2 | 68 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/647 | 0.772798% |
| 1329 | suffix | 881 | DamageTakenGainedAsLife | T3 | 3 | 56 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/647 | 0.772798% |
| 16 | suffix | 49 | Dexterity | T1 | 2 | 74 | +{0} to Dexterity | 1000 | null | 1000 | 10/647 | 1.545595% |
| 15 | suffix | 49 | Dexterity | T2 | 3 | 66 | +{0} to Dexterity | 1000 | null | 1000 | 10/647 | 1.545595% |
| 14 | suffix | 49 | Dexterity | T3 | 4 | 55 | +{0} to Dexterity | 1000 | null | 1000 | 10/647 | 1.545595% |
| 43 | suffix | 68 | FireResistance | T1 | 1 | 82 | +{0}% to Fire Resistance | 1000 | null | 1000 | 10/647 | 1.545595% |
| 42 | suffix | 68 | FireResistance | T2 | 2 | 71 | +{0}% to Fire Resistance | 1000 | null | 1000 | 10/647 | 1.545595% |
| 41 | suffix | 68 | FireResistance | T3 | 3 | 60 | +{0}% to Fire Resistance | 1000 | null | 1000 | 10/647 | 1.545595% |
| 16303 | suffix | 126 | IncreasedCastSpeed | T1 | 3 | 66 | {0}% increased Cast Speed | 800 | 800 | 800 | 8/647 | 1.236476% |
| 16302 | suffix | 126 | IncreasedCastSpeed | T2 | 4 | 60 | {0}% increased Cast Speed | 800 | null | 800 | 8/647 | 1.236476% |
| 16301 | suffix | 126 | IncreasedCastSpeed | T3 | 5 | 51 | {0}% increased Cast Speed | 800 | null | 800 | 8/647 | 1.236476% |
| 854 | suffix | 59 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Melee Skills | 100 | 100 | 100 | 1/647 | 0.154560% |
| 838 | suffix | 252 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Minion Skills | 100 | 100 | 100 | 1/647 | 0.154560% |
| 867 | suffix | 695 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Projectile Skills | 100 | 100 | 100 | 1/647 | 0.154560% |
| 761 | suffix | 716 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Spell Skills | 100 | 100 | 100 | 1/647 | 0.154560% |
| 25 | suffix | 66 | Intelligence | T1 | 2 | 74 | +{0} to Intelligence | 1000 | null | 1000 | 10/647 | 1.545595% |
| 24 | suffix | 66 | Intelligence | T2 | 3 | 66 | +{0} to Intelligence | 1000 | null | 1000 | 10/647 | 1.545595% |
| 23 | suffix | 66 | Intelligence | T3 | 4 | 55 | +{0} to Intelligence | 1000 | null | 1000 | 10/647 | 1.545595% |
| 1112 | suffix | 85 | ItemFoundRarityIncrease | T1 | 1 | 40 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 887 | suffix | 80 | LifeRegeneration | T1 | 2 | 75 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 886 | suffix | 80 | LifeRegeneration | T2 | 3 | 68 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 885 | suffix | 80 | LifeRegeneration | T3 | 4 | 58 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 59 | suffix | 70 | LightningResistance | T1 | 1 | 82 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 10/647 | 1.545595% |
| 58 | suffix | 70 | LightningResistance | T2 | 2 | 71 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 10/647 | 1.545595% |
| 57 | suffix | 70 | LightningResistance | T3 | 3 | 60 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 10/647 | 1.545595% |
| 905 | suffix | 81 | ManaRegeneration | T1 | 1 | 79 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 904 | suffix | 81 | ManaRegeneration | T2 | 2 | 55 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 10/647 | 1.545595% |
| 1336 | suffix | 882 | PercentDamageGoesToMana | T1 | 1 | 80 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/647 | 0.772798% |
| 1335 | suffix | 882 | PercentDamageGoesToMana | T2 | 2 | 69 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/647 | 0.772798% |
| 1334 | suffix | 882 | PercentDamageGoesToMana | T3 | 3 | 57 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/647 | 0.772798% |
| 7 | suffix | 48 | Strength | T1 | 2 | 74 | +{0} to Strength | 1000 | null | 1000 | 10/647 | 1.545595% |
| 6 | suffix | 48 | Strength | T2 | 3 | 66 | +{0} to Strength | 1000 | null | 1000 | 10/647 | 1.545595% |
| 5 | suffix | 48 | Strength | T3 | 4 | 55 | +{0} to Strength | 1000 | null | 1000 | 10/647 | 1.545595% |

### existing-spirit

T1 Spirit already exists and blocks source group 281.

Denominator: **171250**; minimum modifier level: **0**; side: **both**; existing source IDs: **1140**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 0/171250 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| T1 Spirit (47–50) | 0/171250 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +1 Projectile Skills | 2/685 | 0.291971% | 342.500000 | 97.118356% | 86.398581% | 74.647148% | 58.905240% |
| +2 Projectile Skills | 1/685 | 0.145985% | 685.000000 | 98.549699% | 92.955804% | 86.407815% | 76.764596% |
| +3 Projectile Skills | 2/3425 | 0.058394% | 1712.500000 | 99.417590% | 97.121675% | 94.326198% | 89.967265% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| prefix | 880 | EnergyShieldPercent | {0}% increased maximum Energy Shield | 7000 | 28/685 | 4.087591% | source:171, source:170, source:169, source:168, source:167, source:166, source:165 |
| prefix | 879 | EvasionRatingPercent | {0}% increased Evasion Rating | 7000 | 28/685 | 4.087591% | source:164, source:163, source:162, source:161, source:160, source:159, source:158 |
| prefix | 84 | IncreasedAccuracy | +{0} to Accuracy Rating | 6000 | 24/685 | 3.503650% | source:1004, source:1003, source:1002, source:1001, source:1000, source:999, source:998, source:997 |
| prefix | 877 | IncreasedEnergyShield | +{0} to maximum Energy Shield | 10000 | 8/137 | 5.839416% | source:150, source:149, source:148, source:147, source:146, source:145, source:144, source:143, source:142, source:141 |
| prefix | 73 | IncreasedLife | +{0} to maximum Life | 9000 | 36/685 | 5.255474% | source:86, source:85, source:84, source:83, source:82, source:81, source:80, source:79, source:78 |
| prefix | 74 | IncreasedMana | +{0} to maximum Mana | 13000 | 52/685 | 7.591241% | source:106, source:105, source:104, source:103, source:102, source:101, source:100, source:99, source:98, source:97, source:96, source:95, source:94 |
| prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | {0}% increased Armour | 7000 | 28/685 | 4.087591% | source:157, source:156, source:155, source:154, source:153, source:152, source:151 |
| prefix | 86 | ItemFoundRarityIncreasePrefix | {0}% increased Rarity of Items found | 3000 | 12/685 | 1.751825% | source:1117, source:1116, source:1115 |
| prefix | 875 | MaximumLifeIncreasePercent | {0}% increased maximum Life | 900 | 18/3425 | 0.525547% | source:93, source:92, source:91 |
| prefix | 876 | MaximumManaIncreasePercent | {0}% increased maximum Mana | 900 | 18/3425 | 0.525547% | source:121, source:120, source:119 |
| prefix | 883 | SpellDamage | {0}% increased Spell Damage | 6000 | 24/685 | 3.503650% | source:1354, source:1353, source:1352, source:1351, source:1350, source:1349 |
| suffix | 67 | AllAttributes | +{0} to all Attributes | 7200 | 144/3425 | 4.204380% | source:35, source:34, source:33, source:32, source:31, source:30, source:29, source:28, source:27 |
| suffix | 71 | AllResistances | +{0}% to all Elemental Resistances | 4800 | 96/3425 | 2.802920% | source:65, source:64, source:63, source:62, source:61, source:60 |
| suffix | 72 | ChaosResistance | +{0}% to Chaos Resistance | 1500 | 6/685 | 0.875912% | source:77, source:76, source:75, source:74, source:73, source:72 |
| suffix | 69 | ColdResistance | +{0}% to Cold Resistance | 8000 | 32/685 | 4.671533% | source:51, source:50, source:49, source:48, source:47, source:46, source:45, source:44 |
| suffix | 253 | CriticalStrikeChanceIncrease | {0}% increased Critical Hit Chance | 3875 | 31/1370 | 2.262774% | source:1029, source:1028, source:1027, source:1026, source:1025, source:1024 |
| suffix | 347 | CriticalStrikeMultiplier | {0}% increased Critical Damage Bonus | 3875 | 31/1370 | 2.262774% | source:1072, source:1071, source:1070, source:1069, source:1068, source:1067 |
| suffix | 881 | DamageTakenGainedAsLife | {0}% of Damage taken Recouped as Life | 2500 | 2/137 | 1.459854% | source:1331, source:1330, source:1329, source:1328, source:1327 |
| suffix | 49 | Dexterity | +{0} to Dexterity | 8000 | 32/685 | 4.671533% | source:16, source:15, source:14, source:13, source:12, source:11, source:10, source:9 |
| suffix | 68 | FireResistance | +{0}% to Fire Resistance | 8000 | 32/685 | 4.671533% | source:43, source:42, source:41, source:40, source:39, source:38, source:37, source:36 |
| suffix | 126 | IncreasedCastSpeed | {0}% increased Cast Speed | 4800 | 96/3425 | 2.802920% | source:16303, source:16302, source:16301, source:16300, source:16299, source:16298 |
| suffix | 59 | IncreaseSocketedGemLevel | +{0} to Level of all Melee Skills | 850 | 17/3425 | 0.496350% | source:854, source:853, source:852 |
| suffix | 252 | IncreaseSocketedGemLevel | +{0} to Level of all Minion Skills | 850 | 17/3425 | 0.496350% | source:838, source:837, source:836 |
| suffix | 695 | IncreaseSocketedGemLevel | +{0} to Level of all Projectile Skills | 850 | 17/3425 | 0.496350% | source:867, source:866, source:865 |
| suffix | 716 | IncreaseSocketedGemLevel | +{0} to Level of all Spell Skills | 850 | 17/3425 | 0.496350% | source:761, source:760, source:759 |
| suffix | 66 | Intelligence | +{0} to Intelligence | 8000 | 32/685 | 4.671533% | source:25, source:24, source:23, source:22, source:21, source:20, source:19, source:18 |
| suffix | 85 | ItemFoundRarityIncrease | {0}% increased Rarity of Items found | 3000 | 12/685 | 1.751825% | source:1112, source:1111, source:1110 |
| suffix | 80 | LifeRegeneration | {0} Life Regeneration per second | 10000 | 8/137 | 5.839416% | source:887, source:886, source:885, source:884, source:883, source:882, source:881, source:880, source:879, source:878 |
| suffix | 70 | LightningResistance | +{0}% to Lightning Resistance | 8000 | 32/685 | 4.671533% | source:59, source:58, source:57, source:56, source:55, source:54, source:53, source:52 |
| suffix | 81 | ManaRegeneration | {0}% increased Mana Regeneration Rate | 6000 | 24/685 | 3.503650% | source:905, source:904, source:903, source:902, source:901, source:900 |
| suffix | 882 | PercentDamageGoesToMana | {0}% of Damage taken Recouped as Mana | 2500 | 2/137 | 1.459854% | source:1336, source:1335, source:1334, source:1333, source:1332 |
| suffix | 48 | Strength | +{0} to Strength | 8000 | 32/685 | 4.671533% | source:7, source:6, source:5, source:4, source:3, source:2, source:1, source:0 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 171 | prefix | 880 | EnergyShieldPercent | T1 | 1 | 75 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 170 | prefix | 880 | EnergyShieldPercent | T2 | 2 | 65 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 169 | prefix | 880 | EnergyShieldPercent | T3 | 3 | 54 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 168 | prefix | 880 | EnergyShieldPercent | T4 | 4 | 46 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 167 | prefix | 880 | EnergyShieldPercent | T5 | 5 | 33 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 166 | prefix | 880 | EnergyShieldPercent | T6 | 6 | 16 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 165 | prefix | 880 | EnergyShieldPercent | T7 | 7 | 2 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 164 | prefix | 879 | EvasionRatingPercent | T1 | 1 | 77 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 163 | prefix | 879 | EvasionRatingPercent | T2 | 2 | 70 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 162 | prefix | 879 | EvasionRatingPercent | T3 | 3 | 54 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 161 | prefix | 879 | EvasionRatingPercent | T4 | 4 | 46 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 160 | prefix | 879 | EvasionRatingPercent | T5 | 5 | 33 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 159 | prefix | 879 | EvasionRatingPercent | T6 | 6 | 16 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 158 | prefix | 879 | EvasionRatingPercent | T7 | 7 | 2 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1004 | prefix | 84 | IncreasedAccuracy | T1 | 2 | 67 | +{0} to Accuracy Rating | 400 | 400 | 400 | 8/3425 | 0.233577% |
| 1003 | prefix | 84 | IncreasedAccuracy | T2 | 3 | 58 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 1002 | prefix | 84 | IncreasedAccuracy | T3 | 4 | 48 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 1001 | prefix | 84 | IncreasedAccuracy | T4 | 5 | 36 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 1000 | prefix | 84 | IncreasedAccuracy | T5 | 6 | 26 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 999 | prefix | 84 | IncreasedAccuracy | T6 | 7 | 18 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 998 | prefix | 84 | IncreasedAccuracy | T7 | 8 | 11 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 997 | prefix | 84 | IncreasedAccuracy | T8 | 9 | 1 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 150 | prefix | 877 | IncreasedEnergyShield | T1 | 1 | 80 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 149 | prefix | 877 | IncreasedEnergyShield | T2 | 2 | 70 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 148 | prefix | 877 | IncreasedEnergyShield | T3 | 3 | 65 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 147 | prefix | 877 | IncreasedEnergyShield | T4 | 4 | 54 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 146 | prefix | 877 | IncreasedEnergyShield | T5 | 5 | 46 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 145 | prefix | 877 | IncreasedEnergyShield | T6 | 6 | 33 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 144 | prefix | 877 | IncreasedEnergyShield | T7 | 7 | 25 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 143 | prefix | 877 | IncreasedEnergyShield | T8 | 8 | 16 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 142 | prefix | 877 | IncreasedEnergyShield | T9 | 9 | 11 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 141 | prefix | 877 | IncreasedEnergyShield | T10 | 10 | 1 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 86 | prefix | 73 | IncreasedLife | T1 | 5 | 60 | +{0} to maximum Life | 1000 | null | 1000 | 4/685 | 0.583942% |
| 85 | prefix | 73 | IncreasedLife | T2 | 6 | 54 | +{0} to maximum Life | 1000 | null | 1000 | 4/685 | 0.583942% |
| 84 | prefix | 73 | IncreasedLife | T3 | 7 | 46 | +{0} to maximum Life | 1000 | null | 1000 | 4/685 | 0.583942% |
| 83 | prefix | 73 | IncreasedLife | T4 | 8 | 38 | +{0} to maximum Life | 1000 | null | 1000 | 4/685 | 0.583942% |
| 82 | prefix | 73 | IncreasedLife | T5 | 9 | 33 | +{0} to maximum Life | 1000 | null | 1000 | 4/685 | 0.583942% |
| 81 | prefix | 73 | IncreasedLife | T6 | 10 | 24 | +{0} to maximum Life | 1000 | null | 1000 | 4/685 | 0.583942% |
| 80 | prefix | 73 | IncreasedLife | T7 | 11 | 16 | +{0} to maximum Life | 1000 | null | 1000 | 4/685 | 0.583942% |
| 79 | prefix | 73 | IncreasedLife | T8 | 12 | 6 | +{0} to maximum Life | 1000 | null | 1000 | 4/685 | 0.583942% |
| 78 | prefix | 73 | IncreasedLife | T9 | 13 | 1 | +{0} to maximum Life | 1000 | null | 1000 | 4/685 | 0.583942% |
| 106 | prefix | 74 | IncreasedMana | T1 | 1 | 82 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 105 | prefix | 74 | IncreasedMana | T2 | 2 | 75 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 104 | prefix | 74 | IncreasedMana | T3 | 3 | 70 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 103 | prefix | 74 | IncreasedMana | T4 | 4 | 65 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 102 | prefix | 74 | IncreasedMana | T5 | 5 | 60 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 101 | prefix | 74 | IncreasedMana | T6 | 6 | 54 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 100 | prefix | 74 | IncreasedMana | T7 | 7 | 46 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 99 | prefix | 74 | IncreasedMana | T8 | 8 | 38 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 98 | prefix | 74 | IncreasedMana | T9 | 9 | 33 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 97 | prefix | 74 | IncreasedMana | T10 | 10 | 25 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 96 | prefix | 74 | IncreasedMana | T11 | 11 | 16 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 95 | prefix | 74 | IncreasedMana | T12 | 12 | 6 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 94 | prefix | 74 | IncreasedMana | T13 | 13 | 1 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 157 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T1 | 1 | 75 | {0}% increased Armour | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 156 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T2 | 2 | 65 | {0}% increased Armour | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 155 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T3 | 3 | 54 | {0}% increased Armour | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 154 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T4 | 4 | 46 | {0}% increased Armour | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 153 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T5 | 5 | 33 | {0}% increased Armour | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 152 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T6 | 6 | 16 | {0}% increased Armour | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 151 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T7 | 7 | 2 | {0}% increased Armour | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1117 | prefix | 86 | ItemFoundRarityIncreasePrefix | T1 | 1 | 47 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1116 | prefix | 86 | ItemFoundRarityIncreasePrefix | T2 | 2 | 29 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1115 | prefix | 86 | ItemFoundRarityIncreasePrefix | T3 | 3 | 10 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 93 | prefix | 875 | MaximumLifeIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Life | 300 | 300 | 300 | 6/3425 | 0.175182% |
| 92 | prefix | 875 | MaximumLifeIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Life | 300 | 300 | 300 | 6/3425 | 0.175182% |
| 91 | prefix | 875 | MaximumLifeIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Life | 300 | 300 | 300 | 6/3425 | 0.175182% |
| 121 | prefix | 876 | MaximumManaIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Mana | 300 | 300 | 300 | 6/3425 | 0.175182% |
| 120 | prefix | 876 | MaximumManaIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Mana | 300 | 300 | 300 | 6/3425 | 0.175182% |
| 119 | prefix | 876 | MaximumManaIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Mana | 300 | 300 | 300 | 6/3425 | 0.175182% |
| 1354 | prefix | 883 | SpellDamage | T1 | 1 | 75 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1353 | prefix | 883 | SpellDamage | T2 | 2 | 60 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1352 | prefix | 883 | SpellDamage | T3 | 3 | 46 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1351 | prefix | 883 | SpellDamage | T4 | 4 | 33 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1350 | prefix | 883 | SpellDamage | T5 | 5 | 16 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1349 | prefix | 883 | SpellDamage | T6 | 6 | 1 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 35 | suffix | 67 | AllAttributes | T1 | 1 | 82 | +{0} to all Attributes | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 34 | suffix | 67 | AllAttributes | T2 | 2 | 75 | +{0} to all Attributes | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 33 | suffix | 67 | AllAttributes | T3 | 3 | 66 | +{0} to all Attributes | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 32 | suffix | 67 | AllAttributes | T4 | 4 | 55 | +{0} to all Attributes | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 31 | suffix | 67 | AllAttributes | T5 | 5 | 44 | +{0} to all Attributes | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 30 | suffix | 67 | AllAttributes | T6 | 6 | 33 | +{0} to all Attributes | 800 | null | 800 | 16/3425 | 0.467153% |
| 29 | suffix | 67 | AllAttributes | T7 | 7 | 22 | +{0} to all Attributes | 800 | null | 800 | 16/3425 | 0.467153% |
| 28 | suffix | 67 | AllAttributes | T8 | 8 | 11 | +{0} to all Attributes | 800 | null | 800 | 16/3425 | 0.467153% |
| 27 | suffix | 67 | AllAttributes | T9 | 9 | 1 | +{0} to all Attributes | 800 | null | 800 | 16/3425 | 0.467153% |
| 65 | suffix | 71 | AllResistances | T1 | 1 | 80 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 64 | suffix | 71 | AllResistances | T2 | 2 | 68 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 63 | suffix | 71 | AllResistances | T3 | 3 | 54 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 62 | suffix | 71 | AllResistances | T4 | 4 | 40 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 61 | suffix | 71 | AllResistances | T5 | 5 | 26 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 60 | suffix | 71 | AllResistances | T6 | 6 | 12 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 77 | suffix | 72 | ChaosResistance | T1 | 1 | 81 | +{0}% to Chaos Resistance | 250 | null | 250 | 1/685 | 0.145985% |
| 76 | suffix | 72 | ChaosResistance | T2 | 2 | 68 | +{0}% to Chaos Resistance | 250 | null | 250 | 1/685 | 0.145985% |
| 75 | suffix | 72 | ChaosResistance | T3 | 4 | 56 | +{0}% to Chaos Resistance | 250 | null | 250 | 1/685 | 0.145985% |
| 74 | suffix | 72 | ChaosResistance | T4 | 5 | 44 | +{0}% to Chaos Resistance | 250 | null | 250 | 1/685 | 0.145985% |
| 73 | suffix | 72 | ChaosResistance | T5 | 6 | 30 | +{0}% to Chaos Resistance | 250 | null | 250 | 1/685 | 0.145985% |
| 72 | suffix | 72 | ChaosResistance | T6 | 7 | 16 | +{0}% to Chaos Resistance | 250 | null | 250 | 1/685 | 0.145985% |
| 51 | suffix | 69 | ColdResistance | T1 | 1 | 82 | +{0}% to Cold Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 50 | suffix | 69 | ColdResistance | T2 | 2 | 71 | +{0}% to Cold Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 49 | suffix | 69 | ColdResistance | T3 | 3 | 60 | +{0}% to Cold Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 48 | suffix | 69 | ColdResistance | T4 | 4 | 50 | +{0}% to Cold Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 47 | suffix | 69 | ColdResistance | T5 | 5 | 38 | +{0}% to Cold Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 46 | suffix | 69 | ColdResistance | T6 | 6 | 26 | +{0}% to Cold Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 45 | suffix | 69 | ColdResistance | T7 | 7 | 14 | +{0}% to Cold Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 44 | suffix | 69 | ColdResistance | T8 | 8 | 1 | +{0}% to Cold Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 1029 | suffix | 253 | CriticalStrikeChanceIncrease | T1 | 1 | 72 | {0}% increased Critical Hit Chance | 125 | 125 | 125 | 1/1370 | 0.072993% |
| 1028 | suffix | 253 | CriticalStrikeChanceIncrease | T2 | 2 | 58 | {0}% increased Critical Hit Chance | 250 | 250 | 250 | 1/685 | 0.145985% |
| 1027 | suffix | 253 | CriticalStrikeChanceIncrease | T3 | 3 | 44 | {0}% increased Critical Hit Chance | 500 | 500 | 500 | 2/685 | 0.291971% |
| 1026 | suffix | 253 | CriticalStrikeChanceIncrease | T4 | 4 | 30 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1025 | suffix | 253 | CriticalStrikeChanceIncrease | T5 | 5 | 20 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1024 | suffix | 253 | CriticalStrikeChanceIncrease | T6 | 6 | 5 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1072 | suffix | 347 | CriticalStrikeMultiplier | T1 | 1 | 74 | {0}% increased Critical Damage Bonus | 125 | 125 | 125 | 1/1370 | 0.072993% |
| 1071 | suffix | 347 | CriticalStrikeMultiplier | T2 | 2 | 59 | {0}% increased Critical Damage Bonus | 250 | 250 | 250 | 1/685 | 0.145985% |
| 1070 | suffix | 347 | CriticalStrikeMultiplier | T3 | 3 | 45 | {0}% increased Critical Damage Bonus | 500 | 500 | 500 | 2/685 | 0.291971% |
| 1069 | suffix | 347 | CriticalStrikeMultiplier | T4 | 4 | 31 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1068 | suffix | 347 | CriticalStrikeMultiplier | T5 | 5 | 21 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1067 | suffix | 347 | CriticalStrikeMultiplier | T6 | 6 | 8 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1331 | suffix | 881 | DamageTakenGainedAsLife | T1 | 1 | 79 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 2/685 | 0.291971% |
| 1330 | suffix | 881 | DamageTakenGainedAsLife | T2 | 2 | 68 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 2/685 | 0.291971% |
| 1329 | suffix | 881 | DamageTakenGainedAsLife | T3 | 3 | 56 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 2/685 | 0.291971% |
| 1328 | suffix | 881 | DamageTakenGainedAsLife | T4 | 4 | 44 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 2/685 | 0.291971% |
| 1327 | suffix | 881 | DamageTakenGainedAsLife | T5 | 5 | 30 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 2/685 | 0.291971% |
| 16 | suffix | 49 | Dexterity | T1 | 2 | 74 | +{0} to Dexterity | 1000 | null | 1000 | 4/685 | 0.583942% |
| 15 | suffix | 49 | Dexterity | T2 | 3 | 66 | +{0} to Dexterity | 1000 | null | 1000 | 4/685 | 0.583942% |
| 14 | suffix | 49 | Dexterity | T3 | 4 | 55 | +{0} to Dexterity | 1000 | null | 1000 | 4/685 | 0.583942% |
| 13 | suffix | 49 | Dexterity | T4 | 5 | 44 | +{0} to Dexterity | 1000 | null | 1000 | 4/685 | 0.583942% |
| 12 | suffix | 49 | Dexterity | T5 | 6 | 33 | +{0} to Dexterity | 1000 | null | 1000 | 4/685 | 0.583942% |
| 11 | suffix | 49 | Dexterity | T6 | 7 | 22 | +{0} to Dexterity | 1000 | null | 1000 | 4/685 | 0.583942% |
| 10 | suffix | 49 | Dexterity | T7 | 8 | 11 | +{0} to Dexterity | 1000 | null | 1000 | 4/685 | 0.583942% |
| 9 | suffix | 49 | Dexterity | T8 | 9 | 1 | +{0} to Dexterity | 1000 | null | 1000 | 4/685 | 0.583942% |
| 43 | suffix | 68 | FireResistance | T1 | 1 | 82 | +{0}% to Fire Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 42 | suffix | 68 | FireResistance | T2 | 2 | 71 | +{0}% to Fire Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 41 | suffix | 68 | FireResistance | T3 | 3 | 60 | +{0}% to Fire Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 40 | suffix | 68 | FireResistance | T4 | 4 | 48 | +{0}% to Fire Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 39 | suffix | 68 | FireResistance | T5 | 5 | 36 | +{0}% to Fire Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 38 | suffix | 68 | FireResistance | T6 | 6 | 24 | +{0}% to Fire Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 37 | suffix | 68 | FireResistance | T7 | 7 | 12 | +{0}% to Fire Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 36 | suffix | 68 | FireResistance | T8 | 8 | 1 | +{0}% to Fire Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 16303 | suffix | 126 | IncreasedCastSpeed | T1 | 3 | 66 | {0}% increased Cast Speed | 800 | 800 | 800 | 16/3425 | 0.467153% |
| 16302 | suffix | 126 | IncreasedCastSpeed | T2 | 4 | 60 | {0}% increased Cast Speed | 800 | null | 800 | 16/3425 | 0.467153% |
| 16301 | suffix | 126 | IncreasedCastSpeed | T3 | 5 | 51 | {0}% increased Cast Speed | 800 | null | 800 | 16/3425 | 0.467153% |
| 16300 | suffix | 126 | IncreasedCastSpeed | T4 | 7 | 35 | {0}% increased Cast Speed | 800 | null | 800 | 16/3425 | 0.467153% |
| 16299 | suffix | 126 | IncreasedCastSpeed | T5 | 9 | 18 | {0}% increased Cast Speed | 800 | null | 800 | 16/3425 | 0.467153% |
| 16298 | suffix | 126 | IncreasedCastSpeed | T6 | 11 | 1 | {0}% increased Cast Speed | 800 | null | 800 | 16/3425 | 0.467153% |
| 854 | suffix | 59 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Melee Skills | 100 | 100 | 100 | 2/3425 | 0.058394% |
| 838 | suffix | 252 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Minion Skills | 100 | 100 | 100 | 2/3425 | 0.058394% |
| 867 | suffix | 695 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Projectile Skills | 100 | 100 | 100 | 2/3425 | 0.058394% |
| 761 | suffix | 716 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Spell Skills | 100 | 100 | 100 | 2/3425 | 0.058394% |
| 853 | suffix | 59 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Melee Skills | 250 | 250 | 250 | 1/685 | 0.145985% |
| 837 | suffix | 252 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Minion Skills | 250 | 250 | 250 | 1/685 | 0.145985% |
| 866 | suffix | 695 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Projectile Skills | 250 | 250 | 250 | 1/685 | 0.145985% |
| 760 | suffix | 716 | IncreaseSocketedGemLevel | T2 | 5 | 41 | +{0} to Level of all Spell Skills | 250 | 250 | 250 | 1/685 | 0.145985% |
| 759 | suffix | 716 | IncreaseSocketedGemLevel | T3 | 7 | 10 | +{0} to Level of all Spell Skills | 500 | 500 | 500 | 2/685 | 0.291971% |
| 852 | suffix | 59 | IncreaseSocketedGemLevel | T3 | 7 | 5 | +{0} to Level of all Melee Skills | 500 | 500 | 500 | 2/685 | 0.291971% |
| 836 | suffix | 252 | IncreaseSocketedGemLevel | T3 | 6 | 5 | +{0} to Level of all Minion Skills | 500 | 500 | 500 | 2/685 | 0.291971% |
| 865 | suffix | 695 | IncreaseSocketedGemLevel | T3 | 7 | 5 | +{0} to Level of all Projectile Skills | 500 | 500 | 500 | 2/685 | 0.291971% |
| 25 | suffix | 66 | Intelligence | T1 | 2 | 74 | +{0} to Intelligence | 1000 | null | 1000 | 4/685 | 0.583942% |
| 24 | suffix | 66 | Intelligence | T2 | 3 | 66 | +{0} to Intelligence | 1000 | null | 1000 | 4/685 | 0.583942% |
| 23 | suffix | 66 | Intelligence | T3 | 4 | 55 | +{0} to Intelligence | 1000 | null | 1000 | 4/685 | 0.583942% |
| 22 | suffix | 66 | Intelligence | T4 | 5 | 44 | +{0} to Intelligence | 1000 | null | 1000 | 4/685 | 0.583942% |
| 21 | suffix | 66 | Intelligence | T5 | 6 | 33 | +{0} to Intelligence | 1000 | null | 1000 | 4/685 | 0.583942% |
| 20 | suffix | 66 | Intelligence | T6 | 7 | 22 | +{0} to Intelligence | 1000 | null | 1000 | 4/685 | 0.583942% |
| 19 | suffix | 66 | Intelligence | T7 | 8 | 11 | +{0} to Intelligence | 1000 | null | 1000 | 4/685 | 0.583942% |
| 18 | suffix | 66 | Intelligence | T8 | 9 | 1 | +{0} to Intelligence | 1000 | null | 1000 | 4/685 | 0.583942% |
| 1112 | suffix | 85 | ItemFoundRarityIncrease | T1 | 1 | 40 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1111 | suffix | 85 | ItemFoundRarityIncrease | T2 | 2 | 24 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1110 | suffix | 85 | ItemFoundRarityIncrease | T3 | 3 | 3 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 887 | suffix | 80 | LifeRegeneration | T1 | 2 | 75 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 886 | suffix | 80 | LifeRegeneration | T2 | 3 | 68 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 885 | suffix | 80 | LifeRegeneration | T3 | 4 | 58 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 884 | suffix | 80 | LifeRegeneration | T4 | 5 | 47 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 883 | suffix | 80 | LifeRegeneration | T5 | 6 | 35 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 882 | suffix | 80 | LifeRegeneration | T6 | 7 | 26 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 881 | suffix | 80 | LifeRegeneration | T7 | 8 | 17 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 880 | suffix | 80 | LifeRegeneration | T8 | 9 | 11 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 879 | suffix | 80 | LifeRegeneration | T9 | 10 | 5 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 878 | suffix | 80 | LifeRegeneration | T10 | 11 | 1 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 59 | suffix | 70 | LightningResistance | T1 | 1 | 82 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 58 | suffix | 70 | LightningResistance | T2 | 2 | 71 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 57 | suffix | 70 | LightningResistance | T3 | 3 | 60 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 56 | suffix | 70 | LightningResistance | T4 | 4 | 49 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 55 | suffix | 70 | LightningResistance | T5 | 5 | 37 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 54 | suffix | 70 | LightningResistance | T6 | 6 | 25 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 53 | suffix | 70 | LightningResistance | T7 | 7 | 13 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 52 | suffix | 70 | LightningResistance | T8 | 8 | 1 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 4/685 | 0.583942% |
| 905 | suffix | 81 | ManaRegeneration | T1 | 1 | 79 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 904 | suffix | 81 | ManaRegeneration | T2 | 2 | 55 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 903 | suffix | 81 | ManaRegeneration | T3 | 3 | 42 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 902 | suffix | 81 | ManaRegeneration | T4 | 4 | 29 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 901 | suffix | 81 | ManaRegeneration | T5 | 5 | 18 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 900 | suffix | 81 | ManaRegeneration | T6 | 6 | 1 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 4/685 | 0.583942% |
| 1336 | suffix | 882 | PercentDamageGoesToMana | T1 | 1 | 80 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 2/685 | 0.291971% |
| 1335 | suffix | 882 | PercentDamageGoesToMana | T2 | 2 | 69 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 2/685 | 0.291971% |
| 1334 | suffix | 882 | PercentDamageGoesToMana | T3 | 3 | 57 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 2/685 | 0.291971% |
| 1333 | suffix | 882 | PercentDamageGoesToMana | T4 | 4 | 45 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 2/685 | 0.291971% |
| 1332 | suffix | 882 | PercentDamageGoesToMana | T5 | 5 | 31 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 2/685 | 0.291971% |
| 7 | suffix | 48 | Strength | T1 | 2 | 74 | +{0} to Strength | 1000 | null | 1000 | 4/685 | 0.583942% |
| 6 | suffix | 48 | Strength | T2 | 3 | 66 | +{0} to Strength | 1000 | null | 1000 | 4/685 | 0.583942% |
| 5 | suffix | 48 | Strength | T3 | 4 | 55 | +{0} to Strength | 1000 | null | 1000 | 4/685 | 0.583942% |
| 4 | suffix | 48 | Strength | T4 | 5 | 44 | +{0} to Strength | 1000 | null | 1000 | 4/685 | 0.583942% |
| 3 | suffix | 48 | Strength | T5 | 6 | 33 | +{0} to Strength | 1000 | null | 1000 | 4/685 | 0.583942% |
| 2 | suffix | 48 | Strength | T6 | 7 | 22 | +{0} to Strength | 1000 | null | 1000 | 4/685 | 0.583942% |
| 1 | suffix | 48 | Strength | T7 | 8 | 11 | +{0} to Strength | 1000 | null | 1000 | 4/685 | 0.583942% |
| 0 | suffix | 48 | Strength | T8 | 9 | 1 | +{0} to Strength | 1000 | null | 1000 | 4/685 | 0.583942% |

### existing-melee

+3 Melee Skills already exists; other skill source groups remain eligible.

Denominator: **172800**; minimum modifier level: **0**; side: **both**; existing source IDs: **854**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 1/72 | 1.388889% | 72.000000 | 86.947785% | 49.692702% | 24.693647% | 7.953884% |
| T1 Spirit (47–50) | 1/432 | 0.231481% | 432.000000 | 97.709150% | 89.058662% | 79.314453% | 65.739701% |
| +1 Projectile Skills | 5/1728 | 0.289352% | 345.600000 | 97.143868% | 86.512122% | 74.843473% | 59.185949% |
| +2 Projectile Skills | 5/3456 | 0.144676% | 691.200000 | 98.562623% | 93.016774% | 86.521203% | 76.947021% |
| +3 Projectile Skills | 1/1728 | 0.057870% | 1728.000000 | 99.422801% | 97.147129% | 94.375647% | 90.052650% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| prefix | 281 | BaseSpirit | +{0} to Spirit | 2400 | 1/72 | 1.388889% | source:1140, source:1139, source:1138, source:1137, source:1136 |
| prefix | 880 | EnergyShieldPercent | {0}% increased maximum Energy Shield | 7000 | 35/864 | 4.050926% | source:171, source:170, source:169, source:168, source:167, source:166, source:165 |
| prefix | 879 | EvasionRatingPercent | {0}% increased Evasion Rating | 7000 | 35/864 | 4.050926% | source:164, source:163, source:162, source:161, source:160, source:159, source:158 |
| prefix | 84 | IncreasedAccuracy | +{0} to Accuracy Rating | 6000 | 5/144 | 3.472222% | source:1004, source:1003, source:1002, source:1001, source:1000, source:999, source:998, source:997 |
| prefix | 877 | IncreasedEnergyShield | +{0} to maximum Energy Shield | 10000 | 25/432 | 5.787037% | source:150, source:149, source:148, source:147, source:146, source:145, source:144, source:143, source:142, source:141 |
| prefix | 73 | IncreasedLife | +{0} to maximum Life | 9000 | 5/96 | 5.208333% | source:86, source:85, source:84, source:83, source:82, source:81, source:80, source:79, source:78 |
| prefix | 74 | IncreasedMana | +{0} to maximum Mana | 13000 | 65/864 | 7.523148% | source:106, source:105, source:104, source:103, source:102, source:101, source:100, source:99, source:98, source:97, source:96, source:95, source:94 |
| prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | {0}% increased Armour | 7000 | 35/864 | 4.050926% | source:157, source:156, source:155, source:154, source:153, source:152, source:151 |
| prefix | 86 | ItemFoundRarityIncreasePrefix | {0}% increased Rarity of Items found | 3000 | 5/288 | 1.736111% | source:1117, source:1116, source:1115 |
| prefix | 875 | MaximumLifeIncreasePercent | {0}% increased maximum Life | 900 | 1/192 | 0.520833% | source:93, source:92, source:91 |
| prefix | 876 | MaximumManaIncreasePercent | {0}% increased maximum Mana | 900 | 1/192 | 0.520833% | source:121, source:120, source:119 |
| prefix | 883 | SpellDamage | {0}% increased Spell Damage | 6000 | 5/144 | 3.472222% | source:1354, source:1353, source:1352, source:1351, source:1350, source:1349 |
| suffix | 67 | AllAttributes | +{0} to all Attributes | 7200 | 1/24 | 4.166667% | source:35, source:34, source:33, source:32, source:31, source:30, source:29, source:28, source:27 |
| suffix | 71 | AllResistances | +{0}% to all Elemental Resistances | 4800 | 1/36 | 2.777778% | source:65, source:64, source:63, source:62, source:61, source:60 |
| suffix | 72 | ChaosResistance | +{0}% to Chaos Resistance | 1500 | 5/576 | 0.868056% | source:77, source:76, source:75, source:74, source:73, source:72 |
| suffix | 69 | ColdResistance | +{0}% to Cold Resistance | 8000 | 5/108 | 4.629630% | source:51, source:50, source:49, source:48, source:47, source:46, source:45, source:44 |
| suffix | 253 | CriticalStrikeChanceIncrease | {0}% increased Critical Hit Chance | 3875 | 155/6912 | 2.242477% | source:1029, source:1028, source:1027, source:1026, source:1025, source:1024 |
| suffix | 347 | CriticalStrikeMultiplier | {0}% increased Critical Damage Bonus | 3875 | 155/6912 | 2.242477% | source:1072, source:1071, source:1070, source:1069, source:1068, source:1067 |
| suffix | 881 | DamageTakenGainedAsLife | {0}% of Damage taken Recouped as Life | 2500 | 25/1728 | 1.446759% | source:1331, source:1330, source:1329, source:1328, source:1327 |
| suffix | 49 | Dexterity | +{0} to Dexterity | 8000 | 5/108 | 4.629630% | source:16, source:15, source:14, source:13, source:12, source:11, source:10, source:9 |
| suffix | 68 | FireResistance | +{0}% to Fire Resistance | 8000 | 5/108 | 4.629630% | source:43, source:42, source:41, source:40, source:39, source:38, source:37, source:36 |
| suffix | 126 | IncreasedCastSpeed | {0}% increased Cast Speed | 4800 | 1/36 | 2.777778% | source:16303, source:16302, source:16301, source:16300, source:16299, source:16298 |
| suffix | 252 | IncreaseSocketedGemLevel | +{0} to Level of all Minion Skills | 850 | 17/3456 | 0.491898% | source:838, source:837, source:836 |
| suffix | 695 | IncreaseSocketedGemLevel | +{0} to Level of all Projectile Skills | 850 | 17/3456 | 0.491898% | source:867, source:866, source:865 |
| suffix | 716 | IncreaseSocketedGemLevel | +{0} to Level of all Spell Skills | 850 | 17/3456 | 0.491898% | source:761, source:760, source:759 |
| suffix | 66 | Intelligence | +{0} to Intelligence | 8000 | 5/108 | 4.629630% | source:25, source:24, source:23, source:22, source:21, source:20, source:19, source:18 |
| suffix | 85 | ItemFoundRarityIncrease | {0}% increased Rarity of Items found | 3000 | 5/288 | 1.736111% | source:1112, source:1111, source:1110 |
| suffix | 80 | LifeRegeneration | {0} Life Regeneration per second | 10000 | 25/432 | 5.787037% | source:887, source:886, source:885, source:884, source:883, source:882, source:881, source:880, source:879, source:878 |
| suffix | 70 | LightningResistance | +{0}% to Lightning Resistance | 8000 | 5/108 | 4.629630% | source:59, source:58, source:57, source:56, source:55, source:54, source:53, source:52 |
| suffix | 81 | ManaRegeneration | {0}% increased Mana Regeneration Rate | 6000 | 5/144 | 3.472222% | source:905, source:904, source:903, source:902, source:901, source:900 |
| suffix | 882 | PercentDamageGoesToMana | {0}% of Damage taken Recouped as Mana | 2500 | 25/1728 | 1.446759% | source:1336, source:1335, source:1334, source:1333, source:1332 |
| suffix | 48 | Strength | +{0} to Strength | 8000 | 5/108 | 4.629630% | source:7, source:6, source:5, source:4, source:3, source:2, source:1, source:0 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 1140 | prefix | 281 | BaseSpirit | T1 | 4 | 54 | +{0} to Spirit | 400 | null | 400 | 1/432 | 0.231481% |
| 1139 | prefix | 281 | BaseSpirit | T2 | 5 | 46 | +{0} to Spirit | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 1138 | prefix | 281 | BaseSpirit | T3 | 6 | 33 | +{0} to Spirit | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 1137 | prefix | 281 | BaseSpirit | T4 | 7 | 25 | +{0} to Spirit | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 1136 | prefix | 281 | BaseSpirit | T5 | 8 | 16 | +{0} to Spirit | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 171 | prefix | 880 | EnergyShieldPercent | T1 | 1 | 75 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 170 | prefix | 880 | EnergyShieldPercent | T2 | 2 | 65 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 169 | prefix | 880 | EnergyShieldPercent | T3 | 3 | 54 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 168 | prefix | 880 | EnergyShieldPercent | T4 | 4 | 46 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 167 | prefix | 880 | EnergyShieldPercent | T5 | 5 | 33 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 166 | prefix | 880 | EnergyShieldPercent | T6 | 6 | 16 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 165 | prefix | 880 | EnergyShieldPercent | T7 | 7 | 2 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 164 | prefix | 879 | EvasionRatingPercent | T1 | 1 | 77 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 163 | prefix | 879 | EvasionRatingPercent | T2 | 2 | 70 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 162 | prefix | 879 | EvasionRatingPercent | T3 | 3 | 54 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 161 | prefix | 879 | EvasionRatingPercent | T4 | 4 | 46 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 160 | prefix | 879 | EvasionRatingPercent | T5 | 5 | 33 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 159 | prefix | 879 | EvasionRatingPercent | T6 | 6 | 16 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 158 | prefix | 879 | EvasionRatingPercent | T7 | 7 | 2 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1004 | prefix | 84 | IncreasedAccuracy | T1 | 2 | 67 | +{0} to Accuracy Rating | 400 | 400 | 400 | 1/432 | 0.231481% |
| 1003 | prefix | 84 | IncreasedAccuracy | T2 | 3 | 58 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/216 | 0.462963% |
| 1002 | prefix | 84 | IncreasedAccuracy | T3 | 4 | 48 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/216 | 0.462963% |
| 1001 | prefix | 84 | IncreasedAccuracy | T4 | 5 | 36 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/216 | 0.462963% |
| 1000 | prefix | 84 | IncreasedAccuracy | T5 | 6 | 26 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/216 | 0.462963% |
| 999 | prefix | 84 | IncreasedAccuracy | T6 | 7 | 18 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/216 | 0.462963% |
| 998 | prefix | 84 | IncreasedAccuracy | T7 | 8 | 11 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/216 | 0.462963% |
| 997 | prefix | 84 | IncreasedAccuracy | T8 | 9 | 1 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/216 | 0.462963% |
| 150 | prefix | 877 | IncreasedEnergyShield | T1 | 1 | 80 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 149 | prefix | 877 | IncreasedEnergyShield | T2 | 2 | 70 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 148 | prefix | 877 | IncreasedEnergyShield | T3 | 3 | 65 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 147 | prefix | 877 | IncreasedEnergyShield | T4 | 4 | 54 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 146 | prefix | 877 | IncreasedEnergyShield | T5 | 5 | 46 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 145 | prefix | 877 | IncreasedEnergyShield | T6 | 6 | 33 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 144 | prefix | 877 | IncreasedEnergyShield | T7 | 7 | 25 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 143 | prefix | 877 | IncreasedEnergyShield | T8 | 8 | 16 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 142 | prefix | 877 | IncreasedEnergyShield | T9 | 9 | 11 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 141 | prefix | 877 | IncreasedEnergyShield | T10 | 10 | 1 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 86 | prefix | 73 | IncreasedLife | T1 | 5 | 60 | +{0} to maximum Life | 1000 | null | 1000 | 5/864 | 0.578704% |
| 85 | prefix | 73 | IncreasedLife | T2 | 6 | 54 | +{0} to maximum Life | 1000 | null | 1000 | 5/864 | 0.578704% |
| 84 | prefix | 73 | IncreasedLife | T3 | 7 | 46 | +{0} to maximum Life | 1000 | null | 1000 | 5/864 | 0.578704% |
| 83 | prefix | 73 | IncreasedLife | T4 | 8 | 38 | +{0} to maximum Life | 1000 | null | 1000 | 5/864 | 0.578704% |
| 82 | prefix | 73 | IncreasedLife | T5 | 9 | 33 | +{0} to maximum Life | 1000 | null | 1000 | 5/864 | 0.578704% |
| 81 | prefix | 73 | IncreasedLife | T6 | 10 | 24 | +{0} to maximum Life | 1000 | null | 1000 | 5/864 | 0.578704% |
| 80 | prefix | 73 | IncreasedLife | T7 | 11 | 16 | +{0} to maximum Life | 1000 | null | 1000 | 5/864 | 0.578704% |
| 79 | prefix | 73 | IncreasedLife | T8 | 12 | 6 | +{0} to maximum Life | 1000 | null | 1000 | 5/864 | 0.578704% |
| 78 | prefix | 73 | IncreasedLife | T9 | 13 | 1 | +{0} to maximum Life | 1000 | null | 1000 | 5/864 | 0.578704% |
| 106 | prefix | 74 | IncreasedMana | T1 | 1 | 82 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 105 | prefix | 74 | IncreasedMana | T2 | 2 | 75 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 104 | prefix | 74 | IncreasedMana | T3 | 3 | 70 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 103 | prefix | 74 | IncreasedMana | T4 | 4 | 65 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 102 | prefix | 74 | IncreasedMana | T5 | 5 | 60 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 101 | prefix | 74 | IncreasedMana | T6 | 6 | 54 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 100 | prefix | 74 | IncreasedMana | T7 | 7 | 46 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 99 | prefix | 74 | IncreasedMana | T8 | 8 | 38 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 98 | prefix | 74 | IncreasedMana | T9 | 9 | 33 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 97 | prefix | 74 | IncreasedMana | T10 | 10 | 25 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 96 | prefix | 74 | IncreasedMana | T11 | 11 | 16 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 95 | prefix | 74 | IncreasedMana | T12 | 12 | 6 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 94 | prefix | 74 | IncreasedMana | T13 | 13 | 1 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 157 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T1 | 1 | 75 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 156 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T2 | 2 | 65 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 155 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T3 | 3 | 54 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 154 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T4 | 4 | 46 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 153 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T5 | 5 | 33 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 152 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T6 | 6 | 16 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 151 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T7 | 7 | 2 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1117 | prefix | 86 | ItemFoundRarityIncreasePrefix | T1 | 1 | 47 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1116 | prefix | 86 | ItemFoundRarityIncreasePrefix | T2 | 2 | 29 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1115 | prefix | 86 | ItemFoundRarityIncreasePrefix | T3 | 3 | 10 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 93 | prefix | 875 | MaximumLifeIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Life | 300 | 300 | 300 | 1/576 | 0.173611% |
| 92 | prefix | 875 | MaximumLifeIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Life | 300 | 300 | 300 | 1/576 | 0.173611% |
| 91 | prefix | 875 | MaximumLifeIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Life | 300 | 300 | 300 | 1/576 | 0.173611% |
| 121 | prefix | 876 | MaximumManaIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Mana | 300 | 300 | 300 | 1/576 | 0.173611% |
| 120 | prefix | 876 | MaximumManaIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Mana | 300 | 300 | 300 | 1/576 | 0.173611% |
| 119 | prefix | 876 | MaximumManaIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Mana | 300 | 300 | 300 | 1/576 | 0.173611% |
| 1354 | prefix | 883 | SpellDamage | T1 | 1 | 75 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1353 | prefix | 883 | SpellDamage | T2 | 2 | 60 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1352 | prefix | 883 | SpellDamage | T3 | 3 | 46 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1351 | prefix | 883 | SpellDamage | T4 | 4 | 33 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1350 | prefix | 883 | SpellDamage | T5 | 5 | 16 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1349 | prefix | 883 | SpellDamage | T6 | 6 | 1 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 35 | suffix | 67 | AllAttributes | T1 | 1 | 82 | +{0} to all Attributes | 800 | 800 | 800 | 1/216 | 0.462963% |
| 34 | suffix | 67 | AllAttributes | T2 | 2 | 75 | +{0} to all Attributes | 800 | 800 | 800 | 1/216 | 0.462963% |
| 33 | suffix | 67 | AllAttributes | T3 | 3 | 66 | +{0} to all Attributes | 800 | 800 | 800 | 1/216 | 0.462963% |
| 32 | suffix | 67 | AllAttributes | T4 | 4 | 55 | +{0} to all Attributes | 800 | 800 | 800 | 1/216 | 0.462963% |
| 31 | suffix | 67 | AllAttributes | T5 | 5 | 44 | +{0} to all Attributes | 800 | 800 | 800 | 1/216 | 0.462963% |
| 30 | suffix | 67 | AllAttributes | T6 | 6 | 33 | +{0} to all Attributes | 800 | null | 800 | 1/216 | 0.462963% |
| 29 | suffix | 67 | AllAttributes | T7 | 7 | 22 | +{0} to all Attributes | 800 | null | 800 | 1/216 | 0.462963% |
| 28 | suffix | 67 | AllAttributes | T8 | 8 | 11 | +{0} to all Attributes | 800 | null | 800 | 1/216 | 0.462963% |
| 27 | suffix | 67 | AllAttributes | T9 | 9 | 1 | +{0} to all Attributes | 800 | null | 800 | 1/216 | 0.462963% |
| 65 | suffix | 71 | AllResistances | T1 | 1 | 80 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 1/216 | 0.462963% |
| 64 | suffix | 71 | AllResistances | T2 | 2 | 68 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 1/216 | 0.462963% |
| 63 | suffix | 71 | AllResistances | T3 | 3 | 54 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 1/216 | 0.462963% |
| 62 | suffix | 71 | AllResistances | T4 | 4 | 40 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 1/216 | 0.462963% |
| 61 | suffix | 71 | AllResistances | T5 | 5 | 26 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 1/216 | 0.462963% |
| 60 | suffix | 71 | AllResistances | T6 | 6 | 12 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 1/216 | 0.462963% |
| 77 | suffix | 72 | ChaosResistance | T1 | 1 | 81 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3456 | 0.144676% |
| 76 | suffix | 72 | ChaosResistance | T2 | 2 | 68 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3456 | 0.144676% |
| 75 | suffix | 72 | ChaosResistance | T3 | 4 | 56 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3456 | 0.144676% |
| 74 | suffix | 72 | ChaosResistance | T4 | 5 | 44 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3456 | 0.144676% |
| 73 | suffix | 72 | ChaosResistance | T5 | 6 | 30 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3456 | 0.144676% |
| 72 | suffix | 72 | ChaosResistance | T6 | 7 | 16 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3456 | 0.144676% |
| 51 | suffix | 69 | ColdResistance | T1 | 1 | 82 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 50 | suffix | 69 | ColdResistance | T2 | 2 | 71 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 49 | suffix | 69 | ColdResistance | T3 | 3 | 60 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 48 | suffix | 69 | ColdResistance | T4 | 4 | 50 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 47 | suffix | 69 | ColdResistance | T5 | 5 | 38 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 46 | suffix | 69 | ColdResistance | T6 | 6 | 26 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 45 | suffix | 69 | ColdResistance | T7 | 7 | 14 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 44 | suffix | 69 | ColdResistance | T8 | 8 | 1 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 1029 | suffix | 253 | CriticalStrikeChanceIncrease | T1 | 1 | 72 | {0}% increased Critical Hit Chance | 125 | 125 | 125 | 5/6912 | 0.072338% |
| 1028 | suffix | 253 | CriticalStrikeChanceIncrease | T2 | 2 | 58 | {0}% increased Critical Hit Chance | 250 | 250 | 250 | 5/3456 | 0.144676% |
| 1027 | suffix | 253 | CriticalStrikeChanceIncrease | T3 | 3 | 44 | {0}% increased Critical Hit Chance | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 1026 | suffix | 253 | CriticalStrikeChanceIncrease | T4 | 4 | 30 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1025 | suffix | 253 | CriticalStrikeChanceIncrease | T5 | 5 | 20 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1024 | suffix | 253 | CriticalStrikeChanceIncrease | T6 | 6 | 5 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1072 | suffix | 347 | CriticalStrikeMultiplier | T1 | 1 | 74 | {0}% increased Critical Damage Bonus | 125 | 125 | 125 | 5/6912 | 0.072338% |
| 1071 | suffix | 347 | CriticalStrikeMultiplier | T2 | 2 | 59 | {0}% increased Critical Damage Bonus | 250 | 250 | 250 | 5/3456 | 0.144676% |
| 1070 | suffix | 347 | CriticalStrikeMultiplier | T3 | 3 | 45 | {0}% increased Critical Damage Bonus | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 1069 | suffix | 347 | CriticalStrikeMultiplier | T4 | 4 | 31 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1068 | suffix | 347 | CriticalStrikeMultiplier | T5 | 5 | 21 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1067 | suffix | 347 | CriticalStrikeMultiplier | T6 | 6 | 8 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1331 | suffix | 881 | DamageTakenGainedAsLife | T1 | 1 | 79 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 1330 | suffix | 881 | DamageTakenGainedAsLife | T2 | 2 | 68 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 1329 | suffix | 881 | DamageTakenGainedAsLife | T3 | 3 | 56 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 1328 | suffix | 881 | DamageTakenGainedAsLife | T4 | 4 | 44 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 1327 | suffix | 881 | DamageTakenGainedAsLife | T5 | 5 | 30 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 16 | suffix | 49 | Dexterity | T1 | 2 | 74 | +{0} to Dexterity | 1000 | null | 1000 | 5/864 | 0.578704% |
| 15 | suffix | 49 | Dexterity | T2 | 3 | 66 | +{0} to Dexterity | 1000 | null | 1000 | 5/864 | 0.578704% |
| 14 | suffix | 49 | Dexterity | T3 | 4 | 55 | +{0} to Dexterity | 1000 | null | 1000 | 5/864 | 0.578704% |
| 13 | suffix | 49 | Dexterity | T4 | 5 | 44 | +{0} to Dexterity | 1000 | null | 1000 | 5/864 | 0.578704% |
| 12 | suffix | 49 | Dexterity | T5 | 6 | 33 | +{0} to Dexterity | 1000 | null | 1000 | 5/864 | 0.578704% |
| 11 | suffix | 49 | Dexterity | T6 | 7 | 22 | +{0} to Dexterity | 1000 | null | 1000 | 5/864 | 0.578704% |
| 10 | suffix | 49 | Dexterity | T7 | 8 | 11 | +{0} to Dexterity | 1000 | null | 1000 | 5/864 | 0.578704% |
| 9 | suffix | 49 | Dexterity | T8 | 9 | 1 | +{0} to Dexterity | 1000 | null | 1000 | 5/864 | 0.578704% |
| 43 | suffix | 68 | FireResistance | T1 | 1 | 82 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 42 | suffix | 68 | FireResistance | T2 | 2 | 71 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 41 | suffix | 68 | FireResistance | T3 | 3 | 60 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 40 | suffix | 68 | FireResistance | T4 | 4 | 48 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 39 | suffix | 68 | FireResistance | T5 | 5 | 36 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 38 | suffix | 68 | FireResistance | T6 | 6 | 24 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 37 | suffix | 68 | FireResistance | T7 | 7 | 12 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 36 | suffix | 68 | FireResistance | T8 | 8 | 1 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 16303 | suffix | 126 | IncreasedCastSpeed | T1 | 3 | 66 | {0}% increased Cast Speed | 800 | 800 | 800 | 1/216 | 0.462963% |
| 16302 | suffix | 126 | IncreasedCastSpeed | T2 | 4 | 60 | {0}% increased Cast Speed | 800 | null | 800 | 1/216 | 0.462963% |
| 16301 | suffix | 126 | IncreasedCastSpeed | T3 | 5 | 51 | {0}% increased Cast Speed | 800 | null | 800 | 1/216 | 0.462963% |
| 16300 | suffix | 126 | IncreasedCastSpeed | T4 | 7 | 35 | {0}% increased Cast Speed | 800 | null | 800 | 1/216 | 0.462963% |
| 16299 | suffix | 126 | IncreasedCastSpeed | T5 | 9 | 18 | {0}% increased Cast Speed | 800 | null | 800 | 1/216 | 0.462963% |
| 16298 | suffix | 126 | IncreasedCastSpeed | T6 | 11 | 1 | {0}% increased Cast Speed | 800 | null | 800 | 1/216 | 0.462963% |
| 838 | suffix | 252 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Minion Skills | 100 | 100 | 100 | 1/1728 | 0.057870% |
| 867 | suffix | 695 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Projectile Skills | 100 | 100 | 100 | 1/1728 | 0.057870% |
| 761 | suffix | 716 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Spell Skills | 100 | 100 | 100 | 1/1728 | 0.057870% |
| 837 | suffix | 252 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Minion Skills | 250 | 250 | 250 | 5/3456 | 0.144676% |
| 866 | suffix | 695 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Projectile Skills | 250 | 250 | 250 | 5/3456 | 0.144676% |
| 760 | suffix | 716 | IncreaseSocketedGemLevel | T2 | 5 | 41 | +{0} to Level of all Spell Skills | 250 | 250 | 250 | 5/3456 | 0.144676% |
| 759 | suffix | 716 | IncreaseSocketedGemLevel | T3 | 7 | 10 | +{0} to Level of all Spell Skills | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 836 | suffix | 252 | IncreaseSocketedGemLevel | T3 | 6 | 5 | +{0} to Level of all Minion Skills | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 865 | suffix | 695 | IncreaseSocketedGemLevel | T3 | 7 | 5 | +{0} to Level of all Projectile Skills | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 25 | suffix | 66 | Intelligence | T1 | 2 | 74 | +{0} to Intelligence | 1000 | null | 1000 | 5/864 | 0.578704% |
| 24 | suffix | 66 | Intelligence | T2 | 3 | 66 | +{0} to Intelligence | 1000 | null | 1000 | 5/864 | 0.578704% |
| 23 | suffix | 66 | Intelligence | T3 | 4 | 55 | +{0} to Intelligence | 1000 | null | 1000 | 5/864 | 0.578704% |
| 22 | suffix | 66 | Intelligence | T4 | 5 | 44 | +{0} to Intelligence | 1000 | null | 1000 | 5/864 | 0.578704% |
| 21 | suffix | 66 | Intelligence | T5 | 6 | 33 | +{0} to Intelligence | 1000 | null | 1000 | 5/864 | 0.578704% |
| 20 | suffix | 66 | Intelligence | T6 | 7 | 22 | +{0} to Intelligence | 1000 | null | 1000 | 5/864 | 0.578704% |
| 19 | suffix | 66 | Intelligence | T7 | 8 | 11 | +{0} to Intelligence | 1000 | null | 1000 | 5/864 | 0.578704% |
| 18 | suffix | 66 | Intelligence | T8 | 9 | 1 | +{0} to Intelligence | 1000 | null | 1000 | 5/864 | 0.578704% |
| 1112 | suffix | 85 | ItemFoundRarityIncrease | T1 | 1 | 40 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1111 | suffix | 85 | ItemFoundRarityIncrease | T2 | 2 | 24 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1110 | suffix | 85 | ItemFoundRarityIncrease | T3 | 3 | 3 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 887 | suffix | 80 | LifeRegeneration | T1 | 2 | 75 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 886 | suffix | 80 | LifeRegeneration | T2 | 3 | 68 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 885 | suffix | 80 | LifeRegeneration | T3 | 4 | 58 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 884 | suffix | 80 | LifeRegeneration | T4 | 5 | 47 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 883 | suffix | 80 | LifeRegeneration | T5 | 6 | 35 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 882 | suffix | 80 | LifeRegeneration | T6 | 7 | 26 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 881 | suffix | 80 | LifeRegeneration | T7 | 8 | 17 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 880 | suffix | 80 | LifeRegeneration | T8 | 9 | 11 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 879 | suffix | 80 | LifeRegeneration | T9 | 10 | 5 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 878 | suffix | 80 | LifeRegeneration | T10 | 11 | 1 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 59 | suffix | 70 | LightningResistance | T1 | 1 | 82 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 58 | suffix | 70 | LightningResistance | T2 | 2 | 71 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 57 | suffix | 70 | LightningResistance | T3 | 3 | 60 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 56 | suffix | 70 | LightningResistance | T4 | 4 | 49 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 55 | suffix | 70 | LightningResistance | T5 | 5 | 37 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 54 | suffix | 70 | LightningResistance | T6 | 6 | 25 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 53 | suffix | 70 | LightningResistance | T7 | 7 | 13 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 52 | suffix | 70 | LightningResistance | T8 | 8 | 1 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/864 | 0.578704% |
| 905 | suffix | 81 | ManaRegeneration | T1 | 1 | 79 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 904 | suffix | 81 | ManaRegeneration | T2 | 2 | 55 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 903 | suffix | 81 | ManaRegeneration | T3 | 3 | 42 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 902 | suffix | 81 | ManaRegeneration | T4 | 4 | 29 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 901 | suffix | 81 | ManaRegeneration | T5 | 5 | 18 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 900 | suffix | 81 | ManaRegeneration | T6 | 6 | 1 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/864 | 0.578704% |
| 1336 | suffix | 882 | PercentDamageGoesToMana | T1 | 1 | 80 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 1335 | suffix | 882 | PercentDamageGoesToMana | T2 | 2 | 69 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 1334 | suffix | 882 | PercentDamageGoesToMana | T3 | 3 | 57 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 1333 | suffix | 882 | PercentDamageGoesToMana | T4 | 4 | 45 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 1332 | suffix | 882 | PercentDamageGoesToMana | T5 | 5 | 31 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1728 | 0.289352% |
| 7 | suffix | 48 | Strength | T1 | 2 | 74 | +{0} to Strength | 1000 | null | 1000 | 5/864 | 0.578704% |
| 6 | suffix | 48 | Strength | T2 | 3 | 66 | +{0} to Strength | 1000 | null | 1000 | 5/864 | 0.578704% |
| 5 | suffix | 48 | Strength | T3 | 4 | 55 | +{0} to Strength | 1000 | null | 1000 | 5/864 | 0.578704% |
| 4 | suffix | 48 | Strength | T4 | 5 | 44 | +{0} to Strength | 1000 | null | 1000 | 5/864 | 0.578704% |
| 3 | suffix | 48 | Strength | T5 | 6 | 33 | +{0} to Strength | 1000 | null | 1000 | 5/864 | 0.578704% |
| 2 | suffix | 48 | Strength | T6 | 7 | 22 | +{0} to Strength | 1000 | null | 1000 | 5/864 | 0.578704% |
| 1 | suffix | 48 | Strength | T7 | 8 | 11 | +{0} to Strength | 1000 | null | 1000 | 5/864 | 0.578704% |
| 0 | suffix | 48 | Strength | T8 | 9 | 1 | +{0} to Strength | 1000 | null | 1000 | 5/864 | 0.578704% |

### existing-spirit-and-melee

Spirit and Melee source groups are both blocked.

Denominator: **170400**; minimum modifier level: **0**; side: **both**; existing source IDs: **1140, 854**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 0/170400 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| T1 Spirit (47–50) | 0/170400 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +1 Projectile Skills | 5/1704 | 0.293427% | 340.800000 | 97.104171% | 86.335503% | 74.538190% | 58.749707% |
| +2 Projectile Skills | 5/3408 | 0.146714% | 681.600000 | 98.542512% | 92.921915% | 86.344822% | 76.663334% |
| +3 Projectile Skills | 1/1704 | 0.058685% | 1704.000000 | 99.414693% | 97.107523% | 94.298710% | 89.919817% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| prefix | 880 | EnergyShieldPercent | {0}% increased maximum Energy Shield | 7000 | 35/852 | 4.107981% | source:171, source:170, source:169, source:168, source:167, source:166, source:165 |
| prefix | 879 | EvasionRatingPercent | {0}% increased Evasion Rating | 7000 | 35/852 | 4.107981% | source:164, source:163, source:162, source:161, source:160, source:159, source:158 |
| prefix | 84 | IncreasedAccuracy | +{0} to Accuracy Rating | 6000 | 5/142 | 3.521127% | source:1004, source:1003, source:1002, source:1001, source:1000, source:999, source:998, source:997 |
| prefix | 877 | IncreasedEnergyShield | +{0} to maximum Energy Shield | 10000 | 25/426 | 5.868545% | source:150, source:149, source:148, source:147, source:146, source:145, source:144, source:143, source:142, source:141 |
| prefix | 73 | IncreasedLife | +{0} to maximum Life | 9000 | 15/284 | 5.281690% | source:86, source:85, source:84, source:83, source:82, source:81, source:80, source:79, source:78 |
| prefix | 74 | IncreasedMana | +{0} to maximum Mana | 13000 | 65/852 | 7.629108% | source:106, source:105, source:104, source:103, source:102, source:101, source:100, source:99, source:98, source:97, source:96, source:95, source:94 |
| prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | {0}% increased Armour | 7000 | 35/852 | 4.107981% | source:157, source:156, source:155, source:154, source:153, source:152, source:151 |
| prefix | 86 | ItemFoundRarityIncreasePrefix | {0}% increased Rarity of Items found | 3000 | 5/284 | 1.760563% | source:1117, source:1116, source:1115 |
| prefix | 875 | MaximumLifeIncreasePercent | {0}% increased maximum Life | 900 | 3/568 | 0.528169% | source:93, source:92, source:91 |
| prefix | 876 | MaximumManaIncreasePercent | {0}% increased maximum Mana | 900 | 3/568 | 0.528169% | source:121, source:120, source:119 |
| prefix | 883 | SpellDamage | {0}% increased Spell Damage | 6000 | 5/142 | 3.521127% | source:1354, source:1353, source:1352, source:1351, source:1350, source:1349 |
| suffix | 67 | AllAttributes | +{0} to all Attributes | 7200 | 3/71 | 4.225352% | source:35, source:34, source:33, source:32, source:31, source:30, source:29, source:28, source:27 |
| suffix | 71 | AllResistances | +{0}% to all Elemental Resistances | 4800 | 2/71 | 2.816901% | source:65, source:64, source:63, source:62, source:61, source:60 |
| suffix | 72 | ChaosResistance | +{0}% to Chaos Resistance | 1500 | 5/568 | 0.880282% | source:77, source:76, source:75, source:74, source:73, source:72 |
| suffix | 69 | ColdResistance | +{0}% to Cold Resistance | 8000 | 10/213 | 4.694836% | source:51, source:50, source:49, source:48, source:47, source:46, source:45, source:44 |
| suffix | 253 | CriticalStrikeChanceIncrease | {0}% increased Critical Hit Chance | 3875 | 155/6816 | 2.274061% | source:1029, source:1028, source:1027, source:1026, source:1025, source:1024 |
| suffix | 347 | CriticalStrikeMultiplier | {0}% increased Critical Damage Bonus | 3875 | 155/6816 | 2.274061% | source:1072, source:1071, source:1070, source:1069, source:1068, source:1067 |
| suffix | 881 | DamageTakenGainedAsLife | {0}% of Damage taken Recouped as Life | 2500 | 25/1704 | 1.467136% | source:1331, source:1330, source:1329, source:1328, source:1327 |
| suffix | 49 | Dexterity | +{0} to Dexterity | 8000 | 10/213 | 4.694836% | source:16, source:15, source:14, source:13, source:12, source:11, source:10, source:9 |
| suffix | 68 | FireResistance | +{0}% to Fire Resistance | 8000 | 10/213 | 4.694836% | source:43, source:42, source:41, source:40, source:39, source:38, source:37, source:36 |
| suffix | 126 | IncreasedCastSpeed | {0}% increased Cast Speed | 4800 | 2/71 | 2.816901% | source:16303, source:16302, source:16301, source:16300, source:16299, source:16298 |
| suffix | 252 | IncreaseSocketedGemLevel | +{0} to Level of all Minion Skills | 850 | 17/3408 | 0.498826% | source:838, source:837, source:836 |
| suffix | 695 | IncreaseSocketedGemLevel | +{0} to Level of all Projectile Skills | 850 | 17/3408 | 0.498826% | source:867, source:866, source:865 |
| suffix | 716 | IncreaseSocketedGemLevel | +{0} to Level of all Spell Skills | 850 | 17/3408 | 0.498826% | source:761, source:760, source:759 |
| suffix | 66 | Intelligence | +{0} to Intelligence | 8000 | 10/213 | 4.694836% | source:25, source:24, source:23, source:22, source:21, source:20, source:19, source:18 |
| suffix | 85 | ItemFoundRarityIncrease | {0}% increased Rarity of Items found | 3000 | 5/284 | 1.760563% | source:1112, source:1111, source:1110 |
| suffix | 80 | LifeRegeneration | {0} Life Regeneration per second | 10000 | 25/426 | 5.868545% | source:887, source:886, source:885, source:884, source:883, source:882, source:881, source:880, source:879, source:878 |
| suffix | 70 | LightningResistance | +{0}% to Lightning Resistance | 8000 | 10/213 | 4.694836% | source:59, source:58, source:57, source:56, source:55, source:54, source:53, source:52 |
| suffix | 81 | ManaRegeneration | {0}% increased Mana Regeneration Rate | 6000 | 5/142 | 3.521127% | source:905, source:904, source:903, source:902, source:901, source:900 |
| suffix | 882 | PercentDamageGoesToMana | {0}% of Damage taken Recouped as Mana | 2500 | 25/1704 | 1.467136% | source:1336, source:1335, source:1334, source:1333, source:1332 |
| suffix | 48 | Strength | +{0} to Strength | 8000 | 10/213 | 4.694836% | source:7, source:6, source:5, source:4, source:3, source:2, source:1, source:0 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 171 | prefix | 880 | EnergyShieldPercent | T1 | 1 | 75 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 170 | prefix | 880 | EnergyShieldPercent | T2 | 2 | 65 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 169 | prefix | 880 | EnergyShieldPercent | T3 | 3 | 54 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 168 | prefix | 880 | EnergyShieldPercent | T4 | 4 | 46 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 167 | prefix | 880 | EnergyShieldPercent | T5 | 5 | 33 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 166 | prefix | 880 | EnergyShieldPercent | T6 | 6 | 16 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 165 | prefix | 880 | EnergyShieldPercent | T7 | 7 | 2 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 164 | prefix | 879 | EvasionRatingPercent | T1 | 1 | 77 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 163 | prefix | 879 | EvasionRatingPercent | T2 | 2 | 70 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 162 | prefix | 879 | EvasionRatingPercent | T3 | 3 | 54 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 161 | prefix | 879 | EvasionRatingPercent | T4 | 4 | 46 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 160 | prefix | 879 | EvasionRatingPercent | T5 | 5 | 33 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 159 | prefix | 879 | EvasionRatingPercent | T6 | 6 | 16 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 158 | prefix | 879 | EvasionRatingPercent | T7 | 7 | 2 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1004 | prefix | 84 | IncreasedAccuracy | T1 | 2 | 67 | +{0} to Accuracy Rating | 400 | 400 | 400 | 1/426 | 0.234742% |
| 1003 | prefix | 84 | IncreasedAccuracy | T2 | 3 | 58 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/213 | 0.469484% |
| 1002 | prefix | 84 | IncreasedAccuracy | T3 | 4 | 48 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/213 | 0.469484% |
| 1001 | prefix | 84 | IncreasedAccuracy | T4 | 5 | 36 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/213 | 0.469484% |
| 1000 | prefix | 84 | IncreasedAccuracy | T5 | 6 | 26 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/213 | 0.469484% |
| 999 | prefix | 84 | IncreasedAccuracy | T6 | 7 | 18 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/213 | 0.469484% |
| 998 | prefix | 84 | IncreasedAccuracy | T7 | 8 | 11 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/213 | 0.469484% |
| 997 | prefix | 84 | IncreasedAccuracy | T8 | 9 | 1 | +{0} to Accuracy Rating | 800 | 800 | 800 | 1/213 | 0.469484% |
| 150 | prefix | 877 | IncreasedEnergyShield | T1 | 1 | 80 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 149 | prefix | 877 | IncreasedEnergyShield | T2 | 2 | 70 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 148 | prefix | 877 | IncreasedEnergyShield | T3 | 3 | 65 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 147 | prefix | 877 | IncreasedEnergyShield | T4 | 4 | 54 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 146 | prefix | 877 | IncreasedEnergyShield | T5 | 5 | 46 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 145 | prefix | 877 | IncreasedEnergyShield | T6 | 6 | 33 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 144 | prefix | 877 | IncreasedEnergyShield | T7 | 7 | 25 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 143 | prefix | 877 | IncreasedEnergyShield | T8 | 8 | 16 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 142 | prefix | 877 | IncreasedEnergyShield | T9 | 9 | 11 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 141 | prefix | 877 | IncreasedEnergyShield | T10 | 10 | 1 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 86 | prefix | 73 | IncreasedLife | T1 | 5 | 60 | +{0} to maximum Life | 1000 | null | 1000 | 5/852 | 0.586854% |
| 85 | prefix | 73 | IncreasedLife | T2 | 6 | 54 | +{0} to maximum Life | 1000 | null | 1000 | 5/852 | 0.586854% |
| 84 | prefix | 73 | IncreasedLife | T3 | 7 | 46 | +{0} to maximum Life | 1000 | null | 1000 | 5/852 | 0.586854% |
| 83 | prefix | 73 | IncreasedLife | T4 | 8 | 38 | +{0} to maximum Life | 1000 | null | 1000 | 5/852 | 0.586854% |
| 82 | prefix | 73 | IncreasedLife | T5 | 9 | 33 | +{0} to maximum Life | 1000 | null | 1000 | 5/852 | 0.586854% |
| 81 | prefix | 73 | IncreasedLife | T6 | 10 | 24 | +{0} to maximum Life | 1000 | null | 1000 | 5/852 | 0.586854% |
| 80 | prefix | 73 | IncreasedLife | T7 | 11 | 16 | +{0} to maximum Life | 1000 | null | 1000 | 5/852 | 0.586854% |
| 79 | prefix | 73 | IncreasedLife | T8 | 12 | 6 | +{0} to maximum Life | 1000 | null | 1000 | 5/852 | 0.586854% |
| 78 | prefix | 73 | IncreasedLife | T9 | 13 | 1 | +{0} to maximum Life | 1000 | null | 1000 | 5/852 | 0.586854% |
| 106 | prefix | 74 | IncreasedMana | T1 | 1 | 82 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 105 | prefix | 74 | IncreasedMana | T2 | 2 | 75 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 104 | prefix | 74 | IncreasedMana | T3 | 3 | 70 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 103 | prefix | 74 | IncreasedMana | T4 | 4 | 65 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 102 | prefix | 74 | IncreasedMana | T5 | 5 | 60 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 101 | prefix | 74 | IncreasedMana | T6 | 6 | 54 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 100 | prefix | 74 | IncreasedMana | T7 | 7 | 46 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 99 | prefix | 74 | IncreasedMana | T8 | 8 | 38 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 98 | prefix | 74 | IncreasedMana | T9 | 9 | 33 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 97 | prefix | 74 | IncreasedMana | T10 | 10 | 25 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 96 | prefix | 74 | IncreasedMana | T11 | 11 | 16 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 95 | prefix | 74 | IncreasedMana | T12 | 12 | 6 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 94 | prefix | 74 | IncreasedMana | T13 | 13 | 1 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 157 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T1 | 1 | 75 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 156 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T2 | 2 | 65 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 155 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T3 | 3 | 54 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 154 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T4 | 4 | 46 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 153 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T5 | 5 | 33 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 152 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T6 | 6 | 16 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 151 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T7 | 7 | 2 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1117 | prefix | 86 | ItemFoundRarityIncreasePrefix | T1 | 1 | 47 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1116 | prefix | 86 | ItemFoundRarityIncreasePrefix | T2 | 2 | 29 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1115 | prefix | 86 | ItemFoundRarityIncreasePrefix | T3 | 3 | 10 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 93 | prefix | 875 | MaximumLifeIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Life | 300 | 300 | 300 | 1/568 | 0.176056% |
| 92 | prefix | 875 | MaximumLifeIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Life | 300 | 300 | 300 | 1/568 | 0.176056% |
| 91 | prefix | 875 | MaximumLifeIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Life | 300 | 300 | 300 | 1/568 | 0.176056% |
| 121 | prefix | 876 | MaximumManaIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Mana | 300 | 300 | 300 | 1/568 | 0.176056% |
| 120 | prefix | 876 | MaximumManaIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Mana | 300 | 300 | 300 | 1/568 | 0.176056% |
| 119 | prefix | 876 | MaximumManaIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Mana | 300 | 300 | 300 | 1/568 | 0.176056% |
| 1354 | prefix | 883 | SpellDamage | T1 | 1 | 75 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1353 | prefix | 883 | SpellDamage | T2 | 2 | 60 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1352 | prefix | 883 | SpellDamage | T3 | 3 | 46 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1351 | prefix | 883 | SpellDamage | T4 | 4 | 33 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1350 | prefix | 883 | SpellDamage | T5 | 5 | 16 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1349 | prefix | 883 | SpellDamage | T6 | 6 | 1 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 35 | suffix | 67 | AllAttributes | T1 | 1 | 82 | +{0} to all Attributes | 800 | 800 | 800 | 1/213 | 0.469484% |
| 34 | suffix | 67 | AllAttributes | T2 | 2 | 75 | +{0} to all Attributes | 800 | 800 | 800 | 1/213 | 0.469484% |
| 33 | suffix | 67 | AllAttributes | T3 | 3 | 66 | +{0} to all Attributes | 800 | 800 | 800 | 1/213 | 0.469484% |
| 32 | suffix | 67 | AllAttributes | T4 | 4 | 55 | +{0} to all Attributes | 800 | 800 | 800 | 1/213 | 0.469484% |
| 31 | suffix | 67 | AllAttributes | T5 | 5 | 44 | +{0} to all Attributes | 800 | 800 | 800 | 1/213 | 0.469484% |
| 30 | suffix | 67 | AllAttributes | T6 | 6 | 33 | +{0} to all Attributes | 800 | null | 800 | 1/213 | 0.469484% |
| 29 | suffix | 67 | AllAttributes | T7 | 7 | 22 | +{0} to all Attributes | 800 | null | 800 | 1/213 | 0.469484% |
| 28 | suffix | 67 | AllAttributes | T8 | 8 | 11 | +{0} to all Attributes | 800 | null | 800 | 1/213 | 0.469484% |
| 27 | suffix | 67 | AllAttributes | T9 | 9 | 1 | +{0} to all Attributes | 800 | null | 800 | 1/213 | 0.469484% |
| 65 | suffix | 71 | AllResistances | T1 | 1 | 80 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 1/213 | 0.469484% |
| 64 | suffix | 71 | AllResistances | T2 | 2 | 68 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 1/213 | 0.469484% |
| 63 | suffix | 71 | AllResistances | T3 | 3 | 54 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 1/213 | 0.469484% |
| 62 | suffix | 71 | AllResistances | T4 | 4 | 40 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 1/213 | 0.469484% |
| 61 | suffix | 71 | AllResistances | T5 | 5 | 26 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 1/213 | 0.469484% |
| 60 | suffix | 71 | AllResistances | T6 | 6 | 12 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 1/213 | 0.469484% |
| 77 | suffix | 72 | ChaosResistance | T1 | 1 | 81 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3408 | 0.146714% |
| 76 | suffix | 72 | ChaosResistance | T2 | 2 | 68 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3408 | 0.146714% |
| 75 | suffix | 72 | ChaosResistance | T3 | 4 | 56 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3408 | 0.146714% |
| 74 | suffix | 72 | ChaosResistance | T4 | 5 | 44 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3408 | 0.146714% |
| 73 | suffix | 72 | ChaosResistance | T5 | 6 | 30 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3408 | 0.146714% |
| 72 | suffix | 72 | ChaosResistance | T6 | 7 | 16 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/3408 | 0.146714% |
| 51 | suffix | 69 | ColdResistance | T1 | 1 | 82 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 50 | suffix | 69 | ColdResistance | T2 | 2 | 71 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 49 | suffix | 69 | ColdResistance | T3 | 3 | 60 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 48 | suffix | 69 | ColdResistance | T4 | 4 | 50 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 47 | suffix | 69 | ColdResistance | T5 | 5 | 38 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 46 | suffix | 69 | ColdResistance | T6 | 6 | 26 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 45 | suffix | 69 | ColdResistance | T7 | 7 | 14 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 44 | suffix | 69 | ColdResistance | T8 | 8 | 1 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 1029 | suffix | 253 | CriticalStrikeChanceIncrease | T1 | 1 | 72 | {0}% increased Critical Hit Chance | 125 | 125 | 125 | 5/6816 | 0.073357% |
| 1028 | suffix | 253 | CriticalStrikeChanceIncrease | T2 | 2 | 58 | {0}% increased Critical Hit Chance | 250 | 250 | 250 | 5/3408 | 0.146714% |
| 1027 | suffix | 253 | CriticalStrikeChanceIncrease | T3 | 3 | 44 | {0}% increased Critical Hit Chance | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 1026 | suffix | 253 | CriticalStrikeChanceIncrease | T4 | 4 | 30 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1025 | suffix | 253 | CriticalStrikeChanceIncrease | T5 | 5 | 20 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1024 | suffix | 253 | CriticalStrikeChanceIncrease | T6 | 6 | 5 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1072 | suffix | 347 | CriticalStrikeMultiplier | T1 | 1 | 74 | {0}% increased Critical Damage Bonus | 125 | 125 | 125 | 5/6816 | 0.073357% |
| 1071 | suffix | 347 | CriticalStrikeMultiplier | T2 | 2 | 59 | {0}% increased Critical Damage Bonus | 250 | 250 | 250 | 5/3408 | 0.146714% |
| 1070 | suffix | 347 | CriticalStrikeMultiplier | T3 | 3 | 45 | {0}% increased Critical Damage Bonus | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 1069 | suffix | 347 | CriticalStrikeMultiplier | T4 | 4 | 31 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1068 | suffix | 347 | CriticalStrikeMultiplier | T5 | 5 | 21 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1067 | suffix | 347 | CriticalStrikeMultiplier | T6 | 6 | 8 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1331 | suffix | 881 | DamageTakenGainedAsLife | T1 | 1 | 79 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 1330 | suffix | 881 | DamageTakenGainedAsLife | T2 | 2 | 68 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 1329 | suffix | 881 | DamageTakenGainedAsLife | T3 | 3 | 56 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 1328 | suffix | 881 | DamageTakenGainedAsLife | T4 | 4 | 44 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 1327 | suffix | 881 | DamageTakenGainedAsLife | T5 | 5 | 30 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 16 | suffix | 49 | Dexterity | T1 | 2 | 74 | +{0} to Dexterity | 1000 | null | 1000 | 5/852 | 0.586854% |
| 15 | suffix | 49 | Dexterity | T2 | 3 | 66 | +{0} to Dexterity | 1000 | null | 1000 | 5/852 | 0.586854% |
| 14 | suffix | 49 | Dexterity | T3 | 4 | 55 | +{0} to Dexterity | 1000 | null | 1000 | 5/852 | 0.586854% |
| 13 | suffix | 49 | Dexterity | T4 | 5 | 44 | +{0} to Dexterity | 1000 | null | 1000 | 5/852 | 0.586854% |
| 12 | suffix | 49 | Dexterity | T5 | 6 | 33 | +{0} to Dexterity | 1000 | null | 1000 | 5/852 | 0.586854% |
| 11 | suffix | 49 | Dexterity | T6 | 7 | 22 | +{0} to Dexterity | 1000 | null | 1000 | 5/852 | 0.586854% |
| 10 | suffix | 49 | Dexterity | T7 | 8 | 11 | +{0} to Dexterity | 1000 | null | 1000 | 5/852 | 0.586854% |
| 9 | suffix | 49 | Dexterity | T8 | 9 | 1 | +{0} to Dexterity | 1000 | null | 1000 | 5/852 | 0.586854% |
| 43 | suffix | 68 | FireResistance | T1 | 1 | 82 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 42 | suffix | 68 | FireResistance | T2 | 2 | 71 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 41 | suffix | 68 | FireResistance | T3 | 3 | 60 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 40 | suffix | 68 | FireResistance | T4 | 4 | 48 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 39 | suffix | 68 | FireResistance | T5 | 5 | 36 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 38 | suffix | 68 | FireResistance | T6 | 6 | 24 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 37 | suffix | 68 | FireResistance | T7 | 7 | 12 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 36 | suffix | 68 | FireResistance | T8 | 8 | 1 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 16303 | suffix | 126 | IncreasedCastSpeed | T1 | 3 | 66 | {0}% increased Cast Speed | 800 | 800 | 800 | 1/213 | 0.469484% |
| 16302 | suffix | 126 | IncreasedCastSpeed | T2 | 4 | 60 | {0}% increased Cast Speed | 800 | null | 800 | 1/213 | 0.469484% |
| 16301 | suffix | 126 | IncreasedCastSpeed | T3 | 5 | 51 | {0}% increased Cast Speed | 800 | null | 800 | 1/213 | 0.469484% |
| 16300 | suffix | 126 | IncreasedCastSpeed | T4 | 7 | 35 | {0}% increased Cast Speed | 800 | null | 800 | 1/213 | 0.469484% |
| 16299 | suffix | 126 | IncreasedCastSpeed | T5 | 9 | 18 | {0}% increased Cast Speed | 800 | null | 800 | 1/213 | 0.469484% |
| 16298 | suffix | 126 | IncreasedCastSpeed | T6 | 11 | 1 | {0}% increased Cast Speed | 800 | null | 800 | 1/213 | 0.469484% |
| 838 | suffix | 252 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Minion Skills | 100 | 100 | 100 | 1/1704 | 0.058685% |
| 867 | suffix | 695 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Projectile Skills | 100 | 100 | 100 | 1/1704 | 0.058685% |
| 761 | suffix | 716 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Spell Skills | 100 | 100 | 100 | 1/1704 | 0.058685% |
| 837 | suffix | 252 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Minion Skills | 250 | 250 | 250 | 5/3408 | 0.146714% |
| 866 | suffix | 695 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Projectile Skills | 250 | 250 | 250 | 5/3408 | 0.146714% |
| 760 | suffix | 716 | IncreaseSocketedGemLevel | T2 | 5 | 41 | +{0} to Level of all Spell Skills | 250 | 250 | 250 | 5/3408 | 0.146714% |
| 759 | suffix | 716 | IncreaseSocketedGemLevel | T3 | 7 | 10 | +{0} to Level of all Spell Skills | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 836 | suffix | 252 | IncreaseSocketedGemLevel | T3 | 6 | 5 | +{0} to Level of all Minion Skills | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 865 | suffix | 695 | IncreaseSocketedGemLevel | T3 | 7 | 5 | +{0} to Level of all Projectile Skills | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 25 | suffix | 66 | Intelligence | T1 | 2 | 74 | +{0} to Intelligence | 1000 | null | 1000 | 5/852 | 0.586854% |
| 24 | suffix | 66 | Intelligence | T2 | 3 | 66 | +{0} to Intelligence | 1000 | null | 1000 | 5/852 | 0.586854% |
| 23 | suffix | 66 | Intelligence | T3 | 4 | 55 | +{0} to Intelligence | 1000 | null | 1000 | 5/852 | 0.586854% |
| 22 | suffix | 66 | Intelligence | T4 | 5 | 44 | +{0} to Intelligence | 1000 | null | 1000 | 5/852 | 0.586854% |
| 21 | suffix | 66 | Intelligence | T5 | 6 | 33 | +{0} to Intelligence | 1000 | null | 1000 | 5/852 | 0.586854% |
| 20 | suffix | 66 | Intelligence | T6 | 7 | 22 | +{0} to Intelligence | 1000 | null | 1000 | 5/852 | 0.586854% |
| 19 | suffix | 66 | Intelligence | T7 | 8 | 11 | +{0} to Intelligence | 1000 | null | 1000 | 5/852 | 0.586854% |
| 18 | suffix | 66 | Intelligence | T8 | 9 | 1 | +{0} to Intelligence | 1000 | null | 1000 | 5/852 | 0.586854% |
| 1112 | suffix | 85 | ItemFoundRarityIncrease | T1 | 1 | 40 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1111 | suffix | 85 | ItemFoundRarityIncrease | T2 | 2 | 24 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1110 | suffix | 85 | ItemFoundRarityIncrease | T3 | 3 | 3 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 887 | suffix | 80 | LifeRegeneration | T1 | 2 | 75 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 886 | suffix | 80 | LifeRegeneration | T2 | 3 | 68 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 885 | suffix | 80 | LifeRegeneration | T3 | 4 | 58 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 884 | suffix | 80 | LifeRegeneration | T4 | 5 | 47 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 883 | suffix | 80 | LifeRegeneration | T5 | 6 | 35 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 882 | suffix | 80 | LifeRegeneration | T6 | 7 | 26 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 881 | suffix | 80 | LifeRegeneration | T7 | 8 | 17 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 880 | suffix | 80 | LifeRegeneration | T8 | 9 | 11 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 879 | suffix | 80 | LifeRegeneration | T9 | 10 | 5 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 878 | suffix | 80 | LifeRegeneration | T10 | 11 | 1 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 59 | suffix | 70 | LightningResistance | T1 | 1 | 82 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 58 | suffix | 70 | LightningResistance | T2 | 2 | 71 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 57 | suffix | 70 | LightningResistance | T3 | 3 | 60 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 56 | suffix | 70 | LightningResistance | T4 | 4 | 49 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 55 | suffix | 70 | LightningResistance | T5 | 5 | 37 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 54 | suffix | 70 | LightningResistance | T6 | 6 | 25 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 53 | suffix | 70 | LightningResistance | T7 | 7 | 13 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 52 | suffix | 70 | LightningResistance | T8 | 8 | 1 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/852 | 0.586854% |
| 905 | suffix | 81 | ManaRegeneration | T1 | 1 | 79 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 904 | suffix | 81 | ManaRegeneration | T2 | 2 | 55 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 903 | suffix | 81 | ManaRegeneration | T3 | 3 | 42 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 902 | suffix | 81 | ManaRegeneration | T4 | 4 | 29 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 901 | suffix | 81 | ManaRegeneration | T5 | 5 | 18 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 900 | suffix | 81 | ManaRegeneration | T6 | 6 | 1 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/852 | 0.586854% |
| 1336 | suffix | 882 | PercentDamageGoesToMana | T1 | 1 | 80 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 1335 | suffix | 882 | PercentDamageGoesToMana | T2 | 2 | 69 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 1334 | suffix | 882 | PercentDamageGoesToMana | T3 | 3 | 57 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 1333 | suffix | 882 | PercentDamageGoesToMana | T4 | 4 | 45 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 1332 | suffix | 882 | PercentDamageGoesToMana | T5 | 5 | 31 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1704 | 0.293427% |
| 7 | suffix | 48 | Strength | T1 | 2 | 74 | +{0} to Strength | 1000 | null | 1000 | 5/852 | 0.586854% |
| 6 | suffix | 48 | Strength | T2 | 3 | 66 | +{0} to Strength | 1000 | null | 1000 | 5/852 | 0.586854% |
| 5 | suffix | 48 | Strength | T3 | 4 | 55 | +{0} to Strength | 1000 | null | 1000 | 5/852 | 0.586854% |
| 4 | suffix | 48 | Strength | T4 | 5 | 44 | +{0} to Strength | 1000 | null | 1000 | 5/852 | 0.586854% |
| 3 | suffix | 48 | Strength | T5 | 6 | 33 | +{0} to Strength | 1000 | null | 1000 | 5/852 | 0.586854% |
| 2 | suffix | 48 | Strength | T6 | 7 | 22 | +{0} to Strength | 1000 | null | 1000 | 5/852 | 0.586854% |
| 1 | suffix | 48 | Strength | T7 | 8 | 11 | +{0} to Strength | 1000 | null | 1000 | 5/852 | 0.586854% |
| 0 | suffix | 48 | Strength | T8 | 9 | 1 | +{0} to Strength | 1000 | null | 1000 | 5/852 | 0.586854% |

### existing-melee-prefix

Existing Melee suffix with a prefix-forcing roll.

Denominator: **72200**; minimum modifier level: **0**; side: **prefix**; existing source IDs: **854**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 12/361 | 3.324100% | 30.083333 | 71.315224% | 18.446384% | 3.402691% | 0.220089% |
| T1 Spirit (47–50) | 2/361 | 0.554017% | 180.500000 | 94.595933% | 75.746459% | 57.375260% | 36.584039% |
| +1 Projectile Skills | 0/72200 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +2 Projectile Skills | 0/72200 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +3 Projectile Skills | 0/72200 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| prefix | 281 | BaseSpirit | +{0} to Spirit | 2400 | 12/361 | 3.324100% | source:1140, source:1139, source:1138, source:1137, source:1136 |
| prefix | 880 | EnergyShieldPercent | {0}% increased maximum Energy Shield | 7000 | 35/361 | 9.695291% | source:171, source:170, source:169, source:168, source:167, source:166, source:165 |
| prefix | 879 | EvasionRatingPercent | {0}% increased Evasion Rating | 7000 | 35/361 | 9.695291% | source:164, source:163, source:162, source:161, source:160, source:159, source:158 |
| prefix | 84 | IncreasedAccuracy | +{0} to Accuracy Rating | 6000 | 30/361 | 8.310249% | source:1004, source:1003, source:1002, source:1001, source:1000, source:999, source:998, source:997 |
| prefix | 877 | IncreasedEnergyShield | +{0} to maximum Energy Shield | 10000 | 50/361 | 13.850416% | source:150, source:149, source:148, source:147, source:146, source:145, source:144, source:143, source:142, source:141 |
| prefix | 73 | IncreasedLife | +{0} to maximum Life | 9000 | 45/361 | 12.465374% | source:86, source:85, source:84, source:83, source:82, source:81, source:80, source:79, source:78 |
| prefix | 74 | IncreasedMana | +{0} to maximum Mana | 13000 | 65/361 | 18.005540% | source:106, source:105, source:104, source:103, source:102, source:101, source:100, source:99, source:98, source:97, source:96, source:95, source:94 |
| prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | {0}% increased Armour | 7000 | 35/361 | 9.695291% | source:157, source:156, source:155, source:154, source:153, source:152, source:151 |
| prefix | 86 | ItemFoundRarityIncreasePrefix | {0}% increased Rarity of Items found | 3000 | 15/361 | 4.155125% | source:1117, source:1116, source:1115 |
| prefix | 875 | MaximumLifeIncreasePercent | {0}% increased maximum Life | 900 | 9/722 | 1.246537% | source:93, source:92, source:91 |
| prefix | 876 | MaximumManaIncreasePercent | {0}% increased maximum Mana | 900 | 9/722 | 1.246537% | source:121, source:120, source:119 |
| prefix | 883 | SpellDamage | {0}% increased Spell Damage | 6000 | 30/361 | 8.310249% | source:1354, source:1353, source:1352, source:1351, source:1350, source:1349 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 1140 | prefix | 281 | BaseSpirit | T1 | 4 | 54 | +{0} to Spirit | 400 | null | 400 | 2/361 | 0.554017% |
| 1139 | prefix | 281 | BaseSpirit | T2 | 5 | 46 | +{0} to Spirit | 500 | 500 | 500 | 5/722 | 0.692521% |
| 1138 | prefix | 281 | BaseSpirit | T3 | 6 | 33 | +{0} to Spirit | 500 | 500 | 500 | 5/722 | 0.692521% |
| 1137 | prefix | 281 | BaseSpirit | T4 | 7 | 25 | +{0} to Spirit | 500 | 500 | 500 | 5/722 | 0.692521% |
| 1136 | prefix | 281 | BaseSpirit | T5 | 8 | 16 | +{0} to Spirit | 500 | 500 | 500 | 5/722 | 0.692521% |
| 171 | prefix | 880 | EnergyShieldPercent | T1 | 1 | 75 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 170 | prefix | 880 | EnergyShieldPercent | T2 | 2 | 65 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 169 | prefix | 880 | EnergyShieldPercent | T3 | 3 | 54 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 168 | prefix | 880 | EnergyShieldPercent | T4 | 4 | 46 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 167 | prefix | 880 | EnergyShieldPercent | T5 | 5 | 33 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 166 | prefix | 880 | EnergyShieldPercent | T6 | 6 | 16 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 165 | prefix | 880 | EnergyShieldPercent | T7 | 7 | 2 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 164 | prefix | 879 | EvasionRatingPercent | T1 | 1 | 77 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 163 | prefix | 879 | EvasionRatingPercent | T2 | 2 | 70 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 162 | prefix | 879 | EvasionRatingPercent | T3 | 3 | 54 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 161 | prefix | 879 | EvasionRatingPercent | T4 | 4 | 46 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 160 | prefix | 879 | EvasionRatingPercent | T5 | 5 | 33 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 159 | prefix | 879 | EvasionRatingPercent | T6 | 6 | 16 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 158 | prefix | 879 | EvasionRatingPercent | T7 | 7 | 2 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1004 | prefix | 84 | IncreasedAccuracy | T1 | 2 | 67 | +{0} to Accuracy Rating | 400 | 400 | 400 | 2/361 | 0.554017% |
| 1003 | prefix | 84 | IncreasedAccuracy | T2 | 3 | 58 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 1002 | prefix | 84 | IncreasedAccuracy | T3 | 4 | 48 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 1001 | prefix | 84 | IncreasedAccuracy | T4 | 5 | 36 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 1000 | prefix | 84 | IncreasedAccuracy | T5 | 6 | 26 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 999 | prefix | 84 | IncreasedAccuracy | T6 | 7 | 18 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 998 | prefix | 84 | IncreasedAccuracy | T7 | 8 | 11 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 997 | prefix | 84 | IncreasedAccuracy | T8 | 9 | 1 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 150 | prefix | 877 | IncreasedEnergyShield | T1 | 1 | 80 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 149 | prefix | 877 | IncreasedEnergyShield | T2 | 2 | 70 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 148 | prefix | 877 | IncreasedEnergyShield | T3 | 3 | 65 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 147 | prefix | 877 | IncreasedEnergyShield | T4 | 4 | 54 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 146 | prefix | 877 | IncreasedEnergyShield | T5 | 5 | 46 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 145 | prefix | 877 | IncreasedEnergyShield | T6 | 6 | 33 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 144 | prefix | 877 | IncreasedEnergyShield | T7 | 7 | 25 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 143 | prefix | 877 | IncreasedEnergyShield | T8 | 8 | 16 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 142 | prefix | 877 | IncreasedEnergyShield | T9 | 9 | 11 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 141 | prefix | 877 | IncreasedEnergyShield | T10 | 10 | 1 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 86 | prefix | 73 | IncreasedLife | T1 | 5 | 60 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 85 | prefix | 73 | IncreasedLife | T2 | 6 | 54 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 84 | prefix | 73 | IncreasedLife | T3 | 7 | 46 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 83 | prefix | 73 | IncreasedLife | T4 | 8 | 38 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 82 | prefix | 73 | IncreasedLife | T5 | 9 | 33 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 81 | prefix | 73 | IncreasedLife | T6 | 10 | 24 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 80 | prefix | 73 | IncreasedLife | T7 | 11 | 16 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 79 | prefix | 73 | IncreasedLife | T8 | 12 | 6 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 78 | prefix | 73 | IncreasedLife | T9 | 13 | 1 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 106 | prefix | 74 | IncreasedMana | T1 | 1 | 82 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 105 | prefix | 74 | IncreasedMana | T2 | 2 | 75 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 104 | prefix | 74 | IncreasedMana | T3 | 3 | 70 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 103 | prefix | 74 | IncreasedMana | T4 | 4 | 65 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 102 | prefix | 74 | IncreasedMana | T5 | 5 | 60 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 101 | prefix | 74 | IncreasedMana | T6 | 6 | 54 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 100 | prefix | 74 | IncreasedMana | T7 | 7 | 46 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 99 | prefix | 74 | IncreasedMana | T8 | 8 | 38 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 98 | prefix | 74 | IncreasedMana | T9 | 9 | 33 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 97 | prefix | 74 | IncreasedMana | T10 | 10 | 25 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 96 | prefix | 74 | IncreasedMana | T11 | 11 | 16 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 95 | prefix | 74 | IncreasedMana | T12 | 12 | 6 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 94 | prefix | 74 | IncreasedMana | T13 | 13 | 1 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 157 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T1 | 1 | 75 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 156 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T2 | 2 | 65 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 155 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T3 | 3 | 54 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 154 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T4 | 4 | 46 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 153 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T5 | 5 | 33 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 152 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T6 | 6 | 16 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 151 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T7 | 7 | 2 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1117 | prefix | 86 | ItemFoundRarityIncreasePrefix | T1 | 1 | 47 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1116 | prefix | 86 | ItemFoundRarityIncreasePrefix | T2 | 2 | 29 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1115 | prefix | 86 | ItemFoundRarityIncreasePrefix | T3 | 3 | 10 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 93 | prefix | 875 | MaximumLifeIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Life | 300 | 300 | 300 | 3/722 | 0.415512% |
| 92 | prefix | 875 | MaximumLifeIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Life | 300 | 300 | 300 | 3/722 | 0.415512% |
| 91 | prefix | 875 | MaximumLifeIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Life | 300 | 300 | 300 | 3/722 | 0.415512% |
| 121 | prefix | 876 | MaximumManaIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Mana | 300 | 300 | 300 | 3/722 | 0.415512% |
| 120 | prefix | 876 | MaximumManaIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Mana | 300 | 300 | 300 | 3/722 | 0.415512% |
| 119 | prefix | 876 | MaximumManaIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Mana | 300 | 300 | 300 | 3/722 | 0.415512% |
| 1354 | prefix | 883 | SpellDamage | T1 | 1 | 75 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1353 | prefix | 883 | SpellDamage | T2 | 2 | 60 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1352 | prefix | 883 | SpellDamage | T3 | 3 | 46 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1351 | prefix | 883 | SpellDamage | T4 | 4 | 33 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1350 | prefix | 883 | SpellDamage | T5 | 5 | 16 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1349 | prefix | 883 | SpellDamage | T6 | 6 | 1 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |

### existing-melee-suffix

Existing Melee suffix with a suffix-forcing roll.

Denominator: **100600**; minimum modifier level: **0**; side: **suffix**; existing source IDs: **854**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 0/100600 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| T1 Spirit (47–50) | 0/100600 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +1 Projectile Skills | 5/1006 | 0.497018% | 201.200000 | 95.139523% | 77.947975% | 60.758868% | 40.582006% |
| +2 Projectile Skills | 5/2012 | 0.248509% | 402.400000 | 97.542518% | 88.301851% | 77.972168% | 63.739800% |
| +3 Projectile Skills | 1/1006 | 0.099404% | 1006.000000 | 99.010399% | 95.148961% | 90.533248% | 83.526189% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| suffix | 67 | AllAttributes | +{0} to all Attributes | 7200 | 36/503 | 7.157058% | source:35, source:34, source:33, source:32, source:31, source:30, source:29, source:28, source:27 |
| suffix | 71 | AllResistances | +{0}% to all Elemental Resistances | 4800 | 24/503 | 4.771372% | source:65, source:64, source:63, source:62, source:61, source:60 |
| suffix | 72 | ChaosResistance | +{0}% to Chaos Resistance | 1500 | 15/1006 | 1.491054% | source:77, source:76, source:75, source:74, source:73, source:72 |
| suffix | 69 | ColdResistance | +{0}% to Cold Resistance | 8000 | 40/503 | 7.952286% | source:51, source:50, source:49, source:48, source:47, source:46, source:45, source:44 |
| suffix | 253 | CriticalStrikeChanceIncrease | {0}% increased Critical Hit Chance | 3875 | 155/4024 | 3.851889% | source:1029, source:1028, source:1027, source:1026, source:1025, source:1024 |
| suffix | 347 | CriticalStrikeMultiplier | {0}% increased Critical Damage Bonus | 3875 | 155/4024 | 3.851889% | source:1072, source:1071, source:1070, source:1069, source:1068, source:1067 |
| suffix | 881 | DamageTakenGainedAsLife | {0}% of Damage taken Recouped as Life | 2500 | 25/1006 | 2.485089% | source:1331, source:1330, source:1329, source:1328, source:1327 |
| suffix | 49 | Dexterity | +{0} to Dexterity | 8000 | 40/503 | 7.952286% | source:16, source:15, source:14, source:13, source:12, source:11, source:10, source:9 |
| suffix | 68 | FireResistance | +{0}% to Fire Resistance | 8000 | 40/503 | 7.952286% | source:43, source:42, source:41, source:40, source:39, source:38, source:37, source:36 |
| suffix | 126 | IncreasedCastSpeed | {0}% increased Cast Speed | 4800 | 24/503 | 4.771372% | source:16303, source:16302, source:16301, source:16300, source:16299, source:16298 |
| suffix | 252 | IncreaseSocketedGemLevel | +{0} to Level of all Minion Skills | 850 | 17/2012 | 0.844930% | source:838, source:837, source:836 |
| suffix | 695 | IncreaseSocketedGemLevel | +{0} to Level of all Projectile Skills | 850 | 17/2012 | 0.844930% | source:867, source:866, source:865 |
| suffix | 716 | IncreaseSocketedGemLevel | +{0} to Level of all Spell Skills | 850 | 17/2012 | 0.844930% | source:761, source:760, source:759 |
| suffix | 66 | Intelligence | +{0} to Intelligence | 8000 | 40/503 | 7.952286% | source:25, source:24, source:23, source:22, source:21, source:20, source:19, source:18 |
| suffix | 85 | ItemFoundRarityIncrease | {0}% increased Rarity of Items found | 3000 | 15/503 | 2.982107% | source:1112, source:1111, source:1110 |
| suffix | 80 | LifeRegeneration | {0} Life Regeneration per second | 10000 | 50/503 | 9.940358% | source:887, source:886, source:885, source:884, source:883, source:882, source:881, source:880, source:879, source:878 |
| suffix | 70 | LightningResistance | +{0}% to Lightning Resistance | 8000 | 40/503 | 7.952286% | source:59, source:58, source:57, source:56, source:55, source:54, source:53, source:52 |
| suffix | 81 | ManaRegeneration | {0}% increased Mana Regeneration Rate | 6000 | 30/503 | 5.964215% | source:905, source:904, source:903, source:902, source:901, source:900 |
| suffix | 882 | PercentDamageGoesToMana | {0}% of Damage taken Recouped as Mana | 2500 | 25/1006 | 2.485089% | source:1336, source:1335, source:1334, source:1333, source:1332 |
| suffix | 48 | Strength | +{0} to Strength | 8000 | 40/503 | 7.952286% | source:7, source:6, source:5, source:4, source:3, source:2, source:1, source:0 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 35 | suffix | 67 | AllAttributes | T1 | 1 | 82 | +{0} to all Attributes | 800 | 800 | 800 | 4/503 | 0.795229% |
| 34 | suffix | 67 | AllAttributes | T2 | 2 | 75 | +{0} to all Attributes | 800 | 800 | 800 | 4/503 | 0.795229% |
| 33 | suffix | 67 | AllAttributes | T3 | 3 | 66 | +{0} to all Attributes | 800 | 800 | 800 | 4/503 | 0.795229% |
| 32 | suffix | 67 | AllAttributes | T4 | 4 | 55 | +{0} to all Attributes | 800 | 800 | 800 | 4/503 | 0.795229% |
| 31 | suffix | 67 | AllAttributes | T5 | 5 | 44 | +{0} to all Attributes | 800 | 800 | 800 | 4/503 | 0.795229% |
| 30 | suffix | 67 | AllAttributes | T6 | 6 | 33 | +{0} to all Attributes | 800 | null | 800 | 4/503 | 0.795229% |
| 29 | suffix | 67 | AllAttributes | T7 | 7 | 22 | +{0} to all Attributes | 800 | null | 800 | 4/503 | 0.795229% |
| 28 | suffix | 67 | AllAttributes | T8 | 8 | 11 | +{0} to all Attributes | 800 | null | 800 | 4/503 | 0.795229% |
| 27 | suffix | 67 | AllAttributes | T9 | 9 | 1 | +{0} to all Attributes | 800 | null | 800 | 4/503 | 0.795229% |
| 65 | suffix | 71 | AllResistances | T1 | 1 | 80 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 4/503 | 0.795229% |
| 64 | suffix | 71 | AllResistances | T2 | 2 | 68 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 4/503 | 0.795229% |
| 63 | suffix | 71 | AllResistances | T3 | 3 | 54 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 4/503 | 0.795229% |
| 62 | suffix | 71 | AllResistances | T4 | 4 | 40 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 4/503 | 0.795229% |
| 61 | suffix | 71 | AllResistances | T5 | 5 | 26 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 4/503 | 0.795229% |
| 60 | suffix | 71 | AllResistances | T6 | 6 | 12 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 4/503 | 0.795229% |
| 77 | suffix | 72 | ChaosResistance | T1 | 1 | 81 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2012 | 0.248509% |
| 76 | suffix | 72 | ChaosResistance | T2 | 2 | 68 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2012 | 0.248509% |
| 75 | suffix | 72 | ChaosResistance | T3 | 4 | 56 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2012 | 0.248509% |
| 74 | suffix | 72 | ChaosResistance | T4 | 5 | 44 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2012 | 0.248509% |
| 73 | suffix | 72 | ChaosResistance | T5 | 6 | 30 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2012 | 0.248509% |
| 72 | suffix | 72 | ChaosResistance | T6 | 7 | 16 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2012 | 0.248509% |
| 51 | suffix | 69 | ColdResistance | T1 | 1 | 82 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 50 | suffix | 69 | ColdResistance | T2 | 2 | 71 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 49 | suffix | 69 | ColdResistance | T3 | 3 | 60 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 48 | suffix | 69 | ColdResistance | T4 | 4 | 50 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 47 | suffix | 69 | ColdResistance | T5 | 5 | 38 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 46 | suffix | 69 | ColdResistance | T6 | 6 | 26 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 45 | suffix | 69 | ColdResistance | T7 | 7 | 14 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 44 | suffix | 69 | ColdResistance | T8 | 8 | 1 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 1029 | suffix | 253 | CriticalStrikeChanceIncrease | T1 | 1 | 72 | {0}% increased Critical Hit Chance | 125 | 125 | 125 | 5/4024 | 0.124254% |
| 1028 | suffix | 253 | CriticalStrikeChanceIncrease | T2 | 2 | 58 | {0}% increased Critical Hit Chance | 250 | 250 | 250 | 5/2012 | 0.248509% |
| 1027 | suffix | 253 | CriticalStrikeChanceIncrease | T3 | 3 | 44 | {0}% increased Critical Hit Chance | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 1026 | suffix | 253 | CriticalStrikeChanceIncrease | T4 | 4 | 30 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 1025 | suffix | 253 | CriticalStrikeChanceIncrease | T5 | 5 | 20 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 1024 | suffix | 253 | CriticalStrikeChanceIncrease | T6 | 6 | 5 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 1072 | suffix | 347 | CriticalStrikeMultiplier | T1 | 1 | 74 | {0}% increased Critical Damage Bonus | 125 | 125 | 125 | 5/4024 | 0.124254% |
| 1071 | suffix | 347 | CriticalStrikeMultiplier | T2 | 2 | 59 | {0}% increased Critical Damage Bonus | 250 | 250 | 250 | 5/2012 | 0.248509% |
| 1070 | suffix | 347 | CriticalStrikeMultiplier | T3 | 3 | 45 | {0}% increased Critical Damage Bonus | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 1069 | suffix | 347 | CriticalStrikeMultiplier | T4 | 4 | 31 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 1068 | suffix | 347 | CriticalStrikeMultiplier | T5 | 5 | 21 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 1067 | suffix | 347 | CriticalStrikeMultiplier | T6 | 6 | 8 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 1331 | suffix | 881 | DamageTakenGainedAsLife | T1 | 1 | 79 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 1330 | suffix | 881 | DamageTakenGainedAsLife | T2 | 2 | 68 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 1329 | suffix | 881 | DamageTakenGainedAsLife | T3 | 3 | 56 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 1328 | suffix | 881 | DamageTakenGainedAsLife | T4 | 4 | 44 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 1327 | suffix | 881 | DamageTakenGainedAsLife | T5 | 5 | 30 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 16 | suffix | 49 | Dexterity | T1 | 2 | 74 | +{0} to Dexterity | 1000 | null | 1000 | 5/503 | 0.994036% |
| 15 | suffix | 49 | Dexterity | T2 | 3 | 66 | +{0} to Dexterity | 1000 | null | 1000 | 5/503 | 0.994036% |
| 14 | suffix | 49 | Dexterity | T3 | 4 | 55 | +{0} to Dexterity | 1000 | null | 1000 | 5/503 | 0.994036% |
| 13 | suffix | 49 | Dexterity | T4 | 5 | 44 | +{0} to Dexterity | 1000 | null | 1000 | 5/503 | 0.994036% |
| 12 | suffix | 49 | Dexterity | T5 | 6 | 33 | +{0} to Dexterity | 1000 | null | 1000 | 5/503 | 0.994036% |
| 11 | suffix | 49 | Dexterity | T6 | 7 | 22 | +{0} to Dexterity | 1000 | null | 1000 | 5/503 | 0.994036% |
| 10 | suffix | 49 | Dexterity | T7 | 8 | 11 | +{0} to Dexterity | 1000 | null | 1000 | 5/503 | 0.994036% |
| 9 | suffix | 49 | Dexterity | T8 | 9 | 1 | +{0} to Dexterity | 1000 | null | 1000 | 5/503 | 0.994036% |
| 43 | suffix | 68 | FireResistance | T1 | 1 | 82 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 42 | suffix | 68 | FireResistance | T2 | 2 | 71 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 41 | suffix | 68 | FireResistance | T3 | 3 | 60 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 40 | suffix | 68 | FireResistance | T4 | 4 | 48 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 39 | suffix | 68 | FireResistance | T5 | 5 | 36 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 38 | suffix | 68 | FireResistance | T6 | 6 | 24 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 37 | suffix | 68 | FireResistance | T7 | 7 | 12 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 36 | suffix | 68 | FireResistance | T8 | 8 | 1 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 16303 | suffix | 126 | IncreasedCastSpeed | T1 | 3 | 66 | {0}% increased Cast Speed | 800 | 800 | 800 | 4/503 | 0.795229% |
| 16302 | suffix | 126 | IncreasedCastSpeed | T2 | 4 | 60 | {0}% increased Cast Speed | 800 | null | 800 | 4/503 | 0.795229% |
| 16301 | suffix | 126 | IncreasedCastSpeed | T3 | 5 | 51 | {0}% increased Cast Speed | 800 | null | 800 | 4/503 | 0.795229% |
| 16300 | suffix | 126 | IncreasedCastSpeed | T4 | 7 | 35 | {0}% increased Cast Speed | 800 | null | 800 | 4/503 | 0.795229% |
| 16299 | suffix | 126 | IncreasedCastSpeed | T5 | 9 | 18 | {0}% increased Cast Speed | 800 | null | 800 | 4/503 | 0.795229% |
| 16298 | suffix | 126 | IncreasedCastSpeed | T6 | 11 | 1 | {0}% increased Cast Speed | 800 | null | 800 | 4/503 | 0.795229% |
| 838 | suffix | 252 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Minion Skills | 100 | 100 | 100 | 1/1006 | 0.099404% |
| 867 | suffix | 695 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Projectile Skills | 100 | 100 | 100 | 1/1006 | 0.099404% |
| 761 | suffix | 716 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Spell Skills | 100 | 100 | 100 | 1/1006 | 0.099404% |
| 837 | suffix | 252 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Minion Skills | 250 | 250 | 250 | 5/2012 | 0.248509% |
| 866 | suffix | 695 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Projectile Skills | 250 | 250 | 250 | 5/2012 | 0.248509% |
| 760 | suffix | 716 | IncreaseSocketedGemLevel | T2 | 5 | 41 | +{0} to Level of all Spell Skills | 250 | 250 | 250 | 5/2012 | 0.248509% |
| 759 | suffix | 716 | IncreaseSocketedGemLevel | T3 | 7 | 10 | +{0} to Level of all Spell Skills | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 836 | suffix | 252 | IncreaseSocketedGemLevel | T3 | 6 | 5 | +{0} to Level of all Minion Skills | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 865 | suffix | 695 | IncreaseSocketedGemLevel | T3 | 7 | 5 | +{0} to Level of all Projectile Skills | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 25 | suffix | 66 | Intelligence | T1 | 2 | 74 | +{0} to Intelligence | 1000 | null | 1000 | 5/503 | 0.994036% |
| 24 | suffix | 66 | Intelligence | T2 | 3 | 66 | +{0} to Intelligence | 1000 | null | 1000 | 5/503 | 0.994036% |
| 23 | suffix | 66 | Intelligence | T3 | 4 | 55 | +{0} to Intelligence | 1000 | null | 1000 | 5/503 | 0.994036% |
| 22 | suffix | 66 | Intelligence | T4 | 5 | 44 | +{0} to Intelligence | 1000 | null | 1000 | 5/503 | 0.994036% |
| 21 | suffix | 66 | Intelligence | T5 | 6 | 33 | +{0} to Intelligence | 1000 | null | 1000 | 5/503 | 0.994036% |
| 20 | suffix | 66 | Intelligence | T6 | 7 | 22 | +{0} to Intelligence | 1000 | null | 1000 | 5/503 | 0.994036% |
| 19 | suffix | 66 | Intelligence | T7 | 8 | 11 | +{0} to Intelligence | 1000 | null | 1000 | 5/503 | 0.994036% |
| 18 | suffix | 66 | Intelligence | T8 | 9 | 1 | +{0} to Intelligence | 1000 | null | 1000 | 5/503 | 0.994036% |
| 1112 | suffix | 85 | ItemFoundRarityIncrease | T1 | 1 | 40 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 1111 | suffix | 85 | ItemFoundRarityIncrease | T2 | 2 | 24 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 1110 | suffix | 85 | ItemFoundRarityIncrease | T3 | 3 | 3 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 887 | suffix | 80 | LifeRegeneration | T1 | 2 | 75 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 886 | suffix | 80 | LifeRegeneration | T2 | 3 | 68 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 885 | suffix | 80 | LifeRegeneration | T3 | 4 | 58 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 884 | suffix | 80 | LifeRegeneration | T4 | 5 | 47 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 883 | suffix | 80 | LifeRegeneration | T5 | 6 | 35 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 882 | suffix | 80 | LifeRegeneration | T6 | 7 | 26 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 881 | suffix | 80 | LifeRegeneration | T7 | 8 | 17 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 880 | suffix | 80 | LifeRegeneration | T8 | 9 | 11 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 879 | suffix | 80 | LifeRegeneration | T9 | 10 | 5 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 878 | suffix | 80 | LifeRegeneration | T10 | 11 | 1 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 59 | suffix | 70 | LightningResistance | T1 | 1 | 82 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 58 | suffix | 70 | LightningResistance | T2 | 2 | 71 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 57 | suffix | 70 | LightningResistance | T3 | 3 | 60 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 56 | suffix | 70 | LightningResistance | T4 | 4 | 49 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 55 | suffix | 70 | LightningResistance | T5 | 5 | 37 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 54 | suffix | 70 | LightningResistance | T6 | 6 | 25 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 53 | suffix | 70 | LightningResistance | T7 | 7 | 13 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 52 | suffix | 70 | LightningResistance | T8 | 8 | 1 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/503 | 0.994036% |
| 905 | suffix | 81 | ManaRegeneration | T1 | 1 | 79 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 904 | suffix | 81 | ManaRegeneration | T2 | 2 | 55 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 903 | suffix | 81 | ManaRegeneration | T3 | 3 | 42 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 902 | suffix | 81 | ManaRegeneration | T4 | 4 | 29 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 901 | suffix | 81 | ManaRegeneration | T5 | 5 | 18 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 900 | suffix | 81 | ManaRegeneration | T6 | 6 | 1 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/503 | 0.994036% |
| 1336 | suffix | 882 | PercentDamageGoesToMana | T1 | 1 | 80 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 1335 | suffix | 882 | PercentDamageGoesToMana | T2 | 2 | 69 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 1334 | suffix | 882 | PercentDamageGoesToMana | T3 | 3 | 57 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 1333 | suffix | 882 | PercentDamageGoesToMana | T4 | 4 | 45 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 1332 | suffix | 882 | PercentDamageGoesToMana | T5 | 5 | 31 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/1006 | 0.497018% |
| 7 | suffix | 48 | Strength | T1 | 2 | 74 | +{0} to Strength | 1000 | null | 1000 | 5/503 | 0.994036% |
| 6 | suffix | 48 | Strength | T2 | 3 | 66 | +{0} to Strength | 1000 | null | 1000 | 5/503 | 0.994036% |
| 5 | suffix | 48 | Strength | T3 | 4 | 55 | +{0} to Strength | 1000 | null | 1000 | 5/503 | 0.994036% |
| 4 | suffix | 48 | Strength | T4 | 5 | 44 | +{0} to Strength | 1000 | null | 1000 | 5/503 | 0.994036% |
| 3 | suffix | 48 | Strength | T5 | 6 | 33 | +{0} to Strength | 1000 | null | 1000 | 5/503 | 0.994036% |
| 2 | suffix | 48 | Strength | T6 | 7 | 22 | +{0} to Strength | 1000 | null | 1000 | 5/503 | 0.994036% |
| 1 | suffix | 48 | Strength | T7 | 8 | 11 | +{0} to Strength | 1000 | null | 1000 | 5/503 | 0.994036% |
| 0 | suffix | 48 | Strength | T8 | 9 | 1 | +{0} to Strength | 1000 | null | 1000 | 5/503 | 0.994036% |

### prefix-slots-full

Both Absent Amulet prefix slots are occupied; only suffix candidates contribute.

Denominator: **101450**; minimum modifier level: **0**; side: **both**; existing source IDs: **1140, 171**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 0/101450 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| T1 Spirit (47–50) | 0/101450 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +1 Projectile Skills | 10/2029 | 0.492854% | 202.900000 | 95.179347% | 78.111251% | 61.013676% | 40.890575% |
| +2 Projectile Skills | 5/2029 | 0.246427% | 405.800000 | 97.562880% | 88.394055% | 78.135089% | 63.981065% |
| +3 Projectile Skills | 2/2029 | 0.098571% | 1014.500000 | 99.018654% | 95.188631% | 90.608756% | 83.652322% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| suffix | 67 | AllAttributes | +{0} to all Attributes | 7200 | 144/2029 | 7.097092% | source:35, source:34, source:33, source:32, source:31, source:30, source:29, source:28, source:27 |
| suffix | 71 | AllResistances | +{0}% to all Elemental Resistances | 4800 | 96/2029 | 4.731395% | source:65, source:64, source:63, source:62, source:61, source:60 |
| suffix | 72 | ChaosResistance | +{0}% to Chaos Resistance | 1500 | 30/2029 | 1.478561% | source:77, source:76, source:75, source:74, source:73, source:72 |
| suffix | 69 | ColdResistance | +{0}% to Cold Resistance | 8000 | 160/2029 | 7.885658% | source:51, source:50, source:49, source:48, source:47, source:46, source:45, source:44 |
| suffix | 253 | CriticalStrikeChanceIncrease | {0}% increased Critical Hit Chance | 3875 | 155/4058 | 3.819616% | source:1029, source:1028, source:1027, source:1026, source:1025, source:1024 |
| suffix | 347 | CriticalStrikeMultiplier | {0}% increased Critical Damage Bonus | 3875 | 155/4058 | 3.819616% | source:1072, source:1071, source:1070, source:1069, source:1068, source:1067 |
| suffix | 881 | DamageTakenGainedAsLife | {0}% of Damage taken Recouped as Life | 2500 | 50/2029 | 2.464268% | source:1331, source:1330, source:1329, source:1328, source:1327 |
| suffix | 49 | Dexterity | +{0} to Dexterity | 8000 | 160/2029 | 7.885658% | source:16, source:15, source:14, source:13, source:12, source:11, source:10, source:9 |
| suffix | 68 | FireResistance | +{0}% to Fire Resistance | 8000 | 160/2029 | 7.885658% | source:43, source:42, source:41, source:40, source:39, source:38, source:37, source:36 |
| suffix | 126 | IncreasedCastSpeed | {0}% increased Cast Speed | 4800 | 96/2029 | 4.731395% | source:16303, source:16302, source:16301, source:16300, source:16299, source:16298 |
| suffix | 59 | IncreaseSocketedGemLevel | +{0} to Level of all Melee Skills | 850 | 17/2029 | 0.837851% | source:854, source:853, source:852 |
| suffix | 252 | IncreaseSocketedGemLevel | +{0} to Level of all Minion Skills | 850 | 17/2029 | 0.837851% | source:838, source:837, source:836 |
| suffix | 695 | IncreaseSocketedGemLevel | +{0} to Level of all Projectile Skills | 850 | 17/2029 | 0.837851% | source:867, source:866, source:865 |
| suffix | 716 | IncreaseSocketedGemLevel | +{0} to Level of all Spell Skills | 850 | 17/2029 | 0.837851% | source:761, source:760, source:759 |
| suffix | 66 | Intelligence | +{0} to Intelligence | 8000 | 160/2029 | 7.885658% | source:25, source:24, source:23, source:22, source:21, source:20, source:19, source:18 |
| suffix | 85 | ItemFoundRarityIncrease | {0}% increased Rarity of Items found | 3000 | 60/2029 | 2.957122% | source:1112, source:1111, source:1110 |
| suffix | 80 | LifeRegeneration | {0} Life Regeneration per second | 10000 | 200/2029 | 9.857072% | source:887, source:886, source:885, source:884, source:883, source:882, source:881, source:880, source:879, source:878 |
| suffix | 70 | LightningResistance | +{0}% to Lightning Resistance | 8000 | 160/2029 | 7.885658% | source:59, source:58, source:57, source:56, source:55, source:54, source:53, source:52 |
| suffix | 81 | ManaRegeneration | {0}% increased Mana Regeneration Rate | 6000 | 120/2029 | 5.914243% | source:905, source:904, source:903, source:902, source:901, source:900 |
| suffix | 882 | PercentDamageGoesToMana | {0}% of Damage taken Recouped as Mana | 2500 | 50/2029 | 2.464268% | source:1336, source:1335, source:1334, source:1333, source:1332 |
| suffix | 48 | Strength | +{0} to Strength | 8000 | 160/2029 | 7.885658% | source:7, source:6, source:5, source:4, source:3, source:2, source:1, source:0 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 35 | suffix | 67 | AllAttributes | T1 | 1 | 82 | +{0} to all Attributes | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 34 | suffix | 67 | AllAttributes | T2 | 2 | 75 | +{0} to all Attributes | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 33 | suffix | 67 | AllAttributes | T3 | 3 | 66 | +{0} to all Attributes | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 32 | suffix | 67 | AllAttributes | T4 | 4 | 55 | +{0} to all Attributes | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 31 | suffix | 67 | AllAttributes | T5 | 5 | 44 | +{0} to all Attributes | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 30 | suffix | 67 | AllAttributes | T6 | 6 | 33 | +{0} to all Attributes | 800 | null | 800 | 16/2029 | 0.788566% |
| 29 | suffix | 67 | AllAttributes | T7 | 7 | 22 | +{0} to all Attributes | 800 | null | 800 | 16/2029 | 0.788566% |
| 28 | suffix | 67 | AllAttributes | T8 | 8 | 11 | +{0} to all Attributes | 800 | null | 800 | 16/2029 | 0.788566% |
| 27 | suffix | 67 | AllAttributes | T9 | 9 | 1 | +{0} to all Attributes | 800 | null | 800 | 16/2029 | 0.788566% |
| 65 | suffix | 71 | AllResistances | T1 | 1 | 80 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 64 | suffix | 71 | AllResistances | T2 | 2 | 68 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 63 | suffix | 71 | AllResistances | T3 | 3 | 54 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 62 | suffix | 71 | AllResistances | T4 | 4 | 40 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 61 | suffix | 71 | AllResistances | T5 | 5 | 26 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 60 | suffix | 71 | AllResistances | T6 | 6 | 12 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 77 | suffix | 72 | ChaosResistance | T1 | 1 | 81 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2029 | 0.246427% |
| 76 | suffix | 72 | ChaosResistance | T2 | 2 | 68 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2029 | 0.246427% |
| 75 | suffix | 72 | ChaosResistance | T3 | 4 | 56 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2029 | 0.246427% |
| 74 | suffix | 72 | ChaosResistance | T4 | 5 | 44 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2029 | 0.246427% |
| 73 | suffix | 72 | ChaosResistance | T5 | 6 | 30 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2029 | 0.246427% |
| 72 | suffix | 72 | ChaosResistance | T6 | 7 | 16 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/2029 | 0.246427% |
| 51 | suffix | 69 | ColdResistance | T1 | 1 | 82 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 50 | suffix | 69 | ColdResistance | T2 | 2 | 71 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 49 | suffix | 69 | ColdResistance | T3 | 3 | 60 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 48 | suffix | 69 | ColdResistance | T4 | 4 | 50 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 47 | suffix | 69 | ColdResistance | T5 | 5 | 38 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 46 | suffix | 69 | ColdResistance | T6 | 6 | 26 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 45 | suffix | 69 | ColdResistance | T7 | 7 | 14 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 44 | suffix | 69 | ColdResistance | T8 | 8 | 1 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 1029 | suffix | 253 | CriticalStrikeChanceIncrease | T1 | 1 | 72 | {0}% increased Critical Hit Chance | 125 | 125 | 125 | 5/4058 | 0.123213% |
| 1028 | suffix | 253 | CriticalStrikeChanceIncrease | T2 | 2 | 58 | {0}% increased Critical Hit Chance | 250 | 250 | 250 | 5/2029 | 0.246427% |
| 1027 | suffix | 253 | CriticalStrikeChanceIncrease | T3 | 3 | 44 | {0}% increased Critical Hit Chance | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1026 | suffix | 253 | CriticalStrikeChanceIncrease | T4 | 4 | 30 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1025 | suffix | 253 | CriticalStrikeChanceIncrease | T5 | 5 | 20 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1024 | suffix | 253 | CriticalStrikeChanceIncrease | T6 | 6 | 5 | {0}% increased Critical Hit Chance | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1072 | suffix | 347 | CriticalStrikeMultiplier | T1 | 1 | 74 | {0}% increased Critical Damage Bonus | 125 | 125 | 125 | 5/4058 | 0.123213% |
| 1071 | suffix | 347 | CriticalStrikeMultiplier | T2 | 2 | 59 | {0}% increased Critical Damage Bonus | 250 | 250 | 250 | 5/2029 | 0.246427% |
| 1070 | suffix | 347 | CriticalStrikeMultiplier | T3 | 3 | 45 | {0}% increased Critical Damage Bonus | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1069 | suffix | 347 | CriticalStrikeMultiplier | T4 | 4 | 31 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1068 | suffix | 347 | CriticalStrikeMultiplier | T5 | 5 | 21 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1067 | suffix | 347 | CriticalStrikeMultiplier | T6 | 6 | 8 | {0}% increased Critical Damage Bonus | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1331 | suffix | 881 | DamageTakenGainedAsLife | T1 | 1 | 79 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1330 | suffix | 881 | DamageTakenGainedAsLife | T2 | 2 | 68 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1329 | suffix | 881 | DamageTakenGainedAsLife | T3 | 3 | 56 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1328 | suffix | 881 | DamageTakenGainedAsLife | T4 | 4 | 44 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1327 | suffix | 881 | DamageTakenGainedAsLife | T5 | 5 | 30 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 16 | suffix | 49 | Dexterity | T1 | 2 | 74 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 15 | suffix | 49 | Dexterity | T2 | 3 | 66 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 14 | suffix | 49 | Dexterity | T3 | 4 | 55 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 13 | suffix | 49 | Dexterity | T4 | 5 | 44 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 12 | suffix | 49 | Dexterity | T5 | 6 | 33 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 11 | suffix | 49 | Dexterity | T6 | 7 | 22 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 10 | suffix | 49 | Dexterity | T7 | 8 | 11 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 9 | suffix | 49 | Dexterity | T8 | 9 | 1 | +{0} to Dexterity | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 43 | suffix | 68 | FireResistance | T1 | 1 | 82 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 42 | suffix | 68 | FireResistance | T2 | 2 | 71 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 41 | suffix | 68 | FireResistance | T3 | 3 | 60 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 40 | suffix | 68 | FireResistance | T4 | 4 | 48 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 39 | suffix | 68 | FireResistance | T5 | 5 | 36 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 38 | suffix | 68 | FireResistance | T6 | 6 | 24 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 37 | suffix | 68 | FireResistance | T7 | 7 | 12 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 36 | suffix | 68 | FireResistance | T8 | 8 | 1 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 16303 | suffix | 126 | IncreasedCastSpeed | T1 | 3 | 66 | {0}% increased Cast Speed | 800 | 800 | 800 | 16/2029 | 0.788566% |
| 16302 | suffix | 126 | IncreasedCastSpeed | T2 | 4 | 60 | {0}% increased Cast Speed | 800 | null | 800 | 16/2029 | 0.788566% |
| 16301 | suffix | 126 | IncreasedCastSpeed | T3 | 5 | 51 | {0}% increased Cast Speed | 800 | null | 800 | 16/2029 | 0.788566% |
| 16300 | suffix | 126 | IncreasedCastSpeed | T4 | 7 | 35 | {0}% increased Cast Speed | 800 | null | 800 | 16/2029 | 0.788566% |
| 16299 | suffix | 126 | IncreasedCastSpeed | T5 | 9 | 18 | {0}% increased Cast Speed | 800 | null | 800 | 16/2029 | 0.788566% |
| 16298 | suffix | 126 | IncreasedCastSpeed | T6 | 11 | 1 | {0}% increased Cast Speed | 800 | null | 800 | 16/2029 | 0.788566% |
| 854 | suffix | 59 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Melee Skills | 100 | 100 | 100 | 2/2029 | 0.098571% |
| 838 | suffix | 252 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Minion Skills | 100 | 100 | 100 | 2/2029 | 0.098571% |
| 867 | suffix | 695 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Projectile Skills | 100 | 100 | 100 | 2/2029 | 0.098571% |
| 761 | suffix | 716 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Spell Skills | 100 | 100 | 100 | 2/2029 | 0.098571% |
| 853 | suffix | 59 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Melee Skills | 250 | 250 | 250 | 5/2029 | 0.246427% |
| 837 | suffix | 252 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Minion Skills | 250 | 250 | 250 | 5/2029 | 0.246427% |
| 866 | suffix | 695 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Projectile Skills | 250 | 250 | 250 | 5/2029 | 0.246427% |
| 760 | suffix | 716 | IncreaseSocketedGemLevel | T2 | 5 | 41 | +{0} to Level of all Spell Skills | 250 | 250 | 250 | 5/2029 | 0.246427% |
| 759 | suffix | 716 | IncreaseSocketedGemLevel | T3 | 7 | 10 | +{0} to Level of all Spell Skills | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 852 | suffix | 59 | IncreaseSocketedGemLevel | T3 | 7 | 5 | +{0} to Level of all Melee Skills | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 836 | suffix | 252 | IncreaseSocketedGemLevel | T3 | 6 | 5 | +{0} to Level of all Minion Skills | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 865 | suffix | 695 | IncreaseSocketedGemLevel | T3 | 7 | 5 | +{0} to Level of all Projectile Skills | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 25 | suffix | 66 | Intelligence | T1 | 2 | 74 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 24 | suffix | 66 | Intelligence | T2 | 3 | 66 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 23 | suffix | 66 | Intelligence | T3 | 4 | 55 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 22 | suffix | 66 | Intelligence | T4 | 5 | 44 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 21 | suffix | 66 | Intelligence | T5 | 6 | 33 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 20 | suffix | 66 | Intelligence | T6 | 7 | 22 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 19 | suffix | 66 | Intelligence | T7 | 8 | 11 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 18 | suffix | 66 | Intelligence | T8 | 9 | 1 | +{0} to Intelligence | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 1112 | suffix | 85 | ItemFoundRarityIncrease | T1 | 1 | 40 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1111 | suffix | 85 | ItemFoundRarityIncrease | T2 | 2 | 24 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1110 | suffix | 85 | ItemFoundRarityIncrease | T3 | 3 | 3 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 887 | suffix | 80 | LifeRegeneration | T1 | 2 | 75 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 886 | suffix | 80 | LifeRegeneration | T2 | 3 | 68 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 885 | suffix | 80 | LifeRegeneration | T3 | 4 | 58 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 884 | suffix | 80 | LifeRegeneration | T4 | 5 | 47 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 883 | suffix | 80 | LifeRegeneration | T5 | 6 | 35 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 882 | suffix | 80 | LifeRegeneration | T6 | 7 | 26 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 881 | suffix | 80 | LifeRegeneration | T7 | 8 | 17 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 880 | suffix | 80 | LifeRegeneration | T8 | 9 | 11 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 879 | suffix | 80 | LifeRegeneration | T9 | 10 | 5 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 878 | suffix | 80 | LifeRegeneration | T10 | 11 | 1 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 59 | suffix | 70 | LightningResistance | T1 | 1 | 82 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 58 | suffix | 70 | LightningResistance | T2 | 2 | 71 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 57 | suffix | 70 | LightningResistance | T3 | 3 | 60 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 56 | suffix | 70 | LightningResistance | T4 | 4 | 49 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 55 | suffix | 70 | LightningResistance | T5 | 5 | 37 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 54 | suffix | 70 | LightningResistance | T6 | 6 | 25 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 53 | suffix | 70 | LightningResistance | T7 | 7 | 13 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 52 | suffix | 70 | LightningResistance | T8 | 8 | 1 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 905 | suffix | 81 | ManaRegeneration | T1 | 1 | 79 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 904 | suffix | 81 | ManaRegeneration | T2 | 2 | 55 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 903 | suffix | 81 | ManaRegeneration | T3 | 3 | 42 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 902 | suffix | 81 | ManaRegeneration | T4 | 4 | 29 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 901 | suffix | 81 | ManaRegeneration | T5 | 5 | 18 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 900 | suffix | 81 | ManaRegeneration | T6 | 6 | 1 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/2029 | 0.985707% |
| 1336 | suffix | 882 | PercentDamageGoesToMana | T1 | 1 | 80 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1335 | suffix | 882 | PercentDamageGoesToMana | T2 | 2 | 69 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1334 | suffix | 882 | PercentDamageGoesToMana | T3 | 3 | 57 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1333 | suffix | 882 | PercentDamageGoesToMana | T4 | 4 | 45 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 1332 | suffix | 882 | PercentDamageGoesToMana | T5 | 5 | 31 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/2029 | 0.492854% |
| 7 | suffix | 48 | Strength | T1 | 2 | 74 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 6 | suffix | 48 | Strength | T2 | 3 | 66 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 5 | suffix | 48 | Strength | T3 | 4 | 55 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 4 | suffix | 48 | Strength | T4 | 5 | 44 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 3 | suffix | 48 | Strength | T5 | 6 | 33 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 2 | suffix | 48 | Strength | T6 | 7 | 22 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 1 | suffix | 48 | Strength | T7 | 8 | 11 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |
| 0 | suffix | 48 | Strength | T8 | 9 | 1 | +{0} to Strength | 1000 | null | 1000 | 20/2029 | 0.985707% |

### suffix-slots-full

Both Absent Amulet suffix slots are occupied; only prefix candidates contribute.

Denominator: **72200**; minimum modifier level: **0**; side: **both**; existing source IDs: **854, 867**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 12/361 | 3.324100% | 30.083333 | 71.315224% | 18.446384% | 3.402691% | 0.220089% |
| T1 Spirit (47–50) | 2/361 | 0.554017% | 180.500000 | 94.595933% | 75.746459% | 57.375260% | 36.584039% |
| +1 Projectile Skills | 0/72200 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +2 Projectile Skills | 0/72200 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +3 Projectile Skills | 0/72200 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| prefix | 281 | BaseSpirit | +{0} to Spirit | 2400 | 12/361 | 3.324100% | source:1140, source:1139, source:1138, source:1137, source:1136 |
| prefix | 880 | EnergyShieldPercent | {0}% increased maximum Energy Shield | 7000 | 35/361 | 9.695291% | source:171, source:170, source:169, source:168, source:167, source:166, source:165 |
| prefix | 879 | EvasionRatingPercent | {0}% increased Evasion Rating | 7000 | 35/361 | 9.695291% | source:164, source:163, source:162, source:161, source:160, source:159, source:158 |
| prefix | 84 | IncreasedAccuracy | +{0} to Accuracy Rating | 6000 | 30/361 | 8.310249% | source:1004, source:1003, source:1002, source:1001, source:1000, source:999, source:998, source:997 |
| prefix | 877 | IncreasedEnergyShield | +{0} to maximum Energy Shield | 10000 | 50/361 | 13.850416% | source:150, source:149, source:148, source:147, source:146, source:145, source:144, source:143, source:142, source:141 |
| prefix | 73 | IncreasedLife | +{0} to maximum Life | 9000 | 45/361 | 12.465374% | source:86, source:85, source:84, source:83, source:82, source:81, source:80, source:79, source:78 |
| prefix | 74 | IncreasedMana | +{0} to maximum Mana | 13000 | 65/361 | 18.005540% | source:106, source:105, source:104, source:103, source:102, source:101, source:100, source:99, source:98, source:97, source:96, source:95, source:94 |
| prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | {0}% increased Armour | 7000 | 35/361 | 9.695291% | source:157, source:156, source:155, source:154, source:153, source:152, source:151 |
| prefix | 86 | ItemFoundRarityIncreasePrefix | {0}% increased Rarity of Items found | 3000 | 15/361 | 4.155125% | source:1117, source:1116, source:1115 |
| prefix | 875 | MaximumLifeIncreasePercent | {0}% increased maximum Life | 900 | 9/722 | 1.246537% | source:93, source:92, source:91 |
| prefix | 876 | MaximumManaIncreasePercent | {0}% increased maximum Mana | 900 | 9/722 | 1.246537% | source:121, source:120, source:119 |
| prefix | 883 | SpellDamage | {0}% increased Spell Damage | 6000 | 30/361 | 8.310249% | source:1354, source:1353, source:1352, source:1351, source:1350, source:1349 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 1140 | prefix | 281 | BaseSpirit | T1 | 4 | 54 | +{0} to Spirit | 400 | null | 400 | 2/361 | 0.554017% |
| 1139 | prefix | 281 | BaseSpirit | T2 | 5 | 46 | +{0} to Spirit | 500 | 500 | 500 | 5/722 | 0.692521% |
| 1138 | prefix | 281 | BaseSpirit | T3 | 6 | 33 | +{0} to Spirit | 500 | 500 | 500 | 5/722 | 0.692521% |
| 1137 | prefix | 281 | BaseSpirit | T4 | 7 | 25 | +{0} to Spirit | 500 | 500 | 500 | 5/722 | 0.692521% |
| 1136 | prefix | 281 | BaseSpirit | T5 | 8 | 16 | +{0} to Spirit | 500 | 500 | 500 | 5/722 | 0.692521% |
| 171 | prefix | 880 | EnergyShieldPercent | T1 | 1 | 75 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 170 | prefix | 880 | EnergyShieldPercent | T2 | 2 | 65 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 169 | prefix | 880 | EnergyShieldPercent | T3 | 3 | 54 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 168 | prefix | 880 | EnergyShieldPercent | T4 | 4 | 46 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 167 | prefix | 880 | EnergyShieldPercent | T5 | 5 | 33 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 166 | prefix | 880 | EnergyShieldPercent | T6 | 6 | 16 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 165 | prefix | 880 | EnergyShieldPercent | T7 | 7 | 2 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 164 | prefix | 879 | EvasionRatingPercent | T1 | 1 | 77 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 163 | prefix | 879 | EvasionRatingPercent | T2 | 2 | 70 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 162 | prefix | 879 | EvasionRatingPercent | T3 | 3 | 54 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 161 | prefix | 879 | EvasionRatingPercent | T4 | 4 | 46 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 160 | prefix | 879 | EvasionRatingPercent | T5 | 5 | 33 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 159 | prefix | 879 | EvasionRatingPercent | T6 | 6 | 16 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 158 | prefix | 879 | EvasionRatingPercent | T7 | 7 | 2 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1004 | prefix | 84 | IncreasedAccuracy | T1 | 2 | 67 | +{0} to Accuracy Rating | 400 | 400 | 400 | 2/361 | 0.554017% |
| 1003 | prefix | 84 | IncreasedAccuracy | T2 | 3 | 58 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 1002 | prefix | 84 | IncreasedAccuracy | T3 | 4 | 48 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 1001 | prefix | 84 | IncreasedAccuracy | T4 | 5 | 36 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 1000 | prefix | 84 | IncreasedAccuracy | T5 | 6 | 26 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 999 | prefix | 84 | IncreasedAccuracy | T6 | 7 | 18 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 998 | prefix | 84 | IncreasedAccuracy | T7 | 8 | 11 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 997 | prefix | 84 | IncreasedAccuracy | T8 | 9 | 1 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/361 | 1.108033% |
| 150 | prefix | 877 | IncreasedEnergyShield | T1 | 1 | 80 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 149 | prefix | 877 | IncreasedEnergyShield | T2 | 2 | 70 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 148 | prefix | 877 | IncreasedEnergyShield | T3 | 3 | 65 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 147 | prefix | 877 | IncreasedEnergyShield | T4 | 4 | 54 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 146 | prefix | 877 | IncreasedEnergyShield | T5 | 5 | 46 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 145 | prefix | 877 | IncreasedEnergyShield | T6 | 6 | 33 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 144 | prefix | 877 | IncreasedEnergyShield | T7 | 7 | 25 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 143 | prefix | 877 | IncreasedEnergyShield | T8 | 8 | 16 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 142 | prefix | 877 | IncreasedEnergyShield | T9 | 9 | 11 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 141 | prefix | 877 | IncreasedEnergyShield | T10 | 10 | 1 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 86 | prefix | 73 | IncreasedLife | T1 | 5 | 60 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 85 | prefix | 73 | IncreasedLife | T2 | 6 | 54 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 84 | prefix | 73 | IncreasedLife | T3 | 7 | 46 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 83 | prefix | 73 | IncreasedLife | T4 | 8 | 38 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 82 | prefix | 73 | IncreasedLife | T5 | 9 | 33 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 81 | prefix | 73 | IncreasedLife | T6 | 10 | 24 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 80 | prefix | 73 | IncreasedLife | T7 | 11 | 16 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 79 | prefix | 73 | IncreasedLife | T8 | 12 | 6 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 78 | prefix | 73 | IncreasedLife | T9 | 13 | 1 | +{0} to maximum Life | 1000 | null | 1000 | 5/361 | 1.385042% |
| 106 | prefix | 74 | IncreasedMana | T1 | 1 | 82 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 105 | prefix | 74 | IncreasedMana | T2 | 2 | 75 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 104 | prefix | 74 | IncreasedMana | T3 | 3 | 70 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 103 | prefix | 74 | IncreasedMana | T4 | 4 | 65 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 102 | prefix | 74 | IncreasedMana | T5 | 5 | 60 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 101 | prefix | 74 | IncreasedMana | T6 | 6 | 54 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 100 | prefix | 74 | IncreasedMana | T7 | 7 | 46 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 99 | prefix | 74 | IncreasedMana | T8 | 8 | 38 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 98 | prefix | 74 | IncreasedMana | T9 | 9 | 33 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 97 | prefix | 74 | IncreasedMana | T10 | 10 | 25 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 96 | prefix | 74 | IncreasedMana | T11 | 11 | 16 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 95 | prefix | 74 | IncreasedMana | T12 | 12 | 6 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 94 | prefix | 74 | IncreasedMana | T13 | 13 | 1 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 157 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T1 | 1 | 75 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 156 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T2 | 2 | 65 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 155 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T3 | 3 | 54 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 154 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T4 | 4 | 46 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 153 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T5 | 5 | 33 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 152 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T6 | 6 | 16 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 151 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T7 | 7 | 2 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1117 | prefix | 86 | ItemFoundRarityIncreasePrefix | T1 | 1 | 47 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1116 | prefix | 86 | ItemFoundRarityIncreasePrefix | T2 | 2 | 29 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1115 | prefix | 86 | ItemFoundRarityIncreasePrefix | T3 | 3 | 10 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 93 | prefix | 875 | MaximumLifeIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Life | 300 | 300 | 300 | 3/722 | 0.415512% |
| 92 | prefix | 875 | MaximumLifeIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Life | 300 | 300 | 300 | 3/722 | 0.415512% |
| 91 | prefix | 875 | MaximumLifeIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Life | 300 | 300 | 300 | 3/722 | 0.415512% |
| 121 | prefix | 876 | MaximumManaIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Mana | 300 | 300 | 300 | 3/722 | 0.415512% |
| 120 | prefix | 876 | MaximumManaIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Mana | 300 | 300 | 300 | 3/722 | 0.415512% |
| 119 | prefix | 876 | MaximumManaIncreasePercent | T3 | 4 | 33 | {0}% increased maximum Mana | 300 | 300 | 300 | 3/722 | 0.415512% |
| 1354 | prefix | 883 | SpellDamage | T1 | 1 | 75 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1353 | prefix | 883 | SpellDamage | T2 | 2 | 60 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1352 | prefix | 883 | SpellDamage | T3 | 3 | 46 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1351 | prefix | 883 | SpellDamage | T4 | 4 | 33 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1350 | prefix | 883 | SpellDamage | T5 | 5 | 16 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |
| 1349 | prefix | 883 | SpellDamage | T6 | 6 | 1 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/361 | 1.385042% |

### existing-spirit-greater-chaos

Spirit remains after a Greater Chaos removal and blocks its group.

Denominator: **91550**; minimum modifier level: **35**; side: **both**; existing source IDs: **1140**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 0/91550 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| T1 Spirit (47–50) | 0/91550 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +1 Projectile Skills | 0/91550 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +2 Projectile Skills | 5/1831 | 0.273075% | 366.200000 | 97.302565% | 87.221077% | 76.075163% | 60.960656% |
| +3 Projectile Skills | 2/1831 | 0.109230% | 915.500000 | 98.913054% | 94.682139% | 89.647074% | 82.052227% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| prefix | 880 | EnergyShieldPercent | {0}% increased maximum Energy Shield | 4000 | 80/1831 | 4.369197% | source:171, source:170, source:169, source:168 |
| prefix | 879 | EvasionRatingPercent | {0}% increased Evasion Rating | 4000 | 80/1831 | 4.369197% | source:164, source:163, source:162, source:161 |
| prefix | 84 | IncreasedAccuracy | +{0} to Accuracy Rating | 2800 | 56/1831 | 3.058438% | source:1004, source:1003, source:1002, source:1001 |
| prefix | 877 | IncreasedEnergyShield | +{0} to maximum Energy Shield | 5000 | 100/1831 | 5.461496% | source:150, source:149, source:148, source:147, source:146 |
| prefix | 73 | IncreasedLife | +{0} to maximum Life | 4000 | 80/1831 | 4.369197% | source:86, source:85, source:84, source:83 |
| prefix | 74 | IncreasedMana | +{0} to maximum Mana | 8000 | 160/1831 | 8.738394% | source:106, source:105, source:104, source:103, source:102, source:101, source:100, source:99 |
| prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | {0}% increased Armour | 4000 | 80/1831 | 4.369197% | source:157, source:156, source:155, source:154 |
| prefix | 86 | ItemFoundRarityIncreasePrefix | {0}% increased Rarity of Items found | 1000 | 20/1831 | 1.092299% | source:1117 |
| prefix | 875 | MaximumLifeIncreasePercent | {0}% increased maximum Life | 600 | 12/1831 | 0.655380% | source:93, source:92 |
| prefix | 876 | MaximumManaIncreasePercent | {0}% increased maximum Mana | 600 | 12/1831 | 0.655380% | source:121, source:120 |
| prefix | 883 | SpellDamage | {0}% increased Spell Damage | 3000 | 60/1831 | 3.276898% | source:1354, source:1353, source:1352 |
| suffix | 67 | AllAttributes | +{0} to all Attributes | 4000 | 80/1831 | 4.369197% | source:35, source:34, source:33, source:32, source:31 |
| suffix | 71 | AllResistances | +{0}% to all Elemental Resistances | 3200 | 64/1831 | 3.495358% | source:65, source:64, source:63, source:62 |
| suffix | 72 | ChaosResistance | +{0}% to Chaos Resistance | 1000 | 20/1831 | 1.092299% | source:77, source:76, source:75, source:74 |
| suffix | 69 | ColdResistance | +{0}% to Cold Resistance | 5000 | 100/1831 | 5.461496% | source:51, source:50, source:49, source:48, source:47 |
| suffix | 253 | CriticalStrikeChanceIncrease | {0}% increased Critical Hit Chance | 875 | 35/3662 | 0.955762% | source:1029, source:1028, source:1027 |
| suffix | 347 | CriticalStrikeMultiplier | {0}% increased Critical Damage Bonus | 875 | 35/3662 | 0.955762% | source:1072, source:1071, source:1070 |
| suffix | 881 | DamageTakenGainedAsLife | {0}% of Damage taken Recouped as Life | 2000 | 40/1831 | 2.184599% | source:1331, source:1330, source:1329, source:1328 |
| suffix | 49 | Dexterity | +{0} to Dexterity | 4000 | 80/1831 | 4.369197% | source:16, source:15, source:14, source:13 |
| suffix | 68 | FireResistance | +{0}% to Fire Resistance | 5000 | 100/1831 | 5.461496% | source:43, source:42, source:41, source:40, source:39 |
| suffix | 126 | IncreasedCastSpeed | {0}% increased Cast Speed | 3200 | 64/1831 | 3.495358% | source:16303, source:16302, source:16301, source:16300 |
| suffix | 59 | IncreaseSocketedGemLevel | +{0} to Level of all Melee Skills | 350 | 7/1831 | 0.382305% | source:854, source:853 |
| suffix | 252 | IncreaseSocketedGemLevel | +{0} to Level of all Minion Skills | 350 | 7/1831 | 0.382305% | source:838, source:837 |
| suffix | 695 | IncreaseSocketedGemLevel | +{0} to Level of all Projectile Skills | 350 | 7/1831 | 0.382305% | source:867, source:866 |
| suffix | 716 | IncreaseSocketedGemLevel | +{0} to Level of all Spell Skills | 350 | 7/1831 | 0.382305% | source:761, source:760 |
| suffix | 66 | Intelligence | +{0} to Intelligence | 4000 | 80/1831 | 4.369197% | source:25, source:24, source:23, source:22 |
| suffix | 85 | ItemFoundRarityIncrease | {0}% increased Rarity of Items found | 1000 | 20/1831 | 1.092299% | source:1112 |
| suffix | 80 | LifeRegeneration | {0} Life Regeneration per second | 5000 | 100/1831 | 5.461496% | source:887, source:886, source:885, source:884, source:883 |
| suffix | 70 | LightningResistance | +{0}% to Lightning Resistance | 5000 | 100/1831 | 5.461496% | source:59, source:58, source:57, source:56, source:55 |
| suffix | 81 | ManaRegeneration | {0}% increased Mana Regeneration Rate | 3000 | 60/1831 | 3.276898% | source:905, source:904, source:903 |
| suffix | 882 | PercentDamageGoesToMana | {0}% of Damage taken Recouped as Mana | 2000 | 40/1831 | 2.184599% | source:1336, source:1335, source:1334, source:1333 |
| suffix | 48 | Strength | +{0} to Strength | 4000 | 80/1831 | 4.369197% | source:7, source:6, source:5, source:4 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 171 | prefix | 880 | EnergyShieldPercent | T1 | 1 | 75 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 170 | prefix | 880 | EnergyShieldPercent | T2 | 2 | 65 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 169 | prefix | 880 | EnergyShieldPercent | T3 | 3 | 54 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 168 | prefix | 880 | EnergyShieldPercent | T4 | 4 | 46 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 164 | prefix | 879 | EvasionRatingPercent | T1 | 1 | 77 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 163 | prefix | 879 | EvasionRatingPercent | T2 | 2 | 70 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 162 | prefix | 879 | EvasionRatingPercent | T3 | 3 | 54 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 161 | prefix | 879 | EvasionRatingPercent | T4 | 4 | 46 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 1004 | prefix | 84 | IncreasedAccuracy | T1 | 2 | 67 | +{0} to Accuracy Rating | 400 | 400 | 400 | 8/1831 | 0.436920% |
| 1003 | prefix | 84 | IncreasedAccuracy | T2 | 3 | 58 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/1831 | 0.873839% |
| 1002 | prefix | 84 | IncreasedAccuracy | T3 | 4 | 48 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/1831 | 0.873839% |
| 1001 | prefix | 84 | IncreasedAccuracy | T4 | 5 | 36 | +{0} to Accuracy Rating | 800 | 800 | 800 | 16/1831 | 0.873839% |
| 150 | prefix | 877 | IncreasedEnergyShield | T1 | 1 | 80 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 149 | prefix | 877 | IncreasedEnergyShield | T2 | 2 | 70 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 148 | prefix | 877 | IncreasedEnergyShield | T3 | 3 | 65 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 147 | prefix | 877 | IncreasedEnergyShield | T4 | 4 | 54 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 146 | prefix | 877 | IncreasedEnergyShield | T5 | 5 | 46 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 86 | prefix | 73 | IncreasedLife | T1 | 5 | 60 | +{0} to maximum Life | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 85 | prefix | 73 | IncreasedLife | T2 | 6 | 54 | +{0} to maximum Life | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 84 | prefix | 73 | IncreasedLife | T3 | 7 | 46 | +{0} to maximum Life | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 83 | prefix | 73 | IncreasedLife | T4 | 8 | 38 | +{0} to maximum Life | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 106 | prefix | 74 | IncreasedMana | T1 | 1 | 82 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 105 | prefix | 74 | IncreasedMana | T2 | 2 | 75 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 104 | prefix | 74 | IncreasedMana | T3 | 3 | 70 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 103 | prefix | 74 | IncreasedMana | T4 | 4 | 65 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 102 | prefix | 74 | IncreasedMana | T5 | 5 | 60 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 101 | prefix | 74 | IncreasedMana | T6 | 6 | 54 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 100 | prefix | 74 | IncreasedMana | T7 | 7 | 46 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 99 | prefix | 74 | IncreasedMana | T8 | 8 | 38 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 157 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T1 | 1 | 75 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 156 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T2 | 2 | 65 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 155 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T3 | 3 | 54 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 154 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T4 | 4 | 46 | {0}% increased Armour | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 1117 | prefix | 86 | ItemFoundRarityIncreasePrefix | T1 | 1 | 47 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 93 | prefix | 875 | MaximumLifeIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Life | 300 | 300 | 300 | 6/1831 | 0.327690% |
| 92 | prefix | 875 | MaximumLifeIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Life | 300 | 300 | 300 | 6/1831 | 0.327690% |
| 121 | prefix | 876 | MaximumManaIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Mana | 300 | 300 | 300 | 6/1831 | 0.327690% |
| 120 | prefix | 876 | MaximumManaIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Mana | 300 | 300 | 300 | 6/1831 | 0.327690% |
| 1354 | prefix | 883 | SpellDamage | T1 | 1 | 75 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 1353 | prefix | 883 | SpellDamage | T2 | 2 | 60 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 1352 | prefix | 883 | SpellDamage | T3 | 3 | 46 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 35 | suffix | 67 | AllAttributes | T1 | 1 | 82 | +{0} to all Attributes | 800 | 800 | 800 | 16/1831 | 0.873839% |
| 34 | suffix | 67 | AllAttributes | T2 | 2 | 75 | +{0} to all Attributes | 800 | 800 | 800 | 16/1831 | 0.873839% |
| 33 | suffix | 67 | AllAttributes | T3 | 3 | 66 | +{0} to all Attributes | 800 | 800 | 800 | 16/1831 | 0.873839% |
| 32 | suffix | 67 | AllAttributes | T4 | 4 | 55 | +{0} to all Attributes | 800 | 800 | 800 | 16/1831 | 0.873839% |
| 31 | suffix | 67 | AllAttributes | T5 | 5 | 44 | +{0} to all Attributes | 800 | 800 | 800 | 16/1831 | 0.873839% |
| 65 | suffix | 71 | AllResistances | T1 | 1 | 80 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/1831 | 0.873839% |
| 64 | suffix | 71 | AllResistances | T2 | 2 | 68 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/1831 | 0.873839% |
| 63 | suffix | 71 | AllResistances | T3 | 3 | 54 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/1831 | 0.873839% |
| 62 | suffix | 71 | AllResistances | T4 | 4 | 40 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 16/1831 | 0.873839% |
| 77 | suffix | 72 | ChaosResistance | T1 | 1 | 81 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1831 | 0.273075% |
| 76 | suffix | 72 | ChaosResistance | T2 | 2 | 68 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1831 | 0.273075% |
| 75 | suffix | 72 | ChaosResistance | T3 | 4 | 56 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1831 | 0.273075% |
| 74 | suffix | 72 | ChaosResistance | T4 | 5 | 44 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1831 | 0.273075% |
| 51 | suffix | 69 | ColdResistance | T1 | 1 | 82 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 50 | suffix | 69 | ColdResistance | T2 | 2 | 71 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 49 | suffix | 69 | ColdResistance | T3 | 3 | 60 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 48 | suffix | 69 | ColdResistance | T4 | 4 | 50 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 47 | suffix | 69 | ColdResistance | T5 | 5 | 38 | +{0}% to Cold Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 1029 | suffix | 253 | CriticalStrikeChanceIncrease | T1 | 1 | 72 | {0}% increased Critical Hit Chance | 125 | 125 | 125 | 5/3662 | 0.136537% |
| 1028 | suffix | 253 | CriticalStrikeChanceIncrease | T2 | 2 | 58 | {0}% increased Critical Hit Chance | 250 | 250 | 250 | 5/1831 | 0.273075% |
| 1027 | suffix | 253 | CriticalStrikeChanceIncrease | T3 | 3 | 44 | {0}% increased Critical Hit Chance | 500 | 500 | 500 | 10/1831 | 0.546150% |
| 1072 | suffix | 347 | CriticalStrikeMultiplier | T1 | 1 | 74 | {0}% increased Critical Damage Bonus | 125 | 125 | 125 | 5/3662 | 0.136537% |
| 1071 | suffix | 347 | CriticalStrikeMultiplier | T2 | 2 | 59 | {0}% increased Critical Damage Bonus | 250 | 250 | 250 | 5/1831 | 0.273075% |
| 1070 | suffix | 347 | CriticalStrikeMultiplier | T3 | 3 | 45 | {0}% increased Critical Damage Bonus | 500 | 500 | 500 | 10/1831 | 0.546150% |
| 1331 | suffix | 881 | DamageTakenGainedAsLife | T1 | 1 | 79 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/1831 | 0.546150% |
| 1330 | suffix | 881 | DamageTakenGainedAsLife | T2 | 2 | 68 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/1831 | 0.546150% |
| 1329 | suffix | 881 | DamageTakenGainedAsLife | T3 | 3 | 56 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/1831 | 0.546150% |
| 1328 | suffix | 881 | DamageTakenGainedAsLife | T4 | 4 | 44 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 10/1831 | 0.546150% |
| 16 | suffix | 49 | Dexterity | T1 | 2 | 74 | +{0} to Dexterity | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 15 | suffix | 49 | Dexterity | T2 | 3 | 66 | +{0} to Dexterity | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 14 | suffix | 49 | Dexterity | T3 | 4 | 55 | +{0} to Dexterity | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 13 | suffix | 49 | Dexterity | T4 | 5 | 44 | +{0} to Dexterity | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 43 | suffix | 68 | FireResistance | T1 | 1 | 82 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 42 | suffix | 68 | FireResistance | T2 | 2 | 71 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 41 | suffix | 68 | FireResistance | T3 | 3 | 60 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 40 | suffix | 68 | FireResistance | T4 | 4 | 48 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 39 | suffix | 68 | FireResistance | T5 | 5 | 36 | +{0}% to Fire Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 16303 | suffix | 126 | IncreasedCastSpeed | T1 | 3 | 66 | {0}% increased Cast Speed | 800 | 800 | 800 | 16/1831 | 0.873839% |
| 16302 | suffix | 126 | IncreasedCastSpeed | T2 | 4 | 60 | {0}% increased Cast Speed | 800 | null | 800 | 16/1831 | 0.873839% |
| 16301 | suffix | 126 | IncreasedCastSpeed | T3 | 5 | 51 | {0}% increased Cast Speed | 800 | null | 800 | 16/1831 | 0.873839% |
| 16300 | suffix | 126 | IncreasedCastSpeed | T4 | 7 | 35 | {0}% increased Cast Speed | 800 | null | 800 | 16/1831 | 0.873839% |
| 854 | suffix | 59 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Melee Skills | 100 | 100 | 100 | 2/1831 | 0.109230% |
| 853 | suffix | 59 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Melee Skills | 250 | 250 | 250 | 5/1831 | 0.273075% |
| 838 | suffix | 252 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Minion Skills | 100 | 100 | 100 | 2/1831 | 0.109230% |
| 837 | suffix | 252 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Minion Skills | 250 | 250 | 250 | 5/1831 | 0.273075% |
| 867 | suffix | 695 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Projectile Skills | 100 | 100 | 100 | 2/1831 | 0.109230% |
| 866 | suffix | 695 | IncreaseSocketedGemLevel | T2 | 4 | 41 | +{0} to Level of all Projectile Skills | 250 | 250 | 250 | 5/1831 | 0.273075% |
| 761 | suffix | 716 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Spell Skills | 100 | 100 | 100 | 2/1831 | 0.109230% |
| 760 | suffix | 716 | IncreaseSocketedGemLevel | T2 | 5 | 41 | +{0} to Level of all Spell Skills | 250 | 250 | 250 | 5/1831 | 0.273075% |
| 25 | suffix | 66 | Intelligence | T1 | 2 | 74 | +{0} to Intelligence | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 24 | suffix | 66 | Intelligence | T2 | 3 | 66 | +{0} to Intelligence | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 23 | suffix | 66 | Intelligence | T3 | 4 | 55 | +{0} to Intelligence | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 22 | suffix | 66 | Intelligence | T4 | 5 | 44 | +{0} to Intelligence | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 1112 | suffix | 85 | ItemFoundRarityIncrease | T1 | 1 | 40 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 887 | suffix | 80 | LifeRegeneration | T1 | 2 | 75 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 886 | suffix | 80 | LifeRegeneration | T2 | 3 | 68 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 885 | suffix | 80 | LifeRegeneration | T3 | 4 | 58 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 884 | suffix | 80 | LifeRegeneration | T4 | 5 | 47 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 883 | suffix | 80 | LifeRegeneration | T5 | 6 | 35 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 59 | suffix | 70 | LightningResistance | T1 | 1 | 82 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 58 | suffix | 70 | LightningResistance | T2 | 2 | 71 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 57 | suffix | 70 | LightningResistance | T3 | 3 | 60 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 56 | suffix | 70 | LightningResistance | T4 | 4 | 49 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 55 | suffix | 70 | LightningResistance | T5 | 5 | 37 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 905 | suffix | 81 | ManaRegeneration | T1 | 1 | 79 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 904 | suffix | 81 | ManaRegeneration | T2 | 2 | 55 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 903 | suffix | 81 | ManaRegeneration | T3 | 3 | 42 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 20/1831 | 1.092299% |
| 1336 | suffix | 882 | PercentDamageGoesToMana | T1 | 1 | 80 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/1831 | 0.546150% |
| 1335 | suffix | 882 | PercentDamageGoesToMana | T2 | 2 | 69 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/1831 | 0.546150% |
| 1334 | suffix | 882 | PercentDamageGoesToMana | T3 | 3 | 57 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/1831 | 0.546150% |
| 1333 | suffix | 882 | PercentDamageGoesToMana | T4 | 4 | 45 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 10/1831 | 0.546150% |
| 7 | suffix | 48 | Strength | T1 | 2 | 74 | +{0} to Strength | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 6 | suffix | 48 | Strength | T2 | 3 | 66 | +{0} to Strength | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 5 | suffix | 48 | Strength | T3 | 4 | 55 | +{0} to Strength | 1000 | null | 1000 | 20/1831 | 1.092299% |
| 4 | suffix | 48 | Strength | T4 | 5 | 44 | +{0} to Strength | 1000 | null | 1000 | 20/1831 | 1.092299% |

### existing-melee-perfect-chaos

Melee remains after a Perfect Chaos removal and blocks only source group 59.

Denominator: **64600**; minimum modifier level: **50**; side: **both**; existing source IDs: **854**.

| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Any Spirit tier | 2/323 | 0.619195% | 161.500000 | 93.977762% | 73.303634% | 53.734227% | 32.490345% |
| T1 Spirit (47–50) | 2/323 | 0.619195% | 161.500000 | 93.977762% | 73.303634% | 53.734227% | 32.490345% |
| +1 Projectile Skills | 0/64600 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +2 Projectile Skills | 0/64600 | 0.000000% | ∞ | 100.000000% | 100.000000% | 100.000000% | 100.000000% |
| +3 Projectile Skills | 1/646 | 0.154799% | 646.000000 | 98.462751% | 92.546464% | 85.648481% | 75.547934% |

| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |
|---|---:|---|---|---:|---:|---:|---|
| prefix | 281 | BaseSpirit | +{0} to Spirit | 400 | 2/323 | 0.619195% | source:1140 |
| prefix | 880 | EnergyShieldPercent | {0}% increased maximum Energy Shield | 3000 | 15/323 | 4.643963% | source:171, source:170, source:169 |
| prefix | 879 | EvasionRatingPercent | {0}% increased Evasion Rating | 3000 | 15/323 | 4.643963% | source:164, source:163, source:162 |
| prefix | 84 | IncreasedAccuracy | +{0} to Accuracy Rating | 1200 | 6/323 | 1.857585% | source:1004, source:1003 |
| prefix | 877 | IncreasedEnergyShield | +{0} to maximum Energy Shield | 4000 | 20/323 | 6.191950% | source:150, source:149, source:148, source:147 |
| prefix | 73 | IncreasedLife | +{0} to maximum Life | 2000 | 10/323 | 3.095975% | source:86, source:85 |
| prefix | 74 | IncreasedMana | +{0} to maximum Mana | 6000 | 30/323 | 9.287926% | source:106, source:105, source:104, source:103, source:102, source:101 |
| prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | {0}% increased Armour | 3000 | 15/323 | 4.643963% | source:157, source:156, source:155 |
| prefix | 86 | ItemFoundRarityIncreasePrefix | {0}% increased Rarity of Items found | 1000 | 5/323 | 1.547988% | source:1117 |
| prefix | 875 | MaximumLifeIncreasePercent | {0}% increased maximum Life | 600 | 3/323 | 0.928793% | source:93, source:92 |
| prefix | 876 | MaximumManaIncreasePercent | {0}% increased maximum Mana | 600 | 3/323 | 0.928793% | source:121, source:120 |
| prefix | 883 | SpellDamage | {0}% increased Spell Damage | 2000 | 10/323 | 3.095975% | source:1354, source:1353 |
| suffix | 67 | AllAttributes | +{0} to all Attributes | 3200 | 16/323 | 4.953560% | source:35, source:34, source:33, source:32 |
| suffix | 71 | AllResistances | +{0}% to all Elemental Resistances | 2400 | 12/323 | 3.715170% | source:65, source:64, source:63 |
| suffix | 72 | ChaosResistance | +{0}% to Chaos Resistance | 750 | 15/1292 | 1.160991% | source:77, source:76, source:75 |
| suffix | 69 | ColdResistance | +{0}% to Cold Resistance | 4000 | 20/323 | 6.191950% | source:51, source:50, source:49, source:48 |
| suffix | 253 | CriticalStrikeChanceIncrease | {0}% increased Critical Hit Chance | 375 | 15/2584 | 0.580495% | source:1029, source:1028 |
| suffix | 347 | CriticalStrikeMultiplier | {0}% increased Critical Damage Bonus | 375 | 15/2584 | 0.580495% | source:1072, source:1071 |
| suffix | 881 | DamageTakenGainedAsLife | {0}% of Damage taken Recouped as Life | 1500 | 15/646 | 2.321981% | source:1331, source:1330, source:1329 |
| suffix | 49 | Dexterity | +{0} to Dexterity | 3000 | 15/323 | 4.643963% | source:16, source:15, source:14 |
| suffix | 68 | FireResistance | +{0}% to Fire Resistance | 3000 | 15/323 | 4.643963% | source:43, source:42, source:41 |
| suffix | 126 | IncreasedCastSpeed | {0}% increased Cast Speed | 2400 | 12/323 | 3.715170% | source:16303, source:16302, source:16301 |
| suffix | 252 | IncreaseSocketedGemLevel | +{0} to Level of all Minion Skills | 100 | 1/646 | 0.154799% | source:838 |
| suffix | 695 | IncreaseSocketedGemLevel | +{0} to Level of all Projectile Skills | 100 | 1/646 | 0.154799% | source:867 |
| suffix | 716 | IncreaseSocketedGemLevel | +{0} to Level of all Spell Skills | 100 | 1/646 | 0.154799% | source:761 |
| suffix | 66 | Intelligence | +{0} to Intelligence | 3000 | 15/323 | 4.643963% | source:25, source:24, source:23 |
| suffix | 85 | ItemFoundRarityIncrease | {0}% increased Rarity of Items found | 1000 | 5/323 | 1.547988% | source:1112 |
| suffix | 80 | LifeRegeneration | {0} Life Regeneration per second | 3000 | 15/323 | 4.643963% | source:887, source:886, source:885 |
| suffix | 70 | LightningResistance | +{0}% to Lightning Resistance | 3000 | 15/323 | 4.643963% | source:59, source:58, source:57 |
| suffix | 81 | ManaRegeneration | {0}% increased Mana Regeneration Rate | 2000 | 10/323 | 3.095975% | source:905, source:904 |
| suffix | 882 | PercentDamageGoesToMana | {0}% of Damage taken Recouped as Mana | 1500 | 15/646 | 2.321981% | source:1336, source:1335, source:1334 |
| suffix | 48 | Strength | +{0} to Strength | 3000 | 15/323 | 4.643963% | source:7, source:6, source:5 |

| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |
|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 1140 | prefix | 281 | BaseSpirit | T1 | 4 | 54 | +{0} to Spirit | 400 | null | 400 | 2/323 | 0.619195% |
| 171 | prefix | 880 | EnergyShieldPercent | T1 | 1 | 75 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 170 | prefix | 880 | EnergyShieldPercent | T2 | 2 | 65 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 169 | prefix | 880 | EnergyShieldPercent | T3 | 3 | 54 | {0}% increased maximum Energy Shield | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 164 | prefix | 879 | EvasionRatingPercent | T1 | 1 | 77 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 163 | prefix | 879 | EvasionRatingPercent | T2 | 2 | 70 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 162 | prefix | 879 | EvasionRatingPercent | T3 | 3 | 54 | {0}% increased Evasion Rating | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 1004 | prefix | 84 | IncreasedAccuracy | T1 | 2 | 67 | +{0} to Accuracy Rating | 400 | 400 | 400 | 2/323 | 0.619195% |
| 1003 | prefix | 84 | IncreasedAccuracy | T2 | 3 | 58 | +{0} to Accuracy Rating | 800 | 800 | 800 | 4/323 | 1.238390% |
| 150 | prefix | 877 | IncreasedEnergyShield | T1 | 1 | 80 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 149 | prefix | 877 | IncreasedEnergyShield | T2 | 2 | 70 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 148 | prefix | 877 | IncreasedEnergyShield | T3 | 3 | 65 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 147 | prefix | 877 | IncreasedEnergyShield | T4 | 4 | 54 | +{0} to maximum Energy Shield | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 86 | prefix | 73 | IncreasedLife | T1 | 5 | 60 | +{0} to maximum Life | 1000 | null | 1000 | 5/323 | 1.547988% |
| 85 | prefix | 73 | IncreasedLife | T2 | 6 | 54 | +{0} to maximum Life | 1000 | null | 1000 | 5/323 | 1.547988% |
| 106 | prefix | 74 | IncreasedMana | T1 | 1 | 82 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 105 | prefix | 74 | IncreasedMana | T2 | 2 | 75 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 104 | prefix | 74 | IncreasedMana | T3 | 3 | 70 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 103 | prefix | 74 | IncreasedMana | T4 | 4 | 65 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 102 | prefix | 74 | IncreasedMana | T5 | 5 | 60 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 101 | prefix | 74 | IncreasedMana | T6 | 6 | 54 | +{0} to maximum Mana | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 157 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T1 | 1 | 75 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 156 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T2 | 2 | 65 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 155 | prefix | 878 | IncreasedPhysicalDamageReductionRatingPercent | T3 | 3 | 54 | {0}% increased Armour | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 1117 | prefix | 86 | ItemFoundRarityIncreasePrefix | T1 | 1 | 47 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 93 | prefix | 875 | MaximumLifeIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Life | 300 | 300 | 300 | 3/646 | 0.464396% |
| 92 | prefix | 875 | MaximumLifeIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Life | 300 | 300 | 300 | 3/646 | 0.464396% |
| 121 | prefix | 876 | MaximumManaIncreasePercent | T1 | 1 | 75 | {0}% increased maximum Mana | 300 | 300 | 300 | 3/646 | 0.464396% |
| 120 | prefix | 876 | MaximumManaIncreasePercent | T2 | 3 | 60 | {0}% increased maximum Mana | 300 | 300 | 300 | 3/646 | 0.464396% |
| 1354 | prefix | 883 | SpellDamage | T1 | 1 | 75 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 1353 | prefix | 883 | SpellDamage | T2 | 2 | 60 | {0}% increased Spell Damage | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 35 | suffix | 67 | AllAttributes | T1 | 1 | 82 | +{0} to all Attributes | 800 | 800 | 800 | 4/323 | 1.238390% |
| 34 | suffix | 67 | AllAttributes | T2 | 2 | 75 | +{0} to all Attributes | 800 | 800 | 800 | 4/323 | 1.238390% |
| 33 | suffix | 67 | AllAttributes | T3 | 3 | 66 | +{0} to all Attributes | 800 | 800 | 800 | 4/323 | 1.238390% |
| 32 | suffix | 67 | AllAttributes | T4 | 4 | 55 | +{0} to all Attributes | 800 | 800 | 800 | 4/323 | 1.238390% |
| 65 | suffix | 71 | AllResistances | T1 | 1 | 80 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 4/323 | 1.238390% |
| 64 | suffix | 71 | AllResistances | T2 | 2 | 68 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 4/323 | 1.238390% |
| 63 | suffix | 71 | AllResistances | T3 | 3 | 54 | +{0}% to all Elemental Resistances | 800 | 800 | 800 | 4/323 | 1.238390% |
| 77 | suffix | 72 | ChaosResistance | T1 | 1 | 81 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1292 | 0.386997% |
| 76 | suffix | 72 | ChaosResistance | T2 | 2 | 68 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1292 | 0.386997% |
| 75 | suffix | 72 | ChaosResistance | T3 | 4 | 56 | +{0}% to Chaos Resistance | 250 | null | 250 | 5/1292 | 0.386997% |
| 51 | suffix | 69 | ColdResistance | T1 | 1 | 82 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/323 | 1.547988% |
| 50 | suffix | 69 | ColdResistance | T2 | 2 | 71 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/323 | 1.547988% |
| 49 | suffix | 69 | ColdResistance | T3 | 3 | 60 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/323 | 1.547988% |
| 48 | suffix | 69 | ColdResistance | T4 | 4 | 50 | +{0}% to Cold Resistance | 1000 | null | 1000 | 5/323 | 1.547988% |
| 1029 | suffix | 253 | CriticalStrikeChanceIncrease | T1 | 1 | 72 | {0}% increased Critical Hit Chance | 125 | 125 | 125 | 5/2584 | 0.193498% |
| 1028 | suffix | 253 | CriticalStrikeChanceIncrease | T2 | 2 | 58 | {0}% increased Critical Hit Chance | 250 | 250 | 250 | 5/1292 | 0.386997% |
| 1072 | suffix | 347 | CriticalStrikeMultiplier | T1 | 1 | 74 | {0}% increased Critical Damage Bonus | 125 | 125 | 125 | 5/2584 | 0.193498% |
| 1071 | suffix | 347 | CriticalStrikeMultiplier | T2 | 2 | 59 | {0}% increased Critical Damage Bonus | 250 | 250 | 250 | 5/1292 | 0.386997% |
| 1331 | suffix | 881 | DamageTakenGainedAsLife | T1 | 1 | 79 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/646 | 0.773994% |
| 1330 | suffix | 881 | DamageTakenGainedAsLife | T2 | 2 | 68 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/646 | 0.773994% |
| 1329 | suffix | 881 | DamageTakenGainedAsLife | T3 | 3 | 56 | {0}% of Damage taken Recouped as Life | 500 | 500 | 500 | 5/646 | 0.773994% |
| 16 | suffix | 49 | Dexterity | T1 | 2 | 74 | +{0} to Dexterity | 1000 | null | 1000 | 5/323 | 1.547988% |
| 15 | suffix | 49 | Dexterity | T2 | 3 | 66 | +{0} to Dexterity | 1000 | null | 1000 | 5/323 | 1.547988% |
| 14 | suffix | 49 | Dexterity | T3 | 4 | 55 | +{0} to Dexterity | 1000 | null | 1000 | 5/323 | 1.547988% |
| 43 | suffix | 68 | FireResistance | T1 | 1 | 82 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/323 | 1.547988% |
| 42 | suffix | 68 | FireResistance | T2 | 2 | 71 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/323 | 1.547988% |
| 41 | suffix | 68 | FireResistance | T3 | 3 | 60 | +{0}% to Fire Resistance | 1000 | null | 1000 | 5/323 | 1.547988% |
| 16303 | suffix | 126 | IncreasedCastSpeed | T1 | 3 | 66 | {0}% increased Cast Speed | 800 | 800 | 800 | 4/323 | 1.238390% |
| 16302 | suffix | 126 | IncreasedCastSpeed | T2 | 4 | 60 | {0}% increased Cast Speed | 800 | null | 800 | 4/323 | 1.238390% |
| 16301 | suffix | 126 | IncreasedCastSpeed | T3 | 5 | 51 | {0}% increased Cast Speed | 800 | null | 800 | 4/323 | 1.238390% |
| 838 | suffix | 252 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Minion Skills | 100 | 100 | 100 | 1/646 | 0.154799% |
| 867 | suffix | 695 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Projectile Skills | 100 | 100 | 100 | 1/646 | 0.154799% |
| 761 | suffix | 716 | IncreaseSocketedGemLevel | T1 | 2 | 75 | +{0} to Level of all Spell Skills | 100 | 100 | 100 | 1/646 | 0.154799% |
| 25 | suffix | 66 | Intelligence | T1 | 2 | 74 | +{0} to Intelligence | 1000 | null | 1000 | 5/323 | 1.547988% |
| 24 | suffix | 66 | Intelligence | T2 | 3 | 66 | +{0} to Intelligence | 1000 | null | 1000 | 5/323 | 1.547988% |
| 23 | suffix | 66 | Intelligence | T3 | 4 | 55 | +{0} to Intelligence | 1000 | null | 1000 | 5/323 | 1.547988% |
| 1112 | suffix | 85 | ItemFoundRarityIncrease | T1 | 1 | 40 | {0}% increased Rarity of Items found | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 887 | suffix | 80 | LifeRegeneration | T1 | 2 | 75 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 886 | suffix | 80 | LifeRegeneration | T2 | 3 | 68 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 885 | suffix | 80 | LifeRegeneration | T3 | 4 | 58 | {0} Life Regeneration per second | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 59 | suffix | 70 | LightningResistance | T1 | 1 | 82 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/323 | 1.547988% |
| 58 | suffix | 70 | LightningResistance | T2 | 2 | 71 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/323 | 1.547988% |
| 57 | suffix | 70 | LightningResistance | T3 | 3 | 60 | +{0}% to Lightning Resistance | 1000 | null | 1000 | 5/323 | 1.547988% |
| 905 | suffix | 81 | ManaRegeneration | T1 | 1 | 79 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 904 | suffix | 81 | ManaRegeneration | T2 | 2 | 55 | {0}% increased Mana Regeneration Rate | 1000 | 1000 | 1000 | 5/323 | 1.547988% |
| 1336 | suffix | 882 | PercentDamageGoesToMana | T1 | 1 | 80 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/646 | 0.773994% |
| 1335 | suffix | 882 | PercentDamageGoesToMana | T2 | 2 | 69 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/646 | 0.773994% |
| 1334 | suffix | 882 | PercentDamageGoesToMana | T3 | 3 | 57 | {0}% of Damage taken Recouped as Mana | 500 | 500 | 500 | 5/646 | 0.773994% |
| 7 | suffix | 48 | Strength | T1 | 2 | 74 | +{0} to Strength | 1000 | null | 1000 | 5/323 | 1.547988% |
| 6 | suffix | 48 | Strength | T2 | 3 | 66 | +{0} to Strength | 1000 | null | 1000 | 5/323 | 1.547988% |
| 5 | suffix | 48 | Strength | T3 | 4 | 55 | +{0} to Strength | 1000 | null | 1000 | 5/323 | 1.547988% |

## All display-tier mismatches

Count: **520**

| Pool | Affix | Legacy group | Stable ID | Source group | Required | Legacy tier | Display tier | Line |
|---|---|---|---:|---:|---:|---:|---:|---|
| amulets | suffix | IncreaseSocketedGemLevel | 838 | 252 | 75 | 2 | 1 | +{0} to Level of all Minion Skills |
| amulets | suffix | IncreaseSocketedGemLevel | 867 | 695 | 75 | 3 | 1 | +{0} to Level of all Projectile Skills |
| amulets | suffix | IncreaseSocketedGemLevel | 761 | 716 | 75 | 4 | 1 | +{0} to Level of all Spell Skills |
| amulets | suffix | IncreaseSocketedGemLevel | 853 | 59 | 41 | 5 | 2 | +{0} to Level of all Melee Skills |
| amulets | suffix | IncreaseSocketedGemLevel | 837 | 252 | 41 | 6 | 2 | +{0} to Level of all Minion Skills |
| amulets | suffix | IncreaseSocketedGemLevel | 866 | 695 | 41 | 7 | 2 | +{0} to Level of all Projectile Skills |
| amulets | suffix | IncreaseSocketedGemLevel | 760 | 716 | 41 | 8 | 2 | +{0} to Level of all Spell Skills |
| amulets | suffix | IncreaseSocketedGemLevel | 759 | 716 | 10 | 9 | 3 | +{0} to Level of all Spell Skills |
| amulets | suffix | IncreaseSocketedGemLevel | 852 | 59 | 5 | 10 | 3 | +{0} to Level of all Melee Skills |
| amulets | suffix | IncreaseSocketedGemLevel | 836 | 252 | 5 | 11 | 3 | +{0} to Level of all Minion Skills |
| amulets | suffix | IncreaseSocketedGemLevel | 865 | 695 | 5 | 12 | 3 | +{0} to Level of all Projectile Skills |
| belts | prefix | BeltFlaskRecoveryRate | 1275 | 162 | 63 | 2 | 1 | {0}% increased Flask Mana Recovery rate |
| belts | prefix | BeltFlaskRecoveryRate | 1268 | 161 | 60 | 3 | 2 | {0}% increased Flask Life Recovery rate |
| belts | prefix | BeltFlaskRecoveryRate | 1274 | 162 | 54 | 4 | 2 | {0}% increased Flask Mana Recovery rate |
| belts | prefix | BeltFlaskRecoveryRate | 1267 | 161 | 46 | 5 | 3 | {0}% increased Flask Life Recovery rate |
| belts | prefix | BeltFlaskRecoveryRate | 1273 | 162 | 36 | 6 | 3 | {0}% increased Flask Mana Recovery rate |
| belts | prefix | BeltFlaskRecoveryRate | 1266 | 161 | 33 | 7 | 4 | {0}% increased Flask Life Recovery rate |
| belts | prefix | BeltFlaskRecoveryRate | 1272 | 162 | 26 | 8 | 4 | {0}% increased Flask Mana Recovery rate |
| belts | prefix | BeltFlaskRecoveryRate | 1265 | 161 | 16 | 9 | 5 | {0}% increased Flask Life Recovery rate |
| belts | prefix | BeltFlaskRecoveryRate | 1271 | 162 | 11 | 10 | 5 | {0}% increased Flask Mana Recovery rate |
| belts | prefix | BeltFlaskRecoveryRate | 1270 | 162 | 5 | 11 | 6 | {0}% increased Flask Mana Recovery rate |
| belts | prefix | BeltFlaskRecoveryRate | 1264 | 161 | 1 | 12 | 6 | {0}% increased Flask Life Recovery rate |
| body_armours_dex | suffix | ReducedAilmentDuration | 1173 | 284 | 76 | 2 | 1 | {0}% reduced Ignite Duration on you |
| body_armours_dex | suffix | ReducedAilmentDuration | 1168 | 283 | 76 | 3 | 1 | {0}% reduced Poison Duration on you |
| body_armours_dex | suffix | ReducedAilmentDuration | 1162 | 282 | 64 | 4 | 2 | {0}% reduced Duration of Bleeding on You |
| body_armours_dex | suffix | ReducedAilmentDuration | 1172 | 284 | 64 | 5 | 2 | {0}% reduced Ignite Duration on you |
| body_armours_dex | suffix | ReducedAilmentDuration | 1167 | 283 | 64 | 6 | 2 | {0}% reduced Poison Duration on you |
| body_armours_dex | suffix | ReducedAilmentDuration | 1161 | 282 | 50 | 7 | 3 | {0}% reduced Duration of Bleeding on You |
| body_armours_dex | suffix | ReducedAilmentDuration | 1171 | 284 | 50 | 8 | 3 | {0}% reduced Ignite Duration on you |
| body_armours_dex | suffix | ReducedAilmentDuration | 1166 | 283 | 50 | 9 | 3 | {0}% reduced Poison Duration on you |
| body_armours_dex | suffix | ReducedAilmentDuration | 1160 | 282 | 37 | 10 | 4 | {0}% reduced Duration of Bleeding on You |
| body_armours_dex | suffix | ReducedAilmentDuration | 1170 | 284 | 37 | 11 | 4 | {0}% reduced Ignite Duration on you |
| body_armours_dex | suffix | ReducedAilmentDuration | 1165 | 283 | 37 | 12 | 4 | {0}% reduced Poison Duration on you |
| body_armours_dex | suffix | ReducedAilmentDuration | 1159 | 282 | 21 | 13 | 5 | {0}% reduced Duration of Bleeding on You |
| body_armours_dex | suffix | ReducedAilmentDuration | 1169 | 284 | 21 | 14 | 5 | {0}% reduced Ignite Duration on you |
| body_armours_dex | suffix | ReducedAilmentDuration | 1164 | 283 | 21 | 15 | 5 | {0}% reduced Poison Duration on you |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1173 | 284 | 76 | 2 | 1 | {0}% reduced Ignite Duration on you |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1168 | 283 | 76 | 3 | 1 | {0}% reduced Poison Duration on you |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1162 | 282 | 64 | 4 | 2 | {0}% reduced Duration of Bleeding on You |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1172 | 284 | 64 | 5 | 2 | {0}% reduced Ignite Duration on you |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1167 | 283 | 64 | 6 | 2 | {0}% reduced Poison Duration on you |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1161 | 282 | 50 | 7 | 3 | {0}% reduced Duration of Bleeding on You |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1171 | 284 | 50 | 8 | 3 | {0}% reduced Ignite Duration on you |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1166 | 283 | 50 | 9 | 3 | {0}% reduced Poison Duration on you |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1160 | 282 | 37 | 10 | 4 | {0}% reduced Duration of Bleeding on You |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1170 | 284 | 37 | 11 | 4 | {0}% reduced Ignite Duration on you |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1165 | 283 | 37 | 12 | 4 | {0}% reduced Poison Duration on you |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1159 | 282 | 21 | 13 | 5 | {0}% reduced Duration of Bleeding on You |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1169 | 284 | 21 | 14 | 5 | {0}% reduced Ignite Duration on you |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 1164 | 283 | 21 | 15 | 5 | {0}% reduced Poison Duration on you |
| body_armours_int | suffix | ReducedAilmentDuration | 1173 | 284 | 76 | 2 | 1 | {0}% reduced Ignite Duration on you |
| body_armours_int | suffix | ReducedAilmentDuration | 1168 | 283 | 76 | 3 | 1 | {0}% reduced Poison Duration on you |
| body_armours_int | suffix | ReducedAilmentDuration | 1162 | 282 | 64 | 4 | 2 | {0}% reduced Duration of Bleeding on You |
| body_armours_int | suffix | ReducedAilmentDuration | 1172 | 284 | 64 | 5 | 2 | {0}% reduced Ignite Duration on you |
| body_armours_int | suffix | ReducedAilmentDuration | 1167 | 283 | 64 | 6 | 2 | {0}% reduced Poison Duration on you |
| body_armours_int | suffix | ReducedAilmentDuration | 1161 | 282 | 50 | 7 | 3 | {0}% reduced Duration of Bleeding on You |
| body_armours_int | suffix | ReducedAilmentDuration | 1171 | 284 | 50 | 8 | 3 | {0}% reduced Ignite Duration on you |
| body_armours_int | suffix | ReducedAilmentDuration | 1166 | 283 | 50 | 9 | 3 | {0}% reduced Poison Duration on you |
| body_armours_int | suffix | ReducedAilmentDuration | 1160 | 282 | 37 | 10 | 4 | {0}% reduced Duration of Bleeding on You |
| body_armours_int | suffix | ReducedAilmentDuration | 1170 | 284 | 37 | 11 | 4 | {0}% reduced Ignite Duration on you |
| body_armours_int | suffix | ReducedAilmentDuration | 1165 | 283 | 37 | 12 | 4 | {0}% reduced Poison Duration on you |
| body_armours_int | suffix | ReducedAilmentDuration | 1159 | 282 | 21 | 13 | 5 | {0}% reduced Duration of Bleeding on You |
| body_armours_int | suffix | ReducedAilmentDuration | 1169 | 284 | 21 | 14 | 5 | {0}% reduced Ignite Duration on you |
| body_armours_int | suffix | ReducedAilmentDuration | 1164 | 283 | 21 | 15 | 5 | {0}% reduced Poison Duration on you |
| body_armours_str | suffix | ReducedAilmentDuration | 1173 | 284 | 76 | 2 | 1 | {0}% reduced Ignite Duration on you |
| body_armours_str | suffix | ReducedAilmentDuration | 1168 | 283 | 76 | 3 | 1 | {0}% reduced Poison Duration on you |
| body_armours_str | suffix | ReducedAilmentDuration | 1162 | 282 | 64 | 4 | 2 | {0}% reduced Duration of Bleeding on You |
| body_armours_str | suffix | ReducedAilmentDuration | 1172 | 284 | 64 | 5 | 2 | {0}% reduced Ignite Duration on you |
| body_armours_str | suffix | ReducedAilmentDuration | 1167 | 283 | 64 | 6 | 2 | {0}% reduced Poison Duration on you |
| body_armours_str | suffix | ReducedAilmentDuration | 1161 | 282 | 50 | 7 | 3 | {0}% reduced Duration of Bleeding on You |
| body_armours_str | suffix | ReducedAilmentDuration | 1171 | 284 | 50 | 8 | 3 | {0}% reduced Ignite Duration on you |
| body_armours_str | suffix | ReducedAilmentDuration | 1166 | 283 | 50 | 9 | 3 | {0}% reduced Poison Duration on you |
| body_armours_str | suffix | ReducedAilmentDuration | 1160 | 282 | 37 | 10 | 4 | {0}% reduced Duration of Bleeding on You |
| body_armours_str | suffix | ReducedAilmentDuration | 1170 | 284 | 37 | 11 | 4 | {0}% reduced Ignite Duration on you |
| body_armours_str | suffix | ReducedAilmentDuration | 1165 | 283 | 37 | 12 | 4 | {0}% reduced Poison Duration on you |
| body_armours_str | suffix | ReducedAilmentDuration | 1159 | 282 | 21 | 13 | 5 | {0}% reduced Duration of Bleeding on You |
| body_armours_str | suffix | ReducedAilmentDuration | 1169 | 284 | 21 | 14 | 5 | {0}% reduced Ignite Duration on you |
| body_armours_str | suffix | ReducedAilmentDuration | 1164 | 283 | 21 | 15 | 5 | {0}% reduced Poison Duration on you |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1173 | 284 | 76 | 2 | 1 | {0}% reduced Ignite Duration on you |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1168 | 283 | 76 | 3 | 1 | {0}% reduced Poison Duration on you |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1162 | 282 | 64 | 4 | 2 | {0}% reduced Duration of Bleeding on You |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1172 | 284 | 64 | 5 | 2 | {0}% reduced Ignite Duration on you |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1167 | 283 | 64 | 6 | 2 | {0}% reduced Poison Duration on you |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1161 | 282 | 50 | 7 | 3 | {0}% reduced Duration of Bleeding on You |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1171 | 284 | 50 | 8 | 3 | {0}% reduced Ignite Duration on you |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1166 | 283 | 50 | 9 | 3 | {0}% reduced Poison Duration on you |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1160 | 282 | 37 | 10 | 4 | {0}% reduced Duration of Bleeding on You |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1170 | 284 | 37 | 11 | 4 | {0}% reduced Ignite Duration on you |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1165 | 283 | 37 | 12 | 4 | {0}% reduced Poison Duration on you |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1159 | 282 | 21 | 13 | 5 | {0}% reduced Duration of Bleeding on You |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1169 | 284 | 21 | 14 | 5 | {0}% reduced Ignite Duration on you |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 1164 | 283 | 21 | 15 | 5 | {0}% reduced Poison Duration on you |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 193 | 293 | 79 | 2 | 1 | +{0} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 204 | 294 | 79 | 3 | 1 | +{0} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 181 | 292 | 75 | 4 | 2 | +{0} to Armour |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 212 | 295 | 75 | 5 | 1 | +{0} to Armour, +{1} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 220 | 296 | 75 | 6 | 1 | +{0} to Armour, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 192 | 293 | 75 | 7 | 2 | +{0} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 228 | 297 | 75 | 8 | 1 | +{0} to Evasion Rating, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 203 | 294 | 70 | 9 | 2 | +{0} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 180 | 292 | 65 | 10 | 3 | +{0} to Armour |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 211 | 295 | 65 | 11 | 2 | +{0} to Armour, +{1} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 219 | 296 | 65 | 12 | 2 | +{0} to Armour, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 191 | 293 | 65 | 13 | 3 | +{0} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 227 | 297 | 65 | 14 | 2 | +{0} to Evasion Rating, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 202 | 294 | 65 | 15 | 3 | +{0} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 179 | 292 | 60 | 16 | 4 | +{0} to Armour |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 210 | 295 | 60 | 17 | 3 | +{0} to Armour, +{1} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 218 | 296 | 60 | 18 | 3 | +{0} to Armour, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 190 | 293 | 60 | 19 | 4 | +{0} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 226 | 297 | 60 | 20 | 3 | +{0} to Evasion Rating, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 201 | 294 | 60 | 21 | 4 | +{0} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 178 | 292 | 54 | 22 | 5 | +{0} to Armour |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 209 | 295 | 54 | 23 | 4 | +{0} to Armour, +{1} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 217 | 296 | 54 | 24 | 4 | +{0} to Armour, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 189 | 293 | 54 | 25 | 5 | +{0} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 225 | 297 | 54 | 26 | 4 | +{0} to Evasion Rating, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 200 | 294 | 54 | 27 | 5 | +{0} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 177 | 292 | 46 | 28 | 6 | +{0} to Armour |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 208 | 295 | 46 | 29 | 5 | +{0} to Armour, +{1} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 216 | 296 | 46 | 30 | 5 | +{0} to Armour, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 188 | 293 | 46 | 31 | 6 | +{0} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 224 | 297 | 46 | 32 | 5 | +{0} to Evasion Rating, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 199 | 294 | 46 | 33 | 6 | +{0} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 176 | 292 | 33 | 34 | 7 | +{0} to Armour |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 207 | 295 | 33 | 35 | 6 | +{0} to Armour, +{1} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 215 | 296 | 33 | 36 | 6 | +{0} to Armour, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 187 | 293 | 33 | 37 | 7 | +{0} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 223 | 297 | 33 | 38 | 6 | +{0} to Evasion Rating, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 198 | 294 | 33 | 39 | 7 | +{0} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 175 | 292 | 25 | 40 | 8 | +{0} to Armour |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 186 | 293 | 25 | 41 | 8 | +{0} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 197 | 294 | 25 | 42 | 8 | +{0} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 174 | 292 | 16 | 43 | 9 | +{0} to Armour |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 206 | 295 | 16 | 44 | 7 | +{0} to Armour, +{1} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 214 | 296 | 16 | 45 | 7 | +{0} to Armour, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 185 | 293 | 16 | 46 | 9 | +{0} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 222 | 297 | 16 | 47 | 7 | +{0} to Evasion Rating, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 196 | 294 | 16 | 48 | 9 | +{0} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 173 | 292 | 8 | 49 | 10 | +{0} to Armour |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 184 | 293 | 8 | 50 | 10 | +{0} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 195 | 294 | 8 | 51 | 10 | +{0} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 172 | 292 | 1 | 52 | 11 | +{0} to Armour |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 205 | 295 | 1 | 53 | 8 | +{0} to Armour, +{1} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 213 | 296 | 1 | 54 | 8 | +{0} to Armour, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 183 | 293 | 1 | 55 | 11 | +{0} to Evasion Rating |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 221 | 297 | 1 | 56 | 8 | +{0} to Evasion Rating, +{1} to maximum Energy Shield |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 194 | 294 | 1 | 57 | 11 | +{0} to maximum Energy Shield |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1173 | 284 | 76 | 2 | 1 | {0}% reduced Ignite Duration on you |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1168 | 283 | 76 | 3 | 1 | {0}% reduced Poison Duration on you |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1162 | 282 | 64 | 4 | 2 | {0}% reduced Duration of Bleeding on You |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1172 | 284 | 64 | 5 | 2 | {0}% reduced Ignite Duration on you |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1167 | 283 | 64 | 6 | 2 | {0}% reduced Poison Duration on you |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1161 | 282 | 50 | 7 | 3 | {0}% reduced Duration of Bleeding on You |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1171 | 284 | 50 | 8 | 3 | {0}% reduced Ignite Duration on you |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1166 | 283 | 50 | 9 | 3 | {0}% reduced Poison Duration on you |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1160 | 282 | 37 | 10 | 4 | {0}% reduced Duration of Bleeding on You |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1170 | 284 | 37 | 11 | 4 | {0}% reduced Ignite Duration on you |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1165 | 283 | 37 | 12 | 4 | {0}% reduced Poison Duration on you |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1159 | 282 | 21 | 13 | 5 | {0}% reduced Duration of Bleeding on You |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1169 | 284 | 21 | 14 | 5 | {0}% reduced Ignite Duration on you |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1164 | 283 | 21 | 15 | 5 | {0}% reduced Poison Duration on you |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1173 | 284 | 76 | 2 | 1 | {0}% reduced Ignite Duration on you |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1168 | 283 | 76 | 3 | 1 | {0}% reduced Poison Duration on you |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1162 | 282 | 64 | 4 | 2 | {0}% reduced Duration of Bleeding on You |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1172 | 284 | 64 | 5 | 2 | {0}% reduced Ignite Duration on you |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1167 | 283 | 64 | 6 | 2 | {0}% reduced Poison Duration on you |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1161 | 282 | 50 | 7 | 3 | {0}% reduced Duration of Bleeding on You |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1171 | 284 | 50 | 8 | 3 | {0}% reduced Ignite Duration on you |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1166 | 283 | 50 | 9 | 3 | {0}% reduced Poison Duration on you |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1160 | 282 | 37 | 10 | 4 | {0}% reduced Duration of Bleeding on You |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1170 | 284 | 37 | 11 | 4 | {0}% reduced Ignite Duration on you |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1165 | 283 | 37 | 12 | 4 | {0}% reduced Poison Duration on you |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1159 | 282 | 21 | 13 | 5 | {0}% reduced Duration of Bleeding on You |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1169 | 284 | 21 | 14 | 5 | {0}% reduced Ignite Duration on you |
| body_armours_str_int | suffix | ReducedAilmentDuration | 1164 | 283 | 21 | 15 | 5 | {0}% reduced Poison Duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1188 | 326 | 75 | 2 | 1 | {0}% reduced Freeze Duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1178 | 324 | 75 | 3 | 1 | {0}% reduced Shock duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1182 | 325 | 63 | 4 | 2 | {0}% reduced Chill Duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1187 | 326 | 63 | 5 | 2 | {0}% reduced Freeze Duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1177 | 324 | 63 | 6 | 2 | {0}% reduced Shock duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1181 | 325 | 49 | 7 | 3 | {0}% reduced Chill Duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1186 | 326 | 49 | 8 | 3 | {0}% reduced Freeze Duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1176 | 324 | 49 | 9 | 3 | {0}% reduced Shock duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1180 | 325 | 36 | 10 | 4 | {0}% reduced Chill Duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1185 | 326 | 36 | 11 | 4 | {0}% reduced Freeze Duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1175 | 324 | 36 | 12 | 4 | {0}% reduced Shock duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1179 | 325 | 20 | 13 | 5 | {0}% reduced Chill Duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1184 | 326 | 20 | 14 | 5 | {0}% reduced Freeze Duration on you |
| boots_dex | suffix | ReducedAilmentDuration | 1174 | 324 | 20 | 15 | 5 | {0}% reduced Shock duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1188 | 326 | 75 | 2 | 1 | {0}% reduced Freeze Duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1178 | 324 | 75 | 3 | 1 | {0}% reduced Shock duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1182 | 325 | 63 | 4 | 2 | {0}% reduced Chill Duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1187 | 326 | 63 | 5 | 2 | {0}% reduced Freeze Duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1177 | 324 | 63 | 6 | 2 | {0}% reduced Shock duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1181 | 325 | 49 | 7 | 3 | {0}% reduced Chill Duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1186 | 326 | 49 | 8 | 3 | {0}% reduced Freeze Duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1176 | 324 | 49 | 9 | 3 | {0}% reduced Shock duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1180 | 325 | 36 | 10 | 4 | {0}% reduced Chill Duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1185 | 326 | 36 | 11 | 4 | {0}% reduced Freeze Duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1175 | 324 | 36 | 12 | 4 | {0}% reduced Shock duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1179 | 325 | 20 | 13 | 5 | {0}% reduced Chill Duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1184 | 326 | 20 | 14 | 5 | {0}% reduced Freeze Duration on you |
| boots_dex_int | suffix | ReducedAilmentDuration | 1174 | 324 | 20 | 15 | 5 | {0}% reduced Shock duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1188 | 326 | 75 | 2 | 1 | {0}% reduced Freeze Duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1178 | 324 | 75 | 3 | 1 | {0}% reduced Shock duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1182 | 325 | 63 | 4 | 2 | {0}% reduced Chill Duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1187 | 326 | 63 | 5 | 2 | {0}% reduced Freeze Duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1177 | 324 | 63 | 6 | 2 | {0}% reduced Shock duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1181 | 325 | 49 | 7 | 3 | {0}% reduced Chill Duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1186 | 326 | 49 | 8 | 3 | {0}% reduced Freeze Duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1176 | 324 | 49 | 9 | 3 | {0}% reduced Shock duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1180 | 325 | 36 | 10 | 4 | {0}% reduced Chill Duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1185 | 326 | 36 | 11 | 4 | {0}% reduced Freeze Duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1175 | 324 | 36 | 12 | 4 | {0}% reduced Shock duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1179 | 325 | 20 | 13 | 5 | {0}% reduced Chill Duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1184 | 326 | 20 | 14 | 5 | {0}% reduced Freeze Duration on you |
| boots_int | suffix | ReducedAilmentDuration | 1174 | 324 | 20 | 15 | 5 | {0}% reduced Shock duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1188 | 326 | 75 | 2 | 1 | {0}% reduced Freeze Duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1178 | 324 | 75 | 3 | 1 | {0}% reduced Shock duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1182 | 325 | 63 | 4 | 2 | {0}% reduced Chill Duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1187 | 326 | 63 | 5 | 2 | {0}% reduced Freeze Duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1177 | 324 | 63 | 6 | 2 | {0}% reduced Shock duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1181 | 325 | 49 | 7 | 3 | {0}% reduced Chill Duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1186 | 326 | 49 | 8 | 3 | {0}% reduced Freeze Duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1176 | 324 | 49 | 9 | 3 | {0}% reduced Shock duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1180 | 325 | 36 | 10 | 4 | {0}% reduced Chill Duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1185 | 326 | 36 | 11 | 4 | {0}% reduced Freeze Duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1175 | 324 | 36 | 12 | 4 | {0}% reduced Shock duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1179 | 325 | 20 | 13 | 5 | {0}% reduced Chill Duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1184 | 326 | 20 | 14 | 5 | {0}% reduced Freeze Duration on you |
| boots_str | suffix | ReducedAilmentDuration | 1174 | 324 | 20 | 15 | 5 | {0}% reduced Shock duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1188 | 326 | 75 | 2 | 1 | {0}% reduced Freeze Duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1178 | 324 | 75 | 3 | 1 | {0}% reduced Shock duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1182 | 325 | 63 | 4 | 2 | {0}% reduced Chill Duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1187 | 326 | 63 | 5 | 2 | {0}% reduced Freeze Duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1177 | 324 | 63 | 6 | 2 | {0}% reduced Shock duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1181 | 325 | 49 | 7 | 3 | {0}% reduced Chill Duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1186 | 326 | 49 | 8 | 3 | {0}% reduced Freeze Duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1176 | 324 | 49 | 9 | 3 | {0}% reduced Shock duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1180 | 325 | 36 | 10 | 4 | {0}% reduced Chill Duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1185 | 326 | 36 | 11 | 4 | {0}% reduced Freeze Duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1175 | 324 | 36 | 12 | 4 | {0}% reduced Shock duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1179 | 325 | 20 | 13 | 5 | {0}% reduced Chill Duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1184 | 326 | 20 | 14 | 5 | {0}% reduced Freeze Duration on you |
| boots_str_dex | suffix | ReducedAilmentDuration | 1174 | 324 | 20 | 15 | 5 | {0}% reduced Shock duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1188 | 326 | 75 | 2 | 1 | {0}% reduced Freeze Duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1178 | 324 | 75 | 3 | 1 | {0}% reduced Shock duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1182 | 325 | 63 | 4 | 2 | {0}% reduced Chill Duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1187 | 326 | 63 | 5 | 2 | {0}% reduced Freeze Duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1177 | 324 | 63 | 6 | 2 | {0}% reduced Shock duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1181 | 325 | 49 | 7 | 3 | {0}% reduced Chill Duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1186 | 326 | 49 | 8 | 3 | {0}% reduced Freeze Duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1176 | 324 | 49 | 9 | 3 | {0}% reduced Shock duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1180 | 325 | 36 | 10 | 4 | {0}% reduced Chill Duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1185 | 326 | 36 | 11 | 4 | {0}% reduced Freeze Duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1175 | 324 | 36 | 12 | 4 | {0}% reduced Shock duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1179 | 325 | 20 | 13 | 5 | {0}% reduced Chill Duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1184 | 326 | 20 | 14 | 5 | {0}% reduced Freeze Duration on you |
| boots_str_int | suffix | ReducedAilmentDuration | 1174 | 324 | 20 | 15 | 5 | {0}% reduced Shock duration on you |
| charms | prefix | FlaskRecoveryAmount | 1546 | 923 | 76 | 2 | 1 | Recover {0} Mana when Used |
| charms | prefix | FlaskRecoveryAmount | 1552 | 924 | 75 | 3 | 1 | Also grants {0} Guard |
| charms | prefix | FlaskRecoveryAmount | 1537 | 922 | 67 | 4 | 2 | Recover {0} Life when Used |
| charms | prefix | FlaskRecoveryAmount | 1545 | 923 | 67 | 5 | 2 | Recover {0} Mana when Used |
| charms | prefix | FlaskRecoveryAmount | 1551 | 924 | 60 | 6 | 2 | Also grants {0} Guard |
| charms | prefix | FlaskRecoveryAmount | 1536 | 922 | 58 | 7 | 3 | Recover {0} Life when Used |
| charms | prefix | FlaskRecoveryAmount | 1544 | 923 | 58 | 8 | 3 | Recover {0} Mana when Used |
| charms | prefix | FlaskRecoveryAmount | 1550 | 924 | 48 | 9 | 3 | Also grants {0} Guard |
| charms | prefix | FlaskRecoveryAmount | 1535 | 922 | 47 | 10 | 4 | Recover {0} Life when Used |
| charms | prefix | FlaskRecoveryAmount | 1543 | 923 | 47 | 11 | 4 | Recover {0} Mana when Used |
| charms | prefix | FlaskRecoveryAmount | 1549 | 924 | 36 | 12 | 4 | Also grants {0} Guard |
| charms | prefix | FlaskRecoveryAmount | 1534 | 922 | 36 | 13 | 5 | Recover {0} Life when Used |
| charms | prefix | FlaskRecoveryAmount | 1542 | 923 | 36 | 14 | 5 | Recover {0} Mana when Used |
| charms | prefix | FlaskRecoveryAmount | 1533 | 922 | 26 | 15 | 6 | Recover {0} Life when Used |
| charms | prefix | FlaskRecoveryAmount | 1541 | 923 | 26 | 16 | 6 | Recover {0} Mana when Used |
| charms | prefix | FlaskRecoveryAmount | 1548 | 924 | 21 | 17 | 5 | Also grants {0} Guard |
| charms | prefix | FlaskRecoveryAmount | 1532 | 922 | 14 | 18 | 7 | Recover {0} Life when Used |
| charms | prefix | FlaskRecoveryAmount | 1540 | 923 | 14 | 19 | 7 | Recover {0} Mana when Used |
| charms | prefix | FlaskRecoveryAmount | 1547 | 924 | 10 | 20 | 6 | Also grants {0} Guard |
| charms | prefix | FlaskRecoveryAmount | 1531 | 922 | 1 | 21 | 8 | Recover {0} Life when Used |
| charms | prefix | FlaskRecoveryAmount | 1539 | 923 | 1 | 22 | 8 | Recover {0} Mana when Used |
| charms | suffix | FlaskRechargeRate | 1473 | 910 | 45 | 4 | 1 | {0}% Chance to gain a Charge when you kill an enemy |
| charms | suffix | FlaskRechargeRate | 1455 | 907 | 33 | 5 | 4 | {0}% increased Charges gained |
| charms | suffix | FlaskRechargeRate | 1472 | 910 | 26 | 6 | 2 | {0}% Chance to gain a Charge when you kill an enemy |
| charms | suffix | FlaskRechargeRate | 1454 | 907 | 13 | 7 | 5 | {0}% increased Charges gained |
| charms | suffix | FlaskRechargeRate | 1471 | 910 | 8 | 8 | 3 | {0}% Chance to gain a Charge when you kill an enemy |
| charms | suffix | FlaskRechargeRate | 1453 | 907 | 1 | 9 | 6 | {0}% increased Charges gained |
| emerald | prefix | SpecificWeaponDamage | 1885 | 538 | 1 | 2 | 1 | {0}% increased Damage with Quarterstaves |
| emerald | suffix | FlaskChargeGenerationPercent | 1851 | 524 | 1 | 2 | 1 | {0}% increased Mana Flask Charges gained |
| emerald | suffix | SpecificWeaponSpeed | 1887 | 540 | 1 | 2 | 1 | {0}% increased Attack Speed with Quarterstaves |
| foci | prefix | WeaponDamageTypePrefix | 685 | 763 | 60 | 2 | 1 | {0}% increased Cold Damage |
| foci | prefix | WeaponDamageTypePrefix | 669 | 762 | 60 | 3 | 1 | {0}% increased Fire Damage |
| foci | prefix | WeaponDamageTypePrefix | 701 | 764 | 60 | 4 | 1 | {0}% increased Lightning Damage |
| foci | prefix | WeaponDamageTypePrefix | 733 | 760 | 60 | 5 | 1 | {0}% increased Spell Physical Damage |
| foci | prefix | WeaponDamageTypePrefix | 716 | 715 | 46 | 6 | 2 | {0}% increased Chaos Damage |
| foci | prefix | WeaponDamageTypePrefix | 684 | 763 | 46 | 7 | 2 | {0}% increased Cold Damage |
| foci | prefix | WeaponDamageTypePrefix | 668 | 762 | 46 | 8 | 2 | {0}% increased Fire Damage |
| foci | prefix | WeaponDamageTypePrefix | 700 | 764 | 46 | 9 | 2 | {0}% increased Lightning Damage |
| foci | prefix | WeaponDamageTypePrefix | 732 | 760 | 46 | 10 | 2 | {0}% increased Spell Physical Damage |
| foci | prefix | WeaponDamageTypePrefix | 715 | 715 | 33 | 11 | 3 | {0}% increased Chaos Damage |
| foci | prefix | WeaponDamageTypePrefix | 683 | 763 | 33 | 12 | 3 | {0}% increased Cold Damage |
| foci | prefix | WeaponDamageTypePrefix | 667 | 762 | 33 | 13 | 3 | {0}% increased Fire Damage |
| foci | prefix | WeaponDamageTypePrefix | 699 | 764 | 33 | 14 | 3 | {0}% increased Lightning Damage |
| foci | prefix | WeaponDamageTypePrefix | 731 | 760 | 33 | 15 | 3 | {0}% increased Spell Physical Damage |
| foci | prefix | WeaponDamageTypePrefix | 714 | 715 | 16 | 16 | 4 | {0}% increased Chaos Damage |
| foci | prefix | WeaponDamageTypePrefix | 682 | 763 | 16 | 17 | 4 | {0}% increased Cold Damage |
| foci | prefix | WeaponDamageTypePrefix | 666 | 762 | 16 | 18 | 4 | {0}% increased Fire Damage |
| foci | prefix | WeaponDamageTypePrefix | 698 | 764 | 16 | 19 | 4 | {0}% increased Lightning Damage |
| foci | prefix | WeaponDamageTypePrefix | 730 | 760 | 16 | 20 | 4 | {0}% increased Spell Physical Damage |
| foci | prefix | WeaponDamageTypePrefix | 713 | 715 | 8 | 21 | 5 | {0}% increased Chaos Damage |
| foci | prefix | WeaponDamageTypePrefix | 681 | 763 | 8 | 22 | 5 | {0}% increased Cold Damage |
| foci | prefix | WeaponDamageTypePrefix | 665 | 762 | 8 | 23 | 5 | {0}% increased Fire Damage |
| foci | prefix | WeaponDamageTypePrefix | 697 | 764 | 8 | 24 | 5 | {0}% increased Lightning Damage |
| foci | prefix | WeaponDamageTypePrefix | 729 | 760 | 8 | 25 | 5 | {0}% increased Spell Physical Damage |
| foci | prefix | WeaponDamageTypePrefix | 712 | 715 | 2 | 26 | 6 | {0}% increased Chaos Damage |
| foci | prefix | WeaponDamageTypePrefix | 680 | 763 | 2 | 27 | 6 | {0}% increased Cold Damage |
| foci | prefix | WeaponDamageTypePrefix | 664 | 762 | 2 | 28 | 6 | {0}% increased Fire Damage |
| foci | prefix | WeaponDamageTypePrefix | 696 | 764 | 2 | 29 | 6 | {0}% increased Lightning Damage |
| foci | prefix | WeaponDamageTypePrefix | 728 | 760 | 2 | 30 | 6 | {0}% increased Spell Physical Damage |
| life_flasks | prefix | FlaskRecoveryAmount | 1501 | 914 | 82 | 2 | 1 | {0}% more Recovery if used while on Low Life |
| life_flasks | prefix | FlaskRecoveryAmount | 1511 | 915 | 81 | 3 | 1 | {0}% increased Life Recovered, Removes {1}% of Life Recovered from Mana when used |
| life_flasks | prefix | FlaskRecoveryAmount | 1492 | 913 | 67 | 4 | 2 | {0}% increased Amount Recovered |
| life_flasks | prefix | FlaskRecoveryAmount | 1510 | 915 | 64 | 5 | 2 | {0}% increased Life Recovered, Removes {1}% of Life Recovered from Mana when used |
| life_flasks | prefix | FlaskRecoveryAmount | 1500 | 914 | 63 | 6 | 2 | {0}% more Recovery if used while on Low Life |
| life_flasks | prefix | FlaskRecoveryAmount | 1491 | 913 | 56 | 7 | 3 | {0}% increased Amount Recovered |
| life_flasks | prefix | FlaskRecoveryAmount | 1509 | 915 | 47 | 8 | 3 | {0}% increased Life Recovered, Removes {1}% of Life Recovered from Mana when used |
| life_flasks | prefix | FlaskRecoveryAmount | 1490 | 913 | 46 | 9 | 4 | {0}% increased Amount Recovered |
| life_flasks | prefix | FlaskRecoveryAmount | 1499 | 914 | 44 | 10 | 3 | {0}% more Recovery if used while on Low Life |
| life_flasks | prefix | FlaskRecoveryAmount | 1489 | 913 | 34 | 11 | 5 | {0}% increased Amount Recovered |
| life_flasks | prefix | FlaskRecoveryAmount | 1508 | 915 | 30 | 12 | 4 | {0}% increased Life Recovered, Removes {1}% of Life Recovered from Mana when used |
| life_flasks | prefix | FlaskRecoveryAmount | 1498 | 914 | 25 | 13 | 4 | {0}% more Recovery if used while on Low Life |
| life_flasks | prefix | FlaskRecoveryAmount | 1488 | 913 | 23 | 14 | 6 | {0}% increased Amount Recovered |
| life_flasks | prefix | FlaskRecoveryAmount | 1507 | 915 | 13 | 15 | 5 | {0}% increased Life Recovered, Removes {1}% of Life Recovered from Mana when used |
| life_flasks | prefix | FlaskRecoveryAmount | 1487 | 913 | 11 | 16 | 7 | {0}% increased Amount Recovered |
| life_flasks | prefix | FlaskRecoveryAmount | 1497 | 914 | 2 | 17 | 5 | {0}% more Recovery if used while on Low Life |
| life_flasks | prefix | FlaskRecoveryAmount | 1486 | 913 | 1 | 18 | 8 | {0}% increased Amount Recovered |
| life_flasks | prefix | FlaskRecoverySpeed | 1519 | 916 | 46 | 4 | 1 | {0}% of Recovery applied Instantly |
| life_flasks | prefix | FlaskRecoverySpeed | 1479 | 912 | 31 | 5 | 4 | {0}% increased Recovery rate |
| life_flasks | prefix | FlaskRecoverySpeed | 1518 | 916 | 27 | 6 | 2 | {0}% of Recovery applied Instantly |
| life_flasks | prefix | FlaskRecoverySpeed | 1478 | 912 | 15 | 7 | 5 | {0}% increased Recovery rate |
| life_flasks | prefix | FlaskRecoverySpeed | 1517 | 916 | 3 | 8 | 3 | {0}% of Recovery applied Instantly |
| life_flasks | prefix | FlaskRecoverySpeed | 1477 | 912 | 1 | 9 | 6 | {0}% increased Recovery rate |
| life_flasks | suffix | FlaskRechargeRate | 1473 | 910 | 45 | 4 | 1 | {0}% Chance to gain a Charge when you kill an enemy |
| life_flasks | suffix | FlaskRechargeRate | 1455 | 907 | 33 | 5 | 4 | {0}% increased Charges gained |
| life_flasks | suffix | FlaskRechargeRate | 1472 | 910 | 26 | 6 | 2 | {0}% Chance to gain a Charge when you kill an enemy |
| life_flasks | suffix | FlaskRechargeRate | 1454 | 907 | 13 | 7 | 5 | {0}% increased Charges gained |
| life_flasks | suffix | FlaskRechargeRate | 1471 | 910 | 8 | 8 | 3 | {0}% Chance to gain a Charge when you kill an enemy |
| life_flasks | suffix | FlaskRechargeRate | 1453 | 907 | 1 | 9 | 6 | {0}% increased Charges gained |
| mana_flasks | prefix | FlaskRecoveryAmount | 1506 | 919 | 82 | 2 | 1 | {0}% more Recovery if used while on Low Mana |
| mana_flasks | prefix | FlaskRecoveryAmount | 1516 | 920 | 81 | 3 | 1 | {0}% increased Mana Recovered, Removes {1}% of Mana Recovered from Life when used |
| mana_flasks | prefix | FlaskRecoveryAmount | 1492 | 913 | 67 | 4 | 2 | {0}% increased Amount Recovered |
| mana_flasks | prefix | FlaskRecoveryAmount | 1515 | 920 | 64 | 5 | 2 | {0}% increased Mana Recovered, Removes {1}% of Mana Recovered from Life when used |
| mana_flasks | prefix | FlaskRecoveryAmount | 1505 | 919 | 63 | 6 | 2 | {0}% more Recovery if used while on Low Mana |
| mana_flasks | prefix | FlaskRecoveryAmount | 1491 | 913 | 56 | 7 | 3 | {0}% increased Amount Recovered |
| mana_flasks | prefix | FlaskRecoveryAmount | 1514 | 920 | 47 | 8 | 3 | {0}% increased Mana Recovered, Removes {1}% of Mana Recovered from Life when used |
| mana_flasks | prefix | FlaskRecoveryAmount | 1490 | 913 | 46 | 9 | 4 | {0}% increased Amount Recovered |
| mana_flasks | prefix | FlaskRecoveryAmount | 1504 | 919 | 44 | 10 | 3 | {0}% more Recovery if used while on Low Mana |
| mana_flasks | prefix | FlaskRecoveryAmount | 1489 | 913 | 34 | 11 | 5 | {0}% increased Amount Recovered |
| mana_flasks | prefix | FlaskRecoveryAmount | 1513 | 920 | 30 | 12 | 4 | {0}% increased Mana Recovered, Removes {1}% of Mana Recovered from Life when used |
| mana_flasks | prefix | FlaskRecoveryAmount | 1503 | 919 | 25 | 13 | 4 | {0}% more Recovery if used while on Low Mana |
| mana_flasks | prefix | FlaskRecoveryAmount | 1488 | 913 | 23 | 14 | 6 | {0}% increased Amount Recovered |
| mana_flasks | prefix | FlaskRecoveryAmount | 1512 | 920 | 13 | 15 | 5 | {0}% increased Mana Recovered, Removes {1}% of Mana Recovered from Life when used |
| mana_flasks | prefix | FlaskRecoveryAmount | 1487 | 913 | 11 | 16 | 7 | {0}% increased Amount Recovered |
| mana_flasks | prefix | FlaskRecoveryAmount | 1502 | 919 | 2 | 17 | 5 | {0}% more Recovery if used while on Low Mana |
| mana_flasks | prefix | FlaskRecoveryAmount | 1486 | 913 | 1 | 18 | 8 | {0}% increased Amount Recovered |
| mana_flasks | prefix | FlaskRecoverySpeed | 1519 | 916 | 46 | 4 | 1 | {0}% of Recovery applied Instantly |
| mana_flasks | prefix | FlaskRecoverySpeed | 1479 | 912 | 31 | 5 | 4 | {0}% increased Recovery rate |
| mana_flasks | prefix | FlaskRecoverySpeed | 1518 | 916 | 27 | 6 | 2 | {0}% of Recovery applied Instantly |
| mana_flasks | prefix | FlaskRecoverySpeed | 1478 | 912 | 15 | 7 | 5 | {0}% increased Recovery rate |
| mana_flasks | prefix | FlaskRecoverySpeed | 1517 | 916 | 3 | 8 | 3 | {0}% of Recovery applied Instantly |
| mana_flasks | prefix | FlaskRecoverySpeed | 1477 | 912 | 1 | 9 | 6 | {0}% increased Recovery rate |
| mana_flasks | suffix | FlaskRechargeRate | 1473 | 910 | 45 | 4 | 1 | {0}% Chance to gain a Charge when you kill an enemy |
| mana_flasks | suffix | FlaskRechargeRate | 1455 | 907 | 33 | 5 | 4 | {0}% increased Charges gained |
| mana_flasks | suffix | FlaskRechargeRate | 1472 | 910 | 26 | 6 | 2 | {0}% Chance to gain a Charge when you kill an enemy |
| mana_flasks | suffix | FlaskRechargeRate | 1454 | 907 | 13 | 7 | 5 | {0}% increased Charges gained |
| mana_flasks | suffix | FlaskRechargeRate | 1471 | 910 | 8 | 8 | 3 | {0}% Chance to gain a Charge when you kill an enemy |
| mana_flasks | suffix | FlaskRechargeRate | 1453 | 907 | 1 | 9 | 6 | {0}% increased Charges gained |
| ruby | prefix | DamageForm | 14984 | 486 | 1 | 2 | 1 | {0}% increased Damage with Plant Skills |
| sapphire | prefix | DamageForm | 14984 | 486 | 1 | 2 | 1 | {0}% increased Damage with Plant Skills |
| spears | suffix | IncreaseSocketedGemLevel | 872 | 695 | 81 | 2 | 1 | +{0} to Level of all Projectile Skills |
| spears | suffix | IncreaseSocketedGemLevel | 858 | 59 | 55 | 3 | 2 | +{0} to Level of all Melee Skills |
| spears | suffix | IncreaseSocketedGemLevel | 871 | 695 | 55 | 4 | 2 | +{0} to Level of all Projectile Skills |
| spears | suffix | IncreaseSocketedGemLevel | 857 | 59 | 36 | 5 | 3 | +{0} to Level of all Melee Skills |
| spears | suffix | IncreaseSocketedGemLevel | 870 | 695 | 36 | 6 | 3 | +{0} to Level of all Projectile Skills |
| spears | suffix | IncreaseSocketedGemLevel | 856 | 59 | 18 | 7 | 4 | +{0} to Level of all Melee Skills |
| spears | suffix | IncreaseSocketedGemLevel | 869 | 695 | 18 | 8 | 4 | +{0} to Level of all Projectile Skills |
| staves | prefix | WeaponDamageTypePrefix | 695 | 763 | 81 | 2 | 1 | {0}% increased Cold Damage |
| staves | prefix | WeaponDamageTypePrefix | 679 | 762 | 81 | 3 | 1 | {0}% increased Fire Damage |
| staves | prefix | WeaponDamageTypePrefix | 711 | 764 | 81 | 4 | 1 | {0}% increased Lightning Damage |
| staves | prefix | WeaponDamageTypePrefix | 743 | 760 | 81 | 5 | 1 | {0}% increased Spell Physical Damage |
| staves | prefix | WeaponDamageTypePrefix | 726 | 715 | 70 | 6 | 2 | {0}% increased Chaos Damage |
| staves | prefix | WeaponDamageTypePrefix | 694 | 763 | 70 | 7 | 2 | {0}% increased Cold Damage |
| staves | prefix | WeaponDamageTypePrefix | 678 | 762 | 70 | 8 | 2 | {0}% increased Fire Damage |
| staves | prefix | WeaponDamageTypePrefix | 710 | 764 | 70 | 9 | 2 | {0}% increased Lightning Damage |
| staves | prefix | WeaponDamageTypePrefix | 742 | 760 | 70 | 10 | 2 | {0}% increased Spell Physical Damage |
| staves | prefix | WeaponDamageTypePrefix | 725 | 715 | 60 | 11 | 3 | {0}% increased Chaos Damage |
| staves | prefix | WeaponDamageTypePrefix | 693 | 763 | 60 | 12 | 3 | {0}% increased Cold Damage |
| staves | prefix | WeaponDamageTypePrefix | 677 | 762 | 60 | 13 | 3 | {0}% increased Fire Damage |
| staves | prefix | WeaponDamageTypePrefix | 709 | 764 | 60 | 14 | 3 | {0}% increased Lightning Damage |
| staves | prefix | WeaponDamageTypePrefix | 741 | 760 | 60 | 15 | 3 | {0}% increased Spell Physical Damage |
| staves | prefix | WeaponDamageTypePrefix | 724 | 715 | 46 | 16 | 4 | {0}% increased Chaos Damage |
| staves | prefix | WeaponDamageTypePrefix | 692 | 763 | 46 | 17 | 4 | {0}% increased Cold Damage |
| staves | prefix | WeaponDamageTypePrefix | 676 | 762 | 46 | 18 | 4 | {0}% increased Fire Damage |
| staves | prefix | WeaponDamageTypePrefix | 708 | 764 | 46 | 19 | 4 | {0}% increased Lightning Damage |
| staves | prefix | WeaponDamageTypePrefix | 740 | 760 | 46 | 20 | 4 | {0}% increased Spell Physical Damage |
| staves | prefix | WeaponDamageTypePrefix | 723 | 715 | 33 | 21 | 5 | {0}% increased Chaos Damage |
| staves | prefix | WeaponDamageTypePrefix | 691 | 763 | 33 | 22 | 5 | {0}% increased Cold Damage |
| staves | prefix | WeaponDamageTypePrefix | 675 | 762 | 33 | 23 | 5 | {0}% increased Fire Damage |
| staves | prefix | WeaponDamageTypePrefix | 707 | 764 | 33 | 24 | 5 | {0}% increased Lightning Damage |
| staves | prefix | WeaponDamageTypePrefix | 739 | 760 | 33 | 25 | 5 | {0}% increased Spell Physical Damage |
| staves | prefix | WeaponDamageTypePrefix | 722 | 715 | 16 | 26 | 6 | {0}% increased Chaos Damage |
| staves | prefix | WeaponDamageTypePrefix | 690 | 763 | 16 | 27 | 6 | {0}% increased Cold Damage |
| staves | prefix | WeaponDamageTypePrefix | 674 | 762 | 16 | 28 | 6 | {0}% increased Fire Damage |
| staves | prefix | WeaponDamageTypePrefix | 706 | 764 | 16 | 29 | 6 | {0}% increased Lightning Damage |
| staves | prefix | WeaponDamageTypePrefix | 738 | 760 | 16 | 30 | 6 | {0}% increased Spell Physical Damage |
| staves | prefix | WeaponDamageTypePrefix | 721 | 715 | 8 | 31 | 7 | {0}% increased Chaos Damage |
| staves | prefix | WeaponDamageTypePrefix | 689 | 763 | 8 | 32 | 7 | {0}% increased Cold Damage |
| staves | prefix | WeaponDamageTypePrefix | 673 | 762 | 8 | 33 | 7 | {0}% increased Fire Damage |
| staves | prefix | WeaponDamageTypePrefix | 705 | 764 | 8 | 34 | 7 | {0}% increased Lightning Damage |
| staves | prefix | WeaponDamageTypePrefix | 737 | 760 | 8 | 35 | 7 | {0}% increased Spell Physical Damage |
| staves | prefix | WeaponDamageTypePrefix | 720 | 715 | 2 | 36 | 8 | {0}% increased Chaos Damage |
| staves | prefix | WeaponDamageTypePrefix | 688 | 763 | 2 | 37 | 8 | {0}% increased Cold Damage |
| staves | prefix | WeaponDamageTypePrefix | 672 | 762 | 2 | 38 | 8 | {0}% increased Fire Damage |
| staves | prefix | WeaponDamageTypePrefix | 704 | 764 | 2 | 39 | 8 | {0}% increased Lightning Damage |
| staves | prefix | WeaponDamageTypePrefix | 736 | 760 | 2 | 40 | 8 | {0}% increased Spell Physical Damage |
| staves | suffix | IncreaseSocketedGemLevel | 795 | 766 | 81 | 2 | 1 | +{0} to Level of all Cold Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 782 | 765 | 81 | 3 | 1 | +{0} to Level of all Fire Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 809 | 767 | 81 | 4 | 1 | +{0} to Level of all Lightning Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 835 | 761 | 81 | 5 | 1 | +{0} to Level of all Physical Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 769 | 716 | 78 | 6 | 1 | +{0} to Level of all Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 821 | 717 | 55 | 7 | 2 | +{0} to Level of all Chaos Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 794 | 766 | 55 | 8 | 2 | +{0} to Level of all Cold Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 781 | 765 | 55 | 9 | 2 | +{0} to Level of all Fire Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 808 | 767 | 55 | 10 | 2 | +{0} to Level of all Lightning Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 834 | 761 | 55 | 11 | 2 | +{0} to Level of all Physical Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 768 | 716 | 55 | 12 | 2 | +{0} to Level of all Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 820 | 717 | 36 | 13 | 3 | +{0} to Level of all Chaos Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 793 | 766 | 36 | 14 | 3 | +{0} to Level of all Cold Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 780 | 765 | 36 | 15 | 3 | +{0} to Level of all Fire Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 807 | 767 | 36 | 16 | 3 | +{0} to Level of all Lightning Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 833 | 761 | 36 | 17 | 3 | +{0} to Level of all Physical Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 767 | 716 | 25 | 18 | 3 | +{0} to Level of all Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 819 | 717 | 18 | 19 | 4 | +{0} to Level of all Chaos Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 792 | 766 | 18 | 20 | 4 | +{0} to Level of all Cold Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 779 | 765 | 18 | 21 | 4 | +{0} to Level of all Fire Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 806 | 767 | 18 | 22 | 4 | +{0} to Level of all Lightning Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 832 | 761 | 18 | 23 | 4 | +{0} to Level of all Physical Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 766 | 716 | 5 | 24 | 4 | +{0} to Level of all Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 818 | 717 | 2 | 25 | 5 | +{0} to Level of all Chaos Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 791 | 766 | 2 | 26 | 5 | +{0} to Level of all Cold Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 778 | 765 | 2 | 27 | 5 | +{0} to Level of all Fire Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 805 | 767 | 2 | 28 | 5 | +{0} to Level of all Lightning Spell Skills |
| staves | suffix | IncreaseSocketedGemLevel | 831 | 761 | 2 | 29 | 5 | +{0} to Level of all Physical Spell Skills |
| wands | prefix | WeaponDamageTypePrefix | 687 | 763 | 81 | 2 | 1 | {0}% increased Cold Damage |
| wands | prefix | WeaponDamageTypePrefix | 671 | 762 | 81 | 3 | 1 | {0}% increased Fire Damage |
| wands | prefix | WeaponDamageTypePrefix | 703 | 764 | 81 | 4 | 1 | {0}% increased Lightning Damage |
| wands | prefix | WeaponDamageTypePrefix | 735 | 760 | 81 | 5 | 1 | {0}% increased Spell Physical Damage |
| wands | prefix | WeaponDamageTypePrefix | 718 | 715 | 70 | 6 | 2 | {0}% increased Chaos Damage |
| wands | prefix | WeaponDamageTypePrefix | 686 | 763 | 70 | 7 | 2 | {0}% increased Cold Damage |
| wands | prefix | WeaponDamageTypePrefix | 670 | 762 | 70 | 8 | 2 | {0}% increased Fire Damage |
| wands | prefix | WeaponDamageTypePrefix | 702 | 764 | 70 | 9 | 2 | {0}% increased Lightning Damage |
| wands | prefix | WeaponDamageTypePrefix | 734 | 760 | 70 | 10 | 2 | {0}% increased Spell Physical Damage |
| wands | prefix | WeaponDamageTypePrefix | 717 | 715 | 60 | 11 | 3 | {0}% increased Chaos Damage |
| wands | prefix | WeaponDamageTypePrefix | 685 | 763 | 60 | 12 | 3 | {0}% increased Cold Damage |
| wands | prefix | WeaponDamageTypePrefix | 669 | 762 | 60 | 13 | 3 | {0}% increased Fire Damage |
| wands | prefix | WeaponDamageTypePrefix | 701 | 764 | 60 | 14 | 3 | {0}% increased Lightning Damage |
| wands | prefix | WeaponDamageTypePrefix | 733 | 760 | 60 | 15 | 3 | {0}% increased Spell Physical Damage |
| wands | prefix | WeaponDamageTypePrefix | 716 | 715 | 46 | 16 | 4 | {0}% increased Chaos Damage |
| wands | prefix | WeaponDamageTypePrefix | 684 | 763 | 46 | 17 | 4 | {0}% increased Cold Damage |
| wands | prefix | WeaponDamageTypePrefix | 668 | 762 | 46 | 18 | 4 | {0}% increased Fire Damage |
| wands | prefix | WeaponDamageTypePrefix | 700 | 764 | 46 | 19 | 4 | {0}% increased Lightning Damage |
| wands | prefix | WeaponDamageTypePrefix | 732 | 760 | 46 | 20 | 4 | {0}% increased Spell Physical Damage |
| wands | prefix | WeaponDamageTypePrefix | 715 | 715 | 33 | 21 | 5 | {0}% increased Chaos Damage |
| wands | prefix | WeaponDamageTypePrefix | 683 | 763 | 33 | 22 | 5 | {0}% increased Cold Damage |
| wands | prefix | WeaponDamageTypePrefix | 667 | 762 | 33 | 23 | 5 | {0}% increased Fire Damage |
| wands | prefix | WeaponDamageTypePrefix | 699 | 764 | 33 | 24 | 5 | {0}% increased Lightning Damage |
| wands | prefix | WeaponDamageTypePrefix | 731 | 760 | 33 | 25 | 5 | {0}% increased Spell Physical Damage |
| wands | prefix | WeaponDamageTypePrefix | 714 | 715 | 16 | 26 | 6 | {0}% increased Chaos Damage |
| wands | prefix | WeaponDamageTypePrefix | 682 | 763 | 16 | 27 | 6 | {0}% increased Cold Damage |
| wands | prefix | WeaponDamageTypePrefix | 666 | 762 | 16 | 28 | 6 | {0}% increased Fire Damage |
| wands | prefix | WeaponDamageTypePrefix | 698 | 764 | 16 | 29 | 6 | {0}% increased Lightning Damage |
| wands | prefix | WeaponDamageTypePrefix | 730 | 760 | 16 | 30 | 6 | {0}% increased Spell Physical Damage |
| wands | prefix | WeaponDamageTypePrefix | 713 | 715 | 8 | 31 | 7 | {0}% increased Chaos Damage |
| wands | prefix | WeaponDamageTypePrefix | 681 | 763 | 8 | 32 | 7 | {0}% increased Cold Damage |
| wands | prefix | WeaponDamageTypePrefix | 665 | 762 | 8 | 33 | 7 | {0}% increased Fire Damage |
| wands | prefix | WeaponDamageTypePrefix | 697 | 764 | 8 | 34 | 7 | {0}% increased Lightning Damage |
| wands | prefix | WeaponDamageTypePrefix | 729 | 760 | 8 | 35 | 7 | {0}% increased Spell Physical Damage |
| wands | prefix | WeaponDamageTypePrefix | 712 | 715 | 2 | 36 | 8 | {0}% increased Chaos Damage |
| wands | prefix | WeaponDamageTypePrefix | 680 | 763 | 2 | 37 | 8 | {0}% increased Cold Damage |
| wands | prefix | WeaponDamageTypePrefix | 664 | 762 | 2 | 38 | 8 | {0}% increased Fire Damage |
| wands | prefix | WeaponDamageTypePrefix | 696 | 764 | 2 | 39 | 8 | {0}% increased Lightning Damage |
| wands | prefix | WeaponDamageTypePrefix | 728 | 760 | 2 | 40 | 8 | {0}% increased Spell Physical Damage |
| wands | suffix | IncreaseSocketedGemLevel | 790 | 766 | 81 | 2 | 1 | +{0} to Level of all Cold Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 777 | 765 | 81 | 3 | 1 | +{0} to Level of all Fire Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 804 | 767 | 81 | 4 | 1 | +{0} to Level of all Lightning Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 830 | 761 | 81 | 5 | 1 | +{0} to Level of all Physical Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 765 | 716 | 78 | 6 | 1 | +{0} to Level of all Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 816 | 717 | 55 | 7 | 2 | +{0} to Level of all Chaos Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 789 | 766 | 55 | 8 | 2 | +{0} to Level of all Cold Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 776 | 765 | 55 | 9 | 2 | +{0} to Level of all Fire Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 803 | 767 | 55 | 10 | 2 | +{0} to Level of all Lightning Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 829 | 761 | 55 | 11 | 2 | +{0} to Level of all Physical Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 764 | 716 | 55 | 12 | 2 | +{0} to Level of all Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 815 | 717 | 36 | 13 | 3 | +{0} to Level of all Chaos Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 788 | 766 | 36 | 14 | 3 | +{0} to Level of all Cold Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 775 | 765 | 36 | 15 | 3 | +{0} to Level of all Fire Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 802 | 767 | 36 | 16 | 3 | +{0} to Level of all Lightning Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 828 | 761 | 36 | 17 | 3 | +{0} to Level of all Physical Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 763 | 716 | 25 | 18 | 3 | +{0} to Level of all Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 814 | 717 | 18 | 19 | 4 | +{0} to Level of all Chaos Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 787 | 766 | 18 | 20 | 4 | +{0} to Level of all Cold Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 774 | 765 | 18 | 21 | 4 | +{0} to Level of all Fire Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 801 | 767 | 18 | 22 | 4 | +{0} to Level of all Lightning Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 827 | 761 | 18 | 23 | 4 | +{0} to Level of all Physical Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 762 | 716 | 5 | 24 | 4 | +{0} to Level of all Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 813 | 717 | 2 | 25 | 5 | +{0} to Level of all Chaos Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 786 | 766 | 2 | 26 | 5 | +{0} to Level of all Cold Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 773 | 765 | 2 | 27 | 5 | +{0} to Level of all Fire Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 800 | 767 | 2 | 28 | 5 | +{0} to Level of all Lightning Spell Skills |
| wands | suffix | IncreaseSocketedGemLevel | 826 | 761 | 2 | 29 | 5 | +{0} to Level of all Physical Spell Skills |

## All rows missing from the former overlay

Count: **1453**

| Pool | Affix | Legacy group | Required | Legacy tier | Correct stable ID | Correct source key |
|---|---|---|---:|---:|---:|---|
| amulets | prefix | IncreasedAccuracy | 58 | 2 | 1003 | IncreasedAccuracy7 |
| amulets | prefix | IncreasedLife | 54 | 2 | 85 | IncreasedLife8 |
| amulets | prefix | IncreasedLife | 46 | 3 | 84 | IncreasedLife7 |
| amulets | prefix | IncreasedLife | 38 | 4 | 83 | IncreasedLife6 |
| amulets | prefix | IncreasedLife | 16 | 7 | 80 | IncreasedLife3 |
| amulets | prefix | IncreasedLife | 6 | 8 | 79 | IncreasedLife2 |
| amulets | prefix | IncreasedMana | 54 | 6 | 101 | IncreasedMana8 |
| amulets | prefix | IncreasedMana | 46 | 7 | 100 | IncreasedMana7 |
| amulets | prefix | IncreasedMana | 38 | 8 | 99 | IncreasedMana6 |
| amulets | prefix | IncreasedMana | 16 | 11 | 96 | IncreasedMana3 |
| amulets | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| amulets | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| amulets | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| amulets | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| amulets | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| amulets | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| amulets | suffix | CriticalStrikeMultiplier | 45 | 3 | 1070 | CriticalMultiplier4 |
| amulets | suffix | DamageTakenGainedAsLife | 68 | 2 | 1330 | DamageTakenGainedAsLife4_ |
| amulets | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| amulets | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| amulets | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| amulets | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| amulets | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| amulets | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| amulets | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| amulets | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| amulets | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| amulets | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| amulets | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| amulets | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| amulets | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| amulets | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| amulets | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| amulets | suffix | ManaRegeneration | 55 | 2 | 904 | ManaRegeneration5 |
| amulets | suffix | Strength | 55 | 3 | 5 | Strength6 |
| amulets | suffix | Strength | 33 | 5 | 3 | Strength4 |
| amulets | suffix | Strength | 11 | 7 | 1 | Strength2 |
| belts | prefix | IncreasedLife | 54 | 3 | 85 | IncreasedLife8 |
| belts | prefix | IncreasedLife | 46 | 4 | 84 | IncreasedLife7 |
| belts | prefix | IncreasedLife | 38 | 5 | 83 | IncreasedLife6 |
| belts | prefix | IncreasedLife | 16 | 8 | 80 | IncreasedLife3 |
| belts | prefix | IncreasedLife | 6 | 9 | 79 | IncreasedLife2 |
| belts | prefix | IncreasedMana | 54 | 2 | 101 | IncreasedMana8 |
| belts | prefix | IncreasedMana | 46 | 3 | 100 | IncreasedMana7 |
| belts | prefix | IncreasedMana | 38 | 4 | 99 | IncreasedMana6 |
| belts | prefix | IncreasedMana | 16 | 7 | 96 | IncreasedMana3 |
| belts | prefix | Thorns | 63 | 2 | 456 | AttackerTakesDamage6 |
| belts | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| belts | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| belts | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| belts | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| belts | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| belts | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| belts | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| belts | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| belts | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| belts | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| belts | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| belts | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| belts | suffix | Strength | 55 | 4 | 5 | Strength6 |
| belts | suffix | Strength | 33 | 6 | 3 | Strength4 |
| belts | suffix | Strength | 11 | 8 | 1 | Strength2 |
| belts | suffix | StunThreshold | 72 | 1 | 443 | StunThreshold10 |
| body_armours_dex | prefix | DefencesPercent | 54 | 4 | 241 | LocalIncreasedEvasionRatingPercent5 |
| body_armours_dex | prefix | DefencesPercent | 46 | 5 | 240 | LocalIncreasedEvasionRatingPercent4 |
| body_armours_dex | prefix | DefencesPercent | 16 | 7 | 238 | LocalIncreasedEvasionRatingPercent2 |
| body_armours_dex | prefix | IncreasedLife | 54 | 6 | 85 | IncreasedLife8 |
| body_armours_dex | prefix | IncreasedLife | 46 | 7 | 84 | IncreasedLife7 |
| body_armours_dex | prefix | IncreasedLife | 38 | 8 | 83 | IncreasedLife6 |
| body_armours_dex | prefix | IncreasedLife | 16 | 11 | 80 | IncreasedLife3 |
| body_armours_dex | prefix | IncreasedLife | 6 | 12 | 79 | IncreasedLife2 |
| body_armours_dex | prefix | Thorns | 63 | 2 | 456 | AttackerTakesDamage6 |
| body_armours_dex | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| body_armours_dex | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| body_armours_dex | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| body_armours_dex | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| body_armours_dex | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| body_armours_dex | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| body_armours_dex | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| body_armours_dex | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| body_armours_dex | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| body_armours_dex | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| body_armours_dex | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| body_armours_dex | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| body_armours_dex | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| body_armours_dex | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| body_armours_dex | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| body_armours_dex | suffix | StunThreshold | 72 | 1 | 443 | StunThreshold10 |
| body_armours_dex_int | prefix | DefencesPercent | 54 | 4 | 273 | LocalIncreasedEvasionAndEnergyShield5_ |
| body_armours_dex_int | prefix | DefencesPercent | 46 | 5 | 272 | LocalIncreasedEvasionAndEnergyShield4 |
| body_armours_dex_int | prefix | DefencesPercent | 16 | 7 | 270 | LocalIncreasedEvasionAndEnergyShield2 |
| body_armours_dex_int | prefix | IncreasedLife | 54 | 6 | 85 | IncreasedLife8 |
| body_armours_dex_int | prefix | IncreasedLife | 46 | 7 | 84 | IncreasedLife7 |
| body_armours_dex_int | prefix | IncreasedLife | 38 | 8 | 83 | IncreasedLife6 |
| body_armours_dex_int | prefix | IncreasedLife | 16 | 11 | 80 | IncreasedLife3 |
| body_armours_dex_int | prefix | IncreasedLife | 6 | 12 | 79 | IncreasedLife2 |
| body_armours_dex_int | prefix | Thorns | 63 | 2 | 456 | AttackerTakesDamage6 |
| body_armours_dex_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| body_armours_dex_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| body_armours_dex_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| body_armours_dex_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| body_armours_dex_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| body_armours_dex_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| body_armours_dex_int | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| body_armours_dex_int | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| body_armours_dex_int | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| body_armours_dex_int | suffix | EnergyShieldRegeneration | 66 | 2 | 1218 | EnergyShieldRechargeRate5______ |
| body_armours_dex_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| body_armours_dex_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| body_armours_dex_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| body_armours_dex_int | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| body_armours_dex_int | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| body_armours_dex_int | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| body_armours_dex_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| body_armours_dex_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| body_armours_dex_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| body_armours_dex_int | suffix | StunThreshold | 72 | 1 | 443 | StunThreshold10 |
| body_armours_int | prefix | DefencesPercent | 54 | 4 | 249 | LocalIncreasedEnergyShieldPercent5 |
| body_armours_int | prefix | DefencesPercent | 46 | 5 | 248 | LocalIncreasedEnergyShieldPercent4 |
| body_armours_int | prefix | DefencesPercent | 16 | 7 | 246 | LocalIncreasedEnergyShieldPercent2 |
| body_armours_int | prefix | IncreasedLife | 54 | 6 | 85 | IncreasedLife8 |
| body_armours_int | prefix | IncreasedLife | 46 | 7 | 84 | IncreasedLife7 |
| body_armours_int | prefix | IncreasedLife | 38 | 8 | 83 | IncreasedLife6 |
| body_armours_int | prefix | IncreasedLife | 16 | 11 | 80 | IncreasedLife3 |
| body_armours_int | prefix | IncreasedLife | 6 | 12 | 79 | IncreasedLife2 |
| body_armours_int | prefix | Thorns | 63 | 2 | 456 | AttackerTakesDamage6 |
| body_armours_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| body_armours_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| body_armours_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| body_armours_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| body_armours_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| body_armours_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| body_armours_int | suffix | EnergyShieldRegeneration | 66 | 2 | 1218 | EnergyShieldRechargeRate5______ |
| body_armours_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| body_armours_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| body_armours_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| body_armours_int | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| body_armours_int | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| body_armours_int | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| body_armours_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| body_armours_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| body_armours_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| body_armours_int | suffix | StunThreshold | 72 | 1 | 443 | StunThreshold10 |
| body_armours_str | prefix | DefencesPercent | 54 | 4 | 233 | LocalIncreasedPhysicalDamageReductionRatingPercent5 |
| body_armours_str | prefix | DefencesPercent | 46 | 5 | 232 | LocalIncreasedPhysicalDamageReductionRatingPercent4 |
| body_armours_str | prefix | DefencesPercent | 16 | 7 | 230 | LocalIncreasedPhysicalDamageReductionRatingPercent2 |
| body_armours_str | prefix | IncreasedLife | 54 | 6 | 85 | IncreasedLife8 |
| body_armours_str | prefix | IncreasedLife | 46 | 7 | 84 | IncreasedLife7 |
| body_armours_str | prefix | IncreasedLife | 38 | 8 | 83 | IncreasedLife6 |
| body_armours_str | prefix | IncreasedLife | 16 | 11 | 80 | IncreasedLife3 |
| body_armours_str | prefix | IncreasedLife | 6 | 12 | 79 | IncreasedLife2 |
| body_armours_str | prefix | Thorns | 63 | 2 | 456 | AttackerTakesDamage6 |
| body_armours_str | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| body_armours_str | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| body_armours_str | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| body_armours_str | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| body_armours_str | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| body_armours_str | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| body_armours_str | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| body_armours_str | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| body_armours_str | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| body_armours_str | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| body_armours_str | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| body_armours_str | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| body_armours_str | suffix | Strength | 55 | 3 | 5 | Strength6 |
| body_armours_str | suffix | Strength | 33 | 5 | 3 | Strength4 |
| body_armours_str | suffix | Strength | 11 | 7 | 1 | Strength2 |
| body_armours_str | suffix | StunThreshold | 72 | 1 | 443 | StunThreshold10 |
| body_armours_str_dex | prefix | DefencesPercent | 54 | 4 | 257 | LocalIncreasedArmourAndEvasion5 |
| body_armours_str_dex | prefix | DefencesPercent | 46 | 5 | 256 | LocalIncreasedArmourAndEvasion4 |
| body_armours_str_dex | prefix | DefencesPercent | 16 | 7 | 254 | LocalIncreasedArmourAndEvasion2 |
| body_armours_str_dex | prefix | IncreasedLife | 54 | 6 | 85 | IncreasedLife8 |
| body_armours_str_dex | prefix | IncreasedLife | 46 | 7 | 84 | IncreasedLife7 |
| body_armours_str_dex | prefix | IncreasedLife | 38 | 8 | 83 | IncreasedLife6 |
| body_armours_str_dex | prefix | IncreasedLife | 16 | 11 | 80 | IncreasedLife3 |
| body_armours_str_dex | prefix | IncreasedLife | 6 | 12 | 79 | IncreasedLife2 |
| body_armours_str_dex | prefix | Thorns | 63 | 2 | 456 | AttackerTakesDamage6 |
| body_armours_str_dex | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| body_armours_str_dex | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| body_armours_str_dex | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| body_armours_str_dex | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| body_armours_str_dex | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| body_armours_str_dex | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| body_armours_str_dex | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| body_armours_str_dex | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| body_armours_str_dex | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| body_armours_str_dex | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| body_armours_str_dex | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| body_armours_str_dex | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| body_armours_str_dex | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| body_armours_str_dex | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| body_armours_str_dex | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| body_armours_str_dex | suffix | Strength | 55 | 3 | 5 | Strength6 |
| body_armours_str_dex | suffix | Strength | 33 | 5 | 3 | Strength4 |
| body_armours_str_dex | suffix | Strength | 11 | 7 | 1 | Strength2 |
| body_armours_str_dex | suffix | StunThreshold | 72 | 1 | 443 | StunThreshold10 |
| body_armours_str_dex_int | prefix | IncreasedLife | 54 | 6 | 85 | IncreasedLife8 |
| body_armours_str_dex_int | prefix | IncreasedLife | 46 | 7 | 84 | IncreasedLife7 |
| body_armours_str_dex_int | prefix | IncreasedLife | 38 | 8 | 83 | IncreasedLife6 |
| body_armours_str_dex_int | prefix | IncreasedLife | 16 | 11 | 80 | IncreasedLife3 |
| body_armours_str_dex_int | prefix | IncreasedLife | 6 | 12 | 79 | IncreasedLife2 |
| body_armours_str_dex_int | prefix | Thorns | 63 | 2 | 456 | AttackerTakesDamage6 |
| body_armours_str_dex_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| body_armours_str_dex_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| body_armours_str_dex_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| body_armours_str_dex_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| body_armours_str_dex_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| body_armours_str_dex_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| body_armours_str_dex_int | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| body_armours_str_dex_int | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| body_armours_str_dex_int | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| body_armours_str_dex_int | suffix | EnergyShieldRegeneration | 66 | 2 | 1218 | EnergyShieldRechargeRate5______ |
| body_armours_str_dex_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| body_armours_str_dex_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| body_armours_str_dex_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| body_armours_str_dex_int | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| body_armours_str_dex_int | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| body_armours_str_dex_int | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| body_armours_str_dex_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| body_armours_str_dex_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| body_armours_str_dex_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| body_armours_str_dex_int | suffix | Strength | 55 | 3 | 5 | Strength6 |
| body_armours_str_dex_int | suffix | Strength | 33 | 5 | 3 | Strength4 |
| body_armours_str_dex_int | suffix | Strength | 11 | 7 | 1 | Strength2 |
| body_armours_str_dex_int | suffix | StunThreshold | 72 | 1 | 443 | StunThreshold10 |
| body_armours_str_int | prefix | DefencesPercent | 54 | 4 | 265 | LocalIncreasedArmourAndEnergyShield5 |
| body_armours_str_int | prefix | DefencesPercent | 46 | 5 | 264 | LocalIncreasedArmourAndEnergyShield4 |
| body_armours_str_int | prefix | DefencesPercent | 16 | 7 | 262 | LocalIncreasedArmourAndEnergyShield2 |
| body_armours_str_int | prefix | IncreasedLife | 54 | 6 | 85 | IncreasedLife8 |
| body_armours_str_int | prefix | IncreasedLife | 46 | 7 | 84 | IncreasedLife7 |
| body_armours_str_int | prefix | IncreasedLife | 38 | 8 | 83 | IncreasedLife6 |
| body_armours_str_int | prefix | IncreasedLife | 16 | 11 | 80 | IncreasedLife3 |
| body_armours_str_int | prefix | IncreasedLife | 6 | 12 | 79 | IncreasedLife2 |
| body_armours_str_int | prefix | Thorns | 63 | 2 | 456 | AttackerTakesDamage6 |
| body_armours_str_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| body_armours_str_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| body_armours_str_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| body_armours_str_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| body_armours_str_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| body_armours_str_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| body_armours_str_int | suffix | EnergyShieldRegeneration | 66 | 2 | 1218 | EnergyShieldRechargeRate5______ |
| body_armours_str_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| body_armours_str_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| body_armours_str_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| body_armours_str_int | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| body_armours_str_int | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| body_armours_str_int | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| body_armours_str_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| body_armours_str_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| body_armours_str_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| body_armours_str_int | suffix | Strength | 55 | 3 | 5 | Strength6 |
| body_armours_str_int | suffix | Strength | 33 | 5 | 3 | Strength4 |
| body_armours_str_int | suffix | Strength | 11 | 7 | 1 | Strength2 |
| body_armours_str_int | suffix | StunThreshold | 72 | 1 | 443 | StunThreshold10 |
| boots_dex | prefix | DefencesPercent | 54 | 3 | 241 | LocalIncreasedEvasionRatingPercent5 |
| boots_dex | prefix | DefencesPercent | 46 | 4 | 240 | LocalIncreasedEvasionRatingPercent4 |
| boots_dex | prefix | DefencesPercent | 16 | 6 | 238 | LocalIncreasedEvasionRatingPercent2 |
| boots_dex | prefix | IncreasedLife | 54 | 2 | 85 | IncreasedLife8 |
| boots_dex | prefix | IncreasedLife | 46 | 3 | 84 | IncreasedLife7 |
| boots_dex | prefix | IncreasedLife | 38 | 4 | 83 | IncreasedLife6 |
| boots_dex | prefix | IncreasedLife | 16 | 7 | 80 | IncreasedLife3 |
| boots_dex | prefix | IncreasedLife | 6 | 8 | 79 | IncreasedLife2 |
| boots_dex | prefix | IncreasedMana | 54 | 2 | 101 | IncreasedMana8 |
| boots_dex | prefix | IncreasedMana | 46 | 3 | 100 | IncreasedMana7 |
| boots_dex | prefix | IncreasedMana | 38 | 4 | 99 | IncreasedMana6 |
| boots_dex | prefix | IncreasedMana | 16 | 7 | 96 | IncreasedMana3 |
| boots_dex | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| boots_dex | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| boots_dex | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| boots_dex | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| boots_dex | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| boots_dex | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| boots_dex | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| boots_dex | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| boots_dex | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| boots_dex | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| boots_dex | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| boots_dex | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| boots_dex | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| boots_dex | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| boots_dex | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| boots_dex | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| boots_dex | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| boots_dex | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| boots_dex | suffix | StunThreshold | 72 | 2 | 443 | StunThreshold10 |
| boots_dex_int | prefix | DefencesPercent | 54 | 3 | 273 | LocalIncreasedEvasionAndEnergyShield5_ |
| boots_dex_int | prefix | DefencesPercent | 46 | 4 | 272 | LocalIncreasedEvasionAndEnergyShield4 |
| boots_dex_int | prefix | DefencesPercent | 16 | 6 | 270 | LocalIncreasedEvasionAndEnergyShield2 |
| boots_dex_int | prefix | IncreasedLife | 54 | 2 | 85 | IncreasedLife8 |
| boots_dex_int | prefix | IncreasedLife | 46 | 3 | 84 | IncreasedLife7 |
| boots_dex_int | prefix | IncreasedLife | 38 | 4 | 83 | IncreasedLife6 |
| boots_dex_int | prefix | IncreasedLife | 16 | 7 | 80 | IncreasedLife3 |
| boots_dex_int | prefix | IncreasedLife | 6 | 8 | 79 | IncreasedLife2 |
| boots_dex_int | prefix | IncreasedMana | 54 | 2 | 101 | IncreasedMana8 |
| boots_dex_int | prefix | IncreasedMana | 46 | 3 | 100 | IncreasedMana7 |
| boots_dex_int | prefix | IncreasedMana | 38 | 4 | 99 | IncreasedMana6 |
| boots_dex_int | prefix | IncreasedMana | 16 | 7 | 96 | IncreasedMana3 |
| boots_dex_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| boots_dex_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| boots_dex_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| boots_dex_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| boots_dex_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| boots_dex_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| boots_dex_int | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| boots_dex_int | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| boots_dex_int | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| boots_dex_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| boots_dex_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| boots_dex_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| boots_dex_int | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| boots_dex_int | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| boots_dex_int | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| boots_dex_int | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| boots_dex_int | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| boots_dex_int | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| boots_dex_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| boots_dex_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| boots_dex_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| boots_dex_int | suffix | StunThreshold | 72 | 2 | 443 | StunThreshold10 |
| boots_int | prefix | DefencesPercent | 54 | 3 | 249 | LocalIncreasedEnergyShieldPercent5 |
| boots_int | prefix | DefencesPercent | 46 | 4 | 248 | LocalIncreasedEnergyShieldPercent4 |
| boots_int | prefix | DefencesPercent | 16 | 6 | 246 | LocalIncreasedEnergyShieldPercent2 |
| boots_int | prefix | IncreasedLife | 54 | 2 | 85 | IncreasedLife8 |
| boots_int | prefix | IncreasedLife | 46 | 3 | 84 | IncreasedLife7 |
| boots_int | prefix | IncreasedLife | 38 | 4 | 83 | IncreasedLife6 |
| boots_int | prefix | IncreasedLife | 16 | 7 | 80 | IncreasedLife3 |
| boots_int | prefix | IncreasedLife | 6 | 8 | 79 | IncreasedLife2 |
| boots_int | prefix | IncreasedMana | 54 | 2 | 101 | IncreasedMana8 |
| boots_int | prefix | IncreasedMana | 46 | 3 | 100 | IncreasedMana7 |
| boots_int | prefix | IncreasedMana | 38 | 4 | 99 | IncreasedMana6 |
| boots_int | prefix | IncreasedMana | 16 | 7 | 96 | IncreasedMana3 |
| boots_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| boots_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| boots_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| boots_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| boots_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| boots_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| boots_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| boots_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| boots_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| boots_int | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| boots_int | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| boots_int | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| boots_int | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| boots_int | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| boots_int | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| boots_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| boots_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| boots_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| boots_int | suffix | StunThreshold | 72 | 2 | 443 | StunThreshold10 |
| boots_str | prefix | DefencesPercent | 54 | 3 | 233 | LocalIncreasedPhysicalDamageReductionRatingPercent5 |
| boots_str | prefix | DefencesPercent | 46 | 4 | 232 | LocalIncreasedPhysicalDamageReductionRatingPercent4 |
| boots_str | prefix | DefencesPercent | 16 | 6 | 230 | LocalIncreasedPhysicalDamageReductionRatingPercent2 |
| boots_str | prefix | IncreasedLife | 54 | 2 | 85 | IncreasedLife8 |
| boots_str | prefix | IncreasedLife | 46 | 3 | 84 | IncreasedLife7 |
| boots_str | prefix | IncreasedLife | 38 | 4 | 83 | IncreasedLife6 |
| boots_str | prefix | IncreasedLife | 16 | 7 | 80 | IncreasedLife3 |
| boots_str | prefix | IncreasedLife | 6 | 8 | 79 | IncreasedLife2 |
| boots_str | prefix | IncreasedMana | 54 | 2 | 101 | IncreasedMana8 |
| boots_str | prefix | IncreasedMana | 46 | 3 | 100 | IncreasedMana7 |
| boots_str | prefix | IncreasedMana | 38 | 4 | 99 | IncreasedMana6 |
| boots_str | prefix | IncreasedMana | 16 | 7 | 96 | IncreasedMana3 |
| boots_str | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| boots_str | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| boots_str | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| boots_str | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| boots_str | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| boots_str | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| boots_str | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| boots_str | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| boots_str | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| boots_str | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| boots_str | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| boots_str | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| boots_str | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| boots_str | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| boots_str | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| boots_str | suffix | Strength | 55 | 3 | 5 | Strength6 |
| boots_str | suffix | Strength | 33 | 5 | 3 | Strength4 |
| boots_str | suffix | Strength | 11 | 7 | 1 | Strength2 |
| boots_str | suffix | StunThreshold | 72 | 2 | 443 | StunThreshold10 |
| boots_str_dex | prefix | DefencesPercent | 54 | 3 | 257 | LocalIncreasedArmourAndEvasion5 |
| boots_str_dex | prefix | DefencesPercent | 46 | 4 | 256 | LocalIncreasedArmourAndEvasion4 |
| boots_str_dex | prefix | DefencesPercent | 16 | 6 | 254 | LocalIncreasedArmourAndEvasion2 |
| boots_str_dex | prefix | IncreasedLife | 54 | 2 | 85 | IncreasedLife8 |
| boots_str_dex | prefix | IncreasedLife | 46 | 3 | 84 | IncreasedLife7 |
| boots_str_dex | prefix | IncreasedLife | 38 | 4 | 83 | IncreasedLife6 |
| boots_str_dex | prefix | IncreasedLife | 16 | 7 | 80 | IncreasedLife3 |
| boots_str_dex | prefix | IncreasedLife | 6 | 8 | 79 | IncreasedLife2 |
| boots_str_dex | prefix | IncreasedMana | 54 | 2 | 101 | IncreasedMana8 |
| boots_str_dex | prefix | IncreasedMana | 46 | 3 | 100 | IncreasedMana7 |
| boots_str_dex | prefix | IncreasedMana | 38 | 4 | 99 | IncreasedMana6 |
| boots_str_dex | prefix | IncreasedMana | 16 | 7 | 96 | IncreasedMana3 |
| boots_str_dex | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| boots_str_dex | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| boots_str_dex | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| boots_str_dex | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| boots_str_dex | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| boots_str_dex | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| boots_str_dex | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| boots_str_dex | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| boots_str_dex | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| boots_str_dex | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| boots_str_dex | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| boots_str_dex | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| boots_str_dex | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| boots_str_dex | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| boots_str_dex | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| boots_str_dex | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| boots_str_dex | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| boots_str_dex | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| boots_str_dex | suffix | Strength | 55 | 3 | 5 | Strength6 |
| boots_str_dex | suffix | Strength | 33 | 5 | 3 | Strength4 |
| boots_str_dex | suffix | Strength | 11 | 7 | 1 | Strength2 |
| boots_str_dex | suffix | StunThreshold | 72 | 2 | 443 | StunThreshold10 |
| boots_str_int | prefix | DefencesPercent | 54 | 3 | 265 | LocalIncreasedArmourAndEnergyShield5 |
| boots_str_int | prefix | DefencesPercent | 46 | 4 | 264 | LocalIncreasedArmourAndEnergyShield4 |
| boots_str_int | prefix | DefencesPercent | 16 | 6 | 262 | LocalIncreasedArmourAndEnergyShield2 |
| boots_str_int | prefix | IncreasedLife | 54 | 2 | 85 | IncreasedLife8 |
| boots_str_int | prefix | IncreasedLife | 46 | 3 | 84 | IncreasedLife7 |
| boots_str_int | prefix | IncreasedLife | 38 | 4 | 83 | IncreasedLife6 |
| boots_str_int | prefix | IncreasedLife | 16 | 7 | 80 | IncreasedLife3 |
| boots_str_int | prefix | IncreasedLife | 6 | 8 | 79 | IncreasedLife2 |
| boots_str_int | prefix | IncreasedMana | 54 | 2 | 101 | IncreasedMana8 |
| boots_str_int | prefix | IncreasedMana | 46 | 3 | 100 | IncreasedMana7 |
| boots_str_int | prefix | IncreasedMana | 38 | 4 | 99 | IncreasedMana6 |
| boots_str_int | prefix | IncreasedMana | 16 | 7 | 96 | IncreasedMana3 |
| boots_str_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| boots_str_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| boots_str_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| boots_str_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| boots_str_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| boots_str_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| boots_str_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| boots_str_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| boots_str_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| boots_str_int | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| boots_str_int | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| boots_str_int | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| boots_str_int | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| boots_str_int | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| boots_str_int | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| boots_str_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| boots_str_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| boots_str_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| boots_str_int | suffix | Strength | 55 | 3 | 5 | Strength6 |
| boots_str_int | suffix | Strength | 33 | 5 | 3 | Strength4 |
| boots_str_int | suffix | Strength | 11 | 7 | 1 | Strength2 |
| boots_str_int | suffix | StunThreshold | 72 | 2 | 443 | StunThreshold10 |
| bows | prefix | ColdDamage | 60 | 4 | 538 | LocalAddedColdDamage7 |
| bows | prefix | ColdDamage | 46 | 6 | 536 | LocalAddedColdDamage5 |
| bows | prefix | ColdDamage | 8 | 9 | 533 | LocalAddedColdDamage2 |
| bows | prefix | FireDamage | 60 | 4 | 518 | LocalAddedFireDamage7 |
| bows | prefix | FireDamage | 46 | 6 | 516 | LocalAddedFireDamage5 |
| bows | prefix | FireDamage | 8 | 9 | 513 | LocalAddedFireDamage2 |
| bows | prefix | IncreasedAccuracy | 58 | 4 | 1012 | LocalIncreasedAccuracy7 |
| bows | prefix | IncreasedAccuracy | 36 | 6 | 1010 | LocalIncreasedAccuracy5 |
| bows | prefix | IncreasedAccuracy | 18 | 8 | 1008 | LocalIncreasedAccuracy3 |
| bows | prefix | LightningDamage | 60 | 4 | 558 | LocalAddedLightningDamage7 |
| bows | prefix | LightningDamage | 46 | 6 | 556 | LocalAddedLightningDamage5 |
| bows | prefix | LightningDamage | 8 | 9 | 553 | LocalAddedLightningDamage2 |
| bows | prefix | PhysicalDamage | 60 | 3 | 500 | LocalAddedPhysicalDamage7 |
| bows | prefix | PhysicalDamage | 46 | 5 | 498 | LocalAddedPhysicalDamage5 |
| bows | prefix | PhysicalDamage | 8 | 8 | 495 | LocalAddedPhysicalDamage2 |
| bows | suffix | CriticalStrikeChanceIncrease | 44 | 3 | 1033 | LocalCriticalStrikeChance4 |
| bows | suffix | CriticalStrikeChanceIncrease | 30 | 4 | 1032 | LocalCriticalStrikeChance3 |
| bows | suffix | CriticalStrikeChanceIncrease | 20 | 5 | 1031 | LocalCriticalStrikeChance2 |
| bows | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| bows | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| bows | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| bows | suffix | IncreasedAttackSpeed | 37 | 1 | 964 | LocalIncreasedAttackSpeed5 |
| bows | suffix | IncreasedAttackSpeed | 30 | 2 | 963 | LocalIncreasedAttackSpeed4 |
| bows | suffix | IncreasedAttackSpeed | 22 | 3 | 962 | LocalIncreasedAttackSpeed3 |
| bows | suffix | IncreasedAttackSpeed | 11 | 4 | 961 | LocalIncreasedAttackSpeed2 |
| bucklers | prefix | DefencesPercent | 54 | 4 | 241 | LocalIncreasedEvasionRatingPercent5 |
| bucklers | prefix | DefencesPercent | 46 | 5 | 240 | LocalIncreasedEvasionRatingPercent4 |
| bucklers | prefix | DefencesPercent | 16 | 7 | 238 | LocalIncreasedEvasionRatingPercent2 |
| bucklers | prefix | IncreasedLife | 54 | 4 | 85 | IncreasedLife8 |
| bucklers | prefix | IncreasedLife | 46 | 5 | 84 | IncreasedLife7 |
| bucklers | prefix | IncreasedLife | 38 | 6 | 83 | IncreasedLife6 |
| bucklers | prefix | IncreasedLife | 16 | 9 | 80 | IncreasedLife3 |
| bucklers | prefix | IncreasedLife | 6 | 10 | 79 | IncreasedLife2 |
| bucklers | prefix | IncreasedShieldBlockPercentage | 33 | 2 | 1130 | LocalBlockChance2 |
| bucklers | prefix | Thorns | 63 | 2 | 456 | AttackerTakesDamage6 |
| bucklers | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| bucklers | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| bucklers | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| bucklers | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| bucklers | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| bucklers | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| bucklers | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| bucklers | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| bucklers | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| bucklers | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| bucklers | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| bucklers | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| bucklers | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| bucklers | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| bucklers | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| bucklers | suffix | StunThreshold | 72 | 1 | 443 | StunThreshold10 |
| claws | prefix | ColdDamage | 60 | 4 | 538 | LocalAddedColdDamage7 |
| claws | prefix | ColdDamage | 46 | 6 | 536 | LocalAddedColdDamage5 |
| claws | prefix | ColdDamage | 8 | 9 | 533 | LocalAddedColdDamage2 |
| claws | prefix | FireDamage | 60 | 4 | 518 | LocalAddedFireDamage7 |
| claws | prefix | FireDamage | 46 | 6 | 516 | LocalAddedFireDamage5 |
| claws | prefix | FireDamage | 8 | 9 | 513 | LocalAddedFireDamage2 |
| claws | prefix | IncreasedAccuracy | 58 | 3 | 1012 | LocalIncreasedAccuracy7 |
| claws | prefix | IncreasedAccuracy | 36 | 5 | 1010 | LocalIncreasedAccuracy5 |
| claws | prefix | IncreasedAccuracy | 18 | 7 | 1008 | LocalIncreasedAccuracy3 |
| claws | prefix | LightningDamage | 60 | 4 | 558 | LocalAddedLightningDamage7 |
| claws | prefix | LightningDamage | 46 | 6 | 556 | LocalAddedLightningDamage5 |
| claws | prefix | LightningDamage | 8 | 9 | 553 | LocalAddedLightningDamage2 |
| claws | prefix | PhysicalDamage | 60 | 3 | 500 | LocalAddedPhysicalDamage7 |
| claws | prefix | PhysicalDamage | 46 | 5 | 498 | LocalAddedPhysicalDamage5 |
| claws | prefix | PhysicalDamage | 8 | 8 | 495 | LocalAddedPhysicalDamage2 |
| claws | suffix | CriticalStrikeChanceIncrease | 44 | 3 | 1033 | LocalCriticalStrikeChance4 |
| claws | suffix | CriticalStrikeChanceIncrease | 30 | 4 | 1032 | LocalCriticalStrikeChance3 |
| claws | suffix | CriticalStrikeChanceIncrease | 20 | 5 | 1031 | LocalCriticalStrikeChance2 |
| claws | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| claws | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| claws | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| claws | suffix | IncreasedAttackSpeed | 60 | 2 | 966 | LocalIncreasedAttackSpeed7 |
| claws | suffix | IncreasedAttackSpeed | 37 | 4 | 964 | LocalIncreasedAttackSpeed5 |
| claws | suffix | IncreasedAttackSpeed | 30 | 5 | 963 | LocalIncreasedAttackSpeed4 |
| claws | suffix | IncreasedAttackSpeed | 22 | 6 | 962 | LocalIncreasedAttackSpeed3 |
| claws | suffix | IncreasedAttackSpeed | 11 | 7 | 961 | LocalIncreasedAttackSpeed2 |
| crossbows | prefix | ColdDamage | 60 | 4 | 548 | LocalAddedColdDamageTwoHand7 |
| crossbows | prefix | ColdDamage | 46 | 6 | 546 | LocalAddedColdDamageTwoHand5 |
| crossbows | prefix | ColdDamage | 8 | 9 | 543 | LocalAddedColdDamageTwoHand2 |
| crossbows | prefix | FireDamage | 60 | 4 | 528 | LocalAddedFireDamageTwoHand7 |
| crossbows | prefix | FireDamage | 46 | 6 | 526 | LocalAddedFireDamageTwoHand5 |
| crossbows | prefix | FireDamage | 8 | 9 | 523 | LocalAddedFireDamageTwoHand2 |
| crossbows | prefix | IncreasedAccuracy | 58 | 4 | 1012 | LocalIncreasedAccuracy7 |
| crossbows | prefix | IncreasedAccuracy | 36 | 6 | 1010 | LocalIncreasedAccuracy5 |
| crossbows | prefix | IncreasedAccuracy | 18 | 8 | 1008 | LocalIncreasedAccuracy3 |
| crossbows | prefix | LightningDamage | 60 | 4 | 568 | LocalAddedLightningDamageTwoHand7 |
| crossbows | prefix | LightningDamage | 46 | 6 | 566 | LocalAddedLightningDamageTwoHand5 |
| crossbows | prefix | LightningDamage | 8 | 9 | 563 | LocalAddedLightningDamageTwoHand2 |
| crossbows | prefix | PhysicalDamage | 60 | 3 | 509 | LocalAddedPhysicalDamageTwoHand7 |
| crossbows | prefix | PhysicalDamage | 46 | 5 | 507 | LocalAddedPhysicalDamageTwoHand5 |
| crossbows | prefix | PhysicalDamage | 8 | 8 | 504 | LocalAddedPhysicalDamageTwoHand2 |
| crossbows | suffix | CriticalStrikeChanceIncrease | 44 | 3 | 1033 | LocalCriticalStrikeChance4 |
| crossbows | suffix | CriticalStrikeChanceIncrease | 30 | 4 | 1032 | LocalCriticalStrikeChance3 |
| crossbows | suffix | CriticalStrikeChanceIncrease | 20 | 5 | 1031 | LocalCriticalStrikeChance2 |
| crossbows | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| crossbows | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| crossbows | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| crossbows | suffix | IncreasedAttackSpeed | 37 | 1 | 964 | LocalIncreasedAttackSpeed5 |
| crossbows | suffix | IncreasedAttackSpeed | 30 | 2 | 963 | LocalIncreasedAttackSpeed4 |
| crossbows | suffix | IncreasedAttackSpeed | 22 | 3 | 962 | LocalIncreasedAttackSpeed3 |
| crossbows | suffix | IncreasedAttackSpeed | 11 | 4 | 961 | LocalIncreasedAttackSpeed2 |
| crossbows | suffix | Strength | 55 | 3 | 5 | Strength6 |
| crossbows | suffix | Strength | 33 | 5 | 3 | Strength4 |
| crossbows | suffix | Strength | 11 | 7 | 1 | Strength2 |
| daggers | prefix | ColdDamage | 60 | 4 | 538 | LocalAddedColdDamage7 |
| daggers | prefix | ColdDamage | 46 | 6 | 536 | LocalAddedColdDamage5 |
| daggers | prefix | ColdDamage | 8 | 9 | 533 | LocalAddedColdDamage2 |
| daggers | prefix | FireDamage | 60 | 4 | 518 | LocalAddedFireDamage7 |
| daggers | prefix | FireDamage | 46 | 6 | 516 | LocalAddedFireDamage5 |
| daggers | prefix | FireDamage | 8 | 9 | 513 | LocalAddedFireDamage2 |
| daggers | prefix | IncreasedAccuracy | 58 | 3 | 1012 | LocalIncreasedAccuracy7 |
| daggers | prefix | IncreasedAccuracy | 36 | 5 | 1010 | LocalIncreasedAccuracy5 |
| daggers | prefix | IncreasedAccuracy | 18 | 7 | 1008 | LocalIncreasedAccuracy3 |
| daggers | prefix | LightningDamage | 60 | 4 | 558 | LocalAddedLightningDamage7 |
| daggers | prefix | LightningDamage | 46 | 6 | 556 | LocalAddedLightningDamage5 |
| daggers | prefix | LightningDamage | 8 | 9 | 553 | LocalAddedLightningDamage2 |
| daggers | prefix | PhysicalDamage | 60 | 3 | 500 | LocalAddedPhysicalDamage7 |
| daggers | prefix | PhysicalDamage | 46 | 5 | 498 | LocalAddedPhysicalDamage5 |
| daggers | prefix | PhysicalDamage | 8 | 8 | 495 | LocalAddedPhysicalDamage2 |
| daggers | suffix | CriticalStrikeChanceIncrease | 44 | 3 | 1033 | LocalCriticalStrikeChance4 |
| daggers | suffix | CriticalStrikeChanceIncrease | 30 | 4 | 1032 | LocalCriticalStrikeChance3 |
| daggers | suffix | CriticalStrikeChanceIncrease | 20 | 5 | 1031 | LocalCriticalStrikeChance2 |
| daggers | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| daggers | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| daggers | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| daggers | suffix | IncreasedAttackSpeed | 60 | 2 | 966 | LocalIncreasedAttackSpeed7 |
| daggers | suffix | IncreasedAttackSpeed | 37 | 4 | 964 | LocalIncreasedAttackSpeed5 |
| daggers | suffix | IncreasedAttackSpeed | 30 | 5 | 963 | LocalIncreasedAttackSpeed4 |
| daggers | suffix | IncreasedAttackSpeed | 22 | 6 | 962 | LocalIncreasedAttackSpeed3 |
| daggers | suffix | IncreasedAttackSpeed | 11 | 7 | 961 | LocalIncreasedAttackSpeed2 |
| daggers | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| daggers | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| daggers | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| flails | prefix | ColdDamage | 60 | 4 | 538 | LocalAddedColdDamage7 |
| flails | prefix | ColdDamage | 46 | 6 | 536 | LocalAddedColdDamage5 |
| flails | prefix | ColdDamage | 8 | 9 | 533 | LocalAddedColdDamage2 |
| flails | prefix | FireDamage | 60 | 4 | 518 | LocalAddedFireDamage7 |
| flails | prefix | FireDamage | 46 | 6 | 516 | LocalAddedFireDamage5 |
| flails | prefix | FireDamage | 8 | 9 | 513 | LocalAddedFireDamage2 |
| flails | prefix | IncreasedAccuracy | 58 | 3 | 1012 | LocalIncreasedAccuracy7 |
| flails | prefix | IncreasedAccuracy | 36 | 5 | 1010 | LocalIncreasedAccuracy5 |
| flails | prefix | IncreasedAccuracy | 18 | 7 | 1008 | LocalIncreasedAccuracy3 |
| flails | prefix | LightningDamage | 60 | 4 | 558 | LocalAddedLightningDamage7 |
| flails | prefix | LightningDamage | 46 | 6 | 556 | LocalAddedLightningDamage5 |
| flails | prefix | LightningDamage | 8 | 9 | 553 | LocalAddedLightningDamage2 |
| flails | prefix | PhysicalDamage | 60 | 3 | 500 | LocalAddedPhysicalDamage7 |
| flails | prefix | PhysicalDamage | 46 | 5 | 498 | LocalAddedPhysicalDamage5 |
| flails | prefix | PhysicalDamage | 8 | 8 | 495 | LocalAddedPhysicalDamage2 |
| flails | suffix | CriticalStrikeChanceIncrease | 44 | 3 | 1033 | LocalCriticalStrikeChance4 |
| flails | suffix | CriticalStrikeChanceIncrease | 30 | 4 | 1032 | LocalCriticalStrikeChance3 |
| flails | suffix | CriticalStrikeChanceIncrease | 20 | 5 | 1031 | LocalCriticalStrikeChance2 |
| flails | suffix | IncreasedAttackSpeed | 60 | 2 | 966 | LocalIncreasedAttackSpeed7 |
| flails | suffix | IncreasedAttackSpeed | 37 | 4 | 964 | LocalIncreasedAttackSpeed5 |
| flails | suffix | IncreasedAttackSpeed | 30 | 5 | 963 | LocalIncreasedAttackSpeed4 |
| flails | suffix | IncreasedAttackSpeed | 22 | 6 | 962 | LocalIncreasedAttackSpeed3 |
| flails | suffix | IncreasedAttackSpeed | 11 | 7 | 961 | LocalIncreasedAttackSpeed2 |
| flails | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| flails | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| flails | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| flails | suffix | Strength | 55 | 3 | 5 | Strength6 |
| flails | suffix | Strength | 33 | 5 | 3 | Strength4 |
| flails | suffix | Strength | 11 | 7 | 1 | Strength2 |
| foci | prefix | DefencesPercent | 54 | 3 | 249 | LocalIncreasedEnergyShieldPercent5 |
| foci | prefix | DefencesPercent | 46 | 4 | 248 | LocalIncreasedEnergyShieldPercent4 |
| foci | prefix | DefencesPercent | 16 | 6 | 246 | LocalIncreasedEnergyShieldPercent2 |
| foci | prefix | IncreasedMana | 54 | 4 | 101 | IncreasedMana8 |
| foci | prefix | IncreasedMana | 46 | 5 | 100 | IncreasedMana7 |
| foci | prefix | IncreasedMana | 38 | 6 | 99 | IncreasedMana6 |
| foci | prefix | IncreasedMana | 16 | 9 | 96 | IncreasedMana3 |
| foci | prefix | WeaponCasterDamagePrefix | 60 | 1 | 639 | SpellDamageOnWeapon6 |
| foci | prefix | WeaponCasterDamagePrefix | 33 | 3 | 637 | SpellDamageOnWeapon4 |
| foci | prefix | WeaponCasterDamagePrefix | 8 | 5 | 635 | SpellDamageOnWeapon2 |
| foci | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| foci | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| foci | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| foci | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| foci | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| foci | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| foci | suffix | EnergyShieldRegeneration | 66 | 2 | 1218 | EnergyShieldRechargeRate5______ |
| foci | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| foci | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| foci | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| foci | suffix | IncreasedCastSpeed | 60 | 2 | 976 | IncreasedCastSpeed5 |
| foci | suffix | IncreasedCastSpeed | 30 | 4 | 974 | IncreasedCastSpeed3 |
| foci | suffix | IncreasedCastSpeed | 15 | 5 | 973 | IncreasedCastSpeed2 |
| foci | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| foci | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| foci | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| foci | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| foci | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| foci | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| foci | suffix | ManaRegeneration | 55 | 2 | 904 | ManaRegeneration5 |
| foci | suffix | SpellCriticalStrikeChanceIncrease | 41 | 2 | 1039 | SpellCriticalStrikeChance4 |
| foci | suffix | SpellCriticalStrikeChanceIncrease | 28 | 3 | 1038 | SpellCriticalStrikeChance3 |
| foci | suffix | SpellCriticalStrikeChanceIncrease | 21 | 4 | 1037 | SpellCriticalStrikeChance2 |
| gloves_dex | prefix | DefencesPercent | 54 | 3 | 241 | LocalIncreasedEvasionRatingPercent5 |
| gloves_dex | prefix | DefencesPercent | 46 | 4 | 240 | LocalIncreasedEvasionRatingPercent4 |
| gloves_dex | prefix | DefencesPercent | 16 | 6 | 238 | LocalIncreasedEvasionRatingPercent2 |
| gloves_dex | prefix | IncreasedAccuracy | 58 | 3 | 1003 | IncreasedAccuracy7 |
| gloves_dex | prefix | IncreasedLife | 54 | 2 | 85 | IncreasedLife8 |
| gloves_dex | prefix | IncreasedLife | 46 | 3 | 84 | IncreasedLife7 |
| gloves_dex | prefix | IncreasedLife | 38 | 4 | 83 | IncreasedLife6 |
| gloves_dex | prefix | IncreasedLife | 16 | 7 | 80 | IncreasedLife3 |
| gloves_dex | prefix | IncreasedLife | 6 | 8 | 79 | IncreasedLife2 |
| gloves_dex | prefix | IncreasedMana | 54 | 2 | 101 | IncreasedMana8 |
| gloves_dex | prefix | IncreasedMana | 46 | 3 | 100 | IncreasedMana7 |
| gloves_dex | prefix | IncreasedMana | 38 | 4 | 99 | IncreasedMana6 |
| gloves_dex | prefix | IncreasedMana | 16 | 7 | 96 | IncreasedMana3 |
| gloves_dex | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| gloves_dex | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| gloves_dex | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| gloves_dex | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| gloves_dex | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| gloves_dex | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| gloves_dex | suffix | CriticalStrikeMultiplier | 45 | 2 | 1070 | CriticalMultiplier4 |
| gloves_dex | suffix | Dexterity | 55 | 4 | 14 | Dexterity6 |
| gloves_dex | suffix | Dexterity | 33 | 6 | 12 | Dexterity4 |
| gloves_dex | suffix | Dexterity | 11 | 8 | 10 | Dexterity2 |
| gloves_dex | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| gloves_dex | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| gloves_dex | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| gloves_dex | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| gloves_dex | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| gloves_dex | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| gloves_dex | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| gloves_dex | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| gloves_dex | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| gloves_dex_int | prefix | DefencesPercent | 54 | 3 | 273 | LocalIncreasedEvasionAndEnergyShield5_ |
| gloves_dex_int | prefix | DefencesPercent | 46 | 4 | 272 | LocalIncreasedEvasionAndEnergyShield4 |
| gloves_dex_int | prefix | DefencesPercent | 16 | 6 | 270 | LocalIncreasedEvasionAndEnergyShield2 |
| gloves_dex_int | prefix | IncreasedAccuracy | 58 | 3 | 1003 | IncreasedAccuracy7 |
| gloves_dex_int | prefix | IncreasedLife | 54 | 2 | 85 | IncreasedLife8 |
| gloves_dex_int | prefix | IncreasedLife | 46 | 3 | 84 | IncreasedLife7 |
| gloves_dex_int | prefix | IncreasedLife | 38 | 4 | 83 | IncreasedLife6 |
| gloves_dex_int | prefix | IncreasedLife | 16 | 7 | 80 | IncreasedLife3 |
| gloves_dex_int | prefix | IncreasedLife | 6 | 8 | 79 | IncreasedLife2 |
| gloves_dex_int | prefix | IncreasedMana | 54 | 2 | 101 | IncreasedMana8 |
| gloves_dex_int | prefix | IncreasedMana | 46 | 3 | 100 | IncreasedMana7 |
| gloves_dex_int | prefix | IncreasedMana | 38 | 4 | 99 | IncreasedMana6 |
| gloves_dex_int | prefix | IncreasedMana | 16 | 7 | 96 | IncreasedMana3 |
| gloves_dex_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| gloves_dex_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| gloves_dex_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| gloves_dex_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| gloves_dex_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| gloves_dex_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| gloves_dex_int | suffix | CriticalStrikeMultiplier | 45 | 2 | 1070 | CriticalMultiplier4 |
| gloves_dex_int | suffix | Dexterity | 55 | 4 | 14 | Dexterity6 |
| gloves_dex_int | suffix | Dexterity | 33 | 6 | 12 | Dexterity4 |
| gloves_dex_int | suffix | Dexterity | 11 | 8 | 10 | Dexterity2 |
| gloves_dex_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| gloves_dex_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| gloves_dex_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| gloves_dex_int | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| gloves_dex_int | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| gloves_dex_int | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| gloves_dex_int | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| gloves_dex_int | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| gloves_dex_int | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| gloves_dex_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| gloves_dex_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| gloves_dex_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| gloves_int | prefix | DefencesPercent | 54 | 3 | 249 | LocalIncreasedEnergyShieldPercent5 |
| gloves_int | prefix | DefencesPercent | 46 | 4 | 248 | LocalIncreasedEnergyShieldPercent4 |
| gloves_int | prefix | DefencesPercent | 16 | 6 | 246 | LocalIncreasedEnergyShieldPercent2 |
| gloves_int | prefix | IncreasedAccuracy | 58 | 3 | 1003 | IncreasedAccuracy7 |
| gloves_int | prefix | IncreasedLife | 54 | 2 | 85 | IncreasedLife8 |
| gloves_int | prefix | IncreasedLife | 46 | 3 | 84 | IncreasedLife7 |
| gloves_int | prefix | IncreasedLife | 38 | 4 | 83 | IncreasedLife6 |
| gloves_int | prefix | IncreasedLife | 16 | 7 | 80 | IncreasedLife3 |
| gloves_int | prefix | IncreasedLife | 6 | 8 | 79 | IncreasedLife2 |
| gloves_int | prefix | IncreasedMana | 54 | 2 | 101 | IncreasedMana8 |
| gloves_int | prefix | IncreasedMana | 46 | 3 | 100 | IncreasedMana7 |
| gloves_int | prefix | IncreasedMana | 38 | 4 | 99 | IncreasedMana6 |
| gloves_int | prefix | IncreasedMana | 16 | 7 | 96 | IncreasedMana3 |
| gloves_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| gloves_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| gloves_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| gloves_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| gloves_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| gloves_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| gloves_int | suffix | CriticalStrikeMultiplier | 45 | 2 | 1070 | CriticalMultiplier4 |
| gloves_int | suffix | Dexterity | 55 | 4 | 14 | Dexterity6 |
| gloves_int | suffix | Dexterity | 33 | 6 | 12 | Dexterity4 |
| gloves_int | suffix | Dexterity | 11 | 8 | 10 | Dexterity2 |
| gloves_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| gloves_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| gloves_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| gloves_int | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| gloves_int | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| gloves_int | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| gloves_int | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| gloves_int | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| gloves_int | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| gloves_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| gloves_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| gloves_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| gloves_str | prefix | DefencesPercent | 54 | 3 | 233 | LocalIncreasedPhysicalDamageReductionRatingPercent5 |
| gloves_str | prefix | DefencesPercent | 46 | 4 | 232 | LocalIncreasedPhysicalDamageReductionRatingPercent4 |
| gloves_str | prefix | DefencesPercent | 16 | 6 | 230 | LocalIncreasedPhysicalDamageReductionRatingPercent2 |
| gloves_str | prefix | IncreasedAccuracy | 58 | 3 | 1003 | IncreasedAccuracy7 |
| gloves_str | prefix | IncreasedLife | 54 | 2 | 85 | IncreasedLife8 |
| gloves_str | prefix | IncreasedLife | 46 | 3 | 84 | IncreasedLife7 |
| gloves_str | prefix | IncreasedLife | 38 | 4 | 83 | IncreasedLife6 |
| gloves_str | prefix | IncreasedLife | 16 | 7 | 80 | IncreasedLife3 |
| gloves_str | prefix | IncreasedLife | 6 | 8 | 79 | IncreasedLife2 |
| gloves_str | prefix | IncreasedMana | 54 | 2 | 101 | IncreasedMana8 |
| gloves_str | prefix | IncreasedMana | 46 | 3 | 100 | IncreasedMana7 |
| gloves_str | prefix | IncreasedMana | 38 | 4 | 99 | IncreasedMana6 |
| gloves_str | prefix | IncreasedMana | 16 | 7 | 96 | IncreasedMana3 |
| gloves_str | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| gloves_str | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| gloves_str | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| gloves_str | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| gloves_str | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| gloves_str | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| gloves_str | suffix | CriticalStrikeMultiplier | 45 | 2 | 1070 | CriticalMultiplier4 |
| gloves_str | suffix | Dexterity | 55 | 4 | 14 | Dexterity6 |
| gloves_str | suffix | Dexterity | 33 | 6 | 12 | Dexterity4 |
| gloves_str | suffix | Dexterity | 11 | 8 | 10 | Dexterity2 |
| gloves_str | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| gloves_str | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| gloves_str | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| gloves_str | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| gloves_str | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| gloves_str | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| gloves_str | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| gloves_str | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| gloves_str | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| gloves_str | suffix | Strength | 55 | 3 | 5 | Strength6 |
| gloves_str | suffix | Strength | 33 | 5 | 3 | Strength4 |
| gloves_str | suffix | Strength | 11 | 7 | 1 | Strength2 |
| gloves_str_dex | prefix | DefencesPercent | 54 | 3 | 257 | LocalIncreasedArmourAndEvasion5 |
| gloves_str_dex | prefix | DefencesPercent | 46 | 4 | 256 | LocalIncreasedArmourAndEvasion4 |
| gloves_str_dex | prefix | DefencesPercent | 16 | 6 | 254 | LocalIncreasedArmourAndEvasion2 |
| gloves_str_dex | prefix | IncreasedAccuracy | 58 | 3 | 1003 | IncreasedAccuracy7 |
| gloves_str_dex | prefix | IncreasedLife | 54 | 2 | 85 | IncreasedLife8 |
| gloves_str_dex | prefix | IncreasedLife | 46 | 3 | 84 | IncreasedLife7 |
| gloves_str_dex | prefix | IncreasedLife | 38 | 4 | 83 | IncreasedLife6 |
| gloves_str_dex | prefix | IncreasedLife | 16 | 7 | 80 | IncreasedLife3 |
| gloves_str_dex | prefix | IncreasedLife | 6 | 8 | 79 | IncreasedLife2 |
| gloves_str_dex | prefix | IncreasedMana | 54 | 2 | 101 | IncreasedMana8 |
| gloves_str_dex | prefix | IncreasedMana | 46 | 3 | 100 | IncreasedMana7 |
| gloves_str_dex | prefix | IncreasedMana | 38 | 4 | 99 | IncreasedMana6 |
| gloves_str_dex | prefix | IncreasedMana | 16 | 7 | 96 | IncreasedMana3 |
| gloves_str_dex | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| gloves_str_dex | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| gloves_str_dex | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| gloves_str_dex | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| gloves_str_dex | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| gloves_str_dex | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| gloves_str_dex | suffix | CriticalStrikeMultiplier | 45 | 2 | 1070 | CriticalMultiplier4 |
| gloves_str_dex | suffix | Dexterity | 55 | 4 | 14 | Dexterity6 |
| gloves_str_dex | suffix | Dexterity | 33 | 6 | 12 | Dexterity4 |
| gloves_str_dex | suffix | Dexterity | 11 | 8 | 10 | Dexterity2 |
| gloves_str_dex | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| gloves_str_dex | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| gloves_str_dex | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| gloves_str_dex | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| gloves_str_dex | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| gloves_str_dex | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| gloves_str_dex | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| gloves_str_dex | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| gloves_str_dex | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| gloves_str_dex | suffix | Strength | 55 | 3 | 5 | Strength6 |
| gloves_str_dex | suffix | Strength | 33 | 5 | 3 | Strength4 |
| gloves_str_dex | suffix | Strength | 11 | 7 | 1 | Strength2 |
| gloves_str_int | prefix | DefencesPercent | 54 | 3 | 265 | LocalIncreasedArmourAndEnergyShield5 |
| gloves_str_int | prefix | DefencesPercent | 46 | 4 | 264 | LocalIncreasedArmourAndEnergyShield4 |
| gloves_str_int | prefix | DefencesPercent | 16 | 6 | 262 | LocalIncreasedArmourAndEnergyShield2 |
| gloves_str_int | prefix | IncreasedAccuracy | 58 | 3 | 1003 | IncreasedAccuracy7 |
| gloves_str_int | prefix | IncreasedLife | 54 | 2 | 85 | IncreasedLife8 |
| gloves_str_int | prefix | IncreasedLife | 46 | 3 | 84 | IncreasedLife7 |
| gloves_str_int | prefix | IncreasedLife | 38 | 4 | 83 | IncreasedLife6 |
| gloves_str_int | prefix | IncreasedLife | 16 | 7 | 80 | IncreasedLife3 |
| gloves_str_int | prefix | IncreasedLife | 6 | 8 | 79 | IncreasedLife2 |
| gloves_str_int | prefix | IncreasedMana | 54 | 2 | 101 | IncreasedMana8 |
| gloves_str_int | prefix | IncreasedMana | 46 | 3 | 100 | IncreasedMana7 |
| gloves_str_int | prefix | IncreasedMana | 38 | 4 | 99 | IncreasedMana6 |
| gloves_str_int | prefix | IncreasedMana | 16 | 7 | 96 | IncreasedMana3 |
| gloves_str_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| gloves_str_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| gloves_str_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| gloves_str_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| gloves_str_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| gloves_str_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| gloves_str_int | suffix | CriticalStrikeMultiplier | 45 | 2 | 1070 | CriticalMultiplier4 |
| gloves_str_int | suffix | Dexterity | 55 | 4 | 14 | Dexterity6 |
| gloves_str_int | suffix | Dexterity | 33 | 6 | 12 | Dexterity4 |
| gloves_str_int | suffix | Dexterity | 11 | 8 | 10 | Dexterity2 |
| gloves_str_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| gloves_str_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| gloves_str_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| gloves_str_int | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| gloves_str_int | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| gloves_str_int | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| gloves_str_int | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| gloves_str_int | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| gloves_str_int | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| gloves_str_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| gloves_str_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| gloves_str_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| gloves_str_int | suffix | Strength | 55 | 3 | 5 | Strength6 |
| gloves_str_int | suffix | Strength | 33 | 5 | 3 | Strength4 |
| gloves_str_int | suffix | Strength | 11 | 7 | 1 | Strength2 |
| helmets_dex | prefix | DefencesPercent | 54 | 3 | 241 | LocalIncreasedEvasionRatingPercent5 |
| helmets_dex | prefix | DefencesPercent | 46 | 4 | 240 | LocalIncreasedEvasionRatingPercent4 |
| helmets_dex | prefix | DefencesPercent | 16 | 6 | 238 | LocalIncreasedEvasionRatingPercent2 |
| helmets_dex | prefix | IncreasedAccuracy | 58 | 3 | 1003 | IncreasedAccuracy7 |
| helmets_dex | prefix | IncreasedLife | 54 | 3 | 85 | IncreasedLife8 |
| helmets_dex | prefix | IncreasedLife | 46 | 4 | 84 | IncreasedLife7 |
| helmets_dex | prefix | IncreasedLife | 38 | 5 | 83 | IncreasedLife6 |
| helmets_dex | prefix | IncreasedLife | 16 | 8 | 80 | IncreasedLife3 |
| helmets_dex | prefix | IncreasedLife | 6 | 9 | 79 | IncreasedLife2 |
| helmets_dex | prefix | IncreasedMana | 54 | 3 | 101 | IncreasedMana8 |
| helmets_dex | prefix | IncreasedMana | 46 | 4 | 100 | IncreasedMana7 |
| helmets_dex | prefix | IncreasedMana | 38 | 5 | 99 | IncreasedMana6 |
| helmets_dex | prefix | IncreasedMana | 16 | 8 | 96 | IncreasedMana3 |
| helmets_dex | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| helmets_dex | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| helmets_dex | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| helmets_dex | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| helmets_dex | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| helmets_dex | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| helmets_dex | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| helmets_dex | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| helmets_dex | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| helmets_dex | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| helmets_dex | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| helmets_dex | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| helmets_dex | suffix | IncreaseSocketedGemLevel | 5 | 2 | 836 | GlobalMinionSpellSkillGemLevel1 |
| helmets_dex | suffix | Intelligence | 55 | 4 | 23 | Intelligence6 |
| helmets_dex | suffix | Intelligence | 33 | 6 | 21 | Intelligence4 |
| helmets_dex | suffix | Intelligence | 11 | 8 | 19 | Intelligence2 |
| helmets_dex | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| helmets_dex | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| helmets_dex | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| helmets_dex | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| helmets_dex | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| helmets_dex | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| helmets_dex_int | prefix | DefencesPercent | 54 | 3 | 273 | LocalIncreasedEvasionAndEnergyShield5_ |
| helmets_dex_int | prefix | DefencesPercent | 46 | 4 | 272 | LocalIncreasedEvasionAndEnergyShield4 |
| helmets_dex_int | prefix | DefencesPercent | 16 | 6 | 270 | LocalIncreasedEvasionAndEnergyShield2 |
| helmets_dex_int | prefix | IncreasedAccuracy | 58 | 3 | 1003 | IncreasedAccuracy7 |
| helmets_dex_int | prefix | IncreasedLife | 54 | 3 | 85 | IncreasedLife8 |
| helmets_dex_int | prefix | IncreasedLife | 46 | 4 | 84 | IncreasedLife7 |
| helmets_dex_int | prefix | IncreasedLife | 38 | 5 | 83 | IncreasedLife6 |
| helmets_dex_int | prefix | IncreasedLife | 16 | 8 | 80 | IncreasedLife3 |
| helmets_dex_int | prefix | IncreasedLife | 6 | 9 | 79 | IncreasedLife2 |
| helmets_dex_int | prefix | IncreasedMana | 54 | 3 | 101 | IncreasedMana8 |
| helmets_dex_int | prefix | IncreasedMana | 46 | 4 | 100 | IncreasedMana7 |
| helmets_dex_int | prefix | IncreasedMana | 38 | 5 | 99 | IncreasedMana6 |
| helmets_dex_int | prefix | IncreasedMana | 16 | 8 | 96 | IncreasedMana3 |
| helmets_dex_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| helmets_dex_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| helmets_dex_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| helmets_dex_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| helmets_dex_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| helmets_dex_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| helmets_dex_int | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| helmets_dex_int | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| helmets_dex_int | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| helmets_dex_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| helmets_dex_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| helmets_dex_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| helmets_dex_int | suffix | IncreaseSocketedGemLevel | 5 | 2 | 836 | GlobalMinionSpellSkillGemLevel1 |
| helmets_dex_int | suffix | Intelligence | 55 | 4 | 23 | Intelligence6 |
| helmets_dex_int | suffix | Intelligence | 33 | 6 | 21 | Intelligence4 |
| helmets_dex_int | suffix | Intelligence | 11 | 8 | 19 | Intelligence2 |
| helmets_dex_int | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| helmets_dex_int | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| helmets_dex_int | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| helmets_dex_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| helmets_dex_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| helmets_dex_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| helmets_int | prefix | DefencesPercent | 54 | 3 | 249 | LocalIncreasedEnergyShieldPercent5 |
| helmets_int | prefix | DefencesPercent | 46 | 4 | 248 | LocalIncreasedEnergyShieldPercent4 |
| helmets_int | prefix | DefencesPercent | 16 | 6 | 246 | LocalIncreasedEnergyShieldPercent2 |
| helmets_int | prefix | IncreasedAccuracy | 58 | 3 | 1003 | IncreasedAccuracy7 |
| helmets_int | prefix | IncreasedLife | 54 | 3 | 85 | IncreasedLife8 |
| helmets_int | prefix | IncreasedLife | 46 | 4 | 84 | IncreasedLife7 |
| helmets_int | prefix | IncreasedLife | 38 | 5 | 83 | IncreasedLife6 |
| helmets_int | prefix | IncreasedLife | 16 | 8 | 80 | IncreasedLife3 |
| helmets_int | prefix | IncreasedLife | 6 | 9 | 79 | IncreasedLife2 |
| helmets_int | prefix | IncreasedMana | 54 | 3 | 101 | IncreasedMana8 |
| helmets_int | prefix | IncreasedMana | 46 | 4 | 100 | IncreasedMana7 |
| helmets_int | prefix | IncreasedMana | 38 | 5 | 99 | IncreasedMana6 |
| helmets_int | prefix | IncreasedMana | 16 | 8 | 96 | IncreasedMana3 |
| helmets_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| helmets_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| helmets_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| helmets_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| helmets_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| helmets_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| helmets_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| helmets_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| helmets_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| helmets_int | suffix | IncreaseSocketedGemLevel | 5 | 2 | 836 | GlobalMinionSpellSkillGemLevel1 |
| helmets_int | suffix | Intelligence | 55 | 4 | 23 | Intelligence6 |
| helmets_int | suffix | Intelligence | 33 | 6 | 21 | Intelligence4 |
| helmets_int | suffix | Intelligence | 11 | 8 | 19 | Intelligence2 |
| helmets_int | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| helmets_int | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| helmets_int | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| helmets_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| helmets_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| helmets_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| helmets_str | prefix | DefencesPercent | 54 | 3 | 233 | LocalIncreasedPhysicalDamageReductionRatingPercent5 |
| helmets_str | prefix | DefencesPercent | 46 | 4 | 232 | LocalIncreasedPhysicalDamageReductionRatingPercent4 |
| helmets_str | prefix | DefencesPercent | 16 | 6 | 230 | LocalIncreasedPhysicalDamageReductionRatingPercent2 |
| helmets_str | prefix | IncreasedAccuracy | 58 | 3 | 1003 | IncreasedAccuracy7 |
| helmets_str | prefix | IncreasedLife | 54 | 3 | 85 | IncreasedLife8 |
| helmets_str | prefix | IncreasedLife | 46 | 4 | 84 | IncreasedLife7 |
| helmets_str | prefix | IncreasedLife | 38 | 5 | 83 | IncreasedLife6 |
| helmets_str | prefix | IncreasedLife | 16 | 8 | 80 | IncreasedLife3 |
| helmets_str | prefix | IncreasedLife | 6 | 9 | 79 | IncreasedLife2 |
| helmets_str | prefix | IncreasedMana | 54 | 3 | 101 | IncreasedMana8 |
| helmets_str | prefix | IncreasedMana | 46 | 4 | 100 | IncreasedMana7 |
| helmets_str | prefix | IncreasedMana | 38 | 5 | 99 | IncreasedMana6 |
| helmets_str | prefix | IncreasedMana | 16 | 8 | 96 | IncreasedMana3 |
| helmets_str | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| helmets_str | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| helmets_str | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| helmets_str | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| helmets_str | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| helmets_str | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| helmets_str | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| helmets_str | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| helmets_str | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| helmets_str | suffix | IncreaseSocketedGemLevel | 5 | 2 | 836 | GlobalMinionSpellSkillGemLevel1 |
| helmets_str | suffix | Intelligence | 55 | 4 | 23 | Intelligence6 |
| helmets_str | suffix | Intelligence | 33 | 6 | 21 | Intelligence4 |
| helmets_str | suffix | Intelligence | 11 | 8 | 19 | Intelligence2 |
| helmets_str | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| helmets_str | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| helmets_str | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| helmets_str | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| helmets_str | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| helmets_str | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| helmets_str | suffix | Strength | 55 | 3 | 5 | Strength6 |
| helmets_str | suffix | Strength | 33 | 5 | 3 | Strength4 |
| helmets_str | suffix | Strength | 11 | 7 | 1 | Strength2 |
| helmets_str_dex | prefix | DefencesPercent | 54 | 3 | 257 | LocalIncreasedArmourAndEvasion5 |
| helmets_str_dex | prefix | DefencesPercent | 46 | 4 | 256 | LocalIncreasedArmourAndEvasion4 |
| helmets_str_dex | prefix | DefencesPercent | 16 | 6 | 254 | LocalIncreasedArmourAndEvasion2 |
| helmets_str_dex | prefix | IncreasedAccuracy | 58 | 3 | 1003 | IncreasedAccuracy7 |
| helmets_str_dex | prefix | IncreasedLife | 54 | 3 | 85 | IncreasedLife8 |
| helmets_str_dex | prefix | IncreasedLife | 46 | 4 | 84 | IncreasedLife7 |
| helmets_str_dex | prefix | IncreasedLife | 38 | 5 | 83 | IncreasedLife6 |
| helmets_str_dex | prefix | IncreasedLife | 16 | 8 | 80 | IncreasedLife3 |
| helmets_str_dex | prefix | IncreasedLife | 6 | 9 | 79 | IncreasedLife2 |
| helmets_str_dex | prefix | IncreasedMana | 54 | 3 | 101 | IncreasedMana8 |
| helmets_str_dex | prefix | IncreasedMana | 46 | 4 | 100 | IncreasedMana7 |
| helmets_str_dex | prefix | IncreasedMana | 38 | 5 | 99 | IncreasedMana6 |
| helmets_str_dex | prefix | IncreasedMana | 16 | 8 | 96 | IncreasedMana3 |
| helmets_str_dex | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| helmets_str_dex | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| helmets_str_dex | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| helmets_str_dex | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| helmets_str_dex | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| helmets_str_dex | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| helmets_str_dex | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| helmets_str_dex | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| helmets_str_dex | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| helmets_str_dex | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| helmets_str_dex | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| helmets_str_dex | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| helmets_str_dex | suffix | IncreaseSocketedGemLevel | 5 | 2 | 836 | GlobalMinionSpellSkillGemLevel1 |
| helmets_str_dex | suffix | Intelligence | 55 | 4 | 23 | Intelligence6 |
| helmets_str_dex | suffix | Intelligence | 33 | 6 | 21 | Intelligence4 |
| helmets_str_dex | suffix | Intelligence | 11 | 8 | 19 | Intelligence2 |
| helmets_str_dex | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| helmets_str_dex | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| helmets_str_dex | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| helmets_str_dex | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| helmets_str_dex | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| helmets_str_dex | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| helmets_str_dex | suffix | Strength | 55 | 3 | 5 | Strength6 |
| helmets_str_dex | suffix | Strength | 33 | 5 | 3 | Strength4 |
| helmets_str_dex | suffix | Strength | 11 | 7 | 1 | Strength2 |
| helmets_str_int | prefix | DefencesPercent | 54 | 3 | 265 | LocalIncreasedArmourAndEnergyShield5 |
| helmets_str_int | prefix | DefencesPercent | 46 | 4 | 264 | LocalIncreasedArmourAndEnergyShield4 |
| helmets_str_int | prefix | DefencesPercent | 16 | 6 | 262 | LocalIncreasedArmourAndEnergyShield2 |
| helmets_str_int | prefix | IncreasedAccuracy | 58 | 3 | 1003 | IncreasedAccuracy7 |
| helmets_str_int | prefix | IncreasedLife | 54 | 3 | 85 | IncreasedLife8 |
| helmets_str_int | prefix | IncreasedLife | 46 | 4 | 84 | IncreasedLife7 |
| helmets_str_int | prefix | IncreasedLife | 38 | 5 | 83 | IncreasedLife6 |
| helmets_str_int | prefix | IncreasedLife | 16 | 8 | 80 | IncreasedLife3 |
| helmets_str_int | prefix | IncreasedLife | 6 | 9 | 79 | IncreasedLife2 |
| helmets_str_int | prefix | IncreasedMana | 54 | 3 | 101 | IncreasedMana8 |
| helmets_str_int | prefix | IncreasedMana | 46 | 4 | 100 | IncreasedMana7 |
| helmets_str_int | prefix | IncreasedMana | 38 | 5 | 99 | IncreasedMana6 |
| helmets_str_int | prefix | IncreasedMana | 16 | 8 | 96 | IncreasedMana3 |
| helmets_str_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| helmets_str_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| helmets_str_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| helmets_str_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| helmets_str_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| helmets_str_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| helmets_str_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| helmets_str_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| helmets_str_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| helmets_str_int | suffix | IncreaseSocketedGemLevel | 5 | 2 | 836 | GlobalMinionSpellSkillGemLevel1 |
| helmets_str_int | suffix | Intelligence | 55 | 4 | 23 | Intelligence6 |
| helmets_str_int | suffix | Intelligence | 33 | 6 | 21 | Intelligence4 |
| helmets_str_int | suffix | Intelligence | 11 | 8 | 19 | Intelligence2 |
| helmets_str_int | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| helmets_str_int | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| helmets_str_int | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| helmets_str_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| helmets_str_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| helmets_str_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| helmets_str_int | suffix | Strength | 55 | 3 | 5 | Strength6 |
| helmets_str_int | suffix | Strength | 33 | 5 | 3 | Strength4 |
| helmets_str_int | suffix | Strength | 11 | 7 | 1 | Strength2 |
| one_hand_axes | prefix | ColdDamage | 60 | 4 | 538 | LocalAddedColdDamage7 |
| one_hand_axes | prefix | ColdDamage | 46 | 6 | 536 | LocalAddedColdDamage5 |
| one_hand_axes | prefix | ColdDamage | 8 | 9 | 533 | LocalAddedColdDamage2 |
| one_hand_axes | prefix | FireDamage | 60 | 4 | 518 | LocalAddedFireDamage7 |
| one_hand_axes | prefix | FireDamage | 46 | 6 | 516 | LocalAddedFireDamage5 |
| one_hand_axes | prefix | FireDamage | 8 | 9 | 513 | LocalAddedFireDamage2 |
| one_hand_axes | prefix | IncreasedAccuracy | 58 | 3 | 1012 | LocalIncreasedAccuracy7 |
| one_hand_axes | prefix | IncreasedAccuracy | 36 | 5 | 1010 | LocalIncreasedAccuracy5 |
| one_hand_axes | prefix | IncreasedAccuracy | 18 | 7 | 1008 | LocalIncreasedAccuracy3 |
| one_hand_axes | prefix | LightningDamage | 60 | 4 | 558 | LocalAddedLightningDamage7 |
| one_hand_axes | prefix | LightningDamage | 46 | 6 | 556 | LocalAddedLightningDamage5 |
| one_hand_axes | prefix | LightningDamage | 8 | 9 | 553 | LocalAddedLightningDamage2 |
| one_hand_axes | prefix | PhysicalDamage | 60 | 3 | 500 | LocalAddedPhysicalDamage7 |
| one_hand_axes | prefix | PhysicalDamage | 46 | 5 | 498 | LocalAddedPhysicalDamage5 |
| one_hand_axes | prefix | PhysicalDamage | 8 | 8 | 495 | LocalAddedPhysicalDamage2 |
| one_hand_axes | suffix | CriticalStrikeChanceIncrease | 44 | 3 | 1033 | LocalCriticalStrikeChance4 |
| one_hand_axes | suffix | CriticalStrikeChanceIncrease | 30 | 4 | 1032 | LocalCriticalStrikeChance3 |
| one_hand_axes | suffix | CriticalStrikeChanceIncrease | 20 | 5 | 1031 | LocalCriticalStrikeChance2 |
| one_hand_axes | suffix | IncreasedAttackSpeed | 60 | 2 | 966 | LocalIncreasedAttackSpeed7 |
| one_hand_axes | suffix | IncreasedAttackSpeed | 37 | 4 | 964 | LocalIncreasedAttackSpeed5 |
| one_hand_axes | suffix | IncreasedAttackSpeed | 30 | 5 | 963 | LocalIncreasedAttackSpeed4 |
| one_hand_axes | suffix | IncreasedAttackSpeed | 22 | 6 | 962 | LocalIncreasedAttackSpeed3 |
| one_hand_axes | suffix | IncreasedAttackSpeed | 11 | 7 | 961 | LocalIncreasedAttackSpeed2 |
| one_hand_axes | suffix | Strength | 55 | 3 | 5 | Strength6 |
| one_hand_axes | suffix | Strength | 33 | 5 | 3 | Strength4 |
| one_hand_axes | suffix | Strength | 11 | 7 | 1 | Strength2 |
| one_hand_maces | prefix | ColdDamage | 60 | 4 | 538 | LocalAddedColdDamage7 |
| one_hand_maces | prefix | ColdDamage | 46 | 6 | 536 | LocalAddedColdDamage5 |
| one_hand_maces | prefix | ColdDamage | 8 | 9 | 533 | LocalAddedColdDamage2 |
| one_hand_maces | prefix | FireDamage | 60 | 4 | 518 | LocalAddedFireDamage7 |
| one_hand_maces | prefix | FireDamage | 46 | 6 | 516 | LocalAddedFireDamage5 |
| one_hand_maces | prefix | FireDamage | 8 | 9 | 513 | LocalAddedFireDamage2 |
| one_hand_maces | prefix | IncreasedAccuracy | 58 | 3 | 1012 | LocalIncreasedAccuracy7 |
| one_hand_maces | prefix | IncreasedAccuracy | 36 | 5 | 1010 | LocalIncreasedAccuracy5 |
| one_hand_maces | prefix | IncreasedAccuracy | 18 | 7 | 1008 | LocalIncreasedAccuracy3 |
| one_hand_maces | prefix | LightningDamage | 60 | 4 | 558 | LocalAddedLightningDamage7 |
| one_hand_maces | prefix | LightningDamage | 46 | 6 | 556 | LocalAddedLightningDamage5 |
| one_hand_maces | prefix | LightningDamage | 8 | 9 | 553 | LocalAddedLightningDamage2 |
| one_hand_maces | prefix | PhysicalDamage | 60 | 3 | 500 | LocalAddedPhysicalDamage7 |
| one_hand_maces | prefix | PhysicalDamage | 46 | 5 | 498 | LocalAddedPhysicalDamage5 |
| one_hand_maces | prefix | PhysicalDamage | 8 | 8 | 495 | LocalAddedPhysicalDamage2 |
| one_hand_maces | suffix | CriticalStrikeChanceIncrease | 44 | 3 | 1033 | LocalCriticalStrikeChance4 |
| one_hand_maces | suffix | CriticalStrikeChanceIncrease | 30 | 4 | 1032 | LocalCriticalStrikeChance3 |
| one_hand_maces | suffix | CriticalStrikeChanceIncrease | 20 | 5 | 1031 | LocalCriticalStrikeChance2 |
| one_hand_maces | suffix | IncreasedAttackSpeed | 60 | 2 | 966 | LocalIncreasedAttackSpeed7 |
| one_hand_maces | suffix | IncreasedAttackSpeed | 37 | 4 | 964 | LocalIncreasedAttackSpeed5 |
| one_hand_maces | suffix | IncreasedAttackSpeed | 30 | 5 | 963 | LocalIncreasedAttackSpeed4 |
| one_hand_maces | suffix | IncreasedAttackSpeed | 22 | 6 | 962 | LocalIncreasedAttackSpeed3 |
| one_hand_maces | suffix | IncreasedAttackSpeed | 11 | 7 | 961 | LocalIncreasedAttackSpeed2 |
| one_hand_maces | suffix | Strength | 55 | 3 | 5 | Strength6 |
| one_hand_maces | suffix | Strength | 33 | 5 | 3 | Strength4 |
| one_hand_maces | suffix | Strength | 11 | 7 | 1 | Strength2 |
| one_hand_swords | prefix | ColdDamage | 60 | 4 | 538 | LocalAddedColdDamage7 |
| one_hand_swords | prefix | ColdDamage | 46 | 6 | 536 | LocalAddedColdDamage5 |
| one_hand_swords | prefix | ColdDamage | 8 | 9 | 533 | LocalAddedColdDamage2 |
| one_hand_swords | prefix | FireDamage | 60 | 4 | 518 | LocalAddedFireDamage7 |
| one_hand_swords | prefix | FireDamage | 46 | 6 | 516 | LocalAddedFireDamage5 |
| one_hand_swords | prefix | FireDamage | 8 | 9 | 513 | LocalAddedFireDamage2 |
| one_hand_swords | prefix | IncreasedAccuracy | 58 | 3 | 1012 | LocalIncreasedAccuracy7 |
| one_hand_swords | prefix | IncreasedAccuracy | 36 | 5 | 1010 | LocalIncreasedAccuracy5 |
| one_hand_swords | prefix | IncreasedAccuracy | 18 | 7 | 1008 | LocalIncreasedAccuracy3 |
| one_hand_swords | prefix | LightningDamage | 60 | 4 | 558 | LocalAddedLightningDamage7 |
| one_hand_swords | prefix | LightningDamage | 46 | 6 | 556 | LocalAddedLightningDamage5 |
| one_hand_swords | prefix | LightningDamage | 8 | 9 | 553 | LocalAddedLightningDamage2 |
| one_hand_swords | prefix | PhysicalDamage | 60 | 3 | 500 | LocalAddedPhysicalDamage7 |
| one_hand_swords | prefix | PhysicalDamage | 46 | 5 | 498 | LocalAddedPhysicalDamage5 |
| one_hand_swords | prefix | PhysicalDamage | 8 | 8 | 495 | LocalAddedPhysicalDamage2 |
| one_hand_swords | suffix | CriticalStrikeChanceIncrease | 44 | 3 | 1033 | LocalCriticalStrikeChance4 |
| one_hand_swords | suffix | CriticalStrikeChanceIncrease | 30 | 4 | 1032 | LocalCriticalStrikeChance3 |
| one_hand_swords | suffix | CriticalStrikeChanceIncrease | 20 | 5 | 1031 | LocalCriticalStrikeChance2 |
| one_hand_swords | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| one_hand_swords | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| one_hand_swords | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| one_hand_swords | suffix | IncreasedAttackSpeed | 60 | 2 | 966 | LocalIncreasedAttackSpeed7 |
| one_hand_swords | suffix | IncreasedAttackSpeed | 37 | 4 | 964 | LocalIncreasedAttackSpeed5 |
| one_hand_swords | suffix | IncreasedAttackSpeed | 30 | 5 | 963 | LocalIncreasedAttackSpeed4 |
| one_hand_swords | suffix | IncreasedAttackSpeed | 22 | 6 | 962 | LocalIncreasedAttackSpeed3 |
| one_hand_swords | suffix | IncreasedAttackSpeed | 11 | 7 | 961 | LocalIncreasedAttackSpeed2 |
| one_hand_swords | suffix | Strength | 55 | 3 | 5 | Strength6 |
| one_hand_swords | suffix | Strength | 33 | 5 | 3 | Strength4 |
| one_hand_swords | suffix | Strength | 11 | 7 | 1 | Strength2 |
| quarterstaves | prefix | ColdDamage | 60 | 4 | 548 | LocalAddedColdDamageTwoHand7 |
| quarterstaves | prefix | ColdDamage | 46 | 6 | 546 | LocalAddedColdDamageTwoHand5 |
| quarterstaves | prefix | ColdDamage | 8 | 9 | 543 | LocalAddedColdDamageTwoHand2 |
| quarterstaves | prefix | FireDamage | 60 | 4 | 528 | LocalAddedFireDamageTwoHand7 |
| quarterstaves | prefix | FireDamage | 46 | 6 | 526 | LocalAddedFireDamageTwoHand5 |
| quarterstaves | prefix | FireDamage | 8 | 9 | 523 | LocalAddedFireDamageTwoHand2 |
| quarterstaves | prefix | IncreasedAccuracy | 58 | 3 | 1012 | LocalIncreasedAccuracy7 |
| quarterstaves | prefix | IncreasedAccuracy | 36 | 5 | 1010 | LocalIncreasedAccuracy5 |
| quarterstaves | prefix | IncreasedAccuracy | 18 | 7 | 1008 | LocalIncreasedAccuracy3 |
| quarterstaves | prefix | LightningDamage | 60 | 4 | 568 | LocalAddedLightningDamageTwoHand7 |
| quarterstaves | prefix | LightningDamage | 46 | 6 | 566 | LocalAddedLightningDamageTwoHand5 |
| quarterstaves | prefix | LightningDamage | 8 | 9 | 563 | LocalAddedLightningDamageTwoHand2 |
| quarterstaves | prefix | PhysicalDamage | 60 | 3 | 509 | LocalAddedPhysicalDamageTwoHand7 |
| quarterstaves | prefix | PhysicalDamage | 46 | 5 | 507 | LocalAddedPhysicalDamageTwoHand5 |
| quarterstaves | prefix | PhysicalDamage | 8 | 8 | 504 | LocalAddedPhysicalDamageTwoHand2 |
| quarterstaves | suffix | CriticalStrikeChanceIncrease | 44 | 3 | 1033 | LocalCriticalStrikeChance4 |
| quarterstaves | suffix | CriticalStrikeChanceIncrease | 30 | 4 | 1032 | LocalCriticalStrikeChance3 |
| quarterstaves | suffix | CriticalStrikeChanceIncrease | 20 | 5 | 1031 | LocalCriticalStrikeChance2 |
| quarterstaves | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| quarterstaves | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| quarterstaves | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| quarterstaves | suffix | IncreasedAttackSpeed | 60 | 2 | 966 | LocalIncreasedAttackSpeed7 |
| quarterstaves | suffix | IncreasedAttackSpeed | 37 | 4 | 964 | LocalIncreasedAttackSpeed5 |
| quarterstaves | suffix | IncreasedAttackSpeed | 30 | 5 | 963 | LocalIncreasedAttackSpeed4 |
| quarterstaves | suffix | IncreasedAttackSpeed | 22 | 6 | 962 | LocalIncreasedAttackSpeed3 |
| quarterstaves | suffix | IncreasedAttackSpeed | 11 | 7 | 961 | LocalIncreasedAttackSpeed2 |
| quarterstaves | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| quarterstaves | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| quarterstaves | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| quivers | prefix | DamageWithWeaponTypeSkill | 60 | 2 | 1431 | DamageWithBows5 |
| quivers | prefix | IncreasedAccuracy | 58 | 3 | 1003 | IncreasedAccuracy7 |
| quivers | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| quivers | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| quivers | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| rings | prefix | IncreasedAccuracy | 58 | 2 | 1003 | IncreasedAccuracy7 |
| rings | prefix | IncreasedLife | 54 | 1 | 85 | IncreasedLife8 |
| rings | prefix | IncreasedLife | 46 | 2 | 84 | IncreasedLife7 |
| rings | prefix | IncreasedLife | 38 | 3 | 83 | IncreasedLife6 |
| rings | prefix | IncreasedLife | 16 | 6 | 80 | IncreasedLife3 |
| rings | prefix | IncreasedLife | 6 | 7 | 79 | IncreasedLife2 |
| rings | prefix | IncreasedMana | 54 | 5 | 101 | IncreasedMana8 |
| rings | prefix | IncreasedMana | 46 | 6 | 100 | IncreasedMana7 |
| rings | prefix | IncreasedMana | 38 | 7 | 99 | IncreasedMana6 |
| rings | prefix | IncreasedMana | 16 | 10 | 96 | IncreasedMana3 |
| rings | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| rings | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| rings | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| rings | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| rings | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| rings | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| rings | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| rings | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| rings | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| rings | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| rings | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| rings | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| rings | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| rings | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| rings | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| rings | suffix | ItemFoundRarityIncrease | 40 | 1 | 1112 | ItemFoundRarityIncrease3 |
| rings | suffix | ItemFoundRarityIncrease | 24 | 2 | 1111 | ItemFoundRarityIncrease2 |
| rings | suffix | ItemFoundRarityIncrease | 3 | 3 | 1110 | ItemFoundRarityIncrease1 |
| rings | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| rings | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| rings | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| rings | suffix | ManaRegeneration | 55 | 2 | 904 | ManaRegeneration5 |
| rings | suffix | Strength | 55 | 3 | 5 | Strength6 |
| rings | suffix | Strength | 33 | 5 | 3 | Strength4 |
| rings | suffix | Strength | 11 | 7 | 1 | Strength2 |
| sceptres | prefix | AllDamage | 60 | 3 | 630 | NearbyAlliesAllDamage6 |
| sceptres | prefix | AllDamage | 33 | 5 | 628 | NearbyAlliesAllDamage4 |
| sceptres | prefix | AllDamage | 8 | 7 | 626 | NearbyAlliesAllDamage2 |
| sceptres | prefix | IncreasedMana | 54 | 4 | 101 | IncreasedMana8 |
| sceptres | prefix | IncreasedMana | 46 | 5 | 100 | IncreasedMana7 |
| sceptres | prefix | IncreasedMana | 38 | 6 | 99 | IncreasedMana6 |
| sceptres | prefix | IncreasedMana | 16 | 9 | 96 | IncreasedMana3 |
| sceptres | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| sceptres | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| sceptres | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| sceptres | suffix | ManaRegeneration | 55 | 2 | 904 | ManaRegeneration5 |
| sceptres | suffix | Strength | 55 | 3 | 5 | Strength6 |
| sceptres | suffix | Strength | 33 | 5 | 3 | Strength4 |
| sceptres | suffix | Strength | 11 | 7 | 1 | Strength2 |
| shields_str | prefix | DefencesPercent | 54 | 4 | 233 | LocalIncreasedPhysicalDamageReductionRatingPercent5 |
| shields_str | prefix | DefencesPercent | 46 | 5 | 232 | LocalIncreasedPhysicalDamageReductionRatingPercent4 |
| shields_str | prefix | DefencesPercent | 16 | 7 | 230 | LocalIncreasedPhysicalDamageReductionRatingPercent2 |
| shields_str | prefix | IncreasedLife | 54 | 4 | 85 | IncreasedLife8 |
| shields_str | prefix | IncreasedLife | 46 | 5 | 84 | IncreasedLife7 |
| shields_str | prefix | IncreasedLife | 38 | 6 | 83 | IncreasedLife6 |
| shields_str | prefix | IncreasedLife | 16 | 9 | 80 | IncreasedLife3 |
| shields_str | prefix | IncreasedLife | 6 | 10 | 79 | IncreasedLife2 |
| shields_str | prefix | IncreasedShieldBlockPercentage | 33 | 2 | 1130 | LocalBlockChance2 |
| shields_str | prefix | Thorns | 63 | 2 | 456 | AttackerTakesDamage6 |
| shields_str | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| shields_str | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| shields_str | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| shields_str | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| shields_str | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| shields_str | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| shields_str | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| shields_str | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| shields_str | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| shields_str | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| shields_str | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| shields_str | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| shields_str | suffix | Strength | 55 | 3 | 5 | Strength6 |
| shields_str | suffix | Strength | 33 | 5 | 3 | Strength4 |
| shields_str | suffix | Strength | 11 | 7 | 1 | Strength2 |
| shields_str | suffix | StunThreshold | 72 | 1 | 443 | StunThreshold10 |
| shields_str_dex | prefix | DefencesPercent | 54 | 4 | 257 | LocalIncreasedArmourAndEvasion5 |
| shields_str_dex | prefix | DefencesPercent | 46 | 5 | 256 | LocalIncreasedArmourAndEvasion4 |
| shields_str_dex | prefix | DefencesPercent | 16 | 7 | 254 | LocalIncreasedArmourAndEvasion2 |
| shields_str_dex | prefix | IncreasedLife | 54 | 4 | 85 | IncreasedLife8 |
| shields_str_dex | prefix | IncreasedLife | 46 | 5 | 84 | IncreasedLife7 |
| shields_str_dex | prefix | IncreasedLife | 38 | 6 | 83 | IncreasedLife6 |
| shields_str_dex | prefix | IncreasedLife | 16 | 9 | 80 | IncreasedLife3 |
| shields_str_dex | prefix | IncreasedLife | 6 | 10 | 79 | IncreasedLife2 |
| shields_str_dex | prefix | IncreasedShieldBlockPercentage | 33 | 2 | 1130 | LocalBlockChance2 |
| shields_str_dex | prefix | Thorns | 63 | 2 | 456 | AttackerTakesDamage6 |
| shields_str_dex | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| shields_str_dex | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| shields_str_dex | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| shields_str_dex | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| shields_str_dex | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| shields_str_dex | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| shields_str_dex | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| shields_str_dex | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| shields_str_dex | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| shields_str_dex | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| shields_str_dex | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| shields_str_dex | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| shields_str_dex | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| shields_str_dex | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| shields_str_dex | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| shields_str_dex | suffix | Strength | 55 | 3 | 5 | Strength6 |
| shields_str_dex | suffix | Strength | 33 | 5 | 3 | Strength4 |
| shields_str_dex | suffix | Strength | 11 | 7 | 1 | Strength2 |
| shields_str_dex | suffix | StunThreshold | 72 | 1 | 443 | StunThreshold10 |
| shields_str_int | prefix | DefencesPercent | 54 | 4 | 265 | LocalIncreasedArmourAndEnergyShield5 |
| shields_str_int | prefix | DefencesPercent | 46 | 5 | 264 | LocalIncreasedArmourAndEnergyShield4 |
| shields_str_int | prefix | DefencesPercent | 16 | 7 | 262 | LocalIncreasedArmourAndEnergyShield2 |
| shields_str_int | prefix | IncreasedLife | 54 | 4 | 85 | IncreasedLife8 |
| shields_str_int | prefix | IncreasedLife | 46 | 5 | 84 | IncreasedLife7 |
| shields_str_int | prefix | IncreasedLife | 38 | 6 | 83 | IncreasedLife6 |
| shields_str_int | prefix | IncreasedLife | 16 | 9 | 80 | IncreasedLife3 |
| shields_str_int | prefix | IncreasedLife | 6 | 10 | 79 | IncreasedLife2 |
| shields_str_int | prefix | IncreasedShieldBlockPercentage | 33 | 2 | 1130 | LocalBlockChance2 |
| shields_str_int | prefix | Thorns | 63 | 2 | 456 | AttackerTakesDamage6 |
| shields_str_int | suffix | ChaosResistance | 56 | 3 | 75 | ChaosResist4 |
| shields_str_int | suffix | ChaosResistance | 30 | 5 | 73 | ChaosResist2 |
| shields_str_int | suffix | ChaosResistance | 16 | 6 | 72 | ChaosResist1 |
| shields_str_int | suffix | ColdResistance | 60 | 3 | 49 | ColdResist6 |
| shields_str_int | suffix | ColdResistance | 38 | 5 | 47 | ColdResist4 |
| shields_str_int | suffix | ColdResistance | 14 | 7 | 45 | ColdResist2 |
| shields_str_int | suffix | EnergyShieldRegeneration | 66 | 2 | 1218 | EnergyShieldRechargeRate5______ |
| shields_str_int | suffix | FireResistance | 60 | 3 | 41 | FireResist6 |
| shields_str_int | suffix | FireResistance | 36 | 5 | 39 | FireResist4 |
| shields_str_int | suffix | FireResistance | 12 | 7 | 37 | FireResist2 |
| shields_str_int | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| shields_str_int | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| shields_str_int | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| shields_str_int | suffix | LightningResistance | 60 | 3 | 57 | LightningResist6 |
| shields_str_int | suffix | LightningResistance | 37 | 5 | 55 | LightningResist4 |
| shields_str_int | suffix | LightningResistance | 13 | 7 | 53 | LightningResist2 |
| shields_str_int | suffix | Strength | 55 | 3 | 5 | Strength6 |
| shields_str_int | suffix | Strength | 33 | 5 | 3 | Strength4 |
| shields_str_int | suffix | Strength | 11 | 7 | 1 | Strength2 |
| shields_str_int | suffix | StunThreshold | 72 | 1 | 443 | StunThreshold10 |
| spears | prefix | ColdDamage | 60 | 4 | 538 | LocalAddedColdDamage7 |
| spears | prefix | ColdDamage | 46 | 6 | 536 | LocalAddedColdDamage5 |
| spears | prefix | ColdDamage | 8 | 9 | 533 | LocalAddedColdDamage2 |
| spears | prefix | FireDamage | 60 | 4 | 518 | LocalAddedFireDamage7 |
| spears | prefix | FireDamage | 46 | 6 | 516 | LocalAddedFireDamage5 |
| spears | prefix | FireDamage | 8 | 9 | 513 | LocalAddedFireDamage2 |
| spears | prefix | IncreasedAccuracy | 58 | 3 | 1012 | LocalIncreasedAccuracy7 |
| spears | prefix | IncreasedAccuracy | 36 | 5 | 1010 | LocalIncreasedAccuracy5 |
| spears | prefix | IncreasedAccuracy | 18 | 7 | 1008 | LocalIncreasedAccuracy3 |
| spears | prefix | LightningDamage | 60 | 4 | 558 | LocalAddedLightningDamage7 |
| spears | prefix | LightningDamage | 46 | 6 | 556 | LocalAddedLightningDamage5 |
| spears | prefix | LightningDamage | 8 | 9 | 553 | LocalAddedLightningDamage2 |
| spears | prefix | PhysicalDamage | 60 | 3 | 500 | LocalAddedPhysicalDamage7 |
| spears | prefix | PhysicalDamage | 46 | 5 | 498 | LocalAddedPhysicalDamage5 |
| spears | prefix | PhysicalDamage | 8 | 8 | 495 | LocalAddedPhysicalDamage2 |
| spears | suffix | CriticalStrikeChanceIncrease | 44 | 3 | 1033 | LocalCriticalStrikeChance4 |
| spears | suffix | CriticalStrikeChanceIncrease | 30 | 4 | 1032 | LocalCriticalStrikeChance3 |
| spears | suffix | CriticalStrikeChanceIncrease | 20 | 5 | 1031 | LocalCriticalStrikeChance2 |
| spears | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| spears | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| spears | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| spears | suffix | IncreasedAttackSpeed | 60 | 2 | 966 | LocalIncreasedAttackSpeed7 |
| spears | suffix | IncreasedAttackSpeed | 37 | 4 | 964 | LocalIncreasedAttackSpeed5 |
| spears | suffix | IncreasedAttackSpeed | 30 | 5 | 963 | LocalIncreasedAttackSpeed4 |
| spears | suffix | IncreasedAttackSpeed | 22 | 6 | 962 | LocalIncreasedAttackSpeed3 |
| spears | suffix | IncreasedAttackSpeed | 11 | 7 | 961 | LocalIncreasedAttackSpeed2 |
| spears | suffix | Strength | 55 | 3 | 5 | Strength6 |
| spears | suffix | Strength | 33 | 5 | 3 | Strength4 |
| spears | suffix | Strength | 11 | 7 | 1 | Strength2 |
| staves | prefix | WeaponCasterDamagePrefix | 60 | 3 | 647 | SpellDamageOnTwoHandWeapon6 |
| staves | prefix | WeaponCasterDamagePrefix | 33 | 5 | 645 | SpellDamageOnTwoHandWeapon4 |
| staves | prefix | WeaponCasterDamagePrefix | 8 | 7 | 643 | SpellDamageOnTwoHandWeapon2 |
| staves | suffix | IncreasedCastSpeed | 60 | 3 | 983 | IncreasedCastSpeedTwoHand5 |
| staves | suffix | IncreasedCastSpeed | 30 | 5 | 981 | IncreasedCastSpeedTwoHand3 |
| staves | suffix | IncreasedCastSpeed | 15 | 6 | 980 | IncreasedCastSpeedTwoHand2 |
| staves | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| staves | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| staves | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| staves | suffix | SpellCriticalStrikeChanceIncrease | 41 | 3 | 1045 | SpellCriticalStrikeChanceTwoHand4 |
| staves | suffix | SpellCriticalStrikeChanceIncrease | 28 | 4 | 1044 | SpellCriticalStrikeChanceTwoHand3 |
| staves | suffix | SpellCriticalStrikeChanceIncrease | 21 | 5 | 1043 | SpellCriticalStrikeChanceTwoHand2 |
| two_hand_axes | prefix | ColdDamage | 60 | 4 | 548 | LocalAddedColdDamageTwoHand7 |
| two_hand_axes | prefix | ColdDamage | 46 | 6 | 546 | LocalAddedColdDamageTwoHand5 |
| two_hand_axes | prefix | ColdDamage | 8 | 9 | 543 | LocalAddedColdDamageTwoHand2 |
| two_hand_axes | prefix | FireDamage | 60 | 4 | 528 | LocalAddedFireDamageTwoHand7 |
| two_hand_axes | prefix | FireDamage | 46 | 6 | 526 | LocalAddedFireDamageTwoHand5 |
| two_hand_axes | prefix | FireDamage | 8 | 9 | 523 | LocalAddedFireDamageTwoHand2 |
| two_hand_axes | prefix | IncreasedAccuracy | 58 | 3 | 1012 | LocalIncreasedAccuracy7 |
| two_hand_axes | prefix | IncreasedAccuracy | 36 | 5 | 1010 | LocalIncreasedAccuracy5 |
| two_hand_axes | prefix | IncreasedAccuracy | 18 | 7 | 1008 | LocalIncreasedAccuracy3 |
| two_hand_axes | prefix | LightningDamage | 60 | 4 | 568 | LocalAddedLightningDamageTwoHand7 |
| two_hand_axes | prefix | LightningDamage | 46 | 6 | 566 | LocalAddedLightningDamageTwoHand5 |
| two_hand_axes | prefix | LightningDamage | 8 | 9 | 563 | LocalAddedLightningDamageTwoHand2 |
| two_hand_axes | prefix | PhysicalDamage | 60 | 3 | 509 | LocalAddedPhysicalDamageTwoHand7 |
| two_hand_axes | prefix | PhysicalDamage | 46 | 5 | 507 | LocalAddedPhysicalDamageTwoHand5 |
| two_hand_axes | prefix | PhysicalDamage | 8 | 8 | 504 | LocalAddedPhysicalDamageTwoHand2 |
| two_hand_axes | suffix | CriticalStrikeChanceIncrease | 44 | 3 | 1033 | LocalCriticalStrikeChance4 |
| two_hand_axes | suffix | CriticalStrikeChanceIncrease | 30 | 4 | 1032 | LocalCriticalStrikeChance3 |
| two_hand_axes | suffix | CriticalStrikeChanceIncrease | 20 | 5 | 1031 | LocalCriticalStrikeChance2 |
| two_hand_axes | suffix | IncreasedAttackSpeed | 60 | 2 | 966 | LocalIncreasedAttackSpeed7 |
| two_hand_axes | suffix | IncreasedAttackSpeed | 37 | 4 | 964 | LocalIncreasedAttackSpeed5 |
| two_hand_axes | suffix | IncreasedAttackSpeed | 30 | 5 | 963 | LocalIncreasedAttackSpeed4 |
| two_hand_axes | suffix | IncreasedAttackSpeed | 22 | 6 | 962 | LocalIncreasedAttackSpeed3 |
| two_hand_axes | suffix | IncreasedAttackSpeed | 11 | 7 | 961 | LocalIncreasedAttackSpeed2 |
| two_hand_axes | suffix | Strength | 55 | 3 | 5 | Strength6 |
| two_hand_axes | suffix | Strength | 33 | 5 | 3 | Strength4 |
| two_hand_axes | suffix | Strength | 11 | 7 | 1 | Strength2 |
| two_hand_maces | prefix | ColdDamage | 60 | 4 | 548 | LocalAddedColdDamageTwoHand7 |
| two_hand_maces | prefix | ColdDamage | 46 | 6 | 546 | LocalAddedColdDamageTwoHand5 |
| two_hand_maces | prefix | ColdDamage | 8 | 9 | 543 | LocalAddedColdDamageTwoHand2 |
| two_hand_maces | prefix | FireDamage | 60 | 4 | 528 | LocalAddedFireDamageTwoHand7 |
| two_hand_maces | prefix | FireDamage | 46 | 6 | 526 | LocalAddedFireDamageTwoHand5 |
| two_hand_maces | prefix | FireDamage | 8 | 9 | 523 | LocalAddedFireDamageTwoHand2 |
| two_hand_maces | prefix | IncreasedAccuracy | 58 | 3 | 1012 | LocalIncreasedAccuracy7 |
| two_hand_maces | prefix | IncreasedAccuracy | 36 | 5 | 1010 | LocalIncreasedAccuracy5 |
| two_hand_maces | prefix | IncreasedAccuracy | 18 | 7 | 1008 | LocalIncreasedAccuracy3 |
| two_hand_maces | prefix | LightningDamage | 60 | 4 | 568 | LocalAddedLightningDamageTwoHand7 |
| two_hand_maces | prefix | LightningDamage | 46 | 6 | 566 | LocalAddedLightningDamageTwoHand5 |
| two_hand_maces | prefix | LightningDamage | 8 | 9 | 563 | LocalAddedLightningDamageTwoHand2 |
| two_hand_maces | prefix | PhysicalDamage | 60 | 3 | 509 | LocalAddedPhysicalDamageTwoHand7 |
| two_hand_maces | prefix | PhysicalDamage | 46 | 5 | 507 | LocalAddedPhysicalDamageTwoHand5 |
| two_hand_maces | prefix | PhysicalDamage | 8 | 8 | 504 | LocalAddedPhysicalDamageTwoHand2 |
| two_hand_maces | suffix | CriticalStrikeChanceIncrease | 44 | 3 | 1033 | LocalCriticalStrikeChance4 |
| two_hand_maces | suffix | CriticalStrikeChanceIncrease | 30 | 4 | 1032 | LocalCriticalStrikeChance3 |
| two_hand_maces | suffix | CriticalStrikeChanceIncrease | 20 | 5 | 1031 | LocalCriticalStrikeChance2 |
| two_hand_maces | suffix | IncreasedAttackSpeed | 60 | 2 | 966 | LocalIncreasedAttackSpeed7 |
| two_hand_maces | suffix | IncreasedAttackSpeed | 37 | 4 | 964 | LocalIncreasedAttackSpeed5 |
| two_hand_maces | suffix | IncreasedAttackSpeed | 30 | 5 | 963 | LocalIncreasedAttackSpeed4 |
| two_hand_maces | suffix | IncreasedAttackSpeed | 22 | 6 | 962 | LocalIncreasedAttackSpeed3 |
| two_hand_maces | suffix | IncreasedAttackSpeed | 11 | 7 | 961 | LocalIncreasedAttackSpeed2 |
| two_hand_maces | suffix | Strength | 55 | 3 | 5 | Strength6 |
| two_hand_maces | suffix | Strength | 33 | 5 | 3 | Strength4 |
| two_hand_maces | suffix | Strength | 11 | 7 | 1 | Strength2 |
| two_hand_swords | prefix | ColdDamage | 60 | 4 | 548 | LocalAddedColdDamageTwoHand7 |
| two_hand_swords | prefix | ColdDamage | 46 | 6 | 546 | LocalAddedColdDamageTwoHand5 |
| two_hand_swords | prefix | ColdDamage | 8 | 9 | 543 | LocalAddedColdDamageTwoHand2 |
| two_hand_swords | prefix | FireDamage | 60 | 4 | 528 | LocalAddedFireDamageTwoHand7 |
| two_hand_swords | prefix | FireDamage | 46 | 6 | 526 | LocalAddedFireDamageTwoHand5 |
| two_hand_swords | prefix | FireDamage | 8 | 9 | 523 | LocalAddedFireDamageTwoHand2 |
| two_hand_swords | prefix | IncreasedAccuracy | 58 | 3 | 1012 | LocalIncreasedAccuracy7 |
| two_hand_swords | prefix | IncreasedAccuracy | 36 | 5 | 1010 | LocalIncreasedAccuracy5 |
| two_hand_swords | prefix | IncreasedAccuracy | 18 | 7 | 1008 | LocalIncreasedAccuracy3 |
| two_hand_swords | prefix | LightningDamage | 60 | 4 | 568 | LocalAddedLightningDamageTwoHand7 |
| two_hand_swords | prefix | LightningDamage | 46 | 6 | 566 | LocalAddedLightningDamageTwoHand5 |
| two_hand_swords | prefix | LightningDamage | 8 | 9 | 563 | LocalAddedLightningDamageTwoHand2 |
| two_hand_swords | prefix | PhysicalDamage | 60 | 3 | 509 | LocalAddedPhysicalDamageTwoHand7 |
| two_hand_swords | prefix | PhysicalDamage | 46 | 5 | 507 | LocalAddedPhysicalDamageTwoHand5 |
| two_hand_swords | prefix | PhysicalDamage | 8 | 8 | 504 | LocalAddedPhysicalDamageTwoHand2 |
| two_hand_swords | suffix | CriticalStrikeChanceIncrease | 44 | 3 | 1033 | LocalCriticalStrikeChance4 |
| two_hand_swords | suffix | CriticalStrikeChanceIncrease | 30 | 4 | 1032 | LocalCriticalStrikeChance3 |
| two_hand_swords | suffix | CriticalStrikeChanceIncrease | 20 | 5 | 1031 | LocalCriticalStrikeChance2 |
| two_hand_swords | suffix | Dexterity | 55 | 3 | 14 | Dexterity6 |
| two_hand_swords | suffix | Dexterity | 33 | 5 | 12 | Dexterity4 |
| two_hand_swords | suffix | Dexterity | 11 | 7 | 10 | Dexterity2 |
| two_hand_swords | suffix | IncreasedAttackSpeed | 60 | 2 | 966 | LocalIncreasedAttackSpeed7 |
| two_hand_swords | suffix | IncreasedAttackSpeed | 37 | 4 | 964 | LocalIncreasedAttackSpeed5 |
| two_hand_swords | suffix | IncreasedAttackSpeed | 30 | 5 | 963 | LocalIncreasedAttackSpeed4 |
| two_hand_swords | suffix | IncreasedAttackSpeed | 22 | 6 | 962 | LocalIncreasedAttackSpeed3 |
| two_hand_swords | suffix | IncreasedAttackSpeed | 11 | 7 | 961 | LocalIncreasedAttackSpeed2 |
| two_hand_swords | suffix | Strength | 55 | 3 | 5 | Strength6 |
| two_hand_swords | suffix | Strength | 33 | 5 | 3 | Strength4 |
| two_hand_swords | suffix | Strength | 11 | 7 | 1 | Strength2 |
| wands | prefix | IncreasedMana | 54 | 4 | 101 | IncreasedMana8 |
| wands | prefix | IncreasedMana | 46 | 5 | 100 | IncreasedMana7 |
| wands | prefix | IncreasedMana | 38 | 6 | 99 | IncreasedMana6 |
| wands | prefix | IncreasedMana | 16 | 9 | 96 | IncreasedMana3 |
| wands | prefix | WeaponCasterDamagePrefix | 60 | 3 | 639 | SpellDamageOnWeapon6 |
| wands | prefix | WeaponCasterDamagePrefix | 33 | 5 | 637 | SpellDamageOnWeapon4 |
| wands | prefix | WeaponCasterDamagePrefix | 8 | 7 | 635 | SpellDamageOnWeapon2 |
| wands | suffix | IncreasedCastSpeed | 60 | 3 | 976 | IncreasedCastSpeed5 |
| wands | suffix | IncreasedCastSpeed | 30 | 5 | 974 | IncreasedCastSpeed3 |
| wands | suffix | IncreasedCastSpeed | 15 | 6 | 973 | IncreasedCastSpeed2 |
| wands | suffix | Intelligence | 55 | 3 | 23 | Intelligence6 |
| wands | suffix | Intelligence | 33 | 5 | 21 | Intelligence4 |
| wands | suffix | Intelligence | 11 | 7 | 19 | Intelligence2 |
| wands | suffix | ManaRegeneration | 55 | 2 | 904 | ManaRegeneration5 |
| wands | suffix | SpellCriticalStrikeChanceIncrease | 41 | 3 | 1039 | SpellCriticalStrikeChance4 |
| wands | suffix | SpellCriticalStrikeChanceIncrease | 28 | 4 | 1038 | SpellCriticalStrikeChance3 |
| wands | suffix | SpellCriticalStrikeChanceIncrease | 21 | 5 | 1037 | SpellCriticalStrikeChance2 |

## All rows ambiguous in the former overlay

Count: **474**

| Pool | Affix | Legacy group | Required | Legacy tier | Former candidates | Correct stable ID | Strategy |
|---|---|---|---:|---:|---|---:|---|
| amulets | prefix | SpellDamage | 46 | 3 | 1352, 16233 | 1352 | coarse |
| amulets | suffix | IncreaseSocketedGemLevel | 75 | 1 | 761, 838, 854, 867 | 854 | semantic |
| amulets | suffix | IncreaseSocketedGemLevel | 75 | 2 | 761, 838, 854, 867 | 838 | semantic |
| amulets | suffix | IncreaseSocketedGemLevel | 75 | 3 | 761, 838, 854, 867 | 867 | semantic |
| amulets | suffix | IncreaseSocketedGemLevel | 75 | 4 | 761, 838, 854, 867 | 761 | semantic |
| amulets | suffix | IncreaseSocketedGemLevel | 41 | 5 | 760, 837, 853, 866 | 853 | semantic |
| amulets | suffix | IncreaseSocketedGemLevel | 41 | 6 | 760, 837, 853, 866 | 837 | semantic |
| amulets | suffix | IncreaseSocketedGemLevel | 41 | 7 | 760, 837, 853, 866 | 866 | semantic |
| amulets | suffix | IncreaseSocketedGemLevel | 41 | 8 | 760, 837, 853, 866 | 760 | semantic |
| amulets | suffix | IncreaseSocketedGemLevel | 5 | 10 | 852, 865 | 852 | semantic |
| amulets | suffix | IncreaseSocketedGemLevel | 5 | 11 | 852, 865 | 836 | semantic |
| amulets | suffix | IncreaseSocketedGemLevel | 5 | 12 | 852, 865 | 865 | semantic |
| body_armours_dex | prefix | IncreasedLife | 65 | 4 | 87, 16388 | 87 | coarse |
| body_armours_dex | suffix | ReducedAilmentDuration | 76 | 1 | 1163, 1168, 1173 | 1163 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 76 | 2 | 1163, 1168, 1173 | 1173 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 76 | 3 | 1163, 1168, 1173 | 1168 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 64 | 4 | 1162, 1167, 1172 | 1162 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 64 | 5 | 1162, 1167, 1172 | 1172 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 64 | 6 | 1162, 1167, 1172 | 1167 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 50 | 7 | 1161, 1166, 1171 | 1161 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 50 | 8 | 1161, 1166, 1171 | 1171 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 50 | 9 | 1161, 1166, 1171 | 1166 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 37 | 10 | 1160, 1165, 1170 | 1160 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 37 | 11 | 1160, 1165, 1170 | 1170 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 37 | 12 | 1160, 1165, 1170 | 1165 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 21 | 13 | 1159, 1164, 1169 | 1159 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 21 | 14 | 1159, 1164, 1169 | 1169 | semantic |
| body_armours_dex | suffix | ReducedAilmentDuration | 21 | 15 | 1159, 1164, 1169 | 1164 | semantic |
| body_armours_dex_int | prefix | IncreasedLife | 65 | 4 | 87, 16388 | 87 | coarse |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 76 | 1 | 1163, 1168, 1173 | 1163 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 76 | 2 | 1163, 1168, 1173 | 1173 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 76 | 3 | 1163, 1168, 1173 | 1168 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 64 | 4 | 1162, 1167, 1172 | 1162 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 64 | 5 | 1162, 1167, 1172 | 1172 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 64 | 6 | 1162, 1167, 1172 | 1167 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 50 | 7 | 1161, 1166, 1171 | 1161 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 50 | 8 | 1161, 1166, 1171 | 1171 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 50 | 9 | 1161, 1166, 1171 | 1166 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 37 | 10 | 1160, 1165, 1170 | 1160 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 37 | 11 | 1160, 1165, 1170 | 1170 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 37 | 12 | 1160, 1165, 1170 | 1165 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 21 | 13 | 1159, 1164, 1169 | 1159 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 21 | 14 | 1159, 1164, 1169 | 1169 | semantic |
| body_armours_dex_int | suffix | ReducedAilmentDuration | 21 | 15 | 1159, 1164, 1169 | 1164 | semantic |
| body_armours_int | prefix | IncreasedLife | 65 | 4 | 87, 16388 | 87 | coarse |
| body_armours_int | suffix | ReducedAilmentDuration | 76 | 1 | 1163, 1168, 1173 | 1163 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 76 | 2 | 1163, 1168, 1173 | 1173 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 76 | 3 | 1163, 1168, 1173 | 1168 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 64 | 4 | 1162, 1167, 1172 | 1162 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 64 | 5 | 1162, 1167, 1172 | 1172 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 64 | 6 | 1162, 1167, 1172 | 1167 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 50 | 7 | 1161, 1166, 1171 | 1161 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 50 | 8 | 1161, 1166, 1171 | 1171 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 50 | 9 | 1161, 1166, 1171 | 1166 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 37 | 10 | 1160, 1165, 1170 | 1160 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 37 | 11 | 1160, 1165, 1170 | 1170 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 37 | 12 | 1160, 1165, 1170 | 1165 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 21 | 13 | 1159, 1164, 1169 | 1159 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 21 | 14 | 1159, 1164, 1169 | 1169 | semantic |
| body_armours_int | suffix | ReducedAilmentDuration | 21 | 15 | 1159, 1164, 1169 | 1164 | semantic |
| body_armours_str | prefix | IncreasedLife | 65 | 4 | 87, 16388 | 87 | coarse |
| body_armours_str | suffix | ReducedAilmentDuration | 76 | 1 | 1163, 1168, 1173 | 1163 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 76 | 2 | 1163, 1168, 1173 | 1173 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 76 | 3 | 1163, 1168, 1173 | 1168 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 64 | 4 | 1162, 1167, 1172 | 1162 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 64 | 5 | 1162, 1167, 1172 | 1172 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 64 | 6 | 1162, 1167, 1172 | 1167 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 50 | 7 | 1161, 1166, 1171 | 1161 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 50 | 8 | 1161, 1166, 1171 | 1171 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 50 | 9 | 1161, 1166, 1171 | 1166 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 37 | 10 | 1160, 1165, 1170 | 1160 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 37 | 11 | 1160, 1165, 1170 | 1170 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 37 | 12 | 1160, 1165, 1170 | 1165 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 21 | 13 | 1159, 1164, 1169 | 1159 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 21 | 14 | 1159, 1164, 1169 | 1169 | semantic |
| body_armours_str | suffix | ReducedAilmentDuration | 21 | 15 | 1159, 1164, 1169 | 1164 | semantic |
| body_armours_str_dex | prefix | IncreasedLife | 65 | 4 | 87, 16388 | 87 | coarse |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 76 | 1 | 1163, 1168, 1173 | 1163 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 76 | 2 | 1163, 1168, 1173 | 1173 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 76 | 3 | 1163, 1168, 1173 | 1168 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 64 | 4 | 1162, 1167, 1172 | 1162 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 64 | 5 | 1162, 1167, 1172 | 1172 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 64 | 6 | 1162, 1167, 1172 | 1167 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 50 | 7 | 1161, 1166, 1171 | 1161 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 50 | 8 | 1161, 1166, 1171 | 1171 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 50 | 9 | 1161, 1166, 1171 | 1166 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 37 | 10 | 1160, 1165, 1170 | 1160 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 37 | 11 | 1160, 1165, 1170 | 1170 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 37 | 12 | 1160, 1165, 1170 | 1165 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 21 | 13 | 1159, 1164, 1169 | 1159 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 21 | 14 | 1159, 1164, 1169 | 1169 | semantic |
| body_armours_str_dex | suffix | ReducedAilmentDuration | 21 | 15 | 1159, 1164, 1169 | 1164 | semantic |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 79 | 1 | 182, 193, 204 | 182 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 79 | 2 | 182, 193, 204 | 193 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 79 | 3 | 182, 193, 204 | 204 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 75 | 4 | 181, 192, 212, 220, 228 | 181 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 75 | 5 | 181, 192, 212, 220, 228 | 212 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 75 | 6 | 181, 192, 212, 220, 228 | 220 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 75 | 7 | 181, 192, 212, 220, 228 | 192 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 75 | 8 | 181, 192, 212, 220, 228 | 228 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 65 | 10 | 180, 191, 202, 211, 219, 227 | 180 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 65 | 11 | 180, 191, 202, 211, 219, 227 | 211 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 65 | 12 | 180, 191, 202, 211, 219, 227 | 219 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 65 | 13 | 180, 191, 202, 211, 219, 227 | 191 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 65 | 14 | 180, 191, 202, 211, 219, 227 | 227 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 65 | 15 | 180, 191, 202, 211, 219, 227 | 202 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 60 | 16 | 179, 190, 201, 210, 218, 226 | 179 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 60 | 17 | 179, 190, 201, 210, 218, 226 | 210 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 60 | 18 | 179, 190, 201, 210, 218, 226 | 218 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 60 | 19 | 179, 190, 201, 210, 218, 226 | 190 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 60 | 20 | 179, 190, 201, 210, 218, 226 | 226 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 60 | 21 | 179, 190, 201, 210, 218, 226 | 201 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 54 | 22 | 178, 189, 200, 209, 217, 225 | 178 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 54 | 23 | 178, 189, 200, 209, 217, 225 | 209 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 54 | 24 | 178, 189, 200, 209, 217, 225 | 217 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 54 | 25 | 178, 189, 200, 209, 217, 225 | 189 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 54 | 26 | 178, 189, 200, 209, 217, 225 | 225 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 54 | 27 | 178, 189, 200, 209, 217, 225 | 200 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 46 | 28 | 177, 188, 199, 208, 216, 224 | 177 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 46 | 29 | 177, 188, 199, 208, 216, 224 | 208 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 46 | 30 | 177, 188, 199, 208, 216, 224 | 216 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 46 | 31 | 177, 188, 199, 208, 216, 224 | 188 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 46 | 32 | 177, 188, 199, 208, 216, 224 | 224 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 46 | 33 | 177, 188, 199, 208, 216, 224 | 199 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 33 | 34 | 176, 187, 198, 207, 215, 223 | 176 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 33 | 35 | 176, 187, 198, 207, 215, 223 | 207 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 33 | 36 | 176, 187, 198, 207, 215, 223 | 215 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 33 | 37 | 176, 187, 198, 207, 215, 223 | 187 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 33 | 38 | 176, 187, 198, 207, 215, 223 | 223 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 33 | 39 | 176, 187, 198, 207, 215, 223 | 198 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 25 | 40 | 175, 186, 197 | 175 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 25 | 41 | 175, 186, 197 | 186 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 25 | 42 | 175, 186, 197 | 197 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 16 | 43 | 174, 185, 196, 206, 214, 222 | 174 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 16 | 44 | 174, 185, 196, 206, 214, 222 | 206 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 16 | 45 | 174, 185, 196, 206, 214, 222 | 214 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 16 | 46 | 174, 185, 196, 206, 214, 222 | 185 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 16 | 47 | 174, 185, 196, 206, 214, 222 | 222 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 16 | 48 | 174, 185, 196, 206, 214, 222 | 196 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 8 | 49 | 173, 184, 195 | 173 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 8 | 50 | 173, 184, 195 | 184 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 8 | 51 | 173, 184, 195 | 195 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 1 | 52 | 172, 183, 194, 205, 213, 221 | 172 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 1 | 53 | 172, 183, 194, 205, 213, 221 | 205 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 1 | 54 | 172, 183, 194, 205, 213, 221 | 213 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 1 | 55 | 172, 183, 194, 205, 213, 221 | 183 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 1 | 56 | 172, 183, 194, 205, 213, 221 | 221 | range |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 1 | 57 | 172, 183, 194, 205, 213, 221 | 194 | range |
| body_armours_str_dex_int | prefix | IncreasedLife | 65 | 4 | 87, 16388 | 87 | coarse |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 76 | 1 | 1163, 1168, 1173 | 1163 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 76 | 2 | 1163, 1168, 1173 | 1173 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 76 | 3 | 1163, 1168, 1173 | 1168 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 64 | 4 | 1162, 1167, 1172 | 1162 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 64 | 5 | 1162, 1167, 1172 | 1172 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 64 | 6 | 1162, 1167, 1172 | 1167 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 50 | 7 | 1161, 1166, 1171 | 1161 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 50 | 8 | 1161, 1166, 1171 | 1171 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 50 | 9 | 1161, 1166, 1171 | 1166 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 37 | 10 | 1160, 1165, 1170 | 1160 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 37 | 11 | 1160, 1165, 1170 | 1170 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 37 | 12 | 1160, 1165, 1170 | 1165 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 21 | 13 | 1159, 1164, 1169 | 1159 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 21 | 14 | 1159, 1164, 1169 | 1169 | semantic |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 21 | 15 | 1159, 1164, 1169 | 1164 | semantic |
| body_armours_str_int | prefix | IncreasedLife | 65 | 4 | 87, 16388 | 87 | coarse |
| body_armours_str_int | suffix | ReducedAilmentDuration | 76 | 1 | 1163, 1168, 1173 | 1163 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 76 | 2 | 1163, 1168, 1173 | 1173 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 76 | 3 | 1163, 1168, 1173 | 1168 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 64 | 4 | 1162, 1167, 1172 | 1162 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 64 | 5 | 1162, 1167, 1172 | 1172 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 64 | 6 | 1162, 1167, 1172 | 1167 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 50 | 7 | 1161, 1166, 1171 | 1161 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 50 | 8 | 1161, 1166, 1171 | 1171 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 50 | 9 | 1161, 1166, 1171 | 1166 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 37 | 10 | 1160, 1165, 1170 | 1160 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 37 | 11 | 1160, 1165, 1170 | 1170 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 37 | 12 | 1160, 1165, 1170 | 1165 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 21 | 13 | 1159, 1164, 1169 | 1159 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 21 | 14 | 1159, 1164, 1169 | 1169 | semantic |
| body_armours_str_int | suffix | ReducedAilmentDuration | 21 | 15 | 1159, 1164, 1169 | 1164 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 75 | 1 | 1178, 1183, 1188 | 1183 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 75 | 2 | 1178, 1183, 1188 | 1188 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 75 | 3 | 1178, 1183, 1188 | 1178 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 63 | 4 | 1177, 1182, 1187 | 1182 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 63 | 5 | 1177, 1182, 1187 | 1187 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 63 | 6 | 1177, 1182, 1187 | 1177 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 49 | 7 | 1176, 1181, 1186 | 1181 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 49 | 8 | 1176, 1181, 1186 | 1186 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 49 | 9 | 1176, 1181, 1186 | 1176 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 36 | 10 | 1175, 1180, 1185 | 1180 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 36 | 11 | 1175, 1180, 1185 | 1185 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 36 | 12 | 1175, 1180, 1185 | 1175 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 20 | 13 | 1174, 1179, 1184 | 1179 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 20 | 14 | 1174, 1179, 1184 | 1184 | semantic |
| boots_dex | suffix | ReducedAilmentDuration | 20 | 15 | 1174, 1179, 1184 | 1174 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 75 | 1 | 1178, 1183, 1188 | 1183 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 75 | 2 | 1178, 1183, 1188 | 1188 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 75 | 3 | 1178, 1183, 1188 | 1178 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 63 | 4 | 1177, 1182, 1187 | 1182 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 63 | 5 | 1177, 1182, 1187 | 1187 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 63 | 6 | 1177, 1182, 1187 | 1177 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 49 | 7 | 1176, 1181, 1186 | 1181 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 49 | 8 | 1176, 1181, 1186 | 1186 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 49 | 9 | 1176, 1181, 1186 | 1176 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 36 | 10 | 1175, 1180, 1185 | 1180 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 36 | 11 | 1175, 1180, 1185 | 1185 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 36 | 12 | 1175, 1180, 1185 | 1175 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 20 | 13 | 1174, 1179, 1184 | 1179 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 20 | 14 | 1174, 1179, 1184 | 1184 | semantic |
| boots_dex_int | suffix | ReducedAilmentDuration | 20 | 15 | 1174, 1179, 1184 | 1174 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 75 | 1 | 1178, 1183, 1188 | 1183 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 75 | 2 | 1178, 1183, 1188 | 1188 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 75 | 3 | 1178, 1183, 1188 | 1178 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 63 | 4 | 1177, 1182, 1187 | 1182 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 63 | 5 | 1177, 1182, 1187 | 1187 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 63 | 6 | 1177, 1182, 1187 | 1177 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 49 | 7 | 1176, 1181, 1186 | 1181 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 49 | 8 | 1176, 1181, 1186 | 1186 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 49 | 9 | 1176, 1181, 1186 | 1176 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 36 | 10 | 1175, 1180, 1185 | 1180 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 36 | 11 | 1175, 1180, 1185 | 1185 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 36 | 12 | 1175, 1180, 1185 | 1175 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 20 | 13 | 1174, 1179, 1184 | 1179 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 20 | 14 | 1174, 1179, 1184 | 1184 | semantic |
| boots_int | suffix | ReducedAilmentDuration | 20 | 15 | 1174, 1179, 1184 | 1174 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 75 | 1 | 1178, 1183, 1188 | 1183 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 75 | 2 | 1178, 1183, 1188 | 1188 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 75 | 3 | 1178, 1183, 1188 | 1178 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 63 | 4 | 1177, 1182, 1187 | 1182 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 63 | 5 | 1177, 1182, 1187 | 1187 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 63 | 6 | 1177, 1182, 1187 | 1177 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 49 | 7 | 1176, 1181, 1186 | 1181 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 49 | 8 | 1176, 1181, 1186 | 1186 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 49 | 9 | 1176, 1181, 1186 | 1176 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 36 | 10 | 1175, 1180, 1185 | 1180 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 36 | 11 | 1175, 1180, 1185 | 1185 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 36 | 12 | 1175, 1180, 1185 | 1175 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 20 | 13 | 1174, 1179, 1184 | 1179 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 20 | 14 | 1174, 1179, 1184 | 1184 | semantic |
| boots_str | suffix | ReducedAilmentDuration | 20 | 15 | 1174, 1179, 1184 | 1174 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 75 | 1 | 1178, 1183, 1188 | 1183 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 75 | 2 | 1178, 1183, 1188 | 1188 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 75 | 3 | 1178, 1183, 1188 | 1178 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 63 | 4 | 1177, 1182, 1187 | 1182 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 63 | 5 | 1177, 1182, 1187 | 1187 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 63 | 6 | 1177, 1182, 1187 | 1177 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 49 | 7 | 1176, 1181, 1186 | 1181 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 49 | 8 | 1176, 1181, 1186 | 1186 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 49 | 9 | 1176, 1181, 1186 | 1176 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 36 | 10 | 1175, 1180, 1185 | 1180 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 36 | 11 | 1175, 1180, 1185 | 1185 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 36 | 12 | 1175, 1180, 1185 | 1175 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 20 | 13 | 1174, 1179, 1184 | 1179 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 20 | 14 | 1174, 1179, 1184 | 1184 | semantic |
| boots_str_dex | suffix | ReducedAilmentDuration | 20 | 15 | 1174, 1179, 1184 | 1174 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 75 | 1 | 1178, 1183, 1188 | 1183 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 75 | 2 | 1178, 1183, 1188 | 1188 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 75 | 3 | 1178, 1183, 1188 | 1178 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 63 | 4 | 1177, 1182, 1187 | 1182 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 63 | 5 | 1177, 1182, 1187 | 1187 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 63 | 6 | 1177, 1182, 1187 | 1177 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 49 | 7 | 1176, 1181, 1186 | 1181 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 49 | 8 | 1176, 1181, 1186 | 1186 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 49 | 9 | 1176, 1181, 1186 | 1176 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 36 | 10 | 1175, 1180, 1185 | 1180 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 36 | 11 | 1175, 1180, 1185 | 1185 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 36 | 12 | 1175, 1180, 1185 | 1175 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 20 | 13 | 1174, 1179, 1184 | 1179 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 20 | 14 | 1174, 1179, 1184 | 1184 | semantic |
| boots_str_int | suffix | ReducedAilmentDuration | 20 | 15 | 1174, 1179, 1184 | 1174 | semantic |
| charms | prefix | FlaskRecoveryAmount | 76 | 1 | 1538, 1546 | 1538 | range |
| charms | prefix | FlaskRecoveryAmount | 76 | 2 | 1538, 1546 | 1546 | range |
| charms | prefix | FlaskRecoveryAmount | 67 | 4 | 1537, 1545 | 1537 | range |
| charms | prefix | FlaskRecoveryAmount | 67 | 5 | 1537, 1545 | 1545 | range |
| charms | prefix | FlaskRecoveryAmount | 58 | 7 | 1536, 1544 | 1536 | range |
| charms | prefix | FlaskRecoveryAmount | 58 | 8 | 1536, 1544 | 1544 | range |
| charms | prefix | FlaskRecoveryAmount | 47 | 10 | 1535, 1543 | 1535 | range |
| charms | prefix | FlaskRecoveryAmount | 47 | 11 | 1535, 1543 | 1543 | range |
| charms | prefix | FlaskRecoveryAmount | 36 | 12 | 1534, 1542, 1549 | 1549 | range |
| charms | prefix | FlaskRecoveryAmount | 36 | 13 | 1534, 1542, 1549 | 1534 | range |
| charms | prefix | FlaskRecoveryAmount | 36 | 14 | 1534, 1542, 1549 | 1542 | range |
| charms | prefix | FlaskRecoveryAmount | 26 | 15 | 1533, 1541 | 1533 | range |
| charms | prefix | FlaskRecoveryAmount | 26 | 16 | 1533, 1541 | 1541 | range |
| charms | prefix | FlaskRecoveryAmount | 14 | 18 | 1532, 1540 | 1532 | range |
| charms | prefix | FlaskRecoveryAmount | 14 | 19 | 1532, 1540 | 1540 | range |
| charms | prefix | FlaskRecoveryAmount | 1 | 21 | 1531, 1539 | 1531 | range |
| charms | prefix | FlaskRecoveryAmount | 1 | 22 | 1531, 1539 | 1539 | range |
| emerald | prefix | SpecificWeaponDamage | 1 | 1 | 1783, 1885 | 1783 | semantic |
| emerald | prefix | SpecificWeaponDamage | 1 | 2 | 1783, 1885 | 1885 | semantic |
| emerald | suffix | FlaskChargeGenerationPercent | 1 | 1 | 1841, 1851 | 1841 | semantic |
| emerald | suffix | FlaskChargeGenerationPercent | 1 | 2 | 1841, 1851 | 1851 | semantic |
| emerald | suffix | SpecificWeaponSpeed | 1 | 1 | 1784, 1887 | 1784 | semantic |
| emerald | suffix | SpecificWeaponSpeed | 1 | 2 | 1784, 1887 | 1887 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 60 | 1 | 669, 685, 701, 717, 733 | 717 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 60 | 2 | 669, 685, 701, 717, 733 | 685 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 60 | 3 | 669, 685, 701, 717, 733 | 669 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 60 | 4 | 669, 685, 701, 717, 733 | 701 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 60 | 5 | 669, 685, 701, 717, 733 | 733 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 46 | 6 | 668, 684, 700, 716, 732 | 716 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 46 | 7 | 668, 684, 700, 716, 732 | 684 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 46 | 8 | 668, 684, 700, 716, 732 | 668 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 46 | 9 | 668, 684, 700, 716, 732 | 700 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 46 | 10 | 668, 684, 700, 716, 732 | 732 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 33 | 11 | 667, 683, 699, 715, 731 | 715 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 33 | 12 | 667, 683, 699, 715, 731 | 683 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 33 | 13 | 667, 683, 699, 715, 731 | 667 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 33 | 14 | 667, 683, 699, 715, 731 | 699 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 33 | 15 | 667, 683, 699, 715, 731 | 731 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 16 | 16 | 666, 682, 698, 714, 730 | 714 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 16 | 17 | 666, 682, 698, 714, 730 | 682 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 16 | 18 | 666, 682, 698, 714, 730 | 666 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 16 | 19 | 666, 682, 698, 714, 730 | 698 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 16 | 20 | 666, 682, 698, 714, 730 | 730 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 8 | 21 | 665, 681, 697, 713, 729 | 713 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 8 | 22 | 665, 681, 697, 713, 729 | 681 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 8 | 23 | 665, 681, 697, 713, 729 | 665 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 8 | 24 | 665, 681, 697, 713, 729 | 697 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 8 | 25 | 665, 681, 697, 713, 729 | 729 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 2 | 26 | 664, 680, 696, 712, 728 | 712 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 2 | 27 | 664, 680, 696, 712, 728 | 680 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 2 | 28 | 664, 680, 696, 712, 728 | 664 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 2 | 29 | 664, 680, 696, 712, 728 | 696 | semantic |
| foci | prefix | WeaponDamageTypePrefix | 2 | 30 | 664, 680, 696, 712, 728 | 728 | semantic |
| life_flasks | prefix | FlaskRecoverySpeed | 46 | 3 | 1480, 1519 | 1480 | range |
| life_flasks | prefix | FlaskRecoverySpeed | 46 | 4 | 1480, 1519 | 1519 | range |
| mana_flasks | prefix | FlaskRecoverySpeed | 46 | 3 | 1480, 1519 | 1480 | range |
| mana_flasks | prefix | FlaskRecoverySpeed | 46 | 4 | 1480, 1519 | 1519 | range |
| rings | prefix | ColdDamage | 1 | 9 | 476, 15361 | 476 | coarse |
| rings | prefix | FireDamage | 1 | 9 | 467, 15360 | 467 | coarse |
| rings | prefix | LightningDamage | 1 | 9 | 485, 15359 | 485 | coarse |
| ruby | prefix | DamageForm | 1 | 1 | 14983, 14984 | 14983 | semantic |
| ruby | prefix | DamageForm | 1 | 2 | 14983, 14984 | 14984 | semantic |
| sapphire | prefix | DamageForm | 1 | 1 | 14983, 14984 | 14983 | semantic |
| sapphire | prefix | DamageForm | 1 | 2 | 14983, 14984 | 14984 | semantic |
| spears | suffix | IncreaseSocketedGemLevel | 81 | 1 | 859, 872 | 859 | semantic |
| spears | suffix | IncreaseSocketedGemLevel | 81 | 2 | 859, 872 | 872 | semantic |
| spears | suffix | IncreaseSocketedGemLevel | 55 | 3 | 858, 871 | 858 | semantic |
| spears | suffix | IncreaseSocketedGemLevel | 55 | 4 | 858, 871 | 871 | semantic |
| spears | suffix | IncreaseSocketedGemLevel | 36 | 5 | 857, 870 | 857 | semantic |
| spears | suffix | IncreaseSocketedGemLevel | 36 | 6 | 857, 870 | 870 | semantic |
| spears | suffix | IncreaseSocketedGemLevel | 18 | 7 | 856, 869 | 856 | semantic |
| spears | suffix | IncreaseSocketedGemLevel | 18 | 8 | 856, 869 | 869 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 81 | 1 | 679, 695, 711, 727, 743 | 727 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 81 | 2 | 679, 695, 711, 727, 743 | 695 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 81 | 3 | 679, 695, 711, 727, 743 | 679 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 81 | 4 | 679, 695, 711, 727, 743 | 711 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 81 | 5 | 679, 695, 711, 727, 743 | 743 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 70 | 6 | 678, 694, 710, 726, 742 | 726 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 70 | 7 | 678, 694, 710, 726, 742 | 694 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 70 | 8 | 678, 694, 710, 726, 742 | 678 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 70 | 9 | 678, 694, 710, 726, 742 | 710 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 70 | 10 | 678, 694, 710, 726, 742 | 742 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 60 | 11 | 677, 693, 709, 725, 741 | 725 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 60 | 12 | 677, 693, 709, 725, 741 | 693 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 60 | 13 | 677, 693, 709, 725, 741 | 677 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 60 | 14 | 677, 693, 709, 725, 741 | 709 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 60 | 15 | 677, 693, 709, 725, 741 | 741 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 46 | 16 | 676, 692, 708, 724, 740 | 724 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 46 | 17 | 676, 692, 708, 724, 740 | 692 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 46 | 18 | 676, 692, 708, 724, 740 | 676 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 46 | 19 | 676, 692, 708, 724, 740 | 708 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 46 | 20 | 676, 692, 708, 724, 740 | 740 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 33 | 21 | 675, 691, 707, 723, 739 | 723 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 33 | 22 | 675, 691, 707, 723, 739 | 691 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 33 | 23 | 675, 691, 707, 723, 739 | 675 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 33 | 24 | 675, 691, 707, 723, 739 | 707 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 33 | 25 | 675, 691, 707, 723, 739 | 739 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 16 | 26 | 674, 690, 706, 722, 738 | 722 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 16 | 27 | 674, 690, 706, 722, 738 | 690 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 16 | 28 | 674, 690, 706, 722, 738 | 674 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 16 | 29 | 674, 690, 706, 722, 738 | 706 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 16 | 30 | 674, 690, 706, 722, 738 | 738 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 8 | 31 | 673, 689, 705, 721, 737 | 721 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 8 | 32 | 673, 689, 705, 721, 737 | 689 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 8 | 33 | 673, 689, 705, 721, 737 | 673 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 8 | 34 | 673, 689, 705, 721, 737 | 705 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 8 | 35 | 673, 689, 705, 721, 737 | 737 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 2 | 36 | 672, 688, 704, 720, 736 | 720 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 2 | 37 | 672, 688, 704, 720, 736 | 688 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 2 | 38 | 672, 688, 704, 720, 736 | 672 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 2 | 39 | 672, 688, 704, 720, 736 | 704 | semantic |
| staves | prefix | WeaponDamageTypePrefix | 2 | 40 | 672, 688, 704, 720, 736 | 736 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 81 | 1 | 782, 795, 809, 822, 835 | 822 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 81 | 2 | 782, 795, 809, 822, 835 | 795 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 81 | 3 | 782, 795, 809, 822, 835 | 782 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 81 | 4 | 782, 795, 809, 822, 835 | 809 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 81 | 5 | 782, 795, 809, 822, 835 | 835 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 55 | 7 | 768, 781, 794, 808, 821, 834 | 821 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 55 | 8 | 768, 781, 794, 808, 821, 834 | 794 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 55 | 9 | 768, 781, 794, 808, 821, 834 | 781 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 55 | 10 | 768, 781, 794, 808, 821, 834 | 808 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 55 | 11 | 768, 781, 794, 808, 821, 834 | 834 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 55 | 12 | 768, 781, 794, 808, 821, 834 | 768 | range |
| staves | suffix | IncreaseSocketedGemLevel | 36 | 13 | 780, 793, 807, 820, 833 | 820 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 36 | 14 | 780, 793, 807, 820, 833 | 793 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 36 | 15 | 780, 793, 807, 820, 833 | 780 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 36 | 16 | 780, 793, 807, 820, 833 | 807 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 36 | 17 | 780, 793, 807, 820, 833 | 833 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 18 | 19 | 779, 792, 806, 819, 832 | 819 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 18 | 20 | 779, 792, 806, 819, 832 | 792 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 18 | 21 | 779, 792, 806, 819, 832 | 779 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 18 | 22 | 779, 792, 806, 819, 832 | 806 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 18 | 23 | 779, 792, 806, 819, 832 | 832 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 2 | 25 | 778, 791, 805, 818, 831 | 818 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 2 | 26 | 778, 791, 805, 818, 831 | 791 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 2 | 27 | 778, 791, 805, 818, 831 | 778 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 2 | 28 | 778, 791, 805, 818, 831 | 805 | semantic |
| staves | suffix | IncreaseSocketedGemLevel | 2 | 29 | 778, 791, 805, 818, 831 | 831 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 81 | 1 | 671, 687, 703, 719, 735 | 719 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 81 | 2 | 671, 687, 703, 719, 735 | 687 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 81 | 3 | 671, 687, 703, 719, 735 | 671 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 81 | 4 | 671, 687, 703, 719, 735 | 703 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 81 | 5 | 671, 687, 703, 719, 735 | 735 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 70 | 6 | 670, 686, 702, 718, 734 | 718 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 70 | 7 | 670, 686, 702, 718, 734 | 686 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 70 | 8 | 670, 686, 702, 718, 734 | 670 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 70 | 9 | 670, 686, 702, 718, 734 | 702 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 70 | 10 | 670, 686, 702, 718, 734 | 734 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 60 | 11 | 669, 685, 701, 717, 733 | 717 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 60 | 12 | 669, 685, 701, 717, 733 | 685 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 60 | 13 | 669, 685, 701, 717, 733 | 669 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 60 | 14 | 669, 685, 701, 717, 733 | 701 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 60 | 15 | 669, 685, 701, 717, 733 | 733 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 46 | 16 | 668, 684, 700, 716, 732 | 716 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 46 | 17 | 668, 684, 700, 716, 732 | 684 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 46 | 18 | 668, 684, 700, 716, 732 | 668 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 46 | 19 | 668, 684, 700, 716, 732 | 700 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 46 | 20 | 668, 684, 700, 716, 732 | 732 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 33 | 21 | 667, 683, 699, 715, 731 | 715 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 33 | 22 | 667, 683, 699, 715, 731 | 683 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 33 | 23 | 667, 683, 699, 715, 731 | 667 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 33 | 24 | 667, 683, 699, 715, 731 | 699 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 33 | 25 | 667, 683, 699, 715, 731 | 731 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 16 | 26 | 666, 682, 698, 714, 730 | 714 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 16 | 27 | 666, 682, 698, 714, 730 | 682 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 16 | 28 | 666, 682, 698, 714, 730 | 666 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 16 | 29 | 666, 682, 698, 714, 730 | 698 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 16 | 30 | 666, 682, 698, 714, 730 | 730 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 8 | 31 | 665, 681, 697, 713, 729 | 713 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 8 | 32 | 665, 681, 697, 713, 729 | 681 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 8 | 33 | 665, 681, 697, 713, 729 | 665 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 8 | 34 | 665, 681, 697, 713, 729 | 697 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 8 | 35 | 665, 681, 697, 713, 729 | 729 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 2 | 36 | 664, 680, 696, 712, 728 | 712 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 2 | 37 | 664, 680, 696, 712, 728 | 680 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 2 | 38 | 664, 680, 696, 712, 728 | 664 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 2 | 39 | 664, 680, 696, 712, 728 | 696 | semantic |
| wands | prefix | WeaponDamageTypePrefix | 2 | 40 | 664, 680, 696, 712, 728 | 728 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 81 | 1 | 777, 790, 804, 817, 830 | 817 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 81 | 2 | 777, 790, 804, 817, 830 | 790 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 81 | 3 | 777, 790, 804, 817, 830 | 777 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 81 | 4 | 777, 790, 804, 817, 830 | 804 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 81 | 5 | 777, 790, 804, 817, 830 | 830 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 55 | 7 | 764, 776, 789, 803, 816, 829 | 816 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 55 | 8 | 764, 776, 789, 803, 816, 829 | 789 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 55 | 9 | 764, 776, 789, 803, 816, 829 | 776 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 55 | 10 | 764, 776, 789, 803, 816, 829 | 803 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 55 | 11 | 764, 776, 789, 803, 816, 829 | 829 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 55 | 12 | 764, 776, 789, 803, 816, 829 | 764 | range |
| wands | suffix | IncreaseSocketedGemLevel | 36 | 13 | 775, 788, 802, 815, 828 | 815 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 36 | 14 | 775, 788, 802, 815, 828 | 788 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 36 | 15 | 775, 788, 802, 815, 828 | 775 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 36 | 16 | 775, 788, 802, 815, 828 | 802 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 36 | 17 | 775, 788, 802, 815, 828 | 828 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 18 | 19 | 774, 787, 801, 814, 827 | 814 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 18 | 20 | 774, 787, 801, 814, 827 | 787 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 18 | 21 | 774, 787, 801, 814, 827 | 774 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 18 | 22 | 774, 787, 801, 814, 827 | 801 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 18 | 23 | 774, 787, 801, 814, 827 | 827 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 2 | 25 | 773, 786, 800, 813, 826 | 813 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 2 | 26 | 773, 786, 800, 813, 826 | 786 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 2 | 27 | 773, 786, 800, 813, 826 | 773 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 2 | 28 | 773, 786, 800, 813, 826 | 800 | semantic |
| wands | suffix | IncreaseSocketedGemLevel | 2 | 29 | 773, 786, 800, 813, 826 | 826 | semantic |

## All wrong source identities in the former overlay

Count: **6**

| Pool | Affix | Legacy group | Required | Former stable ID | Correct stable ID | Correct key |
|---|---|---|---:|---:|---:|---|
| boots_dex | prefix | MovementVelocity | 65 | 16368 | 449 | MovementVelocity5 |
| boots_dex_int | prefix | MovementVelocity | 65 | 16368 | 449 | MovementVelocity5 |
| boots_int | prefix | MovementVelocity | 65 | 16368 | 449 | MovementVelocity5 |
| boots_str | prefix | MovementVelocity | 65 | 16368 | 449 | MovementVelocity5 |
| boots_str_dex | prefix | MovementVelocity | 65 | 16368 | 449 | MovementVelocity5 |
| boots_str_int | prefix | MovementVelocity | 65 | 16368 | 449 | MovementVelocity5 |

## All legacy/class-specific weight mismatches

Count: **1697**

| Pool | Affix | Legacy group | Stable ID | Required | Legacy weight | Normalized class weights | Pool weight |
|---|---|---|---:|---:|---:|---|---:|
| body_armours_dex_int | suffix | EnergyShieldRegeneration | 1219 | 81 | 500 | 2:1000 | 1000 |
| body_armours_dex_int | suffix | EnergyShieldRegeneration | 1218 | 66 | 500 | 2:1000 | 1000 |
| body_armours_dex_int | suffix | EnergyShieldRegeneration | 1217 | 48 | 500 | 2:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 182 | 79 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 193 | 79 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 204 | 79 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 181 | 75 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 212 | 75 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 220 | 75 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 192 | 75 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 228 | 75 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 203 | 70 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 180 | 65 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 211 | 65 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 219 | 65 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 191 | 65 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 227 | 65 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 202 | 65 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 179 | 60 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 210 | 60 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 218 | 60 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 190 | 60 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 226 | 60 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 201 | 60 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 178 | 54 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 209 | 54 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 217 | 54 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 189 | 54 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 225 | 54 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 200 | 54 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 177 | 46 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 208 | 46 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 216 | 46 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 188 | 46 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 224 | 46 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 199 | 46 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 176 | 33 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 207 | 33 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 215 | 33 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 187 | 33 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 223 | 33 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 198 | 33 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 175 | 25 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 186 | 25 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 197 | 25 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 174 | 16 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 206 | 16 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 214 | 16 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 185 | 16 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 222 | 16 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 196 | 16 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 173 | 8 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 184 | 8 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 195 | 8 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 172 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 205 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 213 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 183 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 221 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseLocalDefences | 194 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | BaseSpirit | 1143 | 78 | 1 | 6:200 | 200 |
| body_armours_str_dex_int | prefix | BaseSpirit | 1142 | 65 | 1 | 6:300 | 300 |
| body_armours_str_dex_int | prefix | BaseSpirit | 1141 | 60 | 1 | 6:400 | 400 |
| body_armours_str_dex_int | prefix | BaseSpirit | 1140 | 54 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | prefix | BaseSpirit | 1139 | 46 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | prefix | BaseSpirit | 1138 | 33 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | prefix | BaseSpirit | 1137 | 25 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | prefix | BaseSpirit | 1136 | 16 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | prefix | DefencesPercent | 428 | 75 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | DefencesPercent | 427 | 65 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | DefencesPercent | 426 | 60 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | DefencesPercent | 425 | 54 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | DefencesPercent | 424 | 46 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | DefencesPercent | 423 | 33 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | DefencesPercent | 422 | 16 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | DefencesPercent | 421 | 2 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | IncreasedLife | 90 | 80 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | IncreasedLife | 89 | 75 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | IncreasedLife | 88 | 70 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | IncreasedLife | 87 | 65 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | IncreasedLife | 86 | 60 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | IncreasedLife | 85 | 54 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | IncreasedLife | 84 | 46 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | IncreasedLife | 83 | 38 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | IncreasedLife | 82 | 33 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | IncreasedLife | 81 | 24 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | IncreasedLife | 80 | 16 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | IncreasedLife | 79 | 6 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | IncreasedLife | 78 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | Thorns | 457 | 74 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | Thorns | 456 | 63 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | Thorns | 455 | 48 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | Thorns | 454 | 38 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | Thorns | 453 | 19 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | Thorns | 452 | 10 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | prefix | Thorns | 451 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ArmourAppliesToElementalDamage | 1231 | 81 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ArmourAppliesToElementalDamage | 1230 | 66 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ArmourAppliesToElementalDamage | 1229 | 48 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ArmourAppliesToElementalDamage | 1228 | 36 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ArmourAppliesToElementalDamage | 1227 | 16 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ArmourAppliesToElementalDamage | 1226 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ChaosResistance | 77 | 81 | 1 | 6:250 | 250 |
| body_armours_str_dex_int | suffix | ChaosResistance | 76 | 68 | 1 | 6:250 | 250 |
| body_armours_str_dex_int | suffix | ChaosResistance | 75 | 56 | 1 | 6:250 | 250 |
| body_armours_str_dex_int | suffix | ChaosResistance | 74 | 44 | 1 | 6:250 | 250 |
| body_armours_str_dex_int | suffix | ChaosResistance | 73 | 30 | 1 | 6:250 | 250 |
| body_armours_str_dex_int | suffix | ChaosResistance | 72 | 16 | 1 | 6:250 | 250 |
| body_armours_str_dex_int | suffix | ColdResistance | 51 | 82 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ColdResistance | 50 | 71 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ColdResistance | 49 | 60 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ColdResistance | 48 | 50 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ColdResistance | 47 | 38 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ColdResistance | 46 | 26 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ColdResistance | 45 | 14 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | ColdResistance | 44 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Dexterity | 16 | 74 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Dexterity | 15 | 66 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Dexterity | 14 | 55 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Dexterity | 13 | 44 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Dexterity | 12 | 33 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Dexterity | 11 | 22 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Dexterity | 10 | 11 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Dexterity | 9 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | EnergyShieldRegeneration | 1219 | 81 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | EnergyShieldRegeneration | 1218 | 66 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | EnergyShieldRegeneration | 1217 | 48 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | EvasionAppliesToDeflection | 1246 | 81 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | EvasionAppliesToDeflection | 1245 | 66 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | EvasionAppliesToDeflection | 1244 | 48 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | EvasionAppliesToDeflection | 1243 | 36 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | EvasionAppliesToDeflection | 1242 | 16 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | EvasionAppliesToDeflection | 1241 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | FireResistance | 43 | 82 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | FireResistance | 42 | 71 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | FireResistance | 41 | 60 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | FireResistance | 40 | 48 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | FireResistance | 39 | 36 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | FireResistance | 38 | 24 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | FireResistance | 37 | 12 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | FireResistance | 36 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Intelligence | 25 | 74 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Intelligence | 24 | 66 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Intelligence | 23 | 55 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Intelligence | 22 | 44 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Intelligence | 21 | 33 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Intelligence | 20 | 22 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Intelligence | 19 | 11 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Intelligence | 18 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LifeRegeneration | 888 | 81 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LifeRegeneration | 887 | 75 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LifeRegeneration | 886 | 68 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LifeRegeneration | 885 | 58 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LifeRegeneration | 884 | 47 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LifeRegeneration | 883 | 35 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LifeRegeneration | 882 | 26 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LifeRegeneration | 881 | 17 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LifeRegeneration | 880 | 11 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LifeRegeneration | 879 | 5 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LifeRegeneration | 878 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LightningResistance | 59 | 82 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LightningResistance | 58 | 71 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LightningResistance | 57 | 60 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LightningResistance | 56 | 49 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LightningResistance | 55 | 37 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LightningResistance | 54 | 25 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LightningResistance | 53 | 13 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LightningResistance | 52 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | LocalAttributeRequirements | 433 | 60 | 1 | 6:900 | 900 |
| body_armours_str_dex_int | suffix | LocalAttributeRequirements | 432 | 52 | 1 | 6:900 | 900 |
| body_armours_str_dex_int | suffix | LocalAttributeRequirements | 431 | 40 | 1 | 6:900 | 900 |
| body_armours_str_dex_int | suffix | LocalAttributeRequirements | 430 | 32 | 1 | 6:900 | 900 |
| body_armours_str_dex_int | suffix | LocalAttributeRequirements | 429 | 24 | 1 | 6:900 | 900 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1163 | 76 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1173 | 76 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1168 | 76 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1162 | 64 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1172 | 64 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1167 | 64 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1161 | 50 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1171 | 50 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1166 | 50 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1160 | 37 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1170 | 37 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1165 | 37 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1159 | 21 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1169 | 21 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | ReducedAilmentDuration | 1164 | 21 | 1 | 6:500 | 500 |
| body_armours_str_dex_int | suffix | Strength | 7 | 74 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Strength | 6 | 66 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Strength | 5 | 55 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Strength | 4 | 44 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Strength | 3 | 33 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Strength | 2 | 22 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Strength | 1 | 11 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | Strength | 0 | 1 | 1 | 6:1000 | 1000 |
| body_armours_str_dex_int | suffix | StunThreshold | 443 | 72 | 1 | 6:800 | 800 |
| body_armours_str_dex_int | suffix | StunThreshold | 442 | 63 | 1 | 6:800 | 800 |
| body_armours_str_dex_int | suffix | StunThreshold | 441 | 54 | 1 | 6:800 | 800 |
| body_armours_str_dex_int | suffix | StunThreshold | 440 | 45 | 1 | 6:800 | 800 |
| body_armours_str_dex_int | suffix | StunThreshold | 439 | 36 | 1 | 6:800 | 800 |
| body_armours_str_dex_int | suffix | StunThreshold | 438 | 29 | 1 | 6:800 | 800 |
| body_armours_str_dex_int | suffix | StunThreshold | 437 | 22 | 1 | 6:800 | 800 |
| body_armours_str_dex_int | suffix | StunThreshold | 436 | 15 | 1 | 6:800 | 800 |
| body_armours_str_dex_int | suffix | StunThreshold | 435 | 8 | 1 | 6:800 | 800 |
| body_armours_str_dex_int | suffix | StunThreshold | 434 | 1 | 1 | 6:800 | 800 |
| body_armours_str_int | suffix | EnergyShieldRegeneration | 1219 | 81 | 500 | 7:1000 | 1000 |
| body_armours_str_int | suffix | EnergyShieldRegeneration | 1218 | 66 | 500 | 7:1000 | 1000 |
| body_armours_str_int | suffix | EnergyShieldRegeneration | 1217 | 48 | 500 | 7:1000 | 1000 |
| bows | suffix | IncreaseSocketedGemLevel | 872 | 81 | 250 | 57:100 | 100 |
| bows | suffix | IncreaseSocketedGemLevel | 871 | 55 | 500 | 57:250 | 250 |
| bows | suffix | IncreaseSocketedGemLevel | 870 | 36 | 750 | 57:500 | 500 |
| bows | suffix | IncreaseSocketedGemLevel | 869 | 18 | 1000 | 57:750 | 750 |
| charms | prefix | FlaskRecoveryAmount | 1538 | 76 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1546 | 76 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1552 | 75 | 550 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1537 | 67 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1545 | 67 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1551 | 60 | 550 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1536 | 58 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1544 | 58 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1550 | 48 | 550 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1535 | 47 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1543 | 47 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1549 | 36 | 550 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1534 | 36 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1542 | 36 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1533 | 26 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1541 | 26 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1548 | 21 | 550 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1532 | 14 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1540 | 14 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1547 | 10 | 550 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1531 | 1 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoveryAmount | 1539 | 1 | 800 | 91:1 | 1 |
| charms | prefix | FlaskRecoverySpeed | 1530 | 78 | 1000 | 91:1 | 1 |
| charms | prefix | FlaskRecoverySpeed | 1529 | 61 | 1000 | 91:1 | 1 |
| charms | prefix | FlaskRecoverySpeed | 1528 | 42 | 1000 | 91:1 | 1 |
| charms | prefix | FlaskRecoverySpeed | 1527 | 20 | 1000 | 91:1 | 1 |
| charms | prefix | FlaskRecoverySpeed | 1526 | 1 | 1000 | 91:1 | 1 |
| charms | suffix | FlaskChargesUsed | 1470 | 83 | 800 | 91:1 | 1 |
| charms | suffix | FlaskChargesUsed | 1469 | 64 | 800 | 91:1 | 1 |
| charms | suffix | FlaskChargesUsed | 1468 | 49 | 800 | 91:1 | 1 |
| charms | suffix | FlaskChargesUsed | 1467 | 34 | 800 | 91:1 | 1 |
| charms | suffix | FlaskChargesUsed | 1466 | 14 | 800 | 91:1 | 1 |
| charms | suffix | FlaskChargesUsed | 1465 | 1 | 800 | 91:1 | 1 |
| charms | suffix | FlaskGainCharge | 1476 | 45 | 850 | 91:1 | 1 |
| charms | suffix | FlaskGainCharge | 1475 | 26 | 850 | 91:1 | 1 |
| charms | suffix | FlaskGainCharge | 1474 | 8 | 850 | 91:1 | 1 |
| charms | suffix | FlaskNumCharges | 1464 | 81 | 1000 | 91:1 | 1 |
| charms | suffix | FlaskNumCharges | 1463 | 62 | 1000 | 91:1 | 1 |
| charms | suffix | FlaskNumCharges | 1462 | 47 | 1000 | 91:1 | 1 |
| charms | suffix | FlaskNumCharges | 1461 | 32 | 1000 | 91:1 | 1 |
| charms | suffix | FlaskNumCharges | 1460 | 12 | 1000 | 91:1 | 1 |
| charms | suffix | FlaskNumCharges | 1459 | 1 | 1000 | 91:1 | 1 |
| charms | suffix | FlaskRechargeRate | 1458 | 82 | 750 | 91:1 | 1 |
| charms | suffix | FlaskRechargeRate | 1457 | 63 | 750 | 91:1 | 1 |
| charms | suffix | FlaskRechargeRate | 1456 | 48 | 750 | 91:1 | 1 |
| charms | suffix | FlaskRechargeRate | 1473 | 45 | 1000 | 91:1 | 1 |
| charms | suffix | FlaskRechargeRate | 1455 | 33 | 750 | 91:1 | 1 |
| charms | suffix | FlaskRechargeRate | 1472 | 26 | 1000 | 91:1 | 1 |
| charms | suffix | FlaskRechargeRate | 1454 | 13 | 750 | 91:1 | 1 |
| charms | suffix | FlaskRechargeRate | 1471 | 8 | 1000 | 91:1 | 1 |
| charms | suffix | FlaskRechargeRate | 1453 | 1 | 750 | 91:1 | 1 |
| claws | prefix | ColdDamage | 541 | 81 | 1 | 52:80 | 80 |
| claws | prefix | ColdDamage | 540 | 75 | 1 | 52:200 | 200 |
| claws | prefix | ColdDamage | 539 | 65 | 1 | 52:320 | 320 |
| claws | prefix | ColdDamage | 538 | 60 | 1 | 52:480 | 480 |
| claws | prefix | ColdDamage | 537 | 54 | 1 | 52:800 | 800 |
| claws | prefix | ColdDamage | 536 | 46 | 1 | 52:800 | 800 |
| claws | prefix | ColdDamage | 535 | 33 | 1 | 52:800 | 800 |
| claws | prefix | ColdDamage | 534 | 16 | 1 | 52:800 | 800 |
| claws | prefix | ColdDamage | 533 | 8 | 1 | 52:800 | 800 |
| claws | prefix | ColdDamage | 532 | 1 | 1 | 52:800 | 800 |
| claws | prefix | FireDamage | 521 | 81 | 1 | 52:80 | 80 |
| claws | prefix | FireDamage | 520 | 75 | 1 | 52:200 | 200 |
| claws | prefix | FireDamage | 519 | 65 | 1 | 52:320 | 320 |
| claws | prefix | FireDamage | 518 | 60 | 1 | 52:480 | 480 |
| claws | prefix | FireDamage | 517 | 54 | 1 | 52:800 | 800 |
| claws | prefix | FireDamage | 516 | 46 | 1 | 52:800 | 800 |
| claws | prefix | FireDamage | 515 | 33 | 1 | 52:800 | 800 |
| claws | prefix | FireDamage | 514 | 16 | 1 | 52:800 | 800 |
| claws | prefix | FireDamage | 513 | 8 | 1 | 52:800 | 800 |
| claws | prefix | FireDamage | 512 | 1 | 1 | 52:800 | 800 |
| claws | prefix | IncreasedAccuracy | 1014 | 76 | 1 | 52:200 | 200 |
| claws | prefix | IncreasedAccuracy | 1013 | 67 | 1 | 52:300 | 300 |
| claws | prefix | IncreasedAccuracy | 1012 | 58 | 1 | 52:600 | 600 |
| claws | prefix | IncreasedAccuracy | 1011 | 48 | 1 | 52:600 | 600 |
| claws | prefix | IncreasedAccuracy | 1010 | 36 | 1 | 52:800 | 800 |
| claws | prefix | IncreasedAccuracy | 1009 | 26 | 1 | 52:800 | 800 |
| claws | prefix | IncreasedAccuracy | 1008 | 18 | 1 | 52:800 | 800 |
| claws | prefix | IncreasedAccuracy | 1007 | 13 | 1 | 52:800 | 800 |
| claws | prefix | IncreasedAccuracy | 1006 | 8 | 1 | 52:800 | 800 |
| claws | prefix | IncreasedWeaponElementalDamagePercent | 1384 | 81 | 1 | 52:500 | 500 |
| claws | prefix | IncreasedWeaponElementalDamagePercent | 1383 | 60 | 1 | 52:500 | 500 |
| claws | prefix | IncreasedWeaponElementalDamagePercent | 1382 | 46 | 1 | 52:500 | 500 |
| claws | prefix | IncreasedWeaponElementalDamagePercent | 1381 | 33 | 1 | 52:500 | 500 |
| claws | prefix | IncreasedWeaponElementalDamagePercent | 1380 | 16 | 1 | 52:500 | 500 |
| claws | prefix | IncreasedWeaponElementalDamagePercent | 1379 | 4 | 1 | 52:500 | 500 |
| claws | prefix | LightningDamage | 561 | 81 | 1 | 52:120 | 120 |
| claws | prefix | LightningDamage | 560 | 75 | 1 | 52:300 | 300 |
| claws | prefix | LightningDamage | 559 | 65 | 1 | 52:480 | 480 |
| claws | prefix | LightningDamage | 558 | 60 | 1 | 52:720 | 720 |
| claws | prefix | LightningDamage | 557 | 54 | 1 | 52:1200 | 1200 |
| claws | prefix | LightningDamage | 556 | 46 | 1 | 52:1200 | 1200 |
| claws | prefix | LightningDamage | 555 | 33 | 1 | 52:1200 | 1200 |
| claws | prefix | LightningDamage | 554 | 16 | 1 | 52:1200 | 1200 |
| claws | prefix | LightningDamage | 553 | 8 | 1 | 52:1200 | 1200 |
| claws | prefix | LightningDamage | 552 | 1 | 1 | 52:1200 | 1200 |
| claws | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 624 | 81 | 1 | 52:100 | 100 |
| claws | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 623 | 70 | 1 | 52:200 | 200 |
| claws | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 622 | 65 | 1 | 52:400 | 400 |
| claws | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 621 | 54 | 1 | 52:600 | 600 |
| claws | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 620 | 38 | 1 | 52:1000 | 1000 |
| claws | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 619 | 23 | 1 | 52:1000 | 1000 |
| claws | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 618 | 14 | 1 | 52:1000 | 1000 |
| claws | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 617 | 8 | 1 | 52:1000 | 1000 |
| claws | prefix | LocalPhysicalDamagePercent | 616 | 82 | 1 | 52:25 | 25 |
| claws | prefix | LocalPhysicalDamagePercent | 615 | 75 | 1 | 52:50 | 50 |
| claws | prefix | LocalPhysicalDamagePercent | 614 | 60 | 1 | 52:100 | 100 |
| claws | prefix | LocalPhysicalDamagePercent | 613 | 46 | 1 | 52:200 | 200 |
| claws | prefix | LocalPhysicalDamagePercent | 612 | 33 | 1 | 52:400 | 400 |
| claws | prefix | LocalPhysicalDamagePercent | 611 | 16 | 1 | 52:1000 | 1000 |
| claws | prefix | LocalPhysicalDamagePercent | 610 | 8 | 1 | 52:1000 | 1000 |
| claws | prefix | LocalPhysicalDamagePercent | 609 | 1 | 1 | 52:1000 | 1000 |
| claws | prefix | PhysicalDamage | 502 | 75 | 1 | 52:100 | 100 |
| claws | prefix | PhysicalDamage | 501 | 65 | 1 | 52:200 | 200 |
| claws | prefix | PhysicalDamage | 500 | 60 | 1 | 52:400 | 400 |
| claws | prefix | PhysicalDamage | 499 | 54 | 1 | 52:600 | 600 |
| claws | prefix | PhysicalDamage | 498 | 46 | 1 | 52:1000 | 1000 |
| claws | prefix | PhysicalDamage | 497 | 33 | 1 | 52:1000 | 1000 |
| claws | prefix | PhysicalDamage | 496 | 16 | 1 | 52:1000 | 1000 |
| claws | prefix | PhysicalDamage | 495 | 8 | 1 | 52:1000 | 1000 |
| claws | prefix | PhysicalDamage | 494 | 1 | 1 | 52:1000 | 1000 |
| claws | suffix | CriticalStrikeChanceIncrease | 1035 | 73 | 1 | 52:125 | 125 |
| claws | suffix | CriticalStrikeChanceIncrease | 1034 | 59 | 1 | 52:250 | 250 |
| claws | suffix | CriticalStrikeChanceIncrease | 1033 | 44 | 1 | 52:500 | 500 |
| claws | suffix | CriticalStrikeChanceIncrease | 1032 | 30 | 1 | 52:1000 | 1000 |
| claws | suffix | CriticalStrikeChanceIncrease | 1031 | 20 | 1 | 52:1000 | 1000 |
| claws | suffix | CriticalStrikeChanceIncrease | 1030 | 1 | 1 | 52:1000 | 1000 |
| claws | suffix | CriticalStrikeMultiplier | 1078 | 73 | 1 | 52:125 | 125 |
| claws | suffix | CriticalStrikeMultiplier | 1077 | 59 | 1 | 52:250 | 250 |
| claws | suffix | CriticalStrikeMultiplier | 1076 | 44 | 1 | 52:500 | 500 |
| claws | suffix | CriticalStrikeMultiplier | 1075 | 30 | 1 | 52:1000 | 1000 |
| claws | suffix | CriticalStrikeMultiplier | 1074 | 21 | 1 | 52:1000 | 1000 |
| claws | suffix | CriticalStrikeMultiplier | 1073 | 8 | 1 | 52:1000 | 1000 |
| claws | suffix | Dexterity | 16 | 74 | 1 | 52:1000 | 1000 |
| claws | suffix | Dexterity | 15 | 66 | 1 | 52:1000 | 1000 |
| claws | suffix | Dexterity | 14 | 55 | 1 | 52:1000 | 1000 |
| claws | suffix | Dexterity | 13 | 44 | 1 | 52:1000 | 1000 |
| claws | suffix | Dexterity | 12 | 33 | 1 | 52:1000 | 1000 |
| claws | suffix | Dexterity | 11 | 22 | 1 | 52:1000 | 1000 |
| claws | suffix | Dexterity | 10 | 11 | 1 | 52:1000 | 1000 |
| claws | suffix | Dexterity | 9 | 1 | 1 | 52:1000 | 1000 |
| claws | suffix | IncreasedAttackSpeed | 967 | 77 | 1 | 52:100 | 100 |
| claws | suffix | IncreasedAttackSpeed | 966 | 60 | 1 | 52:200 | 200 |
| claws | suffix | IncreasedAttackSpeed | 965 | 45 | 1 | 52:500 | 500 |
| claws | suffix | IncreasedAttackSpeed | 964 | 37 | 1 | 52:500 | 500 |
| claws | suffix | IncreasedAttackSpeed | 963 | 30 | 1 | 52:1000 | 1000 |
| claws | suffix | IncreasedAttackSpeed | 962 | 22 | 1 | 52:1000 | 1000 |
| claws | suffix | IncreasedAttackSpeed | 961 | 11 | 1 | 52:1000 | 1000 |
| claws | suffix | IncreasedAttackSpeed | 960 | 1 | 1 | 52:1000 | 1000 |
| claws | suffix | IncreaseSocketedGemLevel | 859 | 81 | 1 | 52:100 | 100 |
| claws | suffix | IncreaseSocketedGemLevel | 858 | 55 | 1 | 52:250 | 250 |
| claws | suffix | IncreaseSocketedGemLevel | 857 | 36 | 1 | 52:500 | 500 |
| claws | suffix | IncreaseSocketedGemLevel | 856 | 18 | 1 | 52:750 | 750 |
| claws | suffix | LifeGainedFromEnemyDeath | 939 | 77 | 1 | 52:750 | 750 |
| claws | suffix | LifeGainedFromEnemyDeath | 938 | 66 | 1 | 52:750 | 750 |
| claws | suffix | LifeGainedFromEnemyDeath | 937 | 55 | 1 | 52:750 | 750 |
| claws | suffix | LifeGainedFromEnemyDeath | 936 | 44 | 1 | 52:750 | 750 |
| claws | suffix | LifeGainedFromEnemyDeath | 935 | 33 | 1 | 52:750 | 750 |
| claws | suffix | LifeGainedFromEnemyDeath | 934 | 22 | 1 | 52:750 | 750 |
| claws | suffix | LifeGainedFromEnemyDeath | 933 | 11 | 1 | 52:750 | 750 |
| claws | suffix | LifeGainedFromEnemyDeath | 932 | 1 | 1 | 52:750 | 750 |
| claws | suffix | LifeGainPerTarget | 955 | 40 | 1 | 52:1000 | 1000 |
| claws | suffix | LifeGainPerTarget | 954 | 30 | 1 | 52:1000 | 1000 |
| claws | suffix | LifeGainPerTarget | 953 | 20 | 1 | 52:1000 | 1000 |
| claws | suffix | LifeGainPerTarget | 952 | 8 | 1 | 52:1000 | 1000 |
| claws | suffix | LifeLeech | 921 | 65 | 1 | 52:1000 | 1000 |
| claws | suffix | LifeLeech | 920 | 54 | 1 | 52:1000 | 1000 |
| claws | suffix | LifeLeech | 919 | 38 | 1 | 52:1000 | 1000 |
| claws | suffix | LifeLeech | 918 | 21 | 1 | 52:1000 | 1000 |
| claws | suffix | LightRadiusAndAccuracy | 1125 | 30 | 1 | 52:1000 | 1000 |
| claws | suffix | LightRadiusAndAccuracy | 1124 | 15 | 1 | 52:1000 | 1000 |
| claws | suffix | LightRadiusAndAccuracy | 1123 | 8 | 1 | 52:1000 | 1000 |
| claws | suffix | LocalAttributeRequirements | 433 | 60 | 1 | 52:1000 | 1000 |
| claws | suffix | LocalAttributeRequirements | 432 | 52 | 1 | 52:1000 | 1000 |
| claws | suffix | LocalAttributeRequirements | 431 | 40 | 1 | 52:1000 | 1000 |
| claws | suffix | LocalAttributeRequirements | 430 | 32 | 1 | 52:1000 | 1000 |
| claws | suffix | LocalAttributeRequirements | 429 | 24 | 1 | 52:1000 | 1000 |
| claws | suffix | ManaGainedFromEnemyDeath | 947 | 78 | 1 | 52:750 | 750 |
| claws | suffix | ManaGainedFromEnemyDeath | 946 | 67 | 1 | 52:750 | 750 |
| claws | suffix | ManaGainedFromEnemyDeath | 945 | 56 | 1 | 52:750 | 750 |
| claws | suffix | ManaGainedFromEnemyDeath | 944 | 45 | 1 | 52:750 | 750 |
| claws | suffix | ManaGainedFromEnemyDeath | 943 | 34 | 1 | 52:750 | 750 |
| claws | suffix | ManaGainedFromEnemyDeath | 942 | 23 | 1 | 52:750 | 750 |
| claws | suffix | ManaGainedFromEnemyDeath | 941 | 12 | 1 | 52:750 | 750 |
| claws | suffix | ManaGainedFromEnemyDeath | 940 | 1 | 1 | 52:750 | 750 |
| claws | suffix | ManaLeech | 931 | 65 | 1 | 52:1000 | 1000 |
| claws | suffix | ManaLeech | 930 | 54 | 1 | 52:1000 | 1000 |
| claws | suffix | ManaLeech | 929 | 38 | 1 | 52:1000 | 1000 |
| claws | suffix | ManaLeech | 928 | 21 | 1 | 52:1000 | 1000 |
| claws | suffix | StunDamageIncrease | 1348 | 74 | 1 | 52:1000 | 1000 |
| claws | suffix | StunDamageIncrease | 1347 | 58 | 1 | 52:1000 | 1000 |
| claws | suffix | StunDamageIncrease | 1346 | 44 | 1 | 52:1000 | 1000 |
| claws | suffix | StunDamageIncrease | 1345 | 30 | 1 | 52:1000 | 1000 |
| claws | suffix | StunDamageIncrease | 1344 | 20 | 1 | 52:1000 | 1000 |
| claws | suffix | StunDamageIncrease | 1343 | 5 | 1 | 52:1000 | 1000 |
| claws | suffix | StunDurationIncreasePercent | 1342 | 71 | 1 | 52:1000 | 1000 |
| claws | suffix | StunDurationIncreasePercent | 1341 | 58 | 1 | 52:1000 | 1000 |
| claws | suffix | StunDurationIncreasePercent | 1340 | 44 | 1 | 52:1000 | 1000 |
| claws | suffix | StunDurationIncreasePercent | 1339 | 30 | 1 | 52:1000 | 1000 |
| claws | suffix | StunDurationIncreasePercent | 1338 | 18 | 1 | 52:1000 | 1000 |
| claws | suffix | StunDurationIncreasePercent | 1337 | 5 | 1 | 52:1000 | 1000 |
| crossbows | prefix | FireDamage | 531 | 81 | 100 | 58:100, 103:110 | class-dependent |
| crossbows | prefix | FireDamage | 530 | 75 | 250 | 58:250, 103:275 | class-dependent |
| crossbows | prefix | FireDamage | 529 | 65 | 400 | 58:400, 103:440 | class-dependent |
| crossbows | prefix | FireDamage | 528 | 60 | 600 | 58:600, 103:660 | class-dependent |
| crossbows | prefix | FireDamage | 527 | 54 | 1000 | 58:1000, 103:1100 | class-dependent |
| crossbows | prefix | FireDamage | 526 | 46 | 1000 | 58:1000, 103:1100 | class-dependent |
| crossbows | prefix | FireDamage | 525 | 33 | 1000 | 58:1000, 103:1100 | class-dependent |
| crossbows | prefix | FireDamage | 524 | 16 | 1000 | 58:1000, 103:1100 | class-dependent |
| crossbows | prefix | FireDamage | 523 | 8 | 1000 | 58:1000, 103:1100 | class-dependent |
| crossbows | prefix | FireDamage | 522 | 1 | 1000 | 58:1000, 103:1100 | class-dependent |
| crossbows | prefix | LightningDamage | 571 | 81 | 100 | 58:100, 103:90 | class-dependent |
| crossbows | prefix | LightningDamage | 570 | 75 | 250 | 58:250, 103:225 | class-dependent |
| crossbows | prefix | LightningDamage | 569 | 65 | 400 | 58:400, 103:360 | class-dependent |
| crossbows | prefix | LightningDamage | 568 | 60 | 600 | 58:600, 103:540 | class-dependent |
| crossbows | prefix | LightningDamage | 567 | 54 | 1000 | 58:1000, 103:900 | class-dependent |
| crossbows | prefix | LightningDamage | 566 | 46 | 1000 | 58:1000, 103:900 | class-dependent |
| crossbows | prefix | LightningDamage | 565 | 33 | 1000 | 58:1000, 103:900 | class-dependent |
| crossbows | prefix | LightningDamage | 564 | 16 | 1000 | 58:1000, 103:900 | class-dependent |
| crossbows | prefix | LightningDamage | 563 | 8 | 1000 | 58:1000, 103:900 | class-dependent |
| crossbows | prefix | LightningDamage | 562 | 1 | 1000 | 58:1000, 103:900 | class-dependent |
| crossbows | suffix | Dexterity | 16 | 74 | 500 | 58:500, 103:250 | class-dependent |
| crossbows | suffix | Dexterity | 15 | 66 | 500 | 58:500, 103:250 | class-dependent |
| crossbows | suffix | Dexterity | 14 | 55 | 500 | 58:500, 103:250 | class-dependent |
| crossbows | suffix | Dexterity | 13 | 44 | 500 | 58:500, 103:250 | class-dependent |
| crossbows | suffix | Dexterity | 12 | 33 | 500 | 58:500, 103:250 | class-dependent |
| crossbows | suffix | Dexterity | 11 | 22 | 500 | 58:500, 103:250 | class-dependent |
| crossbows | suffix | Dexterity | 10 | 11 | 500 | 58:500, 103:250 | class-dependent |
| crossbows | suffix | Dexterity | 9 | 1 | 500 | 58:500, 103:250 | class-dependent |
| crossbows | suffix | IncreaseSocketedGemLevel | 877 | 81 | 250 | 58:100, 103:100 | 100 |
| crossbows | suffix | IncreaseSocketedGemLevel | 876 | 55 | 500 | 58:250, 103:250 | 250 |
| crossbows | suffix | IncreaseSocketedGemLevel | 875 | 36 | 750 | 58:500, 103:500 | 500 |
| crossbows | suffix | IncreaseSocketedGemLevel | 874 | 18 | 1000 | 58:750, 103:750 | 750 |
| crossbows | suffix | Strength | 7 | 74 | 500 | 58:500, 103:750 | class-dependent |
| crossbows | suffix | Strength | 6 | 66 | 500 | 58:500, 103:750 | class-dependent |
| crossbows | suffix | Strength | 5 | 55 | 500 | 58:500, 103:750 | class-dependent |
| crossbows | suffix | Strength | 4 | 44 | 500 | 58:500, 103:750 | class-dependent |
| crossbows | suffix | Strength | 3 | 33 | 500 | 58:500, 103:750 | class-dependent |
| crossbows | suffix | Strength | 2 | 22 | 500 | 58:500, 103:750 | class-dependent |
| crossbows | suffix | Strength | 1 | 11 | 500 | 58:500, 103:750 | class-dependent |
| crossbows | suffix | Strength | 0 | 1 | 500 | 58:500, 103:750 | class-dependent |
| daggers | prefix | ColdDamage | 541 | 81 | 1 | 51:100 | 100 |
| daggers | prefix | ColdDamage | 540 | 75 | 1 | 51:250 | 250 |
| daggers | prefix | ColdDamage | 539 | 65 | 1 | 51:400 | 400 |
| daggers | prefix | ColdDamage | 538 | 60 | 1 | 51:600 | 600 |
| daggers | prefix | ColdDamage | 537 | 54 | 1 | 51:1000 | 1000 |
| daggers | prefix | ColdDamage | 536 | 46 | 1 | 51:1000 | 1000 |
| daggers | prefix | ColdDamage | 535 | 33 | 1 | 51:1000 | 1000 |
| daggers | prefix | ColdDamage | 534 | 16 | 1 | 51:1000 | 1000 |
| daggers | prefix | ColdDamage | 533 | 8 | 1 | 51:1000 | 1000 |
| daggers | prefix | ColdDamage | 532 | 1 | 1 | 51:1000 | 1000 |
| daggers | prefix | FireDamage | 521 | 81 | 1 | 51:80 | 80 |
| daggers | prefix | FireDamage | 520 | 75 | 1 | 51:200 | 200 |
| daggers | prefix | FireDamage | 519 | 65 | 1 | 51:360 | 360 |
| daggers | prefix | FireDamage | 518 | 60 | 1 | 51:480 | 480 |
| daggers | prefix | FireDamage | 517 | 54 | 1 | 51:800 | 800 |
| daggers | prefix | FireDamage | 516 | 46 | 1 | 51:800 | 800 |
| daggers | prefix | FireDamage | 515 | 33 | 1 | 51:800 | 800 |
| daggers | prefix | FireDamage | 514 | 16 | 1 | 51:800 | 800 |
| daggers | prefix | FireDamage | 513 | 8 | 1 | 51:800 | 800 |
| daggers | prefix | FireDamage | 512 | 1 | 1 | 51:800 | 800 |
| daggers | prefix | IncreasedAccuracy | 1014 | 76 | 1 | 51:200 | 200 |
| daggers | prefix | IncreasedAccuracy | 1013 | 67 | 1 | 51:300 | 300 |
| daggers | prefix | IncreasedAccuracy | 1012 | 58 | 1 | 51:600 | 600 |
| daggers | prefix | IncreasedAccuracy | 1011 | 48 | 1 | 51:600 | 600 |
| daggers | prefix | IncreasedAccuracy | 1010 | 36 | 1 | 51:800 | 800 |
| daggers | prefix | IncreasedAccuracy | 1009 | 26 | 1 | 51:800 | 800 |
| daggers | prefix | IncreasedAccuracy | 1008 | 18 | 1 | 51:800 | 800 |
| daggers | prefix | IncreasedAccuracy | 1007 | 13 | 1 | 51:800 | 800 |
| daggers | prefix | IncreasedAccuracy | 1006 | 8 | 1 | 51:800 | 800 |
| daggers | prefix | IncreasedWeaponElementalDamagePercent | 1384 | 81 | 1 | 51:500 | 500 |
| daggers | prefix | IncreasedWeaponElementalDamagePercent | 1383 | 60 | 1 | 51:500 | 500 |
| daggers | prefix | IncreasedWeaponElementalDamagePercent | 1382 | 46 | 1 | 51:500 | 500 |
| daggers | prefix | IncreasedWeaponElementalDamagePercent | 1381 | 33 | 1 | 51:500 | 500 |
| daggers | prefix | IncreasedWeaponElementalDamagePercent | 1380 | 16 | 1 | 51:500 | 500 |
| daggers | prefix | IncreasedWeaponElementalDamagePercent | 1379 | 4 | 1 | 51:500 | 500 |
| daggers | prefix | LightningDamage | 561 | 81 | 1 | 51:100 | 100 |
| daggers | prefix | LightningDamage | 560 | 75 | 1 | 51:250 | 250 |
| daggers | prefix | LightningDamage | 559 | 65 | 1 | 51:400 | 400 |
| daggers | prefix | LightningDamage | 558 | 60 | 1 | 51:600 | 600 |
| daggers | prefix | LightningDamage | 557 | 54 | 1 | 51:1000 | 1000 |
| daggers | prefix | LightningDamage | 556 | 46 | 1 | 51:1000 | 1000 |
| daggers | prefix | LightningDamage | 555 | 33 | 1 | 51:1000 | 1000 |
| daggers | prefix | LightningDamage | 554 | 16 | 1 | 51:1000 | 1000 |
| daggers | prefix | LightningDamage | 553 | 8 | 1 | 51:1000 | 1000 |
| daggers | prefix | LightningDamage | 552 | 1 | 1 | 51:1000 | 1000 |
| daggers | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 624 | 81 | 1 | 51:100 | 100 |
| daggers | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 623 | 70 | 1 | 51:200 | 200 |
| daggers | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 622 | 65 | 1 | 51:400 | 400 |
| daggers | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 621 | 54 | 1 | 51:600 | 600 |
| daggers | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 620 | 38 | 1 | 51:1000 | 1000 |
| daggers | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 619 | 23 | 1 | 51:1000 | 1000 |
| daggers | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 618 | 14 | 1 | 51:1000 | 1000 |
| daggers | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 617 | 8 | 1 | 51:1000 | 1000 |
| daggers | prefix | LocalPhysicalDamagePercent | 616 | 82 | 1 | 51:25 | 25 |
| daggers | prefix | LocalPhysicalDamagePercent | 615 | 75 | 1 | 51:50 | 50 |
| daggers | prefix | LocalPhysicalDamagePercent | 614 | 60 | 1 | 51:100 | 100 |
| daggers | prefix | LocalPhysicalDamagePercent | 613 | 46 | 1 | 51:200 | 200 |
| daggers | prefix | LocalPhysicalDamagePercent | 612 | 33 | 1 | 51:400 | 400 |
| daggers | prefix | LocalPhysicalDamagePercent | 611 | 16 | 1 | 51:1000 | 1000 |
| daggers | prefix | LocalPhysicalDamagePercent | 610 | 8 | 1 | 51:1000 | 1000 |
| daggers | prefix | LocalPhysicalDamagePercent | 609 | 1 | 1 | 51:1000 | 1000 |
| daggers | prefix | PhysicalDamage | 502 | 75 | 1 | 51:100 | 100 |
| daggers | prefix | PhysicalDamage | 501 | 65 | 1 | 51:200 | 200 |
| daggers | prefix | PhysicalDamage | 500 | 60 | 1 | 51:400 | 400 |
| daggers | prefix | PhysicalDamage | 499 | 54 | 1 | 51:600 | 600 |
| daggers | prefix | PhysicalDamage | 498 | 46 | 1 | 51:1000 | 1000 |
| daggers | prefix | PhysicalDamage | 497 | 33 | 1 | 51:1000 | 1000 |
| daggers | prefix | PhysicalDamage | 496 | 16 | 1 | 51:1000 | 1000 |
| daggers | prefix | PhysicalDamage | 495 | 8 | 1 | 51:1000 | 1000 |
| daggers | prefix | PhysicalDamage | 494 | 1 | 1 | 51:1000 | 1000 |
| daggers | suffix | CriticalStrikeChanceIncrease | 1035 | 73 | 1 | 51:125 | 125 |
| daggers | suffix | CriticalStrikeChanceIncrease | 1034 | 59 | 1 | 51:250 | 250 |
| daggers | suffix | CriticalStrikeChanceIncrease | 1033 | 44 | 1 | 51:500 | 500 |
| daggers | suffix | CriticalStrikeChanceIncrease | 1032 | 30 | 1 | 51:1000 | 1000 |
| daggers | suffix | CriticalStrikeChanceIncrease | 1031 | 20 | 1 | 51:1000 | 1000 |
| daggers | suffix | CriticalStrikeChanceIncrease | 1030 | 1 | 1 | 51:1000 | 1000 |
| daggers | suffix | CriticalStrikeMultiplier | 1078 | 73 | 1 | 51:125 | 125 |
| daggers | suffix | CriticalStrikeMultiplier | 1077 | 59 | 1 | 51:250 | 250 |
| daggers | suffix | CriticalStrikeMultiplier | 1076 | 44 | 1 | 51:500 | 500 |
| daggers | suffix | CriticalStrikeMultiplier | 1075 | 30 | 1 | 51:1000 | 1000 |
| daggers | suffix | CriticalStrikeMultiplier | 1074 | 21 | 1 | 51:1000 | 1000 |
| daggers | suffix | CriticalStrikeMultiplier | 1073 | 8 | 1 | 51:1000 | 1000 |
| daggers | suffix | Dexterity | 16 | 74 | 1 | 51:500 | 500 |
| daggers | suffix | Dexterity | 15 | 66 | 1 | 51:500 | 500 |
| daggers | suffix | Dexterity | 14 | 55 | 1 | 51:500 | 500 |
| daggers | suffix | Dexterity | 13 | 44 | 1 | 51:500 | 500 |
| daggers | suffix | Dexterity | 12 | 33 | 1 | 51:500 | 500 |
| daggers | suffix | Dexterity | 11 | 22 | 1 | 51:500 | 500 |
| daggers | suffix | Dexterity | 10 | 11 | 1 | 51:500 | 500 |
| daggers | suffix | Dexterity | 9 | 1 | 1 | 51:500 | 500 |
| daggers | suffix | IncreasedAttackSpeed | 967 | 77 | 1 | 51:100 | 100 |
| daggers | suffix | IncreasedAttackSpeed | 966 | 60 | 1 | 51:200 | 200 |
| daggers | suffix | IncreasedAttackSpeed | 965 | 45 | 1 | 51:500 | 500 |
| daggers | suffix | IncreasedAttackSpeed | 964 | 37 | 1 | 51:500 | 500 |
| daggers | suffix | IncreasedAttackSpeed | 963 | 30 | 1 | 51:1000 | 1000 |
| daggers | suffix | IncreasedAttackSpeed | 962 | 22 | 1 | 51:1000 | 1000 |
| daggers | suffix | IncreasedAttackSpeed | 961 | 11 | 1 | 51:1000 | 1000 |
| daggers | suffix | IncreasedAttackSpeed | 960 | 1 | 1 | 51:1000 | 1000 |
| daggers | suffix | IncreaseSocketedGemLevel | 859 | 81 | 1 | 51:100 | 100 |
| daggers | suffix | IncreaseSocketedGemLevel | 858 | 55 | 1 | 51:250 | 250 |
| daggers | suffix | IncreaseSocketedGemLevel | 857 | 36 | 1 | 51:500 | 500 |
| daggers | suffix | IncreaseSocketedGemLevel | 856 | 18 | 1 | 51:750 | 750 |
| daggers | suffix | Intelligence | 25 | 74 | 1 | 51:500 | 500 |
| daggers | suffix | Intelligence | 24 | 66 | 1 | 51:500 | 500 |
| daggers | suffix | Intelligence | 23 | 55 | 1 | 51:500 | 500 |
| daggers | suffix | Intelligence | 22 | 44 | 1 | 51:500 | 500 |
| daggers | suffix | Intelligence | 21 | 33 | 1 | 51:500 | 500 |
| daggers | suffix | Intelligence | 20 | 22 | 1 | 51:500 | 500 |
| daggers | suffix | Intelligence | 19 | 11 | 1 | 51:500 | 500 |
| daggers | suffix | Intelligence | 18 | 1 | 1 | 51:500 | 500 |
| daggers | suffix | LifeGainedFromEnemyDeath | 939 | 77 | 1 | 51:750 | 750 |
| daggers | suffix | LifeGainedFromEnemyDeath | 938 | 66 | 1 | 51:750 | 750 |
| daggers | suffix | LifeGainedFromEnemyDeath | 937 | 55 | 1 | 51:750 | 750 |
| daggers | suffix | LifeGainedFromEnemyDeath | 936 | 44 | 1 | 51:750 | 750 |
| daggers | suffix | LifeGainedFromEnemyDeath | 935 | 33 | 1 | 51:750 | 750 |
| daggers | suffix | LifeGainedFromEnemyDeath | 934 | 22 | 1 | 51:750 | 750 |
| daggers | suffix | LifeGainedFromEnemyDeath | 933 | 11 | 1 | 51:750 | 750 |
| daggers | suffix | LifeGainedFromEnemyDeath | 932 | 1 | 1 | 51:750 | 750 |
| daggers | suffix | LifeGainPerTarget | 955 | 40 | 1 | 51:1000 | 1000 |
| daggers | suffix | LifeGainPerTarget | 954 | 30 | 1 | 51:1000 | 1000 |
| daggers | suffix | LifeGainPerTarget | 953 | 20 | 1 | 51:1000 | 1000 |
| daggers | suffix | LifeGainPerTarget | 952 | 8 | 1 | 51:1000 | 1000 |
| daggers | suffix | LifeLeech | 921 | 65 | 1 | 51:1000 | 1000 |
| daggers | suffix | LifeLeech | 920 | 54 | 1 | 51:1000 | 1000 |
| daggers | suffix | LifeLeech | 919 | 38 | 1 | 51:1000 | 1000 |
| daggers | suffix | LifeLeech | 918 | 21 | 1 | 51:1000 | 1000 |
| daggers | suffix | LightRadiusAndAccuracy | 1125 | 30 | 1 | 51:1000 | 1000 |
| daggers | suffix | LightRadiusAndAccuracy | 1124 | 15 | 1 | 51:1000 | 1000 |
| daggers | suffix | LightRadiusAndAccuracy | 1123 | 8 | 1 | 51:1000 | 1000 |
| daggers | suffix | LocalAttributeRequirements | 433 | 60 | 1 | 51:1000 | 1000 |
| daggers | suffix | LocalAttributeRequirements | 432 | 52 | 1 | 51:1000 | 1000 |
| daggers | suffix | LocalAttributeRequirements | 431 | 40 | 1 | 51:1000 | 1000 |
| daggers | suffix | LocalAttributeRequirements | 430 | 32 | 1 | 51:1000 | 1000 |
| daggers | suffix | LocalAttributeRequirements | 429 | 24 | 1 | 51:1000 | 1000 |
| daggers | suffix | ManaGainedFromEnemyDeath | 947 | 78 | 1 | 51:750 | 750 |
| daggers | suffix | ManaGainedFromEnemyDeath | 946 | 67 | 1 | 51:750 | 750 |
| daggers | suffix | ManaGainedFromEnemyDeath | 945 | 56 | 1 | 51:750 | 750 |
| daggers | suffix | ManaGainedFromEnemyDeath | 944 | 45 | 1 | 51:750 | 750 |
| daggers | suffix | ManaGainedFromEnemyDeath | 943 | 34 | 1 | 51:750 | 750 |
| daggers | suffix | ManaGainedFromEnemyDeath | 942 | 23 | 1 | 51:750 | 750 |
| daggers | suffix | ManaGainedFromEnemyDeath | 941 | 12 | 1 | 51:750 | 750 |
| daggers | suffix | ManaGainedFromEnemyDeath | 940 | 1 | 1 | 51:750 | 750 |
| daggers | suffix | ManaLeech | 931 | 65 | 1 | 51:1000 | 1000 |
| daggers | suffix | ManaLeech | 930 | 54 | 1 | 51:1000 | 1000 |
| daggers | suffix | ManaLeech | 929 | 38 | 1 | 51:1000 | 1000 |
| daggers | suffix | ManaLeech | 928 | 21 | 1 | 51:1000 | 1000 |
| daggers | suffix | StunDamageIncrease | 1348 | 74 | 1 | 51:1000 | 1000 |
| daggers | suffix | StunDamageIncrease | 1347 | 58 | 1 | 51:1000 | 1000 |
| daggers | suffix | StunDamageIncrease | 1346 | 44 | 1 | 51:1000 | 1000 |
| daggers | suffix | StunDamageIncrease | 1345 | 30 | 1 | 51:1000 | 1000 |
| daggers | suffix | StunDamageIncrease | 1344 | 20 | 1 | 51:1000 | 1000 |
| daggers | suffix | StunDamageIncrease | 1343 | 5 | 1 | 51:1000 | 1000 |
| daggers | suffix | StunDurationIncreasePercent | 1342 | 71 | 1 | 51:1000 | 1000 |
| daggers | suffix | StunDurationIncreasePercent | 1341 | 58 | 1 | 51:1000 | 1000 |
| daggers | suffix | StunDurationIncreasePercent | 1340 | 44 | 1 | 51:1000 | 1000 |
| daggers | suffix | StunDurationIncreasePercent | 1339 | 30 | 1 | 51:1000 | 1000 |
| daggers | suffix | StunDurationIncreasePercent | 1338 | 18 | 1 | 51:1000 | 1000 |
| daggers | suffix | StunDurationIncreasePercent | 1337 | 5 | 1 | 51:1000 | 1000 |
| emerald | prefix | AilmentEffect | 1763 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | AllDamage | 1926 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | AttackDamage | 1771 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | BlindEffect | 1778 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | CharmDamageWhileUsing | 1789 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | CompanionDamage | 1930 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | CompanionLife | 1931 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | CriticalAilmentEffect | 1796 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | CrossbowDamage | 1800 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | CurseEffectiveness | 1857 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | DamageForm | 14984 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | DamageVsRareOrUnique | 1781 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | ElementalDamagePercent | 1816 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | EquipmentModifierEffect | 1888 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | EvasionRatingPercent | 1822 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | HazardDamage | 1932 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | HeraldDamage | 1834 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | IncreasedAccuracyPercent | 1761 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | LightningDamagePercentage | 1846 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | LightningResistancePenetration | 1847 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | MeleeDamageIfProjectileHitRecently | 1925 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | PoisonEffect | 1881 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | ProjectileDamage | 1883 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | ProjectileDamageIfMeleeHitRecently | 1924 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | ProjectileSpeed | 1884 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | ShockEffect | 1894 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | SpearDamage | 1898 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | SpecificWeaponAccuracy | 1782 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | SpecificWeaponDamage | 1783 | 1 | 100 | 71:1 | 1 |
| emerald | prefix | SpecificWeaponDamage | 1885 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | AilmentChance | 1762 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | AilmentThreshold | 1764 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | BeltFlaskChargesGained | 1828 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | BlindOnHit | 1779 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | ChainFromTerrain | 1786 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | ChanceToPierce | 1878 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | CharmChargesGained | 1788 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | CharmDuration | 1787 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | CooldownRecovery | 1794 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | CriticalStrikeChanceIncrease | 1769 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | CriticalStrikeMultiplier | 1770 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | CrossbowReloadSpeed | 1801 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | CrossbowSpeed | 1802 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | CurseCastSpeed | 1855 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | DamagingAilmentDuration | 1812 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | DazeBuildup | 1813 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | DebuffTime | 1814 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | ElementalAilmentDuration | 1815 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | FasterAilmentDamage | 1823 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | FlaskChargeGenerationPercent | 1841 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | FlaskChargeGenerationPercent | 1851 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | FlaskDuration | 1829 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | FlaskLifeRecovery | 1840 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | FlaskManaRecovery | 1850 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | ForkingProjectiles | 1831 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | IncreasedAttackSpeed | 1772 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | IncreasedStunThresholdIfNoRecentStun | 1905 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | ManaLeechAmount | 1852 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | MarkDuration | 1856 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | MaximumLightningResistance | 1860 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | MovementVelocity | 1874 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | ParriedDebuff | 1927 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | PinBuildup | 1879 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | PoisonChanceIncrease | 1880 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | PoisonDuration | 1882 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | QuarterstaffFreezeBuildup | 1886 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | ShockChanceIncrease | 1892 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | ShockDuration | 1893 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | SlowPotency | 1895 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | SpearAttackSpeed | 1896 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | SpearCriticalDamage | 1897 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | SpecificWeaponSpeed | 1784 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | SpecificWeaponSpeed | 1887 | 1 | 100 | 71:1 | 1 |
| emerald | suffix | StunThresholdDuringParry | 1928 | 1 | 100 | 71:1 | 1 |
| flails | prefix | ColdDamage | 541 | 81 | 1 | 44:90 | 90 |
| flails | prefix | ColdDamage | 540 | 75 | 1 | 44:225 | 225 |
| flails | prefix | ColdDamage | 539 | 65 | 1 | 44:360 | 360 |
| flails | prefix | ColdDamage | 538 | 60 | 1 | 44:540 | 540 |
| flails | prefix | ColdDamage | 537 | 54 | 1 | 44:900 | 900 |
| flails | prefix | ColdDamage | 536 | 46 | 1 | 44:900 | 900 |
| flails | prefix | ColdDamage | 535 | 33 | 1 | 44:900 | 900 |
| flails | prefix | ColdDamage | 534 | 16 | 1 | 44:900 | 900 |
| flails | prefix | ColdDamage | 533 | 8 | 1 | 44:900 | 900 |
| flails | prefix | ColdDamage | 532 | 1 | 1 | 44:900 | 900 |
| flails | prefix | FireDamage | 521 | 81 | 1 | 44:110 | 110 |
| flails | prefix | FireDamage | 520 | 75 | 1 | 44:275 | 275 |
| flails | prefix | FireDamage | 519 | 65 | 1 | 44:440 | 440 |
| flails | prefix | FireDamage | 518 | 60 | 1 | 44:660 | 660 |
| flails | prefix | FireDamage | 517 | 54 | 1 | 44:1100 | 1100 |
| flails | prefix | FireDamage | 516 | 46 | 1 | 44:1100 | 1100 |
| flails | prefix | FireDamage | 515 | 33 | 1 | 44:1100 | 1100 |
| flails | prefix | FireDamage | 514 | 16 | 1 | 44:1100 | 1100 |
| flails | prefix | FireDamage | 513 | 8 | 1 | 44:1100 | 1100 |
| flails | prefix | FireDamage | 512 | 1 | 1 | 44:1100 | 1100 |
| flails | prefix | IncreasedAccuracy | 1014 | 76 | 1 | 44:200 | 200 |
| flails | prefix | IncreasedAccuracy | 1013 | 67 | 1 | 44:300 | 300 |
| flails | prefix | IncreasedAccuracy | 1012 | 58 | 1 | 44:600 | 600 |
| flails | prefix | IncreasedAccuracy | 1011 | 48 | 1 | 44:600 | 600 |
| flails | prefix | IncreasedAccuracy | 1010 | 36 | 1 | 44:800 | 800 |
| flails | prefix | IncreasedAccuracy | 1009 | 26 | 1 | 44:800 | 800 |
| flails | prefix | IncreasedAccuracy | 1008 | 18 | 1 | 44:800 | 800 |
| flails | prefix | IncreasedAccuracy | 1007 | 13 | 1 | 44:800 | 800 |
| flails | prefix | IncreasedAccuracy | 1006 | 8 | 1 | 44:800 | 800 |
| flails | prefix | IncreasedWeaponElementalDamagePercent | 1384 | 81 | 1 | 44:500 | 500 |
| flails | prefix | IncreasedWeaponElementalDamagePercent | 1383 | 60 | 1 | 44:500 | 500 |
| flails | prefix | IncreasedWeaponElementalDamagePercent | 1382 | 46 | 1 | 44:500 | 500 |
| flails | prefix | IncreasedWeaponElementalDamagePercent | 1381 | 33 | 1 | 44:500 | 500 |
| flails | prefix | IncreasedWeaponElementalDamagePercent | 1380 | 16 | 1 | 44:500 | 500 |
| flails | prefix | IncreasedWeaponElementalDamagePercent | 1379 | 4 | 1 | 44:500 | 500 |
| flails | prefix | LightningDamage | 561 | 81 | 1 | 44:80 | 80 |
| flails | prefix | LightningDamage | 560 | 75 | 1 | 44:200 | 200 |
| flails | prefix | LightningDamage | 559 | 65 | 1 | 44:320 | 320 |
| flails | prefix | LightningDamage | 558 | 60 | 1 | 44:480 | 480 |
| flails | prefix | LightningDamage | 557 | 54 | 1 | 44:800 | 800 |
| flails | prefix | LightningDamage | 556 | 46 | 1 | 44:800 | 800 |
| flails | prefix | LightningDamage | 555 | 33 | 1 | 44:800 | 800 |
| flails | prefix | LightningDamage | 554 | 16 | 1 | 44:800 | 800 |
| flails | prefix | LightningDamage | 553 | 8 | 1 | 44:800 | 800 |
| flails | prefix | LightningDamage | 552 | 1 | 1 | 44:800 | 800 |
| flails | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 624 | 81 | 1 | 44:100 | 100 |
| flails | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 623 | 70 | 1 | 44:200 | 200 |
| flails | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 622 | 65 | 1 | 44:400 | 400 |
| flails | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 621 | 54 | 1 | 44:600 | 600 |
| flails | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 620 | 38 | 1 | 44:1000 | 1000 |
| flails | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 619 | 23 | 1 | 44:1000 | 1000 |
| flails | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 618 | 14 | 1 | 44:1000 | 1000 |
| flails | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 617 | 8 | 1 | 44:1000 | 1000 |
| flails | prefix | LocalPhysicalDamagePercent | 616 | 82 | 1 | 44:25 | 25 |
| flails | prefix | LocalPhysicalDamagePercent | 615 | 75 | 1 | 44:50 | 50 |
| flails | prefix | LocalPhysicalDamagePercent | 614 | 60 | 1 | 44:100 | 100 |
| flails | prefix | LocalPhysicalDamagePercent | 613 | 46 | 1 | 44:200 | 200 |
| flails | prefix | LocalPhysicalDamagePercent | 612 | 33 | 1 | 44:400 | 400 |
| flails | prefix | LocalPhysicalDamagePercent | 611 | 16 | 1 | 44:1000 | 1000 |
| flails | prefix | LocalPhysicalDamagePercent | 610 | 8 | 1 | 44:1000 | 1000 |
| flails | prefix | LocalPhysicalDamagePercent | 609 | 1 | 1 | 44:1000 | 1000 |
| flails | prefix | PhysicalDamage | 502 | 75 | 1 | 44:100 | 100 |
| flails | prefix | PhysicalDamage | 501 | 65 | 1 | 44:200 | 200 |
| flails | prefix | PhysicalDamage | 500 | 60 | 1 | 44:400 | 400 |
| flails | prefix | PhysicalDamage | 499 | 54 | 1 | 44:600 | 600 |
| flails | prefix | PhysicalDamage | 498 | 46 | 1 | 44:1000 | 1000 |
| flails | prefix | PhysicalDamage | 497 | 33 | 1 | 44:1000 | 1000 |
| flails | prefix | PhysicalDamage | 496 | 16 | 1 | 44:1000 | 1000 |
| flails | prefix | PhysicalDamage | 495 | 8 | 1 | 44:1000 | 1000 |
| flails | prefix | PhysicalDamage | 494 | 1 | 1 | 44:1000 | 1000 |
| flails | suffix | CriticalStrikeChanceIncrease | 1035 | 73 | 1 | 44:125 | 125 |
| flails | suffix | CriticalStrikeChanceIncrease | 1034 | 59 | 1 | 44:250 | 250 |
| flails | suffix | CriticalStrikeChanceIncrease | 1033 | 44 | 1 | 44:500 | 500 |
| flails | suffix | CriticalStrikeChanceIncrease | 1032 | 30 | 1 | 44:1000 | 1000 |
| flails | suffix | CriticalStrikeChanceIncrease | 1031 | 20 | 1 | 44:1000 | 1000 |
| flails | suffix | CriticalStrikeChanceIncrease | 1030 | 1 | 1 | 44:1000 | 1000 |
| flails | suffix | CriticalStrikeMultiplier | 1078 | 73 | 1 | 44:125 | 125 |
| flails | suffix | CriticalStrikeMultiplier | 1077 | 59 | 1 | 44:250 | 250 |
| flails | suffix | CriticalStrikeMultiplier | 1076 | 44 | 1 | 44:500 | 500 |
| flails | suffix | CriticalStrikeMultiplier | 1075 | 30 | 1 | 44:1000 | 1000 |
| flails | suffix | CriticalStrikeMultiplier | 1074 | 21 | 1 | 44:1000 | 1000 |
| flails | suffix | CriticalStrikeMultiplier | 1073 | 8 | 1 | 44:1000 | 1000 |
| flails | suffix | IncreasedAttackSpeed | 967 | 77 | 1 | 44:100 | 100 |
| flails | suffix | IncreasedAttackSpeed | 966 | 60 | 1 | 44:200 | 200 |
| flails | suffix | IncreasedAttackSpeed | 965 | 45 | 1 | 44:500 | 500 |
| flails | suffix | IncreasedAttackSpeed | 964 | 37 | 1 | 44:500 | 500 |
| flails | suffix | IncreasedAttackSpeed | 963 | 30 | 1 | 44:1000 | 1000 |
| flails | suffix | IncreasedAttackSpeed | 962 | 22 | 1 | 44:1000 | 1000 |
| flails | suffix | IncreasedAttackSpeed | 961 | 11 | 1 | 44:1000 | 1000 |
| flails | suffix | IncreasedAttackSpeed | 960 | 1 | 1 | 44:1000 | 1000 |
| flails | suffix | IncreaseSocketedGemLevel | 859 | 81 | 1 | 44:100 | 100 |
| flails | suffix | IncreaseSocketedGemLevel | 858 | 55 | 1 | 44:250 | 250 |
| flails | suffix | IncreaseSocketedGemLevel | 857 | 36 | 1 | 44:500 | 500 |
| flails | suffix | IncreaseSocketedGemLevel | 856 | 18 | 1 | 44:750 | 750 |
| flails | suffix | Intelligence | 25 | 74 | 1 | 44:250 | 250 |
| flails | suffix | Intelligence | 24 | 66 | 1 | 44:250 | 250 |
| flails | suffix | Intelligence | 23 | 55 | 1 | 44:250 | 250 |
| flails | suffix | Intelligence | 22 | 44 | 1 | 44:250 | 250 |
| flails | suffix | Intelligence | 21 | 33 | 1 | 44:250 | 250 |
| flails | suffix | Intelligence | 20 | 22 | 1 | 44:250 | 250 |
| flails | suffix | Intelligence | 19 | 11 | 1 | 44:250 | 250 |
| flails | suffix | Intelligence | 18 | 1 | 1 | 44:250 | 250 |
| flails | suffix | LifeGainedFromEnemyDeath | 939 | 77 | 1 | 44:750 | 750 |
| flails | suffix | LifeGainedFromEnemyDeath | 938 | 66 | 1 | 44:750 | 750 |
| flails | suffix | LifeGainedFromEnemyDeath | 937 | 55 | 1 | 44:750 | 750 |
| flails | suffix | LifeGainedFromEnemyDeath | 936 | 44 | 1 | 44:750 | 750 |
| flails | suffix | LifeGainedFromEnemyDeath | 935 | 33 | 1 | 44:750 | 750 |
| flails | suffix | LifeGainedFromEnemyDeath | 934 | 22 | 1 | 44:750 | 750 |
| flails | suffix | LifeGainedFromEnemyDeath | 933 | 11 | 1 | 44:750 | 750 |
| flails | suffix | LifeGainedFromEnemyDeath | 932 | 1 | 1 | 44:750 | 750 |
| flails | suffix | LifeGainPerTarget | 955 | 40 | 1 | 44:1000 | 1000 |
| flails | suffix | LifeGainPerTarget | 954 | 30 | 1 | 44:1000 | 1000 |
| flails | suffix | LifeGainPerTarget | 953 | 20 | 1 | 44:1000 | 1000 |
| flails | suffix | LifeGainPerTarget | 952 | 8 | 1 | 44:1000 | 1000 |
| flails | suffix | LifeLeech | 921 | 65 | 1 | 44:1000 | 1000 |
| flails | suffix | LifeLeech | 920 | 54 | 1 | 44:1000 | 1000 |
| flails | suffix | LifeLeech | 919 | 38 | 1 | 44:1000 | 1000 |
| flails | suffix | LifeLeech | 918 | 21 | 1 | 44:1000 | 1000 |
| flails | suffix | LightRadiusAndAccuracy | 1125 | 30 | 1 | 44:1000 | 1000 |
| flails | suffix | LightRadiusAndAccuracy | 1124 | 15 | 1 | 44:1000 | 1000 |
| flails | suffix | LightRadiusAndAccuracy | 1123 | 8 | 1 | 44:1000 | 1000 |
| flails | suffix | LocalAttributeRequirements | 433 | 60 | 1 | 44:1000 | 1000 |
| flails | suffix | LocalAttributeRequirements | 432 | 52 | 1 | 44:1000 | 1000 |
| flails | suffix | LocalAttributeRequirements | 431 | 40 | 1 | 44:1000 | 1000 |
| flails | suffix | LocalAttributeRequirements | 430 | 32 | 1 | 44:1000 | 1000 |
| flails | suffix | LocalAttributeRequirements | 429 | 24 | 1 | 44:1000 | 1000 |
| flails | suffix | ManaGainedFromEnemyDeath | 947 | 78 | 1 | 44:750 | 750 |
| flails | suffix | ManaGainedFromEnemyDeath | 946 | 67 | 1 | 44:750 | 750 |
| flails | suffix | ManaGainedFromEnemyDeath | 945 | 56 | 1 | 44:750 | 750 |
| flails | suffix | ManaGainedFromEnemyDeath | 944 | 45 | 1 | 44:750 | 750 |
| flails | suffix | ManaGainedFromEnemyDeath | 943 | 34 | 1 | 44:750 | 750 |
| flails | suffix | ManaGainedFromEnemyDeath | 942 | 23 | 1 | 44:750 | 750 |
| flails | suffix | ManaGainedFromEnemyDeath | 941 | 12 | 1 | 44:750 | 750 |
| flails | suffix | ManaGainedFromEnemyDeath | 940 | 1 | 1 | 44:750 | 750 |
| flails | suffix | ManaLeech | 931 | 65 | 1 | 44:1000 | 1000 |
| flails | suffix | ManaLeech | 930 | 54 | 1 | 44:1000 | 1000 |
| flails | suffix | ManaLeech | 929 | 38 | 1 | 44:1000 | 1000 |
| flails | suffix | ManaLeech | 928 | 21 | 1 | 44:1000 | 1000 |
| flails | suffix | Strength | 7 | 74 | 1 | 44:750 | 750 |
| flails | suffix | Strength | 6 | 66 | 1 | 44:750 | 750 |
| flails | suffix | Strength | 5 | 55 | 1 | 44:750 | 750 |
| flails | suffix | Strength | 4 | 44 | 1 | 44:750 | 750 |
| flails | suffix | Strength | 3 | 33 | 1 | 44:750 | 750 |
| flails | suffix | Strength | 2 | 22 | 1 | 44:750 | 750 |
| flails | suffix | Strength | 1 | 11 | 1 | 44:750 | 750 |
| flails | suffix | Strength | 0 | 1 | 1 | 44:750 | 750 |
| flails | suffix | StunDamageIncrease | 1348 | 74 | 1 | 44:1000 | 1000 |
| flails | suffix | StunDamageIncrease | 1347 | 58 | 1 | 44:1000 | 1000 |
| flails | suffix | StunDamageIncrease | 1346 | 44 | 1 | 44:1000 | 1000 |
| flails | suffix | StunDamageIncrease | 1345 | 30 | 1 | 44:1000 | 1000 |
| flails | suffix | StunDamageIncrease | 1344 | 20 | 1 | 44:1000 | 1000 |
| flails | suffix | StunDamageIncrease | 1343 | 5 | 1 | 44:1000 | 1000 |
| flails | suffix | StunDurationIncreasePercent | 1342 | 71 | 1 | 44:1000 | 1000 |
| flails | suffix | StunDurationIncreasePercent | 1341 | 58 | 1 | 44:1000 | 1000 |
| flails | suffix | StunDurationIncreasePercent | 1340 | 44 | 1 | 44:1000 | 1000 |
| flails | suffix | StunDurationIncreasePercent | 1339 | 30 | 1 | 44:1000 | 1000 |
| flails | suffix | StunDurationIncreasePercent | 1338 | 18 | 1 | 44:1000 | 1000 |
| flails | suffix | StunDurationIncreasePercent | 1337 | 5 | 1 | 44:1000 | 1000 |
| life_flasks | prefix | FlaskBuffWhileHealing | 1520 | 42 | 850 | 69:1 | 1 |
| life_flasks | prefix | FlaskHealsOthers | 1525 | 82 | 550 | 69:1 | 1 |
| life_flasks | prefix | FlaskHealsOthers | 1524 | 64 | 550 | 69:1 | 1 |
| life_flasks | prefix | FlaskHealsOthers | 1523 | 46 | 550 | 69:1 | 1 |
| life_flasks | prefix | FlaskHealsOthers | 1522 | 28 | 550 | 69:1 | 1 |
| life_flasks | prefix | FlaskHealsOthers | 1521 | 10 | 550 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1493 | 83 | 800 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1501 | 82 | 500 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1511 | 81 | 750 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1492 | 67 | 800 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1510 | 64 | 750 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1500 | 63 | 500 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1491 | 56 | 800 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1509 | 47 | 750 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1490 | 46 | 800 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1499 | 44 | 500 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1489 | 34 | 800 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1508 | 30 | 750 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1498 | 25 | 500 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1488 | 23 | 800 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1507 | 13 | 750 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1487 | 11 | 800 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1497 | 2 | 500 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoveryAmount | 1486 | 1 | 800 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoverySpeed | 1482 | 81 | 800 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoverySpeed | 1481 | 61 | 800 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoverySpeed | 1480 | 46 | 800 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoverySpeed | 1519 | 46 | 700 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoverySpeed | 1479 | 31 | 800 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoverySpeed | 1518 | 27 | 700 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoverySpeed | 1478 | 15 | 800 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoverySpeed | 1517 | 3 | 700 | 69:1 | 1 |
| life_flasks | prefix | FlaskRecoverySpeed | 1477 | 1 | 800 | 69:1 | 1 |
| life_flasks | suffix | FlaskChargesUsed | 1470 | 83 | 900 | 69:1 | 1 |
| life_flasks | suffix | FlaskChargesUsed | 1469 | 64 | 900 | 69:1 | 1 |
| life_flasks | suffix | FlaskChargesUsed | 1468 | 49 | 900 | 69:1 | 1 |
| life_flasks | suffix | FlaskChargesUsed | 1467 | 34 | 900 | 69:1 | 1 |
| life_flasks | suffix | FlaskChargesUsed | 1466 | 14 | 900 | 69:1 | 1 |
| life_flasks | suffix | FlaskChargesUsed | 1465 | 1 | 900 | 69:1 | 1 |
| life_flasks | suffix | FlaskGainCharge | 1476 | 45 | 1000 | 69:1 | 1 |
| life_flasks | suffix | FlaskGainCharge | 1475 | 26 | 1000 | 69:1 | 1 |
| life_flasks | suffix | FlaskGainCharge | 1474 | 8 | 1000 | 69:1 | 1 |
| life_flasks | suffix | FlaskNumCharges | 1464 | 81 | 950 | 69:1 | 1 |
| life_flasks | suffix | FlaskNumCharges | 1463 | 62 | 950 | 69:1 | 1 |
| life_flasks | suffix | FlaskNumCharges | 1462 | 47 | 950 | 69:1 | 1 |
| life_flasks | suffix | FlaskNumCharges | 1461 | 32 | 950 | 69:1 | 1 |
| life_flasks | suffix | FlaskNumCharges | 1460 | 12 | 950 | 69:1 | 1 |
| life_flasks | suffix | FlaskNumCharges | 1459 | 1 | 950 | 69:1 | 1 |
| life_flasks | suffix | FlaskRechargeRate | 1458 | 82 | 900 | 69:1 | 1 |
| life_flasks | suffix | FlaskRechargeRate | 1457 | 63 | 900 | 69:1 | 1 |
| life_flasks | suffix | FlaskRechargeRate | 1456 | 48 | 900 | 69:1 | 1 |
| life_flasks | suffix | FlaskRechargeRate | 1473 | 45 | 1000 | 69:1 | 1 |
| life_flasks | suffix | FlaskRechargeRate | 1455 | 33 | 900 | 69:1 | 1 |
| life_flasks | suffix | FlaskRechargeRate | 1472 | 26 | 1000 | 69:1 | 1 |
| life_flasks | suffix | FlaskRechargeRate | 1454 | 13 | 900 | 69:1 | 1 |
| life_flasks | suffix | FlaskRechargeRate | 1471 | 8 | 1000 | 69:1 | 1 |
| life_flasks | suffix | FlaskRechargeRate | 1453 | 1 | 900 | 69:1 | 1 |
| mana_flasks | prefix | FlaskBuffWhileHealing | 1520 | 42 | 850 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1493 | 83 | 800 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1506 | 82 | 650 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1516 | 81 | 700 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1492 | 67 | 800 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1515 | 64 | 700 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1505 | 63 | 650 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1491 | 56 | 800 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1514 | 47 | 700 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1490 | 46 | 800 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1504 | 44 | 650 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1489 | 34 | 800 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1513 | 30 | 700 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1503 | 25 | 650 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1488 | 23 | 800 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1512 | 13 | 700 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1487 | 11 | 800 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1502 | 2 | 650 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoveryAmount | 1486 | 1 | 800 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoverySpeed | 1482 | 81 | 800 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoverySpeed | 1481 | 61 | 800 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoverySpeed | 1480 | 46 | 800 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoverySpeed | 1519 | 46 | 700 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoverySpeed | 1479 | 31 | 800 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoverySpeed | 1518 | 27 | 700 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoverySpeed | 1478 | 15 | 800 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoverySpeed | 1517 | 3 | 700 | 70:1 | 1 |
| mana_flasks | prefix | FlaskRecoverySpeed | 1477 | 1 | 800 | 70:1 | 1 |
| mana_flasks | suffix | FlaskChargesUsed | 1470 | 83 | 900 | 70:1 | 1 |
| mana_flasks | suffix | FlaskChargesUsed | 1469 | 64 | 900 | 70:1 | 1 |
| mana_flasks | suffix | FlaskChargesUsed | 1468 | 49 | 900 | 70:1 | 1 |
| mana_flasks | suffix | FlaskChargesUsed | 1467 | 34 | 900 | 70:1 | 1 |
| mana_flasks | suffix | FlaskChargesUsed | 1466 | 14 | 900 | 70:1 | 1 |
| mana_flasks | suffix | FlaskChargesUsed | 1465 | 1 | 900 | 70:1 | 1 |
| mana_flasks | suffix | FlaskGainCharge | 1476 | 45 | 1000 | 70:1 | 1 |
| mana_flasks | suffix | FlaskGainCharge | 1475 | 26 | 1000 | 70:1 | 1 |
| mana_flasks | suffix | FlaskGainCharge | 1474 | 8 | 1000 | 70:1 | 1 |
| mana_flasks | suffix | FlaskNumCharges | 1464 | 81 | 950 | 70:1 | 1 |
| mana_flasks | suffix | FlaskNumCharges | 1463 | 62 | 950 | 70:1 | 1 |
| mana_flasks | suffix | FlaskNumCharges | 1462 | 47 | 950 | 70:1 | 1 |
| mana_flasks | suffix | FlaskNumCharges | 1461 | 32 | 950 | 70:1 | 1 |
| mana_flasks | suffix | FlaskNumCharges | 1460 | 12 | 950 | 70:1 | 1 |
| mana_flasks | suffix | FlaskNumCharges | 1459 | 1 | 950 | 70:1 | 1 |
| mana_flasks | suffix | FlaskRechargeRate | 1458 | 82 | 900 | 70:1 | 1 |
| mana_flasks | suffix | FlaskRechargeRate | 1457 | 63 | 900 | 70:1 | 1 |
| mana_flasks | suffix | FlaskRechargeRate | 1456 | 48 | 900 | 70:1 | 1 |
| mana_flasks | suffix | FlaskRechargeRate | 1473 | 45 | 1000 | 70:1 | 1 |
| mana_flasks | suffix | FlaskRechargeRate | 1455 | 33 | 900 | 70:1 | 1 |
| mana_flasks | suffix | FlaskRechargeRate | 1472 | 26 | 1000 | 70:1 | 1 |
| mana_flasks | suffix | FlaskRechargeRate | 1454 | 13 | 900 | 70:1 | 1 |
| mana_flasks | suffix | FlaskRechargeRate | 1471 | 8 | 1000 | 70:1 | 1 |
| mana_flasks | suffix | FlaskRechargeRate | 1453 | 1 | 900 | 70:1 | 1 |
| one_hand_axes | prefix | ColdDamage | 541 | 81 | 1 | 53:80 | 80 |
| one_hand_axes | prefix | ColdDamage | 540 | 75 | 1 | 53:200 | 200 |
| one_hand_axes | prefix | ColdDamage | 539 | 65 | 1 | 53:320 | 320 |
| one_hand_axes | prefix | ColdDamage | 538 | 60 | 1 | 53:480 | 480 |
| one_hand_axes | prefix | ColdDamage | 537 | 54 | 1 | 53:800 | 800 |
| one_hand_axes | prefix | ColdDamage | 536 | 46 | 1 | 53:800 | 800 |
| one_hand_axes | prefix | ColdDamage | 535 | 33 | 1 | 53:800 | 800 |
| one_hand_axes | prefix | ColdDamage | 534 | 16 | 1 | 53:800 | 800 |
| one_hand_axes | prefix | ColdDamage | 533 | 8 | 1 | 53:800 | 800 |
| one_hand_axes | prefix | ColdDamage | 532 | 1 | 1 | 53:800 | 800 |
| one_hand_axes | prefix | FireDamage | 521 | 81 | 1 | 53:110 | 110 |
| one_hand_axes | prefix | FireDamage | 520 | 75 | 1 | 53:275 | 275 |
| one_hand_axes | prefix | FireDamage | 519 | 65 | 1 | 53:440 | 440 |
| one_hand_axes | prefix | FireDamage | 518 | 60 | 1 | 53:660 | 660 |
| one_hand_axes | prefix | FireDamage | 517 | 54 | 1 | 53:1100 | 1100 |
| one_hand_axes | prefix | FireDamage | 516 | 46 | 1 | 53:1100 | 1100 |
| one_hand_axes | prefix | FireDamage | 515 | 33 | 1 | 53:1100 | 1100 |
| one_hand_axes | prefix | FireDamage | 514 | 16 | 1 | 53:1100 | 1100 |
| one_hand_axes | prefix | FireDamage | 513 | 8 | 1 | 53:1100 | 1100 |
| one_hand_axes | prefix | FireDamage | 512 | 1 | 1 | 53:1100 | 1100 |
| one_hand_axes | prefix | IncreasedAccuracy | 1014 | 76 | 1 | 53:200 | 200 |
| one_hand_axes | prefix | IncreasedAccuracy | 1013 | 67 | 1 | 53:300 | 300 |
| one_hand_axes | prefix | IncreasedAccuracy | 1012 | 58 | 1 | 53:600 | 600 |
| one_hand_axes | prefix | IncreasedAccuracy | 1011 | 48 | 1 | 53:600 | 600 |
| one_hand_axes | prefix | IncreasedAccuracy | 1010 | 36 | 1 | 53:800 | 800 |
| one_hand_axes | prefix | IncreasedAccuracy | 1009 | 26 | 1 | 53:800 | 800 |
| one_hand_axes | prefix | IncreasedAccuracy | 1008 | 18 | 1 | 53:800 | 800 |
| one_hand_axes | prefix | IncreasedAccuracy | 1007 | 13 | 1 | 53:800 | 800 |
| one_hand_axes | prefix | IncreasedAccuracy | 1006 | 8 | 1 | 53:800 | 800 |
| one_hand_axes | prefix | IncreasedWeaponElementalDamagePercent | 1384 | 81 | 1 | 53:500 | 500 |
| one_hand_axes | prefix | IncreasedWeaponElementalDamagePercent | 1383 | 60 | 1 | 53:500 | 500 |
| one_hand_axes | prefix | IncreasedWeaponElementalDamagePercent | 1382 | 46 | 1 | 53:500 | 500 |
| one_hand_axes | prefix | IncreasedWeaponElementalDamagePercent | 1381 | 33 | 1 | 53:500 | 500 |
| one_hand_axes | prefix | IncreasedWeaponElementalDamagePercent | 1380 | 16 | 1 | 53:500 | 500 |
| one_hand_axes | prefix | IncreasedWeaponElementalDamagePercent | 1379 | 4 | 1 | 53:500 | 500 |
| one_hand_axes | prefix | LightningDamage | 561 | 81 | 1 | 53:90 | 90 |
| one_hand_axes | prefix | LightningDamage | 560 | 75 | 1 | 53:225 | 225 |
| one_hand_axes | prefix | LightningDamage | 559 | 65 | 1 | 53:360 | 360 |
| one_hand_axes | prefix | LightningDamage | 558 | 60 | 1 | 53:540 | 540 |
| one_hand_axes | prefix | LightningDamage | 557 | 54 | 1 | 53:900 | 900 |
| one_hand_axes | prefix | LightningDamage | 556 | 46 | 1 | 53:900 | 900 |
| one_hand_axes | prefix | LightningDamage | 555 | 33 | 1 | 53:900 | 900 |
| one_hand_axes | prefix | LightningDamage | 554 | 16 | 1 | 53:900 | 900 |
| one_hand_axes | prefix | LightningDamage | 553 | 8 | 1 | 53:900 | 900 |
| one_hand_axes | prefix | LightningDamage | 552 | 1 | 1 | 53:900 | 900 |
| one_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 624 | 81 | 1 | 53:100 | 100 |
| one_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 623 | 70 | 1 | 53:200 | 200 |
| one_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 622 | 65 | 1 | 53:400 | 400 |
| one_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 621 | 54 | 1 | 53:600 | 600 |
| one_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 620 | 38 | 1 | 53:1000 | 1000 |
| one_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 619 | 23 | 1 | 53:1000 | 1000 |
| one_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 618 | 14 | 1 | 53:1000 | 1000 |
| one_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 617 | 8 | 1 | 53:1000 | 1000 |
| one_hand_axes | prefix | LocalPhysicalDamagePercent | 616 | 82 | 1 | 53:25 | 25 |
| one_hand_axes | prefix | LocalPhysicalDamagePercent | 615 | 75 | 1 | 53:50 | 50 |
| one_hand_axes | prefix | LocalPhysicalDamagePercent | 614 | 60 | 1 | 53:100 | 100 |
| one_hand_axes | prefix | LocalPhysicalDamagePercent | 613 | 46 | 1 | 53:200 | 200 |
| one_hand_axes | prefix | LocalPhysicalDamagePercent | 612 | 33 | 1 | 53:400 | 400 |
| one_hand_axes | prefix | LocalPhysicalDamagePercent | 611 | 16 | 1 | 53:1000 | 1000 |
| one_hand_axes | prefix | LocalPhysicalDamagePercent | 610 | 8 | 1 | 53:1000 | 1000 |
| one_hand_axes | prefix | LocalPhysicalDamagePercent | 609 | 1 | 1 | 53:1000 | 1000 |
| one_hand_axes | prefix | PhysicalDamage | 502 | 75 | 1 | 53:100 | 100 |
| one_hand_axes | prefix | PhysicalDamage | 501 | 65 | 1 | 53:200 | 200 |
| one_hand_axes | prefix | PhysicalDamage | 500 | 60 | 1 | 53:400 | 400 |
| one_hand_axes | prefix | PhysicalDamage | 499 | 54 | 1 | 53:600 | 600 |
| one_hand_axes | prefix | PhysicalDamage | 498 | 46 | 1 | 53:1000 | 1000 |
| one_hand_axes | prefix | PhysicalDamage | 497 | 33 | 1 | 53:1000 | 1000 |
| one_hand_axes | prefix | PhysicalDamage | 496 | 16 | 1 | 53:1000 | 1000 |
| one_hand_axes | prefix | PhysicalDamage | 495 | 8 | 1 | 53:1000 | 1000 |
| one_hand_axes | prefix | PhysicalDamage | 494 | 1 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | CriticalStrikeChanceIncrease | 1035 | 73 | 1 | 53:125 | 125 |
| one_hand_axes | suffix | CriticalStrikeChanceIncrease | 1034 | 59 | 1 | 53:250 | 250 |
| one_hand_axes | suffix | CriticalStrikeChanceIncrease | 1033 | 44 | 1 | 53:500 | 500 |
| one_hand_axes | suffix | CriticalStrikeChanceIncrease | 1032 | 30 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | CriticalStrikeChanceIncrease | 1031 | 20 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | CriticalStrikeChanceIncrease | 1030 | 1 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | CriticalStrikeMultiplier | 1078 | 73 | 1 | 53:125 | 125 |
| one_hand_axes | suffix | CriticalStrikeMultiplier | 1077 | 59 | 1 | 53:250 | 250 |
| one_hand_axes | suffix | CriticalStrikeMultiplier | 1076 | 44 | 1 | 53:500 | 500 |
| one_hand_axes | suffix | CriticalStrikeMultiplier | 1075 | 30 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | CriticalStrikeMultiplier | 1074 | 21 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | CriticalStrikeMultiplier | 1073 | 8 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | IncreasedAttackSpeed | 967 | 77 | 1 | 53:100 | 100 |
| one_hand_axes | suffix | IncreasedAttackSpeed | 966 | 60 | 1 | 53:200 | 200 |
| one_hand_axes | suffix | IncreasedAttackSpeed | 965 | 45 | 1 | 53:500 | 500 |
| one_hand_axes | suffix | IncreasedAttackSpeed | 964 | 37 | 1 | 53:500 | 500 |
| one_hand_axes | suffix | IncreasedAttackSpeed | 963 | 30 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | IncreasedAttackSpeed | 962 | 22 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | IncreasedAttackSpeed | 961 | 11 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | IncreasedAttackSpeed | 960 | 1 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | IncreaseSocketedGemLevel | 859 | 81 | 1 | 53:100 | 100 |
| one_hand_axes | suffix | IncreaseSocketedGemLevel | 858 | 55 | 1 | 53:250 | 250 |
| one_hand_axes | suffix | IncreaseSocketedGemLevel | 857 | 36 | 1 | 53:500 | 500 |
| one_hand_axes | suffix | IncreaseSocketedGemLevel | 856 | 18 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | LifeGainedFromEnemyDeath | 939 | 77 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | LifeGainedFromEnemyDeath | 938 | 66 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | LifeGainedFromEnemyDeath | 937 | 55 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | LifeGainedFromEnemyDeath | 936 | 44 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | LifeGainedFromEnemyDeath | 935 | 33 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | LifeGainedFromEnemyDeath | 934 | 22 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | LifeGainedFromEnemyDeath | 933 | 11 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | LifeGainedFromEnemyDeath | 932 | 1 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | LifeGainPerTarget | 955 | 40 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LifeGainPerTarget | 954 | 30 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LifeGainPerTarget | 953 | 20 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LifeGainPerTarget | 952 | 8 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LifeLeech | 921 | 65 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LifeLeech | 920 | 54 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LifeLeech | 919 | 38 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LifeLeech | 918 | 21 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LightRadiusAndAccuracy | 1125 | 30 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LightRadiusAndAccuracy | 1124 | 15 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LightRadiusAndAccuracy | 1123 | 8 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LocalAttributeRequirements | 433 | 60 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LocalAttributeRequirements | 432 | 52 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LocalAttributeRequirements | 431 | 40 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LocalAttributeRequirements | 430 | 32 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | LocalAttributeRequirements | 429 | 24 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | ManaGainedFromEnemyDeath | 947 | 78 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | ManaGainedFromEnemyDeath | 946 | 67 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | ManaGainedFromEnemyDeath | 945 | 56 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | ManaGainedFromEnemyDeath | 944 | 45 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | ManaGainedFromEnemyDeath | 943 | 34 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | ManaGainedFromEnemyDeath | 942 | 23 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | ManaGainedFromEnemyDeath | 941 | 12 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | ManaGainedFromEnemyDeath | 940 | 1 | 1 | 53:750 | 750 |
| one_hand_axes | suffix | ManaLeech | 931 | 65 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | ManaLeech | 930 | 54 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | ManaLeech | 929 | 38 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | ManaLeech | 928 | 21 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | Strength | 7 | 74 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | Strength | 6 | 66 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | Strength | 5 | 55 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | Strength | 4 | 44 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | Strength | 3 | 33 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | Strength | 2 | 22 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | Strength | 1 | 11 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | Strength | 0 | 1 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | StunDamageIncrease | 1348 | 74 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | StunDamageIncrease | 1347 | 58 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | StunDamageIncrease | 1346 | 44 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | StunDamageIncrease | 1345 | 30 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | StunDamageIncrease | 1344 | 20 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | StunDamageIncrease | 1343 | 5 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | StunDurationIncreasePercent | 1342 | 71 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | StunDurationIncreasePercent | 1341 | 58 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | StunDurationIncreasePercent | 1340 | 44 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | StunDurationIncreasePercent | 1339 | 30 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | StunDurationIncreasePercent | 1338 | 18 | 1 | 53:1000 | 1000 |
| one_hand_axes | suffix | StunDurationIncreasePercent | 1337 | 5 | 1 | 53:1000 | 1000 |
| one_hand_maces | suffix | IncreaseSocketedGemLevel | 859 | 81 | 250 | 55:100 | 100 |
| one_hand_maces | suffix | IncreaseSocketedGemLevel | 858 | 55 | 500 | 55:250 | 250 |
| one_hand_maces | suffix | IncreaseSocketedGemLevel | 857 | 36 | 750 | 55:500 | 500 |
| one_hand_maces | suffix | IncreaseSocketedGemLevel | 856 | 18 | 1000 | 55:750 | 750 |
| one_hand_swords | prefix | ColdDamage | 541 | 81 | 1 | 54:80 | 80 |
| one_hand_swords | prefix | ColdDamage | 540 | 75 | 1 | 54:200 | 200 |
| one_hand_swords | prefix | ColdDamage | 539 | 65 | 1 | 54:360 | 360 |
| one_hand_swords | prefix | ColdDamage | 538 | 60 | 1 | 54:480 | 480 |
| one_hand_swords | prefix | ColdDamage | 537 | 54 | 1 | 54:800 | 800 |
| one_hand_swords | prefix | ColdDamage | 536 | 46 | 1 | 54:800 | 800 |
| one_hand_swords | prefix | ColdDamage | 535 | 33 | 1 | 54:800 | 800 |
| one_hand_swords | prefix | ColdDamage | 534 | 16 | 1 | 54:800 | 800 |
| one_hand_swords | prefix | ColdDamage | 533 | 8 | 1 | 54:800 | 800 |
| one_hand_swords | prefix | ColdDamage | 532 | 1 | 1 | 54:800 | 800 |
| one_hand_swords | prefix | FireDamage | 521 | 81 | 1 | 54:100 | 100 |
| one_hand_swords | prefix | FireDamage | 520 | 75 | 1 | 54:250 | 250 |
| one_hand_swords | prefix | FireDamage | 519 | 65 | 1 | 54:400 | 400 |
| one_hand_swords | prefix | FireDamage | 518 | 60 | 1 | 54:600 | 600 |
| one_hand_swords | prefix | FireDamage | 517 | 54 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | FireDamage | 516 | 46 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | FireDamage | 515 | 33 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | FireDamage | 514 | 16 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | FireDamage | 513 | 8 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | FireDamage | 512 | 1 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | IncreasedAccuracy | 1014 | 76 | 1 | 54:200 | 200 |
| one_hand_swords | prefix | IncreasedAccuracy | 1013 | 67 | 1 | 54:300 | 300 |
| one_hand_swords | prefix | IncreasedAccuracy | 1012 | 58 | 1 | 54:600 | 600 |
| one_hand_swords | prefix | IncreasedAccuracy | 1011 | 48 | 1 | 54:600 | 600 |
| one_hand_swords | prefix | IncreasedAccuracy | 1010 | 36 | 1 | 54:800 | 800 |
| one_hand_swords | prefix | IncreasedAccuracy | 1009 | 26 | 1 | 54:800 | 800 |
| one_hand_swords | prefix | IncreasedAccuracy | 1008 | 18 | 1 | 54:800 | 800 |
| one_hand_swords | prefix | IncreasedAccuracy | 1007 | 13 | 1 | 54:800 | 800 |
| one_hand_swords | prefix | IncreasedAccuracy | 1006 | 8 | 1 | 54:800 | 800 |
| one_hand_swords | prefix | IncreasedWeaponElementalDamagePercent | 1384 | 81 | 1 | 54:500 | 500 |
| one_hand_swords | prefix | IncreasedWeaponElementalDamagePercent | 1383 | 60 | 1 | 54:500 | 500 |
| one_hand_swords | prefix | IncreasedWeaponElementalDamagePercent | 1382 | 46 | 1 | 54:500 | 500 |
| one_hand_swords | prefix | IncreasedWeaponElementalDamagePercent | 1381 | 33 | 1 | 54:500 | 500 |
| one_hand_swords | prefix | IncreasedWeaponElementalDamagePercent | 1380 | 16 | 1 | 54:500 | 500 |
| one_hand_swords | prefix | IncreasedWeaponElementalDamagePercent | 1379 | 4 | 1 | 54:500 | 500 |
| one_hand_swords | prefix | LightningDamage | 561 | 81 | 1 | 54:100 | 100 |
| one_hand_swords | prefix | LightningDamage | 560 | 75 | 1 | 54:250 | 250 |
| one_hand_swords | prefix | LightningDamage | 559 | 65 | 1 | 54:400 | 400 |
| one_hand_swords | prefix | LightningDamage | 558 | 60 | 1 | 54:600 | 600 |
| one_hand_swords | prefix | LightningDamage | 557 | 54 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | LightningDamage | 556 | 46 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | LightningDamage | 555 | 33 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | LightningDamage | 554 | 16 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | LightningDamage | 553 | 8 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | LightningDamage | 552 | 1 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 624 | 81 | 1 | 54:100 | 100 |
| one_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 623 | 70 | 1 | 54:200 | 200 |
| one_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 622 | 65 | 1 | 54:400 | 400 |
| one_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 621 | 54 | 1 | 54:600 | 600 |
| one_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 620 | 38 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 619 | 23 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 618 | 14 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 617 | 8 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | LocalPhysicalDamagePercent | 616 | 82 | 1 | 54:25 | 25 |
| one_hand_swords | prefix | LocalPhysicalDamagePercent | 615 | 75 | 1 | 54:50 | 50 |
| one_hand_swords | prefix | LocalPhysicalDamagePercent | 614 | 60 | 1 | 54:100 | 100 |
| one_hand_swords | prefix | LocalPhysicalDamagePercent | 613 | 46 | 1 | 54:200 | 200 |
| one_hand_swords | prefix | LocalPhysicalDamagePercent | 612 | 33 | 1 | 54:400 | 400 |
| one_hand_swords | prefix | LocalPhysicalDamagePercent | 611 | 16 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | LocalPhysicalDamagePercent | 610 | 8 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | LocalPhysicalDamagePercent | 609 | 1 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | PhysicalDamage | 502 | 75 | 1 | 54:100 | 100 |
| one_hand_swords | prefix | PhysicalDamage | 501 | 65 | 1 | 54:200 | 200 |
| one_hand_swords | prefix | PhysicalDamage | 500 | 60 | 1 | 54:400 | 400 |
| one_hand_swords | prefix | PhysicalDamage | 499 | 54 | 1 | 54:600 | 600 |
| one_hand_swords | prefix | PhysicalDamage | 498 | 46 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | PhysicalDamage | 497 | 33 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | PhysicalDamage | 496 | 16 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | PhysicalDamage | 495 | 8 | 1 | 54:1000 | 1000 |
| one_hand_swords | prefix | PhysicalDamage | 494 | 1 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | CriticalStrikeChanceIncrease | 1035 | 73 | 1 | 54:125 | 125 |
| one_hand_swords | suffix | CriticalStrikeChanceIncrease | 1034 | 59 | 1 | 54:250 | 250 |
| one_hand_swords | suffix | CriticalStrikeChanceIncrease | 1033 | 44 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | CriticalStrikeChanceIncrease | 1032 | 30 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | CriticalStrikeChanceIncrease | 1031 | 20 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | CriticalStrikeChanceIncrease | 1030 | 1 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | CriticalStrikeMultiplier | 1078 | 73 | 1 | 54:125 | 125 |
| one_hand_swords | suffix | CriticalStrikeMultiplier | 1077 | 59 | 1 | 54:250 | 250 |
| one_hand_swords | suffix | CriticalStrikeMultiplier | 1076 | 44 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | CriticalStrikeMultiplier | 1075 | 30 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | CriticalStrikeMultiplier | 1074 | 21 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | CriticalStrikeMultiplier | 1073 | 8 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | Dexterity | 16 | 74 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Dexterity | 15 | 66 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Dexterity | 14 | 55 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Dexterity | 13 | 44 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Dexterity | 12 | 33 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Dexterity | 11 | 22 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Dexterity | 10 | 11 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Dexterity | 9 | 1 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | IncreasedAttackSpeed | 967 | 77 | 1 | 54:100 | 100 |
| one_hand_swords | suffix | IncreasedAttackSpeed | 966 | 60 | 1 | 54:200 | 200 |
| one_hand_swords | suffix | IncreasedAttackSpeed | 965 | 45 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | IncreasedAttackSpeed | 964 | 37 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | IncreasedAttackSpeed | 963 | 30 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | IncreasedAttackSpeed | 962 | 22 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | IncreasedAttackSpeed | 961 | 11 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | IncreasedAttackSpeed | 960 | 1 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | IncreaseSocketedGemLevel | 859 | 81 | 1 | 54:100 | 100 |
| one_hand_swords | suffix | IncreaseSocketedGemLevel | 858 | 55 | 1 | 54:200 | 200 |
| one_hand_swords | suffix | IncreaseSocketedGemLevel | 857 | 36 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | IncreaseSocketedGemLevel | 856 | 18 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | LifeGainedFromEnemyDeath | 939 | 77 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | LifeGainedFromEnemyDeath | 938 | 66 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | LifeGainedFromEnemyDeath | 937 | 55 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | LifeGainedFromEnemyDeath | 936 | 44 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | LifeGainedFromEnemyDeath | 935 | 33 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | LifeGainedFromEnemyDeath | 934 | 22 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | LifeGainedFromEnemyDeath | 933 | 11 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | LifeGainedFromEnemyDeath | 932 | 1 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | LifeGainPerTarget | 955 | 40 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LifeGainPerTarget | 954 | 30 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LifeGainPerTarget | 953 | 20 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LifeGainPerTarget | 952 | 8 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LifeLeech | 921 | 65 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LifeLeech | 920 | 54 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LifeLeech | 919 | 38 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LifeLeech | 918 | 21 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LightRadiusAndAccuracy | 1125 | 30 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LightRadiusAndAccuracy | 1124 | 15 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LightRadiusAndAccuracy | 1123 | 8 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LocalAttributeRequirements | 433 | 60 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LocalAttributeRequirements | 432 | 52 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LocalAttributeRequirements | 431 | 40 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LocalAttributeRequirements | 430 | 32 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | LocalAttributeRequirements | 429 | 24 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | ManaGainedFromEnemyDeath | 947 | 78 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | ManaGainedFromEnemyDeath | 946 | 67 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | ManaGainedFromEnemyDeath | 945 | 56 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | ManaGainedFromEnemyDeath | 944 | 45 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | ManaGainedFromEnemyDeath | 943 | 34 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | ManaGainedFromEnemyDeath | 942 | 23 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | ManaGainedFromEnemyDeath | 941 | 12 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | ManaGainedFromEnemyDeath | 940 | 1 | 1 | 54:750 | 750 |
| one_hand_swords | suffix | ManaLeech | 931 | 65 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | ManaLeech | 930 | 54 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | ManaLeech | 929 | 38 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | ManaLeech | 928 | 21 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | Strength | 7 | 74 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Strength | 6 | 66 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Strength | 5 | 55 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Strength | 4 | 44 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Strength | 3 | 33 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Strength | 2 | 22 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Strength | 1 | 11 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | Strength | 0 | 1 | 1 | 54:500 | 500 |
| one_hand_swords | suffix | StunDamageIncrease | 1348 | 74 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | StunDamageIncrease | 1347 | 58 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | StunDamageIncrease | 1346 | 44 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | StunDamageIncrease | 1345 | 30 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | StunDamageIncrease | 1344 | 20 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | StunDamageIncrease | 1343 | 5 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | StunDurationIncreasePercent | 1342 | 71 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | StunDurationIncreasePercent | 1341 | 58 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | StunDurationIncreasePercent | 1340 | 44 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | StunDurationIncreasePercent | 1339 | 30 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | StunDurationIncreasePercent | 1338 | 18 | 1 | 54:1000 | 1000 |
| one_hand_swords | suffix | StunDurationIncreasePercent | 1337 | 5 | 1 | 54:1000 | 1000 |
| quarterstaves | suffix | IncreaseSocketedGemLevel | 864 | 81 | 250 | 65:100 | 100 |
| quarterstaves | suffix | IncreaseSocketedGemLevel | 863 | 55 | 500 | 65:250 | 250 |
| quarterstaves | suffix | IncreaseSocketedGemLevel | 862 | 36 | 750 | 65:500 | 500 |
| quarterstaves | suffix | IncreaseSocketedGemLevel | 861 | 18 | 1000 | 65:750 | 750 |
| ruby | prefix | AreaOfEffect | 1765 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | ArmourBreak | 1767 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | AttackDamage | 1771 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | BannerArea | 1935 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | BleedChanceIncrease | 1776 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | BleedingDamage | 1906 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | DamageForm | 14983 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | DamageForm | 14984 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | DamagevsArmourBrokenEnemies | 1811 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | ElementalDamagePercent | 1816 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | ExertedAttackDamage | 1817 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | FireDamagePercentage | 1824 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | FireResistancePenetration | 1825 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | IgniteEffect | 1836 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | IncisionChance | 1933 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | IncreasedBlockChance | 1780 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | IncreasedPhysicalDamageReductionRatingPercent | 1766 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | IncreasedTotemLife | 1911 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | MaximumRage | 1861 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | MeleeDamage | 1862 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | MinionAreaOfEffect | 1864 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | MinionLife | 1870 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | PhysicalDamagePercent | 1877 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | PresenceRadius | 1937 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | ShieldArmourIncrease | 1891 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | SpecificWeaponDamage | 1848 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | Thorns | 1909 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | TotemDamage | 1910 | 1 | 100 | 73:1 | 1 |
| ruby | prefix | WarcryDamage | 1919 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | ArmourBreakDuration | 1768 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | BannerDuration | 1936 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | BannerValourGained | 1934 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | BleedDuration | 1777 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | GainRage | 1890 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | IgniteChanceIncrease | 1835 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | IncreasedStunThreshold | 1902 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | Knockback | 1838 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | LifeCost | 1839 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | LifeLeech | 1842 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | LifeRegenerationRate | 1845 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | MaceStun | 1849 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | MaximumFireResist | 1859 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | MinionPhysicalDamageReduction | 1871 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | RageOnHit | 1889 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | SkillEffectDuration | 1837 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | SpecificWeaponSpeed | 14982 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | StunDamageIncrease | 1901 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | SummonTotemCastSpeed | 1912 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | WarcryCooldownSpeed | 1918 | 1 | 100 | 73:1 | 1 |
| ruby | suffix | WarcrySpeed | 1920 | 1 | 100 | 73:1 | 1 |
| sapphire | prefix | AilmentEffect | 1763 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | AllDamage | 1795 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | AreaOfEffect | 1765 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | ColdDamagePercentage | 1792 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | ColdResistancePenetration | 1793 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | CriticalAilmentEffect | 1796 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | CurseAreaOfEffect | 1803 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | CurseEffectiveness | 1806 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | DamageForm | 14983 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | DamageForm | 14984 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | DamageWithTriggeredSpells | 1915 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | ElementalDamagePercent | 1816 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | EnergyShieldDelay | 1820 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | EnergyShieldPercent | 1819 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | FocusEnergyShield | 1830 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | IgniteEffect | 1836 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | IncreasedChaosDamage | 1790 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | MinionDamage | 1869 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | OfferingLife | 1876 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | PresenceRadius | 1937 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | ShockEffect | 1894 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | WeaponCasterDamagePrefix | 1900 | 1 | 100 | 72:1 | 1 |
| sapphire | prefix | WitheredEffect | 1922 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | AilmentChance | 1762 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | AilmentThresholdfromEnergyShield | 1904 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | BaseCurseDuration | 1805 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | CriticalStrikeChanceIncrease | 1797 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | CriticalStrikeMultiplier | 1798 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | CurseDelay | 1804 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | DamageRemovedFromManaBeforeLife | 1810 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | DamageTakenGainedAsLife | 1844 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | DamagingAilmentDuration | 1812 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | DebuffTime | 1814 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | Energy | 1818 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | FasterAilmentDamage | 1823 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | FormCritMultiplier | 1799 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | FreezeDamageIncrease | 1832 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | FreezeThreshold | 1833 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | IgniteChanceIncrease | 1835 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | IncreasedCastSpeed | 1785 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | IncreasedChillDuration | 1791 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | ManaGainedOnKillPercentage | 1853 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | ManaRegeneration | 1854 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | MaximumColdResist | 1858 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | MaximumLifeOnKillPercent | 1843 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | MinionAttackSpeedAndCastSpeed | 1865 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | MinionChaosResistance | 1866 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | MinionCriticalStrikeChance | 1867 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | MinionCriticalStrikeMultiplier | 1868 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | MinionElementalResistances | 1872 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | OfferingDuration | 1875 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | QuarterstaffFreezeBuildup | 1886 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | ShockChanceIncrease | 1892 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | ShockDuration | 1893 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | SkillEffectDuration | 1837 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | SpecificWeaponSpeed | 14982 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | SpellCriticalStrikeChanceIncrease | 1899 | 1 | 100 | 72:1 | 1 |
| sapphire | suffix | StunThresholdfromEnergyShield | 1903 | 1 | 100 | 72:1 | 1 |
| spears | suffix | IncreaseSocketedGemLevel | 859 | 81 | 125 | 43:50 | 50 |
| spears | suffix | IncreaseSocketedGemLevel | 872 | 81 | 125 | 43:50 | 50 |
| spears | suffix | IncreaseSocketedGemLevel | 858 | 55 | 250 | 43:125 | 125 |
| spears | suffix | IncreaseSocketedGemLevel | 871 | 55 | 250 | 43:125 | 125 |
| spears | suffix | IncreaseSocketedGemLevel | 857 | 36 | 375 | 43:250 | 250 |
| spears | suffix | IncreaseSocketedGemLevel | 870 | 36 | 375 | 43:250 | 250 |
| spears | suffix | IncreaseSocketedGemLevel | 856 | 18 | 500 | 43:375 | 375 |
| spears | suffix | IncreaseSocketedGemLevel | 869 | 18 | 500 | 43:375 | 375 |
| two_hand_axes | prefix | ColdDamage | 551 | 81 | 1 | 66:80 | 80 |
| two_hand_axes | prefix | ColdDamage | 550 | 75 | 1 | 66:200 | 200 |
| two_hand_axes | prefix | ColdDamage | 549 | 65 | 1 | 66:320 | 320 |
| two_hand_axes | prefix | ColdDamage | 548 | 60 | 1 | 66:480 | 480 |
| two_hand_axes | prefix | ColdDamage | 547 | 54 | 1 | 66:800 | 800 |
| two_hand_axes | prefix | ColdDamage | 546 | 46 | 1 | 66:800 | 800 |
| two_hand_axes | prefix | ColdDamage | 545 | 33 | 1 | 66:800 | 800 |
| two_hand_axes | prefix | ColdDamage | 544 | 16 | 1 | 66:800 | 800 |
| two_hand_axes | prefix | ColdDamage | 543 | 8 | 1 | 66:800 | 800 |
| two_hand_axes | prefix | ColdDamage | 542 | 1 | 1 | 66:800 | 800 |
| two_hand_axes | prefix | FireDamage | 531 | 81 | 1 | 66:110 | 110 |
| two_hand_axes | prefix | FireDamage | 530 | 75 | 1 | 66:275 | 275 |
| two_hand_axes | prefix | FireDamage | 529 | 65 | 1 | 66:440 | 440 |
| two_hand_axes | prefix | FireDamage | 528 | 60 | 1 | 66:660 | 660 |
| two_hand_axes | prefix | FireDamage | 527 | 54 | 1 | 66:1100 | 1100 |
| two_hand_axes | prefix | FireDamage | 526 | 46 | 1 | 66:1100 | 1100 |
| two_hand_axes | prefix | FireDamage | 525 | 33 | 1 | 66:1100 | 1100 |
| two_hand_axes | prefix | FireDamage | 524 | 16 | 1 | 66:1100 | 1100 |
| two_hand_axes | prefix | FireDamage | 523 | 8 | 1 | 66:1100 | 1100 |
| two_hand_axes | prefix | FireDamage | 522 | 1 | 1 | 66:1100 | 1100 |
| two_hand_axes | prefix | IncreasedAccuracy | 1014 | 76 | 1 | 66:200 | 200 |
| two_hand_axes | prefix | IncreasedAccuracy | 1013 | 67 | 1 | 66:300 | 300 |
| two_hand_axes | prefix | IncreasedAccuracy | 1012 | 58 | 1 | 66:600 | 600 |
| two_hand_axes | prefix | IncreasedAccuracy | 1011 | 48 | 1 | 66:600 | 600 |
| two_hand_axes | prefix | IncreasedAccuracy | 1010 | 36 | 1 | 66:800 | 800 |
| two_hand_axes | prefix | IncreasedAccuracy | 1009 | 26 | 1 | 66:800 | 800 |
| two_hand_axes | prefix | IncreasedAccuracy | 1008 | 18 | 1 | 66:800 | 800 |
| two_hand_axes | prefix | IncreasedAccuracy | 1007 | 13 | 1 | 66:800 | 800 |
| two_hand_axes | prefix | IncreasedAccuracy | 1006 | 8 | 1 | 66:800 | 800 |
| two_hand_axes | prefix | IncreasedWeaponElementalDamagePercent | 1390 | 81 | 1 | 66:500 | 500 |
| two_hand_axes | prefix | IncreasedWeaponElementalDamagePercent | 1389 | 60 | 1 | 66:500 | 500 |
| two_hand_axes | prefix | IncreasedWeaponElementalDamagePercent | 1388 | 46 | 1 | 66:500 | 500 |
| two_hand_axes | prefix | IncreasedWeaponElementalDamagePercent | 1387 | 33 | 1 | 66:500 | 500 |
| two_hand_axes | prefix | IncreasedWeaponElementalDamagePercent | 1386 | 16 | 1 | 66:500 | 500 |
| two_hand_axes | prefix | IncreasedWeaponElementalDamagePercent | 1385 | 4 | 1 | 66:500 | 500 |
| two_hand_axes | prefix | LightningDamage | 571 | 81 | 1 | 66:90 | 90 |
| two_hand_axes | prefix | LightningDamage | 570 | 75 | 1 | 66:225 | 225 |
| two_hand_axes | prefix | LightningDamage | 569 | 65 | 1 | 66:360 | 360 |
| two_hand_axes | prefix | LightningDamage | 568 | 60 | 1 | 66:540 | 540 |
| two_hand_axes | prefix | LightningDamage | 567 | 54 | 1 | 66:900 | 900 |
| two_hand_axes | prefix | LightningDamage | 566 | 46 | 1 | 66:900 | 900 |
| two_hand_axes | prefix | LightningDamage | 565 | 33 | 1 | 66:900 | 900 |
| two_hand_axes | prefix | LightningDamage | 564 | 16 | 1 | 66:900 | 900 |
| two_hand_axes | prefix | LightningDamage | 563 | 8 | 1 | 66:900 | 900 |
| two_hand_axes | prefix | LightningDamage | 562 | 1 | 1 | 66:900 | 900 |
| two_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 624 | 81 | 1 | 66:100 | 100 |
| two_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 623 | 70 | 1 | 66:200 | 200 |
| two_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 622 | 65 | 1 | 66:400 | 400 |
| two_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 621 | 54 | 1 | 66:600 | 600 |
| two_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 620 | 38 | 1 | 66:1000 | 1000 |
| two_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 619 | 23 | 1 | 66:1000 | 1000 |
| two_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 618 | 14 | 1 | 66:1000 | 1000 |
| two_hand_axes | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 617 | 8 | 1 | 66:1000 | 1000 |
| two_hand_axes | prefix | LocalPhysicalDamagePercent | 616 | 82 | 1 | 66:25 | 25 |
| two_hand_axes | prefix | LocalPhysicalDamagePercent | 615 | 75 | 1 | 66:50 | 50 |
| two_hand_axes | prefix | LocalPhysicalDamagePercent | 614 | 60 | 1 | 66:100 | 100 |
| two_hand_axes | prefix | LocalPhysicalDamagePercent | 613 | 46 | 1 | 66:200 | 200 |
| two_hand_axes | prefix | LocalPhysicalDamagePercent | 612 | 33 | 1 | 66:400 | 400 |
| two_hand_axes | prefix | LocalPhysicalDamagePercent | 611 | 16 | 1 | 66:1000 | 1000 |
| two_hand_axes | prefix | LocalPhysicalDamagePercent | 610 | 8 | 1 | 66:1000 | 1000 |
| two_hand_axes | prefix | LocalPhysicalDamagePercent | 609 | 1 | 1 | 66:1000 | 1000 |
| two_hand_axes | prefix | PhysicalDamage | 511 | 75 | 1 | 66:100 | 100 |
| two_hand_axes | prefix | PhysicalDamage | 510 | 65 | 1 | 66:200 | 200 |
| two_hand_axes | prefix | PhysicalDamage | 509 | 60 | 1 | 66:400 | 400 |
| two_hand_axes | prefix | PhysicalDamage | 508 | 54 | 1 | 66:600 | 600 |
| two_hand_axes | prefix | PhysicalDamage | 507 | 46 | 1 | 66:1000 | 1000 |
| two_hand_axes | prefix | PhysicalDamage | 506 | 33 | 1 | 66:1000 | 1000 |
| two_hand_axes | prefix | PhysicalDamage | 505 | 16 | 1 | 66:1000 | 1000 |
| two_hand_axes | prefix | PhysicalDamage | 504 | 8 | 1 | 66:1000 | 1000 |
| two_hand_axes | prefix | PhysicalDamage | 503 | 1 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | CriticalStrikeChanceIncrease | 1035 | 73 | 1 | 66:125 | 125 |
| two_hand_axes | suffix | CriticalStrikeChanceIncrease | 1034 | 59 | 1 | 66:250 | 250 |
| two_hand_axes | suffix | CriticalStrikeChanceIncrease | 1033 | 44 | 1 | 66:500 | 500 |
| two_hand_axes | suffix | CriticalStrikeChanceIncrease | 1032 | 30 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | CriticalStrikeChanceIncrease | 1031 | 20 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | CriticalStrikeChanceIncrease | 1030 | 1 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | CriticalStrikeMultiplier | 1078 | 73 | 1 | 66:125 | 125 |
| two_hand_axes | suffix | CriticalStrikeMultiplier | 1077 | 59 | 1 | 66:250 | 250 |
| two_hand_axes | suffix | CriticalStrikeMultiplier | 1076 | 44 | 1 | 66:500 | 500 |
| two_hand_axes | suffix | CriticalStrikeMultiplier | 1075 | 30 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | CriticalStrikeMultiplier | 1074 | 21 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | CriticalStrikeMultiplier | 1073 | 8 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | IncreasedAttackSpeed | 967 | 77 | 1 | 66:100 | 100 |
| two_hand_axes | suffix | IncreasedAttackSpeed | 966 | 60 | 1 | 66:200 | 200 |
| two_hand_axes | suffix | IncreasedAttackSpeed | 965 | 45 | 1 | 66:500 | 500 |
| two_hand_axes | suffix | IncreasedAttackSpeed | 964 | 37 | 1 | 66:500 | 500 |
| two_hand_axes | suffix | IncreasedAttackSpeed | 963 | 30 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | IncreasedAttackSpeed | 962 | 22 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | IncreasedAttackSpeed | 961 | 11 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | IncreasedAttackSpeed | 960 | 1 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | IncreaseSocketedGemLevel | 864 | 81 | 1 | 66:100 | 100 |
| two_hand_axes | suffix | IncreaseSocketedGemLevel | 863 | 55 | 1 | 66:250 | 250 |
| two_hand_axes | suffix | IncreaseSocketedGemLevel | 862 | 36 | 1 | 66:500 | 500 |
| two_hand_axes | suffix | IncreaseSocketedGemLevel | 861 | 18 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | LifeGainedFromEnemyDeath | 939 | 77 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | LifeGainedFromEnemyDeath | 938 | 66 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | LifeGainedFromEnemyDeath | 937 | 55 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | LifeGainedFromEnemyDeath | 936 | 44 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | LifeGainedFromEnemyDeath | 935 | 33 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | LifeGainedFromEnemyDeath | 934 | 22 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | LifeGainedFromEnemyDeath | 933 | 11 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | LifeGainedFromEnemyDeath | 932 | 1 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | LifeGainPerTarget | 955 | 40 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LifeGainPerTarget | 954 | 30 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LifeGainPerTarget | 953 | 20 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LifeGainPerTarget | 952 | 8 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LifeLeech | 921 | 65 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LifeLeech | 920 | 54 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LifeLeech | 919 | 38 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LifeLeech | 918 | 21 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LightRadiusAndAccuracy | 1125 | 30 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LightRadiusAndAccuracy | 1124 | 15 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LightRadiusAndAccuracy | 1123 | 8 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LocalAttributeRequirements | 433 | 60 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LocalAttributeRequirements | 432 | 52 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LocalAttributeRequirements | 431 | 40 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LocalAttributeRequirements | 430 | 32 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | LocalAttributeRequirements | 429 | 24 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | ManaGainedFromEnemyDeath | 947 | 78 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | ManaGainedFromEnemyDeath | 946 | 67 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | ManaGainedFromEnemyDeath | 945 | 56 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | ManaGainedFromEnemyDeath | 944 | 45 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | ManaGainedFromEnemyDeath | 943 | 34 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | ManaGainedFromEnemyDeath | 942 | 23 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | ManaGainedFromEnemyDeath | 941 | 12 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | ManaGainedFromEnemyDeath | 940 | 1 | 1 | 66:750 | 750 |
| two_hand_axes | suffix | ManaLeech | 931 | 65 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | ManaLeech | 930 | 54 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | ManaLeech | 929 | 38 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | ManaLeech | 928 | 21 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | Strength | 7 | 74 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | Strength | 6 | 66 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | Strength | 5 | 55 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | Strength | 4 | 44 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | Strength | 3 | 33 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | Strength | 2 | 22 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | Strength | 1 | 11 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | Strength | 0 | 1 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | StunDamageIncrease | 1348 | 74 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | StunDamageIncrease | 1347 | 58 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | StunDamageIncrease | 1346 | 44 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | StunDamageIncrease | 1345 | 30 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | StunDamageIncrease | 1344 | 20 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | StunDamageIncrease | 1343 | 5 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | StunDurationIncreasePercent | 1342 | 71 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | StunDurationIncreasePercent | 1341 | 58 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | StunDurationIncreasePercent | 1340 | 44 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | StunDurationIncreasePercent | 1339 | 30 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | StunDurationIncreasePercent | 1338 | 18 | 1 | 66:1000 | 1000 |
| two_hand_axes | suffix | StunDurationIncreasePercent | 1337 | 5 | 1 | 66:1000 | 1000 |
| two_hand_maces | suffix | IncreaseSocketedGemLevel | 864 | 81 | 250 | 68:100 | 100 |
| two_hand_maces | suffix | IncreaseSocketedGemLevel | 863 | 55 | 500 | 68:250 | 250 |
| two_hand_maces | suffix | IncreaseSocketedGemLevel | 862 | 36 | 750 | 68:500 | 500 |
| two_hand_maces | suffix | IncreaseSocketedGemLevel | 861 | 18 | 1000 | 68:750 | 750 |
| two_hand_swords | prefix | ColdDamage | 551 | 81 | 1 | 67:80 | 80 |
| two_hand_swords | prefix | ColdDamage | 550 | 75 | 1 | 67:200 | 200 |
| two_hand_swords | prefix | ColdDamage | 549 | 65 | 1 | 67:320 | 320 |
| two_hand_swords | prefix | ColdDamage | 548 | 60 | 1 | 67:480 | 480 |
| two_hand_swords | prefix | ColdDamage | 547 | 54 | 1 | 67:800 | 800 |
| two_hand_swords | prefix | ColdDamage | 546 | 46 | 1 | 67:800 | 800 |
| two_hand_swords | prefix | ColdDamage | 545 | 33 | 1 | 67:800 | 800 |
| two_hand_swords | prefix | ColdDamage | 544 | 16 | 1 | 67:800 | 800 |
| two_hand_swords | prefix | ColdDamage | 543 | 8 | 1 | 67:800 | 800 |
| two_hand_swords | prefix | ColdDamage | 542 | 1 | 1 | 67:800 | 800 |
| two_hand_swords | prefix | FireDamage | 531 | 81 | 1 | 67:100 | 100 |
| two_hand_swords | prefix | FireDamage | 530 | 75 | 1 | 67:200 | 200 |
| two_hand_swords | prefix | FireDamage | 529 | 65 | 1 | 67:400 | 400 |
| two_hand_swords | prefix | FireDamage | 528 | 60 | 1 | 67:600 | 600 |
| two_hand_swords | prefix | FireDamage | 527 | 54 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | FireDamage | 526 | 46 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | FireDamage | 525 | 33 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | FireDamage | 524 | 16 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | FireDamage | 523 | 8 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | FireDamage | 522 | 1 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | IncreasedAccuracy | 1014 | 76 | 1 | 67:200 | 200 |
| two_hand_swords | prefix | IncreasedAccuracy | 1013 | 67 | 1 | 67:300 | 300 |
| two_hand_swords | prefix | IncreasedAccuracy | 1012 | 58 | 1 | 67:600 | 600 |
| two_hand_swords | prefix | IncreasedAccuracy | 1011 | 48 | 1 | 67:600 | 600 |
| two_hand_swords | prefix | IncreasedAccuracy | 1010 | 36 | 1 | 67:800 | 800 |
| two_hand_swords | prefix | IncreasedAccuracy | 1009 | 26 | 1 | 67:800 | 800 |
| two_hand_swords | prefix | IncreasedAccuracy | 1008 | 18 | 1 | 67:800 | 800 |
| two_hand_swords | prefix | IncreasedAccuracy | 1007 | 13 | 1 | 67:800 | 800 |
| two_hand_swords | prefix | IncreasedAccuracy | 1006 | 8 | 1 | 67:800 | 800 |
| two_hand_swords | prefix | IncreasedWeaponElementalDamagePercent | 1390 | 81 | 1 | 67:500 | 500 |
| two_hand_swords | prefix | IncreasedWeaponElementalDamagePercent | 1389 | 60 | 1 | 67:500 | 500 |
| two_hand_swords | prefix | IncreasedWeaponElementalDamagePercent | 1388 | 46 | 1 | 67:500 | 500 |
| two_hand_swords | prefix | IncreasedWeaponElementalDamagePercent | 1387 | 33 | 1 | 67:500 | 500 |
| two_hand_swords | prefix | IncreasedWeaponElementalDamagePercent | 1386 | 16 | 1 | 67:500 | 500 |
| two_hand_swords | prefix | IncreasedWeaponElementalDamagePercent | 1385 | 4 | 1 | 67:500 | 500 |
| two_hand_swords | prefix | LightningDamage | 571 | 81 | 1 | 67:100 | 100 |
| two_hand_swords | prefix | LightningDamage | 570 | 75 | 1 | 67:200 | 200 |
| two_hand_swords | prefix | LightningDamage | 569 | 65 | 1 | 67:400 | 400 |
| two_hand_swords | prefix | LightningDamage | 568 | 60 | 1 | 67:600 | 600 |
| two_hand_swords | prefix | LightningDamage | 567 | 54 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | LightningDamage | 566 | 46 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | LightningDamage | 565 | 33 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | LightningDamage | 564 | 16 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | LightningDamage | 563 | 8 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | LightningDamage | 562 | 1 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 624 | 81 | 1 | 67:100 | 100 |
| two_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 623 | 70 | 1 | 67:200 | 200 |
| two_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 622 | 65 | 1 | 67:400 | 400 |
| two_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 621 | 54 | 1 | 67:600 | 600 |
| two_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 620 | 38 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 619 | 23 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 618 | 14 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | LocalIncreasedPhysicalDamagePercentAndAccuracyRating | 617 | 8 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | LocalPhysicalDamagePercent | 616 | 82 | 1 | 67:25 | 25 |
| two_hand_swords | prefix | LocalPhysicalDamagePercent | 615 | 75 | 1 | 67:50 | 50 |
| two_hand_swords | prefix | LocalPhysicalDamagePercent | 614 | 60 | 1 | 67:100 | 100 |
| two_hand_swords | prefix | LocalPhysicalDamagePercent | 613 | 46 | 1 | 67:200 | 200 |
| two_hand_swords | prefix | LocalPhysicalDamagePercent | 612 | 33 | 1 | 67:400 | 400 |
| two_hand_swords | prefix | LocalPhysicalDamagePercent | 611 | 16 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | LocalPhysicalDamagePercent | 610 | 8 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | LocalPhysicalDamagePercent | 609 | 1 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | PhysicalDamage | 511 | 75 | 1 | 67:100 | 100 |
| two_hand_swords | prefix | PhysicalDamage | 510 | 65 | 1 | 67:200 | 200 |
| two_hand_swords | prefix | PhysicalDamage | 509 | 60 | 1 | 67:400 | 400 |
| two_hand_swords | prefix | PhysicalDamage | 508 | 54 | 1 | 67:600 | 600 |
| two_hand_swords | prefix | PhysicalDamage | 507 | 46 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | PhysicalDamage | 506 | 33 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | PhysicalDamage | 505 | 16 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | PhysicalDamage | 504 | 8 | 1 | 67:1000 | 1000 |
| two_hand_swords | prefix | PhysicalDamage | 503 | 1 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | CriticalStrikeChanceIncrease | 1035 | 73 | 1 | 67:125 | 125 |
| two_hand_swords | suffix | CriticalStrikeChanceIncrease | 1034 | 59 | 1 | 67:250 | 250 |
| two_hand_swords | suffix | CriticalStrikeChanceIncrease | 1033 | 44 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | CriticalStrikeChanceIncrease | 1032 | 30 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | CriticalStrikeChanceIncrease | 1031 | 20 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | CriticalStrikeChanceIncrease | 1030 | 1 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | CriticalStrikeMultiplier | 1078 | 73 | 1 | 67:125 | 125 |
| two_hand_swords | suffix | CriticalStrikeMultiplier | 1077 | 59 | 1 | 67:250 | 250 |
| two_hand_swords | suffix | CriticalStrikeMultiplier | 1076 | 44 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | CriticalStrikeMultiplier | 1075 | 30 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | CriticalStrikeMultiplier | 1074 | 21 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | CriticalStrikeMultiplier | 1073 | 8 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | Dexterity | 16 | 74 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Dexterity | 15 | 66 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Dexterity | 14 | 55 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Dexterity | 13 | 44 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Dexterity | 12 | 33 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Dexterity | 11 | 22 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Dexterity | 10 | 11 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Dexterity | 9 | 1 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | IncreasedAttackSpeed | 967 | 77 | 1 | 67:100 | 100 |
| two_hand_swords | suffix | IncreasedAttackSpeed | 966 | 60 | 1 | 67:200 | 200 |
| two_hand_swords | suffix | IncreasedAttackSpeed | 965 | 45 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | IncreasedAttackSpeed | 964 | 37 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | IncreasedAttackSpeed | 963 | 30 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | IncreasedAttackSpeed | 962 | 22 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | IncreasedAttackSpeed | 961 | 11 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | IncreasedAttackSpeed | 960 | 1 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | IncreaseSocketedGemLevel | 864 | 81 | 1 | 67:100 | 100 |
| two_hand_swords | suffix | IncreaseSocketedGemLevel | 863 | 55 | 1 | 67:250 | 250 |
| two_hand_swords | suffix | IncreaseSocketedGemLevel | 862 | 36 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | IncreaseSocketedGemLevel | 861 | 18 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | LifeGainedFromEnemyDeath | 939 | 77 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | LifeGainedFromEnemyDeath | 938 | 66 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | LifeGainedFromEnemyDeath | 937 | 55 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | LifeGainedFromEnemyDeath | 936 | 44 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | LifeGainedFromEnemyDeath | 935 | 33 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | LifeGainedFromEnemyDeath | 934 | 22 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | LifeGainedFromEnemyDeath | 933 | 11 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | LifeGainedFromEnemyDeath | 932 | 1 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | LifeGainPerTarget | 955 | 40 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LifeGainPerTarget | 954 | 30 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LifeGainPerTarget | 953 | 20 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LifeGainPerTarget | 952 | 8 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LifeLeech | 921 | 65 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LifeLeech | 920 | 54 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LifeLeech | 919 | 38 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LifeLeech | 918 | 21 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LightRadiusAndAccuracy | 1125 | 30 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LightRadiusAndAccuracy | 1124 | 15 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LightRadiusAndAccuracy | 1123 | 8 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LocalAttributeRequirements | 433 | 60 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LocalAttributeRequirements | 432 | 52 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LocalAttributeRequirements | 431 | 40 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LocalAttributeRequirements | 430 | 32 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | LocalAttributeRequirements | 429 | 24 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | ManaGainedFromEnemyDeath | 947 | 78 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | ManaGainedFromEnemyDeath | 946 | 67 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | ManaGainedFromEnemyDeath | 945 | 56 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | ManaGainedFromEnemyDeath | 944 | 45 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | ManaGainedFromEnemyDeath | 943 | 34 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | ManaGainedFromEnemyDeath | 942 | 23 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | ManaGainedFromEnemyDeath | 941 | 12 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | ManaGainedFromEnemyDeath | 940 | 1 | 1 | 67:750 | 750 |
| two_hand_swords | suffix | ManaLeech | 931 | 65 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | ManaLeech | 930 | 54 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | ManaLeech | 929 | 38 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | ManaLeech | 928 | 21 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | Strength | 7 | 74 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Strength | 6 | 66 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Strength | 5 | 55 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Strength | 4 | 44 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Strength | 3 | 33 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Strength | 2 | 22 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Strength | 1 | 11 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | Strength | 0 | 1 | 1 | 67:500 | 500 |
| two_hand_swords | suffix | StunDamageIncrease | 1348 | 74 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | StunDamageIncrease | 1347 | 58 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | StunDamageIncrease | 1346 | 44 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | StunDamageIncrease | 1345 | 30 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | StunDamageIncrease | 1344 | 20 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | StunDamageIncrease | 1343 | 5 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | StunDurationIncreasePercent | 1342 | 71 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | StunDurationIncreasePercent | 1341 | 58 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | StunDurationIncreasePercent | 1340 | 44 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | StunDurationIncreasePercent | 1339 | 30 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | StunDurationIncreasePercent | 1338 | 18 | 1 | 67:1000 | 1000 |
| two_hand_swords | suffix | StunDurationIncreasePercent | 1337 | 5 | 1 | 67:1000 | 1000 |

## All class-dependent effective-weight rows

Count: **36**

| Pool | Affix | Legacy group | Stable ID | Required | Legacy weight | Class weights |
|---|---|---|---:|---:|---:|---|
| crossbows | prefix | FireDamage | 531 | 81 | 100 | 58:100, 103:110 |
| crossbows | prefix | FireDamage | 530 | 75 | 250 | 58:250, 103:275 |
| crossbows | prefix | FireDamage | 529 | 65 | 400 | 58:400, 103:440 |
| crossbows | prefix | FireDamage | 528 | 60 | 600 | 58:600, 103:660 |
| crossbows | prefix | FireDamage | 527 | 54 | 1000 | 58:1000, 103:1100 |
| crossbows | prefix | FireDamage | 526 | 46 | 1000 | 58:1000, 103:1100 |
| crossbows | prefix | FireDamage | 525 | 33 | 1000 | 58:1000, 103:1100 |
| crossbows | prefix | FireDamage | 524 | 16 | 1000 | 58:1000, 103:1100 |
| crossbows | prefix | FireDamage | 523 | 8 | 1000 | 58:1000, 103:1100 |
| crossbows | prefix | FireDamage | 522 | 1 | 1000 | 58:1000, 103:1100 |
| crossbows | prefix | LightningDamage | 571 | 81 | 100 | 58:100, 103:90 |
| crossbows | prefix | LightningDamage | 570 | 75 | 250 | 58:250, 103:225 |
| crossbows | prefix | LightningDamage | 569 | 65 | 400 | 58:400, 103:360 |
| crossbows | prefix | LightningDamage | 568 | 60 | 600 | 58:600, 103:540 |
| crossbows | prefix | LightningDamage | 567 | 54 | 1000 | 58:1000, 103:900 |
| crossbows | prefix | LightningDamage | 566 | 46 | 1000 | 58:1000, 103:900 |
| crossbows | prefix | LightningDamage | 565 | 33 | 1000 | 58:1000, 103:900 |
| crossbows | prefix | LightningDamage | 564 | 16 | 1000 | 58:1000, 103:900 |
| crossbows | prefix | LightningDamage | 563 | 8 | 1000 | 58:1000, 103:900 |
| crossbows | prefix | LightningDamage | 562 | 1 | 1000 | 58:1000, 103:900 |
| crossbows | suffix | Dexterity | 16 | 74 | 500 | 58:500, 103:250 |
| crossbows | suffix | Dexterity | 15 | 66 | 500 | 58:500, 103:250 |
| crossbows | suffix | Dexterity | 14 | 55 | 500 | 58:500, 103:250 |
| crossbows | suffix | Dexterity | 13 | 44 | 500 | 58:500, 103:250 |
| crossbows | suffix | Dexterity | 12 | 33 | 500 | 58:500, 103:250 |
| crossbows | suffix | Dexterity | 11 | 22 | 500 | 58:500, 103:250 |
| crossbows | suffix | Dexterity | 10 | 11 | 500 | 58:500, 103:250 |
| crossbows | suffix | Dexterity | 9 | 1 | 500 | 58:500, 103:250 |
| crossbows | suffix | Strength | 7 | 74 | 500 | 58:500, 103:750 |
| crossbows | suffix | Strength | 6 | 66 | 500 | 58:500, 103:750 |
| crossbows | suffix | Strength | 5 | 55 | 500 | 58:500, 103:750 |
| crossbows | suffix | Strength | 4 | 44 | 500 | 58:500, 103:750 |
| crossbows | suffix | Strength | 3 | 33 | 500 | 58:500, 103:750 |
| crossbows | suffix | Strength | 2 | 22 | 500 | 58:500, 103:750 |
| crossbows | suffix | Strength | 1 | 11 | 500 | 58:500, 103:750 |
| crossbows | suffix | Strength | 0 | 1 | 500 | 58:500, 103:750 |

## Compatibility and blockers

- The legacy tier field and item schema remain unchanged. Additive sourceTier/displayTier metadata is rehydrated for older stash records when their internal identity matches uniquely.
- The source export does not encode a game version; mechanics are audited against the repository target 0.5.4.
- The normalized source has no modifier display localization table; semantic disambiguation uses exact stat ranges followed by reviewed stat-ID discriminators.

The complete 7929-row legacy/runtime audit and 2734-modifier normalized audit are retained in `reports/modifier-audit.json`.

