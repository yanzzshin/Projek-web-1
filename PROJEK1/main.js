// Fungsi untuk menentukan tipe media berdasarkan ekstensi file
function getMediaType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
    return 'image';
  } else if (['mp4', 'webm', 'ogg', 'mov', 'mkv'].includes(ext)) {
    return 'video';
  } else {
    return 'unknown';
  }
}

// Daftar nama file media yang akan ditampilkan di galeri
// Untuk menambahkan file baru, cukup tambahkan nama filenya ke array ini
const mediaFilenames = [
  "ai hoshino.jpg",
  "ai-hoshino.jpg",
  "anime-hoshino-ai.jpg",
  "Download.mp4",
  "Hoshino-Ai.jpg",
  "kurumi-tokisaki.jpg",
  "mahiru-shiina.jpg",
  "Oshi no Ko - Hoshino AI.jpg",
  "pesona-waifu-anti-karbit.mp4"
];

// Membuat mediaList secara otomatis dari daftar nama file
const mediaList = mediaFilenames.map(filename => ({
  src: "media/" + filename,
  name: filename,
  type: getMediaType(filename)
}));

// Daftar nama file yang tersedia untuk diunduh
// Untuk menambahkan file baru, cukup tambahkan nama filenya ke array ini
const downloadFilenames = [
  "ai-hoshino.jpg",
  "pixelosvayu.zip",
  "mahiru-shiina.jpg",
  "(ERROR)vayurecovery.img",
];

// Membuat downloadFiles secara otomatis dari daftar nama file
const downloadFiles = downloadFilenames.map(filename => ({
  src: "media/" + filename,
  name: filename
}));

function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (!user || !pass) {
    document.getElementById('login-error').textContent = "Username dan password wajib diisi!";
    return;
  }
  document.getElementById('login-popup-user').textContent = `Username: ${user}`;
  document.getElementById('login-popup').style.display = "flex";
  // Simpan data sementara
  window._pendingLogin = { user, pass };
}

function logout() {
  document.getElementById('gallery-page').style.display = "none";
  document.getElementById('login-page').style.display = "";
  document.getElementById('username').value = "";
  document.getElementById('password').value = "";
  document.getElementById('nav-logout').style.display = "none";
  document.getElementById('navbar').style.display = "none";
  showPage('home');
}

function showPage(page) {
  // Hide all pages
  document.getElementById('home-page').style.display = "none";
  document.getElementById('gallery-page').style.display = "none";
  document.getElementById('download-page').style.display = "none";
  document.getElementById('info-page').style.display = "none";
  document.getElementById('settings-page').style.display = "none";
  // Remove active class from nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  // Show selected page
  if (page === 'home') {
    document.getElementById('home-page').style.display = "";
    document.querySelectorAll('.nav-btn')[0].classList.add('active');
  } else if (page === 'gallery') {
    document.getElementById('gallery-page').style.display = "";
    document.querySelectorAll('.nav-btn')[1].classList.add('active');
    renderGallery();
  } else if (page === 'download') {
    document.getElementById('download-page').style.display = "";
    document.querySelectorAll('.nav-btn')[2].classList.add('active');
    renderDownloadList();
  } else if (page === 'info') {
    document.getElementById('info-page').style.display = "";
    document.querySelectorAll('.nav-btn')[3].classList.add('active');
  } else if (page === 'settings') {
    document.getElementById('settings-page').style.display = "";
    document.querySelectorAll('.nav-btn')[4].classList.add('active');
  }
}

// Settings functions
document.getElementById('dark-mode-toggle').addEventListener('change', function() {
  if (this.checked) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});

document.getElementById('notifications-toggle').addEventListener('change', function() {
  // Implement notification toggle logic here
  console.log('Notifications toggle changed:', this.checked);
});

document.getElementById('language-select').addEventListener('change', function() {
  // Implement language change logic here
  console.log('Language changed to:', this.value);
});

