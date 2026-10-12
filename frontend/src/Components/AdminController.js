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
    //{ key: "activity_history", label: "Activity History" },
  ];

  const buildDefaultPermissions = () => availableMenus.reduce((acc, menu) => {
    acc[menu.key] = { view: false, add: false, edit: false, delete: false };
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
    setAdminData(prev => {
      const currentPerms = prev.permissions[menuKey] || { view: false, add: false, edit: false, delete: false };
      
      let updatedMenuPerms = { ...currentPerms };

      if (actionKey === 'view') {
        const newViewStatus = !currentPerms.view;
        updatedMenuPerms.view = newViewStatus;
        // If View is turned off, automatically disable add, edit, and delete
        if (!newViewStatus) {
          updatedMenuPerms.add = false;
          updatedMenuPerms.edit = false;
          updatedMenuPerms.delete = false;
        }
      } else {
        // Toggle the specific action (add, edit, delete)
        updatedMenuPerms[actionKey] = !currentPerms[actionKey];
      }

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [menuKey]: updatedMenuPerms
        }
      };
    });
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
      <header className={masterHeaderResponsive}>
           <div className="flex items-center gap-2">
             <div className={masterHeaderIconBox}>
            <ShieldCheck size={16} />
          </div>
           <h1 className={masterHeaderTitle}>Admin Controller & Role Permissions</h1>
        </div>

            <div className={masterHeaderActionWrap}>
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
           className={`${masterAccentButton} ${masterHeaderFlexBtn}`}
          >
            {viewMode ? <ArrowLeft size={13} /> : <List size={13} />} 
            {viewMode ? "Back to Form" : "View Users List"}
          </button>

          <button
            type="button"
            onClick={() => window.location.href = "/dashboard"}
            className={`${masterPrimaryButton} ${masterHeaderFlexBtn}`}
          >
            Home
          </button>
        </div>
      </header>

      {/* Main Content Area */}
       <main className="w-full flex-1 p-2 flex flex-col overflow-visible">
         <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-2.5 space-y-2 w-full">
        
        {viewMode ? (
          /* USERS LIST DIRECTORY VIEW */
          <div>
           

            {loading ? (
              <div className="flex justify-center items-center py-8 text-slate-500 gap-2">
                <Loader2 className="animate-spin" size={18} /> Loading users...
              </div>
            ) : usersList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No registered controller users found.
              </div>
            ) : (
           <div className="border border-slate-300 rounded-md overflow-x-auto bg-slate-50/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-200 text-slate-700 text-center text-[11px] font-bold">
                  <th className="p-1.5 w-12 text-center border-r border-slate-300">Sl. No.</th>
                  <th className="p-1.5 border-r border-slate-300">Name</th>
                  <th className="p-1.5 border-r border-slate-300">User ID</th>
                  <th className="p-1.5 border-r border-slate-300">Role</th>
                  <th className="p-1.5 text-center border-r border-slate-300">Modules Configured</th>
                  <th className="p-1.5 text-center border-r border-slate-300">Actions</th>
                </tr>
              </thead>
          <tbody>
              {usersList
                .filter((usr) => {
                  // Get the currently logged-in user's ID/username
                  const currentLoggedInUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
                  const loggedInUsername = (currentLoggedInUser.userId || currentLoggedInUser.username || "").toLowerCase();

                  // If the logged-in user is NOT sixfox, hide any row belonging to sixfox
                  if (loggedInUsername !== "sixfox") {
                    const targetUsername = (usr.userId || usr.username || "").toLowerCase();
                    if (targetUsername === "sixfox") return false;
                  }
                  return true;
                })
                .map((usr, index) => (
                  <tr key={usr._id} className="bg-white border-b border-slate-300 hover:bg-slate-50">
                    
                    {/* Serial Number Cell */}
                    <td className="p-1.5 text-center font-semibold border-r border-slate-300 text-slate-600">{index + 1}</td>

                    <td className="p-1.5 font-bold text-slate-800 border-r border-slate-300">{usr.name || "-"}</td>
                    <td className="p-1.5 text-center font-bold text-sky-700 border-r border-slate-300">{usr.userId}</td>
                    <td className="p-1.5 text-center font-semibold text-slate-700 border-r border-slate-300">{usr.role || "-"}</td>

                    <td className="p-1.5 text-center border-r border-slate-300">
                              <div className="flex flex-wrap justify-center gap-1 max-w-xs mx-auto">
                                {usr.permissions?.ALL ? (
                                  <span className="inline-flex items-center bg-cyan-50 text-cyan-800 border border-cyan-200 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                                    ALL
                                  </span>
                                ) : (
                                  usr.permissions && Object.entries(usr.permissions).map(([moduleKey, perms]) => {
                                    if (moduleKey === 'ALL') return null;
                                    const hasAnyPermission = perms && Object.values(perms).some(Boolean);
                                    if (!hasAnyPermission) return null;

                                    const moduleName = moduleKey
                                      .split('_')
                                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                      .join(' ');

                                    return (
                                      <span 
                                        key={moduleKey} 
                                        className="inline-flex items-center bg-cyan-50 text-cyan-800 border border-cyan-200 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                                      >
                                        {moduleName}
                                      </span>
                                    );
                                  })
                                )}
                                {!usr.permissions?.ALL && (!usr.permissions || Object.values(usr.permissions).every(p => !Object.values(p).some(Boolean))) && (
                                  <span className="text-slate-400 italic">No permissions assigned</span>
                                )}
                              </div>
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
           <div className={masterHeading}>
                     <div className={masterHeadingBordersection}>
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
              <div className="space-y-1.5 px-3">
                <label className="font-bold text-slate-700 text-xs">Dashboard Menu Permissions Control</label>
                
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
                              disabled={!perms.view} // <-- Automatically disabled if View is off
                              onChange={() => handlePermissionToggle(menu.key, 'add')}
                              className="w-3.5 h-3.5 accent-[#00b4d8] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                          </td>

                          <td className="p-2 text-center">
                            <input 
                              type="checkbox" 
                              checked={perms.edit} 
                              disabled={!perms.view} // <-- Automatically disabled if View is off
                              onChange={() => handlePermissionToggle(menu.key, 'edit')}
                              className="w-3.5 h-3.5 accent-[#00b4d8] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                          </td>

                          <td className="p-2 text-center">
                            <input 
                              type="checkbox" 
                              checked={perms.delete} 
                              disabled={!perms.view} // <-- Automatically disabled if View is off
                              onChange={() => handlePermissionToggle(menu.key, 'delete')}
                              className="w-3.5 h-3.5 accent-rose-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
              <div className="flex justify-end gap-2 py-2.5 px-2">
                <button 
                  type="button" 
                  onClick={handleReset} 
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-[#a7d4f4] hover:bg-[#95c5ec] transition-all shadow-sm cursor-pointer disabled:opacity-50"
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
</div>
      </main>
    </div>
  );
};

export default AdminController;
