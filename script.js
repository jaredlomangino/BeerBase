const submit = document.getElementById("submit");
const search = document.getElementById("search");
const random = document.getElementById("random");
const cocktailElement = document.getElementById("cocktails");
const singleCocktail = document.getElementById("cocktail-element");
const resultHeading = document.getElementById("result-heading");
const errorMessage = document.getElementById("error-message");

// Search for cocktail based on user keyword
// Generate HTML for cocktail
function searchForCocktail(e) {
  e.preventDefault();
  singleCocktail.innerHTML = "";
  const searchValue = search.value;

  if (searchValue.trim()) {
    errorMessage.className = "error-message";
    fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchValue}`
    )
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${searchValue}':</h2>`;

        if (data.drinks === null) {
          resultHeading.innerHTML = `<h2>No search results found for '${searchValue}'</h2>`;
        } else {
          cocktailElement.innerHTML = data.drinks
            .map(
              cocktail =>
                `
                <div class="cocktail">
                    <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}"/>
                    <div class="cocktail-info" data-cocktailID="${cocktail.idDrink}">
                        <h3>${cocktail.strDrink}</h3>
                    </div>
                </div>
                `
            )
            .join("");
        }
        search.value = "";
      });
  } else {
    errorMessage.className = "error-message-display";
  }
}

function getCocktailbyID(cocktailID) {
  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailID}`
  )
    .then(res => res.json())
    .then(data => {
      const cocktail = data.drinks[0];

      addCocktailToDOM(cocktail);
    });
}

function getRandomCocktail() {
  cocktailElement.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const cocktail = data.drinks[0];

      addCocktailToDOM(cocktail);
    });
}

function addCocktailToDOM(cocktail) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (cocktail[`strIngredient${i}`]) {
      ingredients.push(
        `${cocktail[`strIngredient${i}`]} - ${cocktail[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleCocktail.innerHTML = `
    <div class="single-cocktail">
      <h1>${cocktail.strDrink}</h1>
      <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}"/>
      <div class="single-cocktail-info">
        ${cocktail.strGlass ? `<p>Glass Type: ${cocktail.strGlass}</p>` : ""}
      </div>
      <div class="main">
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
        </ul>
        <p>${cocktail.strInstructions}</p>
      </div>
    </div>
  `;
}

submit.addEventListener("submit", searchForCocktail);

random.addEventListener("click", getRandomCocktail);

cocktailElement.addEventListener("click", e => {
  const cocktailInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains("cocktail-info");
    } else {
      return false;
    }
  });

  if (cocktailInfo) {
    const cocktailID = cocktailInfo.getAttribute("data-cocktailID");
    getCocktailbyID(cocktailID);
  }
});
