# Особистий допуск

Софія збирає своїх: не публічна вечірка, а особисте запрошення. Візуальний прийом — модна друкована афіша, що перетворюється на відривний квиток.

Unbounded Variable — щільний, геометричний афішний заголовок; IBM Plex Sans — людяні вузькі підписи й основний текст. Обидва підтримують українську кирилицю (включно Ґґ Єє Іі Її).

Кольори: папір #f1efe9, чорнило #191917, вишневий #c72c33, кислотний #d9f36f, срібло #c9c8c2, сірий текст #686762. Червоний відповідає за ритм, лайм використаний лише для особистого допуску.

Сітка: асиметричні великі поля; на desktop текст і фото ділять сцену, на mobile вертикальна афіша з коротшими рядками. Фото — прямий спалах, червоний торт, хром, келихи. Немає портрета вигаданої іменинниці.

Початок: накладений квиток із швидким типографічним відкриттям, пропуск і повтор. Фірмова взаємодія: відірвати корінець і прочитати послання. GSAP керує лише входом і двома типами scroll-сцен; CSS — наведенням і відривом. Нативний скрол; reduced motion вимикає переміщення.

Ієрархія без декоративних eyebrow, overline та номерів розділів. Великі заголовки, фото й простір формують ритм. Нумерацію кадрів і фіктивний номер допуску прибрано. Дати, час, назви даних і підписи форми — функціональні, зі звичайним регістром і читабельним розміром.

## Изображения и исходные промпты

Созданы встроенным image_gen. Исходники сохранены инструментом; JPEG-копии для сайта конвертированы локально без изменения композиции.

## Главный кадр

Файл: `public/images/cake.jpg`

Промпт:

> Use case: photorealistic-natural. Asset: hero photograph for an experimental editorial birthday invitation, NOT a website mockup. Create an exceptionally stylish fashion magazine direct-flash still life photograph. A small vintage round cake covered entirely in deep cherry red piped buttercream, seven very thin tall ivory birthday candles with tiny flames, dark glossy red cherries, on a sculptural reflective silver chrome cake stand. On black satin tablecloth, nearly black background, a little cream folding fabric in the foreground. Hard on-camera flash, deep shadows, analog point and shoot film grain, intimate after-dark Kyiv birthday party, high-end editorial taste, tactile appetizing icing, restrained, candid imperfect composition. Entire cake visible center-right with generous black negative space above and at left. Portrait 4:5 composition. No people, no text, no typography, no graphics, no balloons, no logos. Save final image.

## Второй кадр

Файл: `public/images/cheers.jpg`

Промпт:

> Use case: photorealistic-natural. Asset: editorial birthday invitation mood photograph. Landscape closeup of two friends' hands clinking elegant crystal coupe glasses, wearing small silver rings and a black sleeve, late night celebration, glossy cherries scattered on a chrome tray in foreground, hard direct on-camera flash, deep black background with burgundy velvet, candid movement slight blur, 35mm point-and-shoot photography film grain. Youthful sophisticated fashion party in Kyiv, restrained deep cherry red black cream silver palette. Moody stylish and tactile, no faces, no text, no typography, no logos, no collage. Landscape 3:2.
