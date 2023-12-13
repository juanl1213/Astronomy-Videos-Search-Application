
const glossaryList = document.getElementById('glossary');

//This function alone works to fetch the terms and attach them 
//to the datalist element in the index.html page 

/*const apiKey = '7f59af901d2d86f78a1fd60c1bf9426a';
const apiUrl = 'https://api.elsevier.com/content/search/sciencedirect';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Function to query the API for a given term
async function queryScienceDirect(term) {
  const queryUrl = `${apiUrl}?query=${encodeURIComponent(term)}&apiKey=${apiKey}`;

  try {
    const response = await fetch(queryUrl, { method: 'GET', headers: { 'Accept': 'application/json' } });
    const data = await response.json();
    
    // Process the data as needed
    console.log(`Results for ${term}:`, data);

    await delay(1000);
  } catch (error) {
    console.error(`Error querying ScienceDirect for ${term}:`, error);
  }
}*/


document.addEventListener('DOMContentLoaded', function() {
  fetch('http://localhost:3000/results')
      .then(response => response.json())
      .then(data => {
          if (data && Array.isArray(data.pageviewsData)) {
              const terms = data.pageviewsData.map(item => item.term);

              terms.forEach(term => {
                 const formattedTerm = term.replace(/_/g, ' ').toLowerCase();

                  const option = document.createElement('option');
                  option.value = formattedTerm;
                  glossaryList.appendChild(option);

                  queryScienceDirect(formattedTerm);
              });
          } else {
              console.error('Invalid or missing data:', data);
          }
      })
      .catch(error => console.error('Fetch error:', error));
});


// Function to capitalize the first letter of each word
function capitalizeFirstLetter(str) {
  return str.replace(/\b\w/g, match => match.toUpperCase());
}

document.getElementById('search-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const searchTerm = document.getElementById('search-input').value;
        window.location.href = `term_template.html?term=${encodeURIComponent(searchTerm)}`;
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

createStars(100); // Adjust the number of stars as needed