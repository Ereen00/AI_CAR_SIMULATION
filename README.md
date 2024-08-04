Javascript ile OOP kullanılarak hiç bir kütüphanenin yardımı olmadan yapay zeka ile eğitilebilen araba sürüş similasyonu üzerinde denemek ve sonuçları analiz etmek için orjinal koda eklemeler ve çıkartmalar yapıldı.

(Orijinal kod: https://github.com/gniziemazity/Self-driving-car)

Yapılan değişiklikler neticesinde agent'lar öncesine göre daha iyi performanslar göstermeye başladılar. Bu değişiklikler ve sonuçları dosyadaki data klasörünün içinde kayıt edilip sonuçları incelenmek üzere grafik haline döküldü.


**fit-in-reaction-perception** = bir agent'ın önceki generasyonun en iyi performansının yüzde kaçını geçmesi gerektiğini gösterir. Eğer bu değişken %50 ise bir agent önceki generasyonun en iyi performansının yarısını yapması halinde kale alınacaktır, aksi takdirde o agent'dan yeni bir generasyon üretilmeyecektir.

**Detractive fit-in effect & Augmentative fit-in effect** = fit-in-reaction-perception değerinin generasyonun başarısına ya da başarısızlığına göre ne kadar hızlı azaltıp arttıracağına karar verir.
