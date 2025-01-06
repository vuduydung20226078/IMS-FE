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
//Show list partnerName when clicking the chevron (v)
const listPartnerName = document.getElementById("list-name-partner");
const listProductName = document.getElementById("list-name-product");
const clickChevronPartner = document.getElementById("chevron-partner-btn");
const clickChevronProduct = document.getElementById("chevron-product-btn");
clickChevronPartner.addEventListener("click", (e) => {
    e.preventDefault();
    listPartnerName.classList.toggle("active");
});
clickChevronProduct.addEventListener("click", (e) => {
    e.preventDefault();
    listProductName.classList.toggle("active");
});

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

//Show list partnerName when entering input
const enterInputPartner = document.getElementById("partner-name-input");
const enterInputProduct = document.getElementById("product-name-input");
enterInputProduct.addEventListener("input", () => {
    listProductName.classList.add("active");
    searchNameProduct();
    if (enterInputProduct.value === "") {
        listProductName.classList.remove("active");
    };
    //

});
enterInputPartner.addEventListener("input", () => {
    listPartnerName.classList.add("active");
    searchNamePartner();
    if (enterInputPartner.value === "") {
        listPartnerName.classList.remove("active");
    };
});

//function search of input name product, partner
function searchNamePartner() {
    const inputNamePartner = document.getElementById("partner-name-input").value.toLowerCase();
    const allNamePartner = document.getElementsByClassName("name-partner");
    Array.from(allNamePartner).forEach((partnerName) => {
        const partnerText = partnerName.innerText.toLowerCase();
        if (partnerText.includes(inputNamePartner)) {
            partnerName.style.display = '';
        } else {
            partnerName.style.display = "none";
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
//Open form add new product, new partner
const closePartnerIcon = document.querySelector(".icon-close-partner");
const addPartnerBtn = document.getElementById("add-partner-btn");
const openAddPartner = document.querySelector(".partner-form");
addPartnerBtn.addEventListener("click", () => {
    openAddPartner.classList.add("active");
    addPartnerBtn.classList.add("close");
    openAddProduct.classList.remove("active");
    document.querySelector('.overlay').classList.add('active');
});
closePartnerIcon.addEventListener("click", () => {
    openAddPartner.classList.remove("active");
    addPartnerBtn.classList.remove("close");
    document.querySelector('.overlay').classList.remove('active');
});
//function: fetch name partner from dtb and showListNamePartner
async function fetchNamePartner() {
    try {
        const response = await fetch("https://www.smithsfallsnailsspa.com/api/partners/get-all");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        };
        const partners = await response.json();
        return partners;
    } catch (error) {
        console.error("Error: ", error);
    };
}
async function showListNamePartner() {
    const partners = await fetchNamePartner();
    const listNamePartner = document.getElementById("list-name-partner");
    listNamePartner.innerHTML = "";
    partners.forEach(partner => {
        const namePartner = `
            <p class="name-partner" data-id="${partner.partnerID}" id="name-partner-${partner.partnerID}">${partner.name}</p>
        `;
        listNamePartner.innerHTML += namePartner;
    })
    listNamePartner.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("name-partner")) {
            const inputPartner = document.getElementById("partner-name-input");
            inputPartner.value = e.target.textContent.trim();
            const idPartner = e.target.getAttribute("data-id");
            inputPartner.setAttribute("data-id", idPartner);
            listNamePartner.classList.remove('active');
        };
    });
};
showListNamePartner();
//function: fetch name product from dtb and showListNameProduct
async function fetchNameProduct() {
    try {
        const response = await fetch("https://www.smithsfallsnailsspa.com/api/products/get-all");
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
                <p class="name-product" data-id="${product.productID}" data-quantity="${product.quantity}" id="name-product-${product.productID}" >${product.productName}</p>
            `;
        listNameProduct.innerHTML += nameProduct;
    });

    listNameProduct.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("name-product")) {
            const inputProduct = document.getElementById("product-name-input");
            inputProduct.value = e.target.textContent.trim();
            const idProduct = e.target.getAttribute("data-id");
            inputProduct.setAttribute("data-id", idProduct);
            const quantityData = e.target.getAttribute("data-quantity");
            inputProduct.setAttribute("data-quantity", quantityData);
            listNameProduct.classList.remove('active');
        }
    });
};

showListNameProduct();
//gen info partner
async function genInfoToForm() {
    const partnerNameInput = document.getElementById("partner-name-input");
    const partnerID = partnerNameInput.getAttribute("data-id");

    const productNameInput = document.getElementById("product-name-input");
    const productID = productNameInput.getAttribute("data-id");
    const quantityData = productNameInput.getAttribute("data-quantity");

    try{
        const dataS = await fetch(`https://www.smithsfallsnailsspa.com/api/partners/search/${partnerID}`);
        if(!dataS.ok) throw new Error(`Error! Status: ${dataS.status}`);
        const partners = await dataS.json();
        
        const dataP = await fetch(`https://www.smithsfallsnailsspa.com/api/products/search/${productID}`);
        if(!dataS.ok) throw new Error(`Error! Status: ${dataP.status}`)
        const products = await dataP.json();
        // Tạo thông tin form
        const formPhieuNK = document.getElementById("inforPartnerProduct");
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
                        <input type="number" min="1" value="1" oninput="checkValidInput(this)" placeholder="Quantity" id="quantity-product-${products.productID}" class="input-quantity" required>
                    </div>
                    <div class="partner-details">
                        <h3>Partner ID: ${partners.partnerID}</h3>
                        <p>Partner Name: ${partners.name}</p>
                        <p>Partner Contact: ${partners.contactNumber}</p>
                        <p>Address: ${partners.address}</p>
                        <button data-quantity="${quantityData}" class="accept-product-btn">Accept The Product</button>
                    </div>
                </div>
        `;
        formPhieuNK.appendChild(productDiv);
        notification("Fill in the form successfully", true);
        // Event accept
        bindAcceptProductEvent(productDiv);
    } catch(error){
        console.error(error);
        notification(`Error: ${error.status}`, false);
    }
};
// check valid input in form 
function checkValidInput(elementInput){
    const min = elementInput.min;
    if(elementInput.value < min){
        elementInput.value = min;
    };
};
const partnerInput = document.getElementById("partner-name-input");
const productInput = document.getElementById("product-name-input");
const addButton = document.getElementById("add-btn");
addButton.addEventListener("click", (e) => {
    e.preventDefault();
    if(partnerInput.value.trim() !== "" && productInput.value.trim() !== ""){
        partnerInput.disabled = true;
        partnerInput.style.backgroundColor = "#444";
        partnerInput.style.color = "#fff";
        document.getElementById("lock-input-partner").classList.add("active");
        document.getElementById("add-partner-btn").disabled = true;
        document.getElementById("add-partner-btn").style.color = "#dedede";
        genInfoToForm();
    }
});
//gen infor product 2 (if need)
function bindAcceptProductEvent(productElement) {
    const acceptButtons = document.querySelectorAll(".accept-product-btn");
    acceptButtons.forEach(button => {
        button.addEventListener("click", function (e){
            e.preventDefault();
            const quantityInInventory = this.getAttribute("data-quantity");
            const quantityInput = productElement.querySelector(".input-quantity");
            if(parseInt(quantityInput.value) <= quantityInInventory){
                const inputProductName = document.getElementById("product-name-input");
                const listProductName = document.getElementById("list-name-product");
                const listPartnerName = document.getElementById("list-name-partner");
                inputProductName.value = "";
                listProductName.classList.add("active");
                listPartnerName.classList.remove("active");
                button.style.display = "none";
                quantityInput.disabled = true;
                calculateTotals();
            } else {
                notification("The quantity of this product in stock is not enough", false);
            };
        });
    });
};
//delete product in form
function deleteProduct(productID) {
    const product = document.getElementById(`product-${productID}`);
    product.remove();
    calculateTotals();
    notification("Deleted successfully!", true);
};
//reset form phieu nk
function resetForm() {
    document.getElementById("inforPartnerProduct").innerHTML = "";
    document.getElementById("total-price").innerText = "";
    document.getElementById("total-product").innerText = "";
    document.getElementById("add-partner-btn").disabled = false;
    document.getElementById("add-partner-btn").style.color = "black";
    notification("Reseted successfully!", true);
};
const resetBtn = document.getElementById("reset-phieunk-btn");
resetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    partnerInput.disabled = false;
    partnerInput.value = "";
    productInput.value = "";
    partnerInput.style.backgroundColor = "#fff";
    partnerInput.style.color = "black";
    document.getElementById("lock-input-partner").classList.remove("active");
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
// function add partners
document.getElementById("save-partner").addEventListener("click", (e) => {
    e.preventDefault();
    const newPartner = {
        name: document.getElementById("partner-name").value,
        contactNumber: document.getElementById("number-contact").value,
        address: document.getElementById("address").value
    };
    fetch('https://www.smithsfallsnailsspa.com/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartner)
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status:${response.status}`);
            openAddPartner.classList.remove("active");
            return response.json();
        })
        .then(dataS => {
            console.log(dataS);
            const inputNamePartner = document.getElementById("partner-name-input");
            inputNamePartner.value = newPartner.name;
            inputNamePartner.setAttribute("data-id", dataS.partner.partnerID)
            const listNameProduct = document.getElementById("list-name-product");
            showListNameProduct();
            listNameProduct.classList.add("active");
            const listNamePartner = document.getElementById("list-name-partner");
            listNamePartner.classList.remove("active");
            document.getElementById("overlay").classList.remove("active");
            notification("New partner added successfully!", true);
        })
        .catch(error => {
            console.error("Error:", error);
            notification(`Error: ${error.status}`);
        });
});

