// --- COLOR MAPPING REFERENCE ---
// Primary Brand (Medical Navy): #0a2540
// Accent Cyan: #00a8b5 / #00b4d8
// Page Background (Soft Clinical Light): #f0f6fa
// Off-White/Surface: #ffffff
// Alert Accent: #ff6b6b

export const masterPageShell = 'min-h-screen bg-[#f0f6fa] font-sans text-[11px] text-slate-900';
export const masterPagePadding = 'p-2';
export const masterHeader = 'sticky top-0 z-[15] bg-[#f0f6fa]/95 backdrop-blur-md p-0.5';
export const masterHeaderCard = 'mx-auto flex w-full flex-col gap-2 rounded-xl border-b-2 border-[#00b4d8] bg-white p-1 shadow-sm md:flex-row md:items-center md:justify-between';
export const masterHeaderInfo = 'flex items-center gap-1';
export const masterHeaderIcon = 'rounded-lg bg-[#00b4d8] p-0.5 text-white';
export const masterTitle = 'text-sm font-bold text-slate-900 leading-none';
export const masterTitleSidebar = 'text-sm font-bold text-white leading-none';
export const masterSubtitle = 'text-[10px] text-slate-800 font-semibold';
export const masterPrimaryButton = 'inline-flex items-center gap-2 rounded-md bg-[#0a5865] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#12365a] transition-all cursor-pointer';
export const masterAccentButton = 'inline-flex items-center gap-2 rounded-md bg-[#00b4d8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0096c7] transition-all cursor-pointer';
export const masterAddRow = 'inline-flex items-center gap-2 rounded-md bg-[#00b4d8] px-3 py-1 text-xs font-semibold text-white hover:bg-[#0096c7] transition-all cursor-pointer';
export const masterHeaderBar = "w-full bg-[#345f8d] text-white px-4 py-2.5 flex items-center justify-between shadow-sm shrink-0"
export const masterListView = "inline-flex items-center gap-1.5 bg-[#2ba2b9] text-white px-3 py-1 rounded-md text-xs font-semibold  transition-all cursor-pointer shadow-sm"

// --- NEW HEADER & SECTION STYLES ---
export const masterHeaderResponsive = 'w-full bg-[#356192] text-white px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 shadow-sm shrink-0';
export const masterHeaderIconBox = 'p-1.5 bg-[#09a1c1] text-white rounded-md shrink-0';
export const masterHeaderTitle = 'text-xs sm:text-sm font-bold tracking-wider truncate';
export const masterHeaderActionWrap = 'flex items-center gap-2 w-full sm:w-auto justify-end';
export const masterHeaderFlexBtn = 'flex-1 sm:flex-none justify-center';

// Section Container Shadow & Border styles
export const masterSectionCard = 'rounded-xl border border-[rgba(125,166,172,0.5)] bg-white overflow-hidden shadow-[0_8px_24px_-4px_rgba(28,87,98,0.3)]';
export const masterSectionHeaderBar = 'bg-[#1c5762] text-white px-3.5 py-2 flex items-center gap-1.5 font-bold text-xs';

// --- NEW FORM STYLES FOR PATIENTS REGISTRATION ---
export const masterInputLabel = 'block text-[11px] font-bold text-slate-700 mb-1';
export const masterHeading="rounded-xl border border-[rgba(125,166,172,0.5)] bg-white overflow-hidden shadow-[0_8px_24px_-4px_rgba(28,87,98,0.3)]"
export const masterHeadingBordersection="bg-[#1c5762] text-white px-3.5 py-2 flex items-center gap-1.5 font-bold text-xs"
export const masterInput = ' capitalize w-full rounded-md border border-slate-300 bg-white px-3 py-1  font-medium text-xs text-slate-900 outline-none transition focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15';
export const masterSelect = 'w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-xs text-slate-900 font-medium outline-none transition focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15';
export const masterSectionTitle = 'text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3 tracking-wide uppercase';

