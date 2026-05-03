const suppliers = [
  { id: 1, name: 'Metro Wholesale', rating: 4.8, priceFactor: 0.92, leadTime: '2 days', offer: '10% off on bulk orders' },
  { id: 2, name: 'FreshLink Distributors', rating: 4.5, priceFactor: 0.95, leadTime: '3 days', offer: 'Free delivery above \u20B98,000' },
  { id: 3, name: 'Direct Kirana Hub', rating: 4.6, priceFactor: 0.90, leadTime: '2-4 days', offer: 'Fast restock line' },
];

const inventory = [
  { sku: 'Tea-01', name: 'Packaged tea 250g', stock: 18, reorder: 30, supplierId: 1 },
  { sku: 'Oil-03', name: 'Cooking oil 1L', stock: 8, reorder: 20, supplierId: 3 },
  { sku: 'Bis-05', name: 'Biscuits pack', stock: 40, reorder: 60, supplierId: 2 },
  { sku: 'Rice-02', name: 'Premium rice 5kg', stock: 12, reorder: 25, supplierId: 1 },
  { sku: 'Soap-04', name: 'Daily soap bar', stock: 7, reorder: 25, supplierId: 3 },
];

let orders = [
  { id: 101, item: 'Cooking oil 1L', qty: 20, supplier: 'Direct Kirana Hub', status: 'Pending', eta: '3 days' },
  { id: 102, item: 'Premium rice 5kg', qty: 15, supplier: 'Metro Wholesale', status: 'Confirmed', eta: '2 days' },
];

const financing = {
  availableLimit: 22000,
  used: 5200,
  term: '30 days',
  partner: 'Kirana Capital',
  rate: '1.6% monthly',
  tip: 'Use supplier financing for top sellers and time purchases before busy weekends.',
};

const pendingOrdersCountEl = document.getElementById('pendingOrdersCount');
const lowStockCountEl = document.getElementById('lowStockCount');
const bestSupplierEl = document.getElementById('bestSupplier');
const reorderValueEl = document.getElementById('reorderValue');
const supplierListEl = document.getElementById('supplierList');
const inventoryListEl = document.getElementById('inventoryList');
const orderHistoryEl = document.getElementById('orderHistory');
const orderModal = document.getElementById('orderModal');
const supplierModal = document.getElementById('supplierModal');
const supplierSelect = document.getElementById('supplierSelect');
const itemSelect = document.getElementById('itemSelect');
const qtyInput = document.getElementById('qtyInput');
const deliverySelect = document.getElementById('deliverySelect');
const newOrderBtn = document.getElementById('newOrderBtn');
const exploreSuppliersBtn = document.getElementById('exploreSuppliersBtn');
const viewInventoryBtn = document.getElementById('viewInventoryBtn');
const submitOrderBtn = document.getElementById('submitOrderBtn');
const cancelOrderBtn = document.getElementById('cancelOrderBtn');
const searchInput = document.getElementById('searchInput');
const registerSupplierBtn = document.getElementById('registerSupplierBtn');
const submitSupplierBtn = document.getElementById('submitSupplierBtn');
const cancelSupplierBtn = document.getElementById('cancelSupplierBtn');
const newSupplierName = document.getElementById('newSupplierName');
const newSupplierRating = document.getElementById('newSupplierRating');
const newSupplierLead = document.getElementById('newSupplierLead');
const newSupplierOffer = document.getElementById('newSupplierOffer');
const availableCreditEl = document.getElementById('availableCredit');
const creditTermsEl = document.getElementById('creditTerms');
const creditUsedEl = document.getElementById('creditUsed');
const financeTipEl = document.getElementById('financeTip');
const viewCreditBtn = document.getElementById('viewCreditBtn');

function formatCurrency(value) {
  return `\u20B9${value.toLocaleString('en-IN')}`;
}

function getFilterTerm() {
  return searchInput.value.trim().toLowerCase();
}

function currentBestSupplier() {
  return suppliers.reduce((winner, supplier) => {
    if (!winner || supplier.priceFactor < winner.priceFactor) return supplier;
    return winner;
  }, null)?.name || '--';
}

