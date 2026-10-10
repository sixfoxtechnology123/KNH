const Billing = require('../models/billingModel');

// Helper to generate sequential Bill Number: Bill-1, Bill-2, Bill-3...
const generateBillNumber = async () => {
  const lastBill = await Billing.findOne().sort({ createdAt: -1 });
  if (!lastBill || !lastBill.billNo) {
    return "Bill-1";
  }
  
  const parts = lastBill.billNo.split("-");
  const lastNum = parseInt(parts[1], 10) || 0;
  return `Bill-${lastNum + 1}`;
};

// Create a new billing record
exports.createBilling = async (req, res) => {
  try {
    const {
      patientId,
      patientMongoId,
      fullName,
      mobileNumber,
      gender,
      regNo,
      age,
      drName,
      address,
      admissionDate,
      dischargeDate,
      billDate,
      cabinNo,
      wardNo,
      items,
      subTotal,
      discount,
      netAmount,
      advanced,
      returnAmount,
      balanceAmount
    } = req.body;

    if (!patientId || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Patient ID and billing items are required." });
    }

    const billNo = await generateBillNumber();

    const newBill = new Billing({
      billNo,
      patientId,
      patientMongoId,
      fullName,
      mobileNumber,
      gender,
      regNo,
      age,
      drName,
      address,
      admissionDate,
      dischargeDate,
      billDate,
      cabinNo,
      wardNo,
      items,
      subTotal,
      discount: discount || 0,
      netAmount,
      advanced: advanced || 0,
      returnAmount: returnAmount || 0,
      balanceAmount
    });

    await newBill.save();

    res.status(201).json({
      success: true,
      message: "Billing record saved successfully.",
      billNo: newBill.billNo,
      data: newBill
    });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).json({ success: false, message: "Internal server error while saving billing record." });
  }
};

// Fetch all bills (for the View Bill table page)
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Billing.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills
    });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve bills directory." });
  }
};

// Update an existing billing record
exports.updateBilling = async (req, res) => {
  try {
    const { id } = req.params; // MongoDB _id
    const updateData = req.body;

    const updatedBill = await Billing.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedBill) {
      return res.status(404).json({ success: false, message: "Billing record not found." });
    }

    res.status(200).json({
      success: true,
      message: "Billing record updated successfully.",
      data: updatedBill
    });
  } catch (error) {
    console.error("Error updating bill:", error);
    res.status(500).json({ success: false, message: "Internal server error while updating billing record." });
  }
};

// Delete a billing record
exports.deleteBilling = async (req, res) => {
  try {
    const { id } = req.params; // MongoDB _id

    const deletedBill = await Billing.findByIdAndDelete(id);

    if (!deletedBill) {
      return res.status(404).json({ success: false, message: "Billing record not found." });
    }

    res.status(200).json({
      success: true,
      message: "Billing record deleted successfully."
    });
  } catch (error) {
    console.error("Error deleting bill:", error);
    res.status(500).json({ success: false, message: "Internal server error while deleting billing record." });
  }
};