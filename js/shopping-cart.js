import { renderModal, showModal } from './modal-confirm.js';
import { getProductElements, selectedProducts, toggleElements } from './product-list.js';

const cartContainer = document.getElementById('shopping-cart')
const cartForm = document.getElementById('shopping-cart-form')
const cartList = document.getElementById('cart-list')
const cartTitle = document.querySelector('h2')
const orderTotal = document.getElementById('order-total')
export let cartTotal

// const getCartElements = (cartItem) => ({
//   deleteButton: cartItem.querySelector('.delete-item'),
//   productName: cartItem.querySelector('h4').textContent,
//   quantity: parseInt(cartItem.querySelector('p span:first-of-type').textContent),
//   price: parseFloat(cartItem.querySelector('p span:nth-of-type(2)').textContent.replace('@$', ''))
// })

const toggleCartElements = (shouldShow) => {
  const emptyCart = cartContainer.querySelector('.empty-cart')
  const cartForm = cartContainer.querySelector('.shopping-cart-form')

  emptyCart.classList.toggle('hidden', shouldShow)
  cartForm.classList.toggle('hidden', !shouldShow)
}

const createCartProductTemplate = (product) => `
  <li class="cart-item">
  <div class="cart-item-details">
    <h4>${product.name}</h4>
    <p>
      <span>${product.quantity}x</span> 
      <span>@$${product.price.toFixed(2)}</span> 
      <span>$${(product.price * product.quantity).toFixed(2)}</span>
    </p>
  </div>
  <button class="delete-item">
    <img src="assets/images/icon-remove-item.svg" alt="remove-item">
  </button>
  </li>
`

const calculateTotal = (products) =>
  Object.values(products)
    .reduce((total, product) => total + (product.price * product.quantity), 0)

const updateCart = () => {
  const products = Object.values(selectedProducts)
  console.log('products in updateCart', products)
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0)
  const total = calculateTotal(selectedProducts)
  cartTotal = calculateTotal(selectedProducts)

  cartTitle.textContent = `Your Cart (${totalItems})`

  if (products.length > 0) {
    cartList.innerHTML = products.map(createCartProductTemplate).join('')
    orderTotal.querySelector('span').textContent = `$${total.toFixed(2)}`
    toggleCartElements(true)
  } else {
    cartList.innerHTML = ''
    orderTotal.querySelector('span').textContent = '$0.00'
    toggleCartElements(false)
  }
}

const handleDeleteItem = (event) => {
  const deleteButton = event.target.closest('.delete-item')
  if (!deleteButton) return

  const cartItem = deleteButton.closest('.cart-item')
  const productName = cartItem.querySelector('h4').textContent
  delete selectedProducts[productName]

  updateCart()

  const productItems = document.querySelectorAll('.product-item')
  productItems.forEach(productItem => {
    const elements = getProductElements(productItem)
    if (elements.details.name === productName) {
      elements.quantityValue.textContent = 1
      toggleElements(elements, false)
    }
  })
}

const handleFormSubmit = (event) => {
  event.preventDefault()

  showModal()
  renderModal()
  console.log('Order confirmed', Object.values(selectedProducts))
}

const setupEventListeners = () => {
  cartList.addEventListener('click', handleDeleteItem)
  cartForm.addEventListener('submit', handleFormSubmit)
}

const renderShoppingCart = () => {
  setupEventListeners()
  updateCart()
}

export { updateCart, renderShoppingCart, toggleCartElements }