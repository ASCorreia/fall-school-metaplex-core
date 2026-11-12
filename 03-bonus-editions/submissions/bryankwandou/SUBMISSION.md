# Bonus Challenge Submission

- Name / GitHub handle: Bryan Kwandou (nayrbryanGaming) / bryankwandou
- Collection (MasterEdition): https://explorer.solana.com/address/7PVjJg7cajEznTqum7HpXA3TpDgUgmLRzNVMfxksVNkT?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/32Y3YdfPiNgqNgdbJurMPe8FbfVbDpN4P58tBDtsVqZv?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/AHiLruSTg4ZLscBKH3pztrHKt6ytKYkiYLMXASCEj19Q?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/GzihCPreBwp9yDjuByhhTuHr6SZ4MkskCe84eqZAFwU7?cluster=devnet

Which royalty applies to Edition #2, and why?

> Edition #2's own asset-level Royalties plugin applies: 500 basis points (5%). When an asset and its collection carry the same plugin type, the asset's plugin overrides the collection's, so the collection-level Royalties (also 500 bps here) is only a fallback for assets that have no Royalties plugin of their own. The two values happen to match for #2, but it is the asset plugin that is read: Edition #1 resolves to 2.5% and Edition #3 to 10% despite the same 5% collection plugin.
