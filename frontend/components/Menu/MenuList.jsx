import MenuItem from './MenuItem';

export default function MenuList({ items, onAddToCart }) {
  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const categoryNames = {
    pizza: 'Pizza',
    burger: 'Burgers',
    pasta: 'Pasta',
    salad: 'Salads',
    drinks: 'Drinks',
    dessert: 'Desserts',
    other: 'Other Items'
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {categoryNames[category] || category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryItems.map(item => (
              <MenuItem
                key={item._id}
                item={item}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}