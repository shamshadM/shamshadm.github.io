---
title: "Investigate genetic admixture using STRUCTURE software"
date: 2021-01-05
permalink: /posts/2021/01/investigate-genetic-admixture-using-STRUCTURE-software/
excerpt_separator: <!--more-->
categories: Structure software
header:
  og_image: "images/biostat/structure/structure-admixture.webp"
tags:
  - Structure software
  - Genetic Admixture
  - Genetic data
  - Population structure
toc: true
toc_sticky: true
---
<p>
<strong>Structure Software</strong> is a freely available software package that one may use for rigorous investigation of <code>admixed individuals</code>; identification of <code>point of hybridization</code> and <code>migrants</code>; and estimate over all <code>structure</code> of a population using commonly used genetic markers such as single nucleotide polymorphism (SNPs) and simple sequence repeat (SSRs). 
</p>
<!--more-->

This software was developed by **Pritchard Lab** at **Stanford University** and can be downloaded at this [link](https://web.stanford.edu/group/pritchardlab/structure.html).


***

Download sample data set: [click here](/images/biostat/structure/data_structure_1.txt)

***

In this tutorial, I will show how to prepare `input` files and run the `Structure` software. For detail information, please read this article at this [link](https://web.stanford.edu/group/pritchardlab/structure.html).

***

## Step 1: Preparing the Input File

In this tutorial, I am using `numerical` SNP data as an `input` genotype file. One can convert their genotype data in numerical format in `TASSEL` software or any software package available as per one's convenience. The file needs to be formatted properly as shown in the image below and saved as a `.txt` file.

<p align="center">
  <img src="/images/biostat/structure/input-structure.webp" alt="Input structure File"/>
</p>

***

> **Please Note:** Missing data is denoted as `-9` in the above image.

***

## Step 2: Running the Structure Software

### Step 1.1: Importing the Input File

Once the input file with the correct header and format is ready, import the file in `Structure` software using the steps shown in the figure below. The importing process includes **4** steps — please make sure to select the correct directory and file name. At **step 2 of 4**, make sure to correctly input the `number of markers`, `samples/individual`, and `ploidy` (if genotypes are `A` enter 1; if `AA` enter 2), and finally indicate how `missing data` are represented in the file. In this tutorial, missing data is denoted as `-9`.

***

<p align="center">
  <img src="/images/biostat/structure/Import-structure.gif" alt="Import data in structure"/>
</p>

***

### Step 1.2: Set Parameters

Follow the steps shown in the figure below to complete this step. **Please remember** to custom-set the `length of burning period` and `Number of MCMC Reps after burnin`.

***

<p align="center">
  <img src="/images/biostat/structure/Set-Parameter.gif" alt="Set parameters structure"/>
</p>

***

### Step 1.3: Running the Project

Follow the steps shown in the figure below to complete this step. **Please remember** to run at least **10** `number of iterations`. You can see the job progress in the bottom black shell window.

***

<p align="center">
  <img src="/images/biostat/structure/run-structure-project.gif" alt="Running the project structure"/>
</p>

***

### Step 1.4: Viewing the Results

Follow the steps shown in the figure below to complete this step. **Please remember** that under the `Results` folder there are several branches of results with various `k` values, which indicate the **number of sub-populations** estimated from the given genetic data. It can be tricky to pick the correct number of `k` for your data — to resolve this, follow the next step to prepare files for **Structure Harvester**.

***

<p align="center">
  <img src="/images/biostat/structure/structure-resultus.gif" alt="Viewing the structure results"/>
</p>

***

## 2.1 Preparing Files for Structure Harvester

`zip` all the result files in the results folder.

<p align="center">
  <img src="/images/biostat/structure/structure-harvester.gif" alt="Files for Structure Harvester"/>
</p>

***

## 2.2 Running Structure Harvester

In your web browser, search for `structure harvester` and click the first search result. Next, upload the `results.zip` file and click `harvest` to run the Structure Harvester program. It can take a few minutes to run depending on your data. Once the job is completed, the program outputs the summary of the analysis — the key outputs to examine are the `Delta K` plot and the `Evanno table`.

***

<p align="center">
  <img src="/images/biostat/structure/run-structure-harvester.gif" alt="Run Structure Harvester"/>
</p>

***

## 2.3 Interpreting the Output

The `Evanno table` highlights the significant `k` value estimated for this genotype data (see figure below). For this tutorial data set, the estimated `k` is **3 subpopulations**, which is also supported by the `Delta K` plot where a clear peak is seen at `K = 3`.

<p align="center">
  <img src="/images/biostat/structure/ktable.webp" alt="Evanno table"/>
</p>

<p align="center">
  <img src="/images/biostat/structure/deltaK.webp" alt="Delta K plot"/>
</p>

**Therefore**, the correct bar plot with the correct number of sub-populations (k = 3) can be plotted by following the steps shown in **Step 1.4**.

<p align="center">
  <img src="/images/biostat/structure/structure-result-final.webp" alt="Final structure result bar plot"/>
</p>

***

**Thank you** for reading this tutorial. If you have any questions or comments, please let me know by email.

---

Happy Structure-ing :smiley:

---

## Bibliography

1. Pritchard, Jonathan K., William Wen, and Daniel Falush. "Documentation for STRUCTURE software: Version 2." (2003).

2. Earl, Dent A. "STRUCTURE HARVESTER: a website and program for visualizing STRUCTURE output and implementing the Evanno method." *Conservation Genetics Resources* 4.2 (2012): 359–361.
