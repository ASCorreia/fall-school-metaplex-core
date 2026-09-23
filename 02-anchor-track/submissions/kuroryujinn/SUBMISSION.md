# Anchor Track Submission

- Name / GitHub handle: kuroryujinn (Tanmay)
- Program ID (devnet): https://explorer.solana.com/address/4Fj4Dda1b6hyF2hcTtvCbHHNNXs7N9tWJoVa4G6n9QY4?cluster=devnet
- Minted asset: https://explorer.solana.com/address/96YKkEjgxoW7yQutAwsXtYYjpNwH3NPGC3DBBNA4bx6i?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/367zcgJus3yuqujwg6bhgiSCreMiRpd3GR6o17qRWiGLDH8ZKcwNPtkhRZmKtHvy4qvChnS3KZi3NUVKVvFokjxH?cluster=devnet

How does your program make the NFT soulbound?

> When minting, my program CPIs into Metaplex Core's `CreateV2` and attaches
> the `PermanentFreezeDelegate` plugin with `frozen: true` and
> `PluginAuthority::None`. `frozen: true` makes MPL Core reject every
> transfer/burn of the asset, and the `None` authority means nobody can ever
> update or remove the plugin — so the asset can never be thawed and is
> permanently bound to its owner.
