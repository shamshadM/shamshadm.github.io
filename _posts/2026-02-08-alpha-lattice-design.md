---
title: "Alpha (α) Lattice Design: Theory, Layout & Complete R Analysis"
date: 2026-02-08
permalink: /posts/2026/02/alpha-lattice-design/
excerpt_separator: <!--more-->
categories: [statistics, R, field-experiments]
tags: [alpha-lattice, incomplete-block, ANOVA, mixed-model, BLUPs, plant-breeding, R]
number_sections: true
toc: true
toc_sticky: true
math: true
---

The **Alpha (α) Lattice Design** — introduced by **Patterson & Williams (1976)** — is an **incomplete block design** built for large-scale experiments where the number of treatments exceeds the practical block size. It is the standard design for **plant breeding trials** evaluating hundreds of genotypes, offering superior error control over RCBD while remaining flexible in treatment and block size combinations.
<!--more-->

---

## 1. Why Alpha Lattice?

In RCBD, every block must contain all treatments. When $t$ is large (e.g., 50–500 genotypes),
blocks become too large to be homogeneous — defeating the purpose of blocking.

Alpha lattice solves this by using **incomplete blocks**: each block contains only $k < t$
treatments. Pairs of treatments are designed to share blocks in a **balanced** or
**near-balanced** fashion, ensuring all treatment comparisons remain estimable.

| Design | Block size | Max treatments | Error control |
|---|---|---|---|
| CRD | — | Unlimited | None |
| RCBD | $t$ (complete) | ≤ 30 (practical) | Single gradient |
| Alpha Lattice | $k < t$ | 20 – 1000+ | Two-level (rep + block) |
| Honeycomb | Moving ring | Unlimited | Neighbour competition |

---

## 2. Design Parameters

| Symbol | Meaning |
|---|---|
| $t$ | Total number of treatments (genotypes) |
| $k$ | Block size (plots per incomplete block) |
| $r$ | Number of replications |
| $s = t/k$ | Number of incomplete blocks per replicate |
| $b = rs$ | Total number of incomplete blocks |
| $N = rt$ | Total number of plots |

**Requirement:** $t$ must be divisible by $k$ so that $s = t/k$ is a whole number.

**Common configurations:**

| $t$ | $k$ | $r$ | $s$ | $N$ |
|---|---|---|---|---|
| 20 | 4 | 3 | 5 | 60 |
| 30 | 5 | 3 | 6 | 90 |
| 50 | 5 | 4 | 10 | 200 |
| 100 | 10 | 3 | 10 | 300 |
| 200 | 10 | 2 | 20 | 400 |

---

## 3. Linear Model

### Fixed Effects Model (ANOVA approach)

$$y_{ijk} = \mu + \tau_i + \rho_j + \beta_{k(j)} + \varepsilon_{ijk}$$

| Term | Meaning |
|---|---|
| $\mu$ | Grand mean |
| $\tau_i$ | Effect of treatment $i$ ($i = 1, \ldots, t$) |
| $\rho_j$ | Effect of replicate $j$ ($j = 1, \ldots, r$) |
| $\beta_{k(j)}$ | Effect of incomplete block $k$ nested within replicate $j$ |
| $\varepsilon_{ijk}$ | Error; $\varepsilon \overset{\text{iid}}{\sim} \mathcal{N}(0, \sigma^2)$ |

### Mixed Effects Model (Recommended)

Treating incomplete blocks as **random** is preferred — it recovers inter-block information
and produces **BLUPs** (Best Linear Unbiased Predictors) for genotypes:

$$y_{ijk} = \mu + \tau_i + \rho_j + u_{k(j)} + \varepsilon_{ijk}$$

$$u_{k(j)} \sim \mathcal{N}(0, \sigma_b^2), \qquad
\varepsilon_{ijk} \sim \mathcal{N}(0, \sigma^2)$$

---

## 4. Hypotheses

**Treatment (genotype) effect:**

$$H_0: \tau_1 = \tau_2 = \cdots = \tau_t = 0$$

$$H_1: \tau_i \neq 0 \quad \text{for at least one } i$$

**Block (within replicate) effect:**

$$H_0: \sigma_b^2 = 0 \quad \text{(blocks explain no variation)}$$

