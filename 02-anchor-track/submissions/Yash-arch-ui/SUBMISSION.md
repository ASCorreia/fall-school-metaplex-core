# Anchor Track Submission

- Name / GitHub handle: Yash-arch-ui
- Program ID (devnet): https://explorer.solana.com/address/9aqbYhhCoKJb4RUzpmkKjutbqYLRNLGsfWdRiubY6LkR?cluster=devnet
- Minted asset: https://explorer.solana.com/address/D9K8pE5iaKa6WDQfcDvQhpEbzVCFCFJQnKDRWQY6KcpX?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/2L4vCDytd6CutSq4T5cpWCBeZwumAXZ3aWTBdpESeq7uJr9Vc561KfhNhhtuM26ycbcj2djwpSQhvWwJewGePBoE?cluster=devnet

How does your program make the NFT soulbound?

> It CPIs into MPL Core's CreateV2 with a PermanentFreezeDelegate plugin set to `frozen: true` and `authority: PluginAuthority::None`. The asset is frozen from birth, and because no authority exists, nobody can ever thaw it — so transfers are rejected on-chain forever.
