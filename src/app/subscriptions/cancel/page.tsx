import React from 'react';
import Link from 'next/link';

const PaystackCancelPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
                <p className="text-gray-700 mb-6">
                    Your payment process was cancelled or could not be completed. Your subscription has not been activated or updated.
                </p>
                <p className="text-gray-700 mb-6">
                    If you intended to subscribe or update your plan, please try again. If the problem persists, contact support.
                </p>
                <div className="flex justify-center">
                    <Link href="/subscriptions" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Return to Subscriptions
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaystackCancelPage;