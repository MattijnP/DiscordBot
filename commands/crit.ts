import {ICommand} from "./ICommand";
import {SlashCommandBuilder} from "@discordjs/builders";
import {logCrit} from "../services/Crits";


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
    
    console.log(`${name} with id ${id} on ${guild} has a crit!`);
    interaction.reply(`Logged ${target}'s crit.`);
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