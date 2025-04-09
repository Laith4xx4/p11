
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Apartments from "./pages/Apartments";
import PropertyDetails from "./pages/PropertyDetails";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Create a marker icon for Leaflet
const createMarkerIconUrl = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  canvas.width = 25;
  canvas.height = 41;
  
  // Draw pin shape
  ctx.beginPath();
  ctx.arc(12.5, 12.5, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#4ade80'; // Green color from our theme
  ctx.fill();
  ctx.closePath();
  
  // Draw the pointer
  ctx.beginPath();
  ctx.moveTo(12.5, 22);
  ctx.lineTo(5, 37);
  ctx.lineTo(20, 37);
  ctx.closePath();
  ctx.fillStyle = '#4ade80';
  ctx.fill();
  
  // Draw the border
  ctx.beginPath();
  ctx.arc(12.5, 12.5, 10, 0, Math.PI * 2);
  ctx.moveTo(12.5, 22);
  ctx.lineTo(5, 37);
  ctx.lineTo(20, 37);
  ctx.closePath();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  return canvas.toDataURL();
};

const queryClient = new QueryClient();

const App = () => {
  // Create and save a marker icon when the app initializes
  if (typeof window !== 'undefined') {
    const iconUrl = createMarkerIconUrl();
    const link = document.createElement('link');
    link.href = iconUrl;
    link.rel = 'icon';
    document.head.appendChild(link);
    
    // Save icon URL for use in the map component
    const img = new Image();
    img.src = iconUrl;
    img.onload = () => {
      const iconImg = new Blob([iconUrl], { type: 'image/png' });
      const iconImgUrl = URL.createObjectURL(iconImg);
      localStorage.setItem('markerIconUrl', iconImgUrl);
    };
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/apartments" element={<Apartments />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
