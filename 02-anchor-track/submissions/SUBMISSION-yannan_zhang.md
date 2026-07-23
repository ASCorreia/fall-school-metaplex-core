# Anchor Track Submission

- Name / GitHub handle: Nancheung23
- Program ID (devnet): Fiob5jCVcVyZxrNrK72wVxn3RyPRE3wEytDj2NwsDYnW
- Minted asset: https://explorer.solana.com/address/4ChWiGtp2HeCnPSZRNxxEjK1byYBHSf6xgPQypsp6eLP?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/3XjQbuBzCesiC6X2ZXzhG27DmCDtsmFg9poStgktxjDqZxbUb8jMdU2ANJjFPqqMuUFVYgzAa1KxyWhqG8nZHyFc?cluster=devnet

How does your program make the NFT soulbound?

> This program CPIs into MPL Core's CreateV2 instruction with a PermanentFreezeDelegate plugin, configured with frozen: true and authority: PluginAuthority::None. The asset is frozen from the moment it's created, and because no one holds authority over the freeze plugin, it can never be thawed — meaning the asset can never be transferred or burned. It is permanently bound to the wallet it was minted to.
