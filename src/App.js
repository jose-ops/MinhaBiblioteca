import React from 'react';
import './App.css';
//import Autores from './Components/Autores';
import Livros from './Components/Livros';
// import Mostrario from './Components/Mostroario';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
          <Livros/>
        {/* <Autores/> */}
      </main>
    </div>
  );
}

export default App;