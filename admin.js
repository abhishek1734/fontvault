// =============================================================
//  FONTVAULT — admin.js (Client-side Supabase Font CMS Dashboard)
// =============================================================

window.onerror = function(message, source, lineno, colno, error) {
  alert("Startup Error: " + message + " at " + source + ":" + lineno);
  return false;
};

// --- CONFIG & STATE ---
const ALLOWED_ADMIN_EMAILS = ['admin@fontvault.com', 'abhishek7255384@gmail.com'];
const FONT_BUCKET = 'font-files';
const AVAILABLE_TAGS = ['Modern', 'Luxury', 'Editorial', 'Minimal', 'Playful', 'Corporate', 'Elegant', 'Bold', 'Vintage'];

let supabase = null;
let currentSession = null;
let activeTab = 'overview';
let selectedUploadFile = null;
let allFontsList = [];
let editTagsList = [];
let uploadTagsList = [];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Supabase Client
  if (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
    supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  } else {
    alert('Supabase credentials missing! Make sure config.js is configured.');
    return;
  }

  // Setup UI elements
  initTheme();
  setupEventListeners();
  checkAuth();
});

// --- THEME ---
function initTheme() {
  const savedDark = localStorage.getItem('fontvault-dark') === '1';
  document.documentElement.classList.toggle('dark', savedDark);

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('fontvault-dark', isDark ? '1' : '0');
  });
}

// --- AUTHENTICATION ---
async function checkAuth() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      showAuthView();
    } else {
      const email = session.user.email?.toLowerCase();
      if (!ALLOWED_ADMIN_EMAILS.includes(email)) {
        await supabase.auth.signOut();
        showAuthError('You are not authorized to access this admin panel.');
        showAuthView();
      } else {
        currentSession = session;
        showDashboardView(session.user);
      }
    }
  } catch (err) {
    console.error('Auth check failed, showing login:', err);
    showAuthView();
  }
}

function showAuthView() {
  document.getElementById('auth-view').classList.remove('hidden');
  document.getElementById('dashboard-view').classList.add('hidden');
}

function showDashboardView(user) {
  document.getElementById('auth-view').classList.add('hidden');
  document.getElementById('dashboard-view').classList.remove('hidden');
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('user-avatar').textContent = user.email[0].toUpperCase();
  
  lucide.createIcons();
  switchTab('overview');
}

function showAuthError(message) {
  const errBox = document.getElementById('login-error');
  errBox.textContent = message;
  errBox.classList.remove('hidden');
}

// --- NAVIGATION & TABS ---
function switchTab(tabId) {
  activeTab = tabId;
  
  // Update nav buttons style
  ['overview', 'fonts', 'upload', 'analytics'].forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    const view = document.getElementById(`view-${t}`);
    
    if (t === tabId) {
      btn.className = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-black dark:bg-white text-white dark:text-black transition-all';
      view.classList.remove('hidden');
    } else {
      btn.className = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white';
      view.classList.add('hidden');
    }
  });

  lucide.createIcons();

  // Load view-specific data
  if (tabId === 'overview' || tabId === 'fonts' || tabId === 'analytics') {
    loadFontsData();
  } else if (tabId === 'upload') {
    resetUploadForm();
  }
}

