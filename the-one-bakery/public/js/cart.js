const cart =
JSON.parse(localStorage.getItem('cart')) || [];


let total = 0;


const cartDiv =
document.getElementById('cart');



if (cart.length === 0) {

  cartDiv.innerHTML = `

    <div class="cart-item">

      <h3>
        🛒 ยังไม่มีสินค้าในตะกร้า
      </h3>

      <p>
        กรุณาเลือกสินค้าก่อนทำรายการ
      </p>

    </div>

  `;

}
else {


  cart.forEach(item => {


    const price =
    item.price * item.quantity;


    total += price;



    cartDiv.innerHTML += `

    <div class="cart-item">


      <h3>
        🍞 ${item.name}
      </h3>


      <p>
        จำนวน ${item.quantity} ห่อ
      </p>


      <p>
        ราคา ${price} บาท
      </p>


    </div>


    `;


  });


}



document.getElementById('total').innerHTML =

`
รวมทั้งหมด ${total} บาท
`;




function goCheckout(){


  if(cart.length === 0){

    alert("กรุณาเลือกสินค้าก่อน");

    return;

  }


  window.location.href =
  'checkout.html';


}