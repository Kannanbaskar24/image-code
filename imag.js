const fileInput = document.getElementById('fileInput');
const addPhotoBtn = document.getElementById('addPhoto');
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const filterSelect = document.getElementById('filterSelect');
const searchInput = document.getElementById('searchInput');
const editModal = document.getElementById('editModal');
const editTitle = document.getElementById('editTitle');
const editCategory = document.getElementById('editCategory');
const saveEdit = document.getElementById('saveEdit');
const cancelEdit = document.getElementById('cancelEdit');
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');
const shareBtn = document.getElementById('shareBtn');

let images = JSON.parse(localStorage.getItem('galleryImages')) || [];
let currentIndex = 0;

// Add photo
addPhotoBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      images.push({
        src: event.target.result,
        title: file.name,
        category: "Uncategorized"
      });
      saveImages();
      renderGallery();
    };
    reader.readAsDataURL(file);
  });
});

function renderGallery() {
  gallery.innerHTML = "";
  const searchVal = searchInput.value.toLowerCase();
  images.forEach((img, index) => {
    if (img.title.toLowerCase().includes(searchVal)) {
      const imgElem = document.createElement('img');
      imgElem.src = img.src;
      imgElem.alt = img.title;
      imgElem.style.filter = filterSelect.value;
      imgElem.addEventListener('click', () => openLightbox(index));
      gallery.appendChild(imgElem);
    }
  });
}

function saveImages() {
  localStorage.setItem('galleryImages', JSON.stringify(images));
}

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = images[index].src;
  lightbox.style.display = 'flex';
}

closeBtn.onclick = () => lightbox.style.display = 'none';

nextBtn.onclick = () => {
  currentIndex = (currentIndex + 1) % images.length;
  lightboxImg.src = images[currentIndex].src;
};

prevBtn.onclick = () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lightboxImg.src = images[currentIndex].src;
};

editBtn.onclick = () => {
  editTitle.value = images[currentIndex].title;
  editCategory.value = images[currentIndex].category;
  editModal.style.display = 'flex';
};

saveEdit.onclick = () => {
  images[currentIndex].title = editTitle.value;
  images[currentIndex].category = editCategory.value;
  saveImages();
  renderGallery();
  editModal.style.display = 'none';
};

cancelEdit.onclick = () => editModal.style.display = 'none';

deleteBtn.onclick = () => {
  if (confirm("Delete this image?")) {
    images.splice(currentIndex, 1);
    saveImages();
    renderGallery();
    lightbox.style.display = 'none';
  }
};

shareBtn.onclick = async () => {
  const img = images[currentIndex];
  if (navigator.share) {
    await navigator.share({
      title: img.title,
      text: 'Check out this image!',
      url: img.src
    });
  } else {
    navigator.clipboard.writeText(img.src);
    alert("Image link copied!");
  }
};

filterSelect.onchange = renderGallery;
searchInput.oninput = renderGallery;

window.onclick = (e) => {
  if (e.target === editModal) editModal.style.display = 'none';
  if (e.target === lightbox) lightbox.style.display = 'none';
};

renderGallery();