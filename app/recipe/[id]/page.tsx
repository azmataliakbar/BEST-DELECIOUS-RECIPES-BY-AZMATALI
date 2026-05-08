'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getRecipeById } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Share2, Printer, ChefHat, Flame, Clock } from 'lucide-react';

interface RecipeDetails {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
  [key: string]: string | undefined;
}

export default function RecipePage() {
  const params = useParams();
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch recipe directly in useEffect - no separate loadRecipe function
  useEffect(() => {
    let isMounted = true;
    
    const fetchRecipe = async () => {
      if (!params.id) return;
      
      setLoading(true);
      setError(false);
      try {
        const data = await getRecipeById(params.id as string);
        if (isMounted) {
          if (data) {
            setRecipe(data);
          } else {
            setError(true);
          }
        }
      } catch {
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchRecipe();
    
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  const getIngredients = () => {
    if (!recipe) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({ ingredient, measure: measure || '' });
      }
    }
    return ingredients;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pak-light to-white dark:from-pak-dark dark:to-gray-900">
        <div className="text-center px-4">
          <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🍳</div>
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-pak-orange mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-pak-dark dark:text-white">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pak-light to-white dark:from-pak-dark dark:to-gray-900 px-4">
        <div className="text-center p-4 sm:p-8">
          <div className="text-5xl sm:text-6xl mb-4">😢</div>
          <h2 className="text-xl sm:text-2xl font-bold text-pak-dark dark:text-white mb-4">Recipe not found!</h2>
          <Link href="/">
            <div className="inline-flex items-center gap-2 bg-pak-orange text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-pak-green transition-all cursor-pointer">
              <ArrowLeft size={16} />
              Back to Recipes
            </div>
          </Link>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pak-light via-white to-pak-light dark:from-pak-dark dark:via-gray-900 dark:to-pak-dark">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        {/* Back Button */}
        <Link href="/">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-pak-orange text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-pak-green transition-all cursor-pointer mb-4 sm:mb-6">
            <ArrowLeft size={14} />
            Back
          </div>
        </Link>

        {/* Recipe Header */}
        <div className="bg-white dark:bg-pak-dark/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-6 sm:mb-8">
          <div className="relative h-56 xs:h-64 sm:h-80 md:h-96 lg:h-[400px]">
            <Image
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                {recipe.strMeal} 🍜
              </h1>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2 bg-black/50 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm">
                  <ChefHat size={12} />
                  <span>{recipe.strCategory || 'Delicious'}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 bg-black/50 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm">
                  <Flame size={12} />
                  <span>{recipe.strArea || 'International'}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 bg-black/50 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm">
                  <Clock size={12} />
                  <span>30-45 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 justify-end">
          <div
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: recipe.strMeal,
                  text: 'Check out this delicious recipe!',
                  url: window.location.href,
                });
              }
            }}
            className="flex items-center gap-1 sm:gap-2 bg-pak-orange text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-pak-green transition-all cursor-pointer"
          >
            <Share2 size={12} />
            Share
          </div>
          <div
            onClick={() => window.print()}
            className="flex items-center gap-1 sm:gap-2 bg-pak-dark text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-pak-orange transition-all cursor-pointer"
          >
            <Printer size={12} />
            Print
          </div>
        </div>

        {/* Ingredients & Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Ingredients */}
          <div className="bg-white dark:bg-pak-dark/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg overflow-x-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-pak-orange flex items-center gap-2 flex-wrap">
              🛒 Ingredients
              <span className="text-xs bg-pak-orange text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                {ingredients.length} items
              </span>
            </h2>
            <ul className="space-y-1.5 sm:space-y-2">
              {ingredients.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 hover:bg-pak-orange/10 rounded-lg transition-colors text-xs sm:text-sm">
                  <input type="checkbox" className="mt-0.5 w-3 h-3 sm:w-4 sm:h-4 accent-pak-orange shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 break-words">
                    <strong className="text-xs sm:text-sm">{item.measure}</strong> {item.ingredient}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-pak-dark/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg overflow-x-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-pak-green flex items-center gap-2">
              📝 Instructions
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-sm break-words">
                {recipe.strInstructions}
              </p>
            </div>
          </div>
        </div>

        {/* YouTube Video */}
        {recipe.strYoutube && (
          <div className="mt-6 sm:mt-8 bg-white dark:bg-pak-dark/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-pak-pink flex items-center gap-2">
              🎥 Watch Tutorial
            </h2>
            <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${recipe.strYoutube.split('v=')[1]}`}
                title={recipe.strMeal}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 md:mt-20 bg-gradient-to-r from-pak-orange to-pak-green py-4 sm:py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-sm sm:text-base md:text-lg font-semibold">
            Designed By : Azmat Ali
          </p>
          <p className="text-white/80 text-xs sm:text-sm mt-1 sm:mt-2">
            Enjoy authentic delicious flavors! ⭐
          </p>
        </div>
      </footer>
    </div>
  );
}