# Bonus Challenge Submission

- Name / GitHub handle: web3theo (Theophilus2003)
- Collection (MasterEdition): https://explorer.solana.com/address/3CVRT3vfiAZRj8BLHCeefY2AATaaFnpbp9R3oSRVEiad?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/D6iite84so6d5pK35QRe7ooPyXX4wfwMaTxKFimzGRpR?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/5rPzMdePJykrwwUbbJTwWLURxxdZ3Nsbuexx5u3jdv3S?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/H2PXKsSgCmK7M2ChTJzKQLBfryzB3GDpYUdmD2e3bvd2?cluster=devnet

Which royalty applies to Edition #2, and why?

> Edition #2's own Royalties plugin (500 basis points = 5%) applies, not the
> collection's default (also 500 basis points, coincidentally the same
> value in this case, but that's not why it wins). Each edition has its own
> Royalties plugin attached directly to the asset, and an asset-level
> plugin always overrides the equivalent plugin on its parent collection.
> If I had left the Royalties plugin off Edition #2 entirely, it would
> have inherited the collection's 5% by default - but because I explicitly
> set 500 basis points on Edition #2 itself, that value is what a
> marketplace reads, regardless of what the collection says.
