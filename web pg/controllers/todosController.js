const User = require('../models/User');

function avatar(req, res) {
    let sampleFile;
    let uploadPath;
    let userid = req.session.userid;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    } else {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        sampleFile = req.files.avatar;
        uploadPath = __dirname + '/public/images/' + JSON.stringify(Date.now()) + sampleFile.name;

        // Use the mv() method to place the file somewhere on your server
        User.editAvatar(userid, sampleFile.name, () => sampleFile.mv(uploadPath, function (err) {
            if (err) return res.status(500).send(err);
            res.redirect('/todos');
        }))
    }
}

module.exports = { avatar }