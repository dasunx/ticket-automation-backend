class HttpError extends Error{
    constructor(message,errorCode){
        super(message);// add a msg property
        this.code=errorCode;// adds a code property
    }
}

module.exports=HttpError;