let mongoose = require("mongoose");

let schema = mongoose.Schema;

let pictureSchema = new schema({
    firstname:{
        type: String,
        required: true
    },
    
    lastname:{
        type: String,
        required: true
    },

    picture:{
        type: [Array],
        required: true
    }
});

const picture = mongoose.model('picture', pictureSchema);

module.exports = picture;