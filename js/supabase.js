const SUPABASE_URL = "https://recszepvhdvwblydtecf.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_zkOB6lTeVyNkS8iPugW0fw_QgFysnHu";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.supabaseClient = supabaseClient;

console.log("Supabase Connected");