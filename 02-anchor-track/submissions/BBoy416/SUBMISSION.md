# Anchor Track Submission

## Student

- Name: Christian Tomicic
- GitHub handle: BBoy416

## Devnet Links

- [Deployed Anchor program](https://explorer.solana.com/address/GKCedV7gKDyc57xiwvmKDZTMCiCgEr4a9C7qR9XGDHvA?cluster=devnet)
- [Program deployment transaction](https://explorer.solana.com/tx/2JMytjeY3n9sadMRRHE4TPNxrkRdbdJ58jwHD8xjp47tdREHUm4xqfNRPpa8YFhJVp4AU1jNKp6fZPKdZugmPYPg?cluster=devnet)
- [Minted soulbound Core asset](https://explorer.solana.com/address/EFF6KMuBHj4tJNGsZfvtgvF49U1YfuqRHbeKefpzQfcB?cluster=devnet)
- [Asset mint transaction](https://explorer.solana.com/tx/vgCQRrMvZfPcKGRVJ5U8iepzFrxueXvKrfGRvzfDbGPbpRAW3MGLrXw9Ym5S7DYfbfYhKBh1NARoiVuBSUvmeeh?cluster=devnet)

## How the Program Makes the NFT Soulbound

The Anchor program makes a cross-program invocation into the official Metaplex Core program using `CreateV2CpiBuilder`.

During asset creation, it attaches a `PermanentFreezeDelegate` plugin with:

```rust
PermanentFreezeDelegate {
    frozen: true,
}