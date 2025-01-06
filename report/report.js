 // Toggle Sidebar
 document.getElementById("nav-product").style.display = "block"; // Đảm bảo phần tử nav-product được hiển thị

 document.getElementById('chevron-button').addEventListener('click', function () {
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const chevronContainer = document.getElementById('chevron-container');

  sidebar.classList.toggle('hidden');
  content.classList.toggle('sidebar-hidden');
  chevronContainer.classList.toggle('hidden');

  // Đổi hướng biểu tượng chevron
  const chevronIcon = this.querySelector('ion-icon');
  if (sidebar.classList.contains('hidden')) {
    chevronIcon.setAttribute('name', 'chevron-forward-outline');
  } else {
    chevronIcon.setAttribute('name', 'chevron-back-outline');
  }
});

  
  function togglePeriodInput() {
    // Lấy phần tử dropdown và container nhập tháng
    const periodDropdown = document.getElementById("timePeriod");  // Dropdown cho khoảng thời gian
    const monthContainer = document.getElementById("monthContainer");  // Container chứa nhãn và input tháng
  
    if (!periodDropdown || !monthContainer) {
      console.error("Không tìm thấy periodDropdown hoặc monthContainer.");
      return;
    }
  
    const selectedPeriod = periodDropdown.value;  // Lấy giá trị được chọn trong dropdown
  
    // Hiển thị trường tháng khi chọn "Tuần" hoặc "Tháng"
    if (selectedPeriod === "day" ) {
      monthContainer.style.display = "block";  // Hiển thị input tháng
    } else {
      // Ẩn trường tháng khi chọn "Năm"
      monthContainer.style.display = "none";  // Ẩn input tháng
    }
  }
  
  document.addEventListener("DOMContentLoaded", function () {
  togglePeriodInput();
  });
  
 
  let currentChart = null;

function fetchStatistics() {
    const typeInput = document.getElementById("type");
    const periodInput = document.getElementById("timePeriod");
    const monthInput = document.getElementById("month");
    const yearInput = document.getElementById("year");  // Input năm
    const period = periodInput.value; // "day", "month"

    const type = typeInput.value; // Loại (import/export)
    const month = monthInput ? monthInput.value : null; // Tháng
    const year = yearInput ? yearInput.value : null; // Năm

    // Kiểm tra dữ liệu đầu vào
    if (!type || !period || !year) {
        alert("Vui lòng nhập đầy đủ thông tin trước khi xem báo cáo.");
        return;
    }

    if (period === "day" && !month) {
        alert("Vui lòng nhập tháng cho khoảng thời gian đã chọn.");
        return;
    }

    // Xây dựng URL với các tham số truy vấn
    let url = new URL("https://www.smithsfallsnailsspa.com/api/report/statistics-by-period");
    let params = { type: type, period: period, year: year };

    if (period === "day") {
        params.month = month;
    }

    url.search = new URLSearchParams(params).toString();

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data && data.data) {
                const statistics = data.data;

                // Hiển thị canvas để vẽ biểu đồ
                const chart = document.getElementById("chart");
                chart.style.display = "block";

                // Xóa biểu đồ cũ nếu tồn tại
                if (currentChart) {
                    currentChart.destroy(); // Hủy biểu đồ cũ
                }

                // Gọi hàm vẽ biểu đồ tương ứng và lưu vào `currentChart`
                if (period === "day") {
                    currentChart = renderDayChart(statistics); // Vẽ biểu đồ theo ngày
                } else {
                    currentChart = renderMonthChart(statistics); // Vẽ biểu đồ theo tháng
                }
            } else {
                alert("Không có dữ liệu thống kê.");
            }
        })
        .catch((error) => {
            console.error("Error fetching statistics:", error);
            alert("Không thể tải dữ liệu. Vui lòng kiểm tra lại.");
        });
}

