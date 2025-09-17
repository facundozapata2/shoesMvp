import { ProductCard } from './components/ProductCardMain.js';
export class ProductFilter {
  constructor(cartManager) {
    this.cartManager = cartManager;
    this.container = document.getElementById('productItemContainer');
    this.categories = document.querySelectorAll('[data-category]');
    this.searchInput = document.getElementById('search');
    this.searchBtn = document.getElementById('searchBtn');
    this.products = [];
    this.currentCategory = 'all';
    this.currentSearchTerm = '';
  }

  async init() {
    await this.loadProducts();
    this.setupCategoryFilters();
    this.initSearch();
    this.applyFilters();
  }

  async loadProducts() {
    try {
      const response = await fetch('./products.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      this.products = await response.json();
      if (!Array.isArray(this.products)) throw new Error('Formato de productos inválido');
    } catch (error) {
      console.error('Error cargando productos:', error);
      this.container.innerHTML = '<p class="error">⚠️ Error cargando productos</p>';
      throw error;
    }
  }

  initSearch() {
    let timeout;
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.currentSearchTerm = e.target.value.trim().toLowerCase();
        this.applyFilters();
      }, 300);
    });

    this.searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.currentSearchTerm = this.searchInput.value.trim().toLowerCase();
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = this.currentCategory === 'all' 
      ? this.products 
      : this.products.filter(p => p.category === this.currentCategory);

    if (this.currentSearchTerm) {
      filtered = filtered.filter(product => {
        return product.name.toLowerCase().includes(this.currentSearchTerm) ||
               product.description.toLowerCase().includes(this.currentSearchTerm);
      });
    }

    this.renderFilteredProducts(filtered);
  }

  renderFilteredProducts(filteredProducts) {
    this.container.innerHTML = filteredProducts.length === 0 
      ? '<p class="no-results">🔍 No se encontraron productos</p>' 
      : '';
      
    filteredProducts.forEach(product => {
      const card = new ProductCard(product, this.cartManager).render();
      this.container.appendChild(card);
    });
  }

  setupCategoryFilters() {
    this.categories.forEach(category => {
      category.addEventListener('click', (e) => {
        e.preventDefault();
        this.currentCategory = category.dataset.category;
        this.categories.forEach(c => c.classList.remove('active'));
        category.classList.add('active');
        this.applyFilters();
      });
    });
  }
}