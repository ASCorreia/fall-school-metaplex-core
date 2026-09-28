# Anchor Track Submission

- Name / GitHub handle: Manjeet Singh / `manjeets219`
- Program ID (devnet): [BDjtgYKVR41ogxPCiNTYb5KkQpTGor64xrTgUbgZ9tQy](https://explorer.solana.com/address/BDjtgYKVR41ogxPCiNTYb5KkQpTGor64xrTgUbgZ9tQy?cluster=devnet)
- Minted asset: [7kSSs9qPGUyEstviaB9j2Cnyogsg65R5V4FvPemTwC3E](https://explorer.solana.com/address/7kSSs9qPGUyEstviaB9j2Cnyogsg65R5V4FvPemTwC3E?cluster=devnet)
- Mint transaction: [3oRDg6qwQrhr5YiERjQ2TZ7rhapPi6V284vph27uW1Ee3ZX9AmLhfAURSog1way9bfkt41xNTtighaxZxyFEKy29](https://explorer.solana.com/tx/3oRDg6qwQrhr5YiERjQ2TZ7rhapPi6V284vph27uW1Ee3ZX9AmLhfAURSog1way9bfkt41xNTtighaxZxyFEKy29?cluster=devnet)
- TypeScript-track asset: [EgUAC2EK2NyxeNAPKtYqMDVoRD2hhcox8r5CoMvf62fo](https://explorer.solana.com/address/EgUAC2EK2NyxeNAPKtYqMDVoRD2hhcox8r5CoMvf62fo?cluster=devnet)

## How does your program make the NFT soulbound?

The program's `CreateV2` CPI attaches a `PermanentFreezeDelegate` with
`frozen: true` when the Core asset is created. Its authority is
`PluginAuthority::None`, so no wallet can unfreeze it later. The submitted
`verify.ts` fetched the devnet asset, checked both properties, and confirmed
that an attempted owner transfer fails with MPL Core's freeze error.

The submitted `mint.ts` uses the generated IDL for the instruction layout but
targets the deployed ID above explicitly. A reviewer can run `anchor keys sync`
for local tests without accidentally changing the devnet client target.

From `02-anchor-track`, after `anchor build`:

```bash
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=$HOME/.config/solana/id.json \
npx ts-node submissions/manjeets219/verify.ts 7kSSs9qPGUyEstviaB9j2Cnyogsg65R5V4FvPemTwC3E
```
