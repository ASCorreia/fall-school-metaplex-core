# Bonus Challenge Submission

- Name / GitHub handle: rehna-jp
- Collection (MasterEdition): https://explorer.solana.com/address/8qVYU8ti4xt5aMPcEKQX12HgM2Vm2g7GX8jfSoHUjFqm?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/6EaVQuKk1Bfr2pYwkYWS8fniG2QSaibBmxStMnMwJGoX?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/AaQRkLNyjAxEz4E7pkTNGwoGUX1D4zeDK5jB24ii2rih?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/FYP2hTH63JaUSuwN1P3qv5AnxnfTFCSt86GRmqo7MfBj?cluster=devnet

Which royalty applies to Edition #2, and why?

> Edition #2's own asset-level Royalties plugin (500 basis points / 5%) applies, not the collection's default. Each print carries its own Royalties plugin set at creation, and Core always lets an asset-level plugin override the same plugin type set at the collection level — so the marketplace reads the asset's own rate directly, regardless of what the collection specifies.