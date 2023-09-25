export default class EatenProduct {
    constructor(id, productData, dayEatenProducts, weight, updateTotalStats) {
        
        this.id = id;
        this.productData = productData;
        this.weight = weight;
        this.updateTotalStats = updateTotalStats
        this.element = this.createEatenProductCard();
        this.dayEatenProducts = dayEatenProducts
        this.updateTotalStats()
    }

    createEatenProductCard() {
        const template = document.getElementById('added-product-template').content.cloneNode(true);

        template.querySelector('.product__icon').src = this.productData.icon;
        template.querySelector('.product__icon').alt = this.productData.name;
        template.querySelector('.product__title').textContent = this.productData.name;

        template.querySelector('#product-calories').textContent = Math.round( this.productData.cal / 100 * this.weight, 100 );
        template.querySelector('#product-proteins').textContent = Math.round( this.productData.proteins / 100 * this.weight, 100 );
        template.querySelector('#product-fatss').textContent = Math.round( this.productData.fats / 100 * this.weight, 100) ;
        template.querySelector('#product-carbohydrates').textContent = Math.round( this.productData.carbohydrates / 100 * this.weight, 100 );
        template.querySelector('#product-weight').textContent = this.weight;
        
        template.querySelector('.product__delete-btn').addEventListener('click', (e) => {
            this.delete();
        });

        return template.querySelector('.product');
    }

    render() {
        const container = document.getElementById('eaten-products');
        container.appendChild(this.element);
    }

    delete() {
        const index = this.dayEatenProducts.findIndex(product => product.id === this.id);
        if (index !== -1) {
            this.element.remove();
            this.dayEatenProducts.splice(index, 1);
            this.saveToLocalStorage();
            this.updateTotalStats()
        }
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
