import React from 'react';
import { Tags, Plus, Edit2, Trash2, FolderOpen, Boxes, ArrowRight } from '../components/Icon.jsx';

export default function Categories({ categories = [], loading, onNavigate, onEditCategory, onDeleteCategory }) {
  const productTotal = categories.reduce((sum, category) => sum + Number(category.productCount || 0), 0);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7357bd]">Catalog / Categories</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Categories</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">Keep your catalog organized with clear product groups and descriptions.</p>
        </div>
        <button onClick={() => onNavigate('add-category')} className="primary-button self-start md:self-auto"><Plus className="h-4 w-4" /> Add Category</button>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 berry-card-shadow"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Categories</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{categories.length}</p></div>
        <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 berry-card-shadow"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Linked products</p><p className="mt-1 text-2xl font-extrabold text-[#6d4cc2]">{productTotal}</p></div>
        <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 berry-card-shadow"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Average products / category</p><p className="mt-1 text-2xl font-extrabold text-sky-600">{categories.length ? (productTotal / categories.length).toFixed(1) : '0.0'}</p></div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white berry-card-shadow">
        {loading ? (
          <div className="space-y-3 p-6">{[1, 2, 3, 4].map((row) => <div key={row} className="h-16 animate-pulse rounded-xl bg-slate-100" />)}</div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-base font-extrabold text-slate-800">No categories yet</h3>
            <p className="mt-1 text-sm text-slate-400">Create a category before adding products.</p>
            <button onClick={() => onNavigate('add-category')} className="primary-button mx-auto mt-4"><Plus className="h-4 w-4" /> Add Category</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                <tr><th className="px-6 py-4">Category</th><th className="px-6 py-4">Description</th><th className="px-6 py-4">Products</th><th className="px-6 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <tr key={category._id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ede7f6] text-[#6d4cc2]"><Tags className="h-5 w-5" /></div><div><p className="font-extrabold text-slate-900">{category.name}</p><p className="mt-1 max-w-[220px] truncate text-[11px] text-slate-400">{category._id}</p></div></div></td>
                    <td className="px-6 py-4"><p className="max-w-lg line-clamp-2 text-slate-600">{category.description || 'No description provided'}</p></td>
                    <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-extrabold text-blue-700"><Boxes className="h-3.5 w-3.5" /> {category.productCount || 0} products</span></td>
                    <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => onEditCategory(category._id)} title="Edit category" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ede7f6] text-[#6d4cc2] transition hover:bg-[#6d4cc2] hover:text-white"><Edit2 className="h-4 w-4" /></button><button onClick={() => onDeleteCategory(category)} title="Delete category" className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition hover:bg-rose-600 hover:text-white"><Trash2 className="h-4 w-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <footer className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"><span className="text-xs font-semibold text-slate-500">{categories.length} categories configured in MongoDB</span><button onClick={() => onNavigate('products')} className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#6d4cc2] hover:underline">View products <ArrowRight className="h-3.5 w-3.5" /></button></footer>
          </div>
        )}
      </section>
    </div>
  );
}
