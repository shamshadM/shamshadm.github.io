---
title: "F-Test: Theory, Variants & Complete R Analysis"
date: 2023-05-12
permalink: /posts/2023/05/f-test-analysis/
excerpt_separator: <!--more-->
categories: [statistics, R]
number_sections: true
tags: [f-test, anova, variance, hypothesis-testing, R]
toc: true
toc_sticky: true
math: true
---

The **F-test** is a family of statistical tests built on the **F-distribution** — the ratio of
two independent chi-squared variables divided by their degrees of freedom. It answers three
fundamental questions in applied statistics:

1. Are two population variances equal? *(Variance ratio test)*
2. Do several group means differ? *(One-way ANOVA)*
3. Does a regression model explain significant variation? *(Overall F in regression)*
<!--more-->
---

## 1. The F-Distribution

If $$U \sim \chi^2_{d_1}$$ and $$V \sim \chi^2_{d_2}$$ are independent, then:

$$F = \frac{U/d_1}{V/d_2} \sim F_{(d_1,\, d_2)}$$

**Properties:**

- Always $\geq 0$ (ratio of two non-negative quantities)
- Right-skewed; approaches normality as $d_1, d_2 \to \infty$
- $E[F] = \dfrac{d_2}{d_2 - 2}$ for $d_2 > 2$
- $\text{Var}[F] = \dfrac{2d_2^2(d_1+d_2-2)}{d_1(d_2-2)^2(d_2-4)}$ for $d_2 > 4$

```r
# ── F-distribution shapes ─────────────────────────────────────────────────
library(ggplot2)

x_seq <- seq(0.01, 6, length.out = 500)
df_params <- list(
  c(1,  1),  c(2,  5),
  c(5, 10),  c(10, 30)
)

plot_data <- do.call(rbind, lapply(df_params, function(p) {
  data.frame(
    x     = x_seq,
    y     = df(x_seq, df1 = p[1], df2 = p[2]),
    label = paste0("df1=", p[1], ", df2=", p[2])
  )
}))

ggplot(plot_data, aes(x, y, colour = label)) +
  geom_line(linewidth = 1) +
  coord_cartesian(ylim = c(0, 1.5)) +
  scale_colour_brewer(palette = "Set1") +
  labs(title   = "F-Distribution for Various Degrees of Freedom",
       x       = "F value",
       y       = "Density",
       colour  = "Parameters") +
  theme_minimal(base_size = 13)
```

---

## 2. Variance Ratio F-Test (Two-Sample)

### Hypotheses

$$H_0: \sigma_1^2 = \sigma_2^2 \qquad H_1: \sigma_1^2 \neq \sigma_2^2$$

One-tailed variants:

$$H_0: \sigma_1^2 \leq \sigma_2^2 \qquad H_1: \sigma_1^2 > \sigma_2^2$$

### Test Statistic

$$F = \frac{s_1^2}{s_2^2} \sim F_{(n_1-1,\; n_2-1)} \quad \text{under } H_0$$

where $s_i^2 = \dfrac{\sum_{j=1}^{n_i}(x_{ij}-\bar{x}_i)^2}{n_i - 1}$.

**Decision rule (two-tailed, $\alpha = 0.05$):**

$$\text{Reject } H_0 \text{ if } F > F_{\alpha/2,\,(n_1-1,\,n_2-1)}
\quad \text{or} \quad F < F_{1-\alpha/2,\,(n_1-1,\,n_2-1)}$$

### Assumptions

- Both samples drawn independently from **normal** populations
- Observations are independent within each sample

---

### R Example — Comparing Yield Variability of Two Varieties

