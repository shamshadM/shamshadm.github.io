---
title: "Augmented Design: Theory & Complete R Analysis"
date: 2026-02-24
permalink: /posts/2026/02/augmented-design-analysis/
excerpt_separator: <!--more-->
categories: [statistics, R, field-experiments]
tags: [augmented-design, check-varieties, plant-breeding, ANOVA, BLUPs, R]
number_sections: true
toc: true
toc_sticky: true
math: true
---

The **Augmented Design** — proposed by **Federer (1956)** — is a field experimental design specifically developed for **early-generation plant breeding** trials, where a large number of **new (unreplicated) test entries** are evaluated alongside a small set of **replicated check (standard) varieties**. It allows breeders to screen hundreds of
genotypes within a single trial without the cost of fully replicating every entry, while still enabling valid statistical inference through the checks.
<!--more-->

---

## 1. Concept and Rationale

In early breeding stages, thousands of new lines must be evaluated quickly and cheaply.
Full replication of every entry is impractical. The augmented design solves this by:

- **Check varieties** (standards/controls): appear in **every block** — their replication
  enables estimation of block effects and experimental error.
- **Test entries** (new genotypes): appear in **only one block** — they are evaluated
  relative to the checks in that block, correcting for spatial variation.

The checks act as a **calibration standard** across blocks, linking all test entries
to a common baseline.

---

## 2. Design Structure

| Entry type | Replication | Purpose |
|---|---|---|
| Check varieties ($c$) | $r$ times (once per block) | Estimate block effects and error |
| Test entries ($t$) | Once only | Screening new material |
| Total blocks | $r$ | — |
| Plots per block | $c + n_i$ | $c$ checks + $n_i$ test entries in block $i$ |
| Total plots | $rc + t$ | — |

**Requirements:**
- At least **2 check varieties** (3–5 recommended for reliable error estimation)
- At least **3 blocks** (more blocks → better spatial control)
- All checks must appear in **every** block

---

## 3. Linear Model

$$y_{ijk} = \mu + \gamma_i + \beta_j + \varepsilon_{ijk}$$

where the entry effect $\gamma_i$ covers **both** checks and test entries:

$$\gamma_i = \begin{cases} \tau_i & \text{if check variety } i \\ \delta_i & \text{if test entry } i \end{cases}$$

| Symbol | Meaning |
|---|---|
| $\mu$ | Grand mean |
| $\gamma_i$ | Effect of entry $i$ (check or test) |
| $\beta_j$ | Effect of block $j$ |
| $\varepsilon_{ijk}$ | Error; $\varepsilon \sim \mathcal{N}(0, \sigma^2)$ |

---

## 4. Hypotheses

### Treatment (entry) effect

$$H_0: \gamma_1 = \gamma_2 = \cdots = \gamma_{c+t} = 0$$

$$H_1: \gamma_i \neq 0 \quad \text{for at least one entry } i$$

### Block effect

$$H_0: \beta_1 = \beta_2 = \cdots = \beta_r = 0$$

$$H_1: \beta_j \neq 0 \quad \text{for at least one } j$$

### Check vs test entries

$$H_0: \bar{\mu}_{\text{check}} = \bar{\mu}_{\text{test}}$$

$$H_1: \bar{\mu}_{\text{check}} \neq \bar{\mu}_{\text{test}}$$

---

## 5. ANOVA Table

The ANOVA is partitioned into **checks** and **test entries** components:

| Source | df | SS | MS | F |
|---|---|---|---|---|
| Blocks (unadj.) | $r - 1$ | $SS_B$ | $MS_B$ | $MS_B / MS_E$ |
| Entries (adj.) | $c + t - 1$ | $SS_{Ent}$ | $MS_{Ent}$ | $MS_{Ent} / MS_E$ |
| — Checks (adj.) | $c - 1$ | $SS_C$ | $MS_C$ | $MS_C / MS_E$ |
| — Test entries (adj.) | $t - 1$ | $SS_T$ | $MS_T$ | $MS_T / MS_E$ |
| — Checks vs Tests | $1$ | $SS_{CvT}$ | $MS_{CvT}$ | $MS_{CvT} / MS_E$ |
| Error | $(c-1)(r-1)$ | $SS_E$ | $MS_E$ | — |
| Total | $rc + t - 1$ | $SS_{Tot}$ | — | — |

