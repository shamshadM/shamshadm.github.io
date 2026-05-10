---
title: "Spatial Analysis with AR1 × AR1 Model: Theory & Complete R Analysis"
date: 2026-05-02
permalink: /posts/2026/05/spatial-ar1-analysis/
excerpt_separator: <!--more-->
categories: [statistics, R, field-experiments]
tags: [spatial-analysis, AR1, autocorrelation, mixed-model, BLUPs,
       sommer, SpATS, ASReml, field-experiments, R]
number_sections: true
toc: true
toc_sticky: true
math: true
---

Field experiments are routinely affected by **spatial heterogeneity** — systematic
variation in soil fertility, moisture, drainage, pH, and microclimate that creates
patches of high and low performance across the trial. When this variation is ignored,
it inflates the residual variance, reduces heritability estimates, biases treatment
comparisons, and misranks genotypes. The **AR1 × AR1 model** (first-order autoregressive
process in both row and column directions) is the gold standard for capturing and
removing this spatial structure from field trial data.
<!--more-->

---

## 1. What is Spatial Autocorrelation?

### Definition

Two plots are **spatially autocorrelated** if their residuals are correlated as a
function of the distance between them. Nearby plots tend to be more similar than
distant plots — a phenomenon described by **Tobler's First Law of Geography**:

> *"Everything is related to everything else, but near things are more related
> than distant things."*

### Sources in field trials

- Soil nutrient gradients (nitrogen, phosphorus, organic matter)
- Moisture gradients (slope, drainage, irrigation patterns)
- Historical land-use effects (previous crops, tillage)
- Microclimate variation (shade, wind, temperature)

### Consequences of ignoring spatial structure

| Effect | Consequence |
|---|---|
| Inflated $MS_E$ | Lower F-statistics, reduced power |
| Biased treatment means | Incorrect ranking of genotypes |
| Underestimated $H^2$ | Conservative breeding decisions |
| Inflated PEV | Overestimated prediction errors |

---

## 2. Visualising Spatial Heterogeneity

Before fitting any model, always visualise raw yield as a spatial heatmap.
Patterns indicate the type and direction of spatial gradient:

| Pattern | Likely cause |
|---|---|
| Row gradient (north–south) | Soil fertility, slope |
| Column gradient (east–west) | Irrigation, wind |
| Patchy clusters | Historical cropping, drainage pockets |
| Random | No spatial structure — standard ANOVA sufficient |

---

## 3. The AR1 Process

### One-dimensional AR1

For a sequence of residuals $\xi_1, \xi_2, \ldots, \xi_n$ along a row (or column):

$$\xi_t = \rho\,\xi_{t-1} + \eta_t, \qquad
\eta_t \overset{\text{iid}}{\sim} \mathcal{N}(0,\, \sigma^2(1-\rho^2))$$

where $\rho \in (-1, 1)$ is the **autocorrelation parameter** (lag-1 correlation).

**Variance of the AR1 process:**

$$\text{Var}(\xi_t) = \frac{\sigma^2(1-\rho^2)}{1-\rho^2} = \sigma^2$$

**Covariance between plots at lag $k$:**

$$\text{Cov}(\xi_t, \xi_{t+k}) = \sigma^2\,\rho^k$$

**Correlation matrix** for $n$ equally-spaced plots:

$$\mathbf{R}(\rho) =
\begin{pmatrix}
1 & \rho & \rho^2 & \cdots & \rho^{n-1} \\
\rho & 1 & \rho & \cdots & \rho^{n-2} \\
\rho^2 & \rho & 1 & \cdots & \rho^{n-3} \\
\vdots & & & \ddots & \vdots \\
\rho^{n-1} & \rho^{n-2} & \rho^{n-3} & \cdots & 1
\end{pmatrix}$$

Key property: $[\mathbf{R}(\rho)]_{ij} = \rho^{|i-j|}$

---

## 4. The AR1 × AR1 Model

### Two-dimensional extension

The **AR1 × AR1 model** extends the one-dimensional AR1 to two spatial directions
simultaneously using the **Kronecker product**:

$$\text{Var}(\boldsymbol{\xi}) =
\sigma_s^2\; \mathbf{R}_r(\rho_r) \otimes \mathbf{R}_c(\rho_c)$$

where:
- $\mathbf{R}_r(\rho_r)$ is the AR1 correlation matrix along **rows** ($n_r \times n_r$)
- $\mathbf{R}_c(\rho_c)$ is the AR1 correlation matrix along **columns** ($n_c \times n_c$)
- $\otimes$ is the Kronecker product
- $\rho_r,\, \rho_c \in (-1, 1)$ are row and column autocorrelation parameters

**Covariance between plots $(r_1, c_1)$ and $(r_2, c_2)$:**

$$\text{Cov}(y_{r_1 c_1},\, y_{r_2 c_2}) =
\sigma_s^2\;\rho_r^{|r_1 - r_2|}\;\rho_c^{|c_1 - c_2|}$$

This separable structure means the spatial correlation decays **multiplicatively**
in both directions — plots far apart in rows AND columns have very low correlation.

---

## 5. Full Mixed Model Specification

### Complete model

$$\mathbf{y} = \mathbf{X}\boldsymbol{\tau} + \mathbf{Z}_g\mathbf{g}
+ \mathbf{Z}_b\mathbf{b} + \boldsymbol{\xi} + \boldsymbol{\varepsilon}$$

