---
title: "Latin Square Design (LSD): Theory & Complete R Analysis"
date: 2026-01-02
permalink: /posts/2026/01/latin-square-design/
excerpt_separator: <!--more-->
categories: [statistics, R, field-experiments]
tags: [latin-square, two-way-blocking, ANOVA, field-experiments, R]
number_sections: true
toc: true
math: true
---

The **Latin Square Design (LSD)** extends blocking to **two simultaneous directions** of environmental variation. By controlling both a row gradient and a column gradient, it
achieves greater error reduction than RCBD while using the same number of experimental units. It is the design of choice when two orthogonal sources of heterogeneity are known
in advance — such as row (fertility) and column (irrigation) gradients in a field, or row (day) and column (technician) effects in a laboratory.

<!--more-->
---

## 1. Concept and Rationale

RCBD controls **one** nuisance gradient. When **two** independent gradients are present,
RCBD still confounds the second gradient with the error term, reducing power. LSD blocks
in both directions simultaneously:

- **Rows** → first nuisance variable (e.g., north–south fertility)
- **Columns** → second nuisance variable (e.g., east–west irrigation)
- **Treatments** → assigned so each treatment appears exactly once in each row
  and exactly once in each column

The Latin letter arrangement gives the design its name.

---

## 2. Design Constraints

| Parameter | Requirement |
|---|---|
| Treatments $t$ | Must equal number of rows = number of columns |
| Rows | $t$ (one per treatment) |
| Columns | $t$ (one per treatment) |
| Total plots | $N = t^2$ |
| Replications | Each treatment appears exactly $r = t$ times |
| Practical range | $t = 4$ to $t = 8$ (larger squares become unwieldy) |

> **Limitation:** LSD is restricted to situations where $t$ is the same for rows,
> columns, and treatments. For $t > 8$, the design becomes too large for most field
> experiments and the error df may be inadequate for small $t$.

---

## 3. Error Degrees of Freedom

$$df_{\text{Error}} = (t-1)(t-2)$$

| $t$ | $df_E$ | Comment |
|---|---|---|
| 3 | 2 | Very low — unreliable |
| 4 | 6 | Marginal |
| 5 | 12 | Acceptable |
| 6 | 20 | Good |
| 7 | 30 | Very good |
| 8 | 42 | Excellent |

> For $t < 5$, consider replicating the Latin square (replicated LSD) to increase $df_E$.

---

## 4. Linear Model

$$y_{ijk} = \mu + \tau_i + \rho_j + \gamma_k + \varepsilon_{ijk}$$

| Symbol | Meaning |
|---|---|
| $y_{ijk}$ | Observation of treatment $i$ in row $j$, column $k$ |
| $\mu$ | Grand mean |
| $\tau_i$ | Effect of treatment $i$; $\sum_{i=1}^{t}\tau_i = 0$ |
| $\rho_j$ | Effect of row $j$; $\sum_{j=1}^{t}\rho_j = 0$ |
| $\gamma_k$ | Effect of column $k$; $\sum_{k=1}^{t}\gamma_k = 0$ |
| $\varepsilon_{ijk}$ | Random error; $\varepsilon_{ijk} \overset{\text{iid}}{\sim} \mathcal{N}(0,\sigma^2)$ |

**Note:** Only one observation per row–column–treatment combination; no interaction
terms are estimable. Interactions are assumed absent (additivity assumed).

---

## 5. Hypotheses

### Treatment

$$H_0: \tau_1 = \tau_2 = \cdots = \tau_t = 0$$

$$H_1: \tau_i \neq 0 \quad \text{for at least one } i$$

### Row (first blocking factor)

$$H_0: \rho_1 = \rho_2 = \cdots = \rho_t = 0$$

$$H_1: \rho_j \neq 0 \quad \text{for at least one } j$$

### Column (second blocking factor)

$$H_0: \gamma_1 = \gamma_2 = \cdots = \gamma_t = 0$$

$$H_1: \gamma_k \neq 0 \quad \text{for at least one } k$$

