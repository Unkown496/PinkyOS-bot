import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRow, blockQuote, inlineCode, bold, codeBlock, quote } from "discord.js";


export default {
    global: false, 
    guild: true,
    createdVoice: true,
    force: true,

    data: new SlashCommandBuilder()
    .setName("voice-edit")
    .setDescription("Манипуляции созданным войсом"),
    async executeVoice(interaction, allCreatedVoices) {
        console.log(interaction, allCreatedVoices);
    },
}