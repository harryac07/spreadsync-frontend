import { toLower } from 'lodash';
export const validateEmail = (email) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(toLower(email));
};
