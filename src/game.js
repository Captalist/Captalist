let body = document.getElementById('body')
let flag_img =document.getElementById('w-node-_10139765-5955-0dab-368f-5340f6276800-1a2664d7')
let country_name = document.getElementById('w-node-_0c08a43b-8aea-b39f-de49-9d50654baf6f-1a2664d7')
let population_ele = document.getElementById('pop');
let money_ele = document.getElementById('money');
let oil_ele =  document.getElementById('oil');
let iron_ele = document.getElementById('iron');
let food_ele = document.getElementById('food');
let water_ele = document.getElementById('water');
let alliance_request_dict = {}
var socket;
var alliances_trade_requests_for_user = {
    request: {},
    request_already_exist: function(statement){
        let keys =  Object.keys(this.request)
        for (var i=0; i < keys.length; i++){
            let key_statement =  this.request[keys[i]]
            if (key_statement == statement){
                return true
            }
        }
        return false
    },
    add_to_request: function(id, statement){
        this.request[id] = statement
    },
    delete: function(id){
        if (this.request.hasOwnProperty(id)){
            document.getElementById(id).remove()
            delete this.request[id]
        }
    }
    
}

ipcRenderer.on('ServerData', (event, data)=>{
    console.log(data)
    fetch('https://captalistserver.learncode2.repl.co/get_country_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            user_id: data.User_ID,
            server_id: data.SERVER_ID
        })
    }).then(res => {return res.json()})
    .then(data_re=>{
        console.log(data_re);
        flag_img.innerHTML =data_re.flag;
        country_name.innerHTML = data_re.name;
        population_ele.innerHTML = "Population: "+ data_re.population;
        money_ele.innerHTML = 'Capital: $' + data_re.money;
        oil_ele.innerHTML = 'Oil: ' + data_re.oil;
        iron_ele.innerHTML = 'Iron: ' + data_re.iron;
        food_ele.innerHTML ='Food: ' + data_re.food;
        water_ele.innerHTML = 'Water: ' + data_re.water;
        socket = io.connect('https://captalistserver.learncode2.repl.co');
        socket.emit('Joined', {country: data_re.name, room: data.SERVER_ID, ids: data_re.id})

        socket.on('Update', function(msg){
            document.getElementById('scroll-text').innerHTML = msg;
        })

        socket.on('YourAllianceTradeHaveEnded', function(msg){
            let new_div = document.createElement('div');
            let real_id =  getRandom(9)
            let stop_condition = false

            while (!stop_condition) {
                var myEle = document.getElementById(`alliance_trade_ended${real_id}`);
                if (!myEle){
                    stop_condition = true
                }else {
                    real_id =  getRandom(9)
                }
            }

            new_div.id= `alliance_trade_ended${real_id}`
            new_div.innerHTML = `
            <div class='join_popup'>
                <div class='join_container'>
                    <h3>${msg}</h3>
                    <button type="submit" class="btn" onclick='trade_ended_notofication("alliance_trade_ended${real_id}")' >Ok</button>
                </div>
            </div>
            `
            document.getElementById('server_update_message').appendChild(new_div)
        })

        document.getElementById('cities_button').onclick = function() {
            city(data.SERVER_ID, data.User_ID)
        }

        document.getElementById('allies_button').onclick = function(){
            allies(data.SERVER_ID, data.User_id, data_re.id)
        }

        document.getElementById('army_button').onclick = function (){
            army_view(data_re.id, data.SERVER_ID, data.User_ID)
        }
        city(data.SERVER_ID, data.User_ID)

        socket.on('HereIsYourAllianceRequest', function(msg){
            console.log("We are in HereIsYourAllianceRequest");
            console.log(msg)
            
            let alliance_r_k = Object.keys(msg)

            for (var i =0; i < alliance_r_k.length; i++){
                let alliance =  msg[alliance_r_k[i]]
                if (!(alliance_r_k[i] in alliance_request_dict)){
                    create_alliance_request(alliance_r_k[i], alliance, data.SERVER_ID)
                }
            }
            
        })

        socket.on('HEREISYOURALLIANCETRADEREQUESTS', function(msg){
            console.log("ALLIANCE TRADE REQUEST MESSAGE")
            console.log(msg)
            let keys =  Object.keys(msg)
    
            for (var i=0; i<keys.length; i++){
              let key = keys[i];
              console.log(msg[key])
    
              for (var l=0; l < msg[key].length; l++){
                var object = msg[key][l];
                alliance_trade_request(key, object)
              }
            }
        })

        continues_update(data.SERVER_ID, data.User_id, data_re.id)
        
    })
})
body.onload = function(event) {
    ipcRenderer.send('GIVESERVERDATA', {})
}

