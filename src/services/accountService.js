class AccountService {
    async getAllAccounts() {
      try {
        const response = await fetch('/Dev/account', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          console.error('Failed to fetch accounts:', response.statusText);
          return [];
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        return [];
      }
    }
  
    async addAccount(newAccount) {
      try {
        const response = await fetch('/Dev/account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newAccount)
        });
        if (response.ok) {
          return true;
        } else {
          console.error('Failed to add new account:', response.statusText);
          return false;
        }
      } catch (error) {
        console.error('Error adding new account:', error);
        return false;
      }
    }
  
    async updateAccount(updatedAccount) {
      try {
        const response = await fetch(`/Dev/account`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedAccount)
        });
        if (response.ok) {
          return true;
        } else {
          console.error('Failed to update account:', response.statusText);
          return false;
        }
      } catch (error) {
        console.error('Error updating account:', error);
        return false;
      }
    }
  
    async deleteAccount(accountId) {
      try {
        const response = await fetch('/Dev/account', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: accountId })
        });
        if (response.ok) {
          return true;
        } else {
          console.error('Failed to delete account:', response.statusText);
          return false;
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        return false;
      }
    }
  }
  
  export default new AccountService();
  