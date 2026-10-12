import React from 'react';
import { Search, X } from 'lucide-react';
import PaginationControls from './PaginationControls';
import {
  masterToolbar,
  masterSearchWrap,
  masterSearchIcon,
  masterSearchInput
} from './masterPageStyles';

const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search alphabetically...',
  totalItems = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange
}) => {
  return (
    <div className={`${masterToolbar} flex flex-col md:flex-row items-stretch md:items-center gap-2.5 w-full`}>
      {/* Search Input Box */}
      <div className={masterSearchWrap}>
        <Search size={14} className={masterSearchIcon} />
        <input
          type="text"
          className={masterSearchInput}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="pr-2 text-slate-400 hover:text-slate-600 focus:outline-none"
            title="Clear search"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Integrated Pagination Controls */}
      {onPageChange && (
        <PaginationControls
          totalItems={totalItems}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

export default SearchBar;