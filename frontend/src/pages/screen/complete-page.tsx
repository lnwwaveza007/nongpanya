import { Card } from '@/components/ui/card';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CompletionScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Auto navigate after 10 seconds
  useEffect(() => {
    const navigationTimer = setTimeout(() => {
      navigate('/screen/qrcode');
    }, 10000);

    return () => clearTimeout(navigationTimer);
  }, [navigate]);

  return (
    <div className="w-[1000px] h-[590px] flex items-center justify-center p-4">
      <Card className="flex justify-center items-center flex-col w-full h-full p-8 text-center space-y-8 transition-all duration-300 hover:shadow-xl animate-fade-in border-2 border-[#FF4B28]">
        {/* Main Content */}
        <div className="text-center space-y-6">
          {/* Happy Emoji */}
          <div 
            className="text-7xl font-bold transition-all duration-700 hover:scale-110 cursor-pointer"
            style={{ color: '#22c55e' }}
          >
            (｡♥‿♥｡)
          </div>
          
          {/* Messages */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-[#22c55e] animate-bounce">
              {t("screen.complete.title")}
            </h1>
            <p className="text-xl font-semibold text-[#FF4B28]">
              {t("screen.complete.message")}
            </p>
            <p className="text-lg text-[#FF4B28] mt-4">
              {t("screen.complete.subtitle")}
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center items-center gap-4 mt-6">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="text-[#FF4B28] text-2xl animate-bounce"
              style={{ 
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            >
              ✿
            </span>
          ))}
        </div>

        {/* Auto-redirect Message */}
        <p className="text-sm text-[#919191] mt-8">
          Returning to home screen in a few seconds...
        </p>
      </Card>
    </div>
  );
};

export default CompletionScreen;