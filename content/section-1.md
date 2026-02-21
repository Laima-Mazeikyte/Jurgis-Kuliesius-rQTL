## The logic behind Protein Ratios

Genome-Wide Association Studies (GWAS) have repeatedly scanned the human genome for associations with thousands of protein levels. The approach has successfully identified numerous causal genetic links to disease by bridging the functional gap in post-GWAS analyses via mendelian randomization, colocalization and other statistical approaches. However, by considering each multiplexed protein in isolation, the GWAS fails to shed light on the pathways through which these proteins are mediating their effects. 
Here, rather than analyzing protein abundances separately, we analyze ratios of protein pairs in a protein ratio-QTL (rQTL) framework. This approach is designed to increase the signal to noise ratio by canceling out any shared variance between protein pairs.

Suppose Protein A has a genetic signal (G) but is buried in environmental noise (N), which can be either biological (e.g. inflammation) or technical. Meanwhile, Protein B has no genetic signal in that locus but is affected by the exact same noise (N).

- ProteinA=Genetics(G)+Inflammation(N)
- Protein B has no genetic link but fluctuates similarly with inflammation.
- ProteinB=Inflammation(N)
- When we take the ratio, we subtract the shared environment:
- Ratio=ProteinA – ProteinB = (G+N)−N=G

The result is a genetic signal, stripped of the biological noise that previously suppressed it.

