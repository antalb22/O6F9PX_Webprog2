import db from '$lib/db/db';
import type {RequestHandler} from '@sveltejs/kit';
import {json} from '@sveltejs/kit';


export const GET: RequestHandler = async () => {
    const stmt = db.prepare('SELECT id, points, player_id, created_at FROM throws ORDER BY created_at DESC');
    const throws = stmt.all();

    return json(throws);
};

export const POST: RequestHandler = async ({request}) => {

    const {playerId, gameId, points, isWinner = false, playerName} = await request.json();

    const stmt = db.prepare(`
        INSERT INTO throws (player_id, game_id, points)
        VALUES (?, ?, ?)
    `);
    stmt.run(playerId, gameId, points);

    if (isWinner) {
        const update = db.prepare(`
            UPDATE games
            SET finished = 1,
                winner   = ?
            WHERE id = ?
        `);
        update.run(playerName, gameId);
    }

    return json({success: true});
}

export const DELETE: RequestHandler = async ({request}) => {
    const {gameId, playerId} = await request.json();

    const stmt = db.prepare(`
        DELETE
        FROM throws
        WHERE id = (SELECT id
                    FROM throws
                    WHERE game_id = ?
                      AND player_id = ?
                    ORDER BY created_at DESC
                    LIMIT 1)
    `);
    stmt.run(gameId, playerId);

    return json({success: true});
};