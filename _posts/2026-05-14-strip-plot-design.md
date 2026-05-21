---
title: "Strip Plot Design"
subtitle: "A criss-cross arrangement for two hard-to-change factors"
date: 2026-05-14
permalink: /posts/2026/05/strip-plot-design.md
categories: [experimental-design, statistics, agriculture]
tags: [strip-plot, criss-cross, anova, whole-plot, row-factor, column-factor, blocking, mixed-models, split-plot]
excerpt_separator: <!--more-->
math: true
toc: true
toc_label: "Contents"
toc_icon: "th"
---

A **Strip Plot Design** (also called a **Criss-Cross Design**) is an experimental layout used when **two factors are both difficult or costly to randomise** at the level of individual plots. It is a natural extension of the split plot concept but treats both factors symmetrically — neither is nested within the other.

In a strip plot:

- **Factor A** (the *row factor*) is applied to **horizontal strips** running across each block
- **Factor B** (the *column factor*) is applied to **vertical strips** running down each block
- The **intersection** of a row strip and a column strip forms the experimental unit for the interaction A×B
<!--more-->

> **Key idea:** Both factors are randomised within blocks in perpendicular directions. The interaction is estimated at the smallest unit — the intersection cell — which typically has the highest precision.
---

## Comparison with Related Designs

| Feature | CRD / RCBD | Split Plot | Strip Plot |
|---|---|---|---|
| Hard-to-change factors | 0 | 1 (whole plot) | 2 (row + column) |
| Nesting structure | None | Subplot nested in whole plot | No nesting — crossed |
| Number of error terms | 1 | 2 | 3 |
| Precision: main effect A | High | Low | Medium |
| Precision: main effect B | High | High | Medium |
| Precision: A×B interaction | High | High | **Highest** |
| Typical application | Lab / fully randomisable | One machine setting | Two large-scale operations |

---

## When to Use a Strip Plot Design

Use a strip plot design when:

1. **Both factors** are hard or expensive to change at the plot level (e.g., large machinery, irrigation systems, field operations).
2. The **interaction A×B** is of primary scientific interest.
3. You can accept somewhat **lower precision** on both main effects relative to a CRD.
4. Factors are naturally applied in **perpendicular directions** across a field or experimental area.

**Typical applications:**

| Field | Row Factor (A) | Column Factor (B) |
|---|---|---|
| Agronomy | Tillage method | Irrigation type |
| Food processing | Oven temperature | Packaging material |
| Textile | Dye bath | Fabric weave |
| Manufacturing | Machine line | Raw material supplier |
| Horticulture | Row spacing | Fertiliser formulation |

---

## Structure of the Strip Plot Design

### Layout Diagram (1 Block, $a = 3$ rows, $b = 4$ columns)

```
          ← Column Factor B →
          B1     B2     B3     B4
        ┌──────┬──────┬──────┬──────┐
  A1    │A1B1  │A1B2  │A1B3  │A1B4  │  ← Row strip for A1
        ├──────┼──────┼──────┼──────┤
  A2    │A2B1  │A2B2  │A2B3  │A2B4  │  ← Row strip for A2
        ├──────┼──────┼──────┼──────┤
  A3    │A3B1  │A3B2  │A3B3  │A3B4  │  ← Row strip for A3
        └──────┴──────┴──────┴──────┘
           ↑      ↑      ↑      ↑
         Col    Col    Col    Col
        strip  strip  strip  strip
        for B1 for B2 for B3 for B4
```

Each **cell** is an intersection plot receiving one level of A and one level of B.

### Randomisation

Within each block:
- Levels of **Factor A** are randomised among the row strips independently
- Levels of **Factor B** are randomised among the column strips independently
- The cell values are determined by which row and column strip intersect — **no further randomisation at the cell level**

### Multi-Block Layout ($r$ blocks)

