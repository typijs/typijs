/**
 * Joi custom validation for mongo Db ObjectID
 * 
 * Usage:
 * ```javascript
 * const Joi = require('@hapi/joi');
 * const { objectId } = require('./custom.validation');
 * 
 * Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
 * 
 * ```
 * @param value 
 * @param helpers 
 */
export const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" must be a valid mongo id');
    }
    return value;
};

export const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message('password must be at least 8 characters');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message('password must contain at least 1 letter and 1 number');
    }
    return value;
};
