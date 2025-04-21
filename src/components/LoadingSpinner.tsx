function LoadingSpinner() {
    return (
      <div className="flex items-center justify-center space-x-2 animate-pulse text-purple-300 text-sm">
        <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce delay-300"></div>
        <span className="ml-3">Cargando siguiente canción...</span>
      </div>
    );
  }
  
  export default LoadingSpinner;
  