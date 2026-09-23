# Bonus Challenge Submission

- Name / GitHub handle: fribas84
- Collection (MasterEdition): https://explorer.solana.com/address/EZieizRJKAW2GQKLq4REt6SoWsZHRuh9NX9GfkERgwKd?cluster=devnet
- Edition #1 (royalty 2.5%): https://explorer.solana.com/address/DmeMXqqSySuCESUYaaDYNbgoFJW1RmoSbSb8WCaq7Ty?cluster=devnet
- Edition #2 (royalty 5%): https://explorer.solana.com/address/9ydDkSJpd64Er6N8rmxdquKou1tiwJtcrrw7pLVjRo7R?cluster=devnet
- Edition #3 (royalty 10%): https://explorer.solana.com/address/GApZGxNvLCwusMTEHtYMXoMAaisgfD8eWqFUtsWMhUzn?cluster=devnet

Which royalty applies to Edition #2, and why?

> 5% (500 basis points). Edition #2 has its own asset-level Royalties plugin, and that plugin overrides the collection-level Royalties plugin. The collection default is also 500 bps, so the rates match, but the asset plugin is the one that applies. Editions #1 and #3 show the override directly: 250 bps and 1000 bps, against the same 500 bps collection default.
