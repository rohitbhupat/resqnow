import { CognitoUserPool, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USERPOOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_USERPOOL_CLIENT_ID,
};
const userPool = new CognitoUserPool(poolData);

// ✅ Signup
export const signUp = (username, password, phone) => {
  return new Promise((resolve, reject) => {
    userPool.signUp(username, password, [
      {
        Name: "phone_number",
        Value: phone,
      },
      {
        Name: "preferred_username",
        Value: username,
      },
    ], null, (err, result) => {
      if (err) reject(err);
      else resolve(result.user);
    });
  });
};

// ✅ Login
export const login = (username, password) => {
  const user = new CognitoUser({ Username: username, Pool: userPool });
  const authDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        const idToken = session.getIdToken().getJwtToken();
        resolve({ user, token: idToken });
      },
      onFailure: reject,
    });
  });
};