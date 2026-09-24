# Bonus Challenge Submission

- Name / GitHub handle: Anon1one
- Collection (MasterEdition): https://explorer.solana.com/address/4AjPKcEvXtqqNiengEWktNYCPR2GhE6cXHtkkkbm6f7d?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/5cUVuL1jp1q8CreDxrKpFv9817NGcfYEkt96xf4BU6Mh?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/4K8DBJXXCSfvT8qEWY9tUvuRoAQWSVgUXuBPmC4Qq8st?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/2LpJEfsdiVuzQaiVZobpqyvqcGX7Xzrs6k3meTyaptU8?cluster=devnet

Which royalty applies to Edition #2, and why?

> Edition #2 pays 5% (500 basis points), and that comes from its own asset-level `Royalties` plugin. In MPL Core, a plugin on the asset overrides the same plugin on the collection, so each edition uses its own royalty and the collection-level one is only a fallback for assets that don't set one. The collection royalty also happens to be 5%, so for #2 both give the same number, but the value that actually applies is the asset's. Editions #1 (2.5%) and #3 (10%) show the override clearly because they differ from the collection's 5%.