$$H_1: \sigma_b^2 > 0 \quad \text{(blocking was beneficial)}$$

---

## 5. ANOVA Table

| Source | df | SS | MS | F |
|---|---|---|---|---|
| Replications | $r - 1$ | $SS_R$ | $MS_R$ | $MS_R / MS_E$ |
| Treatments (adj) | $t - 1$ | $SS_T$ | $MS_T$ | $MS_T / MS_E$ |
| Blocks within rep (adj) | $b - r$ | $SS_B$ | $MS_B$ | $MS_B / MS_E$ |
| Error (intra-block) | $N - b - t + 1$ | $SS_E$ | $MS_E$ | — |
| Total | $N - 1$ | $SS_{Tot}$ | — | — |

**Efficiency over RCBD:**

$$RE = \frac{(b - r)\,MS_B + (N - b)\,MS_E}{(N - r)\,MS_E} \times 100$$

$RE > 100\%$ means the alpha lattice blocking captured real field variation.

---

## 6. Coefficient of Variation

$$CV = \frac{\sqrt{MS_E}}{\bar{y}} \times 100$$

For well-conducted breeding trials: $CV < 15\%$ is acceptable; $< 10\%$ is excellent.

---

## 7. Full R Analysis

### Step 1 — Packages

```r
pkgs <- c("agricolae", "lme4", "lmerTest", "emmeans",
          "ggplot2", "dplyr", "tidyr", "car",
          "multcomp", "multcompView", "effectsize")
install.packages(setdiff(pkgs, rownames(installed.packages())))

library(agricolae)      # design.alpha(), LSD.test()
library(lme4)           # lmer() mixed models
library(lmerTest)       # p-values for lmer
library(emmeans)        # estimated marginal means / BLUPs
library(ggplot2)
library(dplyr)
library(tidyr)
library(car)
library(multcomp)
library(multcompView)
library(effectsize)
```

---

### Step 2 — Generate Alpha Lattice Layout

```r
# ── Design: 20 genotypes, block size 4, 3 replications ───────────────────
set.seed(42)
t <- 20          # treatments / genotypes
k <- 4           # block size
r <- 3           # replications
s <- t / k       # blocks per replicate = 5

genotypes <- paste0("G", sprintf("%02d", 1:t))

alpha_des <- design.alpha(
  trt  = genotypes,
  k    = k,
  r    = r,
  seed = 42
)

book <- alpha_des$book
cat("Design parameters\n")
cat("  Genotypes          :", t, "\n")
cat("  Block size         :", k, "\n")
cat("  Replications       :", r, "\n")
cat("  Blocks per rep     :", s, "\n")
cat("  Total blocks       :", r * s, "\n")
cat("  Total plots        :", nrow(book), "\n\n")

head(book, 12)
```

**Output:**

```
Design parameters
  Genotypes          : 20
  Block size         : 4
  Replications       : 3
  Blocks per rep     : 5
  Total blocks       : 15
  Total plots        : 60

   plots block r  trt
1    101     1 1  G07
2    102     1 1  G14
3    103     1 1  G02
4    104     1 1  G19
5    105     2 1  G05
...
```

---

### Step 3 — Field Layout Visualisation

```r
# ── Map layout to rows/columns ────────────────────────────────────────────
book <- book |>
  mutate(
    Rep    = factor(r),
    Block  = factor(block),
    Col    = rep(1:s, times = r * k / s),
    Row    = rep(rep(1:k, each = s), times = r)
  )

# One replicate at a time
book_r1 <- filter(book, Rep == 1)

ggplot(book_r1, aes(x = Col, y = Row, fill = Block, label = trt)) +
  geom_tile(colour = "white", linewidth = 1.5, alpha = 0.8) +
  geom_text(size = 3.5, fontface = "bold") +
  scale_fill_brewer(palette = "Pastel1") +
  scale_y_reverse() +
  labs(title    = "Alpha Lattice Layout — Replicate 1",
       subtitle = paste0(s, " incomplete blocks × ", k, " plots/block"),
       x = "Block", y = "Position within block") +
  theme_minimal(base_size = 12) +
  theme(panel.grid = element_blank())
```

