import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function OrderTracker({ order }) {
  const statuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = statuses.indexOf(order.status);

  const getStatusColor = (status, index) => {
    if (index < currentStatusIndex) return 'bg-green-500';
    if (index === currentStatusIndex) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  const getStatusIcon = (index) => {
    if (index < currentStatusIndex) {
      return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
    }
    if (index === currentStatusIndex) {
      return <ClockIcon className="h-6 w-6 text-blue-500" />;
    }
    return <div className="h-6 w-6 rounded-full border-2 border-gray-300" />;
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-6">Order Status</h2>
      
      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
        />
        
        <div className="relative flex justify-between">
          {statuses.map((status, index) => (
            <div key={status} className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full ${getStatusColor(status, index)} z-10`} />
              <span className="text-xs mt-2 text-center max-w-[80px]">
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Status details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-3">
          {statuses.map((status, index) => (
            <div key={status} className="flex items-center gap-3">
              {getStatusIcon(index)}
              <div className="flex-1">
                <p className={`font-medium ${
                  index <= currentStatusIndex ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {status}
                </p>
                {index === currentStatusIndex && (
                  <p className="text-sm text-gray-500">
                    Current status
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estimated time */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800">
          {order.status === 'Delivered' ? (
            'Your order has been delivered! Enjoy your meal! 🎉'
          ) : order.status === 'Out for Delivery' ? (
            'Your order is on the way! Expected delivery in 15-20 minutes.'
          ) : order.status === 'Preparing' ? (
            'Your order is being prepared. Estimated preparation time: 10-15 minutes.'
          ) : (
            'We\'ve received your order and will start preparing it soon.'
          )}
        </p>
      </div>
    </div>
  );
}