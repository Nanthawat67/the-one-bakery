let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ======================================
// โหลดตะกร้า
// ======================================

function loadCart() {

    const container = document.getElementById("cartItems");

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <h2>🛒 ยังไม่มีสินค้าในตะกร้า</h2>
                <button class="btn" onclick="goBack()">
                    เลือกสินค้า
                </button>
            </div>
        `;

        document.getElementById("totalPrice").textContent = "฿0.00";

        return;

    }

    let html = "";

    let total = 0;

    cart.forEach((item, index) => {

        const subtotal = item.price * item.quantity;

        total += subtotal;

        html += `

        <div class="cart-card">

            <img
                src="${item.image_url}"
                alt="${item.name}">

            <div class="cart-info">

                <h3>${item.name}</h3>

                <p>

                    ราคา :

                    <strong>

                        ฿${Number(item.price).toFixed(2)}

                    </strong>

                </p>

                <div class="quantity-control">

                    <button onclick="decrease(${index})">

                        -

                    </button>

                    <input

                        type="number"

                        min="1"

                        max="999"

                        value="${item.quantity}"

                        onchange="changeQty(${index}, this.value)">

                    <button onclick="increase(${index})">

                        +

                    </button>

                </div>

                <h4>

                    รวม :

                    ฿${subtotal.toFixed(2)}

                </h4>

            </div>

            <button

                class="delete-btn"

                onclick="removeItem(${index})">

                ✖

            </button>

        </div>

        `;

    });

    container.innerHTML = html;

    document.getElementById("totalPrice").textContent =

        `฿${total.toFixed(2)}`;

}

// ======================================
// เพิ่มจำนวน
// ======================================

function increase(index){

    if(cart[index].quantity < 999){

        cart[index].quantity++;

        saveCart();

    }

}

// ======================================
// ลดจำนวน
// ======================================

function decrease(index){

    if(cart[index].quantity > 1){

        cart[index].quantity--;

        saveCart();

    }

}

// ======================================
// เปลี่ยนจำนวน
// ======================================

function changeQty(index,value){

    let qty = parseInt(value);

    if(isNaN(qty) || qty < 1){

        qty = 1;

    }

    if(qty > 999){

        qty = 999;

    }

    cart[index].quantity = qty;

    saveCart();

}

// ======================================
// ลบสินค้า
// ======================================

function removeItem(index){

    if(confirm("ลบสินค้านี้ออกจากตะกร้าหรือไม่?")){

        cart.splice(index,1);

        saveCart();

    }

}

// ======================================
// ล้างตะกร้า
// ======================================

function clearCart(){

    if(confirm("ต้องการล้างตะกร้าสินค้าทั้งหมดหรือไม่?")){

        cart = [];

        saveCart();

    }

}

// ======================================
// บันทึก
// ======================================

function saveCart(){

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    loadCart();

}

// ======================================
// กลับหน้าสินค้า
// ======================================

function goBack(){

    window.location.href = "index.html";

}

// ======================================
// ไป Checkout
// ======================================

function checkout(){

    if(cart.length === 0){

        alert("กรุณาเลือกสินค้า");

        return;

    }

    window.location.href = "checkout.html";

}

// ======================================

loadCart();