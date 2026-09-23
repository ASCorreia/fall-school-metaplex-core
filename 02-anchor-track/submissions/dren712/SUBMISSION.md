# Anchor Track Submission

- Name / GitHub handle: dren712
- Program ID (devnet): https://explorer.solana.com/address/7GXvgXCqx5qA6ZBEuJn8ZKR4jzkKuACvtw4zG71kZMDy?cluster=devnet
- Minted asset: https://explorer.solana.com/address/9ChGxWk6F3hW3W2qpD7kk5JScoSenKN6oUPEr1VWfDnY?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/36BNZ89Taxb6XYDRdbMhTbB8vmmEEZYNozSH3atDhDim69hHNtD82X5Aioifh68KBUAhGJPUmgumXwWHxczrw1MZ?cluster=devnet

How does your program make the NFT soulbound?

> When creating the Metaplex Core asset via CPI (`CreateV2CpiBuilder`), the program attaches the `PermanentFreezeDelegate` plugin initialized with `frozen: true` and sets its authority to `Some(PluginAuthority::None)`. The `frozen: true` state causes Metaplex Core's runtime checks to reject all subsequent transfer and burn instructions on-chain. Concurrently, setting the plugin authority to `None` guarantees that nobody (neither the payer, the owner, nor any program) can ever revoke, update, or thaw the delegate, locking the NFT to the owner's address permanently.
