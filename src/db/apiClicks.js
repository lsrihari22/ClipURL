import supabase from "./supabase";

export async function getClicks(urlIds) {
    if(!urlIds || !urlIds.length) {
        return [];
    }
    const {data, error} = await supabase
        .from("clicks")
        .select("*")
        .in("url_id", urlIds);

    if(error){
        console.error( error.message);
        throw new Error("Unable to fetch Clicks");
    } 
    // fetched clicks
    return data;
}

export async function addClick(url_id) {
    const { data, error } = await supabase
        .from("clicks")
        .insert([{ url_id }])
        .select();

    if (error) {
        console.error(error.message);
        throw new Error("Unable to record Click");
    }

    return data;
}
