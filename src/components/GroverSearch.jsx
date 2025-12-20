import React, { useState, useEffect } from 'react';
import { Search, Zap, Clock } from 'lucide-react';
import { GroverSearch as GroverSearchSimulator } from '../utils/quantumSimulator';

const GroverSearch = () => {
  const [search] = useState(() => new GroverSearchSimulator(8));
  const [target, setTarget] = useState(null);
  const [classicalAttempts, setClassicalAttempts] = useState(0);
  const [quantumAttempts, setQuantumAttempts] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    startNewSearch();
  }, []);

  const startNewSearch = () => {
    search.setNewTarget();
    const newTarget = search.getTarget();
    setTarget(newTarget);
    setClassicalAttempts(0);
    setQuantumAttempts(0);
    setIsSearching(false);
    setSearchType(null);
    setCheckedItems([]);
  };

  const runClassicalSearch = async () => {
    setIsSearching(true);
    setSearchType('classical');
    setCheckedItems([]);
    
    // Simulate checking each item one by one
    for (let i = 0; i < 8; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setCheckedItems(prev => [...prev, i]);
      if (i === target) {
        setClassicalAttempts(i + 1);
        setIsSearching(false);
        return;
      }
    }
    setIsSearching(false);
  };

  const runQuantumSearch = async () => {
    setIsSearching(true);
    setSearchType('quantum');
    setCheckedItems([]);
    
    // Grover's algorithm checks multiple items simultaneously
    // For visualization, we'll show it checking items in parallel
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Show all items being checked simultaneously
    setCheckedItems([0, 1, 2, 3, 4, 5, 6, 7]);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = search.quantumSearch();
    setQuantumAttempts(search.quantumAttempts);
    setIsSearching(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-8 h-8 text-quantum-purple" />
        <h2 className="text-2xl font-bold text-gray-800">Grover's Search: Find the Hidden Number</h2>
      </div>

      <p className="text-gray-600 mb-8 text-lg">
        Find a hidden number between 1-8. Classical computers check one by one. 
        Quantum computers can check multiple possibilities simultaneously!
      </p>

      {/* Target Display */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Hidden Target Number:</p>
        <p className="text-3xl font-bold text-gray-800">{target !== null ? target + 1 : '?'}</p>
        <p className="text-xs text-gray-500 mt-2">(You don't know this yet — try to find it!)</p>
      </div>

      {/* Number Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => {
          const isChecked = checkedItems.includes(num);
          const isTarget = num === target;
          const isFound = isChecked && isTarget && !isSearching;
          
          return (
            <div
              key={num}
              className={`h-20 rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                isFound
                  ? 'bg-green-500 text-white scale-110 shadow-lg'
                  : isChecked && searchType === 'classical'
                  ? 'bg-yellow-200 text-gray-700'
                  : isChecked && searchType === 'quantum'
                  ? 'bg-purple-200 text-purple-800'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {num + 1}
            </div>
          );
        })}
      </div>

      {/* Search Controls */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={runClassicalSearch}
          disabled={isSearching}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Clock className="w-5 h-5" />
          Classical Search
        </button>
        <button
          onClick={runQuantumSearch}
          disabled={isSearching}
          className="bg-quantum-purple hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Quantum Search
        </button>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Classical Results</h3>
          <p className="text-2xl font-bold text-gray-800">
            {classicalAttempts > 0 ? `${classicalAttempts} attempts` : '—'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Average: ~4 attempts</p>
        </div>
        <div className="border-2 border-quantum-purple rounded-lg p-4 bg-purple-50">
          <h3 className="font-semibold text-quantum-purple mb-2">Quantum Results</h3>
          <p className="text-2xl font-bold text-quantum-purple">
            {quantumAttempts > 0 ? `${quantumAttempts} attempts` : '—'}
          </p>
          <p className="text-sm text-purple-600 mt-1">Average: ~2-3 attempts</p>
        </div>
      </div>

      <button
        onClick={startNewSearch}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        Start New Search
      </button>

      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-blue-800 text-sm">
          <strong>💡 Wow Moment:</strong> Quantum doesn't check answers one by one — 
          it explores multiple possibilities simultaneously, giving it a quadratic speedup!
        </p>
      </div>
    </div>
  );
};

export default GroverSearch;