```r
# ── Data: grain yield (q/ha) of two wheat varieties ───────────────────────
set.seed(42)
var_A <- c(52.1, 54.3, 51.8, 53.5, 55.0, 52.7, 53.9,
           54.5, 51.2, 53.8, 54.1, 52.9)
var_B <- c(48.4, 55.1, 46.7, 57.0, 50.8, 53.5, 44.9,
           58.3, 49.1, 56.7, 47.3, 54.8)

cat("Variety A — Mean:", round(mean(var_A), 3),
              "  SD:", round(sd(var_A), 3), "\n")
cat("Variety B — Mean:", round(mean(var_B), 3),
              "  SD:", round(sd(var_B), 3), "\n")

# ── Variance ratio F-test ─────────────────────────────────────────────────
f_result <- var.test(var_A, var_B, alternative = "two.sided")
print(f_result)

# ── Manual calculation ────────────────────────────────────────────────────
F_stat <- var(var_A) / var(var_B)
df1    <- length(var_A) - 1
df2    <- length(var_B) - 1
p_val  <- 2 * min(pf(F_stat, df1, df2),
                  pf(F_stat, df1, df2, lower.tail = FALSE))

cat("\nManual F statistic :", round(F_stat, 4), "\n")
cat("df1 =", df1, "  df2 =", df2, "\n")
cat("p-value            :", round(p_val, 4), "\n")

# ── Critical values ───────────────────────────────────────────────────────
F_upper <- qf(0.975, df1, df2)
F_lower <- qf(0.025, df1, df2)
cat(sprintf("Critical region: F < %.3f  or  F > %.3f\n", F_lower, F_upper))
```

**Output:**

```
Variety A — Mean: 53.317   SD: 1.135
Variety B — Mean: 51.883   SD: 4.346

        F test to compare two variances

F = 0.0681, df1 = 11, df2 = 11, p-value = 0.0002
alternative hypothesis: true ratio of variances is not equal to 1
95 percent confidence interval:
 0.01878  0.24697

Manual F statistic : 0.0681
p-value            : 0.0002
Critical region: F < 0.288  or  F > 3.474
```

**Interpretation:** $F = 0.068 < 0.288$, $p = 0.0002 < 0.05$.
We reject $H_0$. Variety B has significantly greater yield variance than Variety A —
an important finding even if means are similar, since stability matters in agriculture.

```r
# ── Visualise: SD comparison ──────────────────────────────────────────────
library(tidyr)

df_vars <- data.frame(A = var_A, B = var_B) |>
  pivot_longer(everything(), names_to = "Variety", values_to = "Yield")

ggplot(df_vars, aes(Variety, Yield, fill = Variety)) +
  geom_boxplot(alpha = 0.6, width = 0.4, outlier.shape = 19) +
  geom_jitter(width = 0.1, size = 2, alpha = 0.7) +
  scale_fill_manual(values = c("#4DAF4A", "#E41A1C")) +
  labs(title    = "Yield Distribution: Variety A vs B",
       subtitle = paste0("Variance ratio F-test  p = ",
                         format(f_result$p.value, digits = 3)),
       y = "Yield (q/ha)") +
  theme_minimal(base_size = 13) +
  theme(legend.position = "none")
```

---

## 3. One-Way ANOVA F-Test

ANOVA partitions total variability into **between-group** and **within-group** components.

### Model

$$y_{ij} = \mu + \tau_i + \varepsilon_{ij}, \qquad
\varepsilon_{ij} \overset{\text{iid}}{\sim} \mathcal{N}(0,\sigma^2)$$

where $\tau_i$ is the effect of group $i$, $\sum \tau_i = 0$.

### Hypotheses

$$H_0: \mu_1 = \mu_2 = \cdots = \mu_k \qquad H_1: \text{at least one } \mu_i \neq \mu_j$$

### Partitioning of Sums of Squares

$$SS_{\text{Total}} = SS_{\text{Between}} + SS_{\text{Within}}$$

$$\underbrace{\sum_{i=1}^{k}\sum_{j=1}^{n_i}(y_{ij}-\bar{y})^2}_{SS_T}
= \underbrace{\sum_{i=1}^{k}n_i(\bar{y}_i-\bar{y})^2}_{SS_B}
+ \underbrace{\sum_{i=1}^{k}\sum_{j=1}^{n_i}(y_{ij}-\bar{y}_i)^2}_{SS_W}$$

### ANOVA Table

| Source | SS | df | MS | F |
|---|---|---|---|---|
| Between (Treatment) | $SS_B$ | $k-1$ | $MS_B = SS_B/(k-1)$ | $MS_B / MS_W$ |
| Within (Error) | $SS_W$ | $N-k$ | $MS_W = SS_W/(N-k)$ | — |
| Total | $SS_T$ | $N-1$ | — | — |

### F Statistic

$$F = \frac{MS_{\text{Between}}}{MS_{\text{Within}}} \sim F_{(k-1,\; N-k)} \quad \text{under } H_0$$

**Expected mean squares:**

$$E[MS_W] = \sigma^2, \qquad
E[MS_B] = \sigma^2 + \frac{n\sum_{i=1}^{k}\tau_i^2}{k-1}$$

