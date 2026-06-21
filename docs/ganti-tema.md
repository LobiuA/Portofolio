# Panduan Ganti Tema / Redesign

> Panduan santai buat Jidan (web-dev pemula) kalau suatu saat mau mengubah tampilan
> portofolio — dari sekadar ganti warna sampai redesign total.

Portofolio ini sengaja dibangun supaya **gampang diganti tampilannya tanpa nyentuh konten.**
Ada 3 level perubahan. Pilih sesuai seberapa besar yang mau diubah.

---

## Prinsip dasar (wajib paham dulu)

Ada 2 hal yang **selalu dipisah** di proyek ini:

| Apa | Di mana | Isi |
|---|---|---|
| **Tampilan (desain)** | `app/globals.css` + `components/*Section.tsx` | warna, font, layout, animasi |
| **Konten (isi)** | `lib/content.ts` + `content/*.json` | semua teks, data event, link, gambar |

**Artinya:** ganti desain TIDAK akan menghapus tulisan/datamu, dan ganti tulisan TIDAK akan
merusak desain. Keduanya hidup terpisah. Ini kunci kenapa redesign jadi aman.

---

## Level 1 — Ganti "rasa" saja (10 menit)

Cocok kalau cuma mau ganti **warna** dan/atau **font**. Tidak perlu sentuh struktur.

### Ganti warna
Buka `app/globals.css`, cari blok `:root` di paling atas. Ubah nilai hex-nya:

```css
:root {
  --bg:    #0A0A0A;   /* warna background utama */
  --ink:   #F2F0EB;   /* warna teks utama */
  --live:  #E8332C;   /* aksen merah (ON AIR) */
  --amber: #F0A500;   /* aksen kuning (label) */
  --line:  #252522;   /* garis pembatas */
}
```

Satu perubahan di sini = SELURUH situs ikut berubah. Itulah gunanya "token".

### Ganti font
Buka `app/layout.tsx`. Font diambil dari Google Fonts lewat `next/font/google`.
Ganti nama font-nya (mis. `Barlow_Condensed`) dengan font lain, sesuaikan variabel & weight.

> Setelah ganti: jalankan `npm run dev`, buka http://localhost:3000, refresh keras
> (Ctrl+Shift+R). Kalau sudah oke → `npm run build` buat memastikan tidak ada error.

---

## Level 2 — Ganti layout / struktur per bagian

Cocok kalau mau ubah **susunan** salah satu section (mis. hero, daftar event), bukan cuma warna.

Tiap bagian punya 1 file sendiri di folder `components/`:

```
HeroSection.tsx        → bagian hero (foto + judul + metrics)
Nav.tsx                → menu atas
WorkSection.tsx        → daftar event
ExperienceSection.tsx  → pengalaman
Footer.tsx             → bagian bawah
```

Mau ubah tata letak hero? Edit `HeroSection.tsx` + class CSS-nya di `globals.css`.
**Tulisan & datanya tetap aman** karena diambil dari `content/*.json` / `lib/content.ts`.

Aturan: jangan menulis teks langsung di file komponen — selalu lewat `lib/content.ts`.

---

## Level 3 — Redesign TOTAL (tema baru dari nol)

Persis seperti waktu mengubah HTML lama → "Broadcast Brutalism". Jangan dikerjakan manual
sepotong-sepotong — pakai alur yang sudah terbukti:

```
Brainstorm  →  Spec  →  Plan  →  Eksekusi (subagent)  →  Review  →  Merge
```

**Cukup bilang ke Claude:** _"Aku mau redesign portofolio jadi tema X"_ — dan alur ini
otomatis dijalankan. Tinggal jawab pertanyaan desainnya.

### Contoh dokumen yang bisa dipakai sebagai cetakan
Ada di vault: `LobiuA_Vault/01-Projects/portfolio-jidan/`
- `design-spec.md` — contoh spec desain lengkap
- `implementation-plan.md` — contoh rencana kerja (10 task)
- `design-handoff/` — contoh design brief + mockup HTML

### Mau pakai template orang (biar nggak desain sendiri)?
Stack kamu Next.js + Tailwind, jadi cocok dengan:
- **shadcn/ui** & **Tailwind UI** — komponen siap pakai
- **vercel.com/templates** — portofolio jadi
- **Awwwards / Dribbble** — buat inspirasi, lalu dibangun ulang

---

## Setelah ganti apa pun — checklist rilis

1. `npm run dev` → cek di http://localhost:3000 (refresh keras: Ctrl+Shift+R)
2. `npm run build` → pastikan lolos (ini gerbang error type & lint)
3. Kalau sudah oke, push ke GitHub:
   ```bash
   git add .
   git commit -m "ganti tema: ..."
   git push
   ```
4. Vercel otomatis deploy ke https://portofoliotmj.vercel.app dalam ~1 menit.

---

## Ingat 3 hal ini saja

1. **Warna & font** → `:root` di `globals.css` + `layout.tsx`
2. **Layout** → file di `components/`
3. **Tulisan/data** → `lib/content.ts` + `content/*.json` (jangan diketik di komponen)

Selebihnya, panggil Claude dan jelaskan maumu. 🎬
