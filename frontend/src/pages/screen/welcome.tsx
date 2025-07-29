import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '@/components/ui/language-toggle';

const ScreenWelcomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [face, setFace] = useState('(´｡• ᵕ •｡`)');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const faces = [
    '(´｡• ᵕ •｡`)',
    '(◕‿◕✿)',
    '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
    '(●ˊωˋ●)',
    '(｡♥‿♥｡)'
  ];

  const handleStart = () => {
      navigate('/screen/qrcode');
  }

  const handleHover = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      const randomFace = faces[Math.floor(Math.random() * faces.length)];
      
      // First scale down and fade out
      setTimeout(() => {
        setFace(randomFace);
      }, 150); // Change face halfway through the animation
      
      // Reset animation state
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="w-[1000px] h-[590px] flex items-center justify-center p-4">
      <Card className="w-full h-full flex flex-col items-center justify-center p-8 text-center transition-all duration-300 hover:shadow-xl animate-fade-in border-[#FF4B28] relative overflow-hidden">
        {/* Language Toggle - Top Left */}
        <div className="absolute top-4 left-4">
          <LanguageToggle variant="inline" size="sm" />
        </div>
        
        {/* Animated Robot Face Header */}
        <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mt-4 animate-bounce"
                style={{ color: '#FF4B28' }}>
                {t("screen.welcome.title")}
            </h1>
            <p className="text-xl mt-2" style={{ color: '#919191' }}>
                {t("screen.welcome.subtitle")}
            </p>
        </div>

        {/* Main content */}
        <div 
          className={`text-7xl cursor-pointer mb-6 transition-transform duration-300 ease-in-out ${
            isAnimating ? 'scale-75 opacity-50 rotate-12' : 'scale-100 opacity-100 rotate-0'
          } hover:scale-110`}
          style={{ color: '#FF4B28' }}
          onMouseEnter={handleHover}
          onTouchStart={handleHover}
        >
          {face}
        </div>

        {/* Login Button*/}
        <div className="pt-20">
          <Button 
            className="w-full py-10 text-lg transition-all duration-300 hover:scale-105 animate-bounce-slow flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleStart}
          >
            <span className=' text-3xl'>{t("screen.welcome.pressToStart")}</span>
          </Button>
        </div>

        {/* Transition sparkles that appear on face change */}
        {isAnimating && (
          <div className="absolute pointer-events-none" style={{ top: '45%' }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping text-yellow-400"
                style={{
                  transform: `rotate(${i * 45}deg) translateX(50px)`,
                  opacity: Math.random() * 0.5 + 0.5
                }}
              >
                ✦
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ScreenWelcomePage;