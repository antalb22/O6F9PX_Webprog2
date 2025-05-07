<script lang="ts">
    import {onMount} from 'svelte';
    import Navbar from '$lib/components/Navbar.svelte';

    type Stat = {
        player: string;
        gamesFinished: number;
        wins: number;
        averageScore: number;
    };

    let stats: Stat[] = [];
    let searchQuery = '';
    let sortField: keyof Stat = 'player';
    let sortDirection: 'asc' | 'desc' = 'asc';

    onMount(async () => {
        const res = await fetch('/api/statistics');
        stats = await res.json();
    });

    $: filteredStats = stats
        .filter(stat => stat.player.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortField === 'player') {
                return sortDirection === 'asc'
                    ? a.player.localeCompare(b.player)
                    : b.player.localeCompare(a.player);
            } else {
                return sortDirection === 'asc'
                    ? a[sortField] - b[sortField]
                    : b[sortField] - a[sortField];
            }
        });

    function setSort(field: keyof Stat) {
        if (sortField === field) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortField = field;
            sortDirection = 'asc';
        }
    }
</script>

<Navbar/>

<main>
    <h1>Player Statistics</h1>

    <input
            type="text"
            placeholder="Search player..."
            bind:value={searchQuery}
            class="search-input"
    />

    <table>
        <thead>
        <tr>
            <th on:click={() => setSort('player')}>Player</th>
            <th on:click={() => setSort('gamesFinished')}>Games Finished</th>
            <th on:click={() => setSort('wins')}>Wins</th>
            <th on:click={() => setSort('averageScore')}>Avg Score</th>
        </tr>
        </thead>
        <tbody>
        {#each filteredStats as stat}
            <tr>
                <td>{stat.player}</td>
                <td>{stat.gamesFinished}</td>
                <td>{stat.wins}</td>
                <td>{stat.averageScore.toFixed(2)}</td>
            </tr>
        {/each}
        </tbody>
    </table>
</main>

<style>
    main {
        max-width: 800px;
        margin: 2rem auto;
        text-align: center;
    }

    input.search-input {
        margin-bottom: 1rem;
        width: 60%;
        padding: 0.5rem;
        border-radius: 8px;
        border: 1px solid #ccc;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 0.75rem;
        border: 1px solid #ddd;
    }

    th {
        cursor: pointer;
        background-color: #f2f2f2;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
</style>
