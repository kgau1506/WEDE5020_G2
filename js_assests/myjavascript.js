lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true,
    'fadeDuration': 300,
});

// Global cart state
// ===== DEBUG VERSION - Shows where the problem is =====
document.addEventListener("DOMContentLoaded", function() {
    
    console.log("🔍 Debug: DOM loaded");
    
    // Check for search input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        console.log("✅ Search input found");
        searchInput.addEventListener("keyup", function() {
            console.log("🔍 Searching for:", this.value);
            const filter = this.value.toLowerCase().trim();
            const cards = document.querySelectorAll(".product-card");
            cards.forEach(function(card) {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(filter) ? "block" : "none";
            });
        });
    } else {
        console.error("❌ Search input NOT found!");
    }
    
    // Check for add to cart buttons
    console.log("🔍 Looking for add-to-cart buttons...");
    const addToCartButtons = document.querySelectorAll(".cart-btn");
    console.log("📊 Found " + addToCartButtons.length + " buttons");
    
    if (addToCartButtons.length === 0) {
        console.error("❌ No buttons found! Check your HTML:");
        console.log("Your buttons should look like this:");
        console.log('<button class="cart-btn">Add to Cart</button>');
        return;
    }
    
    // Log each button found
    addToCartButtons.forEach(function(button, index) {
        console.log("📌 Button " + (index + 1) + ":", button);
        console.log("   Text:", button.textContent);
        console.log("   Classes:", button.className);
        
        button.addEventListener("click", function(event) {
            console.log("🖱️ Button " + (index + 1) + " was CLICKED!");
            event.preventDefault();
            
            // Find product card
            const productCard = this.closest(".product-card");
            console.log("📦 Product card:", productCard);
            
            if (productCard) {
                const productName = productCard.querySelector(".product-name");
                const name = productName ? productName.textContent.trim() : "Unknown Product";
                console.log("✅ Adding to cart:", name);
                alert(name + " added to cart!");
            } else {
                console.error("❌ Could not find product card!");
                alert("Error: Product card not found!");
            }
        });
    });
    
    console.log("✅ Debug complete. Try clicking a button!");
});

