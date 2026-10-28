const ACARA = {
    judul: 'Pernikahan Dearr & Angel',
    mulai: new Date(2026, 11, 12, 9, 0, 0), 
    selesai: new Date(2026, 11, 12, 16, 0, 0), 
    lokasi: 'Graha Cendana, Jl. Raya Darmo No. 88, Surabaya',
    deskripsi: 'Akad 09:00 WIB, Resepsi 13:00 - 16:00 WIB'
};

const cover    = document.getElementById('halaman-cover');
const undangan = document.getElementById('halaman-undangan');
const musik    = document.getElementById('musik');
const btnMusik = document.getElementById('btnMusik');

(function isiNamaTamu() {
    const params = new URLSearchParams(window.location.search);
    const nama = (params.get('to') || '').trim().slice(0, 60);
    if (!nama) return;
    document.getElementById('namaTamu').textContent = nama;
    document.getElementById('rsvpNama').value = nama;
})();

function bukaCover() {
    undangan.classList.remove('tampil');
    undangan.style.display = 'none';
    cover.classList.remove('hilang');
    cover.style.removeProperty('display');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bukaUndangan() {
    cover.classList.add('hilang');
    putarMusik();
    setTimeout(() => {
        cover.style.display = 'none';
        undangan.style.display = 'block';
        undangan.getBoundingClientRect();
        undangan.classList.add('tampil');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        jalankanReveal();
        perbaruiScroll();
    }, 800);
}

document.getElementById('btnBuka').addEventListener('click', bukaUndangan);
document.getElementById('btnKembali').addEventListener('click', bukaCover);
document.getElementById('btnFooterKembali').addEventListener('click', bukaCover);

function setTampilanMusik(sedangPutar) {
    btnMusik.classList.toggle('putar', sedangPutar);
    btnMusik.classList.toggle('mati', !sedangPutar);
    btnMusik.setAttribute('aria-label', sedangPutar ? 'Matikan musik' : 'Putar musik');
    btnMusik.title = sedangPutar ? 'Matikan musik' : 'Putar musik';
}

async function putarMusik() {
    try {
        if (musik.readyState === 0) musik.load();
        await musik.play();
        setTampilanMusik(true);
    } catch (error) {
        setTampilanMusik(false);
        console.error('Musik gagal diputar. Pastikan assets/l1.mp3 ada:', error);
    }
}

musik.addEventListener('play', () => setTampilanMusik(true));
musik.addEventListener('pause', () => setTampilanMusik(false));
musik.addEventListener('ended', () => setTampilanMusik(false));
musik.addEventListener('error', () => {
    setTampilanMusik(false);
    console.error('File assets/l1.mp3 tidak ditemukan atau tidak dapat dibaca browser.');
});

btnMusik.addEventListener('click', async () => {
    if (musik.paused) await putarMusik();
    else musik.pause();
});
setTampilanMusik(false);

let musikSudahMulai = false;
const daftarEvent = ['click', 'touchstart', 'keydown', 'scroll', 'wheel', 'mousemove'];

function hapusPemicu() {
    daftarEvent.forEach(e => document.removeEventListener(e, pemicuInteraksi));
}

function pemicuInteraksi() {
    if (musikSudahMulai) return;
    musik.play().then(() => {
        musikSudahMulai = true;
        hapusPemicu();
    }).catch(() => {});
}

window.addEventListener('load', () => {
    musik.play().then(() => {
        musikSudahMulai = true;
    }).catch(() => {
        daftarEvent.forEach(e =>
            document.addEventListener(e, pemicuInteraksi, { passive: true })
        );
    });
});

(function partikelEmas() {
    const canvas = document.getElementById('partikel');
    if (!canvas || !canvas.getContext) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, titik = [];

    function ukur() {
        w = canvas.width  = cover.clientWidth;
        h = canvas.height = cover.clientHeight;
        const jumlah = Math.max(18, Math.min(46, Math.round(w / 34)));
        titik = Array.from({ length: jumlah }, buatTitik);
    }

    function buatTitik() {
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 2.2 + 0.8,
            kecepatan: Math.random() * 0.45 + 0.15,
            goyang: Math.random() * Math.PI * 2,
            alpha: Math.random() * 0.5 + 0.3
        };
    }

    function gambar() {
        if (cover.style.display !== 'none' && !cover.classList.contains('hilang')) {
            ctx.clearRect(0, 0, w, h);
            for (const p of titik) {
                p.y -= p.kecepatan;
                p.goyang += 0.02;
                p.x += Math.sin(p.goyang) * 0.4;
                if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(230, 195, 106,' + p.alpha + ')';
                ctx.shadowColor = 'rgba(212, 168, 67, 0.9)';
                ctx.shadowBlur = 8;
                ctx.fill();
            }
        }
        requestAnimationFrame(gambar);
    }

    window.addEventListener('resize', ukur);
    ukur();
    gambar();
})();