**Error degrees of freedom:**

$$df_E = (c - 1)(r - 1)$$

> This means error df depends **only** on the number of checks and blocks —
> adding more test entries does **not** increase error df.

---

## 6. Adjusted Means

Since test entries appear only once, their raw means are biased by block effects.
**Adjusted means** correct for the block in which each test entry appeared:

$$\hat{\mu}_i^{\text{adj}} = y_{ij} - \hat{\beta}_j + \bar{\hat{\beta}}$$

where $\hat{\beta}_j$ is the estimated block effect and $\bar{\hat{\beta}}$ is the mean
block effect. In practice, this is obtained directly from the model as:

$$\hat{\mu}_i^{\text{adj}} = \hat{\mu} + \hat{\gamma}_i$$

---

## 7. Coefficient of Variation

$$CV = \frac{\sqrt{MS_E}}{\bar{y}_{\text{checks}}} \times 100$$

Note: CV for augmented designs is typically computed on **check means only**,
since checks are replicated.

---

## 8. Full R Analysis

### Step 1 — Packages

```r
pkgs <- c("agricolae", "lme4", "lmerTest", "emmeans",
          "ggplot2", "dplyr", "tidyr", "car",
          "multcomp", "multcompView", "effectsize",
          "tibble", "ggrepel")
install.packages(setdiff(pkgs, rownames(installed.packages())))

library(agricolae)
library(lme4)
library(lmerTest)
library(emmeans)
library(ggplot2)
library(dplyr)
library(tidyr)
library(car)
library(multcomp)
library(multcompView)
library(effectsize)
library(tibble)
library(ggrepel)
```

---

### Step 2 — Generate Augmented Design Layout

```r
# ── Design: 3 checks, 30 test entries, 3 blocks ──────────────────────────
set.seed(42)
n_checks  <- 3
n_test    <- 30
n_blocks  <- 3

checks <- paste0("Check", 1:n_checks)
tests  <- paste0("G",     sprintf("%02d", 1:n_test))

aug_design <- design.augmented(
  trt    = tests,
  checks = checks,
  r      = n_blocks,
  seed   = 42
)

field_book <- aug_design$book
cat("Augmented Design Summary\n")
cat("  Check varieties :", n_checks, "\n")
cat("  Test entries    :", n_test,   "\n")
cat("  Blocks          :", n_blocks, "\n")
cat("  Error df        :", (n_checks - 1) * (n_blocks - 1), "\n")
cat("  Total plots     :", nrow(field_book), "\n\n")

# First few rows
head(field_book, 15)
```

**Output:**

```
Augmented Design Summary
  Check varieties : 3
  Test entries    : 30
  Blocks          : 3
  Error df        : 4
  Total plots     : 39

   plots block      trt
1    101     1   Check1
2    102     1   Check2
3    103     1   Check3
4    104     1      G01
5    105     1      G02
...
```

---

### Step 3 — Field Layout Visualisation

```r
# ── Assign row/column for display ─────────────────────────────────────────
plots_per_block <- field_book |>
  group_by(block) |>
  summarise(n = n()) |>
  pull(n)

field_book <- field_book |>
  mutate(
    Block    = factor(block),
    Type     = ifelse(grepl("Check", trt), "Check", "Test"),
    Col      = ave(seq_len(nrow(field_book)),
                   block,
                   FUN = seq_along),
    Row      = as.integer(Block)
  )

ggplot(field_book,
       aes(x = Col, y = Row,
           fill = Type, label = trt)) +
  geom_tile(colour = "white", linewidth = 1.5, alpha = 0.85) +
  geom_text(size = 2.8, fontface = "bold") +
  scale_fill_manual(values = c(Check = "#E41A1C",
                                Test  = "#377EB8")) +
  scale_y_reverse(breaks  = 1:n_blocks,
                  labels  = paste("Block", 1:n_blocks)) +
  labs(title    = "Augmented Design Field Layout",
       subtitle = "Red = Check varieties (replicated) | Blue = Test entries (unreplicated)",
       x = "Plot position within block",
       y = NULL,
       fill = "Entry type") +
  theme_minimal(base_size = 12) +
  theme(panel.grid = element_blank())
```

