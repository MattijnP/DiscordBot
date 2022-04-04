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

export async function critCounterLeaderboard(guild: string) {
    const crits = await countCrits(guild, true);
    const critFails = await countCrits(guild, false);

    type Row = {user:string, crit: number, critfail: number, rank:number};
    const board: Row[] = [];

    for (const crit of crits){
        board.push({
            user: crit.user,
            crit: crit.count,
            critfail: 0,
            rank: 0,
        });
    }

    for (const critfail of critFails){
        const record = board.find(r => r.user === critfail.user);
        if (record){
            record.critfail = critfail.count;
        } else {
            board.push({
                user: critfail.user,
                crit: 0,
                critfail: critfail.count,
                rank: 0,
            })
        }
    }

    board.sort((a,b) => a.critfail - b.critfail); // first sort by critfail ascending
    board.sort((a,b) => b.crit - a.crit); // second sort by crit descending

    let prev: Row|null = null;
    for (const [i, row] of board.entries()){
        let rank = i + 1;

        if (prev && row.crit === prev.crit && row.critfail === prev.critfail){
            rank = prev.rank;
        }

        row.rank = rank;
        prev = row;
    }
    
    return board;
}