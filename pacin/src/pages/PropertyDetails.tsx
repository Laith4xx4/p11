
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { getPropertyById, getSimilarProperties } from "@/services/propertyService";
import { Property } from "@/types";
import { MapPin, Home, School, Phone, Mail, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import PropertyMap from "@/components/PropertyMap";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await getPropertyById(id);
        setProperty(data);
        
        if (data) {
          // Fetch similar properties
          const similar = await getSimilarProperties(id, data.university);
          setSimilarProperties(similar);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);
  
  const nextImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };
  
  const prevImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <p>Loading property details...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for does not exist or has been removed.</p>
          <Button asChild>
            <Link to="/apartments">Browse All Properties</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-6">
            <Link to="/apartments" className="text-maskani-primary hover:underline flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Apartments
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <div className="relative h-[400px] rounded-lg overflow-hidden mb-4">
                  <img 
                    src={property.images[currentImageIndex]} 
                    alt={property.name} 
                    className="w-full h-full object-cover"
                  />
                  
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`h-20 w-20 rounded-md overflow-hidden cursor-pointer ${
                        index === currentImageIndex ? "ring-2 ring-maskani-primary" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${property.name} view ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2 text-maskani-primary" />
                  <span>{property.location}</span>
                </div>
                
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center">
                    <Home className="h-5 w-5 mr-2 text-maskani-primary" />
                    <span>
                      <strong>{property.bedrooms}</strong> Bedrooms
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Home className="h-5 w-5 mr-2 text-maskani-primary" />
                    <span>
                      <strong>{property.bathrooms}</strong> Bathrooms
                    </span>
                  </div>
                  <div className="flex items-center">
                    <School className="h-5 w-5 mr-2 text-maskani-primary" />
                    <span>Near {property.university}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3">Description</h2>
                  <p className="text-gray-600">{property.description}</p>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-maskani-primary" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-3">Location</h2>
                  <div className="h-[300px] rounded-lg overflow-hidden">
                    <PropertyMap 
                      properties={[property]} 
                      center={[property.lat, property.lng]}
                      zoom={15}
                      height="300px"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-maskani-primary">
                    {property.price} {property.currency}
                  </h2>
                  <span className="text-gray-500">Monthly Rent</span>
                </div>
                
                <div className="space-y-4">
                  <Button className="w-full bg-maskani-primary hover:bg-maskani-primary/90 text-white">
                    Book a Viewing
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    Contact Landlord
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-maskani-primary" />
                      <span>+962 79 123 4567</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-maskani-primary" />
                      <span>landlord@example.com</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Safety Tips</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Always meet in a public place</li>
                  <li>• Never pay or transfer money before viewing</li>
                  <li>• Verify the landlord's identity</li>
                  <li>• Read and sign a formal lease agreement</li>
                </ul>
              </div>
            </div>
          </div>
          
          {similarProperties.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetails;
