import { CognitoUserPool, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "ap-south-1_fVcREs1Hg",
  ClientId: "7dmnpigaipfdfjs3hlibbc1oni",
};
const userPool = new CognitoUserPool(poolData);

// ✅ Signup
export const signUp = (username, password, phone) => {
  return new Promise((resolve, reject) => {
    userPool.signUp(username, password, [
      {
        Name: "phone_number",
        Value: `+91${phone}`,
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