// --- GLOBAL LOGIN HANDLER ---
window.handleLogin = async function(e) {
  if (e) e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  const submitBtn = document.getElementById('login-submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Signing in...';
  
  try {
    if (!ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase())) {
      showAuthError('You are not authorized to access this admin panel.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Sign In';
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      showAuthError(error.message);
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Sign In';
    } else {
      currentSession = data.session;
      showDashboardView(data.user);
    }
  } catch (err) {
    console.error('Login submit crash:', err);
    showAuthError('Error: ' + err.message);
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Sign In';
  }
};

// --- EVENT LISTENERS ---
function setupEventListeners() {

  // Logout Button
  document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    currentSession = null;
    showAuthView();
  });

  // Upload: drag and drop
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('font-file-input');

  dropzone.addEventListener('click', () => fileInput.click());
  
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('border-black', 'bg-neutral-100', 'dark:bg-neutral-900/50');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-black', 'bg-neutral-100', 'dark:bg-neutral-900/50');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-black', 'bg-neutral-100', 'dark:bg-neutral-900/50');
    const file = e.dataTransfer.files[0];
    if (file) handleSelectedFile(file);
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleSelectedFile(file);
  });

  document.getElementById('remove-file-btn').addEventListener('click', () => {
    selectedUploadFile = null;
    document.getElementById('selected-file-banner').classList.add('hidden');
    document.getElementById('dropzone').classList.remove('hidden');
    fileInput.value = '';
  });

  // Auto slug generation
  document.getElementById('up-name').addEventListener('input', (e) => {
    const name = e.target.value;
    document.getElementById('up-slug').value = slugify(name);
  });

  // Upload Form Submit
  document.getElementById('upload-form').addEventListener('submit', handleUploadSubmit);

  // Search & Filter listeners
  document.getElementById('font-search').addEventListener('input', renderLibraryFontsTable);
  document.getElementById('font-filter-category').addEventListener('change', renderLibraryFontsTable);

  // Modal actions
  document.getElementById('close-edit-modal-btn').addEventListener('click', () => closeEditModal());
  document.getElementById('cancel-edit-btn').addEventListener('click', () => closeEditModal());
  document.getElementById('edit-form').addEventListener('submit', handleEditSubmit);

  document.getElementById('cancel-delete-btn').addEventListener('click', () => closeDeleteModal());
  document.getElementById('confirm-delete-btn').addEventListener('click', confirmDeleteFont);
}

// --- DATA FETCHING & LISTING ---
async function loadFontsData() {
  const { data, error } = await supabase
    .from('fonts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching fonts:', error.message);
    return;
  }

  allFontsList = data || [];
  updateDashboardStats();
  
  if (activeTab === 'overview') {
    renderRecentFontsTable();
  } else if (activeTab === 'fonts') {
    renderLibraryFontsTable();
  } else if (activeTab === 'analytics') {
    renderAnalyticsView();
  }
}

function updateDashboardStats() {
  document.getElementById('stat-total-fonts').textContent = allFontsList.length;
  
  const categories = new Set(allFontsList.map(f => f.category).filter(Boolean));
  document.getElementById('stat-categories').textContent = categories.size;

  const recentCount = allFontsList.filter(f => {
    const addedDate = new Date(f.created_at);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return addedDate >= oneWeekAgo;
  }).length;
  document.getElementById('stat-recent').textContent = recentCount;

  // Calculate storage size
  let totalKb = 0;
  allFontsList.forEach(f => {
    if (f.file_size) {
      const match = f.file_size.match(/(\d+)\s*KB/i);
      if (match) totalKb += parseInt(match[1]);
    }
  });
  document.getElementById('stat-storage').textContent = totalKb >= 1024 
    ? (totalKb / 1024).toFixed(1) + ' MB' 
    : totalKb + ' KB';
}

