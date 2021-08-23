import React, { useState, useEffect } from 'react'
import RestaurantCard from './RestaurantCard'
import DirectionsMenu from './DirectionsMenu'
import backgroundImage from '../images/wallpaper.jpg'
import SettingsMenu from './SettingsMenu'
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import '../css/map.css'

//icons from https://icons8.com/icons/
import rMarker from '../icons/r-marker.png'
import bMarker from '../icons/b-marker.png'
import cMarker from '../icons/c-marker.png'
import homeMarker from '../icons/home-icon.png'

const MAP_BOX_TOKEN = process.env.REACT_APP_mapbox_token
const API_KEY = process.env.REACT_APP_places_key

function RestaurantList({restaurantData, location, setPage, 
    handleFilterChange, filters, fetchPlaceData, setSearchRadius, 
    searchRadius, setSortByOrder, sortByOrder}) {

    const [viewport, setViewport] = useState({
        width: "60%",
        height: 400,
        latitude: location.lat,
        longitude: location.lng,
        zoom: 13
      });

    const [selectedMarker, setSelectedMarker] = useState(null)
    const [anchorE1, setAnchorE1] = useState(null)

    //data
    const [directions, setDirections] = useState(null)
    const [openDirections, setOpenDirections] = useState(false)

    useEffect(()=>{
        setViewport({...viewport, latitude:location.lat, longitude: location.lng})
        // console.log(location)
    },[location])

    useEffect(()=>{
        const listener = e => {
            if (e.key === "Escape"){
                setSelectedMarker(null)
            }
        }
        window.addEventListener("keydown",listener)
    }, [])

    const handleMarkerSelect = (placeObject) =>{
        setSelectedMarker(placeObject)
        // console.log(placeObject)
    }

    const getDisplayMarker = (place) =>{
        if(place.types.includes("bar")){
            return (bMarker)
        }
        else if(place.types.includes("cafe")){
            return (cMarker)
        }
        else{
            return (rMarker)
        }
    }

    const getMarkerClosed = (place) => {
        if(place.opening_hours && place.opening_hours.open_now === false){
            return "marker marker-closed"  
        }
        return "marker"
    }

    //fetchs JSON of directions to specified destination (coordiantes)
    const fetchDirections = (destination) =>{
        //https://developers.google.com/maps/documentation/embed/map-generator
        const url = new URL("https://www.google.com/maps/embed/v1/directions")
        url.searchParams.append("key", API_KEY)
        url.searchParams.append("origin", `${location.lat},${location.lng}`)
        url.searchParams.append("destination", `${destination.lat},${destination.lng}`)
        setDirections(url)//directions is a url, to be fetched by "DirectionsMenu.js"
    }

    return (
        <div>
            <div className="map">
                <ReactMapGL
                    mapStyle="mapbox://styles/adrielk/ckp0nef4808qw17ohnfqveh4b"
                    {...viewport}
                    mapboxApiAccessToken={MAP_BOX_TOKEN}
                    onViewportChange={nextViewport => setViewport(nextViewport)}
                >
                <Marker latitude={location.lat} longitude={location.lng}>
                    <img className={"home-marker"} src={homeMarker}/>
                </Marker>
                    {
                        restaurantData.map((restaurant)=>{
                            const loc = restaurant.geometry.location
                            return(
                                <Marker key={restaurant.place_id} latitude={loc.lat} longitude={loc.lng}>
                                    <input onClick={(e)=>{handleMarkerSelect(restaurant)}} className={getMarkerClosed(restaurant)} type="image" src={getDisplayMarker(restaurant)} />
                                </Marker>
                            )
                        })
                    }
                    <button onClick={()=>{setPage("/search")}}  className="back-button">Back</button>
                    <SettingsMenu 
                        handleFilterChange={handleFilterChange}
                        filters={filters} 
                        fetchPlaceData={fetchPlaceData} 
                        setSearchRadius={setSearchRadius} 
                        searchRadius={searchRadius}
                        setSortByOrder={setSortByOrder}
                        sortByOrder={sortByOrder}
                    />
             

                    {selectedMarker && 
                        <Popup
                            latitude={selectedMarker.geometry.location.lat}
                            longitude={selectedMarker.geometry.location.lng}
                            closeButton={true}
                            closeOnClick={false}
                            onClose={() => setSelectedMarker(null)}
                            anchor="top" >
                            <div>
                                <RestaurantCard 
                                    restaurantObject={selectedMarker}
                                    fetchDirections={fetchDirections}
                                    setOpen={setOpenDirections}
                                    setSelectedMarker={setSelectedMarker}
                                    displayStreet={false}
                                />
                            </div>
                        </Popup>
                    }

                </ReactMapGL>
            </div>
            <DirectionsMenu 
                open={openDirections} 
                setOpen={setOpenDirections}
                placeObject={selectedMarker}
                directions={directions}
            />

            <div className='list-body'>
                <h1 className='list-header'>Restaurant List</h1>
                <img className="header-background-img" src={backgroundImage}/>

                {
                    restaurantData.map((restaurant)=>{
                        return (
                            <RestaurantCard 
                                key={restaurant.place_id} 
                                restaurantObject={restaurant} 
                                fetchDirections={fetchDirections}
                                setOpen={setOpenDirections}
                                setSelectedMarker={setSelectedMarker}
                                displayStreet={true}
                            />
                        )
                    })

                }

                <div style={{height:"100px"}}></div>


            </div>
        </div>
    )
}

export default RestaurantList
