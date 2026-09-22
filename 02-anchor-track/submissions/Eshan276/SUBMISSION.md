# Anchor Track Submission

- Name / GitHub handle: Eshan276
- Program ID (devnet): https://explorer.solana.com/address/5n5TZSnH61EkY1zUChrXr9UUCQRuuvLoEpX3dCqaMPtc?cluster=devnet
- Minted asset: https://explorer.solana.com/address/GgHtoVyMSTzWhUApH2Cv2oHJycx2GL64BYkxC3WyYbnV?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/4JNBqazNpj3q4KecS9d2fYAjaiUmieGDMHwqJwaeWVRau53YeT1gwnnT7jqWVWioNndZs6bUxkwathXztbo7F7J7?cluster=devnet

How does your program make the NFT soulbound?

> The handler attaches a single `PermanentFreezeDelegate` plugin at creation time,
> through the `CreateV2CpiBuilder` CPI into MPL Core:
>
> ```rust
> .plugins(vec![PluginAuthorityPair {
>     plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }),
>     authority: Some(PluginAuthority::None),
> }])
> ```
>
> Two fields do the work together, and neither is sufficient alone:
>
> **`frozen: true`** — MPL Core's own transfer and burn handlers refuse to run
> while this flag is set. The restriction is enforced by Core itself, not by my
> program, so nothing has to call back into my code for it to hold. Once the
> asset exists, my program is out of the picture entirely.
>
> **`authority: PluginAuthority::None`** — the plugin has no update authority at
> all, so `frozen` can never be flipped back. This is the part that makes it
> *permanent* rather than just frozen. Had I left the authority with the payer or
> the owner (the default is the asset's authority), this would be an ordinary
> freeze that somebody could thaw, and the asset would become transferable again.
>
> Conversely, `authority: None` *without* `frozen: true` would permanently lock in
> a plugin that is not actually restricting anything.
>
> Verified on devnet by reading the asset back after minting: `frozen = true` and
> `authority.type = "None"`. The client script `mint-client.ts` performs this check
> itself and exits non-zero if either is wrong, so a successful run is evidence
> rather than an assumption. The repo's `anchor test` also confirms the transfer
> attempt is rejected on-chain.