let selectedMediaIdx = null;

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  const search = document.getElementById('gallery-search')?.value?.toLowerCase() || "";
  grid.innerHTML = "";
  mediaList
    .filter(media => media.name.toLowerCase().includes(search))
    .forEach((media, idx) => {
      const card = document.createElement('div');
      card.className = "media-card fade-in";
      card.onclick = () => {
        selectedMediaIdx = idx;
        highlightSelectedCard();
        openModal(media);
      };

      if (media.type === "image") {
        card.innerHTML = `
          <img src="${media.src}" alt="${media.name}" class="media-thumb" />
          <div class="media-title">${media.name}</div>
        `;
      } else if (media.type === "video") {
        card.innerHTML = `
          <video src="${media.src}" class="media-thumb" muted loop></video>
          <div class="media-title">${media.name}</div>
        `;
        card.querySelector('video').play();
      }
      grid.appendChild(card);
    });
  highlightSelectedCard();
}

function highlightSelectedCard() {
  const cards = document.querySelectorAll('.media-card');
  cards.forEach((card, idx) => {
    if (selectedMediaIdx === idx) card.classList.add('selected');
    else card.classList.remove('selected');
  });
}

function openModal(media) {
  const modal = document.getElementById('modal-backdrop');
  const content = document.getElementById('modal-content');
  // Modern glass floating window with close & navigation
  content.innerHTML = `
    <div class="modern-modal-window">
      <button class="modern-modal-close" onclick="closeModal()" title="Close">&times;</button>
      ${
        media.type === "image"
          ? `<img src="${media.src}" alt="${media.name}" class="modern-modal-media" />`
          : `<video src="${media.src}" class="modern-modal-media" controls autoplay></video>`
      }
      <div class="modern-modal-caption">${media.name}</div>
      <div class="modern-modal-nav">
        <button class="modern-modal-nav-btn" onclick="modalPrev()" title="Previous">&#8592;</button>
        <button class="modern-modal-nav-btn" onclick="modalNext()" title="Next">&#8594;</button>
      </div>
    </div>
  `;
  modal.style.display = "";

  // Hide nav if only 1 media
  const nav = content.querySelector('.modern-modal-nav');
  if (mediaList.length <= 1) nav.style.display = "none";
}

function closeModal() {
  document.getElementById('modal-backdrop').style.display = "none";
  document.getElementById('modal-content').innerHTML = "";
  selectedMediaIdx = null;
  highlightSelectedCard();
}

// Navigasi modal next/prev
function modalPrev() {
  if (selectedMediaIdx == null) return;
  let idx = selectedMediaIdx - 1;
  if (idx < 0) idx = mediaList.length - 1;
  selectedMediaIdx = idx;
  highlightSelectedCard();
  openModal(mediaList[selectedMediaIdx]);
}
function modalNext() {
  if (selectedMediaIdx == null) return;
  let idx = selectedMediaIdx + 1;
  if (idx >= mediaList.length) idx = 0;
  selectedMediaIdx = idx;
  highlightSelectedCard();
  openModal(mediaList[selectedMediaIdx]);
}

let pendingDownload = null;

function renderDownloadList() {
  const list = document.getElementById('download-list');
  const search = document.getElementById('download-search')?.value?.toLowerCase() || "";
  list.innerHTML = "";
  downloadFiles
    .filter(file => file.name.toLowerCase().includes(search))
    .forEach(file => {
      const item = document.createElement('div');
      item.className = "download-item fade-in";
      item.innerHTML = `
        <span class="download-name">${file.name}</span>
        <button class="download-btn" onclick="showDownloadPopup('${file.name}','${file.src}')">Download</button>
      `;
      list.appendChild(item);
    });
}

function showDownloadPopup(name, src) {
  pendingDownload = { name, src };
  document.getElementById('popup-file').textContent = name;
  document.getElementById('download-popup').style.display = "flex";
}

function cancelDownload() {
  pendingDownload = null;
  document.getElementById('download-popup').style.display = "none";
}

