class Message{
    constructor(senderId, receiveId, content, date){
        this.senderId = senderId 
        this.receiveId = receiveId
        this.content = content
        this.date = date
    }
    async sendMessage(){}
    async getMessage(){}
    async deleteMessage(){}
    async updateMessage(){}
}

module.exports ={ Message };