# Anchor Track Submission

- Name / GitHub handle: Saba Azadegan / sabaazdn73
- Program ID (devnet): https://explorer.solana.com/address/9N6829iHNKryEw9iPDDV4YpD76BnKdJXModD1UjciCXN?cluster=devnet
- Minted asset: https://explorer.solana.com/address/4zvLahyBzuUPMr4qD9htPQnUNGC9mDBEdrPeQsPh3tfv?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/5bwJaxbLjheNkqzMZuuq8CXpFm1RDpeJxnEsEF6BrvRbA4S8xUq3kofeRRCeXYtLH6X3nGjTJAr41rXL32qgKda1?cluster=devnet

How does your program make the NFT soulbound?

> The handler CPIs into MPL Core's `CreateV2` and attaches a single
> `PermanentFreezeDelegate` with `frozen: true` and `authority:
> PluginAuthority::None`.
>
> Both settings are load-bearing, and either one alone would be reversible.
> `frozen: true` puts the asset in a state Core's lifecycle validation rejects
> every transfer and burn from — but on its own it is a lock whoever holds the
> plugin authority can open. `PluginAuthority::None` means nobody holds that
> authority, so there is no one who could ever thaw it — but on its own, over
> an unfrozen asset, it locks nothing.
>
> What makes it permanent rather than merely current is that
> `PermanentFreezeDelegate` is a permanent plugin: Core only accepts it at
> creation, and it cannot be added, edited or removed afterwards. The
> guarantee is fixed at the moment of the mint, which is why the plugin goes
> into the `CreateV2` call rather than a follow-up instruction.
>
> The enforcement lives entirely in MPL Core, not in this program. Once the
> asset exists, my program has no further role: any transfer attempt, from any
> client, fails inside Core's own validation. The `cannot be transferred by
> its owner` test asserts exactly that — the owner signs a real `transferV1`
> and Core refuses it.
