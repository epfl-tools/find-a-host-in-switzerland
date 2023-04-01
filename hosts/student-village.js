const fetch = require('node-fetch');
const { db } = require('..');

module.exports = {

    name: 'Student Village Lausanne',

    check: async () => {

        const res = await fetch('https://studentvillage-lausanne.ch/fr/');
        const html = await res.text();
        const closed = html.includes('Les inscriptions sont fermées pour septembre 2022');
        const opened = db.get('student-village-lausanne_opened') || false;
        if (!closed && !opened) {
            db.set('student-village-lausanne_opened', true);
            return {
                message: `Student Village Lausanne sont ouverts !`,
                url: 'https://studentvillage-lausanne.ch/fr/'
            }
        } else {
            console.log(`[Student Village Lausanne] No change in the banner (still ${closed})`);
            return null;
        }

    }

}