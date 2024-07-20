importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

let messaging;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    const firebaseConfig = event.data.config;
    firebase.initializeApp(firebaseConfig);
    messaging = firebase.messaging();
  }
});

self.addEventListener('install', function (event) {
  console.log('Hello world from the Service Worker :call_me_hand:');
});

self.addEventListener('push', function (event) {
  const payload = event.data.json();
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.image
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});