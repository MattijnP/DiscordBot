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

export async function countDamageDealt(guild: string) {
    const result = await FriendlyFire.findAll({
        attributes: [
            'aggressor',
            [sequelize.fn('SUM',sequelize.col('damage')), 'sum'],
            [sequelize.fn('COUNT',sequelize.col('id')), 'count']
        ],
        group: 'aggressor',
        where: { guild }
    });
    
    return result.map((r: any) => r.dataValues);
}

export async function countDamageTaken(guild: string) {
    const result = await FriendlyFire.findAll({
        attributes: [
            'victim',
            [sequelize.fn('SUM',sequelize.col('damage')), 'sum'],
            [sequelize.fn('COUNT',sequelize.col('id')), 'count']
        ],
        group: 'victim',
        where: { guild }
    });
    
    return result.map((r: any) => r.dataValues);
}

export async function friendlyFireLeaderboard(guild: string) {
    
    const dealt = await countDamageDealt(guild);
    const taken = await countDamageTaken(guild);

    type Row = {user:string, rank:number, 
        takenSum: number, takenCount: number, 
        dealtSum: number, dealtCount: number,};
    const board: Row[] = [];

    for (const dmg of dealt){
        board.push({
            user: dmg.aggressor,
            rank: 0,
            dealtSum: dmg.sum,
            dealtCount: dmg.count,
            takenSum: 0,
            takenCount: 0,
        });
    }

    for (const dmg of taken){
        const record = board.find(r => r.user === dmg.victim);
        if (record){
            record.takenSum = dmg.sum;
            record.takenCount = dmg.count;
        } else {
            board.push({
                user: dmg.victim,
                rank: 0,
                dealtSum: 0,
                dealtCount: 0,
                takenSum: dmg.sum,
                takenCount: dmg.count,
            })
        }
    }

    board.sort((a,b) => a.takenSum - b.takenSum); // first sort by damage taken ascending
    board.sort((a,b) => b.dealtSum - a.dealtSum); // second sort by dealt descending

    let prev: Row|null = null;
    for (const [i, row] of board.entries()){
        let rank = i + 1;

        if (prev && row.takenSum === prev.takenSum && row.dealtSum === prev.dealtSum){
            rank = prev.rank;
        }

        row.rank = rank;
        prev = row;
    }

    return board;
}