```
Block 1            Block 2            Block 3
┌──┬──┬──┬──┐      ┌──┬──┬──┬──┐      ┌──┬──┬──┬──┐
│  │  │  │  │      │  │  │  │  │      │  │  │  │  │
├──┼──┼──┼──┤      ├──┼──┼──┼──┤      ├──┼──┼──┼──┤
│  │  │  │  │      │  │  │  │  │      │  │  │  │  │
├──┼──┼──┼──┤      ├──┼──┼──┼──┤      ├──┼──┼──┼──┤
│  │  │  │  │      │  │  │  │  │      │  │  │  │  │
└──┴──┴──┴──┘      └──┴──┴──┴──┘      └──┴──┴──┴──┘
  A randomised        A randomised        A randomised
  B randomised        B randomised        B randomised
  independently       independently       independently
```

---

## Statistical Model

$$
\begin{aligned}
Y_{ijk} =\;& \mu + \rho_i + \alpha_j + \delta_{ij} \\
&+ \beta_k + \gamma_{ik} + (\alpha\beta)_{jk} \\
&+ \varepsilon_{ijk}
\end{aligned}
$$

| Term | Description |
|---|---|
| $\mu$ | Overall mean |
| $\rho_i$ | Effect of block $i$ &nbsp;&nbsp;($i = 1, \ldots, r$) |
| $\alpha_j$ | Main effect of row factor A, level $j$ &nbsp;&nbsp;($j = 1, \ldots, a$) |
| $\delta_{ij}$ | **Row-strip error** — block × A interaction; error for testing A |
| $\beta_k$ | Main effect of column factor B, level $k$ &nbsp;&nbsp;($k = 1, \ldots, b$) |
| $\gamma_{ik}$ | **Column-strip error** — block × B interaction; error for testing B |
| $(\alpha\beta)_{jk}$ | A × B interaction effect |
| $\varepsilon_{ijk}$ | **Cell (intersection) error** — error for testing A×B |

> **Three separate error terms** are used in a strip plot ANOVA — one for each stratum of the design.

---

## ANOVA Table

| Source of Variation | df | MS | F-ratio | Error Term Used |
|---|---|---|---|---|
| **Block Stratum** | | | | |
| Blocks | $r - 1$ | $MS_{Blk}$ | — | — |
| **Row-Strip Stratum** | | | | |
| Factor A (rows) | $a - 1$ | $MS_A$ | $MS_A \,/\, MS_{EA}$ | Row-strip error |
| Row-strip error ($E_A$) | $(r-1)(a-1)$ | $MS_{EA}$ | — | — |
| **Column-Strip Stratum** | | | | |
| Factor B (columns) | $b - 1$ | $MS_B$ | $MS_B \,/\, MS_{EB}$ | Column-strip error |
| Column-strip error ($E_B$) | $(r-1)(b-1)$ | $MS_{EB}$ | — | — |
| **Intersection Stratum** | | | | |
| A × B | $(a-1)(b-1)$ | $MS_{AB}$ | $MS_{AB} \,/\, MS_{EC}$ | Cell error |
| Cell error ($E_C$) | $(r-1)(a-1)(b-1)$ | $MS_{EC}$ | — | — |
| **Total** | $rab - 1$ | | | |

### Degrees of Freedom Summary

$$
df_{EA} = (r-1)(a-1) \qquad df_{EB} = (r-1)(b-1)
$$

$$
df_{EC} = (r-1)(a-1)(b-1)
$$

### Precision Hierarchy

$$\text{Interaction (A×B)} > \text{Main effects (A, B)}$$

The interaction is tested against the smallest (cell) error, giving it the **highest precision** — an important practical advantage of the strip plot design.

---

## Relative Efficiency

The efficiency of estimating each effect relative to a completely randomised design (CRD) depends on the magnitudes of the three error variances:

$$\sigma^2_{EA} \geq \sigma^2_{EB} \geq \sigma^2_{EC} \quad \text{(typically)}$$

