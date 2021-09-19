function army_view(country_id, server_id, user_id){
    let main_window = document.getElementById('main_content')
    send_infor_server({country_id:country_id}, data=>{
        console.log(data)
        main_window.innerHTML = `
            <div>
                <div>
                    <button type="button" class="btn" id='create_army_group'>Create Army Group</button>
                </div>
                <div id='army_groups_and_army_details_div'>
                    <div id='army_groups' style="overflow-y: scroll;"></div>
                    <div id='army_details'>
                        <div style="text-align: center;">Click On One of Your Army For More Details</div>
                    </div>
                </div>
            </div>
        `
        let army_groups_keys = Object.keys(data.return)
        if (army_groups_keys.length == 0){
            document.getElementById('army_groups').innerHTML = '<div id="no_army_have_been_created">You have not Created any Army'
        }
        for (var i=0; i<army_groups_keys.length; i++){
            let key =  army_groups_keys[i];
            let army_det =  data.return[key];
            
            let div = document.createElement('div');
            div.innerHTML = `Name: ${army_det.name}`
            div.className = 'army_groups_keys'
            div.id = `army_groups_keys${key}`
            div.onclick = function(){
                army_view_details(country_id, server_id, user_id, army_det.id)
            }
            document.getElementById('army_groups').appendChild(div);
        }

        document.getElementById('create_army_group').onclick = function(){
            create_army_group(country_id, server_id, user_id);
        }
    }, 'army/get/data')
}

function create_army_group(country_id, server_id, user_id){
    document.getElementById('army_details').innerHTML =  `
        <div class='create_army_group'>
            <h1>Create A New Army</h1>
            <label for='army_name'><b>Army Name:</b></label>
            <input type='text' class='text' placeholder="Enter your new Army Name" name="army_name" id='new_army_name'>
            <div id='create_army_problem_Div' style="text-align: center;"></div>
            <button class='btn' id='confirm_create_army_group'>Create New Army</button>
            <button class='btn cancel' id='cancel_create_army_group'>Cancel</button>
        </div>
    `
    document.getElementById('cancel_create_army_group').onclick = function(){
        document.getElementById('army_details').innerHTML =`
        <div style="text-align: center;">Click On One of Your Army For More Details</div>
        `
    }

    // When You come back you need to write a function to create army
    document.getElementById('confirm_create_army_group').onclick = function(){
        let army_name =  document.getElementById('new_army_name');
        if (army_name.value.length > 0) {
            send_infor_server({
                country_id:country_id, 
                name_of_army: army_name.value
            }, data=>{
                if (data.return == "Problem Creating Army"){
                    document.getElementById('create_army_problem_Div').innerHTML = data.return;
                }else if (data.return == "Army Succefully Created"){
                    army_view(country_id, server_id, user_id);
                }else if (data.return == "Name already in use, choose a different name"){
                    document.getElementById('create_army_problem_Div').innerHTML = data.return;
                }else {
                    document.getElementById('create_army_problem_Div').innerHTML = "SERVER ERRROR"
                    console.log(data)
                }
            }, 'army/create')
        }else{
            document.getElementById('create_army_problem_Div').innerHTML = "Please give your army a name"
        }
    }
}

/** 
    * Returns stuff
*/
function army_view_details(country_id, server_id, user_id, army_id){
    console.log("ARMY ID:"+army_id)
    send_infor_server({army_id: army_id}, data=>{
        console.log(data)
        if (data.return == "Army Not Created"){
            document.getElementById('army_details').innerHTML =`
            <div style="text-align: center;">There was a problem getting army details. Please try again later</div>
            `
        }else{
            document.getElementById('army_details').innerHTML = `
                <div style="overflow-y: scroll; max-height: 200px; border-left: 1px solid black;">
                    <h1 style="border-bottom: 1px solid black;">${data.return.Name}</h1>
                    <div class="army_details_attack_protect_div">
                        <div class="attack">Attacking: ${data.return.Attacking}</div>
                        <div class="protect">Protecting: ${data.return.Protecting}</div>
                    </div>
                    <div class="army_details_army">
                        <div class="left">
                            <div>Troops: ${data.return.Troops}</div>
                            <div>Airplanes: ${data.return.Airplanes}</div>
                        </div>
                        <div class="right">
                            <div>Tanks: ${data.return.Tanks}</div>
                            <div>Airtilery: ${data.return.Airtilery}</div>
                        </div>
                    </div>
                    <div class="army_details_butts">
                        <div class="left">
                            <button>Add Troops</button>
                            <button>Release Troops</button>
                        </div>
                        <div class="left">
                            <button>Add Tanks</button>
                            <button>Destroy Tanks</button>
                        </div>
                        <div class="right">
                            <button>Add Airplanes</button>
                            <button>Destroy Airplanes</button>
                        </div>
                        <div class="right">
                            <button>Add Airtilery</button>
                            <button>Destroy Airtilery</button>
                        </div>
                    </div>
                </div>
            `
        }
    }, 'army/specific/army/data')
}