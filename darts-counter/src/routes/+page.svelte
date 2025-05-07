<script lang="ts">
    import {goto} from '$app/navigation';
    import Navbar from "$lib/components/Navbar.svelte";
    import StartButton from '$lib/components/StartButton.svelte';

    let gameMode: 301 | 501 = 501;
    let doubleOut = true;
    let playerCount: 1 | 2 = 1;
    let player1 = '';
    let player2 = '';

    async function startGame() {
        const res = await fetch('/api/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player1: player1,
                player2: playerCount === 2 ? player2 : null,
                mode: gameMode,
                double_out: doubleOut,
            })
        });

        const data = await res.json();

        if (data.success) {
            await goto(`/game/${data.id}`);
        } else {
            alert("Failed to start game: " + data.error);
        }
    }
</script>

<Navbar/>

<main>
    <h1>Darts Game Setup</h1>

    <div class="form-group">
        <label for="gamemode">Game Mode:</label>
        <select bind:value={gameMode} id="gamemode">
            <option value={301}>301</option>
            <option value={501}>501</option>
        </select>
    </div>

    <div class="form-group">
        <label for="doubleout">Double Out:</label>
        <input bind:checked={doubleOut} id="doubleout" type="checkbox"/>
    </div>

    <div class="form-group">
        <label for="players">Players:</label>
        <select bind:value={playerCount} id="players">
            <option value={1}>1 Player</option>
            <option value={2}>2 Players</option>
        </select>
    </div>

    <div class="form-group">
        <label for="player1">Player 1 Name:</label>
        <input bind:value={player1} id="player1" type="text"/>
    </div>

    {#if playerCount === 2}
        <div class="form-group">
            <label for="player2">Player 2 Name:</label>
            <input id="player2" type="text" bind:value={player2}/>
        </div>
    {/if}

    <StartButton disabled={!player1 || (playerCount === 2 && !player2)} onClick={startGame}/>
</main>

<style>
    main {
        max-width: 400px;
        margin: 2rem auto;
        text-align: center;
    }

    .form-group {
        margin-bottom: 1rem;
        text-align: left;
    }

    label {
        display: block;
        margin-bottom: 0.3rem;
    }

    input, select {
        width: 100%;
        padding: 0.4rem;
        border-radius: 6px;
        border: 1px solid #ccc;
    }
</style>
