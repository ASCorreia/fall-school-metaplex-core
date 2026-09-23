# Anchor Track Submission

- Name / GitHub handle: Christianto / christianto88
- Program ID (devnet): https://explorer.solana.com/address/6jneiCBMJxPNxC8uRUA5Uz5zsVwTnLS91nreVfnYbPTD?cluster=devnet
- Minted asset: https://explorer.solana.com/address/8t7F66v4QjmVYQ9sqbdp4bBy2vsfSfQj76UNna3edWSA?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/5xtFYMa1bSDpG2VZP5an4zCGH3A3BWu3tKmC6UQZuHduxd5b4avvDT44P7tB97s9MU8CAsriuih6d2KULrgd6cm2?cluster=devnet

How does your program make the NFT soulbound?

> The `mint_soulbound_nft` handler CPIs into MPL Core's `CreateV2` and attaches a
> `PermanentFreezeDelegate` plugin with `frozen: true` and
> `authority: PluginAuthority::None`. The asset is frozen from the moment it is
> created, so MPL Core rejects every transfer (and burn) with `InvalidAuthority`.
> Because the plugin authority is `None`, nobody can ever update the plugin to
> thaw the asset, so it stays bound to the owner's wallet forever.