// Hàm vẽ biểu đồ theo ngày
function renderDayChart(statistics) {
    const labels = [];
    const data = [];

    statistics.forEach((item) => {
        const label = `Ngày ${item.day}`;
        labels.push(label);
        data.push(item.total);
    });

    const ctx = document.getElementById("chart").getContext("2d");
    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Số lượng sản phẩm (Theo ngày)",
                    data: data,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// Hàm vẽ biểu đồ theo tháng
function renderMonthChart(statistics) {
    const labels = [];
    const data = [];

    statistics.forEach((item) => {
        const label = `Tháng ${item.month}`;
        labels.push(label);
        data.push(item.total);
    });

    const ctx = document.getElementById("chart").getContext("2d");
    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Số lượng sản phẩm (Theo tháng)",
                    data: data,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}
  
  
  document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
  
    // Khi load trang ban đầu, hiển thị nội dung mặc định
    content.innerHTML = "<p>Vui lòng chọn một mục từ thanh điều hướng.</p>";
  
    // Hàm điều hướng đến các section
    function navigateTo(section) {
      // Reset nội dung cũ
      content.innerHTML = "";
  
      if (section === "report-by-period") {
        content.innerHTML = `
          <h2>Thống kê lượng phiếu nhập/xuất theo tuần, tháng, năm</h2>
        <div class="mb-3">
          <label>Loại phiếu:</label>
          <select id="type" class="form-select mb-3">
            <option value="import">Phiếu nhập</option>
            <option value="export">Phiếu xuất</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="timePeriod">Thời gian:</label>
          <select id="timePeriod" class="form-select mb-3" onchange="toggleMonthInput()">
            <option value="day">Ngày</option>
            <option value="month">Tháng</option>
          </select>
        </div>
        <div class="mb-3" id="monthContainer" style="display:none;">
          <label for="month">Tháng:</label>
          <input type="number" id="month" class="form-control mb-3" min="1" max="12" placeholder="Nhập tháng">
        </div>
       <label for="year">Chọn năm:</label>
        <input type="number" id="year" name="year" required>
      <button class="btn btn-primary" onclick="fetchStatistics()">Xem báo cáo</button>
        <canvas id="chart" class="mt-5" style="display:none;"></canvas>
      `;
      } else if (section === "report-by-product") {
        content.innerHTML = `
          <h2>Thống kê sản phẩm theo khoảng thời gian</h2>
          <div class="mb-3">
            <label for="productType">Loại sản phẩm:</label>
            <select id="productType" class="form-select">
              <option value="import">Nhập</option>
              <option value="export">Xuất</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="productId">Sản phẩm:</label>
            <select id="productId" class="form-select">
              <!-- Sản phẩm sẽ được load động -->
            </select>
          </div>
          <div class="mb-3">
            <label for="timePeriod">Thời gian:</label>
            <select id="timePeriod" class="form-select" onchange="toggleMonthInput()">
              <option value="day">Ngày</option>
              <option value="month">Tháng</option>
            </select>
          </div>
          <div class="mb-3" id="monthContainer" style="display:none;">
            <label for="month">Tháng:</label>
            <input type="number" id="month" class="form-control" min="1" max="12" placeholder="Nhập tháng">
          </div>
           <label for="year">Chọn năm:</label>
        <input type="number" id="year" name="year" required>
          <button class="btn btn-primary" onclick="fetchProductStatistics()">Xem báo cáo</button>
          <canvas id="productChart" class="mt-5" style="display:none;"></canvas>
        `;
        populateProductDropdown();
      } else {
        // Mặc định: hiển thị giao diện rỗng
        content.innerHTML = `<p>Vui lòng chọn một mục từ thanh điều hướng.</p>`;
      }
    }
  
    // Gắn sự kiện cho các mục trong Sidebar
    document.getElementById("nav-period").addEventListener("click", () => navigateTo("report-by-period"));
    document.getElementById("nav-product").addEventListener("click", () => navigateTo("report-by-product"));
  });
  
  
  
  // Tải danh sách sản phẩm vào dropdown
  populateProductDropdown();
  
    // Hiển thị biểu đồ
    const chartContainer = document.getElementById("chart");
    chartContainer.style.display = "block";
  
    const labels = testData.data.map(item => period === "day" ? `Ngày ${item.day}` : `Tháng ${item.month}`);
    const dataset = testData.data.map(item => item.total);
  
    const ctx = chartContainer.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: `Thống kê (${type === "import" ? "Phiếu nhập" : "Phiếu xuất"})`,
          data: dataset,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top"
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
  
  
  
    function toggleMonthInput() {
      // Lấy phần tử dropdown và container nhập tháng
      const timePeriod = document.getElementById("timePeriod");
      const monthContainer = document.getElementById("monthContainer");
    
      if (!timePeriod || !monthContainer) {
        console.error("Không tìm thấy timePeriod hoặc monthContainer.");
        return;
      }
    
      const selectedTimePeriod = timePeriod.value;
    
      // Hiển thị trường tháng khi chọn "Ngay" 
      if (selectedTimePeriod === "day" ) {
        monthContainer.style.display = "block";
      } else {
        // Ẩn trường tháng khi chọn "Tháng"
        monthContainer.style.display = "none";
      }
    }
    
  
  
