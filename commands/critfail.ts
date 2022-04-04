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
    
    await logCrit(guild, id, new Date(), false);
    
    console.log(`${name} with id ${id} on ${guild} has a critfail!`);
    interaction.reply(`Logged ${target}'s critfail.`);
}

export const CritFailCommand: ICommand = {
    data: new SlashCommandBuilder()
        .setName("critfail")
        .setDescription("Log a critfail")
        .addUserOption(options => options
            .setName("user")
            .setDescription("Who achieved the critfail? Default is you")
            .setRequired(false)),
    execute
};