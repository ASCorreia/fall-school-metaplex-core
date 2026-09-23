# Anchor Track Submission

- Name / GitHub handle: VedanshShuklaa
- Program ID (devnet): https://explorer.solana.com/address/CPEZfd24CjWS7pDkQrdhyTQAparykfRb9K2WWJiBG33b?cluster=devnet
- Minted asset: https://explorer.solana.com/address/5qMPELQLYbkRFwdLtkUmWecUAdDLpvRwnpyfAH3pPqxw?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/4vrspT7Qp6QJ5BjQYJZzBapNPUixrSy74qXc2x6PE17XvtMBWmLTa8PaN2ADA168uUWf4w88ZxhY5JbyrdMWuUdY?cluster=devnet
- Metadata: https://gist.githubusercontent.com/VedanshShuklaa/9d58706a42892a0ec6010a18ce609bd4/raw/dfe93c99d24a8b49a728f27fbddf118ed3c0d04a/soulbound-diploma.json

How does your program make the NFT soulbound?

> The `mint_soulbound_nft` instruction builds a `CreateV2CpiBuilder` CPI into Metaplex Core and attaches one plugin at creation time: `PermanentFreezeDelegate { frozen: true }` with `authority: Some(PluginAuthority::None)`. The `frozen: true` field means the asset is frozen from the moment it's created, so MPL Core rejects any transfer or burn instruction against it. The `PluginAuthority::None` authority means nobody — not even the original creator — holds the power to unfreeze it later. Together, those two settings make the freeze permanent rather than a temporary lock: there is no key that can ever thaw the asset, so it is bound to its owner's wallet forever.
