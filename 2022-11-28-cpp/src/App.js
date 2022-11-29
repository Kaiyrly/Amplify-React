import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {Amplify, Storage} from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsconfig from './aws-exports';
import { Button } from '@mui/material';
import AlgoList from './components/AlgoList';


Amplify.configure(awsconfig);

function App() {

    return (
            <div className="App">
                <header className="App-header">
                    <h2>My App Content</h2>
                    <AlgoList/>
                </header>
                
            </div>
    );
}

const styles = {
    container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
    todo: {  marginBottom: 15 },
    input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
    todoName: { fontSize: 20, fontWeight: 'bold' },
    todoDescription: { marginBottom: 0 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
  }

export default App;