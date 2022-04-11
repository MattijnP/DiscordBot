import {PingCommand} from "./ping";
import {CritCommand} from "./crit";
import {CritFailCommand} from "./critfail";
import {StatsCommand} from "./stats";
import {FriendlyFireCommand} from "./friendlyfire";
import {ICommand} from "./ICommand";

export const allCommands: ICommand[] = [
    PingCommand,
    CritCommand,
    CritFailCommand,
    StatsCommand,
    FriendlyFireCommand,
];
