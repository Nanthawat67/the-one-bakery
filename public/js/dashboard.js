// ======================================
// Dashboard
// ======================================

async function loadDashboard(){

    try{

        const response = await fetch("/api/dashboard");

        const data = await response.json();

        if(!data.success){

            alert("โหลด Dashboard ไม่สำเร็จ");

            return;

        }

        document.getElementById("salesToday").textContent =

            "฿" + Number(data.sales_today).toFixed(2);

        document.getElementById("ordersToday").textContent =

            data.orders_today;

        document.getElementById("waitingProduction").textContent =

            data.waiting_production;

        document.getElementById("waitingPacking").textContent =

            data.waiting_packing;

        document.getElementById("completed").textContent =

            data.completed;

        if(data.best_seller){

            document.getElementById("bestSeller").textContent =

                `${data.best_seller.name}
                (${data.best_seller.total_quantity} ชิ้น)`;

        }

        else{

            document.getElementById("bestSeller").textContent =

                "-";

        }

        renderTopProducts(data.top_products);

    }

    catch(err){

        console.error(err);

        alert("ไม่สามารถโหลด Dashboard");

    }

}

// ======================================

function renderTopProducts(products){

    const tbody = document.getElementById("topProducts");

    if(!products || products.length===0){

        tbody.innerHTML = `

        <tr>

            <td colspan="2">

                ยังไม่มีข้อมูล

            </td>

        </tr>

        `;

        return;

    }

    let html = "";

    products.forEach(product=>{

        html += `

        <tr>

            <td>

                ${product.name}

            </td>

            <td>

                ${product.total_quantity}

            </td>

        </tr>

        `;

    });

    tbody.innerHTML = html;

}

loadDashboard();

setInterval(loadDashboard,30000);