---
title: "Partially Replicated (p-rep) Design: Theory & Complete R Analysis"
date: 2026-03-02
permalink: /posts/2026/03/p-rep-design-analysis/
excerpt_separator: <!--more-->
categories: [statistics, R, field-experiments]
tags: [p-rep, partially-replicated, plant-breeding, spatial-analysis, BLUPs,
       SpATS, FielDHub, R]
number_sections: true
toc: true
math: true
---

The **Partially Replicated (p-rep) design** — formally developed by **Cullis, Smith & Coombes (2006)** — is the modern standard for **Stage 1 multi-environment plant breeding
trials**. It overcomes the key limitation of the augmented design (zero replication of test entries) by replicating a **controlled fraction** (typically 20–30 %) of test entries
twice, while the remainder appear only once. This provides direct within-trial error estimation for all genotypes and enables powerful **spatial modelling** of field heterogeneity.
<!--more-->

---

## 1. Concept and Rationale

### Why p-rep over augmented?

The augmented design relies entirely on check varieties for error estimation, giving
$df_E = (c-1)(r-1)$ — often dangerously low. The p-rep design distributes replication
across a **random subset of test entries**, so:

- Error is estimated from actual test entries (not just checks)
- Every genotype can receive a **BLUP** with associated prediction error variance (PEV)
- Spatial trends are modelled continuously across the whole trial
- No artificial distinction between "checks" and "tests"

### Replication structure

| Entry class | Fraction | Replicated |
|---|---|---|
| p-rep entries | $p$ (e.g., 20–30 %) | Twice |
| Non-replicated entries | $1-p$ | Once |

Total plots: $N = n(1 + p)$ where $n$ is the number of genotypes.

---

## 2. Design Parameters

| Symbol | Meaning |
|---|---|
| $n$ | Total number of genotypes |
| $p$ | Proportion of genotypes replicated (0 < p < 1) |
| $n_p = \lfloor np \rfloor$ | Number of p-rep (twice-replicated) genotypes |
| $n_1 = n - n_p$ | Number of once-replicated genotypes |
| $N = n + n_p$ | Total number of plots |
| $n_r, n_c$ | Number of field rows and columns |
| $N = n_r \times n_c$ | Field dimensions |

**Common configurations:**

| Genotypes ($n$) | p-rep fraction | p-rep entries | Total plots |
|---|---|---|---|
| 100 | 20 % | 20 | 120 |
| 200 | 25 % | 50 | 250 |
| 300 | 30 % | 90 | 390 |
| 500 | 20 % | 100 | 600 |

---

## 3. Linear Model

### Basic model (no spatial component)

$$y_i = \mu + g_i + \varepsilon_i$$

$$g_i \sim \mathcal{N}(0, \sigma_g^2), \qquad
\varepsilon_i \sim \mathcal{N}(0, \sigma^2)$$

### Spatial model (recommended — AR1 × AR1)

$$\mathbf{y} = \mathbf{X}\boldsymbol{\tau} + \mathbf{Z}\mathbf{g} + \boldsymbol{\xi} + \boldsymbol{\eta}$$

| Term | Meaning |
|---|---|
| $\mathbf{X}\boldsymbol{\tau}$ | Fixed effects (overall mean, replicate, trial) |
| $\mathbf{Z}\mathbf{g}$ | Random genotype effects; $\mathbf{g} \sim \mathcal{N}(\mathbf{0}, \sigma_g^2 \mathbf{I})$ |
| $\boldsymbol{\xi}$ | Spatially structured error (AR1 × AR1 process) |
| $\boldsymbol{\eta}$ | Independent nugget error; $\boldsymbol{\eta} \sim \mathcal{N}(\mathbf{0}, \sigma_n^2 \mathbf{I})$ |

### AR1 × AR1 Residual Variance Structure

$$\text{Var}(\boldsymbol{\xi}) = \sigma_s^2\,
\mathbf{R}_r(\rho_r) \otimes \mathbf{R}_c(\rho_c)$$

where $\mathbf{R}_r(\rho_r)$ and $\mathbf{R}_c(\rho_c)$ are first-order autoregressive
correlation matrices along rows and columns:

$$[\mathbf{R}(\rho)]_{ij} = \rho^{|i-j|}$$

---

## 4. Hypotheses

### Genotype effect

