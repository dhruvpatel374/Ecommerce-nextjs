import validator from "validator";
type signUpData = {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
};
const validateSignup = (user: signUpData) => {
  if (!user.firstName || !user.lastName || !user.emailId || !user.password) {
    throw new Error("All fields are required!!");
  } else if (!validator.isEmail(user.emailId)) {
    throw new Error("Please enter a valid email!!");
  } else if (!validator.isStrongPassword(user.password)) {
    throw new Error("Please enter strong password!!");
  }
};
export default validateSignup;
