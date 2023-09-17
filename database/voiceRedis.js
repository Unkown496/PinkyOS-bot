import { genUuid } from "../helpres/uuid.js";
import { client } from "./indexRedis.js";

const createVoicePrefix = "createVoice_";

export const createNewVoice = async (voiceName, voiceOwnerId, voiceMembers) => {
    let createdVoiceData = {
        owner: voiceOwnerId,
        members: voiceMembers,
        name: voiceName,
        createdVoiceId: genUuid(),
    };

    return await client.set(`${createVoicePrefix}${createdVoiceData.createdVoiceId}`, JSON.stringify(createdVoiceData));
};

export const getCurrentCreateVoice = async (voiceId) => {
    return await client.hGetAll(`${createVoicePrefix}${voiceId}`);
};

// export const getAllCreateVoices = async (voiceName) => {
//     return await clien
// };