//  show/hidden
const showMenu = (toggleId, navbarId, bodyId) => {
    const toggle = document.getElementById(toggleId),
        navbar = document.getElementById(navbarId),
        bodypadding = document.getElementById(bodyId);
    if (toggle && navbar) {
        toggle.addEventListener('click', () => {
            navbar.classList.toggle('show');
            toggle.classList.toggle('rotate');
            bodypadding.classList.toggle('expander');
        });
    };
};
showMenu('nav_toggle', 'navbar', 'body');
//color hover of navbar
const linkColor = document.querySelectorAll('.nav_link');
function colorLink() {
    linkColor.forEach(link => link.classList.remove('active'));
    this.classList.add('active');
};
linkColor.forEach(link => link.addEventListener('click', colorLink));
//dropdown menu profile
const dropDownProfile = (menuId, userpicId) => {
    const userpic = document.getElementById(userpicId),
        menuProfile = document.getElementById(menuId);
    if (userpic && menuProfile) {
        userpic.addEventListener('click', (e) => {
            e.stopPropagation();
            menuProfile.classList.toggle('active');
        });
        window.addEventListener('click', (e) => {
            if (!menuProfile.contains(e.target) && !userpic.contains(e.target)) {
                menuProfile.classList.remove('active');
            };
        });
    };

};
dropDownProfile('drop-menu-profile', 'userpic');
// show notification
function notification(content, isSuccess){
    const notification = document.getElementById('notification');
    if(isSuccess){
        notification.innerHTML = `
            <ion-icon name="checkmark-outline"></ion-icon> ${content}
        `;
        notification.style.backgroundColor = `#41eea0`;
        notification.style.color = 'black';
    } else {
        notification.innerHTML = `
            <ion-icon name="alert-circle-outline"></ion-icon> ${content}
        `;
        notification.style.backgroundColor = `red`;
        notification.style.color = '#ededed';
    }
    setTimeout(() => {
        notification.classList.add('show');
    }, 0);
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3500); 
}
//set username from sessionStorage
const usernameNK = sessionStorage.getItem('username');
if (usernameNK) {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('username').textContent = `${usernameNK}`;
    });
    const username = sessionStorage.setItem("username", usernameNK)
}
// show/hide check-save
document.getElementById("save-form").addEventListener("click", (event) => {
    event.preventDefault();
    const tooltip = document.getElementById("check-save");
    tooltip.classList.toggle("active");
    listProductName.classList.remove("active")
    window.addEventListener("click", function closeTooltip(e) {
        e.stopPropagation();
        if (!tooltip.contains(e.target) && (e.target.id !== "save-form")) {
            tooltip.classList.remove("active");
            window.removeEventListener("click", closeTooltip);
        };
    });

});
//Show list supplierName when clicking the chevron (v)
const listSupplierName = document.getElementById("list-name-supplier");
const listProductName = document.getElementById("list-name-product");
const clickChevronSupplier = document.getElementById("chevron-supplier-btn");
const clickChevronProduct = document.getElementById("chevron-product-btn");
clickChevronSupplier.addEventListener("click", (e) => {
    e.preventDefault();
    listSupplierName.classList.toggle("active");
});
clickChevronProduct.addEventListener("click", (e) => {
    e.preventDefault();
    listProductName.classList.toggle("active");
});
//Show list supplierName when entering input
const enterInputSupplier = document.getElementById("supplier-name-input");
const enterInputProduct = document.getElementById("product-name-input");
enterInputProduct.addEventListener("input", () => {
    listProductName.classList.add("active");
    searchNameProduct();
    if (enterInputProduct.value === "") {
        listProductName.classList.remove("active");
    };
    //

});
enterInputSupplier.addEventListener("input", () => {
    listSupplierName.classList.add("active");
    searchNameSupplier();
    if (enterInputSupplier.value === "") {
        listSupplierName.classList.remove("active");
    };
    //

});