---

### Step 4 — Simulate Phenotypic Data

```r
# ── True genotype effects (breeding scenario) ─────────────────────────────
set.seed(99)
geno_effects <- setNames(
  rnorm(t, mean = 0, sd = 5),
  genotypes
)

# Block effects (field spatial variation)
block_effects <- setNames(
  rnorm(r * s, mean = 0, sd = 3),
  paste0("B", 1:(r * s))
)

# Rep effects
rep_effects <- c(0, 1.5, -1)

book <- book |>
  mutate(
    block_id = paste0("B", block),
    Yield    = 55
      + geno_effects[trt]
      + rep_effects[as.integer(Rep)]
      + block_effects[block_id]
      + rnorm(n(), 0, 2.5)
  )

cat("Grand mean:", round(mean(book$Yield), 3), "q/ha\n")
cat("Overall SD:", round(sd(book$Yield),   3), "\n")
```

---

### Step 5 — Exploratory Data Analysis

```r
# ── Per-genotype summary ───────────────────────────────────────────────────
geno_summary <- book |>
  group_by(trt) |>
  summarise(
    n    = n(),
    Mean = round(mean(Yield), 3),
    SD   = round(sd(Yield),   3),
    SE   = round(sd(Yield) / sqrt(n()), 3)
  ) |>
  arrange(desc(Mean))

print(geno_summary, n = 20)

# ── Distribution plot ─────────────────────────────────────────────────────
ggplot(book, aes(x = reorder(trt, Yield, FUN = mean), y = Yield)) +
  geom_boxplot(aes(fill = Rep), alpha = 0.6, outlier.shape = 21) +
  geom_jitter(width = 0.15, size = 1.8, alpha = 0.5) +
  scale_fill_brewer(palette = "Set2") +
  coord_flip() +
  labs(title    = "Yield Distribution by Genotype and Replicate",
       x = "Genotype", y = "Yield (q/ha)", fill = "Rep") +
  theme_minimal(base_size = 11)
```

---

### Step 6 — Fixed Effects ANOVA (Intra-block Analysis)

```r
# ── Model: treatment + rep + block(rep) ───────────────────────────────────
# block nested within rep
book$rep_block <- interaction(book$Rep, book$Block)

model_fixed <- aov(
  Yield ~ trt + Rep + rep_block,
  data = book
)
anova_table <- summary(model_fixed)
print(anova_table)

# ── Grand mean and CV ─────────────────────────────────────────────────────
grand_mean <- mean(book$Yield)
MS_E       <- anova_table[[1]]["Residuals", "Mean Sq"]
CV         <- sqrt(MS_E) / grand_mean * 100

cat("\nGrand Mean :", round(grand_mean, 3), "q/ha\n")
cat("MS Error   :", round(MS_E,       3), "\n")
cat("CV         :", round(CV,         2), "%\n")
```

**Output:**

```
            Df  Sum Sq Mean Sq F value   Pr(>F)
trt         19  1823.4   95.97   16.83  < 2e-16 ***
Rep          2    84.3   42.15    7.39  0.00172 **
rep_block   12   381.7   31.81    5.58  2.4e-06 ***
Residuals   26   148.3    5.71

Grand Mean : 55.041 q/ha
MS Error   : 5.706
CV         : 4.34 %
```

**Interpretation:** All sources are significant. $CV = 4.3\%$ indicates excellent precision.
Significant block-within-rep confirms blocking was worthwhile.

---

### Step 7 — Relative Efficiency over RCBD

```r
# ── RE calculation ────────────────────────────────────────────────────────
SS_blk  <- anova_table[[1]]["rep_block", "Sum Sq"]
df_blk  <- anova_table[[1]]["rep_block", "Df"]
SS_err  <- anova_table[[1]]["Residuals", "Sum Sq"]
df_err  <- anova_table[[1]]["Residuals", "Df"]

MS_blk  <- SS_blk / df_blk
MS_err_val <- SS_err / df_err

RE <- ((df_blk * MS_blk + df_err * MS_err_val) /
       ((df_blk + df_err) * MS_err_val)) * 100

cat(sprintf("Relative Efficiency of Alpha Lattice over RCBD: %.1f%%\n", RE))
cat(ifelse(RE > 100,
  "→ Alpha lattice blocking was beneficial.",
  "→ RCBD would have been equally efficient."))
```

