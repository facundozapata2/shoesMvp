// 📁 js/CartManager.js


export class CartManager {
  constructor() {
    this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    this.MAX_ITEMS = 100; // Límite máximo por producto
  }

  // Añadir producto al carrito
  añadirProducto(producto) {
    const itemExistente = this.carrito.find(item => item.id === producto.id);
    
    try {
      if (itemExistente) {
        if (itemExistente.cantidad >= this.MAX_ITEMS) {
          throw new Error(`Límite de ${this.MAX_ITEMS} unidades por producto`);
        }
        itemExistente.cantidad++;
      } else {
        this.carrito.push({ 
          ...producto, 
          cantidad: 1,
          precioUnitario: producto.price // Guardar precio en el momento de añadir
        });
      }
      
      this.guardarEstado();
      
    } catch (error) {
      throw error;
    }
  }

  // Eliminar una unidad del producto
  eliminarProducto(productoId) {
    const itemIndex = this.carrito.findIndex(item => item.id === productoId);
    
    try {
      if (itemIndex === -1) throw new Error('Producto no encontrado en el carrito');
      
      if (this.carrito[itemIndex].cantidad > 1) {
        this.carrito[itemIndex].cantidad--;
      } else {
        this.carrito.splice(itemIndex, 1);
      }
      
      this.guardarEstado();
      
    } catch (error) {
      throw error;
    }
  }

  // Eliminar todas las unidades de un producto
  eliminarTodo(productoId) {
    const initialLength = this.carrito.length;
    this.carrito = this.carrito.filter(item => item.id !== productoId);
    
    if (initialLength === this.carrito.length) {
      throw new Error('No se encontró el producto para eliminar');
    }
    
    this.guardarEstado();
  }

  // Persistir estado y notificar cambios
  guardarEstado() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    
    // Disparar evento personalizado con datos actualizados
    const event = new CustomEvent('actualizarCarrito', {
      detail: {
        cantidad: this.getTotalItems(),
        total: this.getTotal()
      }
    });
    
    document.dispatchEvent(event);
    
    // Actualizar el <span class="cart-total"> con el total del carrito
    this.actualizarDOM();
  }

  // Método para actualizar el contenido del DOM
  actualizarDOM() {
    const cartTotal = document.querySelector('.cart-total');
    if (cartTotal) {
      cartTotal.textContent = `$${this.getTotal()}`;
    }
  }

  // Obtener cantidad total de items
  getTotalItems() {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  // Calcular total monetario
  getTotal() {
    return this.carrito.reduce((total, item) => {
      // Usar precioUnitario para evitar variaciones de precio futuro
      return total + (item.precioUnitario * item.cantidad);
    }, 0);
  }
  
  // Métodos agregados para compatibilidad con el sidebar:
  getTotalNeto() {
    // Si en el futuro se agrega costo de envío, se suma aquí.
    return this.getTotal();
  }
  
  getTotalPrecio() {
    return this.getTotal();
  }

  // Obtener copia segura del carrito
  getCarrito() {
    return structuredClone(this.carrito);
  }
}

