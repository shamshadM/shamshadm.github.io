---
title: "Statistical Summary in R: A Complete Guide"
date: 2026-05-05
categories: [R, Statistics, Data Analysis]
tags: [r-programming, statistics, data-science, summary, exploratory-data-analysis]
permalink: /teaching/summary
description: "Learn how to compute and interpret statistical summaries in R using base functions, dplyr, skimr, and more."
header:
  overlay_image: /r-stats-banner.webp
  overlay-filter: 0.3
excerpt: "" 
toc: true
---

> **Prerequisites:** Basic R knowledge, R (≥ 4.0) installed, optionally RStudio.  
> **Packages used:** `dplyr`, `skimr`, `psych`, `ggplot2`

---
## Why Statistical Summaries Matter

Before building models or drawing conclusions, you need to *understand your data*. Statistical summaries answer three core questions:

| Question | Statistic |
|---|---|
| Where is the data centered? | Mean, Median, Mode |
| How spread out is it? | SD, Variance, IQR, Range |
| What shape does it have? | Skewness, Kurtosis, Quantiles |

---

## The Built-in `summary()` Function

R ships with a powerful one-liner for a quick overview:

```r
# Using the built-in mtcars dataset
data(mtcars)

summary(mtcars)
```

**Sample output:**

```
      mpg             cyl             disp      
 Min.   :10.40   Min.   :4.000   Min.   : 71.1  
 1st Qu.:15.43   1st Qu.:4.000   1st Qu.:120.8  
 Median :19.20   Median :6.000   Median :196.3  
 Mean   :20.09   Mean   :6.188   Mean   :230.7  
 3rd Qu.:22.80   3rd Qu.:8.000   3rd Qu.:326.0  
 Max.   :33.90   Max.   :8.000   Max.   :472.0  
```

For a **single vector**, `summary()` returns the five-number summary plus the mean:

```r
summary(mtcars$mpg)
#  Min. 1st Qu.  Median    Mean 3rd Qu.    Max. 
# 10.40   15.43   19.20   20.09   22.80   33.90
```

### What each value means

- **Min / Max** — the smallest and largest observed values  
- **1st Qu. / 3rd Qu.** — the 25th and 75th percentiles (the middle 50 % of data lies between these)  
- **Median** — the middle value; robust to outliers  
- **Mean** — the arithmetic average; sensitive to outliers  

---

## Measures of Central Tendency

```r
x <- mtcars$mpg

# Mean
mean(x)          # 20.09

# Median
median(x)        # 19.2

# Mode (no built-in; write a helper)
mode_val <- function(v) {
  tbl <- table(v)
  as.numeric(names(tbl)[tbl == max(tbl)])
}
mode_val(mtcars$cyl)   # 8
```

> **Tip:** When mean > median, the distribution is right-skewed. When mean < median, it is left-skewed.

---

## Measures of Dispersion

```r
x <- mtcars$mpg

# Variance and Standard Deviation
var(x)    # 36.32
sd(x)     # 6.027

# Range
range(x)           # 10.40  33.90
diff(range(x))     # 23.5  (max − min)

# Interquartile Range
IQR(x)    # 7.375

# Quantiles (any percentile)
quantile(x, probs = c(0.10, 0.25, 0.50, 0.75, 0.90))
```

### Coefficient of Variation (CV)

CV expresses spread relative to the mean — useful for comparing variables on different scales:

```r
cv <- function(x) sd(x) / mean(x) * 100
cv(mtcars$mpg)    # ~30 %
cv(mtcars$disp)   # ~53 %
```

---

## Frequency Tables & Proportions

Categorical variables need counts, not averages.

```r
# Absolute frequency
table(mtcars$cyl)
# 4  6  8 
# 11  7 14

# Relative frequency (proportions)
prop.table(table(mtcars$cyl))
#        4        6        8 
# 0.34375  0.21875  0.43750

# Cross-tabulation
table(mtcars$cyl, mtcars$am)  # cylinders × transmission type
```

---

## Grouped Summaries with dplyr

`dplyr` makes group-wise statistics clean and readable.

```r
# Install once: install.packages("dplyr")
library(dplyr)

mtcars %>%
  group_by(cyl) %>%
  summarise(
    n          = n(),
    mean_mpg   = mean(mpg),
    median_mpg = median(mpg),
    sd_mpg     = sd(mpg),
    min_mpg    = min(mpg),
    max_mpg    = max(mpg),
    .groups    = "drop"
  )
```

**Output:**

| cyl | n | mean\_mpg | median\_mpg | sd\_mpg | min\_mpg | max\_mpg |
|-----|---|-----------|-------------|---------|----------|----------|
| 4 | 11 | 26.66 | 26.0 | 4.51 | 21.4 | 33.9 |
| 6 | 7 | 19.74 | 19.7 | 1.45 | 17.8 | 21.4 |
| 8 | 14 | 15.10 | 15.2 | 2.56 | 10.4 | 19.2 |

