# Anchor Track Submission

- Name / GitHub handle: Aditya-linux
- Program ID (devnet): Pending deployment
- Minted asset: Pending devnet mint
- Mint transaction: Pending devnet mint

How does your program make the NFT soulbound?

> It creates the asset with Metaplex Core's `PermanentFreezeDelegate` plugin,
> with `frozen: true` and `PluginAuthority::None`. Transfers and burns are
> rejected from creation, and no authority can ever unfreeze the asset.