| Term | Distribution | Meaning |
|---|---|---|
| $\mathbf{X}\boldsymbol{\tau}$ | Fixed | Overall mean, trial, year effects |
| $\mathbf{Z}_g\mathbf{g}$ | $\mathbf{g} \sim \mathcal{N}(\mathbf{0},\,\sigma_g^2\mathbf{I})$ | Random genotype effects |
| $\mathbf{Z}_b\mathbf{b}$ | $\mathbf{b} \sim \mathcal{N}(\mathbf{0},\,\sigma_b^2\mathbf{I})$ | Random incomplete block effects |
| $\boldsymbol{\xi}$ | $\mathcal{N}(\mathbf{0},\,\sigma_s^2\,\mathbf{R}_r\otimes\mathbf{R}_c)$ | Spatially structured error (AR1×AR1) |
| $\boldsymbol{\varepsilon}$ | $\mathcal{N}(\mathbf{0},\,\sigma_n^2\mathbf{I})$ | Independent nugget error |

### Total residual variance

$$\text{Var}(\mathbf{y}\,|\,\mathbf{g}) =
\underbrace{\sigma_s^2\,\mathbf{R}_r(\rho_r)\otimes\mathbf{R}_c(\rho_c)}_{\text{spatial}}
+ \underbrace{\sigma_n^2\,\mathbf{I}}_{\text{nugget}}$$

### Marginal model

$$\mathbf{y} \sim \mathcal{N}\!\left(\mathbf{X}\boldsymbol{\tau},\;
\sigma_g^2\mathbf{Z}_g\mathbf{Z}_g^\top +
\sigma_s^2\,\mathbf{R}_r\otimes\mathbf{R}_c +
\sigma_n^2\mathbf{I}\right)$$

---

## 6. Estimation

### REML (Restricted Maximum Likelihood)

Parameters $(\sigma_g^2, \sigma_s^2, \rho_r, \rho_c, \sigma_n^2)$ are estimated by
maximising the **restricted log-likelihood**:

$$
\ell_R(\boldsymbol{\theta}) = -\frac{1}{2}\Bigg[
\begin{aligned}
&\log|\mathbf{V}| \;+\; \log|\mathbf{X}^\top \mathbf{V}^{-1} \mathbf{X}| \\
&+\; (\mathbf{y} - \mathbf{X}\hat{\boldsymbol{\tau}})^\top \mathbf{V}^{-1}
(\mathbf{y} - \mathbf{X}\hat{\boldsymbol{\tau}})
\end{aligned}
\Bigg]
$$

where $\mathbf{V} = \text{Var}(\mathbf{y})$.

### BLUPs (Best Linear Unbiased Predictors)

$$\hat{\mathbf{g}} = \sigma_g^2\mathbf{Z}_g^\top\mathbf{V}^{-1}
(\mathbf{y} - \mathbf{X}\hat{\boldsymbol{\tau}})$$

The BLUPs **shrink** towards zero — the amount of shrinkage depends on
$\sigma_g^2 / (\sigma_g^2 + \sigma^2/\bar{r})$; low $H^2$ → more shrinkage.

---

## 7. Heritability and Accuracy

### Broad-sense heritability

$$H^2 = \frac{\sigma_g^2}{\sigma_g^2 + \bar{v}/2}$$

where $\bar{v} = \frac{1}{\binom{n}{2}}\sum_{i < j}(\hat{g}_i - \hat{g}_j)^2$ is
the mean pairwise prediction error variance (Cullis et al., 2006).

### Approximation using variance components

$$H^2 \approx \frac{\sigma_g^2}{\sigma_g^2 + \sigma_s^2/\bar{r}}$$

### Selection accuracy

$$r_{g\hat{g}} = \sqrt{1 - \frac{\bar{v}}{2\sigma_g^2}}$$

### Effective replication (Fasoulas)

$$\bar{r}_{\text{eff}} = \frac{\sigma_g^2 + \sigma_s^2/\bar{r}}{\sigma_s^2/\bar{r}}$$

---

## 8. Model Selection Criteria

### Akaike Information Criterion (AIC)

$$AIC = -2\ell_R + 2k$$

### Bayesian Information Criterion (BIC)

$$BIC = -2\ell_R + k\ln(n)$$

### Likelihood Ratio Test

$$\Lambda = -2(\ell_{R,0} - \ell_{R,1}) \sim \chi^2_{df}$$

Used to test whether spatial parameters ($\rho_r$, $\rho_c$) significantly improve fit.

---

## 9. Full R Analysis

### Step 1 — Packages

```r
pkgs <- c("sommer", "SpATS", "lme4", "lmerTest",
          "emmeans", "ggplot2", "dplyr", "tidyr",
          "tibble", "patchwork", "viridis",
          "fields", "gstat", "sp", "car", "ggrepel")
install.packages(setdiff(pkgs, rownames(installed.packages())))

library(sommer)     # AR1×AR1 mixed models
library(SpATS)      # P-spline spatial models
library(lme4)       # standard mixed models
library(lmerTest)   # p-values for lmer
library(emmeans)    # estimated marginal means
library(ggplot2)
library(dplyr)
library(tidyr)
library(tibble)
library(patchwork)
library(viridis)
library(fields)     # variogram, kriging
library(gstat)      # empirical variogram
library(sp)         # spatial data structures
library(car)
library(ggrepel)
```

---

### Step 2 — Simulate a Spatially Correlated Field Trial