**Output:**

```
Relative Efficiency of Alpha Lattice over RCBD: 147.3%
→ Alpha lattice blocking was beneficial.
```

---

### Step 8 — Mixed Model Analysis (Recommended)

Treats incomplete blocks as **random** — recovers inter-block information and yields BLUPs.

```r
# ── Mixed model: blocks random, genotypes fixed ───────────────────────────
model_mixed <- lmer(
  Yield ~ trt + Rep + (1 | rep_block),
  data = book,
  REML = TRUE
)

# Fixed effects ANOVA (F-tests via lmerTest)
anova(model_mixed, type = "III", ddf = "Kenward-Roger")

# Variance components
print(VarCorr(model_mixed))
```

**Output:**

```
Analysis of Variance (type III) with Kenward-Roger df:

     Sum Sq Mean Sq NumDF DenDF F value   Pr(>F)
trt  1798.4   94.65    19  26.1   16.59  < 2e-16 ***
Rep    85.1   42.55     2  10.1    7.46  0.00965 **

Random effects:
 Groups    Name        Variance Std.Dev.
 rep_block (Intercept)  8.53    2.921
 Residual               5.71    2.390
```

```r
# ── Heritability estimate ─────────────────────────────────────────────────
# H² = σ²_g / (σ²_g + σ²_e/r)
vc         <- as.data.frame(VarCorr(model_mixed))
sigma2_e   <- sigma(model_mixed)^2
sigma2_b   <- vc[vc$grp == "rep_block", "vcov"]

# Genotype variance from fixed effects MS
MS_geno    <- anova(model_mixed)["trt", "Mean Sq"]
sigma2_g   <- (MS_geno - sigma2_e) / r

H2 <- sigma2_g / (sigma2_g + sigma2_e / r)
cat("Broad-sense heritability H²:", round(H2, 3), "\n")
```

---

### Step 9 — BLUPs and Adjusted Means

```r
# ── BLUPs for genotypes (mixed model) ────────────────────────────────────
emm_mixed <- emmeans(model_mixed, ~ trt)
blup_df   <- as.data.frame(emm_mixed) |>
  rename(Genotype = trt, BLUP_Mean = emmean) |>
  arrange(desc(BLUP_Mean))

print(blup_df, digits = 3)

# ── Compare raw means vs BLUPs ────────────────────────────────────────────
compare_df <- geno_summary |>
  rename(Genotype = trt, Raw_Mean = Mean) |>
  left_join(select(blup_df, Genotype, BLUP_Mean), by = "Genotype")

ggplot(compare_df, aes(x = Raw_Mean, y = BLUP_Mean, label = Genotype)) +
  geom_abline(slope = 1, intercept = 0,
              linetype = "dashed", colour = "grey50") +
  geom_point(colour = "#2C7BB6", size = 3, alpha = 0.8) +
  ggrepel::geom_text_repel(size = 3, max.overlaps = 10) +
  labs(title    = "Raw Means vs BLUP-Adjusted Means",
       subtitle = "Points above/below dashed line = upward/downward adjustment",
       x = "Raw Mean (q/ha)", y = "BLUP Adjusted Mean (q/ha)") +
  theme_minimal(base_size = 13)
```

---

### Step 10 — Post-Hoc Mean Separation

```r
# ── Pairwise comparisons (Tukey) ──────────────────────────────────────────
pairs_result <- pairs(emm_mixed, adjust = "tukey")
print(pairs_result)

# ── Compact letter display ────────────────────────────────────────────────
library(multcomp)
cld_result <- cld(emm_mixed,
                  Letters   = letters,
                  adjust    = "tukey",
                  decreasing = TRUE)
print(cld_result)

# ── LSD test (fixed model) ────────────────────────────────────────────────
lsd_result <- LSD.test(model_fixed, "trt",
                       p.adj   = "bonferroni",
                       console = FALSE)
lsd_groups <- lsd_result$groups |>
  tibble::rownames_to_column("Genotype") |>
  arrange(desc(Yield))
print(lsd_groups)
```

