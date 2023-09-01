import { ButtonBuilder, ButtonStyle } from "discord.js";

export const btnOptions = {
    value: "value", 
    id: "customId",
};

/**
 * 
 * @returns {{ customId: string, value: string, command: string }} 
 */
export const getCreatedButtonData = (cretedButtonData) => {
    return JSON.parse(cretedButtonData);
}; 

export class BuilderCreatedButton extends ButtonBuilder {
    constructor(valueSeparator=btnOptions.value, idSeperator=btnOptions.id) {
        super()

        this.valueSeparator = valueSeparator;
        this.idSeperator = idSeperator;
    };

    /**
     * 
     * @param {string} value 
     */
    setValue(customId, value, command) {
        return this.setCustomId(`${JSON.stringify({ customId: customId, value: value, command: command })}`);
    };

};