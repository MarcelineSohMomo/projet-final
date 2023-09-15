const { Role, User } = require("../models");

const credentialVariablesIsEmpty = (props,res)=> {
    if(!props || !props.name || !props.description)
        return res.status(500).json({message : "Important data is missing"})    
}

module.exports.addRoleForUser = async (req, res) =>{
    if(!req.body.name || !req.params.id)
        return res.status(500).json({message : "Needs two informations to add role properly"})
    await User.findById(req.params.id)
    .then( async (user)=>{
        const role = await Role.findOne({ name: req.body.name });
        if(!user)
            return res.status(400).json({message: `Unknow user Id ${req.params.id}`});
        if(user.roles.includes(role._id))
            return res.status(500).json({ message: "Role existing yet" });
        user.roles.push(role._id);
        await user.save();
        return res.status(200).json({ message: "Role successfully added" });
    })
    .catch((err)=>{
        return res.status(500).json({ message: err });
    })
}

module.exports.createRole = async (roledata)=>{
    try {
        const role = new Role(roledata);
        await role.save();
        return console.log(`added '${role.name}' to roles collection`);
    } catch (error) {
        console.log(error)
    }
}

module.exports.getRoles = async(req, res) =>{
    const roles = await Role.find({});
    if(!roles)
        return res.status(404).json({ message: "Roles not found"});
    return res.status(200).json(roles);
}

module.exports.findRole = async(req, res) =>{
    if(!req.params.id)
        return res.status(404).json({ message: `Unknown Id ${req.params.id}`});
    try {
        const role = await Role.findById(req.params.id);
        if(!role)
            return res.status(404).json({ message: "Role not found" });
        return res.status(200).json({ role: role});
    } catch (error) {
        return res.status(404).json({ message: "An error has occured" });
    }
}

module.exports.getRoleForVerification = async(id) =>{
    if(!id)
        return null;
    try {
        const user = await User.findById(id).populate("roles","name");

        if(!user)
            return null;
        return user.roles;
    } catch (error) {
        console.log("An error occured")
        return null;
    }
}


module.exports.updateRole = async (req, res) =>{
    credentialVariablesIsEmpty(req.body, res);
    if(!req.params.id)
        return res.status(404).json({ message: `Unknown Id ${req.params.id}`});
    try {
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true}
        );
        if(!role)
            return res.status(404).json({ message: "Role not found" });
        return res.status(200).json({ role: role});
    } catch (error) {
        return res.status(404).json({ message: "An error has occured" });
    }
}
module.exports.deleteRole = async (req, res) =>{
    if(!req.body.name || !req.params.id)
        return res.status(500).json({message : "Needs id or request role to remove properly access"})
    User.findById(req.params.id)
        .then(async (user)=>{
            try {
                const role = await Role.findOne({ name: req.body.name });
                if(!user.roles.includes(role._id))
                    return res.status(404).json({ message: " User doesn't have this role" });
                user.roles.pull(role._id);
                await user.save();
                return res.status(200).json({ message: "Role successfully deleted" });
            } catch (error) {
                return res.status(404).json({ 
                    message: "Role doesn't exist",
                    err: `${error}`
                });
            }
        })
        .catch((err)=>{
            return res.status(400).json({
                message: `Unknow user Id ${req.params.id}`,
                err: `${err}`
            })
        })
}

