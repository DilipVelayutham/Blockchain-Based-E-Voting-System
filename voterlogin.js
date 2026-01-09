"use strict";
const containerEl = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
registerBtn.addEventListener("click", () =>
  containerEl.classList.add("active"),
);
loginBtn.addEventListener("click", () =>
  containerEl.classList.remove("active"),
);

function verifyAdmin(){
  var usernameval = document.getElementById("username").value.trim();
  var usernameele = document.getElementById("username"); 
  var fpassval = document.getElementById("fpass").value.trim();
  var fpassele = document.getElementById("fpass");
  var npassval = document.getElementById("npass").value.trim();
  var npassele = document.getElementById("npass");
  var emailval = document.getElementById("email").value.trim();
  var emailele = document.getElementById("email");

  var usernameRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]+$/;
  var passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d.*\d).{8,}$/;
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (usernameval === "") {
      usernameele.placeholder = "Username should not be Empty.";
      usernameele.style.border = "2px solid red";
      return false;
  } else if (usernameval.includes(" ") || !usernameRegex.test(usernameval)) {
      usernameele.value = "";
      window.alert("Please include One uppercase, One special character and digits in your Username. Spaces are not allowed.")
      usernameele.placeholder = "Try different.";
      usernameele.style.border = "2px solid red";
      return false;
  } else {
      usernameele.style.border = "";
  }

  if (fpassval === "") {
      fpassele.placeholder = "Password is required.";
      fpassele.style.border = "2px solid red";
      return false;
  } else if (!passwordRegex.test(fpassval)) {
      fpassele.value = "";
      window.alert("Please include One uppercase, One special character and atleast 2 numbers with minimum 8 characters in your Password");
      fpassele.placeholder = "Try different.";
      fpassele.style.border = "2px solid red";
      return false;
  } else {
      fpassele.style.border = "";
  }

  if (emailval === "") {
      emailele.placeholder = "Email is required.";
      emailele.style.border = "2px solid red";
      return false;
  } else if (!emailRegex.test(emailval)) {
      emailele.value = "";
      emailele.placeholder = "Enter a valid email address.";
      emailele.style.border = "2px solid red";
      return false;
  } else {
      emailele.style.border = "";
  }

  if (npassval === "") {
      npassele.placeholder = "Re-enter password to confirm it.";
      npassele.style.border = "2px solid red";
      return false;
  } else if (npassval !== fpassval) {
      npassele.value = "";
      npassele.placeholder = "Passwords do not match.";
      npassele.style.border = "2px solid red";
      return false;
  } else {
      npassele.style.border = "";
  }

    window.location = "landingpage.html";
    return true;
  
}

function login(){
  var uval = document.getElementById("un").value.trim();
  var uele = document.getElementById("un");
  var fpval = document.getElementById("p").valur.trim();
  var fpele = document.getElementById("p");

  var uR = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]+$/;
  var pR = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d.*\d).{8,}$/;

  if (uval === "") {
    uele.placeholder = "Username required.";
    uele.style.border = "2px solid red";
    return false;
} else if (uval.includes(" ") || !uR.test(uval)) {
    uele.value = "";
    uele.placeholder = "Invalid Username";
    uele.style.border = "2px solid red";
    return false;
} else {
    uele.style.border = "";
}

if (fpval === "") {
  fpele.placeholder = "Password is required.";
  fpele.style.border = "2px solid red";
  return false;
} else if (!pR.test(fpval)) {
  fpele.value = "";
  fpele.placeholder = "Wrong Password.";
  fpele.style.border = "2px solid red";
  return false;
} else {
  fpele.style.border = "";
}

window.location = "Home.html";
return true;
}