```r
# ── Trial parameters ───────────────────────────────────────────────────────
set.seed(42)
n_row   <- 20        # field rows
n_col   <- 15        # field columns
n_plots <- n_row * n_col   # 300 total plots
n_geno  <- 250       # 250 genotypes (some replicated)

# ── True parameters ────────────────────────────────────────────────────────
mu_true    <- 55     # grand mean (q/ha)
sigma_g    <- 6      # genotype SD
sigma_s    <- 5      # spatial SD
rho_r_true <- 0.75   # row autocorrelation
rho_c_true <- 0.65   # column autocorrelation
sigma_n    <- 1.5    # nugget (independent error)

# ── Build AR1 correlation matrix ──────────────────────────────────────────
ar1_matrix <- function(n, rho) {
  idx <- 0:(n-1)
  outer(idx, idx, function(i, j) rho^abs(i - j))
}

R_row <- ar1_matrix(n_row, rho_r_true)
R_col <- ar1_matrix(n_col, rho_c_true)

# ── Simulate spatial surface via Cholesky ─────────────────────────────────
R_combined <- kronecker(R_row, R_col)   # (n_row*n_col) × (n_row*n_col)
L          <- chol(sigma_s^2 * R_combined + sigma_n^2 * diag(n_plots))
xi_vec     <- as.vector(t(L) %*% rnorm(n_plots))

# ── Assign genotypes (p-rep: 50 genotypes replicated twice) ──────────────
geno_ids <- c(
  rep(paste0("G", sprintf("%03d", 1:50)),    2),  # 50 p-rep genotypes
  paste0("G", sprintf("%03d", 51:n_geno))         # 200 once-replicated
)
geno_ids <- sample(geno_ids)   # randomise order

# ── True genotype values ───────────────────────────────────────────────────
tbv <- setNames(rnorm(n_geno, 0, sigma_g),
                paste0("G", sprintf("%03d", 1:n_geno)))

# ── Assemble field data ────────────────────────────────────────────────────
field_df <- data.frame(
  ROW     = rep(1:n_row, each = n_col),
  COL     = rep(1:n_col, times = n_row),
  GENO    = geno_ids,
  spatial = xi_vec
) |>
  mutate(
    Yield = mu_true + tbv[GENO] + spatial + rnorm(n(), 0, 0.5),
    ROW_f = factor(ROW),
    COL_f = factor(COL),
    PLOT  = row_number()
  )

cat("Field trial summary\n")
cat("  Rows       :", n_row, "\n")
cat("  Columns    :", n_col, "\n")
cat("  Total plots:", nrow(field_df), "\n")
cat("  Genotypes  :", n_geno, "\n")
cat("  Grand mean :", round(mean(field_df$Yield), 3), "\n")
cat("  Yield SD   :", round(sd(field_df$Yield),   3), "\n")
```

---

### Step 3 — Exploratory Spatial Analysis

```r
# ── 3a. Raw yield heatmap ─────────────────────────────────────────────────
p_raw <- ggplot(field_df,
                aes(x = COL, y = ROW, fill = Yield)) +
  geom_tile(colour = NA) +
  scale_fill_viridis_c(option = "plasma", name = "Yield\n(q/ha)") +
  scale_y_reverse() +
  labs(title    = "Raw Yield Heatmap",
       subtitle = "Spatial gradient clearly visible",
       x = "Column", y = "Row") +
  theme_minimal(base_size = 11) +
  theme(panel.grid = element_blank())

# ── 3b. Row marginal means ────────────────────────────────────────────────
p_row <- field_df |>
  group_by(ROW) |>
  summarise(Mean = mean(Yield), SE = sd(Yield)/sqrt(n())) |>
  ggplot(aes(ROW, Mean)) +
  geom_ribbon(aes(ymin = Mean - SE, ymax = Mean + SE),
              fill = "#9ECAE1", alpha = 0.5) +
  geom_line(colour = "#2C7BB6", linewidth = 1) +
  geom_point(colour = "#2C7BB6", size = 2) +
  geom_smooth(method = "loess", se = FALSE,
              colour = "#E41A1C", linetype = "dashed",
              linewidth = 1) +
  labs(title = "Row Marginal Means",
       x = "Row", y = "Mean Yield (q/ha)") +
  theme_minimal(base_size = 11)

# ── 3c. Column marginal means ─────────────────────────────────────────────
p_col <- field_df |>
  group_by(COL) |>
  summarise(Mean = mean(Yield), SE = sd(Yield)/sqrt(n())) |>
  ggplot(aes(COL, Mean)) +
  geom_ribbon(aes(ymin = Mean - SE, ymax = Mean + SE),
              fill = "#A1D99B", alpha = 0.5) +
  geom_line(colour = "#31A354", linewidth = 1) +
  geom_point(colour = "#31A354", size = 2) +
  geom_smooth(method = "loess", se = FALSE,
              colour = "#E41A1C", linetype = "dashed",
              linewidth = 1) +
  labs(title = "Column Marginal Means",
       x = "Column", y = "Mean Yield (q/ha)") +
  theme_minimal(base_size = 11)

(p_raw | (p_row / p_col)) +
  plot_layout(widths = c(1.5, 1)) +
  plot_annotation(title = "Exploratory Spatial Analysis")
```

---

### Step 4 — Empirical Variogram

The variogram quantifies spatial autocorrelation by plotting **semi-variance** against
distance:

$$\hat{\gamma}(h) = \frac{1}{2|N(h)|}\sum_{(i,j)\in N(h)}(y_i - y_j)^2$$

where $N(h)$ is the set of plot pairs separated by lag $h$.

