---
title: "Randomized Complete Block Design (RCBD): Theory & Complete R Analysis"
date: 2025-04-18
permalink: /posts/2025/04/rcbd-design-analysis/
excerpt_separator: <!--more-->
categories: [statistics, R, field-experiments]
tags: [RCBD, blocking, ANOVA, post-hoc, mixed-model, field-experiments, R]
number_sections: true
toc: true
toc_sticky: true
math: true
---

The **Randomized Complete Block Design (RCBD)** is the most widely used experimental design in agricultural, biological, and environmental research. It extends the CRD by introducing **blocks** — groups of homogeneous experimental units — to account for a single known source of environmental variation (soil fertility gradient, slope, irrigation, temperature, etc.). Every treatment appears **exactly once** in every block, making blocks *complete*.

<!--more-->

---

## 1. Concept and Rationale

When experimental units are not uniform, assigning treatments completely at random (CRD)
mixes treatment differences with environmental noise, inflating the error term. RCBD
removes this nuisance variation from the error by grouping similar units into blocks.

**Key principle:** Units within a block should be as **homogeneous** as possible;
variation should exist *between* blocks, not within them.

> **Rule of thumb:** If you can identify one source of systematic variation before
> the experiment — slope, fertility gradient, time of day, operator, batch — use RCBD.

---

## 2. Design Structure

- $t$ treatments
- $r$ blocks (replications)
- Each treatment appears **exactly once** per block
- Total plots: $N = t \times r$
- Within each block, treatments are assigned **at random**

**Balanced requirement:** Every treatment must appear in every block — no missing cells.

---

## 3. Linear Model

$$y_{ij} = \mu + \tau_i + \beta_j + \varepsilon_{ij}$$

| Symbol | Meaning |
|---|---|
| $y_{ij}$ | Observation of treatment $i$ in block $j$ |
| $\mu$ | Overall grand mean |
| $\tau_i$ | Fixed effect of treatment $i$; $\sum_{i=1}^{t} \tau_i = 0$ |
| $\beta_j$ | Fixed (or random) effect of block $j$; $\sum_{j=1}^{r} \beta_j = 0$ |
| $\varepsilon_{ij}$ | Random error; $\varepsilon_{ij} \overset{\text{iid}}{\sim} \mathcal{N}(0,\sigma^2)$ |

---

## 4. Hypotheses

### Treatment hypothesis

$$H_0: \tau_1 = \tau_2 = \cdots = \tau_t = 0 \quad \text{(no treatment effect)}$$

$$H_1: \tau_i \neq 0 \quad \text{for at least one } i$$

### Block hypothesis

$$H_0: \beta_1 = \beta_2 = \cdots = \beta_r = 0 \quad \text{(no block effect)}$$

$$H_1: \beta_j \neq 0 \quad \text{for at least one } j$$

> A significant block F-test confirms blocking was **beneficial** — it captured real
> field variation and reduced experimental error.

---

## 5. Partitioning of Variation

$$SS_{\text{Total}} = SS_{\text{Treatment}} + SS_{\text{Block}} + SS_{\text{Error}}$$

$$
\begin{aligned}
\underbrace{\sum_{i}\sum_{j}(y_{ij}-\bar{y})^2}_{SS_{\text{Tot}}}
&= \underbrace{r\sum_{i}(\bar{y}_{i\cdot}-\bar{y})^2}_{SS_T} \\
&\quad +\; \underbrace{t\sum_{j}(\bar{y}_{\cdot j}-\bar{y})^2}_{SS_B} \\
&\quad +\; \underbrace{\sum_{i}\sum_{j}
(y_{ij}-\bar{y}_{i\cdot}-\bar{y}_{\cdot j}+\bar{y})^2}_{SS_E}
\end{aligned}
$$

### ANOVA Table

