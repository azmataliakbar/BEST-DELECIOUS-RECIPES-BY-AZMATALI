'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
}

export default function RecipeCard({ recipe, index }: RecipeCardProps) {
  // Determine dish type based on category
  const getDishType = () => {
    const category = recipe.strCategory?.toLowerCase() || '';
    if (category.includes('chicken')) return 'Chicken Dish 🍗';
    if (category.includes('beef')) return 'Beef Dish 🥩';
    if (category.includes('dessert')) return 'Dessert Dish 🍨';
    return 'Delicious Dish ⭐';
  };

  return (
    <Link href={`/recipe/${recipe.idMeal}`}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
      >
        <div className="relative h-48 w-full">
          <Image
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg';
            }}
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
            {recipe.strMeal}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{getDishType()}</span>
            <span>⏱️ 30-45 min</span>
          </div>
        </div>
      </div>
    </Link>
  );
}