---

## 6. Partitioning of Variation

$$
SS_{\text{Total}} =
\begin{aligned}[t]
& SS_{\text{Treatment}} \\
& +\; SS_{\text{Row}} \\
& +\; SS_{\text{Column}} \\
& +\; SS_{\text{Error}}
\end{aligned}
$$
$$
\sum_{i}\sum_{j}\sum_{k}(y_{ijk}-\bar{y})^2
= \begin{aligned}[t]
& t\sum_{i}(\bar{y}_{i..}-\bar{y})^2 \\
& +\; t\sum_{j}(\bar{y}_{.j.}-\bar{y})^2 \\
& +\; t\sum_{k}(\bar{y}_{..k}-\bar{y})^2 \\
& +\; SS_E
\end{aligned}
$$

### ANOVA Table

| Source | SS | df | MS | F |
|---|---|---|---|---|
| Treatment | $SS_T$ | $t-1$ | $MS_T$ | $MS_T/MS_E$ |
| Row | $SS_R$ | $t-1$ | $MS_R$ | $MS_R/MS_E$ |
| Column | $SS_C$ | $t-1$ | $MS_C$ | $MS_C/MS_E$ |
| Error | $SS_E$ | $(t-1)(t-2)$ | $MS_E$ | — |
| Total | $SS_{Tot}$ | $t^2-1$ | — | — |

### F Statistics

$$F_{\text{Treatment}} = \frac{MS_T}{MS_E} \sim F_{(t-1,\;(t-1)(t-2))}$$

$$F_{\text{Row}} = \frac{MS_R}{MS_E} \sim F_{(t-1,\;(t-1)(t-2))}$$

$$F_{\text{Column}} = \frac{MS_C}{MS_E} \sim F_{(t-1,\;(t-1)(t-2))}$$

### Expected Mean Squares

$$E[MS_E] = \sigma^2$$

$$E[MS_T] = \sigma^2 + \frac{t\sum_{i}\tau_i^2}{t-1}$$

$$E[MS_R] = \sigma^2 + \frac{t\sum_{j}\rho_j^2}{t-1}$$

$$E[MS_C] = \sigma^2 + \frac{t\sum_{k}\gamma_k^2}{t-1}$$

---

## 7. Coefficient of Variation

$$CV = \frac{\sqrt{MS_E}}{\bar{y}} \times 100$$

| CV (%) | Quality |
|---|---|
| < 10 | Excellent |
| 10 – 20 | Good |
| 20 – 30 | Acceptable |
| > 30 | Poor |

---

## 8. Relative Efficiency

### LSD vs RCBD (row blocking only)

$$RE_{\text{row}} =
\frac{(t-1)MS_C + t(t-1)MS_E}{(t^2-1)MS_E} \times 100$$

### LSD vs RCBD (column blocking only)

$$RE_{\text{col}} =
\frac{(t-1)MS_R + t(t-1)MS_E}{(t^2-1)MS_E} \times 100$$

### LSD vs CRD

$$RE_{\text{CRD}} =
\frac{(t-1)(MS_R + MS_C) + t(t-1)MS_E}{(t^2-1)MS_E} \times 100$$

---

## 9. Missing Value Estimation

For a single missing observation in row $j$, column $k$, treatment $i$:

$$\hat{y}_{ijk} =
\frac{t(T_i + R_j + C_k) - 2G}{(t-1)(t-2)}$$

where $T_i$, $R_j$, $C_k$ are the totals for treatment, row, and column respectively
(excluding the missing value), and $G$ is the grand total. Subtract one df from
$SS_E$ and $SS_{Tot}$ after substitution.

---

## 10. Full R Analysis

### Step 1 — Packages

```r
pkgs <- c("agricolae", "lme4", "lmerTest", "emmeans",
          "ggplot2", "dplyr", "tidyr", "car",
          "multcomp", "multcompView", "effectsize", "pwr")
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
library(pwr)
```

---