export const masterModalInfoBox = "p-2 bg-sky-50 border border-sky-200 rounded text-xs space-y-1";
export const masterModalFieldLabel = "block text-xs font-semibold text-slate-800 mb-1 tracking-wide";
export const masterModalInput = "w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#00b4d8] font-semibold bg-white text-slate-800";
export const masterModalInputDate = "w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#00b4d8] font-mono bg-white text-slate-800";

export const masterPanel = 'mx-auto w-full rounded-xl bg-white shadow-sm';
export const masterPanelPadding = 'px-2 py-1 ';
export const masterPrescriptionHeader = "text-slate-500 block text-[10px] font-bold";
export const masterPrescriptionHeaderValue = "text-slate-700 text-[11px]";

export const masterToolbar = ' px-2 py-1 flex flex-row items-center justify-between gap-2';

export const masterSearchWrap = 'flex items-center flex-1 bg-white border border-slate-300 rounded-lg px-2 py-1 focus-within:border-[#00b4d8] transition-colors w-full shadow-2xs';
export const masterSearchInput = 'flex-1 bg-transparent px-1 text-[11px] font-semibold outline-none w-full text-slate-800';
export const masterTableWrap = 'overflow-x-auto w-full';

export const masterTable = 'w-full text-left border border-slate-200 bg-white';
export const masterTableHead = 'text-[9px] text-slate-700 border-b border-slate-200 font-semibold';
export const masterStickyHeadRow = 'sticky top-0 z-10 bg-[#e6eff7] text-left text-[9px] font-bold tracking-[0.14em] text-slate-700 border-b border-slate-300/80';

export const masterTableRow = 'hover:bg-cyan-50/60 transition-colors bg-white ';
export const masterTableCell = 'px-0.5 text-xs border-r font-semibold border-slate-200 text-center';

export const masterReadOnly = 'w-full border border-slate-200 rounded p-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700';
export const masterValueBox = 'rounded-xl border border-slate-200 bg-white p-0.5';
export const masterMutedValueLabel = 'text-[8px] text-slate-400 font-semibold';
export const masterMutedValue = 'text-base font-bold text-slate-900';
export const masterTableData = 'bg-slate-100 truncate font-semibold text-slate-800 py-1 text-center border-r border-slate-200 text-[11px]';
export const masterTableDatastatus = 'truncate font-semibold text-slate-800 text-center border border-slate-300 text-[11px] px-2 py-1';
export const masterTableID = 'p-0.5 border border-slate-200 text-center text-[#00b4d8] font-semibold text-[11px]';
export const masterTableCellstatus = 'px-0.5 border-r font-semibold border-slate-300 text-center truncate';

export const masterFormContainer = 'mx-auto w-full px-1 py-0.5 rounded-xl space-y-0.5';
export const masterFormSectionHeader = 'text-slate-800 border-b pl-2 rounded-md border-slate-200 text-[13px] flex items-center gap-0.5 font-semibold w-full bg-sky-400/40';
export const masterFormGrid5 = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1';
export const masterFormGrid7 = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-1';
export const masterFormGrid6 = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1';
export const masterFormGrid3 = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1';
export const masterFormGrid4 = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1';
export const masterFormGridRow = 'flex flex-col gap-0.5 w-full';
export const masterFormActionBlock = 'flex justify-end gap-3 w-full';

export const masterTableBody = 'px-1 bg-white';
export const masterSearchIcon = 'text-slate-400 shrink-0';
export const masterBodyArea = 'h-screen w-screen overflow-hidden flex flex-col md:flex-row bg-[#f0f6fa]';
export const masterContentArea = 'flex-1 overflow-y-auto h-full w-full pt-8 bg-[#f0f6fa]';
export const masterTbody = ' bg-white';
export const masterActionButtonsContainer = 'flex justify-center gap-3';

// STATUS BADGES
export const masterActiveColor = 'bg-teal-50 text-teal-700 border border-teal-200 px-1 rounded text-[10px] font-semibold ';
export const masterInactiveColor = 'bg-rose-50 text-rose-600 border border-rose-200 px-1 rounded text-[10px] font-semibold ';

