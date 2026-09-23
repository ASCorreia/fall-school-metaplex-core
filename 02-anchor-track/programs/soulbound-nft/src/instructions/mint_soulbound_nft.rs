use anchor_lang::prelude::*;
// You will need these types for the TODOs below.
#[allow(unused_imports)]
use mpl_core::types::{PermanentFreezeDelegate, Plugin, PluginAuthority, PluginAuthorityPair};
use mpl_core::{instructions::CreateV2CpiBuilder, ID as MPL_CORE_ID};

#[derive(Accounts)]
pub struct MintSoulboundNft<'info> {
    /// Pays for the asset account rent and transaction fees.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The new Core asset. A fresh keypair that must co-sign; the account is
    /// created and initialized by the MPL Core program via CPI.
    #[account(mut)]
    pub asset: Signer<'info>,

    /// CHECK: The wallet the soul-bound NFT will belong to forever. Any
    /// account is acceptable; MPL Core only stores its address as the owner.
    pub owner: UncheckedAccount<'info>,

    /// CHECK: Verified against the canonical MPL Core program ID.
    #[account(address = MPL_CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

/// Mints a soul-bound (non-transferable) NFT as a Metaplex Core asset.
///
/// The asset is created via a CPI into MPL Core's `CreateV2` with the
/// `PermanentFreezeDelegate` plugin attached at creation time:
///   - `frozen: true`              -> born frozen, transfers and burns rejected
///   - `PluginAuthority::None`     -> nobody can ever thaw it
pub fn handler(ctx: Context<MintSoulboundNft>, name: String, uri: String) -> Result<()> {
    let mpl_core_program = ctx.accounts.mpl_core_program.to_account_info();
    let asset = ctx.accounts.asset.to_account_info();
    let payer = ctx.accounts.payer.to_account_info();
    let owner = ctx.accounts.owner.to_account_info();
    let system_program = ctx.accounts.system_program.to_account_info();

    CreateV2CpiBuilder::new(&mpl_core_program)
        .asset(&asset)
        .payer(&payer)
        // The recipient wallet the NFT is permanently bound to.
        .owner(Some(&owner))
        .system_program(&system_program)
        .name(name)
        .uri(uri)
        // The soul-bound part: attach the PermanentFreezeDelegate plugin,
        // already frozen, with no authority so it can never be thawed.
        .plugins(vec![PluginAuthorityPair {
            // Plugin that keeps the asset frozen: MPL Core then rejects every
            // transfer and every burn of this asset.
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }),
            // No authority at all: nobody (not even the update authority) can
            // ever thaw it, so the NFT stays bound to its wallet forever.
            authority: Some(PluginAuthority::None),
        }])
        .invoke()?;

    msg!(
        "Soul-bound Core asset {} minted to {}",
        ctx.accounts.asset.key(),
        ctx.accounts.owner.key()
    );

    Ok(())
}
