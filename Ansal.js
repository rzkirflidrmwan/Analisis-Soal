/* ── State ── */
let tipeAktif = null;   // 'pg' | 'essay'

/* ── Step 1: Pilih tipe ── */
function pilihTipe(tipe) {
    tipeAktif = tipe;
    document.getElementById('card-pg').classList.toggle('selected', tipe === 'pg');
    document.getElementById('card-essay').classList.toggle('selected', tipe === 'essay');
    document.getElementById('step2').style.display = 'block';
    document.getElementById('step3').style.display = 'none';
    document.getElementById('inputArea').innerHTML = '';
    document.getElementById('output').innerHTML = '';
    document.getElementById('jumlahSiswa').value = '';
    document.getElementById('jumlahSoal').value = '';
    document.getElementById('step2').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Step 2: Buat Tabel ── */
function buatTabel() {
    if (!tipeAktif) {
        alert("Pilih tipe soal terlebih dahulu!");
        return;
    }
    let siswa = +document.getElementById("jumlahSiswa").value;
    let soal  = +document.getElementById("jumlahSoal").value;
    if (siswa < 1 || soal < 1) {
        alert("Masukkan jumlah siswa dan jumlah soal terlebih dahulu!");
        return;
    }

    if (tipeAktif === 'pg') {
        buatTabelPG(siswa, soal);
    } else {
        buatTabelEssay(siswa, soal);
    }

    document.getElementById('step3').style.display = 'block';
    document.getElementById('output').innerHTML = '';
    document.getElementById('step3').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Tabel Pilihan Ganda ── */
function buatTabelPG(siswa, soal) {
    const opsi = ['A','B','C','D','E'];

    let h = '<div class="table-wrapper">';
    h += '<table>';
    h += '<thead><tr>';
    h += '<th>No</th>';
    h += '<th>Nama Siswa</th>';
    for (let j = 1; j <= soal; j++) {
        h += `<th>${j}</th>`;
    }
    h += '<th>Skor</th>';
    h += '</tr></thead>';
    h += '<tbody>';

    /* Baris Kunci Jawaban */
    h += '<tr class="row-kunci">';
    h += '<td colspan="2" style="font-weight:700; color:#7a5700; text-align:left; padding-left:14px;">🔑 Kunci Jawaban</td>';
    for (let j = 0; j < soal; j++) {
        h += `<td><select id="kunci${j}">`;
        opsi.forEach(o => h += `<option value="${o}">${o}</option>`);
        h += `</select></td>`;
    }
    h += '<td>—</td>';
    h += '</tr>';

    /* Baris Siswa */
    for (let i = 0; i < siswa; i++) {
        h += '<tr>';
        h += `<td style="font-weight:600; color:#6b7c93;">${i + 1}</td>`;
        h += `<td><input type="text" class="cell-input" id="nama${i}" placeholder="Nama Siswa" style="width:140px;"></td>`;
        for (let j = 0; j < soal; j++) {
            h += `<td><select id="i${i}j${j}" style="width:54px;">`;
            opsi.forEach(o => h += `<option value="${o}">${o}</option>`);
            h += `</select></td>`;
        }
        h += `<td class="skor-cell" id="skor${i}">0</td>`;
        h += '</tr>';
    }

    h += '</tbody></table></div>';
    h += '<br><button class="btn btn-success btn-block" onclick="analisis()">🔍 Analisis Soal</button>';

    document.getElementById("inputArea").innerHTML = h;
}

/* ── Tabel Esai ── */
function buatTabelEssay(siswa, soal) {
    let h = '<div class="table-wrapper">';
    h += '<table>';
    h += '<thead><tr>';
    h += '<th>No</th>';
    h += '<th>Nama Siswa</th>';
    for (let j = 1; j <= soal; j++) {
        h += `<th>${j}</th>`;
    }
    h += '<th>Skor</th>';
    h += '</tr></thead>';
    h += '<tbody>';

    for (let i = 0; i < siswa; i++) {
        h += '<tr>';
        h += `<td style="font-weight:600; color:#6b7c93;">${i + 1}</td>`;
        h += `<td><input type="text" class="cell-input" id="nama${i}" placeholder="Nama Siswa" style="width:140px;"></td>`;
        for (let j = 0; j < soal; j++) {
            h += `<td><input type="number" class="cell-input" min="0" max="1" value="0" id="i${i}j${j}" style="width:54px;"></td>`;
        }
        h += `<td class="skor-cell" id="skor${i}">0</td>`;
        h += '</tr>';
    }

    h += '</tbody></table></div>';
    h += '<br><p style="font-size:13px;color:#6b7c93;margin-bottom:8px;">💡 Isi 1 untuk jawaban benar, 0 untuk salah.</p>';
    h += '<button class="btn btn-success btn-block" onclick="analisis()">🔍 Analisis Soal</button>';

    document.getElementById("inputArea").innerHTML = h;
}

/* ── Analisis ── */
function analisis() {
    let siswa = +document.getElementById("jumlahSiswa").value;
    let soal  = +document.getElementById("jumlahSoal").value;

    if (siswa < 10) {
        alert("Minimal 10 siswa agar analisis butir soal lebih valid.");
        return;
    }
    if (soal < 2) {
        alert("Minimal 2 soal untuk menghitung reliabilitas KR-20.");
        return;
    }

    let data = [], nama = [], skor = [];

    if (tipeAktif === 'pg') {
        /* Baca kunci */
        let kunci = [];
        for (let j = 0; j < soal; j++) {
            kunci.push(document.getElementById("kunci" + j).value);
        }
        /* Baca jawaban & hitung skor */
        for (let i = 0; i < siswa; i++) {
            nama.push(document.getElementById("nama" + i).value || ("Siswa " + (i + 1)));
            let row = [], total = 0;
            for (let j = 0; j < soal; j++) {
                let jawab = document.getElementById("i" + i + "j" + j).value;
                let benar = (jawab === kunci[j]) ? 1 : 0;
                row.push(benar);
                total += benar;
            }
            data.push(row);
            skor.push(total);
            let sc = document.getElementById("skor" + i);
            if (sc) sc.innerText = total;
        }
    } else {
        /* Essay: langsung baca 0/1 */
        for (let i = 0; i < siswa; i++) {
            nama.push(document.getElementById("nama" + i).value || ("Siswa " + (i + 1)));
            let row = [], total = 0;
            for (let j = 0; j < soal; j++) {
                let v = +document.getElementById("i" + i + "j" + j).value;
                if (v !== 0 && v !== 1) {
                    alert("Jawaban siswa ke-" + (i + 1) + " soal ke-" + (j + 1) + " hanya boleh 0 atau 1");
                    return;
                }
                row.push(v);
                total += v;
            }
            data.push(row);
            skor.push(total);
            let sc = document.getElementById("skor" + i);
            if (sc) sc.innerText = total;
        }
    }

    tampilkanHasil(data, nama, skor, siswa, soal);
}

/* ── Tampilkan Hasil ── */
function tampilkanHasil(data, nama, skor, siswa, soal) {
    let out = '';

    /* Rekap Skor */
    let ranking = [];
    for (let i = 0; i < siswa; i++) ranking.push({ nama: nama[i], skor: skor[i] });
    ranking.sort((a, b) => b.skor - a.skor);

    out += '<div class="card">';
    out += '<h2>🏆 Rekap Skor Siswa</h2>';
    out += '<div class="table-wrapper">';
    out += '<table><thead><tr><th>Ranking</th><th>Nama</th><th>Skor</th></tr></thead><tbody>';
    ranking.forEach((r, idx) => {
        let medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : (idx + 1);
        out += `<tr><td>${medal}</td><td style="text-align:left;padding-left:14px;">${r.nama}</td><td style="font-weight:700;color:#2980b9;">${r.skor}</td></tr>`;
    });
    out += '</tbody></table></div></div>';

    /* Analisis Butir */
    let sumPQ = 0, valid = 0;
    let butirRows = '';

    for (let item = 0; item < soal; item++) {
        let benar = 0;
        let itemScore  = [];
        let totalTanpa = [];

        for (let s = 0; s < siswa; s++) {
            benar += data[s][item];
            itemScore.push(data[s][item]);
            totalTanpa.push(skor[s] - data[s][item]);
        }

        let p = benar / siswa;
        let q = 1 - p;
        sumPQ += p * q;

        let r = korelasi(itemScore, totalTanpa);

        let rank = [];
        for (let i = 0; i < siswa; i++) rank.push({ idx: i, skor: skor[i] });
        rank.sort((a, b) => b.skor - a.skor);

        let kelompok = Math.max(1, Math.floor(siswa * 0.27));
        let atas = 0, bawah = 0;
        for (let i = 0; i < kelompok; i++) atas  += data[rank[i].idx][item];
        for (let i = siswa - kelompok; i < siswa; i++) bawah += data[rank[i].idx][item];

        let dp = (atas - bawah) / kelompok;

        let kv = kategoriValiditas(r);
        let kd = kategoriDP(dp);
        let kp = kategoriKesukaran(p);

        if (r >= 0.20) valid++;

        butirRows += `
        <tr>
            <td style="font-weight:600;">${item + 1}</td>
            <td>${p.toFixed(3)}</td>
            <td><span class="badge ${badgeClass(kp)}">${kp}</span></td>
            <td>${dp.toFixed(3)}</td>
            <td><span class="badge ${badgeClass(kd)}">${kd}</span></td>
            <td>${r.toFixed(3)}</td>
            <td><span class="badge ${badgeClass(kv)}">${kv}</span></td>
        </tr>`;
    }

    out += '<div class="card">';
    out += '<h2>📋 Analisis Butir Soal</h2>';
    out += '<div class="table-wrapper"><table>';
    out += '<thead><tr><th>Soal</th><th>P</th><th>Kesukaran</th><th>DP</th><th>Daya Pembeda</th><th>r</th><th>Validitas</th></tr></thead>';
    out += '<tbody>' + butirRows + '</tbody>';
    out += '</table></div></div>';

    /* KR-20 */
    let rata = skor.reduce((a, b) => a + b, 0) / siswa;
    let varians = 0;
    for (let x of skor) varians += Math.pow(x - rata, 2);
    varians /= (siswa - 1);

    let KR20 = 0;
    if (varians > 0) {
        KR20 = (soal / (soal - 1)) * (1 - (sumPQ / varians));
    }

    let ketRel = kategoriReliabilitas(KR20);

    /* Kesimpulan */
    out += '<div class="card">';
    out += '<h2>📊 Kesimpulan</h2>';
    out += '<div class="summary-grid">';
    out += `<div class="summary-item"><div class="s-label">Total Soal</div><div class="s-value">${soal}</div></div>`;
    out += `<div class="summary-item"><div class="s-label">Soal Valid</div><div class="s-value" style="color:#27ae60;">${valid}</div></div>`;
    out += `<div class="summary-item"><div class="s-label">Tidak Valid</div><div class="s-value" style="color:#e74c3c;">${soal - valid}</div></div>`;
    out += `<div class="summary-item"><div class="s-label">Reliabilitas KR-20</div><div class="s-value" style="font-size:18px;">${KR20.toFixed(3)}<br><span class="badge ${badgeClass(ketRel)}" style="font-size:11px;margin-top:4px;">${ketRel}</span></div></div>`;
    out += '</div></div>';

    /* Keterangan */
    out += '<div class="card">';
    out += '<h2>📖 Keterangan Kategori</h2>';
    out += '<div class="ket-grid">';
    out += keterangan('Validitas',       '≥0.80 Sangat Valid | 0.60–0.79 Valid | 0.40–0.59 Cukup | 0.20–0.39 Rendah | 0.00–0.19 Tidak Valid | <0 Tidak Relevan');
    out += keterangan('Daya Pembeda',    '0.70< Sangat Baik | 0.40–0.70 Baik | 0.20–0.40 Cukup | 0.00–0.20 Jelek | ≤0 Sangat Jelek');
    out += keterangan('Tingkat Kesukaran', 'P <0.30 Sukar | 0.30≤P≤0.70 Sedang | P >0.70 Mudah');
    out += keterangan('Reliabilitas',    '≥0.80 Sangat Tinggi | 0.60–0.79 Tinggi | 0.40–0.59 Cukup | 0.20–0.39 Rendah | <0.20 Sangat Rendah');
    out += keterangan('Rumus',           'P = B/JS | DP = (BA−BB)/JA | KR20 = (k/(k−1))(1−Σpq/St²)');
    out += '</div></div>';

    document.getElementById("output").innerHTML = out;
    document.getElementById("output").scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function keterangan(judul, isi) {
    return `<div class="ket-box"><h3>${judul}</h3><p>${isi}</p></div>`;
}

/* ── Helpers ── */
function badgeClass(t) {
    const good = ["Sangat Valid","Valid","Sangat Baik","Baik","MUDAH","Tinggi","Sangat Tinggi"];
    const mid  = ["Cukup","SEDANG","Rendah"];
    if (good.includes(t)) return "good";
    if (mid.includes(t))  return "mid";
    return "bad";
}

function kategoriValiditas(r) {
    if (r >= 0.80) return "Sangat Valid";
    if (r >= 0.60) return "Valid";
    if (r >= 0.40) return "Cukup";
    if (r >= 0.20) return "Rendah";
    if (r >= 0.00) return "Tidak Valid";
    return "Tidak Relevan";
}

function kategoriDP(dp) {
    if (dp > 0.70) return "Sangat Baik";
    if (dp > 0.40) return "Baik";
    if (dp > 0.20) return "Cukup";
    if (dp > 0.00) return "Jelek";
    return "Sangat Jelek";
}

function kategoriKesukaran(p) {
    if (p < 0.30) return "SUKAR";
    if (p <= 0.70) return "SEDANG";
    return "MUDAH";
}

function kategoriReliabilitas(r) {
    if (r >= 0.80) return "Sangat Tinggi";
    if (r >= 0.60) return "Tinggi";
    if (r >= 0.40) return "Cukup";
    if (r >= 0.20) return "Rendah";
    return "Sangat Rendah";
}

function korelasi(x, y) {
    let n = x.length, sx = 0, sy = 0, sxy = 0, sx2 = 0, sy2 = 0;
    for (let i = 0; i < n; i++) {
        sx  += x[i]; sy  += y[i];
        sxy += x[i] * y[i];
        sx2 += x[i] * x[i];
        sy2 += y[i] * y[i];
    }
    let atas  = (n * sxy) - (sx * sy);
    let bawah = Math.sqrt(((n * sx2) - (sx * sx)) * ((n * sy2) - (sy * sy)));
    if (bawah === 0) return 0;
    return atas / bawah;
}