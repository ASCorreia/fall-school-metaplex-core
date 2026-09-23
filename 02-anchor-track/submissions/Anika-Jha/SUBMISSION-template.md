# Anchor Track Submission

- Name / GitHub handle: Anika-Jha
- Program ID (devnet): https://explorer.solana.com/address/DK8GbvHXn71Mce24vyMi4JAnRUTSSpMm96AYXsDevhis?cluster=devnet
- Minted asset: https://explorer.solana.com/address/2nMpFtu13tiRJTkwh7RhYsyEbwjy2dBkLDc44S9S9M5D?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/4j2qf2d1Ga9DN2oNuPMnTRmPXgAZA8a63q7d5Um6XPL33JKh7662fFcHRuZ61efqzfbrN8PGwdRDhcMRFKydjqqJ?cluster=devnet

How does your program make the NFT soulbound?

The program mints the NFT through a CPI call to Metaplex Core's CreateV2 instruction and attaches the PermanentFreezeDelegate plugin with frozen: true and authority: Some(PluginAuthority::None). This permanently freezes the asset, preventing transfers by the owner or other transfer attempts. Setting the plugin authority to None also prevents the freeze authority from being reassigned or used to unfreeze the asset.
