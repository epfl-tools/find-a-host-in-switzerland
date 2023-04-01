const fetch = require('node-fetch');

const jsdom = require("jsdom");
const { db } = require('..');
const { JSDOM } = jsdom;

module.exports = {

    name: 'Students Place 4U',

    check: async () => {

        const res = await fetch('https://studentsplace4u-crissier.com/logements/116-35?studio=Tous%20les%20studios&dispo=Toutes%20les%20disponibilit%C3%A9s&part=1');
        const html = await res.text();

        const dom = new JSDOM(html);

        const newEstablishmentCount = dom.window.document.querySelectorAll('#corps > tr').length;

        if (newEstablishmentCount !== (db.get(`students-place-4u_establishmentCount`) || 0)) {
            db.set(`students-place-4u_establishmentCount`, newEstablishmentCount);
            return {
                message: `${newEstablishmentCount} studios disponibles à Students Place 4U`,
                url: 'https://studentsplace4u-crissier.com/logements/116-35?studio=Tous%20les%20studios&dispo=Toutes%20les%20disponibilit%C3%A9s&part=1'
            }
        } else {
            console.log(`[Students Place 4U] No change in the number of available studios (still ${newEstablishmentCount})`);
            return null;
        }

    }

}
