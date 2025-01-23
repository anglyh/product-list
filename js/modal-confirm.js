import { getProductElements, selectedProducts, toggleElements } from './product-list.js'
import { cartTotal, toggleCartElements } from './shopping-cart.js'

const modal = document.getElementById('modal')
const modalList = document.getElementById('modal-list')
const modalOrderTotalContainer = document.getElementById('modal-order-total')
const startNewOrderButton = document.getElementById('start-new-order')

const cartCounter = document.getElementById('shopping-cart').querySelector('h2')

const createModalListTemplate = (product) => `
  <li class="cart-item modal">
  <img src="${product.image}" alt="${product.name}">
  <div class="cart-item-details modal">
    <h4>${product.name}</h4>
    <p>
      <span>${product.quantity}x</span>
      <span>@ $${product.price.toFixed(2)}</span>
    </p>
  </div>
  <p class="order-item-total">$${(product.quantity * product.price).toFixed(2)}</p>
  </li>
`

const showModal = () => {
  modal.classList.toggle('hidden', false)
  document.body.style.overflow = 'hidden'
}

const hideModal = (event) => {
  console.log('event target', event.target)
  modal.classList.toggle('hidden', true)
  document.body.style.overflow = ''
  cleanCart()
}

const cleanCart = () => {
  for (let key in selectedProducts) {
    delete selectedProducts[key]
  }
  console.log(selectedProducts)

  toggleCartElements(false)
  cartCounter.textContent = `Your Cart (0)`

  const productItems = document.querySelectorAll('.product-item')
  productItems.forEach(productItem => {
    const elements = getProductElements(productItem)
    elements.quantityValue.textContent = 1
    toggleElements(elements, false)
  })
}

const renderModal = () => {
  const products = Object.values(selectedProducts)
  modalList.innerHTML = products.map(createModalListTemplate).join('')

  modalOrderTotalContainer.querySelector('span').textContent = `$${cartTotal.toFixed(2)}`

  setupEventListeners()
}

const setupEventListeners = () => {
  startNewOrderButton.addEventListener('click', hideModal)
}

export { showModal, renderModal }