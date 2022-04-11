import {ICommand} from "./ICommand";
import {SlashCommandBuilder} from "@discordjs/builders";
import {logFriendlyFire} from "../services/FriendlyFire";
import {updateTrackedScoreboard} from "../services/Scoreboard";

const remarks = [
    "Way to go.",
    "Please no bickering.",
    "You bastard.",
    "Was it a fireball again?",
    "Thats fine i guess.",
    "Will you let that stand?",
    "You know what this means... a duel to the death!",
    "Again...",
    "👀",
];

async function execute(interaction: any) {
    const options = interaction.options;
    
    const aggressor = options.getMember('bastard', true);
    const victim = options.getMember('victim', true);
    const damage = options.getInteger('damage', true);
    
    const guild = interaction.guild.id;
    
    await logFriendlyFire(guild, aggressor.id, victim.id, damage);
    
    const board = await updateTrackedScoreboard(interaction);
    const seeBoard = `See the [updated scoreboard](<${board.url}>).`;
    
    const selfHarm = aggressor.id === victim.id;
    
    const remark = remarks[Math.floor(Math.random() * remarks.length)];
    const message = selfHarm ? `${aggressor} hurt themself in confusion for ${damage} damage?! ${remark}`
                             : `${aggressor} dealt ${damage} damage to ${victim}. ${remark}`;
    
    console.log(`${aggressor.displayName} dealt ${damage} damage to ${victim.displayName}.`);
    await interaction.reply(message + '\n' + seeBoard);
}

export const FriendlyFireCommand: ICommand = {
    data: new SlashCommandBuilder()
        .setName("friendlyfire")
        .setDescription("Log some friendly fire")
        .addIntegerOption(options => options
            .setName("damage")
            .setDescription("The amount of damage")
            .setMinValue(1)
            .setRequired(true))
        .addUserOption(options => options
            .setName("bastard")
            .setDescription("Who inflicted the damage?")
            .setRequired(true))
        .addUserOption(options => options
            .setName("victim")
            .setDescription("Who is the victim of the damage?")
            .setRequired(true)),
    execute
};