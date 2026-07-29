let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ======================================
// โหลดสินค้า
// ======================================

async function loadProducts() {

    try {

        const response = await fetch("/api/products");

        products = await response.json();

        renderProducts(products);

        updateCartCount();

    }
    catch (err) {

        console.error(err);

        document.getElementById("products").innerHTML = `
            <h2>ไม่สามารถโหลดข้อมูลสินค้าได้</h2>
        `;

    }

}

// ======================================
// แสดงสินค้า
// ======================================

function renderProducts(data) {

    const container = document.getElementById("products");

    if (data.length === 0) {

        container.innerHTML = `
            <h2>ไม่พบสินค้า</h2>
        `;

        return;

    }

    container.innerHTML = "";

    data.forEach(product => {

        container.innerHTML += `

        <div class="product-card">

            <img
                src="${product.image_url}"
                alt="${product.name}">

            <div class="product-info">

                <h3>${product.name}</h3>

                <div class="price">

                    ฿${Number(product.price).toFixed(2)}

                </div>

                <div class="quantity-control">

                    <button
                        onclick="decrease(${product.id})">

                        -

                    </button>

                    <input

                        type="number"

                        id="qty-${product.id}"

                        value="1"

                        min="1"

                        max="999">

                    <button
                        onclick="increase(${product.id})">

                        +

                    </button>

                </div>

                <button

                    class="add-btn"

                    onclick="addToCart(${product.id})">

                    เพิ่มลงตะกร้า

                </button>

            </div>

        </div>

        `;

    });

}

// ======================================
// เพิ่มจำนวน
// ======================================

function increase(id){

    const input = document.getElementById(`qty-${id}`);

    let qty = parseInt(input.value) || 1;

    if(qty < 999){

        input.value = qty + 1;

    }

}

// ======================================
// ลดจำนวน
// ======================================

function decrease(id){

    const input = document.getElementById(`qty-${id}`);

    let qty = parseInt(input.value) || 1;

    if(qty > 1){

        input.value = qty - 1;

    }

}

// ======================================
// เพิ่มลงตะกร้า
// ======================================

function addToCart(id){

    const product = products.find(p => p.id === id);

    const qtyInput = document.getElementById(`qty-${id}`);

    const quantity = parseInt(qtyInput.value);

    if(!quantity || quantity <= 0){

        alert("กรุณาระบุจำนวน");

        return;

    }

    const exist = cart.find(item => item.id === id);

    if(exist){

        exist.quantity += quantity;

    }

    else{

        cart.push({

            id: product.id,

            name: product.name,

            price: Number(product.price),

            image_url: product.image_url,

            quantity: quantity

        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    qtyInput.value = 1;

    updateCartCount();

    alert("เพิ่มสินค้าลงตะกร้าแล้ว");

}

// ======================================
// จำนวนสินค้าในตะกร้า
// ======================================

function updateCartCount(){

    const total = cart.reduce(

        (sum,item)=>sum+item.quantity,

        0

    );

    document.getElementById("cartCount").textContent = total;

}

// ======================================
// ค้นหาสินค้า
// ======================================

function searchProduct(){

    const keyword = document

        .getElementById("search")

        .value

        .toLowerCase();

    const filter = products.filter(product =>

        product.name.toLowerCase().includes(keyword)

    );

    renderProducts(filter);

}

// ======================================
// ไปหน้าตะกร้า
// ======================================

function goCart(){

    window.location.href = "cart.html";

}

// ======================================

loadProducts();