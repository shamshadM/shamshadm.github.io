---
title: "Factorial Experimental Design"
subtitle: "Studying multiple factors simultaneously with maximum efficiency"
date: 2026-05-12
permalink: /posts/2026/05/factorial-experimental-design/
categories: [experimental-design, statistics]
tags: [factorial, anova, interaction, two-way, three-way, full-factorial, fractional-factorial, main-effects, 2k-design]
excerpt_separator: <!--more-->
math: true
toc: true
toc_label: "Contents"
toc_icon: "table"
toc_sticky: true
---
A **Factorial Experimental Design** is an experimental strategy in which **two or more factors are varied simultaneously**, and all possible combinations of their levels are studied. This allows researchers to:

- Estimate the **main effect** of each factor
- Detect **interactions** between factors
- Draw conclusions over a wide range of conditions
- Use experimental resources more efficiently than one-factor-at-a-time (OFAT) experiments
<!--more-->
>**Key principle:** In a factorial design, every factor combination appears in the experiment — making it possible to separate the independent effect of each factor *and* assess how factors influence each other.

## Why Not One-Factor-at-a-Time (OFAT)?

The traditional approach varies one factor while holding all others constant. This is inefficient and misleading:

| Property | OFAT | Factorial |
|---|---|---|
| Detects interactions | ✗ No | ✓ Yes |
| Efficient use of runs | ✗ No | ✓ Yes |
| Conclusions generalisable | ✗ Limited | ✓ Broad |
| Same information per run | ✗ Less | ✓ More |

**Example:** If Factor A affects yield differently depending on the level of Factor B, an OFAT experiment will never detect this — but a factorial design will.

---

## Types of Factorial Designs

| Design | Description |
|---|---|
| **Full Factorial** | All combinations of all factor levels are tested |
| **$2^k$ Factorial** | $k$ factors each at 2 levels (low/high) |
| **$3^k$ Factorial** | $k$ factors each at 3 levels |
| **$p^k$ General Factorial** | $k$ factors each at $p$ levels |
| **Fractional Factorial** | A carefully chosen fraction of the full factorial |
| **Mixed-Level Factorial** | Factors at different numbers of levels |

---

## Full Factorial Design

### Definition

A **full factorial design** with $k$ factors, factor $i$ having $l_i$ levels, produces:

$$N = l_1 \times l_2 \times \cdots \times l_k$$

total treatment combinations (ignoring replication).

### Example: $2 \times 3$ Factorial

Two factors: **Temperature** (Low, High) and **Concentration** (10%, 20%, 30%).

$$N = 2 \times 3 = 6 \text{ treatment combinations}$$

| Run | Temperature | Concentration |
|---|---|---|
| 1 | Low | 10% |
| 2 | Low | 20% |
| 3 | Low | 30% |
| 4 | High | 10% |
| 5 | High | 20% |
| 6 | High | 30% |

Each combination is replicated $r$ times → Total runs $= 6r$.

---

## The $2^k$ Factorial Design
![Two_factorial_RCBD]({{ "teaching/designs/RCBD_twofactor.png" | relative_url }})

The most widely used factorial structure. Each of $k$ factors is set at exactly **two levels**, coded as:

$$-1 = \text{low level}, \quad +1 = \text{high level}$$

Total runs (before replication): $2^k$

| $k$ (Factors) | Runs ($2^k$) |
|---|---|
| 2 | 4 |
| 3 | 8 |
| 4 | 16 |
| 5 | 32 |
| 6 | 64 |

### Design Matrix: $2^2$ Factorial

| Run | A | B | AB |
|---|---|---|---|
| 1 | − | − | + |
| 2 | + | − | − |
| 3 | − | + | − |
| 4 | + | + | + |

Columns A and B are the **main effect** columns; AB is the **interaction** column (element-wise product).

### Design Matrix: $2^3$ Factorial


