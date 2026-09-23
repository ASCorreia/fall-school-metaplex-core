# Bonus Challenge Submission

- Name / GitHub handle: VedanshShuklaa
- Collection (MasterEdition): https://explorer.solana.com/address/9QnGqqp4F98Wpdz84b48pBkMsR8qHQs4wRtvMXAGtpt9?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/DWAx4hp3DrRL588LtsKvoYaaGHh3vhJHg2j2VHAfd68R?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/G8TxZS7kMRiEbkmu1JoKdWYoKTiRXg9K4svqkExspd4u?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/GzQS7iPwBqoGtyQi9h6xYZiWuoWVcuzRUBXbycSTZMJz?cluster=devnet
- Metadata: https://gist.githubusercontent.com/VedanshShuklaa/9d58706a42892a0ec6010a18ce609bd4/raw/17ffd24858a58676e5ad4516e221a545c44354b4/print-collection.json

Which royalty applies to Edition #2, and why?

> Edition #2's own 5% (500 basis points) Royalties plugin applies, not the collection's. Each printed asset in this script gets its own asset-level `Royalties` plugin (250 / 500 / 1000 basis points for prints #1, #2, #3), and an asset-level plugin always overrides the collection-level one when both are present. The collection's `Royalties` plugin (also 500 basis points here) only acts as the fallback default for any asset printed into the collection that does *not* carry its own Royalties plugin. Since every print in this script explicitly sets its own royalty, each one resolves to its own value — Edition #2 resolves to 5% because that's what's attached directly to it, not because it fell back to the collection default (even though, for #2, the two numbers happen to coincide).
