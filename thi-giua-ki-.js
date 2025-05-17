let cart = [];
let slideIndex = 0;
let slides;

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded, initializing scripts...");

  // Initialize cart count display
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) {
    console.error("Cart count element not found.");
  }

  // Handle "Mua ngay" buttons
  const buyButtons = document.querySelectorAll(".buy-button");
  if (buyButtons.length === 0) {
    console.error("No buy buttons found.");
  } else {
    buyButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const name = this.getAttribute("data-name");
        const price = parseInt(this.getAttribute("data-price"));
        if (isNaN(price) || !name) {
          console.error("Invalid data-name or data-price:", { price, name });
          alert("Lỗi: Thông tin sản phẩm không hợp lệ!");
          return;
        }
        console.log(`Adding to cart: ${name} - ${price}₫`);
        addToCart(name, price);
        showCart();
        alert(`${name} đã được thêm vào giỏ hàng!`);
      });
    });
  }

  // Handle cart link click
  const cartLink = document.getElementById("cart-link");
  if (!cartLink) {
    console.error("Cart link not found.");
  } else {
    cartLink.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("Cart link clicked, showing cart...");
      showCart();
    });
  }

  // Handle proceed to payment
  const proceedButton = document.getElementById("proceed-to-payment");
  if (!proceedButton) {
    console.error("Proceed to payment button not found.");
  } else {
    proceedButton.addEventListener("click", function () {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (total === 0) {
        alert("Giỏ hàng trống!");
        console.log("Cart is empty, cannot proceed to payment.");
        return;
      }
      const names = cart.map((item) => `${item.name} (${item.quantity})`).join(", ");
      console.log(`Proceeding to payment: ${total}₫ for ${names}`);
      showPayment(total, names);
    });
  }

  // Handle clear cart
  const clearCartButton = document.getElementById("clear-cart");
  if (!clearCartButton) {
    console.error("Clear cart button not found.");
  } else {
    clearCartButton.addEventListener("click", function () {
      console.log("Clearing cart...");
      cart = [];
      updateCartDisplay();
      if (cartCount) cartCount.textContent = `(0)`;
      alert("Giỏ hàng đã được xóa!");
    });
  }

  // Initial cart display
  updateCartDisplay();
});

// Add product to cart
function addToCart(name, price) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  console.log("Current cart:", cart);
  updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
  const cartItemsBody = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const totalPrice = document.getElementById("total-price");
  const cartCount = document.getElementById("cart-count");

  if (!cartItemsBody || !emptyCartMessage || !totalPrice || !cartCount) {
    console.error("One or more cart elements not found:", {
      cartItemsBody,
      emptyCartMessage,
      totalPrice,
      cartCount,
    });
    return;
  }

  // Clear existing items
  cartItemsBody.innerHTML = "";

  // Show or hide empty message
  if (cart.length === 0) {
    emptyCartMessage.style.display = "block";
  } else {
    emptyCartMessage.style.display = "none";
    cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.price.toLocaleString()} ₫</td>
        <td>
          <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
        </td>
        <td>${subtotal.toLocaleString()} ₫</td>
        <td><button onclick="removeFromCart(${index})">Xóa</button></td>
      `;
      cartItemsBody.appendChild(row);
    });
  }

  // Update total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPrice.textContent = `${total.toLocaleString()}`;
  cartCount.textContent = `(${cart.length})`;
  console.log("Cart display updated, total:", total);
}

// Update quantity
function updateQuantity(index, quantity) {
  const qty = parseInt(quantity);
  if (qty >= 1) {
    cart[index].quantity = qty;
    console.log(`Updated quantity for item ${index} to ${qty}`);
    updateCartDisplay();
  } else {
    console.error("Invalid quantity:", qty);
  }
}

// Remove item from cart
function removeFromCart(index) {
  if (index >= 0 && index < cart.length) {
    console.log(`Removing item at index ${index}`);
    cart.splice(index, 1);
    updateCartDisplay();
  } else {
    console.error("Invalid index for removal:", index);
  }
}

// Show cart section
function showCart() {
  const cartSection = document.getElementById("cart");
  const paymentSection = document.getElementById("payment");
  if (!cartSection) {
    console.error("Cart section not found.");
    return;
  }
  cartSection.style.display = "block";
  if (paymentSection) paymentSection.style.display = "none";
  cartSection.scrollIntoView({ behavior: "smooth" });
  updateCartDisplay();
  console.log("Cart section displayed.");
}

// Payment Functionality
function showPayment(total, names) {
  const paymentSection = document.getElementById("payment");
  const cartSection = document.getElementById("cart");
  if (!paymentSection) {
    console.error("Payment section not found.");
    return;
  }
  paymentSection.style.display = "block";
  if (cartSection) cartSection.style.display = "none";
  paymentSection.scrollIntoView({ behavior: "smooth" });

  const payButton = document.getElementById("pay-button");
  if (!payButton) {
    console.error("Pay button not found.");
    return;
  }
  payButton.onclick = function (event) {
    event.preventDefault();
    const paymentInfo = `Thanh toán: ${total.toLocaleString()} VND cho ${names}`;
    const paymentInfoElement = document.getElementById("payment-info");
    const qrCodeElement = document.getElementById("qr-code");
    const qrCodeDiv = document.getElementById("qrcode");
    if (!paymentInfoElement || !qrCodeElement || !qrCodeDiv) {
      console.error("Payment info, QR code element, or QR code div not found.");
      return;
    }
    paymentInfoElement.innerText = paymentInfo;

    // Clear old QR code
    qrCodeDiv.innerHTML = "";

    // Generate dynamic QR code with VietQR
    const description = encodeURIComponent(`Thanh toan ${names}`);
    const qrUrl = `https://img.vietqr.io/image/970415-103879398252-compact2.jpg?amount=${total}&addInfo=${description}&accountName=PHAM%20VU%20TUAN%20NGUYEN`;

    // Display dynamic QR code
    const qrImage = document.createElement("img");
    qrImage.src = qrUrl;
    qrImage.alt = "QR chuyển khoản tự động";
    qrImage.style.maxWidth = "200px";
    qrImage.style.maxHeight = "200px";
    qrCodeDiv.appendChild(qrImage);

    qrCodeElement.style.display = "block";
    console.log("Displayed dynamic QR code with amount and description.");
    alert("Đơn hàng đã được xác nhận! Vui lòng quét mã QR để thanh toán.");
  };
}

// Banner Slider
window.onload = function () {
  slides = document.querySelectorAll(".slide");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === index) slide.classList.add("active");
    });
  }

  window.changeSlide = function (n) {
    slideIndex = (slideIndex + n + slides.length) % slides.length;
    showSlide(slideIndex);
  };

  showSlide(slideIndex);

  setInterval(() => {
    changeSlide(1);
  }, 5000);
};