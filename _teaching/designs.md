---
title: "Field experimental analysis"
collection: teaching
layout: single
type: "Experimental Design analysis using R"
permalink: /teaching/designs
venue: "Punjab Agricultural University, Plant Breeding and Genetics"
categories: [statistics, agronomy, R]
tags: [RCBD, alpha-lattice, augmented-design, honeycomb, field-experiments, R]
date: 2026-05-02
location: "Ludhiana, India"
toc: true
math: true
---
## Test of significance
 The Statistical procedures, which are used to know whether differences under study are significant or non-significant are called test of significance. Some well known and commonly used test of significant are Z-test, t-test and F-test.

 If $$\mu = H_0$$ is the null hypothesis than

$$\mu \ne  H_0$$ or $$\mu > H_0$$ or $$\mu < H_0$$ is the alternative hypothesis.

### Two-tailed and one-tailed hypothesis
Two sided alternative hypothesis has region of rejection in both tails of sampling distribution of test statistic and one sided alternative hypothesis has rejection region, either in the let tail or right tail of the sampling distribution of test statistic.

### Errors in testing of hypothesis
As decision is based on sample information, so we are likely to make two types of errors in testing of hypothesis. These are 

>**Type I Error** is the error committed in rejecting a null hypothesis ($$\ H_0$$), when it is true.<br>
**Type II Error** is the error committed in not rejecting a false null hypothesis.

### Level of significance 
It is the maximum probability of type I error; which is experimenter is willing to risk in testing a null hypothesis. It is denoted as $\alpha$.

For testing significance of difference between population mean and sample mean or between two sample means, either Z-test or t-test applied.
A detailed and systematic explanation can be found in the [Blog Post Section](/posts/2022/05/z-test-t-test-analysis/)

---
## Analysis of variance and F-test
The method of partitioning total variation into components due to different causes is known as analysis of variance and the table showing the various mean squares together with he corresponding degree o freedom is called analysis of variance (ANOVA) table. The analysis of variance provides a ready means of testing significance of differences between class mean. Suppose we have two genotypes, A and B and data on a particular character were recorded for a number of plants in each genotypes. We want to know whether the genotypes differ with respect to that character or not. This can be done by both t-test and F-test. The F-test and t-test are in fact identical, since for a single degree of freedom of the numerator, the F ratio is identically equal to t<sup>2</sup>. 
However, F-test has a wider application than t-tet as it also provides an overall test of several differences, whereas, t-test provides test of a single differences.
{: .text-justify}
### F-test
F-test is used to test whether the two independent estimates of population variance differ significantly or whether the two samples may be regarded as drawn from the normal population having the same variance. A detailed and systematic explanation can be found in the [Blog Post Section](/posts/2023/05/f-test-analysis/)
{: .text-justify}
---

## Completely Randomized Design (CRD)
The Completely Randomized Design (CRD) is the simplest experimental design. Treatments are assigned to experimental units purely at random, with no restrictions. It is the starting point for understanding all other designs (RCBD, Latin Square, Alpha-lattice) and remains widely used in controlled laboratory and greenhouse experiments.A detailed and systematic explanation can be found in the [Blog Post Section](/posts/2024/05/crd-design-analysis/)
{: .text-justify}

# Comprehensive Analysis of Field Experiments in R
Field experiments constitute the foundation of applied agricultural research, providing a systematic approach for evaluating treatments under real-world conditions. These experiments are essential for generating reliable and scientifically valid conclusions regarding crop performance, input efficiency, and environmental interactions.
{: .text-justify}
This guide presents a comprehensive analytical framework for conducting and interpreting field experiments using R. It begins with the fundamental Randomized Complete Block Design (RCBD), which is widely used for controlling field variability, and progressively advances to the more sophisticated Honeycomb Design, known for its efficiency in large-scale and heterogeneous environments.
{: .text-justify}

Each section of this guide is carefully structured to include:
* a detailed explanation of the underlying statistical theory,
* the rationale behind the experimental layout and design structure,
* step-by-step implementation using R code, and
* thorough interpretation of the resulting outputs.

