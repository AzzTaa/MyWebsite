const carouselTrack = document.getElementById('carouselTrack');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselDots = document.getElementById('carouselDots');
const uploadModal = document.getElementById('uploadModal');
const avatarEdit = document.getElementById('avatarEdit');
const closeModal = document.getElementById('closeModal');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');

let currentIndex = 0;
let autoScrollInterval;
let uploadedImages = [];

function createDots() {
    carouselDots.innerHTML = '';
    carouselItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });
}

function updateCarousel() {
    carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
    carouselItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
    });
}

function goToSlide(index) {
    currentIndex = index;
    if (currentIndex >= carouselItems.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = carouselItems.length - 1;
    updateCarousel();
    resetAutoScroll();
}

function nextSlide() {
    goToSlide(currentIndex + 1);
}

function prevSlide() {
    goToSlide(currentIndex - 1);
}

function startAutoScroll() {
    autoScrollInterval = setInterval(nextSlide, 4000);
}

function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
}

prevBtn.addEventListener('click', () => {
    prevSlide();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
});

avatarEdit.addEventListener('click', () => {
    uploadModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    uploadModal.classList.remove('active');
});

uploadModal.addEventListener('click', (e) => {
    if (e.target === uploadModal) {
        uploadModal.classList.remove('active');
    }
});

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#f5c518';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#444444';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#444444';
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImages.push(e.target.result);
                renderPreviews();
            };
            reader.readAsDataURL(file);
        }
    });
}

function renderPreviews() {
    previewArea.innerHTML = '';
    uploadedImages.forEach((src, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="${src}" alt="预览图片${index + 1}">
            <button class="remove-btn" data-index="${index}">&times;</button>
        `;
        previewArea.appendChild(previewItem);
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            uploadedImages.splice(index, 1);
            renderPreviews();
        });
    });
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const index = item.dataset.index;
        console.log(`导航项 ${index} 被点击`);
    });
});

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            console.log(`搜索: ${query}`);
        }
    }
});

createDots();
startAutoScroll();