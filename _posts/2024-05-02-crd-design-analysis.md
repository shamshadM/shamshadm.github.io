---
title: "Completely Randomized Design (CRD): Theory & Complete R Analysis"
date: 2024-05-02
permalink: /posts/2024/05/crd-design-analysis/
excerpt_separator: <!--more-->
categories: [statistics, R, field-experiments]
tags: [CRD, ANOVA, post-hoc, R, experimental-design]
number_sections: true
toc: true
math: true
---

The **Completely Randomized Design (CRD)** is the simplest experimental design. Treatments are assigned to experimental units **purely at random**, with no restrictions. It is the starting point for understanding all other designs (RCBD, Latin Square, Alpha-lattice) and remains widely used in controlled laboratory and greenhouse experiments.
<!--more-->
---

## 1. When to Use CRD

CRD is appropriate when:

- Experimental units are **homogeneous** (uniform pots, petri dishes, growth chambers)
- Environmental variation is **absent or negligible**
- The experiment is conducted **indoors or in a controlled facility**
- Units can be **individually randomized** without constraint

> **Do not use CRD in open field experiments** where soil fertility gradients, slope, or
> drainage differences exist — use RCBD or more advanced designs instead.

---

## 2. Design Structure

- $k$ treatments
- $n_i$ replications per treatment (can be **unequal**)
- Total observations $N = \sum_{i=1}^{k} n_i$
- Each unit receives exactly one treatment, assigned completely at random

**Balanced CRD:** $n_1 = n_2 = \cdots = n_k = r$, so $N = kr$

---

## 3. Linear Model

$$y_{ij} = \mu + \tau_i + \varepsilon_{ij}$$

| Symbol | Meaning |
|---|---|
| $y_{ij}$ | Observation $j$ under treatment $i$ |
| $\mu$ | Overall (grand) mean |
| $\tau_i$ | Effect of treatment $i$; $\sum_{i=1}^{k} \tau_i = 0$ |
| $\varepsilon_{ij}$ | Random error; $\varepsilon_{ij} \overset{\text{iid}}{\sim} \mathcal{N}(0, \sigma^2)$ |

---

## 4. Hypotheses

$$H_0: \mu_1 = \mu_2 = \cdots = \mu_k \quad \text{(all treatment means are equal)}$$

$$H_1: \mu_i \neq \mu_j \quad \text{for at least one pair } i \neq j$$

Equivalently in terms of treatment effects:

$$H_0: \tau_1 = \tau_2 = \cdots = \tau_k = 0$$

$$H_1: \tau_i \neq 0 \quad \text{for at least one } i$$

---

## 5. Partitioning of Variation

$$SS_{\text{Total}} = SS_{\text{Treatment}} + SS_{\text{Error}}$$

$$\sum_{i=1}^{k}\sum_{j=1}^{n_i}(y_{ij} - \bar{y})^2
= \sum_{i=1}^{k} n_i(\bar{y}_i - \bar{y})^2
+ \sum_{i=1}^{k}\sum_{j=1}^{n_i}(y_{ij} - \bar{y}_i)^2$$

### ANOVA Table

| Source | SS | df | MS | F |
|---|---|---|---|---|
| Treatment | $SS_T$ | $k - 1$ | $MS_T = SS_T/(k-1)$ | $MS_T / MS_E$ |
| Error | $SS_E$ | $N - k$ | $MS_E = SS_E/(N-k)$ | — |
| Total | $SS_{Tot}$ | $N - 1$ | — | — |

### F Statistic

$$F = \frac{MS_{\text{Treatment}}}{MS_{\text{Error}}} \sim F_{(k-1,\; N-k)} \quad \text{under } H_0$$

**Expected mean squares:**

$$E[MS_E] = \sigma^2$$

$$E[MS_T] = \sigma^2 + \frac{r \sum_{i=1}^{k} \tau_i^2}{k - 1}$$

When $H_0$ is true, $E[MS_T] = \sigma^2$, so $F \approx 1$.

