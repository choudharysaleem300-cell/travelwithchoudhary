// ====================================
// ADMIN DASHBOARD
// ====================================

// Login Check
if (localStorage.getItem("adminLoggedIn") !== "true") {
    location.href = "login.html";
}

const db = window.supabaseClient;

// Load Dashboard
loadDashboard();

async function loadDashboard() {

    // BOOKINGS
    const {
        count: bookingsCount,
        error: bookingsError
    } = await db
        .from("bookings")
        .select("*", {
            count: "exact",
            head: true
        });

    console.log("Bookings:", bookingsCount, bookingsError);

    // TRIPS
    const {
        count: tripsCount,
        error: tripsError
    } = await db
        .from("trips")
        .select("*", {
            count: "exact",
            head: true
        });

    console.log("Trips:", tripsCount, tripsError);

    // GALLERY
    const {
        count: galleryCount,
        error: galleryError
    } = await db
        .from("gallery")
        .select("*", {
            count: "exact",
            head: true
        });

    console.log("Gallery:", galleryCount, galleryError);

    // REVIEWS
    const {
        count: reviewsCount,
        error: reviewsError
    } = await db
        .from("reviews")
        .select("*", {
            count: "exact",
            head: true
        });

    console.log("Reviews:", reviewsCount, reviewsError);

    // UPDATE HTML
    document.getElementById("bookingsCount").textContent =
        bookingsCount || 0;

    document.getElementById("tripsCount").textContent =
        tripsCount || 0;

    document.getElementById("galleryCount").textContent =
        galleryCount || 0;

    document.getElementById("reviewsCount").textContent =
        reviewsCount || 0;
}

// Logout
document.getElementById("logoutBtn").onclick = function() {

    localStorage.removeItem("adminLoggedIn");

    location.href = "login.html";
};