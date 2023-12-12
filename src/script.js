
const glossaryList = document.getElementById('glossary');

//This function alone works to fetch the terms and attach them 
//to the datalist element in the index.html page 

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