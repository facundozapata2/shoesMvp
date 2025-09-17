export function toggleCart() {
  const cart = document.querySelector('.shopping-card__sidebar');
  const cartBtn = document.getElementById('shoppingCartBtn');

  // Verificar que existe la clase inicial
  if (!cart.classList.contains('cart-hidden')) {
    cart.classList.add('cart-hidden');
  }

  cartBtn.addEventListener('click', () => {
    cart.classList.toggle('cart-hidden');
    cart.classList.toggle('cart-open');
  });

  // Cierre al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!cart.contains(e.target) && !cartBtn.contains(e.target)) {
      cart.classList.remove('cart-open');
      cart.classList.add('cart-hidden');
    }
  });
}