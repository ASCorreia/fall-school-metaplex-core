# Anchor Track Submission

- Name / GitHub handle: vishal10menon
- Program ID (devnet): https://explorer.solana.com/address/JCRtX7ZmvLnyap9PiGTJUgYGRLL5R6TxZ7UXM4F3xtgY?cluster=devnet
- Minted asset: https://explorer.solana.com/address/EKDnBhBPDG9HZwuPiguGQoGz18QXENoToFJ1AYsrpMEj?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/5hd323s5JzYmFEfta5GHvgissusweN5MVJYrMLg8aVXPBpzsjSUNayXvr6JWYHGhY8EMvEHi8z5mL4gy2bv3wn5P?cluster=devnet

How does your program make the NFT soulbound?

> The mint instruction CPIs into MPL Core's CreateV2 with one PermanentFreezeDelegate
> plugin attached at creation: `frozen: true` freezes the asset immediately, so Core
> rejects any transfer or burn attempt from the start, and `authority: PluginAuthority::None`
> means no account — not even the original owner — ever holds the right to un-freeze it.
> Both settings are required together: frozen without authority:None just means someone
> could thaw it later, and authority:None without frozen does nothing at all.
