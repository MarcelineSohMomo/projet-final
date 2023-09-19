const { User, Service, Role, Conversation, Message } = require("../models");

const credentialVariablesIsEmpty = (props) => {
    return !props || !props.id;
}

function validateEmail(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}
module.exports.getUsers = async(req, res) => {
    await User.find()
        .populate("roles", "name")
        .populate("listservices")
        .populate("listnotes")
        .populate("listcomments")
        .populate("listcommandes")
        .populate("favoriteservice")
        .then(users => res.status(200).send(users))
        .catch(err => res.status(500).json({ message: "An error has occurred. " }))
}

module.exports.getUsersWithoutCustomer = async(req, res) => {
    const role = await Role.find({ name: "customer" });
    await User.find({
            $and: [
                { roles: { $ne: role._id } },
                { _id: { $ne: req.userId } }
            ]
        }).populate("roles", "name")
        .then(users => {
            return res.status(200).send(users)
        })
        .catch(err => res.status(500).json({ message: "An error has occurred. " }))
}
module.exports.getUsersAndNotification = async(req, res) => {
    try {
        console.log("getUsersAndNotification");
        const role = await Role.findOne({ name: "customer" });
        const users = await User.find({
            $and: [
                { _id: { $ne: req.userId } }
            ]
        }).populate("roles", "name");

        const usersWithUnreadCounts = [];
        for (const user of users) {
            const conversation = await Conversation.findOne({
                participants: { $all: [user._id, req.userId] }
            });

            if (conversation) {
                const unreadMessageCount = await Message.countDocuments({
                    conversationId: conversation._id,
                    sender: { $ne: req.userId },
                    isRead: false
                });

                usersWithUnreadCounts.push({
                    user: user,
                    unreadCount: unreadMessageCount
                });
            }
        }

        return res.status(200).json(usersWithUnreadCounts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error has occurred." });
    }
};


module.exports.getAdminInfo = async(req, res) => {
    const admin = await User.findOne({}).populate({
        path: "roles",
        match: { name: "admin" }
    })
    await User.findById(admin._id)
        .then(admin => {
            const admin_ = {
                firstname: admin.firstname,
                lastname: admin.lastname,
                img: admin.img,
                _id: admin._id
            }
            return res.status(200).send(admin_)
        })
        .catch(err => res.status(500).json({ message: "An error has occurred. " }))
}


module.exports.findUser = (req, res) => {
    if (!credentialVariablesIsEmpty(req.params)) {
        User.findById(req.params.id)
            .populate("roles")
            .populate("listservices")
            .populate({
                path: "listnotes",
                populate: {
                    path: "serviceId",
                    populate: {
                        path: "providerId"
                    }
                }
            })
            .populate({
                path: "listcomments",
                populate: {
                    path: "serviceId",
                    populate: {
                        path: "providerId"
                    }
                },

            })
            .populate({
                path: "listcommandes",
                populate: {
                    path: "serviceId",
                    populate: {
                        path: "providerId"
                    }
                }
            })
            .populate("favoriteservice")
            .then((user) => {
                if (!user)
                    res.status(404).json({ message: "User not found with this " + req.params.id });
                else
                    res.status(200).send(user);
            })
            .catch((err) => {
                console.log(err)
                return res.status(500).send({
                    message: "Error retrieving user with id " + req.params.id,
                    error: `${err}`
                })
            });
    } else
        return res.status(500).json({ message: "Credential data is empty" })
}

module.exports.deleteUser = async(req, res) => {
    if (!credentialVariablesIsEmpty(req.params)) {
        try {
            const user = await User.findById(req.params.id);
            if (!user)
                return res.status(404).json({ message: "Utilisateur non trouvé" });

            const role_admin = await Role.findOne({ name: "admin" });
            const existingAdmins = await User.find({ roles: role_admin._id });
            if (user.roles.includes(role_admin._id) && (existingAdmins.length == 1))
                return res.status(404).json({ message: "Impossible de supprimer le seul admin" });

            const serviceDeleted = await Service.deleteMany({ providerId: user._id });
            await User.findByIdAndDelete(req.params.id);

            return res.status(200).json({
                message: "User deleted successfully",
                serviceDeleted: serviceDeleted
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: "Une erreur s'est produite",
                err: `${error}`
            });
        }
    } else
        return res.status(500).json({ message: "Credential data is empty" })
}



module.exports.updateAvailability = async(req, res) => {
    const service = await Service.findByIdAndUpdate(
        req.params.id,
        req.body, { new: true }
    );
    return res.status(200).json({
        message: `MAJ de ${service._id} reussir `,
        service: service
    });
}
module.exports.updateUser = async(req, res) => {
    if (!req.params.id || !req.body)
        return res.status(500).json({ message: "Credential data is empty" });
    try {
        const currentUser = await User.findById(req.userId);
        if (req.params.id) {
            const user_ = await User.findById(req.params.id);
            if ((currentUser.roles[0].value < user_.roles[0].value)) {
                return res.status(404).json({ message: "Impossible de changer ces informations. Authorisation insufisante. " });
            }
            if (req.body.email) {
                const existingUserWithNewMail = await User.findOne({ email: req.body.email });
                if (existingUserWithNewMail && (existingUserWithNewMail._id.toString() !== user_._id.toString())) {
                    return res.status(404).json({ message: `Cet email ${req.body.email} est déjà utilisé.` });
                }
                if (!validateEmail(req.body.email)) {
                    return res.status(404).json({ message: `Cet email ${req.body.email} n'est pas  valide.` });
                }
            }

            console.log(req.body);
            const reqBodyRole = req.body.role;
            delete req.body.role;
            const user = await User.findByIdAndUpdate(
                req.params.id,
                req.body, { new: true }
            );

            const role_ = await Role.findOne({ name: reqBodyRole });
            console.log(role_);
            const role_admin = await Role.findOne({ name: "admin" });
            const existingAdmins = await User.find({ roles: role_admin._id });
            if (role_) {
                if (user.roles.includes(role_admin._id) && (existingAdmins.length == 1)) // je vérifie si parmis mes users il n'a qu'un seul admin
                    return res.status(200).json({ message: "Mise à jour réussie. Rôle de l'administrateur reste inchangé." });

                if(role_.name === "customer" && user.listservices.length>= 1)   
                    return res.status(405).json({ message: "Supprimer les services de cet utilisateur avant de proceder" });

                if (!user.roles.includes(role_._id)) {
                    user.roles = [role_._id];
                    await user.save(); //attends la résolution du problème
                }
            }
            if (!user)
                return res.status(404).json({ message: "Utilisateur non trouvé pour la MAJ" });
            return res.status(200).json({
                message: `MAJ de ${user._id} reussir `, //lorsqu'il y'a au moins un admin et que je rejoute d'autres ou que je change un artisan en un client par exemple
                user: user
            });
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "User didn't update", err: `${error}` });
    }

}