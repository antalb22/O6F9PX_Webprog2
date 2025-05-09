<script lang="ts">
    import ScoreDisplay from '$lib/components/ScoreDisplay.svelte';
    import ThrowBoxes from '$lib/components/ThrowBoxes.svelte';
    import ThrowControls from '$lib/components/ThrowControls.svelte';
    import EndTurnButton from '$lib/components/EndTurnButton.svelte';
    import Navbar from "$lib/components/Navbar.svelte";
    import {goto} from "$app/navigation";

    export let data: {
        game: {
            id: number;
            player1: string;
            player2: string | null;
            mode: number;
            double_out: boolean;
        }
    };

    let players = [
        {id: 1, name: data.game.player1, score: data.game.mode}
    ];

    if (data.game.player2) {
        players.push({id: 2, name: data.game.player2, score: data.game.mode});
    }

    let currentPlayerIndex = 0;
    let currentThrows: number[] = [];
    let startingScore = data.game.mode;
    let doubleOut = data.game.double_out;
    let finished = false;

    function getCurrentPlayer() {
        return players[currentPlayerIndex];
    }

    async function handleThrow(event: CustomEvent<{ points: number; multiplier: number }>) {
        if (currentThrows.length >= 3 || finished) return;

        const {points, multiplier} = event.detail;
        const newScore = getCurrentPlayer().score - points;
        const isWinningThrow = newScore === 0 && (!doubleOut || multiplier === 2);

        if (newScore < 0 || newScore === 1 || (newScore === 0 && !isWinningThrow)) {
            alert('Bust!');
            players[currentPlayerIndex].score = startingScore;
            currentThrows = [];

            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            startingScore = getCurrentPlayer().score;
            return;
        }

        currentThrows = [...currentThrows, points];
        players[currentPlayerIndex].score = newScore;

        if (isWinningThrow) {
            alert(`🎯 ${getCurrentPlayer().name} wins!`);
            finished = true;
        }

        await fetch('/api/throws', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                points,
                playerId: getCurrentPlayer().id,
                gameId: data.game.id,
                isWinner: isWinningThrow,
                playerName: getCurrentPlayer().name
            })
        });

    }

    async function handleUndo() {
        if (currentThrows.length > 0) {
            const last = currentThrows[currentThrows.length - 1];
            players[currentPlayerIndex].score += last;
            currentThrows = currentThrows.slice(0, -1);
            finished = false;

            await fetch('/api/throws', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    gameId: data.game.id,
                    playerId: getCurrentPlayer().id
                })
            });
        }
    }


    function endTurn() {
        if (currentThrows.length < 3) return;
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        startingScore = getCurrentPlayer().score;
        currentThrows = [];
        finished = false;

        players = [...players];
    }

    function endGame() {
        goto('/');
    }
</script>

<Navbar/>

<main>
    {#if players.length > 0}
        <h2>{getCurrentPlayer()?.name}'s Turn</h2>
        <ScoreDisplay score={getCurrentPlayer()?.score}/>
        <ThrowBoxes throws={currentThrows}/>
        <ThrowControls
                on:throw={handleThrow}
                on:undo={handleUndo}
                disabled={currentThrows.length >= 3 || finished}
        />
        <EndTurnButton
                onClick={finished ? endGame : endTurn}
                disabled={!finished && currentThrows.length < 3}
                label={finished ? 'End Game' : 'End Turn'}
        />
    {:else}
        <p>Loading players...</p>
    {/if}
</main>

<style>
    main {
        text-align: center;
    }
</style>
