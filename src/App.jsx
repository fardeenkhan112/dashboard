
import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import NotificationToast from './components/NotificationToast.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';

import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import AddProduct from './pages/AddProduct.jsx';
import EditProduct from './pages/EditProduct.jsx';
import Categories from './pages/Categories.jsx';
import AddCategory from './pages/AddCategory.jsx';
import EditCategory from './pages/EditCategory.jsx';

import {
  fetchStats,
  fetchProducts,
  fetchCategories,
  deleteProduct,
  deleteCategory,
} from './services/api.js';

const THEME_KEY = 'berry-dashboard-theme';

function DashboardApp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [toast, setToast] = useState(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    itemName: '',
    onConfirm: null,
    loading: false,
  });

  // Convert URL into sidebar active page
  const getActivePage = () => {
    const path = location.pathname;

    if (path === '/') return 'dashboard';
    if (path === '/products') return 'products';
    if (path === '/products/add') return 'add-product';
    if (path.startsWith('/products/edit/')) return 'edit-product';
    if (path === '/categories') return 'categories';
    if (path === '/categories/add') return 'add-category';
    if (path.startsWith('/categories/edit/')) return 'edit-category';

    return 'dashboard';
  };

  const activePage = getActivePage();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore storage restrictions.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const navigateTo = useCallback(
    (page) => {
      const routes = {
        dashboard: '/',
        products: '/products',
        'add-product': '/products/add',
        categories: '/categories',
        'add-category': '/categories/add',
      };

      if (routes[page]) {
        navigate(routes[page]);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSidebarOpen(false);
    },
    [navigate]
  );

  const loadData = useCallback(async () => {
    setLoadingStats(true);
    setLoadingProducts(true);
    setLoadingCategories(true);

    const [
      statsResult,
      productsResult,
      categoriesResult,
    ] = await Promise.allSettled([
      fetchStats(),
      fetchProducts(),
      fetchCategories(),
    ]);

    if (
      statsResult.status === 'fulfilled' &&
      statsResult.value.success
    ) {
      setStats(statsResult.value.data);
    } else if (statsResult.status === 'rejected') {
      console.error('Error fetching stats:', statsResult.reason);
    }

    if (
      productsResult.status === 'fulfilled' &&
      productsResult.value.success
    ) {
      setProducts(productsResult.value.data);
    } else if (productsResult.status === 'rejected') {
      console.error(
        'Error fetching products:',
        productsResult.reason
      );
    }

    if (
      categoriesResult.status === 'fulfilled' &&
      categoriesResult.value.success
    ) {
      setCategories(categoriesResult.value.data);
    } else if (categoriesResult.status === 'rejected') {
      console.error(
        'Error fetching categories:',
        categoriesResult.reason
      );
    }

    setLoadingStats(false);
    setLoadingProducts(false);
    setLoadingCategories(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showToast = (message, type = 'success', title) => {
    setToast({ message, type, title });
  };

  const handleEditProduct = (id) => {
    setSelectedProductId(id);
    navigate(`/products/edit/${id}`);
  };

  const handleDeleteProduct = (product) => {
    setModalConfig({
      isOpen: true,
      title: 'Delete Product',
      message:
        'Are you sure you want to permanently delete this product? Its uploaded image will also be removed from the server.',
      itemName: product.name,
      loading: false,

      onConfirm: async () => {
        try {
          setModalConfig((prev) => ({
            ...prev,
            loading: true,
          }));

          const res = await deleteProduct(product._id);

          setModalConfig((prev) => ({
            ...prev,
            isOpen: false,
            loading: false,
          }));

          showToast(
            res.message ||
              `Product "${product.name}" was deleted successfully.`
          );

          await loadData();
        } catch (err) {
          setModalConfig((prev) => ({
            ...prev,
            loading: false,
          }));

          showToast(
            err.message || 'Failed to delete product',
            'error'
          );
        }
      },
    });
  };

  const handleEditCategory = (id) => {
    setSelectedCategoryId(id);
    navigate(`/categories/edit/${id}`);
  };

  const handleDeleteCategory = (category) => {
    setModalConfig({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete category "${category.name}"? Categories with linked products cannot be removed.`,
      itemName: category.name,
      loading: false,

      onConfirm: async () => {
        try {
          setModalConfig((prev) => ({
            ...prev,
            loading: true,
          }));

          const res = await deleteCategory(category._id);

          setModalConfig((prev) => ({
            ...prev,
            isOpen: false,
            loading: false,
          }));

          showToast(
            res.message ||
              `Category "${category.name}" was deleted successfully.`
          );

          await loadData();
        } catch (err) {
          setModalConfig((prev) => ({
            ...prev,
            loading: false,
          }));

          showToast(
            err.message || 'Failed to delete category',
            'error'
          );
        }
      },
    });
  };

  return (
    <div className="min-h-screen app-shell text-slate-800 flex">
      <Sidebar
        activePage={activePage}
        setActivePage={navigateTo}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        productCount={products.length}
        categoryCount={categories.length}
      />

      <div className="flex-1 flex min-w-0 flex-col lg:pl-64">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onNavigate={navigateTo}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1440px]">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    stats={stats}
                    loading={loadingStats}
                    onRefresh={loadData}
                    onNavigate={navigateTo}
                    onSelectProduct={handleEditProduct}
                  />
                }
              />

              <Route
                path="/products"
                element={
                  <Products
                    products={products}
                    categories={categories}
                    loading={loadingProducts}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onNavigate={navigateTo}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                }
              />

              <Route
                path="/products/add"
                element={
                  <AddProduct
                    categories={categories}
                    onSuccess={(msg) => {
                      showToast(msg);
                      loadData();
                      navigate('/products');
                    }}
                    onCancel={() => navigate('/products')}
                  />
                }
              />

              <Route
                path="/products/edit/:id"
                element={
                  <EditProduct
                    productId={selectedProductId}
                    categories={categories}
                    onSuccess={(msg) => {
                      showToast(msg);
                      loadData();
                      navigate('/products');
                    }}
                    onCancel={() => navigate('/products')}
                  />
                }
              />

              <Route
                path="/categories"
                element={
                  <Categories
                    categories={categories}
                    loading={loadingCategories}
                    onNavigate={navigateTo}
                    onEditCategory={handleEditCategory}
                    onDeleteCategory={handleDeleteCategory}
                  />
                }
              />

              <Route
                path="/categories/add"
                element={
                  <AddCategory
                    onSuccess={(msg) => {
                      showToast(msg);
                      loadData();
                      navigate('/categories');
                    }}
                    onCancel={() => navigate('/categories')}
                  />
                }
              />

              <Route
                path="/categories/edit/:id"
                element={
                  <EditCategory
                    categoryId={selectedCategoryId}
                    onSuccess={(msg) => {
                      showToast(msg);
                      loadData();
                      navigate('/categories');
                    }}
                    onCancel={() => navigate('/categories')}
                  />
                }
              />

              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        itemName={modalConfig.itemName}
        loading={modalConfig.loading}
        onConfirm={modalConfig.onConfirm}
        onCancel={() =>
          setModalConfig((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
      />

      <NotificationToast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DashboardApp />
    </BrowserRouter>
  );
}

