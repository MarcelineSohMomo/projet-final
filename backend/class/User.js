const { createUser, findUserById, deleteUser, findUserByEmail } = require("../controllers/CRUD/User.CRUD");

class User {
  constructor() {
    this.currentUser = null;

  }

  async loadInfoFromDB(props){
    this.firstname = props.firstname;
    this.lastname = props.lastname;
    this.email = props.email;
    this.phone = props.phone;
    this.dateOfBirth = props.dateOfBirth;
    this.password = props.password;
    this.isVerified = props.isVerified;
    this.languages = props.languages;
    this.qualification = props.qualification;
    this.roles = props.roles;
    this.listServices = props.listServices;
    this.listComments = props.listComments;
    this.listNotes = props.listNotes;
    this.listCompteBancaires = props.listCompteBancaires;
    this.listLegalDocuments = props.listLegalDocuments;
    this.description = props.description;
    this.picturePath = props.picturePath;
    this.isActive = props.isActive;
    this.id = props._id
  }

  async signIn(email, password){

    if(email !== null && password !== null){
      const user = await User.findOne({
          email: req.body.email,
      })
      .populate("roles");

      if(!user)
        return {status:400, message:"Email incorrect"};
      var passwordValid = bcrypt.compareSync(password, user.password);
      if(!passwordValid)
        return {status:400, message:"Password incorrect."};
      var token = jwt.sign({ id: user._id}, process.env.SECRET_CODE, { expiresIn: 86400});
      if(token !== null){
        await this.loadInfoFromDB(user);
        return {status: 200, user: user, token: token}
      }
    }
    else
      return {status:400, message:"Des données sont manquantes."};
  }

  async signUp(){
    const user = await createUser({
      firstname : this.firstname,
      lastname : this.lastname,
      email : this.email,
      phone : this.phone,
      dateOfBirth : this.dateOfBirth,
      password : this.password,
      isVerified : this.isVerified,
      language : this.language,
      qualification : this.qualification,
      role : this.role,
      listServices : this.listServices,
      listComments : this.listComments,
      listNotes : this.listNotes,
      listCompteBancaires : this.listCompteBancaires,
      listLegalDocuments : this.listLegalDocuments,
      description : this.description,
      picturePath : this.picturePath,
      isActive : this.isActive,
    })
    this.id = user._id;
    this.setId(user._id)
    this.user = user;
  }

  getId(){
    console.log("id ", this.id)
    return this.id
  }
  setId(id){
    this.id = id
  }
  async getData (id){
    this.id = (this.id == undefined || this.id == null ) ? id : this.id;
    return await findUserById(this.id);
  }

  async delete(userId, currentUser){
    deleteUser(userId, currentUser);
  }

  async readByEmail(email){
    findUserByEmail(email);
  }

  async readById(id){
    findUserById(id);
  }

  async update(userId, updatedUserData){
    updateUser(userId, updatedUserData)
  }
}


module.exports= User