"use client";
import React, { useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, Eye, Folder, FolderOpen,
  ArrowUpDown, MoreVertical, ChevronLeft, Save, Upload, Calendar, TreePine
} from 'lucide-react';

const AdminCategories = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'add', 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Mock data - replace with actual API calls
  const mockCategories = [
    {
      id: '1',
      name: 'Electronics',
      parent: null,
      image: 'https://via.placeholder.com/300x200/3b82f6/white?text=Electronics',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-20T14:20:00Z',
      product_count: 45,
      subcategories: ['2', '3', '4']
    },
    {
      id: '2',
      name: 'Smartphones',
      parent: '1',
      parent_name: 'Electronics',
      image: 'https://via.placeholder.com/300x200/10b981/white?text=Smartphones',
      created_at: '2024-01-10T09:15:00Z',
      updated_at: '2024-01-18T16:45:00Z',
      product_count: 25,
      subcategories: []
    },
    {
      id: '3',
      name: 'Laptops',
      parent: '1',
      parent_name: 'Electronics',
      image: 'https://via.placeholder.com/300x200/8b5cf6/white?text=Laptops',
      created_at: '2024-01-05T11:20:00Z',
      updated_at: '2024-01-15T13:30:00Z',
      product_count: 15,
      subcategories: []
    },
    {
      id: '4',
      name: 'Tablets',
      parent: '1',
      parent_name: 'Electronics',
      image: 'https://via.placeholder.com/300x200/f59e0b/white?text=Tablets',
      created_at: '2024-01-01T08:45:00Z',
      updated_at: '2024-01-12T10:15:00Z',
      product_count: 8,
      subcategories: []
    },
    {
      id: '5',
      name: 'Fashion',
      parent: null,
      image: 'https://via.placeholder.com/300x200/ec4899/white?text=Fashion',
      created_at: '2024-01-08T12:00:00Z',
      updated_at: '2024-01-22T15:30:00Z',
      product_count: 32,
      subcategories: ['6', '7']
    },
    {
      id: '6',
      name: 'Men\'s Clothing',
      parent: '5',
      parent_name: 'Fashion',
      image: 'https://via.placeholder.com/300x200/6366f1/white?text=Men+Clothing',
      created_at: '2024-01-09T14:20:00Z',
      updated_at: '2024-01-19T11:45:00Z',
      product_count: 18,
      subcategories: []
    },
    {
      id: '7',
      name: 'Women\'s Clothing',
      parent: '5',
      parent_name: 'Fashion',
      image: 'https://via.placeholder.com/300x200/ef4444/white?text=Women+Clothing',
      created_at: '2024-01-11T16:30:00Z',
      updated_at: '2024-01-21T09:20:00Z',
      product_count: 14,
      subcategories: []
    }
  ];

  // Get parent categories only
  const parentCategories = mockCategories.filter(cat => !cat.parent);

  // Category Form Component
  const CategoryForm = ({ category, mode = 'add' }) => {
    const [formData, setFormData] = useState({
      name: category?.name || '',
      parent: category?.parent || '',
      image: null
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          image: file
        }));
      }
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData.name.trim()) newErrors.name = 'Category name is required';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;
      
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Submitting category:', formData);
        alert(`Category ${mode === 'add' ? 'added' : 'updated'} successfully!`);
        setCurrentView('list');
      } catch (error) {
        console.error('Error submitting category:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('list')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Categories
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'add' ? 'Add New Category' : `Edit Category`}
            </h1>
          </div>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter category name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category
                </label>
                <select
                  name="parent"
                  value={formData.parent}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Parent Category (Optional)</option>
                  {parentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to create a main category
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <div className="flex items-center space-x-4">
                  {category?.image && (
                    <img
                      src={category.image}
                      alt="Current image"
                      className="w-20 h-16 object-cover rounded-lg border"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              onClick={() => setCurrentView('list')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {mode === 'add' ? 'Add Category' : 'Update Category'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Category Detail Component
  const CategoryDetail = ({ category }) => {
    const subcategories = mockCategories.filter(cat => cat.parent === category.id);

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('list')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Categories
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
            {category.parent_name && (
              <span className="text-sm text-gray-500">
                in {category.parent_name}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedCategory(category);
                setCurrentView('edit');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Image</h2>
              <img
                src={category.image}
                alt={category.name}
                className="w-full aspect-video object-cover rounded-lg border"
              />
            </div>
          </div>

          {/* Category Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Category Name</label>
                  <p className="text-gray-900 font-semibold text-lg">{category.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Parent Category</label>
                  <p className="text-gray-900">{category.parent_name || 'Main Category'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Products</label>
                  <p className="text-gray-900 font-semibold">{category.product_count} products</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Subcategories</label>
                  <p className="text-gray-900 font-semibold">{category.subcategories?.length || 0} subcategories</p>
                </div>
              </div>
            </div>

            {/* Subcategories */}
            {subcategories.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Subcategories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {subcategories.map(subcat => (
                    <div 
                      key={subcat.id} 
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(subcat);
                        setCurrentView('detail');
                      }}
                    >
                      <Folder className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{subcat.name}</p>
                        <p className="text-xs text-gray-500">{subcat.product_count} products</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-gray-900">{new Date(category.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-gray-900">{new Date(category.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Filter categories based on search
  const filteredCategories = mockCategories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created_at':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'product_count':
        return b.product_count - a.product_count;
      case 'parent':
        // Sort by parent first (main categories first), then by name
        if (!a.parent && b.parent) return -1;
        if (a.parent && !b.parent) return 1;
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Render based on current view
  if (currentView === 'add') {
    return <CategoryForm mode="add" />;
  }

  if (currentView === 'edit' && selectedCategory) {
    return <CategoryForm category={selectedCategory} mode="edit" />;
  }

  if (currentView === 'detail' && selectedCategory) {
    return <CategoryDetail category={selectedCategory} />;
  }

  // Categories List View
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Organize your products with categories</p>
        </div>
        <button
          onClick={() => setCurrentView('add')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Search and Sort */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="parent">Hierarchy</option>
              <option value="name">Name A-Z</option>
              <option value="created_at">Newest First</option>
              <option value="product_count">Most Products</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow overflow-hidden">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {category.parent ? (
                    <Folder className="w-4 h-4 text-blue-500" />
                  ) : (
                    <FolderOpen className="w-4 h-4 text-green-500" />
                  )}
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </div>
                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {category.parent_name && (
                <p className="text-xs text-gray-500 mb-2">
                  in {category.parent_name}
                </p>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">
                  {category.product_count} products
                </span>
                {category.subcategories && category.subcategories.length > 0 && (
                  <span className="text-xs text-blue-600">
                    {category.subcategories.length} subcategories
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentView('detail');
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  <Eye className="w-3 h-3" />
                  View
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentView('edit');
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedCategories.length === 0 && (
        <div className="text-center py-12">
          <TreePine className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
          <button
            onClick={() => setCurrentView('add')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add First Category
          </button>
        </div>
      )}

      {/* Category Hierarchy Summary */}
      <div className="mt-8 bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{parentCategories.length}</p>
            <p className="text-sm text-gray-600">Main Categories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {mockCategories.filter(cat => cat.parent).length}
            </p>
            <p className="text-sm text-gray-600">Subcategories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{mockCategories.length}</p>
            <p className="text-sm text-gray-600">Total Categories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {mockCategories.reduce((sum, cat) => sum + cat.product_count, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Products</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;