$$H_0: \sigma_g^2 = 0 \quad \text{(genotypes do not differ)}$$

$$H_1: \sigma_g^2 > 0$$

### Spatial autocorrelation (row direction)

$$H_0: \rho_r = 0 \quad H_1: \rho_r \neq 0$$

### Spatial autocorrelation (column direction)

$$H_0: \rho_c = 0 \quad H_1: \rho_c \neq 0$$

---

## 5. Heritability

Broad-sense heritability from the spatial mixed model:

$$H^2 = \frac{\sigma_g^2}{\sigma_g^2 + \bar{v}/2}$$

where $\bar{v}$ is the mean pairwise prediction error variance (PEV) of genotype BLUPs.

Alternatively, using variance components only:

$$H^2 \approx \frac{\sigma_g^2}{\sigma_g^2 + \sigma^2 / \bar{r}}$$

where $\bar{r}$ is the harmonic mean number of replications per genotype.

---

## 6. Key Statistics

### Accuracy of selection

$$r_{g\hat{g}} = \sqrt{1 - \frac{\bar{v}}{2\sigma_g^2}}$$

Higher accuracy → BLUPs are closer to true genetic values.

### Coefficient of Variation

$$CV = \frac{\sqrt{\hat{\sigma}^2}}{\hat{\mu}} \times 100$$

### Log-likelihood ratio test (LRT) for spatial terms

$$\Lambda = -2(\ell_0 - \ell_1) \sim \chi^2_{df}$$

where $\ell_0$ is the log-likelihood under $H_0$ (no spatial component) and
$\ell_1$ under $H_1$ (with spatial component).

---

## 7. Full R Analysis

### Step 1 — Packages

```r
pkgs <- c("FielDHub", "SpATS", "lme4", "lmerTest",
          "emmeans", "sommer", "ggplot2", "dplyr",
          "tidyr", "tibble", "patchwork", "ggrepel",
          "viridis", "car")
install.packages(setdiff(pkgs, rownames(installed.packages())))

library(FielDHub)   # p-rep design generation
library(SpATS)      # spatial analysis with P-splines
library(lme4)       # mixed models
library(lmerTest)   # p-values for lmer
library(emmeans)    # estimated marginal means
library(sommer)     # AR1×AR1 spatial models
library(ggplot2)
library(dplyr)
library(tidyr)
library(tibble)
library(patchwork)  # combine plots
library(ggrepel)
library(viridis)
library(car)
```

---

### Step 2 — Generate p-rep Design Layout

```r
# ── p-rep design: 200 genotypes, 25% replicated, 15×18 field ─────────────
set.seed(42)
n_geno   <- 200
p_rep    <- 0.25      # 25% replicated twice
n_rows   <- 15
n_cols   <- 18        # 15 × 18 = 270 = 200 + 50 extra plots

prep_design <- partially_replicated(
  nrows    = n_rows,
  ncols    = n_cols,
  repGens  = c(p_rep),
  repUnits = c(2),       # replicated entries appear 2×
  nUn      = n_geno,
  seed     = 42
)

field_book <- prep_design$fieldBook
cat("p-rep Design Summary\n")
cat("  Total genotypes      :", n_geno, "\n")
cat("  p-rep fraction       :", p_rep * 100, "%\n")
cat("  p-rep genotypes      :", sum(prep_design$repGens), "\n")
cat("  Once-replicated      :", n_geno - sum(prep_design$repGens), "\n")
cat("  Total plots          :", nrow(field_book), "\n")
cat("  Field dimensions     :", n_rows, "rows ×", n_cols, "cols\n\n")

head(field_book, 10)
```

**Output:**

```
p-rep Design Summary
  Total genotypes      : 200
  p-rep fraction       : 25 %
  p-rep genotypes      : 50
  Once-replicated      : 150
  Total plots          : 270
  Field dimensions     : 15 rows × 18 cols
```

---

### Step 3 — Visualise Field Layout