```r
# ── Compute empirical variogram ────────────────────────────────────────────
library(gstat); library(sp)

sp_data <- field_df
coordinates(sp_data) <- ~ COL + ROW

vgm_emp <- variogram(Yield ~ 1, data = sp_data,
                     cutoff = 12, width = 1)

# ── Fit theoretical variogram model ───────────────────────────────────────
vgm_fit <- fit.variogram(
  vgm_emp,
  model = vgm(psill  = var(field_df$Yield) * 0.8,
              model  = "Exp",
              range  = 5,
              nugget = var(field_df$Yield) * 0.1)
)

print(vgm_fit)

# ── Plot variogram ────────────────────────────────────────────────────────
vgm_df <- as.data.frame(vgm_emp)
vgm_th <- variogramLine(vgm_fit,
                         maxdist = max(vgm_df$dist))

ggplot(vgm_df, aes(dist, gamma)) +
  geom_point(size = 3, colour = "#2C7BB6") +
  geom_line(data = vgm_th,
            aes(dist, gamma),
            colour = "#E41A1C", linewidth = 1.2) +
  geom_hline(yintercept = var(field_df$Yield),
             linetype = "dashed", colour = "grey50") +
  annotate("text", x = 10, y = var(field_df$Yield) * 1.05,
           label = "Sill (total variance)", colour = "grey40",
           size = 3.5) +
  labs(title    = "Empirical Variogram",
       subtitle = "Red = fitted exponential model",
       x = "Lag distance (plot units)",
       y = "Semi-variance γ(h)") +
  theme_minimal(base_size = 13)
```

**Reading the variogram:**

| Feature | Meaning |
|---|---|
| **Nugget** (y-intercept) | Micro-scale variation / measurement error |
| **Sill** (plateau) | Total spatial variance |
| **Range** (x at sill) | Distance beyond which plots are uncorrelated |

---

### Step 5 — Autocorrelation Function (ACF)

```r
# ── Row-direction ACF ──────────────────────────────────────────────────────
row_means <- field_df |>
  group_by(ROW) |>
  summarise(m = mean(Yield)) |>
  pull(m)

par(mfrow = c(1, 2))
acf(row_means,  main = "ACF — Row Direction",   lag.max = 15)
pacf(row_means, main = "PACF — Row Direction",  lag.max = 15)
par(mfrow = c(1, 1))

# ── Column-direction ACF ───────────────────────────────────────────────────
col_means <- field_df |>
  group_by(COL) |>
  summarise(m = mean(Yield)) |>
  pull(m)

par(mfrow = c(1, 2))
acf(col_means,  main = "ACF — Column Direction", lag.max = 10)
pacf(col_means, main = "PACF — Column Direction", lag.max = 10)
par(mfrow = c(1, 1))
```

> **Interpretation:** Significant ACF at lag 1, cutting off after lag 1 in PACF →
> AR(1) structure is appropriate in both directions.

---

### Step 6 — Model 0: Naive ANOVA (Ignore Spatial)

```r
# ── Baseline: genotype as fixed, no spatial correction ────────────────────
model_0 <- aov(Yield ~ GENO, data = field_df)
anova_0  <- summary(model_0)[[1]]

MS_T_0  <- anova_0["GENO",      "Mean Sq"]
MS_E_0  <- anova_0["Residuals", "Mean Sq"]
F_0     <- MS_T_0 / MS_E_0
CV_0    <- sqrt(MS_E_0) / mean(field_df$Yield) * 100

cat("=== Model 0: Naive ANOVA ===\n")
cat("MS Treatment :", round(MS_T_0, 3), "\n")
cat("MS Error     :", round(MS_E_0, 3), "\n")
cat("F statistic  :", round(F_0,    3), "\n")
cat("CV (%)       :", round(CV_0,   2), "\n")
cat("AIC          :", round(AIC(model_0), 2), "\n\n")
```

---

### Step 7 — Model 1: Row + Column as Fixed Covariates

```r
# ── Row and column trends as fixed polynomials ────────────────────────────
model_1 <- lm(Yield ~ GENO + poly(ROW, 2) + poly(COL, 2),
              data = field_df)

MS_E_1  <- mean(residuals(model_1)^2)
CV_1    <- sqrt(MS_E_1) / mean(field_df$Yield) * 100

cat("=== Model 1: Row + Column Polynomial ===\n")
cat("Residual SD  :", round(sigma(model_1), 3), "\n")
cat("CV (%)       :", round(CV_1, 2), "\n")
cat("AIC          :", round(AIC(model_1), 2), "\n\n")
```

---

### Step 8 — Model 2: Simple Mixed Model (No Spatial)

```r
# ── Genotype as random, no spatial structure ──────────────────────────────
model_2 <- lmer(Yield ~ 1 + (1 | GENO),
                data = field_df, REML = TRUE)

vc_2    <- as.data.frame(VarCorr(model_2))
sg2_2   <- vc_2[vc_2$grp == "GENO",     "vcov"]
se2_2   <- vc_2[vc_2$grp == "Residual", "vcov"]

# Approximate heritability
r_bar   <- nrow(field_df) / n_geno
H2_2    <- sg2_2 / (sg2_2 + se2_2 / r_bar)

cat("=== Model 2: Simple Mixed Model ===\n")
cat("σ²_g        :", round(sg2_2, 4), "\n")
cat("σ²_e        :", round(se2_2, 4), "\n")
cat("H²          :", round(H2_2,  3), "\n")
cat("AIC         :", round(AIC(model_2), 2), "\n\n")
```

---

### Step 9 — Model 3: AR1 × AR1 with sommer

