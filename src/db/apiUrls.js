import supabase from "./supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export async function getUrls(user_id) {
    const {data, error} = await supabase
        .from("urls")
        .select("*")
        .eq("user_id",user_id);

    if(error){
        console.error( error.message);
        throw new Error("Unable to fetch URLs");
    } 

    return data;
}

export async function deleteUrl(id) {
    const {data, error} = await supabase
        .from("urls")
        .delete()
        .eq("id",id);

    if(error){
        console.error( error.message);
        throw new Error("Unable to delete URLs");
    } 

    return data;
}

export async function createUrl({title, long_url, custom_url, user_id},qrcode) {
    const short_url = Math.random().toString(36).substring(2,6);
    const fileName = `qr-${short_url}.png`;

    const {error: storageError} = await supabase.storage
        .from("qr_codes")
        .upload(fileName,qrcode);
    if(storageError) throw new Error(storageError.message);

    const qr = `${supabaseUrl}/storage/v1/object/public/qr_codes/${fileName}`
    const {data, error} = await supabase.from("urls").insert([
        {
            title,
            original_url : long_url,
            custom_url : custom_url || null,
            user_id,
            short_url,
            qr
        }
    ]).select();

    if(error){
        console.error( error.message);
        throw new Error("Error creating short URL");
    } 

    return data;
}

export async function getLongUrl(id) {
    const {data, error} = await supabase
        .from("urls")
        .select("id,original_url")
        .or(`short_url.eq.${id},custom_url.eq.${id}`)
        .single();

    if(error){
        console.error( error.message);
        throw new Error("Long URL not found");
    } 

    return data;
}

export async function getUrl({id,user_id}) {
    const {data, error} = await supabase
        .from("urls")
        .select("*")
        .eq("id",id)
        .eq("user_id",user_id)
        .single();

    if(error){
        console.error( error.message);
        throw new Error("Short URL not found");
    } 

    return data;
}