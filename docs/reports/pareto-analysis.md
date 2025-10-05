# Pareto Analysis Report

Generated: 2025-10-05T22:40:04.478Z

## Aggregate Analysis Summary

**Dataset Overview:**
- Total repositories analyzed: 56
- Total features in JavaScript catalog: 125
- Analysis covers: totals, presence, perKLOC metrics

### Total Occurrences - Aggregate Results

- **80% of totals** achieved with **20** features **(16.0% of catalog)**
- **90% of totals** achieved with **32** features **(25.6% of catalog)**
- **95% of totals** achieved with **44** features **(35.2% of catalog)**

### File Presence - Aggregate Results

- **80% of presence** achieved with **33** features **(26.4% of catalog)**
- **90% of presence** achieved with **49** features **(39.2% of catalog)**
- **95% of presence** achieved with **63** features **(50.4% of catalog)**

### Per 1000 Lines of Code - Aggregate Results

- **80% of perKLOC** achieved with **21** features **(16.8% of catalog)**
- **90% of perKLOC** achieved with **35** features **(28.0% of catalog)**
- **95% of perKLOC** achieved with **48** features **(38.4% of catalog)**

---

## Total Occurrences

**Summary:**
- Repositories analyzed: 56
- Features with data: 113
- Total occurrences: 7462347

### Top 7 Features

| Rank | Feature | Count | % | Cumulative % |
|------|---------|-------|---|--------------|
| 1 | binaryOp_/ | 1298966 | 17.41% | 17.41% |
| 2 | labels | 782489 | 10.49% | 27.89% |
| 3 | assignOp_= | 781728 | 10.48% | 38.37% |
| 4 | functions | 460652 | 6.17% | 44.54% |
| 5 | return | 334764 | 4.49% | 49.03% |
| 6 | if | 317572 | 4.26% | 53.28% |
| 7 | binaryOp_+ | 275800 | 3.70% | 56.98% |

### Pareto Analysis

**80% of usage** comes from **20** features **(16.0% of catalog)**:
binaryOp_/, labels, assignOp_=, functions, return, if, binaryOp_+, arrowFunctions, binaryOp_*, binaryOp_|, binaryOp_===, awaitExpressions, logicalAND, binaryOp_-, templateLiterals, binaryOp_>>, exportDecls_named, ternary, importDecls, binaryOp_<

**90% of usage** comes from **32** features **(25.6% of catalog)**:
binaryOp_/, labels, assignOp_=, functions, return, if, binaryOp_+, arrowFunctions, binaryOp_*, binaryOp_|, binaryOp_===, awaitExpressions, logicalAND, binaryOp_-, templateLiterals, binaryOp_>>, exportDecls_named, ternary, importDecls, binaryOp_<, logicalOR, classMethods, binaryOp_!==, binaryOp_>, switchCases, asyncFunctions, classFields, interpolatedTemplates, updateOp_++, jsxElements, spreadElement, classDecls

**95% of usage** comes from **44** features **(35.2% of catalog)**:
binaryOp_/, labels, assignOp_=, functions, return, if, binaryOp_+, arrowFunctions, binaryOp_*, binaryOp_|, binaryOp_===, awaitExpressions, logicalAND, binaryOp_-, templateLiterals, binaryOp_>>, exportDecls_named, ternary, importDecls, binaryOp_<, logicalOR, classMethods, binaryOp_!==, binaryOp_>, switchCases, asyncFunctions, classFields, interpolatedTemplates, updateOp_++, jsxElements, spreadElement, classDecls, break, forClassic, binaryOp_==, binaryOp_>>>, throw, destructuringObject, binaryOp_&, assignOp_+=, tsAsExpression, binaryOp_<<, binaryOp_%, updateOp_--

### Catalog Usage Summary

Total features in JavaScript catalog: **125**

| Usage Threshold | Features Required | Catalog Percentage |
|-----------------|-------------------|--------------------|
| 80% | 20 | 16.0% |
| 90% | 32 | 25.6% |
| 95% | 44 | 35.2% |

### Repository Breakdown

#### core-js

- **Features Total:** 125
- **Features Observed:** 87
- **Catalog Usage:** 69.6%

**Top 7 Features:**
1. **assignOp_=**: 7020
2. **arrowFunctions**: 5482
3. **functions**: 4697
4. **return**: 4103
5. **if**: 3408
6. **binaryOp_===**: 1884
7. **logicalAND**: 1465

---

#### underscore

- **Features Total:** 125
- **Features Observed:** 54
- **Catalog Usage:** 43.2%

**Top 7 Features:**
1. **functions**: 1939
2. **return**: 1838
3. **assignOp_=**: 1726
4. **if**: 889
5. **logicalAND**: 585
6. **ternary**: 490
7. **logicalOR**: 478

---

#### three.js

- **Features Total:** 125
- **Features Observed:** 100
- **Catalog Usage:** 80.0%

**Top 7 Features:**
1. **assignOp_=**: 190570
2. **binaryOp_|**: 109471
3. **binaryOp_+**: 85920
4. **binaryOp_>>**: 78069
5. **if**: 50187
6. **functions**: 23790
7. **return**: 22342

---

#### js-yaml

- **Features Total:** 125
- **Features Observed:** 46
- **Catalog Usage:** 36.8%

**Top 7 Features:**
1. **functions**: 358
2. **assignOp_=**: 197
3. **binaryOp_+**: 182
4. **return**: 104
5. **binaryOp_===**: 65
6. **if**: 64
7. **templateLiterals**: 44

---

#### chalk

- **Features Total:** 125
- **Features Observed:** 45
- **Catalog Usage:** 36.0%

**Top 7 Features:**
1. **arrowFunctions**: 55
2. **templateLiterals**: 49
3. **taggedTemplates**: 48
4. **assignOp_=**: 40
5. **importDecls**: 27
6. **binaryOp_+**: 26
7. **return**: 25

---

#### css-loader

- **Features Total:** 125
- **Features Observed:** 56
- **Catalog Usage:** 44.8%

**Top 7 Features:**
1. **templateLiterals**: 3999
2. **assignOp_=**: 2282
3. **arrowFunctions**: 383
4. **importDecls**: 259
5. **if**: 258
6. **awaitExpressions**: 257
7. **asyncFunctions**: 255

---

#### eslint

- **Features Total:** 125
- **Features Observed:** 95
- **Catalog Usage:** 76.0%

**Top 7 Features:**
1. **assignOp_=**: 3031
2. **if**: 2790
3. **return**: 1878
4. **functions**: 1874
5. **binaryOp_===**: 1264
6. **logicalAND**: 1064
7. **logicalOR**: 659

---

#### shelljs

- **Features Total:** 125
- **Features Observed:** 54
- **Catalog Usage:** 43.2%

**Top 7 Features:**
1. **arrowFunctions**: 756
2. **templateLiterals**: 623
3. **interpolatedTemplates**: 614
4. **assignOp_=**: 470
5. **if**: 372
6. **binaryOp_+**: 360
7. **functions**: 195

---

#### react

- **Features Total:** 125
- **Features Observed:** 109
- **Catalog Usage:** 87.2%

**Top 7 Features:**
1. **assignOp_=**: 31298
2. **arrowFunctions**: 26049
3. **jsxElements**: 24810
4. **return**: 23023
5. **functions**: 22801
6. **if**: 21556
7. **binaryOp_<**: 14365

---

#### preact

- **Features Total:** 125
- **Features Observed:** 85
- **Catalog Usage:** 68.0%

**Top 7 Features:**
1. **jsxElements**: 4596
2. **arrowFunctions**: 3431
3. **assignOp_=**: 1857
4. **functions**: 1730
5. **return**: 1597
6. **if**: 769
7. **classMethods**: 766

---

#### meteor

- **Features Total:** 125
- **Features Observed:** 105
- **Catalog Usage:** 84.0%

**Top 7 Features:**
1. **assignOp_=**: 18545
2. **functions**: 13904
3. **if**: 13592
4. **return**: 10947
5. **awaitExpressions**: 8165
6. **binaryOp_+**: 6294
7. **arrowFunctions**: 4282

---

#### vue

- **Features Total:** 125
- **Features Observed:** 92
- **Catalog Usage:** 73.6%

**Top 7 Features:**
1. **arrowFunctions**: 8087
2. **templateLiterals**: 7215
3. **assignOp_=**: 4470
4. **if**: 4005
5. **return**: 3602
6. **functions**: 3095
7. **awaitExpressions**: 2599

---

#### karma

- **Features Total:** 125
- **Features Observed:** 63
- **Catalog Usage:** 50.4%

**Top 7 Features:**
1. **arrowFunctions**: 1232
2. **assignOp_=**: 1159
3. **functions**: 573
4. **return**: 449
5. **if**: 328
6. **binaryOp_+**: 239
7. **binaryOp_===**: 121

---

#### winston

- **Features Total:** 125
- **Features Observed:** 42
- **Catalog Usage:** 33.6%

**Top 7 Features:**
1. **functions**: 378
2. **arrowFunctions**: 138
3. **assignOp_=**: 109
4. **awaitExpressions**: 73
5. **templateLiterals**: 51
6. **return**: 42
7. **interpolatedTemplates**: 35

---

#### express

- **Features Total:** 125
- **Features Observed:** 33
- **Catalog Usage:** 26.4%

**Top 7 Features:**
1. **functions**: 2954
2. **assignOp_=**: 310
3. **binaryOp_+**: 286
4. **return**: 202
5. **if**: 192
6. **binaryOp_===**: 54
7. **updateOp_++**: 49

---

#### jasmine

