let orders = [];

// ======================================
// โหลดออเดอร์ตามวันที่
// ======================================

async function loadOrdersByDate() {

    try {

        const dateInput = document.getElementById("orderDate");

        let date = dateInput.value;

        // ถ้ายังไม่ได้เลือก ใช้วันที่ปัจจุบัน
        if (!date) {

            date = new Date().toISOString().split("T")[0];

            dateInput.value = date;

        }

        const response = await fetch(`/api/orders?date=${date}`);

        orders = await response.json();

        renderOrders(orders);

    }

    catch (err) {

        console.error(err);

        document.getElementById("orders").innerHTML = `

            <div class="empty">

                ไม่สามารถโหลดข้อมูลออเดอร์ได้

            </div>

        `;

    }

}

// ======================================
// แสดงออเดอร์
// ======================================

function renderOrders(data) {

    const container = document.getElementById("orders");

    if (!data || data.length === 0) {

        container.innerHTML = `

            <div class="empty">

                ไม่มีออเดอร์ในวันที่เลือก

            </div>

        `;

        return;

    }

    let html = "";

    data.forEach(order => {

        let itemsHTML = "";

        order.items.forEach(item => {

            itemsHTML += `

                <li>

                    ${item.name} × ${item.quantity}

                </li>

            `;

        });

        html += `

        <div class="order-card">

            <div class="order-header">

                <h3>

                    Order #${order.id}

                </h3>

            </div>

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

                ${
                    order.delivery_type === "จัดส่ง"
                    ?
                    `<p>

                        <strong>ที่อยู่ :</strong>

                        ${order.address}

                    </p>`
                    :
                    ""
                }

                <p>

                    <strong>ยอดรวม :</strong>

                    ฿${Number(order.total_price).toFixed(2)}

                </p>

            </div>

            <div class="order-items">

                <h4>

                    รายการสินค้า

                </h4>

                <ul>

                    ${itemsHTML}

                </ul>

            </div>

            <div class="order-footer">

                <select id="status-${order.id}">

                    <option value="รอผลิต" ${order.status === "รอผลิต" ? "selected" : ""}>รอผลิต</option>

                    <option value="รอแพ็ก" ${order.status === "รอแพ็ก" ? "selected" : ""}>รอแพ็ก</option>

                    <option value="เสร็จแล้ว" ${order.status === "เสร็จแล้ว" ? "selected" : ""}>เสร็จแล้ว</option>

                </select>

                <button onclick="updateStatus(${order.id})">

                    บันทึกสถานะ

                </button>

            </div>

        </div>

        `;

    });

    container.innerHTML = html;

}

// ======================================
// เปลี่ยนสถานะ
// ======================================

async function updateStatus(id) {

    const status = document.getElementById(`status-${id}`).value;

    try {

        const response = await fetch(`/api/orders/${id}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                status

            })

        });

        const result = await response.json();

        if (result.success) {

            alert("อัปเดตสถานะเรียบร้อย");

            loadOrdersByDate();

        }

        else {

            alert(result.message);

        }

    }

    catch (err) {

        console.error(err);

        alert("อัปเดตไม่สำเร็จ");

    }

}

// ======================================

loadOrdersByDate();