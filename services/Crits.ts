import {DataTypes} from "sequelize";
import {sequelize} from "./Database";

export const Crit = sequelize.define('Crit', {
    user: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    guild: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
    },
    positive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
});

export async function logCrit(guild: string, user: string, datetime: Date, positive: boolean) {
    await Crit.create({
        guild,
        user,
        datetime,
        positive,
    })
}

export async function countCrits(guild: string, positive: boolean) {
    const result = await Crit.findAll({
        attributes: [
            'user',
            [sequelize.fn('COUNT', sequelize.col('user')), 'count'],
        ],
        group: 'user',
        where: {positive, guild}
    });

    return result.map((c: any) => ({
        user: c.dataValues.user,
        count: c.dataValues.count,
    }));
}