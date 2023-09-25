import Modal from "./Modal";
import { productsData } from "../consts";
import foodIcon from '../../assets/icons/foods/food_icon.svg'
import Product from "../Product";

export default class AddProductModal extends Modal {
    constructor(ModalParams, productsElements, dayEatenProducts, updateTotalStats, saveUserProductsToLS, deleteUserProduct, context) {
        super(ModalParams)
        this.context = context;
        this.productsData = productsData
        this.productsElements = productsElements
        this.dayEatenProducts = dayEatenProducts
        this.updateTotalStats = updateTotalStats
        this.saveUserProductsToLS = saveUserProductsToLS
        this.deleteUserProduct = deleteUserProduct

        this.productNameElement = document.querySelector('#add-product-name')
        this.productCaloriesElement = document.querySelector('#add-product-calories')
        this.productProteinsElement = document.querySelector('#add-product-proteins')
        this.productFatsElement = document.querySelector('#add-product-fats')
        this.productCarbohydratesElement = document.querySelector('#add-product-carbohydrates')

        this.errorTextElement = document.querySelector('#add-product-error-text')
        this.setEventListeners() 
    }

    setEventListeners() {
        super.setEventListeners();
    
        document.querySelector('#add-ropduct-btn').addEventListener('click', () => {
            this.addProduct();
        });
    }
    
    addProduct() {
        if (
            this.productNameElement.value && this.productNameElement.value.length > 0 &&
            this.productCaloriesElement.value && this.productCaloriesElement.value > 0 &&
            this.productProteinsElement.value && this.productProteinsElement.value > 0 &&
            this.productFatsElement.value && this.productFatsElement.value > 0 &&
            this.productCarbohydratesElement.value && this.productCarbohydratesElement.value > 0
            ) {
                this.errorTextElement.style.display = 'none'
                const newProduct = {
                    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
                    name: this.productNameElement.value,
                    isCustom: true,
                    icon: foodIcon,
                    cal: this.productCaloriesElement.value,
                    proteins: this.productProteinsElement.value,
                    fats: this.productFatsElement.value,
                    carbohydrates: this.productCarbohydratesElement.value,
                }
        
                this.productsData.push(newProduct)
                this.saveUserProductsToLS(newProduct)
                this.productsElements.push(new Product(newProduct, this.dayEatenProducts, this.updateTotalStats, this.deleteUserProduct.bind(this.context)))
                this.closeModal();
        } else {
            this.errorTextElement.style.display = 'inline'
        }
        
    }
}