import { emoji } from "../helpres/emoji.js";

import { SlashCommandBuilder, inlineCode, userMention, ButtonBuilder, ButtonStyle } from "discord.js";

import { setTimeout } from "timers/promises";

import getPickButtons from "../helpres/getPickButtons.js";

const wait = setTimeout;

let _timeId = 1;

export default {
    global: false,
    guild: true,
    canPickButtons: true,

    data: new SlashCommandBuilder()
    .setName('cooldown')
    .setDescription('Тегает после прохождения таймера'),
    async execute(interaction) {
        const cooldownPickedButtons = await getPickButtons(interaction);

        if(cooldownPickedButtons.length !== 0) {

            return;
        };


        const time = interaction.options.getInteger('time');

        await interaction.reply(inlineCode(`Таймер ${_timeId} на ${time}с, запущен!`));
        
        await wait(time);

        await interaction.editReply(inlineCode(`Таймер ${_timeId} закончился, ${interaction.user.globalName} просыпайтесь!`));

        userMention(interaction.user.id);

        return  _timeId = _timeId+1;
    },
};