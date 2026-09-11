import React from 'react';
import {
  Package, Tags, Layers, DollarSign, Plus, ArrowRight, RefreshCw,
  Clock, Sparkles
} from '../components/Icon.jsx';
import { getImageUrl } from '../services/api.js';
import StatCard from '../components/StatCard.jsx';

export default function Dashboard({ stats, loading, onRefresh, onNavigate, onSelectProduct }) {
  const {
    totalProducts = 0,
    totalCategories = 0,
    totalStock = 0,
    totalInventoryValue = 0,
    recentProducts = [],
    categoryStats = [],
  } = stats || {};

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4527a0] via-[#5e35b1] to-[#7e57c2] p-6 text-white shadow-xl shadow-purple-100 sm:p-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 right-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-200">Admin workspace</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Dashboard Overview</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-purple-100">
              Monitor your product catalog, inventory and categories from one clean workspace.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={onRefresh} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20 disabled:opacity-60">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={() => onNavigate('add-product')} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#5e35b1] shadow-lg transition hover:-translate-y-0.5">
              <Plus className="h-4 w-4" /> New Product
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Products" value={loading ? '—' : totalProducts} subtitle="Products in catalog" icon={Package} variant="purple" onClick={() => onNavigate('products')} />
        <StatCard title="Total Categories" value={loading ? '—' : totalCategories} subtitle="Catalog groups" icon={Tags} variant="blue" onClick={() => onNavigate('categories')} />
        <StatCard title="Stock Units" value={loading ? '—' : totalStock.toLocaleString()} subtitle="Units currently listed" icon={Layers} variant="white" onClick={() => onNavigate('products')} />
        <StatCard title="Inventory Value" value={loading ? '—' : `$${Number(totalInventoryValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} subtitle="Price × stock" icon={DollarSign} variant="white" />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Latest Products</h2>
              <p className="mt-1 text-xs text-slate-400">Most recently created catalog items</p>
            </div>
            <button onClick={() => onNavigate('products')} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-[#5e35b1] hover:bg-purple-50">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3 p-6">
              {[1,2,3,4].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Package className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-700">No products yet</p>
              <button onClick={() => onNavigate('add-product')} className="mt-4 rounded-xl bg-[#5e35b1] px-4 py-2 text-xs font-bold text-white">Create first product</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                  <tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentProducts.map((product) => {
                    const low = Number(product.stock) <= 10;
                    const out = Number(product.stock) === 0;
                    return (
                      <tr key={product._id} className="transition hover:bg-slate-50/70">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                              {product.image ? <img src={getImageUrl(product.image)} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><Package className="h-5 w-5 text-slate-300" /></div>}
                            </div>
                            <div className="min-w-0"><p className="max-w-[230px] truncate text-sm font-bold text-slate-800">{product.name}</p><p className="mt-0.5 max-w-[230px] truncate text-[11px] text-slate-400">{product.description || 'No description'}</p></div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5"><span className="rounded-lg bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-[#5e35b1]">{product.category}</span></td>
                        <td className="px-5 py-3.5 text-sm font-extrabold text-slate-800">${Number(product.price).toFixed(2)}</td>
                        <td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${out ? 'bg-rose-50 text-rose-700' : low ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{out ? 'Out of stock' : `${product.stock} units`}</span></td>
                        <td className="px-5 py-3.5 text-right"><button onClick={() => onSelectProduct(product._id)} className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#5e35b1] hover:bg-purple-50">Edit</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div><h2 className="text-base font-extrabold text-slate-900">Category Breakdown</h2><p className="mt-1 text-[11px] text-slate-400">Products by category</p></div>
              <Tags className="h-5 w-5 text-[#5e35b1]" />
            </div>
            <div className="mt-5 space-y-4">
              {categoryStats.length === 0 ? <p className="py-6 text-center text-xs text-slate-400">No category data</p> : categoryStats.map((cat) => {
                const percent = totalProducts ? Math.round((cat.count / totalProducts) * 100) : 0;
                return <div key={cat.name}><div className="mb-1.5 flex justify-between text-xs"><span className="font-semibold text-slate-700">{cat.name}</span><span className="font-bold text-slate-400">{cat.count}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-[#5e35b1] to-[#42a5f5]" style={{width:`${percent}%`}} /></div></div>;
              })}
            </div>
            <button onClick={() => onNavigate('categories')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-[#5e35b1] hover:bg-purple-50">Manage Categories <ArrowRight className="h-3.5 w-3.5" /></button>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[#5e35b1]"><Sparkles className="h-4 w-4" /><span className="text-[10px] font-extrabold uppercase tracking-[0.15em]">Quick actions</span></div>
            <h3 className="mt-3 text-base font-extrabold text-slate-900">Keep your catalog updated</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">Create products, update stock and organize your categories from the admin panel.</p>
            <div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => onNavigate('add-product')} className="rounded-xl bg-[#5e35b1] py-2.5 text-xs font-bold text-white">Add Product</button><button onClick={() => onNavigate('add-category')} className="rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700">Add Category</button></div>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-2 text-[11px] text-slate-400"><Clock className="h-3.5 w-3.5" /> Data shown above is loaded from MongoDB through the Express API.</div>
    </div>
  );
}
