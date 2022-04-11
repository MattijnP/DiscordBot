import {ICommand} from "./ICommand";
import {SlashCommandBuilder} from "@discordjs/builders";
import {logCrit} from "../services/Crits";
import {updateTrackedScoreboard} from "../services/Scoreboard";


async function execute(interaction: any) {
    const options = interaction.options;
    
    let target = options.getMember('user', false);
    
    if (!target){
        target = interaction.member;
    }
    
    const guild = interaction.guild.id;
    const id = target.id;
    const name = target.displayName;
    
    await logCrit(guild, id, new Date(), true);
    
    const board = await updateTrackedScoreboard(interaction);
    const seeBoard = `See the [updated scoreboard](<${board.url}>).`;

    console.log(`${name} with id ${id} on ${guild} has a crit!`);
    await interaction.reply(`👍 Logged ${target}'s crit.\n${seeBoard}`);
}

export const CritCommand: ICommand = {
    data: new SlashCommandBuilder()
        .setName("crit")
        .setDescription("Log a crit")
        .addUserOption(options => options
            .setName("user")
            .setDescription("Who achieved the crit? Default is you")
            .setRequired(false)),
    execute
};