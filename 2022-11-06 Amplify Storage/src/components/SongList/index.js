import React, { useEffect, useState } from 'react';
// import { listSongs } from '../../graphql/queries';
// import { updateSong, createSong } from '../../graphql/mutations';

import ReactPlayer from 'react-player';

import Amplify, { DataStore, Predicates, Storage } from 'aws-amplify';


// import AudioPlayer from 'material-ui-audio-player';

import { Paper, IconButton, TextField, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PauseIcon from '@mui/icons-material/Pause';
import AddIcon from '@mui/icons-material/Add';
import AddSong from '../AddSong';
import {Song} from '../../models';

const SongList = ({userId}) => {
    const [songs, setSongs] = useState([]);
    const [songPlaying, setSongPlaying] = useState('');
    const [audioURL, setAudioURL] = useState('');
    const [showAddSong, setShowAddNewSong] = useState(false);

    useEffect(() => {
        fetchSongs();
    }, []);

    const toggleSong = async idx => {
        if (songPlaying === idx) {
            setSongPlaying('');
            return;
        }

        const songFilePath = songs[idx].filePath;
        try {
            const fileAccessURL = await Storage.get(songFilePath, { level: 'private', expires: 60});
            console.log('access url', fileAccessURL);
            setSongPlaying(idx);
            setAudioURL(fileAccessURL);
            return;
        } catch (error) {
            console.error('error accessing the file from s3', error);
            setAudioURL('');
            setSongPlaying('');
        }
    };

    const fetchSongs = async () => {
        try {
            const songData = await DataStore.query(Song, (song) => song.createdBy('eq', userId));
            console.log(songData);
            const songList = songData;
            console.log('song list', songList);
            setSongs(songList);
        } catch (error) {
            console.log('error on fetching songs', error);
        }
    };

    const addLike = async idx => {
        try {
            const song = songs[idx];
            const original = await DataStore.query(Song, song.id);
            const songData = await DataStore.save(
                Song.copyOf(original, updated => {
                  updated.likes = original.likes + 1;
                })
              );
            console.log(songData);
            const songList = [...songs];
            songList[idx] = songData;
            setSongs(songList);
        } catch (error) {
            console.log('error on adding Like to song', error);
        }
    };

    const deleteAll = async() => {
        console.log('Deleting all songs');
        try{
            for(let i = 0; i < songs.length; i++){
                const filePath = songs[i].filePath;
                try{
                    await Storage.remove(filePath, );
                } catch(error){
                    console.log(error);
                }
            }
            await DataStore.delete(Song, Predicates.ALL);
        } catch(error){
            console.log('error deleting songs', error);
        }
    }



    return (
        <div className="songList">
            {songs.map((song, idx) => {
                return (
                    <Paper variant="outlined" elevation={0} key={`song${idx}`}>
                        <div className="songCard">
                            <IconButton aria-label="play" onClick={() => toggleSong(idx)}>
                                {songPlaying === idx ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>
                            <div>
                                <div className="songTitle">{song.title}</div>
                                <div className="songOwner">{song.owner}</div>
                            </div>
                            <div>
                                <IconButton aria-label="like" onClick={() => addLike(idx)}>
                                    <FavoriteIcon />
                                </IconButton>
                                {song.likes}
                            </div>
                            <div className="songDescription">{song.description}</div>
                        </div>
                        {songPlaying === idx ? (
                            <div className="ourAudioPlayer">
                                <ReactPlayer
                                    url={audioURL}
                                    controls
                                    playing
                                    height="50px"
                                    onPause={() => toggleSong(idx)}
                                />
                            </div>
                        ) : null}
                    </Paper>
                );
            })}
            {showAddSong ? (
                <AddSong
                    onUpload={() => {
                        setShowAddNewSong(false);
                        fetchSongs();
                    }}
                    userId={userId}
                />
            ) : (
                <IconButton onClick={() => setShowAddNewSong(true)}>
                    <AddIcon style={{color: 'white'}}/>
                </IconButton>
            )}
            <Button variant="text" onClick={() => deleteAll()}>Delete All</Button>
        </div>
    );
};

export default SongList;