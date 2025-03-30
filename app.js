const express = require('express');
const os = require('os');
const app = express();
const PORT = 3000;

const appVersion = process.env.APP_VERSION || 'Unknown';

app.get('/', (req, res) => {

  const networkInterfaces = os.networkInterfaces();
  let serverIP = 'Unknown';
  
  Object.values(networkInterfaces).forEach(interfaces => {
    interfaces.forEach(iface => {
      if (!iface.internal && iface.family === 'IPv4') {
        serverIP = iface.address;
      }
    });
  });
  

  const hostname = os.hostname();
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Server Information</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        h1 { color: #333; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Server Information</h1>
        <p><strong>Server IP:</strong> ${serverIP}</p>
        <p><strong>Hostname:</strong> ${hostname}</p>
        <p><strong>Application Version:</strong> ${appVersion}</p>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
