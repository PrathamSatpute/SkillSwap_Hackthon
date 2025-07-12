import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
  className?: string;
  showHome?: boolean;
}

export default function Breadcrumb({
  items,
  onNavigate,
  className = '',
  showHome = true
}: BreadcrumbProps) {
  const handleClick = (item: BreadcrumbItem, index: number) => {
    if (item.href && onNavigate && index < items.length - 1) {
      onNavigate(item.href);
    }
  };

  const allItems = showHome 
    ? [{ label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> }, ...items]
    : items;

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      {allItems.map((item, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}
            
            {index === allItems.length - 1 ? (
              // Current page (last item)
              <span className="flex items-center text-gray-900 font-medium">
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </span>
            ) : (
              // Clickable breadcrumb item
              <button
                onClick={() => handleClick(item, index)}
                disabled={!item.href}
                className={`flex items-center text-gray-500 hover:text-gray-700 transition-colors ${
                  item.href ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </button>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
} 