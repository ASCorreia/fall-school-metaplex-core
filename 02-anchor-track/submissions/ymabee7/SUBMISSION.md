# Anchor Track Submission

- Name / GitHub handle: ymabee7
- Program ID (devnet): https://explorer.solana.com/address/6k7K1j2dDG7Cf3pkBH8Zudb3Yw7g7exwHk2nfwg6zpWR?cluster=devnet
- Minted asset: https://explorer.solana.com/address/7GbHcuXGaFrRDb78q8vPr3XkhLKQCbhVjQ5ixybprsfw?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/tLdRWHns9V2CpYG7ry9qTZ8Ligtyt3Kgwr4USj9uB3DWD4wkdY2g8ecp2bSDpYJoeTGLJwj6CSz4uh8bDNEJ1VY?cluster=devnet

How does your program make the NFT soulbound?

> your answer here
> The handler CPIs into MPL Core's `CreateV2` and attaches a single
> `PluginAuthorityPair`:
> `Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true })`
> with `authority: Some(PluginAuthority::None)`.
>
> `frozen: true` means MPL Core rejects every transfer and burn from the moment
> the asset exists, enforcement lives in the standard, not in my program.
> `PluginAuthority::None` means no account is permitted to update the plugin,
> so it can never be thawed.
>
> Both are required. Note `Some(PluginAuthority::None)`: leaving the `Option`
> as `None` would not mean "no authority" and it would tell MPL Core to use the
> plugin's default authority, which is a real account that could thaw it.

