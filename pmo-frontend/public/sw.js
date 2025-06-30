// public/sw.js (Versão Minimalista e Segura para Desenvolvimento)

const CACHE_NAME = 'pmo-digital-cache-v3'; // Incrementamos a versão para limpar o cache antigo
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  // Deixaremos o cache de outros assets para uma etapa posterior de otimização
];

self.addEventListener('install', event => {
  console.log('SW: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('SW: Ativando...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => {
        if (!cacheWhitelist.includes(cacheName)) {
          console.log('SW: Deletando cache antigo:', cacheName);
          return caches.delete(cacheName);
        }
      })
    )).then(() => self.clients.claim())
  );
});

// ========================================================
// ||       NÃO VAMOS INTERCEPTAR O EVENTO 'fetch'         ||
// ||      Isso garante que não haverá interferência       ||
// ||         com o servidor de desenvolvimento Vite.       ||
// ========================================================
self.addEventListener('fetch', (event) => {
  // Por enquanto, não fazemos nada. Apenas deixamos a requisição passar.
  // A lógica de cache será adicionada mais tarde, quando otimizarmos para produção.
});