- **Features Total:** 125
- **Features Observed:** 74
- **Catalog Usage:** 59.2%

**Top 7 Features:**
1. **functions**: 5771
2. **assignOp_=**: 1704
3. **return**: 1650
4. **binaryOp_+**: 833
5. **if**: 686
6. **awaitExpressions**: 346
7. **asyncFunctions**: 307

---

#### angular

- **Features Total:** 125
- **Features Observed:** 106
- **Catalog Usage:** 84.8%

**Top 7 Features:**
1. **arrowFunctions**: 35803
2. **functions**: 21490
3. **assignOp_=**: 19126
4. **templateLiterals**: 19035
5. **return**: 17747
6. **importDecls**: 17738
7. **if**: 16031

---

#### html5-boilerplate

- **Features Total:** 125
- **Features Observed:** 20
- **Catalog Usage:** 16.0%

**Top 7 Features:**
1. **importDecls**: 24
2. **arrowFunctions**: 19
3. **templateLiterals**: 16
4. **interpolatedTemplates**: 15
5. **assignOp_=**: 8
6. **functions**: 6
7. **binaryOp_!==**: 5

---

#### webpack

- **Features Total:** 125
- **Features Observed:** 101
- **Catalog Usage:** 80.8%

**Top 7 Features:**
1. **assignOp_=**: 12136
2. **if**: 6524
3. **arrowFunctions**: 5184
4. **binaryOp_===**: 4261
5. **functions**: 3979
6. **return**: 3739
7. **importDecls**: 2625

---

#### video.js

- **Features Total:** 125
- **Features Observed:** 78
- **Catalog Usage:** 62.4%

**Top 7 Features:**
1. **assignOp_=**: 4483
2. **binaryOp_+**: 3929
3. **functions**: 3695
4. **if**: 2305
5. **return**: 1791
6. **arrowFunctions**: 1035
7. **binaryOp_===**: 937

---

#### react-router

- **Features Total:** 125
- **Features Observed:** 88
- **Catalog Usage:** 70.4%

**Top 7 Features:**
1. **awaitExpressions**: 7113
2. **arrowFunctions**: 4413
3. **templateLiterals**: 2657
4. **asyncFunctions**: 2272
5. **assignOp_=**: 1371
6. **importDecls**: 1353
7. **return**: 1204

---

#### node-semver

- **Features Total:** 125
- **Features Observed:** 57
- **Catalog Usage:** 45.6%

**Top 7 Features:**
1. **templateLiterals**: 374
2. **arrowFunctions**: 357
3. **assignOp_=**: 320
4. **interpolatedTemplates**: 313
5. **if**: 228
6. **return**: 171
7. **binaryOp_===**: 138

---

#### sails

- **Features Total:** 125
- **Features Observed:** 45
- **Catalog Usage:** 36.0%

**Top 7 Features:**
1. **functions**: 2933
2. **return**: 1312
3. **if**: 758
4. **assignOp_=**: 751
5. **binaryOp_+**: 574
6. **templateLiterals**: 244
7. **taggedTemplates**: 157

---

#### tailwindcss

- **Features Total:** 125
- **Features Observed:** 98
- **Catalog Usage:** 78.4%

**Top 7 Features:**
1. **templateLiterals**: 4791
2. **arrowFunctions**: 3390
3. **awaitExpressions**: 2642
4. **if**: 2480
5. **taggedTemplates**: 2406
6. **return**: 2153
7. **binaryOp_===**: 1653

---

#### aws-sdk-js

- **Features Total:** 125
- **Features Observed:** 66
- **Catalog Usage:** 52.8%

**Top 7 Features:**
1. **classMethods**: 29787
2. **assignOp_=**: 7432
3. **functions**: 6672
4. **return**: 3902
5. **importDecls**: 2402
6. **binaryOp_+**: 1168
7. **if**: 1055

---

#### mocha

- **Features Total:** 125
- **Features Observed:** 62
- **Catalog Usage:** 49.6%

**Top 7 Features:**
1. **functions**: 4105
2. **assignOp_=**: 857
3. **binaryOp_+**: 506
4. **return**: 485
5. **arrowFunctions**: 467
6. **if**: 348
7. **throw**: 173

---

#### fastify

- **Features Total:** 125
- **Features Observed:** 70
- **Catalog Usage:** 56.0%

**Top 7 Features:**
1. **arrowFunctions**: 5789
2. **awaitExpressions**: 2116
3. **functions**: 2033
4. **asyncFunctions**: 1527
5. **return**: 745
6. **assignOp_=**: 597
7. **binaryOp_+**: 407

---

#### mithril

- **Features Total:** 125
- **Features Observed:** 63
- **Catalog Usage:** 50.4%

**Top 7 Features:**
1. **functions**: 3126
2. **assignOp_=**: 1549
3. **return**: 881
4. **if**: 790
5. **binaryOp_+**: 551
6. **binaryOp_===**: 437
7. **logicalAND**: 255

---

#### lodash

- **Features Total:** 125
- **Features Observed:** 54
- **Catalog Usage:** 43.2%

**Top 7 Features:**
1. **functions**: 4438
2. **assignOp_=**: 2158
3. **return**: 1757
4. **binaryOp_+**: 1618
5. **if**: 990
6. **ternary**: 972
7. **arrayMethod_map**: 762

---

#### alpine

- **Features Total:** 125
- **Features Observed:** 70
- **Catalog Usage:** 56.0%

**Top 7 Features:**
1. **arrowFunctions**: 1459
2. **return**: 824
3. **functions**: 823
4. **if**: 774
5. **assignOp_=**: 665
6. **templateLiterals**: 663
7. **paramDestructuringObject**: 564

---

#### tests

- **Features Total:** 125
- **Features Observed:** 27
- **Catalog Usage:** 21.6%

**Top 7 Features:**
1. **classFields**: 18
2. **if**: 16
3. **importDecls**: 14
4. **functions**: 13
5. **classMethods**: 12
6. **return**: 9
7. **nullishCoalescing**: 8

---

#### redux

- **Features Total:** 125
- **Features Observed:** 67
- **Catalog Usage:** 53.6%

**Top 7 Features:**
1. **arrowFunctions**: 888
2. **importDecls**: 520
3. **return**: 322
4. **jsxElements**: 311
5. **exportDecls_named**: 176
6. **functions**: 132
7. **if**: 129

---

#### next.js

- **Features Total:** 125
- **Features Observed:** 111
- **Catalog Usage:** 88.8%

**Top 7 Features:**
1. **assignOp_=**: 148096
2. **if**: 72707
3. **return**: 70726
4. **functions**: 60019
5. **binaryOp_===**: 56504
6. **logicalAND**: 49905
7. **binaryOp_+**: 42489

---

#### chart.js

- **Features Total:** 125
- **Features Observed:** 77
- **Catalog Usage:** 61.6%

**Top 7 Features:**
1. **assignOp_=**: 3186
2. **functions**: 2697
3. **return**: 1235
4. **if**: 1089
5. **binaryOp_+**: 888
6. **binaryOp_-**: 633
7. **ternary**: 624

---

#### moment

- **Features Total:** 125
- **Features Observed:** 47
- **Catalog Usage:** 37.6%

**Top 7 Features:**
1. **binaryOp_+**: 6542
2. **functions**: 6243
3. **return**: 5551
4. **assignOp_=**: 4798
5. **if**: 2969
6. **binaryOp_===**: 2446
7. **ternary**: 2389

---

#### mongoose

- **Features Total:** 125
- **Features Observed:** 76
- **Catalog Usage:** 60.8%

**Top 7 Features:**
1. **functions**: 7019
2. **awaitExpressions**: 6784
3. **assignOp_=**: 3143
4. **asyncFunctions**: 2680
5. **arrowFunctions**: 2330
6. **return**: 1263
7. **arrayMethod_find**: 590

---

#### debug

- **Features Total:** 125
- **Features Observed:** 35
- **Catalog Usage:** 28.0%

**Top 7 Features:**
1. **assignOp_=**: 96
2. **arrowFunctions**: 46
3. **return**: 37
4. **if**: 30
5. **functions**: 27
6. **binaryOp_+**: 25
7. **logicalAND**: 20

---

#### sveltekit

- **Features Total:** 125
- **Features Observed:** 93
- **Catalog Usage:** 74.4%

**Top 7 Features:**
1. **awaitExpressions**: 3274
2. **arrowFunctions**: 2666
3. **if**: 2124
4. **return**: 1802
5. **importDecls**: 1348
6. **exportDecls_named**: 1282
7. **templateLiterals**: 1259

---

#### dotenv

- **Features Total:** 125
- **Features Observed:** 19
- **Catalog Usage:** 15.2%

**Top 7 Features:**
1. **arrowFunctions**: 73
2. **assignOp_=**: 66
3. **catch**: 12
4. **try**: 12
5. **if**: 8
6. **forOf**: 6
7. **templateLiterals**: 5

---

#### hexo

- **Features Total:** 125
- **Features Observed:** 50
- **Catalog Usage:** 40.0%

**Top 7 Features:**
1. **arrowFunctions**: 1939
2. **awaitExpressions**: 1207
3. **binaryOp_+**: 1183
4. **assignOp_=**: 643
5. **asyncFunctions**: 552
6. **importDecls**: 450
7. **return**: 229

---

#### backbone

- **Features Total:** 125
- **Features Observed:** 45
- **Catalog Usage:** 36.0%

**Top 7 Features:**
1. **functions**: 1382
2. **assignOp_=**: 889
3. **return**: 481
4. **if**: 457
5. **binaryOp_===**: 148
6. **logicalAND**: 131
7. **logicalOR**: 130

