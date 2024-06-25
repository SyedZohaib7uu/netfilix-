// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDksK5-M6iYigDSUJu4R1I8TDHJHnEU_mQ",
  authDomain: "netfilixauth.firebaseapp.com",
  projectId: "netfilixauth",
  storageBucket: "netfilixauth.appspot.com",
  messagingSenderId: "1044377023883",
  appId: "1:1044377023883:web:f0bc9900c803b2a7002b8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Login form Items
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginemail");
  const loginPassword = document.getElementById("loginpassword");

  // Sign form Items
  const signForm = document.getElementById("signForm");
  
  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");

  // Attach event listener for sign up form
  if (signForm) {
    signForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const firstName = document.getElementById("firstname").value;
      const signEmail = document.getElementById("Signemail").value;
      const signPass = document.getElementById("signpass").value;

      createUserWithEmailAndPassword(auth, signEmail, signPass)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          console.log(user);
          window.location.href = "./home.html";
        //   alert("Successfully Created Account");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
          console.log(errorMessage);
        });
    });
  }

  // Attach event listener for login form
  if (loginForm) {
    loginForm.addEventListener("submit", (ee) => {
      ee.preventDefault();
      const loginEmailValue = loginEmail.value;
      const loginPasswordValue = loginPassword.value;

      signInWithEmailAndPassword(auth, loginEmailValue, loginPasswordValue)
        .then((userCredential) => {
          // Signed in 

          const user = userCredential.user;
          console.log(user);
          window.location.href = "./home.html";
        //   alert("Successfully Logged In");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
          console.log(errorMessage);
        });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(() => {
        // alert("SignOut Successfully");
        window.location.href = "./index.html";
      }).catch((error) => {
        alert(error);
      });
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      document.getElementById("uname").innerHTML=user.email

      console.log("User is signed in:", user);
      if (window.location.pathname === "/index.html" || window.location.pathname === "/register.html") {
        window.location.href = "./home.html";
      }
    } else {
      // User is signed out
      console.log("No user is signed in.");
      if (window.location.pathname === "/home.html") {
        window.location.href = "./index.html";
      }
    }
  });
});
