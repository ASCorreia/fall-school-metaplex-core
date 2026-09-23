# Anchor Track Submission

- Name / GitHub handle: init-ikuya
- Program ID (devnet): GQLA7M7B7dqLadJyWNJUnUt8PDWqK8xzMQTKf3H3JvjS
- Minted asset: https://explorer.solana.com/address/83onzmDPw8j1LTinusRvTtF2vktXM3dzP3CeWskxTbN3?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/3hcsdzJFnnbsxqioAHpk85yw27MwH2Wn8ZKnjY1WQfRj7C5CLysWG4L8A3GkzQCNYpd8R11czFSD7hvhUQWgQ6T2?cluster=devnet

How does your program make the NFT soulbound?

> The program CPIs into MPL Core's `CreateV2` and attaches a
> `PermanentFreezeDelegate` plugin with `frozen: true`, so MPL Core itself
> rejects every transfer and burn at the program level. Its `PluginAuthority`
> is set to `None`, so nobody holds the power to thaw it — and since permanent
> plugins can only ever be added at creation time, the freeze can never be
> added, removed, or reversed afterwards.
