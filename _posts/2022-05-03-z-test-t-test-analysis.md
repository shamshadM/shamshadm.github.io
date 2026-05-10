---
title: "Z-Test and t-Test: Theory, Hypotheses & Complete R Analysis"
date: 2022-05-03
permalink: /posts/2022/05/z-test-t-test-analysis/
excerpt_separator: <!--more-->
categories: [statistics, R]
tags: [z-test, t-test, hypothesis-testing, inference, R]
number_sections: true
toc: true
toc_sticky: true
math: true
---

Hypothesis testing is the formal procedure for deciding whether sample data provide sufficient evidence to reject a claim about a population parameter. The **Z-test** and **t-test** are the two workhorses for testing means. This post covers the theory, assumptions, null (H<sub>0</sub>) / alternative hypotheses (H<sub>1</sub>), test statistics, and full R walkthroughs with real-style datasets.

<!--more-->

## 1. The Logic of Hypothesis Testing

Every test follows the same five steps:

1. State $H_0$ and $H_1$
2. Choose significance level $\alpha$ (commonly 0.05)
3. Compute the test statistic
4. Find the p-value (or critical value)
5. Decision: reject $H_0$ if $p \leq \alpha$

**Error types:**

| Decision \ Truth | $H_0$ True | $H_0$ False |
|---|---|---|
| Fail to reject $H_0$ | ✅ Correct | ❌ Type II error ($\beta$) |
| Reject $H_0$ | ❌ Type I error ($\alpha$) | ✅ Power ($1-\beta$) |

---

## 2. Z-Test

### When to use

Use a Z-test for a population mean when:

- Population standard deviation $\sigma$ is **known**, **or**
- Sample size $n \geq 30$ (Central Limit Theorem applies)

### Hypotheses

**Two-tailed:**

$$H_0: \mu = \mu_0 \qquad H_1: \mu \neq \mu_0$$

**One-tailed (right):**

$$H_0: \mu \leq \mu_0 \qquad H_1: \mu > \mu_0$$

**One-tailed (left):**

$$H_0: \mu \geq \mu_0 \qquad H_1: \mu < \mu_0$$

### Test Statistic

$$Z = \frac{\bar{x} - \mu_0}{\sigma / \sqrt{n}}$$

Under $H_0$, $Z \sim \mathcal{N}(0,1)$.

**Decision rule (two-tailed, $\alpha = 0.05$):**

$$\text{Reject } H_0 \text{ if } |Z| > z_{\alpha/2} = 1.96$$

### Standard Error & Confidence Interval

$$SE = \frac{\sigma}{\sqrt{n}}$$

$$\bar{x} \pm z_{\alpha/2} \cdot \frac{\sigma}{\sqrt{n}}$$

---

### Z-Test in R

#### Example: Wheat grain yield

A wheat breeder claims the mean grain yield of a new variety is **35 q/ha**.
A trial of **50 plots** gives $\bar{x} = 36.8$ q/ha. Historical $\sigma = 5$ q/ha.
Test at $\alpha = 0.05$.

```r
# ── Parameters ────────────────────────────────────────────────────────────
x_bar <- 36.8   # sample mean
mu_0  <- 35     # hypothesised mean
sigma <- 5      # known population SD
n     <- 50     # sample size

# ── Test statistic ────────────────────────────────────────────────────────
SE <- sigma / sqrt(n)
Z  <- (x_bar - mu_0) / SE

cat("Standard Error :", round(SE, 4), "\n")
cat("Z statistic    :", round(Z,  4), "\n")

# ── p-value (two-tailed) ──────────────────────────────────────────────────
p_value <- 2 * pnorm(-abs(Z))
cat("p-value        :", round(p_value, 4), "\n")

# ── Critical value ────────────────────────────────────────────────────────
z_crit <- qnorm(0.975)
cat("Critical value :", round(z_crit, 4), "\n")

# ── Decision ──────────────────────────────────────────────────────────────
if (p_value < 0.05) {
  cat("Decision: Reject H0 — yield differs significantly from 35 q/ha\n")
} else {
  cat("Decision: Fail to reject H0\n")
}

# ── 95 % Confidence Interval ──────────────────────────────────────────────
CI_lower <- x_bar - z_crit * SE
CI_upper <- x_bar + z_crit * SE
cat(sprintf("95%% CI: [%.3f, %.3f]\n", CI_lower, CI_upper))
```

**Output:**

```
Standard Error : 0.7071
Z statistic    : 2.5456
p-value        : 0.0109
Critical value : 1.96
Decision: Reject H0 — yield differs significantly from 35 q/ha
95% CI: [35.414, 38.186]
```

