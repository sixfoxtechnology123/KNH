import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Save, 
  RotateCcw, 
  Loader2, 
  Lock,
  User,
  Check,
  ArrowLeft,
  List
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../api/api";
import {
  masterPrimaryButton,
  masterAccentButton,
  masterInputLabel,
  masterInput,
} from "../GlobalComponent/masterPageStyles";

const AdminController = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const adminPermissions = currentUser.permissions?.admin_controller || {};
  const isAdmin = currentUser.role === "Admin";
  const canAdd = isAdmin || adminPermissions.add;
  const canEdit = isAdmin || adminPermissions.edit;
  const canDelete = isAdmin || adminPermissions.delete;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [viewMode, setViewMode] = useState(false); // Default to form view

  // Only Patients Registration & Patients Billing modules
  const availableMenus = [
    { key: "patients_registration", label: "Patients Registration" },
    { key: "patients_billing", label: "Patients Billing & Invoice" },
    { key: "admin_controller", label: "Admin Controller" },
    { key: "activity_history", label: "Activity History" },
  ];

  const buildDefaultPermissions = () => availableMenus.reduce((acc, menu) => {
    acc[menu.key] = { view: true, add: false, edit: false, delete: false };
    return acc;
  }, {});

  const mergePermissions = (permissions = {}) => {
    const defaults = buildDefaultPermissions();
    Object.keys(permissions).forEach((key) => {
      defaults[key] = { ...defaults[key], ...permissions[key] };
    });
    return defaults;
  };

  const [adminData, setAdminData] = useState({
    name: "",
    userId: "",
    password: "",
    role: "",
    permissions: buildDefaultPermissions()
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/hms/admin/users');
      if (response.data.success) {
        setUsersList(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching admin users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionToggle = (menuKey, actionKey) => {
    setAdminData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [menuKey]: {
          ...prev.permissions[menuKey],
          [actionKey]: !prev.permissions[menuKey][actionKey]
        }
      }
    }));
  };

  const handleSelectAllForMenu = (menuKey, status) => {
    setAdminData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [menuKey]: { view: status, add: status, edit: status, delete: status }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUserId && !canEdit) {
      toast.error("You do not have edit permission.");
      return;
    }
    if (!editingUserId && !canAdd) {
      toast.error("You do not have add permission.");
      return;
    }
    if (!adminData.userId.trim()) {
      toast.error("User ID is required.");
      return;
    }
    if (!editingUserId && !adminData.password.trim()) {
      toast.error("Password is required for new users.");
      return;
    }

    setSaving(true);
    try {
      const payload = { ...adminData };
      let response;

      if (editingUserId) {
        response = await api.put(`/hms/admin/user/update/${editingUserId}`, payload);
      } else {
        response = await api.post('/hms/admin/user/create', payload);
      }

      if (response?.data?.success !== false) {
        toast.success(editingUserId ? "User permissions updated successfully!" : "User created successfully!");
        fetchUsers();
        handleReset();
      } else {
        toast.error(response?.data?.message || "Operation failed.");
      }
    } catch (error) {
      console.error("Save user error:", error);
      toast.error(error.response?.data?.message || "Server communication error.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditUser = (user) => {
    if (!canEdit) {
      toast.error("You do not have edit permission.");
      return;
    }
    setEditingUserId(user._id);
    setAdminData({
      name: user.name || "",
      userId: user.userId || "",
      password: "",
      role: user.role || "",
      permissions: mergePermissions(user.permissions)
    });
    setViewMode(false); // Stay on form view when editing
  };

  const handleDeleteUser = async (id) => {
    if (!canDelete) {
      toast.error("You do not have delete permission.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user profile?")) return;
    try {
      const response = await api.delete(`/hms/admin/user/delete/${id}`);
      if (response?.data?.success !== false) {
        toast.success("User deleted successfully.");
        fetchUsers();
        handleReset();
      }
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("Failed to delete user.");
    }
  };

  const handleReset = () => {
    setEditingUserId(null);
    setAdminData({
      name: "",
      userId: "",
      password: "",
      role: "",
      permissions: buildDefaultPermissions()
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#f0f6fa] flex flex-col font-sans text-xs">
      
      {/* Header Bar */}
      <header className="w-full bg-[#0a2540] text-white px-3 py-2 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-[#00b4d8] text-white rounded-md flex items-center justify-center">
            <ShieldCheck size={16} />
          </div>
          <h1 className="text-xs font-bold tracking-wider">Admin Controller & Role Permissions</h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (viewMode) {
                setViewMode(false);
              } else {
                setViewMode(true);
                fetchUsers();
              }
            }}
            className="inline-flex items-center gap-1 bg-slate-700 text-white px-2.5 py-1 rounded-md text-xs font-semibold hover:bg-slate-600 transition-all cursor-pointer shadow-sm"
          >
            {viewMode ? <ArrowLeft size={13} /> : <List size={13} />} 
            {viewMode ? "Back to Form" : "View Users List"}
          </button>

          <button
            type="button"
            onClick={() => window.location.href = "/dashboard"}
            className={masterAccentButton + " px-2.5 py-1 text-xs cursor-pointer"}
          >
            Home Dashboard
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 p-2.5 flex flex-col gap-3">
        
        {viewMode ? (
          /* USERS LIST DIRECTORY VIEW */
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 space-y-2">
            <div className="bg-[#00b4d8] text-white px-3 py-1.5 rounded-md flex items-center justify-between font-bold text-xs shadow-sm">
              <span>Authorized Users Directory</span>
              <span className="text-[11px] font-normal">Total Profiles: {usersList.length}</span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8 text-slate-500 gap-2">
                <Loader2 className="animate-spin" size={18} /> Loading users...
              </div>
            ) : usersList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No registered controller users found.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-md overflow-x-auto bg-slate-50/50 p-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-200 text-slate-700 text-center text-[11px] font-bold">
                      <th className="p-1.5">Name</th>
                      <th className="p-1.5">User ID</th>
                      <th className="p-1.5">Role</th>
                      <th className="p-1.5 text-center">Modules Configured</th>
                      <th className="p-1.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((usr) => (
                      <tr key={usr._id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-1.5 font-bold text-slate-800">{usr.name || "-"}</td>
                        <td className="p-1.5 text-center font-bold text-sky-700">{usr.userId}</td>
                        <td className="p-1.5 text-center font-semibold text-slate-700">{usr.role || "-"}</td>
                        <td className="p-1.5 text-center text-slate-600">
                          {usr.permissions ? Object.keys(usr.permissions).length : 0} Menus Managed
                        </td>
                        <td className="p-1.5 text-center flex justify-center gap-1.5">
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => handleEditUser(usr)}
                              className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                            >
                              <Edit size={11} /> Edit Access
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(usr._id)}
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
          /* DEFAULT FORM VIEW */
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
            <div className="bg-[#00b4d8] text-white px-3 py-1.5 rounded-md flex items-center justify-between font-bold text-xs shadow-sm mb-3">
              <span>{editingUserId ? "Edit User Access & Permissions" : "Register New User & Assign Permissions"}</span>
              {editingUserId && (
                <button type="button" onClick={handleReset} className="underline text-white text-[11px] cursor-pointer">
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Credentials & Details Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 bg-slate-50 p-2.5 rounded-md border border-slate-200">
                <div>
                  <label className={masterInputLabel}>Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={adminData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter full name..." 
                    className={masterInput + " py-1 h-7 w-full font-semibold"} 
                  />
                </div>

                <div>
                  <label className={masterInputLabel}>User ID / Username *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="userId" 
                      value={adminData.userId} 
                      onChange={handleInputChange} 
                      placeholder="Enter unique login ID..." 
                      required
                      className={masterInput + " py-1 h-7 pl-7 w-full font-semibold"} 
                    />
                    <User className="absolute left-2 top-1.5 text-slate-400 pointer-events-none" size={13} />
                  </div>
                </div>

                <div>
                  <label className={masterInputLabel}>Password {editingUserId && "(Leave blank to keep current)"}</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      value={adminData.password} 
                      onChange={handleInputChange} 
                      placeholder="Enter password..." 
                      required={!editingUserId}
                      className={masterInput + " py-1 h-7 pl-7 pr-7 w-full"} 
                    />
                    <Lock className="absolute left-2 top-1.5 text-slate-400 pointer-events-none" size={13} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1.5 text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={masterInputLabel}>Role (Optional)</label>
                  <input 
                    type="text" 
                    name="role" 
                    value={adminData.role} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Staff, Doctor..." 
                    className={masterInput + " py-1 h-7 w-full font-semibold text-sky-700"} 
                  />
                </div>
              </div>

              {/* Dashboard Menus & Granular Permissions Matrix */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 text-xs px-0.5">Dashboard Menu Permissions Control</label>
                
                <div className="border border-slate-200 rounded-md overflow-hidden bg-slate-50/50">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-200 text-slate-700 text-[11px] font-bold">
                        <th className="p-2">Dashboard Menu / Module</th>
                        <th className="p-2 text-center w-24">View</th>
                        <th className="p-2 text-center w-24">Add / Create</th>
                        <th className="p-2 text-center w-24">Edit</th>
                        <th className="p-2 text-center w-24">Delete</th>
                        <th className="p-2 text-center w-28">Quick Toggle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableMenus.map((menu) => {
                        const perms = adminData.permissions[menu.key] || { view: false, add: false, edit: false, delete: false };
                        const allChecked = perms.view && perms.add && perms.edit && perms.delete;

                        return (
                          <tr key={menu.key} className="bg-white border-b border-slate-100 hover:bg-sky-50/30">
                            <td className="p-2 font-semibold text-slate-800">{menu.label}</td>
                            
                            <td className="p-2 text-center">
                              <input 
                                type="checkbox" 
                                checked={perms.view} 
                                onChange={() => handlePermissionToggle(menu.key, 'view')}
                                className="w-3.5 h-3.5 accent-[#00b4d8] cursor-pointer"
                              />
                            </td>

                            <td className="p-2 text-center">
                              <input 
                                type="checkbox" 
                                checked={perms.add} 
                                onChange={() => handlePermissionToggle(menu.key, 'add')}
                                className="w-3.5 h-3.5 accent-[#00b4d8] cursor-pointer"
                              />
                            </td>

                            <td className="p-2 text-center">
                              <input 
                                type="checkbox" 
                                checked={perms.edit} 
                                onChange={() => handlePermissionToggle(menu.key, 'edit')}
                                className="w-3.5 h-3.5 accent-[#00b4d8] cursor-pointer"
                              />
                            </td>

                            <td className="p-2 text-center">
                              <input 
                                type="checkbox" 
                                checked={perms.delete} 
                                onChange={() => handlePermissionToggle(menu.key, 'delete')}
                                className="w-3.5 h-3.5 accent-rose-500 cursor-pointer"
                              />
                            </td>

                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleSelectAllForMenu(menu.key, !allChecked)}
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                                  allChecked ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {allChecked ? "Revoke All" : "Grant All"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-1">
                <button 
                  type="button" 
                  onClick={handleReset} 
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw size={12} /> Reset
                </button>

                <button 
                  type="submit" 
                  disabled={saving || (editingUserId ? !canEdit : !canAdd)}
                  className={masterPrimaryButton + " inline-flex items-center gap-1.5 py-1.5 px-4 disabled:opacity-50"}
                >
                  {saving ? <Loader2 className="animate-spin" size={13} /> : (editingUserId ? <Check size={13} /> : <Save size={13} />)}
                  {saving ? "Saving..." : (editingUserId ? "Update Permissions" : "Save User & Permissions")}
                </button>
              </div>

            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminController;
