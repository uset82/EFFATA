import React from 'react';

interface ActivityChartProps {
  className?: string;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ className = '' }) => {
  // Create a grid representing the activity chart
  // We'll use a 7x85 grid (7 days x 85 weeks) - full week starting with Sunday like GitHub
  const weeks = 85;
  const daysPerWeek = 7;
  
  // Define the pattern for "GIVE ME SOLO" using coordinates
  // Each letter will be represented in a 7x5 grid pattern (full week height)
  const letterPatterns = {
    G: [
      [1,1,1,1,1],
      [1,0,0,0,0],
      [1,0,0,0,0],
      [1,0,1,1,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,1,1,1,1]
    ],
    I: [
      [1,1,1,1,1],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [1,1,1,1,1]
    ],
    V: [
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [0,1,0,1,0],
      [0,1,0,1,0],
      [0,0,1,0,0]
    ],
    E: [
      [1,1,1,1,1],
      [1,0,0,0,0],
      [1,0,0,0,0],
      [1,1,1,1,0],
      [1,0,0,0,0],
      [1,0,0,0,0],
      [1,1,1,1,1]
    ],
    M: [
      [1,0,0,0,1],
      [1,1,0,1,1],
      [1,0,1,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1]
    ],
    S: [
      [0,1,1,1,0],
      [1,0,0,0,1],
      [1,0,0,0,0],
      [0,1,1,1,0],
      [0,0,0,0,1],
      [1,0,0,0,1],
      [0,1,1,1,0]
    ],
    O: [
      [0,1,1,1,0],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [0,1,1,1,0]
    ],
    L: [
      [1,0,0,0,0],
      [1,0,0,0,0],
      [1,0,0,0,0],
      [1,0,0,0,0],
      [1,0,0,0,0],
      [1,0,0,0,0],
      [1,1,1,1,1]
    ]
  };

  // Create the activity grid
  const createActivityGrid = () => {
    const grid: number[][] = [];
    for (let week = 0; week < weeks; week++) {
      const weekData: number[] = [];
      for (let day = 0; day < daysPerWeek; day++) {
        weekData.push(0); // Default to no activity
      }
      grid.push(weekData);
    }
    return grid;
  };

  const activityGrid = createActivityGrid();

  // Position the text "GIVE ME SOLO" in the grid
  const text = "GIVE ME SOLO";
  const letters = text.split('');
  
  // Starting position for the text (with more margin to ensure it fits)
  const startWeek = 8;
  const startDay = 0; // Start from Sunday (top of the week)
  
  let currentWeek = startWeek;
  
  letters.forEach((letter, letterIndex) => {
    if (letter === ' ') {
      currentWeek += 4; // More space between words for better readability
      return;
    }
    
    const pattern = letterPatterns[letter as keyof typeof letterPatterns];
    if (pattern) {
      // Draw the letter pattern
      for (let row = 0; row < pattern.length && row < daysPerWeek; row++) {
        for (let col = 0; col < pattern[row].length; col++) {
          const week = currentWeek + col;
          const day = startDay + row;
          
          if (week < weeks && day < daysPerWeek && pattern[row][col] === 1) {
            activityGrid[week][day] = 4; // High activity level
          }
        }
      }
      
      currentWeek += 7; // More space between letters (5 + 2 spaces)
    }
  });

  // Add some random background activity
  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < daysPerWeek; day++) {
      if (activityGrid[week][day] === 0 && Math.random() < 0.1) {
        activityGrid[week][day] = Math.floor(Math.random() * 3) + 1;
      }
    }
  }

  const getActivityColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-800 border border-gray-700';
      case 1: return 'bg-green-900 border border-green-800';
      case 2: return 'bg-green-700 border border-green-600';
      case 3: return 'bg-green-600 border border-green-500';
      case 4: return 'bg-green-500 border border-green-400';
      default: return 'bg-gray-800 border border-gray-700';
    }
  };

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Full week starting with Sunday

  return (
    <div className={`bg-gray-900 p-6 rounded-lg ${className}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Hello! Carlos Carpio
            </h2>
            <p className="text-gray-400">
              This is your day <span className="font-semibold">144</span> of using TRAE IDE.
            </p>
            <p className="text-green-400 font-mono text-sm mt-1">
              # Builder
            </p>
          </div>
          <div className="flex-shrink-0">
            <img 
              src="/profile.svg" 
              alt="Carlos Profile" 
              className="w-16 h-16 rounded-full border-2 border-gray-600 flex-shrink-0"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            Active Days
            <span className="text-gray-400 text-sm">ⓘ</span>
          </h3>
          
          <div className="space-y-2">
            {/* Month labels */}
            <div className="flex text-xs text-gray-400 ml-8">
              {Array.from({ length: Math.ceil(weeks / 5) }, (_, index) => (
                <div key={index} className="w-15 text-center" style={{ marginRight: '4px' }}>
                  {index % 3 === 0 ? months[index % months.length] : ''}
                </div>
              ))}
            </div>
            
            {/* Activity grid */}
            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col text-xs text-gray-400 mr-2">
                {dayLabels.map((label, index) => (
                  <div key={index} className="h-3 flex items-center justify-end pr-1" style={{ marginBottom: '1px' }}>
                    {label}
                  </div>
                ))}
              </div>
              
              {/* Grid */}
              <div className="flex gap-px">
                {activityGrid.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-px">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 rounded-sm ${getActivityColor(day)}`}
                        title={`Activity level: ${day}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 text-xs text-gray-400 mt-2">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-800 border border-gray-700"></div>
                <div className="w-3 h-3 rounded-sm bg-green-900 border border-green-800"></div>
                <div className="w-3 h-3 rounded-sm bg-green-700 border border-green-600"></div>
                <div className="w-3 h-3 rounded-sm bg-green-600 border border-green-500"></div>
                <div className="w-3 h-3 rounded-sm bg-green-500 border border-green-400"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            AI Code Accepted
            <span className="text-gray-400 text-sm">ⓘ</span>
          </h3>
          <div className="text-2xl font-bold text-white">–</div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            Chat Count
            <span className="text-gray-400 text-sm">ⓘ</span>
          </h3>
          <div className="text-2xl font-bold text-white">–</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;