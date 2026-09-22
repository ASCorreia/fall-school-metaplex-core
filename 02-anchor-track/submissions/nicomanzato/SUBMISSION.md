# Anchor Track Submission

- Name / GitHub handle: Nico / @nicomanzato
- Program ID (devnet): https://explorer.solana.com/address/9qpoZ1XasWF31dgk6LDmDwTFuDCq9pgjkQ4LPPFGH7TY?cluster=devnet
- Minted asset: https://explorer.solana.com/address/9mJEytj2eywFRQnLMM17S91JsyKkE7gWMp8r9aFbLnq2?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/gRVfgBfe13yXvb1V1dVo9SZvkcb19B4P1WPyjChmSDj8zLGbrtvWBB15aC3WXJGa8RLr4brYKtr1HTwr2W4nkJD?cluster=devnet

How does your program make the NFT soulbound?

> The program CPIs into MPL Core's `CreateV2` and attaches a single plugin at
> creation time: `PermanentFreezeDelegate { frozen: true }` with
> `authority: PluginAuthority::None`.
>
> `frozen: true` makes MPL Core reject every transfer (and burn) of the asset.
> `PluginAuthority::None` means no account — not the owner, not the payer, not
> the program — can ever update that plugin, so the asset can never be thawed.
> The two together make the freeze permanent: the NFT is bound to its owner
> forever. Verified on devnet: the asset reports `frozen: true` with authority
> type `None`.