---

#### zx

- **Features Total:** 125
- **Features Observed:** 79
- **Catalog Usage:** 63.2%

**Top 7 Features:**
1. **arrowFunctions**: 604
2. **templateLiterals**: 482
3. **awaitExpressions**: 410
4. **taggedTemplates**: 322
5. **asyncFunctions**: 262
6. **importDecls**: 206
7. **return**: 199

---

#### prettier

- **Features Total:** 125
- **Features Observed:** 0
- **Catalog Usage:** 0.0%

---

#### airbnb-style-guide

- **Features Total:** 125
- **Features Observed:** 19
- **Catalog Usage:** 15.2%

**Top 7 Features:**
1. **arrowFunctions**: 38
2. **assignOp_=**: 37
3. **if**: 23
4. **binaryOp_===**: 20
5. **return**: 19
6. **destructuringObject**: 14
7. **arrayMethod_map**: 12

---

#### nuxt

- **Features Total:** 125
- **Features Observed:** 82
- **Catalog Usage:** 65.6%

**Top 7 Features:**
1. **arrowFunctions**: 3454
2. **awaitExpressions**: 2091
3. **importDecls**: 2090
4. **if**: 2060
5. **return**: 1694
6. **templateLiterals**: 1222
7. **binaryOp_===**: 1046

---

#### zustand

- **Features Total:** 125
- **Features Observed:** 52
- **Catalog Usage:** 41.6%

**Top 7 Features:**
1. **arrowFunctions**: 157
2. **return**: 118
3. **importDecls**: 83
4. **tsAsExpression**: 75
5. **if**: 61
6. **jsxElements**: 51
7. **assignOp_=**: 43

---

#### htmx

- **Features Total:** 125
- **Features Observed:** 0
- **Catalog Usage:** 0.0%

---

#### koa

- **Features Total:** 125
- **Features Observed:** 35
- **Catalog Usage:** 28.0%

**Top 7 Features:**
1. **arrowFunctions**: 862
2. **assignOp_=**: 431
3. **asyncFunctions**: 81
4. **awaitExpressions**: 78
5. **destructuringObject**: 78
6. **return**: 65
7. **binaryOp_===**: 20

---

#### node

- **Features Total:** 125
- **Features Observed:** 111
- **Catalog Usage:** 88.8%

**Top 7 Features:**
1. **assignOp_=**: 105208
2. **functions**: 71864
3. **binaryOp_+**: 69000
4. **arrowFunctions**: 49788
5. **return**: 40225
6. **if**: 37517
7. **binaryOp_|**: 32378

---

#### jquery

- **Features Total:** 125
- **Features Observed:** 63
- **Catalog Usage:** 50.4%

**Top 7 Features:**
1. **functions**: 3821
2. **assignOp_=**: 3549
3. **binaryOp_+**: 2281
4. **if**: 1845
5. **return**: 1639
6. **binaryOp_===**: 916
7. **logicalOR**: 860

---

#### commander.js

- **Features Total:** 125
- **Features Observed:** 38
- **Catalog Usage:** 30.4%

**Top 7 Features:**
1. **arrowFunctions**: 1862
2. **assignOp_=**: 256
3. **destructuringObject**: 141
4. **return**: 118
5. **templateLiterals**: 102
6. **functions**: 100
7. **interpolatedTemplates**: 90

---

#### uni-app

- **Features Total:** 125
- **Features Observed:** 92
- **Catalog Usage:** 73.6%

**Top 7 Features:**
1. **if**: 16741
2. **assignOp_=**: 13884
3. **return**: 12781
4. **functions**: 11068
5. **arrowFunctions**: 9029
6. **templateLiterals**: 7124
7. **importDecls**: 5941

---

#### ghost

- **Features Total:** 125
- **Features Observed:** 96
- **Catalog Usage:** 76.8%

**Top 7 Features:**
1. **functions**: 21571
2. **assignOp_=**: 17201
3. **awaitExpressions**: 15699
4. **return**: 13149
5. **if**: 9893
6. **templateLiterals**: 9520
7. **arrowFunctions**: 8691

---

#### typescript

- **Features Total:** 125
- **Features Observed:** 113
- **Catalog Usage:** 90.4%