| Run | A | B | C | AB | AC | BC | ABC |
|---|---|---|---|---|---|---|---|
| 1 | − | − | − | + | + | + | − |
| 2 | + | − | − | − | − | + | + |
| 3 | − | + | − | − | + | − | + |
| 4 | + | + | − | + | − | − | − |
| 5 | − | − | + | + | − | − | + |
| 6 | + | − | + | − | + | − | − |
| 7 | − | + | + | − | − | + | − |
| 8 | + | + | + | + | + | + | + |

---

## Statistical Model

### Two-Factor Factorial Model

$$Y_{ijk} = \mu + \alpha_i + \beta_j + (\alpha\beta)_{ij} + \varepsilon_{ijk}$$

| Term | Meaning |
|---|---|
| $\mu$ | Overall mean |
| $\alpha_i$ | Main effect of Factor A, level $i$ |
| $\beta_j$ | Main effect of Factor B, level $j$ |
| $(\alpha\beta)_{ij}$ | Interaction effect of A and B |
| $\varepsilon_{ijk}$ | Random error, $\varepsilon \sim N(0, \sigma^2)$ |

### Three-Factor Factorial Model

$$
\begin{aligned}
Y_{ijkl} =\;& \mu + \alpha_i + \beta_j + \gamma_k \\
&+ (\alpha\beta)_{ij} + (\alpha\gamma)_{ik} \\
&+ (\beta\gamma)_{jk} + (\alpha\beta\gamma)_{ijk} \\
&+ \varepsilon_{ijkl}
\end{aligned}
$$

The number of effects grows rapidly with $k$:

| $k$ | Main Effects | 2FI | 3FI | Total Effects |
|---|---|---|---|---|
| 2 | 2 | 1 | — | 3 |
| 3 | 3 | 3 | 1 | 7 |
| 4 | 4 | 6 | 4 | 15 |
| 5 | 5 | 10 | 10 | 31 |

---

## ANOVA Table

### Two-Factor Factorial ($a$ levels of A, $b$ levels of B, $r$ replicates)

| Source | df | SS | MS | F |
|---|---|---|---|---|
| Factor A | $a - 1$ | $SS_A$ | $MS_A$ | $MS_A / MS_E$ |
| Factor B | $b - 1$ | $SS_B$ | $MS_B$ | $MS_B / MS_E$ |
| A × B | $(a-1)(b-1)$ | $SS_{AB}$ | $MS_{AB}$ | $MS_{AB} / MS_E$ |
| Error | $ab(r-1)$ | $SS_E$ | $MS_E$ | — |
| **Total** | $abr - 1$ | $SS_T$ | | |

### Sums of Squares Formulae

$$
\begin{aligned}
SS_A &= \frac{br \sum_{i} \bar{Y}_{i..}^2 - N\bar{Y}_{...}^2}{1} \\
SS_B &= \frac{ar \sum_{j} \bar{Y}_{.j.}^2 - N\bar{Y}_{...}^2}{1}
\end{aligned}
$$

$$
\begin{aligned}
SS_{AB} &= SS_{Cells} - SS_A - SS_B \\
SS_T &= \sum_{i,j,k} Y_{ijk}^2 - N\bar{Y}_{...}^2
\end{aligned}
$$

---

## Effect Estimation in $2^k$ Designs

Effects are estimated as **contrasts** of treatment means.

### Main Effect of A

$$\hat{A} = \frac{1}{2^{k-1}} \sum_{\text{runs}} c_i Y_i$$

where $c_i \in \{-1, +1\}$ are the contrast coefficients from the design matrix.

### Two-Factor Interaction AB

$$\widehat{AB} = \frac{1}{2^{k-1}} \sum_{\text{runs}} (c_A \cdot c_B)_i \, Y_i$$

> **Rule of thumb (Hierarchical Principle):** If an interaction is significant, retain all lower-order terms (main effects) in the model, even if they are not individually significant.

