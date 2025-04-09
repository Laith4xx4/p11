
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchFilter from "@/components/SearchFilter";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import { getProperties } from "@/services/propertyService";
import { Property } from "@/types";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { MapPin, Filter, X } from "lucide-react";

const Apartments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([31.1829, 35.7046]);
  const isMobile = useIsMobile();
  
  const handleSearch = async (filters: Record<string, any>) => {
    setLoading(true);
    try {
      const filteredProperties = await getProperties(filters);
      setProperties(filteredProperties);
      
      // Update URL search params
      const newSearchParams = new URLSearchParams();
      
      if (filters.location) newSearchParams.set("location", filters.location);
      if (filters.university) newSearchParams.set("university", filters.university);
      if (filters.roomType) newSearchParams.set("roomType", filters.roomType);
      if (filters.priceMin) newSearchParams.set("priceMin", filters.priceMin.toString());
      if (filters.priceMax) newSearchParams.set("priceMax", filters.priceMax.toString());
      
      setSearchParams(newSearchParams);
      
      // Update map center if we have results
      if (filteredProperties.length > 0) {
        setMapCenter([filteredProperties[0].lat, filteredProperties[0].lng]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Extract filters from URL search params
        const filters: Record<string, any> = {};
        
        const location = searchParams.get("location");
        const university = searchParams.get("university");
        const roomType = searchParams.get("roomType");
        const priceMin = searchParams.get("priceMin");
        const priceMax = searchParams.get("priceMax");
        
        if (location) filters.location = location;
        if (university) filters.university = university;
        if (roomType) filters.roomType = roomType;
        if (priceMin) filters.priceMin = parseInt(priceMin);
        if (priceMax) filters.priceMax = parseInt(priceMax);
        
        const data = await getProperties(Object.keys(filters).length > 0 ? filters : undefined);
        setProperties(data);
        
        // Set map center based on first property if available
        if (data.length > 0) {
          setMapCenter([data[0].lat, data[0].lng]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [searchParams]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Student Apartments</h1>
              <p className="text-gray-600">
                Find the perfect student housing near your university
              </p>
            </div>
            
            <SearchFilter onSearch={handleSearch} />
            
            {isMobile && (
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => setShowMap(!showMap)}
                  variant="outline"
                  className="flex items-center"
                >
                  {showMap ? (
                    <>
                      <X className="h-4 w-4 mr-2" /> Hide Map
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" /> Show Map
                    </>
                  )}
                </Button>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className={`lg:col-span-2 ${showMap && isMobile ? 'hidden' : 'block'}`}>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Loading properties...</p>
                  </div>
                ) : properties.length === 0 ? (
                  <div className="bg-white rounded-lg p-8 text-center">
                    <p className="text-gray-500">No properties found matching your criteria.</p>
                    <Button 
                      onClick={() => handleSearch({})} 
                      variant="outline" 
                      className="mt-4"
                    >
                      Clear filters
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-600">{properties.length} properties found</p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Newest
                        </Button>
                        <Button variant="outline" size="sm">
                          Price: Low to High
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`${isMobile && !showMap ? 'hidden' : 'block'} h-[600px] lg:h-auto lg:sticky lg:top-6`}>
                <PropertyMap 
                  properties={properties} 
                  center={mapCenter} 
                  zoom={13}
                  height={isMobile ? "500px" : "100%"}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Apartments;