function renderRecentFontsTable() {
  const tbody = document.getElementById('recent-fonts-tbody');
  tbody.innerHTML = '';
  
  const recent = allFontsList.slice(0, 5);
  
  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-xs text-neutral-400">No fonts uploaded yet.</td></tr>`;
    return;
  }

  recent.forEach(font => {
    const row = document.createElement('tr');
    row.className = 'border-b border-neutral-50 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-850/50 transition-colors';
    row.innerHTML = `
      <td class="px-6 py-4 font-semibold text-neutral-900 dark:text-neutral-100">${font.name}</td>
      <td class="px-6 py-4"><span class="text-xs px-2.5 py-1 bg-neutral-100 dark:bg-neutral-850 rounded-full font-medium">${font.category}</span></td>
      <td class="px-6 py-4 text-neutral-500 dark:text-neutral-400">${font.designer || '—'}</td>
      <td class="px-6 py-4 text-neutral-400 text-xs">${new Date(font.created_at).toLocaleDateString()}</td>
      <td class="px-6 py-4 text-right">
        <button onclick="openEditModal('${font.id}')" class="text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white underline mr-4">Edit</button>
        <button onclick="openDeleteModal('${font.id}')" class="text-xs font-semibold text-red-500 hover:text-red-700 underline">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function renderLibraryFontsTable() {
  const tbody = document.getElementById('library-fonts-tbody');
  tbody.innerHTML = '';
  
  const searchVal = document.getElementById('font-search').value.toLowerCase();
  const categoryVal = document.getElementById('font-filter-category').value;
  
  const filtered = allFontsList.filter(font => {
    const matchesSearch = font.name.toLowerCase().includes(searchVal) || 
                          (font.designer && font.designer.toLowerCase().includes(searchVal)) ||
                          (font.foundry && font.foundry.toLowerCase().includes(searchVal));
    const matchesCategory = !categoryVal || font.category === categoryVal;
    return matchesSearch && matchesCategory;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-xs text-neutral-400">No matching fonts found.</td></tr>`;
    return;
  }

  filtered.forEach(font => {
    const row = document.createElement('tr');
    row.className = 'border-b border-neutral-50 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-850/50 transition-colors';
    row.innerHTML = `
      <td class="px-6 py-4">
        <p class="font-bold text-neutral-900 dark:text-neutral-100">${font.name}</p>
        <p class="text-[10px] text-neutral-400 font-mono mt-0.5">${font.slug}</p>
      </td>
      <td class="px-6 py-4"><span class="text-xs px-2.5 py-1 bg-neutral-100 dark:bg-neutral-850 rounded-full font-medium">${font.category}</span></td>
      <td class="px-6 py-4 text-xs text-neutral-500 dark:text-neutral-400">
        <p class="font-medium">${font.designer || '—'}</p>
        <p class="text-[10px] opacity-75">${font.foundry || ''}</p>
      </td>
      <td class="px-6 py-4 text-xs">
        <span class="px-2 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded font-mono">${font.format || '—'}</span>
        ${font.is_variable ? '<span class="ml-1 text-[9px] bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded px-1.5 py-0.5 font-bold uppercase tracking-wider">Var</span>' : ''}
      </td>
      <td class="px-6 py-4"><span class="text-xs font-semibold px-2 py-0.5 rounded ${font.is_free ? 'bg-green-50 dark:bg-green-950/20 text-success' : 'bg-orange-50 dark:bg-orange-950/20 text-orange-500'}">${font.license_type || 'Free'}</span></td>
      <td class="px-6 py-4 text-right">
        <button onclick="openEditModal('${font.id}')" class="text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white underline mr-4">Edit</button>
        <button onclick="openDeleteModal('${font.id}')" class="text-xs font-semibold text-red-500 hover:text-red-700 underline">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// --- FILE DRAG & DROP HANDLER ---
function handleSelectedFile(file) {
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!['.ttf', '.otf', '.woff', '.woff2'].includes(ext)) {
    alert('Invalid font file extension! Please upload a valid .ttf, .otf, .woff, or .woff2 file.');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('File size exceeds 10MB limit.');
    return;
  }

  selectedUploadFile = file;
  document.getElementById('selected-file-name').textContent = file.name;
  document.getElementById('selected-file-size').textContent = (file.size / 1024).toFixed(1) + ' KB';
  
  document.getElementById('dropzone').classList.add('hidden');
  document.getElementById('selected-file-banner').classList.remove('hidden');
}

// --- UPLOAD PROCESS ---
async function handleUploadSubmit(e) {
  e.preventDefault();
  if (!selectedUploadFile) {
    alert('Please select a font file first.');
    return;
  }

  const submitBtn = document.getElementById('upload-submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Uploading to Cloud Storage...';

  const name = document.getElementById('up-name').value;
  const slug = document.getElementById('up-slug').value;
  const designer = document.getElementById('up-designer').value;
  const foundry = document.getElementById('up-foundry').value;
  const description = document.getElementById('up-description').value;
  const category = document.getElementById('up-category').value;
  const license = document.getElementById('up-license').value;
  const isVariable = document.getElementById('up-is-variable').checked;
  const isFree = document.getElementById('up-is-free').checked;

  const ext = '.' + selectedUploadFile.name.split('.').pop().toLowerCase();
  const format = ext === '.ttf' ? 'truetype' : (ext === '.otf' ? 'opentype' : ext.replace('.', ''));
  const storagePath = `${category.toLowerCase().replace(' ', '-')}/${slug}${ext}`;

  try {
    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(FONT_BUCKET)
      .upload(storagePath, selectedUploadFile, {
        cacheControl: '3600',
        upsert: true,
        contentType: `font/${format}`
      });

    if (uploadError) throw uploadError;

    // 2. Fetch public URL
    const { data: urlData } = supabase.storage.from(FONT_BUCKET).getPublicUrl(storagePath);
    const fileUrl = urlData.publicUrl;

    submitBtn.innerHTML = 'Inserting Database Record...';

    // 3. Write metadata to database
    const { error: dbError } = await supabase.from('fonts').insert({
      name: name,
      slug: slug,
      designer: designer || null,
      foundry: foundry || null,
      description: description || null,
      category: category,
      tags: uploadTagsList,
      license_type: license,
      is_free: isFree,
      is_variable: isVariable,
      file_url: fileUrl,
      css_family: name,
      format: format,
      file_size: (selectedUploadFile.size / 1024).toFixed(1) + ' KB'
    });

    if (dbError) throw dbError;

    alert('Font uploaded and registered successfully!');
    switchTab('overview');
  } catch (err) {
    console.error('Upload Error:', err);
    alert('Upload failed: ' + err.message);
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Upload & Publish Font';
  }
}

function resetUploadForm() {
  document.getElementById('upload-form').reset();
  selectedUploadFile = null;
  document.getElementById('selected-file-banner').classList.add('hidden');
  document.getElementById('dropzone').classList.remove('hidden');
  
  // Render Tag picker
  uploadTagsList = [];
  const tagsContainer = document.getElementById('tags-picker');
  tagsContainer.innerHTML = '';
  AVAILABLE_TAGS.forEach(tag => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-all';
    btn.textContent = tag;
    btn.onclick = () => {
      if (uploadTagsList.includes(tag)) {
        uploadTagsList = uploadTagsList.filter(t => t !== tag);
        btn.className = 'px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-all';
      } else {
        uploadTagsList.push(tag);
        btn.className = 'px-3 py-1.5 rounded-full text-xs font-semibold bg-black text-white transition-all';
      }
    };
    tagsContainer.appendChild(btn);
  });

  const submitBtn = document.getElementById('upload-submit-btn');
  submitBtn.disabled = false;
  submitBtn.innerHTML = 'Upload & Publish Font';
}

// --- EDIT SYSTEM ---
function openEditModal(fontId) {
  const font = allFontsList.find(f => f.id === fontId);
  if (!font) return;

  document.getElementById('edit-id').value = font.id;
  document.getElementById('edit-name').value = font.name;
  document.getElementById('edit-designer').value = font.designer || '';
  document.getElementById('edit-foundry').value = font.foundry || '';
  document.getElementById('edit-description').value = font.description || '';
  document.getElementById('edit-category').value = font.category || 'Serif';
  document.getElementById('edit-license').value = font.license_type || 'Free';
  document.getElementById('edit-is-variable').checked = font.is_variable || false;
  document.getElementById('edit-is-free').checked = font.is_free || false;

  // Render edit tags picker
  editTagsList = font.tags || [];
  const tagsContainer = document.getElementById('edit-tags-picker');
  tagsContainer.innerHTML = '';
  
  AVAILABLE_TAGS.forEach(tag => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const hasTag = editTagsList.includes(tag);
    btn.className = `px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
      hasTag ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
    }`;
    btn.textContent = tag;
    btn.onclick = () => {
      if (editTagsList.includes(tag)) {
        editTagsList = editTagsList.filter(t => t !== tag);
        btn.className = 'px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-all';
      } else {
        editTagsList.push(tag);
        btn.className = 'px-3 py-1.5 rounded-full text-xs font-semibold bg-black text-white transition-all';
      }
    };
    tagsContainer.appendChild(btn);
  });

  document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.add('hidden');
}

async function handleEditSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const name = document.getElementById('edit-name').value;
  const designer = document.getElementById('edit-designer').value;
  const foundry = document.getElementById('edit-foundry').value;
  const description = document.getElementById('edit-description').value;
  const category = document.getElementById('edit-category').value;
  const license = document.getElementById('edit-license').value;
  const isVariable = document.getElementById('edit-is-variable').checked;
  const isFree = document.getElementById('edit-is-free').checked;

  const saveBtn = document.getElementById('save-edit-btn');
  saveBtn.disabled = true;
  saveBtn.innerHTML = 'Saving...';

  try {
    const { error } = await supabase
      .from('fonts')
      .update({
        name: name,
        designer: designer || null,
        foundry: foundry || null,
        description: description || null,
        category: category,
        tags: editTagsList,
        license_type: license,
        is_free: isFree,
        is_variable: isVariable,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;

    toastSuccess('Changes saved successfully!');
    closeEditModal();
    loadFontsData();
  } catch (err) {
    alert('Failed to update: ' + err.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = 'Save Changes';
  }
}

// --- DELETE PROCESS ---
let deleteTargetId = null;
function openDeleteModal(fontId) {
  const font = allFontsList.find(f => f.id === fontId);
  if (!font) return;

  deleteTargetId = fontId;
  document.getElementById('delete-font-name').textContent = font.name;
  document.getElementById('delete-modal').classList.remove('hidden');
}

function closeDeleteModal() {
  document.getElementById('delete-modal').classList.add('hidden');
  deleteTargetId = null;
}

async function confirmDeleteFont() {
  if (!deleteTargetId) return;

  const font = allFontsList.find(f => f.id === deleteTargetId);
  if (!font) return;

  const confirmBtn = document.getElementById('confirm-delete-btn');
  confirmBtn.disabled = true;
  confirmBtn.innerHTML = 'Deleting...';

  try {
    // 1. Delete Storage File if exists
    if (font.file_url) {
      // Find path matching storage structure
      const match = font.file_url.match(/font-files\/(.+)$/);
      if (match) {
        await supabase.storage.from(FONT_BUCKET).remove([match[1]]);
      }
    }

    // 2. Delete database row
    const { error } = await supabase
      .from('fonts')
      .delete()
      .eq('id', deleteTargetId);

    if (error) throw error;

    toastSuccess('Font deleted successfully');
    closeDeleteModal();
    loadFontsData();
  } catch (err) {
    alert('Deletion failed: ' + err.message);
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = 'Delete Permanently';
  }
}

// --- ANALYTICS TAB ---
function renderAnalyticsView() {
  const barsContainer = document.getElementById('analytics-categories-bar');
  barsContainer.innerHTML = '';

  const catTally = {};
  allFontsList.forEach(f => {
    const c = f.category || 'Uncategorized';
    catTally[c] = (catTally[c] || 0) + 1;
  });

  const entries = Object.entries(catTally).sort((a,b) => b[1] - a[1]);
  const maxCount = entries[0]?.[1] || 1;

  entries.forEach(([cat, count]) => {
    const pct = Math.round((count / maxCount) * 100);
    const row = document.createElement('div');
    row.innerHTML = `
      <div class="flex justify-between text-xs font-semibold mb-1">
        <span class="text-neutral-700 dark:text-neutral-300">${cat}</span>
        <span class="text-neutral-400">${count} font${count !== 1 ? 's' : ''}</span>
      </div>
      <div class="h-2 bg-neutral-100 dark:bg-neutral-850 rounded-full overflow-hidden">
        <div class="h-full bg-black dark:bg-white rounded-full" style="width: ${pct}%"></div>
      </div>
    `;
    barsContainer.appendChild(row);
  });

  if (entries.length === 0) {
    barsContainer.innerHTML = `<p class="text-xs text-neutral-400 text-center py-6">No categorised font files uploaded.</p>`;
  }

  // Set average size
  let totalKb = 0;
  allFontsList.forEach(f => {
    if (f.file_size) {
      const match = f.file_size.match(/(\d+)\s*KB/i);
      if (match) totalKb += parseInt(match[1]);
    }
  });
  const avgKb = allFontsList.length ? Math.round(totalKb / allFontsList.length) : 0;
  document.getElementById('analytics-avg-size').textContent = avgKb + ' KB';
}

// --- UTILS ---
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function toastSuccess(message) {
  alert(message); // simple notification fallback
}