---

## Interaction Effects

An **interaction** between two factors means the effect of one factor depends on the level of the other.

### No Interaction

```
         B = Low   B = High
A = Low    10        20       (Effect of B = +10 at both levels of A)
A = High   15        25
```

Parallel lines in an interaction plot → **no interaction**.

### Interaction Present

```
         B = Low   B = High
A = Low    10        20       (Effect of B = +10)
A = High   25        15       (Effect of B = −10)
```

Crossing or non-parallel lines → **interaction present**.

> When a significant interaction is present, main effects must be interpreted **conditionally** — report simple effects of each factor at each level of the other factor.

---

## Worked Example

**Experiment:** Effect of **Fertiliser type** (A: Organic, Inorganic) and **Irrigation level** (B: Low, Medium, High) on crop yield (t/ha), with $r = 3$ replicates.

### Parameters

$$
a = 2,\quad b = 3,\quad r = 3
$$

$$
N = 2 \times 3 \times 3 = 18
$$

### Mean Yields (t/ha)

| | B: Low | B: Medium | B: High | Row Mean |
|---|---|---|---|---|
| A: Organic | 3.2 | 4.5 | 5.1 | 4.27 |
| A: Inorganic | 4.0 | 5.8 | 6.3 | 5.37 |
| Column Mean | 3.6 | 5.15 | 5.7 | **4.82** |

### Degrees of Freedom

| Source | df |
|---|---|
| Factor A (Fertiliser) | $2 - 1 = 1$ |
| Factor B (Irrigation) | $3 - 1 = 2$ |
| A × B | $1 \times 2 = 2$ |
| Error | $6 \times 2 = 12$ |
| Total | $17$ |

---

## Analysis in R

### Full Factorial ANOVA

```r
# Load data
data <- read.csv("factorial_data.csv")
data$fertiliser <- factor(data$fertiliser)
data$irrigation <- factor(data$irrigation)

# Fit model
model <- aov(yield ~ fertiliser * irrigation, data = data)

# ANOVA table
summary(model)

# Check model assumptions
par(mfrow = c(2, 2))
plot(model)

# Interaction plot
interaction.plot(data$irrigation, data$fertiliser, data$yield,
                 col = c("steelblue", "tomato"),
                 xlab = "Irrigation Level",
                 ylab = "Mean Yield (t/ha)",
                 trace.label = "Fertiliser")
```

### Post-hoc Comparisons

```r
library(emmeans)

# Marginal means
emmeans(model, ~ fertiliser)
emmeans(model, ~ irrigation)

# Simple effects (conditional on interaction being significant)
emmeans(model, pairwise ~ irrigation | fertiliser, adjust = "tukey")
```

### $2^k$ Design Analysis

```r
library(FrF2)

# Generate a 2^3 factorial design
design <- FrF2(nruns = 8, nfactors = 3,
               factor.names = list(A = c(-1, 1),
                                   B = c(-1, 1),
                                   C = c(-1, 1)))

# After adding response column:
model_2k <- lm(yield ~ A * B * C, data = design_with_response)
summary(model_2k)

# Half-normal plot of effects
library(unrepx)
hnplot(coef(model_2k)[-1], method = "Lenth")
```

---

## Analysis in SAS

```sas
/* Two-factor factorial ANOVA */
proc glm data=factorial_data;
  class fertiliser irrigation;
  model yield = fertiliser | irrigation;
  means fertiliser irrigation / tukey;
  lsmeans fertiliser*irrigation / pdiff slice=fertiliser adjust=tukey;
run;

/* Interaction plot */
proc sgplot data=factorial_data;
  series x=irrigation y=yield / group=fertiliser markers;
  xaxis label="Irrigation Level";
  yaxis label="Mean Yield (t/ha)";
run;
```

---

## Fractional Factorial Design

