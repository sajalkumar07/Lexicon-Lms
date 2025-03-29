const { body } = require('express-validator');

exports.validateCourseCreation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('subtitle')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subtitle cannot exceed 200 characters'),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom(value => value >= 0)
    .withMessage('Price cannot be negative'),
  
  body('salePrice')
    .optional()
    .isNumeric()
    .withMessage('Sale price must be a number')
    .custom((value, { req }) => value >= 0 && value <= req.body.price)
    .withMessage('Sale price must be between 0 and the regular price'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  
  body('description')
    .trim()
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),
  
  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Short description cannot exceed 200 characters'),
  
  body('difficulty')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),
  
  body('learningOutcomes')
    .optional()
    .isArray()
    .withMessage('Learning outcomes must be an array'),
  
  body('learningOutcomes.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Learning outcomes cannot be empty'),
  
  body('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array'),
  
  body('requirements.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Requirements cannot be empty'),
  
  body('targetAudience')
    .optional()
    .isArray()
    .withMessage('Target audience must be an array'),
  
  body('targetAudience.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Target audience entries cannot be empty'),
  
  body('languages')
    .optional()
    .isArray()
    .withMessage('Languages must be an array'),
  
  body('languages.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Language entries cannot be empty'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Tags cannot be empty')
];

exports.validateCourseUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('subtitle')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subtitle cannot exceed 200 characters'),
  
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .custom(value => value >= 0)
    .withMessage('Price cannot be negative'),
  
  body('salePrice')
    .optional()
    .isNumeric()
    .withMessage('Sale price must be a number')
    .custom((value, { req }) => {
      return value >= 0 && (!req.body.price || value <= req.body.price);
    })
    .withMessage('Sale price must be between 0 and the regular price'),
  
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  
  body('description')
    .optional()
    .