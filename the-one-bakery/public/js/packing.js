async function loadPacking(){

    const response =
    await fetch('/api/orders');

    const orders =
    await response.json();

    const div =
    document.getElementById("packing");

    div.innerHTML="";

    orders.forEach(order=>{

        if(order.status==="เสร็จแล้ว"){
            return;
        }

        let items="";

        order.items.forEach(item=>{

            items+=`
            <li>

            ${item.name}

            x ${item.quantity}

            </li>
            `;

        });

        div.innerHTML+=`

        <div class="packing-card">

        <h2>

        Order #${order.id}

        </h2>

        <p>

        ลูกค้า :

        ${order.customer_name}

        </p>

        <ul>

        ${items}

        </ul>

        <p>

        สถานะ :

        ${order.status}

        </p>

        </div>

        `;

    });

}

loadPacking();

setInterval(loadPacking,5000);