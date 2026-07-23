# Bonus Challenge Submission

- Name / GitHub handle: ulukansarikaya
- Collection (MasterEdition): https://explorer.solana.com/address/E58FFAQx1wZuixnJu7S6UEwyVxeCwSC1HPY646F8SAEn?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/3R17kVLracT8c5egpxXQ1RuNnGh2gie2qtSBBjZ5BB4x?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/CHkHLYho89VJGNQcCxyL4ohp6JTkbur3aT4uAJF59H6z?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/3Kz3KL7tbH626zK4yEUjz51NbhcBM9N2EkNXTi3TzqHa?cluster=devnet

Which royalty applies to Edition #2, and why?

> **5% (500 basis points).**
>
> Edition #2 carries its own **asset-level `Royalties` plugin** set to 500 bps.
> An asset-level Royalties plugin always **overrides** the collection-level
> plugin, so the applied royalty comes from the asset, not the collection.
>
> In this case the collection-level default also happens to be 500 bps (5%),
> so the numbers coincide — but even if the collection default were changed,
> Edition #2 would keep 5% because its own plugin takes precedence. (For
> contrast, Edition #1 overrides to 2.5% and Edition #3 to 10%, both differing
> from the collection default, which proves the override is in effect.)
