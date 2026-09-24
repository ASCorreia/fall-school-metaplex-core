# Anchor Track Submission

- Name / GitHub handle: Anon1one
- Program ID (devnet): https://explorer.solana.com/address/DQ1qViJEWGVAAPzpY3nbSyHBo2ZP2PMnY4SnjtAMF9Ta?cluster=devnet
- Minted asset: https://explorer.solana.com/address/5EWJzezZomqLEVGB3gu7XjzN1KHirGT2Twces8jK59Ks?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/3XkRaWxFpkTmf7yq2Bv7VUncqNhADooeed8exga5h6aMug6DUDNaVWqfUNZLH91RvShywfhrZwLwupQhs7qrxvZe?cluster=devnet

How does your program make the NFT soulbound?

> At creation time the program attaches the `PermanentFreezeDelegate` plugin to the Core asset with `frozen: true`, through the `CreateV2` CPI. A frozen asset cannot be transferred, so it stays in the owner's wallet. The plugin authority is set to `PluginAuthority::None`, which means nobody (not the owner, not the update authority, not the program) can ever update the plugin to thaw it. So the asset is frozen forever and permanently bound to the wallet it was minted to.
