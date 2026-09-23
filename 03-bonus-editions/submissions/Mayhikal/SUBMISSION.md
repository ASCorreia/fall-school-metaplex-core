# Bonus Challenge Submission

- Name / GitHub handle: Mayhikall
- Collection (MasterEdition): https://explorer.solana.com/address/3ATRkw1javJUsxicLiQEZSu9XXNgC3JqWAVWdkkFwx1c?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/3qEukvpqzLgKjLaT8PGa8zxk8nFCSZFAfMpR5rhpavQM?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/yXjNVV5mzyCvnTPjoPr5WR8pXzcxsHNhWVLJB97HG83?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/7wBDe1sFcQQN2ja8nBHruCudkpQdURFWwjXDabmxgwEL?cluster=devnet

Which royalty applies to Edition #2, and why?

> The 5% royalty (500 basis points) applies to Edition #2. While both the collection and Edition #2 happen to specify 500 basis points, the asset-level Royalties plugin explicitly overrides the collection-level plugin in Metaplex Core. When an asset defines its own plugin instance, Metaplex Core evaluates that asset-level plugin rather than falling back to the collection's settings.
