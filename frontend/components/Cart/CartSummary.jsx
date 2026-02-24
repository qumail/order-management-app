import { useRouter } from 'next/router';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

export default function CartSummary({ cart, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const router = useRouter();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        <p className="text-gray-500 text-center py-8">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <button
          onClick={onClearCart}
          className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
        >
          <TrashIcon className="h-4 w-4" />
          Clear
        </button>
      </div>

      <div className="space-y-4 mb-4">
        {cart.map(item => (
          <div key={item._id} className="flex items-center gap-4 py-2 border-b">
            <img
              src={item.image || '/placeholder-food.jpg'}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-green-600 font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onRemoveItem(item._id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded ml-2"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}