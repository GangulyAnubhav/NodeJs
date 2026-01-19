const { app } = require('@azure/functions');

// Load all functions
require('./functions/auth');
require('./functions/users');
require('./functions/QtestAttachmentDownload');


app.setup({
    enableHttpStream: true
});
