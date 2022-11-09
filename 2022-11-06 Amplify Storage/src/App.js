import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {Amplify, Storage} from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsconfig from './aws-exports';
import { Button } from '@mui/material';
import SongList from './components/SongList';


Amplify.configure(awsconfig);

function App({ signOut, user}) {

    const printUser = () => {
        console.log(user.username);
    }
    return (
            <div className="App">
                <Button onClick={signOut} style={styles.button}>Sign out</Button>
                <header className="App-header">
                    <h2>My App Content</h2>
                    <SongList userId={user.username}/>
                </header>
                <Button onClick={printUser} style={styles.button}>Print the user</Button>
                
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

export default withAuthenticator(App);