import React, { useState } from 'react';

// import { createAlgo } from '../../graphql/mutations';
import { v4 as uuid } from 'uuid';

import Amplify, { API, Storage, DataStore} from 'aws-amplify';


import { IconButton, TextField } from '@mui/material';

import PublishIcon from '@mui/icons-material/Publish';
import { TitleTwoTone } from '@mui/icons-material';
import {Algo} from '../../models';

const AddAlgo = ({ onUpload }) => {
    const [algoData, setalgoData] = useState({});
    const [txtData, setTxtData] = useState();

    const uploadAlgo = async () => {
        //Upload the song
        console.log('algoData', algoData);
        const { title } = algoData;

        const { key } = await Storage.put(`${uuid()}.cpp`, txtData, {level: 'public', contentType: 'text/plain' });

        const algo = new Algo({
            id: uuid(),
            title,
            filePath: key
        });
        await DataStore.save(algo);
        onUpload();
    };

    return (
        <div className="newAlgo">
            <TextField
                style={{backgroundColor: 'white'}}
                label="Title"
                value={algoData.title}
                onChange={e => setalgoData({ ...algoData, title: e.target.value })}
            />
            <input type="file" accept="text/plain" onChange={e => setTxtData(e.target.files[0])} />
            <IconButton style={{color: 'white'}} onClick={uploadAlgo}>
                <PublishIcon />
            </IconButton>
        </div>
    );
};

export default AddAlgo;