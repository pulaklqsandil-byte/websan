(() => {
  "use strict";

  const readCartItems = () => {
    try {
      const items = JSON.parse(window.localStorage.getItem("albora_cart_items"));
      return Array.isArray(items) ? items : [];
    } catch (e) {
      return [];
    }
  };

  const renderCheckoutSummary = () => {
    const items = readCartItems();
    const listContainer = document.querySelector(".checkout-items-list");
    const subtotalEl = document.getElementById("chk-subtotal");
    const shippingEl = document.getElementById("chk-shipping");
    const surchargeEl = document.getElementById("chk-surcharge");
    const totalEl = document.getElementById("chk-total");
    const checkoutForm = document.getElementById("checkout-form");

    if (!listContainer || !subtotalEl || !shippingEl || !surchargeEl || !totalEl) return;

    if (items.length === 0) {
      listContainer.innerHTML = `<p style="opacity:0.75; font-size:0.9rem;">Your shopping bag is empty. <a href="product.html" style="text-decoration:underline;">Choose a bottle</a></p>`;
      subtotalEl.textContent = "₹0";
      shippingEl.textContent = "₹0";
      surchargeEl.textContent = "₹0";
      totalEl.textContent = "₹0";
      if (checkoutForm) {
        const btn = checkoutForm.querySelector(".place-order-btn");
        if (btn) { btn.disabled = true; btn.style.opacity = "0.5"; }
      }
      return;
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 700 ? 0 : 50;
    
    const paymentRadio = document.querySelector('input[name="payment_method"]:checked');
    const paymentMethod = paymentRadio ? paymentRadio.value : "upi";
    const surcharge = paymentMethod === "cod" ? 40 : 0;
    const finalTotal = subtotal + shipping + surcharge;

    subtotalEl.textContent = `₹${subtotal}`;
    shippingEl.textContent = shipping === 0 ? "Free" : `₹${shipping}`;
    surchargeEl.textContent = `₹${surcharge}`;
    totalEl.textContent = `₹${finalTotal}`;

    listContainer.innerHTML = items.map(item => `
      <div class="checkout-item-row" style="display:flex; gap:0.8rem; align-items:center; margin-bottom:0.8rem; padding-bottom:0.8rem; border-bottom:1px solid var(--line);">
        <img src="${item.image}" alt="${item.name}" style="width:48px; height:54px; object-fit:contain; background:var(--mist); border-radius:4px; padding:0.2rem;" />
        <div style="flex:1;">
          <h4 style="margin:0; font-size:0.92rem; font-family:var(--serif);">${item.name} (${item.size})</h4>
          <p style="margin:0; font-size:0.75rem; opacity:0.75; font-family:var(--mono);">Pack: ${item.color} | Qty: ${item.quantity}</p>
        </div>
        <strong style="font-family:var(--mono); font-size:0.9rem;">₹${item.price * item.quantity}</strong>
      </div>
    `).join("");
  };

  const setupCheckoutForm = () => {
    const form = document.getElementById("checkout-form");
    if (!form) return;

    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    paymentRadios.forEach(radio => {
      radio.addEventListener("change", renderCheckoutSummary);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const errorBanner = document.querySelector(".checkout-error-banner");
      if (errorBanner) errorBanner.textContent = "";

      const items = readCartItems();
      if (items.length === 0) {
        if (errorBanner) errorBanner.textContent = "Your bag is empty. Please add a bottle before checking out.";
        return;
      }

      const formData = new FormData(form);
      const fullname = formData.get("fullname").trim();
      const phone = formData.get("phone").trim();
      const email = formData.get("email").trim();
      const flat = formData.get("flat").trim();
      const street = formData.get("street").trim();
      const city = formData.get("city").trim();
      const state = formData.get("state").trim();
      const pincode = formData.get("pincode").trim();
      const paymentMethod = formData.get("payment_method");

      let firstInvalid = null;
      const validateField = (id, valid, msg) => {
        const errorEl = document.getElementById(`${id}-error`);
        const inputEl = document.getElementById(id);
        if (!valid) {
          if (errorEl) errorEl.textContent = msg;
          if (inputEl) inputEl.setAttribute("aria-invalid", "true");
          firstInvalid = firstInvalid || inputEl;
        } else {
          if (errorEl) errorEl.textContent = "";
          if (inputEl) inputEl.removeAttribute("aria-invalid");
        }
      };

      validateField("checkout-name", fullname.length >= 2, "Please enter your full name.");
      validateField("checkout-phone", /^[0-9]{10}$/.test(phone), "Enter a valid 10-digit mobile number.");
      validateField("checkout-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Enter a valid email address.");
      validateField("checkout-flat", flat.length >= 2, "Please enter your flat / house details.");
      validateField("checkout-street", street.length >= 3, "Please enter street or landmark.");
      validateField("checkout-city", city.length >= 2, "Please enter city name.");
      validateField("checkout-state", state.length >= 2, "Please enter state name.");
      validateField("checkout-pincode", /^[1-9][0-9]{5}$/.test(pincode), "Enter valid 6-digit Indian PIN code.");

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 700 ? 0 : 50;
      const surcharge = paymentMethod === "cod" ? 40 : 0;
      const total = subtotal + shipping + surcharge;
      const orderId = `ALB-${Math.floor(10000 + Math.random() * 90000)}`;

      const orderData = {
        orderId,
        createdAt: new Date().toISOString(),
        customer: { fullname, phone, email },
        address: { flat, street, city, state, pincode },
        items,
        subtotal,
        shipping,
        surcharge,
        total,
        paymentMethod,
        status: "Confirmed"
      };

      try {
        window.localStorage.setItem("albora_last_order", JSON.stringify(orderData));
        window.localStorage.setItem("albora_cart_items", JSON.stringify([]));
        window.localStorage.setItem("albora-cart-count", "0");
      } catch (err) {}

      window.location.href = "order-confirmation.html";
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderCheckoutSummary();
    setupCheckoutForm();
  });
})();
