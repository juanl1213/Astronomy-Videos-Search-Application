const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 3000;

// Set the maximum requests per second
const MAX_REQUESTS_PER_SECOND = 100;

// Initialize variables for rate limiting
let requestCount = 0;
let lastRequestTimestamp = Date.now();

let average = 0;

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

// Define a function to fetch and store pageviews data for a term
async function fetchAndStorePageviews(term) {
    const pageviewsData = [];

    for (let year = 2023; year <= 2023; year++) {
        for (let month = 1; month <= 11; month++) {
            const monthlyViews = await fetchPageviewsData(term, year, month);
            pageviewsData.push(monthlyViews);
        }
    }

    // Calculate average
    const average = pageviewsData.length > 0 ? Math.round(pageviewsData.reduce((acc, views) => acc + views, 0) / pageviewsData.length) : 0;

    return { term, pageviewsData, average };
}

// Define a function to fetch pageviews data for a specific term and month
async function fetchPageviewsData(term, year, month) {
    const project = 'en.wikipedia.org';
    const access = 'all-access';
    const agent = 'all-agents';
    const granularity = 'monthly';

    const start = `${year}${month.toString().padStart(2, '0')}01`;
    const end = `${year}${(month + 1).toString().padStart(2, '0')}01`;

    const apiUrl = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/${project}/${access}/${agent}/${term}/${granularity}/${start}/${end}`;

    try {
        const response = await axios.get(apiUrl);
        return response.data.items[0].views || 0;
    } catch (error) {
        console.error(`Error fetching pageviews for ${term} in ${year}-${month}:`, error.response ? error.response.data : error.message);
        return 0;
    }
}

// Define the route for fetching results
app.get('/results', async (req, res) => {
    const now = Date.now();

    if (requestCount >= MAX_REQUESTS_PER_SECOND && now - lastRequestTimestamp < 1000) {
        // Return a 429 response if the rate limit is exceeded
        res.status(429).send('Too Many Requests');
        return;
    }

    // Increment the request count
    requestCount++;

    // Update the last request timestamp
    lastRequestTimestamp = now;

    const glossaryUrl = 'https://en.wikipedia.org/wiki/Glossary_of_astronomy';

    try {
        // Fetch the glossary terms from Wikipedia
        const glossaryResponse = await axios.get(glossaryUrl);
        const glossaryHtml = glossaryResponse.data;
        const $ = cheerio.load(glossaryHtml);

        const terms = [];

        // Extract terms from the glossary
        $('.glossary dt', glossaryHtml).each(function () {
            // Replace spaces with underscores
            const termWithUnderscores = $(this).text().replace(/ /g, '_');
            const formattedTerm = termWithUnderscores.charAt(0).toUpperCase() + termWithUnderscores.slice(1);
            // URI encode the term
            const encodedTerm = encodeURIComponent(formattedTerm);
            terms.push(encodedTerm);
        });

        // Fetch pageviews data for each term
        const pageviewsData = [];
        for (const term of terms) {
            const termData = await fetchAndStorePageviews(term);
            pageviewsData.push(termData);
        }

        res.json({ pageviewsData, message: 'Pageviews data fetched for all terms.' });

    } catch (error) {
        console.error('Error fetching glossary:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});



