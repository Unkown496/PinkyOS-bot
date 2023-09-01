const replyCheck = async (interaction, exeption) => {
    if (interaction.replied || interaction.deferred) {
        return await interaction.followUp(exeption);
    }
    else await interaction.reply(exeption);
};

export const commandExucuteExeption = async interaction => {
    const cmdExeptionData = {
        content: 'К сожалению комманда не сработала, обратитесь к тому кто все это делал!',
        ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
        return await interaction.followUp(cmdExeptionData);
    }
    else return await interaction.reply(cmdExeptionData);
};

export const commandNotFoundExeption = async interaction => {
    const cmdExeptionData = {
        content: 'К сожалению комманда не была найдена, ввод то проверь!',
        ephemeral: true
    };

    return await replyCheck(interaction, cmdExeptionData);
};