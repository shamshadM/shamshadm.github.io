---
title: "Split Plot Design"
subtitle: "A hierarchical experimental design for multi-factor studies"
date: 2026-05-13
permalink: /posts/2026/05/split-plot-design/
categories: [experimental-design, statistics, agriculture]
tags: [anova, split-plot, whole-plot, subplot, blocking, mixed-models]
excerpt_separator: <!--more-->
math: true
toc: true
toc_label: "Contents"
toc_icon: "flask"
header:
  tagline: "Efficiently study hard-to-change and easy-to-change factors in the same experiment"
toc_sticky: true
---

A **Split Plot Design** is a type of experimental design used when one or more factors are difficult or expensive to randomize at the level of individual experimental units. It is widely used in agricultural field trials, industrial experiments, and manufacturing studies.

The design partitions experimental units into two levels:

- **Whole plots** — the larger units to which the hard-to-change factor (the *whole-plot factor*) is applied
- **Subplots** — subdivisions of whole plots, to which the easy-to-change factor (the *subplot factor*) is applied
<!--more-->
## What is a Split-Plot Design?
A split-plot design is an experimental arrangement that uses two levels of randomization. In this method, one factor is randomly applied to large experimental units known as whole plots called main plot. These whole plots are further divided into smaller sections called sub-plots, where the levels of a second factor are assigned randomly.

---

## When to Use a Split Plot Design

Use a split plot design when:

1. One factor is difficult, costly, or impractical to change for every run (e.g., oven temperature, tillage method, irrigation system).
2. You want to study both a hard-to-change factor and an easy-to-change factor in the same experiment.
3. You can accept lower precision for the whole-plot factor in exchange for higher precision on the subplot factor.

**Typical applications:**

| Field | Whole-Plot Factor | Sub-Plot Factor |
|---|---|---|
| Agriculture | Irrigation method | Fertilizer type |
| Food Science | Oven temperature | Packaging type |
| Manufacturing | Machine setting | Raw material batch |
| Textile | Dyeing temperature | Fabric type |
| Agronomy | Tillage method | Crop variety |

---

## Structure of a Split Plot Design

### Components

```
Experiment
├── Block 1
│   ├── Whole Plot A  →  Subplot: level 1, level 2, level 3
│   └── Whole Plot B  →  Subplot: level 1, level 2, level 3
├── Block 2
│   ├── Whole Plot A  →  Subplot: level 1, level 2, level 3
│   └── Whole Plot B  →  Subplot: level 1, level 2, level 3
└── Block 3
    ├── Whole Plot A  →  Subplot: level 1, level 2, level 3
    └── Whole Plot B  →  Subplot: level 1, level 2, level 3
```

### Notation

| Symbol | Meaning |
|---|---|
| $r$ | Number of blocks (replications) |
| $a$ | Number of whole-plot factor levels |
| $b$ | Number of subplot factor levels |
| $N = r \times a \times b$ | Total number of observations |

---

## Statistical Model

The linear model for a split plot design (with blocks) is:

$$
Y_{ijk} = \mu + \rho_i + \alpha_j + \delta_{ij} + \beta_k + (\alpha\beta)_{jk} + \varepsilon_{ijk}
$$

Where:

| Term | Description |
|---|---|
| $\mu$ | Overall mean |
| $\rho_i$ | Effect of the $i$-th block ($i = 1, \ldots, r$) |
| $\alpha_j$ | Effect of the $j$-th whole-plot factor level ($j = 1, \ldots, a$) |
| $\delta_{ij}$ | Whole-plot error (block × whole-plot interaction) |
| $\beta_k$ | Effect of the $k$-th subplot factor level ($k = 1, \ldots, b$) |
| $(\alpha\beta)_{jk}$ | Interaction between whole-plot and subplot factors |
| $\varepsilon_{ijk}$ | Subplot error (residual) |

> **Note:** There are **two error terms** in a split plot design — one for testing whole-plot effects and one for testing subplot effects and interactions.

---

## ANOVA Table

| Source of Variation | df | MS | F-ratio |
|---|---|---|---|
| **Whole-Plot Stratum** | | | |
| Blocks | $r - 1$ | $MS_{Block}$ | — |
| Whole-plot factor (A) | $a - 1$ | $MS_A$ | $MS_A / MS_{WPE}$ |
| Whole-plot error | $(r-1)(a-1)$ | $MS_{WPE}$ | — |
| **Subplot Stratum** | | | |
| Subplot factor (B) | $b - 1$ | $MS_B$ | $MS_B / MS_{SPE}$ |
| A × B interaction | $(a-1)(b-1)$ | $MS_{AB}$ | $MS_{AB} / MS_{SPE}$ |
| Subplot error | $a(r-1)(b-1)$ | $MS_{SPE}$ | — |
| **Total** | $rab - 1$ | | |

