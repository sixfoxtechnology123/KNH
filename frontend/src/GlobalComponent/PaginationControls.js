import React from 'react';

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

const PaginationControls = ({
  totalItems = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  className = ''
}) => {
  const isAll = pageSize === -1;
  const totalPages = isAll ? 1 : Math.max(1, Math.ceil(totalItems / pageSize) || 1);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startItem = totalItems === 0 ? 0 : isAll ? 1 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = totalItems === 0 ? 0 : isAll ? totalItems : Math.min(safeCurrentPage * pageSize, totalItems);

  return (
    <div
      className={`flex items-center justify-between gap-3 overflow-x-auto whitespace-nowrap rounded-lg border border-slate-400 bg-slate-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600 ${className}`.trim()}
    >
      {/* Rows */}
      <div className="flex items-center gap-2 shrink-0">
        <span>Rows</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className="rounded border border-slate-400 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 outline-none focus:border-emerald-500"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
          <option value={-1}>All</option>
        </select>
      </div>

      {/* Count */}
      <div className="shrink-0">
        {startItem}-{endItem} of {totalItems}
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onPageChange?.(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          className="rounded border border-slate-400 bg-white px-3 py-0.5 text-[10px] font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        <span>Page</span>

        <select
          value={safeCurrentPage}
          onChange={(e) => onPageChange?.(Number(e.target.value))}
          className="rounded border border-slate-400 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 outline-none focus:border-emerald-500"
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>

        <span>of {totalPages}</span>

        <button
          type="button"
          onClick={() => onPageChange?.(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= totalPages}
          className="rounded border border-slate-400 bg-white px-3 py-0.5 text-[10px] font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;