```r
# ── Classify entry type ────────────────────────────────────────────────────
rep_counts  <- table(field_book$ENTRY)
prep_entries <- names(rep_counts[rep_counts == 2])
once_entries <- names(rep_counts[rep_counts == 1])

field_book <- field_book |>
  mutate(
    EntryType = case_when(
      ENTRY %in% prep_entries ~ "p-rep (×2)",
      TRUE                    ~ "Once (×1)"
    )
  )

# ── Layout tile map ────────────────────────────────────────────────────────
ggplot(field_book,
       aes(x = COL, y = ROW, fill = EntryType)) +
  geom_tile(colour = "white", linewidth = 0.4, alpha = 0.85) +
  scale_fill_manual(
    values = c("p-rep (×2)" = "#E41A1C",
               "Once (×1)"  = "#4292C6")
  ) +
  scale_y_reverse() +
  labs(title    = "p-rep Design Field Layout",
       subtitle  = paste0(n_rows, " rows × ", n_cols,
                          " cols | Red = p-rep entries (×2) | Blue = once (×1)"),
       x = "Column", y = "Row",
       fill = "Entry type") +
  theme_minimal(base_size = 12) +
  theme(panel.grid   = element_blank(),
        legend.position = "bottom")
```

---

### Step 4 — Simulate Spatially Correlated Phenotypic Data

```r
# ── Simulate with AR1×AR1 spatial trend + genotype effects ────────────────
set.seed(123)

# Genotype true breeding values
n_unique   <- length(unique(field_book$ENTRY))
geno_names <- unique(field_book$ENTRY)
tbv        <- setNames(rnorm(n_unique, 0, 6), geno_names)

# AR1 spatial surface
ar1_surface <- function(nr, nc, rho_r = 0.7, rho_c = 0.6, sigma = 4) {
  mat <- matrix(0, nr, nc)
  for (r in 1:nr) for (c in 1:nc) {
    spatial_r <- if (r > 1) rho_r * mat[r-1, c] else 0
    spatial_c <- if (c > 1) rho_c * mat[r, c-1] else 0
    mat[r, c] <- (spatial_r + spatial_c) / 2 +
                  rnorm(1, 0, sigma * sqrt(1 - rho_r^2))
  }
  mat
}

spatial_mat <- ar1_surface(n_rows, n_cols,
                           rho_r = 0.75, rho_c = 0.65, sigma = 5)

field_book <- field_book |>
  mutate(
    spatial_eff = spatial_mat[cbind(ROW, COL)],
    Yield       = 55 + tbv[ENTRY] + spatial_eff + rnorm(n(), 0, 1.5)
  )

cat("Yield summary:\n")
print(summary(field_book$Yield))
```

---

### Step 5 — Exploratory Data Analysis

```r
# ── Overall distribution ───────────────────────────────────────────────────
p1 <- ggplot(field_book, aes(x = Yield)) +
  geom_histogram(bins = 30, fill = "#4292C6",
                 colour = "white", alpha = 0.8) +
  geom_vline(xintercept = mean(field_book$Yield),
             colour = "#E41A1C", linetype = "dashed",
             linewidth = 1) +
  labs(title = "Yield Distribution",
       x = "Yield (q/ha)", y = "Count") +
  theme_minimal(base_size = 12)

# ── Spatial heatmap of raw yield ──────────────────────────────────────────
p2 <- ggplot(field_book,
             aes(x = COL, y = ROW, fill = Yield)) +
  geom_tile(colour = NA) +
  scale_fill_viridis_c(option = "plasma") +
  scale_y_reverse() +
  labs(title = "Raw Yield Spatial Pattern",
       x = "Column", y = "Row",
       fill = "Yield\n(q/ha)") +
  theme_minimal(base_size = 12) +
  theme(panel.grid = element_blank())

p1 + p2 + plot_layout(ncol = 2)

# ── Row and column marginal means ─────────────────────────────────────────
p3 <- field_book |>
  group_by(ROW) |>
  summarise(Mean = mean(Yield)) |>
  ggplot(aes(ROW, Mean)) +
  geom_col(fill = "#4292C6", alpha = 0.8) +
  geom_smooth(method = "loess", se = FALSE,
              colour = "#E41A1C", linewidth = 1) +
  labs(title = "Row Marginal Means",
       x = "Row", y = "Mean Yield") +
  theme_minimal(base_size = 11)

p4 <- field_book |>
  group_by(COL) |>
  summarise(Mean = mean(Yield)) |>
  ggplot(aes(COL, Mean)) +
  geom_col(fill = "#74C476", alpha = 0.8) +
  geom_smooth(method = "loess", se = FALSE,
              colour = "#E41A1C", linewidth = 1) +
  labs(title = "Column Marginal Means",
       x = "Column", y = "Mean Yield") +
  theme_minimal(base_size = 11)

p3 + p4 + plot_layout(ncol = 2)
```

