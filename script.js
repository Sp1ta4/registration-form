const form = document.getElementById('form');
const inputs = [...form.querySelectorAll('.form-control')];
const tableBody = document.querySelector('#tableBody');
let usersData = [];
let userNumber;

getUsers().then(res => {
    usersData = res;
    userNumber = usersData.at(-1)?.number + 1 || 1;
    renderUsers(res)
})

function onRegistration() {
    const user = getInputsValueFromFormInputs(inputs);
    createUser(user).then((res) => {
        usersData.push(res);
        renderUsers(usersData);
        clearInputs();
    })
}

function getInputsValueFromFormInputs(inputs) {
    const user = {}
    inputs.forEach(input => {
        if (input.value) {
            user[input.name] = input.value;
        } else {
            console.error('write all inputs');
            return
        }
    });
    user.number = userNumber++;
    return user;
}

function clearInputs() {
    inputs.forEach(input => input.value = '');
}

function renderUsers(users) {
    const usersElem = users.map(user => {
        return (
            `<tr id="${user.id}">
                <th scope="row">${user.number}</th>
                <td>
                    <div class="d-flex flex-column">
                        <span class="fs-5" id="name">${user.name}</span>
                    </div>
                </td>
                <td>
                    <div class="d-flex flex-column">
                        <span class="fs-5" id="lastname">${user.lastname}</span>
                    </div>
                </td>
                <td>
                    <div class="d-flex flex-column">
                        <span class="fs-5" id="age">${user.age}</span>
                    </div>
                </td>

                <td>
                    <button class="btn btn-primary" onclick="onDeleteUser('${user.id}')">Delete
                    </button>
                    <button class="btn btn-primary" onclick="onEditUser('${user.id}')">Edit
                    </button>
                </td>
            </tr>
            <tr class="d-none">
                <th scope="row">${user.number}</th>
                <td>
                    <div class="d-flex flex-column">
                        <span class="fs-5 edited-inputs border rounded border-secondary" id="name" contenteditable>${user.name}</span>
                    </div>
                </td>
                <td>
                    <div class="d-flex flex-column">
                        <span class="fs-5 edited-inputs border rounded border-secondary" id="lastname" contenteditable>${user.lastname}</span>
                    </div>
                </td>
                <td>
                    <div class="d-flex flex-column">
                        <span class="fs-5 edited-inputs border rounded border-secondary" id="age" contenteditable>${user.age}</span>
                    </div>
                </td>
                <td>
                    <button class="btn btn-danger" onclick="onCancelEdits('${user.id}')">Cancel
                    </button>
                    <button class="btn btn-success" onclick="onSaveEdits('${user.id}')">Save
                    </button>
                </td>
            </tr>
            `);
    })
    tableBody.innerHTML = usersElem.join('');
}
function onDeleteUser(id) {
    deleteUser(id).then(() => {
        usersData = usersData.filter(user => user.id !== id);
        renderUsers(usersData);
    }).catch(err => {
        alert('User not found');
        getUsers().then(res => {
            usersData = res;
            userNumber = usersData.length + 1;
            renderUsers(res)
        })
        console.log(err);
    });
}
function onEditUser(id) {
    const userTd = document.getElementById(id);
    userTd.classList.add('d-none');
    userTd.nextElementSibling.classList.remove('d-none');
}
function onSaveEdits(id) {
    const editedUser = getEditedValues(id);
    usersData = usersData.map(user => user.id === id ? editedUser : user);
    editUser(editedUser);
    renderUsers(usersData);
}
function getEditedValues(id) {
    const userNumber = document.getElementById(`${id}`).firstElementChild.innerText;
    const allInputs = [...document.getElementsByClassName('edited-inputs')];
    const currentUserInputs = takeFromTheInputs(allInputs, userNumber);
    const user = {}
    currentUserInputs.forEach(input => {
        if (input.textContent) {
            user[input.id] = input.textContent;
        } else {
            console.error('write all inputs');
            return;
        }
    });
    user.id = id;
    user.number = userNumber;
    return user;
}
function takeFromTheInputs(inputs, userNumber) {
    const countOfInputs = 3;
    const startIndex = (userNumber - 1) * countOfInputs;
    const endIndex = startIndex + (startIndex + countOfInputs);
    return inputs.slice(startIndex, endIndex);
}
function onCancelEdits() {
    renderUsers(usersData);
}
function editValueInTable(event, isSaved) {
    event.stopPropagation()
    const previousElem = event.target.previousElementSibling;
    const name = previousElem.id;
    if (isSaved) {
        event.target.parentElement.innerHTML = `
        <input type="text" aria-label="First name" id="${name}" class="form-control w-50" value="${previousElem.innerText}">
        <span class="edit-btn" onclick="editValueInTable(event, false)">save</span>
        `;
    } else {
        const id = event.target.parentNode.parentElement.parentElement.id;
        event.target.parentElement.innerHTML = `
                <span class="fs-5" id="${name}">${previousElem.value}</span>
                <span class="edit-btn" onclick="editValueInTable(event, true)">edit</span> 
        `;
        const user = usersData.find(user => user.id === id);
        user[name] = previousElem.value;
        editUser(user);
    }
}