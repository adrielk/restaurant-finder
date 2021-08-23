//code adapted from https://material-ui.com/components/dialogs/
// and from https://material-ui.com/components/radio-buttons/
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SettingsIcon from '@material-ui/icons/Settings';

import {
    Checkbox,
    FormGroup,
    FormControlLabel,
    FormControl,
    FormHelperText,
    Radio,
    RadioGroup,
}from '@material-ui/core';

export default function FormDialog({handleFilterChange, filters, fetchPlaceData, 
  setSearchRadius, searchRadius, setSortByOrder, sortByOrder}) {
  const [open, setOpen] = useState(false)
//   const [filters, setFilters] = useState({restaurant: true, bar: false, cafe: false})

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFetch = () =>{
      handleClose()
      fetchPlaceData()
  }

  const handleSortByChange = (e) =>{
    console.log(e.target.value)
    setSortByOrder(e.target.value)
  }

  const convertMetersToMiles = (meters) =>{
    return parseInt(Math.abs(meters/1609))
  }
  
  const convertMilesToMeters = (miles) => {
      return parseInt(Math.abs(miles*1609))
  }
  
  const handleSearchRadiusChange = (e) =>{
    setSearchRadius(convertMilesToMeters(e.target.value))
  }

  return (
    <div>
      <Button onClick={handleClickOpen} className="settings-button">
        <SettingsIcon style={{fontSize:"50px"}} className="settings-icon"/>
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Options</DialogTitle>
        <DialogContent>
          <DialogContentText>
              Apply Filters
          </DialogContentText>
          <DialogContent>
            <FormControl component="fieldset" >
                <FormGroup>
                    {/* State and onChange event required for each selector */}
                    <FormControlLabel
                        control={<Checkbox checked={filters.restaurant} onChange={handleFilterChange}  name="restaurant" />}
                        label="Restaurant"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={filters.bar} onChange={handleFilterChange} name="bar" />}
                        label="Bar"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={filters.cafe} onChange={handleFilterChange} name="cafe" />}
                        label="Cafe"
                    />
                    <TextField
                        id="standard-number"
                        label="Radius (miles)"
                        type="number"
                        value={convertMetersToMiles(searchRadius)}
                        onChange={handleSearchRadiusChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </FormGroup>
            </FormControl>
          </DialogContent>

          <DialogContentText>
            Sort By
          </DialogContentText>
          <DialogContent>
            <FormControl component="fieldset">
            <RadioGroup aria-label="sortby" name="sortby1" value={sortByOrder} onChange={handleSortByChange} >
                <FormControlLabel value="price" control={<Radio />} label="Price" />
                <FormControlLabel value="rating" control={<Radio />} label="Rating" />
                <FormControlLabel value="name" control={<Radio />} label="Name" />
            </RadioGroup>
            </FormControl>
          </DialogContent>
     
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleFetch} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}