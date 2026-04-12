import Lease from '../models/leaseModel.js';
import Property from '../models/propertyModel.js';

export const createLease = async (req, res) => {
  try {
    const { property: propertyId, tenant, startDate, endDate, monthlyRent } = req.body;
    const property = await Property.findById(propertyId);
    if (!property || property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const lease = await Lease.create({
      property: propertyId,
      tenant,
      startDate,
      endDate,
      monthlyRent
    });
    // Mark property as occupied
    property.status = 'occupied';
    await property.save();
    res.status(201).json(lease);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeases = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'landlord') filter = { tenant: { $in: await require('../models/userModel.js').find({ role: 'tenant' }).distinct('_id') } }; // landlord sees all
    else if (req.user.role === 'tenant') filter = { tenant: req.user.id };
    const leases = await Lease.find(filter)
      .populate('property', 'title address rentAmount')
      .populate('tenant', 'name email phone');
    res.json(leases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeaseById = async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id)
      .populate('property')
      .populate('tenant', 'name email phone');
    if (!lease) return res.status(404).json({ message: 'Lease not found' });
    res.json(lease);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateLease = async (req, res) => {
  try {
    const lease = await Lease.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    if (!lease) return res.status(404).json({ message: 'Lease not found' });
    res.json(lease);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteLease = async (req, res) => {
  try {
    const lease = await Lease.findByIdAndDelete(req.params.id);
    if (!lease) return res.status(404).json({ message: 'Lease not found' });
    res.json({ message: 'Lease deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};