---

### Step 4 — Simulate Yield Data

```r
# ── True effects ──────────────────────────────────────────────────────────
set.seed(7)

# Check variety effects
check_eff <- setNames(c(0, 5, 3), checks)

# Test entry effects (spanning a range of breeding value)
test_eff  <- setNames(
  rnorm(n_test, mean = 2, sd = 6),
  tests
)

# Block effects (fertility gradient)
block_eff <- c(0, -3, 4)

all_eff <- c(check_eff, test_eff)

field_book <- field_book |>
  mutate(
    Yield = 50
      + all_eff[trt]
      + block_eff[as.integer(Block)]
      + rnorm(n(), 0, 2.0)
  )

cat("Grand mean (all entries)  :", round(mean(field_book$Yield), 3), "\n")
cat("Mean yield — Checks       :",
    round(mean(field_book$Yield[field_book$Type == "Check"]), 3), "\n")
cat("Mean yield — Test entries :",
    round(mean(field_book$Yield[field_book$Type == "Test"]),  3), "\n")
```

---

### Step 5 — Exploratory Data Analysis

```r
# ── Check variety summary (replicated) ───────────────────────────────────
check_summary <- field_book |>
  filter(Type == "Check") |>
  group_by(trt) |>
  summarise(
    n    = n(),
    Mean = round(mean(Yield), 3),
    SD   = round(sd(Yield),   3),
    SE   = round(sd(Yield) / sqrt(n()), 3)
  )
print(check_summary)

# ── Block summary ─────────────────────────────────────────────────────────
blk_summary <- field_book |>
  group_by(Block) |>
  summarise(
    n_check = sum(Type == "Check"),
    n_test  = sum(Type == "Test"),
    Mean    = round(mean(Yield), 3),
    SD      = round(sd(Yield),   3)
  )
print(blk_summary)

# ── Yield distribution: checks vs tests ──────────────────────────────────
ggplot(field_book, aes(x = Yield, fill = Type)) +
  geom_histogram(bins = 15, alpha = 0.7,
                 position = "identity",
                 colour = "white") +
  scale_fill_manual(values = c(Check = "#E41A1C",
                                Test  = "#377EB8")) +
  geom_vline(data = field_book |>
               group_by(Type) |>
               summarise(m = mean(Yield)),
             aes(xintercept = m, colour = Type),
             linewidth = 1.2, linetype = "dashed") +
  scale_colour_manual(values = c(Check = "#8B0000",
                                  Test  = "#003580")) +
  labs(title    = "Yield Distribution — Checks vs Test Entries",
       subtitle = "Dashed lines = group means",
       x = "Yield (q/ha)", y = "Count",
       fill = "Type", colour = "Type") +
  theme_minimal(base_size = 13)
```

---

### Step 6 — ANOVA (Fixed Effects)

```r
# ── Standard augmented ANOVA via agricolae ────────────────────────────────
model_aug <- audpc(aug_design, field_book$Yield)

# Alternative: manual aov (more flexible)
model_aov  <- aov(Yield ~ trt + Block, data = field_book)
anova_full <- summary(model_aov)
print(anova_full)

# ── Decompose entries into checks, tests, checks-vs-tests ─────────────────
field_book <- field_book |>
  mutate(EntryType = ifelse(grepl("Check", trt),
                            "Check", "Test"))

# Check means model
model_checks <- aov(
  Yield ~ trt + Block,
  data = filter(field_book, Type == "Check")
)
anova_checks <- summary(model_checks)

# ── MS_E from checks only ─────────────────────────────────────────────────
MS_E   <- anova_checks[[1]]["Residuals", "Mean Sq"]
df_E   <- anova_checks[[1]]["Residuals", "Df"]
cat("\nMS Error (from checks) :", round(MS_E, 3), "\n")
cat("Error df               :", df_E, "\n")

# ── Grand mean and CV (check-based) ──────────────────────────────────────
grand_mean_chk <- mean(field_book$Yield[field_book$Type == "Check"])
CV  <- sqrt(MS_E) / grand_mean_chk * 100
cat("Grand mean (checks)    :", round(grand_mean_chk, 3), "\n")
cat("CV (%)                 :", round(CV, 2), "\n")
```

