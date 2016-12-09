var mongoose = require('mongoose');
var config = require('../config');
var URL = 'mongodb://'+ config.database.host +':'+ config.database.port + '/' + config.database.dbname;
mongoose.connect(URL);
