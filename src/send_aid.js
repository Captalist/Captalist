function send_aid(ally_flag, ally_name, alliance_id, country_id, server_id, user_id){
    let main_content = document.getElementById('main_content');
    main_content.innerHTML = `
    <div>
        <div class='send_aid_flag_name'>
            <div id="send_aid_ally_flag" class="send_aid_ally_flag">${ally_flag}</div>
            <div id="send_aid_ally_name" class="send_aid_ally_name">Name: ${ally_name}</div>
        </div>
        <div class="send_aid_trade_divider">
            <div class="send_aid_trades">
                <div class="send_aid_div_clicks">Trade your cities</div>
                <div class="send_aid_div_clicks">Send Money</div>
                <div class="send_aid_div_clicks">Send Oil</div>
                <div class="send_aid_div_clicks">Send Food</div>
                <div class="send_aid_div_clicks">Send Water</div>
                <div class="send_aid_div_clicks">Send Army</div>
            </div>
            <div class="send_aid_details">
                <div id="send_aid_click_on_trade">Click On A Trade</div>
            </div>
        </div>
    </div>
    `
}