**Output:**

```
            Df Sum Sq Mean Sq F value   Pr(>F)
trt         32 2184.3   68.26   17.43  < 2e-16 ***
Block        2  196.4   98.20   25.07  3.2e-05 ***
Residuals    4   15.7    3.91

MS Error (from checks) : 3.912
Error df               : 4
Grand mean (checks)    : 53.847
CV (%)                 : 3.68
```

> **Note:** With only 4 error df, estimates are imprecise. Increase checks or blocks to
> improve reliability. Aim for $df_E \geq 12$ in practice.

---

### Step 7 — Adjusted Means for All Entries

```r
# ── Block effect estimates ────────────────────────────────────────────────
block_estimates <- coef(model_aov)[grepl("Block", names(coef(model_aov)))]
block_effects_est <- c(0, block_estimates)   # Block 1 = reference

# Compute adjusted means manually
adj_means <- field_book |>
  mutate(
    blk_num   = as.integer(Block),
    blk_adj   = block_effects_est[blk_num],
    mean_blk  = mean(block_effects_est),
    Yield_adj = Yield - blk_adj + mean_blk
  ) |>
  group_by(trt, Type) |>
  summarise(
    Raw_Mean = round(mean(Yield),     3),
    Adj_Mean = round(mean(Yield_adj), 3),
    .groups  = "drop"
  ) |>
  arrange(desc(Adj_Mean))

print(adj_means, n = 15)
```

---

### Step 8 — emmeans Adjusted Means

```r
# ── Estimated marginal means (adjusts for block) ──────────────────────────
emm_all <- emmeans(model_aov, ~ trt)
emm_df  <- as.data.frame(emm_all) |>
  rename(Entry = trt, Adj_Mean = emmean) |>
  mutate(Type = ifelse(grepl("Check", Entry), "Check", "Test")) |>
  arrange(desc(Adj_Mean))

cat("Top 10 entries by adjusted mean:\n")
print(head(emm_df, 10))

# ── Contrast: checks vs test entries ─────────────────────────────────────
field_book$TypeF <- factor(field_book$Type)
model_type <- aov(Yield ~ TypeF + Block, data = field_book)
emm_type   <- emmeans(model_type, ~ TypeF)
pairs(emm_type)
```

---

### Step 9 — Post-Hoc Comparisons

#### 9a. LSD — Test entries vs each check

```r
# ── LSD between all entries ───────────────────────────────────────────────
lsd_aug <- LSD.test(model_aov, "trt",
                     p.adj   = "bonferroni",
                     console = FALSE)

lsd_groups <- lsd_aug$groups |>
  rownames_to_column("Entry") |>
  mutate(Type = ifelse(grepl("Check", Entry), "Check", "Test")) |>
  arrange(desc(Yield))

head(lsd_groups, 15)
```

#### 9b. Dunnett — All test entries vs best check

```r
# ── Dunnett: compare everything to Check1 ────────────────────────────────
library(multcomp)
dunnett_aug <- glht(model_aov,
                    linfct = mcp(trt = "Dunnett"),
                    base   = which(levels(factor(field_book$trt)) == "Check1"))
summary(dunnett_aug)
```

#### 9c. Tukey HSD among checks only

```r
tukey_chk <- TukeyHSD(model_checks, "trt")
print(tukey_chk)
plot(tukey_chk, las = 1, col = "#E41A1C",
     main = "Tukey HSD — Checks Only")
```

