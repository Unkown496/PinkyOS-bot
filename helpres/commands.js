import { join, sep } from "path";
import fs from "fs";

import { colors } from "./consoleStyles.js";
import { dirnameChangeSeparator } from "../namespaces.js";

const __dirname = dirnameChangeSeparator();



export async function getCommands(commandDir="commands") {
    const commandsPath = join(__dirname, commandDir).split(sep).join("/");
    const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    let commands = [];

    for(const file of commandsFiles) {
        const filePath = `file://${join(commandsPath, file).split(sep).join("/")}`;

        const commandModule = await import(filePath),
        command = commandModule.default;

        if('data' in command && 'execute' in command || command?.force) commands.push(command);
        else colors.warning(`Command in path: ${filePath}, not installed!`);
    }; 

    return commands;
};

export async function pickableCommands(commands=getCommands()) {
    return (await commands).filter(command => !!command?.canPickButtons);
}; 