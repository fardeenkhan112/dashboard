import React, { useEffect, useMemo, useState } from 'react';
import { getImageUrl } from '../services/api.js';
import {
  Package,
  Plus,
  Filter,
  Edit2,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from '../components/Icon.jsx';

export default function Products({
  products = [],
  categories = [],
  loading,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onNavigate,
  onEditProduct,
  onDeleteProduct,
}) {
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const visibleProducts = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesSearch = !needle
        || product.name.toLowerCase().includes(needle)
        || (product.description || '').toLowerCase().includes(needle);
      const matchesCategory = selectedCategory === 'All'
        || product.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortOption === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortOption === 'price_desc') return Number(b.price) - Number(a.price);
      if (sortOption === 'stock') return Number(b.stock) - Number(a.stock);
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [products, searchTerm, selectedCategory, sortOption]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOption]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = visibleProducts.slice(startIndex, startIndex + itemsPerPage);
  const rangeStart = visibleProducts.length ? startIndex + 1 : 0;
  const rangeEnd = Math.min(startIndex + itemsPerPage, visibleProducts.length);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7357bd]">Catalog / Products</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Products</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">Manage pricing, categories, stock levels and product images from one place.</p>
        </div>
        <button onClick={() => onNavigate('add-product')} className="primary-button self-start md:self-auto">
          <Plus className="h-4 w-4" /> Add New Product
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 berry-card-shadow">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Catalog items</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 berry-card-shadow">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Filtered results</p>
          <p className="mt-1 text-2xl font-extrabold text-[#6d4cc2]">{visibleProducts.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 berry-card-shadow">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Low / out of stock</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-600">{products.filter((p) => Number(p.stock) <= 10).length}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 berry-card-shadow">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-slate-900">Inventory controls</p>
            <p className="mt-0.5 text-xs text-slate-400">Use the global search above, then narrow results by category or sort.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="control-input h-10 px-3 text-xs font-bold"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => <option key={category._id} value={category.name}>{category.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-slate-400" />
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="control-input h-10 px-3 text-xs font-bold">
                <option value="newest">Newest first</option>
                <option value="name">Name A-Z</option>
                <option value="price_asc">Price low-high</option>
                <option value="price_desc">Price high-low</option>
                <option value="stock">Highest stock</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white berry-card-shadow">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4, 5].map((row) => <div key={row} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-base font-extrabold text-slate-800">No products found</h3>
            <p className="mt-1 text-sm text-slate-400">Adjust your global search or category filter.</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Clear filters</button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedProducts.map((product) => {
                    const stock = Number(product.stock);
                    const out = stock === 0;
                    const low = stock > 0 && stock <= 10;
                    return (
                      <tr key={product._id} className="transition hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                              {product.image ? (
                                <img src={getImageUrl(product.image)} alt={product.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full items-center justify-center"><Package className="h-5 w-5 text-slate-300" /></div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-[300px] truncate font-extrabold text-slate-900">{product.name}</p>
                              <p className="mt-1 max-w-[320px] truncate text-xs text-slate-400">{product.description || 'No description provided'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="inline-flex rounded-lg bg-[#ede7f6] px-3 py-1 text-[11px] font-extrabold text-[#6d4cc2]">{product.category}</span></td>
                        <td className="px-6 py-4"><span className="font-extrabold text-slate-900">${Number(product.price).toFixed(2)}</span></td>
                        <td className="px-6 py-4"><span className="font-bold text-slate-700">{stock.toLocaleString()} units</span></td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-extrabold ${out ? 'border-rose-200 bg-rose-50 text-rose-700' : low ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${out ? 'bg-rose-500' : low ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                            {out ? 'Out of stock' : low ? 'Low stock' : 'In stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => onEditProduct(product._id)} title="Edit product" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ede7f6] text-[#6d4cc2] transition hover:bg-[#6d4cc2] hover:text-white"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => onDeleteProduct(product)} title="Delete product" className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition hover:bg-rose-600 hover:text-white"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <footer className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold text-slate-400">Showing {rangeStart}-{rangeEnd} of {visibleProducts.length} products</p>
              <div className="flex items-center gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)} className="icon-button h-9 w-9 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                <span className="min-w-20 text-center text-xs font-extrabold text-slate-600">Page {currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)} className="icon-button h-9 w-9 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
