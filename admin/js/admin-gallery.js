// =====================================
// ADMIN GALLERY
// PART - 1
// =====================================

// -----------------------------
// LOGIN CHECK
// -----------------------------

if (localStorage.getItem("adminLoggedIn") !== "true") {
    location.href = "login.html";
}

// -----------------------------
// SUPABASE
// -----------------------------

const db = window.supabaseClient;

const BUCKET = "website";

// -----------------------------
// ELEMENTS
// -----------------------------

const galleryList = document.getElementById("galleryList");

const modal = document.getElementById("galleryModal");

const galleryTitle = document.getElementById("galleryTitle");

const imageId = document.getElementById("imageId");

const imageTitle = document.getElementById("imageTitle");

const imageCategory = document.getElementById("imageCategory");

const imageFile = document.getElementById("imageFile");

const imageUrl = document.getElementById("imageUrl");

const previewImage = document.getElementById("previewImage");

// -----------------------------
// LOAD
// -----------------------------

loadGallery();

async function loadGallery() {

    galleryList.innerHTML = "<h3>Loading...</h3>";

    const { data, error } = await db

        .from("gallery")

    .select("*")

    .order("created_at", {

        ascending: false

    });

    if (error) {

        galleryList.innerHTML = error.message;

        return;

    }

    if (!data.length) {

        galleryList.innerHTML = "<h2>No Images Found</h2>";

        return;

    }

    galleryList.innerHTML = "";

    data.forEach(img => {

        galleryList.innerHTML += `

<div class="gallery-card">

<img
src="${img.image_url || '../images/no-image.png'}">

<h3>

${img.title || "No Title"}

</h3>

<p>

${img.category}

</p>

<div class="gallery-buttons">

<button

class="edit-btn"

onclick="editImage('${img.id}')">

Edit

</button>

<button

class="delete-btn"

onclick="deleteImage('${img.id}')">

Delete

</button>

</div>

</div>

`;

    });

}

// -----------------------------
// OPEN MODAL
// -----------------------------

document.getElementById("addImageBtn").onclick = function() {

    clearForm();

    galleryTitle.innerHTML = "Add Image";

    modal.style.display = "flex";

};

// -----------------------------
// CLOSE
// -----------------------------

document.getElementById("closeGalleryBtn").onclick = function() {

    modal.style.display = "none";

};

// -----------------------------
// IMAGE PREVIEW
// -----------------------------

imageFile.onchange = function() {

    if (!imageFile.files.length)
        return;

    previewImage.src =
        URL.createObjectURL(imageFile.files[0]);

};

// -----------------------------
// UPLOAD IMAGE
// -----------------------------

async function uploadImage() {

    if (!imageFile.files.length)
        return imageUrl.value;

    const file = imageFile.files[0];

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

// =====================================
// ADMIN GALLERY
// PART - 2
// =====================================

// -----------------------------
// SAVE IMAGE
// -----------------------------

document.getElementById("saveImageBtn").onclick = async function() {

    if (imageTitle.value.trim() === "") {

        alert("Please enter image title.");

        return;

    }

    let image = await uploadImage();

    const obj = {

        title: imageTitle.value.trim(),

        image_url: image,

        category: imageCategory.value

    };

    let result;

    // ADD
    if (imageId.value === "") {

        result = await db

            .from("gallery")

        .insert(obj)

        .select();

    }

    // UPDATE
    else {

        result = await db

            .from("gallery")

        .update(obj)

        .eq("id", imageId.value)

        .select();

    }

    if (result.error) {

        alert(result.error.message);

        console.log(result.error);

        return;

    }

    alert("Image Saved Successfully");

    modal.style.display = "none";

    clearForm();

    loadGallery();

};

// -----------------------------
// EDIT IMAGE
// -----------------------------

window.editImage = async function(id) {

    const { data, error } = await db

        .from("gallery")

    .select("*")

    .eq("id", id)

    .single();

    if (error) {

        alert(error.message);

        return;

    }

    imageId.value = data.id;

    imageTitle.value = data.title;

    imageCategory.value = data.category;

    imageUrl.value = data.image_url || "";

    previewImage.src =
        data.image_url || "../images/no-image.png";

    galleryTitle.innerHTML = "Edit Image";

    modal.style.display = "flex";

};

// -----------------------------
// DELETE IMAGE
// -----------------------------

window.deleteImage = async function(id) {

    if (!confirm("Delete this image?"))
        return;

    // Get Image URL
    const { data } = await db

        .from("gallery")

    .select("image_url")

    .eq("id", id)

    .single();

    if (data && data.image_url) {

        const fileName =
            data.image_url.split("/").pop();

        await db.storage

            .from(BUCKET)

        .remove([fileName]);

    }

    const { error } = await db

        .from("gallery")

    .delete()

    .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    loadGallery();

};

// -----------------------------
// CLEAR FORM
// -----------------------------

function clearForm() {

    imageId.value = "";

    imageTitle.value = "";

    imageCategory.value = "gallery";

    imageUrl.value = "";

    imageFile.value = "";

    previewImage.src = "../images/no-image.png";

}

// -----------------------------
// LOGOUT
// -----------------------------

document.getElementById("logoutBtn").onclick = function() {

    localStorage.removeItem("adminLoggedIn");

    location.href = "login.html";

};