export const masterRadioLabel = "flex items-center gap-1 text-[10px] font-semibold text-slate-700 cursor-pointer";
export const masterCheckboxLabel = "flex items-center gap-1 text-[10px] font-semibold text-slate-700 cursor-pointer";
export const masterRadioInput = "accent-[#00b4d8]";

export const masterActionWrap = "inline-flex items-center justify-center gap-1.5";
export const masterActionBtnView = "inline-flex items-center gap-1 bg-slate-700 text-white px-1.5 py-0.5 rounded text-[11px] font-semibold hover:bg-slate-800 transition-all shadow-sm";
export const masterEditButton = "group inline-flex items-center gap-1 bg-[#00b4d8] text-white p-1 rounded text-[11px] font-semibold hover:bg-[#0096c7] transition-all shadow-sm overflow-hidden";
export const masterDeleteButton = "group inline-flex items-center gap-1 bg-rose-600 text-white p-1 rounded text-[11px] font-semibold hover:bg-rose-700 transition-all shadow-sm overflow-hidden";

export const masterFormGrid6Margin = 'mb-2'; 
export const masterInputTextTransform = ''; 
export const masterFormActionBlockMargin = 'mt-3'; 
export const masterCategoryDropdownTrigger = 'flex items-center justify-between cursor-pointer bg-white h-6 border border-slate-300 rounded px-2 text-[11px] font-semibold text-slate-700 ';
export const masterCategoryDropdownMenu = 'absolute top-full left-0 right-0 z-[110] bg-white border border-slate-300 rounded mt-px shadow-lg max-h-[350px] overflow-y-auto p-1.5';
export const masterCategoryTypeDropdownMenu = 'absolute top-full left-0 right-0 z-[120] bg-white border border-slate-300 rounded mt-px shadow-lg p-1.5 flex flex-col gap-1 w-full';
export const masterCategoryTypeDropdownItem = 'flex items-center gap-2 cursor-pointer p-1 hover:bg-cyan-50 text-[11px] font-semibold text-slate-700';
export const masterCategoryLegendRow = 'flex items-center gap-3 px-2 pb-1.5 mb-1.5 border-b border-slate-100 text-[9px] font-semibold tracking-wider text-slate-500';
export const masterCategoryDropdownEmptyText = 'text-[11px] text-slate-400 text-center py-4 font-semibold tracking-wide';
export const masterFormTreeLabel = 'block mb-px text-[10px] font-semibold text-slate-800';
export const masterPanelLegendRow = 'flex items-center gap-3 px-2 pb-1.5 mb-1.5 border-b border-slate-100 text-[9px] font-semibold tracking-wider text-slate-500';
export const masterTreeSelectionWrapper = 'mt-0.5 relative';

export const masterModalOverlay = "fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-1";
export const masterModalContainer = "bg-white rounded shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden text-xs";
export const masterModalHeader = "bg-[#f0f6fa] p-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3";
export const masterModalBody = "p-2 space-y-2 bg-white";
export const masterModalSection = "bg-white p-2 rounded border border-slate-200 space-y-2";
export const masterModalSectionTitle = "font-semibold text-slate-800 border-b pb-1 text-sm tracking-wide";
export const masterModalFooter = "bg-[#f0f6fa] gap-1 p-1 border-t border-slate-200 flex justify-end";

export const masterSectionHeader = "border-b pb-1 text-[10px] font-bold tracking-[0.12em] text-slate-500";
export const masterHistoryContainer = "py-1 text-center text-[11px] font-semibold text-slate-400";