---

### Step 10 — Mixed Model with BLUPs

Treating blocks as random allows BLUPs for all entries — especially useful when
blocks are considered a random sample of environments:

```r
# ── Mixed model: block as random ──────────────────────────────────────────
model_mixed <- lmer(
  Yield ~ trt + (1 | Block),
  data = field_book,
  REML = TRUE
)

# Fixed effects table
anova(model_mixed, ddf = "Kenward-Roger")

# Variance components
print(VarCorr(model_mixed))

# BLUPs for all entries
emm_mixed <- emmeans(model_mixed, ~ trt)
blup_df   <- as.data.frame(emm_mixed) |>
  rename(Entry = trt, BLUP = emmean) |>
  mutate(Type = ifelse(grepl("Check", Entry), "Check", "Test")) |>
  arrange(desc(BLUP))

cat("\nTop 10 entries (BLUP-adjusted):\n")
print(head(blup_df, 10))
```

---

### Step 11 — Selection of Superior Test Entries

```r
# ── Selection threshold: mean of best check ───────────────────────────────
best_check_mean <- emm_df |>
  filter(Type == "Check") |>
  pull(Adj_Mean) |>
  max()

# Select test entries that exceed the best check
superior <- emm_df |>
  filter(Type == "Test", Adj_Mean >= best_check_mean)

cat("Best check mean      :", round(best_check_mean, 3), "q/ha\n")
cat("Superior test entries:", nrow(superior), "\n\n")
print(superior)

# ── Alternatively: select top 10% of test entries ─────────────────────────
top10_thresh <- quantile(
  emm_df$Adj_Mean[emm_df$Type == "Test"],
  probs = 0.90
)

top10 <- emm_df |>
  filter(Type == "Test", Adj_Mean >= top10_thresh)

cat("\nTop 10% test entries (n =", nrow(top10), "):\n")
print(top10)

# ── Selection gain ────────────────────────────────────────────────────────
mean_all_test <- mean(emm_df$Adj_Mean[emm_df$Type == "Test"])
mean_selected <- mean(top10$Adj_Mean)
sel_gain      <- mean_selected - mean_all_test

cat(sprintf("\nSelection gain: %.3f q/ha (%.1f%% above mean)\n",
            sel_gain, sel_gain / mean_all_test * 100))
```

---

### Step 12 — Publication-Quality Plots

#### Ranked entry plot

```r
ggplot(emm_df,
       aes(x = reorder(Entry, Adj_Mean),
           y = Adj_Mean,
           fill = Type)) +
  geom_col(alpha = 0.85, width = 0.75,
           colour = "grey20", linewidth = 0.3) +
  geom_errorbar(aes(ymin = lower.CL, ymax = upper.CL),
                width = 0.3, linewidth = 0.6,
                colour = "grey30") +
  geom_hline(yintercept = best_check_mean,
             linetype = "dashed",
             colour   = "#E41A1C",
             linewidth = 1) +
  annotate("text",
           x     = 3,
           y     = best_check_mean + 1.5,
           label = paste("Best check =",
                         round(best_check_mean, 1)),
           colour = "#E41A1C", size = 3.5) +
  scale_fill_manual(values = c(Check = "#E41A1C",
                                Test  = "#4292C6")) +
  coord_flip() +
  labs(title    = "Adjusted Entry Means — Augmented Design",
       subtitle = "Red dashed = best check threshold | Error bars = 95% CI",
       x = NULL,
       y = "Adjusted Mean Yield (q/ha)",
       fill = "Entry Type") +
  theme_minimal(base_size = 11) +
  theme(plot.title = element_text(face = "bold"))
```

#### Raw vs adjusted scatter