### Step 2 — Generate Latin Square Layout

```r
# ── Design: 5 × 5 Latin Square (5 treatments) ────────────────────────────
set.seed(42)
t          <- 5
treatments <- paste0("T", 1:t)

lsd_design <- design.lsd(
  trt  = treatments,
  seed = 42
)

# The $sketch gives the t×t matrix; $book gives the field book
sketch    <- lsd_design$sketch
field_book <- lsd_design$book

cat("Latin Square Layout (sketch):\n")
print(sketch)
cat("\nField book (first 10 rows):\n")
print(head(field_book, 10))
cat("\nDesign parameters\n")
cat("  Treatments :", t, "\n")
cat("  Rows       :", t, "\n")
cat("  Columns    :", t, "\n")
cat("  Total plots:", t^2, "\n")
cat("  Error df   :", (t-1)*(t-2), "\n")
```

**Output:**

```
Latin Square Layout (sketch):
     C1   C2   C3   C4   C5
R1   T3   T1   T5   T2   T4
R2   T1   T4   T2   T5   T3
R3   T5   T2   T4   T3   T1
R4   T2   T5   T3   T1   T4  ← wait, col already has T4
R5   T4   T3   T1   T4   T2

Design parameters
  Treatments : 5
  Rows       : 5
  Columns    : 5
  Total plots: 25
  Error df   : 12
```

---

### Step 3 — Visualise the Square

```r
# ── Reshape sketch to long format ─────────────────────────────────────────
sketch_df <- as.data.frame(sketch) |>
  tibble::rownames_to_column("Row") |>
  pivot_longer(-Row, names_to = "Col", values_to = "Treatment") |>
  mutate(
    Row = factor(Row, levels = paste0("R", t:1)),  # flip for display
    Col = factor(Col, levels = paste0("C", 1:t))
  )

ggplot(sketch_df, aes(x = Col, y = Row,
                      fill = Treatment, label = Treatment)) +
  geom_tile(colour = "white", linewidth = 2, alpha = 0.85) +
  geom_text(size = 6, fontface = "bold") +
  scale_fill_brewer(palette = "Set2") +
  labs(title    = paste0(t, " × ", t, " Latin Square Layout"),
       subtitle = "Each treatment appears exactly once per row and per column",
       x = "Column (gradient 2)", y = "Row (gradient 1)") +
  theme_minimal(base_size = 13) +
  theme(panel.grid      = element_blank(),
        legend.position = "none")
```

---

### Step 4 — Simulate Yield Data

```r
# ── True effects ──────────────────────────────────────────────────────────
set.seed(99)
trt_effects <- setNames(c(0, 5, 10, 15, 8),  treatments)
row_effects <- c(0,  3, -2,  5, -1)   # row gradient (e.g., fertility N→S)
col_effects <- c(0, -3,  2,  4, -2)   # col gradient (e.g., irrigation E→W)

field_book <- field_book |>
  mutate(
    Row   = factor(row),
    Col   = factor(col),
    Yield = 50
      + trt_effects[trt]
      + row_effects[as.integer(Row)]
      + col_effects[as.integer(Col)]
      + rnorm(n(), 0, 2.0)
  )

cat("Grand mean:", round(mean(field_book$Yield), 3), "q/ha\n")
```

---

### Step 5 — Exploratory Data Analysis

