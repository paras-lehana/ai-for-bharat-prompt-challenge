/**
 * FILE: backend/src/utils/validators.js
 * 
 * PURPOSE: Input validation utilities using Joi
 * 
 * KEY FUNCTIONS:
 *  - validatePhoneNumber() → Validates Indian phone format
 *  - validateOTP() → Validates 6-digit OTP
 *  - validateListing() → Validates listing creation data
 *  - validateNegotiation() → Validates negotiation data
 * 
 * INTEGRATION POINTS:
 *  - Used by: All route handlers for request validation
 */

const Joi = require('joi');

/**
 * Validate Indian phone number format
 * Must be +91XXXXXXXXXX (10 digits after +91)
 */
const phoneNumberSchema = Joi.string()
  .pattern(/^\+91[6-9]\d{9}$/)
  .required()
  .messages({
    'string.pattern.base': 'Phone number must be in format +91XXXXXXXXXX',
    'any.required': 'Phone number is required'
  });

/**
 * Validate OTP (6 digits)
 */
const otpSchema = Joi.string()
  .pattern(/^\d{6}$/)
  .required()
  .messages({
    'string.pattern.base': 'OTP must be 6 digits',
    'any.required': 'OTP is required'
  });

/**
 * Validate listing creation data
 */
const listingSchema = Joi.object({
  cropType: Joi.string().required().min(2).max(100),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().required().valid('kg', 'quintal', 'ton', 'bag', 'piece'),
  basePrice: Joi.number().positive().required(),
  qualityTier: Joi.string().required().valid('premium', 'standard', 'basic'),
  description: Joi.string().max(500).allow(''),
  images: Joi.array().items(Joi.string().uri()).max(5),
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    address: Joi.string().required(),
    district: Joi.string(),
    state: Joi.string()
  }).required()
});

/**
 * Validate negotiation creation
 */
const negotiationSchema = Joi.object({
  listingId: Joi.string().uuid().required(),
  initialOfferPrice: Joi.number().positive().required(),
  message: Joi.string().max(500).allow('')
});

/**
 * Validate rating submission
 */
const ratingSchema = Joi.object({
  transactionId: Joi.string().uuid().required(),
  deliveryRating: Joi.number().integer().min(1).max(5).required(),
  qualityRating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500).allow('')
});

/**
 * Validate user profile update
 */
const profileUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  languagePreference: Joi.string().valid('en', 'hi', 'mr', 'ta', 'te', 'kn', 'gu', 'pa'),
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    address: Joi.string(),
    district: Joi.string(),
    state: Joi.string()
  })
});

/**
 * Helper function to validate request body
 * 
 * @param {Object} schema - Joi schema
 * @param {Object} data - Data to validate
 * @returns {Object} - { error, value }
 */
function validate(schema, data) {
  return schema.validate(data, { abortEarly: false });
}

module.exports = {
  phoneNumberSchema,
  otpSchema,
  listingSchema,
  negotiationSchema,
  ratingSchema,
  profileUpdateSchema,
  validate
};
