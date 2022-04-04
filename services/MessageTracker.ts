import {sequelize} from "./Database";
import {DataTypes} from "sequelize";

export const CRITCOUNTER_MESSAGE = 'CRITCOUNTER';

export const TrackedMessage = sequelize.define('TrackedMessage', {
    guild: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    channel: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    message: DataTypes.STRING,
});

export async function getTrackedMessage(guild: string, type: string) {
    return TrackedMessage.findOne({
        where: { guild, type }
    })
}

export async function updateTrackedMessage(guild: string, type: string, content: string, interaction: any) {
    const result = await getTrackedMessage(guild, type);
    
    if (!result){
        
    } 
}