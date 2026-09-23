# Anchor Track Submission

- Name / GitHub handle: Bryan Kwandou (nayrbryanGaming) / bryankwandou
- Program ID (devnet): https://explorer.solana.com/address/8cMtav6CjSv3kYN8hjShF8eS3cyHoZgr29gfvXsp5ycY?cluster=devnet
- Minted asset: https://explorer.solana.com/address/38W3bekPHGVUFV5kMoVPBffkFbNQ39Ddom7VoCWBALLS?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/4o6FpFk99gXUqx38RBZqsLhgyVCcnhHjg8Rh2jASC4nV5ng3kAmLX5xxUW2fqvA8J4KUzeYToy4cVysdPVxJnurk?cluster=devnet

How does your program make the NFT soulbound?

> `mint_soulbound_nft` CPIs into MPL Core's `CreateV2` and attaches a single `PermanentFreezeDelegate { frozen: true }` plugin with `authority: PluginAuthority::None`. Because it is a permanent plugin it can only be added at creation, `frozen: true` makes Core reject every transfer and burn from the moment the asset exists, and with no authority there is no key that can ever thaw it or update the plugin. The program checks `mpl_core_program` against the canonical Core ID, so the CPI cannot be redirected to an impostor program.

Both tests (`mints a soul-bound Core NFT`, `cannot be transferred by its owner`) pass against a Surfpool mainnet fork. The client script is `submissions/bryankwandou/mint.ts`.
