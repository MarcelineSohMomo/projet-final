
export const  saveCurrentUserInfo = (data)=>{
    localStorage.removeItem("isconnected");
    localStorage.removeItem("user");
    if (data.token) {
        localStorage.setItem("token", data.token);
    }
    localStorage.setItem("isconnected", "true");
    localStorage.setItem("user", JSON.stringify(data.user));
}

export const getUser =  () => {
    if(localStorage.getItem("isconnected"))
        return JSON.parse(localStorage.getItem("user"));
}

export const getToken =  () => {
    if(localStorage.getItem("isconnected"))
    {
        return localStorage.getItem("token");
    }
}

export const extractDate = (date_) =>{
    const date = new Date(date_);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

export const extractDateAndHours = (date_) =>{
    const date = new Date(date_);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return {
        date : `${day} ${month} ${year}`,
        hours: `${hours}H ${minutes}min ${seconds}`
    };
}

export const verifyTabString = (tab) => {
    return tab.every(element => typeof element === 'string');
}