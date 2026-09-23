# Bonus Challenge Submission

- Name / GitHub handle: AkashJana18
- Wallet: 6m1woKQeFMfWMZr5a9yKiFz5P13cARB9dUPw9omMyibv
- Collection (MasterEdition): https://explorer.solana.com/address/3qGZat34iNS6HBbMCTyGCjHW5tAuUCjex9EU26yvfLXT?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/9TXSNwhB2ZmmAH9C2MHT3M2Be55hRhEcyDVLd973xFM2?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/EHKKaEpem3r6GJvJ8kaHKCUvUCzGMx3q556goT7GdZHg?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/4gHDH1SySQLpy74gm2xqyjtWcu8sBRkC59fm43zuicYo?cluster=devnet

Which royalty applies to Edition #2, and why?

> 5% (500 basis points) from its own asset-level `Royalties` plugin. Asset-level royalties override the collection-level `Royalties` plugin, so Edition #2 enforces its own 500 bps setting (which here matches the 5% collection default, but the asset-level entry is the one that applies).
