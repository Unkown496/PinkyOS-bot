import dbButtons from "../database/buttons.js";

import { 
    ButtonBuilder, 
    ButtonStyle,
} from "discord.js";

export default async function(interaction) {
    const getButtonOfUser = await dbButtons.findAll({
        where: {
            user_created: interaction.user.id,
            guild_id: interaction.guildId,
            command: interaction.commandName,
        },
    });


    let buttonsComponents = [];

    for(let button of getButtonOfUser) {
        buttonsComponents.push(
            new ButtonBuilder()
            .setCustomId(button.custom_id)
            .setLabel(button.label)
            .setStyle(ButtonStyle[button.style])
        );
    };  
    
    return buttonsComponents;
};

