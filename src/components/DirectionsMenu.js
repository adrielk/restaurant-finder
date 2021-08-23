//code adapted from https://material-ui.com/components/dialogs/
// and from https://material-ui.com/components/radio-buttons/
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';


export default function DirectionsMenu({open, setOpen, placeObject, directions}) {
  useEffect(()=>{
      if(placeObject){
        parseDirections()
      }
  }, [directions])

  const handleClose = () => {
    setOpen(false);
  };

  const parseDirections = () =>{
    if(directions){    
        return (
            <embed className="directions-embedding" src={directions}/>
        )
    }
        return <CircularProgress/>
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        { placeObject &&
            <DialogTitle id="form-dialog-title">Directions to {placeObject.name}</DialogTitle>
        }
        <DialogContent>
          <DialogContent>
            {parseDirections()}
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}