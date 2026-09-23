# Bonus Challenge Submission

- Name / GitHub handle: intignosis
- Collection (MasterEdition): https://explorer.solana.com/address/7pQa1dXr72zNQcDzweDuyWT7wDyavKxCKrCfe6mg3crS?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/2m7ifWAdjsMTsNLYgrUemaC1AVhzKzkm6MLhM5nfL7U8?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/2gPGJE5Hbt3CqNMEbf12m1pnXJV56jNqrC3qNxtXc56o?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/FArguh53wc8vY7Ma84RpWLwmsXRtb2rznsNpPiuuTBcM?cluster=devnet

Which royalty applies to Edition #2, and why?

> Edition #2's own asset-level Royalties plugin applies: 500 basis points, 5%.
>
> The reason is the override rule, not the number. A plugin on an asset shadows
> the plugin of the same type on its collection, so each print's own Royalties
> plugin is what a marketplace reads — that is the whole mechanism that lets
> three prints in one collection earn three different rates.
>
> Edition #2 is the case where you cannot tell from the number alone: the
> collection is also set to 500 bp, so inheriting and overriding happen to give
> the same 5%. Prints #1 and #3 are where the rule shows: 250 bp (2.5%) and
> 1000 bp (10%) against the collection's 500 bp. If the asset-level plugins
> were removed, all three would fall back to the collection's 5%.
