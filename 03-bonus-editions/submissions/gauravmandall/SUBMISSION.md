# Bonus Challenge Submission

- Name / GitHub handle: Gaurav Mandal / gauravmandall
- Collection (MasterEdition): https://explorer.solana.com/address/CS2uQoeUDAks6SFxJjs9yc3LaTMekZpAqs63qNy4ocZa?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/7ZFtAYwHfRiVDfGiLUj6heaEQf87nCfZ45SZVcHGqyAj?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/6ukKeSEygh25L6wRkP9YAsA1XzPMRwCMJ7yzKD9emmUD?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/5TMVscNgaaVYUyjAEY6z2M9YYu7MQ3Zxs4UmUsdV1VG8?cluster=devnet

Which royalty applies to Edition #2, and why?

> Edition #2 has a 5% royalty (500 basis points). In Metaplex Core, an asset-level Royalties plugin overrides the collection-level Royalties plugin. Because Edition #2 has its own Royalties plugin configured with 500 basis points (5%), that asset-level plugin takes precedence over the collection's royalty settings upon resale.