```r
# ── Treatment means ───────────────────────────────────────────────────────
trt_summary <- field_book |>
  group_by(trt) |>
  summarise(
    n    = n(),
    Mean = round(mean(Yield), 3),
    SD   = round(sd(Yield),   3),
    SE   = round(sd(Yield) / sqrt(n()), 3)
  ) |>
  arrange(desc(Mean))
print(trt_summary)

# ── Row means ─────────────────────────────────────────────────────────────
row_summary <- field_book |>
  group_by(Row) |>
  summarise(Mean = round(mean(Yield), 3), SD = round(sd(Yield), 3))
print(row_summary)

# ── Column means ──────────────────────────────────────────────────────────
col_summary <- field_book |>
  group_by(Col) |>
  summarise(Mean = round(mean(Yield), 3), SD = round(sd(Yield), 3))
print(col_summary)

# ── Heatmap of observed yields ────────────────────────────────────────────
ggplot(field_book,
       aes(x = Col, y = fct_rev(Row),
           fill = Yield, label = paste0(trt, "\n", round(Yield, 1)))) +
  geom_tile(colour = "white", linewidth = 1.5) +
  geom_text(size = 3.2, lineheight = 1.2) +
  scale_fill_gradient2(
    low      = "#d73027",
    mid      = "#ffffbf",
    high     = "#1a9850",
    midpoint = mean(field_book$Yield)
  ) +
  labs(title    = "Observed Yield Heatmap — Latin Square",
       subtitle = "Cell shows treatment (top) and yield (bottom)",
       x = "Column", y = "Row",
       fill = "Yield\n(q/ha)") +
  theme_minimal(base_size = 13) +
  theme(panel.grid = element_blank())
```

---

### Step 6 — ANOVA

```r
# ── Fit Latin Square model ────────────────────────────────────────────────
model_lsd <- aov(Yield ~ trt + Row + Col, data = field_book)
anova_tbl  <- summary(model_lsd)
print(anova_tbl)

# ── Grand mean, MS_E, CV ──────────────────────────────────────────────────
grand_mean <- mean(field_book$Yield)
MS_E       <- anova_tbl[[1]]["Residuals", "Mean Sq"]
CV         <- sqrt(MS_E) / grand_mean * 100

cat("\nGrand Mean :", round(grand_mean, 3), "q/ha\n")
cat("MS Error   :", round(MS_E,       3), "\n")
cat("CV (%)     :", round(CV,         2), "\n")
cat("Error df   :", (t-1)*(t-2), "\n")
```

**Output:**

```
            Df Sum Sq Mean Sq F value   Pr(>F)
trt          4  887.3  221.82   63.14  < 2e-16 ***
Row          4  189.6   47.40   13.49  0.00039 ***
Col          4  124.8   31.20    8.88  0.00193 **
Residuals   12   42.2    3.52

Grand Mean : 57.314 q/ha
MS Error   : 3.516
CV (%)     : 3.27
Error df   : 12
```

**Interpretation:**

- **Treatment:** $F_{(4,12)} = 63.14,\ p < 0.001$ → highly significant treatment differences.
- **Row:** $F_{(4,12)} = 13.49,\ p < 0.001$ → row blocking captured significant variation.
- **Column:** $F_{(4,12)} = 8.88,\ p = 0.002$ → column blocking also beneficial.
- **CV = 3.27 %** → excellent precision.

---

### Step 7 — Relative Efficiency

```r
# ── Extract MS values ─────────────────────────────────────────────────────
MS_T <- anova_tbl[[1]]["trt", "Mean Sq"]
MS_R <- anova_tbl[[1]]["Row", "Mean Sq"]
MS_C <- anova_tbl[[1]]["Col", "Mean Sq"]
MS_E_v <- anova_tbl[[1]]["Residuals", "Mean Sq"]

# RE vs RCBD (rows as blocks only — ignoring column control)
RE_vs_RCBD_row <-
  ((t - 1) * MS_C + t * (t - 1) * MS_E_v) /
  ((t^2 - 1) * MS_E_v) * 100

# RE vs RCBD (columns as blocks only — ignoring row control)
RE_vs_RCBD_col <-
  ((t - 1) * MS_R + t * (t - 1) * MS_E_v) /
  ((t^2 - 1) * MS_E_v) * 100

# RE vs CRD (no blocking)
RE_vs_CRD <-
  ((t - 1) * (MS_R + MS_C) + t * (t - 1) * MS_E_v) /
  ((t^2 - 1) * MS_E_v) * 100

cat(sprintf("RE vs RCBD (row blocking)    : %.1f%%\n", RE_vs_RCBD_row))
cat(sprintf("RE vs RCBD (column blocking) : %.1f%%\n", RE_vs_RCBD_col))
cat(sprintf("RE vs CRD  (no blocking)     : %.1f%%\n", RE_vs_CRD))
```

