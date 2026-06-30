// ======================================
// ADMIN TRIPS
// ======================================

// Login Check
if (localStorage.getItem("adminLoggedIn") !== "true") {
    location.href = "login.html";
}

// Supabase
const db = window.supabaseClient;

// Storage Bucket
const BUCKET = "website";

// ==========================
// Elements
// ==========================

const tripList = document.getElementById("tripList");

const modal = document.getElementById("tripModal");

const modalTitle = document.getElementById("modalTitle");

const tripId = document.getElementById("tripId");

const tripName = document.getElementById("tripName");

const fromLocation = document.getElementById("fromLocation");

const toLocation = document.getElementById("toLocation");

const distance = document.getElementById("distance");

const duration = document.getElementById("duration");

const price = document.getElementById("price");

const description = document.getElementById("description");

const featured = document.getElementById("featured");

const status = document.getElementById("status");

const imageUrl = document.getElementById("imageUrl");

const tripImage = document.getElementById("tripImage");

const previewImage = document.getElementById("previewImage");

// ==========================
// Load Trips
// ==========================

loadTrips();

async function loadTrips() {

    tripList.innerHTML = "<h3>Loading...</h3>";

    const { data, error } = await db
        .from("trips")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.log(error);

        tripList.innerHTML = error.message;

        return;

    }

    if (!data.length) {

        tripList.innerHTML = "<h2>No Trips Found</h2>";

        return;

    }

    tripList.innerHTML = "";

    data.forEach(trip => {

        tripList.innerHTML += `

<div class="trip-card">

<img src="${trip.image_url || '../images/no-image.png'}">

<div class="trip-info">

<h3>${trip.trip_name}</h3>

<p><b>${trip.from_location}</b> → <b>${trip.to_location}</b></p>

<p>📏 ${trip.distance}</p>

<p>🕒 ${trip.duration}</p>

<p>💰 ₹${trip.price}</p>

<p>${trip.featured ? "⭐ Featured" : ""}</p>

<div class="trip-buttons">

<button
class="edit-btn"
onclick="editTrip('${trip.id}')">

Edit

</button>

<button
class="delete-btn"
onclick="deleteTrip('${trip.id}')">

Delete

</button>

</div>

</div>

</div>

`;

    });

}

// ==========================
// Open Modal
// ==========================

document.getElementById("addTripBtn").onclick = function() {

    clearForm();

    modalTitle.innerHTML = "Add Trip";

    modal.style.display = "flex";

};

// ==========================
// Close
// ==========================

document.getElementById("closeModalBtn").onclick = function() {

    modal.style.display = "none";

};

// ==========================
// Image Preview
// ==========================

tripImage.onchange = function() {

    if (!tripImage.files.length) return;

    previewImage.src = URL.createObjectURL(tripImage.files[0]);

};

// ==========================
// Upload Image
// ==========================

async function uploadImage() {

    if (!tripImage.files.length)
        return imageUrl.value;

    const file = tripImage.files[0];

    const fileName =
        Date.now() + "-" +
        file.name.replaceAll(" ", "_");

    const { error } = await db.storage

        .from(BUCKET)

    .upload(fileName, file, {

        upsert: true

    });

    if (error) {

        alert(error.message);

        throw error;

    }

    const { data } = db.storage

        .from(BUCKET)

    .getPublicUrl(fileName);

    return data.publicUrl;

}

// ==========================
// SAVE TRIP
// ==========================

document.getElementById("saveTripBtn").onclick = async function() {

    if (
        tripName.value.trim() === "" ||
        fromLocation.value.trim() === "" ||
        toLocation.value.trim() === ""
    ) {
        alert("Please fill all required fields.");
        return;
    }

    let image = await uploadImage();

    const obj = {

        trip_name: tripName.value.trim(),

        from_location: fromLocation.value.trim(),

        to_location: toLocation.value.trim(),

        distance: distance.value.trim(),

        duration: duration.value.trim(),

        price: Number(price.value),

        image_url: image,

        description: description.value.trim(),

        featured: featured.value === "true",

        status: status.value === "true"

    };

    let result;

    // ADD
    if (tripId.value === "") {

        result = await db
            .from("trips")
            .insert(obj)
            .select();

    }

    // UPDATE
    else {

        result = await db
            .from("trips")
            .update(obj)
            .eq("id", tripId.value)
            .select();

    }

    if (result.error) {

        alert(result.error.message);

        console.log(result.error);

        return;

    }

    alert("Trip Saved Successfully");

    modal.style.display = "none";

    clearForm();

    loadTrips();

};

// ==========================
// EDIT
// ==========================

window.editTrip = async function(id) {

    const { data, error } = await db

        .from("trips")

    .select("*")

    .eq("id", id)

    .single();

    if (error) {

        alert(error.message);

        return;

    }

    tripId.value = data.id;

    tripName.value = data.trip_name;

    fromLocation.value = data.from_location;

    toLocation.value = data.to_location;

    distance.value = data.distance;

    duration.value = data.duration;

    price.value = data.price;

    description.value = data.description;

    featured.value = String(data.featured);

    status.value = String(data.status);

    imageUrl.value = data.image_url || "";

    previewImage.src = data.image_url || "../images/no-image.png";

    modalTitle.innerHTML = "Edit Trip";

    modal.style.display = "flex";

};

// ==========================
// DELETE
// ==========================

window.deleteTrip = async function(id) {

    if (!confirm("Delete this trip?"))
        return;

    const { error } = await db

        .from("trips")

    .delete()

    .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    loadTrips();

};

// ==========================
// CLEAR FORM
// ==========================

function clearForm() {

    tripId.value = "";

    tripName.value = "";

    fromLocation.value = "";

    toLocation.value = "";

    distance.value = "";

    duration.value = "";

    price.value = "";

    description.value = "";

    imageUrl.value = "";

    tripImage.value = "";

    previewImage.src = "../images/no-image.png";

    featured.value = "false";

    status.value = "true";

}

// ==========================
// LOGOUT
// ==========================

document.getElementById("logoutBtn").onclick = function() {

    localStorage.removeItem("adminLoggedIn");

    location.href = "login.html";

};