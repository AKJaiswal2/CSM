// API URL
const apiUrl = "https://csm-assignment.onrender.com";

// Track user subscription tier
let userSubscription = "free"; // 'free' or 'pro'
let accessToken;

// Functions to show/hide forms
function showLoginForm() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("imageUploadForm").style.display = "none";
  document.getElementById("imageGrid").style.display = "none";
}

async function showImageUploadForm() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("imageUploadForm").style.display = "block";
  document.getElementById("imageGrid").style.display = "none";
}

function showImageGrid(images) {
  const imageList = document.getElementById("imageList");
  imageList.innerHTML = "";

  images.forEach((image) => {
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("image");

    const img = document.createElement("img");
    img.src = apiUrl + "/uploads/" + image.filename;

    const downloadLink = document.createElement("a");
    downloadLink.href = apiUrl + "/uploads/" + image.filename;
    downloadLink.textContent = "Download";

    imageDiv.appendChild(img);
    imageDiv.appendChild(downloadLink);
    imageList.appendChild(imageDiv);
  });

  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("imageGrid").style.display = "block";
}

// Function to perform login
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Perform login API call and handle response
  try {
    const response = await fetch(apiUrl + "/user/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    accessToken = data.data.accessToken;

    if (response.ok) {
      // Set user subscription tier
      userSubscription = data.data.subscriptionTier;
      await showImageUploadForm();
      await fetchImages();

      if (userSubscription === "pro" || userSubscription === "free") {
        document.getElementById("subscriptionTier").style.display = "block";
      } else {
        alert(data.error);
      }
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to perform sign up
async function signup() {
  const fullName = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  // Perform sign up API call and handle response
  try {
    const response = await fetch(apiUrl + "/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      userSubscription = data.data.subscriptionTier;

      alert("Sign up successful. Please log in.");
      showLoginForm();
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function updateSubscription() {
  const selectedTier = document.querySelector(
    'input[name="subscription"]:checked'
  ).value;

  try {
    const response = await fetch(apiUrl + "/user/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken, // Replace with your actual token
      },
      body: JSON.stringify({ subscriptionTier: selectedTier }),
    });

    const data = await response.json();

    if (response.ok) {
      userSubscription = selectedTier;
      alert("Subscription updated successfully");
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to perform image upload
async function uploadImage() {
  const imageFile = document.getElementById("imageFile").files[0];
  try {
    const formData = new FormData();
    formData.append("avatar", imageFile);

    const response = await fetch(apiUrl + "/user/upload", {
      method: "POST",
      body: formData,
      headers: { Authorization: accessToken },
    });

    const data = await response.json();

    if (response.ok) {
      alert("Image uploaded successfully");
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to fetch user's uploaded images
async function fetchImages() {
  try {
    const response = await fetch(apiUrl + "/user/images", {
      method: "GET",
      headers: { Authorization: accessToken },
    });

    const data = await response.json();

    if (response.ok) {
      showImageGrid(data.data.uploadedImages);
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
