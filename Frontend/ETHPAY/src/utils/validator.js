export default class Validator {
  static isEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static isPasswordStrong(password) {
    // Minimum 6 chars, at least one number and one letter
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/
;
    return regex.test(password);
  }

  static isNotEmpty(value) {
    return value !== null && value !== undefined && value.trim() !== "";
  }
}
