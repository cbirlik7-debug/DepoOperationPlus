# Depo Operasyon Plus — Proje Dokümanı

#proje #depo #malkabul #demo

> Teknoloji mağazası depo operasyonlarını tek bir web uygulaması üzerinden yönetmeyi amaçlayan proje. Mağaza müdürüne demo sunumu hedefiyle geliştiriliyor.

---

## 1. Projenin Amacı

Mağaza deposundaki günlük mal yönetim işlemlerini (mal kabul, seri numarası girişi, tutanak, transfer, evrak takibi) **tek bir web uygulamasında** birleştirmek. Uygulama üç farklı cihazdan aynı anda kullanılabilecek:

- Şirket telefonu
- Bilgisayar
- MDE cihazı (el terminali)

Hepsi aynı adresi tarayıcıdan açar, aynı veriyi görür. Cihazlar arası kopukluk ortadan kalkar.

---

## 2. Çözülen Sorunlar

| Mevcut Sorun | Çözüm |
|---|---|
| İşlemler 3 farklı cihaz/kanalda dağınık yapılıyor | Tek web uygulaması, her cihazdan aynı sistem |
| Kağıt irsaliyeler elle sisteme giriliyor | İrsaliye fotoğrafından AI ile otomatik veri çıkarma |
| Seri no / IMEI girişleri elle, tekrarlı ve yavaş | Kameradan çoklu barkod okuma, ürün başına tek EAN okutma |
| Koliler paletlerde karışıyor, hangi ürün hangi koliden geldiği bilinmiyor | Koli bazlı gruplama — her ürün, okutulduğu koli bilgisiyle saklanıyor |
| Eksik/fazla/hasarlı tutanakları elle tutuluyor | Sistem otomatik tutanak taslağı oluşturuyor, onayla kesinleşiyor |
| İrsaliye ile fiili sayım karşılaştırması manuel | Sipariş kapatılırken otomatik karşılaştırma |
| Evrak takibi dağınık | Kayıt no / tutanak no sistemi — numara irsaliye üzerine not ediliyor |

---

## 3. Temel Kavramlar ve İş Akışı

### Barkod Hiyerarşisi
1. **Sipariş (ORDER) barkodu** → okutulunca o siparişteki tüm beklenen koliler listelenir
2. **Koli barkodu** → iki tip tanınıyor:
   - *e-İrsaliye kolisi* (SAP NO — örn. Media Markt kolileri)
   - *Kurye/3PL kolisi* (SSCC — örn. Ekol Lojistik; çifte etiket uyarısı verir)
3. **Ürün barkodu (EAN/UPC)** → ürünü tanımlar
4. **Tanımlayıcılar** → IMEI 1, IMEI 2, Seri No (ürüne göre 0-3 adet gerekebilir)

### Mal Kabul Akışı
1. Koli barkodu okutulur (sipariş otomatik bulunur) *veya* sipariş no ile giriş yapılır
2. Koli açılır, ürünler okutulur
3. Ürün barkodu **sadece ilk ünitede** okutulur — sonraki üniteler için yalnızca IMEI/Seri yeterli (sistem aktif ürünü hatırlar)
4. Koli kapatılır → sonraki koli
5. Tüm koliler bitince **Sipariş Kontrol** → okutulan/beklenen karşılaştırması
6. Uyuyorsa **Siparişi Tamamla** → kayıt no (KYT-xxxxxx) alınır, irsaliyeye not edilir
7. Sorun varsa **Tutanak Hazırla** → artikel + durum (eksik/fazla/hasarlı) + adet → tutanak no (TUT-xxxxxx)

### Depo Kodları (ileride)
- 99: Gelen ürünler
- 9: Satışa açık
- 6: Mağaza deposu satışa açık
- 5: Teşhir
- 11: Servis
- 30: Giden transfer ve iadeler

---

## 4. Şu Ana Kadar Yapılanlar ✅

