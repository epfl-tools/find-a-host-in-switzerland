const fetch = require('node-fetch');

const jsdom = require("jsdom");
const { db } = require('..');
const { JSDOM } = jsdom;

module.exports = {

    name: 'Pilet & Renaud',

    check: async () => {

        const res = await fetch('https://www.pilet-renaud.ch/etudiants_fr/residence/lausanne');
        const html = await res.text();

        const dom = new JSDOM(html);

        const newEstablishmentCount = dom.window.document.querySelectorAll('.item.row.logement').length;
        if (newEstablishmentCount !== (db.get(`pilet-renaud_establishmentCount`) || 0)) {
            db.set(`pilet-renaud_establishmentCount`, newEstablishmentCount);
            return {
                message: `${newEstablishmentCount} studios disponibles à Pilet-Renaud`,
                url: 'https://www.pilet-renaud.ch/etudiants_fr/residence/lausanne'
            }
        } else {
            console.log(`[Pilet-Renaud] No change in the number of available studios (still ${newEstablishmentCount})`);
            return null;
        }

    }

}