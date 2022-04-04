import {REST} from "@discordjs/rest";

import dotenv from 'dotenv';
import {Routes} from "discord-api-types/v9";
import {allCommands} from "./commands";

dotenv.config();
const {TOKEN: token, GUILDID: guildId, CLIENTID: clientId} = process.env;

const commands = allCommands.map(c => c.data.toJSON());

const rest = new REST({version: '9'}).setToken(token!);

// @ts-ignore
rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands})
    .then(() => console.log('Successfully registered application commands'))
    .catch(console.error);