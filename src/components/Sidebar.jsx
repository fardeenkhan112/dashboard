import React from 'react';
import {
  LayoutDashboard, Package, PackagePlus, Tags, FolderPlus, Boxes, ChevronRight
} from './Icon.jsx';

export default function Sidebar({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
  productCount = 0,
  categoryCount = 0
}) {
  const sections = [
    {
      title: 'Overview',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      title: 'Catalog',
      items: [
        { id: 'products', label: 'All Products', icon: Package, badge: productCount },
        { id: 'add-product', label: 'Add Product', icon: PackagePlus },
        { id: 'categories', label: 'Categories', icon: Tags, badge: categoryCount },
        { id: 'add-category', label: 'Add Category', icon: FolderPlus },
      ],
    },
  ];

  const navigate = (page) => {
    setActivePage(page);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <>
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <button
          onClick={() => navigate('dashboard')}
          className="flex h-20 items-center gap-3 border-b border-slate-100 px-6 text-left"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#4527a0] to-[#7e57c2] text-white shadow-lg shadow-purple-200">
            <Boxes className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-xl font-extrabold tracking-tight text-[#5e35b1]">BERRY</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Admin Dashboard</span>
          </span>
        </button>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {sections.map((section) => (
            <div key={section.title} className="mb-7">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">{section.title}</p>
              <div className="mt-2 space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                        active
                          ? 'bg-purple-50 text-[#5e35b1] shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-[#5e35b1]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? 'bg-white text-[#5e35b1] shadow-sm' : 'text-slate-400 group-hover:text-[#5e35b1]'}`}>
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        {item.label}
                      </span>
                      {item.badge !== undefined ? (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? 'bg-[#5e35b1] text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {item.badge}
                        </span>
                      ) : (
                        active && <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">Data source</p>
            <p className="mt-2 text-sm font-bold text-slate-800">MongoDB</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">Products and categories are loaded through the Express REST API.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