By integrating theoretical concepts with practical computational tools, this guide aims to equip researchers and students with a complete understanding of modern field experiment analysis.
{: .text-justify}

---

## Randomized Complete Block Design (RCBD)

**Randomized Complete Block Design (RCBD)** is one of the most widely used experimental designs in agricultural and biological research, particularly when there is known or suspected variability in the experimental field. In RCBD, the entire set of treatments is arranged into groups called **blocks**, where each block is relatively homogeneous with respect to environmental conditions such as soil fertility, moisture, or slope. Every treatment appears exactly once within each block, ensuring that comparisons among treatments are made under similar conditions. The allocation of treatments within each block is done randomly, which helps eliminate bias and ensures the validity of statistical inference.

The primary advantage of RCBD lies in its ability to **control variability** by isolating the effect of nuisance factors through blocking. By accounting for block-to-block variation, the design reduces experimental error and increases the precision of treatment comparisons. The statistical analysis of RCBD is typically carried out using **Analysis of Variance (ANOVA)**, where the total variation is partitioned into components due to treatments, blocks, and random error. If the treatment effect is found to be statistically significant, it indicates that the differences among treatment means are not due to chance alone. Overall, RCBD is highly efficient, simple to implement, and particularly suitable for field experiments where environmental heterogeneity exists in one direction. A detailed and systematic explanation can be found in the [Blog Post Section](/posts/2025/04/rcbd-design-analysis/)
{: .text-justify}

> **Tip:** If block F-value is not significant, blocking reduced power with no benefit — consider
> switching to CRD or using blocks as a random effect (mixed model).

---

## Latin Square Design (LSD)

**Latin Square Design (LSD)** is an experimental design used when there are **two sources of variability** that need to be controlled simultaneously, in addition to the treatment effects. It is particularly useful in agricultural and biological experiments where variation may occur in two directions—for example, **soil fertility gradients running both north–south and east–west**. The design arranges treatments in a square layout such that the number of treatments equals the number of rows and columns, and each treatment appears **exactly once in every row and every column**. This dual control of variation makes LSD more efficient than designs like RCBD when two directional sources of heterogeneity are present. 
{: .text-justify}
In a Latin Square Design with *t* treatments, the experimental field is divided into a *t × t* grid. Treatments are assigned in such a way that no treatment repeats within the same row or column, and randomization is applied to rows, columns, and treatment allocation to avoid bias. The statistical model includes effects for treatments, rows, and columns, allowing the total variation to be partitioned into these components along with random error. Analysis is typically performed using **Analysis of Variance (ANOVA)**, where significance of treatment effects is tested after accounting for row and column variations. While LSD is highly efficient in controlling two sources of variability, it has limitations: it requires the number of treatments to equal the number of rows and columns, and missing data can complicate analysis. Despite these constraints, it remains a powerful design when experimental conditions vary in two directions. A detailed and systematic explanation can be found in the [Blog Post Section](/posts/2026/01/latin-square-design/)
{: .text-justify}

>**Constraint:** Requires equal number of rows, columns, and treatments. Best for $p \leq 8$.<br>
>When treatments exceed manageable block size, **incomplete block designs** are preferred. 

---

## Alpha (α) Lattice Design

**Alpha Lattice Design (α-lattice design)** is an advanced incomplete block design widely used in agricultural research, particularly in plant breeding trials where a large number of treatments (e.g., genotypes) need to be evaluated efficiently. When the number of treatments becomes too large for designs like RCBD to remain effective, the experimental error increases due to within-block heterogeneity. The alpha lattice design addresses this issue by arranging treatments into **incomplete blocks**, each containing only a subset of the total treatments, while still maintaining an overall balanced structure across replications.
{: .text-justify}

