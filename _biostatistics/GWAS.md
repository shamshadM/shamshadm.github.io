---
title: "Genome-wide Association Study (GWAS) in TASSEL (GUI)"
layout: single
collection: biostatistics
toc: true
number_sections: true
comments: true
tags: 
  - GWAS GUI
  - TASSEL
  - Genome-wide association test
  - GLM
  - MLM
  - Linear model
---


__TASSEL__ aslo known as `Trait Analysis by aSSociation, Evolution and Linkage` is a powerful statistical software to conduct `association mapping` such as `General Linear Model (GLM)` and `Mixed Linear Model (MLM)`. The GUI (graphical user interface) version of TASSEL is very well built for anyone who does not have a background or experience in working in `command line`. In this tutorial, I will show how to prepare `input` files and run assoication analysis in TASSEL. For detailed information on TASSEL, user's guide and further documentation please visit: 
[https://www.maizegenetics.net/tassel](https://www.maizegenetics.net/tassel)

# 1.0 Download and install TASSEL software 
Download and install the latest version of the <strong> TASSEL software </strong> at this link:
[https://www.maizegenetics.net/tassel](https://www.maizegenetics.net/tassel)

<hr>

## 1.1: Preparing the Input files
 
<b>Phenotype  file </b>
Prepare the phenotype file as shown below in the figure, and please remember if your data has `covariates` such as `sex`, `age` or `treatment`, then, please categories them with header name `factor`.

<center><img src="/images/biostat/gwas/pheno.png" alt="Phenotype data"></center>

<hr>

<b> Genotype file </b>

TASSEL allows various genotype file formats such as `VCF` (variant call format), `.hmp.txt`, and `plink`. In this tutorial, I am using the `hmp.txt` version of the genotype file. The below githe screenshot of the hmp.txt genotype file. 

<center><img src="/images/biostat/gwas/geno.JPG" alt="Genotype data"></center>
<hr>

## 1.2: Importing phenotype and genotype files 
Import the files by following the steps shown below.
__Tip!__ Both files can be opened at same time holding `CTRL` and clicking the file names. 

<center><img src="/images/biostat/gwas/importfiles.gif" alt="Import data"></center>

<hr>

## 1.3 Checking data on the basis of Phenotype distribution plot
It is always a wise idea to look at the phenotype distribution by plotting to check for any outliers. Follow below steps to plot histogram of your phenotype data.

<center><img src="/images/biostat/gwas/phenoplot.gif" alt="Phenotype distribution"></center>
<hr>

## 1.5 Genotype summary analysis 
Next crucial step is to look at the genotype data by simply following the steps shown.
Couple of keys things to look at are:
<ol>
  <li>Minor allele frequency distribution </li>
  <li>Missing genotypic data to see if it requires to be imputed </li>
  <li>Proportion of heterozygous in the samples to check for self-ed samples </li>
</ol>

<center><img src="/images/biostat/gwas/genosummary.gif" alt="Genotype summary"></center>
<hr>

  
# 2.0 Conduct GWAS analysis 

## 2.1 multidimensional scaling (MDS) 
MDS output can be used as the covariate in the GLM or MLM to correct for population structure.
Please follow the steps shown below:

<center><img src="/images/biostat/gwas/mds.gif" alt="MDS"></center>
  
<hr>

## 2.2 Intersecting the files 
Intersect the `genotype`, `phenotype` and `MDS` files by following the steps below:

<center><img src="/images/biostat/gwas/intersect.gif" alt="Intersect files"></center>

<hr>

# 3.0 running General Linear Model (GLM) 
Run the GLM analysis by selecting the `intersected` files following the steps below:

<center><img src="/images/biostat/gwas/glm.gif" alt="GLM"></center>
<hr>

The output of the GLM analyis is produced ubder the `Result` node. The GLM association test can be evaluated by plotting `Q-Q plot` and the `Manhattan` plot as shown below. 

<center>
<img src="/images/biostat/gwas/manhattan.png" width="auto" height="200" alt="GLM Manhattan plot">
<img src="/images/biostat/gwas/qqplot.png" width="auto" height="200" alt="Q-Q plot">
</center>

From the above Q-Q plot, we can see that are several markers that appear to be falsely associated with the trait, therefore, to control this confounding effect, use `Kinship` matrix as an another covariate in the linear model

<hr>

# 4.0 Mixed Linear Model (MLM)  


## 4.1 Calculating Kinship matrix 
Follow the below steps to calcuate the kinship matrix:

<center><img src="/images/biostat/gwas/kinship.gif"  alt="Kinship matrix"></center>
<hr>

## 4.2 running Mixed Linear Model (MLM)  
MLM model includes the PCA and the kinship matrix i.e. MLM(PCA+K).

Therefore, once the Kinship matrix has been calculated, MLM can be now be conducted by following below steps:

<center><img src="/images/biostat/gwas/mlm.gif"  alt="MLM steps"></center>
<br>

Plot the output (MLM stats file in the Results branch following the above shown steps).
<center>
<img src="/images/biostat/gwas/manhattanMlm.png" width="auto" height="200" alt="MLM Manhattan plot">
<img src="/images/biostat/gwas/qqmlm.png" width="auto" height="200" alt="MLM Q-Q plot">                                                           
</center>

<hr>

## 4.2 Exporting results  
One may export the results in .txt format by the following the below steps:

<center><img src="/images/biostat/gwas/export.gif"  alt="Export results">
</center>

<hr>

## 4.3 Significance Threshold  
Bonferroni threshold can be deterimined to identify significantly markers associated with the trait  by using the below equation:
```
P ??? 1/N (?? =0.05)
```
where, N is the total number of markers tested in association analysis) was used to identify the most significantly markers associated with the trait. Similarly, another way is to perform `FDR` (`False Discovey Rate`) correction method.
<hr>  
<center> <b>--- End of Tutorial --- </b></center>
<hr>

__Thank you__ for reading this tutorial. If you have any questions or comments, please let me know in the comment section below or send me an email. 

<hr>
<b> Bibliography </b>
<ol>
<li>
<p>	Bradbury PJ, Zhang Z, Kroon DE, Casstevens TM, Ramdoss Y, Buckler ES. (2007)<cite> TASSEL: Software for association mapping of complex traits in diverse samples.</cite> Bioinformatics 23:2633-2635.</p>
</li>
</ol>