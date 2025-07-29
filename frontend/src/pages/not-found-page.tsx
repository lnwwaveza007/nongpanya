import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-8 border-orange-200">
        <div className="text-center">
          <div className="bg-orange-100 p-4 rounded-full inline-block mb-4">
            <AlertTriangle className="text-orange-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            404 - Page Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <div className="text-sm text-gray-500">
            Please check the URL or return to the homepage.
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full py-3 text-lg flex items-center justify-center gap-2"
          >
            <Home size={20} />
            <span>Home Page</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;
