const fetch = require('node-fetch');
const { db } = require('..');

module.exports = {

    name: 'Les Estudiantines',

    check: async () => {

        const res = await fetch('https://www.estudiantines.ch/');
        const html = await res.text();
        
        const closed = html.includes('Les prochaines inscriptions seront ouvertes le 1er avril 2023');
        const opened = db.get('les-estudiantines_opened') || false;
        if (!closed && !opened) {
            db.set('les-estudiantines_opened', true);
            return {
                message: `Les Estudiantines sont ouvertes !`,
                url: 'https://www.estudiantines.ch/'
            }
        } else {
            console.log(`[Les Estudiantines] No change in the banner (still ${closed})`);
            return null;
        }

    }

}