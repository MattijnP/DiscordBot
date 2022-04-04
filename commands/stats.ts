import {codeBlock, SlashCommandBuilder} from "@discordjs/builders";
import {ICommand} from "./ICommand";
import {Collection} from "discord.js";
import {countCrits} from "../services/Crits";
// @ts-ignore
import AsciiTable from "ascii-table";

async function execute(interaction: any) {
    
    const crits = await countCrits(interaction.guild.id, true);
    const critFails = await countCrits(interaction.guild.id, false);
    const allCrits = new Collection<string, {crit: number, critfail: number}>();
    
    for (const crit of crits){
        allCrits.set(crit.user, {
            crit: crit.count,
            critfail: 0,
        });
    }

    for (const critfail of critFails){
        if (allCrits.has(critfail.user)){
            allCrits.get(critfail.user)!.critfail = critfail.count;
        } else {
            allCrits.set(critfail.user, {
                critfail: critfail.count,
                crit: 0,
            });
        }
    }
    
    
    const table = new AsciiTable('Crit Counter');
    
    table.setHeading('Player','Crits','Critfails');
    
    for (const row of allCrits){
        
        const userId = row[0];
        const {crit, critfail} = row[1];
        

        const user = interaction.guild.members.cache.get(userId);
        const name = user.displayName;
        table.addRow(name, crit, critfail);
    } 
    
    console.log(table.toString());
    
    const reply = await interaction.reply({
        content: codeBlock(table.toString()),
        fetchReply: true, 
    });
    
    await reply.pin();
}

export const StatsCommand: ICommand = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Shows stats'),
    execute
};