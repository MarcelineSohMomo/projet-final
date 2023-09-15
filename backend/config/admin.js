const bcrypt = require("bcryptjs");
const salt = 10;
module.exports = {
    superuser: {
        firstname: "marceline",
        lastname: "marceline",
        email: "marceline@gmail.com",
        phone: "331144556688",
        password: bcrypt.hashSync("admin2023", salt),
    },
};