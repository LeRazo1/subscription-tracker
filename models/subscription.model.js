import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    price: {
        type: Number,
        required: [true, 'Subscription Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    currency: {
        type: String,
        enum: ['USD', 'ZAR', 'GBP'],
        default: 'ZAR',
    },
    frequency: {
        type: String,
        enum: ['daily','weekly','monthly', 'yearly'],
        default: 'monthly',
    },
    category: {
        type: String,
        enum: ['business', 'education', 'entertainment', 'finance', 'health', 'lifestyle', 'personal', 'shopping', 'social', 'technology', 'travel'],
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['credit card', 'paypal', 'bank transfer'],
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value < Date.now(),
            message: 'Start date cannot be in the past'
            }
    },
    renewalDate: {
        type: Date,
        required: false,
        validate: {
            validator: function (value) {
               return value > this.startDate;
            },
            message: 'Renewal date must be after start date',
            }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },

}, {timestamps: true});
// AUTO CALCULATE RENEWAL DATE IF NECESSARY
subscriptionSchema.pre( 'save',  function (next) {
    if(!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    // Auto update the status if renewal date has passed
    if (this.renewalDate < Date.now()) {
        this.status = 'expired';
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;