**Top 7 Features:**
1. **binaryOp_/**: 1283404
2. **labels**: 772378
3. **binaryOp_***: 192611
4. **assignOp_=**: 153243
5. **functions**: 125341
6. **binaryOp_-**: 76529
7. **return**: 71104

---

#### parcel

- **Features Total:** 125
- **Features Observed:** 104
- **Catalog Usage:** 83.2%

**Top 7 Features:**
1. **assignOp_=**: 6864
2. **awaitExpressions**: 6703
3. **functions**: 6203
4. **binaryOp_|**: 4422
5. **importDecls**: 3730
6. **binaryOp_<**: 3536
7. **if**: 3428

---

#### axios

- **Features Total:** 125
- **Features Observed:** 76
- **Catalog Usage:** 60.8%

**Top 7 Features:**
1. **functions**: 1356
2. **assignOp_=**: 511
3. **arrowFunctions**: 433
4. **awaitExpressions**: 267
5. **return**: 254
6. **importDecls**: 215
7. **asyncFunctions**: 185

---

## File Presence

**Summary:**
- Repositories analyzed: 56
- Features with data: 113
- Total occurrences: 638817

### Top 7 Features

| Rank | Feature | Count | % | Cumulative % |
|------|---------|-------|---|--------------|
| 1 | functions | 56315 | 8.82% | 8.82% |
| 2 | assignOp_= | 44895 | 7.03% | 15.84% |
| 3 | return | 42313 | 6.62% | 22.47% |
| 4 | importDecls | 29896 | 4.68% | 27.15% |
| 5 | arrowFunctions | 29673 | 4.64% | 31.79% |
| 6 | if | 24073 | 3.77% | 35.56% |
| 7 | exportDecls_named | 23446 | 3.67% | 39.23% |

### Pareto Analysis

**80% of usage** comes from **33** features **(26.4% of catalog)**:
functions, assignOp_=, return, importDecls, arrowFunctions, if, exportDecls_named, classDecls, templateLiterals, binaryOp_===, binaryOp_+, binaryOp_<, ternary, logicalOR, exportDecls_default, destructuringObject, logicalAND, asyncFunctions, interpolatedTemplates, binaryOp_>, forClassic, awaitExpressions, classMethods, classFields, binaryOp_!==, updateOp_++, spreadElement, throw, binaryOp_-, paramDestructuringObject, try, classExtends, jsxElements

**90% of usage** comes from **49** features **(39.2% of catalog)**:
functions, assignOp_=, return, importDecls, arrowFunctions, if, exportDecls_named, classDecls, templateLiterals, binaryOp_===, binaryOp_+, binaryOp_<, ternary, logicalOR, exportDecls_default, destructuringObject, logicalAND, asyncFunctions, interpolatedTemplates, binaryOp_>, forClassic, awaitExpressions, classMethods, classFields, binaryOp_!==, updateOp_++, spreadElement, throw, binaryOp_-, paramDestructuringObject, try, classExtends, jsxElements, labels, catch, binaryOp_*, forOf, binaryOp_/, binaryOp_%, updateOp_--, assignOp_+=, arrayMethod_map, tsAsExpression, binaryOp_in, paramDefault, binaryOp_instanceof, binaryOp_==, destructuringArray, forIn

**95% of usage** comes from **63** features **(50.4% of catalog)**:
functions, assignOp_=, return, importDecls, arrowFunctions, if, exportDecls_named, classDecls, templateLiterals, binaryOp_===, binaryOp_+, binaryOp_<, ternary, logicalOR, exportDecls_default, destructuringObject, logicalAND, asyncFunctions, interpolatedTemplates, binaryOp_>, forClassic, awaitExpressions, classMethods, classFields, binaryOp_!==, updateOp_++, spreadElement, throw, binaryOp_-, paramDestructuringObject, try, classExtends, jsxElements, labels, catch, binaryOp_*, forOf, binaryOp_/, binaryOp_%, updateOp_--, assignOp_+=, arrayMethod_map, tsAsExpression, binaryOp_in, paramDefault, binaryOp_instanceof, binaryOp_==, destructuringArray, forIn, optionalChaining, binaryOp_|, break, switch, switchCases, while, importTypeOnly, binaryOp_>=, binaryOp_!=, arrayMethod_filter, dynamicImports, restElement, newPromise, continue

### Catalog Usage Summary

Total features in JavaScript catalog: **125**

| Usage Threshold | Features Required | Catalog Percentage |
|-----------------|-------------------|--------------------|
| 80% | 33 | 26.4% |
| 90% | 49 | 39.2% |
| 95% | 63 | 50.4% |

### Repository Breakdown

#### core-js

- **Features Total:** 125
- **Features Observed:** 87
- **Catalog Usage:** 69.6%

**Top 7 Features:**
1. **assignOp_=**: 2757
2. **functions**: 1163
3. **return**: 1018
4. **if**: 830
5. **arrowFunctions**: 827
6. **importDecls**: 692
7. **destructuringObject**: 497

---

#### underscore

- **Features Total:** 125
- **Features Observed:** 54
- **Catalog Usage:** 43.2%

**Top 7 Features:**
1. **exportDecls_default**: 160
2. **functions**: 144
3. **importDecls**: 138
4. **return**: 136
5. **assignOp_=**: 84
6. **if**: 79
7. **ternary**: 54

---

#### three.js

- **Features Total:** 125
- **Features Observed:** 100
- **Catalog Usage:** 80.0%

**Top 7 Features:**
1. **importDecls**: 1182
2. **functions**: 1100
3. **assignOp_=**: 1071
4. **return**: 955
5. **exportDecls_named**: 930
6. **classDecls**: 815
7. **if**: 790

---

#### js-yaml

- **Features Total:** 125
- **Features Observed:** 46
- **Catalog Usage:** 36.8%

**Top 7 Features:**
1. **functions**: 97
2. **assignOp_=**: 56
3. **return**: 27
4. **templateLiterals**: 27
5. **binaryOp_===**: 22
6. **binaryOp_+**: 21
7. **if**: 17

---

#### chalk

- **Features Total:** 125
- **Features Observed:** 45
- **Catalog Usage:** 36.0%

**Top 7 Features:**
1. **importDecls**: 11
2. **assignOp_=**: 9
3. **arrowFunctions**: 7
4. **binaryOp_+**: 6
5. **if**: 5
6. **binaryOp_===**: 4
7. **logicalOR**: 4

---

#### css-loader

- **Features Total:** 125
- **Features Observed:** 56
- **Catalog Usage:** 44.8%

**Top 7 Features:**
1. **assignOp_=**: 196
2. **importDecls**: 189
3. **exportDecls_default**: 168
4. **arrowFunctions**: 35
5. **templateLiterals**: 34
6. **return**: 29
7. **interpolatedTemplates**: 24

---

#### eslint

- **Features Total:** 125
- **Features Observed:** 95
- **Catalog Usage:** 76.0%

**Top 7 Features:**
1. **assignOp_=**: 300
2. **if**: 150
3. **functions**: 138
4. **arrowFunctions**: 133
5. **return**: 130
6. **logicalOR**: 67
7. **logicalAND**: 65

---

#### shelljs

- **Features Total:** 125
- **Features Observed:** 54
- **Catalog Usage:** 43.2%

**Top 7 Features:**
1. **assignOp_=**: 74
2. **functions**: 49
3. **return**: 42
4. **binaryOp_+**: 41
5. **if**: 39
6. **arrowFunctions**: 38
7. **binaryOp_===**: 29

---

#### react

- **Features Total:** 125
- **Features Observed:** 109
- **Catalog Usage:** 87.2%

**Top 7 Features:**
1. **functions**: 3323
2. **return**: 3097
3. **assignOp_=**: 2332
4. **exportDecls_named**: 1989
5. **importDecls**: 1820
6. **arrowFunctions**: 1807
7. **if**: 1718

---

#### preact

- **Features Total:** 125
- **Features Observed:** 85
- **Catalog Usage:** 68.0%

**Top 7 Features:**
1. **importDecls**: 186
2. **functions**: 163
3. **return**: 160
4. **arrowFunctions**: 156
5. **assignOp_=**: 149
6. **jsxElements**: 119
7. **if**: 94

---

#### meteor

- **Features Total:** 125
- **Features Observed:** 105
- **Catalog Usage:** 84.0%

**Top 7 Features:**
1. **functions**: 1030
2. **assignOp_=**: 789
3. **return**: 683
4. **if**: 679
5. **arrowFunctions**: 535
6. **importDecls**: 491
7. **binaryOp_+**: 481

---

#### vue

- **Features Total:** 125
- **Features Observed:** 92
- **Catalog Usage:** 73.6%

**Top 7 Features:**
1. **importDecls**: 464
2. **arrowFunctions**: 384
3. **functions**: 350
4. **templateLiterals**: 347
5. **return**: 337
6. **assignOp_=**: 321
7. **if**: 278

---

#### karma

- **Features Total:** 125
- **Features Observed:** 63
- **Catalog Usage:** 50.4%

**Top 7 Features:**
1. **functions**: 71
2. **assignOp_=**: 64
3. **return**: 51
4. **arrowFunctions**: 49
5. **if**: 29
6. **binaryOp_+**: 27
7. **logicalOR**: 19

---

#### winston

- **Features Total:** 125
- **Features Observed:** 42
- **Catalog Usage:** 33.6%

**Top 7 Features:**
1. **functions**: 39
2. **assignOp_=**: 28
3. **destructuringObject**: 23
4. **arrowFunctions**: 22
5. **return**: 22
6. **if**: 14
7. **templateLiterals**: 13

---

#### express

- **Features Total:** 125
- **Features Observed:** 33
- **Catalog Usage:** 26.4%

**Top 7 Features:**
1. **functions**: 127
2. **assignOp_=**: 67
3. **if**: 56
4. **return**: 52
5. **binaryOp_+**: 41
6. **binaryOp_===**: 24
7. **logicalOR**: 22

---

#### jasmine

- **Features Total:** 125
- **Features Observed:** 74
- **Catalog Usage:** 59.2%

**Top 7 Features:**
1. **functions**: 245
2. **assignOp_=**: 194
3. **return**: 185
4. **if**: 114
5. **binaryOp_+**: 104
6. **binaryOp_===**: 80
7. **throw**: 64

---

#### angular

- **Features Total:** 125
- **Features Observed:** 106
- **Catalog Usage:** 84.8%

**Top 7 Features:**
1. **importDecls**: 4266
2. **exportDecls_named**: 3444
3. **functions**: 3235
4. **return**: 2430
5. **arrowFunctions**: 2426
6. **classDecls**: 2404
7. **assignOp_=**: 2278

---

#### html5-boilerplate

- **Features Total:** 125
- **Features Observed:** 20
- **Catalog Usage:** 16.0%

**Top 7 Features:**
1. **assignOp_=**: 5
2. **importDecls**: 4
3. **arrowFunctions**: 3
4. **importMeta**: 3
5. **interpolatedTemplates**: 3
6. **templateLiterals**: 3
7. **binaryOp_!==**: 2

---

#### webpack

- **Features Total:** 125
- **Features Observed:** 101
- **Catalog Usage:** 80.8%

**Top 7 Features:**
1. **assignOp_=**: 3160
2. **functions**: 1840
3. **arrowFunctions**: 1648
4. **importDecls**: 1348
5. **return**: 1147
6. **exportDecls_default**: 957
7. **exportDecls_named**: 940

---

#### video.js

- **Features Total:** 125
- **Features Observed:** 78
- **Catalog Usage:** 62.4%

**Top 7 Features:**
1. **functions**: 210
2. **importDecls**: 191
3. **assignOp_=**: 188
4. **return**: 153
5. **if**: 138
6. **arrowFunctions**: 123
7. **binaryOp_===**: 108

---

#### react-router

- **Features Total:** 125
- **Features Observed:** 88
- **Catalog Usage:** 70.4%

**Top 7 Features:**
1. **importDecls**: 366
2. **arrowFunctions**: 245
3. **asyncFunctions**: 192
4. **functions**: 192
5. **awaitExpressions**: 187
6. **assignOp_=**: 182
7. **templateLiterals**: 172

---

#### node-semver

- **Features Total:** 125
- **Features Observed:** 57
- **Catalog Usage:** 45.6%

**Top 7 Features:**
1. **arrowFunctions**: 90
2. **assignOp_=**: 71
3. **destructuringObject**: 53
4. **templateLiterals**: 48
5. **interpolatedTemplates**: 47
6. **return**: 28
7. **logicalOR**: 24

---

#### sails

- **Features Total:** 125
- **Features Observed:** 45
- **Catalog Usage:** 36.0%

**Top 7 Features:**
1. **assignOp_=**: 160
2. **functions**: 108
3. **return**: 91
4. **if**: 90
5. **binaryOp_+**: 59
6. **binaryOp_>**: 57
7. **binaryOp_<**: 56

---

#### tailwindcss

- **Features Total:** 125
- **Features Observed:** 98
- **Catalog Usage:** 78.4%

**Top 7 Features:**
1. **importDecls**: 266
2. **arrowFunctions**: 223
3. **return**: 188
4. **templateLiterals**: 187
5. **functions**: 176
6. **if**: 171
7. **binaryOp_===**: 146

---

#### aws-sdk-js

- **Features Total:** 125
- **Features Observed:** 66
- **Catalog Usage:** 52.8%

**Top 7 Features:**
1. **functions**: 584
2. **assignOp_=**: 574
3. **return**: 500
4. **importDecls**: 397
5. **classDecls**: 383
6. **classExtends**: 383
7. **classFields**: 383

---

#### mocha

- **Features Total:** 125
- **Features Observed:** 62
- **Catalog Usage:** 49.6%

**Top 7 Features:**
1. **functions**: 307
2. **assignOp_=**: 123
3. **return**: 117
4. **if**: 94
5. **throw**: 94
6. **arrowFunctions**: 92
7. **binaryOp_+**: 54

---

#### fastify

- **Features Total:** 125
- **Features Observed:** 70
- **Catalog Usage:** 56.0%

**Top 7 Features:**
1. **arrowFunctions**: 215
2. **functions**: 184
3. **destructuringObject**: 180
4. **asyncFunctions**: 173
5. **awaitExpressions**: 146
6. **assignOp_=**: 110
7. **return**: 106

---

#### mithril

- **Features Total:** 125
- **Features Observed:** 63
- **Catalog Usage:** 50.4%

**Top 7 Features:**
1. **assignOp_=**: 87
2. **functions**: 84
3. **return**: 54
4. **if**: 40
5. **ternary**: 33
6. **binaryOp_+**: 31
7. **binaryOp_===**: 30

---

#### lodash

- **Features Total:** 125
- **Features Observed:** 54
- **Catalog Usage:** 43.2%

**Top 7 Features:**
1. **assignOp_=**: 14
2. **functions**: 12
3. **if**: 11
4. **return**: 11
5. **binaryOp_+**: 10
6. **ternary**: 10
7. **binaryOp_==**: 9

---

#### alpine

- **Features Total:** 125
- **Features Observed:** 70
- **Catalog Usage:** 56.0%

**Top 7 Features:**
1. **arrowFunctions**: 153
2. **importDecls**: 143
3. **templateLiterals**: 91
4. **paramDestructuringObject**: 90
5. **assignOp_=**: 76
6. **functions**: 76
7. **return**: 68

---

#### tests

- **Features Total:** 125
- **Features Observed:** 27
- **Catalog Usage:** 21.6%

**Top 7 Features:**
1. **arrayMethod_map**: 1
2. **arrowFunctions**: 1
3. **assignOp_=**: 1
4. **asyncFunctions**: 1
5. **awaitExpressions**: 1
6. **binaryOp_!==**: 1
7. **binaryOp_+**: 1

---

#### redux

- **Features Total:** 125
- **Features Observed:** 67
- **Catalog Usage:** 53.6%

**Top 7 Features:**
1. **importDecls**: 158
2. **arrowFunctions**: 143
3. **exportDecls_default**: 94
4. **return**: 85
5. **jsxElements**: 72
6. **assignOp_=**: 55
7. **if**: 51

---

#### next.js

- **Features Total:** 125
- **Features Observed:** 111
- **Catalog Usage:** 88.8%

**Top 7 Features:**
1. **return**: 6972
2. **functions**: 6792
3. **importDecls**: 6710
4. **exportDecls_default**: 5473
5. **arrowFunctions**: 4783
6. **jsxElements**: 3982
7. **assignOp_=**: 3545

---

#### chart.js

- **Features Total:** 125
- **Features Observed:** 77
- **Catalog Usage:** 61.6%

**Top 7 Features:**
1. **assignOp_=**: 636
2. **functions**: 245
3. **return**: 187
4. **ternary**: 142
5. **arrowFunctions**: 140
6. **importDecls**: 131
7. **binaryOp_+**: 112

---

#### moment

- **Features Total:** 125
- **Features Observed:** 47
- **Catalog Usage:** 37.6%

**Top 7 Features:**
1. **functions**: 491
2. **binaryOp_+**: 377
3. **importDecls**: 335
4. **return**: 313
5. **binaryOp_<**: 299
6. **assignOp_=**: 283
7. **ternary**: 265

---

#### mongoose

- **Features Total:** 125
- **Features Observed:** 76
- **Catalog Usage:** 60.8%

**Top 7 Features:**
1. **functions**: 229
2. **assignOp_=**: 172
3. **arrowFunctions**: 140
4. **asyncFunctions**: 129
5. **awaitExpressions**: 121
6. **return**: 119
7. **if**: 98

---

#### debug

- **Features Total:** 125
- **Features Observed:** 35
- **Catalog Usage:** 28.0%

**Top 7 Features:**
1. **assignOp_=**: 6
2. **arrowFunctions**: 5
3. **binaryOp_===**: 5
4. **functions**: 4
5. **if**: 4
6. **logicalOR**: 4
7. **arrayMethod_map**: 3

---

#### sveltekit

- **Features Total:** 125
- **Features Observed:** 93
- **Catalog Usage:** 74.4%

**Top 7 Features:**
1. **exportDecls_named**: 755
2. **functions**: 583
3. **return**: 543
4. **importDecls**: 510
5. **arrowFunctions**: 308
6. **paramDestructuringObject**: 275
7. **asyncFunctions**: 267

---

#### dotenv

- **Features Total:** 125
- **Features Observed:** 19
- **Catalog Usage:** 15.2%

**Top 7 Features:**
1. **arrowFunctions**: 4
2. **assignOp_=**: 4
3. **functions**: 3
4. **templateLiterals**: 3
5. **catch**: 2
6. **if**: 2
7. **interpolatedTemplates**: 2

---

#### hexo

- **Features Total:** 125
- **Features Observed:** 50
- **Catalog Usage:** 40.0%

**Top 7 Features:**
1. **arrowFunctions**: 121
2. **importDecls**: 121
3. **assignOp_=**: 83
4. **asyncFunctions**: 63
5. **awaitExpressions**: 62
6. **return**: 51
7. **binaryOp_+**: 47

---

#### backbone

- **Features Total:** 125
- **Features Observed:** 45
- **Catalog Usage:** 36.0%

**Top 7 Features:**
1. **assignOp_=**: 19
2. **functions**: 19
3. **return**: 15
4. **if**: 14
5. **binaryOp_===**: 13
6. **binaryOp_+**: 12
7. **binaryOp_!==**: 9

---

#### zx

- **Features Total:** 125
- **Features Observed:** 79
- **Catalog Usage:** 63.2%

**Top 7 Features:**
1. **importDecls**: 54
2. **templateLiterals**: 44
3. **arrowFunctions**: 43
4. **awaitExpressions**: 34
5. **interpolatedTemplates**: 28
6. **assignOp_=**: 26
7. **taggedTemplates**: 25

---

#### prettier

- **Features Total:** 125
- **Features Observed:** 0
- **Catalog Usage:** 0.0%

---

#### airbnb-style-guide

- **Features Total:** 125
- **Features Observed:** 19
- **Catalog Usage:** 15.2%

**Top 7 Features:**
1. **assignOp_=**: 25
2. **arrowFunctions**: 10
3. **arrayMethod_map**: 8
4. **spreadElement**: 7
5. **binaryOp_===**: 6
6. **logicalAND**: 6
7. **return**: 6

---

#### nuxt

- **Features Total:** 125
- **Features Observed:** 82
- **Catalog Usage:** 65.6%

**Top 7 Features:**
1. **importDecls**: 382
2. **arrowFunctions**: 370
3. **functions**: 300
4. **return**: 284
5. **if**: 244
6. **exportDecls_named**: 242
7. **importTypeOnly**: 215

---

#### zustand

- **Features Total:** 125
- **Features Observed:** 52
- **Catalog Usage:** 41.6%

**Top 7 Features:**
1. **importDecls**: 23
2. **return**: 22
3. **arrowFunctions**: 21
4. **exportDecls_named**: 16
5. **exportDecls_default**: 14
6. **functions**: 14
7. **assignOp_=**: 12

---

#### htmx

- **Features Total:** 125
- **Features Observed:** 0
- **Catalog Usage:** 0.0%

---

#### koa

- **Features Total:** 125
- **Features Observed:** 35
- **Catalog Usage:** 28.0%

**Top 7 Features:**
1. **arrowFunctions**: 73
2. **destructuringObject**: 73
3. **assignOp_=**: 62
4. **asyncFunctions**: 15
5. **awaitExpressions**: 15
6. **return**: 14
7. **try**: 7

---

#### node

- **Features Total:** 125
- **Features Observed:** 111
- **Catalog Usage:** 88.8%

**Top 7 Features:**
1. **functions**: 11446
2. **assignOp_=**: 7564
3. **return**: 6859
4. **arrowFunctions**: 6560
5. **if**: 5269
6. **binaryOp_%**: 4082
7. **updateOp_++**: 3861

---

#### jquery

- **Features Total:** 125
- **Features Observed:** 63
- **Catalog Usage:** 50.4%

**Top 7 Features:**
1. **functions**: 125
2. **importDecls**: 117
3. **return**: 110
4. **assignOp_=**: 109
5. **exportDecls_named**: 108
6. **if**: 97
7. **binaryOp_===**: 84

---

#### commander.js

- **Features Total:** 125
- **Features Observed:** 38
- **Catalog Usage:** 30.4%

**Top 7 Features:**
1. **arrowFunctions**: 133
2. **destructuringObject**: 52
3. **assignOp_=**: 49
4. **functions**: 38
5. **return**: 38
6. **templateLiterals**: 38
7. **interpolatedTemplates**: 34

---

#### uni-app

- **Features Total:** 125
- **Features Observed:** 92
- **Catalog Usage:** 73.6%

**Top 7 Features:**
1. **importDecls**: 1527
2. **exportDecls_named**: 1505
3. **functions**: 1284
4. **return**: 1175
5. **arrowFunctions**: 1109
6. **if**: 1083
7. **assignOp_=**: 970

---

#### ghost

- **Features Total:** 125
- **Features Observed:** 96
- **Catalog Usage:** 76.8%

**Top 7 Features:**
1. **functions**: 2536
2. **assignOp_=**: 2433
3. **return**: 2043
4. **if**: 1481
5. **arrowFunctions**: 1376
6. **importDecls**: 1240
7. **asyncFunctions**: 1200

---

#### typescript

- **Features Total:** 125
- **Features Observed:** 113
- **Catalog Usage:** 90.4%

**Top 7 Features:**
1. **functions**: 15993
2. **assignOp_=**: 11405
3. **return**: 10615
4. **classDecls**: 9289
5. **exportDecls_named**: 7340
6. **binaryOp_<**: 5733
7. **binaryOp_>**: 5414

---

#### parcel

- **Features Total:** 125
- **Features Observed:** 104
- **Catalog Usage:** 83.2%

**Top 7 Features:**
1. **assignOp_=**: 1371
2. **importDecls**: 1226
3. **functions**: 937
4. **return**: 803
5. **exportDecls_named**: 773
6. **exportDecls_default**: 645
7. **arrowFunctions**: 598

---

#### axios

- **Features Total:** 125
- **Features Observed:** 76
- **Catalog Usage:** 60.8%

**Top 7 Features:**
1. **functions**: 81
2. **importDecls**: 79
3. **assignOp_=**: 50
4. **return**: 43
5. **arrowFunctions**: 42
6. **destructuringObject**: 31
7. **binaryOp_+**: 30

---

## Per 1000 Lines of Code

**Summary:**
- Repositories analyzed: 56
- Features with data: 113
- Total occurrences: 16682.352120738833

### Top 7 Features

| Rank | Feature | Count | % | Cumulative % |
|------|---------|-------|---|--------------|
| 1 | assignOp_= | 2068.2843743474914 | 12.40% | 12.40% |
| 2 | functions | 1973.963582259294 | 11.83% | 24.23% |
| 3 | arrowFunctions | 1392.5648945954963 | 8.35% | 32.58% |
| 4 | return | 1134.9550910964742 | 6.80% | 39.38% |
| 5 | if | 1046.7898473403557 | 6.27% | 45.66% |
| 6 | binaryOp_+ | 822.9402622543561 | 4.93% | 50.59% |
| 7 | templateLiterals | 574.4184824686808 | 3.44% | 54.03% |

### Pareto Analysis

**80% of usage** comes from **21** features **(16.8% of catalog)**:
assignOp_=, functions, arrowFunctions, return, if, binaryOp_+, templateLiterals, awaitExpressions, binaryOp_===, importDecls, binaryOp_/, logicalAND, binaryOp_|, ternary, asyncFunctions, logicalOR, interpolatedTemplates, labels, exportDecls_named, binaryOp_>>, binaryOp_!==

**90% of usage** comes from **35** features **(28.0% of catalog)**:
assignOp_=, functions, arrowFunctions, return, if, binaryOp_+, templateLiterals, awaitExpressions, binaryOp_===, importDecls, binaryOp_/, logicalAND, binaryOp_|, ternary, asyncFunctions, logicalOR, interpolatedTemplates, labels, exportDecls_named, binaryOp_>>, binaryOp_!==, binaryOp_<, jsxElements, updateOp_++, classMethods, destructuringObject, binaryOp_*, binaryOp_-, taggedTemplates, binaryOp_>, switchCases, spreadElement, tsAsExpression, throw, break

**95% of usage** comes from **48** features **(38.4% of catalog)**:
assignOp_=, functions, arrowFunctions, return, if, binaryOp_+, templateLiterals, awaitExpressions, binaryOp_===, importDecls, binaryOp_/, logicalAND, binaryOp_|, ternary, asyncFunctions, logicalOR, interpolatedTemplates, labels, exportDecls_named, binaryOp_>>, binaryOp_!==, binaryOp_<, jsxElements, updateOp_++, classMethods, destructuringObject, binaryOp_*, binaryOp_-, taggedTemplates, binaryOp_>, switchCases, spreadElement, tsAsExpression, throw, break, forClassic, binaryOp_==, arrayMethod_map, classFields, paramDestructuringObject, try, assignOp_+=, catch, forOf, optionalChaining, binaryOp_>>>, binaryOp_!=, classDecls

### Catalog Usage Summary

Total features in JavaScript catalog: **125**

| Usage Threshold | Features Required | Catalog Percentage |
|-----------------|-------------------|--------------------|
| 80% | 21 | 16.8% |
| 90% | 35 | 28.0% |
| 95% | 48 | 38.4% |

### Repository Breakdown

#### core-js

- **Features Total:** 125
- **Features Observed:** 87
- **Catalog Usage:** 69.6%

**Top 7 Features:**
1. **assignOp_=**: 49.88275421018973
2. **arrowFunctions**: 38.95402543878349
3. **functions**: 33.375968165991615
4. **return**: 29.155119732821717
5. **if**: 24.216584949904075
6. **binaryOp_===**: 13.387337454700491
7. **logicalAND**: 10.410004974063812

---

#### underscore

- **Features Total:** 125
- **Features Observed:** 54
- **Catalog Usage:** 43.2%

**Top 7 Features:**
1. **functions**: 55.058636453985294
2. **return**: 52.19070335349405
3. **assignOp_=**: 49.01042110344436
4. **if**: 25.24349035976943
5. **logicalAND**: 16.611295681063122
6. **ternary**: 13.913734843967402
7. **logicalOR**: 13.572990317176364

---

#### three.js

- **Features Total:** 125
- **Features Observed:** 100
- **Catalog Usage:** 80.0%

**Top 7 Features:**
1. **assignOp_=**: 392.71406904283026
2. **binaryOp_|**: 225.59060635035775
3. **binaryOp_+**: 177.05826107026277
4. **binaryOp_>>**: 160.87943882093046
5. **if**: 103.42205479903723
6. **functions**: 49.02486069438491
7. **return**: 46.04091793333114

---

#### js-yaml

- **Features Total:** 125
- **Features Observed:** 46
- **Catalog Usage:** 36.8%

**Top 7 Features:**
1. **functions**: 76.05693647758658
2. **assignOp_=**: 41.852560016995966
3. **binaryOp_+**: 38.665816868493735
4. **return**: 22.094752496282133
5. **binaryOp_===**: 13.809220310176334
6. **if**: 13.596770766942852
7. **templateLiterals**: 9.34777990227321

---

#### chalk

- **Features Total:** 125
- **Features Observed:** 45
- **Catalog Usage:** 36.0%

**Top 7 Features:**
1. **arrowFunctions**: 44.354838709677416
2. **templateLiterals**: 39.516129032258064
3. **taggedTemplates**: 38.70967741935484
4. **assignOp_=**: 32.25806451612903
5. **importDecls**: 21.774193548387096
6. **binaryOp_+**: 20.967741935483872
7. **return**: 20.161290322580644

---

#### css-loader

- **Features Total:** 125
- **Features Observed:** 56
- **Catalog Usage:** 44.8%

**Top 7 Features:**
1. **templateLiterals**: 53.694429152624295
2. **assignOp_=**: 30.6403319145508
3. **arrowFunctions**: 5.1425272231695685
4. **importDecls**: 3.4775836835533114
5. **if**: 3.4641567195241483
6. **awaitExpressions**: 3.4507297554949847
7. **asyncFunctions**: 3.423875827436658

---

#### eslint

- **Features Total:** 125
- **Features Observed:** 95
- **Catalog Usage:** 76.0%

**Top 7 Features:**
1. **assignOp_=**: 24.727112532428333
2. **if**: 22.761017474587607
3. **return**: 15.32085692375467
4. **functions**: 15.288224640636981
5. **binaryOp_===**: 10.311801465189511
6. **logicalAND**: 8.680187309305095
7. **logicalOR**: 5.3761686436391525

---

#### shelljs

- **Features Total:** 125
- **Features Observed:** 54
- **Catalog Usage:** 43.2%

**Top 7 Features:**
1. **arrowFunctions**: 40.770101925254814
2. **templateLiterals**: 33.59758399395999
3. **interpolatedTemplates**: 33.112225637706956
4. **assignOp_=**: 25.346491937658417
5. **if**: 20.061478725125387
6. **binaryOp_+**: 19.41433425012134
7. **functions**: 10.516097718815725

---

#### react

- **Features Total:** 125
- **Features Observed:** 109
- **Catalog Usage:** 87.2%

**Top 7 Features:**
1. **assignOp_=**: 43.591014941670664
2. **arrowFunctions**: 36.2803485275602
3. **jsxElements**: 34.554702559359995
4. **return**: 32.06581688932467
5. **functions**: 31.756621243690738
6. **if**: 30.02261863641935
7. **binaryOp_<**: 20.00718670960122

---

#### preact

- **Features Total:** 125
- **Features Observed:** 85
- **Catalog Usage:** 68.0%

**Top 7 Features:**
1. **jsxElements**: 70.2978020465287
2. **arrowFunctions**: 52.47862463482158
3. **assignOp_=**: 28.403615839948607
4. **functions**: 26.46109607060371
5. **return**: 24.426803713730706
6. **if**: 11.762186634852169
7. **classMethods**: 11.716300341088116

---

#### meteor

- **Features Total:** 125
- **Features Observed:** 105
- **Catalog Usage:** 84.0%

**Top 7 Features:**
1. **assignOp_=**: 52.042846599184486
2. **functions**: 39.018805021033224
3. **if**: 38.143239200653305
4. **return**: 30.720573832368434
5. **awaitExpressions**: 22.913445267314174
6. **binaryOp_+**: 17.662856645741016
7. **arrowFunctions**: 12.016579624573092

---

#### vue

- **Features Total:** 125
- **Features Observed:** 92
- **Catalog Usage:** 73.6%

**Top 7 Features:**
1. **arrowFunctions**: 55.101693182979595
2. **templateLiterals**: 49.160222123803365
3. **assignOp_=**: 30.456852791878177
4. **if**: 27.28852246789085
5. **return**: 24.54263618710183
6. **functions**: 21.08813409191565
7. **awaitExpressions**: 17.708581746329166

---

#### karma

- **Features Total:** 125
- **Features Observed:** 63
- **Catalog Usage:** 50.4%

**Top 7 Features:**
1. **arrowFunctions**: 37.30846102598268
2. **assignOp_=**: 35.09781357882624
3. **functions**: 17.35206831809097
4. **return**: 13.596995942099207
5. **if**: 9.932772091333051
6. **binaryOp_+**: 7.237599176306705
7. **binaryOp_===**: 3.664223850766156

---

#### winston

- **Features Total:** 125
- **Features Observed:** 42
- **Catalog Usage:** 33.6%

**Top 7 Features:**
1. **functions**: 28.584392014519057
2. **arrowFunctions**: 10.43557168784029
3. **assignOp_=**: 8.24258923169994
4. **awaitExpressions**: 5.5202661826981245
5. **templateLiterals**: 3.856624319419238
6. **return**: 3.176043557168784
7. **interpolatedTemplates**: 2.64670296430732

---

#### express

- **Features Total:** 125
- **Features Observed:** 33
- **Catalog Usage:** 26.4%

**Top 7 Features:**
1. **functions**: 158.73186458893068
2. **assignOp_=**: 16.657710908113916
3. **binaryOp_+**: 15.368081676518
4. **return**: 10.854379365932294
5. **if**: 10.317033852767329
6. **binaryOp_===**: 2.9016657710908116
7. **updateOp_++**: 2.632993014508329

---

#### jasmine

- **Features Total:** 125
- **Features Observed:** 74
- **Catalog Usage:** 59.2%

**Top 7 Features:**
1. **functions**: 124.3267697875824
2. **assignOp_=**: 36.70989702270671
3. **return**: 35.5465552156491
4. **binaryOp_+**: 17.945624542203454
5. **if**: 14.77874962299108
6. **awaitExpressions**: 7.45400491188763
7. **asyncFunctions**: 6.613813606790469

---

#### angular

- **Features Total:** 125
- **Features Observed:** 106
- **Catalog Usage:** 84.8%

**Top 7 Features:**
1. **arrowFunctions**: 34.92839303832046
2. **functions**: 20.965035510809336
3. **assignOp_=**: 18.658784047451807
4. **templateLiterals**: 18.570007024116133
5. **return**: 17.313470693826584
6. **importDecls**: 17.304690548661515
7. **if**: 15.63938968235386

---

#### html5-boilerplate

- **Features Total:** 125
- **Features Observed:** 20
- **Catalog Usage:** 16.0%

**Top 7 Features:**
1. **importDecls**: 4.6801872074882995
2. **arrowFunctions**: 3.705148205928237
3. **templateLiterals**: 3.1201248049921997
4. **interpolatedTemplates**: 2.925117004680187
5. **assignOp_=**: 1.5600624024960998
6. **functions**: 1.1700468018720749
7. **binaryOp_!==**: 0.9750390015600624

---

#### webpack

- **Features Total:** 125
- **Features Observed:** 101
- **Catalog Usage:** 80.8%

**Top 7 Features:**
1. **assignOp_=**: 51.91272024193997
2. **if**: 27.906936952737013
3. **arrowFunctions**: 22.174978719035664
4. **binaryOp_===**: 18.226771667016003
5. **functions**: 17.02049388947587
6. **return**: 15.993874504335329
7. **importDecls**: 11.228649524974657

---

#### video.js

- **Features Total:** 125
- **Features Observed:** 78
- **Catalog Usage:** 62.4%

**Top 7 Features:**
1. **assignOp_=**: 37.929488209961676
2. **binaryOp_+**: 33.24223938811943
3. **functions**: 31.262426708857546
4. **if**: 19.502000964524125
5. **return**: 15.15318166050443
6. **arrowFunctions**: 8.756863773658338
7. **binaryOp_===**: 7.927711454993105

---

#### react-router

- **Features Total:** 125
- **Features Observed:** 88
- **Catalog Usage:** 70.4%

**Top 7 Features:**
1. **awaitExpressions**: 50.814765071903636
2. **arrowFunctions**: 31.526157495052825
3. **templateLiterals**: 18.981418641367632
4. **asyncFunctions**: 16.23100607948335
5. **assignOp_=**: 9.794326291800912
6. **importDecls**: 9.665735574621907
7. **return**: 8.601290193529028

---

#### node-semver

- **Features Total:** 125
- **Features Observed:** 57
- **Catalog Usage:** 45.6%

**Top 7 Features:**
1. **templateLiterals**: 54.84675172312656
2. **arrowFunctions**: 52.35371755389353
3. **assignOp_=**: 46.92770200909224
4. **interpolatedTemplates**: 45.90115852764335
5. **if**: 33.435987681478224
6. **return**: 25.076990761108668
7. **binaryOp_===**: 20.23757149142103

---

#### sails

- **Features Total:** 125
- **Features Observed:** 45
- **Catalog Usage:** 36.0%

**Top 7 Features:**
1. **functions**: 125.71257125712572
2. **return**: 56.234194848056234
3. **if**: 32.48896318203249
4. **assignOp_=**: 32.18893317903219
5. **binaryOp_+**: 24.602460246024602
6. **templateLiterals**: 10.458188676010458
7. **taggedTemplates**: 6.729244353006729

---

#### tailwindcss

- **Features Total:** 125
- **Features Observed:** 98
- **Catalog Usage:** 78.4%

**Top 7 Features:**
1. **templateLiterals**: 42.24681451435122
2. **arrowFunctions**: 29.892861866760725
3. **awaitExpressions**: 23.297032758696705
4. **if**: 21.86852431550637
5. **taggedTemplates**: 21.215995767382392
6. **return**: 18.98505356906662
7. **binaryOp_===**: 14.576076892553239

---

#### aws-sdk-js

- **Features Total:** 125
- **Features Observed:** 66
- **Catalog Usage:** 52.8%

**Top 7 Features:**
1. **classMethods**: 8.659343905056822
2. **assignOp_=**: 2.160548021028714
3. **functions**: 1.9396093105898249
4. **return**: 1.1343458528059798
5. **importDecls**: 0.6982826085186989
6. **binaryOp_+**: 0.33954791288502933
7. **if**: 0.30669781514872085

---

#### mocha

- **Features Total:** 125
- **Features Observed:** 62
- **Catalog Usage:** 49.6%

**Top 7 Features:**
1. **functions**: 107.85318304826463
2. **assignOp_=**: 22.51648669241481
3. **binaryOp_+**: 13.294448385486456
4. **return**: 12.742702503875359
5. **arrowFunctions**: 12.269777462494417
6. **if**: 9.143217466698195
7. **throw**: 4.545335119939045

---

#### fastify

- **Features Total:** 125
- **Features Observed:** 70
- **Catalog Usage:** 56.0%

**Top 7 Features:**
1. **arrowFunctions**: 89.10540573820957
2. **awaitExpressions**: 32.5698805565817
3. **functions**: 31.29232853096909
4. **asyncFunctions**: 23.503878832656074
5. **return**: 11.467183844354143
6. **assignOp_=**: 9.189139268562984
7. **binaryOp_+**: 6.264622583425687

---

#### mithril

- **Features Total:** 125
- **Features Observed:** 63
- **Catalog Usage:** 50.4%

**Top 7 Features:**
1. **functions**: 102.80527510112803
2. **assignOp_=**: 50.942217252606305
3. **return**: 28.97359160719571
4. **if**: 25.980859670470615
5. **binaryOp_+**: 18.12082744104976
6. **binaryOp_===**: 14.37169072910843
7. **logicalAND**: 8.386226855658236

---

#### lodash

- **Features Total:** 125
- **Features Observed:** 54
- **Catalog Usage:** 43.2%

**Top 7 Features:**
1. **functions**: 78.1448091280462
2. **assignOp_=**: 37.99830962107339
3. **return**: 30.937455979715452
4. **binaryOp_+**: 28.48992815889562
5. **if**: 17.432032680659248
6. **ternary**: 17.11508663191999
7. **arrayMethod_map**: 13.417382729961966

---

#### alpine

- **Features Total:** 125
- **Features Observed:** 70
- **Catalog Usage:** 56.0%

**Top 7 Features:**
1. **arrowFunctions**: 41.9590475094904
2. **return**: 23.697227654434602
3. **functions**: 23.668468883009318
4. **if**: 22.25928908317037
5. **assignOp_=**: 19.124582997814333
6. **templateLiterals**: 19.067065454963764
7. **paramDestructuringObject**: 16.21994708386058

---

#### tests

- **Features Total:** 125
- **Features Observed:** 27
- **Catalog Usage:** 21.6%

**Top 7 Features:**
1. **classFields**: 18
2. **if**: 16
3. **importDecls**: 14
4. **functions**: 13
5. **classMethods**: 12
6. **return**: 9
7. **nullishCoalescing**: 8

---

#### redux

- **Features Total:** 125
- **Features Observed:** 67
- **Catalog Usage:** 53.6%

**Top 7 Features:**
1. **arrowFunctions**: 10.76481070662254
2. **importDecls**: 6.3037179813555415
3. **return**: 3.903456134608624
4. **jsxElements**: 3.7701082542337954
5. **exportDecls_named**: 2.1335660859972605
6. **functions**: 1.6001745644979453
7. **if**: 1.5638069607593557

---

#### next.js

- **Features Total:** 125
- **Features Observed:** 111
- **Catalog Usage:** 88.8%

**Top 7 Features:**
1. **assignOp_=**: 115.85912526735939
2. **if**: 56.880465514354874
3. **return**: 55.33068073181761
4. **functions**: 46.95433259116818
5. **binaryOp_===**: 44.20446206586859
6. **logicalAND**: 39.04190286346404
7. **binaryOp_+**: 33.24018456598985

---

#### chart.js

- **Features Total:** 125
- **Features Observed:** 77
- **Catalog Usage:** 61.6%

**Top 7 Features:**
1. **assignOp_=**: 38.835188142225036
2. **functions**: 32.87460841794756
3. **return**: 15.05381586806275
4. **if**: 13.274174477992174
5. **binaryOp_+**: 10.824120235497752
6. **binaryOp_-**: 7.715842465169005
7. **ternary**: 7.606138543863285

---

#### moment

- **Features Total:** 125
- **Features Observed:** 47
- **Catalog Usage:** 37.6%

**Top 7 Features:**
1. **binaryOp_+**: 36.853016066157416
2. **functions**: 35.1686608531062
3. **return**: 31.270420694472612
4. **assignOp_=**: 27.02854953919647
5. **if**: 16.72525293494671
6. **binaryOp_===**: 13.77903963586381
7. **ternary**: 13.457941819328962

---

#### mongoose

- **Features Total:** 125
- **Features Observed:** 76
- **Catalog Usage:** 60.8%

**Top 7 Features:**
1. **functions**: 58.72116856714994
2. **awaitExpressions**: 56.75515138332315
3. **assignOp_=**: 26.294434079862125
4. **asyncFunctions**: 22.420961926194877
5. **arrowFunctions**: 19.492851226878383
6. **return**: 10.566296609247809
7. **arrayMethod_find**: 4.935958035990663

---

#### debug

- **Features Total:** 125
- **Features Observed:** 35
- **Catalog Usage:** 28.0%

**Top 7 Features:**
1. **assignOp_=**: 83.76963350785341
2. **arrowFunctions**: 40.139616055846425
3. **return**: 32.28621291448517
4. **if**: 26.17801047120419
5. **functions**: 23.560209424083773
6. **binaryOp_+**: 21.81500872600349
7. **logicalAND**: 17.452006980802793

---

#### sveltekit

- **Features Total:** 125
- **Features Observed:** 93
- **Catalog Usage:** 74.4%

**Top 7 Features:**
1. **awaitExpressions**: 50.14166475227812
2. **arrowFunctions**: 40.83007887280802
3. **if**: 32.529290144727774
4. **return**: 27.597825254613674
5. **importDecls**: 20.644766061719885
6. **exportDecls_named**: 19.63396891033004
7. **templateLiterals**: 19.281721418179032

---

#### dotenv

- **Features Total:** 125
- **Features Observed:** 19
- **Catalog Usage:** 15.2%

**Top 7 Features:**
1. **arrowFunctions**: 4.0427535027967
2. **assignOp_=**: 3.655092208007975
3. **catch**: 0.6645622196378136
4. **try**: 0.6645622196378136
5. **if**: 0.4430414797585424
6. **forOf**: 0.3322811098189068
7. **templateLiterals**: 0.276900924849089

---

#### hexo

- **Features Total:** 125
- **Features Observed:** 50
- **Catalog Usage:** 40.0%

**Top 7 Features:**
1. **arrowFunctions**: 88.88379555351821
2. **awaitExpressions**: 55.32890213156085
3. **binaryOp_+**: 54.22874169149667
4. **assignOp_=**: 29.475131790052714
5. **asyncFunctions**: 25.30369012147605
6. **importDecls**: 20.628008251203298
7. **return**: 10.497364198945679

---

#### backbone

- **Features Total:** 125
- **Features Observed:** 45
- **Catalog Usage:** 36.0%

**Top 7 Features:**
1. **functions**: 80.69130612483214
2. **assignOp_=**: 51.90634670403457
3. **return**: 28.08431132130554
4. **if**: 26.683015122321482
5. **binaryOp_===**: 8.641326560401705
6. **logicalAND**: 7.648741752787996
7. **logicalOR**: 7.59035441116366

---

#### zx

- **Features Total:** 125
- **Features Observed:** 79
- **Catalog Usage:** 63.2%

**Top 7 Features:**
1. **arrowFunctions**: 33.839430780435876
2. **templateLiterals**: 27.00431396716903
3. **awaitExpressions**: 22.970474536388593
4. **taggedTemplates**: 18.040226343212506
5. **asyncFunctions**: 14.678693484228809
6. **importDecls**: 11.541262815844025
7. **return**: 11.149083982295927

---

#### prettier

- **Features Total:** 125
- **Features Observed:** 0
- **Catalog Usage:** 0.0%

---

#### airbnb-style-guide

- **Features Total:** 125
- **Features Observed:** 19
- **Catalog Usage:** 15.2%

**Top 7 Features:**
1. **arrowFunctions**: 10.12523314681588
2. **assignOp_=**: 9.858779642952305
3. **if**: 6.128430588862243
4. **binaryOp_===**: 5.329070077271516
5. **return**: 5.06261657340794
6. **destructuringObject**: 3.7303490540900612
7. **arrayMethod_map**: 3.1974420463629096

---

#### nuxt

- **Features Total:** 125
- **Features Observed:** 82
- **Catalog Usage:** 65.6%

**Top 7 Features:**
1. **arrowFunctions**: 64.42226988715844
2. **awaitExpressions**: 39.00027977245174
3. **importDecls**: 38.981628275669124
4. **if**: 38.42208337219062
5. **return**: 31.595635549752867
6. **templateLiterals**: 22.792129068357735
7. **binaryOp_===**: 19.50946563461718

---

#### zustand

- **Features Total:** 125
- **Features Observed:** 52
- **Catalog Usage:** 41.6%

**Top 7 Features:**
1. **arrowFunctions**: 56.86345526982977
2. **return**: 42.738138355668234
3. **importDecls**: 30.061571894241215
4. **tsAsExpression**: 27.16407098877218
5. **if**: 22.093444404201374
6. **jsxElements**: 18.471568272365083
7. **assignOp_=**: 15.57406736689605

---

#### htmx

- **Features Total:** 125
- **Features Observed:** 0
- **Catalog Usage:** 0.0%

---

#### koa

- **Features Total:** 125
- **Features Observed:** 35
- **Catalog Usage:** 28.0%

**Top 7 Features:**
1. **arrowFunctions**: 80.98459225854941
2. **assignOp_=**: 40.492296129274706
3. **asyncFunctions**: 7.609921082299887
4. **awaitExpressions**: 7.3280721533258175
5. **destructuringObject**: 7.3280721533258175
6. **return**: 6.106726794438181
7. **binaryOp_===**: 1.8789928598271326

---

#### node

- **Features Total:** 125
- **Features Observed:** 111
- **Catalog Usage:** 88.8%

**Top 7 Features:**
1. **assignOp_=**: 67.72673695892736
2. **functions**: 46.26182633275375
3. **binaryOp_+**: 44.418151187799296
4. **arrowFunctions**: 32.05059291794422
5. **return**: 25.894494659843865
6. **if**: 24.151243161053134
7. **binaryOp_|**: 20.84305650954443

---

#### jquery

- **Features Total:** 125
- **Features Observed:** 63
- **Catalog Usage:** 50.4%

**Top 7 Features:**
1. **functions**: 60.67487098054784
2. **assignOp_=**: 56.35569670504168
3. **binaryOp_+**: 36.22072250893211
4. **if**: 29.29734021437078
5. **return**: 26.026200873362445
6. **binaryOp_===**: 14.545454545454545
7. **logicalOR**: 13.656212782850337

---

#### commander.js

- **Features Total:** 125
- **Features Observed:** 38
- **Catalog Usage:** 30.4%

**Top 7 Features:**
1. **arrowFunctions**: 79.69525766135935
2. **assignOp_=**: 10.957027906180448
3. **destructuringObject**: 6.03492552645095
4. **return**: 5.05050505050505
5. **templateLiterals**: 4.3656908063687725
6. **functions**: 4.280089025851738
7. **interpolatedTemplates**: 3.852080123266564

---

#### uni-app

- **Features Total:** 125
- **Features Observed:** 92
- **Catalog Usage:** 73.6%

**Top 7 Features:**
1. **if**: 54.181325065295276
2. **assignOp_=**: 44.93480181629291
3. **return**: 41.36500302607604
4. **functions**: 35.820972810625896
5. **arrowFunctions**: 29.221861538411748
6. **templateLiterals**: 23.056433890757038
7. **importDecls**: 19.227719503788258

---

#### ghost

- **Features Total:** 125
- **Features Observed:** 96
- **Catalog Usage:** 76.8%

**Top 7 Features:**
1. **functions**: 37.542335418341814
2. **assignOp_=**: 29.93675358262934
3. **awaitExpressions**: 27.322661153054938
4. **return**: 22.884621409103726
5. **if**: 17.21785379878798
6. **templateLiterals**: 16.568681710751196
7. **arrowFunctions**: 15.125883692031369

---

#### typescript

- **Features Total:** 125
- **Features Observed:** 113
- **Catalog Usage:** 90.4%

**Top 7 Features:**
1. **binaryOp_/**: 356.0988183626997
2. **labels**: 214.30733668380748
3. **binaryOp_***: 53.44268017214996
4. **assignOp_=**: 42.51946481572068
5. **functions**: 34.77765535435385
6. **binaryOp_-**: 21.23406695824467
7. **return**: 19.72882302132563

---

#### parcel

- **Features Total:** 125
- **Features Observed:** 104
- **Catalog Usage:** 83.2%

**Top 7 Features:**
1. **assignOp_=**: 35.71632991815007
2. **awaitExpressions**: 34.87857800719114
3. **functions**: 32.27686399800188
4. **binaryOp_|**: 23.00955869726976
5. **importDecls**: 19.408786508551835
6. **binaryOp_<**: 18.3993214729864
7. **if**: 17.837351247001525

---

#### axios

- **Features Total:** 125
- **Features Observed:** 76
- **Catalog Usage:** 60.8%

**Top 7 Features:**
1. **functions**: 101.8400300413068
2. **assignOp_=**: 38.37776943297033
3. **arrowFunctions**: 32.51971460758543
4. **awaitExpressions**: 20.05257228689448
5. **return**: 19.076229815996996
6. **importDecls**: 16.147202403304544
7. **asyncFunctions**: 13.89410439354112

---

