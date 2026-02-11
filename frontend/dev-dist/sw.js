/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  let nextDefineUri;
  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) return;
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}

define(['./workbox-237f2c1f'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * Correction effectuée ici : Suppression du doublon de révision
   * et nettoyage de la structure de l'objet.
   */
  workbox.precacheAndRoute([{
    "url": "index.html",
    "revision": "0.p5moaf1u5jk"
  }], {});
  workbox.cleanupOutdatedCaches();

  workbox.registerRoute(
    new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html"), {
      allowlist: [/^\/$/]
    })
  );

  // Stratégie pour l'API : Réseau en priorité, Cache en secours
  workbox.registerRoute(
    /^https:\/\/api\.*/i, 
    new workbox.NetworkFirst({
      "cacheName": "api-cache",
      "networkTimeoutSeconds": 10,
      plugins: [
        new workbox.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 86400 // 24 heures
        }), 
        new workbox.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    }), 
    'GET'
  );

  // Stratégie pour les images : Cache en priorité
  workbox.registerRoute(
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/i, 
    new workbox.CacheFirst({
      "cacheName": "images-cache",
      plugins: [
        new workbox.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 2592000 // 30 jours
        })
      ]
    }), 
    'GET'
  );

  // Stratégie pour les scripts et styles
  workbox.registerRoute(
    /\.(?:js|css)$/i, 
    new workbox.StaleWhileRevalidate({
      "cacheName": "static-resources",
      plugins: [
        new workbox.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 604800 // 7 jours
        })
      ]
    }), 
    'GET'
  );

}));
//# sourceMappingURL=sw.js.map