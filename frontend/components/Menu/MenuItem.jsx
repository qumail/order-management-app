import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function MenuItem({ item, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={item.image || '/placeholder-food.jpg'}
        alt={item.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = '/placeholder-food.jpg';
        }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
          <span className="text-lg font-bold text-green-600">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>
        <button
          onClick={() => onAddToCart(item)}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}