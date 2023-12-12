# EasyAstronomy-AstronomyResourcesRepository

Description:

This is a website where I compile useful information and resources for those looking to get a basic understanding of astronomy. The user will be able to look up astromony-related terms (black hole, gravity, dwarf planet, etc.) through a search bar and the appropriate resources will be displayed. 

Key Technologies Used:

HTML, CSS, and JavaScript:

The foundation of the website is built using HTML for structuring content, CSS for styling, and JavaScript for dynamic interactivity.

Node.js and Express.js (or similar backend framework):

The server-side of the application is powered by Node.js, providing a scalable and efficient runtime environment. Express.js is used as a web application framework to handle routing and server-side logic.

Axios:

Axios is employed for making HTTP requests, allowing the application to fetch data from external sources, including Wikipedia and MediaWiki.

Cheerio (or similar web scraping library):

Cheerio is used for web scraping, enabling the application to extract relevant information from HTML content, more specifically, astronomy terms from the Wikipedia glossary of astronomy terms.

Features:

Search Functionality:

Users can search for astronomy-related terms using a search bar. As they type, a dropdown list dynamically suggests relevant terms, providing a user-friendly search experience.

Term Details:

Clicking on a term in the dropdown list or submitting a search query leads users to a page containing detailed information about the selected astronomy term. This information includes YouTube videos and scientific articles.

YouTube Integration:

The website integrates with the YouTube Data API to fetch educational videos related to astronomy terms. These videos are displayed on the site, offering users additional learning resources.

How It Works:

Term Data Retrieval:

Upon loading, the website fetches a list of astronomy terms from Wikipedia, using web scraping techniques.

Pageviews Data:

Pageviews data for each term are be obtained from the Wikimedia REST API, providing insights into the popularity of each term and only show the most relevant less obscure terms.

YouTube Video Recommendations:

The website leverages the YouTube Data API to search for educational videos related to astronomy terms, filtering and displaying the top-rated videos.

Interactive User Interface:

The user interface allows for smooth navigation, with real-time term suggestions during searches and dynamic content updates.

Deployment:

The application is deployed to a hosting platform like Render, making it accessible to users worldwide.
 
