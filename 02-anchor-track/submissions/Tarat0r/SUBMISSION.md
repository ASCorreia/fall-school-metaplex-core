# Anchor Track Submission

- Name / GitHub handle: Vassil / Tarat0r
- Program ID (devnet): https://explorer.solana.com/address/GVQu5yZgjqgHpyqjoJPtio6mNDRngFp5MmnTRrQnnEDJ?cluster=devnet
- Minted asset: https://explorer.solana.com/address/GXkFvLsLcuVwPftUurNDRweb2t5pxL8Q2NY1ogZEBr2q?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/2XcE2zY7QZ6ShmDhEdCqeBCyYu4jXzVdXVhXZqFaaNkSJLsfJPhUK8Fgc2B6ijVnuJgW3FMbxpzzVYEpLgn7wG4D?cluster=devnet

How does your program make the NFT soulbound?

The program attaches MPL Core's `PermanentFreezeDelegate` plugin with `frozen: true` and `PluginAuthority::None`. The asset is frozen from creation, so it cannot be transferred, and because the plugin has no authority, nobody can thaw it later.
