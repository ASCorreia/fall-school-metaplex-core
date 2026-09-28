# Bonus Challenge Submission

- Name / GitHub handle: Manjeet Singh / `manjeets219`
- Collection (MasterEdition): [CAZisg2s5GMuJvaqkj45ASr3ReqoYz4CYvaYi9zFht8x](https://explorer.solana.com/address/CAZisg2s5GMuJvaqkj45ASr3ReqoYz4CYvaYi9zFht8x?cluster=devnet)
- Edition #1 (royalty 2.5%): [CqSLgweMrQT81wRsJJaoPVvD3min9TLangmuT6oMBKQy](https://explorer.solana.com/address/CqSLgweMrQT81wRsJJaoPVvD3min9TLangmuT6oMBKQy?cluster=devnet)
- Edition #2 (royalty 5%): [6PtXZGunr2nDBVgYDWhBoAUKGeR7RdqjYF17ChJCHeaY](https://explorer.solana.com/address/6PtXZGunr2nDBVgYDWhBoAUKGeR7RdqjYF17ChJCHeaY?cluster=devnet)
- Edition #3 (royalty 10%): [8L2pC96kUNE8q75577U7SDM8koi8Pxp3bCYaY3U8NaYz](https://explorer.solana.com/address/8L2pC96kUNE8q75577U7SDM8koi8Pxp3bCYaY3U8NaYz?cluster=devnet)

## Which royalty applies to Edition #2, and why?

Edition #2 has an asset-level `Royalties` plugin set to **500 basis points
(5%)**. The asset-level plugin overrides the collection's 500-basis-point
default; its on-chain value was read back after minting. For editions #1 and
#3 the override is visible because they differ from the collection default.

The collection's `MasterEdition.maxSupply` and each `Edition.number` are
informational in MPL Core, not on-chain enforcement of supply or sequencing.
This example creates exactly three numbered prints in the client script.

The completed implementation is `03-bonus-editions/editions.ts`; the sibling
`editions.ts` in this submission imports it to avoid keeping two copies of the
mint logic in sync.
