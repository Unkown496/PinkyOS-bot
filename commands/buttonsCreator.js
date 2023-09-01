import dbButtons from "../database/buttons.js";

import { pickableCommands } from "../helpres/commands.js";

import { 
    SlashCommandBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder, 
    TextInputStyle, 
    ActionRowBuilder,
    SelectMenuOptionBuilder,
} from "discord.js";

const inputButtonName = new TextInputBuilder()
.setCustomId('buttonNameInput')
.setLabel('Введите название кнопки')
.setMinLength(1)
.setPlaceholder('Название написанное на кнопке')
.setStyle(TextInputStyle.Short)
.setRequired(true);

const inputButtonId = new TextInputBuilder()
.setCustomId('buttonCustomId')
.setLabel('Введите id кнопки')
.setMinLength(3)
.setPlaceholder('Id кнопки для discord')
.setStyle(TextInputStyle.Short)
.setRequired(true);

const inputCommandToPick = new TextInputBuilder()
.setCustomId('buttonCommandToPick')
.setLabel('Выбранная команда для привязки, НЕ ТРОГАТЬ!')
.setStyle(TextInputStyle.Short);

const inputButtonValue = new TextInputBuilder()
.setCustomId('buttonValue')
.setMinLength(1)
.setLabel('Значение кнопки')
.setRequired(true)
.setStyle(TextInputStyle.Short);

const selectButtonStyle = new StringSelectMenuBuilder()
.setCustomId('selectButtonStyle')
.setPlaceholder('Выберите стиль кнопки')
.setOptions(
    new StringSelectMenuOptionBuilder()
    .setLabel('Основной')
    .setDescription('Самый обычный')
    .setValue("Primary"),
    new StringSelectMenuOptionBuilder()
    .setLabel('Дополнительный')
    .setDescription('Такой немного обычный но нет!')
    .setValue("Secondary"),
    new StringSelectMenuOptionBuilder()
    .setLabel("Успешно")
    .setDescription("Зеленый цвет")
    .setValue("Success"),
    new StringSelectMenuOptionBuilder()
    .setLabel("Ошибка")
    .setDescription("Цвет ошибки")
    .setValue("Danger")
),
selectButtonPickToCommand = new StringSelectMenuBuilder()
.setCustomId('selectButtonToPickCommand')
.setPlaceholder('Выберите команду для привязки кнопки')

const firstButtonsModalRow = new ActionRowBuilder().addComponents(inputButtonName),
secondButtonsModalRow = new ActionRowBuilder().addComponents(inputButtonId),
thirdButtonsModalRow = new ActionRowBuilder().addComponents(inputButtonValue);

const interactionSelectRow = new ActionRowBuilder().addComponents(selectButtonStyle);

const buttonsCreateModal = new ModalBuilder()
.setCustomId('buttonCreator')
.setTitle('Создание кнопок')
.addComponents(
    firstButtonsModalRow, 
    secondButtonsModalRow,
    thirdButtonsModalRow
);


let _modalRows = [];

const selectExecuters = {
    "selectButtonStyle": async interaction => {
        const buttonStyle = interaction.values[0];

        const pickedInput = new TextInputBuilder()
        .setCustomId('buttonStyle')
        .setLabel('Созданная кнопка, не нужно трогать!')
        .setStyle(TextInputStyle.Short)
        .setValue(buttonStyle)

        const pickedButtonModalRow = new ActionRowBuilder().addComponents(pickedInput);

        _modalRows.push(pickedButtonModalRow);

        selectButtonPickToCommand.addOptions(
            ...(await pickableCommands()).map(command => {
                const { name, description } = command.data;

                return new SelectMenuOptionBuilder()
                .setLabel(name)
                .setDescription(description)
                .setValue(name)
            })
        )
        
        const selectButtonToPickCommandRow = new ActionRowBuilder().addComponents(selectButtonPickToCommand);

        return interaction.reply({
            content: "Теперь выберите комманду",
            components: [selectButtonToPickCommandRow],
        });
    },
    'selectButtonToPickCommand': async interaction => {
        const commandToPick = interaction.values[0];

        inputCommandToPick
        .setValue(commandToPick);
        
        const inputCommandToButtonRow = new ActionRowBuilder().addComponents(inputCommandToPick);

        buttonsCreateModal.addComponents(
            ..._modalRows,
            inputCommandToButtonRow
        );
        
        return await interaction.showModal(buttonsCreateModal);
    }, 
};

export default {
    global: false,
    guild: true,
    select: {
        customId: ["selectButtonStyle", "selectButtonToPickCommand"],
    }, 
    modal: {
        customId: "buttonCreator",
    }, 

    data: new SlashCommandBuilder()
    .setName('create-button')
    .setDescription('For create button for some cmd interaction')
    .setDescriptionLocalizations({
        ru: "Меню создания кнопок, для взаимодействия с некоторыми командами",
    }),
    async execute(interaction) {
        await interaction.reply({
            content: "Выберите стиль кнопки для начала!",
            components: [interactionSelectRow]
        }); 
    },  
    async selectExecute(interaction) {
        return await selectExecuters[interaction.customId](interaction);
    },
    async modalExecute(interaction) {
        const buttonName = interaction.fields.getTextInputValue('buttonNameInput'),
        buttonCustomId = interaction.fields.getTextInputValue('buttonCustomId'),
        buttonStyle = interaction.fields.getTextInputValue('buttonStyle'),
        buttonValue = interaction.fields.getTextInputValue('buttonValue'),
        buttonCommand = interaction.fields.getTextInputValue('buttonCommandToPick'); 

        dbButtons.create({
            custom_id: buttonCustomId,
            label: buttonName,
            style: buttonStyle,
            user_created: interaction.user.id,
            guild_id: interaction.guildId,
            command: buttonCommand,
            value: buttonValue,
        });

        return interaction.reply(`Кнопка успешно создана!`);
    },
};