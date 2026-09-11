import React from 'react';

const paths = {
  LayoutDashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  Package: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.5 7.5 7.5 4 7.5-4M12 12v9"/></>,
  PackagePlus: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.5 7.5 7.5 4 7.5-4M12 12v9M17 3v6M14 6h6"/></>,
  Tags: <><path d="M20 13 13 20l-8-8V5h7l8 8Z"/><circle cx="8.5" cy="8.5" r="1"/></>,
  FolderPlus: <><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M12 11v6M9 14h6"/></>,
  FolderOpen: <><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v1H5a2 2 0 0 0-2 2V7Z"/><path d="m3 12 2-1h16l-2 7a2 2 0 0 1-2 1H5a2 2 0 0 1-2-2v-5Z"/></>,
  Boxes: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.5 7.5 7.5 4 7.5-4M12 12v9"/></>,
  Search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  Menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
  Plus: <><path d="M12 5v14M5 12h14"/></>,
  Bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
  ChevronDown: <><path d="m6 9 6 6 6-6"/></>,
  ChevronRight: <><path d="m9 18 6-6-6-6"/></>,
  ChevronLeft: <><path d="m15 18-6-6 6-6"/></>,
  ArrowRight: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  ArrowLeft: <><path d="M19 12H5M11 18l-6-6 6-6"/></>,
  ArrowUpRight: <><path d="M7 17 17 7M7 7h10v10"/></>,
  ArrowDownRight: <><path d="m7 7 10 10M17 7v10H7"/></>,
  ArrowUpDown: <><path d="m8 7 4-4 4 4M12 3v18M16 17l-4 4-4-4"/></>,
  TrendingUp: <><path d="M3 17 9 11l4 4 8-9"/><path d="M15 6h6v6"/></>,
  RefreshCw: <><path d="M20 11a8 8 0 0 0-14.9-4M4 4v5h5M4 13a8 8 0 0 0 14.9 4M20 20v-5h-5"/></>,
  Clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  Upload: <><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></>,
  Image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></>,
  ImageIcon: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></>,
  Edit2: <><path d="m4 20 4-.8L19 8a2 2 0 0 0-3-3L5 16l-1 4Z"/></>,
  Edit3: <><path d="m12 20 9-9"/><path d="M16 5a2.1 2.1 0 0 1 3 3L8 19l-5 1 1-5L16 5Z"/></>,
  Trash2: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"/></>,
  X: <><path d="M6 6l12 12M18 6 6 18"/></>,
  Check: <><path d="m5 12 4 4L19 6"/></>,
  CheckCircle2: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
  AlertCircle: <><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></>,
  AlertTriangle: <><path d="m12 3 9 16H3L12 3Z"/><path d="M12 9v4M12 16h.01"/></>,
  Database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/></>,
  Layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
  DollarSign: <><path d="M12 3v18M17 7c0-2-2-3-5-3S7 5 7 7s1 3 5 4 5 2 5 4-2 4-5 4-5-1-5-4"/></>,
  Filter: <><path d="M4 5h16M7 12h10M10 19h4"/></>,
  Link: <><path d="M10 13a5 5 0 0 0 7.1.1l2-2A5 5 0 0 0 12 4l-1 1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1-1"/></>,
  LinkIcon: <><path d="M10 13a5 5 0 0 0 7.1.1l2-2A5 5 0 0 0 12 4l-1 1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1-1"/></>,
  ExternalLink: <><path d="M14 4h6v6M20 4 11 13"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/></>,
  Server: <><rect x="4" y="4" width="16" height="6" rx="1"/><rect x="4" y="14" width="16" height="6" rx="1"/><path d="M8 7h.01M8 17h.01"/></>,
  ShieldCheck: <><path d="m12 3 8 3v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/></>,
  Sparkles: <><path d="m12 3-1 5-4 1 4 1 1 5 1-5 4-1-4-1-1-5ZM19 14l-.6 2.4L16 17l2.4.6L19 20l.6-2.4L22 17l-2.4-.6L19 14ZM5 15l-.5 2L3 17.5l1.5.5.5 2 .5-2 1.5-.5-1.5-.5L5 15Z"/></>,
  User: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  LogOut: <><path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-5"/></>,
  Copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
  Sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
  Moon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z"/>,
};

