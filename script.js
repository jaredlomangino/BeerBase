const submit = document.getElementById("submit");
const search = document.getElementById("search");
const random = document.getElementById("random");
const cocktailElement = document.getElementById("cocktails");
const resultHeading = document.getElementById("result-heading");
const errorMessage = document.getElementById("error-message");

// Search for cocktail based on user keyword
// Generate HTML for cocktail
function searchForCocktail(e) {
  e.preventDefault();

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
                    <div class="cocktail-info" data-cocktailID="${cocktail.idCocktail}">
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

submit.addEventListener("submit", searchForCocktail);
