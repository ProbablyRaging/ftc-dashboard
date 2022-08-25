const mongoose = require('mongoose');
const { dbTwo } = require('../../database/mongodb');
const slugify = require('slugify');

const resourceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    edited: {
        type: Date,
        required: false
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    published: {
        type: Boolean,
        required: false,
    },
    comments: {
        type: Array,
        required: false
    },
    categories: {
        type: Array,
        required: true
    }
});

resourceSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

const resources = dbTwo.model('resources', resourceSchema);

module.exports = resources;