// function link productID to partnerID
const checkSave = document.getElementById("check-save");
checkSave.addEventListener("click", async (e) => {
    e.preventDefault();
    checkSave.classList.remove("active");
    //save info phieu nk in session storage
    const infoPhieuXK = Array.from(document.querySelectorAll(".product")).map((product) => {
        return {
            productID: product.querySelector("h3").textContent.split(": ")[1],
            productName: product.querySelector("p:nth-child(2)").textContent.split(": ")[1],
            unitCal: product.querySelector("p:nth-child(3)").textContent.split(": ")[1],
            price: product.querySelector("p:nth-child(4)").textContent.split(": ")[1],
            quantity: product.querySelector(".input-quantity").value,
            partnerID: product.querySelector(".partner-details h3").textContent.split(": ")[1],
            partnerName: product.querySelector(".partner-details p:nth-child(2)").textContent.split(": ")[1],
            partnerContact: product.querySelector(".partner-details p:nth-child(3)").textContent.split(": ")[1],
            partnerAddress: product.querySelector(".partner-details p:nth-child(4)").textContent.split(": ")[1]
        };
    });
    const totalProductElement = document.getElementById("total-product").textContent;
    const totalProduct = parseInt(totalProductElement.split(": ")[1].trim());
    const totalPriceElement = document.getElementById("total-price").textContent;
    const totalPrice = parseFloat(totalPriceElement.split(": ")[1].trim().replace(/\D/g, ""));
    const dateIn = document.getElementById("date-in").textContent;
    try {
        const exportNote = {
            quantities: infoPhieuXK.map(info => info.quantity),
            totalMoney: totalPrice,
            totalQuantity: totalProduct,
            partnerID: infoPhieuXK.find(info => info.partnerID).partnerID,
            productIDs: infoPhieuXK.map(info => info.productID)
        };
        console.log(exportNote);
        const resPOST = await fetch('https://www.smithsfallsnailsspa.com/api/exports/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exportNote)
        });
        if (!resPOST.ok) {
            throw new Error(`HTTP error! Status: ${resPOST.status}`);
        };
        const dataIm = await resPOST.json();
        console.log(dataIm)
        const exportID = dataIm.exportID;
        const phieuXKData = {
            infoPhieuXK,
            totalPriceElement,
            totalProductElement,
            dateIn,
            exportID
        };
        sessionStorage.setItem("phieuXKData", JSON.stringify(phieuXKData));
        console.log(phieuXKData)
        window.open("showPhieuXK.html", "_blank");

    } catch (error) {
        console.error(error);
        notification(`Error: ${error.status}`);
    };
});


