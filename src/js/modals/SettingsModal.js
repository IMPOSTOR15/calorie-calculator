import Modal from "./Modal";

export default class SettingsModal extends Modal {
    constructor(ModalParams, setGoal) {
        super(ModalParams)
        this.setGoal = setGoal
        
        this.setGoalInput = document.querySelector('#day-goal-input');
        this.deleteAllBtn = document.querySelector('#delete-all-btn');

        this.settingsErrorElement = document.querySelector('#settings-error')
        this.setEventListeners();
    }
    setEventListeners() {
        super.setEventListeners();
        this.deleteAllBtn.addEventListener('click', this.deleteAllData)
        document.querySelector('#confirm-settings-btn').addEventListener('click', () => {
            this.changeGoal()
            
        });
    }
    changeGoal() {
        const newGoal = this.setGoalInput.value
        if (newGoal && newGoal > 0) {
            this.settingsErrorElement.style.display = 'none'
            this.setGoal(newGoal)
        } else {
            this.settingsErrorElement.style.display = 'inline'
            return
        }
        this.closeModal();
        
    }
    deleteAllData() {
        localStorage.clear()
    }
}