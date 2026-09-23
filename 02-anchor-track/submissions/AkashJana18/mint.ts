import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";
import { fetchAsset } from "@metaplex-foundation/mpl-core";
import { SoulboundNft } from "../../target/types/soulbound_nft";
import idl from "../../target/idl/soulbound_nft.json";

// Program ID from programs/soulbound-nft/src/lib.rs `declare_id!`
// (same address in Anchor.toml [programs.localnet] and target/idl/soulbound_nft.json).
const PROGRAM_ID = new PublicKey(
  "8tgCgqtxTioQFoRvbTg3hjf3NQ85mGz8ojqsJsfcdder",
);
const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);

const RPC_ENDPOINT =
  process.env.ANCHOR_PROVIDER_URL ||
  process.env.SOLANA_RPC_URL ||
  "https://api.devnet.solana.com";
const NAME = process.env.NAME || "Solana Fall School Diploma";
const URI = process.env.URI || "https://arweave.net/diploma.json";

function loadPayer(): Keypair {
  // Priority: PAYER_PATH / ANCHOR_WALLET env, first CLI arg, then default wallet.
  const candidate =
    process.env.PAYER_PATH ||
    process.env.ANCHOR_WALLET ||
    process.argv[2] ||
    path.join(os.homedir(), ".config", "solana", "id.json");
  const raw = fs.readFileSync(candidate, "utf-8");
  return Keypair.fromSecretKey(Buffer.from(JSON.parse(raw)));
}

async function main() {
  const payer = loadPayer();
  // Optional owner override: OWNER=<base58> env or second CLI arg.
  // Defaults to your own devnet wallet (self-bound diploma).
  const ownerArg = process.env.OWNER || process.argv[3];
  const owner = ownerArg ? new PublicKey(ownerArg) : payer.publicKey;

  const connection = new Connection(RPC_ENDPOINT, "confirmed");
  const wallet = new anchor.Wallet(payer);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);

  const program = new Program<SoulboundNft>(idl as SoulboundNft, provider);

  const balance = await connection.getBalance(payer.publicKey);
  console.log(`Payer:   ${payer.publicKey.toBase58()}`);
  console.log(`Owner:   ${owner.toBase58()}`);
  console.log(`Program: ${PROGRAM_ID.toBase58()}`);
  console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  if (balance < 0.05 * LAMPORTS_PER_SOL) {
    console.log(
      "Low balance. Fund with: solana airdrop 2 -u devnet " +
        payer.publicKey.toBase58(),
    );
  }

  // Fresh keypair for the Core asset account. Must co-sign creation.
  const asset = Keypair.generate();
  console.log(`Asset (new): ${asset.publicKey.toBase58()}`);

  const sig = await program.methods
    .mintSoulboundNft(NAME, URI)
    .accountsPartial({
      payer: payer.publicKey,
      asset: asset.publicKey,
      owner,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([asset])
    .rpc();

  console.log(`Mint tx: https://explorer.solana.com/tx/${sig}?cluster=devnet`);
  console.log(
    `Asset:   https://explorer.solana.com/address/${asset.publicKey.toBase58()}?cluster=devnet`,
  );
  console.log(
    `Program: https://explorer.solana.com/address/${PROGRAM_ID.toBase58()}?cluster=devnet`,
  );

  // Verify on-chain: MPL Core owns the account and freeze plugin is active.
  const umi = createUmi(RPC_ENDPOINT);
  const coreAsset = await fetchAsset(
    umi,
    publicKey(asset.publicKey.toBase58()),
  );
  console.log(
    `Verified: name="${coreAsset.name}" uri="${coreAsset.uri}" owner=${coreAsset.owner} frozen=${coreAsset.permanentFreezeDelegate?.frozen}`,
  );
  if (coreAsset.permanentFreezeDelegate?.frozen !== true) {
    throw new Error("Asset is NOT permanently frozen — check the program");
  }
  console.log("Done: soul-bound NFT minted to your devnet wallet.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
