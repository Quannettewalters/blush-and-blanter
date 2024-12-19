document.addEventListener("DOMContentLoaded", async () => {
    const p = await getProfile();
    username.innerText = p.username;
    fullName.value = p.fullName;
    bioText.value = p.bio;
    passwordInput.value = "password";

    saveUserProfile.addEventListener("click", async () => {
        //TODO SAVE
        const payload = {
            fullName: fullName.value,
            bio: bioText.value
        }
        if (passwordInput.value != "password") {
            payload.password = passwordInput.value;
        }
        await saveProfile(payload);
        window.location.href = "messages.html"
    })
});//end loaded