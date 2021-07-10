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
    }
}));

function NotesBlock(props) {
    const classes = useStyles();
    const [time, setTime] = useState();
    const [markup, setMarkup] = useState();

    // LIFECYCLE
    useEffect(() => {
        let { note } = props;
        
        setTime(note.time);
        setMarkup(note.data);
    }, [])

    // METHODS

    return (
        <Paper elevation={2} square className={classes.block}>
            <div className={classes.content} dangerouslySetInnerHTML={{__html: markup}}></div>
        </Paper>
    );
  }
  
  export default NotesBlock;