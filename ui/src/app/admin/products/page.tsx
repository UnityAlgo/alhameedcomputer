"use client";
import React, { useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, Eye, Package, 
  Filter, ArrowUpDown, Star, ChevronLeft, Save, Upload,
  MoreVertical, Calendar, DollarSign
} from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  const mockProducts = [
    {
      id: '1',
      product_name: 'iPhone 15 Pro',
      description: 'Latest iPhone with advanced features',
      price: 999.99,
      discount_price: 899.99,
      rating: 4.8,
      category: { id: '1', name: 'Smartphones' },
      brand: { id: '1', name: 'Apple' },
      cover_image: 'https://via.placeholder.com/300x300/1f2937/white?text=iPhone+15',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-20T14:20:00Z'
    },
    {
      id: '2',
      product_name: 'MacBook Air M2',
      description: 'Powerful laptop with M2 chip',
      price: 1299.99,
      discount_price: null,
      rating: 4.9,
      category: { id: '2', name: 'Laptops' },
      brand: { id: '1', name: 'Apple' },
      cover_image: 'https://via.placeholder.com/300x300/374151/white?text=MacBook+Air',
      created_at: '2024-01-10T09:15:00Z',
      updated_at: '2024-01-18T16:45:00Z'
    }
  ];

  const mockCategories = [
    { id: '1', name: 'Smartphones' },
    { id: '2', name: 'Laptops' },
    { id: '3', name: 'Tablets' }
  ];

  const mockBrands = [
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Samsung' },
    { id: '3', name: 'Dell' }
  ];

  // Product Form Component
  const ProductForm = ({ product, mode = 'add' }) => {
    const [formData, setFormData] = useState({
      product_name: product?.product_name || '',
      description: product?.description || '',
      price: product?.price || '',
      discount_price: product?.discount_price || '',
      category: product?.category?.id || '',
      brand: product?.brand?.id || '',
      cover_image: null
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
          cover_image: file
        }));
      }
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData.product_name.trim()) newErrors.product_name = 'Product name is required';
      if (!formData.price) newErrors.price = 'Price is required';
      if (formData.price && isNaN(formData.price)) newErrors.price = 'Price must be a number';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;
      
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Submitting product:', formData);
        alert(`Product ${mode === 'add' ? 'added' : 'updated'} successfully!`);
        setCurrentView('list');
      } catch (error) {
        console.error('Error submitting product:', error);
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
              Back to Products
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'add' ? 'Add New Product' : `Edit Product`}
            </h1>
          </div>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.product_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.product_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.product_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {mockCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Brand</option>
                  {mockBrands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  step="0.01"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product description"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="flex items-center space-x-4">
                  {product?.cover_image && (
                    <img
                      src={product.cover_image}
                      alt="Current cover"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4" />
                    Upload Cover Image
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
              {mode === 'add' ? 'Add Product' : 'Update Product'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Product Detail Component
  const ProductDetail = ({ product }) => {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('list')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Products
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{product.product_name}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedProduct(product);
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
          {/* Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
              <div className="space-y-4">
                <img
                  src={product.cover_image}
                  alt={product.product_name}
                  className="w-full aspect-square object-cover rounded-lg border"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900">{product.category?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Brand</label>
                    <p className="text-gray-900">{product.brand?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Price</label>
                    <p className="text-gray-900 font-semibold">Rs. {product.price}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Discount Price</label>
                    <p className="text-gray-900 font-semibold">
                      {product.discount_price ? `Rs. ${product.discount_price}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rating</label>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-900">{product.rating}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900 mt-1">{product.description || 'No description available'}</p>
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
                    <p className="text-gray-900">{new Date(product.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-gray-900">{new Date(product.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Filter products based on search and filters
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         product.category?.name.toLowerCase() === filterBy.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Render based on current view
  if (currentView === 'add') {
    return <ProductForm mode="add" />;
  }

  if (currentView === 'edit' && selectedProduct) {
    return <ProductForm product={selectedProduct} mode="edit" />;
  }

  if (currentView === 'detail' && selectedProduct) {
    return <ProductDetail product={selectedProduct} />;
  }

  // Products List View
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setCurrentView('add')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="smartphones">Smartphones</option>
              <option value="laptops">Laptops</option>
              <option value="tablets">Tablets</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created_at">Newest First</option>
              <option value="product_name">Name A-Z</option>
              <option value="price">Price Low-High</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
            <img
              src={product.cover_image}
              alt={product.product_name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {product.product_name}
                </h3>
                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-2">{product.category?.name} • {product.brand?.name}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
                <div className="text-right">
                  {product.discount_price && (
                    <p className="text-xs text-gray-500 line-through">Rs. {product.price}</p>
                  )}
                  <p className="font-semibold text-gray-900">
                    Rs. {product.discount_price || product.price}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setCurrentView('detail');
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  <Eye className="w-3 h-3" />
                  View
                </button>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => setCurrentView('add')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add First Product
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;