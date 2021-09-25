const { app, BrowserWindow, ipcMain, Tray, nativeImage } = require('electron');

const {autoUpdater} = require("electron-updater");

const path = require('path');

require(path.resolve(__dirname, "debug_console")) // This module is used to handle debugging in production

// Used to Debug Releases that won't have a console... Comment out when devloping
const fs = require("fs");
try {
  fs.unlinkSync(path.resolve(process.resourcesPath, "console.log"))
  //We will need to delete the previous log, so we will only deal with recent errors
} catch(err) {
  console.error(err)
}
console.file(path.resolve(process.resourcesPath, "console.log"));
// End of things you will want to comment out during development

const fetch = require('node-fetch')

const db_func = require(path.join(__dirname, 'important_db_func'));

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

class Users {
  constructor(id, name, password){
    this.id = id;
    this.name = name;
    this.password = password;
    this.server_datas =null;
    this.current_country = null;
    this.current_server= null;
    this.current_server_data = null;
  }

  create_user = (id, name, password) => {
    db_func.user_exist(id, (val) => {
      if (val == true){
        console.log("User exist");
        this.sign_out();
        this.sign_in(id, name, password);
      }else {
        this.sign_out()
        db_func.create_user(id, name, password, ()=>{console.log("Created new User")})
        this.sign_in(id, name, password)
      }
    })
  }

  sign_out = () => {
    fetch('https://captalistserver.learncode2.repl.co/sign_out', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({id: this.id}),
      headers: {'Content-Type': 'application/json'}
    }).then((rs) => {return rs.json()})
    .then(js => {console.log(js)})
    .catch(err => {console.log(err)}) 

    this.id = null;
    this.name = null;
    this.password = null;
    db_func.sign_out(()=>{console.log('Success SignOut')});
  }

  sign_in = (id, name, password, callback=null) => {
    this.id = id;
    this.name = name;
    this.password = password;
    db_func.sign_in(name, password, ()=>{console.log("Success Sign In")})
    fetch('https://captalistserver.learncode2.repl.co/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({name: this.name, password: this.password}),
      headers: {'Content-Type': 'application/json'}
    }).then(res => {
      return res.json()
    })
    .then(data=>{
      console.log(data)
      if (callback != null){
        callback(data);
      }
    })
  }
  
  server_data = () => {
    fetch('https://captalistserver.learncode2.repl.co/server_data', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({id: this.id}),
      headers: {'Content-Type': 'application/json'}
    }).then(re => {return re.json()})
    .then(data => {data['id']= this.id; this.server_datas = data})
    return this.server_datas
  }
}

class Captalist {

  constructor(parent, parent_name, parent_func, width, height, webpref) {
    this.parent = parent;
    this.parent_name = parent_name;
    this.width = width;
    this.height = height;
    this.webpref = webpref;
    this.parent_func = parent_func;
    this.windows= {};
    this.triggers = {};
    this.currentWindow = null;
    this.close_before = null;
    this.user = new Users(null, null, null);
    this.update_window = null;
  }

  add_child = (name, file, open_dev, callback, parent=false) => {
    if (name in this.windows){
      return "Name already exist"
    }
    if (parent == false){
      let new_child_func = () => {
        let new_child= new BrowserWindow({
          width: this.width,
          height: this.height,
          //modal: true,
          show: false,
          //fullscreen: true,
          simpleFullscreen: true,
          //parent: this.parent,
          webPreferences: this.webpref,
          icon: image.resize({ width: 600, height: 600 }),
          alwaysOnTop: true,
          frame: false
          //titleBarStyle: "hidden"
        });
        new_child.on('close', this.close_all)
        new_child.loadFile(path.join(__dirname, file));
        if (open_dev == true){
          new_child.webContents.openDevTools();
        }
        this.windows[name] = new_child;
        new_child.on('show', ()=>{
          new_child.maximize()
          callback(new_child)
        })
        
      }
      this.triggers[name] = new_child_func;
      return `Added ${name} to ${this.parent_name} program`
    }else {
      this.parent_func = () => {
        this.parent = new BrowserWindow({
          width: this.width,
          height: this.height,
          fullscreen: true,
          //simpleFullscreen: true,
          webPreferences: this.webpref,
          icon: image.resize({ width: 600, height: 600 }),
          alwaysOnTop: true,
          frame: false
          //titleBarStyle: "hidden"
        });
        this.parent.on('close', app.quit)
        this.parent.loadFile(path.join(__dirname, file));
        if (open_dev == true) {
          this.parent.webContents.openDevTools();
        }
        this.windows[this.parent_name] = this.parent;
      }
      this.triggers[this.parent_name] = this.parent_func;
      return `Added ${this.parent_name} to program`
    }
  }

