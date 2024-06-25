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
        })
        .catch((error) => {
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
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
          console.log(errorMessage);
        });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(() => {
        window.location.href = "./index.html";
      }).catch((error) => {
        alert(error);
      });
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      const uname = document.getElementById("uname");
      if (uname) uname.innerHTML = user.email;
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

  // Fetch Now playing movie
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NTlkYWEyMjNiZGQzY2IzNzkyNTk5MDdmNTkxM2NhYyIsIm5iZiI6MTcxOTMzMDU2Ni4zNjEzODIsInN1YiI6IjY2N2FlNTQ3ZmQ3MmNjZmRjZTVhMzYzNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kAW1bb0FfBlaqALldkj4G215DvJznqjK8N3ZzYfDteE'
    }
  };
  let pageNowPlaying = 1;
  const btnPreNowPlaying = document.getElementById("pren");
  const btnNextNowPlaying = document.getElementById("nextn");

  if (btnPreNowPlaying && btnNextNowPlaying) {
    if (pageNowPlaying === 1) {
      btnPreNowPlaying.classList.add("disa"); // Disable previous button initially
    }

    btnNextNowPlaying.addEventListener("click", () => {
      pageNowPlaying++;
      if (pageNowPlaying > 1) {
        btnPreNowPlaying.classList.remove("disa"); // Enable previous button if we move to page > 1
      }
      fetchNowPlayingMovies(pageNowPlaying);
    });

    btnPreNowPlaying.addEventListener("click", () => {
      if (pageNowPlaying > 1) {
        pageNowPlaying--;
        if (pageNowPlaying === 1) {
          btnPreNowPlaying.classList.add("disa"); // Disable previous button if we are on page 1
        }
        fetchNowPlayingMovies(pageNowPlaying);
      }
    });

    fetchNowPlayingMovies(pageNowPlaying);
  }

  function fetchNowPlayingMovies(page) {
    const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`;
    fetch(url, options)
      .then(response => response.json())
      .then((res) => {
        const nowPlayingMovie = document.getElementById("nowplaying-sec");
        if (nowPlayingMovie) {
          nowPlayingMovie.innerHTML = ''; // Clear previous content
          res.results.forEach(element => {
            // Create a div for each movie poster and details
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('cap');
            movieDiv.innerHTML = `
              <img src="https://image.tmdb.org/t/p/w500${element.poster_path}" alt="${element.title}">
              <h2>${element.title}</h2>
            `;
            // Add click event listener to each movie poster
            movieDiv.addEventListener('click', () => {
              // Store selected movie details in localStorage or pass via URL parameters
              localStorage.setItem('selectedMovie', JSON.stringify(element));
              // Navigate to movie.html
              window.location.href = "./movie.html";
            });
            // Append the movie div to the container
            nowPlayingMovie.appendChild(movieDiv);
          });
        }
      })
      .catch(err => console.error(err));
  }

  let pagePopular = 1;
  const btnPrePopular = document.getElementById("prep");
  const btnNextPopular = document.getElementById("nextp");

  if (btnPrePopular && btnNextPopular) {
    if (pagePopular === 1) {
      btnPrePopular.classList.add("disa"); // Disable previous button initially
    }

    btnNextPopular.addEventListener("click", () => {
      pagePopular++;
      if (pagePopular > 1) {
        btnPrePopular.classList.remove("disa"); // Enable previous button if we move to page > 1
      }
      fetchPopularMovies(pagePopular);
    });

    btnPrePopular.addEventListener("click", () => {
      if (pagePopular > 1) {
        pagePopular--;
        if (pagePopular === 1) {
          btnPrePopular.classList.add("disa"); // Disable previous button if we are on page 1
        }
        fetchPopularMovies(pagePopular);
      }
    });

    fetchPopularMovies(pagePopular);
  }

  function fetchPopularMovies(page) {
    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
    fetch(url, options)
      .then(response => response.json())
      .then((res) => {
        const popularMovie = document.getElementById("popplaying-sec");
        if (popularMovie) {
          popularMovie.innerHTML = ''; // Clear previous content
          res.results.forEach(element => {
            // Create a div for each movie poster and details
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('cap');
            movieDiv.innerHTML = `
              <img src="https://image.tmdb.org/t/p/w500${element.poster_path}" alt="${element.title}">
              <h2>${element.title}</h2>
            `;
            // Add click event listener to each movie poster
            movieDiv.addEventListener('click', () => {
              // Store selected movie details in localStorage or pass via URL parameters
              localStorage.setItem('selectedMovie', JSON.stringify(element));
              // Navigate to movie.html
              window.location.href = "./movie.html";
            });
            // Append the movie div to the container
            popularMovie.appendChild(movieDiv);
          });
        }
      })
      .catch(err => console.error(err));
  }

  let pageTopRated = 1;
  const btnPreTopRated = document.getElementById("pret");
  const btnNextTopRated = document.getElementById("nextt");

  if (btnPreTopRated && btnNextTopRated) {
    if (pageTopRated === 1) {
      btnPreTopRated.classList.add("disa"); // Disable previous button initially
    }

    btnNextTopRated.addEventListener("click", () => {
      pageTopRated++;
      if (pageTopRated > 1) {
        btnPreTopRated.classList.remove("disa"); // Enable previous button if we move to page > 1
      }
      fetchTopRatedMovies(pageTopRated);
    });

    btnPreTopRated.addEventListener("click", () => {
      if (pageTopRated > 1) {
        pageTopRated--;
        if (pageTopRated === 1) {
          btnPreTopRated.classList.add("disa"); // Disable previous button if we are on page 1
        }
        fetchTopRatedMovies(pageTopRated);
      }
    });

    fetchTopRatedMovies(pageTopRated);
  }

  function fetchTopRatedMovies(page) {
    const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`;
    fetch(url, options)
      .then(response => response.json())
      .then((res) => {
        const topRatedMovie = document.getElementById("topplaying-sec");
        if (topRatedMovie) {
          topRatedMovie.innerHTML = ''; // Clear previous content
          res.results.forEach(element => {
            // Create a div for each movie poster and details
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('cap');
            movieDiv.innerHTML = `
              <img src="https://image.tmdb.org/t/p/w500${element.poster_path}" alt="${element.title}">
              <h2>${element.title}</h2>
            `;
            // Add click event listener to each movie poster
            movieDiv.addEventListener('click', () => {
              // Store selected movie details in localStorage or pass via URL parameters
              localStorage.setItem('selectedMovie', JSON.stringify(element));
              // Navigate to movie.html
              window.location.href = "./movie.html";
            });
            // Append the movie div to the container
            topRatedMovie.appendChild(movieDiv);
          });
        }
      })
      .catch(err => console.error(err));
  }

  let pageUpcoming = 1;
  const btnPreUpcoming = document.getElementById("preu");
  const btnNextUpcoming = document.getElementById("nextu");

  if (btnPreUpcoming && btnNextUpcoming) {
    if (pageUpcoming === 1) {
      btnPreUpcoming.classList.add("disa"); // Disable previous button initially
    }

    btnNextUpcoming.addEventListener("click", () => {
      pageUpcoming++;
      if (pageUpcoming > 1) {
        btnPreUpcoming.classList.remove("disa"); // Enable previous button if we move to page > 1
      }
      fetchUpcomingMovies(pageUpcoming);
    });

    btnPreUpcoming.addEventListener("click", () => {
      if (pageUpcoming > 1) {
        pageUpcoming--;
        if (pageUpcoming === 1) {
          btnPreUpcoming.classList.add("disa"); // Disable previous button if we are on page 1
        }
        fetchUpcomingMovies(pageUpcoming);
      }
    });

    fetchUpcomingMovies(pageUpcoming);
  }

  function fetchUpcomingMovies(page) {
    const url = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`;
    fetch(url, options)
      .then(response => response.json())
      .then((res) => {
        const upcomingMovie = document.getElementById("upplaying-sec");
        if (upcomingMovie) {
          upcomingMovie.innerHTML = ''; // Clear previous content
          res.results.forEach(element => {
            // Create a div for each movie poster and details
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('cap');
            movieDiv.innerHTML = `
              <img src="https://image.tmdb.org/t/p/w500${element.poster_path}" alt="${element.title}">
              <h2>${element.title}</h2>
            `;
            // Add click event listener to each movie poster
            movieDiv.addEventListener('click', () => {
              // Store selected movie details in localStorage or pass via URL parameters
              localStorage.setItem('selectedMovie', JSON.stringify(element));
              // Navigate to movie.html
              window.location.href = "./movie.html";
            });
            // Append the movie div to the container
            upcomingMovie.appendChild(movieDiv);
          });
        }
      })
      .catch(err => console.error(err));
  }

  // Firebase Authentication State Change Listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      const uname = document.getElementById("uname");
      if (uname) uname.innerHTML = user.email;
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

  // Logout Functionality
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(() => {
        window.location.href = "./index.html";
      }).catch((error) => {
        alert(error);
      });
    });
  }
});

