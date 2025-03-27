document.addEventListener('DOMContentLoaded', function() {
    // Function to format currency
    function formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN');
    }

    // Process CSV data
    function processCSVData(data) {
        const categoryExpenses = {};
        
        const rows = data.split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
        
        // Process data rows
        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',');
            
            for (let j = 1; j < columns.length; j++) { // Skip 'Month' column
                const category = headers[j];
                const amount = parseFloat(columns[j].replace(/['"₹$]/g, '')) || 0;
                
                if (!categoryExpenses[category]) {
                    categoryExpenses[category] = 0;
                }
                categoryExpenses[category] += amount;
            }
        }
        
        createPieChart(categoryExpenses);
    }

    // Create Pie Chart
    function createPieChart(categoryExpenses) {
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        const categoryLabels = Object.keys(categoryExpenses);
        const categoryData = Object.values(categoryExpenses);
        
        // Generate colors
        const categoryColors = categoryLabels.map((_, index) => {
            const hue = (index * 137.5) % 360;
            return `hsl(${hue}, 70%, 50%)`;
        });

        new Chart(categoryCtx, {
            type: 'pie',
            data: {
                labels: categoryLabels,
                datasets: [{
                    data: categoryData,
                    backgroundColor: categoryColors,
                    borderWidth: 2,
                    borderColor: '#1e1e1e'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#e0e0e0',
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = formatCurrency(context.raw);
                                const percentage = ((context.raw / categoryData.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                return `${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // File Upload Handler
    const fileInput = document.getElementById('csvFileInput');
    const uploadBtn = document.getElementById('uploadBtn');

    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            if (fileInput.files.length > 0) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    processCSVData(e.target.result);
                };
                reader.readAsText(fileInput.files[0]);
            } else {
                alert('Please select a CSV file first');
            }
        });
    }
});
