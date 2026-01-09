function validate(){
    var unv = document.getElementById("un").value.trim();
    var une = document.getElementById("un");
    var emv = document.getElementById("mail").value.trim();
    var eme = document.getElementById("mail");

    var unR = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]+$/;
    var emR = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (unv === "") {
        une.placeholder = "Please enter your username";
        une.style.border = "2px solid red";
        return false;
    } 
    else if (unv.includes(" ") || !unR.test(unv)) {
        une.value = "";
        une.placeholder = "Invalid username";
        une.style.border = "2px solid red";
        return false;
    } 
    else {
        une.style.border = "";
    }

    if (emv === "") {
        eme.placeholder = "Email is required.";
        eme.style.border = "2px solid red";
        return false;
    } else if (!emR.test(emv)) {
        eme.value = "";
        eme.placeholder = "Enter a valid email address.";
        eme.style.border = "2px solid red";
        return false;
    } else {
        eme.style.border = "2px solid transparent";
        document.querySelectorAll(".otp-input__field").forEach(input => input.disabled = false);
        document.querySelector(".otp-input__field").focus();
    }

    window.alert('OTP has sent to your e-mail. Kindly Check it and enter it here.');
    return true;
}

function getPass(){
    var b1 = document.getElementById("one").value;
    var b2 = document.getElementById("two").value;
    var b3 = document.getElementById("three").value;
    var b4 = document.getElementById("four").value;
    var o1 = document.getElementById("one");
    var o2 = document.getElementById("two");
    var o3 = document.getElementById("three");
    var o4 = document.getElementById("four");

    var otpv = b1 + b2 + b3 + b4;
    var otpR = /^\d{4}$/;

    if(b1 === "" || b2 === "" || b3 === "" || b4 === ""){
        window.alert('Please enter OTP and get your password.');
        o1.style.border = "2px solid red";
        o2.style.border = "2px solid red";
        o3.style.border = "2px solid red";
        o4.style.border = "2px solid red";
        return false;
    }
    else if(!otpR.test(otpv)){
        window.alert("Invalid OTP. Please check again and enter correctly!");
        o1.style.border = "2px solid red";
        o2.style.border = "2px solid red";
        o3.style.border = "2px solid red";
        o4.style.border = "2px solid red";
        return false;
    }
    else{
        document.querySelector(".form-con").style.display = "none";
        document.querySelector(".con-mes").style.display = "block";
    }
    return true;
}

document.querySelectorAll(".otp-input__field").forEach((input, index, inputs) => {
    input.addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, ""); // Allow only digits
        if (this.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
    
    input.addEventListener("keydown", function(event) {
        if (event.key === "Backspace" && index > 0 && this.value === "") {
            inputs[index - 1].focus();
        }
    });
});