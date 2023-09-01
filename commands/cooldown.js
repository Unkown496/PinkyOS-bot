import { emoji } from "../helpres/emoji.js";

import { SlashCommandBuilder, inlineCode, userMention, ActionRowBuilder } from "discord.js";

import { setTimeout } from "timers/promises";

import { getButtonToCommand } from "../database/buttons.js";

import { getCreatedButtonData } from "../helpres/btns.js";

const wait = setTimeout;

export default {
    global: false,
    guild: true,
    canPickButtons: true,

    pickedButtons: "cooldown",

    data: new SlashCommandBuilder()
    .setName('cooldown')
    .setDescription('Тегает после прохождения таймера'),
    async execute(interaction) {
        const gettedButtons = await getButtonToCommand('cooldown', interaction.guildId);
    
        if(gettedButtons.length > 0) {
            await interaction.reply({
                content: inlineCode(`Выберите значание таймера!`),
                components: [new ActionRowBuilder().addComponents(...gettedButtons)],
            });

        }
        else {
            await interaction.reply({
                content: inlineCode(`Нет кнопок для взаимодействия с таймером, сначала создайте их`),
                ephemeral: true,
            });
        };

        return;
    },
    async executePickedBtns(interaction) {
        const pickedBtnData = getCreatedButtonData(interaction.customId);
        
        await interaction.reply({
            content: inlineCode(`Таймер запущен!`),
            ephemeral: true,
        });

        await wait((pickedBtnData.value) * 1000);
        
        userMention(interaction.user.id); 

        await interaction.editReply(`Таймер закончился, <@${interaction.user.id}> просыпаемся!`);

        return;
    },
};