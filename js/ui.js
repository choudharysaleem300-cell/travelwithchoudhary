// ==========================
// UI FUNCTIONS V2
// ==========================

const UI = {

    // ==========================
    // HELPERS
    // ==========================

    formatPrice(price) {
        if (!price) return "₹0";
        return "₹" + Number(price).toLocaleString("en-IN");
    },

    image(url, fallback = "images/no-image.jpg") {

        return `
            onerror="this.onerror=null;this.src='${fallback}'"
            src="${url || fallback}"
        `;

    },

    // ==========================
    // SETTINGS
    // ==========================

    updateSettings(data) {

        if (!data) return;

        document.querySelectorAll(".company-name").forEach(el => {
            el.textContent = data.company_name || "";
        });

        document.querySelectorAll(".company-phone").forEach(el => {
            el.textContent = data.phone || "";
        });

        document.querySelectorAll(".company-email").forEach(el => {
            el.textContent = data.email || "";
        });

    },

    // ==========================
    // CAR
    // ==========================

    updateCar(car) {

        if (!car) return;

        const carImage = document.getElementById("car-image");

        if (carImage) {

            carImage.src = car.image_url || "images/no-car.jpg";

            carImage.onerror = () => {
                carImage.src = "images/no-car.jpg";
            };

        }

        const set = (id, value) => {

            const el = document.getElementById(id);

            if (el) el.textContent = value;

        };

        set("car-type", car.car_type || "");

        set("car-name", car.car_name || "");

        set("car-description", car.description || "");

        set("car-seats",
            `✅ ${car.seats || 0} Passengers`
        );

        set("car-luggage",
            `✅ ${car.luggage || 0} Large Bags`
        );

        set("car-ac",
            car.ac ?
            "✅ Air Conditioned" :
            "❌ Non AC"
        );

    },

    // ==========================
    // TRIPS
    // ==========================

    updateTrips(trips) {

        const container =
            document.getElementById("routes-container");

        if (!container) return;

        container.innerHTML = "";

        if (!trips || trips.length === 0) {

            container.innerHTML = `

<div class="empty-gallery">

<i class="fa-solid fa-route"></i>

<h3>No Routes Available</h3>

</div>

`;

            return;

        }

        trips.forEach(trip => {

            container.innerHTML += `

<div class="route-card">

<img

loading="lazy"

src="${trip.image_url || "images/gallery1.jpg"}"

alt="${trip.trip_name}"

onerror="this.src='images/gallery1.jpg'">

<div class="route-info">

<h3>

${trip.trip_name}

</h3>

<p>

<strong>

${trip.from_location}

</strong>

→

<strong>

${trip.to_location}

</strong>

</p>

<p>

🚗 ${trip.distance}

&nbsp;&nbsp;

⏱ ${trip.duration}

</p>

<h4>

${this.formatPrice(trip.price)}

</h4>

<a

class="book-btn"

href="booking.html?trip=${encodeURIComponent(trip.trip_name)}">

Book Now

</a>

</div>

</div>

`;

        });

    },
    // ==========================
    // GALLERY
    // ==========================

    updateGallery(images) {

        const container = document.getElementById("gallery-container");

        if (!container) return;

        container.innerHTML = "";

        if (!images || images.length === 0) {

            container.innerHTML = `

<div class="empty-gallery">

    <i class="fa-solid fa-image"></i>

    <h3>No Images Available</h3>

    <p>Please check back later.</p>

</div>

`;

            return;

        }

        [...images].reverse().forEach(img => {

            container.innerHTML += `

<div class="gallery-item">

    <img

        loading="lazy"

        src="${img.image_url}"

        alt="${img.title || 'Gallery'}"

        onerror="this.src='images/gallery1.jpg'">

    <div class="gallery-overlay">

        <div>

            <h3>

                ${img.title || "Travel With Choudhary"}

            </h3>

        </div>

        <button

            class="gallery-view"

            data-image="${img.image_url}"

            title="View Image">

            <i class="fa-solid fa-magnifying-glass-plus"></i>

        </button>

    </div>

</div>

`;

        });

        // ==========================
        // LIGHTBOX
        // ==========================

        const lightbox =
            document.getElementById("gallery-lightbox");

        const lightboxImage =
            document.getElementById("lightbox-image");

        document.querySelectorAll(".gallery-view").forEach(btn => {

            btn.onclick = function() {

                if (!lightbox || !lightboxImage) return;

                lightbox.style.display = "flex";

                lightboxImage.src =
                    this.dataset.image;

            };

        });

        if (lightbox) {

            lightbox.onclick = function(e) {

                if (e.target === lightbox) {

                    lightbox.style.display = "none";

                }

            };

        }

        const closeBtn =
            document.querySelector(".close-lightbox");

        if (closeBtn) {

            closeBtn.onclick = () => {

                lightbox.style.display = "none";

            };

        }

    },
    // ==========================
    // REVIEWS
    // ==========================

    updateReviews(reviews) {

        const container =
            document.getElementById("reviews-container");

        if (!container) return;

        container.innerHTML = "";

        if (!reviews || reviews.length === 0) {

            container.innerHTML = `

<div class="empty-gallery">

    <i class="fa-solid fa-comments"></i>

    <h3>No Reviews Yet</h3>

    <p>Be the first customer to leave a review.</p>

</div>

`;

            return;

        }

        reviews.forEach(review => {

            const rating = Number(review.rating || 5);

            let stars = "";

            for (let i = 1; i <= 5; i++) {

                stars += i <= rating ? "⭐" : "☆";

            }

            container.innerHTML += `

<div class="review-card">

    <div class="stars">

        ${stars}

    </div>

    <p>

        "${review.review}"

    </p>

    <h4>

        ${review.customer_name}

        <span class="verified-badge">

            ✔ Verified

        </span>

    </h4>

    <span>

        📍 ${review.city || "India"}

    </span>

</div>

`;

        });

    },

    // ==========================
    // FLEET (Future Ready)
    // ==========================

    updateFleet(vehicles) {

        const container =
            document.getElementById("fleet-container");

        if (!container) return;

        container.innerHTML = "";

        if (!vehicles || vehicles.length === 0) {

            return;

        }

        vehicles.forEach(vehicle => {

            container.innerHTML += `

<div class="fleet-card">

    <img

        loading="lazy"

        src="${vehicle.image_url}"

        alt="${vehicle.name}"

        onerror="this.src='images/no-car.jpg'">

    <div class="fleet-info">

        <h3>

            ${vehicle.name}

        </h3>

        <p>

            ${vehicle.description || ""}

        </p>

        <ul>

            <li>

                👥 ${vehicle.seats || "-"} Seats

            </li>

            <li>

                🧳 ${vehicle.luggage || "-"} Bags

            </li>

            <li>

                ❄️ ${vehicle.ac ? "AC" : "Non AC"}

            </li>

        </ul>

        <a

            href="booking.html"

            class="book-btn">

            Book Now

        </a>

    </div>

</div>

`;


        });

    }, // ==========================
    // COMMON HELPERS
    // ==========================

    clearContainer(id) {

        const container = document.getElementById(id);

        if (container) {

            container.innerHTML = "";

        }

    },

    showLoading(id, message = "Loading...") {

        const container = document.getElementById(id);

        if (!container) return;

        container.innerHTML = `

<div class="loading-box">

    <i class="fa-solid fa-spinner fa-spin"></i>

    <p>${message}</p>

</div>

`;

    },

    showError(id, message = "Something went wrong.") {

        const container = document.getElementById(id);

        if (!container) return;

        container.innerHTML = `

<div class="error-box">

    <i class="fa-solid fa-circle-exclamation"></i>

    <p>${message}</p>

</div>

`;

    }

};

// ==========================
// EXPORT
// ==========================

window.UI = UI;