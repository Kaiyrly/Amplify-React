import React, { useEffect, useState } from 'react';
// import { listSongs } from '../../graphql/queries';
// import { updateSong, createSong } from '../../graphql/mutations';

// import ReactPlayer from 'react-player';

import Amplify, { DataStore, Predicates, Storage } from 'aws-amplify';


// import AudioPlayer from 'material-ui-audio-player';

import { Paper, IconButton, TextField, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PauseIcon from '@mui/icons-material/Pause';
import AddIcon from '@mui/icons-material/Add';
import AddAlgo from '../AddAlgo';
import {Algo} from '../../models';

const AlgoList = () => {
    const [algos, setAlgos] = useState([]);
    const [algoPlaying, setAlgoPlaying] = useState('');
    const [codeURL, setCodeURL] = useState('');
    const [showAddAlgo, setShowAddNewAlgo] = useState(false);

    useEffect(() => {
        fetchAlgos();
    }, []);

    // const toggleSong = async idx => {
    //     if (songPlaying === idx) {
    //         setSongPlaying('');
    //         return;
    //     }

    //     const songFilePath = songs[idx].filePath;
    //     try {
    //         const fileAccessURL = await Storage.get(songFilePath, { level: 'private', expires: 60});
    //         console.log('access url', fileAccessURL);
    //         setSongPlaying(idx);
    //         setAudioURL(fileAccessURL);
    //         return;
    //     } catch (error) {
    //         console.error('error accessing the file from s3', error);
    //         setAudioURL('');
    //         setSongPlaying('');
    //     }
    // };

    // const runTest = async idx => {
    //     const 
    // }


    const fetchAlgos = async () => {
        try {
            const algoData = await DataStore.query(Algo);
            console.log(algoData);
            const algoList = algoData;
            console.log('algo list', algoList);
            setAlgos(algoList);
        } catch (error) {
            console.log('error on fetching algos', error);
        }
    };

    const deleteAll = async() => {
        console.log('Deleting all algos');
        try{
            for(let i = 0; i < algos.length; i++){
                const filePath = algos[i].filePath;
                try{
                    await Storage.remove(filePath, );
                } catch(error){
                    console.log(error);
                }
            }
            await DataStore.delete(Algo, Predicates.ALL);
        } catch(error){
            console.log('error deleting algos', error);
        }
    }



    return (
        <div className="algoList">
            {algos.map((algo, idx) => {
                return (
                    <Paper variant="outlined" elevation={0} key={`algo${idx}`}>
                        <div className="algoCard">
                            {/* <IconButton aria-label="play" onClick={() => toggleSong(idx)}>
                                {songPlaying === idx ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton> */}
                            <div>
                                <div className="algoTitle">{algo.title}</div>
                            </div>
                        </div>
                    </Paper>
                );
            })}
            {showAddAlgo ? (
                <AddAlgo
                    onUpload={() => {
                        setShowAddNewAlgo(false);
                        fetchAlgos();
                    }}
                />
            ) : (
                <IconButton onClick={() => setShowAddNewAlgo(true)}>
                    <AddIcon style={{color: 'white'}}/>
                </IconButton>
            )}
            <Button variant="text" onClick={() => deleteAll()}>Delete All</Button>
        </div>
    );
};

export default AlgoList;