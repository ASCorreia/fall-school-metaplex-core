# Anchor Track Submission

- Name / GitHub handle: Christian Arceo / HomeTownHer0
- Program ID (devnet): https://explorer.solana.com/address/nGvpgoH9jMeLE84oek18RFA4YUfhDnZCgaSAkoDvvKb?cluster=devnet
- Minted asset: https://explorer.solana.com/address/84duvuimjVqwDRAzeUzeQx7ocN5YQjvyzg9HA3FAXDyZ?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/5zhqRRxNNpwmS44h5W6J6KLTVLgvcJZ5WfBoNTsXnBKy83XqZwCF4w371VNaNkGFePG7oSETN3LmSjRZEXYMAqYz?cluster=devnet

## Track 1 (TypeScript / Umi)

- Asset: https://explorer.solana.com/address/AmVA9xSYn3qZU5D4oCdK6ACv7cfvEWPxkqW6DM2EsjBs?cluster=devnet

This asset was minted with the PermanentFreezeDelegate plugin set to frozen: true and authority: None. Core itself rejects every transfer and burn, and nobody can thaw it later, so it stays in this wallet forever.

## How does your program make the NFT soulbound?

The program CPIs into Metaplex Core CreateV2 and attaches PermanentFreezeDelegate at creation with frozen: true and authority: None. That freeze is permanent because no authority can later thaw or remove the plugin, so Core rejects transfers and burns.
