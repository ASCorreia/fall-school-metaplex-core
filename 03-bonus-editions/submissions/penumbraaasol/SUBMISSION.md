# Bonus Challenge Submission

- Name / GitHub handle: penumbraaasol
- Collection (MasterEdition): https://explorer.solana.com/address/83PFhQ2qG6f3fxJReTQea113jHKiQ4egtN9rTjY9J7Hm?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/7zFji79VEomRVqr4TjmKxWLXepo6oUgy5sHkmTXF2igh?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/8ssTLiMBAijV7xMR433S6qFroR5FaywdWsXHKWu9ruky?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/ai7meXUGJfpFhXct4NFs8LwTvAcEFUaT3RJ2oV39EFA?cluster=devnet

Which royalty applies to Edition #2, and why?

> **500 basis points — 5% — and it comes from the print's own plugin, not from
> the collection.**
>
> When an asset carries its own `Royalties` plugin it overrides the
> collection's; the collection's value only applies to assets that do not
> specify one. Edition #2 was created with `basisPoints: 500`, so 5% applies.
>
> Edition #2 is the interesting case precisely because the two numbers
> coincide. The collection is also set to 500, so the fee you would observe on
> a sale is identical either way, and you cannot tell from the outcome which
> rule produced it. The mechanism still matters: #1 and #3 carry 250 and 1000
> and visibly override the collection, which is the proof that the asset-level
> plugin is what is being read. If you changed the collection to 800 tomorrow,
> #2 would stay at 500 — it is not inheriting.
>
> I checked this rather than assuming it. The script reads each print back with
> `fetchAsset` after creating it and logs the on-chain value; the run printed
> 250, 500 and 1000, not the collection's 500 three times.

## Why nothing here is soulbound

Deliberately no `PermanentFreezeDelegate` on the collection or the prints.
Royalties are only ever paid when an asset is sold, and a frozen asset can
never be sold — so freezing a print would make its royalty unreachable. The
freeze plugin from tracks 1 and 2 is exactly the wrong tool here.

## Run output

```
Collection: 83PFhQ2qG6f3fxJReTQea113jHKiQ4egtN9rTjY9J7Hm
Print #1: 7zFji79VEomRVqr4TjmKxWLXepo6oUgy5sHkmTXF2igh  (edition 1, royalty 250 bp)
Print #2: 8ssTLiMBAijV7xMR433S6qFroR5FaywdWsXHKWu9ruky  (edition 2, royalty 500 bp)
Print #3: ai7meXUGJfpFhXct4NFs8LwTvAcEFUaT3RJ2oV39EFA  (edition 3, royalty 1000 bp)
```

The collection carries `MasterEdition { maxSupply: 3 }`, so the three prints
are the whole run.

## Artwork

The collection and prints carry the $DAQS mark, with metadata served from this
repo (`01-easy-track/assets/daqs-print.json`). It is a separate file from the
diploma's: the prints are deliberately not soulbound, so the diploma's "bound
to my wallet forever" description would be false on them.

## One note on the script

`editions.ts` wraps `fetchCollection` and `fetchAsset` in a short retry. On
devnet the read path lags the write path: an account confirmed by
`sendAndConfirm` can still 404 on the very next fetch, which made the first run
fail with `AccountNotFoundError` on a collection that had in fact been created.
The retry fixes a flake in the tooling, not in the on-chain result.
