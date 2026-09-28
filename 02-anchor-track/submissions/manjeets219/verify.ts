import { readFileSync } from "node:fs";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity, publicKey, sol } from "@metaplex-foundation/umi";
import { fetchAsset, InvalidAuthorityError, mplCore, transfer } from "@metaplex-foundation/mpl-core";

async function main() {
  const assetAddress = process.argv[2];
  const walletPath = process.env.ANCHOR_WALLET;
  if (!assetAddress || !walletPath) {
    throw new Error("Usage: ANCHOR_WALLET=<CLI wallet path> ts-node verify.ts <asset address>");
  }

  const umi = createUmi(process.env.ANCHOR_PROVIDER_URL ?? "https://api.devnet.solana.com", "confirmed")
    .use(mplCore());
  const secretKey = Uint8Array.from(JSON.parse(readFileSync(walletPath, "utf8")));
  umi.use(keypairIdentity(umi.eddsa.createKeypairFromSecretKey(secretKey)));

  const asset = await fetchAsset(umi, publicKey(assetAddress));
  if (asset.owner !== umi.identity.publicKey) {
    throw new Error("CLI wallet does not own this asset; cannot prove its transfer is blocked");
  }
  if (asset.permanentFreezeDelegate?.frozen !== true ||
      asset.permanentFreezeDelegate?.authority.type !== "None") {
    throw new Error("The asset is not permanently frozen with no authority");
  }
  if ((await umi.rpc.getBalance(umi.identity.publicKey)).basisPoints < sol(0.001).basisPoints) {
    throw new Error("The CLI wallet needs devnet SOL to test a transfer");
  }

  try {
    await transfer(umi, {
      asset,
      newOwner: generateSigner(umi).publicKey,
    }).sendAndConfirm(umi);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (error instanceof InvalidAuthorityError || /custom program error: 0x9\b/i.test(message)) {
      console.log("PASS: owner transfer rejected by MPL Core's freeze check");
      console.log("PASS: PermanentFreezeDelegate frozen with authority None");
      return;
    }
    throw error;
  }
  throw new Error("Transfer succeeded: this asset is not soulbound");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
