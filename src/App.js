import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <h1 className="App-title">Midi music box thing</h1>
          <button>Upload Midi</button>
          <p className="App-intro">
            We'll actually make it where we can upload a midi file here, I guess.
          </p>
      </div>
    );
  }
}

export default App;
