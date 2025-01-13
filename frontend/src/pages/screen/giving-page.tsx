import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import mqtt from "mqtt";
import { useNavigate } from 'react-router-dom';

const GivingScreen = () => {
  const navigate = useNavigate();
  const [currentEmoji, setCurrentEmoji] = useState(0);
  const [stars, setStars] = useState(Array(7).fill(true));
  
  const waitingEmojis = [
    "(っ˘ڡ˘ς)",
    "(´｡• ᵕ •｡`)",
    "(｡♡‿♡｡)",
    "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
    "(◠‿◠✿)",
    "( ˙꒳​˙ )",
    "(◕‿◕✿)"
  ];

  // เปลี่ยน emoji ทุก 2 วินาที
  useEffect(() => {
    const emojiInterval = setInterval(() => {
      setCurrentEmoji((prev) => (prev + 1) % waitingEmojis.length);
    }, 2000);

    return () => clearInterval(emojiInterval);
  }, []);

  // ทำให้ดาวกระพริบแบบสุ่ม
  useEffect(() => {
    const starInterval = setInterval(() => {
      setStars(prevStars => 
        prevStars.map(() => Math.random() > 0.3) // 70% โอกาสที่ดาวจะแสดง
      );
    }, 1000);

    return () => clearInterval(starInterval);
  }, []);

useEffect(() => {
  const clientRef = mqtt.connect(import.meta.env.VITE_MQTT_ENDPOINT, {
    username: import.meta.env.VITE_MQTT_USERNAME,
    password: import.meta.env.VITE_MQTT_PASSWORD,
  });

  clientRef.on("connect", () => {
    console.log("connected");
    clientRef.subscribe("nongpanya/complete");
  });

  clientRef.on("message", (_, payload) => {
    const message = payload.toString();
    if (message === "error") {
      navigate("/screen/qrcode");
    } else {
      navigate("/screen/complete");
    }
  });

  return () => {
    console.log("disconnecting");
    clientRef.end();
  };
}, [navigate]);


  const primaryColor = 'hsl(34, 100%, 56%)';
  const secondaryColor = 'hsl(48, 100%, 57%)';

  return (
    <div className="w-[1000px] h-[590px] flex items-center justify-center p-4">
      <Card className="flex justify-center items-center flex-col w-full h-full p-8 text-center space-y-8 transition-all duration-300 hover:shadow-xl animate-fade-in border-[#FF4B28]">
        <div className="text-center">
          <div 
            className="text-6xl font-bold transition-all duration-700 hover:scale-110 cursor-pointer mb-4"
            style={{ color: '#FF4B28' }}
          >
            {waitingEmojis[currentEmoji]}
          </div>
          <h1 className="text-3xl font-bold animate-bounce" style={{ color: '#FF4B28' }}>
            Please Wait...
          </h1>
          <p className="text-muted-foreground mt-2">
            Dispensing your request. Hold tight!
          </p>
        </div>

        <div className="flex justify-center items-center space-x-2 pt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-6 h-12 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {stars.map((isVisible, i) => (
            <div
              key={i}
              className={`absolute transition-opacity duration-1000 text-2xl`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: isVisible ? 0.3 : 0,
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

export default GivingScreen;