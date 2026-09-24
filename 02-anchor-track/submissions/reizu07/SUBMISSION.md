# Anchor Track Submission

- Name / GitHub handle: reizu07
- Program ID (devnet): https://explorer.solana.com/address/DufcvXiwt8GVVPPeJ6yQBH7wjd8JJPKoZ1wmyrzhwsos?cluster=devnet
- Minted asset: https://explorer.solana.com/address/23928Qkhjk6HzMfdAwV7rvXK2NkJDozQ8yA8zkgh9N3y?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/4hAU7jEo6EeHcFurgb6KgXuwDNtBJjvAQgPGFE6PugC8cNwscQ76xUwUYih8R9MTReczVr83epDnvucTTaM7TF9K?cluster=devnet

How does your program make the NFT soulbound?

> The program attaches a frozen `PermanentFreezeDelegate` plugin with `PluginAuthority::None`. The asset starts frozen, and nobody can thaw it, so its owner cannot transfer it.
