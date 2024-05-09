const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November'
];

document.addEventListener('DOMContentLoaded', function () {
  // Selecting DOM elements
  const glossaryList = document.getElementById('glossary');
  const monthSelect = document.getElementById('month');
  const medianPageviewsElement = document.getElementById('average-pageviews');
  const errorContainer = document.getElementById('error-container');
  const form = document.getElementById('filter-form');

  // Populate the month dropdown
  function populateMonthSelect() {
    months.forEach((month, index) => {
      const option = document.createElement('option');
      option.value = index + 1; // Month values are 1-indexed
      option.text = month;
      monthSelect.appendChild(option);
    });
  }

  populateMonthSelect();

  // Function to check if the input term is valid
  function isValidTerm(inputTerm, availableTerms) {
    return availableTerms.includes(inputTerm);
  }

  // Search form event listener
  document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const searchTerm = document.getElementById('search-input').value;
    const availableTerms = Array.from(glossaryList.options).map(option => option.value.toLowerCase());

    // Validate the input term
    if (glossaryList.innerHTML === '') {
      errorContainer.textContent = 'Error: Please specify filtering criteria.';
    } else if (!isValidTerm(searchTerm, availableTerms)) {
      errorContainer.textContent = 'Error: Please select a term from the dropdown list.';
    } else {
      errorContainer.textContent = '';
      window.location.href = `term_template.html?term=${encodeURIComponent(searchTerm)}`;
    }
  });

  // Filter form event listener
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const CACHE_KEY = 'cachedResults';
    const cachedResults = JSON.parse(localStorage.getItem(CACHE_KEY));


    // Check if cached results exist
    if (cachedResults) {
      console.log("Cached results exist");
      handleResults(cachedResults);
    } else {
      fetchResults();
    }

    // Function to fetch results from the server
    function fetchResults() {
      fetch('https://astronomy-server.onrender.com')
        .then(response => response.json())
        .then(handleResults)
        .catch(error => console.error('Fetch error:', error));
    }

    // Function to handle and display results
    function handleResults(data) {
      const monthSelectValue = monthSelect.value.toString().padStart(2, '0');
      const filteredData = data.pageviewsData.filter(item => {
        const timestamp = item.pageviewsData.items[0].timestamp;
        const month = timestamp.slice(4, 6);
        return month == monthSelectValue;
      });

      glossaryList.innerHTML = '';

      const pageviews = filteredData.map(item => (item.pageviewsData?.items?.[0]?.views) || 0);

      if (pageviews.length > 0) {
        const sortedPageviews = pageviews.slice().sort((a, b) => a - b);
        const middleIndex = Math.floor(sortedPageviews.length / 2);
        const median = sortedPageviews.length % 2 === 0
          ? (sortedPageviews[middleIndex - 1] + sortedPageviews[middleIndex]) / 2
          : sortedPageviews[middleIndex];

        console.log('Median Pageviews:', median);
        medianPageviewsElement.textContent = `Median Monthly Pageviews For ${months[monthSelect.value - 1]} : ${median}`;
      } else {
        console.warn('No pageviews data available.');
      }

      const { Q1, Q3 } = calculatePercentiles(pageviews.slice().sort((a, b) => a - b));
      const popularityFilteredData = filteredData.filter(item => {
        const views = item.pageviewsData?.items?.[0]?.views;
        const popularity = document.getElementById("popularity");

        if (popularity.value == "most-popular") {
          return views >= Q3;
        } else if (popularity.value == "somewhat-popular") {
          return views < Q3 && views > Q1;
        } else if (popularity.value == "least-popular") {
          return views <= Q1;
        } else {
          return true;
        }
      });

      // Add filtered terms to the glossary list
      popularityFilteredData.forEach(termObject => {
        const term = termObject.term;
        const formattedTerm = term.replace(/_/g, ' ').toLowerCase();
        const option = document.createElement('option');
        option.value = formattedTerm;
        glossaryList.appendChild(option);
      });

      console.log('25th Percentile (Q1):', Q1);
      console.log('75th Percentile (Q3):', Q3);
    }

    // Function to calculate quartiles
    function calculatePercentiles(sortedData) {
      const n = sortedData.length;
      const index_Q1 = Math.ceil((n + 1) * 0.25);
      const index_Q3 = Math.floor((n + 1) * 0.75);
      const Q1 = sortedData[index_Q1 - 1];
      const Q3 = sortedData[index_Q3 - 1];
      return { Q1, Q3 };
    }
  });

  // Generate stars dynamically
  function createStars(numStars) {
    const starsContainer = document.querySelector('.stars');

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + 'vw';
      star.style.top = Math.random() * 100 + 'vh';
      starsContainer.appendChild(star);
    }
  }

  // Generate 100 stars
  createStars(100);
});

//term_template.html Javascript
    const urlParams = new URLSearchParams(window.location.search);
        const term = urlParams.get('term');

        if (term) {
            // Get all elements with the class "term-title"
            const elements = document.getElementsByClassName('term-title');
            
            // Iterate through the elements and update their text content
            for (const element of elements) {
                element.textContent = term;
            }

        }
        // Function to fetch and filter YouTube videos based on the search term and description
        function fetchAndFilterEducationalYouTubeVideos(searchTerm) {
            // Replace 'YOUR_API_KEY' with your actual YouTube Data API key
            const apiKey = 'AIzaSyCtZK0Ef1ugicZnM18t6lw6Ng1qv1PS2WE';
            const maxResults = 3; // Number of videos to display

            const searchQuery = `${searchTerm} astronomy`;

            // Make a GET request to the YouTube Data API with the description filter
            fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${searchQuery} educational&maxResults=${maxResults}&part=snippet&type=video&videoEmbeddable=true`)
                .then(response => response.json())
                .then(data => {
                    const videosContainer = document.getElementById('youtube-videos');

                    const filteredVideos = data.items
                        .filter(video => !containsKidsOrChildren(video.snippet.title) && !containsKidsOrChildren(video.snippet.description));

                    const sortedVideos = filteredVideos.sort((a, b) => b.relevance - a.relevance);

                    // Select the top three videos
                    const topThreeVideos = sortedVideos.slice(0, 3);

                    // Iterate through the top three videos and filter out "Video unavailable" videos
                    topThreeVideos.forEach(video => {
                        const iframe = document.createElement('iframe');
                        iframe.src = `https://www.youtube.com/embed/${video.id.videoId}`;
                        iframe.width = '560'; // Set the desired width
                        iframe.height = '315'; // Set the desired height
                        videosContainer.appendChild(iframe);
                            
                        });
                    })
                    .catch(error => console.error('YouTube API error:', error));
        }
            
        // Function to check if a string contains "kids" or "children"
        function containsKidsOrChildren(str) {
            const lowercasedStr = str.toLowerCase();
            return lowercasedStr.includes('kids') || lowercasedStr.includes('children');
        }

        // Call the function to fetch and display filtered educational YouTube videos
        fetchAndFilterEducationalYouTubeVideos(term);
