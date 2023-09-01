import { DataTypes } from "sequelize";

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

Buttons.sync({ force: true });

export default Buttons;