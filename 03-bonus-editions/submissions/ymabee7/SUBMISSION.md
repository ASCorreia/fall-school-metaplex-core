# Bonus Challenge Submission

- Name / GitHub handle: ymabee7
- Collection (MasterEdition): https://explorer.solana.com/address/6SzHCmT2d8HejsKrUy2Z4wdQwmu4MHWwEYVdYWKfGjiy?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/2xHSHEpUJk13LzW4xZy9DJ2dPDFiAHKJcqZiCmiDoaXT?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/A7BH6VypaYU1mbMC3jKg7KHLXcstwKaNgHLeGTBBWFk3?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/BGy4sUiSnKT8qxi2BGkyPSutZPJgqyUwB73R2AgFnny9?cluster=devnet

Which royalty applies to Edition #2, and why?

5% (500 basis points), from Edition #2's own asset-level Royalties plugin. Asset-level royalties override the collection's, so the collection's 500 bp never applies here, it is a coincidence that the two values match. Editions #1 and #3 make this visible: they read 250 and 1000, not the collection's 500
