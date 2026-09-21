# Bonus Challenge: Print Editions with Different Royalties

Docs: [Print Editions with MPL Core](https://www.metaplex.com/docs/smart-contracts/core/guides/print-editions)

Think of a painting and its numbered prints. Build that with Core plugins, on devnet:

1. Create a **collection** with the `MasterEdition` plugin (`maxSupply: 3`) and a collection-level `Royalties` plugin.
2. Print **3 assets** into it, each with the `Edition` plugin (`number: 1`, `2`, `3`).
3. Give each edition a **different royalty** by attaching an asset-level `Royalties` plugin (e.g. 250 / 500 / 1000 basis points). Asset-level royalties **override** the collection-level plugin. Check this on the explorer.

These editions must NOT be soulbound, since royalties only matter for assets that can be sold.

## Setup

Finish the easy track first. Dependencies are already installed by the `npm install` you ran at the repo root, and this track automatically uses the same funded `wallet.json` (at the repo root) as the easy track:

```bash
cd 03-bonus-editions
```

(No wallet yet? Run `npm run setup` in `01-easy-track` first.)

## Your task

Complete the TODOs in `editions.ts`, then:

```bash
npm run editions
```

It should print 4 explorer links: the collection + 3 editions. A reference solution lives in `solution/editions.ts` (spoilers, try it yourself first).

## Submit (via PR)

1. Fork this repo and create a branch.
2. Add a folder `submissions/<your-github-handle>/` containing:
   - your completed `editions.ts`
   - `SUBMISSION.md` (copy `submissions/SUBMISSION-template.md`) with all 4 explorer links
3. Open a Pull Request. Do NOT include `wallet.json` in your PR.

Be ready to answer: *which royalty applies to Edition #2, and why?*
