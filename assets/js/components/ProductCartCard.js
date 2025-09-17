// 📁 js/components/ProductCartCard.js

export class ProductCartItem {
  constructor(product, cartManager) {
    this.product = product; // El producto con sus datos (incluye id, name, price, image, etc.)
    this.cartManager = cartManager;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'product-item-cart__card';
    // Se utiliza data-id para relacionar el producto
    card.dataset.id = this.product.id;

    // Estructura adaptada para el carrito:
    card.innerHTML = `
      <button type="button" name="borrar producto" title="Borrar producto">
        <i class="fa-solid fa-circle-xmark"></i>
      </button>
      <div class="product-item-cart__info">
        <div class="product-item-cart__info-txt">
          <h4 class="product-item__title">${this.product.name}</h4>
          <p class="product-item__description">${this.product.description}</p>
          <div class="unit-cart">
            <p class="product-item__quantity-cart">${this.product.cantidad} x</p>
            <p class="product-item__price">$${this.product.price}</p>   
          </div>
        </div>
        <div class="img-container-cart">
          <img src="./assets/images/webp/${this.product.image}" 
               alt="${this.product.alt}" 
               loading="lazy"
               onerror="this.onerror=null;this.src='./assets/images/placeholder.webp'">
        </div>
      </div>
      <div class="product-item__subtotal">
        <p class="product-item__subtotal-title">Subtotal:</p>
        <p class="product-item__subtotal-price">$${this.product.cantidad * this.product.price}</p>
      </div>
    `;

    // Agregar listeners para eliminar la card completa:
    const deleteBtn = card.querySelector('button[name="borrar producto"]');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();// cuando clickeo en button name="borrar producto" no se propaga el evento
      this.cartManager.eliminarProducto(this.product.id);
    });

    // Aquí también puedes agregar botones para agregar o quitar unidades
    // si lo consideras necesario en el carrito.

    return card;
  }
}
