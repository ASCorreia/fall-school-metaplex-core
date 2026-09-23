# Anchor Track Submission

- Name / GitHub handle: fribas84
- Program ID (devnet): https://explorer.solana.com/address/CJxWJ9KaE8hUm2dR3UTLCgo81WLjon3JtNFE2esoM6ua?cluster=devnet
- Minted asset: https://explorer.solana.com/address/E6or1waPiNMZpiWSA2252biUoY4wsRLMipW3A5y93KH8?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/3YHBdGMBdVoYAjCoEPCXhKayWRJcYay8eCAKSAwkPULF6pE3v9WWZRPERgXUgkYJd2WCVVnPhBEAB9DfouiKNc1M?cluster=devnet

How does your program make the NFT soulbound?

> At creation time the program CPIs into MPL Core `CreateV2` with a `PermanentFreezeDelegate` plugin already `frozen: true`. Its authority is `PluginAuthority::None`, so no key can ever thaw it. Core then rejects every transfer for the life of the asset.
