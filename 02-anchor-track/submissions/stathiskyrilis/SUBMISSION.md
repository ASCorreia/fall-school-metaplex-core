# Anchor Track Submission

- Name / GitHub handle: Stathis Kyrilis (stathisKyrilis)
- Program ID (devnet): https://explorer.solana.com/address/5qG8YL1gQFP2phKbEehUzxmUT8H9LaVisShpPogVvFNr?cluster=devnet
- Minted asset: https://explorer.solana.com/address/DLWVCVTh2Jvnb8BVggb6V6UVc6KHnSwvoFLUXVuo44YJ?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/4PxkZLVa5rdC484RrJykmTYEiMtLUo5FQ9yxu9kn6b843nAQbsKBG76tVXFvCefXV57Jt27nKnHDdrpNuvwoXQUZ?cluster=devnet

How does your program make the NFT soulbound?

> The `mint_soulbound_nft` instruction CPIs into Metaplex Core `CreateV2` and
> attaches a `PermanentFreezeDelegate` plugin with `frozen: true` and
> `authority: PluginAuthority::None`. Frozen means Core rejects every transfer
> and burn. Authority `None` means nobody can update that plugin to unfreeze
> it, so the lock is permanent.
