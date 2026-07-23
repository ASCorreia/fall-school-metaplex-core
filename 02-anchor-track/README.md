# Advanced Track: Soulbound NFT via an Anchor Program

An [Anchor](https://www.anchor-lang.com) (v1.1.2) program that mints the same soulbound NFT on-chain, by CPI into MPL Core's `CreateV2` with the `PermanentFreezeDelegate` plugin (`frozen: true`, `authority: PluginAuthority::None`).

This track requires the Rust toolchain. It is **optional** and not needed for the main assignment in [01-easy-track](../01-easy-track/README.md).

## Project layout

- `programs/soulbound-nft/src/lib.rs`: the program entrypoint: declares the program ID and exposes one instruction, `mint_soulbound_nft(name, uri)`, delegating to its handler.
- `programs/soulbound-nft/src/instructions/mint_soulbound_nft.rs`: the `MintSoulboundNft` accounts struct and the handler, which CPIs into MPL Core using `CreateV2CpiBuilder` from the `mpl-core` Rust SDK (v0.12).
- `tests/soulbound-nft.ts`: mints an asset, verifies the freeze plugin is active, and asserts that a transfer attempt by the owner fails.

Note: `mpl-core`'s optional `anchor` feature still targets anchor-lang 0.31/0.32, so this project uses the crate's default features. Both crates share the same `solana-account-info` 3.x `AccountInfo`, and all interaction goes through the generated CPI builders.

## Prerequisites

- Rust + Solana toolchain **v3.1.10** (`sh -c "$(curl -sSfL https://release.anza.xyz/v3.1.10/install)"`)
- Anchor CLI **1.1.2** (`avm install 1.1.2 && avm use 1.1.2`)
- [Surfpool](https://github.com/solana-foundation/surfpool) ≥ 1.1.2 (default test backend for Anchor v1)
- Node 20+ and yarn

## Build & test

```bash
yarn install
anchor keys sync   # regenerate/sync the program ID with your local keypair
anchor build
anchor test        # Surfpool (mainnet fork, MPL Core already deployed)
```

To use the legacy local validator instead, `Anchor.toml` already clones the MPL Core program (`CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`) from mainnet:

```bash
anchor test --validator legacy
```

`anchor build` in Anchor v1 errors if the declared program ID doesn't match your keypair file. That's what `anchor keys sync` fixes on first build.

## Minting from a client

```ts
await program.methods
  .mintSoulboundNft("My Diploma", "https://arweave.net/metadata.json")
  .accountsPartial({
    payer: wallet.publicKey,
    asset: assetKeypair.publicKey,   // fresh keypair, must sign
    owner: recipient,                // wallet the NFT is bound to
    mplCoreProgram: new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"),
    systemProgram: SystemProgram.programId,
  })
  .signers([assetKeypair])
  .rpc();
```

## Your task

1. Build and test the program locally (`anchor build && anchor test`).
2. Deploy it to **devnet**:

```bash
solana config set --url devnet
solana airdrop 2          # or use https://faucet.solana.com
anchor keys sync
anchor build
anchor deploy --provider.cluster devnet
```

3. Write a small client script that calls `mint_soulbound_nft` on your deployed program (see the snippet above) and mint an asset to your wallet.
4. Check on the explorer that the asset is frozen and cannot be transferred.

## Submit (via PR)

1. Fork this repo and create a branch.
2. Add a folder `submissions/<your-github-handle>/` containing:
   - your client mint script
   - `SUBMISSION.md` (copy `submissions/SUBMISSION-template.md`) with your devnet program ID, asset address, and mint transaction links
3. Open a Pull Request. Do NOT include keypairs or `wallet.json` in your PR.