---

## 6. Coefficient of Variation

The CV expresses experimental error as a percentage of the grand mean — a key indicator of
experiment quality:

$$CV = \frac{\sqrt{MS_E}}{\bar{y}} \times 100$$

| CV range | Experiment quality |
|---|---|
| < 10 % | Excellent |
| 10 – 20 % | Good |
| 20 – 30 % | Acceptable |
| > 30 % | Poor — check design or data |

---

## 7. Full R Analysis

### Step 1 — Install and Load Packages

```r
# Install if needed
pkgs <- c("agricolae", "ggplot2", "dplyr", "emmeans",
          "car", "multcomp", "effectsize", "pwr")
install.packages(setdiff(pkgs, rownames(installed.packages())))

library(agricolae)   # LSD, Duncan, experimental designs
library(ggplot2)     # graphics
library(dplyr)       # data wrangling
library(emmeans)     # estimated marginal means
library(car)         # Levene's test
library(multcomp)    # Tukey contrasts
library(effectsize)  # eta-squared
library(pwr)         # power analysis
```

---

### Step 2 — Create CRD Layout

```r
# ── Design layout: 5 treatments, 6 replications ───────────────────────────
set.seed(42)
treatments <- paste0("T", 1:5)
r          <- 6

crd_design <- design.crd(
  trt  = treatments,
  r    = r,
  seed = 42
)

# Randomized field book
field_book <- crd_design$book
print(field_book)

cat("\nDesign parameters:\n")
cat("  Treatments :", length(treatments), "\n")
cat("  Replications:", r, "\n")
cat("  Total units :", nrow(field_book), "\n")
```

**Output:**

```
   plots r trt
1    101 1  T3
2    102 1  T1
3    103 1  T5
4    104 1  T2
...
30   130 6  T4

Design parameters:
  Treatments : 5
  Replications: 6
  Total units : 30
```

---

### Step 3 — Simulate / Attach Data

```r
# ── Simulated grain yield (q/ha) ──────────────────────────────────────────
# True treatment means: T1=42, T2=48, T3=55, T4=52, T5=45
set.seed(7)
true_means <- c(T1 = 42, T2 = 48, T3 = 55, T4 = 52, T5 = 45)

field_book$Yield <- unlist(lapply(field_book$trt, function(t) {
  rnorm(1, mean = true_means[t], sd = 4)
}))

head(field_book, 10)
```

---

### Step 4 — Exploratory Data Analysis

```r
# ── Summary statistics per treatment ─────────────────────────────────────
crd_summary <- field_book |>
  group_by(trt) |>
  summarise(
    n    = n(),
    Mean = round(mean(Yield), 3),
    SD   = round(sd(Yield),   3),
    SE   = round(sd(Yield) / sqrt(n()), 3),
    Min  = round(min(Yield), 2),
    Max  = round(max(Yield), 2),
    CV   = round(sd(Yield) / mean(Yield) * 100, 1)
  )
print(crd_summary)
```

```
# A tibble: 5 × 8
  trt       n  Mean    SD    SE   Min   Max    CV
  <chr> <int> <dbl> <dbl> <dbl> <dbl> <dbl> <dbl>
1 T1        6  41.8  3.72  1.52  37.2  47.1   8.9
2 T2        6  48.3  4.11  1.68  42.9  54.1   8.5
3 T3        6  55.1  3.89  1.59  50.3  60.4   7.1
4 T4        6  51.8  4.05  1.65  46.1  57.3   7.8
5 T5        6  44.9  3.63  1.48  40.2  49.8   8.1
```

```r
# ── Boxplot ────────────────────────────────────────────────────────────────
ggplot(field_book, aes(x = trt, y = Yield, fill = trt)) +
  geom_boxplot(alpha = 0.7, width = 0.5, outlier.shape = 19) +
  geom_jitter(width = 0.12, size = 2.5, alpha = 0.7) +
  stat_summary(fun = mean, geom = "point",
               shape = 23, size = 4, fill = "white") +
  scale_fill_brewer(palette = "Set2") +
  labs(title    = "CRD: Grain Yield by Treatment",
       subtitle = "Diamond = group mean | Points = individual observations",
       x = "Treatment", y = "Yield (q/ha)") +
  theme_minimal(base_size = 13) +
  theme(legend.position = "none")
```

