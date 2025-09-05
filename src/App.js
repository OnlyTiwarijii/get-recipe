import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchRecipes = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=e9f38a2a567c4dc2a5149c9ae7e4b7dd`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.results) {
        setRecipes(data.results);
        localStorage.setItem("recipes", JSON.stringify(data.results));
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("recipes");
    if (saved && saved !== "undefined") {
      setRecipes(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="App">
      <h1>🍴 Recipe Finder</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search delicious recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchRecipes}>Search</button>
      </div>

      {loading && <p>Loading recipes...</p>}

      <div className="recipes">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image} alt={recipe.title} />
              <p>{recipe.title}</p>
              <a
                href={`https://spoonacular.com/recipes/${recipe.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}-${recipe.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Recipe
              </a>
            </div>
          ))
        ) : (
          !loading && <p>No recipes found. Try searching!</p>
        )}
      </div>
    </div>
  );
}

export default App;
