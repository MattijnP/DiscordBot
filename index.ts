import DiscordJS, {Collection, CommandInteraction, Intents, Interaction} from 'discord.js';
import dotenv from 'dotenv';
import {allCommands} from "./commands";
import {FriendlyFire} from "./services/FriendlyFire";
import {Crit} from "./services/Crits";
import {TrackedMessage} from "./services/MessageTracker";

dotenv.config();

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
});

const commands = new Collection<string, any>();

for (const command of allCommands){
    commands.set(command.data.name, command);
}

client.on('ready', () => {
    console.log('Bot is ready');
    
    FriendlyFire.sync();
    Crit.sync();
    TrackedMessage.sync();
});

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()){
        return;
    }
    
    const command = commands.get(interaction.commandName);
    
    try {
        await command.execute(interaction as CommandInteraction);
    } catch (e) {
        console.error(e);
        // @ts-ignore
        interaction.reply({content: '❌ There was an error executing this command!', ephemeral: true});
    }
    
    console.log(`${interaction.user.username} executed /${interaction.commandName}`);
});

client.login(process.env.TOKEN);