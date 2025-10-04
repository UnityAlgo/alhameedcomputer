"use client";
import React, { useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, Eye, Tag, 
  ArrowUpDown, MoreVertical, ChevronLeft, Save, Upload, Calendar
} from 'lucide-react';

const AdminBrands = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'add', 'edit'
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Mock data - replace with actual API calls
  const mockBrands = [
    {
      id: '1',
      name: 'Apple',
      description: 'Technology company known for innovative consumer electronics',
      image: 'https://via.placeholder.com/150x150/000000/white?text=Apple',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-20T14:20:00Z',
      product_count: 25
    },
    {
      id: '2',
      name: 'Samsung',
      description: 'South Korean multinational conglomerate',
      image: 'https://via.placeholder.com/150x150/1f4e79/white?text=Samsung',
      created_at: '2024-01-10T09:15:00Z',
      updated_at: '2024-01-18T16:45:00Z',
      product_count: 18
    },
    {
      id: '3',
      name: 'Dell',
      description: 'American multinational computer technology company',
      image: 'https://via.placeholder.com/150x150/0084d1/white?text=Dell',
      created_at: '2024-01-05T11:20:00Z',
      updated_at: '2024-01-15T13:30:00Z',
      product_count: 12
    }
  ];

  // Brand Form Component
  const BrandForm = ({ brand, mode = 'add' }) => {
    const [formData, setFormData] = useState({
      name: brand?.name || '',
      description: brand?.description || '',
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
      if (!formData.name.trim()) newErrors.name = 'Brand name is required';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;
      
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Submitting brand:', formData);
        alert(`Brand ${mode === 'add' ? 'added' : 'updated'} successfully!`);
        setCurrentView('list');
      } catch (error) {
        console.error('Error submitting brand:', error);
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
              Back to Brands
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'add' ? 'Add New Brand' : `Edit Brand`}
            </h1>
          </div>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter brand name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter brand description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Logo
                </label>
                <div className="flex items-center space-x-4">
                  {brand?.image && (
                    <img
                      src={brand.image}
                      alt="Current logo"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4" />
                    Upload Logo
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
              {mode === 'add' ? 'Add Brand' : 'Update Brand'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Brand Detail Component
  const BrandDetail = ({ brand }) => {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('list')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Brands
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{brand.name}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedBrand(brand);
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
          {/* Brand Logo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand Logo</h2>
              <div className="flex justify-center">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            </div>
          </div>

          {/* Brand Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Brand Name</label>
                  <p className="text-gray-900 font-semibold text-lg">{brand.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900 mt-1">{brand.description || 'No description available'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Products</label>
                  <p className="text-gray-900 font-semibold">{brand.product_count} products</p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-gray-900">{new Date(brand.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-gray-900">{new Date(brand.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Filter brands based on search
  const filteredBrands = mockBrands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort brands
  const sortedBrands = [...filteredBrands].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created_at':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'product_count':
        return b.product_count - a.product_count;
      default:
        return 0;
    }
  });

  // Render based on current view
  if (currentView === 'add') {
    return <BrandForm mode="add" />;
  }

  if (currentView === 'edit' && selectedBrand) {
    return <BrandForm brand={selectedBrand} mode="edit" />;
  }

  if (currentView === 'detail' && selectedBrand) {
    return <BrandDetail brand={selectedBrand} />;
  }

  // Brands List View
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-600">Manage your product brands</p>
        </div>
        <button
          onClick={() => setCurrentView('add')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Brand
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
                placeholder="Search brands..."
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
              <option value="name">Name A-Z</option>
              <option value="created_at">Newest First</option>
              <option value="product_count">Most Products</option>
            </select>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedBrands.map((brand) => (
          <div key={brand.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
            <div className="p-6 text-center">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-16 h-16 object-cover rounded-lg mx-auto mb-4"
              />
              <h3 className="font-semibold text-gray-900 mb-2">{brand.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {brand.description || 'No description'}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {brand.product_count} products
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedBrand(brand);
                    setCurrentView('detail');
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  <Eye className="w-3 h-3" />
                  View
                </button>
                <button
                  onClick={() => {
                    setSelectedBrand(brand);
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

      {sortedBrands.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No brands found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
          <button
            onClick={() => setCurrentView('add')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add First Brand
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBrands;