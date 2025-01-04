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
    const username = sessionStorage.setItem("username", usernameNK);
}
//show option type note
const chevronOptionTypeNote = document.getElementById("type-note-chosen");
    chevronOptionTypeNote.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("type-note-option").classList.toggle("active");
    });
document.getElementById("type-note-option").addEventListener("click", function(e){
    e.preventDefault();
    const textTmp = chevronOptionTypeNote.innerText;
    const chevronIcon = `
        <ion-icon name="chevron-down-outline" id="icon-chevron-note"></ion-icon>
    `;
    chevronOptionTypeNote.innerText = this.innerText;
    chevronOptionTypeNote.innerHTML +=  chevronIcon;
    this.innerText = textTmp;
    this.classList.remove("active");
    checkTypeNote();
});
const inputSOP = document.getElementById("input-SoP-id");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const minimumQuantityInput = document.getElementById("minimumQuantity");
const maximumQuantityInput = document.getElementById("maximumQuantity");
const IDInput = document.getElementById("input-SoP-id");
// function check type note to show
async function checkTypeNote(){
    const typeNote = chevronOptionTypeNote.innerText;
    if(typeNote === "Stock In Note Table"){
        try{
            const response = await fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=import`);
            if(!response.ok) throw new Error(`Error! Status ${response.satus}`);
            const dataReceived = await response.json();
            displayNotesImport(dataReceived);
        } catch(error){
            console.error(error);
            document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
        }
        document.getElementById("tb-partner-or-supplier").innerText = "Supplier Name";
        document.getElementById("tb-filter-by-SoP").innerText = "By Supplier ID:";
        inputSOP.value = "";
        startDateInput.value = "";
        endDateInput.value = "";
        minimumQuantityInput.value = "";
        maximumQuantityInput.value = "";
    }
    else{
        try{
            const response = await fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=export`);
            if(!response.ok) throw new Error(`Error! Status ${response.satus}`);
            const dataReceived = await response.json();
            displayNotesExport(dataReceived);
        } catch(error){
            console.error(error);
            document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
        }
        document.getElementById("tb-partner-or-supplier").innerText = "Partner Name";
        document.getElementById("tb-filter-by-SoP").innerText = "By Partner ID:";
        inputSOP.value = "";
        startDateInput.value = "";
        endDateInput.value = "";
        minimumQuantityInput.value = "";
        maximumQuantityInput.value = "";
    };
};
checkTypeNote();
//function check startdate and end date and
let endDateTimer;
startDateInput.addEventListener('change', () => {
    const startDate = new Date(startDateInput.value);
    endDateInput.value = "";
    endDateInput.min = startDateInput.value;
    if(startDateInput.value.length === 10){
        const start = moment(startDate, "DD/MM/YYYY").startOf('days').format("YYYY-MM-DDTHH:mm:ss");
        if(chevronOptionTypeNote.innerText === "Stock In Note Table"){
            console.log("import")
            fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=import&supplierID=${IDInput.value}&startDate=${start}&minProductQuantity=${minimumQuantityInput.value}&maxProductQuantity=${maximumQuantityInput.value}`)
            .then(response => {
                if(!response.ok) throw new Error(`Error! Status ${response.status}`);
                return response.json();
            })
            .then(dataReceived => displayNotesImport(dataReceived))
            .catch(error => {
                console.error(error);
                document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
            });
        } else {
            fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=export&partnerID=${IDInput.value}}&startDate=${start}&minProductQuantity=${minimumQuantityInput.value}&maxProductQuantity=${maximumQuantityInput.value}`)
            .then(response => {
                if(!response.ok) throw new Error(`Error! Status ${response.status}`);
                return response.json();
            })
            .then(dataReceived => displayNotesExport(dataReceived))
            .catch(error => {
                console.error(error);
                document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
            });
        }
    }
});

