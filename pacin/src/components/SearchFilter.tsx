
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Sliders } from "lucide-react";

type SearchFilterProps = {
  onSearch: (filters: Record<string, any>) => void;
};

const SearchFilter = ({ onSearch }: SearchFilterProps) => {
  const [expanded, setExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [filters, setFilters] = useState({
    location: "",
    university: "",
    roomType: "",
    priceMin: 0,
    priceMax: 500,
    amenities: [] as string[],
  });

  const handleChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onSearch({
      ...filters,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    });
  };

  return (
    <div className="search-filter-box rounded-lg p-4 shadow-md w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Find Your Perfect Student Housing</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)} 
          className="flex items-center text-maskani-dark"
        >
          <Sliders className="h-4 w-4 mr-2" />
          {expanded ? "Less filters" : "More filters"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, area or university"
            value={filters.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="university">University</Label>
          <Select
            value={filters.university}
            onValueChange={(value) => handleChange("university", value)}
          >
            <SelectTrigger id="university">
              <SelectValue placeholder="Select university" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="mutah">Mutah University</SelectItem>
                <SelectItem value="jordan">University of Jordan</SelectItem>
                <SelectItem value="yarmouk">Yarmouk University</SelectItem>
                <SelectItem value="just">Jordan University of Science and Technology</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="roomType">Room Type</Label>
          <Select
            value={filters.roomType}
            onValueChange={(value) => handleChange("roomType", value)}
          >
            <SelectTrigger id="roomType">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="single">Single Room</SelectItem>
                <SelectItem value="shared">Shared Room</SelectItem>
                <SelectItem value="studio">Studio Apartment</SelectItem>
                <SelectItem value="1br">1 Bedroom Apartment</SelectItem>
                <SelectItem value="2br">2 Bedroom Apartment</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {expanded && (
        <div className="mb-4">
          <Label className="mb-2 block">Price Range (JOD)</Label>
          <div className="flex items-center mb-2">
            <span className="text-sm text-gray-500 mr-2">{priceRange[0]}</span>
            <Slider
              value={priceRange}
              min={0}
              max={1000}
              step={10}
              onValueChange={setPriceRange}
              className="flex-1 mx-4"
            />
            <span className="text-sm text-gray-500 ml-2">{priceRange[1]}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            <Label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-maskani-primary focus:ring-maskani-primary"
                onChange={(e) => {
                  const amenities = [...filters.amenities];
                  if (e.target.checked) {
                    amenities.push("wifi");
                  } else {
                    const index = amenities.indexOf("wifi");
                    if (index !== -1) amenities.splice(index, 1);
                  }
                  handleChange("amenities", amenities);
                }}
              />
              <span>WiFi</span>
            </Label>
            <Label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-maskani-primary focus:ring-maskani-primary"
                onChange={(e) => {
                  const amenities = [...filters.amenities];
                  if (e.target.checked) {
                    amenities.push("ac");
                  } else {
                    const index = amenities.indexOf("ac");
                    if (index !== -1) amenities.splice(index, 1);
                  }
                  handleChange("amenities", amenities);
                }}
              />
              <span>AC</span>
            </Label>
            <Label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-maskani-primary focus:ring-maskani-primary"
                onChange={(e) => {
                  const amenities = [...filters.amenities];
                  if (e.target.checked) {
                    amenities.push("laundry");
                  } else {
                    const index = amenities.indexOf("laundry");
                    if (index !== -1) amenities.splice(index, 1);
                  }
                  handleChange("amenities", amenities);
                }}
              />
              <span>Laundry</span>
            </Label>
            <Label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-maskani-primary focus:ring-maskani-primary"
                onChange={(e) => {
                  const amenities = [...filters.amenities];
                  if (e.target.checked) {
                    amenities.push("parking");
                  } else {
                    const index = amenities.indexOf("parking");
                    if (index !== -1) amenities.splice(index, 1);
                  }
                  handleChange("amenities", amenities);
                }}
              />
              <span>Parking</span>
            </Label>
          </div>
        </div>
      )}

      <Button 
        onClick={handleSearch} 
        className="w-full bg-maskani-primary hover:bg-maskani-primary/90 text-white"
      >
        <Search className="h-4 w-4 mr-2" /> Search Properties
      </Button>
    </div>
  );
};

export default SearchFilter;
