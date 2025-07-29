import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Shield } from 'lucide-react';
import { screenAuth } from '@/utils/screenAuth';
import { LogOut } from 'lucide-react';
import LanguageToggle from '@/components/ui/language-toggle';

const ScreenPinPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockTime, setLockTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const MAX_ATTEMPTS = 3;
  const LOCK_DURATION = 30; // seconds

  const handleLogout = async () => {
    await screenAuth.logout();
    setIsAuthenticated(false);
    navigate('/screen/pin');
  }

  useEffect(() => {
    // Check if user is already authenticated
    setIsAuthenticated(screenAuth.isAuthenticated());
    
    // Check if there's an existing lock
    const lockEndTime = localStorage.getItem('screenLockEndTime');
    if (lockEndTime && new Date().getTime() < parseInt(lockEndTime)) {
      setIsLocked(true);
      setLockTime(Math.ceil((parseInt(lockEndTime) - new Date().getTime()) / 1000));
    }
  }, []);

  useEffect(() => {
    if (isLocked && lockTime > 0) {
      const timer = setInterval(() => {
        setLockTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            localStorage.removeItem('screenLockEndTime');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isLocked, lockTime]);

  const handleNumberClick = (number: string) => {
    if (isLocked || isLoading) return;
    
    if (pin.length < 20) { // Allow longer passwords
      setPin(prev => prev + number);
      setIsError(false);
      setErrorMessage('');
    }
  };

  const handleClear = () => {
    if (isLocked || isLoading) return;
    setPin('');
    setIsError(false);
    setErrorMessage('');
  };

  const handleBackspace = () => {
    if (isLocked || isLoading) return;
    setPin(prev => prev.slice(0, -1));
    setIsError(false);
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    if (isLocked || pin.length === 0) return;
    
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    
    try {
      const result = await screenAuth.authenticate(pin);
      
      if (result.success) {
        setIsAuthenticated(true);
        navigate('/screen/welcome');
      } else {
        setIsError(true);
        setErrorMessage(result.message || t("screen.pin.error", "Incorrect PIN. Please try again."));
        setPin('');
        
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= MAX_ATTEMPTS) {
          const lockEndTime = new Date().getTime() + (LOCK_DURATION * 1000);
          localStorage.setItem('screenLockEndTime', lockEndTime.toString());
          setIsLocked(true);
          setLockTime(LOCK_DURATION);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setIsError(true);
      setErrorMessage(t("screen.pin.error", "Authentication failed. Please try again."));
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const NumberButton = ({ number, onClick }: { number: string; onClick: () => void }) => (
    <Button
      onClick={onClick}
      disabled={isLocked || isLoading}
      className={`
        w-12 h-12 text-lg font-bold rounded-full border-2 
        transition-all duration-200 hover:scale-105
        ${isLocked || isLoading
          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
          : 'bg-white text-[#FF4B28] border-[#FF4B28] hover:bg-[#FF4B28] hover:text-white'
        }
      `}
    >
      {number}
    </Button>
  );

  return (
    <div className="w-[1000px] h-[590px] flex items-center justify-center p-2 bg-gray-50">
      <Card className="w-full h-full flex flex-col items-center justify-center p-4 text-center border-[#FF4B28] relative">
        {/* Language Toggle - Top Left */}
        <div className="absolute top-4 left-4">
          <LanguageToggle variant="inline" size="sm" />
        </div>
        
        {/* Logout Button - Top Right */}
        {isAuthenticated && (
          <Button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
            size="sm"
          >
            <LogOut size={16} />
          </Button>
        )}
        
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-center mb-2">
            {isLocked ? (
              <Lock size={30} className="text-red-500" />
            ) : (
              <Shield size={30} className="text-[#FF4B28]" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-[#FF4B28] mb-1">
            {isLocked ? t("screen.pin.locked.title", "System Locked") : t("screen.pin.title", "Screen Access")}
          </h1>
        </div>

        {isLocked ? (
          /* Lock Screen */
          <div className="flex flex-col items-center">
            <div className="text-3xl font-mono text-red-500 mb-2">
              {String(Math.floor(lockTime / 60)).padStart(2, '0')}:
              {String(lockTime % 60).padStart(2, '0')}
            </div>
            <p className="text-red-600 font-medium text-xs">
              {t("screen.pin.locked.message", "Too many failed attempts. Please wait.")}
            </p>
          </div>
        ) : (
          /* PIN Entry */
          <>
            {/* PIN Display */}
            <div className="mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2 min-h-[20px]">
                <div className="text-lg font-mono bg-gray-100 px-3 py-1 rounded border min-w-[200px] text-center">
                  {pin ? '•'.repeat(pin.length) : "ENTER PIN"}
                </div>
              </div>
              
              {isError && (
                <p className="text-red-500 font-medium animate-shake text-xs">
                  {errorMessage || t("screen.pin.error", "Incorrect PIN. Please try again.")}
                </p>
              )}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <NumberButton
                  key={num}
                  number={num.toString()}
                  onClick={() => handleNumberClick(num.toString())}
                />
              ))}
              
              {/* Bottom row with special buttons */}
              <Button
                onClick={handleClear}
                disabled={isLocked || isLoading}
                className="w-12 h-12 text-xs font-bold rounded-full border-2 bg-white text-gray-600 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                {t("screen.pin.clear", "CLR")}
              </Button>
              
              <NumberButton
                number="0"
                onClick={() => handleNumberClick('0')}
              />
              
              <Button
                onClick={handleBackspace}
                disabled={isLocked || isLoading}
                className="w-12 h-12 text-sm font-bold rounded-full border-2 bg-white text-gray-600 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                {t("screen.pin.backspace", "⌫")}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleSubmit}
                disabled={isLocked || pin.length === 0 || isLoading}
                className="bg-[#FF4B28] hover:bg-[#FF4B28]/90 text-white px-4 py-1 disabled:opacity-50 text-sm"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span className="text-xs">{t("screen.pin.authenticating", "Authenticating...")}</span>
                  </div>
                ) : (
                  t("screen.pin.enter", "Enter")
                )}
              </Button>
            </div>
          </>
        )}

        {/* Bottom info */}
        <div className="mt-4 text-xs text-gray-500">
          <p>{t("screen.pin.info", "This screen is for authorized personnel only")}</p>
        </div>
      </Card>
    </div>
  );
};

export default ScreenPinPage;
