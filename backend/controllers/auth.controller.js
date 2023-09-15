const bcrypt = require('bcryptjs');
const { User, Role} = require("../models")
const jwt = require("jsonwebtoken");
const { toUpperCase, toCapitalize, toLowerCase } = require('../util');
require('dotenv').config({ path: "../config/.env"});

exports.verifyToken = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
  
    if(!token)
        return res.status(403).send({ message: "Token non fourni !" });
    jwt.verify(token, process.env.SECRET_CODE, (err, decoded) =>{
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
          req.userId = decoded.id;
        next();
    })
}

const credentialVariablesIsEmpty = (props)=> {
    return !props || !props.email || !props.password
}

module.exports.signUpUser = async (req, res) => {
    if(!credentialVariablesIsEmpty(req.body)){
        try {
            const existingUser = await User.findOne({ email: toLowerCase(req.body.email)});
            if(existingUser)
                return res.status(202).json({ message: "User already exist" });
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            req.body.firstname = toUpperCase(req.body.firstname);
            req.body.lastname = toCapitalize(req.body.lastname);
            req.body.roles = [];
            const user = new User(req.body);
            await user.save();

            const role = await Role.findOne({ name: "customer" });
            if (!role)
                return res.status(404).json({ message: "Role non trouvé. Surement supprimé" });
            if(user.roles.includes(role._id))
                return res.status(500).json({ message: "Role existe déjà" });
            user.roles.push(role._id);
            await user.save();
            return res.status(200).json({message: "Utilisateur inscrit avec success", user:user});
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    }
    else
        return res.status(500).json({message : " Information(s) manquante(s)"})
}

module.exports.signUpArtisan = async (req, res) => {
    if(!credentialVariablesIsEmpty(req.body)){
        try {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            req.body.firstname = toUpperCase(req.body.firstname);
            req.body.lastname = toCapitalize(req.body.lastname);
            const existingUser = await User.findOne({
                email: toLowerCase(req.body.email)
            })

            if(existingUser){
                const role = await Role.findOne({ name: "provider" });
                if(existingUser.roles.includes(role._id)){
                    return res.status(200).json({
                        message : "L' utilisateur existe deja avec ce role",
                        user: existingUser
                    });
                }
                // existingUser.roles.push(role._id);
                existingUser.roles = [role._id];

                await existingUser.save();
                return res.status(200).json({
                    message : "Prestataire ajouté avec success",
                    user: existingUser
                });
            }
            var user = new User(req.body);
            user = await user.save();
            const role = await Role.findOne({ name: "provider" });

            if(role) {
                if(user.roles.includes(role._id))
                    return res.status(202).json({ message: "Role existing yet" });
                console.log(user);

                if(user.roles.length !== 0 && user.roles[0].value < role.value){
                    // user.roles.push(role._id);
                    user.roles = [role._id];
                    await user.save();
                }
                if (user.roles.length == 0) {
                    user.roles = [role._id];
                    await user.save();
                }
            }

            if(!role)
                return res.status(404).json({ message: "Le role provider n'existe plus" });
            return res.status(200).json({message: "Utilisateur inscrit avec success", user:user});
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: error });
        }
    }
    else{
        return res.status(500).json({message : " Information(s) manquante(s)"})
    }
}

module.exports.signUpModerator = async (req, res) => {
    if(!credentialVariablesIsEmpty(req.body)){
        try {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            req.body.firstname = toUpperCase(req.body.firstname);
            req.body.lastname = toCapitalize(req.body.lastname);
            const existingUser = await User.findOne({
                email: req.body.email
            })

            if(existingUser){
                const role = await Role.findOne({ name: "moderator" });
                if(existingUser.roles.includes(role._id)){
                    return res.status(200).json({
                        message : "L' utilisateur existe deja avec ce role",
                        user: existingUser
                    });
                }
                console.log("role ", role)
                existingUser.roles.push(role._id);
                // existingUser.roles = [role._id];

                await existingUser.save();
                return res.status(200).json({
                    message : "Prestataire ajouté avec success",
                    user: existingUser
                });
            }
            const user = new User(req.body);
            await user.save();
            const role = await Role.findOne({ name: "moderator" });

            if(role) {
                if(user.roles.includes(role._id))
                    return res.status(202).json({ message: "Role existing yet" });
                // user.roles = [role._id];
                user.roles.push(role._id);
                await user.save();
            }

            if(!role)
                return res.status(404).json({ message: "Le role provider n'existe plus" });
            return res.status(200).json({message: "Utilisateur inscrit avec success", user:user});
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: error });
        }
    }
    else{
        return res.status(500).json({message : " Information(s) manquante(s)"})
    }
}


exports.signin = async (req, res) => {
    if(!credentialVariablesIsEmpty(req.body)){
        const user = await User.findOne({
            email: req.body.email,
        })
        .populate("roles");

        if(!user)
            return res.status(400).send({ message: " Email incorrect" });
        var passwordValid = bcrypt.compareSync(req.body.password, user.password);
        if(!passwordValid)
            return res.status(500).json({message: " Password incorrect. "});
        var token = jwt.sign({ id: user._id}, process.env.SECRET_CODE, { expiresIn: 86400});
        console.log("user connect : ", user);
        return res.status(200).json({user: user, token: token })
    }
    else
        return res.status(500).json({message : "Des données sont manquantes"})
};

exports.signout = async (req, res) => {
    try {
      req.session = null;
      return res.status(200).send({ message: "Vous vous venez d'etre deconnecté!" });
    } catch (err) {
      this.next(err);
    }
};


