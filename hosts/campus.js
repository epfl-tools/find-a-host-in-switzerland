const fetch = require('node-fetch');

const jsdom = require("jsdom");
const { db } = require('..');
const { JSDOM } = jsdom;

module.exports = {

    name: 'Camp\'us',

    check: async () => {

        const res = await fetch('https://www.camp-us.ch/fr/appartements/1.5');
        const html = await res.text();

        const dom = new JSDOM(html);

        const newEstablishmentCount = Array.prototype.slice.call(dom.window.document.querySelectorAll('td.colState'))
            .filter((el) => el.textContent === 'disponible').length;

        if (newEstablishmentCount !== (db.get(`camp-us_establishmentCount`) || 0)) {
            db.set(`camp-us_establishmentCount`, newEstablishmentCount);
            return {
                message: `${newEstablishmentCount} studios disponibles à Camp'us`,
                url: 'https://www.camp-us.ch/fr/appartements/1.5'
            }
        } else {
            console.log(`[Camp'us] No change in the number of available studios (still ${newEstablishmentCount})`);
            return null;
        }

    }

}
