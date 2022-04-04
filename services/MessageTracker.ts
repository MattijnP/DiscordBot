import {sequelize} from "./Database";
import {DataTypes} from "sequelize";

export const STATS = 'STATS';

export const TrackedMessage = sequelize.define('TrackedMessage', {
    guild: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    channel: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    message: DataTypes.STRING,
});

export async function getTrackedMessage(guild: string, type: string): Promise<any> {
    return await TrackedMessage.findOne({
        where: { guild, type }
    })
}

export async function updateTrackedMessage(guild: string, type: string, content: string, interaction: any) {
    const result = await getTrackedMessage(guild, type);
    
    if (!result){
        const message = await interaction.channel.send({
            content: content, 
            fetchReply: true,
        });
        
        await message.pin();

        const record = {
            guild,
            type,
            message: message.id,
            channel: message.channel.id,
        };
        
        await TrackedMessage.create(record);
        
        return message;
    } else {
        try {
            const channel = await interaction.guild.channels.fetch(result.channel);
            const message = await channel.messages.fetch(result.message);

            await message.edit({
                content: content,
            });

            return message;
        } catch (e) {
            const message = await interaction.channel.send({
                content: content,
                fetchReply: true,
            });
            
            await message.pin();

            result.message = message.id;
            result.channel = message.channel.id;
            await result.save();

            return message;
        }
    }
}