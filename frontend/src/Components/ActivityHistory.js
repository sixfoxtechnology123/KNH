import React, { useEffect, useState } from "react";
import { Activity, Home, Loader2, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../api/api";

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
          <div className="bg-[#00b4d8] text-white px-3 py-1.5 rounded-md flex items-center justify-between font-bold text-xs shadow-sm">
            <span>All User Activity</span>
            <span className="text-[11px] font-normal">Total Records: {activities.length}</span>
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
            <div className="border border-slate-200 rounded-md overflow-x-auto bg-slate-50/50 p-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-200 text-slate-700 text-center text-[11px] font-bold">
                    <th className="p-1.5">Date & Time</th>
                    <th className="p-1.5">User</th>
                    <th className="p-1.5">Module</th>
                    <th className="p-1.5">Action</th>
                    <th className="p-1.5 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((item) => (
                    <tr key={item._id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-1.5 text-center whitespace-nowrap text-slate-600">{formatDateTime(item.createdAt)}</td>
                      <td className="p-1.5 text-center font-bold text-sky-700">{item.username || "-"}</td>
                      <td className="p-1.5 text-center font-semibold text-slate-700">{item.module || "-"}</td>
                      <td className="p-1.5 text-center">
                        <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                          {item.action || "-"}
                        </span>
                      </td>
                      <td className="p-1.5 text-slate-700">{item.description || "-"}</td>
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
