import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRow, blockQuote, inlineCode, bold, codeBlock, quote } from "discord.js";


export default {
    global: false, 
    guild: true,
    createdVoice: true,
    force: true,

    data: new SlashCommandBuilder()
    .setName("voice-edit")
    .setDescription("Манипуляции созданным войсом"),
    async execute(interaction) {
        const { 
            channelId,
            client,  
        }  = interaction;
        
        if(interaction.channel.type !== 2) return interaction.reply({
            content: inlineCode("Нельзя использовать не в войсе!"), 
            ephemeral: true,
        });

        console.log(interaction.channel);
    },
}