import { colors } from "./helpres/consoleStyles.js";
import { getCommands } from "./helpres/commands.js";

import { getCreatedButtonData } from "./helpres/btns.js";

import { commandExucuteExeption, commandNotFoundExeption } from "./helpres/exeptions.js";

import { Client, GatewayIntentBits, Collection, Events, REST, Routes, bold } from "discord.js";

import dotenv from "dotenv";

dotenv.config();


const {
    token,
    clientId,
    guildId,
} = process.env;

const rest = new REST().setToken(token);
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    
});

client.commands = new Collection();

// Регистрация слеш команд
const slashCommands = await getCommands(),
slashCommandsModal = slashCommands.filter(command => !!command?.modal),
slashCommandsSelect = slashCommands.filter(command => !!command?.select), 
slashCommandPickBtns = slashCommands.filter(command => !!command?.canPickButtons),
slashCommandsRestGlobal = slashCommands.filter(command => !!command.global).map(command => { return command.data.toJSON()}),
slashCommandsRestGuilds = slashCommands.filter(command => !!command?.guild).map(command => { return command.data.toJSON() }); 

slashCommands.forEach(command => client.commands.set(command.data.name, command));

client.commands.set(slashCommands);

const getSlashModalCommands = (customId) => {
    return slashCommandsModal.find(command => command.modal.customId === customId);
},
getSlashSelectCommands = customId => {
    return slashCommandsSelect.find(command => !!command.select.customId.includes(customId));
},
getSlashPickBtnsCommands = commandName => {
    return slashCommandPickBtns.find(command => command.pickedButtons === commandName);
};

// Передача на апи дискорда
(async () => {
    try {
        console.log(`Started refreshing ${[...slashCommandsRestGlobal, ...slashCommandsRestGuilds].length} application (/) commands.`);
        console.log(`Global commands: ${slashCommandsRestGlobal.length}`);
        console.log(`Guild commands: ${slashCommandsRestGuilds.length}`);

        const dataGlobal = await rest.put(
            Routes.applicationCommands(clientId), 
            {
                body: slashCommandsRestGlobal,
            }
        ),
        dataGuild = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId), 
            {
                body: slashCommandsRestGuilds,
            }
        );

        colors.success('commands successful refsreshing!');
    }
    catch(err) {
        console.error(err);
    };
})();


client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if(!command) {
            await commandNotFoundExeption();
        };


        try {
            await command.execute(interaction);
        }
        catch(err) {
            console.log(err);
            await commandExucuteExeption();
        };
    }
    else if(interaction.isModalSubmit()) {
        const command = getSlashModalCommands(interaction.customId);

        try {
           await command.modalExecute(interaction);
        }
        catch(err) {
            console.log(err);
        };
    }
    else if(interaction.isAnySelectMenu()) {
        const command = getSlashSelectCommands(interaction.customId);

        try {
            await command.selectExecute(interaction);
        }
        catch(err) {
            console.log(err);
        };
    }
    else if(interaction.isButton()) {
        const hasCreatedButton = getSlashPickBtnsCommands(getCreatedButtonData(interaction.customId).command);


        try {
            await hasCreatedButton.executePickedBtns(interaction);
        }
        catch(err) {
            console.log(err);
        };
    };
});

client.once('ready', async () => {
    console.log(colors.pink(`${client.user.tag} Success Running!`));

    return;
});

client.login(token.toString());