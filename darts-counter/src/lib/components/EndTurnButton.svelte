<script lang="ts">
    export let disabled: boolean;
    export let onClick: () => void;
    export let label: string = "End Turn";
</script>

<div class="end-turn-wrapper">
    <button
            class="end-turn-button"
            on:click={onClick}
            disabled={disabled}
    >
        {label}
    </button>
</div>

<style>
    .end-turn-wrapper {
        margin-top: 1.5rem;
    }

    .end-turn-button {
        width: 200px;
        height: 50px;
        font-size: 1.1rem;
        font-weight: bold;
        border: none;
        border-radius: 8px;
        color: white;
        background-color: #ccc;
    }

    .end-turn-button:enabled {
        background-color: #28a745;
        cursor: pointer;
    }

    .end-turn-button:disabled {
        cursor: not-allowed;
    }
</style>
