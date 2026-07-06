// =============================================================
//  FONTVAULT — admin.js (Client-side Supabase Font CMS Dashboard)
// =============================================================

window.onerror = function(message, source, lineno, colno, error) {
  alert("Startup Error: " + message + " at " + source + ":" + lineno);
  return false;
};

// --- CONFIG & STATE ---
const ALLOWED_ADMIN_EMAILS = ['admin@fontvault.com', 'abhishek7255384@gmail.com'];
const FONT_BUCKET = 'fonts';
const AVAILABLE_TAGS = ['Modern', 'Luxury', 'Editorial', 'Minimal', 'Playful', 'Corporate', 'Elegant', 'Bold', 'Vintage'];

// Fallback Supabase credentials in case config.js is ignored
window.SUPABASE_URL = window.SUPABASE_URL || "https://alvarlzjtdmkvbxehppt.supabase.co";
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsdmFybHpqdGRta3ZieGVocHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjA3MDIsImV4cCI6MjA5ODI5NjcwMn0.kopGopXghwNdHM6cawDhpjrYui0MzqpAROsYHHMZEeE";

let supabaseClient = null;
let currentSession = null;
let activeTab = 'overview';
let selectedUploadFile = null;
let allFontsList = [];
let editTagsList = [];
let uploadTagsList = [];

