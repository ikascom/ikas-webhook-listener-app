import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          İkas Webhook Listener Template
        </h1>
        
        <div className="flex flex-col items-center space-y-4">
          <Link 
            href="/authorize-store" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mağaza Yetkilendir
          </Link>
          
          <Link 
            href="/dashboard" 
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
} 