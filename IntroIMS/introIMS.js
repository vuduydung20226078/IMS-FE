// document.getElementById("myLink").addEventListener("click", function(event) {
//     event.preventDefault(); // Ngăn việc load lại trang
//     window.location.href = "./ManagementSupplier/supplierManagerment.html"
    
//     // history.pushState({}, "", "https://www.smithsfallsnailsspa.com/supplierManagement.html"); // Cập nhật URL mà không reload trang
// });

// show/hidden
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
    }
};
showMenu('nav_toggle', 'navbar', 'body');

// color hover of navbar
const linkColor = document.querySelectorAll('.nav_link');
function colorLink() {
    linkColor.forEach(link => link.classList.remove('active'));
    this.classList.add('active');
}
linkColor.forEach(link => link.addEventListener('click', colorLink));

// dropdown menu profile
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
            }
        });
    }
};
dropDownProfile('drop-menu-profile', 'userpic');

// set username from sessionStorage
const usernameP = sessionStorage.getItem('username');
if (usernameP) {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('username').textContent = `${usernameP}`;
    });
    const username = sessionStorage.setItem('username', usernameP)
}


// show/hide button <<add products>>
const closeIcon = document.querySelector(".icon-close");
const addProductBtn = document.getElementById("add-product-btn");
const editProductBtn = document.getElementById("edit-btn");
const openAddProduct = document.querySelector(".product-form");

addProductBtn.addEventListener("click", () => {
    openAddProduct.classList.add("active");
    addProductBtn.classList.add("close");
    document.querySelector('.overlay').classList.add("active");
});
closeIcon.addEventListener("click", () => {
    openAddProduct.classList.remove("active");
    addProductBtn.classList.remove("close");
    document.querySelector('.overlay').classList.remove("active");
});
// filter category
async function categoryUnique(){
    try {
        const response = await fetch(`https://www.smithsfallsnailsspa.com/api/products/get-all`);
        if(!response.ok) throw new Error(`Error, Status: ${response.status}`);
        const dataReceived = await response.json();
        const category = dataReceived.map(data => data.category);
        const categoryUnique = [...new Set(category)];
        const optionCategory = document.getElementById("filter-by-category");
        optionCategory.innerHTML = "";
        categoryUnique.forEach(category => {
            const elementLi = `
                <li style="width: 200px; height: auto" onclick="filterByCategory(this)">${category}</li>
            `;
            optionCategory.innerHTML += elementLi;
        })
    } catch(error){
        console.error(error);
    };
};
document.addEventListener('DOMContentLoaded', function() {
    categoryUnique();
})

// show products
function showListProducts() {
    fetch(`https://www.smithsfallsnailsspa.com/api/products/get-all`)
        .then(response => response.json())
        .then(data => {
            let tableBody = document.getElementById('product-table-body');
            if (!data || data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='8'>No products found.</td></tr>";
                return;
            }
            tableBody.innerHTML = "";
            let productsToShow = data.slice(0, 8);
            productsToShow.forEach(product => {
                let rowProduct = `
                <tr class="row" id="product-row-${product.productID}">
                    <td class="content">${product.productID}</td>
                    <td class="content" contenteditable="false" id="product-name-${product.productID}" onclick="showHistory(${product.productID})">${product.productName}</td>
                    <td class="content" contenteditable="false" id="product-quantity-${product.productID}" onclick="showHistory(${product.productID})">${product.quantity}</td>
                    <td class="content" contenteditable="false" id="product-unit-${product.productID}" onclick="showHistory(${product.productID})">${product.unitCal}</td>
                    <td class="content" contenteditable="false" id="product-category-${product.productID}" onclick="showHistory(${product.productID})">${product.category}</td>
                    <td class="content" contenteditable="false" id="product-price-${product.productID}" onclick="showHistory(${product.productID})">${product.price}</td>
                    <td class="content" id="product-lastupdate-${product.productID}" onclick="showHistory(${product.productID})">${product.lastUpdate || "N/A"}</td>
                    <td id="delete-edit">
                        <button type="button" class="delete-button" id="delete-button" onclick="deleteTooltip('${product.productID}',event)">
                            <span class="tooltip" id="tooltip-${product.productID}" onclick="deleteProduct('${product.productID}')">If you delete this product here, it will also be deleted in the product list provided by the supplier. Click this notification to delete!</span>
                        Delete</button>
                        <button type="button" class="edit-button" id="edit-button-${product.productID}" onclick="toggleEdit('${product.productID}', event)">Edit</button>
                    </td>    
                </tr>
            `;
                tableBody.innerHTML += rowProduct;
            });
        })
        .catch(error => {
            console.error("Error: ", error);
        });
}
showListProducts();

