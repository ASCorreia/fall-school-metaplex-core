import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { SoulboundNft } from "./target/types/soulbound_nft";

async function main () {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const wallet = provider.wallet;
    const assetKeypair = Keypair.generate();

    const program = anchor.workspace.SoulboundNft as Program<SoulboundNft>;

    console.log(`minting nft for owner ${wallet.publicKey.toBase58()} , nft address ${assetKeypair.publicKey.toBase58()}`);

    const tx = await program.methods
        .mintSoulboundNft("my nft by piotr skierka","https://arweave.net/metadata.json")
        .accountsPartial({
            payer: wallet.publicKey,
            asset: assetKeypair.publicKey,
            owner: wallet.publicKey,
            mplCoreProgram: new PublicKey ("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"),
            systemProgram: SystemProgram.programId,
        })
        .signers([assetKeypair])
        .rpc();
    
        console.log(`success, tx explorer link https://explorer.solana.com/tx/${tx}?cluster=devnet , nft explorer link: https://explorer.solana.com/address/${assetKeypair.publicKey.toBase58()}?cluster=devnet`);
    }
 
main().catch((err)=>{
    console.error(err);
})