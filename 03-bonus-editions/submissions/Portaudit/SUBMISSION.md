# Bonus Challenge Submission

- Name / GitHub handle: Portaudit
- Collection (MasterEdition): https://explorer.solana.com/address/5hGHi9WevXJ8RmPt3oE73Zz7bq5kRWxMSxhXEGncHrux?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/4V7cotvcii7ci8gEvjo69rPrpEWNockuyHZaJh9HTVWP?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/AtEMD2rhvQjY49NU9GAcbRvp4AygLJvUFYz9NxwnFtE3?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/8sLQEsDL7HEX6EA4qQFTL2QGsBEWrd9FKhnJwwKddpQG?cluster=devnet

Which royalty applies to Edition #2, and why?

> Edition #2's own asset-level Royalties plugin (500 basis points = 5%)
> applies, not the collection's default. An asset-level Royalties plugin
> always overrides the collection-level one for that specific asset — the
> collection's 500 bps is only a fallback for assets that don't define
> their own Royalties plugin. Since every print here sets its own
> Royalties plugin with a distinct basisPoints value (250, 500, 1000),
> each print's royalty is entirely determined by its own plugin.
