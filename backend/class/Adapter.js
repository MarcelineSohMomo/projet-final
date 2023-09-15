class Adapter{
    constructor(req, res){
        this.header = req.headers.authorization;
        this.body = req.body;
        this.params = req.params;
        this.req = req;
    }

    getBody(){
        return this.body;
    }
    getHeader(){
        return this.header;
    }
    getParams(){
        return this.params;
    }

    sendResponse(message, statusCode, data, token){
        return res.status(statusCode).json({message: message, data: data, token: token});
    }
}