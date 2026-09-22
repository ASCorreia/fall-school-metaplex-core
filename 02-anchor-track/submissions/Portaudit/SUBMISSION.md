# Anchor Track Submission

- Name / GitHub handle: Portaudit
- Program ID (devnet): https://explorer.solana.com/address/8BwdrWdUVijQPAivd9GQ4ZMt7d1vY1utZVqfuwwxsc19?cluster=devnet
- Minted asset: https://explorer.solana.com/address/2MisTPGT4cWXUTKMk4de75A4GGSubEBi34EkcDCA38Pm?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/RAjZ9Vt77qyzVbiVYPnY8RJeSPJaJGpEFykSWqc679XcW3ajE5k6cYR9dtB8YcoHTJr4ty2kY2XdzmMcvHfxEim?cluster=devnet

How does your program make the NFT soulbound?

> The CPI into MPL Core's `CreateV2` instruction attaches a
> `PluginAuthorityPair` whose plugin is `PermanentFreezeDelegate { frozen: true }`
> and whose authority is `PluginAuthority::None`. The asset is frozen the
> moment it's created, so MPL Core rejects every transfer/burn attempt, and
> because the authority is `None`, nobody — not even the original creator —
> can ever update the plugin to unfreeze it. It's permanently bound to the
> `owner` wallet it was minted to.