In this design, treatments are grouped into smaller blocks within each replication, and each replication contains all treatments, but distributed across multiple incomplete blocks. This structure helps control local variability more effectively than complete block designs, as comparisons are made within relatively homogeneous small blocks. The term “alpha” refers to the method of generating the design, which ensures near-balance in the occurrence and pairing of treatments across blocks. Although not all treatment pairs appear together in every block, the design is constructed so that statistical efficiency remains high.
{: .text-justify}

The analysis of an alpha lattice design is typically conducted using **mixed-effects models**, where blocks within replications are treated as random effects and treatments as fixed effects. In R, packages such as `agricolae`, `lme4`, or `asreml` are commonly used for analysis. The model accounts for variation due to replications, incomplete blocks, and residual error, allowing for more precise estimation of treatment effects. Overall, the alpha lattice design provides a powerful and flexible approach for handling large-scale experiments, improving accuracy while managing practical constraints such as land, labor, and environmental variability.
A detailed and systematic explanation can be found in the [Blog Post Section](/posts/2026/02/alpha-lattice-design/)
{: .text-justify}
---

## Augmented Design

**Augmented Design (Augmented Block Design)** is an experimental design widely used in agricultural research when a large number of new treatments (such as genotypes or varieties or clones) need to be evaluated but resources are insufficient to replicate all of them. In this design, a set of standard or check treatments is replicated across all blocks, while the new treatments are unreplicated and appear only once. The primary purpose of including replicated checks is to account for environmental variability across blocks and to provide a basis for adjusting the performance of unreplicated entries. This makes the design particularly useful in early-stage plant breeding trials, where hundreds of new lines must be screened efficiently.
{: .text-justify}

The structure of an augmented design typically involves dividing the experimental area into blocks, each containing all the check treatments and a subset of new treatments. Since the new entries are not replicated, their raw observations may be influenced by local environmental conditions. To address this, statistical adjustments are made using the performance of the replicated checks within each block, thereby improving the accuracy of comparisons. The analysis is commonly performed using analysis of variance (ANOVA) models tailored for augmented designs, or specialized methods available in statistical software like R (e.g., using packages such as agricolae). Overall, the augmented design provides a practical balance between resource constraints and the need for reliable evaluation, enabling researchers to efficiently identify promising treatments for further testing.
{: .text-justify}

```r
# ── Augmented RCBD ────────────────────────────────────────────────────────
n_checks  <- 3
n_test    <- 30
n_blocks  <- 5

checks <- paste0("Check", 1:n_checks)
tests  <- paste0("Geno",  1:n_test)

aug_data <- data.frame(
  Block     = rep(paste0("B", 1:n_blocks), each = n_test / n_blocks + n_checks),
  Treatment = c(rep(tests,  length.out = n_test),
                rep(checks, n_blocks)),
  Type      = c(rep("Test", n_test), rep("Check", n_blocks * n_checks))
) |>
  mutate(Yield = ifelse(Type == "Check",
                        25 + as.integer(factor(Treatment)) * 3 +
                             as.integer(factor(Block)) * 1.5 + rnorm(n(), 0, 2),
                        20 + rnorm(n(), 0, 4)))

# Adjusted means using checks
model_aug <- lm(Yield ~ Treatment + Block, data = aug_data)
adj_means <- emmeans(model_aug, ~ Treatment, data = aug_data)
summary(adj_means) |> arrange(emmean) |> tail(10)
```

---

## Partially Replicated (p-rep) Design

p-rep designs replicate a fraction of entries (typically 20–30 %) to estimate error, while the
rest appear once. Widely used in plant breeding Stage 1 trials.