//function search of input name product, supplier
function searchNameSupplier() {
    const inputNameSupplier = document.getElementById("supplier-name-input").value.toLowerCase();
    const allNameSupplier = document.getElementsByClassName("name-supplier");
    Array.from(allNameSupplier).forEach((supplierName) => {
        const supplierText = supplierName.innerText.toLowerCase();
        if (supplierText.includes(inputNameSupplier)) {
            supplierName.style.display = '';
        } else {
            supplierName.style.display = "none";
        }
    });
};

function searchNameProduct() {
    const inputNameProduct = document.getElementById("product-name-input").value.toLowerCase();
    const allNameProduct = document.getElementsByClassName("name-product");
    Array.from(allNameProduct).forEach((productName) => {
        productText = productName.innerText.toLowerCase();
        if (productText.toLowerCase().includes(inputNameProduct)) {
            productName.style.display = '';
        } else {
            productName.style.display = "none";
        };
    });
};
//Open form add new product, new supplier
const closeProductIcon = document.querySelector(".icon-close-product");
const closeSupplierIcon = document.querySelector(".icon-close-supplier");
const addProductBtn = document.getElementById("add-product-btn");
const addSupplierBtn = document.getElementById("add-supplier-btn");
const openAddProduct = document.querySelector(".product-form");
const openAddSupplier = document.querySelector(".supplier-form");

addProductBtn.addEventListener("click", () => {
    openAddProduct.classList.add("active");
    addProductBtn.classList.add("close");
    openAddSupplier.classList.remove("active");
    document.querySelector('.overlay').classList.add("active");
});
closeProductIcon.addEventListener("click", () => {
    openAddProduct.classList.remove("active");
    addProductBtn.classList.remove("close");
    document.querySelector('.overlay').classList.remove("active");
});

addSupplierBtn.addEventListener("click", () => {
    openAddSupplier.classList.add("active");
    addSupplierBtn.classList.add("close");
    openAddProduct.classList.remove("active");
    document.querySelector('.overlay').classList.add("active");
});
closeSupplierIcon.addEventListener("click", () => {
    openAddSupplier.classList.remove("active");
    addSupplierBtn.classList.remove("close");
    document.querySelector('.overlay').classList.remove("active");
});
//function: fetch name supplier from dtb and showListNameSupplier
async function fetchNameSupplier() {
    try {
        const response = await fetch("http://160.191.50.248:443/api/suppliers/get-all");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        };
        const suppliers = await response.json();
        return suppliers;
    } catch (error) {
        console.error("Error: ", error);
    };
}
async function showListNameSupplier() {
    const suppliers = await fetchNameSupplier();
    const listNameSupplier = document.getElementById("list-name-supplier");
    listNameSupplier.innerHTML = "";
    suppliers.forEach(supplier => {
        const nameSupplier = `
            <p class="name-supplier" data-id="${supplier.supplierID}" id="name-supplier-${supplier.supplierID}">${supplier.name}</p>
        `;
        listNameSupplier.innerHTML += nameSupplier;
    })
    listNameSupplier.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("name-supplier")) {
            const inputSupplier = document.getElementById("supplier-name-input");
            inputSupplier.value = e.target.textContent.trim();
            const idSupplier = e.target.getAttribute("data-id");
            inputSupplier.setAttribute("data-id", idSupplier);
            listNameSupplier.classList.remove('active');
            showProductsBySupplier();
        };
    });
};
showListNameSupplier();
//function: fetch name product from dtb and showListNameProduct
async function fetchNameProduct() {
    try {
        const response = await fetch("http://160.191.50.248:443/api/products/get-all");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        };
        return await response.json();
    } catch (error) {
        console.error("Error: ", error);
    };
};
async function showListNameProduct() {
    const products = await fetchNameProduct();
    const listNameProduct = document.getElementById("list-name-product");
    listNameProduct.innerHTML = "";
    products.forEach(product => {
        const nameProduct = `
                <p class="name-product" data-id="${product.productID}" id="name-product-${product.productID}" >${product.productName}</p>
            `;
        listNameProduct.innerHTML += nameProduct;
    });

    listNameProduct.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("name-product")) {
            const inputProduct = document.getElementById("product-name-input");
            inputProduct.value = e.target.textContent.trim();
            const idProduct = e.target.getAttribute("data-id");
            inputProduct.setAttribute("data-id", idProduct);// Gán productID
            listNameProduct.classList.remove('active');
        }
    });
};

