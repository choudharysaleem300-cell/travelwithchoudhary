console.log("MAIN.JS LOADED");

const client = window.supabaseClient;

async function loadCar() {
    const { data, error } = await client
        .from("cars")
        .select("*")
        .limit(1);

    console.log("DATA:", data);
    console.log("ERROR:", error);
}

loadCar();