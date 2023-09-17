// import { loggerRedis } from "../helpres/logger.js";

import { createClient } from "redis";   

const client = createClient();

// client.on('error', err => loggerRedis.error(err));

await client.connect();

export { client };