# Anchor Track Submission

- Name / GitHub handle: roxxcli
- Program ID (devnet): https://explorer.solana.com/address/95cwV9g2XZcT7FP5qHYz11VW1vdtrMhZ9x9Tc85dmDzj?cluster=devnet
- Minted asset: https://explorer.solana.com/address/DpCRt5HVtoBKWYKwDThcnMv6Qiiz5nYEQW4Y69qv78wz?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/4xxXFjpfs9T7YLXdNVSCBnokPZL8A6SXnYomNgwY6g12o67Mxb1QTbMYJX9E24B8gjSmThH7LCyHb4iymBES7384?cluster=devnet

How does your program make the NFT soulbound?

> The program attaches a PermanentFreezeDelegate plugin when the Core asset is created, with the asset frozen (`frozen: true`) and the plugin authority set to `None`. This means nobody can update the plugin to thaw the asset, so Metaplex Core rejects transfer attempts.