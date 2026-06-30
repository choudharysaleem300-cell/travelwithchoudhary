// ==============================
// BOOKING PAGE
// ==============================

console.log("BOOKING.JS LOADED");

const db = window.supabaseClient;

// ==============================
// GET TRIP FROM URL
// ==============================

const params = new URLSearchParams(window.location.search);

const trip = params.get("trip");
const price = params.get("price");

const tripInput = document.getElementById("trip");

if (tripInput && trip) {
    tripInput.value = decodeURIComponent(trip);
}

// ==============================
// FORM
// ==============================

const bookingForm = document.getElementById("bookingForm");

if (!bookingForm) {
    console.error("bookingForm NOT FOUND");
} else {

    bookingForm.addEventListener("submit", async function(e) {

        e.preventDefault();

        console.log("SUBMIT CLICKED");

        // ==========================
        // CREATE OBJECT
        // ==========================

        const booking = {

            customer_name: document.getElementById("customer_name").value.trim(),

            phone: document.getElementById("phone").value.trim(),

            pickup: document.getElementById("pickup").value.trim(),

            destination: document.getElementById("destination").value.trim(),

            journey_date: document.getElementById("journey_date").value,

            journey_time: document.getElementById("journey_time").value,

            passengers: parseInt(document.getElementById("passengers").value) || 1,

            vehicle: document.getElementById("vehicle").value.trim(),

            message: document.getElementById("message").value.trim(),

            trip_name: tripInput ? tripInput.value : "",

            trip_price: price ? Number(price) : 0,

            booking_source: "Website",

            status: "Pending"

        };

        console.log("BOOKING OBJECT");
        console.log(booking);

        // ==========================
        // VALIDATION
        // ==========================

        if (
            booking.customer_name === "" ||
            booking.phone === "" ||
            booking.pickup === "" ||
            booking.destination === "" ||
            booking.journey_date === "" ||
            booking.journey_time === ""
        ) {

            alert("Please fill all required fields.");
            return;

        }

        // ==========================
        // INSERT
        // ==========================

        const { data, error } = await db
            .from("bookings")
            .insert([booking])
            .select();

        console.log("DATA :", data);
        console.log("ERROR:", error);

        if (error) {

            console.log("Code:", error.code);
            console.log("Message:", error.message);
            console.log("Details:", error.details);
            console.log("Hint:", error.hint);

            alert(error.message);

            return;

        }
        const vehicle = params.get("vehicle");

        if (vehicle) {

            document.getElementById("vehicle").value = decodeURIComponent(vehicle);

        }

        const whatsappNumber = "917051316119"; // Country code ke saath

        const message = `🚖 *New Taxi Booking*

👤 Name : ${booking.customer_name}

📞 Phone : ${booking.phone}

📍 Pickup : ${booking.pickup}

🏁 Destination : ${booking.destination}

🚗 Trip : ${booking.trip_name}

🚘 Vehicle : ${booking.vehicle}

👥 Passengers : ${booking.passengers}

📅 Date : ${booking.journey_date}

⏰ Time : ${booking.journey_time}

💰 Price : ₹${booking.trip_price}

📝 Message :
${booking.message}
`;

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        alert("✅ Booking Submitted Successfully!");

        window.open(whatsappURL, "_blank");

        bookingForm.reset();

        if (tripInput && trip) {

            tripInput.value = decodeURIComponent(trip);

        }

        setTimeout(() => {

            window.location.href = "index.html";

        }, 1500);

    });

}