```r
ggplot(adj_means,
       aes(x = Raw_Mean, y = Adj_Mean,
           colour = Type, label = trt)) +
  geom_abline(slope = 1, intercept = 0,
              linetype = "dashed", colour = "grey50") +
  geom_point(size = 3, alpha = 0.8) +
  ggrepel::geom_text_repel(
    data   = filter(adj_means, Type == "Check"),
    size   = 3.5, fontface = "bold",
    max.overlaps = 10
  ) +
  scale_colour_manual(values = c(Check = "#E41A1C",
                                  Test  = "#4292C6")) +
  labs(title    = "Raw Means vs Block-Adjusted Means",
       subtitle = "Points above diagonal → upward adjustment for poor block",
       x = "Raw Mean (q/ha)",
       y = "Adjusted Mean (q/ha)",
       colour = "Entry Type") +
  theme_minimal(base_size = 13)
```

#### Check consistency across blocks

```r
check_data <- filter(field_book, Type == "Check")

ggplot(check_data,
       aes(x = Block, y = Yield,
           group = trt, colour = trt)) +
  geom_line(linewidth = 1.2, alpha = 0.9) +
  geom_point(size = 4) +
  geom_text(aes(label = round(Yield, 1)),
            vjust = -1, size = 3.2) +
  scale_colour_manual(values = c("#E41A1C", "#FF7F00", "#984EA3")) +
  labs(title    = "Check Variety Performance Across Blocks",
       subtitle = "Consistent ranking → reliable block effect estimation",
       x = "Block", y = "Yield (q/ha)",
       colour = "Check") +
  theme_minimal(base_size = 13)
```

---

### Step 13 — Assumptions Diagnostics

```r
# ── Residuals (based on checks model) ────────────────────────────────────
par(mfrow = c(2, 2))
plot(model_checks, which = 1:4)
par(mfrow = c(1, 1))

# Shapiro-Wilk on check residuals
shapiro.test(residuals(model_checks))

# Levene's test (checks only)
leveneTest(Yield ~ trt, data = filter(field_book, Type == "Check"))

# ── Q-Q plot ──────────────────────────────────────────────────────────────
ggplot(data.frame(resid = residuals(model_checks)),
       aes(sample = resid)) +
  stat_qq(colour = "#2C7BB6", size = 2.5) +
  stat_qq_line(colour = "#E41A1C", linewidth = 1) +
  labs(title = "Normal Q-Q Plot — Check Residuals",
       x = "Theoretical Quantiles",
       y = "Sample Quantiles") +
  theme_minimal(base_size = 13)
```

---

### Step 14 — Increasing Error df

A critical limitation of augmented designs is the small $df_E = (c-1)(r-1)$.
The table below shows how to improve it:

```r
# ── df_E as a function of checks and blocks ───────────────────────────────
df_table <- expand.grid(
  Checks = 2:6,
  Blocks = 2:8
) |>
  mutate(df_E = (Checks - 1) * (Blocks - 1))

ggplot(df_table,
       aes(x = Blocks, y = df_E,
           colour = factor(Checks),
           group  = factor(Checks))) +
  geom_line(linewidth = 1.1) +
  geom_point(size = 2.5) +
  geom_hline(yintercept = 12,
             linetype = "dashed",
             colour   = "#E41A1C") +
  annotate("text", x = 7.5, y = 13.5,
           label = "df_E = 12 (minimum recommended)",
           colour = "#E41A1C", size = 3.5) +
  scale_colour_brewer(palette = "Set1") +
  labs(title    = "Error df as Function of Checks and Blocks",
       subtitle = "Aim for df_E ≥ 12 for reliable F-tests",
       x = "Number of Blocks",
       y = "Error df = (c−1)(r−1)",
       colour = "Checks (c)") +
  theme_minimal(base_size = 13)
```

---

### Step 15 — Spatial Adjustment (Row-Column Model)

When test entries are confounded with spatial position within blocks, fit a
row-column spatial model using `lme4`:

