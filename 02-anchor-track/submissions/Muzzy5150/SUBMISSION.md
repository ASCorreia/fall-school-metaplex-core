# Anchor Track Submission

- Name / GitHub handle: Muzzy5150
- Program ID (devnet): https://explorer.solana.com/address/HdBGPtqLumSmoTWdYcyxq2aJj9RsuSByNZbkqZ18prwf?cluster=devnet
- Minted asset: https://explorer.solana.com/address/51uXcL1hVc71C2fYdwoj9d1iGvfQrVNJxso7vpgAtgbE?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/vYRxHEZN37oK2XbgsR6Sw5udgTWMtqRhDZ8VZ7YyK5DdCnQAtXgpyH2ELWUEmC5E8yidB3woaPFB8oRprpgfmBF?cluster=devnet

How does your program make the NFT soulbound?

The program CPIs into MPL Core's `CreateV2` instruction and creates the asset with a frozen `PermanentFreezeDelegate`. Its plugin authority is `None`, so nobody can thaw it and the owner can never transfer it.