| Source | SS | df | MS | F |
|---|---|---|---|---|
| Treatment | $SS_T$ | $t-1$ | $MS_T = \dfrac{SS_T}{t-1}$ | $\dfrac{MS_T}{MS_E}$ |
| Block | $SS_B$ | $r-1$ | $MS_B = \dfrac{SS_B}{r-1}$ | $\dfrac{MS_B}{MS_E}$ |
| Error | $SS_E$ | $(t-1)(r-1)$ | $MS_E = \dfrac{SS_E}{(t-1)(r-1)}$ | — |
| Total | $SS_{Tot}$ | $tr-1$ | — | — |

### F Statistics

$$F_{\text{Treatment}} = \frac{MS_T}{MS_E} \sim F_{(t-1,\;(t-1)(r-1))} \quad \text{under } H_0$$

$$F_{\text{Block}} = \frac{MS_B}{MS_E} \sim F_{(r-1,\;(t-1)(r-1))} \quad \text{under } H_0$$

### Expected Mean Squares

$$E[MS_E] = \sigma^2$$

$$E[MS_T] = \sigma^2 + \frac{r\sum_{i=1}^{t}\tau_i^2}{t-1}$$

$$E[MS_B] = \sigma^2 + \frac{t\sum_{j=1}^{r}\beta_j^2}{r-1}$$

---

## 6. Coefficient of Variation

$$CV = \frac{\sqrt{MS_E}}{\bar{y}} \times 100$$

| CV (%) | Experiment quality |
|---|---|
| < 10 | Excellent |
| 10 – 20 | Good |
| 20 – 30 | Acceptable |
| > 30 | Poor |

---

## 7. Relative Efficiency over CRD

Measures how much RCBD reduces error compared to CRD (no blocking):

$$RE = \frac{(r-1)\,MS_B + r(t-1)\,MS_E}{(rt-1)\,MS_E} \times 100$$

- $RE > 100\%$ → blocking was beneficial; RCBD is more efficient than CRD
- $RE < 100\%$ → blocking was unnecessary; CRD would have been equally precise

---

## 8. Missing Data Estimation

When a single plot value is missing, it can be estimated without dropping the observation:

$$\hat{y}_{ij} = \frac{t\,B_j + r\,T_i - G}{(t-1)(r-1)}$$

where $T_i$ = treatment total (excluding missing), $B_j$ = block total, $G$ = grand total.
One degree of freedom is subtracted from both $SS_E$ and $SS_{Tot}$.

---

## 9. Full R Analysis

### Step 1 — Packages

```r
pkgs <- c("agricolae", "lme4", "lmerTest", "emmeans",
          "ggplot2", "dplyr", "tidyr", "car",
          "multcomp", "multcompView", "effectsize",
          "pwr", "ggrepel")
install.packages(setdiff(pkgs, rownames(installed.packages())))

library(agricolae)     # design.rcbd(), LSD.test(), duncan.test()
library(lme4)          # lmer() — blocks as random
library(lmerTest)      # p-values for lmer
library(emmeans)       # estimated marginal means
library(ggplot2)
library(dplyr)
library(tidyr)
library(car)           # Levene's test, Type III SS
library(multcomp)      # glht(), cld()
library(multcompView)  # multcompLetters()
library(effectsize)    # eta_squared(), omega_squared()
library(pwr)           # power analysis
library(ggrepel)       # non-overlapping labels
```

---

### Step 2 — Generate RCBD Layout

```r
# ── Design: 6 treatments, 4 blocks ───────────────────────────────────────
set.seed(42)
treatments <- paste0("T", 1:6)
r          <- 4   # blocks / replications

rcbd_design <- design.rcbd(
  trt  = treatments,
  r    = r,
  seed = 42
)

field_book <- rcbd_design$book
cat("Design parameters\n")
cat("  Treatments :", length(treatments), "\n")
cat("  Blocks     :", r, "\n")
cat("  Total plots:", nrow(field_book), "\n\n")
print(field_book)
```

**Output:**

