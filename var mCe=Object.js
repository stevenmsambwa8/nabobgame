// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getDatabase, ref, set, get, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Initialize Firebase app
const firebaseConfig = {
  apiKey: "AIzaSyC_VKdV-KsIzUiOb7jFLsYXdTsuGkLiS-Q",
  authDomain: "register-71bde.firebaseapp.com",
  projectId: "register-71bde",
  storageBucket: "register-71bde.appspot.com",
  messagingSenderId: "412548441298",
  appId: "1:412548441298:web:e0fb2b6c5fbd4af7d0b90b"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to initialize Firebase app and authentication
function initializeFirebaseApp() {
  const auth = getAuth(app);
  auth.languageCode = "en";
  return { auth };
}

// Function to display user information
function displayUserInfo(user) {
  const displayName = user.displayName.split(' ')[0];
  const email = user.email;
  const photoURL = user.photoURL;
  const username = user.displayName; // Use the full display name as the username
  const uid = user.uid.substring(0, 4);

  function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
      element.innerText = text;
    } else {
      console.warn(`Element with ID '${id}' not found.`);
    }
  }

  function updateElementSrc(id, src) {
    const element = document.getElementById(id);
    if (element) {
      element.src = src;
    } else {
      console.warn(`Element with ID '${id}' not found.`);
    }
  }

  updateElementText("displayName", displayName);
  updateElementText("karibujina", displayName);
  updateElementText("pubgjina", displayName);
  updateElementText("email", email);
  updateElementText("karibuemail", email);
  updateElementSrc("profilePicture", photoURL);
  updateElementSrc("menupicha", photoURL);
  updateElementSrc("karibupicha", photoURL);
  updateElementText("userId", uid);

  // Return username for use in other functions
  return username;
}

// Function to handle like button setup
async function setupLikeButton(username, likeButtonId) {
  const uniqueItemId = likeButtonId.replace('like', ''); // Extracting the item ID from the button ID
  const likeDocRef = ref(db, `likes/${username}/${uniqueItemId}`);

  const likeButtonElement = document.getElementById(likeButtonId);
  const likeButton = likeButtonElement.querySelector('input[type="checkbox"]');
  const likesCountSpan = likeButtonElement.querySelector('.count-likes');

  const likeDocSnapshot = await get(likeDocRef);
  const isLiked = likeDocSnapshot.exists();

  likeButton.checked = isLiked;
  likeButton.setAttribute('data-item-id', uniqueItemId); // Set the data-item-id attribute

  likeButton.addEventListener('change', async (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      await set(likeDocRef, true);
      // Increment likes count in total_likes node
      await runTransaction(ref(db, `total_likes/${uniqueItemId}`), (currentData) => {
        return (currentData || 0) + 1;
      });
    } else {
      await set(likeDocRef, null);
      // Decrement likes count in total_likes node
      await runTransaction(ref(db, `total_likes/${uniqueItemId}`), (currentData) => {
        return Math.max((currentData || 0) - 1, 0);
      });
    }
  });

  onValue(ref(db, `total_likes/${uniqueItemId}`), (snapshot) => {
    likesCountSpan.innerText = snapshot.exists() ? snapshot.val() : 0;
  });
}

// Function to setup all like buttons
async function setupAllLikeButtons(username) {
  const likeButtonCount = 4000; // Change this to the total number of like buttons
  for (let i = 1; i <= likeButtonCount; i++) {
    await setupLikeButton(username, `like${i}`);
  }
}
async function setupSubscribeButton(username, subscribeButtonId) {
  const subscribeButtonElement = document.getElementById(subscribeButtonId);
  const subscribeCheckbox = subscribeButtonElement.querySelector('input[type="checkbox"]');
  const uniqueChannelId = subscribeButtonId.replace('subscribe', ''); // Extracting the channel ID from the button ID
  const channelDocRef = ref(db, `channels/${uniqueChannelId}`);

  // Check if the user is already subscribed to the channel
  const channelSnapshot = await get(channelDocRef);
  const isSubscribed = channelSnapshot.exists() && channelSnapshot.val().subscribers && channelSnapshot.val().subscribers[username];

  if (isSubscribed) {
    // If user is already subscribed, remove or disable the subscribe button
    subscribeButtonElement.parentNode.removeChild(subscribeButtonElement); // This removes the button from the DOM
    subscribeCheckbox.disabled = true;
  } else {
    subscribeCheckbox.addEventListener('change', async (event) => {
      const isChecked = event.target.checked;
      if (isChecked) {
        await set(channelDocRef, {
          subscribers: {
            [username]: true
          }
        });
      }
    });
  }

  // Display total subscribers count
  onValue(ref(db, `channels/${uniqueChannelId}`), (snapshot) => {
    const channelData = snapshot.val();
    const totalSubscribers = channelData ? Object.keys(channelData.subscribers || {}).length : 0;
    const subscriberCountElement = document.getElementById(`subscriberCount${uniqueChannelId}`);
    if (subscriberCountElement) {
      subscriberCountElement.innerText = `${totalSubscribers}`;
    }
  });
}

// Function to setup all subscribe buttons
async function setupAllSubscribeButtons(username) {
  const subscribeButtonCount = 5; // Change this to the total number of subscribe buttons
  for (let i = 1; i <= subscribeButtonCount; i++) {
    await setupSubscribeButton(username, `subscribe${i}`);
  }
}

// Main function to initialize app, handle user authentication, and setup buttons
function main() {
  const { auth } = initializeFirebaseApp();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in");
      const username = displayUserInfo(user); // Get the username
      setupAllLikeButtons(username);
      setupAllSubscribeButtons(username);
    } else {
      console.log("User is signed out");
    }
  });
}

// Call the main function to start the application
main();