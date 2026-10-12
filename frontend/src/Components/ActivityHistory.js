import React, { useEffect, useState, useMemo } from "react";
import SearchBar from "../GlobalComponent/SearchBar";
import { Activity, Home, Loader2, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../api/api";



import {
  masterPrimaryButton,
  masterAccentButton,
  masterInputLabel,
  masterInput,
  masterHeaderResponsive,
  masterHeaderIconBox,
  masterHeaderTitle,
  masterHeaderActionWrap,
  masterHeaderFlexBtn,
 masterAddRow,
  masterSelect,
  masterTableCell,
  masterHeading,
  masterHeadingBordersection,
  masterHeaderBar,
  masterListView,
 
  masterEditButton,
  masterDeleteButton,
  masterTableHead,
  masterTableData,
 
 
} from "../GlobalComponent/masterPageStyles";
  
const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const ActivityHistory = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await api.get("/hms/activity-history/all");
      if (response.data.success) {
        setActivities(response.data.data || []);
      }
    } catch (error) {
      console.error("Activity history error:", error);
      toast.error(error.response?.data?.message || "Failed to load activity history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);


  const filteredActivities = useMemo(() => {
    const sorted = [...activities].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    const q = searchTerm.trim().toLowerCase();
    if (!q) return sorted;

    return sorted.filter((item) => {
      const username = (item.username || item.userId || item.name || "").toLowerCase();
      const moduleName = (item.module || "").toLowerCase();
      return (
        username.includes(q) ||
        moduleName.includes(q)
      );
    });
  }, [activities, searchTerm]);

  const paginatedActivities = useMemo(() => {
    const numPageSize = Number(pageSize) || 18;
    const numCurrentPage = Number(currentPage) || 1;
    if (numPageSize === -1) return filteredActivities;
    const start = (numCurrentPage - 1) * numPageSize;
    return filteredActivities.slice(start, start + numPageSize);
  }, [filteredActivities, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);


  return (
    <div className="w-full min-h-screen bg-[#f0f6fa] flex flex-col font-sans text-xs">
      <header className="w-full bg-[#0a2540] text-white px-3 py-2 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-[#00b4d8] text-white rounded-md flex items-center justify-center">
            <Activity size={16} />
          </div>
          <h1 className="text-xs font-bold tracking-wider">Activity History</h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={fetchActivities}
            disabled={loading}
            className="inline-flex items-center gap-1 bg-slate-700 text-white px-2.5 py-1 rounded-md text-xs font-semibold hover:bg-slate-600 transition-all cursor-pointer shadow-sm disabled:opacity-60"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCcw size={13} />}
            Refresh
          </button>

          <button
            type="button"
            onClick={() => window.location.href = "/dashboard"}
            className="inline-flex items-center gap-1.5 bg-[#00b4d8] text-white px-2.5 py-1 rounded-md text-xs font-semibold hover:bg-[#0096c7] transition-all cursor-pointer shadow-sm"
          >
            <Home size={13} /> Home
          </button>
        </div>
      </header>

      <main className="w-full flex-1 p-2.5">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 space-y-2">
          <div className="border-b border-slate-200 pb-2">
            <SearchBar 
              value={searchTerm} 
              onChange={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }} 
              placeholder="Search by username, module, action or description..." 
              totalItems={filteredActivities.length} 
              currentPage={currentPage} 
              pageSize={pageSize} 
              onPageChange={setCurrentPage} 
              onPageSizeChange={setPageSize} 
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12 text-slate-500 gap-2">
              <Loader2 className="animate-spin" size={18} /> Loading activity...
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-semibold">
              No activity found.
            </div>
          ) : (
            <div className="overflow-x-auto w-full border border-slate-200 rounded-md">
                 <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className={masterTableHead}>
                    <th className={masterTableData}>Sl</th>
                    <th className={masterTableData}>Date & Time</th>
                    <th className={masterTableData}>User</th>
                    <th className={masterTableData}>Module</th>
                    <th className={masterTableData}>Action</th>
                    <th className={masterTableData}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedActivities.map((item, index) => (
                    <tr key={item._id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                      <td className={masterTableCell}>{index + 1}</td>
                      <td className={masterTableCell}>{formatDateTime(item.createdAt)}</td>
                      <td className={`{masterTableCell} font-bold text-sky-700`}>{item.username || "-"}</td>
                      <td className={`{masterTableCell} font-semibold text-slate-700`}>{item.module || "-"}</td>
                      <td className={masterTableCell}>
                        <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                          {item.action || "-"}
                        </span>
                      </td>
                      <td className={masterTableCell}>{item.description || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ActivityHistory;
