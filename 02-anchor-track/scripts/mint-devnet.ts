import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { SoulboundNft } from "../target/types/soulbound_nft";

async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.SoulboundNft as Program<SoulboundNft>;

    const assetKeypair = Keypair.generate();
    const wallet = provider.wallet;

    const tx = await program.methods
        .mintSoulboundNft(
            "Time",
            "https://raw.githubusercontent.com/Nancheung23/summer-school-metaplex-core/refs/heads/main/01-easy-track/metadata.json"
        )
        .accountsPartial({
            payer: wallet.publicKey,
            asset: assetKeypair.publicKey,
            owner: wallet.publicKey,
            mplCoreProgram: new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"),
            systemProgram: SystemProgram.programId,
        })
        .signers([assetKeypair])
        .rpc();

    console.log("Asset address:", assetKeypair.publicKey.toString());
    console.log("Tx signature:", tx);
    console.log(`Asset explorer: https://explorer.solana.com/address/${assetKeypair.publicKey.toString()}?cluster=devnet`);
    console.log(`Tx explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
}

main();