// Every One second it fires events to the server, and we Update
// certain things, like money, oil, and even new alliance request
const continues_update = (server_id, user_id, country_id) =>{
    setInterval(()=>{
        socket.emit("AllianceRequest", {server: server_id, user: user_id, country: country_id})
        socket.emit('AllianceTradeRequest', {country: country_id})
    }, 10000)
}

function create_alliance_request(key, value, server) {
    let new_div = document.createElement('div');
    new_div.id= `alliance_form${key}`
    new_div.innerHTML = `
    <div class='join_popup'>
        <div class='join_container'>
            <h3>${value.statement}</h3>
            <button type="submit" class="btn" onclick='accept_alliance_request(${key}, [${value.data}], ${server})' >Accept Alliance Request</button>
            <button type="button" class="btn cancel" onclick='deny_request(${key}, [${value.data}], ${server})'>Deny Alliance Request</button>
        </div>
    </div>
    `
    document.getElementById('server_update_message').appendChild(new_div)
}

function accept_alliance_request(key, all_id, server){
    console.log(all_id)
    send_infor_server({acceptor: all_id[2], creator:all_id[1], server_id: server}, data=>{
        console.log("We are in accept request")
        console.log(data)
        close_accept_div_form(key)
    }, 'accept/alliance')
}

function deny_request(key, all_id, server){
    send_infor_server({acceptor: all_id[2], creator:all_id[1], server_id: server}, data=>{
        console.log("We are in deny request")
        console.log(data)
        close_accept_div_form(key)
    }, 'deny/alliance')
}

function close_accept_div_form(key){
    document.getElementById(`alliance_form${key}`).remove()
    delete alliance_request_dict[key]
}

function getRandom(length) {

    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
    
}

function trade_ended_notofication(key){
    document.getElementById(key).remove()
}

function alliance_trade_request(key, object){
    let new_div = document.createElement('div')
    let new_id =  getRandom(10)
    let stop_condition = false

    while (!stop_condition) {
        var myEle = document.getElementById(`alliance_trade_request${new_id}`);
        if (!myEle){
            stop_condition = true
        }else {
            new_id =  getRandom(10)
        }
    }

    new_div.id = `alliance_trade_request${new_id}`

    new_div.innerHTML = `
    <div class='join_popup'>
        <div class='join_container'>
            <h3>${object.statement}</h3>
            <button type="submit" class="btn" id="alliance_trade_request${new_id}_button_1">Accept Alliance Trade Request</button>
            <button type="button" class="btn cancel" id="alliance_trade_request${new_id}_button_2">Deny Alliance Trade Request</button>
        </div>
    </div>
    `
    if (!alliances_trade_requests_for_user.request_already_exist(object.statement)){
        alliances_trade_requests_for_user.add_to_request(`alliance_trade_request${new_id}`, object.statement)
        document.getElementById('server_update_message').appendChild(new_div)
        document.getElementById(`alliance_trade_request${new_id}_button_1`).onclick= function(){
            accept_alliance_trade_request(key, object, `alliance_trade_request${new_id}`)
        }
        document.getElementById(`alliance_trade_request${new_id}_button_2`).onclick = function(){
            deny_trade_request(key, object, `alliance_trade_request${new_id}`)
        }
    }
}

function accept_alliance_trade_request(key, object, id){
    let options = {
        trade_type: key,
        id: object.data[0],
        alliance: object.data[object.data.length - 1]
    }
    send_infor_server(options, data=>{
        console.log('We are in accept alliance request')
        console.log(data)
        alliances_trade_requests_for_user.delete(id)
    }, 'alliance/accept_trade_deal')
}

function deny_trade_request(key, object, id){
    let options = {
        trade_type: key,
        id: object.data[0],
        alliance: object.data[object.data.length - 1]
    }
    send_infor_server(options, data=>{
        console.log('We are in accept alliance request')
        console.log(data)
        alliances_trade_requests_for_user.delete(id)
    }, 'alliance/deny_trade_deal')

}