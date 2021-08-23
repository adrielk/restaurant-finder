import React, { useState, useEffect } from 'react';
import '../css/landingpage.css';
import '../css/placecard.css';
import '../css/restaurantview.css';
import '../css/map.css';

import {
  TextField,
  Grid,
  Box,
}from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import backgroundImage from '../images/wallpaper.jpg'
import RestaurantIcon from '@material-ui/icons/Restaurant';

//components
import RestaurantList from './RestaurantList'
//routing
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

//API
const API_KEY = process.env.REACT_APP_places_key

//////////////////////////////////////////////////////

function RestaurantApp() {
  const axios = require('axios').default

  const [placeData, setPlaceData] = useState([])
  const [filters, setFilters] = useState({restaurant: true, bar: false, cafe: false})
  const [sortByOrder, setSortByOrder] = useState("rating")//or rating, or name

  const [location, setLocation] = useState("")
  const [coordinates, setCoordinates] = useState({lat:0, lng:0})
  const [searchRadius, setSearchRadius] = useState(2000) // in meters

  const [page, setPage] = useState("/search")


  useEffect(()=>{
    fetchPlaceData()
  }, [location,coordinates])

  //filtering
  const stringifyFilters = (filters) =>{
    // console.log( Object.keys(filters).filter((key)=>filters[key]===true).toString())
    return Object.keys(filters).filter((key)=>filters[key]===true).toString()
  }
  const handleFilterChange = (e) => {
    setFilters({...filters, [e.target.name]: e.target.checked})
  }

  const fetchGeocodedAddress = (address) =>{
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json")
    url.searchParams.append("key", API_KEY)
    url.searchParams.append("address", address)
    // console.log(url.toString())
    axios.get(url)
      .then((response)=>{
        const location = response.data.results[0].geometry.location
        // console.log(location)
        setCoordinates({lat: location.lat, lng: location.lng})
        setLocation(`${location.lat},${location.lng}`)
      })
      .catch((err)=>{
        console.log("Error: ", err)
      })
  }

  const sortPlaceData = (placeData, sortBy) =>{
    switch(sortBy) {
      case "price":
        placeData.sort((a,b)=>{
          return a.price_level - b.price_level
        })
        // code block
        break;
      case "rating":
        placeData.sort((a,b)=>{
          return b.rating - a.rating
        })
        // code block
        break;
      case "name":
        //code block
        placeData.sort((a,b)=>{
          var nameA = a.name.toUpperCase()
          var nameB = b.name.toUpperCase()
          if(nameA < nameB){
            return -1
          }
          if(nameA > nameB){
            return 1;
          }
          return 0;

        })
        break;
    }
  }

  const fetchPlaceData = () =>{
    //Google Place API Nearby search request
    const url = new URL("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json");
    url.searchParams.append("location", location)
    url.searchParams.append("type", stringifyFilters(filters))
    url.searchParams.append("key", API_KEY)
    url.searchParams.append("radius", searchRadius)
    // console.log(url.toString())
    axios.get(url.toString())
      .then((response)=>{
        // console.log(response.data.results)
        //sort place data first before setting.
        let placeData = response.data.results
        sortPlaceData(placeData, sortByOrder)
        setPlaceData(placeData)//array of nearby restaurants
      })
      .catch((err)=>{
        console.log("Error: ", err)
      })
    }

  //later add error handling to handle invalid address...
  const handleAddressSubmit = (e) =>{
    let targetVal = e.target['address-input'].value
    e.target['address-input'].value=""//reset form    
    e.preventDefault()
    fetchGeocodedAddress(targetVal.replace(/,/, ''))//remove commas
    setPage("/restaurant-view")//redirect to restaurants list and map
  }

  return (
    <Router>
      <div>
        <div style={{height:"50px"}}></div>
        <Redirect to={page} />
        <Switch>
          <Route path="/search">
              <div className="landing-title">
                <Grid container spacing={2} justify="center" direction="row" alignItems="center">
                    <Grid item>
                        <RestaurantIcon style={{fontSize:"70px"}}/>
                    </Grid>
                    <Grid item>
                      <h1>Restaurantify</h1>
                    </Grid>
                </Grid>
              </div>
              <h1 className="sub-title">
                Find Good Eats and Drinks Near You
              </h1>
              <div className="landing-search">
                <Box display="flex" justifyContent="center" m={1} p={1} >
                  <Box p={1}>
                    <Grid container spacing={1} alignItems="flex-end">
                      <Grid item>
                        <SearchIcon/>
                      </Grid>
                      <Grid item>
                        <form onSubmit={handleAddressSubmit}>
                          <TextField className='search-bar' id="address-input" label="Address" />
                        </form>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </div>
              <img className="background-img" src={backgroundImage}/>
          </Route>
          <Route path="/restaurant-view">
            <RestaurantList 
              restaurantData={placeData} 
              setPage={setPage} 
              location={coordinates} 
              handleFilterChange={handleFilterChange} 
              filters={filters} 
              fetchPlaceData={fetchPlaceData}
              setSearchRadius={setSearchRadius}
              searchRadius={searchRadius}
              setSortByOrder={setSortByOrder}
              sortByOrder={sortByOrder}
            />
          </Route>
        </Switch>
      </div>
      <div className="footer">
        <small>Restaurantify 2021 by Adriel Kim</small>
      </div>

    </Router>
  )
}

export default RestaurantApp
