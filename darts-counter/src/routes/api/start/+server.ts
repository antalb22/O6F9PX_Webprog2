import {json, type RequestHandler} from '@sveltejs/kit';
import db from '$lib/db/db';
import dayjs from 'dayjs';

export const POST: RequestHandler = async ({request}) => {
    const {player1, player2, mode, doubleOut} = await request.json();

    if (!player1 || typeof player1 !== 'string') {
        return json({error: 'player1 is required'}, {status: 400});
    }

    const timeRes = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhzsOFik0Dp3rWQ_V8OO5c11lqV9da2VBcKZI4sekJrvEeFmn5yIK6eiRunq6FzxP8X8Ugy4d7XhWMG2OyRtDPedhDPYcWd4cBfplHo3GVmuFnAo5_RBTnR0QUQd2eZwJF245X4nbuG8Lj5ijY4GLXZxoOOfeeEnWTp54PNGKwg_dDtzSD3zhdna6jTsjHc2YS66jGFSc6Gio6vylU2SbW7gwvZdOVX0AAPMd7gF1oEWI-AVDb4nBvpB2ltQsWjzM52ccUK4yZlDVIY4tzjFB_E8sQkevqB6dsreDsW&lib=MwxUjRcLr2qLlnVOLh12wSNkqcO1Ikdrk');
    const timeJson = await timeRes.json();
    const startedAt = dayjs(timeJson.fulldate).format('YYYY-MM-DD HH:mm:ss');

    const stmt = db.prepare(`
        INSERT INTO games (player1, player2, mode, double_out, started_at)
        VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(player1, player2, mode, doubleOut, startedAt);
    return json({success: true})
};
