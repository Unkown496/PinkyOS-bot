import { SlashCommandBuilder, BaseInteraction } from "discord.js";

import { LocalEvents } from "../helpres/events.js";

import { EventEmitter } from 'node:events';

const ChooseCommandEmiter = new EventEmitter();

const executeMessageReact = async (interaction, guild) => {
    let currentRole;

    const getReactionGameName = interaction.emoji.name.split('game_')[1];

    const curretGuildReact = guild.get(interaction.message.guildId);

    curretGuildReact.roles.cache.each(roleInGuild => {
        if(roleInGuild.name.toLowerCase() === getReactionGameName.toLowerCase()) {
            currentRole = roleInGuild;
        };
    });

    interaction.users.cache.each(async (userReact) => {
        if(!userReact.bot) {
            curretGuildReact.members.addRole({
                user: userReact,
                role: currentRole,
            });


            ChooseCommandEmiter.emit('EndGiveRole');
        };
    });
};

export default {
    global: false, 
    guild: true,

    data: new SlashCommandBuilder()
    .setName('choose-game')
    .setDescription('Выбрать игру, в которую вы будете играть на сервере!'),
    async execute(interaction, client) {
        const gameEmojis = client.emojis.cache.filter(emoji => emoji.name.match("game"));

        const gameMessage = await interaction.reply({
            content: `Выберите игру`,
            fetchReply: true,
        });

        try {
            for(let [emojiKey, emojiVal] of gameEmojis) {
                await gameMessage.react(`blobreach:${emojiKey}`);
            };

            LocalEvents.MessageReactAdd.on(executeMessageReact);

            ChooseCommandEmiter.on('EndGiveRole', async () => {
                await gameMessage.reactions.removeAll();
                await gameMessage.edit({
                    content: `Игра успешно выбрана <@${interaction.user.id}>`,
                    ephemeral: true,
                });
            });
            
        } 
        catch(err) {
            console.log(err);
        };
    },
}; 