import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Box, Grid, Card, Typography } from '@material-ui/core'

import { Fab } from '@material-ui/core';
import {Add} from '@material-ui/icons';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import BlockEditor  from  './components/Editor';
import NotesBlock from './components/NotesBlock';
import Fetch from './services/fetch.service';

// MAPS
import { WebToGlobal } from './mapping/web.markup';

import { openDB } from 'idb';

let indexDB = null;

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
  },
  backdrop: {
    zIndex: 1000000,
    color: '#fff',
  }
}));

function App() {
  const classes = useStyles();

  const [onlineStatus, setOnlineStatus] = useState();
  const [note, setNote] = useState(null);
  const [allNotes, pushNote] = useState([]);
  const [globalJSON, setGlobalJSON] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // LIFECYCLE
  useEffect(() => {
    setLoading(true);
    SetupIndexDB().then(() => {
      setOnlineStatus(window.navigator.onLine);

      window.addEventListener('online',  (event) => {
        setOnlineStatus(true);
      });

      window.addEventListener('offline', (event) => {
        setOnlineStatus(false);
      });
    });
  }, []);

  useEffect(() => {
    if(!onlineStatus && indexDB) {
      indexDB.put('meta', allNotes.length, 'SyncFrom')
    } else if(onlineStatus && indexDB) {
      setLoading(true);

      // NEED TO FORM STANDARD PROCEDURE AND RULES FOR SYNC UP AND SYNC DOWN PROCEDURE

      // SYNC UP
      indexDB.get('meta', 'SyncFrom').then((value) => {
        if(value || value == 0) {
          let data = {
            notes: allNotes.slice(value)
          };
  
          Fetch.SyncNotes(data).then(response => {
            indexDB.put('meta', null, 'SyncFrom')
          }).catch(err => {
            console.log(err);
          })
        }
      });

      // SYNC DOWN
      Fetch.GetAllNotes().then(response => {
        let syncNotes = Object.values(response["data"]);
        if(syncNotes.length > allNotes.length) {
          let syncFrom = allNotes.length
          
          if(syncFrom >= 0) {
            let newNotes = [...syncNotes];
            newNotes = newNotes.slice(syncFrom);

            pushNote(state => {
              return [
                ...state,
                ...newNotes
              ]
            });

            newNotes.forEach(note => {
              indexDB.add('notes', note, note.time)
            })
          }
        } 
        setLoading(false);
      }).catch((err) => {
        console.log(err);
        setLoading(false);
      });
    }
  }, [onlineStatus])

  // MEHTODS
  const SetupIndexDB = () => {
    // Implementing Jobs one by one and then resolve to send status
    return new Promise(async (resolve, reject) => {
      indexDB = await openDB('work-space', 1, {
        upgrade(db) {
          db.createObjectStore('notes');
          db.createObjectStore('meta');
        },
      });

      // LOAD INDEXDB AND DISPLAY PRESENT DATA
      // FEAT: Local DB data loaded and Render
      await indexDB.getAll('notes').then(data => {
          pushNote([...data])
        }
      );

      // FETCHING FROM ONLINE
      // Local DB data already feteched and now sync with online data
      setLoading(true);
      Fetch.GetAllNotes().then(response => {
        let syncNotes = Object.values(response["data"]);
        
        if(syncNotes.length > allNotes.length) {
          let syncFrom = allNotes.length
          
          if(syncFrom >= 0) {
            let newNotes = [...syncNotes];
            newNotes = newNotes.slice(syncFrom);

            pushNote(state => {
              return [
                ...state,
                ...newNotes
              ]
            });

            newNotes.forEach(note => {
              indexDB.add('notes', note, note.time)
            })
          }
        }
        setLoading(false);
      }).catch((err) => {
        setLoading(false);
        console.log(err);
      });
  
      await indexDB.add('meta', null, 'SyncFrom');

      resolve();
    })
    
  }

  const onChange = (value) => {
    setNote(value);
  }

  const onAddSpace = () => { 
    let notePacket = {
      time: new Date().getTime(),
      data: note
    };

    ProcessMarkup(notePacket.data).then(res => {
      pushNote(state => {
        return [
          ...state,
          res
        ]
      });

      indexDB.add('notes', res, notePacket.time)
        .then(result => {
          console.log('success!', result);
        })
        .catch(err => {
          console.error('error: ', err);
        }
      );

      if(onlineStatus) {
        Fetch.PostNote(notePacket).then(response => {

        }).catch(err => {
    
        })
      }
    }).catch(err => {

    });

    scrollToBottom();
  }

  const scrollToBottom = () => { 
    var objDiv = document.getElementById("space-content");
    objDiv.scrollTop = objDiv.scrollHeight + 10000000000000000;
  }; 

  // Process markup and update globalJSON accordingly
  const ProcessMarkup = (value) => {
    return new Promise(async (resolve, reject) => {
      // GET STARTING TAG
      let x0 = value.search(/^(<)/);
      let y0 = value.search(/(>)/);
      let OpenTag = value.slice(x0, y0+1);

      // GET CLOSE TAG AND INPUT
      let tempValue = value.slice(y0+1);
      let x1 = tempValue.search(/(<)/);
      let y1 = tempValue.search(/(>)/);
      let inputValue = tempValue.slice(0, x1);

      let pattern = /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i
      
      if(pattern.test(inputValue)) {
        await setGlobalJSON(state => {
          return [
            ...state,
            {
              tag: "embeded",
              content: inputValue,
              data: value
            }
          ]
        })

        resolve({
          tag: "embeded",
          content: inputValue,
          data: value
        });
      } else {
        await setGlobalJSON(state => {
          return [
            ...state,
            {
              tag: WebToGlobal[OpenTag],
              content: inputValue,
              data: value
            }
          ]
        })

        resolve({
          tag: WebToGlobal[OpenTag],
          content: inputValue,
          data: value
        });
      }
    })
  }

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
      
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default App;