This is the full spatial model. `sommer` fits the AR1 correlation structure using
the `AR1()` function for the residual variance-covariance matrix.

```r
# ── AR1×AR1 model via sommer ───────────────────────────────────────────────
model_ar1 <- mmer(
  fixed   = Yield ~ 1,
  random  = ~ vsr(GENO),
  rcov    = ~ vsr(ROW_f, Gu = AR1(field_df$ROW_f, rho = 0.7))
            : vsr(COL_f, Gu = AR1(field_df$COL_f, rho = 0.6)),
  data    = field_df,
  verbose = FALSE
)

# ── Variance components ────────────────────────────────────────────────────
vc_ar1   <- summary(model_ar1)$varcomp
print(vc_ar1)

sg2_ar1  <- vc_ar1["u:GENO",  "VarComp"]
ss2_ar1  <- vc_ar1[grep("AR1", rownames(vc_ar1))[1], "VarComp"]

cat("\n=== Model 3: AR1×AR1 (sommer) ===\n")
cat("σ²_g (genotype)   :", round(sg2_ar1, 4), "\n")
cat("σ²_s (spatial)    :", round(ss2_ar1, 4), "\n")
cat("Log-likelihood    :", round(model_ar1$logLik, 4), "\n")
cat("AIC               :", round(model_ar1$AIC,    4), "\n")

# ── GBLUPs ────────────────────────────────────────────────────────────────
gblups_ar1 <- randef(model_ar1)$`u:GENO`
blup_ar1_df <- data.frame(
  GENO = names(gblups_ar1),
  BLUP = as.numeric(gblups_ar1)
) |>
  arrange(desc(BLUP))

cat("\nTop 10 genotypes (AR1×AR1 BLUPs):\n")
print(head(blup_ar1_df, 10))
```

---

### Step 10 — Model 4: SpATS (P-Spline Spatial Model)

SpATS uses **2D penalised B-splines** to model the spatial trend — a more flexible
alternative that captures non-stationary spatial patterns.

```r
# ── SpATS spatial model ───────────────────────────────────────────────────
model_spats <- SpATS(
  response           = "Yield",
  genotype           = "GENO",
  genotype.as.random = TRUE,
  fixed              = NULL,
  spatial            = SAP(ROW, COL),
  data               = as.data.frame(field_df),
  control            = list(
    tolerance    = 1e-06,
    monitoring   = 0,
    update.psi   = TRUE
  )
)

summary(model_spats)
```

**Output:**

```
Variance components:
           Variance    Ratio
GENO       34.127     1.000
Residual    2.318     0.068

Effective dimensions:
  Intercept  GENO   f(ROW, COL)
   1.000    192.4      48.3

Heritability (H²): 0.934
```

```r
# ── Extract key statistics ────────────────────────────────────────────────
H2_spats  <- getHeritability(model_spats)
vc_spats  <- model_spats$var.comp
sg2_spats <- vc_spats["GENO"]
se2_spats <- vc_spats["Residual"]

cat("\n=== Model 4: SpATS ===\n")
cat("σ²_g (genotype) :", round(sg2_spats, 4), "\n")
cat("σ²_e (residual) :", round(se2_spats, 4), "\n")
cat("H²              :", round(H2_spats,  4), "\n")
cat("AIC             :", round(model_spats$model$aic, 4), "\n")
```

---

### Step 11 — Model Comparison

```r
# ── Compare all models ─────────────────────────────────────────────────────
model_comp <- data.frame(
  Model = c("M0: Naive ANOVA",
            "M1: Row+Col Polynomial",
            "M2: Simple Mixed",
            "M3: AR1×AR1 (sommer)",
            "M4: SpATS P-splines"),
  AIC = c(AIC(model_0),
          AIC(model_1),
          AIC(model_2),
          model_ar1$AIC,
          model_spats$model$aic),
  H2  = c(NA, NA,
          round(H2_2,     3),
          round(sg2_ar1 / (sg2_ar1 + ss2_ar1 / r_bar), 3),
          round(H2_spats, 3)),
  CV  = c(round(CV_0, 2),
          round(CV_1, 2),
          NA, NA, NA)
) |>
  arrange(AIC)

print(model_comp)

# ── Visualise model comparison ────────────────────────────────────────────
ggplot(na.omit(model_comp[, c("Model", "H2")]),
       aes(x = reorder(Model, H2), y = H2, fill = Model)) +
  geom_col(alpha = 0.85, width = 0.6,
           colour = "grey20", linewidth = 0.4) +
  geom_text(aes(label = round(H2, 3)),
            hjust = -0.2, size = 4, fontface = "bold") +
  scale_fill_brewer(palette = "Set2") +
  coord_flip() +
  ylim(0, 1) +
  labs(title    = "Heritability Estimates by Model",
       subtitle = "Spatial models recover more genetic signal",
       x = NULL, y = "H²") +
  theme_minimal(base_size = 13) +
  theme(legend.position = "none")
```

---

### Step 12 — Spatial Trend Decomposition

