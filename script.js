document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login successful!');
        } else {
            alert('Login failed!');
        }
    });
});

document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Signup successful!');
        } else {
            alert('Signup failed!');
        }
    });
});