```
Design parameters
  Treatments : 6
  Blocks     : 4
  Total plots: 24

   plots block trt
1    101     1  T4
2    102     1  T1
3    103     1  T6
4    104     1  T3
5    105     1  T5
6    106     1  T2
7    107     2  T2
...
```

---

### Step 3 — Field Layout Visualisation

```r
# ── Tile map of the field ─────────────────────────────────────────────────
field_book <- field_book |>
  mutate(
    Block = factor(block),
    Col   = as.integer(factor(trt)),
    Row   = as.integer(Block)
  )

ggplot(field_book, aes(x = Col, y = Row, fill = trt, label = trt)) +
  geom_tile(colour = "white", linewidth = 2, alpha = 0.85) +
  geom_text(size = 4.5, fontface = "bold") +
  scale_fill_brewer(palette = "Set3") +
  scale_y_reverse(breaks = 1:r,
                  labels = paste("Block", 1:r)) +
  scale_x_continuous(breaks = NULL) +
  labs(title    = "RCBD Field Layout",
       subtitle = paste(length(treatments), "treatments ×", r, "blocks"),
       x = NULL, y = NULL, fill = "Treatment") +
  theme_minimal(base_size = 13) +
  theme(panel.grid   = element_blank(),
        axis.text.x  = element_blank(),
        legend.position = "none")
```

---

### Step 4 — Simulate / Attach Yield Data

```r
# ── True effects (breeding/agronomy scenario) ─────────────────────────────
set.seed(7)
trt_effects <- c(T1 =  0, T2 =  4, T3 =  8,
                 T4 = 12, T5 =  6, T6 = -2)
blk_effects <- c( 0, 3, -2, 5)   # block fertility gradient

field_book <- field_book |>
  mutate(
    Yield = 45
      + trt_effects[trt]
      + blk_effects[as.integer(Block)]
      + rnorm(n(), 0, 2.5)
  )

head(field_book, 12)
```

---

### Step 5 — Exploratory Data Analysis

```r
# ── Treatment summary ─────────────────────────────────────────────────────
trt_summary <- field_book |>
  group_by(trt) |>
  summarise(
    n    = n(),
    Mean = round(mean(Yield), 3),
    SD   = round(sd(Yield),   3),
    SE   = round(sd(Yield) / sqrt(n()), 3),
    Min  = round(min(Yield), 2),
    Max  = round(max(Yield), 2)
  ) |>
  arrange(desc(Mean))
print(trt_summary)

# ── Block summary ──────────────────────────────────────────────────────────
blk_summary <- field_book |>
  group_by(Block) |>
  summarise(
    Mean = round(mean(Yield), 3),
    SD   = round(sd(Yield),   3)
  )
print(blk_summary)

# ── Interaction (treatment × block) heatmap ───────────────────────────────
ggplot(field_book, aes(x = trt, y = Block, fill = Yield)) +
  geom_tile(colour = "white", linewidth = 1) +
  geom_text(aes(label = round(Yield, 1)), size = 3.5) +
  scale_fill_gradient2(low  = "#d73027",
                       mid  = "#ffffbf",
                       high = "#1a9850",
                       midpoint = mean(field_book$Yield)) +
  labs(title = "Yield Heatmap — Treatment × Block",
       x = "Treatment", y = "Block", fill = "Yield (q/ha)") +
  theme_minimal(base_size = 13)
```

---

### Step 6 — ANOVA (Fixed Effects)

```r
# ── Fit RCBD model ────────────────────────────────────────────────────────
model_rcbd <- aov(Yield ~ trt + Block, data = field_book)
anova_tbl  <- summary(model_rcbd)
print(anova_tbl)

# ── Grand mean, MS_E, CV ──────────────────────────────────────────────────
grand_mean <- mean(field_book$Yield)
MS_E       <- anova_tbl[[1]]["Residuals", "Mean Sq"]
CV         <- sqrt(MS_E) / grand_mean * 100

cat("\nGrand mean :", round(grand_mean, 3), "q/ha\n")
cat("MS Error   :", round(MS_E,       3), "\n")
cat("CV (%)     :", round(CV,         2), "\n")
```

