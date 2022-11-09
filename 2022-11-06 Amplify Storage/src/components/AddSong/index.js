import React, { useState } from 'react';

import { createSong } from '../../graphql/mutations';
import { v4 as uuid } from 'uuid';

import Amplify, { API, Storage, DataStore} from 'aws-amplify';


import { IconButton, TextField } from '@mui/material';

import PublishIcon from '@mui/icons-material/Publish';
import { TitleTwoTone } from '@mui/icons-material';
import {Song} from '../../models';

const AddSong = ({ onUpload, userId }) => {
    const [songData, setSongData] = useState({});
    const [mp3Data, setMp3Data] = useState();

    const uploadSong = async () => {
        //Upload the song
        console.log('songData', songData);
        console.log(userId)
        const { title, description, owner } = songData;

        const { key } = await Storage.put(`${uuid()}.mp3`, mp3Data, {level: 'private', contentType: 'audio/mp3' });

        const song = new Song({
            id: uuid(),
            title,
            description,
            owner,
            filePath: key,
            likes: 0,
            createdBy: userId
        });
        await DataStore.save(song);
        onUpload();
    };

    return (
        <div className="newSong">
            <TextField
                style={{backgroundColor: 'white'}}
                label="Title"
                value={songData.title}
                onChange={e => setSongData({ ...songData, title: e.target.value })}
            />
            <TextField
                style={{backgroundColor: 'white'}}
                label="Artist"
                value={songData.owner}
                onChange={e => setSongData({ ...songData, owner: e.target.value })}
            />
            <TextField
                style={{backgroundColor: 'white'}}
                label="Description"
                value={songData.description}
                onChange={e => setSongData({ ...songData, description: e.target.value })}
            />
            <input type="file" accept="audio/mp3" onChange={e => setMp3Data(e.target.files[0])} />
            <IconButton style={{color: 'white'}} onClick={uploadSong}>
                <PublishIcon />
            </IconButton>
        </div>
    );
};

export default AddSong;