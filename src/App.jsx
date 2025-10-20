import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Package, Users, ShoppingCart, ChefHat, UserCircle, Home, List, Lightbulb, ArrowLeft, Sparkles } from 'lucide-react';

export default function LeftoverApp() {
  const [currentView, setCurrentView] = useState('home');
  const [currentHousehold, setCurrentHousehold] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [households, setHouseholds] = useState([]);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    expiryDate: '',
    category: 'vegetables',
    addedBy: ''
  });

  useEffect(() => {
    const savedHouseholds = localStorage.getItem('leftoverHouseholds');
    const savedFridge = localStorage.getItem('leftoverFridge');
    const savedShopping = localStorage.getItem('leftoverShopping');
    const savedCurrentHousehold = localStorage.getItem('leftoverCurrentHousehold');
    const savedCurrentUser = localStorage.getItem('leftoverCurrentUser');
    
    if (savedHouseholds) setHouseholds(JSON.parse(savedHouseholds));
    if (savedFridge) setFridgeItems(JSON.parse(savedFridge));
    if (savedShopping) setShoppingList(JSON.parse(savedShopping));
    if (savedCurrentHousehold) setCurrentHousehold(JSON.parse(savedCurrentHousehold));
    if (savedCurrentUser) setCurrentUser(savedCurrentUser);
  }, []);

  useEffect(() => {
    localStorage.setItem('leftoverHouseholds', JSON.stringify(households));
  }, [households]);

  useEffect(() => {
    localStorage.setItem('leftoverFridge', JSON.stringify(fridgeItems));
  }, [fridgeItems]);

  useEffect(() => {
    localStorage.setItem('leftoverShopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    if (currentHousehold) {
      localStorage.setItem('leftoverCurrentHousehold', JSON.stringify(currentHousehold));
    }
  }, [currentHousehold]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('leftoverCurrentUser', currentUser);
    }
  }, [currentUser]);

  const addFridgeItem = () => {
    if (newItem.name && newItem.quantity && currentUser) {
      const item = {
        id: Date.now(),
        ...newItem,
        addedBy: currentUser,
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

  const addToShoppingList = (itemName) => {
    const item = {
      id: Date.now(),
      name: itemName,
      addedBy: currentUser,
      checked: false
    };
    setShoppingList([...shoppingList, item]);
  };

  const toggleShoppingItem = (id) => {
    setShoppingList(shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteShoppingItem = (id) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
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

  const getRecipeSuggestions = () => {
    const availableCategories = [...new Set(fridgeItems.map(item => item.category))];
    
    const recipes = [
      {
        name: 'Quick Veggie Stir Fry',
        ingredients: ['vegetables', 'grains'],
        description: 'Easy 20-min meal using leftover veggies',
        serves: 2,
        time: '20 min',
        difficulty: 'Easy',
        collaborative: true
      },
      {
        name: 'Student Pasta Night',
        ingredients: ['vegetables', 'dairy'],
        description: 'Budget-friendly pasta with whatever veggies you have',
        serves: 4,
        time: '25 min',
        difficulty: 'Easy',
        collaborative: true
      },
      {
        name: 'Smoothie Bowl',
        ingredients: ['fruits', 'dairy'],
        description: 'Healthy breakfast using expiring fruits',
        serves: 2,
        time: '5 min',
        difficulty: 'Easy',
        collaborative: false
      },
      {
        name: 'Rice Bowl Combo',
        ingredients: ['grains', 'vegetables', 'meat'],
        description: 'Customize with what you have',
        serves: 2,
        time: '15 min',
        difficulty: 'Easy',
        collaborative: true
      },
      {
        name: 'Leftover Fried Rice',
        ingredients: ['grains', 'vegetables'],
        description: 'Perfect for using up old rice and veggies',
        serves: 3,
        time: '15 min',
        difficulty: 'Easy',
        collaborative: true
      },
      {
        name: 'Budget Curry',
        ingredients: ['vegetables', 'grains'],
        description: 'Feed multiple people cheaply',
        serves: 4,
        time: '30 min',
        difficulty: 'Medium',
        collaborative: true
      },
      {
        name: 'Breakfast Burrito',
        ingredients: ['dairy', 'vegetables'],
        description: 'Quick protein-packed breakfast',
        serves: 2,
        time: '10 min',
        difficulty: 'Easy',
        collaborative: false
      },
      {
        name: 'Simple Salad Bowl',
        ingredients: ['vegetables', 'fruits'],
        description: 'Fresh and healthy',
        serves: 1,
        time: '5 min',
        difficulty: 'Easy',
        collaborative: false
      }
    ];
    
    return recipes.filter(recipe => {
      const matchCount = recipe.ingredients.filter(ing => 
        availableCategories.includes(ing)
      ).length;
      return matchCount >= 1;
    }).sort((a, b) => {
      const aMatches = a.ingredients.filter(ing => availableCategories.includes(ing)).length;
      const bMatches = b.ingredients.filter(ing => availableCategories.includes(ing)).length;
      return bMatches - aMatches;
    });
  };

  const getCollaborativeOpportunities = () => {
    const userItems = fridgeItems.reduce((acc, item) => {
      if (!acc[item.addedBy]) acc[item.addedBy] = [];
      acc[item.addedBy].push(item);
      return acc;
    }, {});

    const opportunities = [];
    const recipes = getRecipeSuggestions().filter(r => r.collaborative);

    recipes.forEach(recipe => {
      const users = Object.keys(userItems);
      const matches = users.filter(user => {
        const userCategories = [...new Set(userItems[user].map(item => item.category))];
        return recipe.ingredients.some(ing => userCategories.includes(ing));
      });

      if (matches.length >= 2) {
        opportunities.push({
          recipe: recipe.name,
          users: matches,
          description: recipe.description
        });
      }
    });

    return opportunities;
  };

  const categories = ['vegetables', 'fruits', 'dairy', 'meat', 'grains', 'other'];

  const [showHouseInput, setShowHouseInput] = useState(false);
  const [houseName, setHouseName] = useState('');
  const [userName, setUserName] = useState('');

  // Setup View
  if (!currentHousehold || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-700 mb-2">🍽️ Leftover</h1>
            <p className="text-gray-600">Share food, save money, cook together</p>
            <p className="text-sm text-gray-500 mt-2">For student share houses</p>
          </div>

          {!currentHousehold ? (
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
                        }
                      }}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Create
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
                  <p className="text-sm text-gray-600 mb-2">Or join existing:</p>
                  {households.map(household => (
                    <button
                      key={household.id}
                      onClick={() => setCurrentHousehold(household)}
                      className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition mb-2"
                    >
                      {household.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-4">What's your name?</h2>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your first name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                autoFocus
              />
              <button
                onClick={() => {
                  if (userName.trim()) {
                    setCurrentUser(userName);
                    const updatedHousehold = {
                      ...currentHousehold,
                      members: [...(currentHousehold.members || []), userName]
                    };
                    setCurrentHousehold(updatedHousehold);
                    setHouseholds(households.map(h => 
                      h.id === currentHousehold.id ? updatedHousehold : h
                    ));
                  }
                }}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Continue
              </button>
              <button
                onClick={() => setCurrentHousehold(null)}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 mt-2"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Navigation Bar
  const NavBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-around items-center shadow-lg">
      <button
        onClick={() => setCurrentView('home')}
        className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-green-600' : 'text-gray-600'}`}
      >
        <Package className="w-6 h-6" />
        <span className="text-xs">Fridge</span>
      </button>
      <button
        onClick={() => setCurrentView('shopping')}
        className={`flex flex-col items-center gap-1 ${currentView === 'shopping' ? 'text-green-600' : 'text-gray-600'}`}
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="text-xs">Shopping</span>
      </button>
      <button
        onClick={() => setCurrentView('recipes')}
        className={`flex flex-col items-center gap-1 ${currentView === 'recipes' ? 'text-green-600' : 'text-gray-600'}`}
      >
        <ChefHat className="w-6 h-6" />
        <span className="text-xs">Recipes</span>
      </button>
      <button
        onClick={() => setCurrentView('collab')}
        className={`flex flex-col items-center gap-1 ${currentView === 'collab' ? 'text-green-600' : 'text-gray-600'}`}
      >
        <Users className="w-6 h-6" />
        <span className="text-xs">Cook Together</span>
      </button>
    </div>
  );

  // Home/Fridge View
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-b-3xl shadow-lg">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold">🍽️ {currentHousehold.name}</h1>
                <p className="text-green-100 text-sm">Logged in as {currentUser}</p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Switch house or user?')) {
                    setCurrentHousehold(null);
                    setCurrentUser(null);
                  }
                }}
                className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2"
              >
                <UserCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="font-bold">{fridgeItems.length}</span> items in fridge
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="font-bold">{currentHousehold.members?.length || 0}</span> housemates
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6">
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
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Item name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  placeholder="Quantity"
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
                    onClick={() => setShowForm(false)}
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
                      
                      <button
                        onClick={() => deleteFridgeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <input
              type="text"
              placeholder="Add item to shopping list..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  addToShoppingList(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-2">Press Enter to add</p>
          </div>

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
                      <p className="text-xs text-gray-500">Added by {item.addedBy}</p>
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
    const suggestions = getRecipeSuggestions();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
          <h1 className="text-2xl font-bold">👨‍🍳 Recipe Suggestions</h1>
          <p className="text-green-100 text-sm">Based on what's in your fridge</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6">
          {suggestions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Add items to fridge to see recipe suggestions!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((recipe, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{recipe.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{recipe.description}</p>
                    </div>
                    {recipe.collaborative && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Group
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-4 text-sm text-gray-600 mb-3">
                    <span>⏱️ {recipe.time}</span>
                    <span>🍽️ Serves {recipe.serves}</span>
                    <span>📊 {recipe.difficulty}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recipe.ingredients.map((ing, i) => (
                      <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        {getCategoryEmoji(ing)} {ing}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <NavBar />
      </div>
    );
  }

  // Collaborative Cooking View
  if (currentView === 'collab') {
    const opportunities = getCollaborativeOpportunities();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <h1 className="text-2xl font-bold">🤝 Cook Together</h1>
          <p className="text-purple-100 text-sm">Match ingredients with housemates</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6">
          {opportunities.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No collaborative cooking opportunities yet!</p>
              <p className="text-sm text-gray-400 mt-2">Add more items or wait for housemates to add theirs</p>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opp, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-5 border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-800">{opp.recipe}</h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{opp.description}</p>
                  
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-purple-900 mb-2">
                      🎯 Cook together with:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {opp.users.map((user, i) => (
                        <span key={i} className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-sm font-medium">
                          {user}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    💡 Split costs and reduce waste together!
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-5 mt-6">
            <h3 className="font-bold text-purple-900 mb-2">💡 How it works</h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Each person adds their ingredients</li>
              <li>• App matches recipes that use everyone's food</li>
              <li>• Cook together and split the meal!</li>
              <li>• Save money and reduce waste 🌱</li>
            </ul>
          </div>
        </div>
        <NavBar />
      </div>
    );
  }
}