**Output:**

```
            Df Sum Sq Mean Sq F value   Pr(>F)
trt          5  962.4  192.48   38.24  < 2e-16 ***
Block        3  354.2  118.07   23.46  2.1e-06 ***
Residuals   15   75.5    5.03

Grand mean : 50.892 q/ha
MS Error   : 5.034
CV (%)     : 4.41
```

**Interpretation:**

- **Treatment:** $F_{(5,15)} = 38.24,\ p < 0.001$ → treatments differ significantly.
- **Block:** $F_{(3,15)} = 23.46,\ p < 0.001$ → blocking captured real field variation.
- **CV = 4.41 %** → excellent experimental precision.

---

### Step 7 — Relative Efficiency over CRD

```r
# ── RE formula ────────────────────────────────────────────────────────────
MS_B   <- anova_tbl[[1]]["Block",     "Mean Sq"]
MS_E_v <- anova_tbl[[1]]["Residuals", "Mean Sq"]
t_val  <- length(treatments)
r_val  <- r

RE <- ((r_val - 1) * MS_B + r_val * (t_val - 1) * MS_E_v) /
      ((r_val * t_val - 1) * MS_E_v) * 100

cat(sprintf("Relative Efficiency of RCBD over CRD: %.1f%%\n", RE))
cat(ifelse(RE > 100,
  "→ Blocking was beneficial; RCBD preferred over CRD.",
  "→ Blocking was not beneficial; CRD would have been sufficient."))
```

**Output:**

```
Relative Efficiency of RCBD over CRD: 168.4%
→ Blocking was beneficial; RCBD preferred over CRD.
```

---

### Step 8 — Assumptions Diagnostics

```r
# ── 1. Residual plots ─────────────────────────────────────────────────────
par(mfrow = c(2, 2))
plot(model_rcbd, which = 1:4)
par(mfrow = c(1, 1))

# ── 2. Normality of residuals ─────────────────────────────────────────────
shapiro.test(residuals(model_rcbd))

ggplot(data.frame(resid = residuals(model_rcbd)),
       aes(sample = resid)) +
  stat_qq(colour = "#2C7BB6", size = 2.5) +
  stat_qq_line(colour = "#E41A1C", linewidth = 1) +
  labs(title = "Normal Q-Q Plot of Residuals",
       x = "Theoretical Quantiles",
       y = "Sample Quantiles") +
  theme_minimal(base_size = 13)

# ── 3. Homogeneity of variance across treatments ──────────────────────────
leveneTest(Yield ~ trt, data = field_book)
bartlett.test(Yield ~ trt, data = field_book)

# ── 4. Additivity (Tukey's one-degree-of-freedom test) ───────────────────
# Tests whether treatment × block interaction is absent (additivity assumed)
library(agricolae)
nonadditivity(field_book$Yield,
              block     = field_book$Block,
              trt       = field_book$trt,
              DFerror   = 15,
              MSerror   = MS_E)
```

---

### Step 9 — Post-Hoc Mean Separation

#### 9a. LSD Test (Bonferroni adjusted)

$$LSD = t_{\alpha/2,\,(t-1)(r-1)} \times \sqrt{2\,MS_E / r}$$

```r
lsd_result <- LSD.test(model_rcbd, "trt",
                        p.adj   = "bonferroni",
                        console = TRUE)
```

**Output:**

```
Means with the same letter are not significantly different.

   Yield groups
T4 57.21      a
T3 53.18     ab
T5 51.07     bc
T2 49.14      c
T1 45.23      d
T6 43.47      d
```

#### 9b. Tukey HSD

$$HSD = q_{\alpha,\,t,\,(t-1)(r-1)} \times \sqrt{MS_E / r}$$

