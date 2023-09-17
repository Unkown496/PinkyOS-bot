import { EventEmitter } from 'node:events';

export const LocalEmmiter = new EventEmitter();


export const LocalEventsEnum = {
    MessageReactAdd: 'MessageReactAdd',
    
};
export const LocalEvents = {
    MessageReactAdd: {
        emit: (interaction, guild) => {
            return LocalEmmiter.emit(LocalEventsEnum.MessageReactAdd, interaction, guild);
        },
        on: execute => {
            return LocalEmmiter.on(LocalEventsEnum.MessageReactAdd, (interaction, guild) => execute(interaction, guild));
        },
    },
}; 