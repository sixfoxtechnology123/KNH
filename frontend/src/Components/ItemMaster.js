import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from '../GlobalComponent/SearchBar';
import { 
  PackagePlus, 
  Home, 
  Save, 
  RotateCcw,
  Loader2,
  List,
  Edit,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../api/api";

import {
  masterPrimaryButton,
  masterInputLabel,
  masterInput,
  masterSelect,
  masterTableCell,
  masterHeading,
  masterHeadingBordersection,
  masterTableHead,
  masterTableData,
  masterHeaderResponsive,
  masterHeaderIconBox,
  masterHeaderTitle,
  masterHeaderActionWrap,
  masterHeaderFlexBtn,
  masterAccentButton,
  masterEditButton,
  masterDeleteButton
} from "../GlobalComponent/masterPageStyles";

const ItemMaster = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const itemPermissions = currentUser.permissions?.item_master || {};
  const isAdmin = currentUser.role === "Admin";
  const canAdd = isAdmin || itemPermissions.add;
  const canEdit = isAdmin || itemPermissions.edit;
  const canDelete = isAdmin || itemPermissions.delete;
  
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState("form"); // "form" or "list"
  const [itemsList, setItemsList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const showActions = canEdit || canDelete;

  const [formData, setFormData] = useState({
    itemName: "",
    rate: "",
    status: "Active",
  });

  // Fetch items list when switching to list view
  useEffect(() => {
    if (viewMode === "list") {
      fetchItems();
    }
  }, [viewMode]);

  const fetchItems = async () => {
    setLoadingList(true);
    try {
      const response = await api.get('/hms/items/all');
      if (response.data.success) {
        setItemsList(response.data.data || []);
      }
    } catch (error) {
      console.error("Fetch Items Error:", error);
      toast.error("Failed to load item records.");
    } finally {
      setLoadingList(false);
    }
  };

  const formatCapitalized = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "itemName") {
      processedValue = formatCapitalized(value);
    } else if (name === "rate") {
      processedValue = value.replace(/[^0-9.]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId && !canEdit) {
      toast.error("You do not have edit permission.");
      return;
    }
    if (!editingId && !canAdd) {
      toast.error("You do not have add permission.");
      return;
    }
    if (!formData.itemName.trim()) {
      toast.error("Please enter a valid Item Name.");
      return;
    }
    if (!formData.rate || Number(formData.rate) <= 0) {
      toast.error("Please enter a valid rate.");
      return;
    }

    setSaving(true);

    try {
      let response;
      if (editingId) {
        response = await api.put(`/hms/items/update/${editingId}`, formData);
      } else {
        response = await api.post('/hms/items/register', formData);
      }

      if (response.data.success) {
        const savedItem = response.data.data;
        toast.success(editingId ? `Item Updated! ID: ${savedItem.itemId}` : `Item Saved Successfully! ID: ${savedItem.itemId}`);
        handleReset();
      } else {
        toast.error("Operation failed. Please try again.");
      }
    } catch (error) {
      console.error("Item Save Error:", error);
      toast.error(error.response?.data?.message || "Failed to connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    if (!canEdit) {
      toast.error("You do not have edit permission.");
      return;
    }
    setEditingId(item._id);
    setFormData({
      itemName: item.itemName || "",
      rate: item.rate || "",
      status: item.status || "Active",
    });
    setViewMode("form");
  };

  const handleDelete = async (id, name) => {
    if (!canDelete) {
      toast.error("You do not have delete permission.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete item ${name}?`)) return;

    try {
      const response = await api.delete(`/hms/items/${id}`);
      if (response.data.success) {
        toast.success("Item deleted successfully.");
        fetchItems();
      } else {
        toast.error("Delete failed.");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete item record.");
    }
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      itemName: "",
      rate: "",
      status: "Active",
    });
  };

  const filteredData = useMemo(() => {
    const sortedList = [...itemsList].sort((a, b) => {
      const idA = String(a.itemId || a._id || '');
      const idB = String(b.itemId || b._id || '');
      return idB.localeCompare(idA, undefined, { numeric: true, sensitivity: 'base' });
    });

    const q = searchTerm.trim();
    if (!q) return sortedList;

    return sortedList.filter((item) => {
      const itemName = (item.itemName || '');
      const itemId = (item.itemId || '');
      return itemName.includes(q) || itemId.includes(q);
    });
  }, [itemsList, searchTerm]);

  const paginatedData = useMemo(() => {
    if (pageSize === -1) return filteredData;
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  return (
    <div className="w-full min-h-screen bg-[#f0f6fa] flex flex-col font-sans text-xs">
      {/* Header Bar */}
      <header className={masterHeaderResponsive}>
        <div className="flex items-center gap-2">
          <div className={masterHeaderIconBox}>
            <PackagePlus size={16} />
          </div> 
          <h1 className={masterHeaderTitle}>
            {viewMode === "form" ? (editingId ? "Edit Item Master" : "Item Master Registration") : "Item Master List"}
          </h1>
        </div>

        <div className={masterHeaderActionWrap}>
          <button
            type="button"
            onClick={() => {
              if (viewMode === "form") {
                setViewMode("list");
              } else {
                handleReset();
                setViewMode("form");
              }
            }}
            className={`${masterAccentButton} ${masterHeaderFlexBtn}`}
          >
            {viewMode === "form" ? <><List size={14} /> List View</> : <><PackagePlus size={14} /> New Item</>}
          </button>

          {/* <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className={`${masterPrimaryButton} ${masterHeaderFlexBtn}`}
          >
            <Home size={14} /> Home
          </button> */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 p-2 flex flex-col overflow-visible">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-2.5 space-y-2 w-full">
          
          {viewMode === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-2 text-xs">
              <div className={masterHeading}>
                <div className={masterHeadingBordersection}>
                  <PackagePlus size={14} /> Item Details {editingId && `(Editing ID: ${editingId})`}
                </div>

                <div className="p-3 bg-white space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                    
                    <div>
                      <label className={masterInputLabel}>Item Name</label>
                      <input 
                        type="text" 
                        name="itemName" 
                        value={formData.itemName} 
                        onChange={handleChange} 
                        placeholder="Enter Item Name" 
                        className={masterInput} 
                      />
                    </div>

                    <div>
                      <label className={masterInputLabel}>Rate</label>
                      <input 
                        type="text" 
                        name="rate" 
                        value={formData.rate} 
                        onChange={handleChange} 
                        placeholder="Enter Rate" 
                        className={masterInput} 
                      />
                    </div>

                    <div>
                      <label className={masterInputLabel}>Status</label>
                      <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                        className={masterSelect}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 w-full">
                <button 
                  type="button" 
                  onClick={handleReset} 
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-[#a7d4f4] hover:bg-[#95c5ec] transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw size={13} /> {editingId ? "Cancel Edit" : "Reset"}
                </button>

                <button 
                  type="submit" 
                  disabled={saving || (editingId ? !canEdit : !canAdd)}
                  className={`${masterPrimaryButton} w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg disabled:opacity-50 shadow-sm`}
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} 
                  {saving ? "Saving..." : (editingId ? "Update Item" : "Save Item")}
                </button>
              </div>

            </form>
          ) : (
            /* ITEM LIST VIEW TABLE */
            <div className="space-y-3">
              <div className="border-b border-slate-200 flex-shrink-0 p-2 sm:p-2 overflow-x-auto">
                <div className="min-w-[280px]">
                  <SearchBar 
                    value={searchTerm} 
                    onChange={(val) => {
                      setSearchTerm(val);
                      setCurrentPage(1);
                    }} 
                    placeholder="Search by item name or ID..." 
                    totalItems={filteredData.length} 
                    currentPage={currentPage} 
                    pageSize={pageSize} 
                    onPageChange={setCurrentPage} 
                    onPageSizeChange={setPageSize} 
                  />
                </div>
              </div>

              {loadingList ? (
                <div className="py-12 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Loading item records...
                </div>
              ) : itemsList.length > 0 ? (
                <div className="overflow-x-auto w-full border border-slate-200 rounded-md">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className={masterTableHead}>
                        <th className={masterTableData}>Sl</th>
                       
                        <th className={masterTableData}>Item Name</th>
                        <th className={masterTableData}>Rate</th>
                        <th className={masterTableData}>Status</th>
                        {showActions && (
                          <th className={masterTableData}>Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {paginatedData.map((item, index) => (
                        <tr key={item._id}>
                          <td className={masterTableCell}>{(currentPage - 1) * pageSize + index + 1}</td>
                          
                          <td className={masterTableCell}>{item.itemName}</td>
                          <td className={masterTableCell}>{item.rate}</td>
                          <td className={masterTableCell}>
                            <span className={`px-2 py-0.5 rounded-full font-semibold ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {item.status || 'Active'}
                            </span>
                          </td>
                          {showActions && (
                            <td className="p-1 text-center">
                              <div className="inline-flex items-center gap-2">
                                {canEdit && (
                                  <button
                                    type="button"
                                    onClick={() => handleEdit(item)}
                                    className={masterEditButton}
                                  >
                                    <Edit size={12} /> Edit
                                  </button>
                                )}
                                {canDelete && (
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(item._id, item.itemName)}
                                    className={masterDeleteButton}
                                  >
                                    <Trash2 size={12} /> Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 font-semibold">
                  No items found. Click "New Item" to add one.
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ItemMaster;