export const masterModalOpenWardButton = "inline-flex items-center gap-1 bg-[#00b4d8] text-white px-1 py-0.5 rounded text-[11px] font-semibold hover:bg-[#0096c7] transition-all shadow-sm";
export const masterModalTableHeadRow = "bg-[#e6eff7] text-slate-700 font-semibold text-[11px]";
export const masterModalTableTh = "p-2 border border-slate-200";
export const masterModalTableThRight = "p-2 border border-slate-200 text-right";
export const masterModalTableThCenter = "p-2 border border-slate-200 text-center";
export const masterModalTableRow = "hover:bg-cyan-50/50 bg-white";
export const masterModalTableCellBold = "p-2 border border-slate-200 font-semibold ";
export const masterModalTableCellText = "p-2 border border-slate-200";
export const masterModalTableCellRight = "p-2 border border-slate-200 text-right";
export const masterModalTableCellRightBold = "p-2 border border-slate-200 text-right font-semibold text-[#00b4d8]";
export const masterModalTableCellCenter = "p-2 border border-slate-200 text-center";
export const masterModalBadgeCompleted = "px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800";
export const masterModalBadgePending = "px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800";
export const masterModalCloseBtnStyle = "bg-slate-600 text-white px-4 py-1.5 rounded text-xs font-semibold hover:bg-slate-700 transition-all shadow-sm";

// Sidebar Exports
export const mobileHeader = "md:hidden flex items-center justify-between bg-[#0a2540] text-white p-2 h-10";
export const mobileTitle = "text-sm font-bold text-white";
export const sidebarContainer = "fixed inset-y-0 left-0 bg-[#0a2540] text-slate-200 z-50 transform transition-all duration-300 top-10 md:top-0 md:relative md:translate-x-0 flex flex-col border-r border-slate-800 h-screen";
export const sidebarHeader = "hidden md:flex items-center justify-between px-4 py-1 border-b border-slate-800/80 h-8 shrink-0";
export const brandContainer = "flex flex-col";
export const brandTitle = "text-[12px] font-bold text-white tracking-widest";
export const brandSubtitle = "text-[9px] text-cyan-300/80 font-semibold tracking-wider";
export const sidebarToggle = "text-slate-300 p-1 rounded-lg hover:bg-slate-800";
export const navContainer = "flex-1 overflow-y-auto p-1.5 space-y-1";
export const sectionWrapper = "space-y-0.5";
export const sectionHeader = "w-full flex items-center justify-between px-2 text-[10px] font-bold text-slate-400 hover:text-white";
export const divider = "border-b border-slate-800 mx-1";
export const itemsContainer = "space-y-0.5";
export const activeNavItem = "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] font-normal tracking-wide transition-colors bg-sky-900/70 text-sky-300 border-l-2 border-sky-400 shadow-sm";
export const inactiveNavItem = "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] font-normal tracking-wide transition-colors text-slate-300 hover:bg-slate-800/60 hover:text-white";
export const activeIcon = "text-white";
export const inactiveIcon = "text-slate-400";
export const itemLabel = "truncate";
export const footerContainer = "p-2 border-t border-slate-800 shrink-0";
export const dashboardButton = "w-full flex items-center justify-center gap-2 bg-[#00b4d8] text-white text-[10px] font-bold py-2 rounded-lg transition tracking-wider shadow-sm hover:opacity-95";
export const backdrop = "fixed inset-0 bg-black/30 z-40 md:hidden";

// SYSTEM DASHBOARD MASTER CLASSES
export const masterDashboardShell = 'relative min-h-screen overflow-hidden bg-[#f0f6fa] font-sans text-slate-800 antialiased selection:bg-[#00a8b5] selection:text-white';
export const masterDashboardWatermark = 'absolute inset-0 bg-center bg-no-repeat bg-contain opacity-[0.03] pointer-events-none select-none';
export const masterDashboardGradient = 'absolute inset-0 bg-gradient-to-b from-[#e6eff7] via-[#f0f6fa] to-[#e6eff7] pointer-events-none';
export const masterDashboardLayout = 'relative z-10 flex min-h-screen flex-col';