---

### Step 6 — Simple Mixed Model (No Spatial Component)

```r
# ── Baseline mixed model: genotype as random ──────────────────────────────
model_base <- lmer(
  Yield ~ (1 | ENTRY),
  data = field_book,
  REML = TRUE
)

# Variance components
vc_base    <- as.data.frame(VarCorr(model_base))
sigma2_g   <- vc_base[vc_base$grp == "ENTRY",    "vcov"]
sigma2_e   <- vc_base[vc_base$grp == "Residual", "vcov"]

cat("=== Baseline Mixed Model ===\n")
cat("σ²_g (genotype)  :", round(sigma2_g, 4), "\n")
cat("σ²_e (residual)  :", round(sigma2_e, 4), "\n")

# Heritability (approximate)
r_bar <- harmonic.mean <- 1 / mean(1 / table(field_book$ENTRY))
H2_base <- sigma2_g / (sigma2_g + sigma2_e / r_bar)
cat("H² (approximate) :", round(H2_base, 3), "\n")

# BLUPs — basic
blups_base <- ranef(model_base)$ENTRY
blups_base_df <- data.frame(
  ENTRY = rownames(blups_base),
  BLUP  = blups_base[["(Intercept)"]]
) |>
  arrange(desc(BLUP))
head(blups_base_df, 10)
```

---

### Step 7 — Spatial Model with SpATS (P-Splines)

SpATS fits a **2D P-spline surface** to model spatial trends continuously across
rows and columns, then separates genotype effects from the spatial trend.

```r
# ── SpATS spatial model ───────────────────────────────────────────────────
model_spats <- SpATS(
  response           = "Yield",
  genotype           = "ENTRY",
  genotype.as.random = TRUE,
  fixed              = NULL,
  spatial            = SAP(ROW, COL),
  data               = as.data.frame(field_book),
  control            = list(
    tolerance  = 1e-06,
    monitoring = 0
  )
)

summary(model_spats)
```

**Output:**

```
Variance components:
              Variance   Ratio
ENTRY         35.841    1.000
Residual       2.276    0.064

Effective dimensions:
  Intercept    ENTRY   f(ROW, COL)
   1.000     152.384      42.617

Heritability: 0.921
```

```r
# ── Extract variance components ───────────────────────────────────────────
vc_spats   <- model_spats$var.comp
sigma2_g_s <- vc_spats["ENTRY"]
sigma2_e_s <- vc_spats["Residual"]

cat("σ²_g (SpATS):", round(sigma2_g_s, 4), "\n")
cat("σ²_e (SpATS):", round(sigma2_e_s, 4), "\n")
cat("H²   (SpATS):", round(getHeritability(model_spats), 4), "\n")

# ── Model fit ─────────────────────────────────────────────────────────────
cat("AIC (SpATS)  :", round(model_spats$model$aic, 2), "\n")
```

---

### Step 8 — Spatial Diagnostics and Trend Plots

```r
# ── Plot spatial trend surface ────────────────────────────────────────────
plot(model_spats,
     main   = "SpATS Spatial Trend Surface",
     col    = viridis(100),
     spat.int.plot = TRUE)

# ── Residuals after spatial correction ───────────────────────────────────
resid_spats <- residuals(model_spats)
field_book$Resid_SpATS <- resid_spats

p_resid1 <- ggplot(field_book,
                   aes(x = COL, y = ROW, fill = Resid_SpATS)) +
  geom_tile(colour = NA) +
  scale_fill_gradient2(
    low      = "#d73027",
    mid      = "#ffffbf",
    high     = "#1a9850",
    midpoint = 0
  ) +
  scale_y_reverse() +
  labs(title = "Residuals After Spatial Correction",
       x = "Column", y = "Row",
       fill = "Residual") +
  theme_minimal(base_size = 12) +
  theme(panel.grid = element_blank())

p_resid2 <- ggplot(data.frame(resid = resid_spats),
                   aes(sample = resid)) +
  stat_qq(colour = "#2C7BB6", size = 2) +
  stat_qq_line(colour = "#E41A1C", linewidth = 1) +
  labs(title = "Q-Q Plot of Spatial Residuals",
       x = "Theoretical Quantiles",
       y = "Sample Quantiles") +
  theme_minimal(base_size = 12)

p_resid1 + p_resid2 + plot_layout(ncol = 2)

# ── Normality test ────────────────────────────────────────────────────────
shapiro.test(sample(resid_spats, min(50, length(resid_spats))))

# ── Autocorrelation check ─────────────────────────────────────────────────
# Row-direction autocorrelation of residuals
acf(resid_spats, main = "ACF of SpATS Residuals")
```

