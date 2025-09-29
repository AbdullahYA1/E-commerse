// M3mol - Premium Bakery JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
       // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // DOM elements
    const productsGrid = document.getElementById('productsGrid');
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const totalAmount = document.getElementById('totalAmount');
    const cartTotal = document.getElementById('cartTotal');
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const newsletterForm = document.getElementById('newsletterForm');

    // Render products
    function renderProducts() {
        if (productsGrid) {
            productsGrid.innerHTML = products.map(product => `
                <div class="product-card fade-in">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <button class="add-to-cart" onclick="addToCart(${product.id})" data-translate="addToCart">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `).join('');
            
            // Update translations for dynamically created elements
            if (window.updateTranslations) {
                window.updateTranslations();
            }
        }
    }

    // Add to cart
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        updateCart();
        const translatedMessage = `${product.name} ${window.getTranslation ? window.getTranslation('productAdded') : 'added to cart!'}`;
        showToast(translatedMessage);
    };

    // Show toast notification
    function showToast(message) {
        const toastElement = document.getElementById('cartToast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toastElement && toastMessage) {
            toastMessage.innerHTML = `<i class="fa fa-check-circle me-2"></i>${message}`;
            
            // Check if Bootstrap is available
            if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
                const toast = new bootstrap.Toast(toastElement, {
                    autohide: true,
                    delay: 3000
                });
                toast.show();
            } else {
                console.error('Bootstrap not available or Toast class not found');
                // Fallback: show a simple alert
                alert(message);
            }
        } else {
            console.error('Toast elements not found in DOM');
            // Fallback: show a simple alert
            alert(message);
        }
    }

    // Remove from cart
    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    };

    // Update quantity
    window.updateQuantity = function(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                updateCart();
            }
        }
    };

    // Update cart display
    function updateCart() {
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) cartCount.textContent = totalItems;
        
        // Update cart items
        if (cartItems) {
            if (cart.length === 0) {
                const emptyMessage = window.getTranslation ? window.getTranslation('cartEmpty') : 'Your cart is empty';
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fa fa-shopping-bag"></i>
                        <p>${emptyMessage}</p>
                    </div>
                `;
                if (cartTotal) cartTotal.style.display = 'none';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                // Update total
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                if (totalAmount) totalAmount.textContent = total.toFixed(2);
                if (cartTotal) cartTotal.style.display = 'block';
            }
        }
    }

    // Make updateCart globally accessible for translations
    window.updateCart = updateCart;

    // Cart sidebar controls
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (cartSidebar) cartSidebar.classList.add('open');
            if (cartOverlay) cartOverlay.classList.add('open');
        });
    }

    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', () => {
            if (cartSidebar) cartSidebar.classList.remove('open');
            if (cartOverlay) cartOverlay.classList.remove('open');
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            if (cartSidebar) cartSidebar.classList.remove('open');
            if (cartOverlay) cartOverlay.classList.remove('open');
        });
    }

    // Search functionality
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (searchOverlay) {
                searchOverlay.style.display = 'flex';
                if (searchInput) searchInput.focus();
            }
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', () => {
            if (searchOverlay) {
                searchOverlay.style.display = 'none';
                if (searchInput) searchInput.value = '';
            }
        });
    }

    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.style.display = 'none';
                if (searchInput) searchInput.value = '';
            }
        });
    }

    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input').value;
            const successMessage = window.getTranslation ? window.getTranslation('subscribeSuccess') : 'Thank you for subscribing to our newsletter!';
            showToast(successMessage);
            e.target.reset();
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        }
    });

    // Initialize
    renderProducts();
    updateCart();
});