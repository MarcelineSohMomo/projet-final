const express = require('express');
const bodyParser = require("body-parser");
require('dotenv').config({ path: './config/.env'});
require('./config/db');
const app = express();
const path = require('path');

const cors = require('cors');
app.use(cors({ 
    origin: "*",
    credentials: true,
}));

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const noteRoutes = require('./routes/note.routes');
const roleRoutes = require('./routes/role.routes');
const serviceRoutes = require('./routes/service.routes');
const commentRoutes = require('./routes/comment.routes');
const commandeRoutes = require('./routes/commande.routes');
const messageRoutes = require('./routes/message.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const categorieRoutes = require('./routes/categorie.routes.js');
const conversationRoutes = require('./routes/conversation.routes');
const historiqueRoutes = require('./routes/historique.routes');
const { createRole } = require('./controllers/role.controller');
const { Role, Categorie, User } = require('./models');
const { RolesTab } = require('./config/roles');
const { Categories } = require('./config/categories');
const { addCategorie } = require('./controllers/categorie.controller');
const { superuser } = require('./config/admin');
const { toUpperCase, toCapitalize } = require('./util');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, 'client', 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'client', 'public', 'uploads')));

app.listen(process.env.PORT, ()=> {
    console.log(`Listening on port ${process.env.PORT} ${process.env.CLIENT_URL}`);
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/commande", commandeRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/categorie", categorieRoutes);
app.use("/api/historique", historiqueRoutes);
app.get('/',(req, res)=> res.json({ message: "You are welcome"}));

async function initial() {
    try {
        const countDocRole = await Role.estimatedDocumentCount();
        if (countDocRole === 0) {
            for(const roleData of RolesTab)
                await createRole(roleData);
            
        }
        const countDocCategorie = await Categorie.estimatedDocumentCount();
        if (countDocCategorie === 0) {
            for(const categorie of Categories)
                await addCategorie(categorie);
        }
        const countDocUser = await User.estimatedDocumentCount();
        if(countDocUser === 0){
            const adminRole = await Role.find();
            if(!adminRole)
                console.log("Role non trouvé.")
            const user = new User({
                firstname: toUpperCase(superuser.lastname),
                lastname: toCapitalize(superuser.firstname),
                email: superuser.email,
                phone: superuser.phone,
                password: superuser.password,
                roles: [adminRole.filter(role => role.name == "admin")[0]._id],
            });
            await user.save();
            if(!user)
                console.log("Erreur lors de l'ajout de l'utilisateur avec le rôle admin.");
            console.log("Ajout d'un utilisateur avec le rôle admin");
        }
    } catch (error) {
        console.log(error);
    }
}

initial();