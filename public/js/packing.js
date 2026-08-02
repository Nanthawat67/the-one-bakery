// ======================================
// Packing
// ======================================

let packingOrders = [];

// ======================================
// โหลดรายการรอแพ็ก
// ======================================

async function loadPacking() {

    try {

        const response = await fetch("/api/packing");

        const orders = await response.json();

        packingOrders = orders.filter(

            order => order.status === "รอแพ็ก"

        );

        renderPacking();

    }

    catch (err) {

        console.error(err);

        document.getElementById("packingOrders").innerHTML = `

            <div class="empty">

                ไม่สามารถโหลดข้อมูลได้

            </div>

        `;

    }

}

// ======================================
// แสดงรายการ
// ======================================

function renderPacking() {

    const container = document.getElementById("packingOrders");

    if (packingOrders.length === 0) {

        container.innerHTML = `

            <div class="empty">

                🎉 ไม่มีออเดอร์ที่รอแพ็ก

            </div>

        `;

        return;

    }

    let html = "";

    packingOrders.forEach((order, index) => {

        let itemsHTML = "";

        order.items.forEach(item => {

            itemsHTML += `

                <li>

                    ${item.name}

                    ×

                    ${item.quantity}

                </li>

            `;

        });

        html += `

        <div class="order-card">

            <h2>

                Order #${index + 1}

            </h2>

            <div class="order-info">

                <p>

                    <strong>ลูกค้า :</strong>

                    ${order.customer_name}

                </p>

                <p>

                    <strong>เบอร์ :</strong>

                    ${order.phone}

                </p>

                <p>

                    <strong>รับสินค้า :</strong>

                    ${order.delivery_type}

                </p>

                <p>

                    <strong>ยอดรวม :</strong>

                    ฿${Number(order.total_price).toFixed(2)}

                </p>

            </div>

            <div class="order-items">

                <h3>

                    รายการสินค้า

                </h3>

                <ul>

                    ${itemsHTML}

                </ul>

            </div>

            <button

                class="finish-btn"

                onclick="finishPacking(${order.id})">

                ✅ แพ็กเสร็จ

            </button>

        </div>

        `;

    });

    container.innerHTML = html;

}

// ======================================
// แพ็กเสร็จ
// ======================================

async function finishPacking(id) {

    const confirmFinish = confirm(

        "ยืนยันว่าแพ็กออเดอร์นี้เสร็จแล้ว ?"

    );

    if (!confirmFinish) {

        return;

    }

    try {

        const response = await fetch(`/api/packing/${id}/finish`,{

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

            }

        );

        const result = await response.json();

        if (result.success) {

            alert("แพ็กสินค้าเรียบร้อย");

            loadPacking();

        }

        else {

            alert(result.message);

        }

    }

    catch (err) {

        console.error(err);

        alert("เกิดข้อผิดพลาด");

    }

}

// ======================================

loadPacking();