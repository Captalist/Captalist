function allies(server_id, user_id, country_id){
    let main_content = document.getElementById('main_content');
    send_infor_server({'country_id': country_id}, data=>{
        console.log(data);
        if (data.returns =='Success'){
            console.log(data.data)
            if (Object.keys(data.data).length == 0){
                main_content.innerHTML =  `
                    <div>
                        <div class='search_for_new_ally'>
                            <input type='text' class='text' placeholder="Search For A Country To Become Their Ally" name='search' id='search_input' required></input>
                            <button onclick='becomeallies(${server_id},${country_id})'>Search</button>
                        </div>
                        <div id='alliance_err'></div>
                        <div class='ally_det'>
                            <style>
                                #allies_view {
                                    background-color: white;
                                }
                            </style>
                            <div id='allies_view' style="background-color: white;">
                                <div class="no_allies">You Have No Allies!</div>
                            </div>
                            <div>
                                <div class='allies_details' id='allies_details'>
                                    <div id='click_on_a_ally'>Click On A Ally</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }else {
                let obj_keys = Object.keys(data.data);
                main_content.innerHTML = `
                    <div>
                        <div class='search_for_new_ally'>
                            <input type='text' class='text' placeholder="Search For A Country To Become Their Ally" name='search' id='search_input' required></input>
                            <button onclick='becomeallies(${server_id},${country_id})'>Search</button>
                        </div>
                        <div id='alliance_err'></div>
                        <div class='ally_det'>
                            <div id='allies_view'>
                            </div>
                            <div>
                                <div class='allies_details' id='allies_details' style='background-color: white; text-align: center; position: relative; top: 40%; color: black;'>
                                    <div id='click_on_a_ally'>Click On A Ally</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                for (var i =0; i < obj_keys.length; i++){
                    create_alliance_div(obj_keys[i], data.data[obj_keys[i]], server_id, user_id, country_id)
                }
            }
        }
    }, 'get/alliance/data')
}

function becomeallies(server_id, country_id){
    console.log("We are in become allies")
    let all_name = document.getElementById('search_input').value;
    if (all_name.length != 0) {
        send_infor_server({new_ally: all_name, server_id: server_id, country_id:country_id}, data => {
            console.log(data)
            document.getElementById('alliance_err').innerHTML = data.return
        }, 'add/ally')
    }
}

function create_alliance_div(key, values, server_id, user_id, country_id){
    let new_element = document.createElement('button')
    new_element.id = `alliance_div_${key}`
    new_element.className = 'alliance_div';
    new_element.innerHTML = `
    <div id='alliance_flag_${key}'>
        ${values.flag}
    </div>
    <div id='alliance_name_${key}'>
        Name: ${values.name}
    </div>
    `
    new_element.onclick = function(){
        new_element_button(key, server_id, user_id, country_id);
    } 

    document.getElementById('allies_view').appendChild(new_element);

    document.querySelectorAll(`#alliance_flag_${key} svg`)[0].setAttribute("viewBox", "160 0 500 500");
}

