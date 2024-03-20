import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [films, setFilms] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      const response = await axios.get('https://swapi.dev/api/films/');
      setFilms(response.data.results);
    } catch (error) {
      console.error('Error fetching films:', error);
    }
  };

  const handleLoadMore = async () => {
    try {
      const response = await axios.get(films.next);
      setFilms([...films, ...response.data.results]);
    } catch (error) {
      console.error('Error fetching more films:', error);
    }
  };

  const handleShowModal = async (film) => {
    try {
      const characters = await Promise.all(
        film.characters.map(async (characterUrl) => {
          const response = await axios.get(characterUrl);
          return response.data;
        })
      );
      setModalContent({
        title: film.title,
        characters: characters
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="App">
      <h1>Star Wars App</h1>
      <div className="films-list">
        {films.map((film, index) => (
          <div key={index} className="film-item" onClick={() => handleShowModal(film)}>
            <h2>{film.title}</h2>
            <p>Director: {film.director}</p>
            <p>Release Date: {film.release_date}</p>
          </div>
        ))}
      </div>
      {films.next && <button onClick={handleLoadMore}>Load More</button>}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>{modalContent.title}</h2>
            <h3>Characters:</h3>
            <ul>
              {modalContent.characters.map((character, index) => (
                <li key={index}>{character.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