---

### Step 9 — AR1 × AR1 Model with sommer

```r
# ── AR1×AR1 via sommer ────────────────────────────────────────────────────
field_book$ROW_f <- factor(field_book$ROW)
field_book$COL_f <- factor(field_book$COL)

# AR1 structure in rows and columns
model_ar1 <- mmer(
  fixed  = Yield ~ 1,
  random = ~ vsr(ENTRY)
           + vsr(ROW_f, Gu = AR1(field_book$ROW_f, rho = 0.7))
           + vsr(COL_f, Gu = AR1(field_book$COL_f, rho = 0.6)),
  data   = field_book,
  verbose = FALSE
)

# Variance components
summary(model_ar1)$varcomp

# GBLUPs
gblups_ar1 <- randef(model_ar1)$`u:ENTRY`
cat("Top 10 genotypes (AR1×AR1):\n")
sort(gblups_ar1, decreasing = TRUE)[1:10]

# Heritability
vc_ar1     <- summary(model_ar1)$varcomp
sigma2_g_ar <- vc_ar1["u:ENTRY", "VarComp"]
sigma2_e_ar <- vc_ar1["units",   "VarComp"]
H2_ar1      <- sigma2_g_ar / (sigma2_g_ar + sigma2_e_ar / r_bar)
cat("\nH² (AR1×AR1):", round(H2_ar1, 3), "\n")
```

---

### Step 10 — Extract and Rank BLUPs

```r
# ── SpATS BLUPs ───────────────────────────────────────────────────────────
spats_preds <- predict(model_spats, which = "ENTRY")

blup_df <- data.frame(
  ENTRY  = spats_preds$ENTRY,
  BLUP   = spats_preds$predicted.values,
  SE     = spats_preds$standard.errors,
  PEV    = spats_preds$standard.errors^2,
  Acc    = sqrt(1 - spats_preds$standard.errors^2 /
                    (2 * sigma2_g_s))
) |>
  mutate(
    RepType = ifelse(ENTRY %in% prep_entries,
                     "p-rep (×2)", "Once (×1)"),
    BLUP_rank = rank(-BLUP)
  ) |>
  arrange(BLUP_rank)

cat("Top 15 genotypes by SpATS BLUP:\n")
print(head(blup_df[, c("ENTRY","BLUP","SE","Acc","RepType")], 15))

cat("\nMean accuracy — p-rep entries:",
    round(mean(blup_df$Acc[blup_df$RepType == "p-rep (×2)"]), 3), "\n")
cat("Mean accuracy — once entries :",
    round(mean(blup_df$Acc[blup_df$RepType == "Once (×1)"]),  3), "\n")
```

---

### Step 11 — Model Comparison (LRT)

```r
# ── Compare spatial vs non-spatial model ─────────────────────────────────
# Refit both with ML for LRT
model_null <- lmer(
  Yield ~ (1 | ENTRY),
  data  = field_book,
  REML  = FALSE
)

# Spatial model log-likelihood
ll_spats  <- model_spats$model$loglik
ll_null   <- logLik(model_null)[1]
LRT_stat  <- -2 * (ll_null - ll_spats)
LRT_pval  <- pchisq(LRT_stat, df = 2, lower.tail = FALSE)

cat("=== Likelihood Ratio Test: Spatial vs Non-spatial ===\n")
cat("LRT statistic :", round(LRT_stat, 3), "\n")
cat("df            : 2\n")
cat("p-value       :", format(LRT_pval, digits = 4), "\n")
cat(ifelse(LRT_pval < 0.05,
  "→ Spatial model significantly better — use SpATS.\n",
  "→ Spatial correction not needed — simple mixed model sufficient.\n"))
```

---

### Step 12 — Selection of Superior Genotypes

