// LOGIN CHECK
if (localStorage.getItem("adminLoggedIn") !== "true") {
    window.location = "login.html";
}

const db = window.supabaseClient;

const reviewList = document.getElementById("reviewList");

loadReviews();

async function loadReviews() {

    reviewList.innerHTML = "Loading...";

    const { data, error } = await db
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        reviewList.innerHTML = error.message;
        return;
    }

    if (data.length === 0) {
        reviewList.innerHTML = "<h3>No Reviews Found</h3>";
        return;
    }

    reviewList.innerHTML = "";

    data.forEach(r => {

        reviewList.innerHTML += `

<div class="review-card">

    <img src="${r.photo_url || '../images/user.png'}">

    <div class="review-info">

        <h3>${r.customer_name}</h3>

        <p>${r.city}</p>

        <p>⭐ ${r.rating}/5</p>

        <p>${r.review}</p>

        <p>

            ${r.approved
                ? "<span style='color:green'>Approved</span>"
                : "<span style='color:red'>Pending</span>"}

        </p>

        <div class="review-buttons">

            <button
                class="edit-btn"
                onclick="approveReview('${r.id}',${r.approved})">

                ${r.approved ? "Unapprove" : "Approve"}

            </button>

            <button
                class="delete-btn"
                onclick="deleteReview('${r.id}')">

                Delete

            </button>

        </div>

    </div>

</div>

`;

    });

}

window.approveReview = async function(id, approved) {

    await db
        .from("reviews")
        .update({
            approved: !approved
        })
        .eq("id", id);

    loadReviews();

}

window.deleteReview = async function(id) {

    if (!confirm("Delete Review?")) return;

    await db
        .from("reviews")
        .delete()
        .eq("id", id);

    loadReviews();

}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.onclick = () => {

        localStorage.removeItem("adminLoggedIn");

        window.location = "login.html";

    }

}