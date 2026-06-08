---
title: "Honeycomb Design Analysis in R"
date: 2026-05-04
permalink: /posts/2026/05/honeycomb-design-analysis/
categories: [R, geometry, structural-analysis, data-visualization]
tags: [R, ggplot2, hexagon, tessellation, honeycomb, geometry, structural-mechanics]
description: "A comprehensive guide to honeycomb hexagonal lattice design analysis in R — covering geometry, structural efficiency, tessellation plotting, and Gibson–Ashby mechanics."
excerpt_separator: <!--more-->
number_sections: true
math: true
toc: true
toc_sticky: true
---
The Honeycomb (HC) design, developed by **Fasoulas (1988)** and later extended by **Kyriakou and Fasoulas**, is a field layout method used in plant breeding to improve the efficiency of mass selection under field variability. In this design, plants are arranged in a **triangular (hexagonal) grid**, so that each plant is surrounded by exactly six nearest neighbours at equal distances. This uniform spatial arrangement ensures that every plant experiences a similar level of competition, reducing environmental bias caused by uneven spacing or directional field effects.
<!--more-->
The main idea of the HC design is to enhance the accuracy of selecting superior plants by controlling local competition and micro-environmental variation without requiring heavy replication. Because each plant is compared primarily with its immediate neighbours, breeders can better distinguish genetic performance from environmental noise. This makes the design particularly useful in early-generation selection, where large populations are evaluated and only a small number of superior individuals are retained for further breeding.
{: .txt-justify}

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