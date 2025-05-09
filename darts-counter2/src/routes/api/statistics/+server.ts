import db from '$lib/db/db';
import {json, type RequestHandler} from '@sveltejs/kit';

type Game = {
    id: number;
    player1: string;
    player2: string | null;
    finished: number;
    winner: string | null;
};

type Throw = {
    game_id: number;
    player_id: number;
    points: number;
};

export const GET: RequestHandler = () => {
    const games = db.prepare(`
        SELECT id, player1, player2, finished, winner
        FROM games
        WHERE finished = 1
    `).all() as Game[];

    const playerMap: Record<string, string> = {};
    for (const game of games) {
        if (game.player1) playerMap[`${game.id}-1`] = game.player1;
        if (game.player2) playerMap[`${game.id}-2`] = game.player2;
    }

    const throws = db.prepare(`
        SELECT game_id, player_id, points
        FROM throws
    `).all() as Throw[];

    const statsMap: Record<
        string,
        { gamesFinished: number; totalPoints: number; throws: number; wins: number }
    > = {};

    for (const t of throws) {
        const key = `${t.game_id}-${t.player_id}`;
        const player = playerMap[key];
        if (!player) continue;

        if (!statsMap[player]) {
            statsMap[player] = {gamesFinished: 0, totalPoints: 0, throws: 0, wins: 0};
        }

        statsMap[player].totalPoints += t.points;
        statsMap[player].throws += 1;
    }

    for (const player of Object.keys(statsMap)) {
        const playerGames = games.filter(
            g => (g.player1 === player || g.player2 === player)
        );
        statsMap[player].gamesFinished = playerGames.length;

        statsMap[player].wins = playerGames.filter(g => g.winner === player).length;
    }

    const stats = Object.entries(statsMap).map(([player, {gamesFinished, totalPoints, throws, wins}]) => ({
        player,
        gamesFinished,
        wins,
        averageScore: throws > 0 ? (totalPoints / throws) * 3 : 0
    }));

    return json(stats);
}
