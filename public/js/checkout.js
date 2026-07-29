let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ======================================
// โหลดหน้าสรุปรายการ
// ======================================

function loadCheckout() {

    if (cart.length === 0) {

        alert("ไม่มีสินค้าในตะกร้า");

        window.location.href = "index.html";

        return;

    }

    const summary = document.getElementById("orderSummary");

    let html = "";

    let total = 0;

    cart.forEach(item => {

        const subtotal = item.price * item.quantity;

        total += subtotal;

        html += `

            <div class="summary-item">

                <span>

                    ${item.name}

                    x ${item.quantity}

                </span>

                <strong>

                    ฿${subtotal.toFixed(2)}

                </strong>

            </div>

        `;

    });

    summary.innerHTML = html;

    document.getElementById("totalPrice").textContent =

        `฿${total.toFixed(2)}`;

}

// ======================================
// ยืนยันการสั่งซื้อ
// ======================================

async function submitOrder() {

    const customer_name = document
        .getElementById("customerName")
        .value
        .trim();

    const phone = document
        .getElementById("phone")
        .value
        .trim();

    const delivery_type = "รับที่ร้าน";
    const address = "";

    if (!customer_name) {

        alert("กรุณากรอกชื่อ");

        return;

    }

    if (!phone) {

        alert("กรุณากรอกเบอร์โทร");

        return;

    }

    const total_price = cart.reduce(

        (sum, item) => sum + (item.price * item.quantity),

        0

    );

    const order = {

        customer_name,

        phone,

        delivery_type,

        address,

        total_price,

        items: cart

    };

    try {

        const response = await fetch("/api/orders", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(order)

        });

        const result = await response.json();

        console.log(result);

        if (result.success) {

            alert("สั่งซื้อสำเร็จ 🎉");

            localStorage.removeItem("cart");

            window.location.href = "index.html";

        }

        else {

            alert(result.message || "เกิดข้อผิดพลาด");

        }

    }

    catch (err) {

        console.error(err);

        alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");

    }

}

// ======================================

loadCheckout();