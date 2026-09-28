# Anchor Track Submission

- Name / GitHub handle: Manjeet Singh / `manjeets219`
- Program ID (devnet): [BDjtgYKVR41ogxPCiNTYb5KkQpTGor64xrTgUbgZ9tQy](https://explorer.solana.com/address/BDjtgYKVR41ogxPCiNTYb5KkQpTGor64xrTgUbgZ9tQy?cluster=devnet)
- Minted asset: [BQLFtQP2iA93TD57pNesstB4w167hVDwtUZXMsaYv7zE](https://explorer.solana.com/address/BQLFtQP2iA93TD57pNesstB4w167hVDwtUZXMsaYv7zE?cluster=devnet)
- Mint transaction: [4asNga7gZTj7bH5rrq44T3w7n87CAe9e9ef1k2NW8X22He7JJPyPgs7nJty9Qgsd49aJsBstbjtLESGdxGwgmoKm](https://explorer.solana.com/tx/4asNga7gZTj7bH5rrq44T3w7n87CAe9e9ef1k2NW8X22He7JJPyPgs7nJty9Qgsd49aJsBstbjtLESGdxGwgmoKm?cluster=devnet)
- TypeScript-track asset: [EgUAC2EK2NyxeNAPKtYqMDVoRD2hhcox8r5CoMvf62fo](https://explorer.solana.com/address/EgUAC2EK2NyxeNAPKtYqMDVoRD2hhcox8r5CoMvf62fo?cluster=devnet)

## How does your program make the NFT soulbound?

The program's `CreateV2` CPI attaches a `PermanentFreezeDelegate` with
`frozen: true` when the Core asset is created. Its authority is
`PluginAuthority::None`, so no wallet can unfreeze it later. The submitted
`verify.ts` fetched the devnet asset, checked both properties, and confirmed
that an attempted owner transfer fails with MPL Core's freeze error.

From `02-anchor-track`, after `anchor build`:

```bash
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=$HOME/.config/solana/id.json \
npx ts-node submissions/manjeets219/verify.ts BQLFtQP2iA93TD57pNesstB4w167hVDwtUZXMsaYv7zE
```
