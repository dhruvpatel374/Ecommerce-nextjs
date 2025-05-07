import validator from "validator";
type User = {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
  photoUrl: string;
  gender: string;
};
const validateProfileEdit = (user: User) => {
  if (!user.firstName || !user.lastName || !user.photoUrl || !user.gender) {
    throw new Error("All fields are required!!");
  } else if (
    user.gender != "male" &&
    user.gender != "female" &&
    user.gender != "other"
  ) {
    throw new Error("Please enter a valid gender!!");
  } else if (!validator.isURL(user.photoUrl)) {
    throw new Error("Please enter a valid URL!!");
  } else if (user.firstName.length > 20 || user.lastName.length > 20) {
    throw new Error("Name should be less than 20 characters");
  } else if (user.firstName.length < 3 || user.lastName.length < 3) {
    throw new Error("Name should be more than 3 characters");
  }
};
export default validateProfileEdit;
