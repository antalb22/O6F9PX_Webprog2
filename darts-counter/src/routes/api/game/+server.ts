import db from '$lib/db/db';
import {json, type RequestHandler} from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    const stmt = db.prepare('SELECT * FROM games ORDER BY id DESC');
    const games = stmt.all();

    return json(games)
};
