# Anchor Track Submission

- Name / GitHub handle: southenempire
- Program ID (devnet): https://explorer.solana.com/address/6Hp7bPRTNC8QQZR7h13YKaKwQiR86EbAY8VrJA3GkDWm?cluster=devnet
- Minted asset: https://explorer.solana.com/address/BpnU6HfFJyFyzE8QtJ22bTEgcYeySPxvh8johc6M7zjh?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/5kHxrkZgNjaiody5JRVQoEyG2sDKV51BstwsCUtvZ56tXMtsJ86VoggouahVALTZYhyrx5ZUjVHXc2qtgNRH2PEU?cluster=devnet

How does your program make the NFT soulbound?

> The program attaches the `PermanentFreezeDelegate` plugin to the asset at the time of creation (inside the CPI builder). We set `frozen: true` so the asset is frozen immediately. We also set `authority: Some(PluginAuthority::None)` so that no one—not even the creator or owner—can ever update the plugin to unfreeze it. Because it is a "permanent" plugin, it also cannot be removed. Thus, the asset can never be transferred.
