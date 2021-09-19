const customTitlebar = require('custom-electron-titlebar');
const {remote} = require('electron')

titlebar = new customTitlebar.Titlebar({
	backgroundColor: customTitlebar.Color.fromHex('#444'),
    icon: 'Assests/image2vector.svg',
    shadow: true
});

const menu = new remote.Menu();

`menu.append(new remote.MenuItem({
	label: 'Item 1',
	submenu: [
		{
			label: 'Subitem 1',
			click: () => console.log('Click on subitem 1')
		},
		{
			type: 'separator'
		}
	]
}));

titlebar.updateMenu(menu);`