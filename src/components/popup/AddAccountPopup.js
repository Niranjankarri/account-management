import React, { useState, useEffect } from 'react';
import './AddAccountPopup.css';
import { validateEmail, validatePassword, validateConfirmPassword, validateRequiredFields, validateMobile } from '../../utils/validator';
import accountService from '../../services/accountService';

function AddAccountPopup({ showPopup, setShowPopup, handleInputChange, fetchAccounts, newAccount, setNewAccount}) {
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [requiredFieldsError, setRequiredFieldsError] = useState('');
  const [mobileError, setMobileError] = useState('');

  const handleAdd = async () => {

    const requiredFieldsValidatorError = validateRequiredFields(newAccount);
    const emailValidationError = validateEmail(newAccount.email);
    const passwordValidationError = validatePassword(newAccount.password);
    const confirmPasswordValidationError= validateConfirmPassword(newAccount.password, newAccount.confirmPassword);
    const mobileValidationError= validateMobile(newAccount.mobileno);

    if (requiredFieldsValidatorError) {
      setRequiredFieldsError(requiredFieldsValidatorError);
      return;
    }else{
      setRequiredFieldsError('');
    }

    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }else{
      setEmailError('');
    }

    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }else{
      setPasswordError('');
    }

    if (confirmPasswordValidationError) {
      setPasswordError(confirmPasswordValidationError);
      return;
    }else{
      setPasswordError('');
    }

    if(mobileValidationError){
      setMobileError(mobileValidationError);
      return;
    }else{
      setMobileError('');
    }

    try {
        await accountService.addAccount(newAccount);
        setShowPopup(false);
        setNewAccount({
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          confirmPassword: '', // Clear confirm password field after successful save
          mobileno: ''
        });
        fetchAccounts();
      } catch (error) {
        console.error('Error adding new account:', error);
      }
  };

  return (
    <>
      {showPopup && (
        <div class="popup-container">
          <div class="popup">
            <div class="popup-content">
              <h2>Add Account</h2>
              <input type="text" name="firstname" value={newAccount.firstname} onChange={(e) => handleInputChange(e)} placeholder="First Name *" />
              {requiredFieldsError && <p className="error">{requiredFieldsError}</p>}
              <input type="text" name="lastname" value={newAccount.lastname} onChange={(e) => handleInputChange(e)} placeholder="Last Name" />
              <input type="text" name="email" value={newAccount.email} onChange={(e) => handleInputChange(e)} placeholder="Email *" />
              {emailError && <p className="error">{emailError}</p>}
              <input type="password" name="password" value={newAccount.password} onChange={(e) => handleInputChange(e)} placeholder="Password *" />
              <input type="password" name="confirmPassword" value={newAccount.confirmPassword} onChange={(e) => handleInputChange(e)} placeholder="Confirm Password *" />
              {passwordError && <p className="error">{passwordError}</p>}
              <input type="text" name="mobileno" value={newAccount.mobileno} onChange={(e) => handleInputChange(e)} placeholder="Mobile No *" />
              {mobileError && <p className="error">{mobileError}</p>}
              <div class="button-groups">
                <button className="button-save" onClick={handleAdd}>Save</button>
                <button className="button-cancel" onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>

      )}
    </>
  );
}

export default AddAccountPopup;
