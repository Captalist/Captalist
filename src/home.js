function openForm() {
    document.getElementById("join_popup").style.display = "block";
    closeCreateForm();
}

function closeForm() {
    document.getElementById('join_popup').style.display='none';
    document.getElementById('psw').value = '';
    document.getElementById('server_name').value = '';
}

function logout(){
    closeForm()
    closeCreateForm()
    ipcRenderer.send('LogOut', {})
}

function openCreateForm(){
    document.getElementById('create_popup').style.display='block';
    closeForm()
}

function closeCreateForm(){
    document.getElementById('create_popup').style.display='none';
    document.getElementById('create_server_psw').value = '';
    document.getElementById('create_server_name').value = '';
}

function joinServer(server_name=null, psw=null) {
    if (server_name == null){
        server_name =document.getElementById('server_name').value;
    }
    if (psw == null){
        psw = document.getElementById('psw').value;
    }
    fetch('https://captalistserver.learncode2.repl.co/join/server', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: user_ids,
            name: server_name,
            password: psw,
        }),
    }).then(res => {return res.json()})
    .then(data => {
        console.log(data)
        if (data.return == 'Failed, Your are not logged in'){
            document.getElementById('join_server_err').innerHTML = "You are not Logged In. Try joining server again in 30 seconds";
            ipcRenderer.send('relogin', {})
        }else if (data.return == 'You do not have a country in this server'){
            document.getElementById('join_server_err').innerHTML = 'Loading';
            // This will then take user to create a country
            closeForm()
            create_country(data.server_id, 'join_create', user_ids);
        }else if (data.return =='Server does not exist'){
            document.getElementById('join_server_err').innerHTML = 'Server does not exist'
        }else if (data.return == 'Success'){
            document.getElementById('join_server_err').innerHTML = 'Taking your to Server Now!';
            // This will take user to Server game
            ipcRenderer.send('GameOn', {'server_id': data.server_id})
        }else {
            document.getElementById('join_server_err').innerHTML = 'Problem Joining Server Please try again';
        }
    })
}

function CreateServer(){
    let server_name = document.getElementById('create_server_name').value;
    let psw = document.getElementById('create_server_psw').value

    fetch('https://captalistserver.learncode2.repl.co/create/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            id: user_ids,
            name: server_name,
            psw: psw
        })
    }).then(res => {return res.json()})
    .then(data=>{
        console.log(data)
        if (data.return == 'Server Already Exists'){
            document.getElementById('create_server_err').innerHTML = "Server already exists";
        }else if (data.return == 'Problem Creating Server'){
            document.getElementById('create_server_err').innerHTML = "Problem creating server";
        }else if(data.return == 'Server Created'){
            document.getElementById('create_server_err').innerHTML = "Server Created successfully";
            // This is where we would send the user to create a country screen
            closeCreateForm()
            create_country(data.server_id, 'join_create', user_ids);
        }else  {
            document.getElementById('create_server_err').innerHTML = 'Problem creating server';
        }
    })
}

function add_to_your_Servers(data){
    let your_server_div = document.getElementById('your_server');

    div_conts = document.createElement('div');
    div_conts.className = "Server_Data_Cont";

    let div_but = document.createElement('button');  

    let div_p =  document.createElement('p');
    div_p.innerHTML = "Name of Server: "+ data.Name;
    div_but.appendChild(div_p);

    let div_p1 = document.createElement('p');
    div_p1.innerHTML = "Server Code: "+ data.Code;
    div_but.appendChild(div_p1);

    let div_p2 = document.createElement('p');
    div_p2.innerHTML = "Amount Of People Online: "+ data.Count;
    div_but.appendChild(div_p2);

    div_but.appendChild(div_p2);
    div_but.className = 'Server_Data_But';
    div_but.onclick = function(event){
        joinServer(data.Name, data.Code)
    }
    div_conts.appendChild(div_but);

    your_server_div.appendChild(div_conts);
}

function add_to_others_servers(data) {
    let other_server_div = document.getElementById('other_server');

    div_conts = document.createElement('div');
    div_conts.className = "Server_Data_Cont";

    let div_but = document.createElement('button');
    
    let div_p =  document.createElement('p');
    div_p.innerHTML = "Name of Server: "+ data.Name;
    div_but.appendChild(div_p);

    div_p = document.createElement('p');
    div_p.innerHTML = "Server Code: "+ data.Code;
    div_but.appendChild(div_p);

    div_p = document.createElement('p');
    div_p.innerHTML = "Amount Of People Online: "+ data.Count;
    div_but.appendChild(div_p);

    div_p = document.createElement('p');
    div_p.innerHTML = "Owner: "+ data.Owner;
    div_but.appendChild(div_p);
    div_but.className = 'Server_Data_But';
    div_but.onclick = function(event){
        joinServer(data.Name, data.Code)
    }

    div_conts.appendChild(div_but);

    other_server_div.appendChild(div_conts);
}

