import React, { useState, useEffect } from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.css';

function AccountTable() {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });
  const [editStatus, setEditStatus] = useState({});
  const [originalAccounts, setOriginalAccounts] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/Development/account', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
        setOriginalAccounts(data);
      } else {
        console.error('Failed to fetch accounts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedAccounts = [...accounts];
    updatedAccounts[index] = { ...updatedAccounts[index], [name]: value };
    setAccounts(updatedAccounts);
  };

  const handleDelete = async (index) => {
    const accountIdToDelete = accounts[index].id;
    const updatedAccounts = [...accounts];
    updatedAccounts.splice(index, 1);
    setAccounts(updatedAccounts);
    try {
      const response = await fetch('/Development/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: accountIdToDelete })
      });
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      // Revert changes if delete operation fails
      setAccounts(originalAccounts);
    }
  };

  const handleEdit = index => {
    setEditStatus({ ...editStatus, [index]: true });
  };

  const handleSave = async index => {
    setEditStatus({ ...editStatus, [index]: false });
    const updatedAccount = accounts[index];
    try {
      const response = await fetch(`/Development/account`, {
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
      // Revert changes if save operation fails
      setAccounts(originalAccounts);
    }
  };

  const handleCancel = index => {
    setAccounts(originalAccounts);
    setEditStatus({ ...editStatus, [index]: false });
  };

  const handleAdd = async () => {
    if (!newAccount.firstname || !newAccount.email || !newAccount.password) {
      setButtonClicked(true);
      return; // Exit early if required fields are not provided
    }
    try {
      const response = await fetch('/Development/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAccount)
      });
      if (response.ok) {
        setButtonClicked(false);
        const data = await response.json();
        newAccount.id=data.id;
        setAccounts([...accounts, newAccount]);
        setNewAccount({
          id: '',
          firstname: '',
          lastname: '',
          email: '',
          password: ''
        });
      } else {
        throw new Error('Failed to add new account');
      }
    } catch (error) {
      console.error('Error adding new account:', error);
    }
  };

  return (
    <div className="account-container">
      <h2>Account Management</h2>
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
                      <input
                        className="input-field"
                        type="text"
                        name="password"
                        value={account.password}
                        onChange={e => handleInputChange(e, index)}
                      />
                    ) : (
                      account.password
                    )}
                  </td>
                  <td>
                    {editStatus[index] ? (
                      <>
                        <button className="btn save" onClick={() => handleSave(index)}>
                          <i className="fas fa-check"></i>
                        </button>
                        <button className="btn cancel" onClick={() => handleCancel(index)}>
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    ) : (
                      <div className="icon-group">
                      <button className="btn edit" onClick={() => handleEdit(index)}>
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button className="btn delete" onClick={() => handleDelete(index)}>
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td>{newAccount.id}</td>
                <td>
                  <input
                    className={`input-field ${buttonClicked && !newAccount.firstname ? 'red-highlight' : ''}`}
                    type="text"
                    name="firstname"
                    value={newAccount.firstname}
                    onChange={e => setNewAccount({ ...newAccount, firstname: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    className="input-field"
                    type="text"
                    name="lastname"
                    value={newAccount.lastname}
                    onChange={e => setNewAccount({ ...newAccount, lastname: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    className={`input-field ${buttonClicked && !newAccount.email ? 'red-highlight' : ''}`}
                    type="text"
                    name="email"
                    value={newAccount.email}
                    onChange={e => setNewAccount({ ...newAccount, email: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    className={`input-field ${buttonClicked && !newAccount.password ? 'red-highlight' : ''}`}
                    type="text"
                    name="password"
                    value={newAccount.password}
                    onChange={e => setNewAccount({ ...newAccount, password: e.target.value })}
                  />
                </td>
                <td>
                  <button className="btn add" onClick={handleAdd}>
                    <i className="fas fa-plus"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AccountTable;
