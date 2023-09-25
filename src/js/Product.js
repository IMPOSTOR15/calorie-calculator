import EatenProduct from "./EatenProduct";

export default class Product {
    constructor(productData, dayEatenProducts, updateTotalStats, deleteUserProduct) {
        this.dayEatenProducts = dayEatenProducts;
        this.id = productData.id;
        this.productData = productData;
        this.updateTotalStats = updateTotalStats
        this.deleteUserProduct = deleteUserProduct
        this.weight = 0;
        
        this.render();
    }

    createProductCard() {
        const template = document.getElementById('product-template').content.cloneNode(true);
        template.querySelector('.product__icon').src = this.productData.icon;
        template.querySelector('.product__icon').alt = this.productData.name;
        template.querySelector('.product__title').textContent = this.productData.name;
        template.querySelector('#product-calories').textContent = this.productData.cal;
        template.querySelector('#product-proteins').textContent = this.productData.proteins;
        template.querySelector('#product-fatss').textContent = this.productData.fats;
        template.querySelector('#product-carbohydrates').textContent = this.productData.carbohydrates;
        if (this.productData.isCustom) {
            template.querySelector('.product__delete-btn-all').style.display = 'block'
            template.querySelector('.product__delete-btn-all').addEventListener('click', () => {
                this.deleteUserProduct(this.id)
            })
        }
        const weightInput = template.querySelector('#weight-input');
        template.querySelector('.product__add-btn').addEventListener('click', () => {
            this.weight = weightInput.value
            if (this.weight > 0) {
                this.addToEaten();
            }
        });
    
        return template;
    }
    
    render() {
        const container = document.getElementById('products-column');
        container.appendChild(this.createProductCard());
    }

    addToEaten() {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
        const eatenProduct = new EatenProduct(id, this.productData, this.dayEatenProducts, this.weight, this.updateTotalStats,);
        this.dayEatenProducts.push(eatenProduct);
        this.saveToLocalStorage()
        this.updateTotalStats();
        eatenProduct.render();
    }

    saveToLocalStorage() {
        const serializedProducts = this.dayEatenProducts.map(product => ({
            id: product.id,
            productData: product.productData,
            weight: product.weight
        }));
        localStorage.setItem('dayEatenProducts', JSON.stringify(serializedProducts));
    }
    
}
