# Anchor Track Submission

- Name / GitHub handle: rehna-jp
- Program ID (devnet): https://explorer.solana.com/address/FBMBeE4iR4ecTAp65rpjf3zpUDiSSvXofsjxpGDXgCGh?cluster=devnet
- Minted asset: https://explorer.solana.com/address/AL3Err3Uwwh3bujshSbSykRA3udZxKdp6gZ2819rRHUd?cluster=devnet
- Mint transaction: https://explorer.solana.com/tx/3h3YsvDFnUusJGZ53YYvmr1B4pAwnwPN3kCFdRa2J36L1gxipxqYztTJSy3tihdH2exbKP4dNqSJEqEkFfsxpQUa?cluster=devnet

How does your program make the NFT soulbound?

> My program CPIs into Metaplex Core's CreateV2 instruction with a PermanentFreezeDelegate plugin, setting `frozen: true` and `authority: None`. Because this is a permanent plugin, it can only be attached at creation and never modified afterward. With no authority left to thaw it, Core rejects any future transfer or burn attempt on this asset permanently.