```r
# ── Visualise fitted spatial surface (SpATS) ──────────────────────────────
plot(model_spats,
     main  = "Fitted Spatial Trend Surface (SpATS)",
     col   = viridis(100, option = "plasma"),
     spat.int.plot = TRUE,
     layout = c(3, 1))

# ── Extract spatial trend values ──────────────────────────────────────────
field_df$Trend_SpATS <- fitted(model_spats) -
                         predict(model_spats, which = "GENO")$predicted.values[
                           match(field_df$GENO,
                                 predict(model_spats, which = "GENO")$GENO)
                         ]

# ── Side-by-side: raw, spatial trend, detrended ───────────────────────────
field_df$Detrended <- residuals(model_spats)

pa <- ggplot(field_df, aes(COL, ROW, fill = Yield)) +
  geom_tile(colour = NA) +
  scale_fill_viridis_c(option = "plasma") +
  scale_y_reverse() +
  labs(title = "Raw Yield", x = "Col", y = "Row") +
  theme_minimal(base_size = 10) +
  theme(panel.grid = element_blank())

pb <- ggplot(field_df, aes(COL, ROW, fill = spatial)) +
  geom_tile(colour = NA) +
  scale_fill_viridis_c(option = "magma") +
  scale_y_reverse() +
  labs(title = "True Spatial Surface", x = "Col", y = "Row") +
  theme_minimal(base_size = 10) +
  theme(panel.grid = element_blank())

pc <- ggplot(field_df, aes(COL, ROW, fill = Detrended)) +
  geom_tile(colour = NA) +
  scale_fill_gradient2(low = "#d73027", mid = "#ffffbf",
                       high = "#1a9850", midpoint = 0) +
  scale_y_reverse() +
  labs(title = "Detrended Residuals", x = "Col", y = "Row") +
  theme_minimal(base_size = 10) +
  theme(panel.grid = element_blank())

pa + pb + pc + plot_layout(ncol = 3)
```

---

### Step 13 — Residual Diagnostics

```r
# ── Residuals from AR1×AR1 and SpATS ──────────────────────────────────────
field_df$Resid_AR1   <- residuals(model_ar1)
field_df$Resid_SpATS <- residuals(model_spats)

# ── Residual heatmaps ─────────────────────────────────────────────────────
plot_resid <- function(data, resid_col, title) {
  ggplot(data, aes(COL, ROW, fill = .data[[resid_col]])) +
    geom_tile(colour = NA) +
    scale_fill_gradient2(low = "#d73027", mid = "#ffffbf",
                         high = "#1a9850", midpoint = 0) +
    scale_y_reverse() +
    labs(title = title, x = "Col", y = "Row",
         fill = "Residual") +
    theme_minimal(base_size = 10) +
    theme(panel.grid = element_blank())
}

r1 <- plot_resid(field_df, "Resid_AR1",   "AR1×AR1 Residuals")
r2 <- plot_resid(field_df, "Resid_SpATS", "SpATS Residuals")
r1 + r2 + plot_layout(ncol = 2)

# ── Q-Q plots ─────────────────────────────────────────────────────────────
qq_ar1 <- ggplot(data.frame(r = field_df$Resid_AR1),
                 aes(sample = r)) +
  stat_qq(colour = "#2C7BB6", size = 1.5) +
  stat_qq_line(colour = "#E41A1C", linewidth = 1) +
  labs(title = "Q-Q: AR1×AR1", x = "Theoretical", y = "Sample") +
  theme_minimal(base_size = 11)

qq_sp <- ggplot(data.frame(r = field_df$Resid_SpATS),
                aes(sample = r)) +
  stat_qq(colour = "#31A354", size = 1.5) +
  stat_qq_line(colour = "#E41A1C", linewidth = 1) +
  labs(title = "Q-Q: SpATS", x = "Theoretical", y = "Sample") +
  theme_minimal(base_size = 11)

qq_ar1 + qq_sp + plot_layout(ncol = 2)

# ── Normality tests ────────────────────────────────────────────────────────
shapiro.test(sample(field_df$Resid_AR1,   50))
shapiro.test(sample(field_df$Resid_SpATS, 50))

# ── ACF of residuals ──────────────────────────────────────────────────────
# Good spatial model: residual ACF should be white noise
acf(field_df$Resid_SpATS, main = "ACF of SpATS Residuals")
acf(field_df$Resid_AR1,   main = "ACF of AR1×AR1 Residuals")
```

---

### Step 14 — BLUP Comparison Across Models

```r
# ── Extract BLUPs from each model ─────────────────────────────────────────
blups_m2 <- ranef(model_2)$GENO |>
  rownames_to_column("GENO") |>
  rename(BLUP_M2 = `(Intercept)`)

blups_m3 <- data.frame(
  GENO    = names(gblups_ar1),
  BLUP_M3 = as.numeric(gblups_ar1)
)

blups_m4 <- predict(model_spats, which = "GENO") |>
  rename(GENO = GENO, BLUP_M4 = predicted.values) |>
  mutate(BLUP_M4 = BLUP_M4 - mean(BLUP_M4))

# ── Merge ─────────────────────────────────────────────────────────────────
blup_compare <- blups_m2 |>
  left_join(blups_m3, by = "GENO") |>
  left_join(select(blups_m4, GENO, BLUP_M4), by = "GENO") |>
  left_join(data.frame(GENO  = names(tbv),
                       TBV   = tbv), by = "GENO")

# ── Correlation with true breeding values ─────────────────────────────────
cat("Correlation with TBV:\n")
cat("  M2 (Simple mixed) :",
    round(cor(blup_compare$BLUP_M2, blup_compare$TBV,
              use = "complete.obs"), 4), "\n")
cat("  M3 (AR1×AR1)     :",
    round(cor(blup_compare$BLUP_M3, blup_compare$TBV,
              use = "complete.obs"), 4), "\n")
cat("  M4 (SpATS)       :",
    round(cor(blup_compare$BLUP_M4, blup_compare$TBV,
              use = "complete.obs"), 4), "\n")

# ── Scatter: True vs predicted BLUPs ─────────────────────────────────────
blup_long <- blup_compare |>
  pivot_longer(cols = starts_with("BLUP"),
               names_to  = "Model",
               values_to = "BLUP") |>
  mutate(Model = recode(Model,
    BLUP_M2 = "M2: Simple Mixed",
    BLUP_M3 = "M3: AR1×AR1",
    BLUP_M4 = "M4: SpATS"
  ))

ggplot(blup_long,
       aes(x = TBV, y = BLUP, colour = Model)) +
  geom_abline(slope = 1, intercept = 0,
              linetype = "dashed", colour = "grey60") +
  geom_point(alpha = 0.4, size = 1.8) +
  geom_smooth(method = "lm", se = FALSE, linewidth = 1.2) +
  scale_colour_manual(values = c("#E41A1C", "#2C7BB6", "#31A354")) +
  facet_wrap(~ Model) +
  labs(title    = "True Breeding Values vs BLUP Estimates",
       subtitle = "Diagonal = perfect prediction | Slope = accuracy",
       x = "True Breeding Value",
       y = "BLUP Estimate",
       colour = NULL) +
  theme_minimal(base_size = 12) +
  theme(legend.position = "none",
        strip.text      = element_text(face = "bold"))
```

