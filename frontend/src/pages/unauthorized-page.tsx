import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-8 border-red-200">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
            <Shield className="text-red-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <div className="text-sm text-gray-500">
            Required role: Admin or higher
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={() => navigate('/')}
            className="w-full py-3 text-lg flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            <span>Go Back to Home</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
