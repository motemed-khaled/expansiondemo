'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "c8a4b4afedee58dfc831d8ece8dbd959",
"version.json": "8066f5636dbc5d1a9ec7742f33f58544",
"index.html": "c2280911182e604441e3f31d42676244",
"/": "c2280911182e604441e3f31d42676244",
"main.dart.js": "07bae1ba192ac805f45e36523e52eee1",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"favicon.png": "5072607cff487a84eb0ef7451bdb944c",
"icons/Icon-192.png": "56dbf7dd3b95a20c792dd2c70af59c48",
"icons/Icon-maskable-192.png": "56dbf7dd3b95a20c792dd2c70af59c48",
"icons/Icon-maskable-512.png": "7ce3e5a04a64fb74bae69283e8ca17a5",
"icons/Icon-512.png": "7ce3e5a04a64fb74bae69283e8ca17a5",
"manifest.json": "09a608e7db9b3ad7b6f51d73d4682b93",
"assets/AssetManifest.json": "fbd46a308aa211ebb5c4bc52d219b677",
"assets/NOTICES": "ed12300b5496dd20a6c952c7fae7a11e",
"assets/FontManifest.json": "145f013e3bbe4def196f5f07bd91820c",
"assets/AssetManifest.bin.json": "0ad807eace99c977a156326831dec9e3",
"assets/packages/awesome_notifications/test/assets/images/test_image.png": "c27a71ab4008c83eba9b554775aa12ca",
"assets/packages/window_manager/images/ic_chrome_unmaximize.png": "4a90c1909cb74e8f0d35794e2f61d8bf",
"assets/packages/window_manager/images/ic_chrome_minimize.png": "4282cd84cb36edf2efb950ad9269ca62",
"assets/packages/window_manager/images/ic_chrome_maximize.png": "af7499d7657c8b69d23b85156b60298c",
"assets/packages/window_manager/images/ic_chrome_close.png": "75f4b8ab3608a05461a31fc18d6b47c2",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/packages/pay_platform_interface/pubspec.yaml": "6022d416cd934235cba30df63422e02b",
"assets/packages/moyasar/assets/images/visa.png": "b5b468913fc30cad4635fed4de9544ab",
"assets/packages/moyasar/assets/images/amex.png": "31520ab000dea0aaf6f5f000a6a0ee09",
"assets/packages/moyasar/assets/images/mastercard.png": "c376b0b9c33c308e330f0edd789a2fe2",
"assets/packages/moyasar/assets/images/mada.png": "95ce9fd8a741b34cd1a9db1452c8f049",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "f979ae99a21e8e7743479566feaa8bda",
"assets/fonts/MaterialIcons-Regular.otf": "7ad08c2b0805de6cd4de5323e82bfa4f",
"assets/assets/test/test_slider.png": "9a070aaf1c70dac7f84bbb822c8d5617",
"assets/assets/test/ring.mp3": "b079fd5f93760d8f99b5138c72da358d",
"assets/assets/test/big_pizza.png": "28483b2a70786be178c98bb06da7698e",
"assets/assets/test/pizza.png": "af1bfa9990a8874e44a80e1aa50eeb84",
"assets/assets/icons/apple-pay-svgrepo-com.svg": "0b70f3f19c513f2881dd507dbd539c9c",
"assets/assets/icons/star_in.svg": "2eb03c25aec3fb764eb6d16ead9e7b10",
"assets/assets/icons/clear.svg": "d5224956d7b2be3a55df8929914b2998",
"assets/assets/icons/loading.json": "0dc807aafa826dbca0c69d7e277c06c5",
"assets/assets/icons/empty.png": "517e54ec0307ceb9b46a09e6594bd0a2",
"assets/assets/icons/customer_support.svg": "96c42b4d7f690afed63997be98189998",
"assets/assets/icons/cart.svg": "fdd1ef07e655a05adefbe25b50d0c910",
"assets/assets/icons/logo_splash_android12_dark.png": "2c35b51a84b8059f816b628bf5978492",
"assets/assets/icons/check.svg": "12f8754d9cbdbd0dff409db154e2e230",
"assets/assets/icons/min.svg": "5c3cf62505ed66b6456a9e44aeb1ec13",
"assets/assets/icons/add.svg": "c5bbcac1287ce5743d7cbf4a4215e6bc",
"assets/assets/icons/Stc_pay.svg": "5350941682b774ed587c9ca0466ac9b1",
"assets/assets/icons/loading_white.svg": "e4a9545c5e406583fc5b51aa1b5d4684",
"assets/assets/icons/splash.png": "6e94a78df6e7696fdf27c714d453fd16",
"assets/assets/icons/logo.png": "7d785952a00ff8ff738dabd538c11af1",
"assets/assets/icons/meal.png": "0c0aa9ba2ab6783c2884a1ab106adaef",
"assets/assets/icons/star.svg": "161f626a923460c1e2dd031a94f1e006",
"assets/assets/icons/profile.png": "c4cd8f8dd5dd68bc2d125fb198b10eb8",
"assets/assets/icons/iconoir_wallet.svg": "f4794c6d50a60cb143814a1c33ebf43e",
"assets/assets/icons/menu.svg": "45ea3a26cf63590e1d6068a042eb98ee",
"assets/assets/icons/logo_splash_android12.png": "6ae3ee3dbc3f19f27baec90e251d0afe",
"assets/assets/icons/mastercard-old-svgrepo-com.svg": "b1b4eee338af60061b4d2dd385f4988c",
"assets/assets/icons/bg.png": "0c3cb2076cbbbc0936bd3e0ed38e92cd",
"assets/assets/fonts/Cairo-SemiBold.ttf": "e11b6bc7a07669209243fce5de153be4",
"assets/assets/fonts/Cairo-Medium.ttf": "2b76c14c6934874d64ab85d92c4949e1",
"assets/assets/fonts/Cairo-Regular.ttf": "5ccd08939f634db387c40d6b4b0979c3",
"assets/assets/fonts/Cairo-Light.ttf": "c4a2ada0dd57e03f921b8f7d45820268",
"assets/assets/fonts/Cairo-Bold.ttf": "ad486798eb3ea4fda12b90464dd0cfcd",
"assets/assets/translations/en.json": "302bfd1f1c465e4c87f7af2a22c8d61f",
"assets/assets/translations/ar.json": "5de786bb7a3b5544b085cada6723ccf1",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/skwasm.js.symbols": "c3c05bd50bdf59da8626bbe446ce65a3",
"canvaskit/canvaskit.js.symbols": "74a84c23f5ada42fe063514c587968c6",
"canvaskit/skwasm.wasm": "4051bfc27ba29bf420d17aa0c3a98bce",
"canvaskit/chromium/canvaskit.js.symbols": "ee7e331f7f5bbf5ec937737542112372",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.wasm": "399e2344480862e2dfa26f12fa5891d7",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.wasm": "9251bb81ae8464c4df3b072f84aa969b",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
