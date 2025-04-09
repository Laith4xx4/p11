import { Link } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  return (
    <nav className="w-full bg-white py-4 px-6 shadow-sm flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold">
        <span className="text-gray-700">Mask</span>
        <span className="text-maskani-primary">ani</span>
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8">
        <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">
          Home
        </Link>
        <Link to="/apartments" className="text-gray-700 hover:text-gray-900 font-medium">
          Apartments
        </Link>
        <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
          Contact
        </Link>
        <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">
          Login
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button size="icon" variant="ghost" className="bg-maskani-primary text-white hover:bg-maskani-primary/90">
          <Search className="h-5 w-5" />
        </Button>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium text-lg">
                Home
              </Link>
              <Link to="/apartments" className="text-gray-700 hover:text-gray-900 font-medium text-lg">
                Apartments
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium text-lg">
                Contact
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium text-lg">
                Login
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
