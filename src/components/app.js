import React from 'react';
import  { Component }  from 'react';

import ActualData from '../containers/ActualData'
import SpreadSheet from '../containers/SpreadSheet'

export default class App extends Component {
  render() {
    return (
      <div>
        <SpreadSheet />
        <ActualData />
      </div>
    );
  }
}
