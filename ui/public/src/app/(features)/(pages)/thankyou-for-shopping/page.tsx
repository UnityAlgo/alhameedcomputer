import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-6 shadow-2xl">
              <CheckCircle className="w-20 h-20 text-green-500" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Thank You for Shopping!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your order has been successfully placed. We're excited to get your items to you!
          </p>



          {/* Email Confirmation Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <p className="text-sm text-blue-800">
              📧 A confirmation email has been sent to your inbox with order details and tracking information.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders">
            <button className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Track Your Order
              <ArrowRight className="w-5 h-5" />
            </button>
            </Link>
            
            <Link href="/">
            <button className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-8 py-4 rounded-xl transition-all duration-200">
              <Home className="w-5 h-5" />
              Continue Shopping
            </button>
            o</Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@example.com" className="text-green-600 hover:text-green-700 font-medium">
                support@example.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            We appreciate your business! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}