### Key Rules

- Test **whole-plot factor A** using the **whole-plot error** as denominator.
- Test **subplot factor B** and **A×B interaction** using the **subplot error** as denominator.
- The subplot error is typically **smaller** than the whole-plot error, giving more power to detect subplot and interaction effects.

---

## Worked Example

**Experiment:** Effect of **irrigation method** (Factor A: furrow, drip) and **nitrogen level** (Factor B: low, medium, high) on wheat yield, conducted in 3 blocks.

### Parameters

$$r = 3,\quad a = 2,\quad b = 3,\quad N = 3 \times 2 \times 3 = 18$$

### Randomisation Plan

```
Block 1:
  WP-1 (Furrow):  N-Low  |  N-Med  |  N-High
  WP-2 (Drip):    N-Med  |  N-High |  N-Low

Block 2:
  WP-1 (Drip):    N-High |  N-Low  |  N-Med
  WP-2 (Furrow):  N-Low  |  N-High |  N-Med

Block 3:
  WP-1 (Furrow):  N-Med  |  N-Low  |  N-High
  WP-2 (Drip):    N-High |  N-Med  |  N-Low
```

> Within each whole plot, the order of subplot treatments is **randomised independently**.

---

## Assumptions

For valid inference, the following assumptions must hold:

1. **Normality** — Residuals at both whole-plot and subplot levels are approximately normally distributed.
2. **Homogeneity of variance** — Variances are equal within strata.
3. **Independence** — Whole plots are independent of each other.
4. **Correct error term** — Whole-plot factor is tested against whole-plot error, not subplot error.

Violating assumption 4 (a common mistake when using standard one-error ANOVA software) leads to **anti-conservative tests** for whole-plot factors.

---

## Analysis in R

```r
library(nlme)
library(lme4)

# Load data
data <- read.csv("split_plot_data.csv")

# Fit split plot model using lme (nlme package)
model <- lme(yield ~ irrigation * nitrogen,
             random = ~1 | block/whole_plot,
             data = data,
             method = "REML")

# ANOVA table
anova(model)

# Summary
summary(model)

# Pairwise comparisons (emmeans)
library(emmeans)
emmeans(model, pairwise ~ nitrogen | irrigation)
```

### Using `aov()` (base R)

```r
# Traditional aov approach
model_aov <- aov(yield ~ irrigation * nitrogen +
                   Error(block/irrigation),
                 data = data)

summary(model_aov)
```

> **Tip:** Prefer `lme()` or `lmer()` for unbalanced data or when variance components are of interest.

---

## Analysis in SAS

```sas
proc mixed data=split_plot;
  class block irrigation nitrogen;
  model yield = irrigation nitrogen irrigation*nitrogen / ddfm=satterth;
  random block block*irrigation;
  lsmeans irrigation*nitrogen / pdiff adjust=tukey;
run;
```

---

## Advantages and Disadvantages

### Advantages ✓

- Accommodates **hard-to-change factors** without an impractically large number of factor-level changes.
- Provides **high precision** for subplot factor and interaction comparisons.
- Reduces experimental effort compared to a completely randomised design with the same number of factor combinations.
- Naturally suits many **agricultural and industrial** scenarios.

### Disadvantages ✗

- **Lower precision** for the whole-plot factor compared to the subplot factor.
- More **complex analysis** — two error terms required.
- **Unbalanced data** (missing observations) complicates analysis.
- Software that ignores the split-plot structure produces **incorrect F-tests** for whole-plot effects.

---

## Extensions

| Extension | Description |
|---|---|
| **Split-Split Plot** | A third factor added as sub-subplots within subplots |
| **Strip Plot (Criss-Cross)** | Both factors applied in perpendicular strips; no nesting |
| **Repeated Measures** | Time as the subplot factor; observations correlated within subject |
| **Unbalanced Split Plot** | Handled with mixed model (REML) when cells are missing |
| **Split Plot in RCBD** | Each block contains one replicate of all whole-plot treatments |

---

## References

1. Montgomery, D.C. (2017). *Design and Analysis of Experiments* (9th ed.). Wiley.
2. Cochran, W.G. & Cox, G.M. (1957). *Experimental Designs* (2nd ed.). Wiley.
3. Littell, R.C., Milliken, G.A., Stroup, W.W., Wolfinger, R.D., & Schabenberger, O. (2006). *SAS for Mixed Models* (2nd ed.). SAS Institute.
4. Pinheiro, J.C. & Bates, D.M. (2000). *Mixed-Effects Models in S and S-PLUS*. Springer.
5. Stroup, W.W. (2012). *Generalized Linear Mixed Models*. CRC Press.

---

