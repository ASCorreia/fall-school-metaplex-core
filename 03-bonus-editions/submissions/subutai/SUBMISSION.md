# Bonus Challenge Submission

- Name / GitHub handle: subutai
- Collection (MasterEdition): https://explorer.solana.com/address/DpBTqM3mh3ewVWYxkgTCpbKeKNPh1z5ERk9B2jnyuRUs?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/5e6aNif2k2sdE4CzfyVh6Wm1Xpk3HJCu8PrpPQWa3d7M?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/B7LAnLTn1XN7ZKvWjF3XGh1Rrb4wRio1mVnmFnzn2N7J?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/D1rppyCfFNeTGXTEJaP1UbS96XzML3aSuu2JrjNx7aGm?cluster=devnet

Which royalty applies to Edition #2, and why?

> A 5% (500 basis points) royalty applies to Edition #2. In Metaplex Core, when an asset defines its own asset-level `Royalties` plugin, it overrides the collection-level `Royalties` plugin. Although the collection was configured with a default 5% royalty (500 bps), Edition #2 is explicitly governed by its own asset-level `Royalties` plugin set to 500 basis points.
