'use client';
import { useState, useEffect } from 'react';
import { getPakistaniRecipes, getRecipesByCategory } from '@/lib/api';
import { Recipe } from '@/types';
import RecipeCard from '@/components/RecipeCard';
import { Flame, Coffee, Heart, Sun, Moon } from 'lucide-react';

export default function Home() {
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [darkMode, setDarkMode] = useState(false);

  const categories = ['All', 'Chicken', 'Beef', 'Dessert'];

  useEffect(() => {
    async function loadRecipes() {
      setLoading(true);
      const allRecipes = await getPakistaniRecipes();
      setFilteredRecipes(allRecipes);
      setLoading(false);
    }
    loadRecipes();

    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const filterByCategory = async (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'All') {
      const allRecipes = await getPakistaniRecipes();
      setFilteredRecipes(allRecipes);
    } else {
      const categoryRecipes = await getRecipesByCategory(category);
      setFilteredRecipes(categoryRecipes);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pak-light via-white to-pak-light dark:from-pak-dark dark:via-gray-900 dark:to-pak-dark">
      {/* Animated Background Emojis */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl animate-float">🍗</div>
        <div className="absolute bottom-20 right-10 text-7xl animate-float" style={{ animationDelay: '1s' }}>🍚</div>
        <div className="absolute top-40 right-20 text-5xl animate-float" style={{ animationDelay: '2s' }}>🌶️</div>
        <div className="absolute bottom-40 left-20 text-6xl animate-float" style={{ animationDelay: '1.5s' }}>🍛</div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-pak-dark/80 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-bounce">⭐</div>
              <h1 className="text-2xl xs:text-3xl font-bold">
                <span className="bg-gradient-to-r from-pak-orange to-pak-green bg-clip-text text-transparent drop-shadow-md">
                  BEST Delicious Recipe
                </span>
              </h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-pak-orange/20 hover:bg-pak-orange/30 transition-all transform hover:scale-110"
            >
              {darkMode ? <Sun className="text-pak-yellow" size={24} /> : <Moon className="text-pak-dark" size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 xs:px-2 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12" style={{ animation: 'slideUp 0.5s ease-out' }}>
          <div className="text-8xl mb-4 animate-float">🍽️✨</div>
          <h2 className="text-4xl xs:text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pak-orange via-pak-yellow to-pak-green bg-clip-text text-transparent drop-shadow-lg">
              Discover Best Flavors
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore authentic delicious mouth-watering recipes 🏆
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => filterByCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-pak-orange text-white shadow-lg'
                  : 'bg-white dark:bg-pak-dark text-pak-dark dark:text-white border-2 border-pak-orange/30 hover:border-pak-orange'
              }`}
            >
              {category === 'Chicken' && '🍗 '}
              {category === 'Beef' && '🥩 '}
              {category === 'Dessert' && '🍨 '}
              {category}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="flex justify-center gap-8 mb-12">
          <div className="flex items-center gap-2 bg-white/50 dark:bg-pak-dark/50 px-4 py-2 rounded-full">
            <Flame className="text-pak-orange" size={20} />
            <span className="font-semibold">{filteredRecipes.length} Recipes</span>
          </div>
          <div className="flex items-center gap-2 bg-white/50 dark:bg-pak-dark/50 px-4 py-2 rounded-full">
            <Heart className="text-pak-pink" size={20} />
            <span className="font-semibold">100% Authentic</span>
          </div>
          <div className="flex items-center gap-2 bg-white/50 dark:bg-pak-dark/50 px-4 py-2 rounded-full">
            <Coffee className="text-pak-green" size={20} />
            <span className="font-semibold">Delicious Taste</span>
          </div>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe, index) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-2xl font-bold text-pak-dark dark:text-white">No recipes found</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Loading recipes...
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-gradient-to-r from-pak-orange to-pak-green py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="text-3xl mb-2 animate-float">👨‍🍳✨</div>
          <p className="text-white text-lg font-semibold">
            Designed By : Azmat Ali
          </p>
          <p className="text-white/80 text-sm mt-2">
            Made with ❤️ for Delicious Food Lovers ⭐
          </p>
          <div className="flex justify-center gap-4 mt-4 text-white text-sm flex-wrap">
            <span>🍗 Chicken Mandi</span>
            <span>🍚 Tandoori Chicken</span>
            <span>🥘 Algerian Kefta</span>
            <span>🥩 Beef Wellington</span>
            <span>🥘 Knafeh</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </div>
  );
}
