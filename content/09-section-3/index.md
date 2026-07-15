---
title: "Case Study: TREM2 / TREM2 Signal in Blood Plasma"
---

## Case Study: TREM2 / TREM2 Signal in Blood Plasma

We measured the protein TREM2 using two different probes (SomaScan aptamers) in the same cohort in plasma samples. As expected, the two protein abundance measurements were highly correlated (r = 0.81), indicating they were both detecting the same broad differences in TREM2 abundance. However, when we analyzed the ratio of these two measurements (*Probe 16300-4 / Probe 5635-66*), the genetic signal at the TREM2 locus became stronger than for either measurement alone.

Counterintuitively, taking the ratio of two measurements for the same protein acts as a powerful "noise filter."

* **Canceling Abundance:** Both probes capture the total amount of protein driven by non-genetic factors either biological (inflammation or clearance rates) or technical (sampling handling variability). Forming a ratio of the two protein measurements removes this shared variation.
* **Revealing Structure:** What remains in the ratio is the difference between the two probes. This creates a detector for genetic variants that alter the protein's physical structure (epitopes) or isoform composition, affecting how well one probe binds the target compared to the other.

Focusing on this difference, we fine-mapped the signal using SuSiE to two variants that affect which version of TREM2 is present, rather than just how much:
* **R62H Mutation (Exon 2 Skipping):** The ratio highlighted the R62H variant in TREM2 (rs143332484), a mutation [known to increase the skipping of Exon 2](https://pmc.ncbi.nlm.nih.gov/articles/PMC11224616/). This suggests that one of the aptamers binds to the region encoded by Exon 2 (losing signal when it is skipped), while the other binds a region common to all isoforms. 
* **Regulatory Variant (rs188904277):** A non-coding variant predicted to alter transcription factor binding (81% confidence via AlphaGenome), which could be regulating the specific expression of TREM2 isoforms.
