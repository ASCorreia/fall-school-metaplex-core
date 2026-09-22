# Anchor Track Submission

- Name / GitHub handle: web3theo (Theophilus2003)
- Program ID (devnet): https://explorer.solana.com/address/3F1LAVkmqJAhinFZaeYzqHNKN8KAvTkmSrcLkuK2kYwE?cluster=devnet
- Minted asset: https://explorer.solana.com/address/8pct9aEWYHWyh44ahuTBzH2FP69zPWsa1VTHVuDdCvyK?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/4wDtguCZYaTkk7rJ2yCKKYFnvJjNRgJjEK5cahaB7jp294dBqssF33mweQoKCVQg4cwWfAW1gZUmd1ix5nqMtNxn?cluster=devnet

How does your program make the NFT soulbound?

> The `mint_soulbound_nft` instruction attaches a `PermanentFreezeDelegate`
> plugin to the Core asset at the moment it's created, with `frozen: true`
> and its authority set to `PluginAuthority::None`. Being frozen means
> Metaplex Core rejects every transfer or burn on this asset. Setting the
> authority to `None` means nobody, not even the original creator or
> program, can ever change that plugin to unfreeze it — so the freeze is
> permanent by construction, not just a default that someone could later
> reverse.
