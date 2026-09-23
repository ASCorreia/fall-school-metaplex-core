# Bonus Challenge Submission

- Name / GitHub handle: Zai Alam / zaialamm
- Collection (MasterEdition): https://explorer.solana.com/address/AssAaJT1VgqVKb1CJzEKjeotkmZD6ZWF1GJFepkv7sF6?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/DdU5JY6tqDKvUz4hR2hVuRFXqzPD8KfJ5L7gyKTdUMvP?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/4ramopmGbGidUrmfGENDUiKeNT964TXCjgpS43Dgjc3t?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/C19YpPAadsF2TaFZ3g3hHau2aHXrMkYLLznoKPkvxRNc?cluster=devnet

Which royalty applies to Edition #2, and why?

> 500 basis points (5%), from Edition #2's own asset-level `Royalties` plugin. When an asset
> carries its own `Royalties` plugin, it overrides the collection-level plugin, so each print gets
> its own rate: #1 pays 250 bps (2.5%), #2 pays 500 bps (5%), #3 pays 1000 bps (10%). Edition #2
> happens to match the collection's 500 bps, but the value that applies is the asset's own plugin,
> not the collection's. Without an asset-level plugin, the collection's 500 bps would apply.
