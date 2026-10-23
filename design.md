# Особистий допуск

Софія збирає своїх: не публічна вечірка, а особисте запрошення. Візуальний прийом — модна друкована афіша, що перетворюється на відривний квиток.

Unbounded Variable — щільний, геометричний афішний заголовок; IBM Plex Sans — людяні вузькі підписи й основний текст. Обидва підтримують українську кирилицю (включно Ґґ Єє Іі Її).

Кольори: папір #f1efe9, чорнило #191917, приглушений бургунді #61182d, кислотний #d9f36f, срібло #c9c8c2, сірий текст #686762. Бургунді поєднує акцентний текст і кольорові блоки з першим конвертом; лайм використаний лише для особистого допуску. Фотографії збережені в оригінальному кольорі.

Сітка: асиметричні великі поля; на desktop текст і фото ділять сцену, на mobile вертикальна афіша з коротшими рядками. Фото — прямий спалах, червоний торт, хром, келихи. Немає портрета вигаданої іменинниці.

Початок: реалістичний паперовий конверт кольору бургунді з фактурою, тінями складок і фотографічною сургучною печаткою «с.». Печатка піднімається, клапан розкривається, світла картка виходить із конверта. Відкриття лише після натискання на печатку або кнопку, пропуск і повтор; у reduced motion — статичний конверт і відкриття без руху. Фірмова взаємодія: відірвати корінець і прочитати послання. GSAP керує лише входом і двома типами scroll-сцен; CSS — наведенням і відривом. Нативний скрол; reduced motion вимикає переміщення.

Ієрархія без декоративних eyebrow, overline та номерів розділів. Великі заголовки, фото й простір формують ритм. Нумерацію кадрів і фіктивний номер допуску прибрано. Дати, час, назви даних і підписи форми — функціональні, зі звичайним регістром і читабельним розміром.

Дрес-код: центрована композиція з рівними паперовими картками-зразками чорного, вишневого, молочного, срібного й пудрового; кольори прив’язані до палітри сайту. Натискання змінює світло дзеркальної диско-кулі й показує пораду для образу. Рух короткий, без нескінченних циклів, із підтримкою reduced motion.

## Изображения и исходные промпты

Созданы встроенным image_gen. Исходники сохранены инструментом; JPEG-копии для сайта конвертированы локально без изменения композиции.

## Сургучная печать

Файл: `public/images/wax-seal-burgundy.webp`. Создан встроенным image_gen, уменьшен до 512 px с сохранением прозрачности для анимированного конверта.

Промпт:

> Use case: product-mockup. Asset type: transparent cutout wax seal for a real animated invitation envelope on a website. Generate one photorealistic hand-poured burgundy wax seal, seen perfectly straight from above, centered, full object visible with a small transparent margin on a square canvas. Deep wine burgundy wax #66152e, translucent garnet edges, organic subtly uneven pooled perimeter, raised rolled lip around a round pressed center, minute bubbles and natural surface imperfections. Debossed lowercase monogram 'с.' (Cyrillic small es followed by one dot, visually like c.), a simple elegant rounded geometric letter, formed in the SAME burgundy wax, engraved into the center. One fine concentric recessed ring. Directional large soft light from upper left creates realistic pale pink specular highlights along the wax lip, deep occlusion shadows inside engraving and soft self-shadowing; restrained photographic macro detail. Real sealing wax, NOT a flat vector, not plastic, not metallic. No envelope, no paper, no gold, no additional objects or text, no background, no watermark. Genuine alpha transparency around the complete seal, no opaque square or checkerboard.

## Главный кадр

Файл: `public/images/cake.jpg`

Промпт:

> Use case: photorealistic-natural. Asset: hero photograph for an experimental editorial birthday invitation, NOT a website mockup. Create an exceptionally stylish fashion magazine direct-flash still life photograph. A small vintage round cake covered entirely in deep cherry red piped buttercream, seven very thin tall ivory birthday candles with tiny flames, dark glossy red cherries, on a sculptural reflective silver chrome cake stand. On black satin tablecloth, nearly black background, a little cream folding fabric in the foreground. Hard on-camera flash, deep shadows, analog point and shoot film grain, intimate after-dark Kyiv birthday party, high-end editorial taste, tactile appetizing icing, restrained, candid imperfect composition. Entire cake visible center-right with generous black negative space above and at left. Portrait 4:5 composition. No people, no text, no typography, no graphics, no balloons, no logos. Save final image.

## Второй кадр

Файл: `public/images/cheers.jpg`

Промпт:

> Use case: photorealistic-natural. Asset: editorial birthday invitation mood photograph. Landscape closeup of two friends' hands clinking elegant crystal coupe glasses, wearing small silver rings and a black sleeve, late night celebration, glossy cherries scattered on a chrome tray in foreground, hard direct on-camera flash, deep black background with burgundy velvet, candid movement slight blur, 35mm point-and-shoot photography film grain. Youthful sophisticated fashion party in Kyiv, restrained deep cherry red black cream silver palette. Moody stylish and tactile, no faces, no text, no typography, no logos, no collage. Landscape 3:2.