// ===== SIMPLE CART WITH COUNT & TOTAL =====
document.addEventListener("DOMContentLoaded", function() {
    
    let cart = [];
    
    // Add to Cart
    document.querySelectorAll(".cart-btn").forEach(function(button) {
        button.addEventListener("click", function(e) {
            e.preventDefault();
            
            const card = this.closest(".product-card");
            const name = card.querySelector(".product-name") 
                ? card.querySelector(".product-name").textContent.trim() 
                : "Product";
            const priceText = card.querySelector(".product-price") 
                ? card.querySelector(".product-price").textContent.trim() 
                : "R0.00";
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            const id = card.dataset.productId || Date.now().toString();
            
            // Check if product exists
            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            
            updateCart();
            showNotification(`${name} added!`);
        });
    });
    
    // Update Cart Display
    function updateCart() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        document.getElementById("cartCount").textContent = totalItems;
        document.getElementById("cartTotal").textContent = totalPrice.toFixed(2);
        
        // Show/hide cart count
        document.getElementById("cartCount").style.display = totalItems > 0 ? "inline-block" : "none";
        
        // Update items list
        const itemsDiv = document.getElementById("cartItems");
        if (itemsDiv) {
            if (cart.length === 0) {
                itemsDiv.innerHTML = '<p style="color: #999;">Your cart is empty</p>';
            } else {
                itemsDiv.innerHTML = cart.map(item => 
                    `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>`
                ).join('');
            }
        }
    }
    
    // Notification
    function showNotification(message) {
        const notif = document.createElement("div");
        notif.textContent = "✅ " + message;
        notif.style.cssText = "position:fixed;bottom:20px;right:20px;background:#4CAF50;color:white;padding:15px 25px;border-radius:8px;z-index:9999;";
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }
    
    // Initialize
    updateCart();
});
// ===== COMPLETE SHOPPING CART WITH REMOVE =====
document.addEventListener("DOMContentLoaded", function() {
    
    // ===== CART STATE =====
    let cart = [];
    
    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.getElementById("searchInput");
    
    if (searchInput) {
        searchInput.addEventListener("keyup", function() {
            const filter = searchInput.value.toLowerCase().trim();
            const cards = document.querySelectorAll(".product-card");
            
            cards.forEach(function(card) {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(filter) ? "block" : "none";
            });
        });
    }
    
    // ===== ADD TO CART =====
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    
    addToCartButtons.forEach(function(button) {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            
            const productCard = this.closest(".product-card");
            
            if (!productCard) {
                console.error("Product card not found!");
                return;
            }
            
            const productName = productCard.querySelector(".product-name") 
                ? productCard.querySelector(".product-name").textContent.trim() 
                : "Product";
                
            const productPriceText = productCard.querySelector(".product-price") 
                ? productCard.querySelector(".product-price").textContent.trim() 
                : "$0.00";
            
            const productPrice = parseFloat(productPriceText.replace(/[^0-9.]/g, ''));
            const productId = productCard.dataset.productId || "product-" + Date.now();
            
            const existingProduct = cart.find(item => item.id === productId);
            
            if (existingProduct) {
                existingProduct.quantity += 1;
                showNotification(`${productName} quantity updated! 📦`);
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
                showNotification(`${productName} added to cart! 🛒`);
            }
            
            updateCartDisplay();
            console.log("Current Cart:", cart);
        });
    });
    
    // ===== REMOVE FUNCTIONS =====
    
    // 1. Remove specific item
    function removeItem(productId) {
        const product = cart.find(item => item.id === productId);
        if (product) {
            cart = cart.filter(item => item.id !== productId);
            showNotification(`${product.name} removed from cart! 🗑️`, "error");
            updateCartDisplay();
            console.log("Removed:", product.name);
        }
    }
    
    // 2. Decrease quantity
    function decreaseQuantity(productId) {
        const product = cart.find(item => item.id === productId);
        if (product) {
            if (product.quantity > 1) {
                product.quantity -= 1;
                showNotification(`${product.name} quantity decreased`, "info");
            } else {
                cart = cart.filter(item => item.id !== productId);
                showNotification(`${product.name} removed from cart! 🗑️`, "error");
            }
            updateCartDisplay();
        }
    }
    
    // 3. Increase quantity
    function increaseQuantity(productId) {
        const product = cart.find(item => item.id === productId);
        if (product) {
            product.quantity += 1;
            showNotification(`${product.name} quantity increased`, "info");
            updateCartDisplay();
        }
    }
    
    // 4. Clear entire cart
    function clearCart() {
        if (cart.length === 0) {
            showNotification("Cart is already empty!", "info");
            return;
        }
        
        if (confirm("Are you sure you want to clear your entire cart?")) {
            cart = [];
            showNotification("Cart cleared! 🗑️", "error");
            updateCartDisplay();
            console.log("Cart cleared");
        }
    }
    
    // ===== UPDATE CART DISPLAY =====
    function updateCartDisplay() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Update cart count
        const cartCountElement = document.getElementById("cartCount");
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? "inline-block" : "none";
        }
        
        // Update cart total
        const cartTotalElement = document.getElementById("cartTotal");
        if (cartTotalElement) {
            cartTotalElement.textContent = `$${totalPrice.toFixed(2)}`;
        }
        
        // Update cart items list
        const cartItemsElement = document.getElementById("cartItems");
        if (cartItemsElement) {
            if (cart.length === 0) {
                cartItemsElement.innerHTML = `
                    <div class="empty-cart">
                        <p>🛒 Your cart is empty</p>
                        <p style="font-size: 14px; color: #999;">Start adding some products!</p>
                    </div>
                `;
            } else {
                cartItemsElement.innerHTML = cart.map(function(item) {
                    const itemTotal = (item.price * item.quantity).toFixed(2);
                    return `
                        <div class="cart-item" data-id="${item.id}">
                            <div class="cart-item-info">
                                <span class="cart-item-name">${item.name}</span>
                                <span class="cart-item-price">$${item.price.toFixed(2)} each</span>
                            </div>
                            <div class="cart-item-controls">
                                <button class="cart-decrease" data-id="${item.id}" title="Remove one">−</button>
                                <span class="cart-item-quantity">${item.quantity}</span>
                                <button class="cart-increase" data-id="${item.id}" title="Add one">+</button>
                                <button class="cart-remove" data-id="${item.id}" title="Remove item">✕</button>
                            </div>
                            <span class="cart-item-total">$${itemTotal}</span>
                        </div>
                    `;
                }).join('');
                
                // Add event listeners for cart controls
                document.querySelectorAll(".cart-increase").forEach(function(btn) {
                    btn.addEventListener("click", function() {
                        const id = this.dataset.id;
                        increaseQuantity(id);
                    });
                });
                
                document.querySelectorAll(".cart-decrease").forEach(function(btn) {
                    btn.addEventListener("click", function() {
                        const id = this.dataset.id;
                        decreaseQuantity(id);
                    });
                });
                
                document.querySelectorAll(".cart-remove").forEach(function(btn) {
                    btn.addEventListener("click", function() {
                        const id = this.dataset.id;
                        removeItem(id);
                    });
                });
            }
        }
        
        // Update cart summary
        updateCartSummary(totalItems, totalPrice);
    }
    
    // ===== UPDATE CART SUMMARY =====
    function updateCartSummary(totalItems, totalPrice) {
        const summaryElement = document.getElementById("cartSummary");
        if (summaryElement) {
            const shipping = totalItems > 0 ? 5.00 : 0;
            const grandTotal = totalPrice + shipping;
            
            summaryElement.innerHTML = `
                <div class="cart-summary">
                    <h4>📊 Order Summary</h4>
                    <div class="summary-row">
                        <span>Items (${totalItems})</span>
                        <span>$${totalPrice.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span>${shipping > 0 ? '$' + shipping.toFixed(2) : '$0.00'}</span>
                    </div>
                    <div class="summary-row total">
                        <span><strong>Total</strong></span>
                        <span><strong>$${grandTotal.toFixed(2)}</strong></span>
                    </div>
                    ${totalItems > 0 ? `
                        <div style="display: flex; gap: 10px; margin-top: 15px;">
                            <button class="checkout-btn" style="flex: 1;">Proceed to Checkout</button>
                            <button class="clear-cart-btn" id="clearCart">🗑️ Clear Cart</button>
                        </div>
                    ` : ''}
                </div>
            `;
            
            // Add clear cart event listener
            const clearBtn = document.getElementById("clearCart");
            if (clearBtn) {
                clearBtn.addEventListener("click", function() {
                    clearCart();
                });
            }
            
            // Add checkout event listener
            const checkoutBtn = document.querySelector(".checkout-btn");
            if (checkoutBtn) {
                checkoutBtn.addEventListener("click", function() {
                    if (cart.length > 0) {
                        alert(`🛒 Checkout\n\nItems: ${totalItems}\nTotal: $${(totalPrice + shipping).toFixed(2)}\n\nThank you for your purchase!`);
                    }
                });
            }
        }
    }
    
    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = "success") {
        const existing = document.querySelector(".cart-notification");
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement("div");
        notification.className = "cart-notification";
        notification.textContent = message;
        
        const colors = {
            success: "#4CAF50",
            info: "#2196F3",
            error: "#f44336",
            warning: "#FF9800"
        };
        
        notification.style.position = "fixed";
        notification.style.bottom = "20px";
        notification.style.right = "20px";
        notification.style.backgroundColor = colors[type] || colors.success;
        notification.style.color = "white";
        notification.style.padding = "15px 25px";
        notification.style.borderRadius = "8px";
        notification.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
        notification.style.zIndex = "9999";
        notification.style.fontSize = "16px";
        notification.style.fontWeight = "500";
        notification.style.animation = "slideInUp 0.3s ease";
        notification.style.maxWidth = "350px";
        
        document.body.appendChild(notification);
        
        setTimeout(function() {
            notification.style.animation = "slideOutDown 0.3s ease";
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // ===== ADD CSS ANIMATIONS =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOutDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize cart display
    updateCartDisplay();
    
    console.log("🛒 Shopping cart with remove functionality initialized!");
});

// Enquiry form validation

    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('open');
        });
    }

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links li a').forEach(function(link) {
        link.addEventListener('click', function() {
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
            }
        });
    });

    // ===== FORM VALIDATION =====
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectSelect = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const prioritySelect = document.getElementById('priority');
    const termsCheck = document.getElementById('terms');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');
    const priorityError = document.getElementById('priorityError');
    const termsError = document.getElementById('termsError');
    const successMsg = document.getElementById('successMessage');

    // lightbox
    const overlay = document.getElementById('lightboxOverlay');
    const closeBtn = document.getElementById('lightboxCloseBtn');
    const lightboxDetails = document.getElementById('lightboxDetails');

    // ── validation functions ──
    function validateName() {
        const val = nameInput.value.trim();
        if (val === '') {
            nameError.textContent = 'Full name is required.';
            return false;
        } else if (val.length < 2) {
            nameError.textContent = 'Name must be at least 2 characters.';
            return false;
        } else {
            nameError.textContent = '';
            return true;
        }
    }

    function validateEmail() {
        const val = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (val === '') {
            emailError.textContent = 'Email address is required.';
            return false;
        } else if (!emailPattern.test(val)) {
            emailError.textContent = 'Please enter a valid email address.';
            return false;
        } else {
            emailError.textContent = '';
            return true;
        }
    }

    function validatePhone() {
        const val = phoneInput.value.trim();
        if (val === '') {
            phoneError.textContent = '';
            return true;
        }
        const phonePattern = /^[\+\d\s\-\(\)]{7,20}$/;
        if (!phonePattern.test(val)) {
            phoneError.textContent = 'Enter a valid phone number.';
            return false;
        } else {
            phoneError.textContent = '';
            return true;
        }
    }

    function validateSubject() {
        const val = subjectSelect.value;
        if (val === '' || val === 'Select a topic') {
            subjectError.textContent = 'Please select a subject.';
            return false;
        } else {
            subjectError.textContent = '';
            return true;
        }
    }

    function validateMessage() {
        const val = messageInput.value.trim();
        if (val === '') {
            messageError.textContent = 'Message is required.';
            return false;
        } else if (val.length < 10) {
            messageError.textContent = 'Message must be at least 10 characters.';
            return false;
        } else {
            messageError.textContent = '';
            return true;
        }
    }

    function validatePriority() {
        priorityError.textContent = '';
        return true;
    }

    function validateTerms() {
        if (!termsCheck.checked) {
            termsError.textContent = 'You must agree to the terms.';
            return false;
        } else {
            termsError.textContent = '';
            return true;
        }
    }

    // ── real‑time feedback ──
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    phoneInput.addEventListener('blur', validatePhone);
    subjectSelect.addEventListener('blur', validateSubject);
    messageInput.addEventListener('blur', validateMessage);
    termsCheck.addEventListener('change', validateTerms);

    nameInput.addEventListener('input', function() {
        if (nameError.textContent) validateName();
    });
    emailInput.addEventListener('input', function() {
        if (emailError.textContent) validateEmail();
    });
    phoneInput.addEventListener('input', function() {
        if (phoneError.textContent) validatePhone();
    });
    subjectSelect.addEventListener('change', function() {
        if (subjectError.textContent) validateSubject();
    });
    messageInput.addEventListener('input', function() {
        if (messageError.textContent) validateMessage();
    });
    prioritySelect.addEventListener('change', validatePriority);
 