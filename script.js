// --- Inisialisasi Data Buku ---
// Data dummy awal. Dalam aplikasi full stack nyata, ini akan diambil dari database (e.g., MySQL/PostgreSQL) melalui API.
let bookDatabase = [
    { title: "Laskar Pelangi", author: "Andrea Hirata", isbn: "9789791227189", location: "A10-R3-K5" },
    { title: "Filosofi Teras", author: "Henry Manampiring", isbn: "9786237107401", location: "B05-R1-K2" },
    { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", isbn: "9789799731215", location: "C01-R5-K1" },
    { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", isbn: "9780747532743", location: "F12-R2-K7" },
    { title: "Atomic Habits", author: "James Clear", isbn: "9780735211292", location: "E08-R4-K3" }
];

// Cek dan ambil data dari Local Storage jika ada
if (localStorage.getItem('bookData')) {
    bookDatabase = JSON.parse(localStorage.getItem('bookData'));
}

// Fungsi untuk menyimpan data ke Local Storage
function saveToLocalStorage() {
    localStorage.setItem('bookData', JSON.stringify(bookDatabase));
}


// --- FUNGSI PENCARIAN ---
function searchBook() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    let resultsHTML = '';

    if (searchInput.length === 0) {
        resultsContainer.innerHTML = '<p class="placeholder-text">Mohon masukkan kata kunci pencarian (Judul, Pengarang, atau ISBN).</p>';
        return;
    }

    // Filter database berdasarkan input
    const filteredBooks = bookDatabase.filter(book => {
        return book.title.toLowerCase().includes(searchInput) ||
               book.author.toLowerCase().includes(searchInput) ||
               book.isbn.includes(searchInput);
    });

    if (filteredBooks.length > 0) {
        // Tampilkan hasil
        filteredBooks.forEach(book => {
            resultsHTML += `
                <div class="book-item">
                    <div class="book-details">
                        <strong>${book.title}</strong>
                        <p>Pengarang: ${book.author}</p>
                        <p>ISBN: ${book.isbn}</p>
                    </div>
                    <span class="book-location">Rak: ${book.location}</span>
                </div>
            `;
        });
    } else {
        // Jika tidak ada hasil
        resultsHTML = '<p class="placeholder-text">❌ Maaf, buku tidak ditemukan. Coba kata kunci lain atau input data buku baru.</p>';
    }

    resultsContainer.innerHTML = resultsHTML;
}


// --- FUNGSI INPUT BUKU BARU ---
document.getElementById('newBookForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah form submit secara default

    const title = document.getElementById('newTitle').value.trim();
    const author = document.getElementById('newAuthor').value.trim();
    const isbn = document.getElementById('newIsbn').value.trim();
    const location = document.getElementById('newLocation').value.trim();
    const inputMessage = document.getElementById('inputMessage');

    // Validasi sederhana: Cek duplikasi ISBN
    const isDuplicate = bookDatabase.some(book => book.isbn === isbn);

    if (isDuplicate) {
        inputMessage.textContent = '❌ Gagal: ISBN ini sudah terdaftar di sistem.';
        inputMessage.className = 'message-text error-message'; // Anda bisa tambahkan CSS untuk error
        return;
    }

    // Buat objek buku baru
    const newBook = {
        title: title,
        author: author,
        isbn: isbn,
        location: location.toUpperCase() // Agar lokasi konsisten (misal: A01-R1-K1)
    };

    // Tambahkan ke database dan simpan
    bookDatabase.push(newBook);
    saveToLocalStorage(); // Simpan ke Local Storage

    // Reset form dan tampilkan pesan sukses
    document.getElementById('newBookForm').reset();
    inputMessage.textContent = '✅ Buku berhasil ditambahkan!';
    inputMessage.className = 'message-text success-message';

    // Hilangkan pesan setelah beberapa detik
    setTimeout(() => {
        inputMessage.textContent = '';
        inputMessage.className = 'message-text';
    }, 5000);
});

// Panggil fungsi pencarian saat tombol "Enter" ditekan di input
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchBook();
    }
});

// Panggil fungsi pencarian saat pertama kali load (opsional)
// searchBook();