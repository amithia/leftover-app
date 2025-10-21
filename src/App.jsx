import { useState } from 'react';
import { Plus, Trash2, Calendar, Package, Users, ShoppingCart, ChefHat, Home, Settings, TrendingUp, Leaf, X, Check } from 'lucide-react';

export default function LeftoverApp() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentHousehold, setCurrentHousehold] = useState(null);
  
  const [households, setHouseholds] = useState([]);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [consumedItems, setConsumedItems] = useState([]);
  const [cookedRecipes, setCookedRecipes] = useState([]);
  const [collabMeals, setCollabMeals] = useState([]);
  
  const [showForm, setShowForm] = useState(false);
  const [showHouseInput, setShowHouseInput] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showConsumedList, setShowConsumedList] = useState(false);
  const [showShoppingForm, setShowShoppingForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [houseName, setHouseName] = useState('');
  const [shoppingItemName, setShoppingItemName] = useState('');
  const [shoppingBuyer, setShoppingBuyer] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    expiryDate: '',
    category: 'vegetables',
    addedBy: ''
  });

  const addFridgeItem = () => {
    if (newItem.name && newItem.quantity && newItem.addedBy) {
      const item = {
        id: Date.now(),
        ...newItem,
        addedDate: new Date().toISOString()
      };
      setFridgeItems([...fridgeItems, item]);
      setNewItem({ name: '', quantity: '', expiryDate: '', category: 'vegetables', addedBy: '' });
      setShowForm(false);
    }
  };

  const deleteFridgeItem = (id) => {
    setFridgeItems(fridgeItems.filter(item => item.id !== id));
  };

  const markAsConsumed = (item) => {
    setConsumedItems([...consumedItems, { ...item, consumedDate: new Date().toISOString() }]);
    setFridgeItems(fridgeItems.filter(i => i.id !== item.id));
  };

  const addToShoppingList = () => {
    if (shoppingItemName.trim() && shoppingBuyer) {
      const item = {
        id: Date.now(),
        name: shoppingItemName,
        buyer: shoppingBuyer,
        checked: false
      };
      setShoppingList([...shoppingList, item]);
      setShoppingItemName('');
      setShoppingBuyer('');
      setShowShoppingForm(false);
    }
  };

  const toggleShoppingItem = (id) => {
    setShoppingList(shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteShoppingItem = (id) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
  };

  const markRecipeAsCooked = (recipe) => {
    const cookedRecipe = {
      id: Date.now(),
      ...recipe,
      cookedDate: new Date().toISOString(),
      cookedBy: 'solo'
    };
    setCookedRecipes([...cookedRecipes, cookedRecipe]);
  };

  const markCollabMealCooked = (opportunity) => {
    const meal = {
      id: Date.now(),
      ...opportunity,
      cookedDate: new Date().toISOString()
    };
    setCollabMeals([...collabMeals, meal]);
  };

  const addHousemate = () => {
    if (newMemberName.trim() && currentHousehold) {
      const updatedHousehold = {
        ...currentHousehold,
        members: [...(currentHousehold.members || []), newMemberName.trim()]
      };
      setCurrentHousehold(updatedHousehold);
      setHouseholds(households.map(h => 
        h.id === currentHousehold.id ? updatedHousehold : h
      ));
      setNewMemberName('');
      setShowAddMember(false);
    }
  };

  const removeHousemate = (memberName) => {
    if (confirm(`Remove ${memberName} from the house?`)) {
      const updatedHousehold = {
        ...currentHousehold,
        members: currentHousehold.members.filter(m => m !== memberName)
      };
      setCurrentHousehold(updatedHousehold);
      setHouseholds(households.map(h => 
        h.id === currentHousehold.id ? updatedHousehold : h
      ));
    }
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

  const getCategoryEmoji = (category) => {
    const emojis = {
      vegetables: '🥬',
      fruits: '🍎',
      dairy: '🥛',
      meat: '🍖',
      grains: '🍚',
      other: '🍱'
    };
    return emojis[category] || '🍱';
  };

  const categories = ['vegetables', 'fruits', 'dairy', 'meat', 'grains', 'other'];

  // Calculate sustainability metrics
  const calculateMetrics = () => {
    const itemsSaved = consumedItems.filter(item => {
      const days = getDaysUntilExpiry(item.expiryDate);
      return days !== null && days <= 3 && days >= 0;
    }).length;

    const totalConsumed = consumedItems.length;
    const moneySaved = itemsSaved * 5;
    const co2Saved = itemsSaved * 2.5;
    const recipesCookedCount = cookedRecipes.length;
    const collabMealsCount = collabMeals.length;

    return { itemsSaved, moneySaved, co2Saved, totalConsumed, recipesCookedCount, collabMealsCount };
  };

  // Setup View
  if (!currentHousehold) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-700 mb-2">🍽️ Leftover</h1>
            <p className="text-gray-600">Share food, save money, cook together</p>
            <p className="text-sm text-gray-500 mt-2">For student share houses</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Setup Your Share House</h2>
            
            {!showHouseInput ? (
              <button
                onClick={() => setShowHouseInput(true)}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition mb-4"
              >
                <Home className="w-5 h-5 inline mr-2" />
                Create New House
              </button>
            ) : (
              <div className="mb-4">
                <input
                  type="text"
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                  placeholder="Enter house name (e.g., 'Unit 5')"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (houseName.trim()) {
                        const household = {
                          id: Date.now(),
                          name: houseName,
                          members: []
                        };
                        setHouseholds([...households, household]);
                        setCurrentHousehold(household);
                        setHouseName('');
                        setShowHouseInput(false);
                        setCurrentView('settings');
                      }
                    }}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  >
                    Create & Add Members
                  </button>
                  <button
                    onClick={() => {
                      setShowHouseInput(false);
                      setHouseName('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {households.length > 0 && !showHouseInput && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Or select existing:</p>
                {households.map(household => (
                  <button
                    key={household.id}
                    onClick={() => setCurrentHousehold(household)}
                    className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition mb-2"
                  >
                    {household.name} ({household.members?.length || 0} members)
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Navigation Bar
  const NavBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-2 flex justify-around items-center shadow-lg">
      <button
        onClick={() => setCurrentView('dashboard')}
        className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-green-600' : 'text-gray-600'}`}
      >
        <TrendingUp className="w-5 h-5" />
        <span className="text-xs">Dashboard</span>
      </button>
      <button
        onClick={() => setCurrentView('home')}
        className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-green-600' : 'text-gray-600'}`}
      >
        <Package className="w-5 h-5" />
        <span className="text-xs">Fridge</span>
      </button>
      <button
        onClick={() => setCurrentView('shopping')}
        className={`flex flex-col items-center gap-1 ${currentView === 'shopping' ? 'text-green-600' : 'text-gray-600'}`}
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="text-xs">Shopping</span>
      </button>
      <button
        onClick={() => setCurrentView('recipes')}
        className={`flex flex-col items-center gap-1 ${currentView === 'recipes' ? 'text-green-600' : 'text-gray-600'}`}
      >
        <ChefHat className="w-5 h-5" />
        <span className="text-xs">Recipes</span>
      </button>
      <button
        onClick={() => setCurrentView('collab')}
        className={`flex flex-col items-center gap-1 ${currentView === 'collab' ? 'text-green-600' : 'text-gray-600'}`}
      >
        <Users className="w-5 h-5" />
        <span className="text-xs">Cook</span>
      </button>
      <button
        onClick={() => setCurrentView('settings')}
        className={`flex flex-col items-center gap-1 ${currentView === 'settings' ? 'text-green-600' : 'text-gray-600'}`}
      >
        <Settings className="w-5 h-5" />
        <span className="text-xs">Settings</span>
      </button>
    </div>
  );

  // Consumed Items Modal
  const ConsumedItemsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">📋 Consumed Items</h2>
          <button onClick={() => setShowConsumedList(false)} className="p-2 hover:bg-white/20 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {consumedItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No items consumed yet</p>
              <p className="text-sm text-gray-400 mt-2">Mark fridge items as "Used" to track them</p>
            </div>
          ) : (
            <div className="space-y-3">
              {consumedItems.map((item, index) => {
                const days = getDaysUntilExpiry(item.expiryDate);
                const wasSaved = days !== null && days <= 3 && days >= 0;
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getCategoryEmoji(item.category)}</span>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      {wasSaved && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Saved!</span>}
                    </div>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-xs text-gray-500">By {item.addedBy}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Consumed: {new Date(item.consumedDate).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Dashboard View
  if (currentView === 'dashboard') {
    const metrics = calculateMetrics();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
        {showConsumedList && <ConsumedItemsModal />}
        
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-b-3xl shadow-lg">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-1">🌱 {currentHousehold.name}</h1>
            <p className="text-green-100 text-sm">Sustainability Dashboard</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
          {/* Tips First */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 mb-2">💡 Sustainability Tips</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Use items close to expiry first</li>
              <li>• Cook together to save money & energy</li>
              <li>• Share ingredients with housemates</li>
              <li>• Plan meals using what's in the fridge</li>
            </ul>
          </div>

          {/* Hero Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Impact This Month</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Items Saved</p>
                <p className="text-3xl font-bold text-green-700">{metrics.itemsSaved}</p>
                <p className="text-xs text-green-600 mt-1">From expiring</p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Money Saved</p>
                <p className="text-3xl font-bold text-blue-700">${metrics.moneySaved}</p>
                <p className="text-xs text-blue-600 mt-1">Waste prevented</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">CO₂ Reduced</p>
                <p className="text-3xl font-bold text-purple-700">{metrics.co2Saved}<span className="text-lg">kg</span></p>
                <p className="text-xs text-purple-600 mt-1">Carbon footprint</p>
              </div>
              
              <button 
                onClick={() => setShowConsumedList(true)}
                className="bg-orange-50 rounded-xl p-4 hover:bg-orange-100 transition text-left"
              >
                <p className="text-sm text-gray-600 mb-1">Total Items</p>
                <p className="text-3xl font-bold text-orange-700">{metrics.totalConsumed}</p>
                <p className="text-xs text-orange-600 mt-1">Click to view →</p>
              </button>
            </div>
          </div>

          {/* Cooking Stats */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="font-bold text-gray-800 mb-3">👨‍🍳 Cooking Activity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Recipes Cooked</p>
                <p className="text-3xl font-bold text-yellow-700">{metrics.recipesCookedCount}</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Collab Meals</p>
                <p className="text-3xl font-bold text-pink-700">{metrics.collabMealsCount}</p>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="font-bold text-gray-800 mb-3">🏆 Top Contributors</h3>
            
            <div className="space-y-2">
              {currentHousehold.members && currentHousehold.members.length > 0 ? (
                currentHousehold.members.map((member, index) => {
                  const memberItems = consumedItems.filter(item => item.addedBy === member);
                  const memberSaved = memberItems.filter(item => {
                    const days = getDaysUntilExpiry(item.expiryDate);
                    return days !== null && days <= 3 && days >= 0;
                  }).length;
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : member.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{member}</p>
                          <p className="text-xs text-gray-500">{memberSaved} items saved</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">${memberSaved * 5}</p>
                        <p className="text-xs text-gray-500">saved</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">Add housemates to see leaderboard</p>
              )}
            </div>
          </div>
        </div>
        <NavBar />
      </div>
    );
  }

  // Home/Fridge View
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-b-3xl shadow-lg">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-1">🍽️ {currentHousehold.name}</h1>
            <p className="text-green-100 text-sm">Shared Fridge</p>
            <div className="flex gap-4 mt-4 text-sm">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="font-bold">{fridgeItems.length}</span> items
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="font-bold">{currentHousehold.members?.length || 0}</span> housemates
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6">
          {currentHousehold.members && currentHousehold.members.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">⚠️ Add housemates in Settings to start tracking items</p>
            </div>
          )}

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-green-600 text-white py-4 rounded-xl shadow-md hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold mb-6"
            >
              <Plus className="w-5 h-5" />
              Add to Fridge
            </button>
          )}

          {showForm && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Add Item</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Who's adding this?</label>
                  <select
                    value={newItem.addedBy}
                    onChange={(e) => setNewItem({ ...newItem, addedBy: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select housemate</option>
                    {currentHousehold.members?.map((member, idx) => (
                      <option key={idx} value={member}>{member}</option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Item name (e.g., Tomatoes)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  placeholder="Quantity (e.g., 3 pieces)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {getCategoryEmoji(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                  placeholder="Expiry date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <div className="flex gap-3">
                  <button
                    onClick={addFridgeItem}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                  >
                    Add Item
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setNewItem({ name: '', quantity: '', expiryDate: '', category: 'vegetables', addedBy: '' });
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {fridgeItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Fridge is empty!</p>
                <p className="text-sm text-gray-400 mt-2">Add items to start tracking</p>
              </div>
            ) : (
              fridgeItems.map(item => {
                const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
                const expiryColor = getExpiryColor(daysUntilExpiry);
                
                return (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-xs text-gray-500">Added by {item.addedBy}</p>
                        
                        {item.expiryDate && (
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${expiryColor}`}>
                            <Calendar className="w-3 h-3" />
                            {daysUntilExpiry < 0 ? (
                              <span>Expired!</span>
                            ) : daysUntilExpiry === 0 ? (
                              <span>Expires today</span>
                            ) : (
                              <span>{daysUntilExpiry}d left</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => markAsConsumed(item)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg text-xs"
                          title="Mark as used"
                        >
                          ✓ Used
                        </button>
                        <button
                          onClick={() => deleteFridgeItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <NavBar />
      </div>
    );
  }

  // Shopping List View
  if (currentView === 'shopping') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
          <h1 className="text-2xl font-bold">🛒 Shopping List</h1>
          <p className="text-green-100 text-sm">Shared with {currentHousehold.name}</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6">
          {!showShoppingForm && (
            <button
              onClick={() => setShowShoppingForm(true)}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 mb-4 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          )}

          {showShoppingForm && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 className="font-semibold mb-3">Add Shopping Item</h3>
              <input
                type="text"
                value={shoppingItemName}
                onChange={(e) => setShoppingItemName(e.target.value)}
                placeholder="Item name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
              />
              <select
                value={shoppingBuyer}
                onChange={(e) => setShoppingBuyer(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
              >
                <option value="">Who's buying this?</option>
                {currentHousehold.members?.map((member, idx) => (
                  <option key={idx} value={member}>{member}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={addToShoppingList}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowShoppingForm(false);
                    setShoppingItemName('');
                    setShoppingBuyer('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {shoppingList.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No items yet</p>
              </div>
            ) : (
              shoppingList.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleShoppingItem(item.id)}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className={`font-medium ${item.checked ? 'line-through text-gray-400' : ''}`}>
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">Buyer: {item.buyer}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteShoppingItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        <NavBar />
      </div>
    );
  }

  // Recipes View
  if (currentView === 'recipes') {
    const availableCategories = [...new Set(fridgeItems.map(item => item.category))];
    
    const recipes = [
      { name: 'Quick Veggie Stir Fry', ingredients: ['vegetables', 'grains'], time: '20 min', serves: 2, difficulty: 'Easy' },
      { name: 'Student Pasta', ingredients: ['vegetables', 'dairy'], time: '25 min', serves: 4, difficulty: 'Easy' },
      { name: 'Smoothie Bowl', ingredients: ['fruits', 'dairy'], time: '5 min', serves: 2, difficulty: 'Very Easy' },
      { name: 'Fried Rice', ingredients: ['grains', 'vegetables'], time: '15 min', serves: 3, difficulty: 'Easy' },
      { name: 'Budget Curry', ingredients: ['vegetables', 'grains'], time: '30 min', serves: 4, difficulty: 'Medium' },
      { name: 'Scrambled Eggs', ingredients: ['dairy'], time: '10 min', serves: 2, difficulty: 'Very Easy' },
      { name: 'Grilled Cheese', ingredients: ['dairy'], time: '10 min', serves: 1, difficulty: 'Very Easy' },
      { name: 'Fruit Salad', ingredients: ['fruits'], time: '10 min', serves: 3, difficulty: 'Very Easy' }
    ];
    
    const matchedRecipes = recipes
      .filter(recipe => recipe.ingredients.some(ing => availableCategories.includes(ing)))
      .map(recipe => {
        const matchedIngredients = recipe.ingredients.filter(ing => availableCategories.includes(ing)).length;
        const matchPercentage = Math.round((matchedIngredients / recipe.ingredients.length) * 100);
        const alreadyCooked = cookedRecipes.some(cr => cr.name === recipe.name);
        return { ...recipe, matchPercentage, alreadyCooked };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
          <h1 className="text-2xl font-bold">👨‍🍳 Recipe Suggestions</h1>
          <p className="text-green-100 text-sm">Based on your fridge</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6">
          {fridgeItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Add items to see recipes!</p>
            </div>
          ) : matchedRecipes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recipe matches yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matchedRecipes.map((recipe, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{recipe.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      recipe.matchPercentage === 100 ? 'bg-green-100 text-green-700' :
                      recipe.matchPercentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {recipe.matchPercentage}% match
                    </span>
                  </div>
                  
                  <div className="flex gap-4 text-sm text-gray-600 mb-3">
                    <span>⏱️ {recipe.time}</span>
                    <span>🍽️ Serves {recipe.serves}</span>
                    <span>📊 {recipe.difficulty}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {recipe.ingredients.map((ing, i) => {
                      const hasIngredient = availableCategories.includes(ing);
                      return (
                        <span 
                          key={i} 
                          className={`${hasIngredient ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'} px-3 py-1 rounded-full text-xs font-medium`}
                        >
                          {getCategoryEmoji(ing)} {ing}
                        </span>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => markRecipeAsCooked(recipe)}
                    disabled={recipe.alreadyCooked}
                    className={`w-full py-2 rounded-lg font-medium transition ${
                      recipe.alreadyCooked 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {recipe.alreadyCooked ? '✓ Already Cooked' : '🍳 Mark as Cooked'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <NavBar />
      </div>
    );
  }

  // Cook Together View
  if (currentView === 'collab') {
    const userItems = fridgeItems.reduce((acc, item) => {
      if (!acc[item.addedBy]) acc[item.addedBy] = [];
      acc[item.addedBy].push(item);
      return acc;
    }, {});

    const userCategories = {};
    Object.keys(userItems).forEach(user => {
      userCategories[user] = [...new Set(userItems[user].map(item => item.category))];
    });

    const opportunities = [];
    const users = Object.keys(userItems);
    
    if (users.length >= 2) {
      for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
          const user1 = users[i];
          const user2 = users[j];
          const categories1 = userCategories[user1];
          const categories2 = userCategories[user2];
          
          if (categories1.includes('vegetables') && categories2.includes('grains')) {
            const opp = {
              recipe: 'Veggie Fried Rice',
              users: [user1, user2],
              description: `${user1} has vegetables, ${user2} has grains`,
              savings: '$8'
            };
            const alreadyCooked = collabMeals.some(cm => cm.recipe === opp.recipe && 
              cm.users.includes(user1) && cm.users.includes(user2));
            opportunities.push({ ...opp, alreadyCooked });
          }
          
          if (categories1.includes('dairy') && categories2.includes('vegetables')) {
            const opp = {
              recipe: 'Cheesy Veggie Pasta',
              users: [user1, user2],
              description: `Combine dairy and vegetables`,
              savings: '$12'
            };
            const alreadyCooked = collabMeals.some(cm => cm.recipe === opp.recipe && 
              cm.users.includes(user1) && cm.users.includes(user2));
            opportunities.push({ ...opp, alreadyCooked });
          }
          
          if (categories1.includes('fruits') && categories2.includes('dairy')) {
            const opp = {
              recipe: 'Fruit Smoothie Bowl',
              users: [user1, user2],
              description: `Make smoothies together`,
              savings: '$6'
            };
            const alreadyCooked = collabMeals.some(cm => cm.recipe === opp.recipe && 
              cm.users.includes(user1) && cm.users.includes(user2));
            opportunities.push({ ...opp, alreadyCooked });
          }
        }
      }
      
      if (opportunities.length === 0 && users.length >= 2) {
        const opp = {
          recipe: 'Mixed Leftovers',
          users: users.slice(0, 2),
          description: 'Combine ingredients creatively',
          savings: '$10'
        };
        const alreadyCooked = collabMeals.some(cm => cm.recipe === opp.recipe);
        opportunities.push({ ...opp, alreadyCooked });
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <h1 className="text-2xl font-bold">🤝 Cook Together</h1>
          <p className="text-purple-100 text-sm">Save money with housemates</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6">
          {opportunities.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {users.length < 2 ? 'Need more housemates with items!' : 'No matches yet!'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {users.length < 2 ? 'Add items from different people' : 'Add complementary ingredients'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opp, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-5 border-2 border-purple-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">✨ {opp.recipe}</h3>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      Save {opp.savings}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{opp.description}</p>
                  
                  <div className="bg-purple-50 rounded-xl p-4 mb-4">
                    <p className="text-sm font-semibold text-purple-900 mb-3">🎯 Housemates:</p>
                    <div className="flex flex-wrap gap-2">
                      {opp.users.map((user, i) => (
                        <div key={i} className="bg-purple-200 text-purple-900 px-4 py-2 rounded-full">
                          <div className="text-sm font-medium">{user}</div>
                          <div className="text-xs text-purple-700">
                            {userCategories[user]?.length || 0} ingredients
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs mb-3">
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">💰 Split costs</span>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🍽️ Cook together</span>
                  </div>

                  <button
                    onClick={() => markCollabMealCooked(opp)}
                    disabled={opp.alreadyCooked}
                    className={`w-full py-2 rounded-lg font-medium transition ${
                      opp.alreadyCooked 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {opp.alreadyCooked ? '✓ Already Cooked Together' : '🤝 Mark as Cooked Together'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <NavBar />
      </div>
    );
  }

  // Settings View
  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
          <h1 className="text-2xl font-bold">⚙️ Settings</h1>
          <p className="text-green-100 text-sm">Manage {currentHousehold.name}</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Housemates ({currentHousehold.members?.length || 0})
              </h2>
              <button
                onClick={() => setShowAddMember(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {showAddMember && (
              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Housemate's name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={addHousemate} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                    Add
                  </button>
                  <button onClick={() => { setShowAddMember(false); setNewMemberName(''); }} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {currentHousehold.members && currentHousehold.members.length > 0 ? (
                currentHousehold.members.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold">
                        {member.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{member}</p>
                        <p className="text-xs text-gray-500">
                          {fridgeItems.filter(item => item.addedBy === member).length} items
                        </p>
                      </div>
                    </div>
                    <button onClick={() => removeHousemate(member)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No housemates yet. Add some to start!</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-bold mb-3">📊 Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Fridge Items</p>
                <p className="text-2xl font-bold text-blue-700">{fridgeItems.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Shopping</p>
                <p className="text-2xl font-bold text-green-700">{shoppingList.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5">
            <button
              onClick={() => {
                if (confirm('Leave house?')) {
                  setCurrentHousehold(null);
                }
              }}
              className="w-full bg-red-50 text-red-700 py-3 rounded-lg hover:bg-red-100 font-medium"
            >
              Leave House
            </button>
          </div>
        </div>
        <NavBar />
      </div>
    );
  }

  return null;
}