// function show products (search, viewall, hidesomeproducts)
function displayProducts(productsToShow) {
    let tableBodyProduct = document.getElementById("product-table-body");
    if (!productsToShow || productsToShow.length === 0) {
        tableBodyProduct.innerHTML = "<tr><td colspan='8'>No products found.</td></tr>";
        return;
    }
    tableBodyProduct.innerHTML = "";
    productsToShow.forEach(product => {
        let rowProduct = `
                <tr class="row" id="product-row-${product.productID}">
                    <td class="content">${product.productID}</td>
                    <td class="content" contenteditable="false" id="product-name-${product.productID}" onclick="showHistory(${product.productID})">${product.productName}</td>
                    <td class="content" contenteditable="false" id="product-quantity-${product.productID}" onclick="showHistory(${product.productID})">${product.quantity}</td>
                    <td class="content" contenteditable="false" id="product-unit-${product.productID}" onclick="showHistory(${product.productID})">${product.unitCal}</td>
                    <td class="content" contenteditable="false" id="product-category-${product.productID}" onclick="showHistory(${product.productID})">${product.category}</td>
                    <td class="content" contenteditable="false" id="product-price-${product.productID}" onclick="showHistory(${product.productID})">${product.price}</td>
                    <td class="content" id="product-lastupdate-${product.productID}" onclick="showHistory(${product.productID})">${product.lastUpdate || "N/A"}</td>
                    <td id="delete-edit">
                        <button type="button" class="delete-button" id="delete-button" onclick="deleteTooltip('${product.productID}',event)">
                            <span class="tooltip" id="tooltip-${product.productID}" onclick="deleteProduct('${product.productID}')">If you delete this product here, it will also be deleted in the product list provided by the supplier. Click this notification to delete!</span>
                        Delete</button>
                        <button type="button" class="edit-button" id="edit-button-${product.productID}" onclick="toggleEdit('${product.productID}', event)">Edit</button>
                    </td>    
                </tr>
            `;
        tableBodyProduct.innerHTML += rowProduct;
    });
}
async function showHistory(productID){
    try {
        const response = await fetch(`https://www.smithsfallsnailsspa.com/api/products/${productID}/history`);
        if(!response.ok) throw new Error(`Error! Status: ${response.status}`);
        const dataReceived = await response.json();
        const tableBodyHistory = document.getElementById("table-body-cart");
        tableBodyHistory.innerHTML = "";
        if(dataReceived.length === 0){
           tableBodyHistory.innerHTML =  `<tr><td colspan='6'>This product doesn't have any history in import or export.</td></tr>`;
        }
        dataReceived.forEach(data => {
            let typeNote = "";
            if(data.type === "import"){
                typeNote = "Import";
            } else if(data.type === "export") {
                typeNote = "Export";
            };
            const row = `
                    <tr>
                        <td>${typeNote}</td>
                        <td>${data.transaction_id}</td>
                        <td>${data.product_id}</td>
                        <td>${data.product_name}</td>
                        <td>${data.quantity}</td>
                    </tr>
            `;
            tableBodyHistory.innerHTML += row
        });
        document.getElementById("title-cart").classList.add("active");
        document.getElementById("in-cart").classList.add("active");
        document.getElementById("overlay").classList.add("active");
    } catch(error){
        console.error(error);
        document.getElementById("title-cart").classList.add("active");
        document.getElementById("in-cart").classList.add("active");
        document.getElementById("overlay").classList.add("active");
        const rowError = `<tr><td colspan='6'>This product doesn't have any history in import or export.</td></tr>`;
        document.getElementById("table-body-cart").innerHTML = rowError;
    }
}
document.getElementById("close-cart").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("title-cart").classList.remove("active");
    document.getElementById("in-cart").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
})
// function search products
async function searchProducts() {
    try {
        let products;
        if (isFilteringByRange === true && isSorting === false && isFilteringByCategory === false) {
            products = await filterByRange(liElementWhich, isFilterBy);
        } 
        else if (isFilteringByRange === true && isSorting === true && isFilteringByCategory === false){
            products = await sortTable(typeData, !isAscending, isFilteringByRange, isFilteringByCategory);
        } 
        else if (isFilteringByRange === false && isSorting === false && isFilteringByCategory === true){
            products = JSON.parse(sessionStorage.getItem("dataFiltered"));
        } 
        else if (isFilteringByRange === false && isSorting === true && isFilteringByCategory === true){
            products = await sortTable(typeData, !isAscending, isFilteringByRange, isFilteringByCategory);
        } 
        else if (isFilteringByRange === false && isSorting === true && isFilteringByCategory === false){
            products = await sortTable(typeData, !isAscending, isFilteringByRange, isFilteringByCategory);
        }
        else {
            const response = await fetch('https://www.smithsfallsnailsspa.com/api/products/get-all');
            if (!response.ok) {
                throw new Error(`HTTP Error, Status: ${response.status}`);
            };
            products = await response.json();
        }
        const searchTerm = document.getElementById("search-text").value.toLowerCase().trim();
        const filteredProducts = products.filter(product => {
            const productID = product.productID ? product.productID.toString().toLowerCase() : ""; 
            const productName = product.productName ? product.productName.toLowerCase() : ""; 
            const category = product.category ? product.category.toLowerCase() : ""; 
            return (
                productID.includes(searchTerm) ||
                productName.includes(searchTerm) ||
                category.includes(searchTerm)
            );
        });
        if (showAll){
            displayProducts(filteredProducts);
        } else {
            displayProducts(filteredProducts.slice(0, 8));
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
// search: click icon <<search>> or input <<abc...>>
document.getElementById("search-button").addEventListener("click", searchProducts);
document.getElementById("search-text").addEventListener("input", searchProducts);
// function delete products
function deleteTooltip(productID, event) {
    event.preventDefault()
    event.stopPropagation()
    const tooltipDelete = document.getElementById(`tooltip-${productID}`)
    tooltipDelete.classList.add("active")
    if (tooltipDelete.classList.contains("active")) {
        window.addEventListener('click', (e) => {
            tooltipDelete.classList.remove("active")
        });
    }
}

function deleteProduct(productId) {
    fetch(`https://www.smithsfallsnailsspa.com/api/products/delete/${productId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status:${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            const rowToDelete = document.getElementById(`product-row-${productId}`);
            if (rowToDelete) {
                rowToDelete.remove();
            }
            showListProducts();
            showNotificationOk("Product Deleted Successfully");
        })
        .catch(error => {
            console.error(`Error deleting product: `, error);
            showNotificationError(error.message);
        });
}

// function edit products
function toggleEdit(productId, event) {
    event.preventDefault();
    const isEditing = document.getElementById(`edit-button-${productId}`).innerText === `Edit`;
    const rowProduct = document.getElementById(`product-row-${productId}`);
    const nameCell = document.getElementById(`product-name-${productId}`);
    const unitCell = document.getElementById(`product-unit-${productId}`);
    const categoryCell = document.getElementById(`product-category-${productId}`);
    const priceCell = document.getElementById(`product-price-${productId}`);

    if (isEditing) {
        rowProduct.style.background = "white";
        rowProduct.style.color = "black";
        nameCell.contentEditable = "true";
        unitCell.contentEditable = "true";
        categoryCell.contentEditable = "true";
        priceCell.contentEditable = "true";
        document.getElementById(`edit-button-${productId}`).innerText = 'Save';
    } else {
        const updatedProduct = {
            productName: nameCell.innerText,
            unitCal: unitCell.innerText,
            category: categoryCell.innerText,
            price: parseFloat(priceCell.innerText)
        };
        updateProduct(productId, updatedProduct);
        nameCell.contentEditable = "false";
        unitCell.contentEditable = "false";
        categoryCell.contentEditable = "false";
        priceCell.contentEditable = "false";
        document.getElementById(`edit-button-${productId}`).innerText = `Edit`;
        rowProduct.style.background = "";
        rowProduct.style.color = "";
    }
}

function updateProduct(productId, updatedProduct) {
    console.log(updatedProduct)
    fetch(`https://www.smithsfallsnailsspa.com/api/products/update/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status:${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            document.getElementById(`product-lastupdate-${productId}`).innerText = data.lastUpdate;
            showNotificationOk("Product updated successfully");
        })
        .catch(error => {
            console.error('Error:', error);
            showNotificationError(error.message);
        });
}

// function add products
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
    fetch(`https://www.smithsfallsnailsspa.com/api/products/insert`, {
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
        .then(data => {
            console.log(data);
            openAddProduct.classList.remove("active");
            addProductBtn.classList.remove("close");
            showListProducts();
            showNotificationOk("Product Added Successfully");
            document.getElementById("overlay").classList.remove("active");
        })
        .catch(error => {
            console.error("Error: ", error);
            showNotificationError(error.message);
        });
});

// view all or hide some products
let isSorting = false;
let showAll = false;
async function viewAllOrHide() {
    try {
        let products;
        if (isFilteringByRange === true && isSorting === false && isFilteringByCategory === false) {
            products = await filterByRange(liElementWhich, isFilterBy);
        } 
        else if (isFilteringByRange === true && isSorting === true && isFilteringByCategory === false){
            products = await sortTable(typeData, !isAscending, isFilteringByRange, isFilteringByCategory);
        } 
        else if (isFilteringByRange === false && isSorting === false && isFilteringByCategory === true){
            products = {};
        } 
        else if (isFilteringByRange === false && isSorting === true && isFilteringByCategory === true){
            products = await sortTable(typeData, !isAscending, isFilteringByRange, isFilteringByCategory);
        } 
        else if (isFilteringByRange === false && isSorting === true && isFilteringByCategory === false){
            products = await sortTable(typeData, !isAscending, isFilteringByRange, isFilteringByCategory);
        }
        else {
            const response = await fetch('https://www.smithsfallsnailsspa.com/api/products/get-all');
            if (!response.ok) {
                throw new Error(`HTTP Error, Status: ${response.status}`);
            };
            products = await response.json();
        }
        if (!showAll) {
            displayProducts(products);
            showAll = !showAll;
            document.getElementById("view-all-btn").textContent = "Hide Some Products";
        } else {
            displayProducts(products.slice(0, 8));
            showAll = !showAll;
            document.getElementById("view-all-btn").textContent = "View All";
        };
    } catch (error) {
        console.error("Error: ", error);
    }
}

document.getElementById("view-all-btn").addEventListener("click", (event) => {
    event.preventDefault();
    viewAllOrHide();
});

// function show notification

const showNotificationError = (message) => {
    const notification = document.getElementById("notification-error");
    notification.style.display = "flex";
    const notificationText = document.getElementById("content-error");
    notificationText.innerText = message;
    // hidden the notification after 3s
    setTimeout(() => {
        notification.style.display = "none";
    }, 1500);
};

const showNotificationOk = (message) => {
    const notification = document.getElementById("notification-success");
    notification.style.display = "flex";
    const notificationText = document.getElementById("content-success");
    notificationText.innerText = message;
    // hidden the notification after 3s
    setTimeout(() => {
        notification.style.display = "none";
    }, 1500);
};

// sort with filter or not filter
let isFilteringByCategory = false;
let isFilteringByRange = false;
let isFilter = false; 
let isFilterBy = "";
async function sortTable(typeData, isAscending, isFilteringByRange, isFilteringByCategory) {
    let productsToSort;
    try {
        if (isFilteringByRange) {
            productsToSort = await filterByRange(liElementWhich, isFilterBy);
        } else if(isFilteringByCategory) {
            productsToSort = JSON.parse(sessionStorage.getItem("dataFiltered"));
        } else {
            const response = await fetch(`https://www.smithsfallsnailsspa.com/api/products/get-all`);
            if (!response.ok) {
                throw new Error(`HTTP Error, Status: ${response.status} `);
            };
            productsToSort = await response.json();
        }
        const productsSorted = productsToSort.sort((pA, pB) => {
            if (typeData === "StringName"){
                return isAscending ? pA.productName.localeCompare(pB.productName) :  pB.productName.localeCompare(pA.productName);
            }
            if (typeData === "numberQuantity"){
                return isAscending? pA.quantity - pB.quantity : pB.quantity - pA.quantity;
            }
            if (typeData === "numberPrice"){
                return isAscending? pA.price - pB.price : pB.price - pA.price;
            }
            if (typeData === "Date"){
                const dateA = moment(pA.lastUpdate);
                const dateB = moment(pB.lastUpdate);
                if (isAscending) {
                    console.log(isAscending)
                    return dateA.isBefore(dateB) ? -1 : (dateA.isSame(dateB) ? 0 : 1);
                } else {
                    console.log(isAscending)
                    return dateB.isBefore(dateA) ? -1 : (dateB.isSame(dateA) ? 0 : 1);
                }         
            }
        });
        console.log(productsSorted)
        if (!showAll) displayProducts(productsSorted.slice(0, 8));
        else displayProducts(productsSorted);
        return productsSorted;
    } catch (error) {
        console.error(error);
    };
}
let isAscending = true;
let typeData;
let cell;
let index;
document.querySelector("table thead tr").addEventListener("click", (e) => {
    cell = e.target; //htmlcollection click
    index = cell.cellIndex;
    if (index === 1) {
        typeData = "StringName";
        sortTable(typeData, isAscending, isFilteringByRange, isFilteringByCategory);
    }
    if (index === 2) {
        typeData = "numberQuantity";
        sortTable(typeData, isAscending, isFilteringByRange, isFilteringByCategory);
    }
    if (index === 5) {
        typeData = "numberPrice";
        sortTable(typeData, isAscending, isFilteringByRange, isFilteringByCategory);
    }
    if (index === 6) {
        console.log("date")
        typeData = "Date"
        sortTable(typeData, isAscending, isFilteringByRange, isFilteringByCategory);
    }
    isAscending = !isAscending;
    isSorting = true;
})
document.getElementById("filter-menu-btn").addEventListener("click", () => {
    document.getElementById("filter-menu").classList.toggle("active");
})
// function filter by ...
function filterByRange(range, filterByWhat) {
    let min, max;
    if (filterByWhat === "Quantity"){
        switch (range) {
            case '0 - 10':
                min = 0;
                max = 10;
                break;
            case '11 - 100':
                min = 11;
                max = 100;
                break;
            case '101 - 1000':
                min = 101;
                max = 1000;
                break;
            case '1001+':
                min = 1001;
                max = Infinity;
                break;
            default:
                return;
        };
        return fetch('https://www.smithsfallsnailsspa.com/api/products/get-all')
        .then (response => {
            if (!response.ok){
                throw new Error(`HTTP Error! Status: ${response.status}`);
            };
            return response.json();
        })
        .then(productData => {
            const productFiltered = productData.filter(p => p.quantity >= min && p.quantity <= max);
            if (!showAll) displayProducts(productFiltered.slice(0, 8));
            else displayProducts(productFiltered);
            document.getElementById("filter-menu").classList.remove("active");
            return productFiltered;
        })
        .catch (error => console.error(error));
    }
    if (filterByWhat === "Price"){
        switch (range) {
            case '1k - 100k':
                min = 1000;
                max = 100000;
                break;
            case '101k - 500k':
                min = 101000;
                max = 500000;
                break;
            case '501k - 1000k':
                min = 501000;
                max = 1000000;
                break;
            case '1001k+':
                min = 1001000;
                max = Infinity;
                break;
            default:
                return;
        };
        return fetch('https://www.smithsfallsnailsspa.com/api/products/get-all')
        .then (response => {
            if (!response.ok){
                throw new Error(`HTTP Error! Status: ${response.status}`);
            };
            return response.json();
        })
        .then(productData => {
            const productFiltered = productData.filter(p => p.price >= min && p.price <= max);
            if (!showAll) displayProducts(productFiltered.slice(0, 8));
            else displayProducts(productFiltered);
            document.getElementById("filter-menu").classList.remove("active");
            return productFiltered;
        })
        .catch (error => console.error(error));
    }
    if (filterByWhat === "LastUpdate"){
        const toDay = new Date()
        console.log(toDay);
        let RangeDaysAgo;
        switch (range) {
            case '1 day':
                RangeDaysAgo = toDay.setHours(toDay.getHours() - 24);
                break;
            case '1 week':
                RangeDaysAgo = toDay.setDate(toDay.getDate() - 7);
                break;
            case '1 month':
                RangeDaysAgo = toDay.setMonth(toDay.getMonth() - 1);
                break;
            case '1 year':
                RangeDaysAgo = toDay.setFullYear(toDay.getFullYear() - 1);
                break;
            default:
                return;
        };
        return fetch('https://www.smithsfallsnailsspa.com/api/products/get-all')
        .then (response => {
            if (!response.ok){
                throw new Error(`HTTP Error! Status: ${response.status}`);
            };
            return response.json();
        })
        .then(productData => {
            const productFiltered = productData.filter(p => {
                const lastUpdate = new Date(p.lastUpdate.split(" ")[0].split("/").reverse().join("-") + "T" + p.lastUpdate.split(" ")[1]);
                return lastUpdate > RangeDaysAgo;
            });
            if (!showAll) displayProducts(productFiltered.slice(0, 8));
            else displayProducts(productFiltered);
            document.getElementById("filter-menu").classList.remove("active");
            return productFiltered;
        })
        .catch (error => console.error(error));
        

    }
}
const rangeCategories = document.querySelectorAll("#filter-by-category li");
const rangeQuantities = document.querySelectorAll("#filter-by-quantity li");
const rangePrices = document.querySelectorAll("#filter-by-price li");
const rangeDays = document.querySelectorAll("#filter-by-lastupdate li");
let liElementWhich;

async function filterByCategory(elementCategory){
    const category = elementCategory.textContent;
    isFilterBy = "Category";
    isFilteringByCategory = true;
    isSorting = false;
    isFilteringByRange = false;
    try {
        const response = await fetch('https://www.smithsfallsnailsspa.com/api/products/get-all');
        if(!response.ok) throw new Error(`Error, Status ${response.status}`);
        const dataReceived = await response.json();
        const dataFiltered = dataReceived.filter(dataReceived => dataReceived.category === category);
        sessionStorage.setItem("dataFiltered", JSON.stringify(dataFiltered));
        if (!showAll) displayProducts(dataFiltered.slice(0, 8));
        else displayProducts(dataFiltered);
        document.getElementById("filter-menu").classList.remove("active");
    }catch(error){
        console.error(error);
    };
}
rangeDays.forEach(liElement => {
    liElement.addEventListener("click", function() {
        liElementWhich = this.textContent;
        isFilterBy = "LastUpdate";
        filterByRange(liElementWhich, isFilterBy);
        isFilteringByRange = true;
        isSorting = false;
        isFilteringByCategory = false;
    })
})
rangeQuantities.forEach(liElement => {
    liElement.addEventListener("click", function () {
        liElementWhich = this.textContent;
        isFilterBy = "Quantity";
        filterByRange(liElementWhich, isFilterBy);
        isFilteringByRange = true;
        isSorting = false;
        isFilteringByCategory = false;
    });
});
rangePrices.forEach(liElement => {
    liElement.addEventListener("click", function () {
        liElementWhich = this.textContent;
        isFilterBy = "Price";
        filterByRange(liElementWhich, isFilterBy);
        isFilteringByRange = true;
        isSorting = false;
        isFilteringByCategory = false;
    });
});
document.getElementById("see-full-product").addEventListener("click", async () => {
    try {
        const response = await fetch('https://www.smithsfallsnailsspa.com/api/products/get-all');
        if (!response.ok) {
            throw new Error(`HTTP Error, Status: ${response.status}`);
        };
        const productsData = await response.json();
        if (showAll) {
            displayProducts(productsData);
        } else {
            displayProducts(productsData.slice(0, 8));
        };
        document.getElementById("filter-menu").classList.remove("active");
        isFilteringByRange = false;
        isFilteringByCategory = false;
    
    } catch(error){
        console.error(error);
    };
});
