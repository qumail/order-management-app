import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import OrderTracker from '../../components/OrderStatus/OrderTracker';
import { getOrder, simulateOrderProgress } from '../../utils/api';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';

export default function OrderPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrder();
      setupSocket();
    }
  }, [id]);

  const setupSocket = () => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000');
    
    socket.emit('join-order', id);
    
    socket.on('order-updated', (updatedOrder) => {
      setOrder(updatedOrder);
      toast.success(`Order status updated to: ${updatedOrder.status}`);
    });
    
    return () => {
      socket.disconnect();
    };
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
      setError('Failed to load order details. Please try again.');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateProgress = async () => {
    setSimulating(true);
    try {
      await simulateOrderProgress(id);
      toast.success('Order progress simulation started');
    } catch (error) {
      toast.error('Failed to simulate order progress');
    } finally {
      setSimulating(false);
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Order not found'}</p>
          <button
            onClick={handleGoBack}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Go Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Order #{order._id?.slice(-6) || 'Details'} - Food Delivery</title>
        <meta name="description" content="Track your order status" />
      </Head>

      <Toaster position="top-right" />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order._id?.slice(-6) || 'Details'}
            </h1>
            <button
              onClick={handleGoBack}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              ← Back to Menu
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <OrderTracker order={order} />
          
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Order Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Items</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b last:border-0">
                      <span>
                        {item.menuItem?.name || 'Item'} x {item.quantity}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">${order.totalAmount?.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-700 mb-2">Delivery Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="text-gray-600">Name:</span> {order.customer?.name}</p>
                  <p><span className="text-gray-600">Address:</span> {order.customer?.address}</p>
                  <p><span className="text-gray-600">Phone:</span> {order.customer?.phone}</p>
                </div>
              </div>
              
              {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Status History</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {order.statusHistory.map((history, index) => (
                      <div key={index} className="text-sm flex justify-between">
                        <span className="text-gray-600">{history.status}</span>
                        <span className="text-gray-500">
                          {new Date(history.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {order.status !== 'Delivered' && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSimulateProgress}
                disabled={simulating}
                className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {simulating ? 'Simulating...' : '▶ Simulate Order Progress'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}