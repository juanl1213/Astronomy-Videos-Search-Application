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

    // Loop through months and create options for the dropdown
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
    if (!isValidTerm(searchTerm, availableTerms)) {
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
      fetch('http://localhost:3000/results')
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

      const pageviews = filteredData.map(item => {
        const items = item.pageviewsData && item.pageviewsData.items;
        const views = (items && items[0] && items[0].views) || 0;
        return views;
      });

      if (pageviews.length > 0) {
        // Calculate and log the median
        const sortedPageviews = pageviews.slice().sort((a, b) => a - b);
        const middleIndex = Math.floor(sortedPageviews.length / 2);
        const median = sortedPageviews.length % 2 === 0
          ? (sortedPageviews[middleIndex - 1] + sortedPageviews[middleIndex]) / 2
          : sortedPageviews[middleIndex];

        console.log('Median Pageviews:', median);
        medianPageviewsElement.textContent = `Median Monthly Pageviews For ${months[document.getElementById('month').value - 1]} : ${median}`;
      } else {
        console.warn('No pageviews data available.');
      }

      const sortedPageviews = pageviews.slice().sort((a, b) => a - b);
      const { Q1, Q3 } = calculatePercentiles(sortedPageviews);

      const popularityFilteredData = filteredData.filter(item => {
        const items = item.pageviewsData && item.pageviewsData.items;
        const views = (items && items[0] && items[0].views);
        const popularity = document.getElementById("popularity");

        // Filter data based on popularity
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

    // Create stars with random positions
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + 'vw'; /* Random horizontal position */
      star.style.top = Math.random() * 100 + 'vh'; /* Random vertical position */
      starsContainer.appendChild(star);
    }
  }

  // Generate 100 stars
  createStars(100);
});
