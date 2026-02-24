// import { useState, useEffect } from 'react';
// import Head from 'next/head';
// import MenuList from '../components/Menu/MenuList';
// import CartSummary from '../components/Cart/CartSummary';
// import { getMenuItems } from '../utils/api';
// import toast, { Toaster } from 'react-hot-toast';

// export default function Home() {
//   const [menuItems, setMenuItems] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchMenuItems();
//   }, []);

//   const fetchMenuItems = async () => {
//     try {
//       const items = await getMenuItems();
//       setMenuItems(items);
//     } catch (error) {
//       toast.error('Failed to load menu items');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = (item) => {
//     setCart(prevCart => {
//       const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
      
//       if (existingItem) {
//         return prevCart.map(cartItem =>
//           cartItem._id === item._id
//             ? { ...cartItem, quantity: cartItem.quantity + 1 }
//             : cartItem
//         );
//       }
      
//       return [...prevCart, { ...item, quantity: 1 }];
//     });
    
//     toast.success('Added to cart!');
//   };

//   const updateQuantity = (itemId, newQuantity) => {
//     if (newQuantity < 1) {
//       removeFromCart(itemId);
//       return;
//     }
    
//     setCart(prevCart =>
//       prevCart.map(item =>
//         item._id === itemId ? { ...item, quantity: newQuantity } : item
//       )
//     );
//   };

//   const removeFromCart = (itemId) => {
//     setCart(prevCart => prevCart.filter(item => item._id !== itemId));
//     toast.success('Removed from cart');
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Head>
//         <title>Food Delivery - Order Management</title>
//         <meta name="description" content="Order your favorite food" />
//       </Head>

//       <Toaster position="top-right" />

//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <h1 className="text-2xl font-bold text-gray-900">Food Delivery</h1>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <h2 className="text-xl font-semibold mb-4">Menu</h2>
//             <MenuList items={menuItems} onAddToCart={addToCart} />
//           </div>
          
//           <div className="lg:col-span-1">
//             <CartSummary
//               cart={cart}
//               onUpdateQuantity={updateQuantity}
//               onRemoveItem={removeFromCart}
//               onClearCart={clearCart}
//             />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import Head from 'next/head';
import MenuList from '../components/Menu/MenuList';
import CartSummary from '../components/Cart/CartSummary';
import { getMenuItems } from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stylesLoaded, setStylesLoaded] = useState(false);

  useEffect(() => {
    // Check if styles are loaded
    setStylesLoaded(true);
    fetchMenuItems();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const fetchMenuItems = async () => {
    try {
      const items = await getMenuItems();
      setMenuItems(items);
    } catch (error) {
      toast.error('Failed to load menu items');
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
      
      let newCart;
      if (existingItem) {
        newCart = prevCart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        newCart = [...prevCart, { ...item, quantity: 1 }];
      }
      
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
    
    toast.success('Added to cart!');
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item._id !== itemId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
    toast.success('Removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Fallback inline styles in case Tailwind doesn't load
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '1rem'
    },
    headerContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    headerTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    main: {
      maxWidth: '1280px',
      margin: '2rem auto',
      padding: '0 1rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem'
    },
    menuSection: {
      gridColumn: 'span 2'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      marginBottom: '1rem',
      color: '#1f2937'
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    },
    spinner: {
      animation: 'spin 1s linear infinite',
      borderRadius: '50%',
      height: '3rem',
      width: '3rem',
      borderBottom: '2px solid #3b82f6'
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingSpinner}>
        <div style={styles.spinner}></div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If Tailwind is not loaded, use inline styles
  if (!stylesLoaded) {
    return (
      <div style={styles.container}>
        <Head>
          <title>Food Delivery - Order Management</title>
          <meta name="description" content="Order your favorite food" />
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        </Head>

        <Toaster position="top-right" />

        <header style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>Food Delivery</h1>
          </div>
        </header>

        <main style={styles.main}>
          <div style={styles.grid}>
            <div style={styles.menuSection}>
              <h2 style={styles.sectionTitle}>Menu</h2>
              <MenuList items={menuItems} onAddToCart={addToCart} />
            </div>
            
            <div>
              <CartSummary
                cart={cart}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onClearCart={clearCart}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If Tailwind is loaded, use Tailwind classes
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Food Delivery - Order Management</title>
        <meta name="description" content="Order your favorite food" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>

      <Toaster position="top-right" />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Food Delivery</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Menu</h2>
            <MenuList items={menuItems} onAddToCart={addToCart} />
          </div>
          
          <div className="lg:col-span-1">
            <CartSummary
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
            />
          </div>
        </div>
      </main>
    </div>
  );
}