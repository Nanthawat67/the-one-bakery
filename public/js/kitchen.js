// ======================================
// Kitchen
// รวมสินค้าที่ต้องผลิต
// ======================================


async function loadKitchen() {

    try {

        const response =
            await fetch("/api/kitchen");


        const products =
            await response.json();


        console.log("Kitchen Data:", products);


        renderKitchen(products);


    }

    catch (err) {


        console.error(err);


        document
        .getElementById("kitchenList")
        .innerHTML = `

            <div class="empty">

                ไม่สามารถโหลดข้อมูลได้

            </div>

        `;


    }

}



// ======================================
// แสดงรายการผลิต
// ======================================


function renderKitchen(products) {


    const container =
        document.getElementById(
            "kitchenList"
        );



    if(!products || products.length === 0){


        container.innerHTML = `

            <div class="empty">

                🎉 วันนี้ไม่มีรายการต้องผลิต

            </div>

        `;


        return;


    }



    let html = "";



    products.forEach(product => {



        // รองรับชื่อ Field หลายแบบ
        const productName =
            product.name ||
            product.product_name ||
            product.productName ||
            "ไม่พบชื่อสินค้า";



        // รองรับจำนวนหลายแบบ
        const quantity =
            product.total_quantity ||
            product.total ||
            product.quantity ||
            0;



        html += `


        <div class="product-card">


            <h2>

                ${productName}

            </h2>



            <div class="qty">

                ${quantity}

            </div>



            <p>

                ชิ้น

            </p>



        </div>


        `;



    });



    container.innerHTML = html;


}



// ======================================
// ผลิตเสร็จทั้งหมด
// เปลี่ยนสถานะ
// รอผลิต -> รอแพ็ก
// ======================================


async function finishProduction(){



    const confirmFinish =
        confirm(
            "ยืนยันว่าผลิตสินค้าทั้งหมดเสร็จแล้ว ?"
        );



    if(!confirmFinish){

        return;

    }



    try {



        const response =
            await fetch(

                "/api/kitchen/finish",

                {

                    method:"PUT"

                }

            );





        const result =
            await response.json();





        if(result.success){



            alert(
                "ส่งออเดอร์ไปหน้า Packing แล้ว"
            );



            window.location.href =
                "packing.html";


        }


        else{


            alert(
                result.message
            );


        }



    }


    catch(err){



        console.error(err);


        alert(
            "เกิดข้อผิดพลาด"
        );


    }



}



// ======================================

loadKitchen();