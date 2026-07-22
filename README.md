# Summer School — Soul-Bound NFT with Metaplex Core

An [Anchor](https://www.anchor-lang.com) (v1.1.2) program that mints a **soul-bound (non-transferable) NFT** as a [Metaplex Core](https://developers.metaplex.com/core) asset.

## How the soul-bound part works

Instead of custom transfer-blocking logic, the program leans on **Metaplex Core plugins**. When the asset is created (via CPI to MPL Core's `CreateV2`), it attaches the **`PermanentFreezeDelegate`** plugin with:

- `frozen: true` — the asset is frozen from birth, so MPL Core itself rejects every transfer or burn attempt.
- `authority: PluginAuthority::None` — no one holds the authority to update the plugin, so the asset can **never be thawed**. It is bound to its owner's wallet forever.

An alternative Core-native approach is the Oracle external plugin adapter (an oracle account that always rejects `Transfer` lifecycle events); the permanent freeze plugin is the simplest and fully on-chain-static option.

## Project layout

- `programs/soulbound-nft/src/lib.rs` — the program entrypoint: declares the program ID and exposes one instruction, `mint_soulbound_nft(name, uri)`, delegating to its handler.
- `programs/soulbound-nft/src/instructions/mint_soulbound_nft.rs` — the `MintSoulboundNft` accounts struct and the handler, which CPIs into MPL Core using `CreateV2CpiBuilder` from the `mpl-core` Rust SDK (v0.12).
- `tests/soulbound-nft.ts` — mints an asset, verifies the freeze plugin is active, and asserts that a transfer attempt by the owner fails.

Note: `mpl-core`'s optional `anchor` feature still targets anchor-lang 0.31/0.32, so this project uses the crate's default features — both crates share the same `solana-account-info` 3.x `AccountInfo`, and all interaction goes through the generated CPI builders.

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
anchor test        # Surfpool (mainnet fork — MPL Core already deployed)
```

To use the legacy local validator instead, `Anchor.toml` already clones the MPL Core program (`CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`) from mainnet:

```bash
anchor test --validator legacy
```

`anchor build` in Anchor v1 errors if the declared program ID doesn't match your keypair file — that's what `anchor keys sync` fixes on first build.

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
