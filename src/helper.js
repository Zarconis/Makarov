var ValidateAddEntity = (body) => {
    console.log(body)
    if (!body || !body.id || !body.label) {
        throw "Entity should have id & label";
    }
}

var ConstructErrorMessage = (message) => {
    return {
        status: "error",
        message: (typeof message === "object") ? JSON.stringify(message) : message
    };
}

module.exports = {
    ValidateAddEntity: ValidateAddEntity,
    ConstructErrorMessage: ConstructErrorMessage
}
