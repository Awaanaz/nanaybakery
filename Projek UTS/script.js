/* fitur search */
const cariProduk = document.getElementById("nasywa_cariProduk");
const daftarProduk = document.querySelectorAll(".nasywa_card_produk");

if (cariProduk) {
    cariProduk.addEventListener("input", function () {
        const kataKunci = cariProduk.value.toLowerCase();

        daftarProduk.forEach(function (produk) {
            const namaProduk = produk.querySelector("h3").textContent.toLowerCase();

            if (namaProduk.includes(kataKunci)) {
                produk.style.display = "block";
            } else {
                produk.style.display = "none";
            }
        });
    });
}

/* fitur keranjang */
let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

function formatRupiah(harga) {
    return "Rp" + harga.toLocaleString("id-ID");
}

function simpanKeranjang() {
    localStorage.setItem("keranjang", JSON.stringify(keranjang));
}

daftarProduk.forEach(function (produk) {
    const tombol = produk.querySelector("button");
    if (tombol) {
        tombol.addEventListener("click", function () {
            const nama = produk.querySelector("h3").textContent;
            const hargaTeks = produk.querySelector("p").textContent;
            const harga = Number(hargaTeks.replace(/\D/g, ""));
            const gambar = produk.querySelector("img").getAttribute("src");
            const produkAda = keranjang.find(function (item) {
                return item.nama === nama;
            });
            if (produkAda) {
                produkAda.jumlah++;
            } else {
                keranjang.push({
                    nama: nama,
                    harga: harga,
                    gambar: gambar,
                    jumlah: 1
                });
            }
            simpanKeranjang();
            alert(nama + " berhasil ditambahkan ke keranjang!");
        });
    }
});

function tampilkanKeranjang() {
    const isiKeranjang = document.getElementById("nasywa_isiKeranjang");
    if (!isiKeranjang) return;
    isiKeranjang.innerHTML = "";
    let subtotal = 0;
    keranjang.forEach(function (item, index) {
        const totalProduk = item.harga * item.jumlah;
        subtotal += totalProduk;
        isiKeranjang.innerHTML += `
            <tr>
                <td>
                    <img src="${item.gambar}" alt="${item.nama}">
                    <span>${item.nama}</span>
                </td>
                <td>${formatRupiah(item.harga)}</td>
                <td>
                    <input
                        type="number"
                        value="${item.jumlah}"
                        min="1"
                        onchange="ubahJumlah(${index}, this.value)"
                    >
                </td>
                <td>${formatRupiah(totalProduk)}</td>
                <td>
                    <button type="button"
                        onclick="hapusProduk(${index})"
                        aria-label="Hapus ${item.nama}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    if (keranjang.length === 0) {
        isiKeranjang.innerHTML = `
            <tr>
                <td colspan="5">Keranjang masih kosong.</td>
            </tr>
        `;
    }

    const ongkir = keranjang.length > 0 ? 10000 : 0;
    const total = subtotal + ongkir;
    document.getElementById("nasywa_subtotal").textContent = formatRupiah(subtotal);
    document.getElementById("nasywa_totalHarga").textContent = formatRupiah(total);
}

function ubahJumlah(index, jumlah) {
    jumlah = parseInt(jumlah);
    if (jumlah < 1 || isNaN(jumlah)) {
        jumlah = 1;
    }
    keranjang[index].jumlah = jumlah;
    simpanKeranjang();
    tampilkanKeranjang();
}

function hapusProduk(index) {
    keranjang.splice(index, 1);
    simpanKeranjang();
    tampilkanKeranjang();
}

tampilkanKeranjang();