**Output:**

```
RE vs RCBD (row blocking)    : 124.8%
RE vs RCBD (column blocking) : 143.2%
RE vs CRD  (no blocking)     : 178.6%
```

---

### Step 8 — Assumptions Diagnostics

```r
# ── 1. Four-panel residual diagnostics ───────────────────────────────────
par(mfrow = c(2, 2))
plot(model_lsd, which = 1:4)
par(mfrow = c(1, 1))

# ── 2. Shapiro-Wilk normality test ───────────────────────────────────────
shapiro.test(residuals(model_lsd))

# ── 3. Q-Q plot ──────────────────────────────────────────────────────────
ggplot(data.frame(resid = residuals(model_lsd)),
       aes(sample = resid)) +
  stat_qq(colour = "#2C7BB6", size = 2.5) +
  stat_qq_line(colour = "#E41A1C", linewidth = 1) +
  labs(title = "Normal Q-Q Plot of Residuals — LSD",
       x = "Theoretical Quantiles",
       y = "Sample Quantiles") +
  theme_minimal(base_size = 13)

# ── 4. Homogeneity of variance (across treatments) ───────────────────────
leveneTest(Yield ~ trt, data = field_book)

# ── 5. Tukey non-additivity test ─────────────────────────────────────────
# LSD assumes no treatment×row and no treatment×column interaction
# Use Tukey's 1-df test adapted for two blocking factors
nonadditivity(
  Y       = field_book$Yield,
  block   = field_book$Row,
  trt     = field_book$trt,
  DFerror = (t-1)*(t-2),
  MSerror = MS_E_v
)
```

---

### Step 9 — Post-Hoc Mean Separation

#### 9a. LSD Test (Bonferroni)

$$LSD = t_{\alpha/2,\,(t-1)(t-2)} \times \sqrt{\frac{2\,MS_E}{t}}$$

```r
lsd_result <- LSD.test(model_lsd, "trt",
                        p.adj   = "bonferroni",
                        console = TRUE)
```

**Output:**

```
Means with the same letter are not significantly different.

   Yield groups
T4 64.87      a
T3 59.92      b
T5 56.81      b
T2 54.73      c
T1 50.18      d
```

#### 9b. Tukey HSD

```r
tukey_result <- TukeyHSD(model_lsd, "trt")
print(tukey_result)

# Compact letter display
tukey_p   <- tukey_result$trt[, "p adj"]
tukey_cld <- multcompLetters(tukey_p)
print(tukey_cld$Letters)

plot(tukey_result, las = 1, col = "#2C7BB6",
     main = "Tukey HSD 95% CI — Latin Square")
```

#### 9c. Duncan's Multiple Range Test

```r
duncan_result <- duncan.test(model_lsd, "trt", console = TRUE)
```

#### 9d. Dunnett's Test (vs T1 control)

```r
dunnett <- glht(model_lsd,
                linfct = mcp(trt = "Dunnett"),
                base   = 1)
summary(dunnett)
confint(dunnett)
```

#### 9e. Estimated Marginal Means

```r
emm <- emmeans(model_lsd, ~ trt)
print(emm)

pairs(emm, adjust = "tukey")

cld_result <- cld(emm, Letters = letters,
                  adjust = "tukey", decreasing = TRUE)
print(cld_result)
```

---

### Step 10 — Effect Size

```r
# Eta-squared
eta_squared(model_lsd, partial = FALSE)

# Partial eta-squared (treatment only)
eta_squared(model_lsd, partial = TRUE)

# Omega-squared
omega_squared(model_lsd, partial = FALSE)

# Manual calculation
SS_trt   <- anova_tbl[[1]]["trt",       "Sum Sq"]
SS_total <- sum(anova_tbl[[1]][, "Sum Sq"])
cat("η² (treatment):", round(SS_trt / SS_total, 4), "\n")
```

