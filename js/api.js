// ==============================
// API
// ==============================

window.db = window.supabaseClient;

const API = {

    async getCar() {

        return await db
            .from("cars")
            .select("*")
            .eq("status", true)
            .limit(1)
            .single();

    },

    async getTrips() {

        return await db
            .from("trips")
            .select("*")
            .eq("status", true)
            .order("created_at");

    },

    async getGallery() {

        return await db
            .from("gallery")
            .select("*")
            .order("created_at");

    },

    async getReviews() {

        return await db
            .from("reviews")
            .select("*")
            .eq("approved", true)
            .order("created_at");

    },

    async getSettings() {

        return await db
            .from("settings")
            .select("*")
            .limit(1)
            .single();

    }

};

window.API = API;