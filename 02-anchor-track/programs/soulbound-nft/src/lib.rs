#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

pub mod instructions;
pub use instructions::*;

declare_id!("6Hp7bPRTNC8QQZR7h13YKaKwQiR86EbAY8VrJA3GkDWm");

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
