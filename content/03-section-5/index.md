---
title: SomaScan pQTL in CSF
---

## SomaScan pQTL in CSF

The proteogenomics framework was applied to 2,273 European-ancestry CSF samples. Participants had a mean age of 69.4 years (SD 12.0; range 19–99), and 50.3% were female. The cohort included 1,083 participants with AD or autosomal-dominant AD (47.6%), 909 controls (40.0%) and 281 participants with other diagnoses (12.4%). 6,464 SomaScan human protein assay measurements passing quality control were included.

Protein abundance measurements were log₂-transformed, adjusted for age, sex, sample-age and SomaScan plate, and rank-inverse-normal transformed within the contributing subcohorts. Single-protein GWAS included three genetic principal components to account for ancestry and two proteomic principal components to account for broad covariance across the measured proteome.

The number of proteomic PCs was selected by testing each PC for association with known pleiotropic biology, namely Alzheimer’s Disease status and APOE ε4 carrier status, while accounting for age, sex, batch and plate. AD and APOE ε4 were used only to screen the components; they were not removed from the protein phenotypes.

Proteomic PC1 and PC2 collectively explained 25.5% of total proteomic variance (18.7% and 6.7%, respectively), without a statistically significant association to AD or APOE ε4 status. PC3 explained another 6.1% but was associated with both AD status (P=0.00101) and APOE ε4 status (P=3.64×10−5). Therefore, Proteomic PC1 and PC2 were retained as global proteomic covariates, while PC3 and subsequent components were excluded to reduce the risk of adjusting for AD-related biology.

The resulting pQTL GWAS scan identified at least one genome-wide significant association for 1,927 of the 6,464 protein assays, representing 29.8% of the measured proteome. LD clumping at r2<0.01 retained 3,561 protein–variant association signals (2,379 cis and 1,182 trans), involving 2,792 distinct variants. These adjusted single-protein associations provided the baseline against which rQTL signal gain was evaluated. Because the pQTL models already included Proteomic covariates, while the ratio models did not include proteomic PCs, the ratio analysis asked whether pairwise normalization could recover genetic signal beyond broad, proteome-wide adjustment.