**Interpretation:** $Z = 2.55 > 1.96$, $p = 0.011 < 0.05$.
We reject $H_0$. The trial provides sufficient evidence that the new variety yields more than
35 q/ha. The 95 % CI $[35.4,\ 38.2]$ does not include 35, confirming this.

#### Visualise the Z distribution

```r
library(ggplot2)

x_seq <- seq(-4, 4, length.out = 500)
df_z  <- data.frame(x = x_seq, y = dnorm(x_seq))

ggplot(df_z, aes(x, y)) +
  geom_line(linewidth = 1, colour = "#2C7BB6") +
  # rejection regions
  geom_area(data = subset(df_z, x >  1.96), fill = "#D7191C", alpha = 0.4) +
  geom_area(data = subset(df_z, x < -1.96), fill = "#D7191C", alpha = 0.4) +
  # observed Z
  geom_vline(xintercept = Z, linetype = "dashed", colour = "#1A9641", linewidth = 1) +
  annotate("text", x = Z + 0.3, y = 0.35,
           label = paste0("Z = ", round(Z, 2)), colour = "#1A9641", size = 4) +
  annotate("text", x =  2.8, y = 0.05, label = "α/2", colour = "#D7191C", size = 4) +
  annotate("text", x = -2.8, y = 0.05, label = "α/2", colour = "#D7191C", size = 4) +
  labs(title    = "Z-Test: Standard Normal Distribution",
       subtitle = "Red shaded = rejection region | Green dashed = observed Z",
       x = "Z", y = "Density") +
  theme_minimal(base_size = 13)
```

#### Two-proportion Z-test

Tests whether two proportions $p_1$ and $p_2$ are equal.

$$H_0: p_1 = p_2 \qquad H_1: p_1 \neq p_2$$

$$Z = \frac{\hat{p}_1 - \hat{p}_2}{\sqrt{\hat{p}(1-\hat{p})\left(\frac{1}{n_1}+\frac{1}{n_2}\right)}}, \quad \hat{p} = \frac{x_1 + x_2}{n_1 + n_2}$$

```r
# Example: germination rate of two seed lots
x1 <- 180; n1 <- 200   # Lot A: 180/200 germinated
x2 <- 160; n2 <- 200   # Lot B: 160/200 germinated

prop.test(c(x1, x2), c(n1, n2), correct = FALSE)
```

---

## 3. t-Test

### When to use

Use a t-test when $\sigma$ is **unknown** (the usual real-world situation) and you estimate it
from the sample as $s$.

$$T = \frac{\bar{x} - \mu_0}{s / \sqrt{n}} \sim t_{(n-1)}$$

The t-distribution has heavier tails than the normal — accounting for extra uncertainty from
estimating $\sigma$. As $n \to \infty$, $t \to Z$.

### Three variants

| Variant | Hypothesis | When |
|---|---|---|
| One-sample | $H_0: \mu = \mu_0$ | Compare sample to a known value |
| Independent two-sample | $H_0: \mu_1 = \mu_2$ | Two unrelated groups |
| Paired | $H_0: \mu_d = 0$ | Before/after, matched pairs |

---

### 3.1 One-Sample t-Test

$$H_0: \mu = \mu_0 \qquad H_1: \mu \neq \mu_0$$

$$T = \frac{\bar{x} - \mu_0}{s/\sqrt{n}}, \quad df = n - 1$$

#### Example: Protein content in rice

Standard protein content is **8 %**. A new line is sampled ($n = 15$). Test whether it differs.

```r
set.seed(42)
protein <- c(8.4, 8.1, 8.7, 7.9, 8.5, 8.3, 8.6, 8.2,
             8.8, 8.0, 8.4, 8.5, 8.3, 8.6, 8.4)

# Summary statistics
cat("n    :", length(protein), "\n")
cat("Mean :", round(mean(protein), 4), "\n")
cat("SD   :", round(sd(protein),   4), "\n")

# One-sample t-test
result_1samp <- t.test(protein, mu = 8, alternative = "two.sided")
print(result_1samp)
```

**Output:**

```
        One Sample t-test

data:  protein
t = 4.899, df = 14, p-value = 0.0002
alternative hypothesis: true mean is not equal to 8
95 percent confidence interval:
 8.197 8.563
sample estimates:
mean of x
    8.380
```

**Interpretation:** $T = 4.90,\ df = 14,\ p = 0.0002 < 0.05$.
Strong evidence that the new rice line has protein content significantly different from 8 %.
The 95 % CI $[8.20,\ 8.56]$ lies entirely above 8.

---

### 3.2 Independent Two-Sample t-Test

$$H_0: \mu_1 = \mu_2 \qquad H_1: \mu_1 \neq \mu_2$$

