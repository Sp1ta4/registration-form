const URL = "http://localhost:3000";
async function createUser(user) {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(`${URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    })
    if (response.ok) {
      try {
        const user = await response.json();
        resolve(user);
      } catch {
        reject('no JSON');
      }
    } else {
      try {
        let error = await response.json();
        reject(error);
      } catch (error) {
        reject({
          message: error,
          status: response.status
        })
      }
    }
  })
}
async function getUsers() {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(`${URL}/users`, {
      method: "GET"
    });
    if (response.ok) {
      try {
        const data = await response.json();
        resolve(data);
      } catch {
        reject('no JSON');
      }
    } else {
      try {
        let error = await response.json();
        reject(error);
      } catch (error) {
        reject({
          message: error,
          status: response.status
        })
      }
    }
  })
}
function deleteUser(id) {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(`${URL}/users/${id}`, {
      method: "DELETE"
    })
    if (response.ok) {
      try {
        let isDeleted = await response.json();
        resolve(isDeleted);
      } catch {
        reject('no JSON')
      }
    } else {
      try {
        let error = await response.json();
        reject(error);
      } catch (error) {
        reject({
          message: error,
          status: response.status
        })
      }
    }
  })
}
async function editUser(user) {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(`${URL}/users`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (response.ok) {
      try {
        const editedUser = response.json()
        resolve(editedUser);
      } catch (error) {
        reject('No JSON');
      }
    } else {
      try {
        let error = await response.json();
        reject(error);
      } catch (error) {
        reject({
          message: error,
          status: response.status
        })
      }
    }
  })
}