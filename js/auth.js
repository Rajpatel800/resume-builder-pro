// Firebase Auth integration for ResumeSAAS
// Paste your Firebase config here
firebase.initializeApp({
  apiKey: "AIzaSyB9SCGabjQOgLXTz4CrgvZe55GGfU-sHhA",
  authDomain: "resumesaas-7b077.firebaseapp.com",
  projectId: "resumesaas-7b077"
});
const auth = firebase.auth();

// Hide modal by default
const modal = document.getElementById('auth-modal');
if (modal) modal.style.display = 'none';

// Show modal when account button is clicked
const accountBtn = document.getElementById('account-btn');
if (accountBtn) {
  accountBtn.addEventListener('click', () => {
    if (modal) modal.style.display = 'flex';
  });
}

// Sign out logic
const signOutBtn = document.getElementById('signout-btn');
if (signOutBtn) {
  signOutBtn.addEventListener('click', () => {
    auth.signOut();
  });
}

// Update UI on auth state change
function updateAuthUI(user) {
  if (!modal) return;
  if (user) {
    modal.style.display = 'none';
    if (accountBtn) accountBtn.style.display = 'none';
    if (signOutBtn) signOutBtn.style.display = 'inline-block';
  } else {
    if (accountBtn) accountBtn.style.display = 'inline-block';
    if (signOutBtn) signOutBtn.style.display = 'none';
  }
}
auth.onAuthStateChanged(updateAuthUI);

// Sign Up
const signUpForm = document.getElementById('sign-up-form');
if (signUpForm) {
  signUpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        alert('Account created!');
      })
      .catch(error => alert(error.message));
  });
}

// Sign In
const signInForm = document.getElementById('sign-in-form');
if (signInForm) {
  signInForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        alert('Signed in!');
      })
      .catch(error => alert(error.message));
  });
} 