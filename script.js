// Product data
const products = [
    {
        id: 1,
        name: "Chocolate Cake",
        price: 29.99,
        image: "https://thumbs.dreamstime.com/b/decadent-dark-chocolate-lava-cake-fresh-raspberries-vintage-aesthetic-classic-porcelain-tableware-no-blur-chaos-ar-v-job-366535007.jpg",
        description: "Rich chocolate cake with ganache"
    },
    {
        id: 2,
        name: "Doughnut",
        price: 3.99,
        image: "https://www.connoisseurusveg.com/wp-content/uploads/2023/02/vegan-baked-doughnuts-sq-500x375.jpg",
        description: "Buttery and flaky doughnut"
    },
    {
        id: 3,
        name: "Cheesecake",
        price: 6.99,
        image: "https://www.simplyrecipes.com/thmb/QAY2WlJ6xMQMY6vrLVrlgZe7sfk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Perfect-Cheesecake-LEAD-6-97a8cb3a60c24903b883c1d5fb5a69d3.jpg",
        description: "Indulgence and everybite"
    },
    {
        id: 4,
        name: "Cupcakes",
        price: 3.50,
        image: "https://www.livewellbakeoften.com/wp-content/uploads/2021/06/Red-Velvet-Cupcakes-3-New-copy-500x375.jpg",
        description: "Assorted flavored cupcakes"
    }
];
// Cart state
let cart = [];
// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartModal = document.getElementById('cart-modal');
const orderModal = document.getElementById('order-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
// Navigation Toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
// Close navigation on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});
// Render products
function renderProducts() {
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn" onclick="addToCart({product.id}Rs.)">Add to Cart</button>
            </div>
        </div>
    `).join('');
}
// Add to cart
window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    renderCart();
};
// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}
// Render cart
function renderCart() {
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" width="50">
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div>
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}
// Update quantity
window.updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
        updateCartCount();
        renderCart();
    }
};
// Remove from cart
window.removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
};
// Cart modal controls
document.querySelector('.cart-link').addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'block';
});
document.getElementById('close-cart').addEventListener('click', () => {
    cartModal.style.display = 'none';
});
// Checkout process
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    cartModal.style.display = 'none';
    orderModal.style.display = 'block';
});
document.getElementById('close-order').addEventListener('click', () => {
    orderModal.style.display = 'none';
});
// Handle order submission
document.getElementById('order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
        customer: {
            name: formData.get('name'),
            email: formData.get('email'),
            address: formData.get('address'),
            phone: formData.get('phone')
        },
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    // Here you would typically send this to a server
    console.log('Order submitted:', orderDetails);
    alert('Thank you for your order! We will contact you shortly.');  
    // Reset cart and close modal
    cart = [];
    updateCartCount();
    orderModal.style.display = 'none';
});
// Initialize
renderProducts();