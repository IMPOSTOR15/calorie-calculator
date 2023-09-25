export default class PieChart {
    constructor() {
        this.goalCalories = 0;
        this.consumedCalories = 0;
        this.circleElement = document.querySelector('.circle__rand-circle');
        this.percentageTextElement = document.querySelector('#calory-percent');
        this.caloriesGoalTextElement = document.querySelector('#limit-calories');
        this.consumedCaloriesTextElement = document.querySelector('#consumed-calories');
        this.warningTextElement = document.querySelector('#warning-text');

        this.loadGoalFromLS();
        this.updateChart();
    }

    updateChart() {
        const percentage = this.calculatePercentage();
        this.updateUI(percentage);
    }

    calculatePercentage() {
        if (!this.consumedCalories || !this.goalCalories) {
            return 0
        }
        let percentage = (this.consumedCalories / this.goalCalories) * 100;
        return Math.min(Math.max(percentage, 0), 100);
    }

    updateUI(percentage) {
        this.caloriesGoalTextElement.textContent = this.goalCalories;
        this.consumedCaloriesTextElement.textContent = this.consumedCalories;
        this.circleElement.style.setProperty('--pie-p', `${percentage}%`);
        this.percentageTextElement.textContent = `${Math.round(percentage)}%`;
        this.warningTextElement.style.visibility = this.consumedCalories > this.goalCalories ? 'visible' : 'hidden';
    }

    setNewGoal(goal) {
        this.goalCalories = goal;
        this.updateChart();
        this.setGoalToLS()
    }

    updateCalories(consumedCalories) {
        this.consumedCalories = consumedCalories
        this.updateChart();
    }

    loadGoalFromLS() {
        this.goalCalories = localStorage.getItem('day-calories-goal') || 0
    }

    setGoalToLS() {
        localStorage.setItem('day-calories-goal', this.goalCalories)
    }

}
