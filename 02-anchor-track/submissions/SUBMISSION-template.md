# Anchor Track Submission

- Name / GitHub handle: ziffer07
- Program ID (devnet): https://explorer.solana.com/address/4w5PuUAZxRmqS6fTzx8nvHZGqV8khmVu2fYcnGSog7HJ?cluster=devnet
- Minted asset: https://explorer.solana.com/address/6CLqKTLthmG24AUP2y9mHDjKYGx7FANdTFS7EpKdBgs6?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/3cgUCavh4g5jjmbuvPaveqT1EpNQVhHJRReYeNWpagQ4WFCvPN7Ae5SSikgNK8Zs4A8gDAsgu9K61BFRAo1iseZv?cluster=devnet

How does your program make the NFT soulbound?

> your answer here
The program adds a `PermanentFreezeDelegate` plugin when creating the Metaplex Core asset. It sets `frozen: true`, which prevents transfers and burns. It also sets the plugin authority to `PluginAuthority::None`, so nobody can thaw or modify the plugin later.