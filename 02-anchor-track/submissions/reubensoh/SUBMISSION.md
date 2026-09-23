# Anchor Track Submission

- Name / GitHub handle: reubensoh
- Program ID (devnet): https://explorer.solana.com/address/rJXN51jpujkLVfa4fgSpRbmt5KwycbgcSSDa9ZhDTYj?cluster=devnet
- Minted asset: https://explorer.solana.com/address/FqypNqYop5LSVeq7as7MUZEzoFRcDzBgEDRsPz6PTrUP?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/5PErN8MhXvcJC6BeLwryPr5kAbFqj1LMcwYntdoiAkedJmku33MwSd9vaAfXH6WXyguo8sY6fYFtMSp1hpuPpAyU?cluster=devnet

How does your program make the NFT soulbound?

> My Rust program attaches the `PermanentFreezeDelegate` plugin to the asset exactly when it is created. It sets the plugin to `frozen: true` (which blocks all transfers) and sets the authority to `None` (which throws away the key so no one can ever unfreeze it).