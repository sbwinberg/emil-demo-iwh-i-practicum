const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJECT_ID = process.env.CUSTOM_OBJECT_ID;
const BASE_URL = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
   
app.get('/update-cobj', async (req, res) => {
    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum.'});      
    } catch (error) {
        console.error(error);
    }
});


app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "year": req.body.year,
            "author": req.body.author,
            "genre": req.body.genre,
            "name": req.body.name,
            "id": guidGenerator(),
            "nopages": req.body.nopages
        }
    }
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(BASE_URL, update, { headers });
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }
});


app.get('/', async (req, res) => {
    const properties = "?properties=name,author,year,genre,nopages"
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const response = await axios.get(BASE_URL + properties, {headers});
        const data = await response.data.results;
        res.render('homepage', { title: 'Homme', data });      
    } catch (error) {
        console.error(error);
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));