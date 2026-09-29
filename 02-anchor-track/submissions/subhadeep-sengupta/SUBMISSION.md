# Anchor Track Submission

- Name / GitHub handle: Subhadeep Sengupta / subhadeep-sengupta
- Program ID (devnet): https://explorer.solana.com/address/Af2WJ1EgrohiEryTBajpmp2giVGbdHZUDKJFhALPGPxs?cluster=devnet
- Minted asset: https://explorer.solana.com/address/FbCKUMiTQWjR96YB1QT8hDrQsJ23ZceXVgytWh1HhrUc?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/jpzvWYDZ3gidLLNJeuqMhFgfZaVjQ1t7Ds8Arao9uPzyhbgjgQGodY41h4LxvrpSKQhhgTfQ6RMX6naTm97b6H8?cluster=devnet

How does your program make the NFT soulbound?

> The `mint_soulbound_nft` handler CPIs into MPL Core's `CreateV2` and attaches a
> `PermanentFreezeDelegate` plugin with `frozen: true` and
> `authority: PluginAuthority::None`. The asset is frozen from the moment it is
> created, so MPL Core rejects every transfer (and burn) with `InvalidAuthority`.
> Because the plugin authority is `None`, nobody can ever update the plugin to
> thaw the asset, so it stays bound to the owner's wallet forever.
