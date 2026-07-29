// ======================================
// THE ONE Bakery
// Admin Product Management
// products.js Part 1/2
// ======================================


let products = [];

let cropper = null;

let currentImage = "";




// ======================================
// เมื่อเปิดหน้า
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProducts();


        const search =
            document.getElementById("search");


        if (search) {


            search.addEventListener(
                "input",
                searchProduct
            );


        }


        setupImageUpload();


    }
);






// ======================================
// โหลดสินค้า
// ======================================


async function loadProducts() {


    try {


        const response =
            await fetch("/api/products");



        if (!response.ok) {


            throw new Error(
                "โหลดสินค้าไม่สำเร็จ"
            );


        }



        products =
            await response.json();



        renderProducts(products);



    }
    catch(error) {


        console.error(
            error
        );


        alert(
            "ไม่สามารถโหลดข้อมูลสินค้าได้"
        );


    }


}






// ======================================
// แสดงสินค้าในตาราง
// ======================================


function renderProducts(data) {



    const tbody =
        document.getElementById(
            "products"
        );



    if (!tbody) return;




    tbody.innerHTML = "";




    if (data.length === 0) {



        tbody.innerHTML = `

            <tr>

                <td colspan="4">

                    ไม่พบสินค้า

                </td>

            </tr>

        `;


        return;

    }







    data.forEach(product => {



        const tr =
            document.createElement(
                "tr"
            );



        tr.innerHTML = `


            <td>


                <img

                    src="${product.image_url || 'images/no-image.png'}"

                    class="product-thumb"

                    alt="${product.name}"

                >


            </td>



            <td>

                ${product.name}

            </td>




            <td>

                ${formatPrice(product.price)}

                บาท

            </td>




            <td>



                <button

                    class="edit-btn"

                    onclick="editProduct(${product.id})"

                >

                    ✏️ แก้ไข

                </button>





                <button

                    class="delete-btn"

                    onclick="deleteProduct(${product.id})"

                >

                    🗑️ ลบ

                </button>



            </td>



        `;



        tbody.appendChild(tr);



    });



}







// ======================================
// ค้นหาสินค้า
// ======================================


function searchProduct() {



    const keyword =
        document
        .getElementById("search")
        .value
        .toLowerCase();



    const result =
        products.filter(product =>


            product.name
            .toLowerCase()
            .includes(keyword)



        );



    renderProducts(result);



}








// ======================================
// เปิด Modal เพิ่มสินค้า
// ======================================


function openAddModal() {



    document
    .getElementById(
        "modalTitle"
    )
    .innerText =
        "เพิ่มสินค้า";



    document
    .getElementById(
        "productId"
    )
    .value = "";



    document
    .getElementById(
        "productName"
    )
    .value = "";



    document
    .getElementById(
        "productPrice"
    )
    .value = "";



    document
    .getElementById(
        "productImage"
    )
    .value = "";



    hidePreview();




    document
    .getElementById(
        "productModal"
    )
    .style.display =
        "flex";



}







// ======================================
// ปิด Modal
// ======================================


function closeModal() {



    document
    .getElementById(
        "productModal"
    )
    .style.display =
        "none";



    if (cropper) {


        cropper.destroy();

        cropper = null;


    }



}







// ======================================
// เปิดแก้ไขสินค้า
// ======================================


function editProduct(id) {



    const product =
        products.find(
            p => p.id === id
        );



    if (!product) return;





    document
    .getElementById(
        "modalTitle"
    )
    .innerText =
        "แก้ไขสินค้า";



    document
    .getElementById(
        "productId"
    )
    .value =
        product.id;




    document
    .getElementById(
        "productName"
    )
    .value =
        product.name;




    document
    .getElementById(
        "productPrice"
    )
    .value =
        product.price;




    document
    .getElementById(
        "productImage"
    )
    .value =
        product.image_url || "";




    if(product.image_url){


        showPreview(
            product.image_url
        );


    }
    else{


        hidePreview();


    }




    document
    .getElementById(
        "productModal"
    )
    .style.display =
        "flex";



}







// ======================================
// Format ราคา
// ======================================


function formatPrice(price){


    return Number(price)
    .toLocaleString(
        "th-TH",
        {
            minimumFractionDigits:2
        }
    );


}

// ======================================
// THE ONE Bakery
// Admin Product Management
// products.js Part 2/2
// ======================================




// ======================================
// Save Product
// เพิ่ม / แก้ไขสินค้า
// ======================================


