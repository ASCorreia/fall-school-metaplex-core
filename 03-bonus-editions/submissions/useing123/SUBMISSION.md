# Bonus Challenge Submission

- Name / GitHub handle: useing123
- Collection (MasterEdition): https://explorer.solana.com/address/3xE7Mo7rg6kx4BCDSak21bNWxbbhTADbZw5Vcuzf7oCs?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/ERLAmqbtugUHGs71Me1tJ4C3FcNqp5Q73ZZ39g1P5R8K?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/D5bGZPuhJYk8GLcHTtN7smsNWsURVDUVVDDQAL8hq44K?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/82UgTSuLzALSHS4djUHFYTGWRnjWCkD9VZoPfiH8b4KL?cluster=devnet

Which royalty applies to Edition #2, and why?

> 5% (500 basis points). In Metaplex Core, an asset-level Royalties plugin overrides any collection-level Royalties plugin. Edition #2 was minted with an explicit asset-level Royalties plugin configured to 500 basis points (`ROYALTIES[1]`), which takes precedence over the collection's default royalty setting.
