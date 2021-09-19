const create_country = (server_id, name_id, country_owner)=> {
    let div_main_cont = document.createElement('div');
    div_main_cont.className = 'create_count_popup';
    div_main_cont.id = 'Create_Country_POPUP';
    div_main_cont.style.display = 'block'

    let div_cont =  document.createElement('div');
    div_cont.className = 'join_container';

    let h1 = document.createElement('h1');
    h1.innerHTML = 'Create A Country';

    let p_small = document.createElement('p');
    p_small.innerHTMl = 'You have country in the server you are about to join';
    p_small.className = 'p_small';

    div_cont.appendChild(h1);
    div_cont.appendChild(p_small);

    country_l = document.createElement('label');
    country_l.for='country';
    country_l.innerHTML = "<b>Country Name:</b>";

    country_input = document.createElement('input');
    country_input.type='text';
    country_input.className ='text';
    country_input.placeholder ='Enter Your New Country Name';
    country_input.name = 'country';
    country_input.id = 'country_input';

    div_cont.appendChild(country_l);
    div_cont.appendChild(country_input);

    let instuctions =  document.createElement('div');
    instuctions.innerHTML = `
    <h3>Instruction to creating Your Custom Flag</h3>
    <ol>
        <li>First Click on this <a href='https://flag-designer.appspot.com/#d=9&c1=5&c2=0&c3=7&o=2&c4=1&s=0&c5=4' target='_blank'>link</a>. To be taken to customize your flag</li>
        <li>Once Done customizing your flag, click the "open as as standalone .svg" button</li>
        <li>You will be Redirected to a new page. Copy the url of the New Page and paste it in</li>
    </ol>
    `

    div_cont.appendChild(instuctions);

    country_Flag_l =  document.createElement('label');
    country_Flag_l.innerHTML = '<b>Country Flag Link:</b>';
    country_Flag_l.for = 'country_flag';

    div_cont.appendChild(country_Flag_l);

    country_flag_input =  document.createElement('input');
    country_flag_input.type='text';
    country_flag_input.className = 'text';
    country_flag_input.placeholder = 'Paste In the link to your custom country flag';
    country_flag_input.name = 'country_flag';
    country_flag_input.id = 'country_flag_input';

    div_cont.appendChild(country_flag_input)

    div_err = document.createElement('div');
    div_err.id = 'country_create_err';

    div_cont.appendChild(div_err);

    div_confirm = document.createElement('button');
    div_confirm.className = 'btn';
    div_confirm.type='submit';
    div_confirm.innerHTML = 'Create Country';
    div_confirm.id = 'create_country_confirm';
    div_confirm.onclick = function(event){
        if (country_flag_input.value.length > 0 && country_input.value.length > 0 ){
            console.log("All Value submited")
            console.log("SERVER ID")
            console.log(server_id)
            fetch('https://captalistserver.learncode2.repl.co/create/country', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    server_id: server_id,
                    country_name: country_input.value,
                    country_flag: country_flag_input.value,
                    user_id: country_owner
                }),
            }).then(res => {return res.json()})
            .then(data => {
                console.log(data)
                if (data.return == 'Server Does Not Exist'){
                    div_err.innerHTML = 'This Server Does Not Exist'
                }else if (data.return == 'Invalid URL'){
                    div_err.innerHTML = 'Please Use Correct URL For Flag';
                }else if (data.return =='Problem Getting Flag From URL'){
                    div_err.innerHTML = 'There was a problem getting flag from URL';
                }else if (data.return == 'Error'){
                    div_err.innerHTML = 'Server is dealing with some issues please try agian later';
                }else if (data.return == 'Name Taken'){
                    div_err.innerHTML = 'Country Name is already taken, please choose another name';
                }else if (data.return.Server_id){
                    // This is where the user will be taken to game screen
                    document.getElementById('cancel_create_country').click()
                    ipcRenderer.send('GameOn', {'server_id': data.return.Server_id[0]})
                }
            })
        }else {
            div_err.innerHTML = 'Please fill out the form';
        }
    }

    div_cont.appendChild(div_confirm);

    div_cancel =  document.createElement('button');
    div_cancel.className = 'btn cancel';
    div_cancel.type ='submit';
    div_cancel.innerHTML = 'Cancel';
    div_cancel.id = 'cancel_create_country';
    div_cancel.onclick = function(event) {
        let main_doc =  document.getElementById('Create_Country_POPUP')
        try {
            main_doc.remove()
        }catch (err) {
            console.log(err)
        }
    }
    div_cont.appendChild(div_cancel);

    div_main_cont.appendChild(div_cont);
    
    let div_parent_element = document.getElementById(name_id)
    div_parent_element.appendChild(div_main_cont);
}