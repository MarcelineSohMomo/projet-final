module.exports.toCapitalize = (str) => {
    const uppercaseStr = str.toUpperCase();
    const capitalizedStr = uppercaseStr.charAt(0).toUpperCase() + uppercaseStr.slice(1).toLowerCase();
    return capitalizedStr;
}

module.exports.toUpperCase = (str) => {
    return str.toUpperCase();
}

module.exports.toLowerCase = (str) =>{
    return str.toLowerCase();
}