async function saveProduct() {



    const id =
        document
        .getElementById(
            "productId"
        )
        .value;



    const name =
        document
        .getElementById(
            "productName"
        )
        .value
        .trim();



    const price =
        document
        .getElementById(
            "productPrice"
        )
        .value;



    const image_url =
        document
        .getElementById(
            "productImage"
        )
        .value;




    if(!name || !price){


        alert(
            "กรุณากรอกชื่อสินค้าและราคา"
        );


        return;


    }






    const productData = {


        name,

        price,

        image_url


    };





    try {



        let response;




        // =========================
        // เพิ่มสินค้า
        // =========================


        if(!id){



            response =
                await fetch(
                    "/api/products",
                    {

                        method:"POST",

                        headers:{


                            "Content-Type":
                            "application/json"


                        },


                        body:
                        JSON.stringify(
                            productData
                        )


                    }
                );



        }





        // =========================
        // แก้ไขสินค้า
        // =========================


        else {



            response =
                await fetch(
                    `/api/products/${id}`,
                    {

                        method:"PUT",


                        headers:{


                            "Content-Type":
                            "application/json"


                        },


                        body:
                        JSON.stringify(
                            productData
                        )


                    }
                );



        }






        if(!response.ok){


            throw new Error(
                "บันทึกสินค้าไม่สำเร็จ"
            );


        }






        alert(
            "บันทึกสินค้าเรียบร้อย"
        );



        closeModal();



        loadProducts();




    }
    catch(error){


        console.error(
            error
        );


        alert(
            error.message
        );


    }



}








// ======================================
// Delete Product
// ======================================


async function deleteProduct(id){



    const product =
        products.find(
            p => p.id === id
        );



    if(!product) return;




    const confirmDelete =
        confirm(
            `ต้องการลบ "${product.name}" หรือไม่?`
        );




    if(!confirmDelete)
        return;






    try{



        const response =
            await fetch(
                `/api/products/${id}`,
                {

                    method:"DELETE"

                }
            );





        if(!response.ok){


            throw new Error(
                "ลบสินค้าไม่สำเร็จ"
            );


        }





        alert(
            "ลบสินค้าเรียบร้อย"
        );



        loadProducts();



    }
    catch(error){


        console.error(
            error
        );


        alert(
            error.message
        );


    }



}









// ======================================
// Upload Image + CropperJS
// ======================================


function setupImageUpload(){



    const input =
        document.getElementById(
            "imageFile"
        );



    if(!input) return;





    input.addEventListener(
        "change",
        function(e){



            const file =
                e.target.files[0];



            if(!file)
                return;




            const reader =
                new FileReader();





            reader.onload =
            function(event){



                const cropImage =
                    document.getElementById(
                        "cropImage"
                    );



                cropImage.src =
                    event.target.result;




                document
                .getElementById(
                    "cropModal"
                )
                .style.display =
                    "flex";






                if(cropper){


                    cropper.destroy();


                }




                cropper =
                    new Cropper(
                        cropImage,
                        {

                            aspectRatio:3 / 2,

                            viewMode:1


                        }
                    );



            };





            reader.readAsDataURL(file);




        }
    );



}









// ======================================
// Crop Save
// ======================================


document
.getElementById(
    "cropSave"
)
.addEventListener(
    "click",
    function(){



        if(!cropper)
            return;





        const canvas =
    cropper.getCroppedCanvas({
        width:600,
        height:400
    });





        const image =
            canvas.toDataURL(
                "image/jpeg"
            );





        document
        .getElementById(
            "productImage"
        )
        .value =
            image;




        showPreview(
            image
        );





        document
        .getElementById(
            "cropModal"
        )
        .style.display =
            "none";






        cropper.destroy();


        cropper = null;



    }
);









// ======================================
// Crop Cancel
// ======================================


document
.getElementById(
    "cropCancel"
)
.addEventListener(
    "click",
    function(){



        document
        .getElementById(
            "cropModal"
        )
        .style.display =
            "none";




        if(cropper){


            cropper.destroy();

            cropper=null;


        }



    }
);









// ======================================
// Preview Image
// ======================================


function showPreview(src){



    const img =
        document
        .getElementById(
            "preview"
        );



    if(!img)
        return;




    img.src =
        src;



    img.style.display =
        "block";



}







function hidePreview(){



    const img =
        document
        .getElementById(
            "preview"
        );



    if(!img)
        return;




    img.src="";



    img.style.display =
        "none";



}









// ======================================
// Close Modal Click Outside
// ======================================


window.onclick =
function(event){



    const modal =
        document
        .getElementById(
            "productModal"
        );



    if(
        event.target === modal
    ){


        closeModal();


    }


};








// ======================================
// Export
// ให้ HTML เรียกใช้ได้
// ======================================


window.openAddModal =
    openAddModal;


window.closeModal =
    closeModal;


window.saveProduct =
    saveProduct;


window.editProduct =
    editProduct;


window.deleteProduct =
    deleteProduct;