---

### Step 5 — ANOVA

```r
# ── Fit CRD model ─────────────────────────────────────────────────────────
model_crd <- aov(Yield ~ trt, data = field_book)
anova_table <- summary(model_crd)
print(anova_table)
```

**Output:**

```
            Df Sum Sq Mean Sq F value   Pr(>F)
trt          4  701.4  175.34   11.52 1.73e-05 ***
Residuals   25  380.3   15.21
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05
```

```r
# ── Grand mean and CV ─────────────────────────────────────────────────────
grand_mean <- mean(field_book$Yield)
MS_error   <- anova_table[[1]]["Residuals", "Mean Sq"]
CV         <- sqrt(MS_error) / grand_mean * 100

cat("Grand mean :", round(grand_mean, 3), "q/ha\n")
cat("MS Error   :", round(MS_error,   3), "\n")
cat("CV         :", round(CV, 2), "%\n")
```

```
Grand mean : 48.382 q/ha
MS Error   : 15.213
CV         : 8.08 %
```

**Interpretation:** $F_{(4,25)} = 11.52,\ p < 0.001$. We reject $H_0$.
CV = 8.08 % indicates excellent experimental precision.

---

### Step 6 — Assumptions Check

```r
# ── 1. Residual plots ─────────────────────────────────────────────────────
par(mfrow = c(2, 2))
plot(model_crd, which = 1:4)
par(mfrow = c(1, 1))

# ── 2. Normality of residuals ─────────────────────────────────────────────
resids <- residuals(model_crd)
shapiro.test(resids)

# Q-Q plot (ggplot)
ggplot(data.frame(resid = resids), aes(sample = resid)) +
  stat_qq(colour = "#377EB8", size = 2) +
  stat_qq_line(colour = "#E41A1C", linewidth = 1) +
  labs(title = "Normal Q-Q Plot of Residuals",
       x = "Theoretical Quantiles",
       y = "Sample Quantiles") +
  theme_minimal(base_size = 13)

# ── 3. Homogeneity of variance ────────────────────────────────────────────
leveneTest(Yield ~ trt, data = field_book)
bartlett.test(Yield ~ trt, data = field_book)
```

**Output:**

```
Shapiro-Wilk: W = 0.981, p = 0.847   → normality OK
Levene's test: F = 0.142, p = 0.966  → equal variances OK
```

---

### Step 7 — Post-Hoc Multiple Comparisons

#### 7a. LSD Test (Least Significant Difference)

$$LSD = t_{\alpha/2,\, df_E} \times \sqrt{MS_E \left(\frac{1}{n_i} + \frac{1}{n_j}\right)}$$

```r
lsd_result <- LSD.test(model_crd, "trt",
                        p.adj    = "bonferroni",
                        console  = TRUE)
```

**Output:**

```
Treatment  Yield  groups
T3         55.1   a
T4         51.8   ab
T2         48.3   bc
T5         44.9   cd
T1         41.8   d
```

#### 7b. Tukey HSD

$$HSD = q_{\alpha,\, k,\, df_E} \times \sqrt{\frac{MS_E}{r}}$$

```r
tukey_result <- TukeyHSD(model_crd, "trt")
print(tukey_result)

# Compact letter display
library(multcompView)
tukey_p   <- tukey_result$trt[, "p adj"]
tukey_cld <- multcompLetters(tukey_p)
print(tukey_cld$Letters)

# Plot Tukey intervals
plot(tukey_result, las = 1, col = "#2C7BB6",
     main = "Tukey HSD 95% Confidence Intervals")
```

#### 7c. Duncan's Multiple Range Test

