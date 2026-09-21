# Workshop: Mint a Soulbound NFT on Solana Devnet

Build and mint an NFT that is **permanently bound to your wallet**: it can never be transferred or sold. All you need is a laptop and Node.js.

Based on the official Metaplex guide: [Soulbound Assets in MPL Core](https://www.metaplex.com/docs/smart-contracts/core/guides/create-soulbound-nft-asset)

## What you'll learn

A **Metaplex Core** asset is Solana's next-gen NFT standard: a single on-chain account with a composable **plugin** system. There are two ways to make a Core asset soulbound:

1. **PermanentFreezeDelegate plugin**: create the asset with `frozen: true` and `authority: { type: "None" }`. Frozen from birth, and since nobody holds the authority to thaw it, it's non-transferable (and non-burnable) forever. ← *we use this one*
2. **Oracle plugin**: an oracle account that always rejects transfers. Still burnable.

## Prerequisites

- Node.js 22.12+ (24 LTS recommended; `node --version`)
- Git
- No Rust, no Solana CLI, no wallet extension needed

## Setup (5 min)

```bash
git clone <this-repo-url>
cd fall-school-metaplex-core
npm install          # run once at the repo root: installs every TypeScript track
cd 01-easy-track
npm run setup
```

`npm run setup` creates a throwaway devnet wallet (`wallet.json` at the repo root, shared by all TypeScript tracks; never commit it or use it for real funds) and requests 1 devnet SOL. If the airdrop is rate-limited, paste your printed address into https://faucet.solana.com.

## Your task

Open `scripts/2-mint-soulbound.ts` and complete the three TODOs so that `npm run mint`:

1. Creates a Metaplex Core asset on **devnet**
2. Attaches the plugin configuration that makes it **permanently non-transferable**
3. Uses a `NAME` that includes your name or nickname
4. Prints the asset address and its Solana Explorer link

Everything you need is in the Metaplex guide linked above. Read the PermanentFreezeDelegate section closely; the two fields that make the freeze permanent are the whole point of this exercise.

### Optional: personalize your metadata

The default `URI` points to a sample metadata JSON. To use your own image and description, copy `metadata-template.json`, edit it, host it publicly (e.g. a [GitHub Gist](https://gist.github.com) → "Raw" URL), and set `URI` to that link.

## Verify

```bash
npm run verify -- <YOUR_ASSET_ADDRESS>
```

This checks on-chain that the plugin is attached, frozen, and authority-less, and then actually tries to transfer your NFT away. The transfer must be rejected by MPL Core's freeze check; a failure for any other reason (no SOL, RPC error) does not count. Your wallet needs a little devnet SOL (at least 0.001) for this test. All checks must say `PASS`.

## Submit

Submit your asset's explorer link:

```
https://explorer.solana.com/address/<YOUR_ASSET_ADDRESS>?cluster=devnet
```

On the explorer page you should see your asset name and the Metaplex Core program as owner. Be ready to explain **why** your NFT cannot be transferred.

## Troubleshooting

- **Airdrop failed / 429**: use https://faucet.solana.com, or ask an instructor to send you devnet SOL.
- **`fetch failed` / timeout**: devnet RPC hiccup; retry, or set another RPC: `RPC_URL=https://your-rpc npm run mint`.
- **Transfer succeeds in verify**: your plugin config isn't permanent. Check both `frozen` and `authority`.
- **Verify says the transfer failed "NOT because of the freeze"**: the test couldn't run properly (usually no SOL or an RPC hiccup). Fund your wallet and re-run.
- **Stuck?** Read the full error message carefully, re-check the Metaplex guide, or ask an instructor.

## Done? Bonus challenge

Head over to [03-bonus-editions](../03-bonus-editions/README.md): Print Editions with different royalties, submitted via PR.

## Other stretch goals

1. Make the NFT **burnable but not transferable** using the Oracle plugin (see the soulbound guide).
2. Add an **Attributes plugin** with your graduation date stored on-chain.
3. Advanced (Rust): the Anchor track: the same mint as an on-chain program via CPI, see [02-anchor-track](../02-anchor-track/README.md).
