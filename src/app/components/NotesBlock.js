import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import draftToHtml from 'draftjs-to-html';
import { Editor, convertFromRaw } from 'draft-js';

const useStyles = makeStyles((theme) => ({
    root: {
      
    },
    block: {
        margin: "5px",
        padding: "5px 8px"
    },
    content: {
    },
    embeddedContent: {
        height: "400px",
        width: "800px"
    }
}));

function NotesBlock(props) {
    const classes = useStyles();
    const [time, setTime] = useState();
    const [markup, setMarkup] = useState();
    const [embedded, setEmbedded] = useState(null);

    // LIFECYCLE
    useEffect(() => {
        let { note } = props;
        
        setTime(note.time);

        if(note.tag === "embeded") {
            setEmbedded('https://www.youtube.com/embed/'+getVideoID(note.content));
        } else {
            setMarkup(note.data);
        }
    }, [])

    // METHODS
    const getVideoID = (url) => {
        let videoRegEx = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        return url.match(videoRegEx)[1];
    }

    return (
        <Paper elevation={2} square className={classes.block}>
            {
                embedded ? 
                    <div className={classes.content}>
                        <iframe className={classes.embeddedContent} src={embedded}></iframe>
                    </div>
                    :
                    <div className={classes.content} dangerouslySetInnerHTML={{__html: markup}}></div>
            }
        </Paper>
    );
}
  
  export default NotesBlock;