function new_element_button(key, server_id, user_id, country_id) {
    console.log(`We are in new_element_button id:${key}`)
    document.getElementById('allies_details').style='';
    send_infor_server({alliance: key, country_id: country_id}, data=>{
        console.log(data);
        document.getElementById('allies_details').innerHTML = `
        <div class='alliance_div'>
            <div id='alliance_flag_det'>
                ${data.return.flag}
            </div>
            <div id='alliance_name_det'>
                Name: ${data.return.name}
            </div>
        </div>
        <div id='alliance_det_err'></div>
        <div>
            <h1>Trade Deals:</h1>
            <div id='alliance_trade_deals_det'>
                <div id='trades_deals'></div>
            </div>
        </div>
        `

        let army_element = document.createElement('div');
        army_element.className = 'alliance_trade_types';

        if (data.return['Army Trade'] == true){
            army_element.innerHTML = `
            <h4>Army Trade</h4> <button onclick="cancel_trade(${key}, 'army_trade', '${data.return.name}', ${server_id}, ${user_id}, ${country_id})" class='create_trade_deals'>Cancel Trade Deal</button>
            `
            document.getElementById('trades_deals').appendChild(army_element);
        }else {
            army_element.innerHTML = `
            <h4>Army Trade</h4> <button class='cancel_trade_deals' onclick='start_trade(${key}, "army_trade", "${data.return.name}")'>Create Trade Deal</button>
            `
            document.getElementById('trades_deals').appendChild(army_element);
        }

        let transport_ele =  document.createElement('div');
        transport_ele.className = 'alliance_trade_types';

        if (data.return.Transport == true){
            transport_ele.innerHTML = `
            <h4>Transport Trade</h4> <button class='create_trade_deals' onclick='cancel_trade(${key}, "transport_trade", "${data.return.name}", ${server_id}, ${user_id}, ${country_id})'>Cancel Trade Deal</button>
            `
            document.getElementById('trades_deals').appendChild(transport_ele);
        }else {
            transport_ele.innerHTML = `
            <h4>Transport Trade</h4> <button class='cancel_trade_deals' onclick='start_trade(${key}, "transport_trade", "${data.return.name}")'>Create Trade Deal</button>
            `
            document.getElementById('trades_deals').appendChild(transport_ele);
        }

        let com_ele = document.createElement('div');
        com_ele.className = 'alliance_trade_types';

        if (data.return.Communication == true) {
            com_ele.innerHTML = `
            <h4>Communication Trade</h4> <button class='create_trade_deals' onclick='cancel_trade(${key}, "com_trade", "${data.return.name}", ${server_id}, ${user_id}, ${country_id})'>Cancel Trade Deal</button>
            `
            document.getElementById('trades_deals').appendChild(com_ele); 
        }else {
            com_ele.innerHTML = `
            <h4>Communication Trade</h4> <button class='cancel_trade_deals' onclick='start_trade(${key}, "com_trade", "${data.return.name}")'>Create Trade Deal</button>
            `
            document.getElementById('trades_deals').appendChild(com_ele);
        }

        let trade_ele = document.createElement('div');
        trade_ele.className = 'alliance_trade_types';

        if (data.return.Trade == true){
            trade_ele.innerHTML = `
            <h4>Trade</h4> <button class='create_trade_deals' onclick='cancel_trade(${key}, "trade", "${data.return.name}", ${server_id}, ${user_id}, ${country_id})'>Cancel Trade Deal</button>
            `
            document.getElementById('trades_deals').appendChild(trade_ele);
        }else {
            trade_ele.innerHTML = `
            <h4>Trade</h4> <button class='cancel_trade_deals' onclick='start_trade(${key}, "trade", "${data.return.name}")'>Create Trade Deal</button>
            `
            document.getElementById('trades_deals').appendChild(trade_ele);
        }

        let final_ele = document.createElement('div');
        final_ele.id = 'trade_deals_opts';
        final_ele.innerHTML = `
        <button id='send_aid_div_button'>Send Aid</button>
        <button>Communicate</button>
        <button>Sell Goods</button>
        <button>Buy Goods</button>
        <button>End Alliance</button>
        <button>Go To War</button>
        `
        document.getElementById('alliance_trade_deals_det').appendChild(final_ele);
        document.getElementById('send_aid_div_button').onclick=function(){
            send_aid(data.return.flag, data.return.name, key, country_id, server_id, user_id)
        }
    }, 'alliance/data_and_trade_deals')
}

