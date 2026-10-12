import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserPlus, 
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
  masterHeaderBar,
  masterListView,
  masterAccentButton,
  masterEditButton,
  masterDeleteButton,
  masterTableHead,
  masterTableData,
  masterHeaderResponsive,
  masterHeaderIconBox,
  masterHeaderTitle,
  masterHeaderActionWrap,
  masterHeaderFlexBtn
} from "../GlobalComponent/masterPageStyles";

const PatientsReg = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const patientPermissions = currentUser.permissions?.patients_registration || {};
  const isAdmin = currentUser.role === "Admin";
  const canAdd = isAdmin || patientPermissions.add;
  const canEdit = isAdmin || patientPermissions.edit;
  const canDelete = isAdmin || patientPermissions.delete;
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState("form"); // "form" or "list"
  const [patientsList, setPatientsList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    prefix: "",
    fullName: "",
    gender: "",
    dob: "",
    age: "",
    mobileNumber: "",
    emergencyContactName: "",
    emergencyNumber: "",
    bloodGroup: "",
    department: "",
    // Patient Address
    villageTown: "",
    postOffice: "",
    policeStation: "",
    district: "",
    stateName: "",
    pinCode: "",
    // Kin Details
    kinName: "",
    kinPhone: "",
    kinRelation: "",
    sameAddress: false,
    kinVillageTown: "",
    kinPostOffice: "",
    kinPoliceStation: "",
    kinDistrict: "",
    kinStateName: "",
    kinPinCode: "",
  });

  // Automatically calculate age based on DOB
  useEffect(() => {
    if (!formData.dob) {
      setFormData((prev) => ({ ...prev, age: "" }));
      return;
    }
    const birthDate = new Date(formData.dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    setFormData((prev) => ({
      ...prev,
      age: calculatedAge >= 0 ? `${calculatedAge} Years` : "",
    }));
  }, [formData.dob]);

  // Fetch patients when switching to list view
  useEffect(() => {
    if (viewMode === "list") {
      fetchPatients();
    }
  }, [viewMode]);

  const fetchPatients = async () => {
    setLoadingList(true);
    try {
      const response = await api.get('/hms/patients/all');
      if (response.data.success) {
        setPatientsList(response.data.data || []);
      }
    } catch (error) {
      console.error("Fetch Patients Error:", error);
      toast.error("Failed to load patient records.");
    } finally {
      setLoadingList(false);
    }
  };

  // Helper function for capitalize-on-space (Title Case for text fields)
  const formatCapitalized = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox" && name === "sameAddress") {
      setFormData((prev) => ({
        ...prev,
        sameAddress: checked,
        kinVillageTown: checked ? prev.villageTown : "",
        kinPostOffice: checked ? prev.postOffice : "",
        kinPoliceStation: checked ? prev.policeStation : "",
        kinDistrict: checked ? prev.district : "",
        kinStateName: checked ? prev.stateName : "",
        kinPinCode: checked ? prev.pinCode : "",
      }));
      return;
    }

    let processedValue = value;

    // Strict number validation for phone numbers and PIN codes
    const numericFields = ["mobileNumber", "emergencyNumber", "pinCode", "kinPhone", "kinPinCode"];
    if (numericFields.includes(name)) {
      processedValue = value.replace(/\D/g, ""); 
    } 
    // Capitalize each word's first letter for text-based name and address fields
    else if (["fullName", "emergencyContactName", "villageTown", "postOffice", "policeStation", "district", "stateName", "kinName", "kinRelation", "kinVillageTown", "kinPostOffice", "kinPoliceStation", "kinDistrict", "kinStateName", "bloodGroup", "department"].includes(name)) {
      processedValue = formatCapitalized(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : processedValue,
    }));
  };

  const handleSaveAndBilling = async (e) => {
    e.preventDefault();
    if (editingId && !canEdit) {
      toast.error("You do not have edit permission.");
      return;
    }
    if (!editingId && !canAdd) {
      toast.error("You do not have add permission.");
      return;
    }
    setSaving(true);

    try {
      let response;
      if (editingId) {
        response = await api.put(`/hms/patients/update/${editingId}`, formData);
      } else {
        response = await api.post('/hms/patients/register', formData);
      }

      if (response.data.success) {
        const savedPatient = response.data.data;
        toast.success(editingId ? `Patient Updated! ID: ${savedPatient.patientId}` : `Patient Registered Successfully! ID: ${savedPatient.patientId}`);
        navigate(`/patients-billing?patientId=${savedPatient._id}`);
      } else {
        toast.error("Operation failed. Please try again.");
      }
    } catch (error) {
      console.error("Patient Save Error:", error);
      toast.error(error.response?.data?.message || "Failed to connect to server.");
    } finally {
      setSaving(false);
    }
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
    setSaving(true);

    try {
      let response;
      if (editingId) {
        response = await api.put(`/hms/patients/update/${editingId}`, formData);
      } else {
        response = await api.post('/hms/patients/register', formData);
      }

      if (response.data.success) {
        const savedPatient = response.data.data;
        toast.success(editingId ? `Patient Updated! ID: ${savedPatient.patientId}` : `Patient Registered Successfully! ID: ${savedPatient.patientId}`);
        handleReset();
       
      } else {
        toast.error("Operation failed. Please try again .");
      }
    } catch (error) {
      console.error("Patient Save Error:", error);
      toast.error(error.response?.data?.message || "Failed to connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (patient) => {
    if (!canEdit) {
      toast.error("You do not have edit permission.");
      return;
    }
    setEditingId(patient._id);
    
    // Format DOB safely for date input field (YYYY-MM-DD)
    let formattedDob = "";
    if (patient.dob) {
      formattedDob = patient.dob.substring(0, 10);
    }

    setFormData({
      prefix: patient.namePrefix || "",
      fullName: patient.fullName || "",
      gender: patient.gender || "",
      dob: formattedDob,
      age: patient.age || "",
      mobileNumber: patient.mobileNumber || "",
      emergencyContactName: patient.emergencyContactName || "",
      emergencyNumber: patient.emergencyNumber || "",
      bloodGroup: patient.bloodGroup || "",
      department: patient.department || "",
      villageTown: patient.villageTown || "",
      postOffice: patient.postOffice || "",
      policeStation: patient.policeStation || "",
      district: patient.district || "",
      stateName: patient.stateName || "",
      pinCode: patient.pinCode || "",
      kinName: patient.kinName || "",
      kinPhone: patient.kinPhone || "",
      kinRelation: patient.kinRelation || "",
      sameAddress: patient.sameAddress || false,
      kinVillageTown: patient.kinVillageTown || "",
      kinPostOffice: patient.kinPostOffice || "",
      kinPoliceStation: patient.kinPoliceStation || "",
      kinDistrict: patient.kinDistrict || "",
      kinStateName: patient.kinStateName || "",
      kinPinCode: patient.kinPinCode || "",
    });

    setViewMode("form");
  };

  const handleDelete = async (id, name) => {
    if (!canDelete) {
      toast.error("You do not have delete permission.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete patient ${name}?`)) return;

    try {
      const response = await api.delete(`/hms/patients/${id}`);
      if (response.data.success) {
        toast.success("Patient record deleted successfully.");
        fetchPatients();
      } else {
        toast.error("Delete failed.");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete patient record.");
    }
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      prefix: "",
      fullName: "",
      gender: "",
      dob: "",
      age: "",
      mobileNumber: "",
      emergencyContactName: "",
      emergencyNumber: "",
      bloodGroup: "",
      department: "",
      villageTown: "",
      postOffice: "",
      policeStation: "",
      district: "",
      stateName: "",
      pinCode: "",
      kinName: "",
      kinPhone: "",
      kinRelation: "",
      sameAddress: false,
      kinVillageTown: "",
      kinPostOffice: "",
      kinPoliceStation: "",
      kinDistrict: "",
      kinStateName: "",
      kinPinCode: "",
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#f0f6fa] flex flex-col font-sans text-xs">
      
    {/* Compact Header Bar with List View & Home Buttons */}
    <header className={masterHeaderResponsive}>
      <div className="flex items-center gap-2">
        <div className={masterHeaderIconBox}>
          <UserPlus size={16} />
        </div>
        <h1 className={masterHeaderTitle}>
          {viewMode === "form" ? (editingId ? "Edit Patient Registration" : "Patient Registration") : "Registered Patients List"}
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
          {viewMode === "form" ? <><List size={14} /> List View</> : <><UserPlus size={14} /> New Registration</>}
        </button>

        <button
          type="button"
          onClick={() => window.location.href = "/dashboard"}
          className={`${masterPrimaryButton} ${masterHeaderFlexBtn}`}
        >
          <Home size={14} /> Home
        </button>
      </div>
    </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 p-2 flex flex-col overflow-visible">
         <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-2.5 space-y-2 w-full">
          
          {viewMode === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-2 text-xs">
              
         {/* SECTION 1: Patient Info */}
          <div className={masterHeading}>
            <div className={masterHeadingBordersection}>
              <UserPlus size={14} /> Patient Info {editingId && `(Editing ID: ${editingId})`}
            </div>

            <div className="p-3 bg-white space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
                
                <div>
                  <label className={masterInputLabel}>Prefix</label>
                  <select name="prefix" value={formData.prefix} onChange={handleChange} className={masterSelect}>
                    <option value="">-Select-</option>
                    <option value="Mr">Mr.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Master">Master</option>
                    <option value="Baby">Baby</option>
                  </select>
                </div>

                <div>
                  <label className={masterInputLabel}>Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter Full Name" className={masterInput} />
                </div>

                <div>
                  <label className={masterInputLabel}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={masterSelect}>
                    <option value="">-- Seletc Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={masterInputLabel}>DOB</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={masterInput} />
                </div>

                <div>
                  <label className={masterInputLabel}>Age</label>
                  <input type="text" name="age" value={formData.age} readOnly placeholder="Auto-Calculated" className={masterInput + " bg-slate-100"} />
                </div>

                <div>
                  <label className={masterInputLabel}>Mobile Number</label>
                  <input type="tel" name="mobileNumber" maxLength={10} value={formData.mobileNumber} onChange={handleChange} placeholder="Enter Mobile Number" className={masterInput} />
                </div>

                <div>
                  <label className={masterInputLabel}>Emergency Contact Name</label>
                  <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} placeholder="Enter Name" className={masterInput} />
                </div>

                <div>
                  <label className={masterInputLabel}>Emergency Number</label>
                  <input type="tel" name="emergencyNumber" maxLength={10} value={formData.emergencyNumber} onChange={handleChange} placeholder="Enter Number" className={masterInput} />
                </div>

                <div>
                  <label className={masterInputLabel}>Blood Group</label>
                  <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g. A+" className={masterInput} />
                </div>

                <div>
                  <label className={masterInputLabel}>Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Enter Department" className={masterInput} />
                </div>
              </div>
            </div>
          </div>

              {/* SECTION 2: Address */}
            <div className={masterHeading}>
            <div className={masterHeadingBordersection}>
                  Address
                </div>

                <div className="p-2 bg-slate-50/50 rounded-b-md">
                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                    <div>
                      <label className={masterInputLabel}>Vill / Town</label>
                      <input type="text" name="villageTown" value={formData.villageTown} onChange={handleChange} placeholder="Enter Village Or Town" className={masterInput} />
                    </div>

                    <div>
                      <label className={masterInputLabel}>PO</label>
                      <input type="text" name="postOffice" value={formData.postOffice} onChange={handleChange} placeholder="Enter Post Office" className={masterInput} />
                    </div>

                    <div>
                      <label className={masterInputLabel}>PS</label>
                      <input type="text" name="policeStation" value={formData.policeStation} onChange={handleChange} placeholder="Enter Police Station" className={masterInput} />
                    </div>

                    <div>
                      <label className={masterInputLabel}>District</label>
                      <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="Enter District" className={masterInput} />
                    </div>

                    <div>
                      <label className={masterInputLabel}>State</label>
                      <input type="text" name="stateName" value={formData.stateName} onChange={handleChange} placeholder="Enter State" className={masterInput} />
                    </div>

                    <div>
                      <label className={masterInputLabel}>PIN</label>
                      <input type="text" name="pinCode" maxLength={6} value={formData.pinCode} onChange={handleChange} placeholder="Enter PIN Code" className={masterInput} />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Kin Details */}
              <div className={masterHeading}>
                <div className={masterHeadingBordersection}>
                  Kin Details
                </div>

                <div className="p-2 bg-slate-50/50 rounded-b-md space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className={masterInputLabel}>Kin Name</label>
                      <input type="text" name="kinName" value={formData.kinName} onChange={handleChange} placeholder="Enter Kin Name" className={masterInput} />
                    </div>

                    <div>
                      <label className={masterInputLabel}>Kin Phone Number</label>
                      <input type="tel" name="kinPhone" maxLength={10} value={formData.kinPhone} onChange={handleChange} placeholder="10-Digit Mobile" className={masterInput} />
                    </div>

                    <div>
                      <label className={masterInputLabel}>Relation with Patient</label>
                      <input type="text" name="kinRelation" value={formData.kinRelation} onChange={handleChange} placeholder="E.G. Father, Spouse" className={masterInput} />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input 
                      type="checkbox" 
                      id="sameAddress" 
                      name="sameAddress" 
                      checked={formData.sameAddress} 
                      onChange={handleChange} 
                      className="h-3.5 w-3.5 rounded border-slate-300 text-[#00b4d8] focus:ring-[#00b4d8] cursor-pointer" 
                    />
                    <label htmlFor="sameAddress" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      Same Address as Patient Address
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                    <div>
                      <label className={masterInputLabel}>Kin Vill / Town</label>
                      <input type="text" name="kinVillageTown" value={formData.kinVillageTown} onChange={handleChange} placeholder="Enter Village Or Town" className={masterInput} />
                    </div>

                    <div>
                      <label className={masterInputLabel}>Kin PO</label>
                      <input type="text" name="kinPostOffice" value={formData.kinPostOffice} onChange={handleChange} placeholder="Enter Post Office" className={masterInput} />
                    </div>

                    <div>
                      <label className={masterInputLabel}>Kin PS</label>
                      <input type="text" name="kinPoliceStation" value={formData.kinPoliceStation} onChange={handleChange} placeholder="Enter Police Station" className={masterInput} />
                    </div>

                    <div>
                      <label className={masterInputLabel}>Kin District</label>
                      <input type="text" name="kinDistrict" value={formData.kinDistrict} onChange={handleChange} placeholder="Enter District" className={masterInput} />
                    </div>

                    <div>
                      <label className={masterInputLabel}>Kin State</label>
                      <input type="text" name="kinStateName" value={formData.kinStateName} onChange={handleChange} placeholder="Enter State" className={masterInput} />
                    </div>

                    <div>
                      <label className={masterInputLabel}>Kin PIN</label>
                      <input type="text" name="kinPinCode" maxLength={6} value={formData.kinPinCode} onChange={handleChange} placeholder="Enter PIN Code" className={masterInput} />
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
              {saving ? "Saving..." : (editingId ? "Update Patient" : "Save Registration")}
            </button>

            <button 
              type="button" 
              onClick={handleSaveAndBilling}
              disabled={saving || (editingId ? !canEdit : !canAdd)}
              className={`${masterAccentButton} w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg disabled:opacity-50 shadow-sm`}
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {saving ? "Saving..." : "Save & Go to Billing"}
            </button>
          </div>

            </form>
          ) : (
            /* PATIENT LIST VIEW TABLE */
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="font-bold text-slate-700 text-sm">All Registered Patients ({patientsList.length})</h2>
              </div>

              {loadingList ? (
                <div className="py-12 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Loading patient records...
                </div>
              ) : patientsList.length > 0 ? (
                <div className="overflow-x-auto w-full border border-slate-200 rounded-md">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className={masterTableHead}>
                        <th className={masterTableData}>Patient ID</th>
                        <th className={masterTableData}>Full Name</th>
                        <th className={masterTableData}>Gender</th>
                        <th className={masterTableData}>Mobile</th>
                        <th className={masterTableData}>Department</th>
                        
                        <th className={masterTableData}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {patientsList.map((patient) => (
                        <tr key={patient._id} >
                          <td className={masterTableCell}>{patient.patientId}</td>
                          <td className={masterTableCell}>{patient.namePrefix} {patient.fullName}</td>
                          <td className={masterTableCell}>{patient.gender || '-'}</td>
                          <td className={masterTableCell}>{patient.mobileNumber || '-'}</td>
                          <td className={masterTableCell}>{patient.department || '-'}</td>
                           
                          <td className="p-1 text-center">
                            <div className="inline-flex items-center gap-2">
                              {canEdit && (
                                <button
                                  type="button"
                                  onClick={() => handleEdit(patient)}
                                  className={masterEditButton}
                                >
                                  <Edit size={12} /> Edit
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(patient._id, patient.fullName)}
                                  className={masterDeleteButton}
                                >
                                  <Trash2 size={12} /> Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 font-semibold">
                  No registered patients found. Click "New Registration" to add one.
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default PatientsReg;
