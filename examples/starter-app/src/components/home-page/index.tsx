import React from 'react';
import { CheckCircle2 } from 'lucide-react';

// Props for HomePage component
interface HomePageProps {
  token: string | null;
  storeName?: string;
}

// Utility UI bits
const Spinner = ({ size = 40 }: { size?: number }) => (
  <div className="animate-spin rounded-full border-4 border-muted border-t-primary" style={{ width: size, height: size }} />
);

/**
 * HomePage component
 */
const HomePage: React.FC<HomePageProps> = ({ token, storeName }) => {
  if (!token) {
    return (
      <div className="max-w-[1200px] mx-auto p-6 bg-background min-h-[100vh]">
        <div className="text-center p-20 bg-muted rounded-xl border border-dashed">
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground">Please authenticate to manage webhooks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6 bg-background min-h-[100vh]">
      {!storeName ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size={48} />
            <p className="text-sm text-muted-foreground">Fetching store information…</p>
          </div>
        </div>
      ) : ( 
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <CheckCircle2 className="mx-auto text-green-600" size={56} />
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Congratulations!</h2>
            <p className="mt-2 text-muted-foreground">
              You are authenticated to <span className="font-medium">{storeName}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
