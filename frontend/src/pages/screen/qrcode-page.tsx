import { Card } from '@/components/ui/card';
import { Smartphone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { getCode } from '@/api';
import { useTranslation } from 'react-i18next';
import { config } from '../../config';
import { useWebSocket } from '@/hooks/useWebSocket';

const QRCodeScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [code, setCode] = useState<string>('');
  const genQrCode = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const { subscribe, unsubscribe } = useWebSocket();
  const face = '(｡♥‿♥｡)';

  useEffect(() => {
    const handleOrder = () => {
      navigate('/screen/giving');
    };

    subscribe('order', handleOrder);

    return () => {
      unsubscribe('order');
    };
  }, [navigate, subscribe, unsubscribe]);

  useEffect(() => {
    const getCodeAPI = async () => {
      try {
        const res = await getCode(); 
        const newCode = res.data.code;
        
        // If code has changed, refresh the page
        if (code !== '' && code !== newCode) {
          window.location.reload();
          return;
        }
        
        setCode(newCode);
      } catch (error) {
        // QR code error
      }
    };

    // Initial code fetch
    if (!genQrCode.current) {
      genQrCode.current = true;
      getCodeAPI();
    }

    // Set up interval to check for code changes every 5 seconds
    const interval = setInterval(() => {
      if (genQrCode.current) {
        getCodeAPI();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [code]);

  return (
    <div className="w-[1000px] h-[590px] flex items-center justify-center p-4">
      <Card className="w-full h-full flex flex-col items-center justify-center p-8 text-center transition-all duration-300 hover:shadow-xl animate-fade-in border-2 border-[#FF4B28] relative">
        {/* Header */}
        <div className="text-center mb-2 animate-fade-in">
          <h1 className="text-4xl font-bold mt-4" style={{ color: '#FF4B28' }}>
            {t("screen.qrcode.title")}
          </h1>
          <p className="text-xl mt-2" style={{ color: '#919191' }}>
            {t("screen.qrcode.subtitle")}
          </p>
        </div>

        {/* QR Code Section */}
        <div className="flex items-center gap-12 my-8">
          <div 
            className="p-3 bg-white rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <QRCodeSVG value={`${config.app.url}/form?code=${code}`} size={200} fgColor='#ff9e1f' />
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