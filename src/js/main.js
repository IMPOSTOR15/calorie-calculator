import '../assets/styles/index.css';
import { productsData } from './consts';
import Product from './Product';
import EatenProduct from './EatenProduct';
import AddProductModal from './modals/AddProductModal';
import PieChart from './PieChart';
import SettingsModal from './modals/SettingsModal';

class App {
    constructor() {
        this.updateTotalStats = this.updateTotalStats.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.caloryChart = new PieChart();

        this.userProducts = this.getUserProducts();
        this.products = [...productsData, ...this.userProducts];

        this.dayEatenProducts = this.getEatenProducts();
        this.productsElements = this.products.map(productData => new Product(productData, this.dayEatenProducts, this.updateTotalStats, this.deleteUserProduct.bind(this)));

        this.AddProductModalController = new AddProductModal({
                modalId: 'modal',
                modalContent: 'add-product-modal',
                openBtnId: 'open-add-product-modal',
                closeBtnId: 'close-modal-btn',
            },
            this.productsElements,
            this.dayEatenProducts,
            this.updateTotalStats,
            this.saveUserProductsToLS,
            this.deleteUserProduct,
            this
        );
        this.settingsModalController = new SettingsModal({
                modalId: 'modal',
                modalContent: 'settings-modal',
                openBtnId: 'open-settings-modal-btn',
                closeBtnId: 'close-settings-modal-btn',
            }, 
            this.setGoal.bind(this)
        );


        this.filteredProducts = this.products;
        this.searchInput = document.getElementById('search-input');

        this.currentSortMethod = null;
        this.sortByNameDirection = 1;
        this.sortByCaloryDirection = 1;

        this.initEventListeners()
        this.displayEatenProducts(); 

    }

    initEventListeners() {
        this.searchInput.addEventListener('input', () => {
            const query = event.target.value.toLowerCase();
        
            if (!query) {
                this.displayProducts(this.products);
                return;
            }
        
            const filteredProducts = this.products.filter(product => 
                product.name.toLowerCase().includes(query)
            );
        
            this.displayProducts(filteredProducts);
        });

        const sortByNameBtn = document.getElementById('sort-by-name-btn');
        const sortByCaloryBtn = document.getElementById('sort-by-calory-btn');

        sortByNameBtn.addEventListener('click', this.sortProductsByName.bind(this));
        sortByCaloryBtn.addEventListener('click', this.sortProductsByCalory.bind(this));

    }

    sortProductsByName() {
        if (this.currentSortMethod !== "name") {
            this.sortByNameDirection = 1;
            this.currentSortMethod = "name";
        } else {
            this.sortByNameDirection *= -1;
        }
    
        const sortedProducts = [...this.filteredProducts].sort((a, b) => {
            if (a.name < b.name) return -1 * this.sortByNameDirection;
            if (a.name > b.name) return 1 * this.sortByNameDirection;
            return 0;
        });
    
        this.updateButtonText('sort-by-name-btn', this.sortByNameDirection, true);
        this.updateButtonText('sort-by-calory-btn', this.sortByCaloryDirection, false);
    
        this.displayProducts(sortedProducts);
    }
    
    sortProductsByCalory() {
        if (this.currentSortMethod !== "calory") {
            this.sortByCaloryDirection = 1;
            this.currentSortMethod = "calory";
        } else {
            this.sortByCaloryDirection *= -1;
        }
    
        const sortedProducts = [...this.filteredProducts].sort((a, b) => (a.cal - b.cal) * this.sortByCaloryDirection);

        this.updateButtonText('sort-by-name-btn', this.sortByNameDirection, false);
        this.updateButtonText('sort-by-calory-btn', this.sortByCaloryDirection, true);

        this.displayProducts(sortedProducts);
    }
    
    updateButtonText(buttonId, direction, isActive) {
        const button = document.getElementById(buttonId);
        if (!button) return;
    
        const baseText = buttonId === 'sort-by-name-btn' ? 'По названию' : 'По калорийности';
        const arrow = direction === 1 ? '↓' : '↑';
    
        button.textContent = isActive ? `${baseText} ${arrow}` : baseText;
    }
    
    
    saveUserProductsToLS(newProduct) {
        let userProducts = localStorage.getItem('user-products');
        if (userProducts) {
            userProducts = JSON.parse(userProducts)
        } else {
            localStorage.setItem('user-products', JSON.stringify([newProduct]))
            return
        }
        userProducts.push(newProduct)
        localStorage.setItem('user-products', JSON.stringify(userProducts));
    }

    displayProducts(products) {
        const container = document.getElementById('products-column');
        container.innerHTML = '';
        
        this.filteredProducts = products;

        products.forEach(product => {
            const productElement = new Product(product, this.dayEatenProducts, this.updateTotalStats, this.deleteUserProduct.bind(this));
        });
    }

    getUserProducts() {
        const userProducts = localStorage.getItem('user-products');
        return userProducts ? JSON.parse(userProducts) : [];
    }

    deleteUserProduct(productID) {
        this.userProducts = this.userProducts.filter((product) => {product.id !== productID})
        localStorage.setItem('user-products', JSON.stringify(this.userProducts));
        this.products = [...this.products, ...this.userProducts];
        this.displayProducts(this.products)
    }

    getEatenProducts() {
        const data = localStorage.getItem('dayEatenProducts');
        return data ? JSON.parse(data) : [];
    }

    displayEatenProducts() {
        this.dayEatenProducts.forEach(productData => {
            const id = productData.id;
            const eatenProduct = new EatenProduct(id, productData.productData, this.dayEatenProducts, productData.weight, this.updateTotalStats);
            eatenProduct.render();
        });
    }

    updateTotalStats() {
        let totalCalories = 0;
        let totalProteins = 0;
        let totalFats = 0;
        let totalCarbohydrates = 0;
    
        this.dayEatenProducts.forEach(product => {
            totalCalories += product.productData.cal / 100 * product.weight;
            totalProteins += product.productData.proteins / 100 * product.weight;
            totalFats += product.productData.fats / 100 * product.weight;
            totalCarbohydrates += product.productData.carbohydrates / 100 * product.weight;
        });

        totalCalories = Math.round(totalCalories * 10) / 10;
        totalProteins = Math.round(totalProteins * 10) / 10;
        totalFats = Math.round(totalFats * 10) / 10;
        totalCarbohydrates = Math.round(totalCarbohydrates * 10) / 10;
    
        document.getElementById('all-calories').textContent = totalCalories;
        document.getElementById('all-proteins').textContent = totalProteins;
        document.getElementById('all-fats').textContent = totalFats;
        document.getElementById('all-carbohydrates').textContent = totalCarbohydrates;
        this.updateChart(totalCalories)
    }

    updateChart(totalCalories) {
        this.caloryChart.updateCalories(totalCalories)
    }

    setGoal(goal) {
        this.caloryChart.setNewGoal(goal)
    }
    
}

new App();