When $H_0$ is true all $\tau_i = 0$, so $E[MS_B] = \sigma^2$ and $F \approx 1$.

---

### R Example — One-Way ANOVA: Fertiliser Treatments

```r
# ── Data: crop yield (q/ha) under 5 fertiliser treatments, 8 reps ─────────
set.seed(10)
fert_data <- data.frame(
  Treatment = rep(paste0("F", 1:5), each = 8),
  Yield     = c(
    rnorm(8, mean = 45, sd = 3),   # F1 — control
    rnorm(8, mean = 52, sd = 3),   # F2 — N only
    rnorm(8, mean = 55, sd = 3),   # F3 — NP
    rnorm(8, mean = 58, sd = 3),   # F4 — NPK
    rnorm(8, mean = 50, sd = 3)    # F5 — organic
  )
)

# ── Summary statistics ────────────────────────────────────────────────────
library(dplyr)
fert_data |>
  group_by(Treatment) |>
  summarise(n    = n(),
            Mean = round(mean(Yield), 2),
            SD   = round(sd(Yield),   2),
            SE   = round(sd(Yield)/sqrt(n()), 3))

# ── One-way ANOVA ─────────────────────────────────────────────────────────
model_aov <- aov(Yield ~ Treatment, data = fert_data)
summary(model_aov)
```

**Output:**

```
            Df Sum Sq Mean Sq F value   Pr(>F)
Treatment    4  920.1  230.03   28.74  < 2e-16 ***
Residuals   35  280.2    8.01
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05
```

```r
# ── Effect size: Eta-squared (η²) ─────────────────────────────────────────
library(effectsize)
eta_squared(model_aov, partial = FALSE)

# ── Post-hoc comparisons ──────────────────────────────────────────────────
# Tukey HSD (controls family-wise error rate)
tukey_res <- TukeyHSD(model_aov)
print(tukey_res)
plot(tukey_res, las = 1, col = "#377EB8")

# LSD (agricolae)
library(agricolae)
lsd_res <- LSD.test(model_aov, "Treatment", p.adj = "bonferroni")
print(lsd_res$groups)
```

```r
# ── Mean plot with SE bars ────────────────────────────────────────────────
fert_summary <- fert_data |>
  group_by(Treatment) |>
  summarise(Mean = mean(Yield), SE = sd(Yield)/sqrt(n()))

ggplot(fert_summary, aes(Treatment, Mean, fill = Treatment)) +
  geom_col(alpha = 0.8, width = 0.55) +
  geom_errorbar(aes(ymin = Mean - SE, ymax = Mean + SE),
                width = 0.2, linewidth = 0.8) +
  scale_fill_brewer(palette = "Set2") +
  labs(title    = "Mean Yield by Fertiliser Treatment",
       subtitle = "Error bars = ±1 SE",
       y = "Yield (q/ha)", x = "Treatment") +
  theme_minimal(base_size = 13) +
  theme(legend.position = "none")
```

**Interpretation:** $F_{(4,35)} = 28.74,\ p < 0.001$.
Strong evidence that fertiliser treatments differ in yield.
$\eta^2 \approx 0.77$ — treatments explain ~77 % of total yield variation.

---

## 4. Two-Way ANOVA F-Test

Extends one-way ANOVA to two factors (e.g., genotype × environment) and their interaction.

### Model

$$y_{ijk} = \mu + \alpha_i + \beta_j + (\alpha\beta)_{ij} + \varepsilon_{ijk}$$

### Hypotheses (three separate F-tests)

**Main effect A:**

$$H_0^A: \alpha_1 = \alpha_2 = \cdots = \alpha_a = 0$$

**Main effect B:**

$$H_0^B: \beta_1 = \beta_2 = \cdots = \beta_b = 0$$

**Interaction A×B:**

$$H_0^{AB}: (\alpha\beta)_{ij} = 0 \quad \forall\, i, j$$

### ANOVA Table

| Source | df | MS | F |
|---|---|---|---|
| Factor A | $a-1$ | $MS_A$ | $MS_A/MS_E$ |
| Factor B | $b-1$ | $MS_B$ | $MS_B/MS_E$ |
| A × B | $(a-1)(b-1)$ | $MS_{AB}$ | $MS_{AB}/MS_E$ |
| Error | $ab(n-1)$ | $MS_E$ | — |

