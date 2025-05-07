import Database from 'better-sqlite3';

const db = new Database('darts.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS games
    (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        player1    TEXT    NOT NULL,
        player2    TEXT,
        mode       INTEGER NOT NULL,
        double_out INTEGER NOT NULL,
        started_at TEXT    DEFAULT CURRENT_TIMESTAMP,
        finished   INTEGER DEFAULT 0,
        winner     TEXT
    );

    CREATE TABLE IF NOT EXISTS throws
    (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id    INTEGER NOT NULL,
        player_id  INTEGER NOT NULL,
        points     INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_id) REFERENCES games (id)
    );
`);

export default db;
