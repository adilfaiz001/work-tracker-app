import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Box, Grid, Card, Typography } from '@material-ui/core'

import { Fab } from '@material-ui/core';
import {Add} from '@material-ui/icons';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import BlockEditor  from  './components/Editor';
import NotesBlock from './components/NotesBlock';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: "#869bae"
  },
  Container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingBottom: '10px'
  },
  CardContainer: {
    width: "100%",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  NotesContainer: {
    height: "70%",
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  AppContent: {
    flexWrap: "nowrap",
    height: "60vh",
    padding: "20px",
    overflowY: "scroll"
  },
  EditorContainer: {
    height: "30%",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  EditorButton: {
    margin: "5px"
  }
}));

function App() {
  const classes = useStyles();
  const [note, setNote] = useState(null);
  const [allNotes, pushNote] = useState([]);
  
  // LIFECYCLE
  useEffect(() => {

  }, []);

  useEffect(() => {
    
  }, [allNotes])

  // MEHTODS
  const onChange = (value) => {
    setNote(value)
  }

  const onAddSpace = () => {
    let notePacket = {
      time: new Date().getTime(),
      data: note
    };

    pushNote(state => {
      return [
        ...state,
        notePacket
      ]
    });

    scrollToBottom();
  }

  const scrollToBottom = () => { 
    var objDiv = document.getElementById("space-content");
    objDiv.scrollTop = objDiv.scrollHeight + 10000000000000000;
  }; 

  return (
    <Box className={classes.root}>
      <Container
        className={classes.Container}
      >
        <Card
          className={classes.CardContainer}
        >
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            alignItems="stretch"
          >
            <Grid item className={classes.NotesContainer}>
              <AppBar position="static">
                <Toolbar variant="dense">
                  <Typography variant="h6" color="inherit">
                    YOUR WORK SPACE
                  </Typography>
                </Toolbar>
              </AppBar>

              <Grid 
                className={classes.AppContent}
                id="space-content"
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="stretch"
              >
                {
                  allNotes.map((note, index) => {
                    return (
                      <NotesBlock key={index} note={note} />
                    )
                  })
                }
              </Grid>
            </Grid>


            <Grid item className={classes.EditorContainer}>
              <BlockEditor
                onChange={onChange} 
              />

              <Fab
                variant="extended"
                size="medium"
                color="primary"
                aria-label="add"
                className={classes.EditorButton}
                onClick={onAddSpace}
              >
                <Add />
                ADD TO YOUR SPACE
              </Fab>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}

export default App;
