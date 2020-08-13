# Fullstack ToDo - taas yksi

Tässä pieni esimerkillinen Full stack sovellus. Aiheena ToDo, tuo Full stackin Hello world. 

Toteutuksena *palvelin* [Node.js](https://nodejs.org/en/) + [Express](https://expressjs.com/)  yhdistelmällä, pohja luotu Expressin applikaatiogeneraattorilla [express-generator](https://www.npmjs.com/package/express-generator). Palvelin tallettaa ToDot SQLite tiedostopohjaiseen tietokantaan. *Käyttöliittymä* on toteutettu [React](https://reactjs.org/)illa, apuna [material-table](https://material-table.com/).

## Käynnistys

Full stack ratkaisu JavaScriptillä, jos `npm` ei sano mitään, niin kannattanee ensin tutustua Noden ja kumppaneiden alkeisiin. Ratkaisuun ei ole lisätty skriptejä millä kaikki toimisi automaagisesti nappia painamalla, vaan käynnistämiseen täytyy tehdä hieman töitä. Mutta vain hieman.

### Palvelin

Palvelimen saa käynnistettyä helposti. Kannattaa ehkä ensin vilkaista miten React-osuutta haluaa ajaa.

```
cd backend
npm install
npm start
```

Tämän jälkeen palvelin on käynnissä [nodemon](https://nodemon.io/)in alla portissa 5000 (ellei PORT ympäristömuuttujaa ole asetettu toiseen porttiin). Palvelin ei käynnistyessään juurikaan ilmoittele itsestään, mutta lokittaa sille tehdyt kutsut yksinkertaisesti konsoliin. Parempaan loggaukseen esimerkiksi [winston](https://github.com/winstonjs/winston).

Joitakin debug-printtejäkin koodissa on, aseta siis console.logien sijaan DEBUG ympäristömuuttujaa halutessasi.

Toiminnallisuudesta kertoo enemmän palvelimen oma [README](backend/README.md)

### Käyttöliittymä

React-osuuden voi käynnistää kahdella tavalla:
1. Käynnistä se omassa hakemistossaan, sen jälkeen kun palvelin on käynnissä
        
        cd frontend
        npm install
        npm start

2. **Tai**, tee sovelluksesta build ja kopioi se palvelimen public-hakemistoon. Käynnistä sen jälkeen palvelin, ja suuntaa selain osoitteeseen http://localhost:5000/

        cd frontend
        npm install
        npm run build
        cp -rfv build/* ../backend/public
    Nyt siis palvelimen käynnistys ja selain auki..

Kummalla tavalla tahansa tehdyn käynnistyksen jälkeen voit lisäillä tehtäviä, muokkailla ja poistella niitä. Jos käyttöliittymä ei ole tarpeeksi intuitiivinen, niin voit vilkaista myös frontendin omaa [README](frontend/README.md) tiedostoa

