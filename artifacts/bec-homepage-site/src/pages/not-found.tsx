import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';

export default function NotFound() {
  return (
    <PageTransition className="min-h-[70vh] w-full flex items-center justify-center bg-gray-50 py-20 px-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertCircle size={48} />
        </div>
        <h1 className="text-4xl font-extrabold mb-4 text-[#14202d]">
          404 Page Not Found
        </h1>
        <p className="mt-4 text-gray-600 mb-8 text-lg">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="bec-primary inline-flex items-center justify-center gap-2">
          <ArrowLeft size={18} /> Go back Home
        </Link>
      </div>
    </PageTransition>
  );
}