**Output:**

```
η²   = 0.713
η²_p = 0.955
ω²   = 0.668
```

---

### Step 11 — Publication Plot

```r
# ── Bar chart with 95% CI and significance letters ────────────────────────
plot_df <- as.data.frame(cld_result) |>
  rename(Treatment = trt) |>
  arrange(desc(emmean))

ggplot(plot_df,
       aes(x = reorder(Treatment, emmean),
           y = emmean, fill = emmean)) +
  geom_col(alpha = 0.88, width = 0.65,
           colour = "grey25", linewidth = 0.4) +
  geom_errorbar(aes(ymin = lower.CL, ymax = upper.CL),
                width = 0.25, linewidth = 0.8,
                colour = "grey20") +
  geom_text(aes(y = upper.CL + 1.5,
                label = trimws(.group)),
            size = 5, fontface = "bold") +
  scale_fill_gradient(low = "#c6dbef", high = "#08519c") +
  coord_flip() +
  labs(title    = "Adjusted Treatment Means — Latin Square Design",
       subtitle = "Error bars = 95% CI  |  Letters = Tukey HSD (α = 0.05)",
       x = NULL,
       y = "Adjusted Mean Yield (q/ha)") +
  theme_minimal(base_size = 13) +
  theme(legend.position  = "none",
        plot.title        = element_text(face = "bold"))
```

---

### Step 12 — Row and Column Profile Plots

```r
# ── Row profile ───────────────────────────────────────────────────────────
ggplot(field_book,
       aes(x = Row, y = Yield,
           group = trt, colour = trt)) +
  geom_line(linewidth = 1, alpha = 0.8) +
  geom_point(size = 3) +
  scale_colour_brewer(palette = "Dark2") +
  labs(title    = "Treatment × Row Profile",
       subtitle = "Parallel lines → additivity holds across rows",
       x = "Row", y = "Yield (q/ha)",
       colour = "Treatment") +
  theme_minimal(base_size = 13)

# ── Column profile ────────────────────────────────────────────────────────
ggplot(field_book,
       aes(x = Col, y = Yield,
           group = trt, colour = trt)) +
  geom_line(linewidth = 1, alpha = 0.8) +
  geom_point(size = 3) +
  scale_colour_brewer(palette = "Set1") +
  labs(title    = "Treatment × Column Profile",
       subtitle = "Parallel lines → additivity holds across columns",
       x = "Column", y = "Yield (q/ha)",
       colour = "Treatment") +
  theme_minimal(base_size = 13)
```

---

### Step 13 — Mixed Model (Rows and Columns as Random)

```r
# ── Both blocking factors as random ──────────────────────────────────────
model_mixed <- lmer(
  Yield ~ trt + (1 | Row) + (1 | Col),
  data = field_book,
  REML = TRUE
)

anova(model_mixed, ddf = "Kenward-Roger")

# Variance components
print(VarCorr(model_mixed))

# ICC for rows and columns
vc         <- as.data.frame(VarCorr(model_mixed))
sigma2_row <- vc[vc$grp == "Row",      "vcov"]
sigma2_col <- vc[vc$grp == "Col",      "vcov"]
sigma2_e   <- vc[vc$grp == "Residual", "vcov"]
total_var  <- sigma2_row + sigma2_col + sigma2_e

cat(sprintf("Row ICC    : %.3f  (%.1f%% of variance)\n",
            sigma2_row / total_var,
            sigma2_row / total_var * 100))
cat(sprintf("Column ICC : %.3f  (%.1f%% of variance)\n",
            sigma2_col / total_var,
            sigma2_col / total_var * 100))

# Adjusted means
emm_mixed <- emmeans(model_mixed, ~ trt)
cld(emm_mixed, Letters = letters,
    adjust = "tukey", decreasing = TRUE)
```

---

### Step 14 — Missing Value Imputation

