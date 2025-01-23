import { fetchData } from './fetch-data.js'
import { updateCart } from './shopping-cart.js'

// Constantes y estado inicial
const MINIMUM_QUANTITY = 1
const productList = document.getElementById('product-list')
let selectedProducts = {}

// Selectores DOM
const getProductElements = (productItem) => ({
  quantityControls: productItem.querySelector('.quantity-controls'),
  addToCartButton: productItem.querySelector('.add-to-cart'),
  quantityValue: productItem.querySelector('.quantity-value'),
  details: {
    category: productItem.querySelector('.product-details p:first-of-type').textContent,
    name: productItem.querySelector('.product-details p:nth-of-type(2)').textContent,
    price: parseFloat(productItem.querySelector('.product-details span').textContent.replace('$', '')),
    image: productItem.querySelector('.product-img-container picture img').src
  }
})

// Funciones utilitarias
const toggleElements = (elements, shouldShow) => {
  const { quantityControls, addToCartButton } = elements
  quantityControls.classList.toggle('hidden', !shouldShow)
  addToCartButton.classList.toggle('hidden', shouldShow)
}

const createProductObject = (details, quantity) => ({
  category: details.category,
  name: details.name,
  price: details.price,
  image: details.image,
  quantity: parseInt(quantity, 10),
})

// Manejadores de eventos principales
const showQuantityControls = (button) => {
  const productItem = button.closest('.product-item')
  const elements = getProductElements(productItem)
  console.log('elements', elements)
  
  toggleElements(elements, true)
  updateSelectedProducts(productItem) // Añadir al carrito con cantidad inicial
}

const changeQuantityValue = (button, increment) => {
  const productItem = button.closest('.product-item')
  const elements = getProductElements(productItem)
  const currentQuantity = parseInt(elements.quantityValue.textContent, 10)
  const newQuantity = currentQuantity + (increment ? 1 : -1)

  if (newQuantity < MINIMUM_QUANTITY) {
    handleMinimumQuantity(productItem, elements)
  } else {
    elements.quantityValue.textContent = newQuantity
    updateSelectedProducts(productItem)
  }
}

const handleMinimumQuantity = (productItem, elements) => {
  elements.quantityValue.textContent = MINIMUM_QUANTITY
  toggleElements(elements, false)
  deleteSelectedProduct(productItem)
}

// Gestión del estado
const updateSelectedProducts = (productItem) => {
  const elements = getProductElements(productItem)
  const quantity = elements.quantityValue.textContent
  
  selectedProducts[elements.details.name] = createProductObject(
    elements.details,
    quantity
  )
  console.log('selected products', selectedProducts)
}

const deleteSelectedProduct = (productItem) => {
  const { details } = getProductElements(productItem)
  delete selectedProducts[details.name]
  console.log('selected products', selectedProducts)
}

// Template de producto
const createProductTemplate = (product) => `
  <li class="product-item">
    <div class="product-img-container">
      <picture>
        <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
        <source media="(min-width: 768px)" srcset="${product.image.tablet}">
        <source media="(min-width: 320px)" srcset="${product.image.mobile}">
        <img src="${product.image.thumbnail}" alt="${product.name}">
      </picture>
      <button class="add-to-cart btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><g fill="#C73B0F" clip-path="url(#a)"><path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/><path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M.333 0h20v20h-20z"/></clipPath></defs></svg>
        Add to Cart
      </button>
      <div class="quantity-controls hidden">
        <button class="decrement">
          <img src="../assets/images/icon-decrement-quantity.svg" />
        </button>
        <span class="quantity-value">1</span>
        <button class="increment">
          <img src="../assets/images/icon-increment-quantity.svg" />
        </button>
      </div>
    </div>

    <div class="product-details">
      <p>${product.category}</p>
      <p>${product.name}</p>
      <span>$${product.price.toFixed(2)}</span>
    </div>
  </li>
`

const handleProductList = (event) => {
  const target = event.target
  const button = target.closest('button')
  
  if (!button) return

  if (button.classList.contains('add-to-cart')) {
    showQuantityControls(button)
    updateCart()
  } else if (button.classList.contains('increment')) {
    changeQuantityValue(button, true)
    updateCart()
  } else if (button.classList.contains('decrement')) {
    changeQuantityValue(button, false)
    updateCart()
  } 
}

// Inicialización y renderizado
const setupEventListeners = () => {
  productList.addEventListener('click', handleProductList)
}

const renderProductList = async () => {
  const products = await fetchData()
  console.log('products in fetch', products)
  productList.innerHTML = products.map(createProductTemplate).join('')
  setupEventListeners()
  return products
}

export { selectedProducts, renderProductList, getProductElements, toggleElements }