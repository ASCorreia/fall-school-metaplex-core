/**
 * Step 1: Create your devnet wallet and fund it.
 * Run: npm run setup
 */
import { sol } from "@metaplex-foundation/umi";
import { getUmi, explorerAddress } from "./umi";

async function main() {
  const umi = getUmi();
  console.log("Wallet address:", umi.identity.publicKey.toString());

  const balance = await umi.rpc.getBalance(umi.identity.publicKey);
  const solBalance = Number(balance.basisPoints) / 1_000_000_000;
  console.log("Balance:", solBalance, "SOL");

  if (solBalance < 0.5) {
    console.log("Requesting 1 SOL airdrop from devnet...");
    try {
      await umi.rpc.airdrop(umi.identity.publicKey, sol(1));
      const after = await umi.rpc.getBalance(umi.identity.publicKey);
      console.log("New balance:", Number(after.basisPoints) / 1_000_000_000, "SOL");
    } catch (e) {
      console.log("Airdrop failed (devnet faucet is often rate-limited).");
      console.log("Get SOL manually at https://faucet.solana.com for address:");
      console.log("  " + umi.identity.publicKey.toString());
    }
  }

  console.log("Explorer:", explorerAddress(umi.identity.publicKey.toString()));
}

main();
