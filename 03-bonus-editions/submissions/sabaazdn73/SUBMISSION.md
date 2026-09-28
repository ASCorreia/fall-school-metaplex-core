# Bonus Track Submission — Print Editions

- Name / GitHub handle: Saba Azadegan / sabaazdn73

## Links

- Collection (MasterEdition, maxSupply 3, 500 bp): https://explorer.solana.com/address/ESJES3QKpEGcwCozo2wvK5AAUDuMMQNvd4E7d9jJe776?cluster=devnet
- Edition #1 — 250 bp (2.5%): https://explorer.solana.com/address/HaU5D8YsW73hKdMr3B9ywSsvGL9QvkMYVf7Qy2qk61eC?cluster=devnet
- Edition #2 — 500 bp (5%): https://explorer.solana.com/address/4nQ9696eSNDyNUEeYAjCwnvMsp9diRehz65j7QmjdKBW?cluster=devnet
- Edition #3 — 1000 bp (10%): https://explorer.solana.com/address/2kHzwSpoWddWMB9fnxu9rgefEy6G2jiXigQP3dZ2qxkj?cluster=devnet

## Which royalty applies to Edition #2, and why?

5%, and it comes from the **asset**, not the collection.

The number is deliberately the same on both — the collection carries a 500 bp
Royalties plugin and Edition #2 carries its own 500 bp plugin — which is what
makes the question worth asking. Reading the answer off the explorer would give
the right figure for the wrong reason.

Core's rule is that an asset-level plugin **overrides** the same plugin on its
collection. Lifecycle validation gathers the collection's plugins first, then
lets the asset's own plugins replace them. So every one of these three prints
is governed by its own Royalties plugin: 250, 500 and 1000 bp respectively. The
collection's 500 bp is the default for any print that does **not** carry one —
and here, none of them fall back to it.

Put differently: if I removed the asset-level plugin from Edition #2, it would
still show 5%, but that would be inheritance rather than its own setting. The
two paths are indistinguishable by the number alone, which is exactly why the
override rule has to be reasoned about rather than observed.

## A note on what these royalties actually do

All four plugins use `ruleSet('None')`, so the royalties are advisory. Core
does not pay creators — it has no mechanism to. What the Royalties plugin can
do is restrict *which programs* may transfer the asset, via `ProgramAllowList`
or `ProgramDenyList`; with `None`, any program may. Enforcement would mean
listing the marketplaces that honour the split and rejecting the rest.

These prints are also deliberately **not** soulbound. A frozen asset cannot be
sold, and a royalty only ever applies on a sale, so the two features are
mutually pointless.
