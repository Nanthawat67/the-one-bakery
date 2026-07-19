async function loadOrders(){

    const response = await fetch('/api/orders');
    const orders = await response.json();

    // แสดงจำนวนออเดอร์
    document.getElementById('totalOrders').innerText = orders.length;

    // คำนวณยอดขายรวม
    let sales = 0;

    orders.forEach(order => {
        sales += Number(order.total_price);
    });

    document.getElementById('totalSales').innerText = `${sales} บาท`;

    // คำนวณจำนวนสินค้าที่ขายทั้งหมด
    let totalItems = 0;

    orders.forEach(order => {
        order.items.forEach(item => {
            totalItems += item.quantity;
        });
    });

    document.getElementById('totalItems').innerText = totalItems;

    // หาสินค้าขายดีที่สุด
    let productCount = {};

    orders.forEach(order => {
        order.items.forEach(item => {
            if (!productCount[item.name]) {
                productCount[item.name] = 0;
            }

            productCount[item.name] += item.quantity;
        });
    });

    let best = "-";
    let max = 0;

    for (let p in productCount) {
        if (productCount[p] > max) {
            max = productCount[p];
            best = p;
        }
    }

    document.getElementById('bestProduct').innerText = best;

    const table = document.getElementById('orders');

    table.innerHTML = "";

    orders.forEach(order => {

        let items = "";

        order.items.forEach(item => {
            items += `
            ${item.name}
            x${item.quantity}
            <br>
            `;
        });

        table.innerHTML += `
        <tr>

        <td>#${order.id}</td>

        <td>
        ${order.customer_name}
        <br>
        ${order.phone}
        </td>

        <td>${items}</td>

        <td>${order.total_price} บาท</td>

        <td>
        ${
            order.delivery_type === "pickup"
            ? "🏠 รับที่ร้าน"
            : "🚚 ส่งบ้าน"
        }
        </td>

        <td>
        <select onchange="updateStatus(${order.id},this.value)">

        <option ${order.status=="รอยืนยัน"?"selected":""}>
        รอยืนยัน
        </option>

        <option ${order.status=="กำลังทำ"?"selected":""}>
        กำลังทำ
        </option>

        <option ${order.status=="พร้อมรับ"?"selected":""}>
        พร้อมรับ
        </option>

        <option ${order.status=="เสร็จแล้ว"?"selected":""}>
        เสร็จแล้ว
        </option>

        </select>
        </td>

        </tr>
        `;
    });
}

async function updateStatus(id,status){

    await fetch(`/api/orders/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            status:status
        })
    });

    alert("อัปเดตสถานะแล้ว");
}

loadOrders();