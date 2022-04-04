import {SlashCommandBuilder} from "@discordjs/builders";
import {ICommand} from "./ICommand";
import {STATS, updateTrackedMessage} from "../services/MessageTracker";
import {getScoreboards} from "../services/Scoreboard";


async function execute(interaction: any) {

    const content = await getScoreboards(interaction.guild);

    const message = await updateTrackedMessage(interaction.guild.id, STATS, content, interaction);
    
    const replyMessage = `The [pinned message](<${message.url}>) was updated.`;
    
    const reply = await interaction.reply({
        content: replyMessage,
        ephemeral: true,
    });
}

export const StatsCommand: ICommand = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Shows stats'),
    execute
};