import {PingCommand} from "./ping";
import {CritCommand} from "./crit";
import {CritFailCommand} from "./critfail";
import {StatsCommand} from "./stats";
import {FriendlyFireCommand} from "./friendlyfire";


export const allCommands = [
    PingCommand,
    CritCommand,
    CritFailCommand,
    StatsCommand,
    FriendlyFireCommand,
];
export * from './ping';

