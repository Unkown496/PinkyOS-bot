import { genUuid } from "../helpres/uuid.js";
import { client } from "./indexRedis.js";

const createVoicePrefix = "createVoice_";

const createVoiceListKey = 'createVoices';

export const createNewVoice = async (voiceName, voiceOwnerId, createdVoiceId) => {
    let createdVoiceData = {
        owner: voiceOwnerId,
        name: voiceName,
        createdVoiceId: createdVoiceId,
    };

    return await client.lPush(createVoiceListKey, JSON.stringify(createdVoiceData));
};

/**
 * 
 * @param {string} voiceListKey 
 * @returns { []{ owner: string, name: string, createdVoiceId: string } }
 */
export const getAllVoices = async (voiceListKey=createVoiceListKey) => {
    return (await client.lRange(voiceListKey, 0, -1)).map(createdVoice => { return JSON.parse(createdVoice) });
};

export const getCurrentCreateVoice = async (voiceId, voiceListKey=createVoiceListKey) => {
    const allVoices = await getAllVoices(voiceListKey),
    findVoiceData = allVoices.map((createdVoice, index) => {
        if(createdVoice.createdVoiceId === voiceId) return { ...createdVoice, index: index }; 
    }).filter(createdVoice => !!createdVoice).find(createdVoice => createdVoice.createdVoiceId === voiceId);

    return findVoiceData;
};

export const getVoicesByUser = async (userId, voiceListKey=createVoiceListKey) => {
    return (await getAllVoices(voiceListKey)).filter(createdVoice => createdVoice.owner === userId);
};
export const getVoiceByUser = async (userId, voiceListKey=createVoiceListKey) => {
    return await getAllVoices(userId, voiceListKey).find(createVoice => createVoice.owner === userId);
};

export const deleteVoice = async (voiceData, voiceListKey=createVoiceListKey) => {
    return await client.lRem(voiceListKey, 0, voiceData);
};

// export const getAllCreateVoices = async (voiceName) => {
//     return await clien
// };