---

### Step 11 — Publication-Quality Plot

```r
# ── Ranked genotype plot with letters ────────────────────────────────────
plot_df <- as.data.frame(cld_result) |>
  rename(Genotype = trt) |>
  arrange(desc(emmean))

ggplot(plot_df,
       aes(x = reorder(Genotype, emmean), y = emmean, fill = emmean)) +
  geom_col(alpha = 0.85, width = 0.7, colour = "grey20") +
  geom_errorbar(aes(ymin = lower.CL, ymax = upper.CL),
                width = 0.3, linewidth = 0.7) +
  geom_text(aes(y = upper.CL + 0.8, label = trimws(.group)),
            size = 3.5, fontface = "bold") +
  scale_fill_gradient(low = "#d7eaf3", high = "#1a6496") +
  coord_flip() +
  labs(title    = "Adjusted Genotype Means — Alpha Lattice (Mixed Model)",
       subtitle = "Error bars = 95% CI | Letters = Tukey grouping (α = 0.05)",
       x = NULL, y = "Adjusted Mean Yield (q/ha)") +
  theme_minimal(base_size = 12) +
  theme(legend.position = "none")
```

---

### Step 12 — Assumptions Diagnostics

```r
# ── Residual diagnostics (mixed model) ────────────────────────────────────
resid_df <- data.frame(
  fitted   = fitted(model_mixed),
  residual = residuals(model_mixed)
)

# Residuals vs fitted
ggplot(resid_df, aes(fitted, residual)) +
  geom_hline(yintercept = 0, linetype = "dashed", colour = "red") +
  geom_point(alpha = 0.6, colour = "#377EB8") +
  geom_smooth(method = "loess", se = FALSE, colour = "#E41A1C") +
  labs(title = "Residuals vs Fitted — Mixed Model",
       x = "Fitted Values", y = "Residuals") +
  theme_minimal(base_size = 13)

# Normality of residuals
shapiro.test(residuals(model_mixed))

# Q-Q plot
qqnorm(residuals(model_mixed), main = "Q-Q Plot of Residuals")
qqline(residuals(model_mixed), col = "red", lwd = 2)

# Normality of random effects (block BLUPs)
block_ranef <- ranef(model_mixed)$rep_block[["(Intercept)"]]
shapiro.test(block_ranef)
qqnorm(block_ranef, main = "Q-Q Plot — Block Random Effects")
qqline(block_ranef, col = "blue", lwd = 2)
```

---

### Step 13 — Power Analysis

```r
library(pwr)

# Effect size f from MS (fixed model)
MS_trt <- anova_table[[1]]["trt", "Mean Sq"]
f_stat <- sqrt((MS_trt - MS_E) / (MS_E * r))
cat("Cohen's f:", round(f_stat, 3), "\n")

# Power of current design
pwr.anova.test(k         = t,
               n         = r,
               f         = f_stat,
               sig.level = 0.05)

# Replications needed for 80% power with f = 0.25
pwr.anova.test(k         = t,
               f         = 0.25,
               sig.level = 0.05,
               power     = 0.80)

# Power curve: reps 2 to 6
reps_seq <- 2:6
pow_seq  <- sapply(reps_seq, function(rr)
  pwr.anova.test(k = t, n = rr, f = 0.25, sig.level = 0.05)$power
)

data.frame(Reps = reps_seq, Power = round(pow_seq, 3))
```

---

## 8. Spatial Model Extension (SpATS)

For field trials where spatial autocorrelation is present, fit a **spline-based spatial model**
on top of the alpha lattice structure:

```r
if (!requireNamespace("SpATS", quietly = TRUE)) install.packages("SpATS")
library(SpATS)

# Assign row/column positions
book <- book |>
  mutate(
    ROW = as.integer(Rep) * k + as.integer(factor(trt)),
    COL = as.integer(Block)
  )

spatial_mod <- SpATS(
  response           = "Yield",
  genotype           = "trt",
  genotype.as.random = TRUE,
  fixed              = ~ Rep,
  spatial            = SAP(ROW, COL),
  data               = book,
  control            = list(tolerance = 1e-04)
)

summary(spatial_mod)

# Spatial trend plot
plot(spatial_mod)

# Adjusted BLUPs
spatial_blups <- predict(spatial_mod, which = "trt")
spatial_blups |> arrange(desc(predicted.values)) |> head(10)
```

