import { CartManager } from './cartManager.js';
import { ProductFilter } from './productFilter.js';
import { ShoppingCartSidebar } from './shoppingCartSidebar.js';
import { OrderForm } from './orderFormManager.js';
import { toggleCart } from './toggleCart.js';
// import { EmptyCartMessage } from './components/EmptyCartMessage.js';
// import { ProductCartItem } from './components/ProductCartCard.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const cartManager = new CartManager();
    const productFilter = new ProductFilter(cartManager);
    const shoppingCartSidebar = new ShoppingCartSidebar(cartManager);
    const orderForm = new OrderForm(cartManager);

    await productFilter.init();
    toggleCart();

    shoppingCartSidebar.actualizarContenido();
    shoppingCartSidebar.actualizarTotales(); // <- Cambio aquí

    document.addEventListener('actualizarCarrito', () => {
      const cartAmountElement = document.querySelector('.cart-amount');
      if (cartAmountElement) {
         cartAmountElement.textContent = cartManager.getTotalItems();
      }
      shoppingCartSidebar.actualizarContenido();
      shoppingCartSidebar.actualizarTotales(); // <- Cambio aquí
    });
  } catch (error) {
    console.error('Error inicial:', error);
    document.getElementById('productItemContainer').innerHTML = `
      <div class="critical-error">
        <h3>🚨 Error crítico</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
});