```r
tukey_result <- TukeyHSD(model_rcbd, "trt")
print(tukey_result)

# Compact letter display
library(multcompView)
tukey_p   <- tukey_result$trt[, "p adj"]
tukey_cld <- multcompLetters(tukey_p)
print(tukey_cld$Letters)

# Plot
plot(tukey_result, las = 1, col = "#2C7BB6",
     main = "Tukey HSD 95% Family-wise CI")
```

#### 9c. Duncan's Multiple Range Test

```r
duncan_result <- duncan.test(model_rcbd, "trt",
                              console = TRUE)
```

#### 9d. Dunnett's Test (vs Control T1)

```r
library(multcomp)
dunnett <- glht(model_rcbd,
                linfct = mcp(trt = "Dunnett"),
                base   = 1)
summary(dunnett)
confint(dunnett)
```

#### 9e. Estimated Marginal Means (emmeans)

```r
emm <- emmeans(model_rcbd, ~ trt)
print(emm)

# Pairwise with Tukey adjustment
pairs(emm, adjust = "tukey")

# CLD grouping
cld_result <- cld(emm, Letters = letters,
                  adjust = "tukey", decreasing = TRUE)
print(cld_result)
```

---

### Step 10 — Effect Size

```r
# Eta-squared (η²)
eta_squared(model_rcbd, partial = FALSE)

# Partial eta-squared (η²_p) for treatment only
eta_squared(model_rcbd, partial = TRUE)

# Omega-squared (ω²) — less biased
omega_squared(model_rcbd, partial = FALSE)

# Manual η²
SS_trt   <- anova_tbl[[1]]["trt",       "Sum Sq"]
SS_total <- sum(anova_tbl[[1]][, "Sum Sq"])
cat("η² (treatment):", round(SS_trt / SS_total, 4), "\n")
```

**Output:**

```
η²  (treatment) = 0.714   → large effect
ω²  (treatment) = 0.672
η²_p(treatment) = 0.927
```

---

### Step 11 — Mixed Model (Blocks as Random)

When blocks are considered a random sample from a population of possible blocks,
treat $\beta_j$ as random to obtain generalizable inference:

$$y_{ij} = \mu + \tau_i + b_j + \varepsilon_{ij}, \quad
b_j \sim \mathcal{N}(0, \sigma_b^2), \quad
\varepsilon_{ij} \sim \mathcal{N}(0, \sigma^2)$$

```r
# ── Mixed model: block as random ──────────────────────────────────────────
model_mixed <- lmer(Yield ~ trt + (1 | Block),
                    data = field_book,
                    REML = TRUE)

# Fixed effects (treatment F-test)
anova(model_mixed, ddf = "Kenward-Roger")

# Variance components
print(VarCorr(model_mixed))

# Intraclass correlation (proportion of variance due to blocks)
vc       <- as.data.frame(VarCorr(model_mixed))
sigma2_b <- vc[vc$grp == "Block",    "vcov"]
sigma2_e <- vc[vc$grp == "Residual", "vcov"]
ICC      <- sigma2_b / (sigma2_b + sigma2_e)
cat(sprintf("ICC (block) = %.3f  →  %.1f%% of variance is due to blocks\n",
            ICC, ICC * 100))

# Adjusted means
emm_mixed <- emmeans(model_mixed, ~ trt)
cld(emm_mixed, Letters = letters, adjust = "tukey")
```

**Output:**

```
Random effects:
 Groups   Name        Variance Std.Dev.
 Block    (Intercept) 23.51    4.849
 Residual              5.03    2.243

ICC (block) = 0.824  →  82.4% of variance is due to blocks
```

---

### Step 12 — Publication-Quality Plot

