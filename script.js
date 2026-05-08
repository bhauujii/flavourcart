document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let cart = [];
    let currentUser = null;
    
    
    // Check localStorage for cart
    if(localStorage.getItem('flavour_cart')) {
        cart = JSON.parse(localStorage.getItem('flavour_cart'));
    }
    if(localStorage.getItem('flavour_user')) {
        currentUser = JSON.parse(localStorage.getItem('flavour_user'));
    }

    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartCountElements = document.querySelectorAll('.cart-count'); 
    const modalCartCount = document.getElementById('modalCartCount');
    const checkoutModal = document.getElementById('checkoutModal');
    const cartView = document.getElementById('cartView');
    const addressForm = document.getElementById('addressForm');
    const orderSuccess = document.getElementById('orderSuccess');
    const cartSummary = document.getElementById('cartSummary');
    const comboSuggestion = document.getElementById('comboSuggestion');

    // Product Database for Search, Recipes, and Product Pages
    const productsDB = [
        { id: '1', name: 'Kashmiri Red Chili', price: 299, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', desc: 'Vibrant color, mild heat. Perfect for adding a rich red hue to your curries without overwhelming spice.', keywords: ['spicy', 'powder', 'red', 'mirchi', 'chili'] },
        { id: '2', name: 'Green Cardamom', price: 599, image: 'https://images.pexels.com/photos/6086300/pexels-photo-6086300.jpeg?auto=compress&cs=tinysrgb&w=500', desc: 'The queen of spices. Sweet and aromatic, ideal for desserts, chai, and rich gravies.', keywords: ['sweet', 'whole', 'elaichi', 'green'] },
        { id: '3', name: 'Lakadong Turmeric', price: 349, image: 'https://images.pexels.com/photos/4198715/pexels-photo-4198715.jpeg?auto=compress&cs=tinysrgb&w=500', desc: 'High Curcumin content turmeric sourced from Meghalaya. Great for immunity and golden milk.', keywords: ['yellow', 'powder', 'haldi', 'immunity', 'health'] },
        { id: '4', name: 'Royal Garam Masala', price: 449, image: 'https://images.pexels.com/photos/3040873/pexels-photo-3040873.jpeg?auto=compress&cs=tinysrgb&w=500', desc: 'Aromatic 12-spice blend crafted using traditional stone grinding methods.', keywords: ['blend', 'spicy', 'powder', 'mix'] },
        { id: '5', name: 'Cumin Seeds (Jeera)', price: 199, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', desc: 'Earthy, warm and aromatic. Essential for tempering dals and curries.', keywords: ['cumin', 'jeera', 'seed', 'earthy'] },
        { id: '6', name: 'Coriander Powder', price: 149, image: 'https://images.unsplash.com/photo-1621258625530-9b884db419c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', desc: 'Sweet and citrusy undertones. A staple thickener for Indian gravies.', keywords: ['dhania', 'powder', 'coriander', 'sweet'] },
        { id: '7', name: 'Black Pepper', price: 399, image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', desc: 'The king of spices, sharp & pungent. Grown in the pristine estates of Kerala.', keywords: ['black', 'pepper', 'kali', 'mirch', 'spicy'] },
        { id: '8', name: 'Cinnamon Sticks', price: 249, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', desc: 'Sweet, woody flavor profile. Perfect for biryanis, desserts, and spiced teas.', keywords: ['dalchini', 'stick', 'sweet', 'wood'] },
        { id: '9', name: 'Whole Cloves (Laung)', price: 299, image: 'https://images.pexels.com/photos/4198715/pexels-photo-4198715.jpeg?auto=compress&cs=tinysrgb&w=500', desc: 'Intensely aromatic and sweet. Perfect for curries, biryanis, and chai.', keywords: ['clove', 'laung', 'whole', 'sweet'] },
        { id: '10', name: 'Star Anise', price: 349, image: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', desc: 'Beautiful star-shaped spice with a strong licorice flavor. Essential for biryani.', keywords: ['star', 'anise', 'biryani', 'whole'] },
        { id: '11', name: 'Roasted Cumin Powder', price: 179, image: 'https://images.unsplash.com/photo-1621258625530-9b884db419c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', desc: 'Earthy, warm, and roasted to perfection. Enhances any gravy or raita.', keywords: ['cumin', 'jeera', 'powder', 'roasted'] }
    ];

    // --- Core Functions ---

    window.openCart = function () {
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showCartView();
        updateCartUI();
    };

    window.closeCart = function () {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    window.addToCart = function (btn) {
        const card = btn.closest('.product-card');
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = parseFloat(card.dataset.price);

        addToCartLogic(id, name, price);

        // Visual Feedback
        const originalText = btn.textContent;
        btn.textContent = "Added!";
        btn.style.backgroundColor = "#B90E31";
        btn.style.color = "white";
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = "";
            btn.style.color = "";
        }, 1000);
    }

    function addToCartLogic(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.qty++;
        } else {
            cart.push({ id, name, price, qty: 1 });
        }
        saveCart();
        updateCartUI();
    }

    window.addToCartFromPP = function() {
        if(currentReviewProductId) {
            const p = productsDB.find(prod => prod.id === currentReviewProductId);
            if(p) {
                addToCartLogic(p.id, p.name, p.price);
                const btn = document.querySelector('.pp-actions .btn-primary');
                const originalText = btn.textContent;
                btn.textContent = "Added to Cart!";
                btn.style.backgroundColor = "#B90E31";
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = "";
                }, 1000);
            }
        }
    }

    // Recipe feature
    window.addRecipeToCart = function(itemIds) {
        let addedCount = 0;
        itemIds.forEach(id => {
            const product = productsDB.find(p => p.id === id);
            if(product) {
                addToCartLogic(product.id, product.name, product.price);
                addedCount++;
            }
        });
        alert(`Added ${addedCount} ingredients to cart!`);
        openCart();
    }

    function saveCart() {
        localStorage.setItem('flavour_cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCountElements.forEach(el => el.textContent = totalQty);
        if (modalCartCount) modalCartCount.textContent = `(${totalQty})`;

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center" style="padding: 2rem; color: #999;">Your cart is empty.</p>';
            cartSummary.style.display = 'none';
            comboSuggestion.style.display = 'none';
        } else {
            cartSummary.style.display = 'block';
            cart.forEach(item => {
                const itemTotal = item.price * item.qty;
                total += itemTotal;

                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <span class="item-price">₹${itemTotal}</span>
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });

            // Combo Suggestion Logic
            checkCombos();
        }

        cartTotalElement.textContent = `₹${total}`;
    }

    // Combo Suggestions
    function checkCombos() {
        const hasChili = cart.some(i => i.id === '1');
        const hasTurmeric = cart.some(i => i.id === '3');
        const hasCardamom = cart.some(i => i.id === '2');

        if(hasChili && !hasTurmeric) {
            comboSuggestion.style.display = 'block';
            document.getElementById('comboText').textContent = "Add Lakadong Turmeric to complete your basic spices!";
            comboSuggestion.dataset.suggestId = '3';
        } else if (hasTurmeric && !hasChili) {
            comboSuggestion.style.display = 'block';
            document.getElementById('comboText').textContent = "Add Kashmiri Red Chili for that perfect color!";
            comboSuggestion.dataset.suggestId = '1';
        } else {
            comboSuggestion.style.display = 'none';
        }
    }

    window.addComboItem = function() {
        const suggestId = comboSuggestion.dataset.suggestId;
        const product = productsDB.find(p => p.id === suggestId);
        if(product) {
            addToCartLogic(product.id, product.name, product.price);
        }
    }

    window.updateQty = function (id, delta) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].qty += delta;
            if (cart[itemIndex].qty <= 0) {
                cart.splice(itemIndex, 1);
            }
            saveCart();
            updateCartUI();
        }
    }

    window.showAddressForm = function () {
        cartView.style.display = 'none';
        addressForm.style.display = 'block';
        orderSuccess.style.display = 'none';
    }

    window.showCartView = function () {
        cartView.style.display = 'block';
        addressForm.style.display = 'none';
        orderSuccess.style.display = 'none';
    }

    // Order tracking timer
    let trackingInterval;
    const paymentModal = document.getElementById('paymentModal');

    window.placeOrder = function (e) {
        e.preventDefault();
        
        const address = addressForm.querySelector('textarea').value;
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        
        checkoutModal.classList.remove('active');
        paymentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        document.getElementById('pgPayableAmount').textContent = `₹${total}`;
        document.getElementById('pgPayBtn').textContent = `Pay ₹${total}`;
        document.getElementById('paymentAddressDisplay').innerHTML = `<p>${address}</p>`;
        
        if (currentUser) {
            document.getElementById('paymentUserName').textContent = currentUser.name;
            document.getElementById('paymentUserEmail').textContent = currentUser.email;
        } else {
            document.getElementById('paymentUserName').textContent = "Guest User";
            document.getElementById('paymentUserEmail').textContent = "Login to sync details";
        }
    }

    window.closePaymentModal = function() {
        paymentModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    window.selectPaymentMethod = function(element, viewId) {
        document.querySelectorAll('.pg-method').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
        
        document.querySelectorAll('.pg-view').forEach(el => el.style.display = 'none');
        document.getElementById(viewId).style.display = 'block';
    }

    window.processPayment = function() {
        const btn = document.getElementById('pgPayBtn');
        const originalText = btn.textContent;
        btn.textContent = "Processing...";
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            
            closePaymentModal();
            
            cart = []; 
            saveCart();
            updateCartUI();

            checkoutModal.classList.add('active');
            addressForm.style.display = 'none';
            cartView.style.display = 'none';
            orderSuccess.style.display = 'block';

            startOrderTracking();
        }, 2000);
    }

    function startOrderTracking() {
        document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.step-line').forEach(el => el.classList.remove('active'));
        document.getElementById('stepPlaced').classList.add('active');

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        document.getElementById('estDeliveryDate').textContent = deliveryDate.toDateString();

        let stage = 1; 
        
        if(trackingInterval) clearInterval(trackingInterval);

        trackingInterval = setInterval(() => {
            stage++;
            if(stage === 2) {
                document.getElementById('line1').classList.add('active');
                document.getElementById('stepPacked').classList.add('active');
            } else if (stage === 3) {
                document.getElementById('line2').classList.add('active');
                document.getElementById('stepShipped').classList.add('active');
            } else if (stage === 4) {
                document.getElementById('line3').classList.add('active');
                document.getElementById('stepDelivered').classList.add('active');
                clearInterval(trackingInterval);
            }
        }, 3000); 
    }

    // --- Smart Recommendations ---
    function initRecommendations() {
        const viewedIds = JSON.parse(localStorage.getItem('flavour_viewed')) || [];
        const recommendedGrid = document.getElementById('recommendedGrid');
        const recommendationsSection = document.getElementById('recommendations');
        
        if(viewedIds.length > 0) {
            recommendationsSection.style.display = 'block';
            const lastViewed = viewedIds[viewedIds.length - 1];
            const recProducts = productsDB.filter(p => p.id !== lastViewed).slice(0, 4); // Show up to 4
            
            let html = '';
            recProducts.forEach(p => {
                html += `
                    <div class="product-card" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
                        <div class="product-image" onclick="openProductPage('${p.id}')" style="cursor:pointer;">
                            <div class="img-placeholder" style="background-image: url('${p.image}')"></div>
                            <button class="add-to-cart-btn_overlay" onclick="event.stopPropagation(); addToCart(this)">Add to Cart</button>
                        </div>
                        <div class="product-info text-center">
                            <h3>${p.name}</h3>
                            <span class="price" style="font-weight:bold; color:var(--primary-color)">₹${p.price}</span>
                        </div>
                    </div>
                `;
            });
            recommendedGrid.innerHTML = html;
        }
    }
    initRecommendations();

    function trackProductView(id) {
        let viewed = JSON.parse(localStorage.getItem('flavour_viewed')) || [];
        if(!viewed.includes(id)) {
            viewed.push(id);
            if(viewed.length > 5) viewed.shift();
            localStorage.setItem('flavour_viewed', JSON.stringify(viewed));
        }
    }

    // --- Product Page Overlay & Reviews System ---
    let currentReviewProductId = null;
    const productPageOverlay = document.getElementById('productPageOverlay');
    const reviewsList = document.getElementById('reviewsList');
    const aiSummaryText = document.getElementById('aiSummaryText');
    const starRatingIcons = document.querySelectorAll('#starRating i');
    let selectedRating = 5;

    window.openProductPage = function(id) {
        const product = productsDB.find(p => p.id === id);
        if(!product) return;

        currentReviewProductId = id;
        
        // Populate Product Details
        document.getElementById('ppImage').src = product.image;
        document.getElementById('ppTitle').textContent = product.name;
        document.getElementById('ppPrice').textContent = `₹${product.price}`;
        document.getElementById('ppDesc').textContent = product.desc;

        productPageOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        trackProductView(id);
        renderReviews();
        generateRandomRecommendations(id);
    }

    window.closeProductPage = function() {
        productPageOverlay.classList.remove('active');
        document.body.style.overflow = '';
        initRecommendations(); // Update homepage recommendations based on what they just viewed
    }

    // Random Recommendations in Product Page
    function generateRandomRecommendations(excludeId) {
        const container = document.getElementById('ppRandomRecommendations');
        let available = productsDB.filter(p => p.id !== excludeId);
        
        // Shuffle array
        for (let i = available.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [available[i], available[j]] = [available[j], available[i]];
        }
        
        let selected = available.slice(0, 3); // Pick 3 random
        let html = '';
        selected.forEach(p => {
            html += `
                <div class="product-card" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
                    <div class="product-image" onclick="openProductPage('${p.id}')" style="cursor:pointer; height:200px;">
                        <div class="img-placeholder" style="background-image: url('${p.image}')"></div>
                        <button class="add-to-cart-btn_overlay" onclick="event.stopPropagation(); addToCart(this)">Add to Cart</button>
                    </div>
                    <div class="product-info text-center" style="padding:1rem;">
                        <h3 style="font-size:1.1rem;">${p.name}</h3>
                        <span class="price">₹${p.price}</span>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // Star Selection
    starRatingIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            selectedRating = parseInt(icon.getAttribute('data-val'));
            updateStars();
        });
    });

    function updateStars() {
        starRatingIcons.forEach(icon => {
            if(parseInt(icon.getAttribute('data-val')) <= selectedRating) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    }

    window.submitReview = function() {
        const text = document.getElementById('reviewTextInput').value;
        if(!text) return alert("Please write a review.");

        const review = {
            id: currentReviewProductId,
            rating: selectedRating,
            text: text,
            date: new Date().toLocaleDateString()
        };

        let allReviews = JSON.parse(localStorage.getItem('flavour_reviews')) || [];
        allReviews.push(review);
        localStorage.setItem('flavour_reviews', JSON.stringify(allReviews));

        document.getElementById('reviewTextInput').value = '';
        selectedRating = 5;
        updateStars();
        renderReviews();
    }

    function renderReviews() {
        let allReviews = JSON.parse(localStorage.getItem('flavour_reviews')) || [];
        let productReviews = allReviews.filter(r => r.id === currentReviewProductId);

        if(productReviews.length === 0) {
            reviewsList.innerHTML = '<p style="color:#999; text-align:center;">No reviews yet. Be the first!</p>';
            aiSummaryText.textContent = "Not enough data for AI summary.";
            document.getElementById('ppRating').innerHTML = `<i class="fas fa-star"></i> New`;
            return;
        }

        let totalStars = 0;
        let html = '';
        let texts = [];
        productReviews.forEach(r => {
            totalStars += r.rating;
            let starsHtml = '';
            for(let i=1; i<=5; i++) {
                starsHtml += i <= r.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
            }
            html += `
                <div class="review-item">
                    <div class="review-stars">${starsHtml} <span style="color:#999; font-size:0.8rem; margin-left:10px;">${r.date}</span></div>
                    <p style="margin:5px 0;">${r.text}</p>
                </div>
            `;
            texts.push(r.text.toLowerCase());
        });
        
        reviewsList.innerHTML = html;

        let avgRating = (totalStars / productReviews.length).toFixed(1);
        document.getElementById('ppRating').innerHTML = `<i class="fas fa-star"></i> ${avgRating} (${productReviews.length} reviews)`;

        // Simple AI Summary Logic
        generateAISummary(texts);
    }

    function generateAISummary(texts) {
        let positiveWords = ['good', 'great', 'awesome', 'excellent', 'amazing', 'authentic', 'pure', 'love', 'perfect', 'best'];
        let negativeWords = ['bad', 'poor', 'terrible', 'fake', 'worst'];
        
        let posCount = 0;
        let negCount = 0;

        texts.forEach(t => {
            positiveWords.forEach(w => { if(t.includes(w)) posCount++; });
            negativeWords.forEach(w => { if(t.includes(w)) negCount++; });
        });

        if(posCount > negCount && posCount > 0) {
            aiSummaryText.innerHTML = "Customers frequently praise the <strong>authenticity and high quality</strong> of this product.";
        } else if (negCount > posCount) {
            aiSummaryText.innerHTML = "Some customers have raised concerns about this product.";
        } else if (posCount === 0 && negCount === 0) {
            aiSummaryText.innerHTML = "Customers find this product satisfactory overall.";
        } else {
            aiSummaryText.innerHTML = "Reviews are mixed but lean towards a positive experience.";
        }
    }


    // --- Smart Search ---
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    window.openSearch = function() {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        searchInput.focus();
    }

    window.closeSearch = function() {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        searchInput.value = '';
        searchResults.innerHTML = '';
    }

    window.handleSearch = function() {
        const query = searchInput.value.toLowerCase().trim();
        if(!query) {
            searchResults.innerHTML = '';
            return;
        }

        const results = productsDB.filter(p => {
            if(p.name.toLowerCase().includes(query)) return true;
            for(let kw of p.keywords) {
                if(kw.includes(query)) return true;
            }
            return false;
        });

        if(results.length > 0) {
            let html = '';
            results.forEach(p => {
                html += `
                    <div class="search-item" onclick="viewFromSearch('${p.id}')">
                        <div style="font-size: 1.5rem; color: var(--primary-color);"><i class="fas fa-leaf"></i></div>
                        <div>
                            <h4 style="margin-bottom:0;">${p.name}</h4>
                            <span style="color:#666; font-size:0.9rem;">₹${p.price}</span>
                        </div>
                    </div>
                `;
            });
            searchResults.innerHTML = html;
        } else {
            searchResults.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">No spices found for that keyword.</p>';
        }
    }

    window.viewFromSearch = function(id) {
        closeSearch();
        openProductPage(id);
    }


    // Category Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');

            products.forEach(product => {
                if(!product.hasAttribute('data-category')) return; 

                if (filterValue === 'all' || product.getAttribute('data-category') === filterValue) {
                    product.style.display = 'block';
                    product.style.opacity = '0';
                    setTimeout(() => product.style.opacity = '1', 50);
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (navLinks.style.display === 'flex' && window.innerWidth < 768) {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'white';
                navLinks.style.padding = '20px';
            }
        });
    }

    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
        }
    });

    const authModal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    window.openAuthModal = function () {
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        switchAuthMode('login'); 
    }

    window.closeAuthModal = function () {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    window.switchAuthMode = function (mode) {
        if (mode === 'login') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        }
    }

    window.handleLogin = function (e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = "Logging in...";
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            
            currentUser = { name: email.split('@')[0], email: email };
            localStorage.setItem('flavour_user', JSON.stringify(currentUser));
            
            closeAuthModal();
            updateUserIcon(true);
            alert("Welcome back! You have successfully logged in.");
        }, 1500);
    }

    window.handleSignup = function (e) {
        e.preventDefault();
        const name = e.target.querySelector('input[type="text"]').value;
        const email = e.target.querySelector('input[type="email"]').value;
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = "Creating Account...";
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            
            currentUser = { name: name, email: email };
            localStorage.setItem('flavour_user', JSON.stringify(currentUser));
            
            closeAuthModal();
            updateUserIcon(true);
            alert("Account created successfully! Welcome to Flavour Cart.");
        }, 1500);
    }

    function updateUserIcon(isLoggedIn) {
        const userIcon = document.querySelector('.user-icon i');
        if (isLoggedIn) {
            userIcon.classList.remove('fa-user');
            userIcon.classList.add('fa-user-check'); 
            document.querySelector('.user-icon').title = "My Profile";
        }
    }

    window.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
        if (e.target === checkoutModal) closeCart();
        if (e.target === productPageOverlay) closeProductPage();
    });

    updateCartUI();
    if(starRatingIcons.length > 0) updateStars();
    if(currentUser) updateUserIcon(true);
});
