async function submitOrder(){

    const name =
    document.getElementById('name').value;


    const phone =
    document.getElementById('phone').value;


    const delivery = "pickup";  


    const address = "";


    const cart =
    JSON.parse(localStorage.getItem('cart')) || [];


    let total = 0;


    cart.forEach(item => {
        total += item.price * item.quantity;
    });


    const orderData = {

        customer_name: name,

        phone: phone,

        delivery_type: "pickup",
        address: address,

        total_price: total,

        items: cart

    };


    try {

        const response = await fetch('/api/orders', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(orderData)

        });


        const result = await response.json();


        alert(
            `สั่งซื้อสำเร็จ เลขออเดอร์ ${result.order_id}`
        );


        localStorage.removeItem('cart');


        window.location.href = '/';


    }
    catch(err){

        console.error(err);

        alert('เกิดข้อผิดพลาด');

    }

}