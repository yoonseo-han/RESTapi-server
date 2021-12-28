
//When refresh page, get user info from the server
async function getUser() {
    try {
        //Get data stored in following URL from server
        //Note that URL address for GET and POST,PUT is different
        const res = await axios.get('/users');
        //Array that stores data of each user
        const users = res.data;
        const list = document.getElementById('list');
        list.innerHTML ='';
        //Show user to webpage and link events
        //keys : return array of parameter objects properties
        //map : executes callback function for every element in array and replace value
        //key : array iterator
        Object.keys(users).map(function (key) {
            const userDiv = document.createElement('div');
            const span = document.createElement('span');
            //Get data from users for each user and insert data(username) into span
            span.textContent = users[key];
            console.log('hello');
            //New button to edit username data
            const edit = document.createElement('button');
            edit.innerText = 'Change';
            edit.addEventListener('click', async () => {
                console.log(key);
                const username = prompt('Type the new username');
                if(!username) {
                    return alert('Must type a username');
                }
                try {
                    //PUT request to replace the data stored in server
                    //Following data stored in URL : /user/username key value
                    await axios.put('/user/' + key, {username : username});
                    //call getUSer() to update change
                    getUser();
                } catch(err) {
                    console.log(err);
                }
            });
            //Add remove button for each user
            const remove = document.createElement('button');
            remove.innerText = 'Remove';
            remove.addEventListener('click', async () => {
                try {
                    //Send delete request
                    await axios.delete('/user/' + key);
                    //call function again to update change
                    getUser();
                } catch(err) {
                    console.log(err);
                }
            });
            //Add class to components
            span.classList.add('col-sm-4', 'bg-light' , 'mx-2');
            edit.classList.add('col-sm-2', 'ml-2');
            remove.classList.add('col-sm-2', 'ml-1');
            //Append each user element in array to webpage screen
            userDiv.appendChild(span);
            userDiv.appendChild(edit);
            userDiv.appendChild(remove);
            //Add class name in list for bootstarp
            userDiv.classList.add('row', 'my-4', 'justify-content-md-center');
            console.log(userDiv.classList);
            //Add username data to list in page
            list.appendChild(userDiv);
        });
    } catch(err) {
        console.log(err);
    }
};

//When refresh page, get user info from the server
window.onload = getUser();

//When submit form, send post request to add data to server
document.getElementById('form').addEventListener('submit', async (event)=> {
    event.preventDefault();

    const username = document.getElementById('username').value;
    if(!username) {
        return alert('Type a username');
    } 

    //Send POST request to store data into server
    try {
        await axios.post('/user', {username : username});
        getUser();
    } catch(err) {
        console.log(err);
    }

    //After submitting, turn the submit form blank
    document.getElementById('username').value = '';
}); 

