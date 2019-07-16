import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-slider/dist/css/bootstrap-slider.css"
import './index.css';
import SquashDemo from './app';

import ReactGA from 'react-ga';

ReactGA.initialize('UA-144025713-1');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(<SquashDemo />, document.getElementById('root'));
