import { codeBlock } from "discord.js";


export const h1 = text => `# ${text}`;
export const h2 = text => `## ${text}`;
export const h3 = text => `### ${text}`;

export const h = (size, text) => {
    let title;

    switch (size) {
        case '1':
            title = h1(text);

            break;
        case '2': 
            title = h2(text);

            break;
        case '3':
            title = h3(text);

            break;
        default:
            title = h3(text);
            break;
    }

    return title;
};

export const cyanText = text => codeBlock('fix', text);
/**
 * @description Ставит - в начало текста
 * @param {string} text 
 * @returns { string }
 */
export const redText = text => codeBlock('diff', `- ${text}`);

/**
 * @description Ставит ! в начало текста
 * @param {string} text 
 * @returns { string }
 */
export const greenText = text => codeBlock('diff', `! ${text}`);

export const discordLink = userId => `<@${userId}>`;