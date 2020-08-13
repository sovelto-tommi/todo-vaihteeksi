# Front-end

Front-endin toteutus on tehty Reactilla, datan näyttämiseen käytetty [material-table](https://material-table.com/#/) kirjastoa. Toteutus on tarkoituksella yksinkertainen:
- yksi ainoa sivu, 
- kaikki ToDot yhdessä taulussa,
- ei kuvia tai juuri muutakaan tyylittelyä

## Käyttö ja asennus

Varsina normaali React-sovelluksen käyttö, eli ei ole tehty asennus- tms. skriptiä normaalien lisäksi. Katso päätasolta tarkemmat ohjeet kokeiluun.

## Tominnallisuus

Käynnistyessään sivulle tulee palvelimella olevat ToDo tehtävät. Sen jälkeen tehtäviä voi käsitellä. Käsittely toivottavasti intuitiivista, mutta varmuuden vuoksi selityksiä:
1. Järjestää taulukon otsikoita klikkaamalla. Toimii suurimpaan osaan sarakkeista
2. Muokata rivin vasemman reunan kynä-kuvakkeesta. **Huom** tämä myös jos haluaa merkitä tehtävän tehdyksi
4. Poistaa tehtävän rivin vasemman reunan roskakori-kuvakkeella
7. Uuden tehtävän voi luoda taulukon oikealla yläpuolella olevalla Add + ToDo -kuvakkeella. Tämä antaa uuden rivin johon tehtävän kuvauksen voi kirjoittaa, ja sen jälkeen lähettää palvelimen tallennettavaksi.
4. Tehtäviä voi myös filtteröidä Etsintä-kentällä, se hakee kirjoitetun tekstin esiintymiä kaikista sarakkeista.

## Rakenne

Sovelluksessa kolme komponenttia, vaikka kaiken olisi oikeastaan voinut kirjoittaa yhteenkin näin yksinkertaisessa sovelluksessa. `/components/Todos.jsx` sisältää suurimman osan toiminnallisuudesta, palvelimen kanssa kommunikointi toteutettu `/services/apiservice.js` tiedostoon.

<hr/>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).