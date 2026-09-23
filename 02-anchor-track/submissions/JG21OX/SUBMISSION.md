# Anchor Track Submission

- Name / GitHub handle: Josh Gamo / JG21OX
- Program ID (devnet): https://explorer.solana.com/address/GCpRVRQQh3U2tzv6PpDMLTvqKdkRNYyTLLt854GiybmR?cluster=devnet
- Minted asset: https://explorer.solana.com/address/ATKVTKVajjM2jKMYzmEPgvAFv5zd4nvcMMzzvCd6cpS?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/33DLujTAnmufXZeqGbdiUvZd5PnftHt34pcHfQiA8ArUGD2rg19PnvQnqD5tjsSYm7eY9bVyhPHgYhsB7eTtqFki?cluster=devnet

How does your program make the NFT soulbound?

The program CPI-creates a Metaplex Core asset with the PermanentFreezeDelegate plugin already frozen, and sets the plugin authority to None so nobody can thaw it.