// --- INITIALIZATION ---
function init() {
  try {
    // Initialize Supabase Client
    if (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
      supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    } else {
      console.warn('Supabase global not found or config parameters missing');
    }

    initTheme();
    setupEventListeners();
    checkAuth();
  } catch (err) {
    alert('Init failed: ' + err.message);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already ready
  init();
}

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
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error || !session) {
      showAuthView();
    } else {
      const email = session.user.email?.toLowerCase();
      if (!ALLOWED_ADMIN_EMAILS.includes(email)) {
        await supabaseClient.auth.signOut();
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
  ['overview', 'fonts', 'upload', 'analytics', 'performance'].forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    const view = document.getElementById(`view-${t}`);
    
    if (!btn || !view) return;

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
  } else if (tabId === 'performance') {
    loadPerformanceTab();
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
    if (!supabaseClient) {
      throw new Error('Supabase client failed to initialize. Please check your config.js and network connectivity.');
    }

    if (!ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase())) {
      showAuthError('You are not authorized to access this admin panel.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Sign In';
      return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    
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
    await supabaseClient.auth.signOut();
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
  const { data, error } = await supabaseClient
    .from('custom_fonts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching fonts:', error.message);
    return;
  }

  // Map custom_fonts database schema to dashboard UI schema
  allFontsList = (data || []).map(font => ({
    ...font,
    category: font.style || 'Serif',
    slug: font.css_family || font.id,
    license_type: 'Free',
    is_free: true,
    is_variable: false,
    file_url: font.public_url
  }));
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
    const { error: uploadError } = await supabaseClient.storage
      .from(FONT_BUCKET)
      .upload(storagePath, selectedUploadFile, {
        cacheControl: '3600',
        upsert: true,
        contentType: `font/${format}`
      });

    if (uploadError) throw uploadError;

    // 2. Fetch public URL
    const { data: urlData } = supabaseClient.storage.from(FONT_BUCKET).getPublicUrl(storagePath);
    const fileUrl = urlData.publicUrl;

    submitBtn.innerHTML = 'Inserting Database Record...';

    // 3. Write metadata to custom_fonts database table
    const { error: dbError } = await supabaseClient.from('custom_fonts').insert({
      id: `custom-upload-${Date.now()}`,
      name: name,
      file_name: selectedUploadFile.name,
      storage_path: storagePath,
      public_url: fileUrl,
      css_family: name.replace(/[^a-zA-Z0-9]/g, '').trim(),
      style: category,
      foundry: foundry || 'Self-Uploaded File',
      designer: designer || 'Self-Uploaded File',
      availability: 'Custom',
      styles_count: 1,
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
    const { error } = await supabaseClient
      .from('custom_fonts')
      .update({
        name: name,
        designer: designer || 'Self-Uploaded File',
        foundry: foundry || 'Self-Uploaded File',
        style: category
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
    if (font.public_url) {
      // Find path matching storage structure (any bucket)
      const match = font.public_url.match(/\/object\/public\/[^\/]+\/(.+)$/);
      if (match) {
        await supabaseClient.storage.from(FONT_BUCKET).remove([match[1]]);
      }
    }

    // 2. Delete database row
    const { error } = await supabaseClient
      .from('custom_fonts')
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


// ================================================================
// VERCEL ANALYTICS & PERFORMANCE DASHBOARD
// ================================================================

// --- Credential management (localStorage) ---
const VERCEL_CRED_KEY = 'fv_vercel_creds';

function getVercelCreds() {
  try {
    return JSON.parse(localStorage.getItem(VERCEL_CRED_KEY) || 'null');
  } catch { return null; }
}

window.saveVercelCredentials = function() {
  const token   = document.getElementById('perf-token-input').value.trim();
  const project = document.getElementById('perf-project-input').value.trim();
  const team    = document.getElementById('perf-team-input').value.trim();

  if (!token || !project) {
    alert('Please enter both Vercel Access Token and Project ID.');
    return;
  }

  localStorage.setItem(VERCEL_CRED_KEY, JSON.stringify({ token, project, team }));
  loadPerformanceTab();
};

window.clearVercelCredentials = function() {
  localStorage.removeItem(VERCEL_CRED_KEY);
  // Clear the input fields so old values don't persist
  const tokenInput   = document.getElementById('perf-token-input');
  const projectInput = document.getElementById('perf-project-input');
  const teamInput    = document.getElementById('perf-team-input');
  if (tokenInput)   tokenInput.value   = '';
  if (projectInput) projectInput.value = '';
  if (teamInput)    teamInput.value    = '';
  loadPerformanceTab();
};

window.showVercelCredentialsBanner = function() {
  const banner = document.getElementById('perf-setup-banner');
  const changeBtn = document.getElementById('perf-change-creds-btn');
  if (banner) banner.classList.remove('hidden');
  if (changeBtn) changeBtn.classList.add('hidden');
  // Pre-fill with existing saved values so user can correct them
  const creds = getVercelCreds();
  if (creds) {
    const tokenInput   = document.getElementById('perf-token-input');
    const projectInput = document.getElementById('perf-project-input');
    const teamInput    = document.getElementById('perf-team-input');
    if (tokenInput)   tokenInput.value   = creds.token   || '';
    if (projectInput) projectInput.value = creds.project || '';
    if (teamInput)    teamInput.value    = creds.team    || '';
  }
  lucide.createIcons();
};

// --- Date range helpers ---
function getDateRange(range) {
  const now  = new Date();
  const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
  const from = new Date(now - days * 864e5);
  return {
    from: from.toISOString().split('T')[0],
    to:   now.toISOString().split('T')[0],
  };
}

// --- Core Vercel API fetch wrapper ---
async function vercelFetch(path, creds) {
  const teamParam = creds.team ? `&teamId=${creds.team}` : '';
  const url = `https://api.vercel.com${path}${path.includes('?') ? '&' : '?'}projectId=${creds.project}${teamParam}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${creds.token}` },
  });
  if (!res.ok) throw new Error(`Vercel API error ${res.status}: ${await res.text()}`);
  return res.json();
}

// --- Main load function ---
window.loadPerformanceTab = async function() {
  const creds = getVercelCreds();
  const banner = document.getElementById('perf-setup-banner');

  // Spin refresh icon
  const icon = document.getElementById('perf-refresh-icon');
  if (icon) icon.classList.add('animate-spin');

  if (!creds) {
    // Show setup banner, hide Change Credentials button
    banner.classList.remove('hidden');
    const changeBtn = document.getElementById('perf-change-creds-btn');
    if (changeBtn) changeBtn.classList.add('hidden');
    setKPILoading();
    if (icon) icon.classList.remove('animate-spin');
    return;
  }

  // Credentials exist — hide banner, show Change Credentials button
  banner.classList.add('hidden');
  const changeBtn = document.getElementById('perf-change-creds-btn');
  if (changeBtn) changeBtn.classList.remove('hidden');
  document.getElementById('perf-token-input').value  = creds.token;
  document.getElementById('perf-project-input').value = creds.project;
  document.getElementById('perf-team-input').value   = creds.team || '';

  // Update Speed Insights deep-links
  const siPath = creds.team
    ? `https://vercel.com/t/${creds.team}/${creds.project}/speed-insights`
    : `https://vercel.com/dashboard`;
  document.getElementById('speed-insights-link').href   = siPath;
  document.getElementById('speed-insights-link-2').href = siPath;

  const range = document.getElementById('perf-range')?.value || '30d';
  const { from, to } = getDateRange(range);
  // Vercel API uses 'since' and 'until' (ISO 8601 timestamps)
  const since = from + 'T00:00:00.000Z';
  const until = to   + 'T23:59:59.999Z';

  try {
    // Fire all requests in parallel
    // Allowed 'by' values: hour|day|week|month|year|country|deviceType|requestPath|browserName|osName|route|referrerHostname
    const [
      pageViewsRes,
      visitorsTimeRes,
      topPagesRes,
      topCountriesRes,
      devicesRes,
      browsersRes,
    ] = await Promise.allSettled([
      vercelFetch(`/v1/query/web-analytics/visits/count?since=${since}&until=${until}`, creds),
      vercelFetch(`/v1/query/web-analytics/visits/aggregate?by=day&since=${since}&until=${until}`, creds),
      vercelFetch(`/v1/query/web-analytics/visits/aggregate?by=requestPath&since=${since}&until=${until}&limit=10`, creds),
      vercelFetch(`/v1/query/web-analytics/visits/aggregate?by=country&since=${since}&until=${until}&limit=10`, creds),
      vercelFetch(`/v1/query/web-analytics/visits/aggregate?by=deviceType&since=${since}&until=${until}`, creds),
      vercelFetch(`/v1/query/web-analytics/visits/aggregate?by=browserName&since=${since}&until=${until}&limit=8`, creds),
    ]);

    // ─── KPI Cards ───
    if (pageViewsRes.status === 'fulfilled') {
      const d = pageViewsRes.value;
      // Vercel count API returns { data: { pageViews, sessions, visitors } }
      const views    = d?.data?.pageViews ?? d?.pageViews ?? d?.count ?? '—';
      const visitors = d?.data?.visitors  ?? d?.visitors  ?? d?.data?.sessions ?? '—';
      document.getElementById('kpi-pageviews').textContent      = formatNum(views);
      document.getElementById('kpi-pageviews-sub').textContent  = `Total page views · ${range}`;
      document.getElementById('kpi-visitors').textContent       = formatNum(visitors);
      document.getElementById('kpi-visitors-sub').textContent   = `Unique visitors · ${range}`;
    } else {
      setKPIError('kpi-pageviews', pageViewsRes.reason?.message);
      setKPIError('kpi-visitors',  pageViewsRes.reason?.message);
    }

    // ─── Visitors Over Time Chart ───
    if (visitorsTimeRes.status === 'fulfilled') {
      const rows = visitorsTimeRes.value?.data ?? [];
      renderBarChart(rows);
    } else {
      document.getElementById('visitors-chart').innerHTML =
        `<div class="w-full flex items-center justify-center h-full text-xs text-red-400">Chart error: ${visitorsTimeRes.reason?.message}</div>`;
    }

    // ─── Top Pages ───
    if (topPagesRes.status === 'fulfilled') {
      const rows = topPagesRes.value?.data ?? [];
      // Vercel returns { requestPath, visitors, pageViews } per row
      renderTopList('top-pages-list', rows, 'requestPath', r => r.visitors || r.pageViews || r.total || 0);
      if (rows.length > 0) {
        document.getElementById('kpi-top-page').textContent     = rows[0].requestPath || '/';
        document.getElementById('kpi-top-page-sub').textContent = `${formatNum(rows[0].visitors ?? rows[0].pageViews ?? 0)} visitors`;
      }
    } else {
      document.getElementById('top-pages-list').innerHTML = renderError(topPagesRes.reason?.message);
    }

    // ─── Top Countries ───
    if (topCountriesRes.status === 'fulfilled') {
      const rows = topCountriesRes.value?.data ?? [];
      renderTopList('top-countries-list', rows, 'country', r => r.visitors || r.total || 0);
      if (rows.length > 0) {
        const flag = countryFlag(rows[0].country);
        document.getElementById('kpi-top-country').textContent     = `${flag} ${rows[0].country || '—'}`;
        document.getElementById('kpi-top-country-sub').textContent = `${formatNum(rows[0].visitors ?? rows[0].total ?? 0)} visitors`;
      }
    } else {
      document.getElementById('top-countries-list').innerHTML = renderError(topCountriesRes.reason?.message);
    }

    // ─── Devices ───
    if (devicesRes.status === 'fulfilled') {
      renderTopList('device-breakdown-list', devicesRes.value?.data ?? [], 'deviceType', r => r.visitors || r.total || 0);
    } else {
      document.getElementById('device-breakdown-list').innerHTML = renderError(devicesRes.reason?.message);
    }

    // ─── Browsers ───
    if (browsersRes.status === 'fulfilled') {
      renderTopList('browser-breakdown-list', browsersRes.value?.data ?? [], 'browserName', r => r.visitors || r.total || 0);
    } else {
      document.getElementById('browser-breakdown-list').innerHTML = renderError(browsersRes.reason?.message);
    }

  } catch (err) {
    console.error('[Performance Tab] Fatal error:', err);
    banner.classList.remove('hidden');
    banner.querySelector('p').textContent = 'API error: ' + err.message;
  } finally {
    if (icon) icon.classList.remove('animate-spin');
    lucide.createIcons();
  }
};

// --- Render helpers ---

function setKPILoading() {
  ['kpi-pageviews','kpi-visitors','kpi-top-country','kpi-top-page'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '—';
  });
  ['kpi-pageviews-sub','kpi-visitors-sub','kpi-top-country-sub','kpi-top-page-sub'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = 'Connect Vercel to load data';
  });
  document.getElementById('visitors-chart').innerHTML =
    '<div class="w-full flex items-center justify-center h-full text-xs text-neutral-400">Connect Vercel to load chart</div>';
  ['top-pages-list','top-countries-list','device-breakdown-list','browser-breakdown-list'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<div class="text-xs text-neutral-400 text-center py-6">Connect Vercel to load data</div>';
  });
}

