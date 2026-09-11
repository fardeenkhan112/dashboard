// Native API service connecting to Express backend

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  const apiRoot = API_BASE.replace(/\/api$/, '');
  return `${apiRoot}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to load dashboard statistics');
  }
  return res.json();
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.sort) query.append('sort', params.sort);

  const url = `${API_BASE}/products${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch products');
  }
  return res.json();
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch product details');
  }
  return res.json();
}

// Create product - accepts FormData for Multer image upload
export async function createProduct(formData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    body: formData // Automatically sets multipart/form-data boundary
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create product');
  }
  return data;
}

// Update product - accepts FormData for Multer image upload
export async function updateProduct(id, formData) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    body: formData
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update product');
  }
  return data;
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete product');
  }
  return data;
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch categories');
  }
  return res.json();
}

export async function fetchCategoryById(id) {
  const res = await fetch(`${API_BASE}/categories/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch category');
  }
  return res.json();
}

export async function createCategory(data) {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const resData = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(resData.message || 'Failed to create category');
  }
  return resData;
}

export async function updateCategory(id, data) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const resData = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(resData.message || 'Failed to update category');
  }
  return resData;
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete category');
  }
  return data;
}