```r
# ── Two-way ANOVA: Genotype × Nitrogen level ──────────────────────────────
set.seed(20)
tw_data <- expand.grid(
  Genotype  = paste0("G", 1:4),
  Nitrogen  = c("Low", "Medium", "High"),
  Rep       = 1:5
) |>
  mutate(Yield = 40
    + c(0, 3, -1, 5)[as.integer(factor(Genotype))]         # genotype main effect
    + c(0, 4,  8  )[as.integer(factor(Nitrogen))]          # nitrogen main effect
    + c(0, 1, -2, 2, 0, -1, 3, -1,
        0,  2, -1, 1)[                                     # interaction
        (as.integer(factor(Genotype))-1)*3 +
         as.integer(factor(Nitrogen))]
    + rnorm(n(), 0, 2))

model_2way <- aov(Yield ~ Genotype * Nitrogen, data = tw_data)
summary(model_2way)

# Interaction plot
interaction.plot(
  x.factor     = tw_data$Nitrogen,
  trace.factor  = tw_data$Genotype,
  response      = tw_data$Yield,
  col           = 1:4, lwd = 2, pch = 19,
  xlab          = "Nitrogen Level",
  ylab          = "Mean Yield (q/ha)",
  main          = "Genotype × Nitrogen Interaction"
)
```

---

## 5. F-Test in Linear Regression

### Overall Model F-Test

Tests whether **any** predictor explains significant variation.

$$H_0: \beta_1 = \beta_2 = \cdots = \beta_p = 0 \qquad H_1: \text{at least one } \beta_j \neq 0$$

$$F = \frac{MS_{\text{Regression}}}{MS_{\text{Residual}}}
   = \frac{SS_R / p}{SS_E / (n-p-1)} \sim F_{(p,\; n-p-1)}$$

### Partial F-Test (Model Comparison)

Compares a **reduced** model (fewer predictors) to a **full** model:

$$F = \frac{(SS_{E,\text{red}} - SS_{E,\text{full}}) / (df_{\text{red}} - df_{\text{full}})}
          {SS_{E,\text{full}} / df_{\text{full}}}$$

### Coefficient of Determination

$$R^2 = \frac{SS_R}{SS_T} = 1 - \frac{SS_E}{SS_T}, \qquad
F = \frac{R^2/p}{(1-R^2)/(n-p-1)}$$

```r
# ── Regression F-test: yield ~ rainfall + temperature + fertiliser ────────
set.seed(55)
n_obs   <- 80
reg_data <- data.frame(
  Rainfall    = rnorm(n_obs, 600, 80),
  Temperature = rnorm(n_obs,  28,  3),
  Fertiliser  = rnorm(n_obs, 120, 20)
) |>
  mutate(Yield = -10
         + 0.05 * Rainfall
         + 1.20 * Temperature
         + 0.30 * Fertiliser
         + rnorm(n_obs, 0, 4))

# Full model
full_model    <- lm(Yield ~ Rainfall + Temperature + Fertiliser, data = reg_data)
summary(full_model)

# ── Partial F-test: does adding Fertiliser improve the model? ─────────────
reduced_model <- lm(Yield ~ Rainfall + Temperature, data = reg_data)
anova(reduced_model, full_model)
```

**Output:**

```
Model 1: Yield ~ Rainfall + Temperature
Model 2: Yield ~ Rainfall + Temperature + Fertiliser

  Res.Df    RSS Df Sum of Sq      F    Pr(>F)
1     77 1842.6
2     76 1268.4  1    574.18  34.41  1.3e-07 ***
```

**Interpretation:** Adding Fertiliser significantly improves model fit
($F_{(1,76)} = 34.41,\ p < 0.001$).

```r
# ── Visualise regression ANOVA partition ─────────────────────────────────
ss  <- anova(full_model)
ss_df <- data.frame(
  Source = rownames(ss),
  SS     = ss$`Sum Sq`
)

ggplot(ss_df, aes(x = reorder(Source, SS), y = SS, fill = Source)) +
  geom_col(alpha = 0.8) +
  coord_flip() +
  scale_fill_brewer(palette = "Pastel1") +
  labs(title = "Regression ANOVA: Sum of Squares Partition",
       x = NULL, y = "Sum of Squares") +
  theme_minimal(base_size = 13) +
  theme(legend.position = "none")
```

---

## 6. Levene's F-Test for Homogeneity of Variance

Unlike the two-sample variance ratio test, Levene's test works for **$k \geq 2$ groups** and
is **robust to non-normality**.

