# Anchor Track Submission

- Name / GitHub handle: Roman / ra1kou-x
- Program ID (devnet): https://explorer.solana.com/address/2qJ64AuXkfSKqMptyYkEUA1d5bAvEPntye9pDHMsT5hc?cluster=devnet
- Minted asset: https://explorer.solana.com/address/EHRAaFXm4WbKBmuJW5zySpy5vBsHSNJHSw8pNj9atbiy?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/4P9hH5Vy1qS8bmHcfwqJZVhwphXdxtbt4TuCU5xKXPgFYwfzWNJYy1FdQHhEBnpsK5MtS7UVgoAmkhd5XTm5B5ag?cluster=devnet

How does your program make the NFT soulbound?

> The program creates the asset with a `PermanentFreezeDelegate` plugin configured with `frozen: true` and `authority: None`. This makes Metaplex Core reject transfers, while having no authority means nobody can later thaw the asset or change that permanent freeze.