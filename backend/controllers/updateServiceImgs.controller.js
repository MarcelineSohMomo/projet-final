const fs = require('fs');
const { promisify } = require('util');
const fsPromises = require('fs/promises');
const path = require('path');
const { User, Service } = require('../models');

const pipeline = promisify(require('stream').pipeline);

module.exports.updateServiceImgs = async (req, res) =>{
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Aucun image n'a été uploader" });
        }
        const invalidFile = req.files.some(
            (file) =>
                file.mimetype !== 'image/jpg' &&
                file.mimetype !== 'image/jpeg' &&
                file.mimetype !== 'image/png'
        );
        if (invalidFile) {
            throw Error('Invalid file format.');
        }

        const largeFile = req.files.some((file) => file.size > 9000000);
        if (largeFile) {
            throw Error('Le fichier est trop lourd.');
        }
        const uploadedImages = [];
        for (const file of req.files) {
            const filename = Date.now() + '-' + file.originalname;
            await pipeline(
              fs.createReadStream(file.path),
              fs.createWriteStream(
                path.join(__dirname, '..', 'client', 'public', 'uploads', 'service', filename)
              )
            );
            await fsPromises.unlink(file.path);
            uploadedImages.push('./uploads/service/' + filename);
        }
        const serviceUpdated = await Service.findByIdAndUpdate(
            req.params.id,
            { $set: { imgs: uploadedImages } },
            { new: true }
        );
        console.log(serviceUpdated)

        if(!serviceUpdated)
            res.status(505).json({message:"Images ont été chargée avec echouée  ", service: serviceUpdated });
        if(serviceUpdated)
            res.status(200).json({message:"Mise à jour du service success ", service: serviceUpdated });

    } catch (error) {
        uploadErrors(error);
        console.log(error)
        return res.status(500).json({ message: `${error}` });
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