let observerReveal = null;

function jalankanReveal() {
    const daftar = document.querySelectorAll('.reveal:not(.terlihat)');
    if (!('IntersectionObserver' in window)) {
        daftar.forEach(el => el.classList.add('terlihat'));
        return;
    }
    if (!observerReveal) {
        observerReveal = new IntersectionObserver((entri) => {
            entri.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('terlihat');
                    observerReveal.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
    }
    daftar.forEach(el => observerReveal.observe(el));
}

const barProgress = document.getElementById('progress-scroll');
const heroBg      = document.getElementById('heroBg');
const btnAtas     = document.getElementById('btnAtas');
const linkNav     = Array.from(document.querySelectorAll('.navbar-undangan .nav-link'));
const seksiNav    = linkNav
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

let menungguFrame = false;

function perbaruiScroll() {
    menungguFrame = false;
    if (undangan.style.display === 'none' || !undangan.classList.contains('tampil')) {
        barProgress.style.width = '0';
        btnAtas.classList.remove('tampil');
        return;
    }

    const y = window.scrollY || document.documentElement.scrollTop;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    barProgress.style.width = (total > 0 ? (y / total) * 100 : 0) + '%';

    heroBg.style.setProperty('--py', (y * 0.25) + 'px');
    btnAtas.classList.toggle('tampil', y > 500);

    let aktif = null;
    const batas = window.innerHeight * 0.35;
    seksiNav.forEach(s => {
        if (s.getBoundingClientRect().top <= batas) aktif = s.id;
    });
    linkNav.forEach(a => a.classList.toggle('aktif', a.getAttribute('href') === '#' + aktif));
}

window.addEventListener('scroll', () => {
    if (menungguFrame) return;
    menungguFrame = true;
    requestAnimationFrame(perbaruiScroll);
}, { passive: true });

btnAtas.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

linkNav.forEach(a => a.addEventListener('click', () => {
    const menu = document.getElementById('navbarUndangan');
    if (menu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
}));

function tampilToast(pesan) {
    const el = document.getElementById('toastPesan');
    document.getElementById('toastIsi').textContent = pesan;
    bootstrap.Toast.getOrCreateInstance(el, { delay: 2600 }).show();
}

const targetTanggal = ACARA.mulai;
const nilaiSebelumnya = {};

function setAngka(id, nilai) {
    const el = document.getElementById(id);
    const teks = String(nilai);
    if (nilaiSebelumnya[id] === teks) return;
    nilaiSebelumnya[id] = teks;
    el.textContent = teks;
    el.classList.add('ganti');
    setTimeout(() => el.classList.remove('ganti'), 250);
}

function hitungMundur() {
    const selisih = targetTanggal.getTime() - Date.now();
    const row = document.getElementById('countdown-row');

    let pesan = document.getElementById('countdown-message');
    if (!pesan) {
        pesan = document.createElement('div');
        pesan.id = 'countdown-message';
        pesan.className = 'text-center';
        pesan.style.cssText = `
            color: #d4a843;
            font-family: 'Cinzel', serif;
            font-size: 1.1rem;
            letter-spacing: 2px;
            margin-top: 25px;
            display: none;
        `;
        row.insertAdjacentElement('afterend', pesan);
    }

    if (selisih <= 0) {
        row.style.display = 'none';
        pesan.style.display = 'block';
        pesan.textContent = '✨ KAMI TELAH MENIKAH ✨';
        return;
    }

    row.style.display = '';
    pesan.style.display = 'none';

    setAngka('cd-hari',  Math.floor(selisih / 86400000));
    setAngka('cd-jam',   Math.floor((selisih % 86400000) / 3600000));
    setAngka('cd-menit', Math.floor((selisih % 3600000) / 60000));
    setAngka('cd-detik', Math.floor((selisih % 60000) / 1000));
}

hitungMundur();
setInterval(hitungMundur, 1000);

function formatIcs(d) {
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + 'T' +
           p(d.getHours()) + p(d.getMinutes()) + '00';
}

document.getElementById('btnKalender').addEventListener('click', () => {
    const isi = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Undangan Dearr & Angel//ID',
        'BEGIN:VEVENT',
        'UID:dearr-angel-' + ACARA.mulai.getTime() + '@undangan',
        'DTSTAMP:' + formatIcs(new Date()),
        'DTSTART;TZID=Asia/Jakarta:' + formatIcs(ACARA.mulai),
        'DTEND;TZID=Asia/Jakarta:' + formatIcs(ACARA.selesai),
        'SUMMARY:' + ACARA.judul,
        'LOCATION:' + ACARA.lokasi.replace(/,/g, '\\,'),
        'DESCRIPTION:' + ACARA.deskripsi,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([isi], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pernikahan-dearr-angel.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    tampilToast('Jadwal disimpan ke kalender');
});

(function lightbox() {
    const modalEl = document.getElementById('modalFoto');
    const gambar  = document.getElementById('fotoBesar');
    const modal   = bootstrap.Modal.getOrCreateInstance(modalEl);

    document.querySelectorAll('.galeri-item').forEach(item => {
        item.addEventListener('click', () => {
            gambar.src = item.dataset.foto;
            modal.show();
        });
    });
})();

document.querySelectorAll('.btn-salin').forEach(btn => {
    btn.addEventListener('click', async () => {
        const teks = document.getElementById(btn.dataset.salin).textContent.replace(/\s+/g, '');
        try {
            await navigator.clipboard.writeText(teks);
            tampilToast('Nomor berhasil disalin');
        } catch (e) {
            const ta = document.createElement('textarea');
            ta.value = teks;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); tampilToast('Nomor berhasil disalin'); }
            catch (err) { tampilToast('Gagal menyalin, salin manual ya'); }
            ta.remove();
        }
    });
});

(function rsvp() {
    const KUNCI = 'ucapan-dearr-angel';
    const form   = document.getElementById('formRsvp');
    const daftar = document.getElementById('daftarUcapan');
    const grupJumlah = document.getElementById('grupJumlah');

    function bacaData() {
        try {
            const data = JSON.parse(localStorage.getItem(KUNCI) || '[]');
            return Array.isArray(data) ? data : [];
        } catch (e) { return []; }
    }

    function simpanData(data) {
        try { localStorage.setItem(KUNCI, JSON.stringify(data.slice(0, 50))); } catch (e) { /* abaikan */ }
    }

    function tampilkan(data) {
        daftar.textContent = '';
        const tampil = data.filter(d => d.ucapan);
        if (!tampil.length) {
            const kosong = document.createElement('div');
            kosong.className = 'ucapan-kosong';
            kosong.textContent = 'Belum ada ucapan. Jadilah yang pertama!';
            daftar.appendChild(kosong);
            return;
        }
        tampil.forEach(d => {
            const item = document.createElement('div');
            item.className = 'ucapan-item';

            const nama = document.createElement('div');
            nama.className = 'ucapan-nama';
            nama.textContent = d.nama;

            const lencana = document.createElement('span');
            lencana.className = 'lencana' + (d.hadir === 'Hadir' ? '' : ' tidak');
            lencana.textContent = d.hadir;
            nama.appendChild(lencana);

            const isi = document.createElement('p');
            isi.className = 'ucapan-isi';
            isi.textContent = d.ucapan;

            item.appendChild(nama);
            item.appendChild(isi);
            daftar.appendChild(item);
        });
    }

    document.querySelectorAll('input[name="hadir"]').forEach(r => {
        r.addEventListener('change', () => {
            const hadir = document.getElementById('hadirYa').checked;
            grupJumlah.style.display = hadir ? '' : 'none';
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputNama = document.getElementById('rsvpNama');
        const nama = inputNama.value.trim();

        if (!nama) {
            inputNama.classList.add('is-invalid');
            inputNama.focus();
            return;
        }
        inputNama.classList.remove('is-invalid');

        const hadir  = document.querySelector('input[name="hadir"]:checked').value;
        const jumlah = hadir === 'Hadir' ? document.getElementById('rsvpJumlah').value : '0';
        const ucapan = document.getElementById('rsvpUcapan').value.trim();

        const data = bacaData();
        data.unshift({ nama, hadir, jumlah, ucapan, waktu: Date.now() });
        simpanData(data);
        tampilkan(data);

        form.reset();
        grupJumlah.style.display = '';
        tampilToast('Terima kasih, konfirmasi terkirim 💌');
    });

    document.getElementById('rsvpNama').addEventListener('input', function () {
        this.classList.remove('is-invalid');
    });

    tampilkan(bacaData());
})();
