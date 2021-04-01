module.exports = `
input signupInput{
    fullName:String!
    email:String!
    type:String!
}

type signupResponse{
    error:[errorField]
    message:String
    activationCode:String
}

input activateAccountInput{
    email:String!
    activationCode:String!
    password:String!
    confirmPassword:String!
}

type errorWithMsgResponse{
    error:[errorField]
    message:String
}

input logInInput{
    email:String!
    password:String!
}

type loginResponse{
    error:[errorField]
    message:String
    response:userFields,
    jwToken:String
}

input forgotPasswordRequestInput{
    email:String!
}

type forgotPasswordRequestResponse{
    error:[errorField]
    message:String,
    token:String
}

input forgotPasswordInput{
    forgotPasswordToken:String!
    password:String!
    confirmPassword:String!
}


input userListInput{
    key:String
    value:String
}

type userListResponse{
    response:[userFields]
}

type findUserByIdResponse{
    response:userFields
}

type errorField{
    key:String,
    value:String
}

type userFields{
    _id:String
    fullName:String
    email:String
    password:String
    type:String
    code:String
    forgotPasswordToken:String
    hasEmailVerified:Int
    status:Int
    createdAt:String
    updatedAt:String
}

type Mutation {
    signup(input:signupInput):signupResponse
    activateAccount(input:activateAccountInput):errorWithMsgResponse
    logIn(input:logInInput):loginResponse
    forgotPasswordRequest(input:forgotPasswordRequestInput):forgotPasswordRequestResponse
    forgotPassword(input:forgotPasswordInput):errorWithMsgResponse
} 
    
type Query {
    userList(input:userListInput):userListResponse
    findUserById(_id:String):findUserByIdResponse
}
`;
