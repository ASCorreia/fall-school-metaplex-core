# Summer School: Metaplex Core

Hands-on workshop for [Metaplex Core](https://www.metaplex.com/docs/smart-contracts/core), Solana's next-gen NFT standard. A laptop and Node.js are all you need.

## Repository structure

```
.
├── 01-easy-track/       (1) Soulbound NFT with TypeScript / Umi  ← start here
│   ├── README.md            full step-by-step guide
│   ├── scripts/             setup wallet → mint (your task) → verify
│   └── solution/            reference solution (spoilers)
├── 02-anchor-track/     (2) Soulbound NFT as a Rust on-chain program (Anchor)
│   ├── README.md            build, test, deploy to devnet
│   ├── programs/            the Anchor program
│   └── submissions/         submit your PR here
└── 03-bonus-editions/   Bonus: Print Editions with different royalties
    ├── README.md            the challenge
    ├── editions.ts          your task (complete the TODOs)
    └── submissions/         submit your PR here
```

## The tracks

Tracks (1) and (2) build the same thing: a **soulbound (non-transferable) NFT** on devnet, permanently bound to your wallet. For a deeper understanding of how soulbound assets work in Core, see the official guide: [Soulbound Assets in MPL Core](https://www.metaplex.com/docs/smart-contracts/core/guides/create-soulbound-nft-asset).

### (1) Easy track: TypeScript / Umi

No Rust, no Solana CLI. Complete the TODOs in `scripts/2-mint-soulbound.ts` and mint on devnet.

**→ Start with [01-easy-track/README.md](./01-easy-track/README.md)**

**Submit:** your asset's explorer link, `https://explorer.solana.com/address/<ASSET_ADDRESS>?cluster=devnet`

### (2) Anchor track: Rust on-chain program

The same soulbound mint, but as an Anchor program that CPIs into MPL Core. Requires the Rust + Solana + Anchor toolchain.

**→ Start with [02-anchor-track/README.md](./02-anchor-track/README.md)**

**Submit:** a PR adding `02-anchor-track/submissions/<your-github-handle>/` with your client mint script and a filled-in `SUBMISSION.md` (program ID + asset explorer links).

## How the soulbound part works

The asset is created with the **`PermanentFreezeDelegate`** plugin:

- `frozen: true`: frozen from birth; MPL Core itself rejects every transfer or burn attempt.
- `authority: { type: "None" }`: nobody can ever update the plugin, so it can never be thawed. Bound to its owner's wallet forever.

## Bonus challenge: Print Editions with different royalties

Based on [Print Editions with MPL Core](https://www.metaplex.com/docs/smart-contracts/core/guides/print-editions): create a Master Edition collection, print 3 numbered Editions into it, and give each edition a different royalty via an asset-level `Royalties` plugin.

**→ Start with [03-bonus-editions/README.md](./03-bonus-editions/README.md)**

**Submit:** a PR adding `03-bonus-editions/submissions/<your-github-handle>/` with your `editions.ts` and a filled-in `SUBMISSION.md` (4 explorer links: collection + 3 editions).
