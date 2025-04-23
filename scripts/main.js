// getting the refrences
const movieCards = document.querySelectorAll(".movie-card");
const txtMovie = document.getElementById("movie");
const txtCategory = document.getElementById("category");
const txtPrice = document.getElementById("price");
const txtSeats = document.getElementById("seats");
const btnAddToCart = document.getElementById("addToCart");
const btnSaveFav = document.getElementById("saveFav");
const btnApplyFav = document.getElementById("applyFav");
const cartBody = document.getElementById("cart-body");
const grandTotalCell = document.getElementById("grand-total");

//variables
let cartItems = [];
let cartTotal = 0;

// Event listeners (for booking page only)
if (document.title === "Book Tickets") {
  movieCards.forEach(card => card.addEventListener("click", fillForm));
  btnAddToCart.addEventListener("click", addToCart);
  btnSaveFav.addEventListener("click", saveFavourite);
  btnApplyFav.addEventListener("click", applyFavourite);
}

// Function definitions for booking page
function fillForm() {
  const title = this.querySelector("p").innerText;
  const category = this.closest(".movie-grid").previousElementSibling.innerText;
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
  document.getElementById("bookingform").scrollIntoView({ behavior: "smooth" });
}

function addToCart(e) {
  e.preventDefault();
  const movie = txtMovie.value;
  const category = txtCategory.value;
  const price = parseFloat(txtPrice.value.replace("$", ""));
  const seats = parseInt(txtSeats.value);

  if (!movie || !category || isNaN(price) || isNaN(seats)) return;

  const total = price * seats;
  cartItems.push({ movie, category, price, seats, total });
  cartTotal += total;
  updateCartUI();
  updateLocalStorage();
}

function updateCartUI() {
  if (!cartBody || !grandTotalCell) return;
  cartBody.innerHTML = "";
  cartItems.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.movie}</td>
      <td>${item.category}</td>
      <td>${item.seats}</td>
      <td>$${item.price}</td>
      <td>$${item.total}</td>
    `;
    cartBody.appendChild(row);
  });
  grandTotalCell.innerText = `$${cartTotal}`;
}

function updateLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  localStorage.setItem("cartTotal", cartTotal);
}

function saveFavourite() {
  if (cartItems.length > 0) {
    localStorage.setItem("favouriteBooking", JSON.stringify(cartItems));
    alert("Favourites saved!");
  }
}

function applyFavourite() {
  const fav = JSON.parse(localStorage.getItem("favouriteBooking"));
  if (fav && Array.isArray(fav)) {
    cartItems = fav;
    cartTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    updateCartUI();
    updateLocalStorage();
  }
}

// checkoutpage js
if (document.title === "Checkout") {
    const checkoutCartBody = document.getElementById("checkout-cart-body");
    const checkoutGrandTotal = document.getElementById("checkout-grand-total");
    const checkoutForm = document.getElementById("checkout-form");
    const confirmationBox = document.getElementById("confirmation");
  
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const storedTotal = localStorage.getItem("cartTotal") || 0;
  
    // filling the table
    storedCart.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.movie}</td>
        <td>${item.category}</td>
        <td>${item.seats}</td>
        <td>$${item.price}</td>
        <td>$${item.total}</td>
      `;
      checkoutCartBody.appendChild(row);
    });
    checkoutGrandTotal.innerText = `$${storedTotal}`;
  
    // when pay is clicked in the checkout page form
    checkoutForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const name = document.getElementById("fullname").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const seats = document.getElementById("seats").value;
      const card = document.getElementById("card").value;
  
      if (!name || !email || !phone || !seats || !card) return;
  
      const ref = "#765411";
      alert(`Thank you, ${name}!\nYour booking ref is: ${ref}\nTotal Paid: $${storedTotal}\nSeats: ${seats}`);
  
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartTotal");
    });
  }
  