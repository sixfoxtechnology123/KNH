import React, { useState, useEffect, useRef,useMemo } from "react";
import SearchBar from '../GlobalComponent/SearchBar';
import ItemMaster from "./ItemMaster"; 
import { useSearchParams } from "react-router-dom";
import { 
  FileText, 
  Home, 
  Eye, 
  Save, 
  Printer, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Loader2,
  Search,
  ArrowLeft,
  Edit,
  Check,
  RefreshCw
} from "lucide-react";
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


const formatDateToDMY = (dateStr) => {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    // If format is YYYY-MM-DD
    if (parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return dateStr;
};

const PatientsBilling = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const billingPermissions = currentUser.permissions?.patients_billing || {};
  const [billSearchTerm, setBillSearchTerm] = useState("");
  const [currentBillPage, setCurrentBillPage] = useState(1);
  const [billPageSize, setBillPageSize] = useState(10);
  const isAdmin = currentUser.role === "Admin";
  const canAdd = isAdmin || billingPermissions.add;
  const canEdit = isAdmin || billingPermissions.edit;
  const canDelete = isAdmin || billingPermissions.delete;
  const [saving, setSaving] = useState(false);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // View Bill Table States
  const [viewMode, setViewMode] = useState(false);
  const [savedBills, setSavedBills] = useState([]);
  const [loadingBills, setLoadingBills] = useState(false);
  const [editingBillId, setEditingBillId] = useState(null);
  const [printingInvoice, setPrintingInvoice] = useState(null);
  const [searchParams] = useSearchParams();
  const [activeMasterItems, setActiveMasterItems] = useState([]);
  const [showItemMasterModal, setShowItemMasterModal] = useState(false);
  const urlPatientId = searchParams.get("patientId");

  const searchRef = useRef(null);


const fetchActiveMasterItems = async () => {
    try {
      const res = await api.get('/hms/items/all');
      if (res.data.success) {
        const activeList = (res.data.data || []).filter(i => i.status === 'Active');
        setActiveMasterItems(activeList);

        // Automatically populate all active master items as rows with default unit = 1 and unchecked by default
        const initialTableItems = activeList.map((masterItem, idx) => ({
          id: masterItem._id || idx,
          description: masterItem.itemId, // Stores Item ID (e.g. ITEM-1) in database
          itemName: masterItem.itemName,
          rate: masterItem.rate,
          unit: 1,
          amount: masterItem.rate * 1,
          isChecked: false,
        }));
        setItems(initialTableItems);
      }
    } catch (err) {
      console.error("Error fetching active items", err);
      toast.error("Failed to load master items.");
    }
  };

  useEffect(() => {
    fetchActiveMasterItems();
  }, []);

  useEffect(() => {
    if (urlPatientId && patients.length > 0) {
      const foundPatient = patients.find(p => p._id === urlPatientId);
      if (foundPatient) {
        handleSelectPatient(foundPatient);
      }
    }
  }, [urlPatientId, patients]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getCurrentISTDate = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const parts = formatter.formatToParts(now);
    const dateObj = {};
    parts.forEach(({ type, value }) => {
      dateObj[type] = value;
    });

    return `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
  };

  const [billingData, setBillingData] = useState({
    patientId: "",
    patientMongoId: "",
    fullName: "",
    mobileNumber: "",
    gender: "",
    regNo: "",
    age: "",
    drName: "",
    address: "",
    admissionDate: "",
    dischargeDate: "",
    billDate: getCurrentISTDate(),
    cabinNo: "",
    wardNo: "",
    discount: "",
    advanced: "",
    returnAmount: "",
  });

  const [items, setItems] = useState([
    { id: 1, description: "", rate: "", unit: "", amount: "" }
  ]);

  useEffect(() => {
    fetchPatients();
  }, []);

  

  const fetchPatients = async () => {
    try {
      const response = await api.get('/hms/patients/all');
      if (response.data.success) {
        setPatients(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to load patient directory.");
    }
  };

  const fetchSavedBills = async () => {
    setLoadingBills(true);
    try {
      const response = await api.get('/hms/billing/all');
      if (response.data.success) {
        setSavedBills(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching saved bills:", error);
      toast.error("Failed to load bills table.");
    } finally {
      setLoadingBills(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
    } else {
      const term = searchTerm;
      const results = patients.filter(p => 
        (p.fullName && p.fullName.includes(term)) ||
        (p.patientId && p.patientId.includes(term)) ||
        (p.mobileNumber && p.mobileNumber.includes(term))
      );
      setFilteredPatients(results);
    }
  }, [searchTerm, patients]);

  const handleSelectPatient = (patient) => {
    const vill = patient.villageTown || patient.villTown || "";
    const po = patient.postOffice || patient.po || "";
    const ps = patient.policeStation || patient.ps || "";
    const dist = patient.district || "";
    const state = patient.stateName || patient.state || "";
    const pin = patient.pinCode || patient.pin || "";

    const fullAddress = [vill, po, ps, dist, state, pin].filter(Boolean).join(", ");
    const formattedName = `${patient.namePrefix || ""} ${patient.fullName || ""}`.trim();

    setBillingData(prev => ({
      ...prev,
      patientId: patient.patientId || "",
      patientMongoId: patient._id || "",
      fullName: formattedName,
      mobileNumber: patient.mobileNumber || "",
      gender: patient.gender || "",
      age: patient.age || "",
      address: fullAddress || "",
    }));

    setSearchTerm(formattedName);
    setShowDropdown(false);
  };

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    if (["discount", "advanced", "returnAmount"].includes(name) && value !== "" && parseFloat(value) < 0) {
      return;
    }
    setBillingData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id, field, value) => {
    if ((field === "rate" || field === "unit") && value !== "" && parseFloat(value) < 0) {
      return;
    }

    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id || item._id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "rate" || field === "unit") {
            const rate = parseFloat(field === "rate" ? value : item.rate) || 0;
            const unit = parseFloat(field === "unit" ? value : item.unit) || 0;
            updatedItem.amount = (value === "" && (field === "rate" ? item.rate === "" : item.unit === "")) ? "" : rate * unit;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

const handleAddItem = () => {
  setItems(prev => [
    ...prev, 
    { 
      id: Date.now(), 
      description: "", 
      rate: "", 
      unit: 1, 
      amount: "", 
      isChecked: true, 
      isCustom: true // Marks this as a manually typed item row
    }
  ]);
};

  const handleRemoveItem = (id) => {
    if (items.length === 1) {
      toast.error("At least one billing item is required.", { id: 'avail-qty-err' });
      return;
    }
    setItems(prev => prev.filter(item => item.id !== id));
  };

// Financial Calculations - Only calculate checked items
  const subTotal = items
    .filter(item => item.isChecked)
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const discountVal = parseFloat(billingData.discount) || 0;
  const netAmount = Math.max(0, subTotal - discountVal);
  const advancedVal = parseFloat(billingData.advanced) || 0;
  const returnVal = parseFloat(billingData.returnAmount) || 0;

  let balanceAmount = 0;
  let computedReturnAmount = returnVal;
  if (advancedVal > netAmount) {
    balanceAmount = 0;
    computedReturnAmount = (advancedVal - netAmount) + returnVal;
  } else {
    balanceAmount = netAmount - advancedVal + returnVal;
  }

  const activePrintInv = printingInvoice || {
    ...billingData,
    items,
    subTotal,
    netAmount,
    balanceAmount,
    returnAmount: advancedVal > netAmount ? computedReturnAmount : returnVal
  };

  const handleSubmit = async (e, shouldPrint = false) => {
    if (e) e.preventDefault();
    if (editingBillId && !canEdit) {
      toast.error("You do not have edit permission.", { id: 'avail-qty-err' });
      return;
    }
    if (!editingBillId && !canAdd) {
      toast.error("You do not have add permission.", { id: 'avail-qty-err' });
      return;
    }
    if (!billingData.patientId) {
      toast.error("Please select a valid patient.", { id: 'avail-qty-err' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...billingData,
        discount: billingData.discount === "" ? 0 : discountVal,
        advanced: billingData.advanced === "" ? 0 : advancedVal,
        returnAmount: advancedVal > netAmount ? computedReturnAmount : (billingData.returnAmount === "" ? 0 : returnVal),
        items: items
          .filter(i => i.isChecked)
          .map(i => ({
            ...i,
            rate: i.rate === "" ? 0 : Number(i.rate),
            unit: i.unit === "" ? 1 : Number(i.unit),
            amount: i.amount === "" ? 0 : Number(i.amount)
          })),
        subTotal,
        netAmount,
        balanceAmount,
      };

      let response;
      if (editingBillId) {
        response = await api.put(`/hms/billing/update/${editingBillId}`, payload);
      } else {
        response = await api.post('/hms/billing/create', payload);
      }

      if (response.data.success) {
        const billRef = response.data.data?.billNo || response.data.billNo || 'Generated';
        toast.success(editingBillId ? `Bill updated successfully! (${billRef})` : `Billing saved successfully! Bill ID: ${billRef}`);
        
        if (shouldPrint) {
          setPrintingInvoice({
            ...payload,
            billNo: billRef
          });
          setTimeout(() => {
            window.print();
            setPrintingInvoice(null);
          }, 100);
        }

        handleReset();
      } else {
        toast.error("Failed to save billing record.", { id: 'avail-qty-err' });
      }
    } catch (error) {
      console.error("Billing save error:", error);
      toast.error(error.response?.data?.message || "Server communication error.", { id: 'avail-qty-err' });
    } finally {
      setSaving(false);
    }
  };

  const handleEditBill = (bill) => {
    if (!canEdit) {
      toast.error("You do not have edit permission.");
      return;
    }
    setEditingBillId(bill._id);
    setSearchTerm(bill.fullName || "");
    setBillingData({
      patientId: bill.patientId || "",
      patientMongoId: bill.patientMongoId || "",
      fullName: bill.fullName || "",
      mobileNumber: bill.mobileNumber || "",
      gender: bill.gender || "",
      regNo: bill.regNo || "",
      age: bill.age || "",
      drName: bill.drName || "",
      address: bill.address || "",
      admissionDate: bill.admissionDate || "",
      dischargeDate: bill.dischargeDate || "",
      billDate: bill.billDate || getCurrentISTDate(),
      cabinNo: bill.cabinNo || "",
      wardNo: bill.wardNo || "",
      discount: bill.discount || "",
      advanced: bill.advanced || "",
      returnAmount: bill.returnAmount || "",
    });
setItems(
      bill.items && bill.items.length > 0 
        ? bill.items.map((i, index) => ({ 
            ...i, 
            id: i._id || i.id || Date.now() + index, 
            isChecked: true,
            isCustom: !activeMasterItems.some(m => m.itemId === i.description) 
          })) 
        : [{ id: Date.now(), description: "", rate: "", unit: "", amount: "", isChecked: true, isCustom: true }]
    );
    setViewMode(false);
  };

  const handleDeleteBill = async (id) => {
    if (!canDelete) {
      toast.error("You do not have delete permission.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    try {
      const response = await api.delete(`/hms/billing/delete/${id}`);
      if (response.data.success) {
        toast.success("Bill deleted successfully.");
        fetchSavedBills();
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
      toast.error("Failed to delete bill.");
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setEditingBillId(null);
    setBillingData({
      patientId: "",
      patientMongoId: "",
      fullName: "",
      mobileNumber: "",
      gender: "",
      regNo: "",
      age: "",
      drName: "",
      address: "",
      admissionDate: "",
      dischargeDate: "",
      billDate: getCurrentISTDate(),
      cabinNo: "",
      wardNo: "",
      discount: "",
      advanced: "",
      returnAmount: "",
    });
    setItems([{ id: 1, description: "", rate: "", unit: "", amount: "" }]);
  };

  const filteredBills = useMemo(() => {
    const sorted = [...savedBills].sort((a, b) => {
      const idA = String(a.billNo || a._id || '');
      const idB = String(b.billNo || b._id || '');
      return idB.localeCompare(idA, undefined, { numeric: true, sensitivity: 'base' });
    });

    const q = billSearchTerm.trim();
    if (!q) return sorted;

    return sorted.filter((bill) => {
      const name = (bill.fullName || '');
      const billNo = (bill.billNo || '');
      const phone = (bill.mobileNumber || '');
      return name.includes(q) || billNo.includes(q) || phone.includes(q);
    });
  }, [savedBills, billSearchTerm]);

  const paginatedBills = useMemo(() => {
    const numPageSize = Number(billPageSize) || 18;
    const numCurrentPage = Number(currentBillPage) || 1;
    if (numPageSize === -1) return filteredBills;
    const start = (numCurrentPage - 1) * numPageSize;
    return filteredBills.slice(start, start + numPageSize);
  }, [filteredBills, currentBillPage, billPageSize]);

  useEffect(() => {
    setCurrentBillPage(1);
  }, [billSearchTerm, billPageSize]);

  return (
    <div className="w-full min-h-screen bg-[#f0f6fa] flex flex-col font-sans text-xs">
      
      {/* Print Styling Rules */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-bill-section, #printable-bill-section * {
            visibility: visible;
          }
          #printable-bill-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            padding: 10px;
          }
        }
      `}</style>

      {/* Header Bar */}
<header className={masterHeaderResponsive}>
  <div className="flex items-center gap-2">
    <div className={masterHeaderIconBox}>
            <FileText size={15} />
          </div>
         <h1 className={masterHeaderTitle}>Patient Billing & Invoice</h1>
        </div>

   
        <div className={masterHeaderActionWrap}>
          <button
            type="button"
            onClick={() => setShowItemMasterModal(true)}
            className={`${masterPrimaryButton} ${masterHeaderFlexBtn}`}>
          Item Master
          </button>
          <button
            type="button"
            onClick={() => {
              if (viewMode) {
                setViewMode(false);
              } else {
                setViewMode(true);
                fetchSavedBills();
              }
            }}
           className={`${masterAccentButton} ${masterHeaderFlexBtn}`}
          >
            {viewMode ? <ArrowLeft size={13} /> : <Eye size={13} />} 
            {viewMode ? "Back to Form" : "View Bill"}
          </button>

          <button
            type="button"
            onClick={() => window.location.href = "/dashboard"}
           className={`${masterPrimaryButton} ${masterHeaderFlexBtn}`}
          >
            <Home size={13} /> Home
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 p-2 flex flex-col print:hidden">
       <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-2.5 space-y-2 w-full">
         {viewMode ? (
            /* SAVED BILLS TABLE VIEW */
            <div className="space-y-2">
              <div className="border-b border-slate-200 flex-shrink-0">
                <SearchBar 
                  value={billSearchTerm} 
                  onChange={(val) => {
                    setBillSearchTerm(val);
                    setCurrentBillPage(1);
                  }} 
                  placeholder="Search by bill no, patient name or mobile..." 
                  totalItems={filteredBills.length} 
                  currentPage={currentBillPage} 
                  pageSize={billPageSize} 
                  onPageChange={setCurrentBillPage} 
                  onPageSizeChange={setBillPageSize} 
                />
              </div>

              {loadingBills ? (
                <div className="flex justify-center items-center py-12 text-slate-500 gap-2">
                  <Loader2 className="animate-spin" size={20} /> Loading bills...
                </div>
              ) : filteredBills.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No matching bills found.
                </div>
              ) : (
                 <div className="overflow-x-auto w-full border border-slate-200 rounded-md">
                     <table className="w-full text-center border-collapse">
                        <thead>
                          <tr className={masterTableHead}>
                        <th className={masterTableData}>Sl</th>
                        <th className={masterTableData}>Bill ID</th>
                        <th className={masterTableData}>Date</th>
                        <th className={masterTableData}>Patient Name</th>
                        <th className={masterTableData}>Phone</th>
                        <th className={masterTableData}>Net Amount</th>
                        <th className={masterTableData}>Actions</th>
                      </tr>
                    </thead>
                     <tbody className="divide-y divide-slate-200 text-slate-700">
                      {paginatedBills.map((bill, index) => (
                        <tr key={bill._id} className={masterTableCell}>
                          
                          <td className={masterTableCell}>{index + 1}</td>
                          <td className={masterTableCell}>{bill.billNo}</td>
                          <td className={masterTableCell}>{bill.billDate}</td>
                          <td className={masterTableCell}>{bill.fullName}</td>
                          <td className={masterTableCell}>{bill.mobileNumber || "N/A"}</td>
                          <td className={masterTableCell}>₹ {(bill.netAmount || 0).toFixed(2)}</td>
                          <td className={`{masterTableCell} flex justify-center items-center gap-1.5`}>
                            <button
                              type="button"
                              onClick={() => {
                                setPrintingInvoice(bill);
                                setTimeout(() => {
                                  window.print();
                                  setPrintingInvoice(null);
                                }, 100);
                              }}
                              className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                            >
                              <Printer size={11} /> Print
                            </button>
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() => handleEditBill(bill)}
                                className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                              >
                                <Edit size={11} /> Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => handleDeleteBill(bill._id)}
                                className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded hover:bg-rose-200 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                              >
                                <Trash2 size={11} /> Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* BILLING FORM VIEW */
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-2 text-xs">
              
              {editingBillId && (
                <div className="bg-amber-100 border border-amber-300 text-amber-800 px-3 py-1 rounded flex justify-between items-center text-xs font-semibold">
                  <span>Editing Mode Active (Updating existing bill record)</span>
                  <button type="button" onClick={handleReset} className="underline text-amber-900 cursor-pointer">Cancel Edit</button>
                </div>
              )}

              {/* SECTION 1: Patient Search & Header Details */}
              <div className={masterHeading}>
                  <div className={masterHeadingBordersection}>
                  <Search size={13} /> Patient & Admission Details
                </div>

                <div className="p-2">
                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-1.5 relative">
                    
                    <div className="sm:col-span-1 relative" ref={searchRef}>
                      <label className={masterInputLabel}>Patients Name</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowDropdown(true);
                          }}
                          onFocus={() => setShowDropdown(true)}
                          placeholder="Type name, ID or phone..."
                          className={masterInput + " py-1 h-7 pr-7 w-full"}
                        />
                        <Search className="absolute right-2 top-2 text-slate-400 pointer-events-none" size={13} />
                      </div>

                      {showDropdown && filteredPatients.length > 0 && (
                        <div className="absolute z-50 left-0 mt-1 w-full min-w-[280px] bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredPatients.map(p => (
                            <div 
                              key={p._id}
                              onClick={() => handleSelectPatient(p)}
                              className="px-2.5 py-1.5 hover:bg-sky-50 cursor-pointer border-b border-slate-100 flex justify-between items-center text-[11px]"
                            >
                              <span className="font-bold text-sky-700">{p.patientId}</span>
                              <span className="text-slate-800 font-medium">{p.namePrefix} {p.fullName}</span>
                              <span className="text-slate-500">Ph: {p.mobileNumber}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-1">
                      <label className={masterInputLabel}>Patient ID</label>
                      <input type="text" name="patientId" value={billingData.patientId} readOnly placeholder="Auto" className={masterInput + " py-1 h-7 bg-slate-100 font-bold text-sky-700"} />
                    </div>

                    <div className="sm:col-span-1">
                      <label className={masterInputLabel}>Mobile Number</label>
                      <input type="text" name="mobileNumber" value={billingData.mobileNumber} readOnly placeholder="Mobile No" className={masterInput + " py-1 h-7 bg-slate-100 font-semibold"} />
                    </div>

                    <div className="sm:col-span-1">
                      <label className={masterInputLabel}>Gender</label>
                      <input type="text" name="gender" value={billingData.gender} readOnly placeholder="Auto" className={masterInput + " py-1 h-7 bg-slate-100 font-semibold"} />
                    </div>

                    <div className="sm:col-span-1">
                      <label className={masterInputLabel}>Reg No</label>
                      <input type="text" name="regNo" value={billingData.regNo} onChange={handleHeaderChange} placeholder="Reg No" className={masterInput + " py-1 h-7"} />
                    </div>

                    <div className="sm:col-span-1">
                      <label className={masterInputLabel}>Age</label>
                      <input type="text" name="age" value={billingData.age} readOnly placeholder="Auto" className={masterInput + " py-1 h-7 bg-slate-100"} />
                    </div>

                    <div className="sm:col-span-1">
                      <label className={masterInputLabel}>Dr. Name</label>
                      <input type="text" name="drName" value={billingData.drName} onChange={handleHeaderChange} placeholder="Doctor Name" className={masterInput} />
                    </div>

                    <div className="sm:col-span-1">
                      <label className={masterInputLabel}>Cabin No</label>
                      <input type="text" name="cabinNo" value={billingData.cabinNo} onChange={handleHeaderChange} placeholder="Cabin No" className={masterInput + " py-1 h-7"} />
                    </div>

                    <div className="sm:col-span-1">
                      <label className={masterInputLabel}>Ward No</label>
                      <input type="text" name="wardNo" value={billingData.wardNo} onChange={handleHeaderChange} placeholder="Ward No" className={masterInput + " py-1 h-7"} />
                    </div>

                    <div className="sm:col-span-1">
                    <label className={masterInputLabel}>Admission Date</label>
                    <input 
                      type="date" 
                      name="admissionDate" 
                      value={billingData.admissionDate} 
                      onChange={handleHeaderChange} 
                      max={new Date().toISOString().split("T")[0]} 
                      className={masterInput + " py-1 h-7"} 
                    />
                  </div>

                 <div className="sm:col-span-1">
                    <label className={masterInputLabel}>Discharge Date</label>
                    <input 
                      type="date" 
                      name="dischargeDate" 
                      value={billingData.dischargeDate || new Date().toISOString().split("T")[0]} 
                      onChange={handleHeaderChange} 
                      max={new Date().toISOString().split("T")[0]} 
                      className={masterInput + " py-1 h-7"} 
                    />
                  </div>

                    <div className="sm:col-span-1">
                      <label className={masterInputLabel}>Bill Date</label>
                      <input type="date" name="billDate" value={billingData.billDate} onChange={handleHeaderChange} className={masterInput + " py-1 h-7"} />
                    </div>

                    <div className="sm:col-span-6">
                      <label className={masterInputLabel}>Address</label>
                      <input type="text" name="address" value={billingData.address} readOnly placeholder="Auto-populated Full Address" className={masterInput + " py-1 h-7 bg-slate-100"} />
                    </div>

                  </div>
                </div>
              </div>

          {/* SECTION 2 & 3: Description Section and Financial Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="lg:col-span-2 space-y-1">
               <div className="bg-[#1c5762] text-white px-2.5 py-1 rounded-t-md flex items-center justify-between font-bold text-xs shadow-sm">
                  <span>Billing Services</span>
                  <div className="flex items-center gap-1.5">
                    {/* Refresh Button */}
                    <button
                      type="button"
                      onClick={() => {
                        // Re-triggers the active items fetch function
                        fetchActiveMasterItems(); 
                        toast.success("Items refreshed successfully!");
                      }}
                      title="Refresh Master Items"
                      className="p-1 bg-[#16444d] hover:bg-[#0f3239] text-white rounded transition-colors cursor-pointer inline-flex items-center justify-center"
                    >
                      <RefreshCw size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={handleAddItem}
                      className={masterAddRow}
                    >
                      <Plus size={12} /> Add Item
                    </button>
                  </div>
                </div>

                  <div className="border border-slate-200 rounded-b-md overflow-hidden bg-slate-50/50 p-1.5">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-200 text-slate-700 text-center text-[11px] font-bold">
                          <th className="p-1 w-10">Select</th>
                          <th className="p-1 text-left">Description / Item Name</th>
                          <th className="p-1 w-24">Rate</th>
                          <th className="p-1 w-20">Unit</th>
                          <th className="p-1 w-28">Amount</th>
                          <th className="p-1 w-14 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={item.id} className={`bg-white ${item.isChecked ? 'bg-sky-50/40' : ''}`}>
                            <td className="p-1 text-center">
                              <input 
                                type="checkbox"
                                checked={item.isChecked}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setItems(prev => prev.map(i => i.id === item.id ? { ...i, isChecked: checked } : i));
                                }}
                                className="h-3.5 w-3.5 rounded border-slate-300 text-[#00b4d8] focus:ring-[#00b4d8] cursor-pointer"
                              />
                            </td>
                       <td className="p-1">
                          {item.isCustom || (item.description && !activeMasterItems.some(m => m.itemId === item.description)) ? (
                            <input 
                              type="text" 
                              value={item.description}
                              onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                              placeholder="Type item description manually..."
                              className={masterInput + " py-1 h-6 text-xs"}
                            />
                          ) : item.itemName && activeMasterItems.some(m => m.itemId === item.description) ? (
                            <span className="font-semibold capitalize text-slate-800 text-xs px-1 flex items-center h-6">
                              {item.itemName}
                            </span>
                          ) : (
                            <select 
                              value={item.description}
                              onChange={(e) => {
                                const selectedItem = activeMasterItems.find(i => i.itemId === e.target.value);
                                const rateToSet = selectedItem ? selectedItem.rate : "";
                                const nameToSet = selectedItem ? selectedItem.itemName : "";
                                
                                setItems(prev => prev.map(i => i.id === item.id ? {
                                  ...i,
                                  description: e.target.value,
                                  itemName: nameToSet,
                                  rate: rateToSet,
                                  unit: 1,
                                  amount: rateToSet * 1,
                                  isChecked: true
                                } : i));
                              }}
                              className={masterSelect + " py-1 h-6 text-xs"}
                            >
                              <option value="">-- Select Item from Master --</option>
                              {activeMasterItems.map(masterItem => (
                                <option key={masterItem._id} value={masterItem.itemId}>
                                  {masterItem.itemName} - ₹{masterItem.rate}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                            <td className="p-1">
                              <input 
                                type="number" 
                                min="0"
                                value={item.rate}
                                onChange={(e) => handleItemChange(item.id, "rate", e.target.value)}
                                className={masterInput + " py-1 h-6 text-right text-xs"}
                              />
                            </td>
                            <td className="p-1">
                              <input 
                                type="number" 
                                min="0"
                                value={item.unit}
                                onChange={(e) => handleItemChange(item.id, "unit", e.target.value)}
                                className={masterInput + " py-1 h-6 text-right text-xs"}
                              />
                            </td>
                            <td className="p-1">
                              <input 
                                type="number" 
                                value={item.amount}
                                readOnly
                                className={masterInput + " py-1 h-6 text-right bg-slate-100 font-bold text-xs"}
                              />
                            </td>
                            <td className="p-1 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 bg-rose-100 text-rose-600 rounded hover:bg-rose-200 transition-colors cursor-pointer inline-flex items-center justify-center"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right 1/3: Financial Summary */}
                <div className="lg:col-span-1 space-y-1">
                  <div className="bg-[#1c5762] text-white px-2.5 py-1 rounded-t-md font-bold text-xs shadow-sm">
                    Financial Summary
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-b-md p-2.5 space-y-2">
                    <div className="w-full space-y-1.5 bg-white p-2.5 rounded-md border border-slate-300 shadow-sm">
                      <div className="flex justify-between items-center text-slate-600 font-medium">
                        <span>Sub Total:</span>
                        <span className="font-bold text-slate-800">₹ {subTotal.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Discount (-):</span>
                        <input 
                          type="number" 
                          min="0"
                          name="discount" 
                          value={billingData.discount} 
                          onChange={handleHeaderChange} 
                          className="w-24 px-2 py-0.5 text-right border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#00b4d8]"
                        />
                      </div>

                      <div className="flex justify-between items-center border-t pt-1 font-bold text-sky-700 text-xs">
                        <span>Net Amount:</span>
                        <span>₹ {netAmount.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Advanced Paid (-):</span>
                        <input 
                          type="number" 
                          min="0"
                          name="advanced" 
                          value={billingData.advanced} 
                          onChange={handleHeaderChange} 
                          className="w-24 px-2 py-0.5 text-right border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#00b4d8]"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Return Amount (+):</span>
                        <input 
                          type="number" 
                          min="0"
                          name="returnAmount" 
                          value={advancedVal > netAmount ? ((advancedVal - netAmount) + returnVal) : billingData.returnAmount} 
                          onChange={handleHeaderChange} 
                          className="w-24 px-2 py-0.5 text-right border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#00b4d8]"
                        />
                      </div>

                      <div className={`flex justify-between items-center border-t-2 border-slate-300 pt-1 font-extrabold text-xs ${balanceAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        <span>Balance Due:</span>
                        <span>₹ {balanceAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="text-slate-500 text-[11px] px-1">
                      <p><strong>Total Items Checked:</strong> {items.filter(i => i.isChecked).length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-1">
                <button 
                  type="button" 
                  onClick={handleReset} 
                  disabled={saving}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw size={12} /> Reset
                </button>

                <button 
                  type="button" 
                  onClick={(e) => handleSubmit(e, false)} 
                  disabled={saving || (editingBillId ? !canEdit : !canAdd)}
                  className={masterPrimaryButton + " inline-flex items-center gap-1.5 py-1 px-3 disabled:opacity-50"}
                >
                  {saving ? <Loader2 className="animate-spin" size={12} /> : (editingBillId ? <Check size={12} /> : <Save size={12} />)} 
                  {saving ? "Saving..." : (editingBillId ? "Update Bill" : "Save")}
                </button>

                <button 
                  type="button" 
                  onClick={(e) => handleSubmit(e, true)} 
                  disabled={saving || (editingBillId ? !canEdit : !canAdd)}
                  className={masterAccentButton + " inline-flex items-center gap-1.5 py-1 px-3 disabled:opacity-50"}
                >
                  {saving ? <Loader2 className="animate-spin" size={12} /> : <Printer size={12} />} 
                  {saving ? "Processing..." : "Save & Print Bill"}
                </button>
              </div>

            </form>
          )}

        </div>
      </main>

      {showItemMasterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#f0f6fa] rounded-lg shadow-xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Top Bar */}
            <div className="bg-[#1c5762] text-white px-4 py-2 flex justify-between items-center font-bold text-xs flex-shrink-0">
              <span>Item Master Page Integration</span>
              <button 
                type="button" 
                onClick={() => setShowItemMasterModal(false)}
                className="text-white hover:text-rose-200 text-sm font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Body rendering your existing ItemMaster component */}
            <div className="overflow-y-auto flex-1 p-2">
              <ItemMaster />
            </div>

          </div>
        </div>
      )}
      {/* Hidden Printable Bill Format Container */}
      <div id="printable-bill-section" className="hidden print:block font-sans text-[10px] text-black bg-white p-2 leading-tight">
        {/* Header Section */}
        <div className="text-center  mb-2">
          <h1 className="font-bold text-sm tracking-wide uppercase">Kalyani NURSING HOME</h1>
          <p className="text-[9px] font-semibold">B-8/37, (C.A.), Kalyani, Nadia, * West Bengal * Pin - 741235</p>
          <p className="text-[9px] font-semibold">Contact Us : (033) 2582-8745</p>
          <div className="mt-1 inline-block font-bold  text-[10px]">
            Cash Memo / BILL
          </div>
        </div>

{/* Combined Patient & Bill Details Block in One Single Box */}
        <div className="border border-black p-1.5 mb-2 rounded text-[10px] space-y-0.5 bg-gray-50/50">
          <div className="grid grid-cols-2 gap-x-6">
            
            {/* Left Column */}
            <div className="space-y-0.5">
              <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Bill No</span><span>:</span><span className="font-semibold ">{activePrintInv.billNo || 'Bill-1'}</span>
              </div>
             <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Bill Date</span><span>:</span><span className="font-medium">{formatDateToDMY(activePrintInv.billDate)}</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Print Date & Time</span><span>:</span>
                <span className="font-medium">
                  {(() => {
                    const now = new Date();
                    const day = String(now.getDate()).padStart(2, '0');
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const year = now.getFullYear();
                    const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
                    return `${day}-${month}-${year}, ${time}`;
                  })()}
                </span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Admission Date</span><span>:</span><span className="font-medium">{formatDateToDMY(activePrintInv.admissionDate)}</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Discharge Date</span><span>:</span><span className="font-medium">{formatDateToDMY(activePrintInv.dischargeDate)}</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Doctor Name</span><span>:</span><span className="font-medium">{activePrintInv.drName || '-'}</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Ward No</span><span>:</span><span className="font-medium">{activePrintInv.wardNo || '-'}</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-0.5">
              <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Patient ID</span><span>:</span><span className="font-medium">{activePrintInv.patientId || '-'}</span>
              </div>
               <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Reg No</span><span>:</span><span className="font-medium">{activePrintInv.regNo || '-'}</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Patient Name</span><span>:</span><span className="font-medium">{activePrintInv.fullName || '-'}</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Mobile</span><span>:</span><span className="font-medium">{activePrintInv.mobileNumber || '-'}</span>
              </div>
              <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Gender</span><span>:</span><span className="font-medium">{activePrintInv.gender || '-'}</span>
              </div>
               <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Age</span><span>:</span><span className="font-medium">{activePrintInv.age || '-'}</span>
              </div>
             
              <div className="grid grid-cols-[100px_10px_1fr]">
                <span className="font-semibold">Cabin No</span><span>:</span><span className="font-medium">{activePrintInv.cabinNo || '-'}</span>
              </div>
            </div>

          </div>

          {/* Full Width Address Row */}
          <div className="grid grid-cols-[100px_10px_1fr] pt-0.5">
            <span className="font-semibold">Address</span><span>:</span><span className="font-medium">{activePrintInv.address || '-'}</span>
          </div>
        </div>

     {/* Line Items Table (Outer Border & Vertical Dividers Only) */}
        <table className="w-full rounded border border-black text-[10px] mb-2 text-center">
          <thead>
            <tr className="bg-gray-100 border-b border-black">
              <th className="border-r border-black p-1 w-8 font-bold">Sl</th>
              <th className="border-r border-black p-1 text-left px-2 font-bold">Description of Services / Particulars</th>
              <th className="border-r border-black p-1 w-16 font-bold">Rate</th>
              <th className="border-r border-black p-1 w-12 font-bold">Unit</th>
              <th className="p-1 w-20 font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {activePrintInv.items?.map((item, idx) => (
              <tr key={idx} className="border-b-0">
                <td className="border-r border-black p-1 align-top font-semibold">{idx + 1}</td>
                <td className="border-r border-black p-1 text-left px-2 align-top font-semibold">{item.description || '-'}</td>
                <td className="border-r border-black p-1 align-top font-semibold text-right">{Number(item.rate || 0).toFixed(2)}</td>
                <td className="border-r border-black p-1 align-top font-semibold text-center">{item.unit || 1}</td>
                <td className="p-1 align-top font-semibold text-right">{Number(item.amount || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

    {/* Financial Totals Summary with Aligned Colons */}
        <div className="flex justify-end mb-3 text-[10px]">
          <div className="w-64 border border-black p-1.5 rounded space-y-0.5 bg-gray-50">
            
            <div className="grid grid-cols-[110px_10px_1fr]">
              <span className="font-semibold">Sub Total</span><span>:</span><span className="font-medium text-right">₹ {Number(activePrintInv.subTotal || 0).toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-[110px_10px_1fr]">
              <span className="font-semibold">Discount</span><span>:</span><span className="font-medium text-right">₹ {Number(activePrintInv.discount || 0).toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-[110px_10px_1fr] border-t border-black pt-0.5">
              <span className="font-bold">Net Amount</span><span>:</span><span className="font-semibold text-right">₹ {Number(activePrintInv.netAmount || 0).toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-[110px_10px_1fr]">
              <span className="font-semibold">Advanced Paid</span><span>:</span><span className="font-medium text-right">₹ {Number(activePrintInv.advanced || 0).toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-[110px_10px_1fr]">
              <span className="font-semibold">Return Amount</span><span>:</span><span className="font-medium text-right">₹ {Number(activePrintInv.returnAmount || 0).toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-[110px_10px_1fr] border-t border-black pt-0.5 font-semibold text-[11px]">
              <span>Balance Due</span><span>:</span><span className="font-medium text-right">₹ {Number(activePrintInv.balanceAmount || 0).toFixed(2)}</span>
            </div>

          </div>
        </div>

        {/* Computer Generated Footer */}
      <div className="text-[9px] text-center border-b border-dashed border-black pb-1 italic">
          <p>This is a computer-generated bill and does not require a physical signature.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientsBilling;
