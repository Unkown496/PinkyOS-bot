import log4js from "log4js";

log4js.configure({
    appenders: {
        bot: {
            type: 'file',
            filename: 'botLog.log'
        },
        redis: {
            type: 'file',
            filename: 'redisLog.log'
        },
    },
    categories: {
        bot: {
            appenders: ['bot'], 
            level: "error",
        },
        redis: {
            appenders: ['redis'],
            level: "error"
        },
    },
});

const loggerBot = log4js.getLogger("bot"),
loggerRedis = log4js.getLogger('redis');

export { loggerBot, loggerRedis }; 

