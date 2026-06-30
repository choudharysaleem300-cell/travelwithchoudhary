// ==============================
// LOGIN CHECK
// ==============================

if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location = "login.html";
}

const db = window.supabaseClient;

// ==============================
// INPUTS
// ==============================

const company_name = document.getElementById("company_name");
const phone = document.getElementById("phone");
const whatsapp = document.getElementById("whatsapp");
const email = document.getElementById("email");
const address = document.getElementById("address");
const hero_title = document.getElementById("hero_title");
const hero_subtitle = document.getElementById("hero_subtitle");
const facebook = document.getElementById("facebook");
const instagram = document.getElementById("instagram");
const youtube = document.getElementById("youtube");
const footer_text = document.getElementById("footer_text");

let settingsId = "";

// ==============================
// LOAD SETTINGS
// ==============================

loadSettings();

async function loadSettings() {

    const { data, error } = await db
        .from("settings")
        .select("*")
        .limit(1)
        .single();

    if (error) {
        alert(error.message);
        return;
    }

    settingsId = data.id;

    company_name.value = data.company_name || "";
    phone.value = data.phone || "";
    whatsapp.value = data.whatsapp || "";
    email.value = data.email || "";
    address.value = data.address || "";
    hero_title.value = data.hero_title || "";
    hero_subtitle.value = data.hero_subtitle || "";
    facebook.value = data.facebook || "";
    instagram.value = data.instagram || "";
    youtube.value = data.youtube || "";
    footer_text.value = data.footer_text || "";
}

// ==============================
// SAVE SETTINGS
// ==============================

document.getElementById("saveBtn").onclick = async() => {

    const obj = {

        company_name: company_name.value,
        phone: phone.value,
        whatsapp: whatsapp.value,
        email: email.value,
        address: address.value,
        hero_title: hero_title.value,
        hero_subtitle: hero_subtitle.value,
        facebook: facebook.value,
        instagram: instagram.value,
        youtube: youtube.value,
        footer_text: footer_text.value

    };

    const { error } = await db
        .from("settings")
        .update(obj)
        .eq("id", settingsId);

    if (error) {
        alert(error.message);
        return;
    }

    alert("Settings Updated Successfully");

};

// ==============================
// LOGOUT
// ==============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.onclick = () => {

        localStorage.removeItem("adminLoggedIn");

        window.location = "login.html";

    };

}