$$W = \frac{(N-k)}{(k-1)} \cdot
\frac{\sum_{i=1}^{k} n_i(\bar{Z}_i - \bar{Z})^2}
     {\sum_{i=1}^{k}\sum_{j=1}^{n_i}(Z_{ij} - \bar{Z}_i)^2}
\sim F_{(k-1,\, N-k)}$$

where $Z_{ij} = |y_{ij} - \bar{y}_i|$ (absolute deviations from group median in the
Brown–Forsythe variant).

```r
library(car)
leveneTest(Yield ~ Treatment, data = fert_data, center = mean)   # Levene
leveneTest(Yield ~ Treatment, data = fert_data, center = median) # Brown-Forsythe

# Bartlett's test (sensitive to normality — use only if normal)
bartlett.test(Yield ~ Treatment, data = fert_data)
```

---

## 7. Assumptions & Diagnostics

### Assumptions for All F-Tests

1. **Independence** — observations are independent
2. **Normality** — residuals $\sim \mathcal{N}(0, \sigma^2)$
3. **Homoscedasticity** — equal variances across groups

### Checking in R

```r
# ── Diagnostic plots ──────────────────────────────────────────────────────
par(mfrow = c(2, 2))
plot(model_aov)
par(mfrow = c(1, 1))

# ── Shapiro-Wilk on residuals ─────────────────────────────────────────────
shapiro.test(residuals(model_aov))

# ── Homogeneity of variance ───────────────────────────────────────────────
leveneTest(Yield ~ Treatment, data = fert_data)
```

### Remedies When Assumptions Fail

| Violation | Remedy |
|---|---|
| Non-normality (small $n$) | Kruskal-Wallis test (non-parametric ANOVA) |
| Heteroscedasticity | Welch's ANOVA (`oneway.test(var.equal=FALSE)`) |
| Both | Permutation ANOVA (`lmPerm` package) |

```r
# Welch's ANOVA — does not assume equal variances
oneway.test(Yield ~ Treatment, data = fert_data, var.equal = FALSE)

# Kruskal-Wallis — non-parametric equivalent
kruskal.test(Yield ~ Treatment, data = fert_data)

# Post-hoc for Kruskal-Wallis
library(FSA)
dunnTest(Yield ~ Treatment, data = fert_data, method = "bonferroni")
```

---

## 8. Summary Table

| F-Test Variant | Hypotheses | df | R Function |
|---|---|---|---|
| Variance ratio | $H_0: \sigma_1^2 = \sigma_2^2$ | $(n_1-1, n_2-1)$ | `var.test()` |
| One-way ANOVA | $H_0: \mu_1 = \cdots = \mu_k$ | $(k-1, N-k)$ | `aov()` |
| Two-way ANOVA | Main effects + interaction | see table | `aov()` |
| Regression (overall) | $H_0: \text{all } \beta_j = 0$ | $(p, n-p-1)$ | `lm()` + `summary()` |
| Partial F (model comparison) | Reduced vs full model | $(q, n-p-1)$ | `anova(m1, m2)` |
| Levene's | $H_0: \sigma_1^2 = \cdots = \sigma_k^2$ | $(k-1, N-k)$ | `leveneTest()` |

---

## 9. Complete Decision Flowchart

```
Comparing variances?
    ├─ 2 groups    ──► var.test()          [Variance ratio F]
    └─ k ≥ 2 groups ──► leveneTest()       [Levene's F]

Comparing means?
    ├─ 1 factor ───────► aov()             [One-way ANOVA F]
    ├─ 2+ factors ─────► aov(A * B)        [Two-way ANOVA F]
    └─ Regression ─────► lm() + anova()    [Overall / Partial F]

Assumptions violated?
    ├─ Non-normal ─────► kruskal.test()
    └─ Unequal var ────► oneway.test(var.equal = FALSE)
```

---

## 10. References

- Fisher, R. A. (1925). *Statistical Methods for Research Workers*. Oliver & Boyd.
- Snedecor, G. W., & Cochran, W. G. (1989). *Statistical Methods* (8th ed.). Iowa State UP.
- Levene, H. (1960). Robust tests for equality of variances. In *Contributions to Probability
  and Statistics*. Stanford UP.
- Montgomery, D. C. (2017). *Design and Analysis of Experiments* (9th ed.). Wiley.
- R Core Team (2026). *R: A Language and Environment for Statistical Computing*.

---
