//imports
import {useState} from 'react';

// icons
import {Plus, Trash2, Calendar, Package, Users, ShoppingCart, ChefHat, Home, Settings, TrendingUp, Leaf, X, Check, Salad, Apple, Milk, Drumstick, Wheat, UtensilsCrossed} from 'lucide-react';

//main function
export default function LeftoverApp() {

  const [currentView, setCurrentView] = useState('dashboard');
  const [currentHousehold, setCurrentHousehold] = useState(null);
  const [signupStep, setSignupStep] = useState('houseName'); // 'houseName' or 'members'
  const [households, setHouseholds] = useState([]);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [consumedItems, setConsumedItems] = useState([]);
  const [cookedRecipes, setCookedRecipes] = useState([]);
  const [collabMeals, setCollabMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showShoppingForm, setShowShoppingForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [houseName, setHouseName] = useState('');
  const [tempMembers, setTempMembers] = useState(['']);
  const [shoppingItemName, setShoppingItemName] = useState('');
  const [shoppingBuyer, setShoppingBuyer] = useState('');

  // fridge item
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    expiryDate: '',
    category: 'vegetables',
    addedBy: ''
  });
  
  //add new item to fridge
  const addFridgeItem = () => {
    //checking name + quanityty + addedBy
    if (newItem.name && newItem.quantity && newItem.addedBy) {
      const item = {
        // unique id
        id: Date.now(),
        ...newItem,
        addedDate: new Date().toISOString()
      };
      setFridgeItems([...fridgeItems, item]);
      setNewItem({ name: '', quantity: '', expiryDate: '', category: 'vegetables', addedBy: '' });
      // hiding form
      setShowForm(false);
    }
  };

  // delete fridge item
  const deleteFridgeItem = (id) => {
    setFridgeItems(fridgeItems.filter(item => item.id !== id));
  };

  //eaten/used
  const markAsConsumed = (item) => {
    setConsumedItems([...consumedItems, { ...item, consumedDate: new Date().toISOString() }]);
    setFridgeItems(fridgeItems.filter(i => i.id !== item.id));
  };

  //add to shopping list
  const addToShoppingList = () => {
    if (shoppingItemName.trim() && shoppingBuyer) {
      const item = {
        id: Date.now(),
        name: shoppingItemName,
        buyer: shoppingBuyer,
        checked: false //not bought
      };
      setShoppingList([...shoppingList, item]);
      setShoppingItemName(''); //clear
      setShoppingBuyer('');
      setShowShoppingForm(false);
    }
  };
  
  // checked shopping item
  const toggleShoppingItem = (id) => {
    setShoppingList(shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  //delete shopping item
  const deleteShoppingItem = (id) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
  };

  //recipe is cooked
  const markRecipeAsCooked = (recipe) => {
    const cookedRecipe = {
      id: Date.now(),
      ...recipe,
      cookedDate: new Date().toISOString(),
      cookedBy: 'solo'
    };
    setCookedRecipes([...cookedRecipes, cookedRecipe]);
  };

  //marked collab meal as cooked
  const markCollabMealCooked = (opportunity) => {
    const meal = {
      id: Date.now(),
      ...opportunity,
      cookedDate: new Date().toISOString()
    };
    setCollabMeals([...collabMeals, meal]);
  };

  // add housemate
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

  //remove housemate
  const removeHousemate = (memberName) => {
    if (confirm(`remove ${memberName} from the house?`)) {
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

  //calculate days until expiry
  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // colour based on how many days until expiry
  const getExpiryColor = (days) => {
    if (days === null) return 'bg-gray-100 text-gray-700';
    if (days < 0) return 'bg-red-100 text-red-700';
    if (days <= 2) return 'bg-orange-100 text-orange-700';
    if (days <= 5) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  //icons
  const getCategoryIcon = (category) => {
    const icons = {
      vegetables: Salad,
      fruits: Apple,
      dairy: Milk,
      meat: Drumstick,
      grains: Wheat,
      other: UtensilsCrossed
    };
    const Icon = icons[category] || UtensilsCrossed;
    return <Icon className="w-5 h-5" />;
  };

  //food labels
  const categories = ['vegetables', 'fruits', 'dairy', 'meat', 'grains', 'other'];

    // calculate dashboard metrics
  const calculateMetrics = () => {
    //consumed within 3 days of expiry
    const itemsSaved = consumedItems.filter(item => {
      const days = getDaysUntilExpiry(item.expiryDate);
      return days !== null && days <= 3 && days >= 0;
    }).length;

    const totalConsumed = 0;
    const moneySaved = 0; // $5 per item
    const co2Saved = 0; // 2.5kg per item
    const recipesCookedCount = cookedRecipes.length;
    const collabMealsCount = collabMeals.length;

    return { itemsSaved, moneySaved, co2Saved, totalConsumed, recipesCookedCount, collabMealsCount };
  };

  //add member empty for signup
  const addTempMember = () => {
    setTempMembers([...tempMembers, '']);
  };

  //updates members
  const updateTempMember = (index, value) => {
    const updated = [...tempMembers];
    updated[index] = value;
    setTempMembers(updated);
  };

  //removes members name
  const removeTempMember = (index) => {
    if (tempMembers.length > 1) {
      setTempMembers(tempMembers.filter((_, i) => i !== index));
    }
  };

  //create setup of house
  const completeSignup = () => {
    const validMembers = tempMembers.filter(m => m.trim() !== '');
    if (validMembers.length > 0) {
      const newHouse = {
        id: Date.now(),
        name: houseName,
        members: validMembers
      };
      setHouseholds([...households, newHouse]);
      setCurrentHousehold(newHouse);
      setHouseName('');
      setTempMembers(['']);
      setSignupStep('houseName');
    }
  };

  //sign-up
  if (!currentHousehold && signupStep === 'houseName') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 flex items-center justify-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#B8D4A8] rounded-full mb-4 shadow-lg">
              <Home className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-5xl font-black mb-2" style={{ 
              background: 'linear-gradient(135deg, #7FA86F 0%, #6B9A5E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              fontWeight: '900'
            }}>leftover</h1>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 text-black">What's your house name?</h2>
            
            <input
              type="text"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
              placeholder="Name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg mb-4 focus:outline-none focus:border-[#6B9A5E] focus:ring-2 focus:ring-[#6B9A5E]/20"
              autoFocus
            />

            <button
              onClick={() => {
                if (houseName.trim()) {
                  setSignupStep('members');
                }
              }}
              disabled={!houseName.trim()}
              className="w-full bg-[#B8D4A8] text-black py-3 rounded-lg font-bold transition disabled:bg-gray-300 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // add members
  if (!currentHousehold && signupStep === 'members') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 flex items-center justify-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#B8D4A8] rounded-full mb-4 shadow-lg">
              <Users className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">{houseName}</h1>
            <p className="text-gray-600 font-medium">Who lives here?</p>
          </div>

          <div className="space-y-3 mb-6">
            {tempMembers.map((member, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateTempMember(index, e.target.value)}
                  placeholder={`Member ${index + 1} name`}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6B9A5E] focus:ring-2 focus:ring-[#6B9A5E]/20"
                />
                {tempMembers.length > 1 && (
                  <button
                    onClick={() => removeTempMember(index)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addTempMember}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold mb-4 hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Another Member
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setSignupStep('houseName')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={completeSignup}
              disabled={tempMembers.filter(m => m.trim()).length === 0}
              className="flex-1 bg-[#B8D4A8] text-black py-3 rounded-lg font-bold transition disabled:bg-gray-300 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02]"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  // navigation
  const NavBar = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 px-4 py-3 flex justify-around items-center shadow-lg">
      <button
        onClick={() => setCurrentView('dashboard')}
        className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-[#6B9A5E]' : 'text-gray-400'}`}
      >
        <Home className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrentView('fridge')}
        className={`flex flex-col items-center gap-1 ${currentView === 'fridge' ? 'text-[#6B9A5E]' : 'text-gray-400'}`}
      >
        <Package className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrentView('shopping')}
        className={`flex flex-col items-center gap-1 ${currentView === 'shopping' ? 'text-[#6B9A5E]' : 'text-gray-400'}`}
      >
        <ShoppingCart className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrentView('recipes')}
        className={`flex flex-col items-center gap-1 ${currentView === 'recipes' ? 'text-[#6B9A5E]' : 'text-gray-400'}`}
      >
        <ChefHat className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrentView('collab')}
        className={`flex flex-col items-center gap-1 ${currentView === 'collab' ? 'text-[#6B9A5E]' : 'text-gray-400'}`}
      >
        <Users className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrentView('settings')}
        className={`flex flex-col items-center gap-1 ${currentView === 'settings' ? 'text-[#6B9A5E]' : 'text-gray-400'}`}
      >
        <Settings className="w-6 h-6" />
      </button>
    </nav>
  );

//dashboard front
  if (currentView === 'dashboard') {
    const metrics = calculateMetrics();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50  pb-20" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="bg-[#6B9A5E] text-black p-6">
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-6 h-6" />
            <h1 className="text-2xl font-bold" >{currentHousehold.name}</h1>
          </div>
          <p className="text-black text-sm" >Your household dashboard</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-5 border-2 border-[#6B9A5E]">
            <h3 className="font-bold text-black mb-3 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-[#6B9A5E]" />
              Sustainability Tips
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#6B9A5E] font-bold">•</span>
                <span>Use items close to expiry first</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6B9A5E] font-bold">•</span>
                <span>Cook together to reduce food waste</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6B9A5E] font-bold">•</span>
                <span>Share ingredients with housemates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6B9A5E] font-bold">•</span>
                <span>Be thoughtful about what you buy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6B9A5E] font-bold">•</span>
                <span>Choose sustainable options whenever possible</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-[#6B9A5E]" />
              Your Impact
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-black mb-2">Food Items Saved</p>
                <p className="text-3xl font-bold text-green-700">{metrics.itemsSaved}</p>
                <p className="text-xs text-green-600 mt-1">From expiring</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-black mb-2">Amount of Money Saved</p>
                <p className="text-3xl font-bold text-blue-700">${metrics.moneySaved}</p>
                <p className="text-xs text-blue-600 mt-1">Waste prevented</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-black mb-2">CO₂ Reduced</p>
                <p className="text-3xl font-bold text-purple-700">{metrics.co2Saved}kg</p>
                <p className="text-xs text-purple-600 mt-1">Carbon footprint</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-black mb-2">Total Food Items</p>
                <p className="text-3xl font-bold text-orange-700">{metrics.totalConsumed}</p>
                <p className="text-xs text-orange-600 mt-1">Consumed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="font-bold text-black mb-3 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-[#6B9A5E]" />
              Cooking Activity
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-black mb-1">Recipes Cooked</p>
                <p className="text-3xl font-bold text-yellow-700">{metrics.recipesCookedCount}</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-4">
                <p className="text-sm text-black mb-1">Collab Meals</p>
                <p className="text-3xl font-bold text-pink-700">{metrics.collabMealsCount}</p>
              </div>
            </div>
          </div>

          {fridgeItems.filter(item => {
            const days = getDaysUntilExpiry(item.expiryDate);
            return days !== null && days <= 3 && days >= 0;
          }).length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-5">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2" >
                <Calendar className="w-5 h-5 text-orange-500" />
                expiring soon
              </h2>
              <div className="space-y-2">
                {fridgeItems
                  .filter(item => {
                    const days = getDaysUntilExpiry(item.expiryDate);
                    return days !== null && days <= 3 && days >= 0;
                  })
                  .slice(0, 3)
                  .map((item) => {
                    const days = getDaysUntilExpiry(item.expiryDate);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-[#6B9A5E]">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <p className="font-bold" >{item.name}</p>
                            <p className="text-sm text-black" >{days} Days Left</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" >
              <Users className="w-5 h-5 text-[#6B9A5E]" />
              housemates ({currentHousehold.members?.length || 0})
            </h2>
            <div className="flex flex-wrap gap-2">
              {currentHousehold.members?.map((member, index) => (
                <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-2 rounded-full">
                  <span className="font-bold text-[#6B9A5E]" >{member}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <NavBar />
      </div>
    );
  }

  // fridge
  if (currentView === 'fridge') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="bg-[#B8D4A8] text-black p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2" >
            <Package className="w-6 h-6" />
            Your fridge
          </h1>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6">
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-[#B8D4A8] text-black py-3 rounded-lg font-bold mb-4 hover:bg-[#6B9A5E] hover:text-white flex items-center justify-center gap-2"
            
          >
            <Plus className="w-5 h-5" />
            Add food
          </button>

          {showForm && (
            <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold" >New Item</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="item name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6B9A5E]"
                  
                />
                <input
                  type="text"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  placeholder="quantity"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6B9A5E]"
                  
                />
                <input
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6B9A5E]"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6B9A5E]"
                  
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} >{cat}</option>
                  ))}
                </select>
                <select
                  value={newItem.addedBy}
                  onChange={(e) => setNewItem({...newItem, addedBy: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6B9A5E]"
                  
                >
                  <option value="" >who added this?</option>
                  {currentHousehold.members?.map((member, index) => (
                    <option key={index} value={member} >{member}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={addFridgeItem}
                className="w-full bg-[#B8D4A8] text-black py-3 rounded-lg font-bold mt-4 hover:bg-[#6B9A5E] hover:text-white"
                
              >
                Add to fridge
              </button>
            </div>
          )}

          {fridgeItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500" >No Items in fridge</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fridgeItems.map((item) => {
                const days = getDaysUntilExpiry(item.expiryDate);
                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3 flex-1">
                        <div className="text-[#6B9A5E]">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg" >{item.name}</h3>
                          <p className="text-sm text-gray-600" >{item.quantity}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-gradient-to-br from-green-50 to-emerald-50 px-2 py-1 rounded" >
                              {item.addedBy}
                            </span>
                            {days !== null && (
                              <span className={`text-xs px-2 py-1 rounded ${getExpiryColor(days)}`} >
                                {days < 0 ? 'expired' : days === 0 ? 'expires today' : `${days}d left`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => markAsConsumed(item)}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteFridgeItem(item.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <NavBar />
      </div>
    );
  }

  // shopping list
  if (currentView === 'shopping') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="bg-[#B8D4A8] text-black p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2" >
            <ShoppingCart className="w-6 h-6" />
            Shopping list
          </h1>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6">
          <button
            onClick={() => setShowShoppingForm(true)}
            className="w-full bg-[#B8D4A8] text-black py-3 rounded-lg font-bold mb-4 hover:bg-[#6B9A5E] hover:text-white flex items-center justify-center gap-2"
            
          >
            <Plus className="w-5 h-5" />
            Add food
          </button>

          {showShoppingForm && (
            <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold" >New Food Item</h3>
                <button onClick={() => setShowShoppingForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={shoppingItemName}
                  onChange={(e) => setShoppingItemName(e.target.value)}
                  placeholder="name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6B9A5E]"
                  
                />
                <select
                  value={shoppingBuyer}
                  onChange={(e) => setShoppingBuyer(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#6B9A5E]"
                  
                >
                  <option value="" >who will buy this?</option>
                  {currentHousehold.members?.map((member, index) => (
                    <option key={index} value={member} >{member}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={addToShoppingList}
                className="w-full bg-[#B8D4A8] text-black py-3 rounded-lg font-bold mt-4 hover:bg-[#6B9A5E] hover:text-white"
                
              >
                Add to shopping list
              </button>
            </div>
          )}

          {shoppingList.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500" >Shopping list is empty</p>
              <p className="text-sm text-gray-400 mt-2" >Add Items you need to buy</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shoppingList.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleShoppingItem(item.id)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          item.checked ? 'bg-gradient-to-r from-[#9CAF88] to-[#7D9A6F] border-[#9CAF88]' : 'border-gray-300'
                        }`}
                      >
                        {item.checked && <Check className="w-4 h-4 text-black" />}
                      </button>
                      <div className="flex-1">
                        <p className={`font-bold ${item.checked ? 'line-through text-gray-400' : ''}`} >
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600" >buyer: {item.buyer}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteShoppingItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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

  //suggested recipes
  if (currentView === 'recipes') {
    const expiringItems = fridgeItems.filter(item => {
      const days = getDaysUntilExpiry(item.expiryDate);
      return days !== null && days <= 5 && days >= 0;
    });

    const suggestedRecipes = [
      {
        name: 'Stir Fry',
        matches: expiringItems.filter(item => 
          ['vegetables', 'meat'].includes(item.category)
        ).length,
        categories: ['vegetables', 'meat'],
        time: '20 min',
        difficulty: 'easy'
      },
      {
        name: 'Pasta',
        matches: expiringItems.filter(item => 
          ['grains', 'vegetables', 'dairy'].includes(item.category)
        ).length,
        categories: ['grains', 'vegetables', 'dairy'],
        time: '25 min',
        difficulty: 'easy'
      },
      {
        name: 'Smoothie',
        matches: expiringItems.filter(item => 
          ['fruits', 'dairy'].includes(item.category)
        ).length,
        categories: ['fruits', 'dairy'],
        time: '5 min',
        difficulty: 'easy'
      },
      {
        name: 'Soup',
        matches: expiringItems.filter(item => 
          ['vegetables', 'grains'].includes(item.category)
        ).length,
        categories: ['vegetables', 'grains'],
        time: '40 min',
        difficulty: 'medium'
      }
    ].filter(recipe => recipe.matches > 0).sort((a, b) => b.matches - a.matches);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="bg-[#B8D4A8] text-black p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2" >
            <ChefHat className="w-6 h-6" />
            Suggested recipes
          </h1>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6">
          {suggestedRecipes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500" >No expiring Items</p>
              <p className="text-sm text-gray-400 mt-2" >Add food to get recipe suggestions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestedRecipes.map((recipe, index) => {
                const alreadyCooked = cookedRecipes.some(cr => cr.name === recipe.name);
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-black" >{recipe.name}</h3>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded" >
                            {recipe.time}
                          </span>
                          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded" >
                            {recipe.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2" >You Have:</p>
                      <div className="flex flex-wrap gap-2">
                        {expiringItems
                          .filter(item => recipe.categories.includes(item.category))
                          .map((item, i) => (
                            <div key={i} className="bg-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                              <span className="text-[#6B9A5E]">{getCategoryIcon(item.category)}</span>
                              <span >{item.name}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <button
                      onClick={() => markRecipeAsCooked(recipe)}
                      disabled={alreadyCooked}
                      className={`w-full py-3 rounded-lg font-bold transition ${
                        alreadyCooked 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-[#B8D4A8] text-black hover:bg-[#6B9A5E] hover:text-white'
                      }`}
                      
                    >
                      {alreadyCooked ? 'Cooked' : 'Mark as cooked'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <NavBar />
      </div>
    );
  }

  // Cook together
  if (currentView === 'collab') {
    const userItems = {};
    fridgeItems.forEach(item => {
      if (!userItems[item.addedBy]) {
        userItems[item.addedBy] = [];
      }
      userItems[item.addedBy].push(item);
    });

    const users = Object.keys(userItems);
    const userCategories = {};
    users.forEach(user => {
      userCategories[user] = [...new Set(userItems[user].map(item => item.category))];
    });

    const opportunities = [];
    if (users.length >= 2) {
      for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
          const user1 = users[i];
          const user2 = users[j];
          const categories1 = userCategories[user1];
          const categories2 = userCategories[user2];
          
          if (categories1.includes('vegetables') && categories2.includes('meat')) {
            const opp = {
              recipe: 'Stir Fry',
              users: [user1, user2],
              description: `Combine vegetables and meat`,
              savings: '$12'
            };
            const alreadyCooked = collabMeals.some(cm => cm.recipe === opp.recipe && 
              cm.users.includes(user1) && cm.users.includes(user2));
            opportunities.push({ ...opp, alreadyCooked });
          }
          
          if (categories1.includes('grains') && categories2.includes('vegetables')) {
            const opp = {
              recipe: 'Pasta',
              users: [user1, user2],
              description: `Pasta with fresh vegetables`,
              savings: '$10'
            };
            const alreadyCooked = collabMeals.some(cm => cm.recipe === opp.recipe && 
              cm.users.includes(user1) && cm.users.includes(user2));
            opportunities.push({ ...opp, alreadyCooked });
          }
          
          if (categories1.includes('fruits') && categories2.includes('dairy')) {
            const opp = {
              recipe: 'Smoothie Bowl',
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
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="bg-[#B8D4A8] text-black p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2" >
            <Users className="w-6 h-6" />
            Cook together
          </h1>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6">
          {opportunities.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500" >
                {users.length < 2 ? 'need more housemates with Items' : 'no matches yet'}
              </p>
              <p className="text-sm text-gray-400 mt-2" >
                {users.length < 2 ? 'add Items from different people' : 'add complementary Ingredients'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opp, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-black" >{opp.recipe}</h3>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold" >
                      Save {opp.savings}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4" >{opp.description}</p>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                    <p className="text-sm font-semibold text-black mb-3" >Housemates:</p>
                    <div className="flex flex-wrap gap-2">
                      {opp.users.map((user, i) => (
                        <div key={i} className="bg-green-200 text-[#000000] px-4 py-2 rounded-full">
                          <div className="text-sm font-bold" >{user}</div>
                          <div className="text-xs" >
                            {userCategories[user]?.length || 0} Ingredients
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs mb-3">
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full" >Split costs</span>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full" >Cook together</span>
                  </div>

                  <button
                    onClick={() => markCollabMealCooked(opp)}
                    disabled={opp.alreadyCooked}
                    className={`w-full py-3 rounded-lg font-bold transition ${
                      opp.alreadyCooked 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-[#B8D4A8] text-black hover:bg-[#6B9A5E] hover:text-white'
                    }`}
                    
                  >
                    {opp.alreadyCooked ? 'Already cooked together' : 'Mark as cooked together'}
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

  // settings
  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="bg-[#B8D4A8] text-black p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2" >
            <Settings className="w-6 h-6" />
            Settings
          </h1>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
          {/* House Name */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2" >
                <Home className="w-5 h-5 text-[#6B9A5E]" />
                House name
              </h2>
            </div>
            <p className="text-2xl font-bold text-[#6B9A5E]" >{currentHousehold.name}</p>
          </div>

          {/* Housemates */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2" >
                <Users className="w-5 h-5 text-[#6B9A5E]" />
                Housemates
              </h2>
              <button
                onClick={() => setShowAddMember(true)}
                className="bg-[#B8D4A8] text-black px-4 py-2 rounded-lg hover:bg-[#6B9A5E] hover:text-white text-sm flex items-center gap-1 font-bold"
                
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {showAddMember && (
              <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Housemate's name"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg mb-3 focus:outline-none focus:border-[#6B9A5E]"
                  
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={addHousemate} className="flex-1 bg-[#B8D4A8] text-black py-2 rounded-lg hover:bg-[#6B9A5E] hover:text-white font-bold" >
                    add
                  </button>
                  <button onClick={() => { setShowAddMember(false); setNewMemberName(''); }} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-bold" >
                    cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {currentHousehold.members && currentHousehold.members.length > 0 ? (
                currentHousehold.members.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#6B9A5E] rounded-full flex items-center justify-center text-white font-bold">
                        {member.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold" >{member}</p>
                        <p className="text-xs text-gray-500" >
                          {fridgeItems.filter(item => item.addedBy === member).length} Items
                        </p>
                      </div>
                    </div>
                    <button onClick={() => removeHousemate(member)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4" >No housemates yet. Add some to start!</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <button
              onClick={() => {
                if (confirm('leave house?')) {
                  setCurrentHousehold(null);
                }
              }}
              className="w-full bg-red-50 text-red-700 py-3 rounded-lg hover:bg-red-100 font-bold"
              
            >
              Leave house
            </button>
          </div>
        </div>
        <NavBar />
      </div>
    );
  }

  return null;
}