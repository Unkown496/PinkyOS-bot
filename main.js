import { colors } from "./helpres/consoleStyles.js";
import { getCommands } from "./helpres/commands.js";

import { getCreatedButtonData } from "./helpres/btns.js";

import { genUuid } from "./helpres/uuid.js";

import { commandExucuteExeption, commandNotFoundExeption } from "./helpres/exeptions.js";

import { LocalEmmiter, LocalEventsEnum, LocalEvents } from "./helpres/events.js";

import { Client, GatewayIntentBits, Collection, Events, REST, Routes, GuildChannel, GuildMember, GuildMemberManager } from "discord.js";

import { setTimeout } from "timers/promises";

import dotenv from "dotenv";

dotenv.config();

const wait = setTimeout;

const {
    token,
    clientId,
    guildId,
    createCategoryId,
    chatCategoryId,
    createVoiceId,
} = process.env;

const rest = new REST().setToken(token);
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildInvites,
    ],
    
});

client.commands = new Collection();

// Регистрация слеш команд
const slashCommands = await getCommands(),
slashCommandsModal = slashCommands.filter(command => !!command?.modal),
slashCommandsCreatedVoices = slashCommands.filter(command => !!command?.createdVoice),
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

/** @type { []{voiceId: string} } */
let _createdVoices = [];

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

    
        if(!command) {
            await commandNotFoundExeption();
        };
        if(command?.createdVoice) {
            await command.executeVoice(interaction, _createdVoices);

            return;
        };


        try {
            await command.execute(interaction, client);
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

client.on(Events.MessageReactionAdd, async interaction => {
    // console.log(await interaction.users.cache);
    //console.log(client.channels.cache)

    // console.log(client.guilds.cache.get('1129489862924443720').members.addRole({ user:  }));

    // client.guilds.cache.get(guildId).members.addRole({
    //     user
    // });  

    //console.log(await client.guilds.cache.get(guildId).roles.fetch('1142420119654498454'));

    try {
        await LocalEvents.MessageReactAdd.emit(interaction, client.guilds.cache);
    }
    catch(err) {
        console.log(err);

        return;
    };
});

let _createdVoiceId = 0;

client.on(Events.VoiceStateUpdate, async interaction => {
    const createVoice = client.channels.cache.get(createVoiceId);


    if(interaction.channel !== null && _createdVoices.find(voice => voice.voiceId === interaction.channelId)) {
        // Проверка опустела ли личка
        interaction.channel.members.size === 0 ? interaction.channel.delete('Личка опустела!'): null;
    };

    // Пользователей нет в createVoice 
    if(createVoice.members.size <= 0) return;
    else {
        const createVoiceMembersArray = Array.from(createVoice.members)[0];
        const ownerCreateVoice = createVoice.members.get(createVoiceMembersArray[0]).user

        let createdMsg = await createVoice.send(`Подождите <@${ownerCreateVoice.id}> канал создается...`);

        /** @type { GuildChannel } */
        let createdVoiceData = await createVoice.clone(`Личка ${ownerCreateVoice.globalName}`);

        createdVoiceData = await createdVoiceData.edit({
            name: `Личка ${ownerCreateVoice.globalName}`,
            userLimit: createVoice.members.size,
        });

        for(let [key, value] of createVoice.members) {
            createdVoiceData.permissionsFor(value);
        };

        createdMsg = await createdMsg.edit(`<@${ownerCreateVoice.id}> Личка создана, заходите!`);

        _createdVoices.push({ 
            usersMayInVoice: createVoice.members, 
            voiceId: createdVoiceData.id 
        });

        _createdVoiceId = _createdVoiceId++;

        // await createNewVoice(`Личка ${ownerCreateVoice.globalName}`, ownerCreateVoice.id, createVoice.members);
    };


    // const { id: userId } = interaction;

    // const userInVoice = await client.users.fetch(userId);

    // if(userInVoice.bot) return;
});

client.once('ready', async () => {
    console.log(colors.pink(`${client.user.tag} Success Running!`));

    return;
});

client.login(token.toString());