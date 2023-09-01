import { DataTypes } from "sequelize";

import { BuilderCreatedButton } from "../helpres/btns.js";

import { ButtonBuilder, ButtonStyle } from "discord.js";

import sequelize from "./index.js";

const Buttons = sequelize.define("button", {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true,
    },
    user_created: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
    guild_id: {
        type: DataTypes.STRING,
    },
    custom_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    label: {
        type: DataTypes.STRING(2000), 
        allowNull: false,
    },
    style: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    command: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, 
{
    timestamps: true,

});

Buttons.sync({ force: false });

export const getButtonToCommand = async (commandButton, guildId, buttonsDB=Buttons, { nextButton, previousButton } = {}) => {
    let buttons = [];

    const { rows } = await buttonsDB.findAndCountAll({
        where: {
            command: commandButton, 
            guild_id: guildId,
        },
        limit: 10,
    });

    rows.forEach(button => {
        buttons.push(
            new BuilderCreatedButton()
            .setValue(button.custom_id, button.value, button.command)
            .setLabel(button.label)
            .setStyle(ButtonStyle[button.style])
        );
    });

    return buttons;
};

export default Buttons;