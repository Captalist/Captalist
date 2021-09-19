const ipcRenderer = require('electron').ipcRenderer;

function city(server_id, user_id) {
    let main_content = document.getElementById('main_content');
    main_content.innerHTML= `
        <div class='create_city'>
            <input type="text" class="text" placeholder='Create a New City' name='create_new_city_label' id='new_city_input' required>
            <button onclick='create_new_city(${server_id}, ${user_id})'>Create New City</button>
        </div>
    
    `;
    fetch('https://captalistserver.learncode2.repl.co/get/city/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            user_id: user_id,
            server_id: server_id
        })
    }).then(res => {return res.json()})
    .then(data => {
        console.log(data)
        if (data.return == 'Server does not exist'){
            main_content.innerHTML = data.return;
        }else if (data.return == 'User does not exist'){
            main_content.innerHTML = "You are not logged in. Logging you in now";
            ipcRenderer.send('relogin', {})
        }else if (data.return  == 'Success'){
            let new_data = data.data;
            let new_d_keys = Object.keys(new_data);
            for (var i = 0; i < new_d_keys.length; i++){
                let key_data = new_data[new_d_keys[i]];
                let button = document.createElement('button');
                button.className = 'CityButton';
                button.id = new_d_keys[i]+'_button';
                button.onclick = function(){
                    city_details(key_data, server_id)
                }
                let da = ['Name', 'Population', 'Tax', 'Max Population', 'Level']
                for (var li =0; li < da.length; li++){
                    li_data = key_data[da[li]];
                    let pi = document.createElement('p');
                    pi.innerHTML =da[li]+': '+ li_data;
                    pi.id = new_d_keys[i]+"_"+da[li];
                    pi.className = 'CityDatas';
                    button.appendChild(pi)
                }
                main_content.appendChild(button)
            }
        }
    })
}

ipcRenderer.on('TryAgain', (event, data)=>{
    city(data.server_id, data.user_id)
})

function city_details(data, server) {
    console.log("CITY DETAIL WAS CLICKED")
    console.log(data);
    let main_content = document.getElementById('main_content');
    main_content.innerHTML = `
    <div>
        <div class='div-block'>
            <div>${flag_img.innerHTML}</div>
            <h4 id='City_det_name_${data.id}'>
                Name: ${data.Name} 
                <button onclick='change_name(${data.id}, ${server})'>Change Name</button>
            </h4>
            <h4 id='City_det_pop_${data.id}'>
                Population: ${data.Population}
            </h4>
            <h4 id='City_det_tax_${data.id}'>
                Tax: 
                <button onclick='subtract_tax(${data.id}, ${data.Tax})'>-</button>
                ${data.Tax}
                <button onclick='add_tax(${data.id}, ${data.Tax})'>+</button>
            </h4>
        </div>
        <div id='city_det_err' style='text-align:center; font-size: 15px;'></div>
        <div class='city_det_main_div'>
            <h4 id='City_det_level_${data.id}' class='city_det_main_content'>
                Level: ${data.Level}
                <button onclick='add_level(${data.id})'>+</button>
            </h4>
            <h4 id='City_det_max_pop_${data.id}' class='city_det_main_content'>
                Max Population: ${data['Max Population']}
            </h4>
            <h4 id='City_det_oil_${data.id}' class='city_det_main_content'>
                Amount of Oil Miners:
                <button onclick='remove_oil(${data.id})'>-</button>
                ${data.oil}
                <button onclick='add_oil(${data.id})'>+</button>
            </h4>
            <h4 id='City_det_food_${data.id}' class='city_det_main_content'> 
                Amount of Food Manufactures: 
                <button onclick='remove_food(${data.id})'>-</button>
                ${data.food}
                <button onclick='add_food(${data.id})'>+</button>
            </h4>
            <h4 id='City_det_iron_${data.id}' class='city_det_main_content'>
                Amount of Iron Manufactures:
                <button onclick='remove_iron(${data.id})'>-</button>
                ${data.iron}
                <button onclick='add_iron(${data.id})'>+</button>
            </h4>
            <h4 id='City_det_water_${data.id}' class='city_det_main_content'>
                Amount of Water Companies:
                <button onclick='remove_water(${data.id})'>-</button>
                ${data.water}
                <button onclick='add_water(${data.id})'>+</button>
            </h4>
        </div>
    </div>
    `
}

