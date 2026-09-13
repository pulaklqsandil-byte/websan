(() => {
  "use strict";

  const CART_KEY = "albora-cart-count";
  const CART_ITEMS_KEY = "albora_cart_items";

  const readCartItems = () => {
    try {
      const items = JSON.parse(window.localStorage.getItem(CART_ITEMS_KEY));
      return Array.isArray(items) ? items : [];
    } catch (error) {
      return [];
    }
  };

  const saveCartItems = (items) => {
    try {
      window.localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {}
    const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    updateCartCount(totalCount);
  };

  const readCartCount = () => {
    const items = readCartItems();
    if (items.length > 0) {
      return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }
    try {
      const count = Number.parseInt(window.localStorage.getItem(CART_KEY), 10);
      return Number.isFinite(count) && count >= 0 ? count : 0;
    } catch (error) {
      return 0;
    }
  };

  const updateCartCount = (count) => {
    document.querySelectorAll(".cart-count").forEach((element) => {
      element.textContent = count;
    });

    document.querySelectorAll(".cart-link").forEach((link) => {
      link.setAttribute("aria-label", `Shopping cart, ${count} ${count === 1 ? "item" : "items"}`);
    });

    try {
      window.localStorage.setItem(CART_KEY, String(count));
    } catch (error) {}
  };

  // Cart Drawer UI Controller
  const initCartDrawer = () => {
    if (document.querySelector(".cart-drawer-overlay")) return;

    const drawerHTML = `
      <div class="cart-drawer-overlay" aria-hidden="true"></div>
      <aside class="cart-drawer" role="dialog" aria-label="Shopping bag" aria-hidden="true">
        <div class="cart-drawer-header">
          <h2>Your Bag (<span class="drawer-cart-count">0</span>)</h2>
          <button type="button" class="close-cart-drawer" aria-label="Close cart">&times;</button>
        </div>
        <div class="cart-drawer-body">
          <div class="empty-cart-msg">Your bag is currently empty.</div>
          <div class="cart-items-list"></div>
        </div>
        <div class="cart-drawer-footer">
          <div class="cart-summary-row">
            <span>Subtotal</span>
            <strong class="cart-subtotal-val">₹0</strong>
          </div>
          <p class="cart-shipping-note">Free shipping on orders over ₹700</p>
          <a href="checkout.html" class="button button-dark checkout-btn">Proceed to Checkout &rarr;</a>
        </div>
      </aside>
    `;
    document.body.insertAdjacentHTML("beforeend", drawerHTML);

    const overlay = document.querySelector(".cart-drawer-overlay");
    const drawer = document.querySelector(".cart-drawer");
    const closeBtn = document.querySelector(".close-cart-drawer");

    const toggleDrawer = (open) => {
      const isOpen = open !== undefined ? open : !drawer.classList.contains("is-open");
      drawer.classList.toggle("is-open", isOpen);
      overlay.classList.toggle("is-open", isOpen);
      drawer.setAttribute("aria-hidden", String(!isOpen));
      overlay.setAttribute("aria-hidden", String(!isOpen));
      if (isOpen) renderCartItems();
    };

    closeBtn.addEventListener("click", () => toggleDrawer(false));
    overlay.addEventListener("click", () => toggleDrawer(false));

    document.querySelectorAll(".cart-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        toggleDrawer(true);
      });
    });

    window.ALBORA_CART = {
      toggle: toggleDrawer,
      addItem: (newItem) => {
        const items = readCartItems();
        const existingIdx = items.findIndex(i => i.size === newItem.size && i.color === newItem.color);
        if (existingIdx >= 0) {
          items[existingIdx].quantity += newItem.quantity || 1;
        } else {
          items.push({
            id: newItem.id || `alb-${Date.now()}`,
            name: newItem.name || "Field Bottle",
            size: newItem.size,
            color: newItem.color,
            price: newItem.price,
            image: newItem.image || "images/albora-750ml-main.svg",
            quantity: newItem.quantity || 1
          });
        }
        saveCartItems(items);
        toggleDrawer(true);
      }
    };
  };

  const renderCartItems = () => {
    const items = readCartItems();
    const listContainer = document.querySelector(".cart-items-list");
    const emptyMsg = document.querySelector(".empty-cart-msg");
    const drawerCount = document.querySelector(".drawer-cart-count");
    const subtotalEl = document.querySelector(".cart-subtotal-val");
    const checkoutBtn = document.querySelector(".checkout-btn");

    if (!listContainer) return;

    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    drawerCount.textContent = totalQty;
    subtotalEl.textContent = `₹${subtotal}`;
    if (checkoutBtn) checkoutBtn.style.pointerEvents = items.length === 0 ? "none" : "auto";
    if (checkoutBtn) checkoutBtn.style.opacity = items.length === 0 ? "0.5" : "1";

    if (items.length === 0) {
      emptyMsg.style.display = "block";
      listContainer.innerHTML = "";
      return;
    }

    emptyMsg.style.display = "none";
    listContainer.innerHTML = items.map((item, index) => `
      <div class="cart-item-row" data-index="${index}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <h4>${item.name} (${item.size})</h4>
          <p class="cart-item-meta">Pack: ${item.color}</p>
          <p class="cart-item-price">₹${item.price} × ${item.quantity} = <strong>₹${item.price * item.quantity}</strong></p>
          <div class="cart-qty-ctrl">
            <button type="button" class="qty-btn dec-qty" data-index="${index}">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button type="button" class="qty-btn inc-qty" data-index="${index}">+</button>
            <button type="button" class="remove-cart-item" data-index="${index}" aria-label="Remove item">Remove</button>
          </div>
        </div>
      </div>
    `).join("");

    listContainer.querySelectorAll(".inc-qty").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        items[idx].quantity += 1;
        saveCartItems(items);
        renderCartItems();
      });
    });

    listContainer.querySelectorAll(".dec-qty").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        if (items[idx].quantity > 1) {
          items[idx].quantity -= 1;
        } else {
          items.splice(idx, 1);
        }
        saveCartItems(items);
        renderCartItems();
      });
    });

    listContainer.querySelectorAll(".remove-cart-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        items.splice(idx, 1);
        saveCartItems(items);
        renderCartItems();
      });
    });
  };

  const setupMenu = () => {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");

    if (header) {
      const handleScroll = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 20);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    }

    if (!toggle || !nav) return;

    const closeMenu = () => {
      toggle.classList.remove("is-open");
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.querySelector(".sr-only").textContent = "Open menu";
    };

    toggle.addEventListener("click", () => {
      const opening = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", opening);
      toggle.classList.toggle("is-open", opening);
      toggle.setAttribute("aria-expanded", String(opening));
      toggle.querySelector(".sr-only").textContent = opening ? "Close menu" : "Open menu";
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 700) closeMenu();
    });
  };

  const setupProductForm = () => {
    const form = document.querySelector(".purchase-form");
    if (!form) return;

    const message = form.querySelector(".cart-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const pack = data.get("pack") || "Single Bottle";
      const size = data.get("size") || "750 ml";

      let unitPrice = 55;
      let itemImage = "images/bottles/1l/alobora-1l-front.png";
      if (typeof ALOBORA_PRODUCT_CATALOG !== "undefined") {
        const cleanSize = size.replace(/\s+/g, "").toLowerCase();
        const variant = ALOBORA_PRODUCT_CATALOG.find(v => {
          const vClean = v.size.replace(/\s+/g, "").toLowerCase();
          return vClean === cleanSize || cleanSize.includes(vClean) || vClean.includes(cleanSize);
        });
        if (variant) {
          unitPrice = variant.price;
          itemImage = variant.mainImage;
        }
      }

      let multiplier = 1;
      let discount = 0;
      if (pack === "Pack of 6") {
        multiplier = 6;
        discount = 0.10;
      } else if (pack === "Case of 12") {
        multiplier = 12;
        discount = 0.15;
      }
      const itemPrice = Math.round(unitPrice * multiplier * (1 - discount));

      if (window.ALBORA_CART) {
        window.ALBORA_CART.addItem({
          name: "ALOBORA Water",
          size: size,
          color: pack,
          price: itemPrice,
          image: itemImage,
          quantity: 1
        });
      } else {
        const count = readCartCount() + 1;
        updateCartCount(count);
      }

      message.textContent = `${size} ALOBORA Water (${pack}) added to your bag.`;
    });
  };

  const setupPincodeChecker = () => {
    const pincodeInput = document.getElementById("pincode-input");
    const checkBtn = document.getElementById("check-pincode-btn");
    const feedback = document.querySelector(".pincode-feedback-msg");
    if (!pincodeInput || !checkBtn || !feedback) return;

    const checkDelivery = () => {
      const pin = pincodeInput.value.trim();
      if (!/^[1-9][0-9]{5}$/.test(pin)) {
        feedback.style.color = "#a53c26";
        feedback.textContent = "✕ Please enter a valid 6-digit Indian PIN code.";
        return;
      }

      const isExpress = /^(560|110|400|600|700|500|380|411)/.test(pin);
      feedback.style.color = "var(--ink)";
      if (isExpress) {
        feedback.innerHTML = `<strong>✓ Express Delivery Available</strong> to ${pin} (Est. 1–2 business days).`;
      } else {
        feedback.innerHTML = `<strong>✓ Standard Delivery Available</strong> to ${pin} (Est. 3–5 business days).`;
      }
    };

    checkBtn.addEventListener("click", checkDelivery);
    pincodeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        checkDelivery();
      }
    });
  };

  const setupProductGallery = () => {
    const gallery = document.querySelector(".product-gallery");
    const sizeOptions = document.querySelector(".size-options");
    const packOptions = document.querySelectorAll('input[name="pack"]');
    const price = document.querySelector(".product-price");
    if (!gallery || !sizeOptions || !price || typeof waterBottleVariants === "undefined") return;

    const mainImage = gallery.querySelector(".main-product-image img");
    const galleryLabel = gallery.querySelector(".gallery-label");
    const thumbnailButtons = [...gallery.querySelectorAll(".thumbnail")];
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const variants = new Map(waterBottleVariants.map((variant) => [variant.size, variant]));
    const viewNames = ["front angle", "side angle", "cap detail"];
    const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
    const totalFields = {
      subtotal: document.getElementById("subtotal-price"),
      shipping: document.getElementById("shipping-price"),
      surcharge: document.getElementById("surcharge-price"),
      total: document.getElementById("total-price")
    };
    let currentVariant;

    const setMainImage = (path, alt) => {
      mainImage.src = path;
      mainImage.alt = alt;
    };

    const getCalculatedPrice = (unitPrice) => {
      const packInput = document.querySelector('input[name="pack"]:checked');
      const packVal = packInput ? packInput.value : "Single Bottle";
      let multiplier = 1;
      let discount = 0;
      if (packVal === "Pack of 6") {
        multiplier = 6;
        discount = 0.10;
      } else if (packVal === "Case of 12") {
        multiplier = 12;
        discount = 0.15;
      }
      return Math.round(unitPrice * multiplier * (1 - discount));
    };

    const updateTotal = () => {
      if (!currentVariant || !totalFields.subtotal || !totalFields.shipping || !totalFields.surcharge || !totalFields.total) return;
      const subtotal = getCalculatedPrice(currentVariant.price);
      // Free shipping for orders > 700 INR
      const shipping = subtotal > 700 ? 0 : 50;
      const payment = document.querySelector('input[name="payment"]:checked');
      const surcharge = payment && payment.value === "cod" ? 40 : 0;
      price.firstChild.textContent = `₹${subtotal} `;
      totalFields.subtotal.textContent = money.format(subtotal);
      totalFields.shipping.textContent = shipping === 0 ? "Free" : money.format(shipping);
      totalFields.surcharge.textContent = money.format(surcharge);
      totalFields.total.textContent = money.format(subtotal + shipping + surcharge);
    };

    const renderVariant = (variant) => {
      currentVariant = variant;
      galleryLabel.textContent = `FIELD BOTTLE / ${variant.size.toUpperCase()}`;
      setMainImage(variant.mainImage, `ALBORA Field Bottle, ${variant.size}`);

      thumbnailButtons.forEach((button, index) => {
        const image = button.querySelector("img");
        const imagePath = variant.thumbnails[index];
        const hasImage = Boolean(imagePath);
        button.hidden = !hasImage;
        if (!hasImage) return;
        const viewName = viewNames[index] || `gallery image ${index + 1}`;
        image.src = imagePath;
        image.alt = `${viewName} of the ${variant.size} Field Bottle`;
        button.setAttribute("aria-label", `View ${viewName}`);
        button.classList.toggle("is-selected", index === 0);
        button.setAttribute("aria-pressed", String(index === 0));
      });
      updateTotal();
      if (typeof renderRelatedProducts === "function") {
        renderRelatedProducts(variant.size);
      }
    };

    packOptions.forEach((input) => {
      input.closest("label").classList.toggle("is-active", input.checked);
      input.addEventListener("change", () => {
        packOptions.forEach((labelInput) => {
          labelInput.closest("label").classList.toggle("is-active", labelInput.checked);
        });
        updateTotal();
      });
    });

    const findVariant = (val) => {
      const cleanVal = val.replace(/\s+/g, "").toLowerCase();
      return waterBottleVariants.find(v => {
        const cleanV = v.size.replace(/\s+/g, "").toLowerCase();
        return cleanV === cleanVal || cleanVal.includes(cleanV) || cleanV.includes(cleanVal);
      });
    };

    sizeOptions.querySelectorAll('input[name="size"]').forEach((input) => {
      input.closest("label").classList.toggle("is-active", input.checked);
      input.addEventListener("change", () => {
        if (!input.checked) return;
        sizeOptions.querySelectorAll("label").forEach((label) => label.classList.toggle("is-active", label.contains(input)));
        const variant = findVariant(input.value);
        if (variant) renderVariant(variant);
      });
    });

    thumbnailButtons.forEach((button) => {
      button.addEventListener("click", () => {
        thumbnailButtons.forEach((item) => {
          const selected = item === button;
          item.classList.toggle("is-selected", selected);
          item.setAttribute("aria-pressed", String(selected));
        });
        const image = button.querySelector("img");
        setMainImage(image.src, image.alt);
      });
    });

    paymentOptions.forEach((input) => input.addEventListener("change", updateTotal));
    const selectedSize = sizeOptions.querySelector('input[name="size"]:checked');
    const selectedVariant = selectedSize && findVariant(selectedSize.value);
    if (selectedVariant) renderVariant(selectedVariant);
  };

  const setupContactForm = () => {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    const fields = {
      name: { input: form.elements.name, error: document.getElementById("name-error"), message: "Please enter your name." },
      email: { input: form.elements.email, error: document.getElementById("email-error"), message: "Enter a valid email address." },
      message: { input: form.elements.message, error: document.getElementById("message-error"), message: "Please add a message before sending." }
    };
    const success = form.querySelector(".form-success");

    const showError = (field, message) => {
      field.error.textContent = message;
      field.input.setAttribute("aria-invalid", "true");
      field.input.setAttribute("aria-describedby", field.error.id);
    };

    const clearError = (field) => {
      field.error.textContent = "";
      field.input.removeAttribute("aria-invalid");
      field.input.removeAttribute("aria-describedby");
    };

    Object.values(fields).forEach((field) => {
      field.input.addEventListener("input", () => {
        if (field.input.value.trim()) clearError(field);
        success.textContent = "";
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      success.textContent = "";
      let firstInvalid;

      const name = fields.name.input.value.trim();
      const email = fields.email.input.value.trim();
      const message = fields.message.input.value.trim();
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name) { showError(fields.name, fields.name.message); firstInvalid ||= fields.name.input; } else clearError(fields.name);
      if (!validEmail) { showError(fields.email, fields.email.message); firstInvalid ||= fields.email.input; } else clearError(fields.email);
      if (!message) { showError(fields.message, fields.message); firstInvalid ||= fields.message.input; } else clearError(fields.message);

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      form.reset();
      success.textContent = "Thanks for writing—we’ll get back to you within two working days.";
    });
  };

  const setupCatalogGrid = () => {
    const container = document.getElementById("catalog-cards-container");
    const tabs = document.querySelectorAll(".catalog-tab");
    if (!container || typeof ALOBORA_PRODUCT_CATALOG === "undefined") return;

    const renderCards = (filterCategory) => {
      const items = filterCategory === "all" 
        ? ALOBORA_PRODUCT_CATALOG 
        : ALOBORA_PRODUCT_CATALOG.filter(item => item.category === filterCategory);

      container.innerHTML = items.map(item => `
        <article class="catalog-card" data-category="${item.category}">
          <div class="catalog-card-image">
            <span class="catalog-badge">${item.size}</span>
            <img src="${item.mainImage}" alt="${item.name}" loading="lazy" />
          </div>
          <div class="catalog-card-body">
            <span class="catalog-family-label">${item.designFamily}</span>
            <h3>${item.name}</h3>
            <p class="catalog-desc">${item.description}</p>
            <p class="catalog-best-for">✦ ${item.bestFor}</p>
            <div class="catalog-card-footer">
              <span class="catalog-price">₹${item.price} <small>INR</small></span>
              <button type="button" class="button button-dark select-catalog-item-btn" data-size="${item.size}">
                Select Bottle &uarr;
              </button>
            </div>
          </div>
        </article>
      `).join("");

      container.querySelectorAll(".select-catalog-item-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const targetSize = btn.dataset.size;
          const sizeRadios = document.querySelectorAll('input[name="size"]');
          let matchedRadio = null;
          sizeRadios.forEach(radio => {
            const cleanRadioVal = radio.value.replace(/\s+/g, "").toLowerCase();
            const cleanTargetVal = targetSize.replace(/\s+/g, "").toLowerCase();
            if (cleanRadioVal === cleanTargetVal || cleanRadioVal.includes(cleanTargetVal) || cleanTargetVal.includes(cleanRadioVal)) {
              matchedRadio = radio;
            }
          });
          if (matchedRadio) {
            matchedRadio.checked = true;
            matchedRadio.dispatchEvent(new Event("change"));
          }
          const purchaseSection = document.getElementById("purchase");
          if (purchaseSection) {
            purchaseSection.scrollIntoView({ behavior: "smooth" });
          }
        });
      });
    };

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        renderCards(tab.dataset.category);
      });
    });

    renderCards("all");
  };

  const renderRelatedProducts = (currentSize) => {
    const container = document.getElementById("related-cards-container");
    if (!container || typeof ALOBORA_PRODUCT_CATALOG === "undefined") return;

    const cleanCurrentSize = (currentSize || "750ml").replace(/\s+/g, "").toLowerCase();
    const currentItem = ALOBORA_PRODUCT_CATALOG.find(i => {
      const c = i.size.replace(/\s+/g, "").toLowerCase();
      return c === cleanCurrentSize || cleanCurrentSize.includes(c) || c.includes(cleanCurrentSize);
    }) || ALOBORA_PRODUCT_CATALOG[5];

    const candidates = ALOBORA_PRODUCT_CATALOG.filter(i => i.id !== currentItem.id);
    const currentIndex = ALOBORA_PRODUCT_CATALOG.findIndex(i => i.id === currentItem.id);

    const sorted = [...candidates].sort((a, b) => {
      const indexA = ALOBORA_PRODUCT_CATALOG.findIndex(i => i.id === a.id);
      const indexB = ALOBORA_PRODUCT_CATALOG.findIndex(i => i.id === b.id);

      const distA = Math.abs(indexA - currentIndex);
      const distB = Math.abs(indexB - currentIndex);

      const catA = a.category === currentItem.category ? -1.5 : 0;
      const catB = b.category === currentItem.category ? -1.5 : 0;

      return (distA + catA) - (distB + catB);
    });

    const relatedItems = sorted.slice(0, 4);

    container.innerHTML = relatedItems.map(item => `
      <article class="related-card" data-size="${item.size}">
        <div class="related-img-container">
          <span class="related-badge">${item.size}</span>
          <img src="${item.mainImage}" alt="${item.name} packaged drinking water bottle" loading="lazy" />
        </div>
        <div class="related-card-content">
          <span class="related-family">${item.designFamily}</span>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="related-card-action">
            <span class="price">₹${item.price} <small style="font-family:var(--mono); font-size:0.6rem;">INR</small></span>
            <button type="button" class="button button-dark view-related-btn" data-size="${item.size}">
              View Bottle &rarr;
            </button>
          </div>
        </div>
      </article>
    `).join("");

    container.querySelectorAll(".view-related-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetSize = btn.dataset.size;
        const sizeRadios = document.querySelectorAll('input[name="size"]');
        let matchedRadio = null;
        sizeRadios.forEach(radio => {
          const cleanRadioVal = radio.value.replace(/\s+/g, "").toLowerCase();
          const cleanTargetVal = targetSize.replace(/\s+/g, "").toLowerCase();
          if (cleanRadioVal === cleanTargetVal || cleanRadioVal.includes(cleanTargetVal) || cleanTargetVal.includes(cleanRadioVal)) {
            matchedRadio = radio;
          }
        });
        if (matchedRadio) {
          matchedRadio.checked = true;
          matchedRadio.dispatchEvent(new Event("change"));
        }
        const purchaseSection = document.getElementById("purchase");
        if (purchaseSection) {
          purchaseSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  };

  const updateAccountHeaderState = () => {
    const accountLinks = document.querySelectorAll(".account-link");
    try {
      const user = JSON.parse(localStorage.getItem("albora_user_session"));
      if (user && user.isLoggedIn) {
        const displayName = user.fullname ? user.fullname.split(" ")[0] : "Customer";
        accountLinks.forEach(link => {
          link.innerHTML = `👤 Hi, ${displayName}`;
        });
      } else {
        accountLinks.forEach(link => {
          link.textContent = "Account";
        });
      }
    } catch(e) {}
  };

  const setCurrentYear = () => {
    document.querySelectorAll(".current-year").forEach((element) => {
      element.textContent = new Date().getFullYear();
    });
  };

  initCartDrawer();
  updateCartCount(readCartCount());
  setupMenu();
  setupProductForm();
  setupPincodeChecker();
  setupProductGallery();
  setupCatalogGrid();
  renderRelatedProducts("750ml");
  setupContactForm();
  updateAccountHeaderState();
  setCurrentYear();
})();
