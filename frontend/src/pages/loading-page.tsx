import { Card } from '@/components/ui/card';
import { useEffect } from 'react';
import mqtt from "mqtt";
import { useNavigate } from 'react-router-dom';

const LoadingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const client = mqtt.connect(import.meta.env.VITE_MQTT_ENDPOINT, {
      username: import.meta.env.VITE_MQTT_USERNAME,
      password: import.meta.env.VITE_MQTT_PASSWORD,
    });
    client.on("connect", () => {
      console.log("connected");
      client.subscribe("nongpanya/complete");
    });

    client.on("message", (_, msg) => {
      navigate('/result', {state: {data: msg}});
    });

    return () => {
      console.log("disconnecting");
      client.end();
    };
  }, []);
  
  // Primary: PANTONE 172 C (orange)
  const primaryColor = 'hsl(34, 100%, 56%)';
  // Secondary: PANTONE 123 C (yellow)
  const secondaryColor = 'hsl(48, 100%, 57%)';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* Main Card Container */}
      <Card className="w-full max-w-md p-8 text-center space-y-8 transition-all duration-300 hover:shadow-xl animate-fade-in border-[#FF4B28] relative">
        {/* Animated Face */}
        <div className="text-center">
          <div 
            className="text-6xl font-bold transition-all duration-300 hover:scale-110 cursor-pointer mb-4"
            style={{ color: '#FF4B28' }}
          >
            (｡•ᴗ•｡)
          </div>
          <h1 className="text-3xl font-bold animate-bounce" style={{ color: '#FF4B28' }}>
            Please Wait...
          </h1>
          <p className="text-muted-foreground mt-2">Dispensing your request. Hold tight!</p>
        </div>

        {/* Animated Pills */}
        <div className="flex justify-center items-center space-x-2 pt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-6 h-12 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>

        {/* Floating Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce-slow text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.4}s`,
                opacity: 0.3,
                color: i % 2 === 0 ? primaryColor : secondaryColor
              }}
            >
              ✧
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LoadingScreen;