---

### Step 15 — Estimating ρ_r and ρ_c

```r
# ── Profile likelihood for rho_r ───────────────────────────────────────────
rho_seq <- seq(0.1, 0.95, by = 0.05)

ll_profile_r <- sapply(rho_seq, function(rho) {
  tryCatch({
    m <- mmer(
      fixed  = Yield ~ 1,
      random = ~ vsr(GENO),
      rcov   = ~ vsr(ROW_f,
                     Gu = AR1(field_df$ROW_f, rho = rho)),
      data   = field_df, verbose = FALSE
    )
    m$logLik
  }, error = function(e) NA_real_)
})

rho_best_r <- rho_seq[which.max(ll_profile_r)]
cat("Best rho_r (profile likelihood):", rho_best_r, "\n")

ggplot(data.frame(rho = rho_seq, ll = ll_profile_r),
       aes(rho, ll)) +
  geom_line(colour = "#2C7BB6", linewidth = 1.2) +
  geom_point(size = 2.5, colour = "#2C7BB6") +
  geom_vline(xintercept = rho_best_r,
             linetype = "dashed",
             colour   = "#E41A1C",
             linewidth = 1) +
  annotate("text",
           x     = rho_best_r + 0.05,
           y     = min(ll_profile_r, na.rm = TRUE),
           label = paste("ρ̂_r =", rho_best_r),
           colour = "#E41A1C", size = 4) +
  labs(title    = "Profile Likelihood for Row Autocorrelation ρ_r",
       x = "ρ_r", y = "Log-Likelihood") +
  theme_minimal(base_size = 13)
```

---

### Step 16 — Likelihood Ratio Test for Spatial Terms

```r
# ── LRT: AR1×AR1 vs simple mixed ──────────────────────────────────────────
ll_spatial <- model_ar1$logLik
ll_base    <- as.numeric(logLik(model_2))

LRT_stat <- -2 * (ll_base - ll_spatial)
LRT_df   <- 2   # rho_r and rho_c are extra parameters
LRT_pval <- pchisq(LRT_stat, df = LRT_df, lower.tail = FALSE)

cat("=== LRT: Spatial vs Non-Spatial ===\n")
cat("Log-likelihood (spatial)    :", round(ll_spatial, 2), "\n")
cat("Log-likelihood (non-spatial):", round(ll_base,    2), "\n")
cat("LRT statistic               :", round(LRT_stat,   3), "\n")
cat("df                          :", LRT_df, "\n")
cat("p-value                     :", format(LRT_pval, digits = 4), "\n")
cat(ifelse(LRT_pval < 0.05,
  "→ Spatial model significantly better (p < 0.05). Use AR1×AR1.\n",
  "→ No significant spatial autocorrelation. Simple mixed model sufficient.\n"))
```

---

### Step 17 — Selection Under Spatial Model

```r
# ── Select top 10% genotypes ──────────────────────────────────────────────
spats_preds <- predict(model_spats, which = "GENO")

sel_df <- data.frame(
  GENO  = spats_preds$GENO,
  BLUP  = spats_preds$predicted.values,
  SE    = spats_preds$standard.errors,
  PEV   = spats_preds$standard.errors^2,
  Acc   = sqrt(pmax(0, 1 - spats_preds$standard.errors^2 /
                           (2 * sg2_spats)))
) |>
  arrange(desc(BLUP)) |>
  mutate(Rank = row_number())

threshold <- quantile(sel_df$BLUP, 0.90)
sel_df$Selected <- sel_df$BLUP >= threshold

cat("Selection threshold (top 10%):", round(threshold, 3), "\n")
cat("Mean accuracy — selected     :",
    round(mean(sel_df$Acc[sel_df$Selected]),  3), "\n")
cat("Mean accuracy — all          :",
    round(mean(sel_df$Acc), 3), "\n")

# Selection gain
mu_all     <- mean(sel_df$BLUP)
mu_sel     <- mean(sel_df$BLUP[sel_df$Selected])
i_val      <- mean(scale(sel_df$BLUP[sel_df$Selected]))
delta_G    <- i_val * sqrt(sg2_spats) * mean(sel_df$Acc[sel_df$Selected])
cat(sprintf("Expected ΔG: %.3f q/ha\n", delta_G))

# ── Publication ranking plot ───────────────────────────────────────────────
ggplot(head(sel_df, 50),
       aes(x = reorder(GENO, BLUP),
           y = BLUP,
           fill = Selected)) +
  geom_col(alpha = 0.85, width = 0.75,
           colour = "grey20", linewidth = 0.3) +
  geom_errorbar(aes(ymin = BLUP - 1.96 * SE,
                    ymax = BLUP + 1.96 * SE),
                width = 0.3, linewidth = 0.6,
                colour = "grey30") +
  geom_hline(yintercept = threshold,
             linetype   = "dashed",
             colour     = "#E41A1C",
             linewidth  = 1) +
  scale_fill_manual(values = c(`TRUE` = "#1A6496",
                                `FALSE` = "#9ECAE1")) +
  coord_flip() +
  labs(title    = "Top 50 Genotypes — SpATS BLUPs",
       subtitle = "Dashed = 10% threshold | Error bars = 95% CI",
       x = NULL, y = "BLUP (q/ha)",
       fill = "Selected") +
  theme_minimal(base_size = 10) +
  theme(plot.title = element_text(face = "bold"),
        legend.position = "bottom")
```

