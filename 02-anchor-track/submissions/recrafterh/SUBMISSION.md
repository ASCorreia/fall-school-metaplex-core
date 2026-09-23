# Anchor Track Submission

- Name / GitHub handle: RecrafterH
- Program ID (devnet): https://explorer.solana.com/address/7gfmGaRXh6ucmb2PYUHh88hF4cFswa837HXHqns6VCkU?cluster=devnet
- Minted asset: https://explorer.solana.com/address/A4AcTXwcrSgYjvzwEBofajb2DF9ShAxsT5DisfdL7DHJ?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/675t3SqJNRfcu9hAA2M1YYus67AykpxtKTBRo4YQb7f1gPuvFtouBJuLcjMKGU8vCisR8J7Hpy2dGbGWHUuL8L9C?cluster=devnet

How does your program make the NFT soulbound?

> When it creates the asset, my program adds the PermanentFreezeDelegate plugin with frozen set to true. So the NFT is frozen right away and Metaplex Core won't let anyone transfer it. I set the plugin authority to None, so nobody can unfreeze it later. It stays in the wallet for good.
