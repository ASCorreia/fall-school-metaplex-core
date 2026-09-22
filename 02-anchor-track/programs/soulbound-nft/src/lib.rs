#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

pub mod instructions;
pub use instructions::*;

declare_id!("4mTX1VfA7DmE7Uyqoh2Sft5dPiaQCuNC6NXLYDHXyYmo");

#[program]
pub mod soulbound_nft {
    use super::*;

    pub fn mint_soulbound_nft(
        ctx: Context<MintSoulboundNft>,
        name: String,
        uri: String,
    ) -> Result<()> {
        instructions::mint_soulbound_nft::handler(ctx, name, uri)
    }
}
