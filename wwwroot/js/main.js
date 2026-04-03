const API_URL = '/api/products';

// Element Selectors
const productList = document.getElementById('productList');
const productForm = document.getElementById('productForm');
const modal = document.getElementById('productModal');
const detailModal = document.getElementById('detailModal');
const btnOpenAddModal = document.getElementById('btnOpenAddModal');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchInput');

// State
let products = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchProducts);
btnOpenAddModal.addEventListener('click', openAddModal);
productForm.addEventListener('submit', handleFormSubmit);

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
});

// Modal Handlers
const closeBtn = document.querySelector('.close');
const closeBtnDetail = document.querySelector('.close-detail');
const cancelBtn = document.querySelector('.btn-secondary.close-modal');
const closeDetailBtn = document.querySelector('.btn-secondary.close-detail');

[closeBtn, cancelBtn].forEach(btn => btn?.addEventListener('click', () => modal.style.display = 'none'));
[closeBtnDetail, closeDetailBtn].forEach(btn => btn?.addEventListener('click', () => detailModal.style.display = 'none'));

window.onclick = (event) => {
    if (event.target == modal) modal.style.display = 'none';
    if (event.target == detailModal) detailModal.style.display = 'none';
};

// Fetch Products
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        productList.innerHTML = `<div class="error">Failed to load products. ${error.message}</div>`;
    }
}

// Render Products
function renderProducts(data) {
    if (!data || data.length === 0) {
        productList.innerHTML = '<div class="no-products">No products found. Add one!</div>';
        return;
    }

    productList.innerHTML = data.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">$${Number(product.price).toFixed(2)}</div>
                <p class="product-desc">${product.description || 'No description available.'}</p>
            </div>
            <div class="product-actions">
                <button class="btn btn-secondary btn-sm" onclick="viewDetails(${product.id})">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-primary btn-sm" onclick="openEditModal(${product.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Open Add Modal
function openAddModal() {
    modalTitle.textContent = 'Add New Product';
    productForm.reset();
    document.getElementById('productId').value = '';
    document.getElementById('productImageUrl').value = '';
    document.getElementById('previewImg').style.display = 'none';
    modal.style.display = 'block';
}

// Open Edit Modal
async function openEditModal(id) {
    try {
        const product = products.find(p => p.id === id);
        if (!product) return;

        modalTitle.textContent = 'Edit Product';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productImageUrl').value = product.imageUrl || '';
        
        const previewImg = document.getElementById('previewImg');
        if (product.imageUrl) {
            previewImg.src = product.imageUrl;
            previewImg.style.display = 'block';
        } else {
            previewImg.style.display = 'none';
        }
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error opening edit modal:', error);
    }
}

// View Details
function viewDetails(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = `
        <div class="detail-img" style="margin-bottom: 1rem; text-align: center;">
            <img src="${product.imageUrl || 'https://via.placeholder.com/200?text=No+Image'}" style="max-width: 100%; border-radius: 8px;">
        </div>
        <h3>${product.name}</h3>
        <p class="price">$${Number(product.price).toFixed(2)}</p>
        <p class="desc">${product.description || 'No description available for this product.'}</p>
        <div class="metadata" style="margin-top: 1rem; font-size: 0.8rem; color: #64748b;">
            Product ID: ${product.id}
        </div>
    `;
    detailModal.style.display = 'block';
}

// Preview Upload Image
document.getElementById('productImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const previewImg = document.getElementById('previewImg');
            previewImg.src = event.target.result;
            previewImg.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// Handle Form Submit (Add/Update)
async function handleFormSubmit(e) {
    e.preventDefault();
    
    let imageUrl = document.getElementById('productImageUrl').value;
    const fileInput = document.getElementById('productImage');
    
    // If a new file is uploaded, upload it first
    if (fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        
        try {
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                imageUrl = uploadData.url;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }

    const id = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        imageUrl: imageUrl
    };

    if (id) {
        productData.id = parseInt(id);
        await updateProduct(id, productData);
    } else {
        await createProduct(productData);
    }
}

// Create Product
async function createProduct(productData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            modal.style.display = 'none';
            await fetchProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + JSON.stringify(error));
        }
    } catch (error) {
        console.error('Error creating product:', error);
    }
}

// Update Product
async function updateProduct(id, productData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            modal.style.display = 'none';
            await fetchProducts();
        } else {
            alert('Failed to update product.');
        }
    } catch (error) {
        console.error('Error updating product:', error);
    }
}

// Delete Product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await fetchProducts();
        } else {
            alert('Failed to delete product.');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}