function totalReorderValue() {
  return inventory.reduce((total, item) => {
    if (item.stock < item.reorder) {
      const bundleCost = 120 * (item.reorder - item.stock);
      return total + bundleCost;
    }
    return total;
  }, 0);
}

function filterSuppliers(query) {
  if (!query) return suppliers;
  return suppliers.filter((supplier) => {
    const supplierQuery = `${supplier.name} ${supplier.offer}`.toLowerCase();
    const itemMatch = inventory.some((item) => item.supplierId === supplier.id && item.name.toLowerCase().includes(query));
    return supplierQuery.includes(query) || itemMatch;
  });
}

function filterInventory(query) {
  if (!query) return inventory;
  return inventory.filter((item) => {
    const supplier = suppliers.find((supplier) => supplier.id === item.supplierId);
    return [item.sku, item.name, supplier?.name]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });
}

function renderMetrics() {
  pendingOrdersCountEl.textContent = orders.filter((order) => order.status === 'Pending').length;
  lowStockCountEl.textContent = inventory.filter((item) => item.stock < item.reorder).length;
  bestSupplierEl.textContent = currentBestSupplier();
  reorderValueEl.textContent = formatCurrency(totalReorderValue());
}

function renderFinance() {
  availableCreditEl.textContent = formatCurrency(financing.availableLimit);
  creditTermsEl.textContent = `${financing.partner} � ${financing.term} term � ${financing.rate}`;
  creditUsedEl.textContent = `Used: ${formatCurrency(financing.used)}`;
  financeTipEl.textContent = financing.tip;
}

function populateSupplierSelect() {
  supplierSelect.innerHTML = suppliers
    .map((supplier) => `<option value="${supplier.id}">${supplier.name}</option>`)
    .join('');
}

function renderSuppliers() {
  const query = getFilterTerm();
  const supplierData = filterSuppliers(query);

  supplierListEl.innerHTML = supplierData.length
    ? supplierData
        .map((supplier) => {
          const matchCount = inventory.filter((item) => item.supplierId === supplier.id).length;
          return `
          <article class="card">
            <h3>${supplier.name}</h3>
            <p>${supplier.offer}</p>
            <p><strong>Rating:</strong> ${supplier.rating} � <strong>Lead:</strong> ${supplier.leadTime}</p>
            <p><span class="badge badge-value">${Math.round((1 - supplier.priceFactor) * 100)}% savings</span> � ${matchCount} stocked items</p>
            <button class="secondary-btn" data-supplier="${supplier.id}">Order from supplier</button>
          </article>
        `;
        })
        .join('')
    : `<article class="card"><h3>No suppliers found</h3><p>Try a different search term or register a new supplier partner.</p></article>`;

  supplierListEl.querySelectorAll('button[data-supplier]').forEach((button) => {
    button.addEventListener('click', () => {
      const supplierId = Number(button.dataset.supplier);
      openOrderModal(supplierId);
    });
  });
}

function renderInventory() {
  const query = getFilterTerm();
  const inventoryData = filterInventory(query);

  inventoryListEl.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>Item</th>
          <th>Stock</th>
          <th>Reorder</th>
          <th>Supplier</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${inventoryData
          .map((item) => {
            const supplier = suppliers.find((s) => s.id === item.supplierId);
            return `
            <tr>
              <td>${item.sku}</td>
              <td>${item.name}</td>
              <td>${item.stock}</td>
              <td>${item.reorder}</td>
              <td>${supplier?.name || 'Unknown'}</td>
              <td><button class="secondary-btn" data-item="${item.sku}">Reorder</button></td>
            </tr>
          `;
          })
          .join('')}
      </tbody>
    </table>
  `;

  inventoryListEl.querySelectorAll('button[data-item]').forEach((button) => {
    button.addEventListener('click', () => {
      openOrderModal(null, button.dataset.item);
    });
  });
}

function renderOrderHistory() {
  orderHistoryEl.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Order</th>
          <th>Supplier</th>
          <th>Qty</th>
          <th>Status</th>
          <th>ETA</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${orders
          .map((order) => {
            const statusLabel = order.status === 'Pending' ? 'status-pending' : 'status-confirmed';
            const actionButton = order.status === 'Pending' ? `<button class="secondary-btn order-action-btn" data-order="${order.id}">Approve</button>` : `�`;
            return `
            <tr>
              <td>${order.item}</td>
              <td>${order.supplier}</td>
              <td>${order.qty}</td>
              <td><span class="status-pill ${statusLabel}">${order.status}</span></td>
              <td>${order.eta}</td>
              <td>${actionButton}</td>
            </tr>
          `;
          })
          .join('')}
      </tbody>
    </table>
  `;

  document.querySelectorAll('.order-action-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const orderId = Number(button.dataset.order);
      approveOrder(orderId);
    });
  });
}

