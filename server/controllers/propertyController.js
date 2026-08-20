import Property from '../models/Property.js';

// @desc    Get all properties with optional filters (location, minPrice, maxPrice, search)
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, search } = req.query;
    let query = {};

    // Filter by location (case-insensitive partial match)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by general search keyword (matches title or location or description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching properties' });
  }
};

// @desc    Get single property details by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('ownerId', 'name email');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching property' });
  }
};

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (Owner only)
export const createProperty = async (req, res) => {
  try {
    const { title, description, price, location, images, amenities } = req.body;

    if (!title || !description || !price || !location) {
      return res.status(400).json({ message: 'Please provide title, description, price, and location' });
    }

    const property = await Property.create({
      title,
      description,
      price: Number(price),
      location,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80'],
      amenities: Array.isArray(amenities) ? amenities : [],
      ownerId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating property' });
  }
};

// @desc    Update an existing property
// @route   PUT /api/properties/:id
// @access  Private (Owner only)
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Verify that the logged-in user owns this property
    if (property.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this property' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating property' });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Owner only)
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Verify that the logged-in user owns this property
    if (property.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting property' });
  }
};