- [x] Mobil öncelikli, ekran-ekran gezinen uygulama arayüzü (telefon/tablet)
- [x] Kamera ile barkod okuma (BarcodeDetector API)
- [x] MDE klavye-modu desteği (manuel giriş alanı, tetikle okutma)
- [x] Sipariş barkodu → koli listesi görünümü
- [x] İki koli tipinin otomatik tanınması (e-İrsaliye / Kurye-SSCC)
- [x] Karışık palet / çifte etiket uyarısı
- [x] Esnek tanımlayıcı sistemi (ürüne göre 0-3 barkod: IMEI1, IMEI2, Seri)
- [x] **Aktif ürün hafızası** — ürün barkodu tek okutma, sonraki üniteler sadece IMEI/Seri
- [x] **Çoklu barkod algılama + dokunarak rol atama** — ekranda tüm barkodlar sarı çerçeveli; 1. dokunuş EAN, 2. IMEI1, 3. IMEI2, basılı tutma Seri No
- [x] Kolideki ürün listesinde silme (✕) ve özet sayım (toplam adet + farklı ürün dökümü)
- [x] Kapalı koliyi yeniden açma (loglu)
- [x] Beklenmeyen ürün tespiti + barkod eşleştirme asistanı ("bu barkod hangi kaleme ait?")
- [x] Sipariş kontrol ekranı — artikel bazlı / **koliye göre sıralı** görünüm
- [x] Siparişi tamamlama + kayıt numarası üretimi
- [x] Tutanak modülü (eksik/fazla/hasarlı seçimi, taslak, onay, tutanak no)
- [x] İrsaliye fotoğrafından AI ile veri çıkarma (şimdilik yalnızca Claude.ai önizlemesinde çalışıyor)
- [x] GitHub Pages üzerinde HTTPS yayın (kamera erişimi için gerekli)
- [x] Sürüm rozeti (sağ üst köşe — deploy kontrolü için)
- [x] Çoklu taramada **otomatik rol tanıma** (15 hane+Luhn=IMEI, kontrol haneli 13/12/8 hane=EAN, harfli=Seri) + alt panelden dokunarak düzeltme/yeniden okutma + kutu titremesi/koordinat düzeltmesi
- [x] **Supabase veritabanı entegrasyonu** — kalıcı veri, cihazlar arası senkron, koli çakışma kontrolü ("başka cihazda kapatılmış" uyarısı)
- [x] **Yönetici paneli (admin.html)** — sipariş/koli/ürün/mağaza/tedarikçi oluşturma, girilen-girilmeyen takibi (ilerleme çubukları), koli→mağaza teslim durumu, tutanak yönetimi, günlük rapor
- [x] **Gerçek zamanlı senkron** — bir cihazda okutulan, diğer cihazlarda ve panelde otomatik görünür (Supabase Realtime)
- [x] Koli yeniden açma butonu (mobil koli listesi)
- [x] Mobil sipariş kartlarında giriş ilerleme yüzdesi
- [x] **Ürün Sorgula ekranı** — IMEI/Seri/EAN ile arama: hangi koli, hangi sipariş, ne zaman girilmiş (elle veya kamerayla)
- [x] **Sesli + titreşimli geri bildirim** — başarılı okutma, ara adım ve hata için farklı ton/titreşim (ekrana bakmadan çalışmaya izin verir)
- [x] **Çevrimdışı kuyruk** — Wi-Fi giderse okutmalar telefonda birikir, bağlantı gelince (veya her 20 sn'de bir otomatik) sıraya göre gönderilir; rozette "X bekliyor" sayacı
- [x] **PWA desteği** — ana ekrana eklenebilir uygulama simgesi, servis çalışanı (service worker) ile uygulama kabuğu önbelleğe alınır
- [x] **Panelde CSV dışa aktarma** — Siparişler, Tutanaklar ve Günlük Rapor sekmelerinden tek tıkla Excel'de açılabilir CSV indirme
- [x] **Tutanak PDF çıktısı** — panelde her tutanak için imza alanlı, resmi görünümlü PDF belgesi üretimi (tedarikçiye gönderilecek evrak)
- [x] **Demo verisini sıfırlama** — panelde tek tıkla okutulan koli/ürün/tutanak verilerini temizleme (tanımlar korunur), sunum öncesi temiz başlangıç için
- [x] **Fotoğraflı tutanak** — sahada tutanak satırına fotoğraf ekleme (Supabase Storage), panelde küçük resim + PDF çıktısında ayrı "Fotoğraflı Kanıtlar" sayfası
- [x] **Beklenmeyen Ürünler ekranı (panel)** — katalogda tanımsız barkodları listeler, tek tıkla gerçek ürüne bağlama (kataloğa da otomatik eklenir, bir daha "beklenmeyen" çıkmaz) veya silme
- [x] **Tedarikçi Performansı ekranı (panel)** — tedarikçi bazlı sipariş/tamamlanan/tutanak sayısı + eksik/fazla/hasarlı dökümü + "sorun oranı" rozeti

**Güncel sürüm:** mobil v2.0 + admin v1.3

---

## 5. Bilinen Kısıtlar ⚠️

- Veriler tarayıcı hafızasında — **sayfa yenilenince silinir** (henüz veritabanı yok)
- İrsaliye AI okuma özelliği GitHub Pages'te çalışmaz (API anahtarı + backend gerektirir; Claude.ai önizlemesinde çalışır)
- Çoklu barkod algılama Chrome/Edge (Android) gerektirir — iOS Safari'de BarcodeDetector desteği sınırlı
- Sipariş/koli/ürün verileri şimdilik kod içinde tanımlı demo verisi
- Kullanıcı girişi / yetkilendirme yok

---

## 6. Yol Haritası 🗺️

### Kısa vadede (demo onayı sonrası)
- [ ] Kullanıcı girişi — kim, ne zaman, hangi işlemi yaptı (+RLS politikalarının sıkılaştırılması)
- [ ] İrsaliye okuma: ERTELENDİ. Tercih edilen yön: Tesseract.js + şablon-bazlı kural ayrıştırma (tamamen yerel/ücretsiz) veya e-İrsaliye karekodundan doğrudan veri çekme

### Orta vadede
- [ ] Depo kodları arası transfer/iade modülü (5, 6, 9, 11, 30, 99)
- [ ] Eksik irsaliye talep ve takip listesi
- [ ] Evrak arşivi (irsaliye/tutanak fotoğraflarının saklanması ve aranması)

### Uzun vadede
- [ ] Bilgisayar için yönetici paneli (günlük özet, açık tutanaklar, stok görünümü)
- [ ] Mağazalar arası stok görünürlüğü
- [ ] ERP entegrasyonu (mal kabulün ERP'ye otomatik işlenmesi)

---

## 7. Teknik Notlar

- **Tek dosya:** `index.html` — HTML + CSS + JavaScript bir arada, kurulum gerektirmez
- **Barkod okuma:** Tarayıcının yerleşik `BarcodeDetector` API'si (EAN-13, Code128, QR vb.)
- **Kamera şartı:** `getUserMedia` yalnızca **HTTPS** üzerinde çalışır → bu yüzden GitHub Pages kullanılıyor
- **Yayın:** GitHub repo `DepoOperationPlus` → Settings → Pages → main branch
- **Güncelleme yöntemi:** Yeni `index.html` dosyasını repoya üzerine yazarak yükle; sağ üstteki sürüm numarasından deploy'un yansıdığını doğrula
- **AI irsaliye okuma:** Anthropic Claude görüntü API'si; üretimde API anahtarını gizlemek için sunucu tarafı proxy şart

---

## 8. Sunum Demo Senaryosu (Müdür Sunumu)

1. Telefonda GitHub linkinden aç — "kurulum yok, her cihazda aynı adres"
2. Gerçek koli barkodu okut (Media Markt 7071616921) → sipariş otomatik gelir
3. Samsung A17: ürün barkodu bir kez → IMEI'ler art arda → "seri elle girilmiyor"
4. X1'den 3 koli senaryosu → Sipariş Kontrol → **Koliye Göre Sırala** → "eksik çıkarsa hangi kolide olduğunu biliyoruz"
5. Tutanak oluştur → TUT numarası → "tutanak artık sistemde"
6. Final: Claude.ai önizlemesinde gerçek kağıt irsaliye fotoğrafı → kalem listesi otomatik çıkar

---

## 9. Kurulum Notları (Supabase)

1. supabase.com → ücretsiz proje aç (bölge: Frankfurt)
2. SQL Editor → `supabase-schema.sql` çalıştır → sonra `supabase-schema-v2-ek.sql` çalıştır
3. Settings → API → Project URL + anon key kopyala
4. `index.html` ve `admin.html` en üstündeki SUPABASE_URL / SUPABASE_ANON_KEY satırlarına yapıştır
5. İki dosyayı GitHub'a yükle
6. Test: panelde sipariş+koli oluştur → telefonda koliyi okut → panelde durumun canlı değiştiğini gör

Not: Supabase bağlanmazsa mobil uygulama otomatik olarak yerel demo moduna düşer, bozulmaz.

---

## 10. Yeni Dosyalar (v1.9)

- `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — PWA dosyaları, index.html ile aynı klasöre (repo köküne) yüklenmeli
- Bu dosyalar olmadan uygulama normal çalışır, sadece "ana ekrana ekle" ve çevrimdışı önbellek özelliği pasif kalır

---

## 11. Yeni Dosya (v2.0)

- `supabase-schema-v3-ek.sql` — tutanak fotoğrafları için Supabase Storage bucket + izinleri. SQL Editor'de çalıştırın (fotoğraflı tutanak özelliği için gerekli, olmadan diğer her şey çalışmaya devam eder)

---

*Son güncelleme: 14 Temmuz 2026 — mobil v2.0 + admin v1.3*
