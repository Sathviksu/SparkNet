
import React, { createContext, useState, useContext } from 'react';

const SustainabilityContext = createContext();

export const useSustainability = () => useContext(SustainabilityContext);

export const SustainabilityProvider = ({ children }) => {
  const [sustainabilityScore, setSustainabilityScore] = useState(0);

  const increaseScore = (amount) => {
    setSustainabilityScore(prevScore => prevScore + amount);
  };

  const decreaseScore = (amount) => {
    setSustainabilityScore(prevScore => prevScore - amount);
  };

  return (
    <SustainabilityContext.Provider value={{ sustainabilityScore, increaseScore, decreaseScore }}>
      {children}
    </SustainabilityContext.Provider>
  );
};
