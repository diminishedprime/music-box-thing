import React, { Component } from 'react';
import MIDIFile from 'midifile';
import './App.css';

// TODO(me) - Make this only accept midi files.

const numberToPitch = {
  '60' : 'C4',
  '62' : 'D4',
  '64' : 'E4',
  '65' : 'F4',
  '67' : 'G4',
  '69' : 'A4',
  '71' : 'B4',
  '72' : 'C5',
  '74' : 'D5',
  '76' : 'E5',
  '77' : 'F5',
  '79' : 'G5',
  '81' : 'A5',
  '83' : 'B5',
  '84' : 'C6'
}

const pitchToEvenSpacedPitch = {
  '60' : 0,
  '62' : 1,
  '64' : 2,
  '65' : 3,
  '67' : 4,
  '69' : 5,
  '71' : 6,
  '72' : 7,
  '74' : 8,
  '76' : 9,
  '77' : 10,
  '79' : 11,
  '81' : 12,
  '83' : 13,
  '84' : 14,
}

// 0 pxs from left should be C4
// all pxs from left should be C6

// 1.5748 inches wide

// 2mm each note
// C4 - C6 is 28mms

// 1.5 feet per 36 seconds.
// x inches per second.
// x inches per millisecond.
// 0.0005 inches per millisecond;

//   5 milliseconds
// ------
//  1000 mill

const noteToPixelOffset = (ppi, noteIndex) => {
  const ppmm = ppi / 25.4;
  const mmsPerOffset = 1;
  const pixelsPerOffset = mmsPerOffset * ppmm;
  return pixelsPerOffset * noteIndex;
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      notes: [],
      ppi: 276.05,
      ppiVg: 276.05
    }
    this.fileUploaded.bind(this);
    this.ppiChange.bind(this);
    this.ppiVgChange.bind(this);
  }

  ppiChange(e) {
    const value = e.target.value;
    this.setState((oldState) => {
      return Object.assign(oldState, {ppi: value})
    })
  }
  ppiVgChange(e) {
    const value = e.target.value;
    this.setState((oldState) => {
      return Object.assign(oldState, {ppiVg: value})
    })
  }

  fileUploaded(e) {
    var that = this;
    const files = e.target.files;
    const file = files[0];

    var reader = new FileReader();
    reader.onload = function() {
      var arrayBuffer = this.result;
      var midiFile = new MIDIFile(arrayBuffer);
      var midiEvents = midiFile.getMidiEvents();
      var hasLength = midiEvents
        .filter(({playTime}) => playTime)
        .filter(({param2}) => param2 === 127)
      var notes = hasLength.filter(({param1}) => param1);
      console.log(notes);
      that.setState((oldState) => {
        return Object.assign(oldState, {notes})
      })
    }
    reader.readAsArrayBuffer(file);
  }

  render() {
    return (
      <div className="App">
        <h1 className="App-title">Midi music box thing</h1>
        <label>
          Pixels Per Inch
          <input type='number'
                 value={this.state.ppi}
                 onChange={e => this.ppiChange(e)}/>
        </label>
        <label>
          Pixels Per Inch
          <input type='number'
                 value={this.state.ppiVg}
                 onChange={e => this.ppiVgChange(e)}/>
        </label>
        <input name="myFile" type="file"
               onChange={e => this.fileUploaded(e)}
        />
        {this.state.notes.map((data, idx) => (
          <div key={`${idx}`}style={{
            position: 'absolute',
            marginLeft:
          `${noteToPixelOffset(this.state.ppi, pitchToEvenSpacedPitch[data.param1])}px`,
            marginTop: `${(data.playTime * 0.00005 * this.state.ppiVg)}px`
          }
          }>
            -
          </div>
        ))}
      </div>
    );
  }
}

export default App;
