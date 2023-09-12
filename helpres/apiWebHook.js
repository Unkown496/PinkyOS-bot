import axios from "axios";

import dotenv from "dotenv";

dotenv.config();


export const getCreateVoiceWebhook = async () => axios.get(process.env.createChannelWebhook);