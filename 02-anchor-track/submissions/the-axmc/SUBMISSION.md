# Anchor Track Submission

- Name / GitHub handle: Andrea / the-axmc
- Program ID (devnet): https://explorer.solana.com/address/35oZJ9aztuZ4YSQ82gkMXBdWjume3psZzWq3FBiJ3Ufg?cluster=devnet
- Minted asset: https://explorer.solana.com/address/6rn4zVQtPNAU8SaySH6we6dF9Ngwd6z7NyFywgqpzw7t?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/2u1BJEcsYLyhD79LBPiiaoCeAmvWixvYfinQ31kJQCjTo1V7oTqCtkCTWPkyc8cCkxYqWvLBghp86CaW5v5sjxDW?cluster=devnet

How does your program make the NFT soulbound?

> The program's only instruction, `mint_soulbound_nft`, does a single CPI into
> MPL Core's `CreateV2` and attaches one plugin at creation time:
> `PermanentFreezeDelegate { frozen: true }` with `authority: PluginAuthority::None`.
>
> - `frozen: true` means the asset is frozen from the moment it exists, so Core's
>   lifecycle validation rejects every transfer and burn with `InvalidAuthority`
>   before a single byte of the asset changes. The asset never leaves the wallet
>   it was minted to.
> - `PluginAuthority::None` means no address holds the authority to update the
>   plugin, so nobody, not even the update authority or the owner, can ever thaw it.
> - It is a *permanent* plugin, which can only be added inside `CreateV2`. It cannot
>   be added, removed or edited later, so the soulbound property is decided once,
>   at mint, by the program.
>
> The `owner` account is passed in by the client, so the program can bind the
> asset to any recipient wallet, and the `mpl_core_program` account is checked
> against the canonical Core program ID so the CPI cannot be redirected.
