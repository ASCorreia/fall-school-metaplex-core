# Anchor Track Submission

- Name / GitHub handle: Mayhikall
- Program ID (devnet): https://explorer.solana.com/address/AiPym6Podx8vSNAnDcZXzdCYDSyEDXJJ46gZE1qbiCgy?cluster=devnet
- Minted asset: https://explorer.solana.com/address/38EKeUsvHi7bcX3FEprxxjZquM2cTb2Kr4cPBK6E38aS?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/3sjToruddx6N567JrSJnKSbt8XUuqYw6jJPsgeUNxoW6AdSTdFsouiQyE1tzsohnKXVbs9aKboGCmmVDWQQSabJF?cluster=devnet

How does your program make the NFT soulbound?

> The program attaches the `PermanentFreezeDelegate` plugin during the CPI call to Metaplex Core's `CreateV2`. By configuring `frozen: true`, Metaplex Core permanently rejects any transfer or burn instruction from creation. By setting `authority: Some(PluginAuthority::None)`, no authority is permitted to modify or remove the plugin, guaranteeing that the asset can never be unfrozen or moved.
