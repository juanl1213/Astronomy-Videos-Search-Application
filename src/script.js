// Selecting the glossary list element
const glossaryList = document.getElementById('glossary');

document.addEventListener('DOMContentLoaded', function () {
  // Selecting the month dropdown
  const monthSelect = document.getElementById('month');

  function populateMonthSelect() {
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November'
    ];

    for (let i = 0; i < months.length; i++) {
      const option = document.createElement('option');
      option.value = i + 1; // Month values are 1-indexed
      option.text = months[i];
      monthSelect.appendChild(option);
    }
  }

  populateMonthSelect();

  // Selecting loading elements
  //const loadingTextElement = document.getElementById('loading-text');
  //const loadingAnimation = document.getElementById("ellipsis");
  const medianPageviewsElement = document.getElementById('average-pageviews');

  // Local Storage Cache Key

// Function to capitalize the first letter of each word
  function capitalizeFirstLetter(str) {
  return str.replace(/\b\w/g, match => match.toUpperCase());
  }

// Error container
const errorContainer = document.getElementById('error-container');

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
const form = document.getElementById('filter-form');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const CACHE_KEY = 'cachedResults';

  // Check if cached results exist
  const cachedResults = JSON.parse(localStorage.getItem(CACHE_KEY));

  // Fetch and display results
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
      .then(data => {
        if (data && Array.isArray(data.pageviewsData)) {
          // Cache the results
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          // Handle the results
          handleResults(data);
        } else {
          console.error('Invalid or missing data:', data);
        }
      })
      .catch(error => console.error('Fetch error:', error));
  }

  // Function to handle and display results
  function handleResults(data) {
    //const terms = data.pageviewsData.map(item => item.term);

    const monthSelect = document.getElementById('month');

    /*function monthNameToNumber(monthName) {
      const months = [
          'January', 'February', 'March', 'April',
          'May', 'June', 'July', 'August',
          'September', 'October', 'November', 'December'
      ];
  
      const numericMonth =  months.indexOf(monthName) + 1; // Add 1 because JavaScript months are 0-indexed
      return numericMonth.toString().padStart(2, '0');
    }*/
    // Filter the data based on the selected month

    console.log(data.pageviewsData);

    const filteredData = data.pageviewsData.filter(item => {
      // Extract year and month information from the data
      const timestamp = item.pageviewsData.items[0].timestamp;
      const month = timestamp.slice(4, 6);

      const formattedMonth = monthSelect.value.toString().padStart(2, '0');
      // Check if the extracted month matches the selected month
      return month == formattedMonth; // Assuming the year is always 2023
  });

  glossaryList.innerHTML = '';


  filteredData.forEach(termObject => {
    const term = termObject.term;

    const formattedTerm = term.replace(/_/g, ' ').toLowerCase();
    const option = document.createElement('option');
    option.value = formattedTerm;
    glossaryList.appendChild(option);
    });

    const pageviews = filteredData.map(item => {
  const items = item.pageviewsData && item.pageviewsData.items;
  // Extract views from each item or return 0 if not available
  const views = (items && items[0] && items[0].views) || 0;
  return views;
 });
    if (pageviews.length > 0) {
      console.log('Original Pageviews array:', pageviews); // Add this line
  
      // Calculate and log the median
      const sortedPageviews = pageviews.sort((a, b) => a - b);
      console.log('Sorted Pageviews array:', sortedPageviews); // Add this line
  
      const middleIndex = Math.floor(sortedPageviews.length / 2);
      console.log('Middle Index:', middleIndex); // Add this line
  
      const median = sortedPageviews.length % 2 === 0
        ? (sortedPageviews[middleIndex - 1] + sortedPageviews[middleIndex]) / 2
        : sortedPageviews[middleIndex];
  
      console.log('Median Pageviews:', median);

      medianPageviewsElement.textContent = `${median}`;
    } else {
      console.warn('No pageviews data available.');
    }

      // Example usage
    const sortedPageviews = pageviews.slice().sort((a, b) => a - b);
    const { Q1, Q3 } = calculatePercentiles(sortedPageviews);
  
    console.log('25th Percentile (Q1):', Q1);
    console.log('75th Percentile (Q3):', Q3);
  
  }


  function calculatePercentiles(sortedData) {
    const n = sortedData.length;
    
    // Calculate indices for Q1 and Q3
    const index_Q1 = Math.ceil((n + 1) * 0.25);
    const index_Q3 = Math.floor((n + 1) * 0.75);
  
    // Retrieve values at Q1 and Q3 indices
    const Q1 = sortedData[index_Q1 - 1];
    const Q3 = sortedData[index_Q3 - 1];
  
    return { Q1, Q3 };
  }
  
});


  // Handle the form submission here
  // You can access the selected values using popularitySelect.value, yearSelect.value, and monthSelect.value
});

// Generate stars dynamically
function createStars(numStars) {
  const starsContainer = document.querySelector('.stars');

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
