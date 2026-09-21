# Anchor Track Submission

**GitHub handle:** ABICITYE

- **Devnet Program ID:** Ga1QexSt7Ngq75cceS3HN8Ad4mGb89JgimFfMNVW53gw
- **Asset Address:** 96pSDog8wSUMaPNGsdD1UvWsM8XBNvEHiywA4HQqHmxb
- **Mint Transaction:**
  https://explorer.solana.com/tx/5HlCKqsamRGGArxdrCfTtFBEMVafkX5vBATTP1kLSDFdAfS9ABA9QtWYNPT1ExmjgWaAp9zu3sMLfRL9bvfyKcDF?cluster=devnet
- **Asset Explorer:**
  https://explorer.solana.com/address/96pSDog8wSUMaPNGsdD1UvWsM8XBNvEHiywA4HQqHmxb?cluster=devnet

The program CPIs into MPL Core via `CreateV2CpiBuilder`, attaching a
`PermanentFreezeDelegate` with `frozen: true` and `authority: None`, so the
asset can never be transferred or thawed.
