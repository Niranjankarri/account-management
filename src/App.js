import React, { useState, useEffect } from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.css';

function AccountTable() {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileno: ''
  });
  const [showPopup, setShowPopup] = useState(false);
  const [editStatus, setEditStatus] = useState({});
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [visiblePasswordIndex, setVisiblePasswordIndex] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/Dev/account', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      } else {
        console.error('Failed to fetch accounts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const updatedAccounts = [...accounts];
      updatedAccounts[index][name] = value;
      setAccounts(updatedAccounts);
    } else {
      setNewAccount({ ...newAccount, [name]: value });
    }
  };

  const validateEmail = (email) => {
    // Simple validation to check if email ends with ".com" or ".in"
    if (!email.endsWith('.com') && !email.endsWith('.in')) {
      setEmailError('Email must end with .com or .in');
      return false;
    }
    return true;
  };

  const validatePassword = (password) => {
    // Password validation logic
    if (
      password.length < 8 ||
      password.length > 12 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setPasswordError('Password must be between 8 and 12 characters and contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.');
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateEmail(newAccount.email)) {
      return;
    }

    if (newAccount.password !== newAccount.confirmPassword) {
      setPasswordError('Password and confirm password do not match');
      return;
    }

    if (!validatePassword(newAccount.password)) {
      return;
    }

    // If all validations pass, proceed with adding the account
    try {
      const response = await fetch('/Dev/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAccount)
      });
      if (response.ok) {
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
      } else {
        throw new Error('Failed to add new account');
      }
    } catch (error) {
      console.error('Error adding new account:', error);
    }
  };

  const handleDelete = async (accountId) => {
    try {
      const response = await fetch('/Dev/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: accountId })
      });
      if (response.ok) {
        fetchAccounts();
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleEdit = (index) => {
    setEditStatus({ ...editStatus, [index]: true });
  };

  const handleSave = async (index) => {
    setEditStatus({ ...editStatus, [index]: false });
    const updatedAccount = accounts[index];
    try {
      const response = await fetch(`/Dev/account`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAccount)
      });
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleCancel = (index) => {
    setEditStatus({ ...editStatus, [index]: false });
  };

  const togglePasswordVisibility = (index) => {
    if (visiblePasswordIndex === index) {
      setVisiblePasswordIndex(null); // Hide password if already visible
    } else {
      setVisiblePasswordIndex(index); // Show password for the selected record
    }
  };

  return (
    <div className="account-container">
      <h2>Account Management</h2>
      <button className="btn add" onClick={() => setShowPopup(true)}>
        <i className="fas fa-plus"></i> Add Account
      </button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add New Account</h2>
            <input type="text" name="firstname" value={newAccount.firstname} onChange={(e) => handleInputChange(e)} placeholder="First Name" />
            <input type="text" name="lastname" value={newAccount.lastname} onChange={(e) => handleInputChange(e)} placeholder="Last Name" />
            <input type="text" name="email" value={newAccount.email} onChange={(e) => handleInputChange(e)} placeholder="Email" />
            {emailError && <p className="error">{emailError}</p>}
            <input type="password" name="password" value={newAccount.password} onChange={(e) => handleInputChange(e)} placeholder="Password" />
            <input type="password" name="confirmPassword" value={newAccount.confirmPassword} onChange={(e) => handleInputChange(e)} placeholder="Confirm Password" />
            {passwordError && <p className="error">{passwordError}</p>}
            <input type="text" name="mobileno" value={newAccount.mobileno} onChange={(e) => handleInputChange(e)} placeholder="Mobile No" />
            <div className="button-group">
              <button onClick={handleAdd}>Save</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="account-card">
        <div className="account-table-container">
          <table className="account-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Mobile No</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, index) => (
                <tr key={index}>
                  <td>{account.id}</td>
                  <td>
                    {editStatus[index] ? (
                      <input
                        className="input-field"
                        type="text"
                        name="firstname"
                        value={account.firstname}
                        onChange={e => handleInputChange(e, index)}
                      />
                    ) : (
                      account.firstname
                    )}
                  </td>
                  <td>
                    {editStatus[index] ? (
                      <input
                        className="input-field"
                        type="text"
                        name="lastname"
                        value={account.lastname}
                        onChange={e => handleInputChange(e, index)}
                      />
                    ) : (
                      account.lastname
                    )}
                  </td>
                  <td>
                    {editStatus[index] ? (
                      <input
                        className="input-field"
                        type="text"
                        name="email"
                        value={account.email}
                        onChange={e => handleInputChange(e, index)}
                      />
                    ) : (
                      account.email
                    )}
                  </td>
                  <td>
                    {editStatus[index] ? (
                      <div className="password-field">
                        <input
                          className="input-field"
                          type={visiblePasswordIndex === index ? "text" : "password"}
                          name="password"
                          value={account.password}
                          onChange={e => handleInputChange(e, index)}
                        />
                        <i className={visiblePasswordIndex === index ? "fas fa-eye-slash password-icon" : "fas fa-eye password-icon"} onClick={() => togglePasswordVisibility(index)}></i>
                      </div>
                    ) : (
                      visiblePasswordIndex === index ? account.password : "********"
                    )}
                  </td>
                  <td>
                    {editStatus[index] ? (
                      <input
                        className="input-field"
                        type="text"
                        name="mobileno"
                        value={account.mobileno}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      account.mobileno
                    )}
                  </td>
                  <td>
                    {editStatus[index] ? (
                      <div className="button-group">
                        <button className="btn save" onClick={() => handleSave(index)}>
                          <i className="fas fa-check"></i> Save
                        </button>
                        <button className="btn cancel" onClick={() => handleCancel(index)}>
                          <i className="fas fa-times"></i> Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="button-group">
                        <button className="btn edit" onClick={() => handleEdit(index)}>
                          <i className="fas fa-pencil-alt"></i> Edit
                        </button>
                        <button className="btn delete" onClick={() => handleDelete(account.id)}>
                          <i className="fa fa-trash"></i> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AccountTable;
