# Anchor Track Submission

- Name / GitHub handle: useing123
- Program ID (devnet): https://explorer.solana.com/address/Dy9jeNRGHd5gB66RzhvfUrUBCjoQHJeeS9S71cUwRaMF?cluster=devnet
- Minted asset: https://explorer.solana.com/address/4ZZtAEuMm2G7rVEPqjARMTx6zqH4uQj91zRp5B3PL1HV?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/5NgbSG23p1FrFAZpBnf186wpFEFFCBtGm7V9pT2jLU7igJiYqcKK5bVPAftLfgDXkhE683pxXMXxA1WXZKnxY7Kx?cluster=devnet

How does your program make the NFT soulbound?

> The program CPIs into Metaplex Core's `CreateV2` instruction attaching the `PermanentFreezeDelegate` plugin initialized with `frozen: true` and authority set to `PluginAuthority::None`. Because `frozen: true` is set at asset creation, MPL Core itself rejects any transfer or burn attempts on-chain. Setting the authority to `PluginAuthority::None` ensures that nobody possesses the authority to update or thaw the plugin, binding the asset permanently to the owner wallet forever.
