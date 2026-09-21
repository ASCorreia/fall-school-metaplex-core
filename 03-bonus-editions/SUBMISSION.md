# Track 3: Bonus Editions

## Explorer Links
- Collection: https://explorer.solana.com/address/Ea8ovYwWpMxNMe6HfhFtw2TFLZ849RozxQdKPRV9nFFk?cluster=devnet
- Print #1: https://explorer.solana.com/address/FjibsaA6aWwwuriHpEkajoCBdHLfM9sCt3SuoBqKGAD?cluster=devnet
- Print #2: https://explorer.solana.com/address/6KBvJiM3Kk555h8ZigNTz2qUV68jvNT8EcX5sgHmKjbR?cluster=devnet
- Print #3: https://explorer.solana.com/address/44TACUigSXMzPV7NiDGoe53L1ZAZmTVuHCN511bARnDX?cluster=devnet

## Question
Which royalty applies to Edition #2, and why?

## Answer
The 500 basis points (5%) royalty applies to Edition #2. This is because in Metaplex Core, an asset-level plugin overrides the same plugin on the collection. The `Royalties` plugin attached directly to Edition #2 takes precedence over the `Royalties` plugin configured at the collection level, allowing exceptions to be made per asset.
