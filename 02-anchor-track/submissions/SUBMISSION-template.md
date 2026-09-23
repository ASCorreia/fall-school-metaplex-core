# Anchor Track Submission

- Name / GitHub handle: Kundankr30
- Program ID (devnet): https://explorer.solana.com/address/DXLRwABE82b6HSzaRpQfExGeoEULEZVSb7rTF6jqEjY?cluster=devnet
- Minted asset: https://explorer.solana.com/address/8X7CaQMtNeFHnfnJ83p5GspkECTjLm2NM9KiyXGebbLK?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/5BkKohzdjbhgKRGgdMo5VynMW4hhoHmUL7LNLdMLsqZZBfKQxzawTEYa139dzbVBS5wtAwKJo58N1bdJpKAFR2ao?cluster=devnet


How does your program make the NFT soulbound?
 It makes the NFT soulbound by attaching the PermanentFreezeDelegate plugin during minting with frozen: true, and setting the plugin's authority to None. This permanently prevents
 the asset from ever being unfrozen or transferred.


