
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Property } from "@/types";
import { Link } from "react-router-dom";

// Fix Leaflet marker icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create a custom marker icon
const customIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type PropertyMapProps = {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  height?: string;
};

// Component to handle map center and zoom changes
const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const PropertyMap = ({ 
  properties, 
  center = [31.1829, 35.7046], // Default to Jordan
  zoom = 10,
  height = "600px" 
}: PropertyMapProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    setMapLoaded(true);
  }, []);

  return (
    <div style={{ height, width: "100%" }} className="rounded-lg overflow-hidden shadow-md">
      {mapLoaded && (
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          className="map-container"
          whenReady={() => {
            // Map is ready
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController center={center} zoom={zoom} />
          
          {properties.map((property) => (
            <Marker 
              key={property.id} 
              position={[property.lat, property.lng]}
            >
              <Popup>
                <div className="flex flex-col">
                  <img 
                    src={property.image} 
                    alt={property.name} 
                    className="w-full h-28 object-cover rounded-t-md"
                  />
                  <div className="p-2">
                    <h3 className="font-bold text-sm">{property.name}</h3>
                    <p className="text-xs text-gray-500">{property.location}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-maskani-primary font-semibold">
                        {property.price} {property.currency}
                      </span>
                      <Link 
                        to={`/property/${property.id}`}
                        className="bg-maskani-primary text-white text-xs px-2 py-1 rounded hover:bg-maskani-primary/90"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default PropertyMap;
