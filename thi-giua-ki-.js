document.addEventListener("DOMContentLoaded", function() {
  console.log("Viettel Store - Initializing application...");

  // ========== KHAI BÁO BIẾN TOÀN CỤC ==========
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let slideIndex = 0;
  let slides;

  // Dữ liệu sản phẩm
  const products = [
    {
      id: 1,
      name: "Loa vi tính SoundMax A828",
      originalPrice: 14390000,
      discountPrice: 11590000,
      discountPercentage: 19,
      category: "tv",
      image: "Viettel store/Loa vi tính SoundMax A828.webp",
      description: "Loa vi tính SoundMax A828 với chất lượng âm thanh sống động, thiết kế hiện đại, phù hợp cho giải trí và làm việc tại nhà."
    },
    {
      id: 2,
      name: "Daikin Inverter 1.5 HP ATKB35ZVMV",
      originalPrice: 6990000,
      discountPrice: 4890000,
      discountPercentage: 30,
      category: "appliance",
      image: "Viettel store/Máy lạnh Daikin Inverter 1.5 HP ATKB35ZVMV.webp",
      description: "Máy lạnh Daikin Inverter 1.5 HP ATKB35ZVMV tiết kiệm điện, làm lạnh nhanh, vận hành êm ái, lý tưởng cho không gian vừa và nhỏ."
    },
    {
      id: 3,
      name: "Loa Bluetooth Karaoke Soundmax M33",
      originalPrice: 4590000,
      discountPrice: 3490000,
      discountPercentage: 24,
      category: "appliance",
      image: "Viettel store/Loa Bluetooth Karaoke Soundmax M33.webp",
      description: "Loa Bluetooth Karaoke Soundmax M33 với âm thanh mạnh mẽ, hỗ trợ hát karaoke, kết nối không dây tiện lợi."
    }
  ];

  // ========== DOM ELEMENTS ==========
  const elements = {
    cartCount: document.getElementById('cart-count'),
    cartLink: document.getElementById('cart-link'),
    cartSection: document.getElementById('cart'),
    cartItemsBody: document.getElementById('cart-items'),
    emptyCartMessage: document.getElementById('empty-cart-message'),
    totalPrice: document.getElementById('total-price'),
    clearCartBtn: document.getElementById('clear-cart'),
    proceedButton: document.getElementById('proceed-to-payment'),
    productsGrid: document.getElementById('products-grid'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    buyButtons: document.querySelectorAll('.buy-button'),
    paymentSection: document.getElementById('payment'),
    checkoutSection: document.getElementById('checkout-section'),
    checkoutForm: document.getElementById('checkout-form'),
    submitOrderBtn: document.getElementById('submit-order'),
    backToShopBtn: document.getElementById('back-to-shop'),
    orderConfirmation: document.getElementById('order-confirmation'),
    productModal: document.getElementById('product-modal'),
    productDetail: document.getElementById('product-detail'),
    closeModal: document.querySelector('.close'),
    payButton: document.getElementById('pay-button'),
    paymentInfoElement: document.getElementById('payment-info'),
    qrCodeElement: document.getElementById('qr-code'),
    qrCodeDiv: document.getElementById('qrcode'),
    bannerSlider: document.querySelector('.banner-slider')
  };

  // ========== KHỞI TẠO ỨNG DỤNG ==========
  function init() {
    renderProducts(products);
    updateCartCount();
    renderCartItems();
    setupEventListeners();
    initSlider();
    console.log("Application initialized successfully");
  }

  // ========== PRODUCT FUNCTIONS ==========
  function renderProducts(productsToRender) {
    if (!elements.productsGrid) return;

    elements.productsGrid.innerHTML = '';

    productsToRender.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3 class="product-name" data-id="${product.id}">${product.name}</h3>
        <p class="original-price">Giá gốc: <del>${product.originalPrice.toLocaleString()} ₫</del></p>
        <span class="discount-tag">${product.discountPercentage}%</span>
        <p class="discount-price">${product.discountPrice.toLocaleString()} ₫</p>
        <div class="button-container">
          <button class="view-detail" data-id="${product.id}">Xem chi tiết</button>
          <button class="buy-button" data-name="${product.name}" data-price="${product.discountPrice}">Mua ngay</button>
        </div>
      `;
      elements.productsGrid.appendChild(productCard);
    });
  }

  function searchProducts(query) {
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filteredProducts);
  }

  function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !elements.productDetail) return;

    elements.productDetail.innerHTML = `
      <div class="product-detail">
        <div class="product-detail-img">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
          <h2 class="product-detail-name">${product.name}</h2>
          <p class="product-detail-price">${product.discountPrice.toLocaleString()} ₫</p>
          <p class="product-detail-desc">${product.description}</p>
          <button class="buy-button" data-name="${product.name}" data-price="${product.discountPrice}">Mua ngay</button>
        </div>
      </div>
    `;
    elements.productModal.classList.add('active');
  }

  // ========== CART FUNCTIONS ==========
  function addToCart(name, price, image) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1, image });
    }
    updateCart();
    showToast(`${name} đã được thêm vào giỏ hàng!`);
  }

  function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
  }

  function updateCartCount() {
    if (!elements.cartCount) return;
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    elements.cartCount.textContent = count;
  }

  function renderCartItems() {
    if (!elements.cartItemsBody || !elements.emptyCartMessage || !elements.totalPrice) return;

    elements.cartItemsBody.innerHTML = '';

    if (cart.length === 0) {
      elements.emptyCartMessage.style.display = "block";
    } else {
      elements.emptyCartMessage.style.display = "none";
      cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <img src="${item.image || 'images/Viettel store/default-product.jpg'}" alt="${item.name}" class="cart-item-img">
            ${item.name}
          </td>
          <td>${item.price.toLocaleString()} ₫</td>
          <td>
            <input type="number" value="${item.quantity}" min="1" 
              class="quantity-input" data-index="${index}">
          </td>
          <td>${subtotal.toLocaleString()} ₫</td>
          <td><button class="remove-btn" data-index="${index}">Xóa</button></td>
        `;
        elements.cartItemsBody.appendChild(row);
      });
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    elements.totalPrice.textContent = total.toLocaleString();
  }

  function updateQuantity(index, quantity) {
    const qty = parseInt(quantity);
    if (qty >= 1 && index >= 0 && index < cart.length) {
      cart[index].quantity = qty;
      updateCart();
    }
  }

  function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1);
      updateCart();
    }
  }

  function clearCart() {
    cart = [];
    updateCart();
    showToast("Giỏ hàng đã được xóa!");
  }

  function showCart() {
    if (!elements.cartSection) return;
    elements.cartSection.style.display = "block";
    if (elements.paymentSection) elements.paymentSection.style.display = "none";
    if (elements.checkoutSection) elements.checkoutSection.classList.remove('active');
    elements.cartSection.scrollIntoView({ behavior: "smooth" });
    updateCart();
  }

  // ========== PAYMENT FUNCTIONS ==========
  function showPayment(total, names) {
    if (!elements.paymentSection) return;

    elements.paymentSection.style.display = "block";
    if (elements.cartSection) elements.cartSection.style.display = "block";
    if (elements.checkoutSection) {
      elements.checkoutSection.classList.remove('active');
      elements.checkoutSection.style.display = 'none';
    }
    elements.paymentSection.scrollIntoView({ behavior: "smooth" });

    if (elements.payButton) {
      elements.payButton.onclick = function(event) {
        event.preventDefault();
        processPayment(total, names);
      };
    }
  }

  function processPayment(total, names) {
    if (!elements.paymentInfoElement || !elements.qrCodeElement || !elements.qrCodeDiv) return;

    const paymentInfo = `Thanh toán: ${total.toLocaleString()} VND cho ${names}`;
    elements.paymentInfoElement.innerText = paymentInfo;

    elements.qrCodeDiv.innerHTML = "";
    const description = encodeURIComponent(`Thanh toan ${names}`);
    const qrUrl = `https://img.vietqr.io/image/970415-103879398252-compact2.jpg?amount=${total}&addInfo=${description}&accountName=PHAM%20VU%20TUAN%20NGUYEN`;

    const qrImage = document.createElement('img');
    qrImage.src = qrUrl;
    qrImage.alt = "QR chuyển khoản tự động";
    qrImage.style.maxWidth = "200px";
    qrImage.style.maxHeight = "200px";
    qrImage.onerror = () => showToast("Lỗi khi tải mã QR. Vui lòng kiểm tra lại!");
    qrImage.onload = () => elements.qrCodeElement.style.display = "block";
    elements.qrCodeDiv.appendChild(qrImage);

    showToast("Đơn hàng đã được xác nhận! Vui lòng quét mã QR để thanh toán.");

    if (elements.orderConfirmation) {
      elements.orderConfirmation.classList.remove('hidden');
      elements.orderConfirmation.classList.add('active');
    }
  }

  // ========== CHECKOUT FUNCTIONS ==========
  function processCheckout() {
    if (!elements.checkoutForm) return false;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!name || !email || !phone || !address) {
      showToast('Vui lòng điền đầy đủ thông tin!');
      return false;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      showToast('Email không hợp lệ!');
      return false;
    }

    if (!/^\d{10,11}$/.test(phone)) {
      showToast('Số điện thoại không hợp lệ!');
      return false;
    }

    return true;
  }

  // ========== SLIDER FUNCTIONS ==========
  function initSlider() {
    if (!elements.bannerSlider) return;

    slides = document.querySelectorAll(".slide");
    if (slides.length === 0) return;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove("active");
        if (i === index) slide.classList.add("active");
      });
    }

    window.changeSlide = function(n) {
      slideIndex = (slideIndex + n + slides.length) % slides.length;
      showSlide(slideIndex);
    };

    showSlide(slideIndex);
    setInterval(() => changeSlide(1), 5000);
  }

  // ========== UTILITY FUNCTIONS ==========
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }

  // ========== EVENT LISTENERS ==========
  function setupEventListeners() {
    if (elements.searchBtn && elements.searchInput) {
      elements.searchBtn.addEventListener('click', () => {
        const query = elements.searchInput.value.trim();
        if (query) searchProducts(query);
      });

      elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && elements.searchInput.value.trim()) {
          searchProducts(elements.searchInput.value.trim());
        }
      });
    }

    if (elements.productsGrid) {
      elements.productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-button')) {
          const name = e.target.getAttribute('data-name');
          const price = parseInt(e.target.getAttribute('data-price'));
          if (name && !isNaN(price)) {
            addToCart(name, price, 'images/Viettel store/default-product.jpg');
            showCart();
          }
        } else if (e.target.classList.contains('view-detail') || e.target.classList.contains('product-name')) {
          const id = parseInt(e.target.getAttribute('data-id'));
          showProductDetail(id);
        }
      });
    }

    if (elements.buyButtons) {
      elements.buyButtons.forEach(button => {
        button.addEventListener('click', () => {
          const name = button.getAttribute('data-name');
          const price = parseInt(button.getAttribute('data-price'));
          if (name && !isNaN(price)) {
            addToCart(name, price, 'images/Viettel store/default-product.jpg');
            showCart();
          }
        });
      });
    }

    if (elements.cartLink) {
      elements.cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        showCart();
      });
    }

    if (elements.clearCartBtn) {
      elements.clearCartBtn.addEventListener('click', clearCart);
    }

    if (elements.proceedButton) {
      elements.proceedButton.addEventListener('click', () => {
        if (cart.length === 0) {
          showToast("Giỏ hàng trống!");
          return;
        }
        if (elements.checkoutSection) {
          elements.checkoutSection.classList.add('active');
          elements.checkoutSection.style.display = 'block';
          elements.checkoutSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    if (elements.checkoutForm) {
      elements.checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (processCheckout()) {
          if (elements.checkoutSection) {
            elements.checkoutSection.classList.remove('active');
            elements.checkoutSection.style.display = 'none';
          }
          if (elements.paymentSection) {
            elements.paymentSection.style.display = "block";
            elements.paymentSection.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    }

    if (elements.payButton) {
      elements.payButton.addEventListener('click', (event) => {
        event.preventDefault();
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const names = cart.map(item => item.name).join(", ");
        processPayment(total, names);
        clearCart();
      });
    }

    if (elements.backToShopBtn) {
      elements.backToShopBtn.addEventListener('click', () => {
        if (elements.orderConfirmation) {
          elements.orderConfirmation.classList.add('hidden');
          elements.orderConfirmation.classList.remove('active');
        }
        if (elements.paymentSection) {
          elements.paymentSection.style.display = "none";
        }
        if (elements.cartSection) {
          elements.cartSection.style.display = "none";
        }
        clearCart();
      });
    }

    if (elements.closeModal) {
      elements.closeModal.addEventListener('click', () => {
        if (elements.productModal) elements.productModal.classList.remove('active');
        if (elements.checkoutSection) {
          elements.checkoutSection.classList.remove('active');
          elements.checkoutSection.style.display = 'none';
        }
        if (elements.orderConfirmation) elements.orderConfirmation.classList.remove('active');
      });
    }

    if (elements.cartItemsBody) {
      elements.cartItemsBody.addEventListener('input', (e) => {
        if (e.target.classList.contains('quantity-input')) {
          const index = parseInt(e.target.dataset.index);
          updateQuantity(index, e.target.value);
        }
      });

      elements.cartItemsBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
          const index = parseInt(e.target.dataset.index);
          removeFromCart(index);
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal') && e.target === elements.productModal) {
        elements.productModal.classList.remove('active');
      }
      if (e.target.classList.contains('modal') && e.target === elements.checkoutSection) {
        elements.checkoutSection.classList.remove('active');
        elements.checkoutSection.style.display = 'none';
      }
      if (e.target.classList.contains('modal') && e.target === elements.orderConfirmation) {
        elements.orderConfirmation.classList.remove('active');
      }
    });
  }

  // Khởi chạy ứng dụng
  init();
});