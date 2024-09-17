const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MONGO
mongoose.connect('mongodb+srv://root:root@books-store-mern.8bwhh9b.mongodb.net/blogapp?retryWrites=true&w=majority&appName=Books-Store-MERN')
       .then(() => console.log('Connected to MongoDB'))
       .catch((err) => console.log(err))

// schema
const ticketSchema = new mongoose.Schema({
       name: String,
       last: String,
       buy: String,
       sell: String,
       volume: String,
       base_unit: String
});

const Ticker = mongoose.model('Ticker', ticketSchema);

// Fetching data from the API
app.get('/fetch-ticker', async (req, res) => {
       try {
              // Fetch the tickers from WazirX API
              const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
              const tickers = response.data;

              // Convert object to array and map the key as 'platform'
              const tickersArray = Object.keys(tickers).map(key => ({
                     platform: key,  // Platform name (e.g., "btcinr")
                     ...tickers[key]
              }));

              // Sort the array by 'last' (last traded price), or any other field
              const sortedTickers = tickersArray.sort((a, b) => parseFloat(b.last) - parseFloat(a.last));

              // Take top 10
              const top10Tickers = sortedTickers.slice(0, 10);

              // Clear existing data
              await Ticker.deleteMany();

              // Store top 10 tickers with platform names
              for (const ticker of top10Tickers) {
                     const newTicker = new Ticker({
                            name: ticker.platform.toUpperCase(),
                            last: ticker.last,
                            buy: ticker.buy,
                            sell: ticker.sell,
                            volume: ticker.volume,
                            base_unit: ticker.base_unit
                     });
                     await newTicker.save();
              }

              res.send('Top 10 tickers data fetched and saved to MongoDB');
       } catch (error) {
              console.error('Error fetching data:', error);
              res.status(500).send('Error fetching data');
       }
});

//Route to get data form mongoDB
app.get('/api/tickers', async (req, res) => {
       try {
              const tickers = await Ticker.find();
              res.json(tickers);
       } catch (error) {
              res.status(500).send('Error retrieving tickers data');
       }
})

app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
})


