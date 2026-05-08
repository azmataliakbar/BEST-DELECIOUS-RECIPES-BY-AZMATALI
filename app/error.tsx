'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pak-light to-white dark:from-pak-dark dark:to-gray-900">
      <div className="text-center p-8">
        <div className="text-8xl mb-4">😢</div>
        <h2 className="text-2xl font-bold text-pak-dark dark:text-white mb-4">Something went wrong!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Failed to load recipes. Please try again.</p>
        <button
          onClick={reset}
          className="bg-pak-orange text-white px-6 py-3 rounded-full font-semibold hover:bg-pak-green transition-all"
        >
          🔄 Try Again
        </button>
      </div>
    </div>
  );
}