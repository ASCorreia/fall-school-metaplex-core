# Anchor Track Submission

- Name / GitHub handle: Zai Alam / zaialamm
- Program ID (devnet): https://explorer.solana.com/address/8phhq4k6CbQXbezaScmX9sgxQs4sjGfYWe1m7FwmbVWz?cluster=devnet
- Minted asset: https://explorer.solana.com/address/HCeedd6xJyTGUnDRHHi6ASreBUoLDN5Yr5GnVE5Knwum?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/4diUeKWHXhYuU1yv5TMktNYzYjQbXnUwXM3A2s4SxNaupZtvEbfFytr9YZ6eCLbx1xYg8Ftqez3mGijJtQXZDk1P?cluster=devnet

How does your program make the NFT soulbound?

> The `mint_soulbound_nft` instruction CPIs into MPL Core's `CreateV2` and passes one
> `PluginAuthorityPair`: `Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true })`
> with `authority: Some(PluginAuthority::None)`. `frozen: true` means the asset is frozen from the
> moment it is created, so MPL Core rejects every transfer and burn. `PluginAuthority::None` means
> nobody holds the authority to update the plugin, so nobody can ever thaw it. Both together make
> the freeze permanent and the NFT bound to its owner forever.
