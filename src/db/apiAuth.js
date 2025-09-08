import supabase from "./supabase";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export async function login({email,password}){
    const {data,error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    
    if(error) throw new Error(error.message);

    return data;
}

export async function getCurrentUser(){
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return data?.user ?? null;
}

export async function signup({name,email,password,profile_pic}){
    const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}.png`;

    const {error: storageError} = await supabase.storage
        .from("profile_pic")
        .upload(fileName,profile_pic);
    if(storageError) throw new Error(storageError.message);

    const {data,error} = await supabase.auth.signUp({
        email,
        password,
        options:{
            data:{
                name,
                profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`
            }
        }
    });

    // console.log("apiauth successful:", data);
    if(error) throw new Error("apiauth signup failed: " + error.message);
    return data;
}

export async function logout(){
    const {error} = await supabase.auth.signOut();
    if(error) throw new Error(error.message);
}
