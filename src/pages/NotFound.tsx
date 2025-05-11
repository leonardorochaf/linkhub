
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Profile not found</p>
        <Button onClick={() => navigate('/')} className="bg-brand-blue hover:bg-brand-blue/90">
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