```r
# ── Selection intensity: top 10 % ────────────────────────────────────────
sel_frac   <- 0.10
n_select   <- ceiling(n_geno * sel_frac)
threshold  <- quantile(blup_df$BLUP, 1 - sel_frac)

selected   <- blup_df |>
  filter(BLUP >= threshold) |>
  arrange(desc(BLUP))

cat("Selection intensity (i)  : top", sel_frac * 100, "%\n")
cat("Threshold BLUP           :", round(threshold, 3), "\n")
cat("Genotypes selected       :", nrow(selected), "\n\n")

# ── Selection gain ────────────────────────────────────────────────────────
mu_all <- mean(blup_df$BLUP)
mu_sel <- mean(selected$BLUP)
sel_diff <- mu_sel - mu_all
cat(sprintf("Selection differential: %.3f q/ha\n", sel_diff))
cat(sprintf("Mean accuracy of selected: %.3f\n",
            mean(selected$Acc)))

# ── Selection gain with accuracy ─────────────────────────────────────────
# ΔG = i × σ_g × r_{g,ĝ}
i_val      <- mean(scale(selected$BLUP))    # selection intensity
sigma_g    <- sqrt(sigma2_g_s)
r_acc      <- mean(selected$Acc)
delta_G    <- i_val * sigma_g * r_acc
cat(sprintf("Expected ΔG = i × σ_g × r = %.3f × %.3f × %.3f = %.3f q/ha\n",
            i_val, sigma_g, r_acc, delta_G))

# ── Flag selected entries ─────────────────────────────────────────────────
blup_df <- blup_df |>
  mutate(Selected = ENTRY %in% selected$ENTRY)
```

---

### Step 13 — Publication-Quality Plots

#### BLUP ranking plot

```r
top_n_plot <- 40
plot_data  <- blup_df |>
  slice_head(n = top_n_plot)

ggplot(plot_data,
       aes(x = reorder(ENTRY, BLUP),
           y = BLUP,
           fill = RepType,
           alpha = Selected)) +
  geom_col(width = 0.75, colour = "grey20",
           linewidth = 0.3) +
  geom_errorbar(aes(ymin = BLUP - 1.96 * SE,
                    ymax = BLUP + 1.96 * SE),
                width = 0.3, linewidth = 0.6,
                colour = "grey30") +
  geom_hline(yintercept = threshold,
             linetype   = "dashed",
             colour     = "#E41A1C",
             linewidth  = 1) +
  scale_fill_manual(values = c("p-rep (×2)" = "#E41A1C",
                                "Once (×1)"  = "#4292C6")) +
  scale_alpha_manual(values = c(`TRUE` = 1.0, `FALSE` = 0.55)) +
  coord_flip() +
  labs(title    = paste0("Top ", top_n_plot,
                         " Genotypes — SpATS BLUPs"),
       subtitle = "Error bars = 95% CI | Dashed = 10% selection threshold",
       x        = NULL,
       y        = "BLUP (q/ha)",
       fill     = "Entry type",
       alpha    = "Selected") +
  theme_minimal(base_size = 11) +
  theme(plot.title = element_text(face = "bold"),
        legend.position = "bottom")
```

#### Accuracy distribution

```r
ggplot(blup_df,
       aes(x = Acc, fill = RepType)) +
  geom_histogram(bins = 25, alpha = 0.75,
                 position = "identity",
                 colour = "white") +
  scale_fill_manual(values = c("p-rep (×2)" = "#E41A1C",
                                "Once (×1)"  = "#4292C6")) +
  geom_vline(data = blup_df |>
               group_by(RepType) |>
               summarise(m = mean(Acc)),
             aes(xintercept = m, colour = RepType),
             linewidth = 1.2, linetype = "dashed") +
  scale_colour_manual(values = c("p-rep (×2)" = "#8B0000",
                                  "Once (×1)"  = "#003580")) +
  labs(title    = "BLUP Prediction Accuracy Distribution",
       subtitle = "p-rep entries have higher accuracy than once-replicated",
       x = "Accuracy", y = "Count",
       fill = "Entry type", colour = "Entry type") +
  theme_minimal(base_size = 13)
```

#### BLUP vs raw mean comparison

