import dbButtons from "../database/buttons.js";

import { genUuid } from "../helpres/uuid.js";

import {
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ButtonBuilder, 
    ButtonStyle
} from "discord.js";



const selectComponentCommandButtonPick = new StringSelectMenuBuilder()
.setCustomId('selectPickableBtns')
.setPlaceholder('Выберите комманду для привзяки кнопки');



export default {
    global: false,
    guild: true,
    select: {
        customIds: ["selectPickableBtns"]
    },

    data: new SlashCommandBuilder()
    .setName('pick-button')
    .setDescription('Выбрать кнопку для команды'),
    async execute(interaction) {
        const allButtons = await dbButtons.findAll(),
        selectButtonToPickItems = allButtons.map(btn => {
            return new ButtonBuilder()
            .setCustomId(btn.custom_id)
            .setLabel(btn.label)
            .setStyle(ButtonStyle[btn.style]); 
        });

        const selectButtonToPick = new StringSelectMenuBuilder()
        .setCustomId('selectReadyButton')
        .setPlaceholder('Выберите созданную кнопку которую вы хотите добавить')
        .setOptions(...selectButtonToPickItems),
        selectButtonToPickRow = new ActionRowBuilder().addComponents(selectButtonToPick);

        /**
         * @type { any[] }
         */
        const pickableCommands = interaction.client.commands.filter(command => !!command?.canPickButtons),
        selectCommandButtonPick = pickableCommands.map(command => { 
            return {
                label: command.data.name,
                value: command.data.name,
                descriptions: command.data.description,
            }
        });

        const generatedSelectItems = [];
        
        selectCommandButtonPick.forEach(selectCommand => {
            const generatedItem = new StringSelectMenuOptionBuilder()
            .setLabel(selectCommand.label)
            .setValue(selectCommand.value)
            .setDescription(selectCommand.descriptions)

            generatedSelectItems.push(generatedItem);
        });

        selectComponentCommandButtonPick.addOptions(...generatedSelectItems);

        const selectButtonPickRow = new ActionRowBuilder()
        .addComponents(selectComponentCommandButtonPick);


        return interaction.reply({
            content: "Выберите команду",
            components: [selectButtonPickRow, selectButtonToPickRow]
        })
    },  
    async selectExecute(interaction) {
        const commandName = interaction.values[0];

        const pickCommand = interaction.client.commands
        .filter(command => !!command?.canPickButtons)
        .find(pickableCommand => pickableCommand.data.name === commandName);
    }
}