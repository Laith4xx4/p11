import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchFilter from "@/components/SearchFilter";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import Footer from "@/components/Footer";
import { getProperties } from "@/services/propertyService";
import { Property } from "@/types";
import { MapPin, Building, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  [key: string]: string | number | undefined;
}

const Index = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([31.1829, 35.7046]); // Default to Jordan
  
  const handleSearch = async (filters: SearchFilters) => {
    setLoading(true);
    try {
      const filteredProperties = await getProperties(filters);
      setProperties(filteredProperties);
      
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
        const data = await getProperties();
        setProperties(data);
        // Set the first 4 properties as featured with custom images
        setFeaturedProperties([
          {
            id: "1",
            name: "MUTAH RESIDENCE",
            description: "Modern student residence near Mutah University",
            location: "Al-Karak, Jordan",
            price: 30,
            currency: "JOD",
            image: "/images/slide1.jpg",
            images: ["/images/slide1.jpg"],
            bedrooms: 2,
            bathrooms: 2,
            area: 120,
            university: "Mutah University",
            amenities: ["WiFi", "Laundry", "Kitchen"],
            lat: 31.1829,
            lng: 35.7046,
            stats: {
              available: 12,
              students: 150,
              satisfaction: 98
            }
          },
          {
            id: "2",
            name: "STUDENT VILLAGE",
            description: "Comfortable student housing in Amman",
            location: "Amman, Jordan",
            price: 100,
            currency: "JOD",
            image: "/images/slide2.jpg",
            images: ["/images/slide2.jpg"],
            bedrooms: 3,
            bathrooms: 2,
            area: 150,
            university: "University of Jordan",
            amenities: ["WiFi", "Laundry", "Kitchen", "Gym"],
            lat: 31.9545,
            lng: 35.9106,
            stats: {
              available: 8,
              students: 120,
              satisfaction: 95
            }
          },
          {
            id: "3",
            name: "CAMPUS LIVING",
            description: "Student accommodation near Yarmouk University",
            location: "Irbid, Jordan",
            price: 400,
            currency: "JOD",
            image: "/images/slide4.jpg",
            images: ["/images/slide4.jpg"],
            bedrooms: 2,
            bathrooms: 1,
            area: 100,
            university: "Yarmouk University",
            amenities: ["WiFi", "Laundry", "Kitchen"],
            lat: 32.5556,
            lng: 35.8500,
            stats: {
              available: 15,
              students: 200,
              satisfaction: 97
            }
          },
          {
            id: "4",
            name: "UNIVERSITY HOMES",
            description: "Premium student housing in Aqaba",
            location: "Aqaba, Jordan",
            price: 550,
            currency: "JOD",
            image: "/images/slide4.jpg",
            images: ["/images/slide4.jpg"],
            bedrooms: 3,
            bathrooms: 2,
            area: 140,
            university: "Aqaba University",
            amenities: ["WiFi", "Laundry", "Kitchen", "Pool"],
            lat: 29.5319,
            lng: 35.0061,
            stats: {
              available: 10,
              students: 180,
              satisfaction: 96
            }
          },
          {
            id: "5",
            name: "STUDENT HAVEN",
            description: "Luxury student accommodation in Madaba",
            location: "Madaba, Jordan",
            price: 480,
            currency: "JOD",
            image: "/images/slide5.jpg",
            images: ["/images/slide5.jpg"],
            bedrooms: 2,
            bathrooms: 2,
            area: 130,
            university: "Madaba University",
            amenities: ["WiFi", "Laundry", "Kitchen", "Study Room"],
            lat: 31.7167,
            lng: 35.8000,
            stats: {
              available: 7,
              students: 90,
              satisfaction: 99
            }
          }
        ]);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {featuredProperties.length > 0 && <Hero properties={featuredProperties} />}
      
      <main className="flex-grow">
        <section className="py-12 px-6">
          <div className="container mx-auto">
            <SearchFilter onSearch={handleSearch} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              <div className="animate-fade-up">
                <h2 className="text-2xl font-bold mb-6">Available Properties</h2>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Loading properties...</p>
                  </div>
                ) : properties.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
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
                  <div className="space-y-6">
                    {properties.slice(0, 3).map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                    
                    {properties.length > 3 && (
                      <div className="text-center mt-8">
                        <Button asChild>
                          <a href="/apartments">View All Properties</a>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <PropertyMap properties={properties} center={mapCenter} />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Maskani?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find the perfect student housing near your university with our easy-to-use platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <div className="bg-maskani-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-maskani-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Prime Locations</h3>
                <p className="text-gray-600">
                  Find housing options close to your university campus
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <div className="bg-maskani-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-maskani-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Quality Properties</h3>
                <p className="text-gray-600">
                  Verified listings with all amenities for student life
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <div className="bg-maskani-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-maskani-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Trusted Landlords</h3>
                <p className="text-gray-600">
                  Connect with verified landlords for a hassle-free experience
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
                <div className="bg-maskani-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-maskani-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Student Focused</h3>
                <p className="text-gray-600">
                  Tailored for student needs with affordable pricing
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Universities</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find housing options near the top universities in Jordan
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group relative h-64 rounded-lg overflow-hidden shadow-md animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <img 
                  src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" 
                  alt="Mutah University" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg">Mutah University</h3>
                  <p className="text-white/80 text-sm">Al-Karak, Jordan</p>
                </div>
              </div>
              
              <div className="group relative h-64 rounded-lg overflow-hidden shadow-md animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <img 
                  src="https://images.unsplash.com/photo-1496469888073-80de7e952517?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80" 
                  alt="University of Jordan" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg">University of Jordan</h3>
                  <p className="text-white/80 text-sm">Amman, Jordan</p>
                </div>
              </div>
              
              <div className="group relative h-64 rounded-lg overflow-hidden shadow-md animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <img 
                  src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Yarmouk University" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg">Yarmouk University</h3>
                  <p className="text-white/80 text-sm">Irbid, Jordan</p>
                </div>
              </div>
              
              <div className="group relative h-64 rounded-lg overflow-hidden shadow-md animate-fade-up" style={{ animationDelay: "0.4s" }}>
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Jordan University of Science and Technology" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg">JUST</h3>
                  <p className="text-white/80 text-sm">Irbid, Jordan</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
