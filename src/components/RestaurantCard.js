import React, { useState } from 'react'
import {
    Button,
  }from '@material-ui/core';
const API_KEY = process.env.REACT_APP_places_key
const axios = require('axios').default;

function RestaurantCard({restaurantObject, fetchDirections, setOpen, setSelectedMarker, displayStreet}) {
    // const [openDirections, setOpenDirections] = useState(false)

    // const fetchPhoto = (photo_reference) =>{//leads to too many requests for cors proxy...
    //     const url = new URL("https://maps.googleapis.com/maps/api/place/photo");
    //     url.searchParams.append("key", API_KEY)
    //     url.searchParams.append("photoreference", photo_reference)
    //     url.searchParams.append("maxheight", 150)

    //     axios.get(url)
    //       .then((response)=>{
    //         console.log(response.data.results)
    //       })
    //       .catch((err)=>{
    //         console.log("Error: ", err)
    //       })
        
    // }

    const getPriceLevel = (priceLevel) =>{
        if(priceLevel)
            return <h3>Price: {"$".repeat(parseInt(priceLevel))}</h3>;
        return <h3 className="unavail">Price not available</h3>
    }

    const getStars = (rating) => {
        if(rating){
            const ratingInt = parseInt(rating)
            let stars = "★ ".repeat(ratingInt)+"☆ ".repeat(parseInt(5-ratingInt))
            return <h2 className="stars">{stars} {rating}/{5}</h2>
        }
        return <h2 className="unavail">Rating not available</h2>
    }

    const handleDirectionsClicked = (placeObject) =>{
        fetchDirections(placeObject.geometry.location)
        setOpen(true)//opens directions menu
        setSelectedMarker(placeObject)
    }

    const fetchStreetView = (placeObject)=>{
        const url = new URL("https://www.google.com/maps/embed/v1/streetview")
        url.searchParams.append("key", API_KEY)
        url.searchParams.append("location", `${placeObject.geometry.location.lat},${placeObject.geometry.location.lng}`)
        return (
            <embed className="card-embedding" src={url}/>
        )

    }

    return (
        <div className='card-body'>
            <h2 className="title">{restaurantObject.name}</h2>
            { getStars(restaurantObject.rating) }
            {(  restaurantObject.opening_hours &&
                restaurantObject.opening_hours.open_now===true)
                ?<h3>Status: Open</h3>
                :<h3>Status: Closed</h3>
            }
            { getPriceLevel(restaurantObject.price_level) }
            <h4>Location: {restaurantObject.vicinity}</h4>
            <Button 
                className={(displayStreet===true)? "directions-button" : "directions-button directions-button-popup"}
                variant="contained" 
                color="primary"
                style={{fontSize:"20px", fontFamily:"Helvetica", backgroundColor:"#303030"}}
                onClick={()=>{handleDirectionsClicked(restaurantObject)}}
            >
                Directions
            </Button>
       
            {(displayStreet===true) && fetchStreetView(restaurantObject)}

        </div>
    )
}

export default RestaurantCard
