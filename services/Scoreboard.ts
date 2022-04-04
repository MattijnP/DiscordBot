// @ts-ignore
import AsciiTable from "ascii-table";
import {critCounterLeaderboard} from "./Crits";
import {friendlyFireLeaderboard} from "./FriendlyFire";
import {codeBlock} from "@discordjs/builders";
import {Guild} from "discord.js";
import {STATS, updateTrackedMessage} from "./MessageTracker";

export async function getScoreboards(guild: Guild) {
    const critCounter = await critCounterLeaderboard(guild.id);
    const critCounterTable = new AsciiTable('Crit Counter');

    critCounterTable.setHeading('#', 'Player', 'Crits', 'Critfails');

    if (critCounter.length === 0){
        critCounterTable.addRow('','No crits yet.','','');
    }
    
    for (const row of critCounter) {
        const {rank, crit, critfail, user} = row;

        const member = guild.members.cache.get(user);
        const name = member ? member.displayName : '<deleted member>';
        critCounterTable.addRow(rank, name, crit, critfail);
    }

    const friendlyFire = await friendlyFireLeaderboard(guild.id);
    const friendlyFireTable = new AsciiTable('Friendly Fire');

    friendlyFireTable
        .setHeading('#', 'Player', 'Dealt', 'no.', 'Taken', 'no.')
        .setAlign(3, AsciiTable.RIGHT)
        .setAlign(5, AsciiTable.RIGHT);
    
    if (friendlyFire.length === 0){
        friendlyFireTable.addRow('','No accidents yet.','','','','');
    }

    for (const row of friendlyFire) {
        const {rank, user, dealtSum, dealtCount, takenSum, takenCount} = row;

        const member = guild.members.cache.get(user);
        const name = member ? member.displayName : '<deleted member>';
        friendlyFireTable.addRow(rank, name, dealtSum, dealtCount + 'x', takenSum, takenCount + 'x');
    }

    return codeBlock(
        critCounterTable.toString() + '\n' + friendlyFireTable.toString()
    );
}

export async function updateTrackedScoreboard(interaction: any) {
    const board = await getScoreboards(interaction.guild);

    return await updateTrackedMessage(interaction.guild.id, STATS, board, interaction);
}