  close_all = () => {
    app.quit()
  }

  openWindow =  (name) => {
    let keys = Object.keys(this.triggers)
    if (keys.includes(name)){
      this.currentWindow.hide();
      this.triggers[name]();
      this.currentWindow = this.windows[name];
      this.currentWindow.show()
      return `${name} has been opened.`
    }
    return `${name} does not exist.`
  }


  run = () => {
    this.triggers[this.parent_name]()
    this.windows[this.parent_name] = this.parent; 
    this.currentWindow = this.parent

    db_func.users_signed_in((row)=>{
      if (row == undefined){return}
      this.user.sign_in(row.server_id, row.name, row.password)
      this.openWindow('Home')
    })
    
    return `Running ${this.parent_name} APP`
  }

}

db_func.does_db_exit_if_not_create()

const cap = new Captalist(null, 'Captalist', null, 800, 
600, {
  nodeIntegration: true,
  contextIsolation: false,
  enableRemoteModule: true,
})

console.log(cap.add_child('Captalist', 'index.html', false, (win)=>{console.log("DONE")},true))

console.log(cap.add_child('Home', 'home.html', false, (win)=>{
  setInterval(()=>{
    if (cap.user.id != null){
      win.webContents.send('Servers', cap.user.server_data())
    }
  }, 10000)
}))

console.log(cap.add_child('Game', 'game.html', false, (win)=>{
  console.log("Done")
}))

let run = () => {
  cap.run()
  autoUpdater.checkForUpdates();
}

app.on('ready', run);

ipcMain.on("quitAndInstall", (event, arg) => {
  autoUpdater.quitAndInstall();
})

autoUpdater.on('update-downloaded', (info) => {
  cap.currentWindow.webContents.send('updateReady')
});

ipcMain.on('OpenWindow', (event, data) => {
  console.log(cap.openWindow(data.name))
})

ipcMain.on('GIVESERVERDATA',(event, data)=>{
  cap.currentWindow.webContents.send('ServerData', {'Data': cap.user.current_server_data, 'SERVER_ID': cap.user.current_server, 'User_ID': cap.user.id})
})

ipcMain.on('login', (event, data) => {
  cap.user.create_user(data.id, data.name, data.password)
  cap.openWindow('Home');
})

ipcMain.on("relogin",(event, data)=>{
  cap.user.sign_in(cap.user.id, cap.user.name, cap.user.password)
  cap.currentWindow.webContents.send('TryAgain', {'server_id': cap.user.current_server, 'user_id': cap.user.id})
})

ipcMain.on("LogOut", (event, data)=> {
  cap.user.sign_out();
  cap.openWindow('Captalist')
})

ipcMain.on('GameOn', (event, data)=>{
  console.log("DATA")
  console.log(data)
  cap.user.current_server = data.server_id;
  cap.user.current_server_data = data;
  cap.openWindow('Game')
})

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on("close_update_window", ()=>{
  if (cap.update_window != null){
    cap.update_window.close()
  }
})

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const request = async (link, options, callback) => {
  const response = await fetch(link, options);
  const json = await response.json();
  try {
    callback(json);
  }catch(err){
    console.log(err)
  }
}


app.on('before-quit', event => {
  event.preventDefault()
  console.log("Before Quit event is firing")
  if (cap.user.id != null){
    request('https://captalistserver.learncode2.repl.co/sign_out', {
      method: 'POST',
      body: JSON.stringify({id: cap.user.id}),
      credentials: 'include',
      headers: {'Content-Type': 'application/json'}
    }, (js)=>{
      console.log(js)
      console.log('Sent SignOut')
      process.exit(0)
    })
  }else{process.exit(0)}
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    run();
  }
});

let tray = null

const image = nativeImage.createFromPath(
  path.join(process.resourcesPath, 'Facebook Post 940x788 px.png')
);

app.whenReady().then(() => {
  tray = new Tray(image.resize({ width: 600, height: 600 }))
  tray.setTitle('Captalist');
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