export function Icon({ name, className = '', size, ...props }) {
  const content = paths[name] || <circle cx="12" cy="12" r="8"/>;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {content}
    </svg>
  );
}

export const LayoutDashboard = (p) => <Icon name="LayoutDashboard" {...p} />;
export const Package = (p) => <Icon name="Package" {...p} />;
export const PackagePlus = (p) => <Icon name="PackagePlus" {...p} />;
export const Tags = (p) => <Icon name="Tags" {...p} />;
export const FolderPlus = (p) => <Icon name="FolderPlus" {...p} />;
export const FolderOpen = (p) => <Icon name="FolderOpen" {...p} />;
export const Boxes = (p) => <Icon name="Boxes" {...p} />;
export const Search = (p) => <Icon name="Search" {...p} />;
export const Menu = (p) => <Icon name="Menu" {...p} />;
export const Plus = (p) => <Icon name="Plus" {...p} />;
export const Bell = (p) => <Icon name="Bell" {...p} />;
export const ChevronDown = (p) => <Icon name="ChevronDown" {...p} />;
export const ChevronRight = (p) => <Icon name="ChevronRight" {...p} />;
export const ChevronLeft = (p) => <Icon name="ChevronLeft" {...p} />;
export const ArrowRight = (p) => <Icon name="ArrowRight" {...p} />;
export const ArrowLeft = (p) => <Icon name="ArrowLeft" {...p} />;
export const ArrowUpRight = (p) => <Icon name="ArrowUpRight" {...p} />;
export const ArrowDownRight = (p) => <Icon name="ArrowDownRight" {...p} />;
export const ArrowUpDown = (p) => <Icon name="ArrowUpDown" {...p} />;
export const TrendingUp = (p) => <Icon name="TrendingUp" {...p} />;
export const RefreshCw = (p) => <Icon name="RefreshCw" {...p} />;
export const Clock = (p) => <Icon name="Clock" {...p} />;
export const Upload = (p) => <Icon name="Upload" {...p} />;
export const Image = (p) => <Icon name="Image" {...p} />;
export const ImageIcon = (p) => <Icon name="ImageIcon" {...p} />;
export const Edit2 = (p) => <Icon name="Edit2" {...p} />;
export const Edit3 = (p) => <Icon name="Edit3" {...p} />;
export const Trash2 = (p) => <Icon name="Trash2" {...p} />;
export const X = (p) => <Icon name="X" {...p} />;
export const Check = (p) => <Icon name="Check" {...p} />;
export const CheckCircle2 = (p) => <Icon name="CheckCircle2" {...p} />;
export const AlertCircle = (p) => <Icon name="AlertCircle" {...p} />;
export const AlertTriangle = (p) => <Icon name="AlertTriangle" {...p} />;
export const Database = (p) => <Icon name="Database" {...p} />;
export const Layers = (p) => <Icon name="Layers" {...p} />;
export const DollarSign = (p) => <Icon name="DollarSign" {...p} />;
export const Filter = (p) => <Icon name="Filter" {...p} />;
export const Link = (p) => <Icon name="Link" {...p} />;
export const LinkIcon = (p) => <Icon name="LinkIcon" {...p} />;
export const ExternalLink = (p) => <Icon name="ExternalLink" {...p} />;
export const Server = (p) => <Icon name="Server" {...p} />;
export const ShieldCheck = (p) => <Icon name="ShieldCheck" {...p} />;
export const Sparkles = (p) => <Icon name="Sparkles" {...p} />;
export const User = (p) => <Icon name="User" {...p} />;
export const LogOut = (p) => <Icon name="LogOut" {...p} />;
export const Copy = (p) => <Icon name="Copy" {...p} />;
export const Sun = (p) => <Icon name="Sun" {...p} />;
export const Moon = (p) => <Icon name="Moon" {...p} />;
