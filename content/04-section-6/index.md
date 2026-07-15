---
title: TREM2 Ratio Quantitative Trait Locus Analysis
---

## TREM2 Ratio Quantitative Trait Locus Analysis

To test whether pairwise normalization could reveal stronger TREM2 genetic associations and potentially reveal TREM2 downstream pathways, TREM2 was paired with each of the other 6,463 protein measurements. Each phenotype was calculated on the log₂ scale as log₂(TREM2) − log₂(reference protein), and a separate genome-wide rQTL scan was performed for every ratio. 

Importantly, unlike the single-protein baseline, the ratio models did not include proteomic PCs because the ratio itself was intended to remove variation shared between two proteins. Association improvement was quantified using p-gain: the difference in −log⁡(P) between the ratio and the stronger of its two constituent pQTLs. A pair was retained only if its ratio was genome-wide significant and improved upon the stronger pQTL by more than 5.11 −log(⁡P) units, corresponding to Bonferroni correction across 6,463 ratios. The distribution figure shows the maximum p-gain observed for each reference protein across all tested variants.

![rQTL distribution graph with the maximum p-gain observed for each protein](figure_3.png)

Only five proteins (DDRGK1, HTRA2, IGF2R, PEF1 and UBE2L6) passed both significance requirements, representing ~0.08% of all tested TREM2 ratios. This shows that signal gain is highly selective and not a general consequence of ratio formation. TREM2 provided the stronger constituent pQTL in every significant pair, meaning that these ratios specifically enhanced an existing TREM2 genetic association, the significance of which is still under consideration.

![Forming a ratio increases the significance of genetic associations](figure_2.png)

The three Manhattan plots show the genome-wide associations for TREM2, DDRGK1 and their ratio.
Sensitivity models showed that significant ratios had 23–28% lower standard errors than the corresponding TREM2 pQTL models, while their estimated genetic effects were only 3–10% larger. The gain was therefore driven primarily by improved precision and not increased genetic effect. This pattern is consistent with the reference proteins capturing residual variation shared with TREM2, allowing that variation to be reduced through subtraction.

All five candidate partners strengthened the same TREM2 trans-pQTL in the MS4A locus, while DDRGK1 also strengthened the chromosome 6 TREM2 cis-pQTL. Thus, the five results represent distinct protein pairings that sharpen the same principal TREM2 genetic signal rather than five independent genetic loci. These proteins were subsequently used as anchors in their own proteome-wide rQTL scans to determine whether they repeatedly identified the same second-tier proteins.
