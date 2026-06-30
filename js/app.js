console.log("APP.JS LOADED");

const db = window.db;

// ==========================
// START
// ==========================

loadSettings();
loadCar();
loadTrips();
loadGallery();
loadReviews();

// ==========================
// SETTINGS
// ==========================

async function loadSettings() {

    const { data, error } = await db
        .from("settings")
        .select("*")
        .limit(1)
        .single();

    if (error) {
        console.log(error);
        return;
    }

    console.log("Settings:", data);

    document.querySelectorAll(".company-name").forEach(el => {
        el.innerText = data.company_name;
    });

    document.querySelectorAll(".company-phone").forEach(el => {
        el.innerText = data.phone;
    });

    document.querySelectorAll(".company-email").forEach(el => {
        el.innerText = data.email;
    });

    const phoneNumber = document.getElementById("phone-number");
    if (phoneNumber) phoneNumber.innerText = data.phone;

    const phoneLink = document.getElementById("phone-link");
    if (phoneLink) phoneLink.href = "tel:" + data.phone;

    const emailLink = document.getElementById("email-link");
    if (emailLink) emailLink.href = "mailto:" + data.email;

    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle) heroTitle.innerText = data.hero_title;

    const heroSubtitle = document.querySelector(".hero p");
    if (heroSubtitle) heroSubtitle.innerText = data.hero_subtitle;

    const fb = document.getElementById("facebook-link");
    if (fb) fb.href = data.facebook;

    const insta = document.getElementById("instagram-link");
    if (insta) insta.href = data.instagram;

    const yt = document.getElementById("youtube-link");
    if (yt) yt.href = data.youtube;

    const callBtn = document.getElementById("call-btn");
    if (callBtn) callBtn.href = "tel:" + data.phone;

    document.querySelectorAll(".whatsapp-btn").forEach(btn => {
        btn.href = "https://wa.me/" + data.whatsapp;
        btn.target = "_blank";
    });

}

// ==========================
// CAR
// ==========================

async function loadCar() {

    console.log("LOAD CAR");

    const { data, error } = await db
        .from("cars")
        .select("*")
        .eq("status", true)
        .limit(1)
        .single();

    console.log(data);

    if (error) {
        console.log(error);
        return;
    }

    window.UI.updateCar(data);

}

// ==========================
// TRIPS
// ==========================

async function loadTrips() {

    console.log("LOAD TRIPS");

    const { data, error } = await db
        .from("trips")
        .select("*")
        .eq("status", true)
        .order("created_at");

    console.log("Trips:", data);

    if (error) {
        console.log(error);
        return;
    }

    window.UI.updateTrips(data);

}

// ==========================
// GALLERY
// ==========================

async function loadGallery() {

    console.log("LOAD GALLERY");

    const { data, error } = await db
        .from("gallery")
        .select("*")
        .order("created_at");

    console.log("Gallery:", data);

    if (error) {
        console.log(error);
        return;
    }

    window.UI.updateGallery(data);

}

// ==========================
// REVIEWS
// ==========================

async function loadReviews() {

    console.log("LOAD REVIEWS");

    const { data, error } = await db
        .from("reviews")
        .select("*")
        .eq("approved", true)
        .order("created_at");

    console.log("Reviews:", data);

    if (error) {
        console.log(error);
        return;
    }

    window.UI.updateReviews(data);

}