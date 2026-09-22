# Anchor Track Submission

- Name / GitHub handle: subutai
- Program ID (devnet): https://explorer.solana.com/address/2WzDscQvFFVC5QWvmEJchbckK7NJNTXNk5Y4Mi7AfFTp?cluster=devnet
- Minted asset: https://explorer.solana.com/address/2gFctyMX23TDBEhEuBMaLDQrhpQ3gx3DkZfUhAnCVMkc?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/3iK17cm38HQRbcR7UBfFCMXAy2YJsotv3B2sFCHsvkVk2gpo1Erxx2NBtcxQ4yisyKCCcs3VtajDPwKtQ6TLRDsH?cluster=devnet

How does your program make the NFT soulbound?

> During asset creation via Metaplex Core's `CreateV2` CPI, the program attaches the `PermanentFreezeDelegate` plugin configured with `frozen: true` and an authority of `PluginAuthority::None`. Because the authority is set to `None`, nobody can ever thaw the asset or modify the plugin, making it permanently frozen and rejecting any transfer or burn attempts on-chain.
