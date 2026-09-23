# Anchor Track Submission

- Name / GitHub handle: Xinyan Liu / @1salz-yan
- Program ID (devnet): https://explorer.solana.com/address/67aKpHHP6yPpdLUhF3Ugp7LFYxDzbELg5DfKbELpvSNd?cluster=devnet
- Minted asset: https://explorer.solana.com/address/8KketBsMK3DPKzS2o3PqHNR2NviQNoUgzKkRDc9QcG4W?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/2oxkU8sfurJ8idSvth1AWDEW2JBEqGVXUyWrD89SSiBmz1QmQHXdrEaHinhzDV9c5JV13ZLM8HaUJ1USbDqNg7kE?cluster=devnet

Extra: the deploy transaction is
https://explorer.solana.com/tx/2cEeWW8GhT3CugCjbrPYmuNjCu27TWh3L5176Ub6tEDXBUnPo8PgcBonqth3GTySxvJNjXBj21jGPkC8U5udWpHB?cluster=devnet

## How does your program make the NFT soulbound?

The handler does not mint the asset itself: it CPIs into MPL Core's `CreateV2`
with `CreateV2CpiBuilder`, so the Core program creates the asset account, with
my program as the caller. What makes it soulbound is the single
`PluginAuthorityPair` in `.plugins(vec![...])`:

- `plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true })`
  – the asset is **created already frozen**, so MPL Core rejects every transfer
  and every burn of it.
- `authority: Some(PluginAuthority::None)` – the plugin has **no authority at
  all**. With a real authority, whoever holds it could call the plugin's update
  instruction and thaw the asset again; `None` removes that possibility, which
  is what makes the freeze *permanent* rather than just long.

Both parts are needed: `frozen: true` alone is a temporary lock as long as some
account can update the plugin, and `authority: None` alone freezes nothing.
Because there is nobody who could ever unfreeze it, the NFT stays in the wallet
passed as `owner` for good.

Verified after minting with `fetchAsset` on devnet: the asset
`8KketBsMK3DPKzS2o3PqHNR2NviQNoUgzKkRDc9QcG4W` reports
`permanentFreezeDelegate = { frozen: true, authority: { type: "None" } }` and
`owner = FuSUKwptcVGjtRgtVQsKEHEK6UUGK4P6zwWepx35qXXL`. `anchor test` passes the
same two properties locally: the asset is frozen, and a transfer attempt made by
its owner fails.

## Commands used

```bash
cd 02-anchor-track
yarn install
anchor keys sync
anchor build
anchor test                                  # Surfpool: 2 passing
anchor deploy --provider.cluster devnet     # -> 67aKpHHP6...pvSNd

ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=$HOME/.config/solana/id.json \
npx ts-node submissions/1salz-yan/mint.ts
```
