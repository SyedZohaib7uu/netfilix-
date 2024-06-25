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



    // fetch Now playing movie

const options = {
  method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NTlkYWEyMjNiZGQzY2IzNzkyNTk5MDdmNTkxM2NhYyIsIm5iZiI6MTcxOTMzMDU2Ni4zNjEzODIsInN1YiI6IjY2N2FlNTQ3ZmQ3MmNjZmRjZTVhMzYzNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kAW1bb0FfBlaqALldkj4G215DvJznqjK8N3ZzYfDteE'
    }
  };
  
  let page = 1;
  const btnPre = document.getElementById("pren");
  const btnNext = document.getElementById("nextn");

  // Initial fetch of now playing movies
  fetchNowPlayingMovies(page);

  if (page === 1) {
    btnPre.classList.add("disa"); // Disable previous button initially
  }

  btnNext.addEventListener("click", () => {
    page++;
    if (page > 1) {
      btnPre.classList.remove("disa"); // Enable previous button if we move to page > 1
    }
    fetchNowPlayingMovies(page);
  });

  btnPre.addEventListener("click", () => {
    if (page > 1) {
      page--;
      if (page === 1) {
        btnPre.classList.add("disa"); // Disable previous button if we are on page 1
      }
      fetchNowPlayingMovies(page);
    }
  });

  function fetchNowPlayingMovies(page) {
    const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NTlkYWEyMjNiZGQzY2IzNzkyNTk5MDdmNTkxM2NhYyIsIm5iZiI6MTcxOTMzMDU2Ni4zNjEzODIsInN1YiI6IjY2N2FlNTQ3ZmQ3MmNjZmRjZTVhMzYzNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kAW1bb0FfBlaqALldkj4G215DvJznqjK8N3ZzYfDteE'
      }
    };

    fetch(url, options)
      .then(response => response.json())
      .then((res) => {
        const nowPlayingMovie = document.getElementById("nowplaying-sec");
        nowPlayingMovie.innerHTML = ''; // Clear previous content
        res.results.forEach(element => {
          nowPlayingMovie.innerHTML += `
            <div class="cap">
              <img src="https://image.tmdb.org/t/p/w500${element.poster_path}" alt="${element.title}">
              <h2>${element.title}</h2>
            </div>
          `;
        });
      })
      .catch(err => console.error(err));
  }
  var pagepop = 1;
  const btnPrep = document.getElementById("prep");
  const btnNextp = document.getElementById("nextp");
  
  popularMovie(pagepop);
  
  if (pagepop === 1) {
    btnPrep.classList.add("disa");
  }
  
  btnNextp.addEventListener("click", () => {
    pagepop++;
    if (pagepop > 1) {
      btnPrep.classList.remove("disa");
    }
    popularMovie(pagepop);
  });
  
  btnPrep.addEventListener("click", () => {
    if (pagepop > 1) {
      pagepop--;
      if (pagepop === 1) {
        btnPrep.classList.add("disa"); // Disable previous button if we are on page 1
      }
      popularMovie(pagepop);
    }
  });
  
  function popularMovie(pagepop) {
    const urlPopularMovie = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${pagepop}`;
  
    fetch(urlPopularMovie, options)
      .then(response => response.json())
      .then((res) => {
        const pop_playingmovie = document.getElementById("popplaying-sec");
        pop_playingmovie.innerHTML = ''; // Clear previous content
        res.results.forEach(element => {
          console.log(element);
          pop_playingmovie.innerHTML += `
            <div class="cap">
              <img src="https://image.tmdb.org/t/p/w500${element.poster_path}" alt="${element.title}">
              <h2>${element.title}</h2>
            </div>
          `;
        });
      })
      .catch(err => console.error(err));
  }
  var p = 1;
  const btnPret = document.getElementById("pret");
  const btnNextt = document.getElementById("nextt");
  
  topMovie(p);
  
  if (p === 1) {
    btnPret.classList.add("disa");
  }
  
  btnNextt.addEventListener("click", () => {
    p++;
    if (p > 1) {
      btnPret.classList.remove("disa");
    }
    topMovie(p);
  });
  
  btnPret.addEventListener("click", () => {
    if (p > 1) {
      p--;
      if (p === 1) {
        btnPret.classList.add("disa"); // Disable previous button if we are on page 1
      }
      topMovie(p);
    }
  });
  
  function topMovie(p) {
    const urltopMovie = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${p}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NTlkYWEyMjNiZGQzY2IzNzkyNTk5MDdmNTkxM2NhYyIsIm5iZiI6MTcxOTMzMDU2Ni4zNjEzODIsInN1YiI6IjY2N2FlNTQ3ZmQ3MmNjZmRjZTVhMzYzNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kAW1bb0FfBlaqALldkj4G215DvJznqjK8N3ZzYfDteE'
      }
    };
  
    fetch(urltopMovie, options)
      .then(response => response.json())
      .then((res) => {
        // Clear previous content
        var top_playingmovie = document.getElementById("topplaying-sec");
        top_playingmovie.innerHTML = '';
  
        res.results.forEach(element => {
          console.log(element);
          top_playingmovie.innerHTML += `
          <div class="cap">
            <img src="https://image.tmdb.org/t/p/w500${element.poster_path}" alt="">
            <h2>${element.title}</h2>
          </div>
          `;
        });
      })
      .catch(err => console.error(err));
  }
  
});
