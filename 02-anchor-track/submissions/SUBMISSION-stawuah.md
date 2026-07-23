- Name / GitHub handle: stawuah
- Program ID (devnet): https://explorer.solana.com/address/7jwW91v9U89PzYTsasWgSSffoHE1dWYgvU8xm9wTy8HW?cluster=devnet
- Minted asset: run `mint.ts` and paste your generated asset Explorer link here
- Mint transaction: run `mint.ts` and paste your generated transaction Explorer link here

How does your program make the NFT soulbound?

> This program CPIs into MPL Core's CreateV2 instruction with a
> PermanentFreezeDelegate plugin, configured with frozen: true and authority:
> PluginAuthority::None. The asset is frozen from the moment it is created, and
> because nobody holds authority over the freeze plugin, it can never be thawed.
> Therefore, the asset can never be transferred or burned and is permanently
> bound to the wallet it was minted to.
