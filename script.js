document.addEventListener('DOMContentLoaded', function() {
    const goalForm = document.getElementById('goalForm');
    const goalsList = document.getElementById('goalsList');
    let goals = JSON.parse(localStorage.getItem('financialGoals')) || [];

    function calculateSavingsPlan(goal) {
        const targetAmount = parseFloat(goal.targetAmount);
        const monthlyIncome = parseFloat(goal.monthlyIncome);
        const currentSavings = parseFloat(goal.currentSavings);
        const targetDate = new Date(goal.targetDate);
        const today = new Date();
        const monthsLeft = (targetDate.getFullYear() - today.getFullYear()) * 12 + 
                         (targetDate.getMonth() - today.getMonth());
        
        const remainingAmount = targetAmount - currentSavings;
        const requiredMonthlySaving = remainingAmount / monthsLeft;
        const recommendedSavingPercentage = (requiredMonthlySaving / monthlyIncome) * 100;

        return {
            monthsLeft,
            requiredMonthlySaving,
            recommendedSavingPercentage,
            suggestedCuts: generateSavingSuggestions(recommendedSavingPercentage)
        };
    }

    function generateSavingSuggestions(savingPercentage) {
        const suggestions = [];
        if (savingPercentage > 30) {
            suggestions.push("Consider reducing non-essential expenses");
            suggestions.push("Look for additional income sources");
        }
        if (savingPercentage > 20) {
            suggestions.push("Review and optimize monthly subscriptions");
            suggestions.push("Consider meal planning to reduce food expenses");
        }
        suggestions.push("Track daily expenses to identify saving opportunities");
        return suggestions;
    }

    function createGoalCard(goal) {
        const savingsPlan = calculateSavingsPlan(goal);
        const progress = (goal.currentSavings / goal.targetAmount) * 100;
        
        const goalCard = document.createElement('div');
        goalCard.className = 'goal-card';
        goalCard.innerHTML = `
            <h4>${goal.name}</h4>
            <div class="goal-progress">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
            <div class="goal-details">
                <div class="goal-metrics">
                    <div class="metric">
                        <strong>Target</strong>
                        <p>₹${goal.targetAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <div class="metric">
                        <strong>Saved</strong>
                        <p>₹${goal.currentSavings.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div class="savings-plan">
                    <h5>Monthly Savings Plan</h5>
                    <p>Required monthly saving: ₹${savingsPlan.requiredMonthlySaving.toFixed(2).toLocaleString('en-IN')}</p>
                    <p>Months remaining: ${savingsPlan.monthsLeft}</p>
                    <p>Recommended saving: ${savingsPlan.recommendedSavingPercentage.toFixed(1)}% of income</p>
                </div>
                <div class="savings-recommendation">
                    <h5>Recommendations</h5>
                    <ul>
                        ${savingsPlan.suggestedCuts.map(suggestion => `<li>${suggestion}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="goal-actions">
                <button onclick="updateGoalProgress('${goal.id}')">Update Progress</button>
                <button onclick="deleteGoal('${goal.id}')" class="delete-btn">Delete</button>
            </div>
        `;
        return goalCard;
    }

    function saveGoals() {
        localStorage.setItem('financialGoals', JSON.stringify(goals));
    }

    function renderGoals() {
        goalsList.innerHTML = '';
        goals.forEach(goal => {
            goalsList.appendChild(createGoalCard(goal));
        });
    }

    window.updateGoalProgress = function(goalId) {
        const goal = goals.find(g => g.id === goalId);
        const savedAmount = prompt('Enter current saved amount:', goal.currentSavings);
        if (savedAmount !== null) {
            goal.currentSavings = parseFloat(savedAmount);
            saveGoals();
            renderGoals();
        }
    };

    window.deleteGoal = function(goalId) {
        if (confirm('Are you sure you want to delete this goal?')) {
            goals = goals.filter(g => g.id !== goalId);
            saveGoals();
            renderGoals();
        }
    };

    goalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newGoal = {
            id: Date.now().toString(),
            name: document.getElementById('goalName').value,
            targetAmount: parseFloat(document.getElementById('goalAmount').value),
            targetDate: document.getElementById('goalDate').value,
            monthlyIncome: parseFloat(document.getElementById('monthlyIncome').value),
            currentSavings: parseFloat(document.getElementById('currentSavings').value)
        };
        goals.push(newGoal);
        saveGoals();
        renderGoals();
        goalForm.reset();
    });

    renderGoals();
});