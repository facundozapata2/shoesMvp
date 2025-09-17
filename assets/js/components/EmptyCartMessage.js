// components/EmptyCartMessage.js

export class EmptyCartMessage {
  render() {
    const message = document.createElement('span');
    message.className = 'empty-card__title';
    message.textContent = 'Todavía no hay productos agregados al carrito de compras. 😔 ';
    return message;
  }
}