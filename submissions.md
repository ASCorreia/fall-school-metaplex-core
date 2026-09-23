# Solana Fall School — Submission (VedanshShuklaa)

All three tracks are complete: the required TypeScript mint (Track 1), the Anchor program version (Track 2), and the bonus print editions (Track 3). Every asset is minted on **devnet** with custom metadata (name, description, and a real image), and every explorer link below can be opened directly.

**Custom metadata:** hosted as a public GitHub Gist — https://gist.github.com/VedanshShuklaa/9d58706a42892a0ec6010a18ce609bd4 — two files: `soulbound-diploma.json` (Tracks 1 & 2) and `print-collection.json` (Track 3), both pointing at the same image.

## How to view a minted NFT

Open any address link below in a browser — Solana Explorer renders Metaplex Core assets directly: the image, name, owner, and plugin list all show up on the account page (no wallet connection needed, since these are just public on-chain reads). For example, opening the Track 1 asset shows "Vedansh's Soulbound Diploma", the picsum image, and a "Metaplex Core Asset" badge at the top. You can also inspect the raw account data via the "Raw" tab, or view it in a devnet-aware NFT explorer like Magic Eden's devnet views if you want a marketplace-style listing (not required for this assignment though — Solana Explorer is enough to prove the mint).

---

## Track 1 — Easy Track (TypeScript soulbound mint)

`01-easy-track/scripts/2-mint-soulbound.ts` was completed: a fresh asset signer is generated, `create(umi, ...)` is called with a `PermanentFreezeDelegate` plugin (`frozen: true`, `authority: { type: "None" }`), and the result is printed with its explorer link. `URI` points at the hosted `soulbound-diploma.json` gist.

