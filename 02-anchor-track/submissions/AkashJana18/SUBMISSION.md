# Anchor Track Submission

- Name / GitHub handle: AkashJana18
- Program ID (devnet): https://explorer.solana.com/address/8tgCgqtxTioQFoRvbTg3hjf3NQ85mGz8ojqsJsfcdder?cluster=devnet
- Minted asset: https://explorer.solana.com/address/FaKzyDDRkWhurmyxaGNUW4EMB5HyyjFeABQoSjCFhdhb?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/RZXqi3dvNxRSuQMtwoncgPBxPxwHVk6zsM8Mu44wxc7K5MohbyTyMgHN2Gj1iDHHrDuGtM3rTroEtKNG9dZemJo?cluster=devnet

How does your program make the NFT soulbound?

> At creation time the program CPIs into MPL Core `CreateV2` with a
> `PluginAuthorityPair` attaching `Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true })` with
> `authority: Some(PluginAuthority::None)`
> (`programs/soulbound-nft/src/instructions/mint_soulbound_nft.rs`).
> `frozen: true` makes MPL Core reject every `transferV1`/burn, and
> `Authority::None` means nobody can ever update/thaw that plugin, so the
> asset is permanently bound to the `owner` set in the same CPI.