function openOrderModal(preselectSupplierId = null, preselectItemSku = null) {
  populateSupplierSelect();
  itemSelect.innerHTML = inventory
    .map((item) => `<option value="${item.sku}">${item.name}</option>`)
    .join('');

  if (preselectSupplierId) {
    supplierSelect.value = preselectSupplierId;
  }
  if (preselectItemSku) {
    itemSelect.value = preselectItemSku;
  }

  orderModal.classList.remove('hidden');
}

function closeOrderModal() {
  orderModal.classList.add('hidden');
}

function openSupplierModal() {
  supplierModal.classList.remove('hidden');
  newSupplierName.value = '';
  newSupplierRating.value = '4.5';
  newSupplierLead.value = '2-4 days';
  newSupplierOffer.value = 'New partner pricing available';
}

function closeSupplierModal() {
  supplierModal.classList.add('hidden');
}

function submitOrder() {
  const supplierId = Number(supplierSelect.value);
  const itemSku = itemSelect.value;
  const qty = Math.max(Number(qtyInput.value) || 1, 1);
  const supplier = suppliers.find((supplier) => supplier.id === supplierId);
  const item = inventory.find((entry) => entry.sku === itemSku);
  const newOrder = {
    id: Math.floor(Math.random() * 900 + 100),
    item: item?.name || 'Unknown',
    qty,
    supplier: supplier?.name || 'Unknown',
    status: 'Pending',
    eta: `${deliverySelect.value} days`,
  };

  orders = [newOrder, ...orders];

  if (item) {
    item.stock = Math.max(0, item.stock - qty);
  }

  renderMetrics();
  renderInventory();
  renderOrderHistory();
  closeOrderModal();
}

function submitSupplier() {
  const name = newSupplierName.value.trim();
  const rating = Math.min(Math.max(Number(newSupplierRating.value) || 4.2, 1), 5);
  const leadTime = newSupplierLead.value.trim() || '3 days';
  const offer = newSupplierOffer.value.trim() || 'Partner pricing available';

  if (!name) {
    alert('Please enter a supplier name.');
    return;
  }

  suppliers.push({
    id: Date.now(),
    name,
    rating,
    priceFactor: 0.94,
    leadTime,
    offer,
  });

  renderSuppliers();
  populateSupplierSelect();
  closeSupplierModal();
}

function approveOrder(orderId) {
  orders = orders.map((order) => {
    if (order.id === orderId) {
      return { ...order, status: 'Confirmed' };
    }
    return order;
  });

  renderMetrics();
  renderOrderHistory();
}

function applySearch() {
  renderSuppliers();
  renderInventory();
}

function scrollToElement(element) {
  window.scrollTo({ top: element.offsetTop - 20, behavior: 'smooth' });
}

newOrderBtn.addEventListener('click', () => openOrderModal());
submitOrderBtn.addEventListener('click', submitOrder);
cancelOrderBtn.addEventListener('click', closeOrderModal);
exploreSuppliersBtn.addEventListener('click', () => scrollToElement(supplierListEl));
viewInventoryBtn.addEventListener('click', () => scrollToElement(inventoryListEl));
searchInput.addEventListener('input', applySearch);
registerSupplierBtn.addEventListener('click', openSupplierModal);
submitSupplierBtn.addEventListener('click', submitSupplier);
cancelSupplierBtn.addEventListener('click', closeSupplierModal);
viewCreditBtn.addEventListener('click', () => alert(`Credit partner: ${financing.partner}\nTerm: ${financing.term}\nRate: ${financing.rate}\nAvailable: ${formatCurrency(financing.availableLimit - financing.used)}`));

renderMetrics();
renderFinance();
populateSupplierSelect();
renderSuppliers();
renderInventory();
renderOrderHistory();
