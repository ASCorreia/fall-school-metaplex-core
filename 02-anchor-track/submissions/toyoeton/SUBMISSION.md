# Anchor Track Submission

- Name / GitHub handle: toyoeton
- Program ID (devnet): https://explorer.solana.com/address/ApmCppMLfvvVZEbRTcXsDAhD98BF41syzLg9JZUniM78?cluster=devnet
- Minted asset: https://explorer.solana.com/ErukCwv3h9cm5xHmcaPczCrwgd27CgLHWGSuomv89GYq?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/28AFe9Swxb1ZrGSuj5TmA81PKf2ar1VJAauDyeZ84W1gD9CsfgjYm8pf25N4YxoZQJsgLbT5HEDKYE7wPVt7EonU?cluster=devnet

How does your program make the NFT soulbound?


> The program locks the NFT the moment it's created by attaching a plugin called PermanentFreezeDelegate, set to frozen. Because of this, any attempt to transfer or burn the NFT is automatically rejected. The key part is that no one is given permission to change this setting later, not even the program or the original owner. Since nobody can unfreeze it, the lock is permanent rather than temporary. That's what makes the NFT soulbound, it can be minted and owned, but never moved.
