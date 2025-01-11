import { Card } from '@/components/ui/card';
import { Smartphone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import mqtt from 'mqtt';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '@/utils/axiosInstance';

const QRCodeScreen = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>('');
  const genQrCode = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const face = '(｡♥‿♥｡)';

  useEffect(() => {
    const client = mqtt.connect(import.meta.env.VITE_MQTT_ENDPOINT, {
      username: import.meta.env.VITE_MQTT_USERNAME,
      password: import.meta.env.VITE_MQTT_PASSWORD,
    });
    client.on("connect", () => {
      console.log("connected");
      client.subscribe("nongpanya/order");
    });

    client.on("message", (_) => {
      navigate('/screen/giving');
    });

    return () => {
      console.log("disconnecting");
      client.end();
    };
  }, []);

  const getCode = async () => {
    if (code !== '') return;
    try {
        const res = await axiosInstance.get('/code');
        setCode(res.data.code);
        console.log(res.data.code);
    } catch (error) {
        console.error(error);
    }
  }

  useEffect(() => {
    if (!genQrCode.current) {
        console.log('Generating code...');
        genQrCode.current = true;
        getCode();
    }
   
  }, []);

  return (
    <div className="w-[1000px] h-[590px] flex items-center justify-center p-4">
      <Card className="w-full h-full flex flex-col items-center justify-center p-8 text-center transition-all duration-300 hover:shadow-xl animate-fade-in border-[#FF4B28] relative">
        {/* Header */}
        <div className="text-center mb-2 animate-fade-in">
          <h1 className="text-4xl font-bold mt-4" style={{ color: '#FF4B28' }}>
            Scan QR Code
          </h1>
          <p className="text-xl mt-2" style={{ color: '#919191' }}>
            To continue on your mobile device
          </p>
        </div>

        {/* QR Code Section */}
        <div className="flex items-center gap-12 my-8">
          <div 
            className="p-3 bg-white rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <QRCodeSVG value={`http://nongpanya-main.scnd.space:5173/form?code=${code}`} size={200} fgColor='#ff9e1f' />
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <Smartphone size={48} className="text-[#FF4B28]" />
            <div className="text-lg text-gray-600 max-w-xs">
              Open your camera app and point it at the QR code to get started
            </div>
          </div>
        </div>

        {/* Mascot Face */}
        <div 
          className="text-5xl mt-2 transition-transform duration-300 ease-in-out"
          style={{ 
            color: '#FF4B28',
            transform: isHovering ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          {face}
        </div>

        {/* Helper Text */}
        <p className="text-gray-500 mt-4">
          Having trouble? Make sure your camera app is enabled for QR code scanning
        </p>
      </Card>
    </div>
  );
};

export default QRCodeScreen;