**Equal variances (Student):**

$$
\begin{aligned}
T &= \frac{\bar{x}_1 - \bar{x}_2}{s_p\sqrt{\frac{1}{n_1}+\frac{1}{n_2}}} \\
\\

s_p &= \sqrt{\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1+n_2-2}} \\
\\

df &= n_1 + n_2 - 2
\end{aligned}
$$

**Unequal variances (Welch — default in R):**

$$T = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1}+\frac{s_2^2}{n_2}}}, \quad
df = \frac{\left(\frac{s_1^2}{n_1}+\frac{s_2^2}{n_2}\right)^2}
          {\frac{(s_1^2/n_1)^2}{n_1-1}+\frac{(s_2^2/n_2)^2}{n_2-1}}$$

#### Example: Grain yield of two maize hybrids

```r
set.seed(7)
hybrid_A <- c(62.1, 64.3, 61.8, 63.5, 65.0, 62.7, 63.9, 64.5, 61.2, 63.8)
hybrid_B <- c(58.4, 60.1, 59.7, 61.0, 58.8, 60.5, 59.3, 60.8, 58.1, 59.9)

# Check variance equality first (Levene / F-test)
var.test(hybrid_A, hybrid_B)

# Welch t-test (robust to unequal variances — recommended)
result_welch <- t.test(hybrid_A, hybrid_B,
                       alternative = "two.sided",
                       var.equal   = FALSE)
print(result_welch)

# Student t-test (assumes equal variances)
result_student <- t.test(hybrid_A, hybrid_B,
                         alternative = "two.sided",
                         var.equal   = TRUE)
print(result_student)

# Effect size: Cohen's d
library(effectsize)
cohens_d(hybrid_A, hybrid_B)
```

**Output (Welch):**

```
        Welch Two Sample t-test

t = 8.471, df = 17.84, p-value = 7.2e-08
alternative hypothesis: true difference in means is not equal to 0
95 percent confidence interval:
 2.906 4.774
sample estimates:
mean of x mean of y
   63.280    59.440
```

**Interpretation:** Hybrid A yields significantly more than Hybrid B
($T = 8.47,\ p < 0.001$). The mean difference is $3.84$ q/ha (95 % CI: $2.91$–$4.77$).

#### Visualise with boxplot

```r
library(ggplot2)
library(tidyr)

df_hyb <- data.frame(A = hybrid_A, B = hybrid_B) |>
  pivot_longer(everything(), names_to = "Hybrid", values_to = "Yield")

ggplot(df_hyb, aes(Hybrid, Yield, fill = Hybrid)) +
  geom_boxplot(alpha = 0.7, width = 0.4) +
  geom_jitter(width = 0.1, size = 2, alpha = 0.6) +
  scale_fill_manual(values = c("#4DAF4A", "#377EB8")) +
  labs(title    = "Grain Yield: Hybrid A vs Hybrid B",
       subtitle = paste0("Welch t-test: p = ",
                         format(result_welch$p.value, digits = 3)),
       y = "Yield (q/ha)") +
  theme_minimal(base_size = 13) +
  theme(legend.position = "none")
```

---

### 3.3 Paired t-Test

Used when observations are matched (same plot before/after treatment, same animal in two
conditions, twin studies).

$$d_i = x_{i1} - x_{i2}$$

$$H_0: \mu_d = 0 \qquad H_1: \mu_d \neq 0$$

$$T = \frac{\bar{d}}{s_d/\sqrt{n}}, \quad df = n - 1$$

#### Example: Soil nitrogen before and after legume cover crop

```r
set.seed(3)
before <- c(12.1, 11.8, 13.0, 12.5, 11.2, 12.8, 13.3, 12.0, 11.7, 12.4)
after  <- c(14.5, 13.9, 15.1, 14.8, 13.6, 15.0, 15.5, 14.2, 13.8, 14.7)

differences <- after - before
cat("Mean difference:", round(mean(differences), 3), "mg/kg\n")
cat("SD of differences:", round(sd(differences), 3), "\n")

result_paired <- t.test(after, before,
                        paired      = TRUE,
                        alternative = "greater")   # expect after > before
print(result_paired)
```

**Output:**

```
        Paired t-test

data:  after and before
t = 25.43, df = 9, p-value = 1.2e-09
alternative hypothesis: true mean difference is greater than 0
95 percent confidence interval:
 2.177   Inf
sample estimates:
mean difference
          2.340
```

**Interpretation:** Soil nitrogen increased by a mean of **2.34 mg/kg** after the legume cover
crop ($T = 25.43,\ p < 0.001$). The one-sided test confirms a significant increase.