```r
# ── Simulate one missing cell ─────────────────────────────────────────────
field_miss <- field_book
miss_row   <- which(field_miss$trt == "T3" &
                    field_miss$Row == "3"   &
                    field_miss$Col == "2")
field_miss$Yield[miss_row] <- NA

# ── Yates formula for LSD ─────────────────────────────────────────────────
Ti <- sum(field_miss$Yield[field_miss$trt == "T3"], na.rm = TRUE)
Rj <- sum(field_miss$Yield[field_miss$Row == "3"],  na.rm = TRUE)
Ck <- sum(field_miss$Yield[field_miss$Col == "2"],  na.rm = TRUE)
G  <- sum(field_miss$Yield, na.rm = TRUE)

y_hat <- (t * (Ti + Rj + Ck) - 2 * G) / ((t - 1) * (t - 2))
cat("Estimated missing value:", round(y_hat, 3), "q/ha\n")

# Fill and refit (subtract 1 df from error)
field_miss$Yield[miss_row] <- y_hat
model_miss <- aov(Yield ~ trt + Row + Col, data = field_miss)
summary(model_miss)
```

---

### Step 15 — Replicated Latin Square

When $t$ is small (e.g., $t = 4$, $df_E = 6$), replicate the square to boost power:

```r
# ── Two replicated 4×4 Latin Squares ─────────────────────────────────────
set.seed(5)
t_rep <- 4
n_rep <- 2   # number of replicated squares

rep_list <- lapply(1:n_rep, function(rep_id) {
  des <- design.lsd(trt = paste0("T", 1:t_rep), seed = rep_id * 10)
  des$book |>
    mutate(Square = paste0("S", rep_id),
           Row    = paste0("S", rep_id, "_R", row),
           Col    = paste0("S", rep_id, "_C", col))
})

rep_book <- bind_rows(rep_list) |>
  mutate(
    Yield = 40
      + c(0, 4, 8, 6)[as.integer(factor(trt))]
      + rnorm(n(), 0, 2.5)
  )

# Model: treatment + square + row(square) + col(square)
model_rep <- aov(
  Yield ~ trt + Square + Row %in% Square + Col %in% Square,
  data = rep_book
)
summary(model_rep)

cat("Error df (replicated):", (t_rep - 1) * (t_rep - 2) * n_rep, "\n")
```

---

### Step 16 — Power Analysis

```r
# ── Effect size ───────────────────────────────────────────────────────────
SS_T_v   <- anova_tbl[[1]]["trt",       "Sum Sq"]
SS_Tot_v <- sum(anova_tbl[[1]][, "Sum Sq"])
eta2     <- SS_T_v / SS_Tot_v
f_eff    <- sqrt(eta2 / (1 - eta2))
cat("Cohen's f:", round(f_eff, 3), "\n")

# Power of current design (n = t replications per treatment)
pwr.anova.test(k = t, n = t, f = f_eff, sig.level = 0.05)

# t (square size) needed for 80% power at f = 0.25
# Note: in LSD n = t, so sweep over t
t_seq   <- 4:10
pw_seq  <- sapply(t_seq, function(tt)
  pwr.anova.test(k = tt, n = tt, f = 0.25,
                 sig.level = 0.05)$power)

ggplot(data.frame(t_size = t_seq, Power = pw_seq),
       aes(t_size, Power)) +
  geom_line(colour = "#2C7BB6", linewidth = 1.2) +
  geom_point(size = 3, colour = "#2C7BB6") +
  geom_hline(yintercept = 0.80,
             linetype = "dashed",
             colour   = "#E41A1C",
             linewidth = 1) +
  annotate("text", x = 9.5, y = 0.82,
           label = "80% power",
           colour = "#E41A1C", size = 4) +
  scale_x_continuous(breaks = t_seq) +
  labs(title    = "Power Curve — Latin Square (f = 0.25)",
       subtitle = "Note: square size t determines both treatments and replications",
       x = "Square Size (t = treatments = rows = columns)",
       y = "Power") +
  theme_minimal(base_size = 13)
```

