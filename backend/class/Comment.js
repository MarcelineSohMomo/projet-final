class Comment{

    async commentService(serviceId, user_id, message) {
        return await createComment(serviceId, user_id, message);
    }

    async getCommentsByServiceId() {
        return await  getCommentsByServiceId(serviceId);
    }

    async getComments() {
        await displayComments();
    }

    async updateCommentService(commentId, message, userId){
        return await updateComment(commentId, message, userId);
    }
    
    async deleteCommentService(commentId, userId){
        return await deleteComment(commentId, userId);
    }
}

module.exports ={ Comment };