function setKPIError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = 'Err'; el.title = msg; }
}

function formatNum(n) {
  if (n === null || n === undefined || n === '—') return '—';
  const num = Number(n);
  if (isNaN(num)) return String(n);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000)     return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
}

function countryFlag(code) {
  if (!code || code.length !== 2) return '🌐';
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E0 + c.charCodeAt(0) - 65));
}

function renderError(msg) {
  return `<div class="text-xs text-red-400 text-center py-6">Error: ${msg || 'Unknown error'}</div>`;
}

function renderTopList(containerId, rows, labelKey, valueFn) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!rows || rows.length === 0) {
    el.innerHTML = '<div class="text-xs text-neutral-400 text-center py-6">No data for this period.</div>';
    return;
  }
  const max = Math.max(...rows.map(r => valueFn(r) || 0)) || 1;
  el.innerHTML = rows.map((r, i) => {
    const label = r[labelKey] || '(unknown)';
    const val   = valueFn(r) || 0;
    const pct   = Math.round((val / max) * 100);
    const flag  = labelKey === 'country' ? countryFlag(r.country) + ' ' : '';
    const icon  = labelKey === 'deviceType' ? getDeviceIcon(label) : '';
    return `
      <div class="flex items-center gap-3">
        <span class="text-[10px] font-semibold text-neutral-400 w-4 shrink-0">${i + 1}</span>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs font-medium truncate">${flag}${icon}${label}</span>
            <span class="text-xs font-semibold text-neutral-500 ml-2 shrink-0">${formatNum(val)}</span>
          </div>
          <div class="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div class="h-full bg-violet-500 rounded-full transition-all duration-700" style="width: ${pct}%"></div>
          </div>
        </div>
      </div>`;
  }).join('');
}

