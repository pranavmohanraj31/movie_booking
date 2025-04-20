// getting the refrences
const movieCards = document.querySelectorAll(".movie-card");
const txtMovie = document.getElementById("movie");
const txtCategory = document.getElementById("category");
const txtPrice = document.getElementById("price");
const txtSeats = document.getElementById("seats");
const btnAddToCart = document.getElementById("addToCart");
const btnSaveFav = document.getElementById("saveFav");
const btnApplyFav = document.getElementById("applyfav");
const cartBody = document.getElementById("cart-body");
const grandTotalCell = document.getElementById("grand-total");

// declare variables
let cartItems = [];
let cartTotal = 0;

// adding event listners (for the booking page)

if (document.title === "Book Tickets") {
    movieCards.forEach(card => card.addEventListener("click", fillform));
    btnAddToCart.addEventListener("click", addToCart);
    btnSaveFav.addEventListener("click", saveFavourite);
    btnApplyFav.addEventListener("click", applyFavourite);
}

function fillform() {
    const title = this.querySelector("p").innerText;
    const category = this.closest(".movie-grid").previousElementSibling.innerText
    let price;

    switch (category) {
        case "Now Showing": price = 10; break;
        case "Upcoming Movies": price = 12; break;
        case "Premium Screenings": price = 15; break;
        case "3D & IMAX Shows": price = 18; break;
        case "Special Discount Offers": price = 6; break;
        default: price = 10;
    }

    txtMovie.value = title;
    txtCategory.value = category;
    txtPrice.value = `$${price}`;

    // to scroll to the form when a movie card is clicked
    document.getElementById("bookingform").scrollIntoView({behavior: "smooth"})
}

// add to cart function

function addToCart(e) {
    e.preventDefault();
    const movie = txtMovie.value;
    const category = txtCategory.value;
    const price = parseFloat(txtPrice.value.replace("$", ""));
    const seats = parseInt(txtSeats.value)

    // checking for validity 

    if (!movie || !category || isNaN(price) || isNaN(seats)) return;

    const total = price * seats;
    cartItems.push({movie, category, price, seats, total})
    cartTotal += total;
    updateCartUI();
    updateLocalStorage();
}

// adding the item into the carttable
function updateCartUI() {
    if (!cartBody || !grandTotalCell) return;
    cartBody.innerHTML = "";
    cartItems.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${item.movie}</td>
        <td>${item.category}</td>
        <td>${item.seats}</td>
        <td>${item.price}</td>
        <td>${item.total}</td>`;
        cartBody.appendChild(row);
    });
    grandTotalCell.innerText = `$${cartTotal}`;
}

// saving cart to the local storage(to use in the chackout page table)
function updateLocalStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("cartTotal", cartTotal)
}

// save favourites
function saveFavourite(){
    if (cartItems.length>0) {
        localStorage.setItem("favouriteBooking", JSON.stringify(cartItems));
        alert("Favourites Saved!");
    }
}

// apply favourites

function applyFavourite() {
    const fav = JSON.parse(localStorage.getItem("favouriteBooking"));
    if (fav && Array.isArray(fav)) {
        cartItems = fav;
        cartTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
        updateCartUI();
        updateLocalStorage();
    }
}