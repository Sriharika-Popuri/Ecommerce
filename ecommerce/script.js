const products = [
    {
        id: 1,
        name: "Handmade crafts",
        price: 3000,
        image: "image.jpeg" 
    },
    {
        id: 2,
        name: "Handmade Molinillo",
        price: 2500,
        image: "2.webp" 
    },
    {
        id: 3,
        name: "Wooden Toys",
        price: 3500,
        image: "3.webp" 
    },
    {
        id: 4,
        name: "Handmade Frame",
        price: 1500,
        image: "4.webp" 
    },
    {
        id: 5,
        name: "Handmade Painting",
        price: 5000,
        image: "5.jpg" 
    },
    {
        id: 6,
        name: "Handmade Woodworks",
        price: 3500,
        image: "6.webp" 
    },
    {
        id: 7,
        name: "Handmade Frameworks",
        price: 1500,
        image: "7.webp"
    },
    {
        id: 8,
        name: "Handmade Necklace",
        price: 5000,
        image: "8.jpeg" 
    },

];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return; 
    productList.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = "col-md-4 col-lg-3";
        productCard.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">$${product.price.toFixed(2)}</p>
                    <button class="btn btn-primary mt-auto" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
});

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    showToast(`${product.name} has been added to your cart.`);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return; 

    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = count;
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (!cartItems || !cartTotal) return; 

    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = `<tr><td colspan="5" class="text-center">Your cart is empty.</td></tr>`;
        cartTotal.textContent = '0';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <input type="number" min="1" value="${item.quantity}" class="form-control quantity-input" data-id="${item.id}">
            </td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        cartItems.appendChild(row);
    });

    cartTotal.textContent = total.toFixed(2);

    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const newQuantity = parseInt(e.target.value);
            if (newQuantity < 1) {
                e.target.value = 1;
                return;
            }
            const cartItem = cart.find(item => item.id === id);
            if (cartItem) {
                cartItem.quantity = newQuantity;
                saveCart();
                renderCart();
                updateCartCount();
            }
        });
    });
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    updateCartCount();
}

function showToast(message) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-primary border-0';
    toast.role = 'alert';
    toast.ariaLive = 'assertive';
    toast.ariaAtomic = 'true';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

document.getElementById('cart-button').addEventListener('click', () => {
    renderCart();
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
});

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
});
