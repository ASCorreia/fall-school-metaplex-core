# Anchor Track Submission

- Name / GitHub handle: penumbraaasol
- Program ID (devnet): https://explorer.solana.com/address/DkgePKQiQfQu74T4BdxQgKk6AQYjkhhcoS8iJJAZog86?cluster=devnet
- Minted asset: https://explorer.solana.com/address/GCxQvJH5f1sihZ7Jt5i5Vg3xrDjgw4tyoQAqbVy9Mw73?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/3nQRjnQ8rMVgJkvcXYzB8dakhBoeSUC3V8MD5R2MPjcbWdvzaYMWgffpxdezPD3fD7LSHsmaDV1ALEsZ1qbBmvSm?cluster=devnet

How does your program make the NFT soulbound?

> The program CPIs into Metaplex Core with `CreateV2CpiBuilder` and attaches a
> single plugin at creation:
>
> ```rust
> .plugins(vec![PluginAuthorityPair {
>     plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }),
>     authority: Some(PluginAuthority::None),
> }])
> ```
>
> Both halves are load-bearing and neither works alone. `frozen: true` is what
> Core checks on every transfer and burn, so the asset is immobile from the
> moment it exists — there is no window between creation and freezing.
> `PluginAuthority::None` is what makes that permanent: a plugin authority is
> whoever may update the plugin, and setting it to nobody means no account
> anywhere can flip `frozen` back. Frozen under a real authority would only be a
> temporary lock that the authority holder could lift.
>
> It matters that this happens inside `CreateV2`. Core does not allow plugins to
> be added or edited after an asset is created, so the single creation call is
> the only chance to bind it. There is no follow-up instruction that could be
> front-run or forgotten.
>
> Worth being precise about what is bound: `owner` is stored by Core as the
> asset's owner, and the freeze stops that field ever changing. The asset is
> bound to the address, not to a person — so it is only as soulbound as the
> owner's key is uncompromised.

## Verification

`anchor test` on Surfpool — both tests pass:

```
  soulbound-nft
    ✔ mints a soul-bound Core NFT
    ✔ cannot be transferred by its owner (soul-bound)
  2 passing
```

I also checked the deployed devnet asset rather than trusting the local test.
Fetching it back and attempting a real transfer **signed by its actual owner**:

```
owner          : BWqK1YifG5Sgh37EfqraNzAUHp4mtfxTC21bca6G85No
owner is signer: true
frozen         : true
authority      : None

RESULT: transfer rejected; by Core's freeze check
Invalid Authority
Source: Program > mplCore [CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d]
```

That distinction matters: the transfer was not rejected for a missing signature
or an empty wallet. The rightful owner signed, and Metaplex Core itself refused.

Note the track 1 verifier reports `SKIP` on its transfer test for this asset —
it only attempts the transfer when `wallet.json` is the owner, and this asset is
owned by the Anchor CLI wallet that deployed the program.

## Files

```
02-anchor-track/submissions/penumbraaasol/
├── mint.ts          # devnet client for the deployed program
└── SUBMISSION.md
```
