import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

// @desc    Create a new booking with overlap prevention
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { propertyId, checkInDate, checkOutDate } = req.body;

    // Validate inputs
    if (!propertyId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        message: 'Please provide propertyId, checkInDate, and checkOutDate',
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({ message: 'Invalid check-in or check-out date format' });
    }

    if (checkIn < today) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Verify property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check for date overlap with existing active/confirmed bookings
    // Overlap condition: (existingCheckIn < newCheckOut) AND (existingCheckOut > newCheckIn)
    const overlappingBooking = await Booking.findOne({
      propertyId,
      status: { $ne: 'cancelled' },
      $and: [
        { checkInDate: { $lt: checkOut } },
        { checkOutDate: { $gt: checkIn } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message:
          'This property is already booked for the selected dates. Please choose different dates.',
      });
    }

    // Calculate total price based on number of nights
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = numberOfNights * property.price;

    // Create booking
    const booking = await Booking.create({
      propertyId,
      userId: req.user._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      status: 'confirmed',
    });

    // Populate property details for immediate UI display
    const populatedBooking = await Booking.findById(booking._id).populate(
      'propertyId',
      'title location images price'
    );

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating booking' });
  }
};

// @desc    Get all bookings for logged-in user
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('propertyId', 'title location images price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching your bookings' });
  }
};

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure the booking belongs to the logged-in user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error cancelling booking' });
  }
};