/** 
    * Sends Post Request to server 
    * @param options dict form options needed to be sent to server
    * @param callback function to run once result is received
    * @param other_link The defualt link the function checks is https://captalistserver.learncode2.repl.co/change/city/data, 
    but if you want to check another link, it will add that link to the following string 
    https://captalistserver.learncode2.repl.co/ then send post request to that link
*/
function send_infor_server(options, callback, other_link=null) {
    if (other_link == null){
        fetch('https://captalistserver.learncode2.repl.co/change/city/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(options)
        }).then(res =>  res.json())
        .then(new_da => {
            callback(new_da)
        })
    }else{
        fetch('https://captalistserver.learncode2.repl.co/'+other_link, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(options)
        }).then(res => res.json())
        .then(new_da => {
            callback(new_da);
        })
    }
}

function add_water(id){
    console.log("We are in add water")
    console.log(id)
    send_infor_server({id: id, action: 'add_water'}, result=>{
        document.getElementById(`City_det_water_${id}`).innerHTML = `
        Amount of Water Companies:
        <button onclick='remove_water(${id})'>-</button>
        ${result.water}
        <button onclick='add_water(${id})'>+</button>
        `
    })
}

function remove_water(id){
    console.log("We are in remove water")
    console.log(id)
    send_infor_server({id: id, action: 'remove_water'}, result=>{
        document.getElementById(`City_det_water_${id}`).innerHTML = `
        Amount of Water Companies:
        <button onclick='remove_water(${id})'>-</button>
        ${result.water}
        <button onclick='add_water(${id})'>+</button>
        `
    })
}

function add_oil(id){
    console.log("We are in add oil");
    console.log(id)
    send_infor_server({id: id, action: 'add_oil'}, result=>{
        console.log(result)
        document.getElementById(`City_det_oil_${id}`).innerHTML = `
        Amount of Oil Miners:
        <button onclick='remove_oil(${id})'>-</button>
        ${result.oil}
        <button onclick='add_oil(${id})'>+</button>
        `
    })
}

function remove_oil(id) {
    console.log('We are in remove oil');
    console.log(id)
    send_infor_server({id: id, action: 'remove_oil'}, result=>{
        console.log(result)
        document.getElementById(`City_det_oil_${id}`).innerHTML = `
        Amount of Oil Miners:
        <button onclick='remove_oil(${id})'>-</button>
        ${result.oil}
        <button onclick='add_oil(${id})'>+</button>
        `
    })
}

function add_iron(id){
    console.log("We are in add iron")
    console.log(id)
    send_infor_server({id: id, action: 'add_iron'}, result=>{
        document.getElementById(`City_det_iron_${id}`).innerHTML = `
        Amount of Iron Manufactures:
        <button onclick='remove_iron(${id})'>-</button>
        ${result.iron}
        <button onclick='add_iron(${id})'>+</button>
    `
    })
}

function remove_iron(id){
    console.log("remove iron")
    console.log(id)
    send_infor_server({id: id, action: 'remove_iron'}, result=>{
        document.getElementById(`City_det_iron_${id}`).innerHTML = `
        Amount of Iron Manufactures:
        <button onclick='remove_iron(${id})'>-</button>
        ${result.iron}
        <button onclick='add_iron(${id})'>+</button>
    `
    })
}
 
function add_food(id){
    console.log("We are in add food")
    console.log(id)
    send_infor_server({id: id, action: 'add_food'}, result => {
        console.log(result)
        document.getElementById(`City_det_food_${id}`).innerHTML = `
        Amount of Food Manufactures: 
        <button onclick='remove_food(${id})'>-</button>
        ${result.food}
        <button onclick='add_food(${id})'>+</button>
        `
    })
}

function add_level(id){
    console.log("We are in level")
    send_infor_server({id: id, action: 'change_level'}, result=>{
        console.log(result)
        if (result.return == 'You do not have enough money to upgrade city') {
            document.getElementById('city_det_err').innerHTML = `
            <b>${result.return}</b>
            `
        }else if(result.return  == 'Success') {
            document.getElementById(`City_det_level_${id}`).innerHTML= `
            Level: ${result.Level}
            <button onclick='add_level(${id})'>+</button>
            `

            document.getElementById(`City_det_max_pop_${id}`).innerHTML = `
            Max Population: ${result['Max Pop']}
            `
        }
    })
}