```r
# ── p-rep via DiGGer / FielDHub ───────────────────────────────────────────
if (!requireNamespace("FielDHub", quietly = TRUE)){
  install.packages("FielDHub")
}
library(FielDHub)

prep <- partially_replicated(
  nrows     = 10,
  ncols     = 15,
  repGens   = c(0.30),    # 30 % of entries replicated twice
  repUnits  = c(2),
  nUn       = 150,
  seed      = 101
)

# Field layout
plot(prep)

# Attach simulated phenotype
prep_data        <- prep$fieldBook
set.seed(5)
prep_data$Yield  <- 40 + rnorm(nrow(prep_data), 0, 5)

# Spatial model (SpATS)
if (!requireNamespace("SpATS", quietly = TRUE)) install.packages("SpATS")
library(SpATS)

spatial_model <- SpATS(
  response  = "Yield",
  genotype  = "ENTRY",
  genotype.as.random = TRUE,
  fixed     = NULL,
  spatial   = SAP(Row, Col),
  data      = prep_data,
  control   = list(tolerance = 1e-04)
)
summary(spatial_model)
BLUPs_prep <- predict(spatial_model, which = "ENTRY")
head(BLUPs_prep[order(-BLUPs_prep$predicted.values), ], 10)
```

---

## Spatial Analysis with AR1 × AR1 Model

Real field data typically exhibit **spatial autocorrelation**. Fitting a first-order autoregressive
process in both row and column directions is the modern standard.

```r
# ── ASReml-R (commercial) or sommer (free) ────────────────────────────────
if (!requireNamespace("sommer", quietly = TRUE)) install.packages("sommer")
library(sommer)

# Simulate spatially correlated field
n_row <- 20; n_col <- 15
field_df <- expand.grid(Row = 1:n_row, Col = 1:n_col) |>
  mutate(
    Genotype = sample(paste0("G", 1:50), n_row * n_col, replace = TRUE),
    Yield    = 30 + as.integer(factor(Genotype)) * 0.2 +
                    0.5 * Row - 0.3 * Col + rnorm(n(), 0, 3)
  )

# Genotype as random, spatial residuals via us() or AR1
ar1_model <- mmer(
  fixed   = Yield ~ 1,
  random  = ~ vsr(Genotype),
  rcov    = ~ vsr(units),
  data    = field_df,
  verbose = FALSE
)

# GBLUPs
gblups <- randef(ar1_model)$`u:Genotype`
head(sort(gblups, decreasing = TRUE), 5)
```

---

## Honeycomb Design

The **Honeycomb (HC)** design, developed by **Fasoulas (1988)** and extended by Kyriakou & Fasoulas,
is used for **mass selection** in plant breeding. Plants are arranged in a triangular grid; each
plant competes only with its six nearest neighbours.

### Design Principle

Each plant $i$ is compared against the mean of its **moving ring of 6 neighbours**. A selection
index is computed as:

$$HC_i = \frac{y_i}{\bar{y}_{N_i}}$$

where $y_i$ is the yield of plant $i$ and $\bar{y}_{N_i}$ is the mean yield of its 6 neighbours.

### Layout Generation

```r
# ── Honeycomb grid coordinates ────────────────────────────────────────────
honeycomb_coords <- function(nrow, ncol) {
  coords <- data.frame(Plant = integer(), X = numeric(), Y = numeric())
  id <- 1L
  for (r in 1:nrow) {
    for (c in 1:ncol) {
      x <- c + ifelse(r %% 2 == 0, 0.5, 0)
      y <- r * (sqrt(3) / 2)
      coords <- rbind(coords, data.frame(Plant = id, X = x, Y = y))
      id <- id + 1L
    }
  }
  coords
}

hc_grid <- honeycomb_coords(20, 15)

# Simulate plant yields
set.seed(99)
hc_grid$Yield <- rnorm(nrow(hc_grid), mean = 50, sd = 8)

# Visualise layout
ggplot(hc_grid, aes(X, Y, colour = Yield)) +
  geom_point(size = 3, shape = 16) +
  scale_colour_viridis_c(option = "plasma") +
  coord_equal() +
  labs(title = "Honeycomb Field Layout", colour = "Yield (g)") +
  theme_minimal(base_size = 13)
```

### Neighbour Identification & Selection Index

