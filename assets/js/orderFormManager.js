// orderFormManager.js
export class OrderForm {
  constructor(cartManager) {
    this.cartManager = cartManager;
    this.form = document.getElementById('orderForm');
    // this.submitButton = document.querySelector(".product-in-cart__btn-procesar");
    //botones de envio
    this.btnWhatsapp = document.querySelector('.enviarPedidoWhatsapp');
    this.btnMail = document.querySelector('.enviarPedidoMail');
    this.setupEventListeners();
  }

  setupEventListeners() {
    // submit fuera del <form>
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    const retiroSelect = this.form.querySelector('#retiroMethod');
    const direccion = this.form.querySelector('#direccion');
    const zona = this.form.querySelector('#zonaDeEntrega');
    const costoEnvioText = document.querySelector('#productInCartShippingCost');

    retiroSelect.addEventListener('change', (e) => {
      if (e.target.value === 'enviar') {
        direccion.classList.add('visible-delivery');
        zona.classList.add('visible-delivery');
        if (costoEnvioText) costoEnvioText.classList.add('visible-delivery');
      } else {
        direccion.classList.remove('visible-delivery');
        zona.classList.remove('visible-delivery');
        if (costoEnvioText) costoEnvioText.classList.remove('visible-delivery');
        const warning = this.form.querySelector('.zona-warning');
        if (warning) warning.remove();
      }
      document.dispatchEvent(new CustomEvent('actualizarCarrito'));
    });

    zona.addEventListener('change', (e) => {
      const selectedOption = zona.options[zona.selectedIndex];
      const costoEnvioValue = selectedOption.value;
      let warning = this.form.querySelector('.zona-warning')
      if (costoEnvioValue === "0") {
        if (!warning) {
          warning = document.createElement('p');
          warning.className = 'zona-warning';
          warning.style.color = 'red';
          warning.style.fontSize = '0.9rem';
          warning.style.marginTop = '0.5rem';
          warning.textContent = '¿No sale tu zona? Ponla en Comentarios';
          zona.parentElement.appendChild(warning);
        }
      } else {
        if (warning) warning.remove();
      }
      
      if (costoEnvioText) {
        if (costoEnvioValue === "0") {
          costoEnvioText.textContent = "Pon tu zona en comentarios";
        } else if (costoEnvioValue === "") {
          costoEnvioText.textContent = "";
        } else {
          costoEnvioText.textContent = `$${costoEnvioValue}`;
        }
      }
      document.dispatchEvent(new CustomEvent('actualizarCarrito'));
    });

    const notaTextarea = this.form.querySelector('#notaTextarea');
    if (notaTextarea) {
      notaTextarea.placeholder = "¿Algun comentario?";
    }

    // Click en WhatsApp
    this.btnWhatsapp.addEventListener("click", (e) => {
      e.preventDefault();
      const formData = new FormData(this.form);
      const mensaje = this.generarMensajePedido(formData);
      this.enviarPorWhatsApp(mensaje);
    });

    // Click en Email
    this.btnMail.addEventListener("click", (e) => {
      e.preventDefault();
      const formData = new FormData(this.form);
      const mensaje = this.generarMensajePedido(formData);
      this.enviarPorEmail(mensaje);
    });

    // this.submitButton.addEventListener("click", (e) => this.handleSubmit(e));

  }

  

  // handleSubmit(e) {
  //   e.preventDefault(); 
  //   const formData = new FormData(this.form);
  //   const mensaje = this.generarMensajePedido(formData);
  //   this.enviarPorWhatsApp(mensaje);
  // }

  // handleSubmit(e) {
  //   e.preventDefault();
  //   const formData = new FormData(this.form);
  //   const mensaje = this.generarMensajePedido(formData);
  //   this.enviarPorEmail(mensaje);
  // }

  generarMensajePedido(formData) {
    let mensaje = '🚀 *NUEVO PEDIDO - DULCE BEAUTY* 🚀\n\n';
    
    mensaje += `*Nombre:* ${formData.get('userName')}\n`;
    mensaje += `*Teléfono:* ${formData.get('userPhone')}\n`;
    mensaje += `*Método de pago:* ${formData.get('paymentMethod')}\n`;
    mensaje += `*Retiro/Envío:* ${formData.get('retiroMethod')}\n\n`;
    
    if (formData.get('retiroMethod') === 'enviar') {
      mensaje += `*Dirección:* ${formData.get('direccion') || "No especificada"}\n`;
      mensaje += `*Zona de entrega:* ${formData.get('zonaDeEntrega') || "No especificada"}\n\n`;
    }
    
    mensaje += '*PRODUCTOS:*\n';
    this.cartManager.getCarrito().forEach(item => {
      mensaje += `- ${item.name} x${item.cantidad} ($${item.precioUnitario} c/u)\n`;
    });
    
    mensaje += `\n*Total productos:* $${this.cartManager.getTotal()}\n`;
    
    if (formData.get('nota')) {
      mensaje += `\n*Comentarios:*\n${formData.get('nota')}`;
    }
    
    return mensaje;
  }

  enviarPorWhatsApp(mensaje) {
    const numeroWhatsApp = '5491122964846';
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
  }

  // enviarPorEmail(mensaje) {
  //   const emailDestino = 'facundozapata2@gmail.com';
  //   const subject = encodeURIComponent('Nuevo Pedido - Dulce Beauty');
  //   window.open(`mailto:${emailDestino}?subject=${subject}&body=${mensaje}`, '_blank');
  // }

  enviarPorEmail(mensaje) {
  const emailDestino = 'facundozapata2@gmail.com';
  const subject = encodeURIComponent('Nuevo Pedido - Dulce Beauty');
  const body = encodeURIComponent(mensaje);
  window.open(`mailto:${emailDestino}?subject=${subject}&body=${body}`, '_blank');
  }
}