# Anchor Track Submission

- Name / GitHub handle: ulukansarikaya
- Program ID (devnet): https://explorer.solana.com/address/EcVwqHCBFLfaq7frmbPHuTciAacPYNVqiVtFDG4xACrv?cluster=devnet
- Minted asset: https://explorer.solana.com/address/HwL3dsEFzagSbhWAJawsyAHH179ctLN4bxEESBVGjXRm?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/4FuNtxpvCnA8XmgTTTGqymcBtkcQq2vHcBGFvWtFVN8oNLdpvG2LnBrPi29ihTCQgqG3AnorxVsDQJRsLtxMTSsy?cluster=devnet

How does your program make the NFT soulbound?

> The `mint_soulbound_nft` instruction CPIs into MPL Core's `CreateV2`
> (via `CreateV2CpiBuilder`) and attaches a single `PermanentFreezeDelegate`
> plugin with two key settings:
>
> - `frozen: true` — the asset is born frozen, so MPL Core rejects any
>   transfer or burn attempt.
> - `authority: PluginAuthority::None` — nobody holds the authority to
>   update (thaw) the plugin, so the freeze can never be lifted.
>
> Because the freeze is permanent and authority-less, the asset is bound to
> its owner (`2gJbmwwuQcTgjGvas8k6tureeXnTLEnrgmdKvwZqdTVQ`) forever.
> Verified on-chain: plugin attached, `frozen = true`, authority `None`.
