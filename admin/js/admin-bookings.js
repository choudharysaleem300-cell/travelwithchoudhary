// =====================================
// ADMIN BOOKINGS
// =====================================

const db = window.supabaseClient;

const bookingList = document.getElementById("bookingList");

// ===========================
// LOAD BOOKINGS
// ===========================

loadBookings();

async function loadBookings() {

    bookingList.innerHTML = "<h3>Loading...</h3>";

    const { data, error } = await db
        .from("bookings")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        bookingList.innerHTML = `<h3>${error.message}</h3>`;

        return;

    }

    if (!data || data.length === 0) {

        bookingList.innerHTML = "<h2>No Bookings Found</h2>";

        return;

    }

    bookingList.innerHTML = "";
    console.table(data);

    data.forEach(booking => {
        console.log(
            "Rendering:",
            booking.customer_name,
            booking.id,
            booking.status
        );

        let statusClass = "pending";

        switch (booking.status) {

            case "Confirmed":
                statusClass = "confirmed";
                break;

            case "Completed":
                statusClass = "completed";
                break;

            case "Cancelled":
                statusClass = "cancelled";
                break;

        }

        bookingList.innerHTML += `

<div class="booking-card">

    <div class="booking-header">

        <h2>${booking.customer_name}</h2>

        <span class="status ${statusClass}">
            ${booking.status}
        </span>

    </div>

    <div class="booking-info">

        <p><strong>📞 Phone:</strong> ${booking.phone}</p>

        <p><strong>🚕 Trip:</strong> ${booking.trip_name || "-"}</p>

        <p><strong>💰 Price:</strong> ₹${booking.trip_price || 0}</p>

        <p><strong>📍 Pickup:</strong> ${booking.pickup}</p>

        <p><strong>🎯 Destination:</strong> ${booking.destination}</p>

        <p><strong>📅 Journey:</strong> ${booking.journey_date}</p>

        <p><strong>🕒 Time:</strong> ${booking.journey_time}</p>

        <p><strong>👥 Passengers:</strong> ${booking.passengers}</p>

        <p><strong>🚗 Vehicle:</strong> ${booking.vehicle || "-"}</p>

        <p><strong>🌐 Source:</strong> ${booking.booking_source || "-"}</p>

        <p><strong>📝 Message:</strong><br>${booking.message || "-"}</p>

    </div>

    <div class="booking-buttons">

        <button
            class="confirm-btn"
            onclick="console.log('${booking.id}');confirmBooking('${booking.id}')">

            Confirm

        </button>

        <button
            class="complete-btn"
            onclick="completeBooking('${booking.id}')">

            Complete

        </button>

        <button
            class="cancel-btn"
            onclick="cancelBooking('${booking.id}')">

            Cancel

        </button>

        <button
            class="delete-btn"
            onclick="deleteBooking('${booking.id}')">

            Delete

        </button>

    </div>

</div>

`;

    });

}

// ===========================
// CONFIRM
// ===========================

async function confirmBooking(id) {

    alert("Clicked ID = " + id);

    const { data: before } = await db
        .from("bookings")
        .select("id,status")
        .eq("id", id);

    console.log("Before:", before);

    const { data, error } = await db
        .from("bookings")
        .update({
            status: "Confirmed"
        })
        .eq("id", id)
        .select();

    console.log("Update Data:", data);
    console.log("Update Error:", error);

    const { data: after } = await db
        .from("bookings")
        .select("id,status")
        .eq("id", id);

    console.log("After:", after);

    alert("DONE");

    loadBookings();
}

// ===========================
// COMPLETE
// ===========================

async function completeBooking(id) {

    console.log("Complete:", id);

    const { data, error } = await db
        .from("bookings")
        .update({
            status: "Completed"
        })
        .eq("id", id)
        .select();

    console.log(data);
    console.log(error);

    if (error) {
        alert(error.message);
        return;
    }

    loadBookings();
}

// ===========================
// CANCEL
// ===========================

async function cancelBooking(id) {

    console.log("Cancel:", id);

    const { data, error } = await db
        .from("bookings")
        .update({
            status: "Cancelled"
        })
        .eq("id", id)
        .select();

    console.log(data);
    console.log(error);

    if (error) {
        alert(error.message);
        return;
    }

    loadBookings();
}

// ===========================
// DELETE
// ===========================

async function deleteBooking(id) {

    if (!confirm("Delete booking?")) return;

    const { data, error } = await db
        .from("bookings")
        .delete()
        .eq("id", id)
        .select();

    console.log(data);
    console.log(error);

    if (error) {
        alert(error.message);
        return;
    }

    loadBookings();
}

// ===========================
// LOGOUT
// ===========================

document.getElementById("logoutBtn")
    .addEventListener("click", async() => {

        await db.auth.signOut();

        location.href = "login.html";

    });
window.confirmBooking = confirmBooking;
window.completeBooking = completeBooking;
window.cancelBooking = cancelBooking;
window.deleteBooking = deleteBooking;