```r
# ── Find 6 nearest neighbours ─────────────────────────────────────────────
library(FNN)   # fast kNN

coords_mat <- as.matrix(hc_grid[, c("X", "Y")])
nn_idx     <- get.knnx(coords_mat, coords_mat, k = 7)$nn.index
# Column 1 is the point itself; columns 2–7 are the 6 neighbours

hc_grid$NeighbourMean <- apply(nn_idx[, 2:7], 1, function(idx) {
  mean(hc_grid$Yield[idx])
})

# HC selection index
hc_grid$HC_index <- hc_grid$Yield / hc_grid$NeighbourMean

# Select top 10 % (strongest relative performers)
threshold   <- quantile(hc_grid$HC_index, 0.90)
hc_grid$Selected <- hc_grid$HC_index >= threshold

cat("Plants selected:", sum(hc_grid$Selected), "\n")
cat("Mean yield – selected:    ", round(mean(hc_grid$Yield[hc_grid$Selected]),  2), "\n")
cat("Mean yield – not selected:", round(mean(hc_grid$Yield[!hc_grid$Selected]), 2), "\n")
```

### Visualise Selection

```r
ggplot(hc_grid, aes(X, Y, colour = HC_index, shape = Selected, size = Selected)) +
  geom_point() +
  scale_colour_viridis_c(option = "magma") +
  scale_shape_manual(values = c(`FALSE` = 16, `TRUE` = 17)) +
  scale_size_manual( values  = c(`FALSE` = 2,  `TRUE` = 4))  +
  coord_equal() +
  labs(title  = "Honeycomb Selection (top 10 %)",
       colour = "HC Index",
       shape  = "Selected",
       size   = "Selected") +
  theme_minimal(base_size = 13)
```

### Heritability Estimate Under Honeycomb Design

```r
# ── Plant-level heritability (Fasoulas method) ────────────────────────────
# Var(genotype) estimated via regression of plant on neighbour mean
lm_hc  <- lm(Yield ~ NeighbourMean, data = hc_grid)
h2_hc  <- summary(lm_hc)$r.squared
cat("Heritability estimate (HC):", round(h2_hc, 3), "\n")
```

---

## 8. Comparison of Designs

| Feature | RCBD | Alpha Lattice | p-rep | Honeycomb |
|---|---|---|---|---|
| Blocking direction | 1 | 2 (incomplete) | Spatial | Neighbour competition |
| # treatments | ≤ 30 | 20–1000 | 50–5000 | Unlimited |
| Replication | Complete | Partial | Partial (~30 %) | None (moving ring) |
| Error control | Moderate | Good | Excellent | Excellent |
| Primary use | Variety trials | Breeding stages | MET Stage 1 | Mass selection |
| Main R packages | `agricolae` | `agricolae`, `lme4` | `FielDHub`, `SpATS` | `FNN`, custom |

---

## 9. Full Pipeline Utility Functions

```r
# ── Wrapper: run any design ANOVA and return LSD groups ───────────────────
analyse_design <- function(data, yield_col = "Yield",
                           treat_col = "Treatment", ...) {
  extra_terms <- paste(..., collapse = " + ")
  formula_str <- paste(yield_col, "~", treat_col,
                       if (nchar(extra_terms)) paste("+", extra_terms) else "")
  model  <- aov(as.formula(formula_str), data = data)
  groups <- LSD.test(model, treat_col, console = FALSE)$groups
  list(anova = summary(model), groups = groups)
}

# Usage examples
analyse_design(rcbd_data,  "Block")               # RCBD
analyse_design(ls_long,    "Row", "Col")           # Latin Square
```

---

## 10. References & Further Reading

- Fasoulas, A. C. (1988). *The Honeycomb Methodology of Plant Breeding*. Thessaloniki.
- Kempton, R. A., & Fox, P. N. (Eds.) (1997). *Statistical Methods for Plant Variety Evaluation*. Chapman & Hall.
- Cullis, B. R., Smith, A. B., & Coombes, N. E. (2006). On the design of early generation variety trials with correlated data. *JABES*, 11(4), 381–393.
- Mramba, L. et al. (2019). FielDHub: A Shiny App for Design of Experiments in Life Sciences. *CRAN*.
- R Core Team (2026). *R: A Language and Environment for Statistical Computing*. R Foundation.

---
