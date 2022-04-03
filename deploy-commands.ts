import {REST} from "@discordjs/rest";

import dotenv from 'dotenv';
import {Routes} from "discord-api-types/v9";

dotenv.config();
const {token, guildId, clientId} = process.env;

const commands: any[] = [];

const rest = new REST({version: '9'}).setToken(token!);

// @ts-ignore
rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands})
    .then(() => console.log('Successfully registered application commands'))
    .catch(console.error);