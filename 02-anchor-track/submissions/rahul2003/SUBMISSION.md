# Anchor Track Submission

- Name / GitHub handle: rahul2003
- Program ID (devnet): https://explorer.solana.com/address/FPuSTot8kVs4m9u6JQzYryVCX3XQyK4sdGEnNWiV7Ah6?cluster=devnet
- Minted asset: https://explorer.solana.com/address/<ASSET_ADDRESS>?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/<MINT_TX_SIGNATURE>?cluster=devnet

How does your program make the NFT soulbound?

> The program uses the `PermanentFreezeDelegate` plugin from MPL Core at asset creation time with two critical settings:
> 1. `frozen: true` — the asset starts in a frozen state, so any transfer or burn attempt is rejected by the MPL Core program
> 2. `authority: PluginAuthority::None` — no authority can ever update or thaw the plugin, making the freeze permanent and the asset permanently non-transferable (soulbound)