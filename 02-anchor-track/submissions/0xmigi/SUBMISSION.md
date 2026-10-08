# Anchor Track Submission

- Name / GitHub handle: Azuolas / 0xmigi
- Program ID (devnet): https://explorer.solana.com/address/BGAXYhwMARBpkFdVTTszLB9bXP8i9QAZqAv7ZBA5eNfX?cluster=devnet
- Minted asset: https://explorer.solana.com/address/EBPMzYTvWpa23RBu9TyizzcHhasM5sKyBJWnb3rcR6Ru?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/5WrDeN4ULvDoyzi9StfLEHTwUXWjef1srBGZVYdhoVuMTATRxir4v2SgUPnjHiSHkgJFun9uLxQ8Zv5G6tgz4DWT?cluster=devnet

How does your program make the NFT soulbound?

The program creates the asset with the PermanentFreezeDelegate plugin set to frozen: true and authority None. Metaplex Core blocks transfers of frozen assets, and since nobody holds the authority, nobody can ever unfreeze it.