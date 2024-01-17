const { app, BrowserWindow,ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

let mainWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false, // Disable Node.js integration in renderer process
        contextIsolation: true, // Enable context isolation for better security
        preload: path.join(__dirname, 'preload.js'), // Path to the preload script
      },
    });

    mainWindow.loadFile('index.html');
  }) 

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});




// Host communictaion
ipcMain.on('message-from-renderer', (event, data) => {
  console.log('Message from renderer:', data);
  
// Edit Hostfile

// Define the domains you want to add to the host file
const domainsToAdd = ['example1.com', 'example2.com'];

// Get the path to the host file based on the operating system
const hostFilePath = os.platform() === 'win32' ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts';

// Check if the script is running with elevated privileges
if (process.getuid && process.getuid() !== 0) {
  console.error('This script requires elevated privileges. Please run as an administrator.');
  process.exit(1);
}

// Read the current content of the host file
const currentHosts = fs.readFileSync(hostFilePath, 'utf-8');

// Add the domains to the host file if they don't already exist
domainsToAdd.forEach(domain => {
  const regex = new RegExp(`\\s${domain}\\s`, 'g');
  if (!regex.test(currentHosts)) {
    const newHostEntry = `\n127.0.0.1\t${domain}`;
    fs.appendFileSync(hostFilePath, newHostEntry);
    console.log(`Added ${domain} to the host file.`);
  } else {
    console.log(`${domain} already exists in the host file.`);
  }
});
});
