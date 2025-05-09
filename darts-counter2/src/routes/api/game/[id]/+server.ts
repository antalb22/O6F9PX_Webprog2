import db from '$lib/db/db';
import {json, type RequestHandler} from '@sveltejs/kit';

export const GET: RequestHandler = async ({params}) => {
    const id = params.id;

    const stmt = db.prepare('SELECT * FROM games WHERE id = ?');
    const game = stmt.get(id);

    if (!game) {
        return json({error: 'Game not found'}, {status: 404});
    }

    return new Response(JSON.stringify({success: true, game}), {
        headers: {'Content-Type': 'application/json'},
        status: 200
    });
};
