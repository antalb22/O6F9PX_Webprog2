# Dart Counter
## Az alkalmazás célja
Ez az alkalmazás a Webprogramozás II. tárgy keretében készült, lehetővé teszi darts játékok kezelését és azoknak megtekintését illetve játékosok statisztikáinak nyomon követését.

### Tulajdonságok:
-  Projekt nyelve: A projekt SvleteKit segítségével íródott
-  Adatbázis: Az adatbázis egyszerűsége miatt sqlite- ot használtam
-  Dátumkezelés: Dátumkezelésre dayjs- t használtam

## Routes
- `/`: A főoldal, ahonnan elindítható egy új játék.
- `/game/[id]`: A kiválasztott játék folyamatának megjelenítése. A játék során az aktuális dobások rögzítése történik.
- `/history`: Megjeleníti a korábbi játékokat.
- `/statistics`: A felhasználók lejátszott játékainak statisztikáit mutatja.

## API
- `/API/game`
  - GET: Az összes játék listázása időrendben.
- `/API/game/[id]`
  - GET: Egy konkrét játék részletes adatainak (szabályainak) lekérdezése id alapján.
- `/api/start`
  - POST: Új játék indítása egy vagy két játékossal. 
- `/api/statistics`
  - GET: Kiszámítja a felhasználók statisztikáit
- `/api/throws`
  - GET: Visszaadja az összes dobást az adatbázisból, időrendben csökkenő sorrendben.
  - POST: Új dobást rögzít egy játékoshoz egy adott játékban. Ha a isWinner értéke igaz, akkor a játékot befejezettnek jelöli, és elmenti a győztest is.
  - GET: Törli egy adott játékos utolsó dobását egy adott játékból ("undo" esetén).
- Külső API:
  - A játék indításakor az aktuális pontos dátum és idő lekérdezésére szolgál.

 ## Adatbázis

 ### Games Tábla
| Oszlopnév    | Típus   | Leírás                                                            |
| ------------ | ------- | ----------------------------------------------------------------- |
| `id`         | INTEGER | Egyedi azonosító, automatikusan növekvő, elsődleges kulcs         |
| `player1`    | TEXT    | Az első játékos neve, nem lehet üres                              |
| `player2`    | TEXT    | A második játékos neve (lehet null)                               |
| `mode`       | INTEGER | A játék típusa (pl. 301, 501)                                     |
| `double_out` | INTEGER | Logikai érték (0/1), jelzi, hogy duplával kell-e kiszállni        |
| `started_at` | TEXT    | A játék kezdési időpontja, alapértelmezés szerint az aktuális idő |
| `finished`   | INTEGER | Logikai érték (0/1), jelzi, hogy befejeződött-e a játék           |
| `winner`     | TEXT    | A győztes játékos neve (ha van)                                   |

### Throws Tábla

| Oszlopnév       | Típus   | Leírás                                                       |
| --------------- | ------- | ------------------------------------------------------------ |
| `id`            | INTEGER | Egyedi azonosító, automatikusan növekvő, elsődleges kulcs    |
| `game_id`       | INTEGER | A játék azonosítója, amelyhez a dobás tartozik               |
| `player_id`     | INTEGER | Játékos azonosító (pl. 1 vagy 2), aki a dobást végrehajtotta |
| `points`        | INTEGER | Az adott dobás során elért pontszám                          |
| `created_at`    | TEXT    | A dobás időbélyege, alapértelmezés szerint az aktuális idő   |
| **FOREIGN KEY** |         | A `game_id` a `games(id)` mezőre hivatkozik                  |

## Svelte Komponensek

### EndTurnButton.svelte

- A kör befejezésére szolgáló gomb.


### GameCard.svelte

- Egy játék adatait jeleníti meg kártya formában.


### Navbar.svelte

- A fő navigációs menü komponense.



### ScoreDisplay.svelte

- Megjeleníti az aktuális játékos pontszámát.



### StartButton.svelte

- A játék indítására szolgáló gomb.


### ThrowBoxes.svelte

- Megjeleníti az aktuális kör három dobását.


### ThrowControls.svelte

- A dobások kezelésére és a dobási érték kiválasztására szolgáló UI komponens.


Minden komponens saját scoped `<style>` szekcióval rendelkezik, így elszigetelten stílusozhatók.


