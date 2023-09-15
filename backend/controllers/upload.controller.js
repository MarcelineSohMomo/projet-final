const fs = require('fs');
const { promisify } = require('util');
const fsPromises = require('fs/promises');
const path = require('path');
const { User } = require('../models');

const pipeline = promisify(require('stream').pipeline);

module.exports.uploadImg = async (req, res) =>{
    console.log("dir name  ", `${__dirname}`)
    console.log(req.file)
    try {
        if(
            req.file.mimetype !== "image/jpg" &&
            req.file.mimetype !== "image/jpeg" &&
            req.file.mimetype !== "image/png"
        )
            throw Error("Fichier invalide.");
        if(req.file.size > 1000000) throw Error("Le fichier est trop lourd.")
    } catch (error) {
        uploadErrors(error);
        console.log(error)
        return res.status(505).json({ message: error })
    }

    const filename = Date.now() + '-' + req.file.originalname;
    await pipeline(
        fs.createReadStream(req.file.path),
        fs.createWriteStream(
            path.join(__dirname, '..', 'client', 'public', 'uploads', 'profil', filename)
        )
    );
    await fsPromises.unlink(req.file.path);

    try {
        await User.findByIdAndUpdate(
            req.params.id,
            { $set: {img: "./uploads/profil/"+ filename}},
            {new: true}
        ).populate("roles").then(doc => {
            res.status(200).json({user: doc});
        })
    } catch (error) {
        return res.status(500).json({message: `${error}`});
    }
};


uploadErrors = (err)=> {
    let errors = { format: "", maxSize: ""};
    if(err.message.includes('invalid file'))
        errors.format = "Format incompatible";
    if(err.message.includes('max size'))
        errors.format = "Le fichier dépasse 1MB";
    return errors;
}