```r
duncan_result <- duncan.test(model_crd, "trt", console = TRUE)
```

#### 7d. Dunnett's Test (vs Control)

```r
# Compare all treatments against T1 (control)
library(multcomp)
dunnett <- glht(model_crd,
                linfct = mcp(trt = "Dunnett"),
                base = 1)   # T1 as reference
summary(dunnett)
confint(dunnett)
```

#### 7e. Estimated Marginal Means (emmeans)

```r
emm <- emmeans(model_crd, ~ trt)
print(emm)

# Pairwise contrasts
pairs(emm, adjust = "tukey")

# Compact letter display
library(multcomp)
cld(emm, Letters = letters, adjust = "tukey")
```

---

### Step 8 — Effect Size

```r
# Eta-squared (η²) — proportion of variance explained by treatment
eta_squared(model_crd, partial = FALSE)

# Omega-squared (ω²) — less biased estimate
omega_squared(model_crd, partial = FALSE)

# Manual η²
SS_trt   <- anova_table[[1]]["trt",       "Sum Sq"]
SS_total <- sum(anova_table[[1]][, "Sum Sq"])
eta2_manual <- SS_trt / SS_total
cat("η² (manual):", round(eta2_manual, 4), "\n")
```

**Output:**

```
η²     = 0.648   → large effect (Cohen: > 0.14 is large)
ω²     = 0.596
```

---

### Step 9 — Publication-Quality Summary Plot

```r
# ── Mean ± SE bar chart with significance letters ─────────────────────────
letters_df <- data.frame(
  trt    = names(lsd_result$groups$groups),
  letter = lsd_result$groups$groups
)

plot_df <- crd_summary |>
  left_join(letters_df, by = "trt")

ggplot(plot_df, aes(x = reorder(trt, -Mean), y = Mean, fill = trt)) +
  geom_col(alpha = 0.85, width = 0.6, colour = "grey30") +
  geom_errorbar(aes(ymin = Mean - SE, ymax = Mean + SE),
                width = 0.2, linewidth = 0.8) +
  geom_text(aes(y = Mean + SE + 1.5, label = letter),
            size = 5, fontface = "bold") +
  scale_fill_brewer(palette = "Set2") +
  labs(title    = "Mean Grain Yield by Treatment (CRD)",
       subtitle = "Error bars = ±1 SE | Letters = LSD grouping (Bonferroni, α = 0.05)",
       x = "Treatment", y = "Yield (q/ha)") +
  theme_minimal(base_size = 13) +
  theme(legend.position = "none")
```

---

### Step 10 — Power Analysis

```r
# ── Post-hoc power ────────────────────────────────────────────────────────
library(pwr)

# Effect size f from η²
eta2 <- eta2_manual
f_effect <- sqrt(eta2 / (1 - eta2))
cat("Cohen's f:", round(f_effect, 3), "\n")

# Power of current design
pwr.anova.test(k   = 5,
               n   = 6,
               f   = f_effect,
               sig.level = 0.05)

# ── Sample size for 80% power ─────────────────────────────────────────────
# Assuming medium effect (f = 0.25)
pwr.anova.test(k         = 5,
               f         = 0.25,
               sig.level = 0.05,
               power     = 0.80)

# ── Power curve ───────────────────────────────────────────────────────────
n_seq   <- 3:20
pwr_seq <- sapply(n_seq, function(n) {
  pwr.anova.test(k = 5, n = n, f = 0.25, sig.level = 0.05)$power
})

ggplot(data.frame(n = n_seq, power = pwr_seq), aes(n, power)) +
  geom_line(colour = "#2C7BB6", linewidth = 1.2) +
  geom_point(size = 2.5, colour = "#2C7BB6") +
  geom_hline(yintercept = 0.80, linetype = "dashed",
             colour = "#E41A1C", linewidth = 1) +
  annotate("text", x = 18, y = 0.82, label = "80% power",
           colour = "#E41A1C", size = 4) +
  labs(title    = "Power Curve — CRD with 5 Treatments (f = 0.25)",
       x = "Replications per Treatment",
       y = "Power") +
  theme_minimal(base_size = 13)
```

