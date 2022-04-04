import {ICommand} from "./ICommand";
import {SlashCommandBuilder} from "@discordjs/builders";
import {logFriendlyFire} from "../services/FriendlyFire";


async function execute(interaction: any) {
    const options = interaction.options;
    
    const aggressor = options.getMember('bastard', true);
    const victim = options.getMember('victim', true);
    const damage = options.getInteger('damage', true);
    
    const guild = interaction.guild.id;
    
    await logFriendlyFire(guild, aggressor.id, victim.id, damage);
    
    console.log(`${aggressor.displayName} dealt ${damage} damage to ${victim.displayName}.`);
    interaction.reply(`${aggressor} dealt ${damage} damage to ${victim}. You bastard!`);
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
            .setDescription("Who is the victim of the damage")
            .setRequired(true)),
    execute
};