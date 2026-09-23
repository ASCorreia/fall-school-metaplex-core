# Anchor Track Submission

- Name / GitHub handle: pandaa880
- Program ID (devnet): https://explorer.solana.com/address/J4rNkLFEKXbmHm5aFvs7hQ2nfiB2qZsettJo3khMGX77?cluster=devnet
- Minted asset: https://explorer.solana.com/address/H8JTn1jUkQWK2cAuXBEicTWUF7Zq2bBoKuTBNWd66hgA?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/25DVJz9aroPB8P1H6RD676a8KKFnzaL1ie1A6zgcQs9AoDmncjMCEMUjxprqdR4EJ3ApQHA861FfWQssSX
ciiFn6?cluster=devnet

How does your program make the NFT soulbound?

It makes the NFT soulbound by attaching the PermanentFreezeDelegate plugin to the asset during creation via a CPI to Metaplex Core. By passing frozen: true, the asset is born frozen so the protocol rejects all transfers. By setting authority: PluginAuthority::None, we guarantee that nobody holds the permission to ever thaw it, permanently locking it to the wallet.

