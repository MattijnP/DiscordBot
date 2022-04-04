import {DataTypes} from "sequelize";
import {sequelize} from "./Database";


export const FriendlyFire = sequelize.define('FriendlyFire', {
    aggressor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    victim: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    guild: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    damage: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});


export async function logFriendlyFire(guild: string, aggressor: string, victim: string, damage: number) {
    await FriendlyFire.create({
        guild,
        aggressor,
        victim,
        damage,
    })
}
