// DOM Elements
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modalImg");
    const captionText = document.getElementById("caption");
    const closeBtn = document.getElementById("closeBtn");
    const savedBtn = document.getElementById("savedBtn");
    const backBtn = document.getElementById("backBtn");
    const mainGallery = document.getElementById("mainGallery");
    const savedGallery = document.getElementById("savedGallery");
    const savedHeader = document.getElementById("savedHeader");
    const galleryTitle = document.getElementById("galleryTitle");
    
    // Sample image data (replace with your actual images)
    const imageData = [
      { src: "assets/book.jpg", alt: "Book" },
      { src: "assets/tree.jpg", alt: "Tree" },
      { src: "assets/cat.jpg", alt: "Cat" },
      { src: "assets/mountain.jpg", alt: "Mountain" },
      { src: "assets/ocean.webp", alt: "Ocean" },
      { src: "assets/forest.webp", alt: "Forest" },
      { src: "assets/house.avif", alt: "House" },
      { src: "assets/flowers.jpg", alt: "Flowers" }
    ];
    
    // State
    let savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
    
    // Initialize the app
    function init() {
      renderMainGallery();
      renderSavedGallery();
      setupEventListeners();
    }
    
    // Render main gallery
    function renderMainGallery() {
      mainGallery.innerHTML = '';
      
      imageData.forEach(image => {
        const isSaved = savedImages.some(img => img.src === image.src);
        
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
          <img src="${image.src}" alt="${image.alt}" loading="lazy" />
          <div class="image-label">${image.alt}</div>
          <button class="save-btn ${isSaved ? 'saved' : ''}" data-src="${image.src}" data-alt="${image.alt}">
            <i class="ri-bookmark-fill"></i>
          </button>
        `;
        
        mainGallery.appendChild(item);
      });
    }
    
    // Render saved gallery
    function renderSavedGallery() {
      savedGallery.innerHTML = '';
      
      if (savedImages.length === 0) {
        savedGallery.innerHTML = '<p class="empty-state">No saved images yet. Click the bookmark icon on images to save them.</p>';
        return;
      }
      
      savedImages.forEach(image => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
          <img src="${image.src}" alt="${image.alt}" loading="lazy" />
          <div class="image-label">${image.alt}</div>
          <button class="remove-btn" data-src="${image.src}">
            <i class="ri-delete-bin-line"></i>
          </button>
        `;
        
        savedGallery.appendChild(item);
      });
    }
    
    // Set up event listeners
    function setupEventListeners() {
      // Modal open/close
      document.addEventListener('click', function(e) {
        if (e.target.matches('.gallery-item img')) {
          const img = e.target;
          openModal(img.src, img.alt);
        }
      });
      
      closeBtn.addEventListener("click", closeModal);
      modal.addEventListener("click", (e) => e.target === modal && closeModal());
      
      // Save buttons
      document.addEventListener('click', function(e) {
        if (e.target.matches('.save-btn, .save-btn *')) {
          e.stopPropagation();
          const btn = e.target.closest('.save-btn');
          const src = btn.getAttribute('data-src');
          const alt = btn.getAttribute('data-alt');
          
          if (btn.classList.contains('saved')) {
            removeSavedImage(src);
            btn.classList.remove('saved');
          } else {
            saveImage(src, alt);
            btn.classList.add('saved');
          }
        }
      });
      
      // Remove buttons in saved gallery
      document.addEventListener('click', function(e) {
        if (e.target.matches('.remove-btn, .remove-btn *')) {
          e.stopPropagation();
          const btn = e.target.closest('.remove-btn');
          const src = btn.getAttribute('data-src');
          removeSavedImage(src);
          
          // Also update save button in main gallery
          const saveBtn = document.querySelector(`.save-btn[data-src="${src}"]`);
          if (saveBtn) saveBtn.classList.remove('saved');
        }
      });
      
      // Saved view toggle
      savedBtn.addEventListener("click", toggleSavedView);
      backBtn.addEventListener("click", toggleSavedView);
      
      // Keyboard events
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "block") {
          closeModal();
        }
      });
    }
    
    // Open modal with image
    function openModal(src, alt) {
      modal.style.display = "block";
      modalImg.src = src;
      captionText.textContent = alt;
      document.body.style.overflow = "hidden";
    }
    
    // Close modal
    function closeModal() {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
    
    // Save image to storage
    function saveImage(src, alt) {
      if (!savedImages.some(img => img.src === src)) {
        savedImages.push({ src, alt });
        localStorage.setItem('savedImages', JSON.stringify(savedImages));
        renderSavedGallery();
        
        // Visual feedback
        const btn = document.querySelector(`.save-btn[data-src="${src}"]`);
        if (btn) {
          btn.innerHTML = '<i class="ri-bookmark-fill" style="color: #ff4757;"></i>';
          setTimeout(() => {
            btn.innerHTML = '<i class="ri-bookmark-fill"></i>';
          }, 500);
        }
      }
    }
    
    // Remove image from saved
    function removeSavedImage(src) {
      savedImages = savedImages.filter(img => img.src !== src);
      localStorage.setItem('savedImages', JSON.stringify(savedImages));
      renderSavedGallery();
    }
    
    // Toggle between main and saved views
    function toggleSavedView() {
      const isSavedView = savedGallery.style.display === 'grid';
      
      if (isSavedView) {
        // Switch to main view
        savedGallery.style.display = 'none';
        savedHeader.style.display = 'none';
        mainGallery.style.display = 'grid';
        galleryTitle.style.display = 'block';
        document.body.classList.remove('saved-view-active');
      } else {
        // Switch to saved view
        savedGallery.style.display = 'grid';
        savedHeader.style.display = 'flex';
        mainGallery.style.display = 'none';
        galleryTitle.style.display = 'none';
        document.body.classList.add('saved-view-active');
        renderSavedGallery();
      }
    }
    
    // Initialize the app
    init();