When $k$ is large, a full $2^k$ design requires too many runs. A **$2^{k-p}$ fractional factorial** uses only $1/2^p$ of the full design, sacrificing the ability to estimate some high-order interactions.

### Resolution

| Resolution | Property |
|---|---|
| **III** | Main effects aliased with 2FIs; 2FIs aliased with each other |
| **IV** | Main effects clear of 2FIs; 2FIs aliased with each other |
| **V** | Main effects and 2FIs clear; 3FIs aliased with 2FIs |

> **Principle of effect sparsity (Pareto principle):** In most real systems, a small number of main effects and low-order interactions dominate. Higher-order effects are usually negligible — making fractional designs practically valid.

### Common Fractional Designs

| Design | Runs | Factors | Resolution |
|---|---|---|---|
| $2^{3-1}$ | 4 | 3 | III |
| $2^{4-1}$ | 8 | 4 | IV |
| $2^{5-2}$ | 8 | 5 | III |
| $2^{6-2}$ | 16 | 6 | IV |
| $2^{7-4}$ | 8 | 7 | III |

---

## Assumptions

1. **Normality** — Residuals are approximately normally distributed. Check with Q–Q plot.
2. **Homogeneity of variance** — Equal variances across all cells. Check with Levene's test or residual vs. fitted plot.
3. **Independence** — Observations are independent. Ensured by proper randomisation.
4. **Additivity** — The model correctly specifies all relevant interaction terms.
5. **Fixed effects** — Unless factors are treated as random, all factor levels are fixed and chosen deliberately.

---

## Advantages and Disadvantages

### Advantages ✓

- Estimates **all main effects and interactions** simultaneously
- More **statistically efficient** than OFAT — same information from fewer runs
- Detects **synergistic or antagonistic interactions** between factors
- Conclusions hold across the **full experimental region**
- Forms the basis for **response surface methodology (RSM)**

### Disadvantages ✗

- Number of runs grows **exponentially** with factors: $2^{10} = 1024$ runs for 10 factors
- **High-order interactions** (3FI and above) are difficult to interpret
- Requires **adequate replication** to estimate error
- May be impractical when factor-level changes are costly (consider split plot instead)

---

## Relationship to Other Designs

| Design | Relation to Factorial |
|---|---|
| **RCBD** | Single-factor; factorial adds more factors within blocks |
| **Split Plot** | Factorial with restricted randomisation |
| **Response Surface (CCD, BBD)** | Factorial augmented with centre and axial points |
| **Taguchi Arrays** | Fractional factorials with emphasis on noise factors |
| **Latin Square** | Two blocking factors; factorial adds treatment combinations |

---

## Glossary

| Term | Definition |
|---|---|
| **Main effect** | Average change in response when a factor moves from low to high level |
| **Interaction** | Change in the effect of one factor depending on the level of another |
| **Treatment combination** | Specific set of levels of all factors in one run |
| **Replication** | Independent repetition of a treatment combination |
| **Alias** | Two effects that cannot be estimated separately (fractional designs) |
| **Resolution** | Measure of which effects are aliased in a fractional design |
| **Contrast** | Linear combination of treatment means used to estimate an effect |
| **Effect sparsity** | Assumption that few effects are large; most are negligible |

---

## References

1. Montgomery, D.C. (2017). *Design and Analysis of Experiments* (9th ed.). Wiley.
2. Box, G.E.P., Hunter, J.S., & Hunter, W.G. (2005). *Statistics for Experimenters* (2nd ed.). Wiley.
3. Wu, C.F.J. & Hamada, M.S. (2021). *Experiments: Planning, Analysis, and Optimization* (3rd ed.). Wiley.
4. Dean, A., Voss, D., & Draguljić, D. (2017). *Design and Analysis of Experiments* (2nd ed.). Springer.
5. Myers, R.H., Montgomery, D.C., & Anderson-Cook, C.M. (2016). *Response Surface Methodology* (4th ed.). Wiley.

---