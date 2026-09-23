# Anchor Track Submission

- Name / GitHub handle: intignosis
- Program ID (devnet): https://explorer.solana.com/address/3J92ejN2bE2dphF531WAQNGoARWaseuLW838EkK8j2UF?cluster=devnet
- Minted asset: https://explorer.solana.com/address/98q2sjJFbf2bGeqgiDo2xdjLGumS6T33Gft67GJbQtR6?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/32NKEhzbof5CQXjVtEKnnLozVASYKWs8meiAKRLBZgRN6mD2y6PypGpyKeSWg9nqoNRkFwzVvyZDebE5QdkJ7qJG?cluster=devnet

How does your program make the NFT soulbound?

> The program CPIs into MPL Core's `CreateV2` and attaches one plugin at
> creation time:
>
> ```rust
> .plugins(vec![PluginAuthorityPair {
>     plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }),
>     authority: Some(PluginAuthority::None),
> }])
> ```
>
> Both halves are load-bearing. `frozen: true` makes MPL Core reject transfer
> and burn from the moment the asset exists. `PluginAuthority::None` means no
> account holds the right to update the plugin, so nobody can ever thaw it —
> not the owner, not the update authority, not us.
>
> Frozen with a real authority would only be a temporary lock. And because
> `PermanentFreezeDelegate` can only be added at creation, there is no later
> transaction that could have attached a weaker version of it.

## Note on the test harness

`tests/soulbound-nft.ts` needed one fix to pass, unrelated to the program.
`AnchorProvider.defaultOptions()` pins the provider to `processed` commitment,
while `createUmi(endpoint)` with no options builds its Connection without a
commitment and therefore reads at the RPC default, `finalized`. The test wrote
at `processed`, returned, then read at `finalized` and found nothing — the
asset existed, just not yet at that commitment. Tellingly, the two
`getAccountInfo` assertions passed, because they use the provider's own
connection.

The fix pins the umi reader to `confirmed` and waits for the mint to reach it.
No assertion was removed or weakened.

Worth noting that the second test proves less than it appears to: its `catch`
accepts any error, so it reported a pass on an earlier run where the asset had
never been created at all. The soulbound property was actually established by
track 1's `npm run verify`, which refuses to count a failure that is not MPL
Core's freeze check.
