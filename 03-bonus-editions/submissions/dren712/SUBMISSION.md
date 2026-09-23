# Bonus Challenge Submission

- Name / GitHub handle: dren712
- Collection (MasterEdition): https://explorer.solana.com/address/U9Z2SAS3QJDhhgeannMRpAxDVM4P1LZYJzaKDBcQrGC?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/HVSSZUjh9uuyT3bvfGgAr3nZ5L9D3SCW4Xt297KwutCF?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/4Kz3P4hBoMU2QjrBNMywb1HG9qqChYjksFHhodKyUKmV?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/6FksKLs7m4mdKFKafuH8ieBdYWSDHaCcYK5SSWpTqykw?cluster=devnet

Which royalty applies to Edition #2, and why?

> Edition #2 has a 5% royalty (500 basis points). In Metaplex Core, whenever an asset defines its own `Royalties` plugin, that asset-level plugin completely overrides the collection-level plugin. While the Master Edition collection and Edition #2 coincidentally both define 500 basis points (5%), marketplace sales of Edition #2 evaluate its asset-level plugin directly.
