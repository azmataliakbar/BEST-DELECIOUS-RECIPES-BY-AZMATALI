import { Recipe } from '@/types';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Fallback recipes in case API fails
function getFallbackRecipes(): Recipe[] {
  return [
    {
      idMeal: "fb1",
      strMeal: "Beef Wellington",
      strMealThumb: "https://www.themealdb.com/images/media/meals/vxtpwy1488569935.jpg",
      strCategory: "Beef",
      strArea: "British"
    },
    {
      idMeal: "fb2",
      strMeal: "Chocolate Cake",
      strMealThumb: "https://www.themealdb.com/images/media/meals/qxutws1486979427.jpg",
      strCategory: "Dessert",
      strArea: "International"
    },
    {
      idMeal: "fb3",
      strMeal: "Beef Steak",
      strMealThumb: "https://www.themealdb.com/images/media/meals/sssvup1511381702.jpg",
      strCategory: "Beef",
      strArea: "American"
    },
    {
      idMeal: "fb4",
      strMeal: "Cheesecake",
      strMealThumb: "https://www.themealdb.com/images/media/meals/qtuuys1511387068.jpg",
      strCategory: "Dessert",
      strArea: "American"
    },
    {
      idMeal: "fb5",
      strMeal: "Beef Biryani",
      strMealThumb: "https://www.themealdb.com/images/media/meals/xrttxv1487429136.jpg",
      strCategory: "Beef",
      strArea: "Pakistani"
    },
    {
      idMeal: "fb6",
      strMeal: "Apple Pie",
      strMealThumb: "https://www.themealdb.com/images/media/meals/qqtvsu1511382103.jpg",
      strCategory: "Dessert",
      strArea: "American"
    },
    {
      idMeal: "fb7",
      strMeal: "Chicken Karahi",
      strMealThumb: "https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg",
      strCategory: "Chicken",
      strArea: "Pakistani"
    },
    {
      idMeal: "fb8",
      strMeal: "Chicken Biryani",
      strMealThumb: "https://www.themealdb.com/images/media/meals/xrttxv1487429136.jpg",
      strCategory: "Chicken",
      strArea: "Pakistani"
    }
  ];
}

export async function getPakistaniRecipes(): Promise<Recipe[]> {
  try {
    // Get recipes from all main categories
    const categories: string[] = ['Chicken', 'Beef', 'Dessert', 'Lamb', 'Seafood', 'Vegetarian', 'Pasta', 'Breakfast', 'Goat', 'Pork'];
    let allRecipes: Recipe[] = [];
    
    for (const category of categories) {
      try {
        const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
          allRecipes = [...allRecipes, ...data.meals];
        }
      } catch (err) {
        console.error(`Error fetching ${category}:`, err);
      }
    }
    
    // Remove duplicates by idMeal
    const uniqueRecipes: Recipe[] = Array.from(new Map(allRecipes.map(r => [r.idMeal, r])).values());
    
    return uniqueRecipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return getFallbackRecipes();
  }
}

export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
    
    if (!response.ok) {
      throw new Error(`Category fetch failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const meals: Recipe[] = data.meals || [];
    
    return meals;
  } catch (error) {
    console.error(`Error fetching ${category} recipes:`, error);
    if (category === 'Beef' || category === 'Dessert' || category === 'Chicken') {
      const fallbacks: Recipe[] = getFallbackRecipes();
      return fallbacks.filter(r => r.strCategory === category);
    }
    return [];
  }
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch recipe with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
}

export async function getAllCategories(): Promise<{ strCategory: string }[]> {
  try {
    const response = await fetch(`${BASE_URL}/list.php?c=list`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}