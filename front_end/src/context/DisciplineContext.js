import React, { createContext, useState, useEffect } from 'react';

export const DisciplineContext = createContext();

export const DisciplineProvider = ({ children }) => {
  const [disciplines, setDisciplines] = useState([]);

  useEffect(() => {
    const savedDisciplines = JSON.parse(localStorage.getItem('disciplines'));
    if (savedDisciplines) {
      setDisciplines(savedDisciplines);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('disciplines', JSON.stringify(disciplines));
  }, [disciplines]);

  const addDiscipline = (discipline) => {
    setDisciplines((prevDisciplines) => [...prevDisciplines, discipline]);
  };

  return (
    <DisciplineContext.Provider value={{ disciplines, addDiscipline }}>
      {children}
    </DisciplineContext.Provider>
  );
};