- Both main effects have **lower efficiency** than in a CRD (larger error denominators)
- The interaction has **higher efficiency** than in a CRD (smallest error denominator)
- This trade-off is acceptable when the interaction is the primary research question

---

## Worked Example

**Experiment:** Effect of **tillage method** (Factor A: conventional, reduced, zero) and **irrigation system** (Factor B: furrow, sprinkler, drip) on wheat yield (t/ha), in $r = 4$ blocks.

### Parameters

$$
r = 4,\quad a = 3,\quad b = 3
$$

$$
N = 4 \times 3 \times 3 = 36
$$

### Mean Yield Table (t/ha)

|  | B: Furrow | B: Sprinkler | B: Drip | **Row Mean** |
|---|---|---|---|---|
| A: Conventional | 3.8 | 4.6 | 5.2 | **4.53** |
| A: Reduced | 4.2 | 5.0 | 5.9 | **5.03** |
| A: Zero | 3.5 | 4.1 | 4.8 | **4.13** |
| **Col Mean** | **3.83** | **4.57** | **5.30** | **4.57** |

### Degrees of Freedom

| Source | df |
|---|---|
| Blocks | $4 - 1 = 3$ |
| A (Tillage) | $3 - 1 = 2$ |
| Row-strip error | $(4-1)(3-1) = 6$ |
| B (Irrigation) | $3 - 1 = 2$ |
| Column-strip error | $(4-1)(3-1) = 6$ |
| A × B | $(3-1)(3-1) = 4$ |
| Cell error | $(4-1)(3-1)(3-1) = 12$ |
| **Total** | **35** |

---

## Analysis in R

### Using `lme()` (nlme package)

```r
library(nlme)
library(emmeans)

# Data must have columns: block, row_factor, col_factor, yield
data <- read.csv("strip_plot_data.csv")
data$block      <- factor(data$block)
data$tillage    <- factor(data$tillage)
data$irrigation <- factor(data$irrigation)

# Fit strip plot model — three random effects strata
model <- lme(yield ~ tillage * irrigation,
             random = list(block = pdBlocked(list(
               pdIdent(~ 1),
               pdIdent(~ tillage - 1),
               pdIdent(~ irrigation - 1)
             ))),
             data = data,
             method = "REML")

summary(model)
anova(model)
```

### Using `aov()` with Error strata

```r
# Traditional aov approach with explicit Error() strata
model_aov <- aov(yield ~
                   tillage * irrigation +
                   Error(block +
                         block:tillage +
                         block:irrigation),
                 data = data)

summary(model_aov)
```

### Post-hoc Comparisons

```r
# Marginal means and pairwise comparisons
emmeans(model_aov, pairwise ~ tillage,    adjust = "tukey")
emmeans(model_aov, pairwise ~ irrigation, adjust = "tukey")

# Simple effects of B at each level of A
emmeans(model_aov, pairwise ~ irrigation | tillage, adjust = "tukey")

# Interaction plot
interaction.plot(
  x.factor     = data$irrigation,
  trace.factor  = data$tillage,
  response      = data$yield,
  col           = c("steelblue", "tomato", "forestgreen"),
  lwd           = 2,
  xlab          = "Irrigation System",
  ylab          = "Mean Yield (t/ha)",
  trace.label   = "Tillage"
)
```

---

## Analysis in SAS

```sas
/* Strip plot design using PROC MIXED */
proc mixed data=strip_plot;
  class block tillage irrigation;
  model yield = tillage irrigation tillage*irrigation / ddfm=satterth;
  /* Three random effects — one per stratum */
  random block;
  random block*tillage;
  random block*irrigation;
  /* Interaction comparisons */
  lsmeans tillage*irrigation / pdiff slice=tillage adjust=tukey;
run;

/* Interaction plot */
proc sgplot data=strip_plot;
  series x=irrigation y=yield / group=tillage markers lineattrs=(thickness=2);
  xaxis label="Irrigation System";
  yaxis label="Mean Yield (t/ha)";
  keylegend / title="Tillage Method";
run;
```

