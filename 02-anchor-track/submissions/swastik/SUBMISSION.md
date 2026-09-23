# Anchor Track Submission

- Name / GitHub handle: Swastik Kakran https://github.com/swastikkakran
- Program ID (devnet): https://explorer.solana.com/address/48p39sm3QrV9aNR2E1J39st4FspD2ghYubfL2YNTeWxC?cluster=devnet
- Minted asset: https://explorer.solana.com/address/CD7bBSWNmhNQaKyMmXifxxZWRWcMC83DWXgT9rpQLd8o?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/5epa9X77Mj8dTK6XJUZpBMpkrgP3LwG5NArqP2LLa9f1pTx331KzisDXjDTdt5BxvzaXAZJ3U2vtQFe1cuAtBY4Z?cluster=devnet

How does your program make the NFT soulbound?

> because of `frozen: true`, the asset is frozen automatically. And since we have added `PermanentFreezeDelegate`, the plugin set is permanent, and this cannot be changed because we have set authority to none so now even the creator cannot upgrade it to make it "un-frozen".