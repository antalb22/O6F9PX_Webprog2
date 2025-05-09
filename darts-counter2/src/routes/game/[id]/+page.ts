import type {PageLoad} from './$types';

export const load: PageLoad = async ({fetch, params}) => {
    const res = await fetch(`/api/game/${params.id}`);
    const json = await res.json();

    if (!json.success) {
        throw new Error('Failed to load game');
    }

    return {
        game: json.game
    };
};
