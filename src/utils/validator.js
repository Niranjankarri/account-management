export const validateRequiredFields = (newAccount) => {
  if (!newAccount.firstname) {
    return 'firstname is mandatory';
  }
  return '';
};

export const validateMobile = (mobileno) => {
  if(!mobileno){
    return 'Mobile no is mandatory';
  }
  if (!/^\d{10}$/.test(mobileno)) {
    return 'Mobile No must be 10 digits';
  }
  return '';
};

export const validateEmail = (email) => {
  // Simple validation to check if email ends with ".com" or ".in"
  if (!email.endsWith('.com') && !email.endsWith('.in')) {
    return 'Email must end with .com or .in';
  }
  
  // Check if email contains "@"
  if (!email.includes('@')) {
    return 'Email must contain "@"';
  }
  
  return '';
};


export const validatePassword = (password) => {
  // Password validation logic
  if (
    password.length < 8 ||
    password.length > 12 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    return 'Password must be between 8 and 12 characters and contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.';
  }
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !==confirmPassword) {
    return 'Password and confirm password do not match';
  }
  return '';
};