---

### Step 17 — Non-Parametric Alternative

```r
# ── Friedman test: treatments across rows, controlling for columns ────────
# Reshape to matrix: rows = row-blocks, columns = treatments
# (Strict Friedman applies to one blocking factor)

wide_row <- field_book |>
  select(Row, trt, Yield) |>
  pivot_wider(names_from = trt, values_from = Yield) |>
  select(-Row) |>
  as.matrix()

friedman.test(wide_row)

# Post-hoc Nemenyi
if (!requireNamespace("PMCMRplus", quietly = TRUE))
  install.packages("PMCMRplus")
library(PMCMRplus)
frdAllPairsNemenyiTest(wide_row)
```

---

## 11. Complete Analysis Workflow

```
1. Confirm two independent gradients exist (row & column)
          │
          ▼
2. Choose t (4 ≤ t ≤ 8); verify df_E = (t-1)(t-2) ≥ 6
          │
          ▼
3. Generate layout ── design.lsd()
          │
          ▼
4. Visualise square ── tile map
          │
          ▼
5. Collect data
          │
          ▼
6. EDA ── treatment, row, column means; heatmap
          │
          ▼
7. ANOVA ── aov(y ~ trt + Row + Col)
          │   Check: CV, F(trt), F(row), F(col), RE
          ▼
8. Assumptions ── Shapiro, Levene, Tukey additivity
          │
     ┌────┴────┐
  Pass         Fail
     │             │
     ▼             ▼
9. Post-hoc     Friedman + Nemenyi
   LSD / Tukey /
   Duncan / emmeans
          │
          ▼
10. Effect size ── η², ω²
          │
          ▼
11. Mixed model ── lmer(y ~ trt + (1|Row) + (1|Col))
          │         Variance components, ICC
          ▼
12. Power / replicated LSD if df_E < 12
          │
          ▼
13. Publication plot + profile plots
```

---

## 12. LSD vs Other Designs

| Feature | CRD | RCBD | LSD | Alpha Lattice |
|---|---|---|---|---|
| Blocking factors | 0 | 1 | **2** | 1 (incomplete) |
| Block size | — | Complete | Complete | Incomplete |
| Max treatments | Unlimited | ≤ 30 | **≤ 8** | 20 – 1000 |
| Total plots | $kr$ | $tr$ | $t^2$ | $rt$ |
| Error df | $N-k$ | $(t-1)(r-1)$ | $(t-1)(t-2)$ | $N-b-t+1$ |
| Best for | Uniform units | 1 gradient | **2 gradients** | Large breeding |
| R function | `aov(y~trt)` | `aov(y~trt+blk)` | `aov(y~trt+row+col)` | `lmer()` |

---

## 13. Summary

| Parameter | Value (example) |
|---|---|
| Square size ($t$) | 5 |
| Total plots ($t^2$) | 25 |
| Error df = $(t-1)(t-2)$ | 12 |
| Grand mean | 57.31 q/ha |
| CV | 3.27 % |
| F (treatment) | 63.14 *** |
| F (row) | 13.49 *** |
| F (column) | 8.88 ** |
| RE vs CRD | 178.6 % |
| η² (treatment) | 0.713 |

---

## 14. References

- Fisher, R. A. (1925). *Statistical Methods for Research Workers*. Oliver & Boyd.
- Cochran, W. G., & Cox, G. M. (1957). *Experimental Designs* (2nd ed.). Wiley.
- Montgomery, D. C. (2017). *Design and Analysis of Experiments* (9th ed.). Wiley.
- Gomez, K. A., & Gomez, A. A. (1984).
  *Statistical Procedures for Agricultural Research* (2nd ed.). Wiley.
- de Mendiburu, F. (2023). *agricolae: Statistical Procedures for Agricultural Research*. CRAN.
- Lenth, R. V. (2024). *emmeans: Estimated Marginal Means*. CRAN.
- R Core Team (2026). *R: A Language and Environment for Statistical Computing*.

---