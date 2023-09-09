import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRow, blockQuote, inlineCode, bold, codeBlock, quote } from "discord.js";

import { getCsGoItems } from "../helpres/apiSteam.js";
import { redText, cyanText, greenText } from "../helpres/text.js";

export default {
    global: true, 
    guild: true,

    data: new SlashCommandBuilder()
    .setName('cs-item')
    .setDescription('Получить предмет из кс го, по названию')
    .addStringOption(option => 
        option
        .setName('skin-name')
        .setDescription('Название запрашиваемого скина')
        .setRequired(true)
    ),
    async execute(interaction) {
        const skinName = interaction.options.getString('skin-name');

        try {
            const { data, status } = await getCsGoItems(1, 10, skinName);

            if(status !== 200 || !data.success) return;

            const { results } = data;

            let itemsReply = [];

            if(results.length === 0) return interaction.reply({
                content: cyanText('Ничего не найдено!'),
                ephemeral: true,
            })

            itemsReply = results.map(item => {
                return String(
                    String(bold("Название: ") + inlineCode(item.name)) 
                    + "\n" +
                    String(bold("Цена: ") + inlineCode(item.sell_price_text))
                    + "\n"
                );
            });
            

            return interaction.reply({
                content: blockQuote(itemsReply.join("\n")),
            });
        }
        catch(err) {
            console.log(err);

            return interaction.reply({
                content: redText("Извините произошла ошибка, попробуйте позже!"),
                ephemeral: true,
            });
        };
    },  
};