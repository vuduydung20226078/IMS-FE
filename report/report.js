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
document.addEventListener("DOMContentLoaded", function () {
    const typeInput = document.getElementById("type");
    const periodInput = document.getElementById("period");
    const yearInput = document.getElementById("year");
    const monthInput = document.getElementById("month");
    const monthLabel = document.getElementById("month-label");
    const fetchButton = document.getElementById("fetchData");
    const chartCanvas = document.getElementById("chart");
    let chartInstance = null;
  
  
  
    
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
    if (selectedPeriod === "day" || selectedPeriod === "month") {
      monthContainer.style.display = "block";  // Hiển thị input tháng
    } else {
      // Ẩn trường tháng khi chọn "Năm"
      monthContainer.style.display = "none";  // Ẩn input tháng
    }
  }
  
  document.addEventListener("DOMContentLoaded", function () {
  togglePeriodInput();
  });
  
  
  function fetchStatistics() {
  // Lấy giá trị từ các trường trong giao diện
  const typeInput = document.getElementById("type");
  const periodInput = document.getElementById("timePeriod");
  const monthInput = document.getElementById("month");
  const yearInput = document.getElementById("year");
  
  const type = typeInput.value; // Loại (import/export)
  const period = periodInput.value; // "day", "month", "year"
  const year = yearInput.value; // Năm
  const month = monthInput ? monthInput.value : null; // Tháng
  
  // Kiểm tra dữ liệu đầu vào
  if (!type || !period || !year) {
    alert("Vui lòng nhập đầy đủ thông tin trước khi xem báo cáo.");
    return;
  }
  
  if ((period === "day" || period === "month") && !month) {
    alert("Vui lòng nhập tháng cho khoảng thời gian đã chọn.");
    return;
  }
  
  // Xây dựng URL với các tham số truy vấn
  let url = new URL("http://160.191.50.248:8080/api/report/statistics-by-period?type=${type}&period=${period}&year=${year}");
  let params = { type: type, period: period, year: year };
  
  if (period === "day" || period === "month") {
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
  
        // Gọi hàm vẽ biểu đồ tương ứng
        if (period === "day") {
          renderDayChart(data.data, type); // Vẽ biểu đồ cho ngày
        } else {
          renderMonthYearChart(data.data, period, type); // Vẽ biểu đồ cho tháng hoặc năm
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
  
  
  
  // Hàm vẽ biểu đồ cho ngày
  function renderDayChart(statistics) {
    const labels = [];
    const data = [];
  
    // Duyệt qua dữ liệu thống kê để lấy thông tin
    statistics.forEach((item) => {
      const label =
        period === "month"
          ? `Ngày ${item.day}` // Nếu là tháng, hiển thị ngày
          : `Tháng ${item.month}`; // Nếu là năm, hiển thị tháng
      labels.push(label);
      data.push(item.total); // Dữ liệu số lượng
    });
  
    // Cài đặt và vẽ biểu đồ
    const ctx = document.getElementById("chart").getContext("2d");
    new Chart(ctx, {
      type: "bar", // Biểu đồ dạng cột cho ngày/tháng
      data: {
        labels: labels, // Các nhãn trên trục X (ngày/tháng)
        datasets: [
          {
            label: `Số lượng sản phẩm (Theo ${period === "month" ? "ngày" : "tháng"})`,
            data: data,
            borderColor: period === "month" ? "rgba(255, 99, 132, 1)" : "rgba(75, 192, 192, 1)",
            backgroundColor: period === "month" ? "rgba(255, 99, 132, 0.2)" : "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true, // Đảm bảo trục Y bắt đầu từ 0
          },
        },
      },
    });
  }
  
  // Hàm vẽ biểu đồ cho tháng hoặc năm
  function renderMonthYearChart(statistics, period) {
    const labels = [];
    const data = [];
  
    // Duyệt qua dữ liệu thống kê để lấy thông tin
    statistics.forEach((item) => {
      const label =
        period === "month"
          ? `Tháng ${item.month}` // Nếu là tháng, hiển thị tháng
          : `Tháng ${item.month}`; // Nếu là năm, hiển thị tháng
      labels.push(label);
      data.push(item.total); // Dữ liệu số lượng
    });
  
    // Cài đặt và vẽ biểu đồ
    const ctx = document.getElementById("chart").getContext("2d");
    new Chart(ctx, {
      type: "bar", // Biểu đồ dạng cột cho tháng hoặc năm
      data: {
        labels: labels, // Các nhãn trên trục X (ngày/tháng)
        datasets: [
          {
            label: `Số lượng sản phẩm (Theo ${period === "month" ? "tháng" : "năm"})`,
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
            beginAtZero: true, // Đảm bảo trục Y bắt đầu từ 0
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
            <option value="year">Năm</option>
          </select>
        </div>
        <div class="mb-3" id="monthContainer" style="display:none;">
          <label for="month">Tháng:</label>
          <input type="number" id="month" class="form-control mb-3" min="1" max="12" placeholder="Nhập tháng">
        </div>
        <div class="mb-3">
          <label for="year">Năm:</label>
          <input type="number" id="year" class="form-control mb-3" value="${new Date().getFullYear()}">
        </div>
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
              <option value="year">Năm</option>
            </select>
          </div>
          <div class="mb-3" id="monthContainer" style="display:none;">
            <label for="month">Tháng:</label>
            <input type="number" id="month" class="form-control" min="1" max="12" placeholder="Nhập tháng">
          </div>
          <div class="mb-3">
            <label for="year">Năm:</label>
            <input type="number" id="year" class="form-control" value="${new Date().getFullYear()}">
          </div>
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
    
      // Hiển thị trường tháng khi chọn "Ngay" hoặc "Tháng"
      if (selectedTimePeriod === "day" || selectedTimePeriod === "month") {
        monthContainer.style.display = "block";
      } else {
        // Ẩn trường tháng khi chọn "Năm"
        monthContainer.style.display = "none";
      }
    }
    
  
  
  
  // Hàm fetch dữ liệu thống kê sản phẩm
  function fetchProductStatistics() {
    // Lấy giá trị từ các trường trong giao diện
    const productType = document.getElementById("productType");
    const productId = document.getElementById("productId");
    const timePeriod = document.getElementById("timePeriod");
    const monthInput = document.getElementById("month");
    const yearInput = document.getElementById("year");
  
    // Kiểm tra xem các phần tử có tồn tại không trước khi truy cập giá trị
    if (!productType || !productId || !timePeriod || !yearInput) {
      console.error("Một hoặc nhiều phần tử HTML bị thiếu.");
      return;
    }
  
    const selectedProductType = productType.value;
    const selectedProductId = productId.value;
    const selectedTimePeriod = timePeriod.value;
    const selectedMonth = monthInput ? monthInput.value : null; // Kiểm tra nếu `monthInput` tồn tại
    const selectedYear = yearInput.value;
  
    // Kiểm tra giá trị trước khi vẽ biểu đồ hoặc thực hiện xử lý
    if (!selectedProductType || !selectedProductId || !selectedTimePeriod || !selectedYear) {
      alert("Vui lòng nhập đầy đủ thông tin trước khi xem báo cáo.");
      return;
    }
  
    // Xây dựng URL với các tham số truy vấn
    let url = new URL("http://160.191.50.248:8080/api/report/statistics-by-product");
    let params = {
      type: selectedProductType,
      productId: selectedProductId,
      period: selectedTimePeriod,
      year: selectedYear,
    };
  
    if (selectedTimePeriod === "day" && selectedMonth) {
      params.period = "day";
      params.month = selectedMonth;
    }
  
    url.search = new URLSearchParams(params).toString();
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Kiểm tra nếu dữ liệu trả về có trường `data` và có ít nhất một phần tử
        if (data && data.data && data.data.length > 0) {
          const productChart = document.getElementById("productChart");
          if (productChart) {
            productChart.style.display = "block"; // Hiển thị canvas để vẽ biểu đồ
  
            // Gọi hàm vẽ biểu đồ dựa trên loại thời gian
            if (selectedTimePeriod === "day") {
              drawDayChart(data.data); // Vẽ biểu đồ cho `day`
            } else {
              drawMonthYearChart(data.data, selectedTimePeriod); // Vẽ biểu đồ cho `month` hoặc `year`
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
  
    // Duyệt qua dữ liệu thống kê để lấy thông tin
    statistics.forEach((item) => {
      const label = `Ngày ${item.day}`; // Sử dụng ngày làm nhãn
      labels.push(label);
      data.push(item.quantity); // Dữ liệu số lượng
    });
  
    // Cài đặt và vẽ biểu đồ
    const ctx = document.getElementById("productChart").getContext("2d");
    new Chart(ctx, {
      type: "bar", // Biểu đồ dạng đường cho ngày
      data: {
        labels: labels, // Các nhãn trên trục X (ngày)
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
            beginAtZero: true, // Đảm bảo trục Y bắt đầu từ 0
          },
        },
      },
    });
  }
  
  // Hàm vẽ biểu đồ theo tháng hoặc năm
  function drawMonthYearChart(statistics, period) {
    const labels = [];
    const data = [];
  
    // Duyệt qua dữ liệu thống kê để lấy thông tin
    statistics.forEach((item) => {
      const label =
        period === "month"
          ? `Tháng ${item.month}`
          : `Tháng ${item.month}`; // Sử dụng tháng làm nhãn nếu là year
      labels.push(label);
      data.push(item.quantity); // Dữ liệu số lượng
    });
  
    // Cài đặt và vẽ biểu đồ
    const ctx = document.getElementById("productChart").getContext("2d");
    new Chart(ctx, {
      type: "bar", // Biểu đồ dạng cột cho tháng hoặc năm
      data: {
        labels: labels, // Các nhãn trên trục X (ngày/tháng)
        datasets: [
          {
            label: `Số lượng sản phẩm (Theo ${period === "month" ? "tháng" : "năm"})`,
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
            beginAtZero: true, // Đảm bảo trục Y bắt đầu từ 0
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
    fetch('http://160.191.50.248:8080/api/products/get-all')
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
  
  