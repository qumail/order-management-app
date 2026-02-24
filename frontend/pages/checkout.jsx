import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CheckoutForm from '../components/Checkout/CheckoutForm';
import { placeOrder } from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';

export default function Checkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Get cart from localStorage or router query
  const cart = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('cart') || '[]')
    : [];

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (customerData) => {
    setLoading(true);
    
    try {
      const orderData = {
        items: cart.map(item => ({
          menuItem: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount,
        customer: customerData
      };

      const order = await placeOrder(orderData);
      
      // Clear cart
      localStorage.removeItem('cart');
      
      toast.success('Order placed successfully!');
      router.push(`/order/${order._id}`);
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Go back to menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Checkout - Food Delivery</title>
      </Head>

      <Toaster position="top-right" />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          
          <div className="mb-6">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between py-2">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-4 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <CheckoutForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </main>
    </div>
  );
}