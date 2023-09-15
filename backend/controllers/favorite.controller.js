const { User, Service } = require("../models");

const credentialVariablesIsEmpty = (req, res) => {
    if(!req || !req.userId || !req.params.id) {
        res.status(505).json({ message: "Important data is missing"});
        return true;
    }
    return false;
}

const notFoundResource = (resource, res, message) => {
    if(!resource) {
        res.status(404).json({message: message});
        return true;
    }
    return false;
}

module.exports.favorite = async (req, res) => {
    if (credentialVariablesIsEmpty(req, res)) return;
    const user = await User.findById(req.userId);
    if (notFoundResource(user, res, `User not found with this id ${req.userId}`)) return;
    const service = await Service.findById(req.params.id);
    if (notFoundResource(service, res, `Service not found with this id ${req.params.id}`)) return;

    const userIndex = service.likers.indexOf(user._id);
    const serviceIndex = user.favoriteservice.indexOf(service._id);
    var isFavorite = false;
    if(userIndex === -1) {
        service.likers.push(user._id);
        user.favoriteservice.push(service._id);
        isFavorite = !isFavorite
    } else {
        service.likers.pull(user._id);
        user.favoriteservice.pull(service._id);
    }

    await service.save();
    await user.save();

    return res.status(200).json({ 
        message: "Like status is updated",
        isFavorite: isFavorite,
    });
}