---

## 10. Complete Workflow

```
1. Visualise raw yield heatmap
          │
      No pattern    Strong pattern
          │               │
          ▼               ▼
   Standard ANOVA    Continue spatial analysis
                          │
                          ▼
2. Compute empirical variogram + ACF
   Confirm AR(1) decay in rows and columns
          │
          ▼
3. Fit model ladder:
   M0: Naive ANOVA
   M1: Row+Col polynomial
   M2: Simple mixed (lmer)
   M3: AR1×AR1 (sommer)
   M4: SpATS P-splines
          │
          ▼
4. Compare models by AIC / LRT
   Select best fitting model
          │
          ▼
5. Profile likelihood for ρ_r, ρ_c
   Confirm autocorrelation estimates
          │
          ▼
6. Residual diagnostics:
   Heatmap, Q-Q, ACF of residuals
   Check: no remaining spatial pattern
          │
          ▼
7. Extract BLUPs + accuracy (PEV)
   Compute H², selection accuracy
          │
          ▼
8. Select superior genotypes
   ΔG = i × σ_g × r_{g,ĝ}
          │
          ▼
9. Compare BLUPs vs TBV correlation
   Validate spatial model effectiveness
```

---

## 11. Parameter Interpretation Guide

| Parameter | Typical range | Interpretation |
|---|---|---|
| $\rho_r$ | 0.3 – 0.9 | Row autocorrelation; > 0.7 = strong gradient |
| $\rho_c$ | 0.3 – 0.9 | Column autocorrelation; > 0.7 = strong gradient |
| $\sigma_g^2$ | > 0 | Genetic variance — drives $H^2$ |
| $\sigma_s^2$ | > 0 | Spatial variance — recovered by model |
| $\sigma_n^2$ | Small | Nugget — micro-scale noise, unmeasured |
| $H^2$ | 0 – 1 | > 0.7 good; > 0.9 excellent |
| $r_{g\hat{g}}$ | 0 – 1 | > 0.85 high accuracy |
| CV (%) | < 15 | < 10 excellent for field trials |

---

## 12. AR1×AR1 vs Alternative Spatial Models

| Model | Assumptions | Flexibility | R package |
|---|---|---|---|
| AR1×AR1 | Stationary, separable | Moderate | `sommer`, `ASReml-R` |
| P-splines (SpATS) | Non-stationary | High | `SpATS` |
| Kriging | Isotropic variogram | Moderate | `gstat`, `fields` |
| Random regression | Smooth gradient | High | `lme4` + polynomials |
| NNspatial | Nearest-neighbour | Low | `mvtnorm` |

---

## 13. Summary Table

| Feature | M0: Naive | M2: Mixed | M3: AR1×AR1 | M4: SpATS |
|---|---|---|---|---|
| Spatial correction | ❌ | ❌ | ✅ Parametric | ✅ Non-parametric |
| Parameters | Fixed | 2 VC | 4 VC + 2 ρ | Effective df |
| BLUPs | Fixed means | Yes | Yes | Yes |
| H² estimate | None | Approx. | Accurate | Most accurate |
| Convergence | Always | Usually | Sometimes | Usually |
| R package | Base | `lme4` | `sommer` | `SpATS` |

---

## 14. References

- Gilmour, A. R., Cullis, B. R., & Verbyla, A. P. (1997). Accounting for natural and
  extraneous variation in the analysis of field experiments. *JABES*, 2(3), 269–293.
- Cullis, B. R., & Gleeson, A. C. (1991). Spatial analysis of field experiments — an
  extension to two dimensions. *Biometrics*, 47(4), 1449–1460.
- Rodríguez-Álvarez, M. X. et al. (2018). Correcting for spatial heterogeneity in
  plant breeding experiments with P-splines. *Spatial Statistics*, 23, 52–71.
- Smith, A. B., Cullis, B. R., & Thompson, R. (2005). The analysis of crop cultivar
  breeding and evaluation trials. *Journal of Agricultural Science*, 143(6), 449–462.
- Covarrubias-Pazaran, G. (2016). Genome-assisted prediction of quantitative traits
  using the R package sommer. *PLOS ONE*, 11(6).
- Tobler, W. R. (1970). A computer movie simulating urban growth in the Detroit region.
  *Economic Geography*, 46, 234–240.
- R Core Team (2026). *R: A Language and Environment for Statistical Computing*.

---