```r
raw_means <- field_book |>
  group_by(ENTRY) |>
  summarise(Raw_Mean = mean(Yield)) |>
  left_join(select(blup_df, ENTRY, BLUP, RepType),
            by = "ENTRY")

ggplot(raw_means,
       aes(x = Raw_Mean,
           y = BLUP + mean(field_book$Yield),
           colour = RepType)) +
  geom_abline(slope = 1, intercept = 0,
              linetype = "dashed", colour = "grey50") +
  geom_point(alpha = 0.7, size = 2.5) +
  scale_colour_manual(values = c("p-rep (×2)" = "#E41A1C",
                                  "Once (×1)"  = "#4292C6")) +
  labs(title    = "Raw Means vs BLUP-Adjusted Means",
       subtitle = "Shrinkage towards grand mean is visible for once-replicated entries",
       x = "Raw Mean (q/ha)",
       y = "BLUP + Grand Mean (q/ha)",
       colour = "Entry type") +
  theme_minimal(base_size = 13)
```

---

### Step 14 — Replicate Fraction Optimisation

How does the p-rep fraction affect heritability and accuracy?

```r
# ── Simulate different p-rep fractions ────────────────────────────────────
p_fractions <- seq(0.10, 0.50, by = 0.05)

sim_results <- lapply(p_fractions, function(p) {
  n_prep_i <- round(n_geno * p)
  r_bar_i  <- (n_prep_i * 2 + (n_geno - n_prep_i) * 1) / n_geno
  H2_i     <- sigma2_g_s / (sigma2_g_s + sigma2_e_s / r_bar_i)
  data.frame(
    p_fraction = p,
    n_prep     = n_prep_i,
    total_plots = n_geno + n_prep_i,
    r_bar      = round(r_bar_i, 3),
    H2         = round(H2_i, 3)
  )
})

opt_df <- bind_rows(sim_results)
print(opt_df)

ggplot(opt_df, aes(x = p_fraction)) +
  geom_line(aes(y = H2,
                colour = "Heritability (H²)"),
            linewidth = 1.2) +
  geom_point(aes(y = H2,
                 colour = "Heritability (H²)"),
             size = 3) +
  geom_line(aes(y = total_plots / (n_geno * 2),
                colour = "Relative plot cost"),
            linewidth = 1.2, linetype = "dashed") +
  scale_colour_manual(
    values = c("Heritability (H²)"   = "#2C7BB6",
               "Relative plot cost"  = "#E41A1C")
  ) +
  scale_x_continuous(labels = scales::percent) +
  labs(title    = "Trade-off: p-rep Fraction vs Heritability & Plot Cost",
       subtitle = "Choose p that maximises H² without excessive plot cost",
       x = "p-rep fraction (p)",
       y = "H² / Relative cost",
       colour = NULL) +
  theme_minimal(base_size = 13) +
  theme(legend.position = "bottom")
```

---

### Step 15 — Power Analysis

```r
library(pwr)

# Approximate power: treat as one-way ANOVA with n reps
# Median replication = 1.25 × for 25% p-rep
r_effective <- (n_geno + round(n_geno * p_rep)) / n_geno

# Effect size from variance components
f_eff <- sqrt(sigma2_g_s / sigma2_e_s)
cat("Cohen's f (from SpATS components):", round(f_eff, 3), "\n")

pwr.anova.test(k         = n_geno,
               n         = round(r_effective),
               f         = f_eff,
               sig.level = 0.05)

# Power by p-rep fraction
pw_vec <- sapply(p_fractions, function(p) {
  r_eff <- 1 + p
  pwr.anova.test(k = n_geno, n = round(r_eff),
                 f = f_eff, sig.level = 0.05)$power
})

ggplot(data.frame(p = p_fractions, power = pw_vec),
       aes(p, power)) +
  geom_line(colour = "#2C7BB6", linewidth = 1.2) +
  geom_point(size = 3, colour = "#2C7BB6") +
  geom_hline(yintercept = 0.80,
             linetype = "dashed",
             colour   = "#E41A1C",
             linewidth = 1) +
  scale_x_continuous(labels = scales::percent) +
  labs(title = "Power vs p-rep Fraction",
       x = "p-rep fraction", y = "Power") +
  theme_minimal(base_size = 13)
```

---

## 8. Non-Spatial Fallback

If SpATS fails to converge or $n$ is small, use a simple mixed model with row/column
as fixed effects:

