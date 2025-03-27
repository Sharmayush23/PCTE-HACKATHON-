// Create personality traits chart
function createPersonalityChart() {
    const ctx = document.getElementById('personalityChart').getContext('2d');
    
    const data = {
        labels: ['Adventure', 'Extrovert', 'Sportive', 'Attentive'],
        datasets: [{
            label: 'Personality Traits',
            data: [85, 75, 60, 90],
            backgroundColor: [
                'rgba(52, 152, 219, 0.7)',  // Blue
                'rgba(46, 204, 113, 0.7)',  // Green
                'rgba(155, 89, 182, 0.7)',  // Purple
                'rgba(241, 196, 15, 0.7)'   // Yellow
            ],
            borderColor: [
                'rgba(52, 152, 219, 1)',
                'rgba(46, 204, 113, 1)',
                'rgba(155, 89, 182, 1)',
                'rgba(241, 196, 15, 1)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: isDarkMode() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: isDarkMode() ? '#e0e0e0' : '#2c3e50'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: isDarkMode() ? '#e0e0e0' : '#2c3e50'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: isDarkMode() ? '#1e1e1e' : 'rgba(255, 255, 255, 0.9)',
                    titleColor: isDarkMode() ? '#e0e0e0' : '#2c3e50',
                    bodyColor: isDarkMode() ? '#e0e0e0' : '#2c3e50',
                    borderColor: isDarkMode() ? '#2a2a2a' : '#ddd',
                    borderWidth: 1
                }
            }
        }
    };

    return new Chart(ctx, config);
}

// Helper function to check dark mode
function isDarkMode() {
    return document.body.classList.contains('dark-theme');
}

// Initialize chart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createPersonalityChart();
});

// Update chart on theme change
document.addEventListener('themeChanged', () => {
    // Destroy existing chart and recreate
    const existingChart = Chart.getChart('personalityChart');
    if (existingChart) {
        existingChart.destroy();
    }
    createPersonalityChart();
});