function getDeviceIcon(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('mobile'))  return '📱 ';
  if (t.includes('tablet'))  return '📟 ';
  if (t.includes('desktop')) return '🖥️ ';
  return '';
}

function renderBarChart(rows) {
  const chart  = document.getElementById('visitors-chart');
  const labels = document.getElementById('visitors-chart-labels');
  if (!chart) return;

  if (!rows || rows.length === 0) {
    chart.innerHTML = '<div class="w-full flex items-center justify-center h-full text-xs text-neutral-400">No data for this period.</div>';
    return;
  }

  const vals = rows.map(r => r.visitors || r.value || 0);
  const max  = Math.max(...vals) || 1;

  chart.innerHTML = rows.map((r, i) => {
    const h   = Math.max(4, Math.round((vals[i] / max) * 100));
    const tip = `${r.day || r.date || i}: ${vals[i]} visitors`;
    return `<div class="flex-1 flex flex-col justify-end group cursor-default" title="${tip}">
      <div class="w-full bg-violet-500 hover:bg-violet-400 transition-all rounded-t-sm"
           style="height: ${h}%; min-height: 4px; transition: height 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)"></div>
    </div>`;
  }).join('');

  // Sparse labels — show every Nth
  const step = Math.ceil(rows.length / 8);
  labels.innerHTML = rows.map((r, i) => {
    const d = r.day || r.date || '';
    const short = d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
    return `<span class="flex-1 text-center overflow-hidden">${i % step === 0 ? short : ''}</span>`;
  }).join('');
}
