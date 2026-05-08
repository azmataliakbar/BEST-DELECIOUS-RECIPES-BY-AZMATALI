export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pak-light to-white dark:from-pak-dark dark:to-gray-900">
      <div className="text-center">
        <div className="text-8xl mb-4 animate-bounce">🍳</div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pak-orange mx-auto mb-4"></div>
        <p className="text-xl text-pak-dark dark:text-white">Loading delicious recipes...</p>
      </div>
    </div>
  );
}