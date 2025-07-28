import { useAuth } from "@/hooks/useAuth";
import { Shield, ShieldCheck, Crown } from "lucide-react";

interface RoleIndicatorProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RoleIndicator = ({ showText = true, size = 'md' }: RoleIndicatorProps) => {
  const { user } = useAuth();
  
  if (!user) return null;

  const getRoleIcon = () => {
    switch (user.role) {
      case 'superadmin':
        return <Crown className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-purple-600`} />;
      case 'admin':
        return <ShieldCheck className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-orange-600`} />;
      case 'user':
      default:
        return <Shield className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-gray-600`} />;
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'superadmin':
        return 'text-purple-600 bg-purple-100';
      case 'admin':
        return 'text-orange-600 bg-orange-100';
      case 'user':
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full ${getRoleColor()}`}>
      {getRoleIcon()}
      {showText && (
        <span className={`font-medium ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      )}
    </div>
  );
};

export default RoleIndicator;
