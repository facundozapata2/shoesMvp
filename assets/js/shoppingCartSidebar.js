import { EmptyCartMessage } from './components/EmptyCartMessage.js';
import { ProductCartItem } from './components/ProductCartCard.js';

export class ShoppingCartSidebar {
  constructor(carritoManager) {
    this.carritoManager = carritoManager;
    this.sidebar = document.querySelector('.shopping-card__sidebar');
  }

  actualizarContenido() {
    const contenedor = this.sidebar.querySelector('.product-in-cart__card-container');
    contenedor.innerHTML = '';
    
    if (this.carritoManager.carrito.length === 0) {
      contenedor.appendChild(new EmptyCartMessage().render());
      
    } else {
      this.carritoManager.carrito.forEach(item => {
        contenedor.appendChild(new ProductCartItem(item, this.carritoManager).render());
      });
    }
    this.mostrarFormulario();
  }

  actualizarTotales() {
    const totalElements = document.getElementsByClassName('cart-total');
    const cartAmountElements = document.getElementsByClassName('cart-amount');
    const netWorthElement = document.querySelector('#productInCartNetworth');
    const shippingCostElement = document.querySelector('#productInCartShippingCost');

    const totalProductos = this.carritoManager.getTotal();
    const costoEnvio = parseInt(document.querySelector('#zonaDeEntrega')?.value) || 0;
    const totalFinal = totalProductos + costoEnvio;

    Array.from(totalElements).forEach(el => el.textContent = `$${totalProductos}`);
    Array.from(cartAmountElements).forEach(el => el.textContent = this.carritoManager.getTotalItems());
    
    if (shippingCostElement) {
      shippingCostElement.textContent = costoEnvio === 0 ? 
        "Pon tu zona en comentarios" : 
        `$${costoEnvio}`;
    }
    
    if (netWorthElement) netWorthElement.textContent = `$${totalFinal}`;
  }

  mostrarFormulario() {
    const formulario = this.sidebar.querySelector('.product-in-cart__form');
    const info = this.sidebar.querySelector('.product-in-cart__info');
    
    if (this.carritoManager.carrito.length > 0) {
      formulario?.classList.remove('cart-form__hidden');
      info?.classList.remove('cart-info__hidden');
    } else {
        
      formulario?.classList.add('cart-form__hidden');
      info?.classList.add('cart-info__hidden');
    }
  }
}