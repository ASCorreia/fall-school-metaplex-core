# Anchor Track Submission

- Name / GitHub handle: Vadym Bilobrovets / SolarDePinHub
- Program ID (devnet): https://explorer.solana.com/address/HFTmyKWRgSrjhAPDdg7tfQN9sVwJFsKexAhBCaNHuJ9M?cluster=devnet
- Minted asset: https://explorer.solana.com/address/3kXvGiee6Dd2Je8uUbwCL1hikTFNkEj9obyCcFsl6efj?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/66EoiLE7oWLzghJnwq4QTVBq16qp9BRKASXG4eurTtUR8Yk57RsWGoc1KJ26mqGuwTPJe1AaKHrKzN1KWZWKuem1?cluster=devnet

How does your program make the NFT soulbound?

The program CPIs into MPL Core CreateV2 and attaches PermanentFreezeDelegate with frozen: true and authority None. Nobody can thaw the asset, so Core rejects transfers.
