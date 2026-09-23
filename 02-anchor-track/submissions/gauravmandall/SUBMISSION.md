# Anchor Track Submission

- Name / GitHub handle: Gaurav Mandal / gauravmandall
- Program ID (devnet): https://explorer.solana.com/address/7URRadXtNxvXo7s2eu6ZZyfAq1CXEbSAQDGGZXb3NKLJ?cluster=devnet
- Minted asset: https://explorer.solana.com/address/FQN6dnPScQegdRDhBZodkbvEJeobpVBHfn5kCpAXWxXK?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/51zA1RrTndpFLYjdfzZAXX3AY3cLYTtZYWkz1BSXcm2s4Dp928t7shDJS6yKUpKDVcuSrfXXDKHkwi6U6jbenv9t?cluster=devnet

How does your program make the NFT soulbound?

> The program CPIs into Metaplex Core's `CreateV2` instruction and attaches the `PermanentFreezeDelegate` plugin configured with:
> 1. `frozen: true`: The asset is initialized in a frozen state from creation, which causes Metaplex Core to reject all transfer and burn operations.
> 2. `authority: Some(PluginAuthority::None)`: No key or program holds the authority to modify or lift the freeze plugin.
> 
> Because the freeze is permanently enforced by the Metaplex Core program and cannot be updated by anyone, the NFT remains permanently bound to the recipient's wallet.
