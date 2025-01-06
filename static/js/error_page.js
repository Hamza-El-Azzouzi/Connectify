export function errorPage() {
    const app = document.getElementById("main-content");
    applyStyles()
      const errorContainer = document.createElement('div');
      errorContainer.classList.add('error-container');
 
      const errorContent = document.createElement('div');
      errorContent.classList.add('error-content');
  
      const errorAnimation = document.createElement('div');
      errorAnimation.classList.add('error-animation');

      const errorIcon = document.createElement('div');
      errorIcon.classList.add('error-icon');
      errorIcon.textContent = '😕'; 
  

      const errorShadow = document.createElement('div');
      errorShadow.classList.add('error-shadow');
  
      errorAnimation.appendChild(errorIcon);
      errorAnimation.appendChild(errorShadow);
  
      // Create the heading
      const heading = document.createElement('h1');
      heading.textContent = 'Error Page';

      const paragraph = document.createElement('p');
      paragraph.textContent = "Oops! An Error Occured Here.";

      const homeButton = document.createElement('a');
      homeButton.classList.add('home-button');
      homeButton.textContent = 'Go Back to Feed';
      homeButton.setAttribute('data-page', 'feed'); 

      errorContent.appendChild(errorAnimation);
      errorContent.appendChild(heading);
      errorContent.appendChild(paragraph);
      errorContent.appendChild(homeButton);
    console.log(errorContent)
      errorContainer.appendChild(errorContent);
        console.log(app)
      app.appendChild(errorContainer) ;
}
function applyStyles() {
    var link = document.querySelector('link[rel="stylesheet"]');
    link.href = '/static/css/error.css';
}
