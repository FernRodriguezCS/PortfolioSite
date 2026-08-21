const form = document.querySelector("#contactForm");

form.addEventListener('submit', (event) => {
    event.preventDefault(); // prevent refresh

    const formData = new FormData(event.target);

    const formProps = Object.fromEntries(formData);

    console.log(formProps);
})