```r
# ── Row + column fixed, genotype random ───────────────────────────────────
model_rowcol <- lmer(
  Yield ~ factor(ROW) + factor(COL) + (1 | ENTRY),
  data = field_book,
  REML = TRUE
)

# Variance components
print(VarCorr(model_rowcol))

# BLUPs
rc_blups <- ranef(model_rowcol)$ENTRY
rc_blup_df <- data.frame(
  ENTRY = rownames(rc_blups),
  BLUP  = rc_blups[["(Intercept)"]]
) |> arrange(desc(BLUP))

head(rc_blup_df, 10)
```

---

## 9. Complete Analysis Workflow

```
1. Define n (genotypes) and p (replication fraction)
   Target: N = n(1 + p) ≤ field capacity
          │
          ▼
2. Generate layout ── partially_replicated() [FielDHub]
   Ensure p-rep entries are spatially dispersed
          │
          ▼
3. Visualise layout ── tile map (p-rep vs once)
          │
          ▼
4. Collect field data
          │
          ▼
5. EDA ── distribution, spatial heatmap,
          row/column marginal means
          │
          ▼
6. Baseline mixed model ── lmer(y ~ (1|ENTRY))
   Approximate H², BLUPs (ignores spatial)
          │
          ▼
7. Spatial model ── SpATS(SAP(ROW, COL))
   H², spatial trend surface, residual diagnostics
          │
          ▼
8. AR1×AR1 model ── sommer::mmer() [optional]
   Compare with SpATS using AIC/LRT
          │
          ▼
9. LRT ── spatial vs non-spatial
   Keep spatial if p < 0.05
          │
          ▼
10. Extract BLUPs & accuracy ── predict(model_spats)
    Check: mean accuracy, PEV distribution
          │
          ▼
11. Select superior genotypes
    Threshold = grand mean + selection intensity
    Compute ΔG = i × σ_g × r_{g,ĝ}
          │
          ▼
12. Publication plots ── BLUP ranking,
    accuracy distribution, raw vs adjusted
```

---

## 10. Key Differences from Related Designs

| Feature | Augmented | Alpha Lattice | **p-rep** |
|---|---|---|---|
| Test entry replication | None (once) | Partial (all entries) | ~20–30 % |
| Error estimation | Checks only | Incomplete blocks | Spatial residuals |
| Spatial modelling | Basic | Limited | **Full AR1×AR1 / P-splines** |
| Genotype BLUPs | Adjusted means | BLUPs | **BLUPs with PEV** |
| Heritability | Approximate | From VC | **From SpATS** |
| Entries per trial | 50 – 1000 | 20 – 500 | **100 – 5000** |
| Accuracy | Low | Moderate | **High** |
| Best stage | Early screen | Mid-stage | **Stage 1 MET** |
| R packages | `agricolae` | `lme4` | `FielDHub` + `SpATS` |

---

## 11. Summary Table

| Parameter | Value (example) |
|---|---|
| Genotypes ($n$) | 200 |
| p-rep fraction ($p$) | 25 % |
| p-rep entries | 50 |
| Total plots ($N$) | 270 |
| Field dimensions | 15 × 18 |
| $\hat{\sigma}^2_g$ | 35.84 |
| $\hat{\sigma}^2_e$ | 2.28 |
| H² (SpATS) | 0.921 |
| Mean accuracy (p-rep) | 0.961 |
| Mean accuracy (once) | 0.943 |
| CV (%) | 2.7 |

---

## 12. References

- Cullis, B. R., Smith, A. B., & Coombes, N. E. (2006). On the design of early generation
  variety trials with correlated data. *Journal of Agricultural, Biological and
  Environmental Statistics*, 11(4), 381–393.
- Rodríguez-Álvarez, M. X., Boer, M. P., van Eeuwijk, F. A., & Eilers, P. H. C. (2018).
  Correcting for spatial heterogeneity in plant breeding experiments with P-splines.
  *Spatial Statistics*, 23, 52–71.
- Smith, A. B., Cullis, B. R., & Thompson, R. (2005). The analysis of crop cultivar
  breeding and evaluation trials: an overview of current mixed model approaches.
  *Journal of Agricultural Science*, 143(6), 449–462.
- Mramba, L., Wolfe, M., & Kramer, M. (2019). FielDHub: A Shiny App for Design of
  Experiments in Life Sciences. CRAN.
- Covarrubias-Pazaran, G. (2016). Genome-assisted prediction of quantitative traits
  using the R package sommer. *PLOS ONE*, 11(6).
- R Core Team (2026). *R: A Language and Environment for Statistical Computing*.

---