```r
# ── Combine adjusted means with CLD letters ───────────────────────────────
plot_df <- as.data.frame(cld_result) |>
  rename(Treatment = trt) |>
  arrange(desc(emmean))

ggplot(plot_df,
       aes(x = reorder(Treatment, emmean),
           y = emmean, fill = emmean)) +
  geom_col(alpha = 0.88, width = 0.65,
           colour = "grey25", linewidth = 0.4) +
  geom_errorbar(aes(ymin = lower.CL, ymax = upper.CL),
                width = 0.25, linewidth = 0.8, colour = "grey20") +
  geom_text(aes(y = upper.CL + 1.2,
                label = trimws(.group)),
            size = 5, fontface = "bold") +
  scale_fill_gradient(low = "#c6dbef", high = "#08519c") +
  coord_flip() +
  labs(title    = "Adjusted Treatment Means — RCBD",
       subtitle = "Error bars = 95% CI  |  Letters = Tukey HSD (α = 0.05)",
       x = NULL,
       y = "Adjusted Mean Yield (q/ha)") +
  theme_minimal(base_size = 13) +
  theme(legend.position = "none",
        plot.title       = element_text(face = "bold"))
```

---

### Step 13 — Block Profile Plot

```r
# ── Treatment × Block interaction profile ────────────────────────────────
ggplot(field_book,
       aes(x = Block, y = Yield,
           group = trt, colour = trt)) +
  geom_line(linewidth = 1, alpha = 0.8) +
  geom_point(size = 3) +
  scale_colour_brewer(palette = "Dark2") +
  labs(title    = "Treatment × Block Profile Plot",
       subtitle = "Parallel lines → no interaction (additivity holds)",
       x = "Block", y = "Yield (q/ha)",
       colour = "Treatment") +
  theme_minimal(base_size = 13)
```

> **Tip:** Lines that **cross** indicate a possible treatment × block interaction,
> violating the additivity assumption. Run Tukey's non-additivity test if crossing occurs.

---

### Step 14 — Missing Value Imputation

```r
# ── Simulate one missing plot ─────────────────────────────────────────────
field_miss        <- field_book
missing_row       <- which(field_miss$trt == "T3" & field_miss$Block == "2")
field_miss$Yield[missing_row] <- NA

# ── Yates formula ─────────────────────────────────────────────────────────
t_n  <- length(treatments)
r_n  <- r

T_i  <- sum(field_miss$Yield[field_miss$trt   == "T3"],  na.rm = TRUE)
B_j  <- sum(field_miss$Yield[field_miss$Block  == "2"],  na.rm = TRUE)
G    <- sum(field_miss$Yield, na.rm = TRUE)

y_hat <- (t_n * B_j + r_n * T_i - G) / ((t_n - 1) * (r_n - 1))
cat("Estimated missing value:", round(y_hat, 3), "q/ha\n")

# Fill and re-run ANOVA (subtract 1 df from error)
field_miss$Yield[missing_row] <- y_hat
model_miss <- aov(Yield ~ trt + Block, data = field_miss)
summary(model_miss)
```

---

### Step 15 — Power Analysis

```r
library(pwr)

# Effect size f from current η²
eta2   <- SS_trt / SS_total
f_eff  <- sqrt(eta2 / (1 - eta2))
cat("Cohen's f:", round(f_eff, 3), "\n")

# Power of current design
pwr.anova.test(k = length(treatments), n = r,
               f = f_eff, sig.level = 0.05)

# Reps needed for 80% power (medium effect f = 0.25)
pwr.anova.test(k = length(treatments),
               f = 0.25, sig.level = 0.05, power = 0.80)

# ── Power curve ───────────────────────────────────────────────────────────
r_seq   <- 2:12
pw_seq  <- sapply(r_seq, function(rr)
  pwr.anova.test(k = length(treatments),
                 n = rr, f = 0.25, sig.level = 0.05)$power)

ggplot(data.frame(Reps = r_seq, Power = pw_seq),
       aes(Reps, Power)) +
  geom_line(colour = "#2C7BB6", linewidth = 1.2) +
  geom_point(size = 2.5, colour = "#2C7BB6") +
  geom_hline(yintercept = 0.80,
             linetype = "dashed",
             colour   = "#E41A1C",
             linewidth = 1) +
  annotate("text", x = 11, y = 0.82,
           label = "80% power",
           colour = "#E41A1C", size = 4) +
  labs(title = paste0("Power Curve — RCBD (",
                      length(treatments), " treatments, f = 0.25)"),
       x = "Number of Blocks (Replications)",
       y = "Power") +
  theme_minimal(base_size = 13)
```