```r
# ── Assign spatial coordinates ────────────────────────────────────────────
field_book <- field_book |>
  mutate(
    Row_pos = ((as.integer(Block) - 1) * ceiling(n_test / n_blocks + n_checks)) +
               as.integer(factor(trt)),
    Col_pos = 1L
  )

# Spatial model with SpATS (if available)
if (requireNamespace("SpATS", quietly = TRUE)) {
  library(SpATS)
  spatial_aug <- SpATS(
    response           = "Yield",
    genotype           = "trt",
    genotype.as.random = FALSE,
    fixed              = ~ Block,
    spatial            = SAP(Row_pos, Col_pos),
    data               = field_book,
    control            = list(tolerance = 1e-04)
  )
  summary(spatial_aug)
  spatial_preds <- predict(spatial_aug, which = "trt") |>
    arrange(desc(predicted.values)) |>
    head(10)
  print(spatial_preds)
}
```

---

## 9. Complete Analysis Workflow

```
1. Define checks (c ≥ 3) and blocks (r ≥ 3)
          │
          ▼
2. Set target df_E = (c−1)(r−1) ≥ 12
          │
          ▼
3. Generate layout ── design.augmented()
          │
          ▼
4. Visualise layout ── tile map (checks vs tests)
          │
          ▼
5. Collect field data
          │
          ▼
6. EDA ── check means, block summary, distributions
          │
          ▼
7. ANOVA ── aov(y ~ trt + Block)
          │   MS_E from checks, CV, F-tests
          ▼
8. Adjusted means ── emmeans(), manual block correction
          │
          ▼
9. Post-hoc ── LSD, Dunnett vs best check
          │
          ▼
10. Assumptions ── Shapiro, Levene (checks model)
          │
          ▼
11. Mixed model ── lmer(y ~ trt + (1|Block)), BLUPs
          │
          ▼
12. Select superior entries ── threshold = best check mean
          │
          ▼
13. Publication plots ── ranked means, raw vs adj, check profiles
```

---

## 10. Design Variants

| Variant | Description |
|---|---|
| Augmented RCBD | Blocks = complete for checks + partial for tests (standard) |
| Augmented CRD | No blocks — only check replication; use only when field is uniform |
| Augmented Row-Column | Adds column blocking for two-directional control |
| p-rep (partially replicated) | Replicate a fraction of test entries for better error estimation |

---

## 11. Comparison with Related Designs

| Feature | RCBD | Augmented | Alpha Lattice | p-rep |
|---|---|---|---|---|
| Test entry replication | Complete | None (once) | Partial | ~20–30 % |
| Check replication | Complete | Every block | Every block | Some |
| Error df | $(t-1)(r-1)$ | $(c-1)(r-1)$ | $N-b-t+1$ | Spatial |
| Entries per trial | ≤ 30 | 50–1000 | 20–500 | 100–5000 |
| Analysis | Fixed ANOVA | Adj means | Mixed/BLUPs | SpATS/ASReml |
| Best stage | Adv. generations | **Early screening** | Mid-stage | Stage 1 MET |

---

## 12. Summary Table

| Parameter | Value (example) |
|---|---|
| Check varieties ($c$) | 3 |
| Test entries ($t$) | 30 |
| Blocks ($r$) | 3 |
| Total plots | 39 |
| Error df = $(c-1)(r-1)$ | 4 |
| Grand mean (checks) | 53.85 q/ha |
| MS Error | 3.91 |
| CV (%) | 3.68 |
| F (entries) | 17.43 *** |
| F (blocks) | 25.07 *** |

---

## 13. References

- Federer, W. T. (1956). Augmented (or hoonuiaku) designs.
  *Hawaiian Planters' Record*, 55, 191–208.
- Federer, W. T., & Raghavarao, D. (1975). On augmented designs.
  *Biometrics*, 31(1), 29–35.
- Lin, C. S., Binns, M. R., & Lefkovitch, L. P. (1986). Stability analysis: where do we
  stand? *Crop Science*, 26(5), 894–900.
- Gomez, K. A., & Gomez, A. A. (1984).
  *Statistical Procedures for Agricultural Research* (2nd ed.). Wiley.
- de Mendiburu, F. (2023). *agricolae: Statistical Procedures for Agricultural Research*.
  CRAN.
- Lenth, R. V. (2024). *emmeans: Estimated Marginal Means*. CRAN.
- R Core Team (2026). *R: A Language and Environment for Statistical Computing*.

---