function start_trade(key, trade_type, name){
    console.log('We are in start trade')
    console.log(`Trade Type: ${trade_type}`)
    console.log(`Key: ${key}`)
    let statement;
    if (trade_type == 'army_trade') {
        statement = `Creating a army trade with ${name} will cost you 300 Capital and 600 Capital to manage. Are you sure you want to continue?`
    }else if (trade_type == 'transport_trade'){
        statement = `Creating a transport trade with ${name} will cost you 1000 Capital and 2000 Capital to manage. Are you sure you want to continue?`
    }else if (trade_type == 'com_trade'){
        statement = `Creating a communication trade with ${name} will cost you 2500 Capital and 5000 Capital to manage. Are you sure you want to continue?`
    }else if (trade_type == 'trade'){
        statement = `Creating a trade route with ${name} will cost you 5000 Capital and 7000 Capital to manage. Are you sure you want to continue?`;
    }

    let new_div = document.createElement('div');
    new_div.id = `create_trade_type_question${key}`;
    new_div.innerHTML = `
    <div class='join_popup'>
        <div class='join_container'>
            <p>${statement}</p>
            <button type="submit" class="btn" onclick='accept_alliance_trade_requests(${key}, "${trade_type}", "${name}")'>Create Trade</button>
            <button type="button" class="btn cancel" onclick='close_trade_request_form(${key})'>Cancel Trade</button>
        </div>
    </div>
    `
    document.getElementById('server_update_message').appendChild(new_div)
}

function cancel_trade(key, trade_type, name, server_id, user_id, country_id){
    console.log('We are in cancel trade');
    console.log(`Trade Type: ${trade_type}`)
    console.log(`Key: ${key}`)

    new_div = document.createElement('div');
    let statement = generate_statement(trade_type)
    new_div.id = `cancel_trade_${key}_${trade_type}`
    new_div.innerHTML = `
    <div class='join_popup'>
        <div class='join_container'>
            <p>${statement}</p>
            <button type="submit" class="btn" id='continue_cancel_trade_${key}_${trade_type}'>Cancel Trade</button>
            <button type="button" class="btn cancel" onclick='close_cancel_trade("cancel_trade_${key}_${trade_type}")'>Don't Cancel Trade</button>
        </div>
    </div>  
    `
    document.getElementById('server_update_message').appendChild(new_div)
    document.getElementById(`continue_cancel_trade_${key}_${trade_type}`).onclick = function(){
        send_infor_server({key: key, trade_type: trade_type}, data=>{
            console.log(data)
            new_element_button(key, server_id, user_id, country_id);
            socket.emit("AllianceTradeEnded", {key: key, trade_type: trade_type, country: country_id})
        }, 'alliane/end_trade_deal')
        close_cancel_trade(`cancel_trade_${key}_${trade_type}`)
    }
}

function close_trade_request_form(key){
    try{
        document.getElementById(`create_trade_type_question${key}`).remove()
    }catch(err){console.log(err)}
}

function accept_alliance_trade_requests(alliance, type_trade_request, acceptor){
    send_infor_server({alliance: alliance, type: type_trade_request, acceptor:acceptor}, data=>{
        console.log(data)
        document.getElementById('alliance_err').innerHTML = data.return;
        close_trade_request_form(alliance)
    }, 'alliance/create_trade_deal')
}

function generate_statement(trade_type) {
    if (trade_type == 'army_trade') {
        statement = `Ending army trade
        will mean you can no longer trade/send army units/reinforcement to your alliance member. 
        Are you sure you want to continue?
        `
    }else if (trade_type == 'transport_trade'){
        statement = `Ending transport trade 
        will mean you can no longer transport goods like army, resources, etc. 
        Are you sure you want to continue?`
    }else if (trade_type == 'com_trade'){
        statement = `Ending communication trade 
        will mean your nation will no longer be able to communicate with this nation. 
        Are you sure you want to continue?`
    }else if (trade_type == 'trade'){
        statement = `Ending trade route 
        will mean your nation can no longer buy and sell goods from this nation.
        Are you sure you want to continue?`;
    }

    return statement
}

function close_cancel_trade(id){
    document.getElementById(id).remove()
}