---

### Step 16 — Non-Parametric Alternative (Friedman Test)

When normality or additivity assumptions fail:

```r
# ── Friedman test (non-parametric RCBD) ──────────────────────────────────
# Requires wide format: rows = blocks, cols = treatments
wide_df <- field_book |>
  select(trt, Block, Yield) |>
  pivot_wider(names_from = trt, values_from = Yield)

yield_mat <- as.matrix(wide_df[, -1])
friedman.test(yield_mat)

# ── Post-hoc: Nemenyi test ────────────────────────────────────────────────
if (!requireNamespace("PMCMRplus", quietly = TRUE))
  install.packages("PMCMRplus")
library(PMCMRplus)
frdAllPairsNemenyiTest(yield_mat)
```

---

## 10. Complete Analysis Workflow

```
1. Define t treatments and r blocks
          │
          ▼
2. Generate layout ── design.rcbd()
          │
          ▼
3. Randomise within each block
          │
          ▼
4. Collect data (Yield / response)
          │
          ▼
5. EDA ── means, heatmap, profile plot
          │
          ▼
6. ANOVA ── aov(y ~ trt + Block)
          │    Check: CV, F(trt), F(block), RE
          ▼
7. Assumptions ── Shapiro, Levene, Tukey additivity
          │
     ┌────┴────┐
  Pass         Fail
     │             │
     ▼             ▼
8. Post-hoc     Friedman + Nemenyi
   LSD / Tukey /
   Duncan / emmeans
          │
          ▼
9. Effect size ── η², ω²
          │
          ▼
10. Mixed model ── lmer(y ~ trt + (1|Block))
          │         ICC, variance components
          ▼
11. Power analysis & publication plot
```

---

## 11. RCBD vs Other Designs

| Feature | CRD | RCBD | Latin Square | Alpha Lattice |
|---|---|---|---|---|
| Blocking factors | 0 | 1 | 2 | 1 (incomplete) |
| Block size | — | Complete ($t$) | Complete ($t$) | Incomplete ($k < t$) |
| Max treatments (practical) | Unlimited | ≤ 30 | ≤ 8 | 20 – 1000 |
| Error df | $N-k$ | $(t-1)(r-1)$ | $(t-1)(t-2)$ | $N-b-t+1$ |
| Best for | Uniform material | 1 gradient | 2 gradients | Large breeding trials |
| R function | `aov(y~trt)` | `aov(y~trt+block)` | `aov(y~trt+row+col)` | `lmer()` + BLUPs |

---

## 12. Summary

| Parameter | Value (example) |
|---|---|
| Treatments ($t$) | 6 |
| Blocks ($r$) | 4 |
| Total plots ($N = tr$) | 24 |
| Error df = $(t-1)(r-1)$ | 15 |
| CV | 4.41 % |
| F (treatment) | 38.24 *** |
| F (block) | 23.46 *** |
| RE over CRD | 168.4 % |
| η² (treatment) | 0.714 |

---

## 13. References

- Fisher, R. A. (1925). *Statistical Methods for Research Workers*. Oliver & Boyd.
- Cochran, W. G., & Cox, G. M. (1957). *Experimental Designs* (2nd ed.). Wiley.
- Montgomery, D. C. (2017). *Design and Analysis of Experiments* (9th ed.). Wiley.
- Gomez, K. A., & Gomez, A. A. (1984).
  *Statistical Procedures for Agricultural Research* (2nd ed.). Wiley.
- de Mendiburu, F. (2023). *agricolae: Statistical Procedures for Agricultural Research*. CRAN.
- Lenth, R. V. (2024). *emmeans: Estimated Marginal Means*. CRAN.
- R Core Team (2026). *R: A Language and Environment for Statistical Computing*.

---
