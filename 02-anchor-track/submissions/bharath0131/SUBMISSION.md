# Anchor Track Submission

- Name / GitHub handle: Bharath / `bharath0131`
- Program ID (devnet): https://explorer.solana.com/address/VJbXkTyqgLzB1gWEgXJZ9FqLqG69V4tw2MTkka78rTz?cluster=devnet
- Minted asset: https://explorer.solana.com/address/6vwV2WH1SwCGXwZuAmDRpe415oAnLVME7gkj4NAiZNhz?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/4CPbci2Ya4TUuVma7WWA2z8NQ13kwkFvMS9TV2RJ4pZdrVAc7LG84MoXc9DH7QuaVJNwUBgkh7aEEBxZvigPMMWB?cluster=devnet

Easy track soulbound asset: https://explorer.solana.com/address/FKoEjg8SRGzYSXKTYe9RFZ69uJZv4RASCJ3bgzHgQN6X?cluster=devnet

How does your program make the NFT soulbound?

> The program creates the Core asset with the `PermanentFreezeDelegate` plugin already frozen. Its plugin authority is `PluginAuthority::None`, so nobody can update the plugin or thaw the asset later; MPL Core rejects transfer attempts forever.