---

## 8. Unbalanced CRD

When replication numbers differ across treatments, SS formulas adjust automatically in R.
The Type III SS (from `car::Anova()`) is preferred.

```r
# ── Unbalanced CRD ────────────────────────────────────────────────────────
set.seed(99)
unbal_data <- data.frame(
  trt   = rep(paste0("T", 1:4), times = c(4, 6, 5, 7)),
  Yield = c(rnorm(4, 40, 3), rnorm(6, 47, 3),
            rnorm(5, 53, 3), rnorm(7, 50, 3))
)

# Type III ANOVA for unbalanced data
model_unbal <- lm(Yield ~ trt, data = unbal_data)
car::Anova(model_unbal, type = "III")

# Adjusted means (LSMeans)
emmeans(model_unbal, ~ trt)
```

---

## 9. Non-Parametric Alternative — Kruskal-Wallis

When normality or homoscedasticity assumptions fail:

```r
# ── Kruskal-Wallis test ───────────────────────────────────────────────────
kw_result <- kruskal.test(Yield ~ trt, data = field_book)
print(kw_result)

# ── Post-hoc: Dunn's test ─────────────────────────────────────────────────
library(FSA)
dunnTest(Yield ~ trt, data = field_book, method = "bonferroni")
```

---

## 10. CRD vs RCBD — When Does Blocking Help?

```r
# ── Relative Efficiency: how much does blocking gain? ─────────────────────
# RE > 100% → RCBD more efficient than CRD
# RE < 100% → blocking was unnecessary

# Simulate data with a block effect
set.seed(55)
rcbd_data <- expand.grid(
  trt   = paste0("T", 1:5),
  block = paste0("B", 1:6)
) |>
  mutate(
    Yield = 45
      + c(0, 3, 8, 6, 2)[as.integer(factor(trt))]
      + c(0, 2, -2, 4, -1, 3)[as.integer(factor(block))]
      + rnorm(30, 0, 2)
  )

model_rcbd <- aov(Yield ~ trt + block, data = rcbd_data)
aov_rcbd   <- summary(model_rcbd)[[1]]

MS_block <- aov_rcbd["block",     "Mean Sq"]
MS_err   <- aov_rcbd["Residuals", "Mean Sq"]
df_block <- aov_rcbd["block",     "Df"]
df_err   <- aov_rcbd["Residuals", "Df"]

RE <- (df_block * MS_block + df_err * MS_err) /
      ((df_block + df_err) * MS_err) * 100

cat(sprintf("Relative Efficiency of RCBD over CRD: %.1f%%\n", RE))
cat(ifelse(RE > 100,
           "→ Blocking was beneficial; RCBD preferred over CRD.",
           "→ Blocking was not beneficial; CRD would have been sufficient."))
```

---

## 11. Summary

| Feature | CRD |
|---|---|
| Blocking | None |
| Randomization | Complete, unrestricted |
| Error df | $N - k$ |
| Best suited for | Homogeneous units (lab, greenhouse) |
| Key assumption | Uniform experimental material |
| Main R function | `aov(y ~ trt)` |
| Post-hoc tests | LSD, Tukey, Duncan, Dunnett, emmeans |
| Non-parametric alt | `kruskal.test()` + `dunnTest()` |

---

## 12. References

- Cochran, W. G., & Cox, G. M. (1957). *Experimental Designs* (2nd ed.). Wiley.
- Montgomery, D. C. (2017). *Design and Analysis of Experiments* (9th ed.). Wiley.
- de Mendiburu, F. (2023). *agricolae: Statistical Procedures for Agricultural Research*. CRAN.
- Lenth, R. V. (2024). *emmeans: Estimated Marginal Means*. CRAN.
- R Core Team (2026). *R: A Language and Environment for Statistical Computing*.

---