endDateInput.addEventListener('change', () => {
    clearTimeout(endDateTimer); 
    endDateTimer = setTimeout(() => {
        const endDateValue = endDateInput.value;
        if (endDateValue.length === 10) { 
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateValue);
            if (endDate < startDate) {
                alert("The end date cannot be less than the start date!");
                endDateInput.value = startDateInput.value;
            };
                const start = moment(startDate, "DD/MM/YYYY HH:mm:ss").startOf('days').format("YYYY-MM-DDTHH:mm:ss");
                const end = moment(new Date(endDateInput.value), "DD/MM/YYYY HH:mm:ss").endOf('days').format("YYYY-MM-DDTHH:mm:ss");
                if(chevronOptionTypeNote.innerText === "Stock In Note Table"){
                    fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=import&supplierID=${IDInput.value}&startDate=${start}&endDate=${end}&minProductQuantity=${minimumQuantityInput.value}&maxProductQuantity=${maximumQuantityInput.value}`)
                    .then(response => {
                        if(!response.ok) throw new Error(`Error! Status ${response.status}`);
                        return response.json();
                    })
                    .then(dataReceived => displayNotesImport(dataReceived))
                    .catch(error => {
                        console.error(error)
                        document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
                    });
                } else {
                    fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=export&partnerID=${IDInput.value}&startDate=${start}&endDate=${end}&minProductQuantity=${minimumQuantityInput.value}&maxProductQuantity=${maximumQuantityInput.value}`)
                    .then(response => {
                        if(!response.ok) throw new Error(`Error! Status ${response.status}`);
                        return response.json();
                    })
                    .then(dataReceived => displayNotesExport(dataReceived))
                    .catch(error => {
                        console.error(error)
                        document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
                    });
                };
        };
    }, 500);
});
//check max, min quantity and filter
let minTimer, maxTimer;
minimumQuantityInput.addEventListener('input', () => {
    const start = moment(new Date(startDateInput.value), "DD/MM/YYYY").startOf('days').format("YYYY-MM-DDTHH:mm:ss");
    const end = moment(new Date(endDateInput.value), "DD/MM/YYYY").endOf('days').format("YYYY-MM-DDTHH:mm:ss");
    clearTimeout(minTimer); 
    minTimer = setTimeout(() => {
        const minValue = parseInt(minimumQuantityInput.value);
        const maxValue = parseInt(maximumQuantityInput.value);
        if (!isNaN(minValue) && !isNaN(maxValue)) {
            if (minValue > maxValue) {
                alert("Minimum Quantity cannot be greater than Maximum Quantity!");
                minimumQuantityInput.value = "";
                return;
            }
            if(chevronOptionTypeNote.innerText === "Stock In Note Table"){
                    fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=import&supplierID=${IDInput.value}&startDate=${start}&endDate=${end}&minProductQuantity=${minimumQuantityInput.value}&maxProductQuantity=${maximumQuantityInput.value}`)
                    .then(response => {
                        if(!response.ok) throw new Error(`Error! Status ${response.status}`);
                        return response.json();
                    })
                    .then(dataReceived => displayNotesImport(dataReceived))
                    .catch(error => {
                        console.error(error)
                        document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
                    });
                } else {
                    fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=export&partnerID=${IDInput.value}&startDate=${start}&endDate=${end}&minProductQuantity=${minimumQuantityInput.value}&maxProductQuantity=${maximumQuantityInput.value}`)
                    .then(response => {
                        if(!response.ok) throw new Error(`Error! Status ${response.status}`);
                        return response.json();
                    })
                    .then(dataReceived => displayNotesExport(dataReceived))
                    .catch(error => {
                        console.error(error)
                        document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
                    });
                };
        }
              if(chevronOptionTypeNote.innerText === "Stock In Note Table"){
                    fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=import&supplierID=${IDInput.value}&startDate=${start}&endDate=${end}&minProductQuantity=${minimumQuantityInput.value}&maxProductQuantity=${maximumQuantityInput.value}`)
                    .then(response => {
                        if(!response.ok) throw new Error(`Error! Status ${response.status}`);
                        return response.json();
                    })
                    .then(dataReceived => displayNotesImport(dataReceived))
                    .catch(error => {
                        console.error(error)
                        document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
                    });
                } else {
                    fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=export&partnerID=${IDInput.value}&startDate=${start}&endDate=${end}&minProductQuantity=${minimumQuantityInput.value}&maxProductQuantity=${maximumQuantityInput.value}`)
                    .then(response => {
                        if(!response.ok) throw new Error(`Error! Status ${response.status}`);
                        return response.json();
                    })
                    .then(dataReceived => displayNotesExport(dataReceived))
                    .catch(error => {
                        console.error(error)
                        document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
                    });
                };
        
    }, 500); 
});
maximumQuantityInput.addEventListener('input', () => {
    const start = moment(new Date(startDateInput.value), "DD/MM/YYYY").startOf('days').format("YYYY-MM-DDTHH:mm:ss");
    const end = moment(new Date(endDateInput.value), "DD/MM/YYYY").endOf('days').format("YYYY-MM-DDTHH:mm:ss");
    clearTimeout(maxTimer); 
    maxTimer = setTimeout(() => {
        const minValue = parseInt(minimumQuantityInput.value);
        const maxValue = parseInt(maximumQuantityInput.value);
        if (!isNaN(minValue) && !isNaN(maxValue)) {
            if (maxValue < minValue) {
                alert("Maximum Quantity cannot be less than Minimum Quantity!");
                maximumQuantityInput.value = ""; 
                return;
            }
            if(chevronOptionTypeNote.innerText === "Stock In Note Table"){
                    fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=import&supplierID=${IDInput.value}&startDate=${start}&endDate=${end}&minProductQuantity=${minimumQuantityInput.value}&maxProductQuantity=${maximumQuantityInput.value}`)
                    .then(response => {
                        if(!response.ok) throw new Error(`Error! Status ${response.status}`);
                        return response.json();
                    })
                    .then(dataReceived => displayNotesImport(dataReceived))
                    .catch(error => {
                        console.error(error)
                        document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
                    });
                } else {
                    fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=export&partnerID=${IDInput.value}&startDate=${start}&endDate=${end}&minProductQuantity=${minimumQuantityInput.value}&maxProductQuantity=${maximumQuantityInput.value}`)
                    .then(response => {
                        if(!response.ok) throw new Error(`Error! Status ${response.status}`);
                        return response.json();
                    })
                    .then(dataReceived => displayNotesExport(dataReceived))
                    .catch(error => {
                        console.error(error)
                        document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
                    });
                };
        }
    }, 500); 
});
// function load data sau khi load page
async function fetchDataAfterLoadingPage(){
    try {
        const response = await fetch('https://www.smithsfallsnailsspa.com/api/transactions/filter?type=import');
        if(!response.ok) throw new Error(`Error! Status ${response.status}`);
        const dataReceived = await response.json();
        displayNotesImport(dataReceived);
    } catch(error){
        console.error(error);               
        document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
    };
};
fetchDataAfterLoadingPage();
// function show data note
function displayNotesImport(notes){
    const tableData = document.getElementById("body-list-note");
        tableData.innerHTML = "";
        notes.forEach(note => {
            console.log(note)
            const date = moment(note.createDate).format("DD-MM-YYYY HH:mm:ss");
            const row = `
                <tr onclick="showDetailsNote(${note.importID})">
                    <td>${note.importID}</td>
                    <td>${note.supplierName}</td>
                    <td>[${note.productIDs}]</td>
                    <td>${note.totalQuantity}</td>
                    <td>${note.totalMoney}</td>
                    <td>${date}</td>
                </tr>
            `;
            tableData.innerHTML += row;
        });
};
function displayNotesExport(notes){
    const tableData = document.getElementById("body-list-note");
        tableData.innerHTML = "";
        notes.forEach(note => {
            const date = moment(note.createDate).format("DD-MM-YYYY HH:mm:ss");
            const row = `
                <tr onclick="showDetailsNote(${note.exportID})">
                    <td>${note.exportID}</td>
                    <td>${note.partnerName}</td>
                    <td>[${note.productIDs}]</td>
                    <td>${note.totalQuantity}</td>
                    <td>${note.totalMoney}</td>
                    <td>${date}</td>
                </tr>
            `;
            tableData.innerHTML += row;
        });
};
//function loc theo id
let idTimer
IDInput.addEventListener('input', () => {
    console.log(1);
    clearTimeout(idTimer); 
    idTimer = setTimeout(() => {
        const start = moment(new Date(startDateInput.value), "DD/MM/YYYY").startOf('days').format("YYYY-MM-DDTHH:mm:ss");
        const end = moment(new Date(endDateInput.value), "DD/MM/YYYY").endOf('days').format("YYYY-MM-DDTHH:mm:ss");
        const IDPartnerOrSupplier = parseInt(IDInput.value);
        if (!isNaN(IDPartnerOrSupplier)) {
            if(chevronOptionTypeNote.innerText === "Stock In Note Table"){
                    fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=import&supplierID=${IDPartnerOrSupplier}&startDate=${start}&endDate=${end}&minProductQuantity=${minimumQuantityInput.value}&maxProductQuantity=${maximumQuantityInput.value}`)
                    .then(response => {
                        if(!response.ok) throw new Error(`Error! Status ${response.status}`);
                        return response.json();
                    })
                    .then(dataReceived => displayNotesImport(dataReceived))
                    .catch(error => {
                        console.error(error)
                        document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
                    });
                } else {
                    fetch(`https://www.smithsfallsnailsspa.com/api/transactions/filter?type=export&partnerID=${IDPartnerOrSupplier}&startDate=${start}&endDate=${end}&minProductQuantity=${minimumQuantityInput.value}&maxProductQuantity=${maximumQuantityInput.value}`)
                    .then(response => {
                        if(!response.ok) throw new Error(`Error! Status ${response.status}`);
                        return response.json();
                    })
                    .then(dataReceived => displayNotesExport(dataReceived))
                    .catch(error => {
                        console.error(error)
                        document.getElementById("body-list-note").innerHTML = `<tr><td colspan='8'>No notes found.</td></tr>`;
                    });
                };
        }
    }, 500); 
});
//function show details of note
async function showDetailsNote(id){
    const formData = document.getElementById("inforSupplierProduct");
    formData.innerHTML = "";
    if(chevronOptionTypeNote.innerText === "Stock In Note Table"){
        try {
            const response = await fetch(`https://www.smithsfallsnailsspa.com/api/transactions/import/${id}`);
            if(!response.ok) throw new Error(`Error! Status ${response.status}`);
            const dataReceived = await response.json();
            dataReceived.productImports.forEach(product => {
                const divData = `
                    <div class="product">
                        <div class="product-info">
                            <div class="product-details">
                                <h3>Product ID: ${product.productID}</h3>
                                <p>Product Name: ${product.productName}</p>
                                <p>Price: ${product.price}</p>
                                <p>Quantity: ${product.quantity}</p>
                            </div>
                            <div class="supplier-details">
                                <h3>Supplier ID: ${dataReceived.supplier.supplierID}</h3>
                                <p>Supplier Name: ${dataReceived.supplier.name}</p>
                                <p>Supplier Contact: ${dataReceived.supplier.contactNumber}</p>
                                <p>Address: ${dataReceived.supplier.address}</p>
                            </div>
                        </div>
                    </div>
                `;
                formData.innerHTML += divData;
            });
            document.querySelector(".form-phieu-nhap h2").innerText = "Inventory Receipt Note";
            document.getElementById("id-phieu-nhap").innerText = `Note ID: ${dataReceived.importID}`;
            document.getElementById("total-price").innerText = `Total Price: ${dataReceived.totalMoney}`;
            document.getElementById("total-product").innerText = `Total Product: ${dataReceived.totalQuantity}`;
            document.getElementById("date-in").innerText = `Date: ${moment(dataReceived.createDate).format("DD-MM-YYYY")}`;
            document.getElementById("form-phieu-nhap").style.display = 'block';
            document.getElementById("overlay").classList.add("active");
        }catch(error){
            console.error(error);
        }
    } else {
        try {
            const response = await fetch(`https://www.smithsfallsnailsspa.com/api/transactions/export/${id}`);
            if(!response.ok) throw new Error(`Error! Status ${response.status}`);
            const dataReceived = await response.json();
            dataReceived.productExports.forEach(product => {
                const divData = `
                    <div class="product">
                        <div class="product-info">
                            <div class="product-details">
                                <h3>Product ID: ${product.productID}</h3>
                                <p>Product Name: ${product.productName}</p>
                                <p>Price: ${product.price}</p>
                                <p>Quantity: ${product.quantity}</p>
                            </div>
                            <div class="supplier-details">
                                <h3>Partner ID: ${dataReceived.partner.partnerID}</h3>
                                <p>Partner Name: ${dataReceived.partner.name}</p>
                                <p>Partner Contact: ${dataReceived.partner.contactNumber}</p>
                                <p>Address: ${dataReceived.partner.address}</p>
                            </div>
                        </div>
                    </div>
                `;
                formData.innerHTML += divData;
            });
            document.querySelector(".form-phieu-nhap h2").innerText = "Goods Issue Note";
            document.getElementById("id-phieu-nhap").innerText = `Note ID: ${dataReceived.exportID}`;
            document.getElementById("total-price").innerText = `Total Price: ${dataReceived.totalMoney}`;
            document.getElementById("total-product").innerText = `Total Product: ${dataReceived.totalQuantity}`;
            document.getElementById("date-in").innerText = `Date: ${moment(dataReceived.createDate).format("DD-MM-YYYY")}`;
            document.getElementById("form-phieu-nhap").style.display = 'block';
            document.getElementById("overlay").classList.add("active");
        }catch(error){
            console.error(error);
        }
    }
}
document.getElementById("close-form-note").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("form-phieu-nhap").style.display = 'none';
    document.getElementById("overlay").classList.remove("active");
})