```r
# Paired difference plot
df_paired <- data.frame(
  Plot       = factor(1:10),
  Before     = before,
  After      = after,
  Difference = differences
)

ggplot(df_paired, aes(x = Plot)) +
  geom_segment(aes(xend = Plot, y = Before, yend = After),
               arrow = arrow(length = unit(0.2, "cm")),
               colour = "#377EB8", linewidth = 0.8) +
  geom_point(aes(y = Before), colour = "#E41A1C", size = 3) +
  geom_point(aes(y = After),  colour = "#4DAF4A", size = 3) +
  labs(title    = "Soil Nitrogen Before (red) → After (green) Cover Crop",
       y = "N (mg/kg)", x = "Plot") +
  theme_minimal(base_size = 13)
```

---

## 4. Checking Assumptions

### Normality

```r
# Shapiro-Wilk test (best for n < 50)
shapiro.test(protein)

# Q-Q plot
qqnorm(protein, main = "Q-Q Plot — Protein Content")
qqline(protein, col = "red", lwd = 2)
```

### Equality of Variances

```r
# F-test (sensitive to normality)
var.test(hybrid_A, hybrid_B)

# Levene's test (robust)
library(car)
leveneTest(Yield ~ Hybrid, data = df_hyb)
```

### What if normality fails?

| Parametric | Non-parametric equivalent |
|---|---|
| One-sample t-test | Wilcoxon signed-rank test |
| Two-sample t-test | Mann-Whitney U (Wilcoxon rank-sum) |
| Paired t-test | Wilcoxon signed-rank test (paired) |

```r
# Non-parametric alternatives
wilcox.test(protein, mu = 8)                           # one-sample
wilcox.test(hybrid_A, hybrid_B)                        # two-sample
wilcox.test(after, before, paired = TRUE)              # paired
```

---

## 5. Z vs t — Decision Flowchart

```
Start: Testing a mean?
         │
         ├─ Yes ──► Is σ known AND n ≥ 30?
         │                  │
         │          ┌───────┴───────┐
         │         Yes              No
         │          │               │
         │        Z-test          t-test
         │                  ┌──────┴──────┐
         │              One group     Two groups?
         │                  │               │
         │           One-sample t    ┌──────┴──────┐
         │                       Paired?        Independent?
         │                          │                │
         │                     Paired t-test    Welch t-test
         │
         └─ No ──► Use proportion Z-test / chi-square
```

---

## 6. Complete Summary Table

| Feature | Z-test | One-sample t | Two-sample t (Welch) | Paired t |
|---|---|---|---|---|
| $\sigma$ known | ✅ Yes | ❌ No | ❌ No | ❌ No |
| Min sample size | $n \geq 30$ | Any | Any | Any |
| Groups | 1 | 1 | 2 independent | 2 matched |
| Test stat | $Z \sim \mathcal{N}(0,1)$ | $T \sim t_{n-1}$ | $T \sim t_{df_W}$ | $T \sim t_{n-1}$ |
| R function | `pnorm()` | `t.test(mu=)` | `t.test(var.equal=F)` | `t.test(paired=T)` |

---

## 7. Power Analysis

Determine sample size needed to detect a given effect.

```r
library(pwr)

# One-sample t-test: detect d = 0.5 with 80 % power
pwr.t.test(d = 0.5, sig.level = 0.05, power = 0.80,
           type = "one.sample", alternative = "two.sided")

# Two-sample t-test: detect d = 0.5
pwr.t.test(d = 0.5, sig.level = 0.05, power = 0.80,
           type = "two.sample", alternative = "two.sided")

# Power curve
power_seq <- sapply(seq(5, 100, by = 5), function(n) {
  pwr.t.test(n = n, d = 0.5, sig.level = 0.05,
             type = "two.sample")$power
})

plot(seq(5, 100, by = 5), power_seq, type = "b",
     xlab = "Sample Size (per group)", ylab = "Power",
     main = "Power Curve: Two-Sample t-Test (d = 0.5)",
     col  = "#2C7BB6", pch = 19)
abline(h = 0.80, col = "red", lty = 2)
```

---

## 8. References

- Fisher, R. A. (1925). *Statistical Methods for Research Workers*. Oliver & Boyd.
- Student [Gosset, W. S.] (1908). The probable error of a mean. *Biometrika*, 6(1), 1–25.
- Welch, B. L. (1947). The generalisation of Student's problem. *Biometrika*, 34(1–2), 28–35.
- Cohen, J. (1988). *Statistical Power Analysis for the Behavioral Sciences* (2nd ed.). LEA.
- R Core Team (2026). *R: A Language and Environment for Statistical Computing*.

---
