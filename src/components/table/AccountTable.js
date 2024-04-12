import React, { useState, useEffect } from 'react';
import './AccountTable.css'; 
import AddAccountPopup from '../popup/AddAccountPopup';
import accountService from '../../services/accountService';

function AccountTable() {
  const [accounts, setAccounts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editStatus, setEditStatus] = useState({});
  const [visiblePasswordIndex, setVisiblePasswordIndex] = useState(null);
  const [newAccount, setNewAccount] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileno: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await accountService.getAllAccounts();
      setAccounts(data);
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
    }else {
      setNewAccount({ ...newAccount, [name]: value });
    }
  };

  const handleDelete = async (accountId) => {
    try {
      await accountService.deleteAccount(accountId);
      fetchAccounts();
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
      await accountService.updateAccount(updatedAccount);
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
    <div class="header-container">
    <h1 class="header-title">Account Management</h1>
  </div>
    <div class="add-account-container">
    <button class="btn add" onClick={() => setShowPopup(true)}>
      <i class="fas fa-plus"></i> Add Account
    </button>
  </div>
      {showPopup && (
        <AddAccountPopup
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          handleInputChange={handleInputChange}
          fetchAccounts={fetchAccounts}
          newAccount={newAccount}
          setNewAccount={setNewAccount}
        />
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
                          type="text"
                          name="password"
                          value={account.password}
                          onChange={e => handleInputChange(e, index)}
                        />
                      </div>
                    ) : (
                      <div className="password">
                        {visiblePasswordIndex === index ? (
                          account.password
                        ) : (
                          "******** "
                        )}
                        <i
                          className={visiblePasswordIndex === index ? "fas fa-lock-open" : "fas fa-lock"}
                          onClick={() => togglePasswordVisibility(index)}
                        ></i>
                      </div>
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