### Summarising multiple columns at once

```r
mtcars %>%
  group_by(cyl) %>%
  summarise(across(c(mpg, hp, wt), list(mean = mean, sd = sd),
                   .names = "{.col}_{.fn}"))
```

---

## Rich Summaries with skimr

`skimr` produces a richer, better-formatted summary with histograms in the console.

```r
# Install once: install.packages("skimr")
library(skimr)

skim(mtcars)
```

**Highlights of `skim()` output:**

- **n\_missing** — count of `NA` values  
- **complete\_rate** — proportion of non-missing  
- **hist** — inline ASCII histogram  
- **p0, p25, p50, p75, p100** — full five-number summary  

You can also skim by group:

```r
mtcars %>%
  group_by(cyl) %>%
  skim()
```

---

## Handling Missing Data

Real data has gaps. Always check before summarising.

```r
# Detect missing values
sum(is.na(mtcars))       # total NAs
colSums(is.na(mtcars))   # NAs per column

# Safe mean ignoring NAs
mean(c(1, 2, NA, 4), na.rm = TRUE)   # 2.33

# Drop rows with any NA
clean_df <- na.omit(mtcars)

# Fill NAs with column median (example)
library(dplyr)
mtcars_filled <- mtcars %>%
  mutate(across(where(is.numeric),
                ~ ifelse(is.na(.), median(., na.rm = TRUE), .)))
```

---

## Visualising Your Summary

Numbers alone can hide patterns. Pair summaries with plots.

### Histogram + density

```r
library(ggplot2)

ggplot(mtcars, aes(x = mpg)) +
  geom_histogram(aes(y = after_stat(density)),
                 binwidth = 2, fill = "#3B82F6", colour = "white") +
  geom_density(colour = "#EF4444", linewidth = 1) +
  labs(title = "Distribution of MPG", x = "Miles per Gallon", y = "Density") +
  theme_minimal()
```

### Box plot by group

```r
ggplot(mtcars, aes(x = factor(cyl), y = mpg, fill = factor(cyl))) +
  geom_boxplot(alpha = 0.7, outlier.colour = "red") +
  scale_fill_brewer(palette = "Set2") +
  labs(title = "MPG by Cylinder Count",
       x = "Cylinders", y = "Miles per Gallon", fill = "Cyl") +
  theme_minimal()
```

### Violin plot (shows distribution shape)

```r
ggplot(mtcars, aes(x = factor(cyl), y = mpg, fill = factor(cyl))) +
  geom_violin(trim = FALSE, alpha = 0.6) +
  geom_boxplot(width = 0.1, fill = "white") +
  labs(title = "MPG Distribution by Cylinder (Violin + Box)",
       x = "Cylinders", y = "MPG") +
  theme_minimal(base_size = 13)
```

---

## Putting It All Together

Here is a reusable **summary report function** you can drop into any project:

```r
library(dplyr)
library(skimr)

full_summary <- function(df, group_var = NULL) {

  cat("========================================\n")
  cat(" DATASET OVERVIEW\n")
  cat("========================================\n")
  cat("Rows     :", nrow(df), "\n")
  cat("Columns  :", ncol(df), "\n")
  cat("Total NAs:", sum(is.na(df)), "\n\n")

  cat("--- Numeric Summary (skimr) ---\n")
  print(skim(df))

  if (!is.null(group_var)) {
    cat("\n--- Grouped Means by", group_var, "---\n")
    result <- df %>%
      group_by(across(all_of(group_var))) %>%
      summarise(across(where(is.numeric), mean, na.rm = TRUE),
                n = n(), .groups = "drop")
    print(result)
  }
}

# Example usage
full_summary(mtcars, group_var = "cyl")
```

---

## Quick Reference Cheatsheet

| Task | Function |
|---|---|
| Five-number summary | `summary(x)` |
| Mean | `mean(x, na.rm=TRUE)` |
| Median | `median(x, na.rm=TRUE)` |
| Standard deviation | `sd(x, na.rm=TRUE)` |
| Variance | `var(x, na.rm=TRUE)` |
| IQR | `IQR(x, na.rm=TRUE)` |
| Quantiles | `quantile(x, probs=...)` |
| Frequency table | `table(x)` |
| Proportions | `prop.table(table(x))` |
| Count NAs | `sum(is.na(x))` |
| Rich summary | `skimr::skim(df)` |
| Group summary | `dplyr::group_by() %>% summarise()` |

---

## Further Reading

- [R for Data Science — Exploratory Data Analysis](https://r4ds.hadley.nz/eda)  
- [`skimr` documentation](https://docs.ropensci.org/skimr/)  
- [`dplyr` reference](https://dplyr.tidyverse.org/)  
- [ggplot2 gallery](https://r-graph-gallery.com/)

---

*Happy summarising! If you found this helpful, share it or leave a comment below.*