showListNameProduct();
//function fetch and show data product by supplierName
async function fetchProductsBySupplierName(supplierID) {
    try {
        const response = await fetch(`http://160.191.50.248:443/api/suppliers/${supplierID}/products`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        };
        return response.json();
    } catch (error) {
        console.error("Error: ", error);
    };
};
async function showProductsBySupplier() {
    const supplierNameInput = document.getElementById("supplier-name-input");
    const supplierID = supplierNameInput.getAttribute("data-id");
    const products = await fetchProductsBySupplierName(supplierID);
    console.log(products);
    const listNameProduct = document.getElementById("list-name-product");
    listNameProduct.innerHTML = "";
    products.forEach(product => {
        const nameProduct = `
             <p class="name-product" data-id="${product.productID}" id="name-product-${product.productID}" >${product.productName}</p>
        `;
        listNameProduct.innerHTML += nameProduct;
    });
    const textViewAll = document.createElement("span");
    textViewAll.id = "view-all-list";
    textViewAll.innerText = "---See full product list---";
    listNameProduct.appendChild(textViewAll);
    document.getElementById("view-all-list").addEventListener("click", () => {
        showListNameProduct();
    });
    listNameProduct.classList.add("active");
    document.getElementById("product-name-input").value = "";
    listNameProduct.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("name-product")) {
            const inputProduct = document.getElementById("product-name-input");
            inputProduct.value = e.target.textContent.trim();
            listNameProduct.classList.remove('active');
            const idProduct = e.target.getAttribute("data-id");
            inputProduct.setAttribute("data-id", idProduct);// Gán productID
        };
    });
};

