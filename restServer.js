//REST : Representational State Transfer
//Defines the resources in server and assigns the address of resources
//It contains protocols regarding the server functions

const http = require('http');
const fs = require('fs').promises;

//To store data : Store objects of data
//Used as replace of Database
const users ={};

http.createServer(async(req, res) => {
    try {
        console.log(req.method, req.url);
        //Server protocol when GET request received
        if(req.method === 'GET') {
            //For homepage
            if(req.url === '/') {
                const data = await fs.readFile('./frontEnd/restFront.html');
                res.writeHead(200, {'Content-Type' : 'text/html'});
                //Put return to end the current function
                return res.end(data);
            } else if(req.url === '/about') {
                const data = await fs.readFile('./frontEnd/about.html');
                res.writeHead(200, {'Content-Type' : 'text/html'});
                return res.end(data);
            } else if(req.url === '/users') {
                res.writeHead(200, {'Content-Type' : 'text/plain'});
                return res.end(JSON.stringify(users));
            }

            //If url is neither / nor /about
            try {
                //Respond the file that the URL requested : can be any form from .css to .js file
                const data = await fs.readFile(`./frontEnd${req.url}`);
                return res.end(data);
            } catch(err) {
                //404 Notfound error occured when requested not existing file
                //console.log(err);
            }
        }

        //For POST request : Add new data to server
        else if(req.method === 'POST') {
            if(req.url === '/user') {
                let body ='';
                //Receive the body of request in the form of stream
                //req and res : Has readStream inside object therefore can receive data in the form of stream using .on(data)
                req.on('data', (data)=> {
                    body += data;
                });
                console.log(body);
                //After receiving all data in body, execute
                //Able to use .on('end'), due to the writeSteam inside both req and res
                return req.on('end', () => {
                    console.log('Body of request : ', body);
                    const {username} = JSON.parse(body);
                    const id = Date.now();
                    users[id] = username;
                    res.writeHead(201);
                    res.end('Data added');
                });
            }
        }

        //For PUT request : change data of already existing user
        else if(req.method === 'PUT') {
            if(req.url.startsWith('/user/')) {
                //Get the key value of the username
                const key = req.url.split('/')[2];
                console.log("KEYKEY",key);
                let body ='';
                //New body adds the data to replace the original
                req.on('data', (data) => {
                    body +=data;
                });
                //After receiving all data, replace the body
                return req.on('end', ()=> {
                    console.log('PUT body : ', body);
                    //Replace the value stored in array : change the string to object using parse()
                    users[key] = JSON.parse(body).username;
                    //Return the new user in form of string -> JSON format
                    return res.end(JSON.stringify(users));
                });
            }
        }

        //For DELETE request
        else if(req.method === 'DELETE') {
            if(req.url.startsWith('/user/')){
                const key = req.url.split('/')[2];
                //Delete the following user in respective key
                delete users[key];
                return res.end(JSON.stringify(users));
            }
        }
    } catch(err) {
        console.log(err);
        res.writeHead(500, {'Content-Type' : 'text/plain'});
        res.end(err.message);
    }
})
    .listen(8080, ()=> {
        console.log('Server connected to port 8080');
    }); 