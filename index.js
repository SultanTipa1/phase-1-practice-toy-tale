// src/index.js

document.addEventListener('DOMContentLoaded', () => {
    const toyCollection = document.getElementById('toy-collection');
    const toyForm = document.getElementById('add-toy-form');
    const newToyBtn = document.getElementById('new-toy-btn');
    const container = document.querySelector('.container');
  
    // Fetch toys from the API
    function fetchToys() {
      fetch('http://localhost:3000/toys')
        .then(response => response.json())
        .then(toys => {
          toys.forEach(toy => {
            renderToyCard(toy);
          });
        });
    }
  
    // Function to render a single toy card
    function renderToyCard(toy) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" alt="${toy.name}" class="toy-avatar">
        <p>${toy.likes} Likes</p>
        <button class="like-btn">Like <3</button>
      `;
  
      // Event listener for like button
      const likeButton = card.querySelector('.like-btn');
      likeButton.addEventListener('click', () => {
        // Update likes in the database
        toy.likes++;
        fetch(`http://localhost:3000/toys/${toy.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ likes: toy.likes })
        })
        .then(response => response.json())
        .then(updatedToy => {
          // Update the DOM with new like count
          card.querySelector('p').textContent = `${updatedToy.likes} Likes`;
        });
      });
  
      toyCollection.appendChild(card);
    }
  
    // Event listener for form submission (Add Toy)
    toyForm.addEventListener('submit', event => {
      event.preventDefault();
  
      const toyName = toyForm.elements['name'].value;
      const toyImage = toyForm.elements['image'].value;
  
      // Create new toy object
      const newToy = {
        name: toyName,
        image: toyImage,
        likes: 0 // Initial likes
      };
  
      // POST new toy to the database
      fetch('http://localhost:3000/toys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newToy)
      })
      .then(response => response.json())
      .then(newToy => {
        // Render the new toy card
        renderToyCard(newToy);
  
        // Clear the form fields
        toyForm.reset();
  
        // Hide the form after submission
        container.style.display = 'none';
        newToyBtn.style.display = 'inline-block'; // Show the "Add a new toy!" button
      });
    });
  
    // Event listener to toggle form visibility
    newToyBtn.addEventListener('click', () => {
      container.style.display = 'block';
      newToyBtn.style.display = 'none'; // Hide the "Add a new toy!" button
    });
  
    // Initial fetch and render
    fetchToys();
  });
  