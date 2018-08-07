"use strict";!function(){function e(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function t(t,n,r){var o,i=new Promise(function(i,s){e(o=t[n].apply(t,r)).then(i,s)});return i.request=o,i}function n(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function r(e,n,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return t(this[n],o,arguments)})})}function o(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})})}function i(e,n,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return e=this[n],(r=t(e,o,arguments)).then(function(e){if(e)return new a(e,r.request)});var e,r})})}function s(e){this._index=e}function a(e,t){this._cursor=e,this._request=t}function c(e){this._store=e}function u(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function l(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new u(n)}function p(e){this._db=e}n(s,"_index",["name","keyPath","multiEntry","unique"]),r(s,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),i(s,"_index",IDBIndex,["openCursor","openKeyCursor"]),n(a,"_cursor",["direction","key","primaryKey","value"]),r(a,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(a.prototype[t]=function(){var n=this,r=arguments;return Promise.resolve().then(function(){return n._cursor[t].apply(n._cursor,r),e(n._request).then(function(e){if(e)return new a(e,n._request)})})})}),c.prototype.createIndex=function(){return new s(this._store.createIndex.apply(this._store,arguments))},c.prototype.index=function(){return new s(this._store.index.apply(this._store,arguments))},n(c,"_store",["name","keyPath","indexNames","autoIncrement"]),r(c,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),i(c,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),o(c,"_store",IDBObjectStore,["deleteIndex"]),u.prototype.objectStore=function(){return new c(this._tx.objectStore.apply(this._tx,arguments))},n(u,"_tx",["objectStoreNames","mode"]),o(u,"_tx",IDBTransaction,["abort"]),l.prototype.createObjectStore=function(){return new c(this._db.createObjectStore.apply(this._db,arguments))},n(l,"_db",["name","version","objectStoreNames"]),o(l,"_db",IDBDatabase,["deleteObjectStore","close"]),p.prototype.transaction=function(){return new u(this._db.transaction.apply(this._db,arguments))},n(p,"_db",["name","version","objectStoreNames"]),o(p,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[c,s].forEach(function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t,n=(t=arguments,Array.prototype.slice.call(t)),r=n[n.length-1],o=this._store||this._index,i=o[e].apply(o,n.slice(0,-1));i.onsuccess=function(){r(i.result)}})})}),[s,c].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise(function(o){n.iterateCursor(e,function(e){e?(r.push(e.value),void 0===t||r.length!=t?e.continue():o(r)):o(r)})})})});var d={open:function(e,n,r){var o=t(indexedDB,"open",[e,n]),i=o.request;return i.onupgradeneeded=function(e){r&&r(new l(i.result,e.oldVersion,i.transaction))},o.then(function(e){return new p(e)})},delete:function(e){return t(indexedDB,"deleteDatabase",[e])}};"undefined"!=typeof module?(module.exports=d,module.exports.default=module.exports):self.idb=d}();class DBHelper{static get DATABASE_URL(){return"http://localhost:1337"}static fetchRestaurants(e){DBHelper.fetchRestaurantsFromIDB((t,n)=>{n&&n.length?e(null,n):DBHelper.fetchRestaurantsFromServer((t,n)=>{t?console.log(t):e(null,n)})})}static fetchRestaurantsFromServer(e){fetch(`${DBHelper.DATABASE_URL}/restaurants`).then(e=>e.json()).then(t=>e(null,t))}static fetchRestaurantsFromIDB(e){idb.open("restaurantDB").then(function(e){return e.transaction("restaurants","readonly").objectStore("restaurants").getAll()}).then(t=>e(null,t))}static fetchReviews(e){DBHelper.fetchReviewsFromIDB().then(t=>{t&&t.length?e(null,t):this.fetchReviewsFromServer((t,n)=>{t?console.log(t):e(null,n)})})}static fetchReviewsFromServer(e){fetch(`${DBHelper.DATABASE_URL}/reviews`).then(e=>e.json()).then(t=>e(null,t))}static fetchReviewsFromIDB(){return dbPromiseReview.then(function(e){return e.transaction("reviews","readonly").objectStore("reviews").getAll()})}static fetchReviewsByRestaurantFromServer(e){return fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${e}`).then(e=>e.json())}static fetchReviewsByRestaurantFromIDB(e){return DBHelper.fetchReviewsFromIDB().then(t=>t.filter(t=>t.restaurant_id==e)).then(e=>(console.log(e),e))}static fetchReviewsByRestaurantID(e,t){DBHelper.fetchReviews((n,r)=>{n&&t(n,null);const o=r.filter(t=>t.restaurant_id==e);t(null,o)})}static fetchPendingReviewsFromIDB(){return dbPendingPromise.then(function(e){return e.transaction("pendingReviews","readonly").objectStore("pendingReviews").getAll()})}static clearPendingReviewsIDB(){return dbPendingPromise.then(function(e){e.transaction("pendingReviews","readwrite").objectStore("pendingReviews").clear().onsuccess=function(e){return"Pending reviews database clear!"}})}static savePendingReviewToPengingReviewsDB(e){return dbPendingPromise.then(function(t){t.transaction("pendingReviews","readwrite").objectStore("pendingReviews").add(e)})}static saveReviewToReviewsDB(e){return dbPromiseReview.then(function(t){t.transaction("reviews","readwrite").objectStore("reviews").add(e)})}static saveReviewToServer(e){return e instanceof FormData||(e=JSON.stringify(e)),fetch(`${DBHelper.DATABASE_URL}/reviews`,{method:"POST",body:e}).catch(e=>console.log(e))}static fetchRestaurantById(e,t){DBHelper.fetchRestaurantsFromIDB((n,r)=>{if(n)t(n,null);else{const n=r.find(t=>t.id==e);n?t(null,n):t("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(e,t){DBHelper.fetchRestaurants((n,r)=>{if(n)t(n,null);else{const n=r.filter(t=>t.cuisine_type==e);t(null,n)}})}static fetchRestaurantByNeighborhood(e,t){DBHelper.fetchRestaurantsFromIDB((n,r)=>{if(n)t(n,null);else{const n=r.filter(t=>t.neighborhood==e);t(null,n)}})}static fetchRestaurantByCuisineAndNeighborhood(e,t,n){DBHelper.fetchRestaurants((r,o)=>{if(r)n(r,null);else{let r=o;"all"!=e&&(r=r.filter(t=>t.cuisine_type==e)),"all"!=t&&(r=r.filter(e=>e.neighborhood==t)),n(null,r)}})}static fetchNeighborhoods(e){DBHelper.fetchRestaurantsFromIDB((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].neighborhood),r=t.filter((e,n)=>t.indexOf(e)==n);e(null,r)}})}static fetchCuisines(e){DBHelper.fetchRestaurantsFromIDB((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].cuisine_type),r=t.filter((e,n)=>t.indexOf(e)==n);e(null,r)}})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e){return e.photograph?`/img/${e.photograph}.webp`:"/img/nia.webp"}static mapMarkerForRestaurant(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:DBHelper.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}static getPendingFavoritesFromIDB(e){DBHelper.fetchRestaurantsFromIDB((t,n)=>{if(t)e(t,null);else{const t=n.filter(e=>1==e.updatedIsFavorite);e(null,t)}})}static togglePendingToUpdateFavoriteInLocal(e){return e.updatedIsFavorite=!e.updatedIsFavorite,idb.open("restaurantDB").then(t=>{return t.transaction("restaurants","readwrite").objectStore("restaurants").put(e)})}static setPendingToUpdateFavoriteInLocal(e,t){return e.updatedIsFavorite=t,idb.open("restaurantDB").then(t=>{return t.transaction("restaurants","readwrite").objectStore("restaurants").put(e)})}static sumbitPendingFavorites(){DBHelper.getPendingFavoritesFromIDB((e,t)=>{t.forEach(e=>{DBHelper.updateFavoriteInServer(e,(e,t)=>{e&&console.log(e)}),DBHelper.setPendingToUpdateFavoriteInLocal(e,!1)})})}static toggleFavoriteInLocal(e){return e.is_favorite=!e.is_favorite,idb.open("restaurantDB").then(t=>{return t.transaction("restaurants","readwrite").objectStore("restaurants").put(e)}).catch(e=>console.log(e))}static updateFavoriteInServer(e,t){fetch(`${DBHelper.DATABASE_URL}/restaurants/${e.id}/?is_favorite=${e.is_favorite}`,{method:"PUT"}).then(e=>e.json()).then(e=>{t(null,e)}).catch(e=>{t(e,null)})}static toggleFavorite(e){DBHelper.toggleFavoriteInLocal(e),DBHelper.updateFavoriteInServer(e,(t,n)=>{if(t)return console.log(t),DBHelper.setPendingToUpdateFavoriteInLocal(e,!0),navigator.serviceWorker.ready.then(function(e){e.sync.register("is-favorite-submission")}),void console.log(t)})}}"indexedDB"in window||console.log("This browser doesn't support IndexedDB");var dbPromise=idb.open("restaurantDB",10,function(e){if(!e.objectStoreNames.contains("restaurants"))e.createObjectStore("restaurants",{keyPath:"id"})});dbPromise.then(e=>{DBHelper.fetchRestaurants((t,n)=>{t&&console.log(t),n.forEach(function(t){e.transaction("restaurants","readwrite").objectStore("restaurants").put(t)})})});