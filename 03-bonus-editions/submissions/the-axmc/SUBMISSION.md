# Bonus Challenge Submission

- Name / GitHub handle: Andrea / the-axmc
- Collection (MasterEdition): https://explorer.solana.com/address/9VhffbEMWy2MXR6kYBmuREoqFvZRxLZWV3Ufj9zi34wm?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/HWWwg9SdgyqXVLivVWXGVwtDCuhGFj8vacxyRpyEWJ3G?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/7Vjqsn21JBECBLEV2bKfHH5qrPiVPJV3pnsEFNgnr4sB?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/AZvFE35xVqHLi4fkpxqE6ug9rC8rsJ8cG6rXqbTTbJ6D?cluster=devnet

Which royalty applies to Edition #2, and why?

> The 5% (500 basis points) royalty that is attached directly to the Edition #2 asset.
>
> Core resolves plugins from the collection first and then lets asset-level plugins
> override the same plugin on the collection. Edition #2 carries its own `Royalties`
> plugin, so that one wins and the collection-level `Royalties` plugin is only a
> default for assets that do not define their own. In this run the collection default
> also happens to be 5%, so the number is the same, but the plugin that is actually
> read is the asset-level one. Edition #1 (2.5%) and Edition #3 (10%) show the
> override in action, since both differ from the collection's 5%.