function add_tax(id, tax){
    console.log("We are in add tax");
    console.log(id)
    new_tax = tax + 0.25;
    if (new_tax > 1) {
        new_tax = 1;
        send_infor_server({id: id, tax: new_tax, action:'change_tax'}, result=> {
            console.log(result)
            ids = `City_det_tax_${id}`
            document.getElementById(ids).innerHTML = `
                Tax:
                <button onclick='subtract_tax(${id}, ${new_tax})'>-</button>
                ${new_tax}
                <button onclick='add_tax(${id}, ${new_tax})'>+</button>
            `
        })
    }else {
        send_infor_server({id: id, tax: new_tax, action:'change_tax'}, result=> {
            console.log(result)
            ids = `City_det_tax_${id}`
            document.getElementById(ids).innerHTML = `
                Tax:
                <button onclick='subtract_tax(${id}, ${new_tax})'>-</button>
                ${new_tax}
                <button onclick='add_tax(${id}, ${new_tax})'>+</button>
            `
        })
    }
}

function change_name(id, server) {
    console.log("We are in change name")
    console.log(id)
    new_body = document.createElement('div');
    new_body.id= 'new_body';
    new_body.innerHTML =`
    <div>
        <div class='join_popup' id='create_popup'>
            <div class='join_container'>
                <h1>Change City Name</h1>

                <label for="name"><b>New City Name:</b></label>
                <input type="text" class='text' placeholder="Enter New Name" name='name' id='create_new_city_name' required>

                <div id='create_city_name_err'></div>
                <button type="submit" class="btn" onclick='ChangeName(${id}, ${server})' >Change Name</button>
                <button type="button" class="btn cancel" onclick='closeChangeForm()'>Close</button>
            </div>
        </div>
    </div>
    `
    document.getElementById('main_content').appendChild(new_body)
}

function subtract_tax(id, tax){
    console.log('We are in subtract tax')
    console.log(id)
    new_tax = tax - 0.25;
    if (new_tax < 0) {
        new_tax = 0;
        send_infor_server({id: id, tax: new_tax, action:'change_tax'}, result=> {
            console.log(result)
            ids = `City_det_tax_${id}`
            document.getElementById(ids).innerHTML = `
                Tax:
                <button onclick='subtract_tax(${id}, ${new_tax})'>-</button>
                ${new_tax}
                <button onclick='add_tax(${id}, ${new_tax})'>+</button>
            `
        })
    }else {
        send_infor_server({id: id, tax: new_tax, action:'change_tax'}, result=> {
            console.log(result)
            ids = `City_det_tax_${id}`
            document.getElementById(ids).innerHTML = `
                Tax:
                <button onclick='subtract_tax(${id}, ${new_tax})'>-</button>
                ${new_tax}
                <button onclick='add_tax(${id}, ${new_tax})'>+</button>
            `
        })
    }
}

function remove_food(id) {
    console.log("We are in remove food")
    console.log(id)
    send_infor_server({id: id, action: 'remove_food'}, result => {
        console.log(result)
        document.getElementById(`City_det_food_${id}`).innerHTML = `
        Amount of Food Manufactures: 
        <button onclick='remove_food(${id})'>-</button>
        ${result.food}
        <button onclick='add_food(${id})'>+</button>
        `
    })
}

function closeChangeForm() {
    let popup = document.getElementById('new_body')
    try {
        popup.remove();
    }catch (err) {console.log(err)}
}

function ChangeName(id, server) {
    let new_name = document.getElementById('create_new_city_name').value;
    if (new_name.length != 0){
        socket.emit('change_name', {id: id, name: new_name, 'room': server})
        send_infor_server({id: id, name: new_name, action: 'change_name'}, function(result) {
            console.log(result)
            document.getElementById('City_det_name_'+id).innerHTML = `Name: ${new_name} <button onclick='change_name(${id}, ${server})'>Change Name</button>`
            closeChangeForm()
        })
    }else {
        document.getElementById('city_det_err').innerHTML = '<h3>Please fill out form</h3>';
        closeChangeForm()
    }
}

function create_new_city(server_id, user_id){
    let input = document.getElementById('new_city_input').value;
    send_infor_server({server_id:server_id, name:input, user_id: user_id}, data => {
        if (data.returns =='Created'){
            city(server_id, user_id)
            socket.emit('new_city_created', {country: data.country, city:input, room:server_id})
        }else {
            document.getElementById('scroll-text').innerHTML ='Problem Creating New City'
        }
    }, 'create/new_city')
}