---

## Assumptions

1. **Normality** — Residuals within each stratum are approximately normally distributed.
2. **Homogeneity of variance** — Equal variance within row strips, column strips, and cells.
3. **Independence** — Blocks are independent; randomisation is carried out correctly within each block.
4. **Correct error terms** — Factor A tested against row-strip error; Factor B against column-strip error; A×B against cell error. Using a single pooled error is **incorrect** and leads to biased F-tests.
5. **Additivity of block effects** — Blocks affect all treatment combinations equally (no block × treatment interaction beyond the defined strata).

---

## Advantages and Disadvantages

### Advantages ✓

- Accommodates **two hard-to-change factors** in the same experiment
- Provides **maximum precision for the interaction** A×B — the effect most relevant when both factors are of interest
- Operationally efficient — Factor A applied in strips, Factor B applied in perpendicular strips, reducing factor-level changes
- Straightforward field layout — rows and columns are natural physical divisions
- Reduces **total operational cost** compared to a fully randomised two-factor experiment

### Disadvantages ✗

- **Lower precision** for both main effects compared to CRD or RCBD
- **Three error terms** complicate the analysis; standard ANOVA software must be used carefully
- **Small degrees of freedom** for row-strip and column-strip errors, especially with few blocks
- Missing data are difficult to handle without mixed-model software
- Less familiar than split plot; risk of **misidentifying the error structure**

---

## Comparison: Split Plot vs Strip Plot

| Aspect | Split Plot | Strip Plot |
|---|---|---|
| Factor A randomisation | Among whole plots | Among row strips within blocks |
| Factor B randomisation | Within each whole plot | Among column strips within blocks |
| Nesting | B nested within A | A and B crossed (not nested) |
| Error terms | 2 | 3 |
| Precision for A | Low | Medium |
| Precision for B | High | Medium |
| Precision for A×B | High | **Highest** |
| Use when | Only A is hard to change | **Both** A and B are hard to change |

---

## Extensions

| Extension | Description |
|---|---|
| **Strip-Split Plot** | A third factor added as subplots within intersection cells |
| **Replicated Strip Plot** | Multiple blocks increase df for row- and column-strip errors |
| **Unbalanced Strip Plot** | Missing cells handled via REML mixed model |
| **Strip Plot in Space–Time** | One factor varied across space, another across time (repeated measures analogue) |
| **Strip Plot with Covariates** | ANCOVA model includes plot-level covariates to reduce residual error |

---

## Glossary

| Term | Definition |
|---|---|
| **Row factor** | Factor applied to horizontal strips spanning the full width of a block |
| **Column factor** | Factor applied to vertical strips spanning the full height of a block |
| **Intersection plot** | The experimental unit formed at the crossing of one row strip and one column strip |
| **Row-strip error** | Variability among row strips within a block; denominator for testing Factor A |
| **Column-strip error** | Variability among column strips within a block; denominator for testing Factor B |
| **Cell error** | Residual variability at the intersection level; denominator for testing A×B |
| **Criss-cross design** | Alternative name for the strip plot design |
| **Stratum** | A level of the hierarchical error structure (block, row strip, column strip, cell) |

---

## References

1. Montgomery, D.C. (2017). *Design and Analysis of Experiments* (9th ed.). Wiley.
2. Cochran, W.G. & Cox, G.M. (1957). *Experimental Designs* (2nd ed.). Wiley.
3. Federer, W.T. (1955). *Experimental Design: Theory and Application*. Macmillan.
4. Littell, R.C., Milliken, G.A., Stroup, W.W., Wolfinger, R.D., & Schabenberger, O. (2006). *SAS for Mixed Models* (2nd ed.). SAS Institute.
5. Piepho, H.P., Büchse, A., & Emrich, K. (2003). A Hitchhiker's Guide to Mixed Models for Randomized Experiments. *Journal of Agronomy and Crop Science*, 189(5), 310–322.

---
