import type {RequestHandler} from '@sveltejs/kit';
import db from '$lib/db/db';
import dayjs from 'dayjs';

export const POST: RequestHandler = async ({request}) => {
    const body = await request.json();

    const player1 = body.player1;
    const player2 = body.player2 ?? null;
    const mode = body.mode ?? 501;
    const doubleOut = body.doubleOut ?? true;

    if (!player1 || typeof player1 !== 'string') {
        return new Response(JSON.stringify({success: false, error: 'player1 is required'}), {
            status: 400
        });
    }

    const timeRes = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhzsOFik0Dp3rWQ_V8OO5c11lqV9da2VBcKZI4sekJrvEeFmn5yIK6eiRunq6FzxP8X8Ugy4d7XhWMG2OyRtDPedhDPYcWd4cBfplHo3GVmuFnAo5_RBTnR0QUQd2eZwJF245X4nbuG8Lj5ijY4GLXZxoOOfeeEnWTp54PNGKwg_dDtzSD3zhdna6jTsjHc2YS66jGFSc6Gio6vylU2SbW7gwvZdOVX0AAPMd7gF1oEWI-AVDb4nBvpB2ltQsWjzM52ccUK4yZlDVIY4tzjFB_E8sQkevqB6dsreDsW&lib=MwxUjRcLr2qLlnVOLh12wSNkqcO1Ikdrk');
    const timeJson = await timeRes.json();

    const startedAt = dayjs(timeJson.fulldate).format('YYYY-MM-DD HH:mm:ss');

    const stmt = db.prepare(`
        INSERT INTO games (player1, player2, mode, double_out, started_at)
        VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(player1, player2, mode, doubleOut ? 1 : 0, startedAt);

    return new Response(JSON.stringify({
        success: true,
        id: info.lastInsertRowid
    }), {
        headers: {'Content-Type': 'application/json'},
        status: 200
    });
};
