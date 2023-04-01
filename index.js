require("dotenv").config();

const CronJob = require('cron').CronJob;

const fs = require('fs');
const hosts = fs.readdirSync('./hosts');

const db = require('easy-json-database');
module.exports.db = new db();

const fetch = require('node-fetch');

const sync = () => {
    hosts.forEach(async hostName => {

        console.log(`[${new Date().toLocaleString()}] Checking ${hostName}...`);

        const host = require(`./hosts/${hostName}`);
        const check = await host.check();
        if (check) {
            const notification = {
                title: check.name,
                message: check.message,
                url: check.url,
                url_title: `Voir`,
                priority: 0
            }

            console.log(notification)
        
            const appToken = process.env.APP_TOKEN;
            const groupToken = process.env.GROUP_TOKEN;
        
            const pushUrl = 'https://api.pushover.net/1/messages.json';
        
            const response = await fetch(pushUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: appToken,
                    user: groupToken,
                    ...notification
                })
            });
        
            const content = await response.json();
            console.log(content)
        
            if (content.status !== 1) {
                throw new Error('Pushover API error');
            }
        }
    });
}

new CronJob('0 */5 * * * *', () => {

    sync();

}, null, true, 'Europe/Zurich');

sync();
