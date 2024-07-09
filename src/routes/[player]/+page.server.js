import { redirect } from '@sveltejs/kit';

export async function load({ params, url }){
    let inventory;
    let enderchest;
    
    const {player} = params;

    const playerInfoResponse = await fetch(`https://playerdb.co/api/player/minecraft/${player}`, {
        method: "GET",
        headers: { "User-Agent": "Mozilla/5.0" }
    });
    
    const {success, data} = await playerInfoResponse.json();
    if(!success){
        throw redirect(307, url.origin);
    }

    return {
        status:200,
        inventory,
        enderchest,
        player: data.player,
    }
}