const supplierInput = document.getElementById("supplier-name-input");
supplierInput.addEventListener("input", showProductsBySupplier);
//gen info supplier
async function genInfoToForm() {
    const supplierNameInput = document.getElementById("supplier-name-input");
    const supplierID = supplierNameInput.getAttribute("data-id");
     // Lấy productID từ input hoặc danh sách
    const productNameInput = document.getElementById("product-name-input");
    const productID = productNameInput.getAttribute("data-id");
    // Fetch thông tin nhà cung cấp
    try{
        const dataS = await fetch(`http://160.191.50.248:443/api/suppliers/search/${supplierID}`);
        if(!dataS.ok) throw new Error(`Error! Status: ${dataS.status}`);
        const suppliers = await dataS.json();
        console.log(suppliers);
        // Fetch thông tin sản phẩm theo productID
        const dataP = await fetch(`http://160.191.50.248:443/api/products/search/${productID}`);
        if(!dataS.ok) throw new Error(`Error! Status: ${dataP.status}`)
        const products = await dataP.json();
        console.log(products);
        // Tạo thông tin form
        const formPhieuNK = document.getElementById("inforSupplierProduct");
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.id = `product-${products.productID}`;
        productDiv.innerHTML = `
                <div class="product-info">
                    <span class="delete-product" id="delete-product-${products.productID}" onclick="deleteProduct('${products.productID}')">
                        <ion-icon name="close"></ion-icon>
                    </span>
                    <div class="product-details">
                        <h3>Product ID: ${products.productID}</h3>
                        <p>Product Name: ${products.productName}</p>
                        <p>UnitCal: ${products.unitCal}</p>
                        <p>Price: ${products.price.toLocaleString("vi-VN")} VND</p>
                        <label for="quantity-product-${products.productID}">Quantity:</label>
                        <input type="number" value="1" min="1" oninput="checkValidInput(this)" placeholder="Quantity" id="quantity-product-${products.productID}" class="input-quantity" required>
                    </div>
                    <div class="supplier-details">
                        <h3>Supplier ID: ${suppliers.supplierID}</h3>
                        <p>Supplier Name: ${suppliers.name}</p>
                        <p>Supplier Contact: ${suppliers.contactNumber}</p>
                        <p>Address: ${suppliers.address}</p>
                        <button class="accept-product-btn">Accept The Product</button>
                    </div>
                </div>
        `;
        formPhieuNK.appendChild(productDiv);
        notification("Fill in the form successfully", true);
        // Event accept
        bindAcceptProductEvent(productDiv);
    } catch(error){
        console.error(error);
        notification(`Error: ${error.message}`, false);
    }
};
// check valid input in form 
function checkValidInput(elementInput){
    const min = elementInput.min;
    if(elementInput.value < min){
        elementInput.value = min;
    };
};
const productInput = document.getElementById("product-name-input");
const addButton = document.getElementById("add-btn");
addButton.addEventListener("click", (e) => {
    e.preventDefault();
    if(supplierInput.value.trim() !== "" && productInput.value.trim() !== ""){
        supplierInput.disabled = true;
        supplierInput.style.backgroundColor = "#444";
        supplierInput.style.color = "#fff";
        document.getElementById("lock-input-supplier").classList.add("active");
        document.getElementById("add-supplier-btn").disabled = true;
        document.getElementById("add-supplier-btn").style.color = "#dedede";
        genInfoToForm();
    }
});
//gen infor product 2 (if need)
function bindAcceptProductEvent(productElement) {
    const acceptButtons = document.querySelectorAll(".accept-product-btn");
    acceptButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const inputProductName = document.getElementById("product-name-input");
            const listProductName = document.getElementById("list-name-product");
            const listSupplierName = document.getElementById("list-name-supplier");
            inputProductName.value = "";
            listProductName.classList.add("active");
            listSupplierName.classList.remove("active");
            button.style.display = "none";
            const quantityInput = productElement.querySelector(".input-quantity");
            quantityInput.disabled = true;
            calculateTotals();
        });
    });
};
//delete product in form
function deleteProduct(productID) {
    const product = document.getElementById(`product-${productID}`);
    product.remove();
    calculateTotals();
    notification("Delete successfully", true);
}
//reset form phieu nk
function resetForm() {
    document.getElementById("inforSupplierProduct").innerHTML = "";
    document.getElementById("total-price").innerText = "";
    document.getElementById("total-product").innerText = "";
    document.getElementById("add-supplier-btn").disabled = false;
    document.getElementById("add-supplier-btn").style.color = "black";
    notification("Reset successfully", true);
};
const resetBtn = document.getElementById("reset-phieunk-btn");
resetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    supplierInput.disabled = false;
    supplierInput.value = "";
    productInput.value = "";
    supplierInput.style.backgroundColor = "#fff";
    supplierInput.style.color = "black";
    document.getElementById("lock-input-supplier").classList.remove("active");
    resetForm();
});
//date-in
const today = new Date();
const formattedDate = today.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
});
//function calc total-product, total-price
function calculateTotals() {
    let totalProduct = 0;
    let totalPrice = 0;
    const quantityInputs = document.querySelectorAll('.input-quantity');
    quantityInputs.forEach(input => {
        const quantity = parseInt(input.value) || 0;
        const productID = input.id.split('-')[2];

        const priceElement = document.querySelector(`#product-${productID} .product-details p:nth-child(4)`);
        const priceText = priceElement.textContent.split(':')[1].trim(); 
        const price = parseFloat(priceText.replace(/\D/g, '')) || 0;

        totalProduct += quantity;
        totalPrice += quantity * price;
    });
    document.getElementById('total-product').textContent = `Total Product: ${totalProduct}`;
    document.getElementById('total-price').textContent = `Total Price: ${totalPrice.toLocaleString('vi-VN')} VND`;
    document.getElementById("date-in").textContent = `Date: ${formattedDate}`;

};
// function add suppliers
document.getElementById("save-supplier").addEventListener("click", (e) => {
    e.preventDefault();
    const newSupplier = {
        name: document.getElementById("supplier-name").value,
        contactNumber: document.getElementById("number-contact").value,
        address: document.getElementById("address").value
    };
    fetch('http://160.191.50.248:443/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier)
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status:${response.status}`);
            openAddSupplier.classList.remove("active");
            return response.json();
        })
        .then(dataS => {
            console.log(dataS);
            const inputNameSupplier = document.getElementById("supplier-name-input");
            inputNameSupplier.value = dataS.name;
            inputNameSupplier.setAttribute("data-id", dataS.supplierID)
            const listNameProduct = document.getElementById("list-name-product");
            showListNameProduct();
            listNameProduct.classList.add("active");
            const listNameSupplier = document.getElementById("list-name-supplier");
            listNameSupplier.classList.remove("active");
            notification("New supplier added successfully", true);
        })
        .catch(error => {
            console.error("Error:", error);
            notification(`Error: ${error.status}`, false);
        });
});
//function add products
document.getElementById("save-product").addEventListener("click", (e) => {
    e.preventDefault();
    const newProduct = {
        productName: document.getElementById("product-name").value,
        unitCal: document.getElementById("product-unitCal").value,
        quantity: 0,
        category: document.getElementById("product-category").value,
        price: parseFloat(document.getElementById("product-price").value),
    };
    console.log("Sending data:", JSON.stringify(newProduct));
    fetch(`http://160.191.50.248:443/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    })
        .then(response => {
            console.log(response)
            if (!response.ok) {
                throw new Error(`HTTP error! Status:${response.status}`);
            }
            return response.json();
        })
        .then(dataP => {
            const inputNameProduct = document.getElementById("product-name-input");
            inputNameProduct.value = dataP.productName;
            inputNameProduct.setAttribute("data-id", dataP.productID)
            openAddProduct.classList.remove("active");
            const listNameProduct = document.getElementById("list-name-product");
            listNameProduct.classList.remove("active");
            notification("New product added successfully", true);
        })
        .catch(error => {
            console.error("Error: ", error);
            notification(`Error: ${error.status}`, false);
        });
});
// function link productID to supplierID
const checkSave = document.getElementById("check-save");
checkSave.addEventListener("click", async function (e){
    e.preventDefault();
    this.classList.remove("active");
    //save info phieu nk in session storage
    const infoPhieuNK = Array.from(document.querySelectorAll(".product")).map((product) => {
        return {
            productID: product.querySelector("h3").textContent.split(": ")[1],
            productName: product.querySelector("p:nth-child(2)").textContent.split(": ")[1],
            unitCal: product.querySelector("p:nth-child(3)").textContent.split(": ")[1],
            price: product.querySelector("p:nth-child(4)").textContent.split(": ")[1],
            quantity: product.querySelector(".input-quantity").value,
            supplierID: product.querySelector(".supplier-details h3").textContent.split(": ")[1],
            supplierName: product.querySelector(".supplier-details p:nth-child(2)").textContent.split(": ")[1],
            supplierContact: product.querySelector(".supplier-details p:nth-child(3)").textContent.split(": ")[1],
            supplierAddress: product.querySelector(".supplier-details p:nth-child(4)").textContent.split(": ")[1]
        };
    });
    const totalProductElement = document.getElementById("total-product").textContent;
    const totalProduct = parseInt(totalProductElement.split(": ")[1].trim());
    const totalPriceElement = document.getElementById("total-price").textContent;
    const totalPrice = parseFloat(totalPriceElement.split(": ")[1].trim().replace(/\D/g, ""));
    const dateIn = document.getElementById("date-in").textContent;
    try {
        const importNote = {
            quantities: infoPhieuNK.map(info => info.quantity),
            totalMoney: totalPrice,
            totalQuantity: totalProduct,
            supplierID: infoPhieuNK.find(info => info.supplierID).supplierID,
            productIDs: infoPhieuNK.map(info => info.productID)
        };
        console.log(importNote);
        const resPOST = await fetch('http://160.191.50.248:443/api/imports/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(importNote)
        });
        if (!resPOST.ok) {
            throw new Error(`HTTP error! Status: ${resPOST.status}`);
        };
        const dataIm = await resPOST.json();
        console.log(dataIm)
        const importID = dataIm.importID;
        const phieuNKData = {
            infoPhieuNK,
            totalPriceElement,
            totalProductElement,
            dateIn,
            importID
        };
        sessionStorage.setItem("phieuNKData", JSON.stringify(phieuNKData));
        window.open("showPhieuNK.html", "_blank");

    } catch (error) {
        console.error(error);
        notification(`Error: ${error.status}`, false)
    };
});


