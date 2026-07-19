async function loadKitchen() {

    const response = await fetch('/api/kitchen');
    const products = await response.json();

    const tbody = document.getElementById("kitchenList");

    tbody.innerHTML = "";

    let total = 0;

    products.forEach(product => {

        total += Number(product.total_quantity);

        tbody.innerHTML += `
        <tr>
            <td>${product.name}</td>
            <td>${product.total_quantity} ห่อ</td>
        </tr>
        `;

    });

    document.getElementById("totalAll").innerText = total;

}

loadKitchen();

setInterval(loadKitchen, 5000);
