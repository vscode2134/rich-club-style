const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Model
 * Defines the schema for user authentication and profile
 * Supports both regular users and admin users
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters']
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false // Don't include password in queries by default
        },
        role: {
            type: String,
            enum: {
                values: ['USER', 'ADMIN'],
                message: '{VALUE} is not a valid role'
            },
            default: 'USER',
            uppercase: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt fields
    }
);

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Method to compare entered password with hashed password
 * @param {string} enteredPassword - Password to compare
 * @returns {Promise<boolean>} True if passwords match
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Add indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);