// HEADER STYLES
export const masterDashboardSimpleHeader = 'sticky top-0 z-50 w-full border-b border-cyan-400/30 bg-[#0a2540] px-6 py-3 shadow-md flex items-center justify-between';
export const masterDashboardLogoContainer = 'relative flex items-center justify-center';
export const masterDashboardLogoBox = 'relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white p-1 shadow-md ring-2 ring-cyan-400/50 transition-transform hover:scale-105';
export const masterDashboardLogoImg = 'h-full w-full object-contain';

// Brand Typography
export const masterDashboardAppName = 'text-xl font-black tracking-widest text-white drop-shadow-sm';
export const masterDashboardAppSubtitle = 'text-[9px] font-bold tracking-[0.22em] text-cyan-300';

// MAIN CONTENT AREA
export const masterDashboardMainContainer = 'relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-start px-4 pt-8 pb-6 sm:px-6 lg:px-8';
export const masterDashboardMainWatermark = 'absolute inset-0 z-0 bg-center bg-no-repeat opacity-[0.03] pointer-events-none';
export const masterDashboardMainOverlay = 'pointer-events-none';
export const masterDashboardContentFlex = 'relative z-10 flex flex-col gap-3 items-center w-full';
export const masterDashboardHubTitle = 'text-xl sm:text-2xl font-extrabold tracking-widest text-[#0a2540] drop-shadow-sm';

// CARDS & GRID
export const masterDashboardThreeCardsGrid = 'grid w-full grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mt-6';
export const masterDashboardCardButton = 'group relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00b4d8] hover:shadow-xl hover:shadow-[#00b4d8]/15 active:translate-y-0';

// Icon Containers
export const masterDashboardIconPatients = 'flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] border border-sky-100 shadow-sm transition-transform duration-300 group-hover:scale-110';
export const masterDashboardIconBilling = 'flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#0d9488] border border-teal-100 shadow-sm transition-transform duration-300 group-hover:scale-110';
export const masterDashboardIconAdmin = 'flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-[#f43f5e] border border-rose-100 shadow-sm transition-transform duration-300 group-hover:scale-110';

// Card Typography
export const masterDashboardCardHeading = 'text-sm font-bold text-slate-800 transition-colors group-hover:text-[#00b4d8]';
export const masterDashboardCardSubtext = 'mt-1 text-[11px] text-slate-400 font-medium line-clamp-2';

// --- LOGIN PAGE STYLES ---
export const masterLoginShell = "w-full min-h-screen bg-[#f0f6fa] flex items-center justify-center p-4 font-sans text-xs";
export const masterLoginCard = "bg-white rounded-lg shadow-md border border-slate-200 w-full max-w-md p-8 space-y-6";
export const masterLoginHeaderWrap = "text-center space-y-2";
export const masterLoginIconBox = "inline-flex p-4 bg-[#00b4d8] text-white rounded-full shadow-sm";
export const masterLoginTitle = "text-xl font-bold text-[#0a2540] tracking-tight";
export const masterLoginSubtitle = "text-slate-500 text-sm";
export const masterLoginErrorBox = "bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-md flex items-center gap-3 text-sm";
export const masterLoginForm = "space-y-4";
export const masterLoginInputWrap = "relative";
export const masterLoginInputIcon = "absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400";
export const masterLoginInput = "w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] text-sm";
export const masterLoginPasswordInput = "w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-[#00b4d8] text-sm";
export const masterLoginEyeBtn = "absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#00b4d8] focus:outline-none";
export const masterCaptchaRow = "flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full";
export const masterCaptchaBox = "flex-1 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-center text-base sm:text-lg font-bold tracking-[0.2em] text-[#0a2540] select-none";
export const masterCaptchaRefreshBtn = "px-3 py-2.5 rounded-lg border border-slate-300 text-slate-500 hover:text-[#00b4d8] hover:border-[#00b4d8] transition-all flex items-center justify-center shrink-0";
export const masterSubmitButton = "w-full bg-[#00b4d8] text-white py-3.5 rounded-lg font-semibold hover:bg-[#0096c7] transition-all shadow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-70";