import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = ({ listings }) => {
    // Filter out any listings that don't have valid coordinates
    const validListings = listings.filter(
        listing => listing.location && typeof listing.location.lat === 'number' && typeof listing.location.lng === 'number'
    );

    // If there are no valid listings to show, don't render the map at all
    if (validListings.length === 0) {
        return <div style={{textAlign: 'center', padding: '2rem'}}>No map data available for these listings.</div>;
    }

    // Determine the center of the map using the first valid listing
    const center = [validListings[0].location.lat, validListings[0].location.lng];

    return (
        <MapContainer 
            center={center} 
            // If there's only one listing, zoom in closer. Otherwise, zoom out.
            zoom={validListings.length <= 1 ? 13 : 4} 
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Map over only the valid listings */}
            {validListings.map(listing => (
                <Marker key={listing._id} position={[listing.location.lat, listing.location.lng]}>
                    <Popup>
                        <div>
                            <h5>{listing.title}</h5>
                            <p>${listing.pricePerNight} / night</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;