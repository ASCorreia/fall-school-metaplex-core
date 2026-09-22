# Bonus Challenge Submission

- Name / GitHub handle: Eshan276
- Collection (MasterEdition): https://explorer.solana.com/address/6yAaDQorRFXE5LpiCZcYrJEKMYnj95Q4SEebDr651Bgr?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/2e9sHstkhw2Ug2PQPaCyFSuWzAEM6CnrbBobLyRUvkpr?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/HqH7VaD3psQVYijkahiq9CozsfzZgkfZiSz8myTKMGgE?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/J6XSa9Kb1iE4tzGMQ98RePvoGQoLwcCJKxvEUvDaZ6es?cluster=devnet

Which royalty applies to Edition #2, and why?

> **5% (500 basis points) — from Edition #2's own asset-level `Royalties` plugin,
> not inherited from the collection.**
>
> This one is a deliberate trap, and worth being precise about. The collection
> also carries a 5% royalty, so the number on Edition #2 matches the collection
> exactly. It is tempting to read that as "Edition #2 inherits the collection
> default". It does not.
>
> In Core, a plugin on the asset **overrides** the same plugin on its collection.
> Editions #1 and #3 make the mechanism obvious because their values differ from
> the collection (2.5% and 10% against the collection's 5%). Edition #2 is the
> case where the override is invisible from the number alone — the value is the
> same, but the source is different. If I later updated the collection's royalty
> to 8%, editions #1 and #3 would plainly stay at their own values, and #2 would
> stay at 5% too rather than following to 8%, because it has its own plugin.
>
> Confirmed by reading all four accounts back from devnet:
>
> ```
> COLLECTION royalties bps: 500 | masterEdition maxSupply: 3
> EDITION #1: number=1 assetRoyaltyBps=250  hasOwnRoyaltyPlugin=true
> EDITION #2: number=2 assetRoyaltyBps=500  hasOwnRoyaltyPlugin=true
> EDITION #3: number=3 assetRoyaltyBps=1000 hasOwnRoyaltyPlugin=true
> ```
>
> `hasOwnRoyaltyPlugin=true` on Edition #2 is the proof: the 500 bps is stored on
> the asset itself. An edition that had inherited from the collection would have
> no `royalties` field of its own.
>
> Also confirmed none of the three editions is frozen, as the challenge requires —
> royalties only matter for assets that can actually be sold.