// Biến toàn cục lưu trữ biểu đồ hiện tại

function fetchProductStatistics() {
    const productType = document.getElementById("productType");
    const productId = document.getElementById("productId");
    const timePeriod = document.getElementById("timePeriod");
    const monthInput = document.getElementById("month");
    const yearInput = document.getElementById("year");  // Input năm

    if (!productType || !productId || !timePeriod || !yearInput) {
        console.error("Một hoặc nhiều phần tử HTML bị thiếu.");
        return;
    }

    const selectedProductType = productType.value;
    const selectedProductId = productId.value;
    const selectedTimePeriod = timePeriod.value;
    const selectedMonth = monthInput ? monthInput.value : null;
    const selectedYear = yearInput ? yearInput.value : null;  // Lấy giá trị năm

    if (!selectedProductType || !selectedProductId || !selectedTimePeriod || !selectedYear) {
        alert("Vui lòng nhập đầy đủ thông tin trước khi xem báo cáo.");
        return;
    }

    if (selectedTimePeriod === "day" && !selectedMonth) {
        alert("Vui lòng nhập tháng cho khoảng thời gian đã chọn.");
        return;
    }

    let url = new URL("https://www.smithsfallsnailsspa.com/api/report/statistics-by-product");
    let params = {
        type: selectedProductType,
        productId: selectedProductId,
        period: selectedTimePeriod,
        year: selectedYear, // Thêm tham số năm vào URL
    };

    if (selectedTimePeriod === "day" && selectedMonth) {
        params.month = selectedMonth;
    }

    url.search = new URLSearchParams(params).toString();

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data && data.data && data.data.length > 0) {
                const productChart = document.getElementById("productChart");
                if (productChart) {
                    productChart.style.display = "block";

                    // Xóa biểu đồ cũ nếu tồn tại
                    if (currentChart) {
                        currentChart.destroy(); // Hủy biểu đồ cũ
                    }

                    // Vẽ biểu đồ mới
                    if (selectedTimePeriod === "day") {
                        currentChart = drawDayChart(data.data); // Lưu biểu đồ mới vào `currentChart`
                    } else {
                        currentChart = drawMonthChart(data.data); // Lưu biểu đồ mới vào `currentChart`
                    }
                }
            } else {
                alert("Không có dữ liệu thống kê cho sản phẩm này.");
            }
        })
        .catch((error) => {
            console.error("Error fetching product statistics:", error);
            alert("Không thể tải dữ liệu. Vui lòng kiểm tra lại.");
        });
}

// Hàm vẽ biểu đồ theo ngày
function drawDayChart(statistics) {
    const labels = [];
    const data = [];

    statistics.forEach((item) => {
        const label = `Ngày ${item.day}`;
        labels.push(label);
        data.push(item.quantity);
    });

    const ctx = document.getElementById("productChart").getContext("2d");
    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Số lượng sản phẩm (Theo ngày)",
                    data: data,
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// Hàm vẽ biểu đồ theo tháng
function drawMonthChart(statistics) {
    const labels = [];
    const data = [];

    statistics.forEach((item) => {
        const label = `Tháng ${item.month}`;
        labels.push(label);
        data.push(item.quantity);
    });

    const ctx = document.getElementById("productChart").getContext("2d");
    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Số lượng sản phẩm (Theo tháng)",
                    data: data,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

  // Tải danh sách sản phẩm 
  function populateProductDropdown() {
    const productDropdown = document.getElementById("productId");
    productDropdown.innerHTML = `<option value="" disabled selected>Đang tải danh sách sản phẩm...</option>`;
  
    // Fetch danh sách sản phẩm từ API
    fetch('https://www.smithsfallsnailsspa.com/api/products/get-all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi tải danh sách sản phẩm');
            }
            return response.json();
        })
        .then(products => {
            // Xóa thông báo đang tải
            productDropdown.innerHTML = `<option value="" disabled selected>Chọn sản phẩm</option>`;
  
            // Thêm các sản phẩm vào dropdown
            products.forEach(product => {
                const option = document.createElement("option");
                option.value = product.productID;
                option.textContent = `${product.productName} (ID: ${product.productID})`;
                productDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error(error);
            productDropdown.innerHTML = `<option value="" disabled selected>Lỗi khi tải danh sách</option>`;
        });
  }
  
  