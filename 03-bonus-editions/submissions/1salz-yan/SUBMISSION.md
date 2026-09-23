# Bonus Challenge Submission

- Name / GitHub handle: Xinyan Liu / @1salz-yan
- Collection (MasterEdition): https://explorer.solana.com/address/8fjLtrCfbGfMd2dWPvA774M76cmi1Z73kJPkPrQyEGSb?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/14ZYLUnhWcT3ShkeEyB8AwGY6w2vHhMRk853cQa8PXSE?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/DupC6nzDNAnfDbV2LLZKVhA7FWp32efwy9s66GhMuaGH?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/CxSnGxbARvyNMuRtjpXuiQ3TyXrG6tghFnM6TeYX6X8?cluster=devnet

## Which royalty applies to Edition #2, and why?

**5% (500 basis points)** — and it is the asset's *own* royalty, not the
collection's.

Each print was created with its own asset-level `Royalties` plugin
(250 / 500 / 1000 basis points), while the collection carries a single
collection-level `Royalties` plugin as the series default. I deliberately made
that default **750 bp (7.5%)**, so the override is visible instead of being
hidden behind two equal numbers: if the collection default applied, Edition #2
would pay 7.5%.

In MPL Core an asset-level plugin of the same type **overrides** the
collection-level one, so Edition #2 pays the 5% written on the asset itself
(verified with `fetchAsset`: `royalties.basisPoints = 500` on
`DupC6nzDNAnfDbV2LLZKVhA7FWp32efwy9s66GhMuaGH`, while `fetchCollection` reports
`750` on the collection).

The three prints are also numbered with the `Edition` plugin (`number: 1/2/3`)
inside a `MasterEdition` collection with `maxSupply: 3`, i.e. exactly three
prints can ever exist. No asset here carries the freeze plugin: royalties only
matter for assets that can still be sold, so these editions are intentionally
**not** soulbound.