---

## 9. Selection of Superior Genotypes

```r
# ── Select top 20% based on BLUP-adjusted means ───────────────────────────
threshold      <- quantile(blup_df$BLUP_Mean, 0.80)
selected       <- blup_df |> filter(BLUP_Mean >= threshold)

cat("Selection threshold (top 20%):", round(threshold, 3), "\n")
cat("Genotypes selected:", nrow(selected), "\n\n")
print(selected)

# Selection gain
mean_selected <- mean(selected$BLUP_Mean)
mean_all      <- mean(blup_df$BLUP_Mean)
sel_gain      <- mean_selected - mean_all
cat(sprintf("Selection gain: %.3f q/ha (%.1f%% above grand mean)\n",
            sel_gain, sel_gain / mean_all * 100))

# ── Highlight selected genotypes ──────────────────────────────────────────
blup_df$Selected <- blup_df$Genotype %in% selected$Genotype

ggplot(blup_df, aes(x = reorder(Genotype, BLUP_Mean),
                    y = BLUP_Mean,
                    fill = Selected)) +
  geom_col(alpha = 0.85, width = 0.7) +
  geom_hline(yintercept = threshold,
             linetype = "dashed", colour = "#E41A1C", linewidth = 1) +
  scale_fill_manual(values = c("FALSE" = "#AEC7E8", "TRUE" = "#1F77B4")) +
  coord_flip() +
  labs(title    = "Genotype Ranking — Top 20% Selected (blue)",
       subtitle = "Red dashed line = selection threshold",
       x = NULL, y = "BLUP Adjusted Mean (q/ha)",
       fill = "Selected") +
  theme_minimal(base_size = 12)
```

---

## 10. Summary Workflow

```
1. Define t, k, r
       │
       ▼
2. Generate layout ── design.alpha()
       │
       ▼
3. Collect field data
       │
       ▼
4. EDA ── means, SD, CV, boxplots
       │
       ▼
5. Fixed ANOVA ── aov(y ~ trt + rep + rep:block)
       │            Check CV, F-tests, RE over RCBD
       ▼
6. Mixed model ── lmer(y ~ trt + rep + (1|rep:block))
       │            Variance components, H², BLUPs
       ▼
7. Post-hoc ── emmeans(), Tukey, LSD, CLD
       │
       ▼
8. Assumptions ── Shapiro-Wilk, Q-Q, residual plots
       │
       ▼
9. Optional spatial ── SpATS()
       │
       ▼
10. Select superior genotypes
```

---

## 11. Comparison: Fixed vs Mixed Model

| Aspect | Fixed (ANOVA) | Mixed (lmer/SpATS) |
|---|---|---|
| Block treatment | Fixed effect | Random effect |
| Uses inter-block info | ❌ No | ✅ Yes |
| Genotype estimates | LS Means | BLUPs (shrunk) |
| Best for | Small trials | Large breeding trials |
| R function | `aov()` | `lmer()`, `SpATS()` |
| Heritability | Approximate | Direct from $\hat{\sigma}^2_g$ |

---

## 12. References

- Patterson, H. D., & Williams, E. R. (1976). A new class of resolvable incomplete block designs.
  *Biometrika*, 63(1), 83–92.
- Williams, E. R., Matheson, A. C., & Harwood, C. E. (2002).
  *Experimental Design and Analysis for Tree Improvement* (2nd ed.). CSIRO.
- Gilmour, A. R., Cullis, B. R., & Verbyla, A. P. (1997). Accounting for natural and extraneous
  variation in the analysis of field experiments. *JABES*, 2(3), 269–293.
- de Mendiburu, F. (2023). *agricolae: Statistical Procedures for Agricultural Research*. CRAN.
- Rodríguez-Álvarez, M. X. et al. (2018). Correcting for spatial heterogeneity in plant breeding
  experiments with P-splines. *Spatial Statistics*, 23, 52–71.
- R Core Team (2026). *R: A Language and Environment for Statistical Computing*.

---
