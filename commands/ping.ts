import {SlashCommandBuilder} from "@discordjs/builders";
import {ICommand} from "./ICommand";
import {CommandInteraction, InteractionReplyOptions} from "discord.js";

async function execute(interaction: CommandInteraction) {
    await interaction.reply({
        content: 'Pong!',
        ephemeral: true, 
    } as InteractionReplyOptions);
}

export const PingCommand: ICommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong'),
    execute
};