function confirmDownload() {
  if (!pendingDownload) return;
  // Buat link download dengan encoding nama file
  const link = document.createElement('a');
  link.href = encodeURI(pendingDownload.src);
  link.download = encodeURIComponent(pendingDownload.name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  document.getElementById('download-popup').style.display = "none";
  setTimeout(() => {
    showNotif(`Download ${pendingDownload.name} selesai!`);
  }, 200); // beri jeda agar popup tertutup dulu
  pendingDownload = null;
}

function showNotif(msg) {
  const notif = document.getElementById('notif');
  notif.textContent = msg;
  notif.style.display = "block";
  setTimeout(() => {
    notif.style.display = "none";
  }, 2500);
}

function cancelLogin() {
  window._pendingLogin = null;
  document.getElementById('login-popup').style.display = "none";
}

function confirmLogin() {
  const { user, pass } = window._pendingLogin || {};
  const error = document.getElementById('login-error');
  document.getElementById('login-popup').style.display = "none";
  if (user === "yanzzshin" && pass === "bukan-wibu") {
    document.getElementById('login-page').style.display = "none";
    document.getElementById('navbar').style.display = "flex";
    document.getElementById('nav-logout').style.display = "";
    showPage('home');
    error.textContent = "";
    showNotif("Login Sucsessfully!");
  } else {
    // error.textContent = "Username atau password salah!";
    showErrorPopup("Username atau password salah!");
    showNotif("Login Failed!");
  }
  window._pendingLogin = null;
}

function showErrorPopup(message) {
  document.getElementById('error-popup-message').textContent = message;
  document.getElementById('error-popup').style.display = "flex";
}

function closeErrorPopup() {
  document.getElementById('error-popup').style.display = "none";
}

// Animasi saat ketik pada input login dan search
function addTypingAnim(input) {
  input.classList.add('typing');
  clearTimeout(input._typingTimeout);
  input._typingTimeout = setTimeout(() => {
    input.classList.remove('typing');
  }, 400);
}

// Tambahkan event pada input login
document.getElementById('username').addEventListener('input', function() {
  addTypingAnim(this);
});
document.getElementById('password').addEventListener('input', function() {
  addTypingAnim(this);
});

// Tambahkan event pada search gallery & download
document.getElementById('gallery-search').addEventListener('input', function() {
  addTypingAnim(this);
});
document.getElementById('download-search').addEventListener('input', function() {
  addTypingAnim(this);
});

// Optional: Enter key for login
document.getElementById('password').addEventListener('keydown', function(e) {
  if (e.key === "Enter") login();
});

// Fungsi untuk menangani upload file di galeri
function handleGalleryUpload(event) {
  const files = event.target.files;
  if (files.length === 0) return;

  // Untuk setiap file yang dipilih
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Buat FormData untuk upload file
    const formData = new FormData();
    formData.append('file', file);
    
    // Kirim file ke server
    fetch('upload.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        // Tambahkan file ke mediaList
        mediaList.push({
          src: data.file_path,
          name: data.file_name,
          type: file.type.startsWith('image/') ? 'image' : (file.type.startsWith('video/') ? 'video' : 'unknown')
        });
        
        // Re-render gallery
        renderGallery();
        showNotif(`File ${data.file_name} uploaded successfully!`);
      } else {
        showErrorPopup(data.message || 'Upload failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showErrorPopup('Upload failed: ' + error.message);
    });
  }
}

// Fungsi untuk menangani upload file di halaman download
function handleDownloadUpload(event) {
  const files = event.target.files;
  if (files.length === 0) return;

  // Untuk setiap file yang dipilih
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Buat FormData untuk upload file
    const formData = new FormData();
    formData.append('file', file);
    
    // Kirim file ke server
    fetch('./upload.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        // Tambahkan file ke downloadFiles
        downloadFiles.push({
          src: data.file_path,
          name: data.file_name
        });
        
        // Re-render download list
        renderDownloadList();
        showNotif(`File ${data.file_name} uploaded successfully!`);
      } else {
        showErrorPopup(data.message || 'Upload failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showErrorPopup('Upload failed: ' + error.message);
    });
  }
}
