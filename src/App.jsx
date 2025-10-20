import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Package } from 'lucide-react';

export default function LeftoverApp() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    expiryDate: '',
    category: 'vegetables'
  });

  useEffect(() => {
    const saved = localStorage.getItem('leftoverItems');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('leftoverItems', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (newItem.name && newItem.quantity) {
      const item = {
        id: Date.now(),
        ...newItem,
        addedDate: new Date().toISOString()
      };
      setItems([...items, item]);
      setNewItem({ name: '', quantity: '', expiryDate: '', category: 'vegetables' });
      setShowForm(false);
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryColor = (days) => {
    if (days === null) return 'bg-gray-100 text-gray-700';
    if (days < 0) return 'bg-red-100 text-red-700';
    if (days <= 2) return 'bg-orange-100 text-orange-700';
    if (days <= 5) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const categories = ['vegetables', 'fruits', 'dairy', 'meat', 'other'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-green-700">🍽️ Leftover</h1>
            <Package className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600">Track your food, reduce waste, save the planet</p>
          <div className="mt-4 flex gap-4 text-sm">
            <div className="bg-green-100 px-3 py-1 rounded-full">
              <span className="font-semibold">{items.length}</span> items tracked
            </div>
            <div className="bg-blue-100 px-3 py-1 rounded-full">
              <span className="font-semibold">
                {items.filter(item => {
                  const days = getDaysUntilExpiry(item.expiryDate);
                  return days !== null && days <= 2;
                }).length}
              </span> expiring soon
            </div>
          </div>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-green-600 text-white py-4 rounded-lg shadow-md hover:bg-green-700 transition flex items-center justify-center gap-2 mb-6 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Food Item
          </button>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Tomatoes"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="text"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  placeholder="e.g., 3 pieces"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addItem}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Add Item
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No items yet</p>
              <p className="text-gray-400 text-sm mt-2">Add your first food item to start tracking!</p>
            </div>
          ) : (
            items.map(item => {
              const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
              const expiryColor = getExpiryColor(daysUntilExpiry);
              
              return (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">Quantity: {item.quantity}</p>
                      
                      {item.expiryDate && (
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${expiryColor}`}>
                          <Calendar className="w-4 h-4" />
                          {daysUntilExpiry < 0 ? (
                            <span>Expired {Math.abs(daysUntilExpiry)} days ago</span>
                          ) : daysUntilExpiry === 0 ? (
                            <span>Expires today!</span>
                          ) : (
                            <span>Expires in {daysUntilExpiry} days</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>♻️ Every item tracked helps reduce food waste</p>
        </div>
      </div>
    </div>
  );
}