- **Asset:** [`C3vX4wH7ABwDB7ony5DJ6c4M5DU7DjcSq3eam7Ajga6`](https://explorer.solana.com/address/C3vX4wH7ABwDB7ony5DJ6c4M5DU7DjcSq3eam7Ajga6?cluster=devnet)
- **Verification:** `npm run verify -- C3vX4wH7ABwDB7ony5DJ6c4M5DU7DjcSq3eam7Ajga6` returned all 5 checks:
  ```
  PASS  Asset exists: Vedansh's Soulbound Diploma
  PASS  PermanentFreezeDelegate plugin attached
  PASS  Asset is frozen
  PASS  Plugin authority is None (found: None)
  PASS  Transfer attempt was rejected on-chain by MPL Core's freeze check
  ```

**Why it can't be transferred:** the asset is created already frozen (`frozen: true`), and its plugin authority is `None` — meaning no key exists anywhere that could ever unfreeze it. MPL Core checks the freeze state on every transfer/burn attempt and rejects them unconditionally, permanently.

---

## Track 2 — Anchor Track (Rust program)

The `mint_soulbound_nft` instruction in `programs/soulbound-nft/src/instructions/mint_soulbound_nft.rs` was completed: the CPI into Metaplex Core (`CreateV2CpiBuilder`) now attaches one `PluginAuthorityPair` — `Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true })` with `authority: Some(PluginAuthority::None)` — the exact Rust equivalent of Track 1's TypeScript plugin config.

- **Program (devnet):** [`CPEZfd24CjWS7pDkQrdhyTQAparykfRb9K2WWJiBG33b`](https://explorer.solana.com/address/CPEZfd24CjWS7pDkQrdhyTQAparykfRb9K2WWJiBG33b?cluster=devnet)
- **Client script:** `02-anchor-track/submissions/vedanshshuklaa/mint.ts` — calls the deployed program to mint a real soulbound asset owned by the deploying wallet, using the hosted `soulbound-diploma.json` metadata.
- **Minted asset:** [`5qMPELQLYbkRFwdLtkUmWecUAdDLpvRwnpyfAH3pPqxw`](https://explorer.solana.com/address/5qMPELQLYbkRFwdLtkUmWecUAdDLpvRwnpyfAH3pPqxw?cluster=devnet)
- **Mint transaction:** [`4vrspT7Qp6QJ5BjQYJZzBapNPUixrSy74qXc2x6PE17XvtMBWmLTa8PaN2ADA168uUWf4w88ZxhY5JbyrdMWuUdY`](https://explorer.solana.com/tx/4vrspT7Qp6QJ5BjQYJZzBapNPUixrSy74qXc2x6PE17XvtMBWmLTa8PaN2ADA168uUWf4w88ZxhY5JbyrdMWuUdY?cluster=devnet)

Full submission details: [`02-anchor-track/submissions/vedanshshuklaa/SUBMISSION.md`](02-anchor-track/submissions/vedanshshuklaa/SUBMISSION.md).

### Local environment notes (not code issues)

Two environment-specific quirks came up while getting `anchor test`/`anchor deploy` working locally on this machine, worth flagging for anyone reproducing this:

1. **Stale platform-tools broke the build.** The locally cached `platform-tools v1.52` (used by `cargo build-sbf` under this machine's installed Solana CLI) produced a `.so` with a malformed ELF header — malformed enough that `solana program deploy` itself rejected it outright with `ELF error: Failed to parse ELF file: invalid file header`. Genesis-embedding the same broken binary into a local `solana-test-validator` (via `--bpf-program`) silently "succeeded" at the account level but the program was never actually executable, producing a confusing `Program is not deployed` error at invoke time. Rebuilding with `cargo build-sbf --tools-version v2.3.3` fixed it — the resulting binary deploys and executes correctly, confirmed independently via a clean local `solana program deploy` and the live devnet deploy above.
2. **One remaining local `anchor test` flake.** With the correct build, `anchor test --validator legacy` still occasionally reports `AccountNotFoundError` when the test's `fetchAsset` (from `@metaplex-foundation/mpl-core`) call runs immediately after the mint transaction confirms. This was root-caused to RPC read lag on the local test validator, not a logic bug: re-fetching the exact same asset address a few seconds later (via a small standalone script) succeeds and returns the fully deserialized `AssetV1` account. The mint transaction itself always lands successfully on-chain (confirmed via direct `solana account` lookups showing the correct MPL-Core-owned account every time), and the "cannot be transferred" test passes consistently. The live devnet mint above is the definitive proof the program works correctly end to end.

---

## Track 3 — Bonus: Print Editions with Tiered Royalties

`03-bonus-editions/editions.ts` was completed: a collection is created with a `MasterEdition` plugin (`maxSupply: 3`) and a collection-level `Royalties` plugin, then three assets are printed into it, each with its own `Edition` plugin (numbers 1–3) and its own `Royalties` plugin at a different basis-point value. `URI` points at the hosted `print-collection.json` gist. (A small retry loop was added around the post-mint `fetchCollection` call — devnet's RPC occasionally lags a beat behind a just-confirmed transaction, so the fetch retries a few times instead of failing outright.)

- **Collection:** [`9QnGqqp4F98Wpdz84b48pBkMsR8qHQs4wRtvMXAGtpt9`](https://explorer.solana.com/address/9QnGqqp4F98Wpdz84b48pBkMsR8qHQs4wRtvMXAGtpt9?cluster=devnet)
- **Print #1 (2.5% royalty):** [`DWAx4hp3DrRL588LtsKvoYaaGHh3vhJHg2j2VHAfd68R`](https://explorer.solana.com/address/DWAx4hp3DrRL588LtsKvoYaaGHh3vhJHg2j2VHAfd68R?cluster=devnet)
- **Print #2 (5% royalty):** [`G8TxZS7kMRiEbkmu1JoKdWYoKTiRXg9K4svqkExspd4u`](https://explorer.solana.com/address/G8TxZS7kMRiEbkmu1JoKdWYoKTiRXg9K4svqkExspd4u?cluster=devnet)
- **Print #3 (10% royalty):** [`GzQS7iPwBqoGtyQi9h6xYZiWuoWVcuzRUBXbycSTZMJz`](https://explorer.solana.com/address/GzQS7iPwBqoGtyQi9h6xYZiWuoWVcuzRUBXbycSTZMJz?cluster=devnet)

**Which royalty applies to Edition #2, and why?** Its own asset-level `Royalties` plugin (5% / 500 basis points) applies, not the collection's. An asset's own `Royalties` plugin always overrides the collection-level one when both exist — the collection-level plugin is only a fallback for assets printed without their own Royalties plugin. Every print here has its own explicit royalty, so each resolves independently.

Full submission details: [`03-bonus-editions/submissions/vedanshshuklaa/SUBMISSION.md`](03-bonus-editions/submissions/vedanshshuklaa/SUBMISSION.md).

---

## Summary

| Track | Status | Key artifact |
|---|---|---|
| 1 — Easy (TS) | ✅ Complete, verified (5/5 PASS), custom metadata | [Asset](https://explorer.solana.com/address/C3vX4wH7ABwDB7ony5DJ6c4M5DU7DjcSq3eam7Ajga6?cluster=devnet) |
| 2 — Anchor (Rust) | ✅ Complete, deployed + minted on devnet, custom metadata | [Program](https://explorer.solana.com/address/CPEZfd24CjWS7pDkQrdhyTQAparykfRb9K2WWJiBG33b?cluster=devnet) / [Asset](https://explorer.solana.com/address/5qMPELQLYbkRFwdLtkUmWecUAdDLpvRwnpyfAH3pPqxw?cluster=devnet) |
| 3 — Bonus editions (TS) | ✅ Complete, 1 collection + 3 tiered-royalty prints, custom metadata | [Collection](https://explorer.solana.com/address/9QnGqqp4F98Wpdz84b48pBkMsR8qHQs4wRtvMXAGtpt9?cluster=devnet) |
