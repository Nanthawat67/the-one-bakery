let productsData = [];

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();

    productsData = products;

    const productDiv = document.getElementById('products');
    productDiv.innerHTML = '';

    products.forEach(product => {
      productDiv.innerHTML += `
        <div class="product-card">

  <img 
    src="${product.image_url || 'images/bread1.jpg'}"
    class="product-image"
  >

  <h3>
    ${product.name}
  </h3>

  <p>
    ${product.price} บาท/ห่อ
  </p>

          <button onclick="decrease(${product.id})">-</button>

          <input
            type="number"
            id="qty-${product.id}"
            value="0"
            min="0"
          >

          <button onclick="increase(${product.id})">+</button>

          <hr>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
  }
}

function increase(id) {
  const input = document.getElementById(`qty-${id}`);
  input.value = Number(input.value) + 1;
}

function decrease(id) {
  const input = document.getElementById(`qty-${id}`);

  if (Number(input.value) > 0) {
    input.value = Number(input.value) - 1;
  }
}

function goCart() {

  let cart = [];

  productsData.forEach(product => {

    const qty = Number(
      document.getElementById(`qty-${product.id}`).value
    );

    if (qty > 0) {

      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: qty
      });

    }

  });

  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );

  window.location.href = 'cart.html';
}

loadProducts();