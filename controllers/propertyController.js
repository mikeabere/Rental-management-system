import Property from '../models/propertyModel.js';

export const createProperty = async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, owner: req.user.id });
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id }).populate('owner', 'name email phone');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email phone');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!property) return res.status(404).json({ message: 'Property not found or not yours' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!property) return res.status(404).json({ message: 'Property not found or not yours' });
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};