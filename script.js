const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player properties
let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: "blue",
    speed: 2
};

// Food properties
let food = [];
for (let i = 0; i < 50; i++) {
    food.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 5,
        color: "green"
    });
}

// Bot properties
let bots = [];
for (let i = 0; i < 5; i++) {
    bots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 15,
        color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
        speed: Math.random() * 1.5 + 1,
        direction: Math.random() * 2 * Math.PI
    });
}

// Controls
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Game loop
function update() {
    // Move player towards the mouse
    let dx = mouse.x - player.x;
    let dy = mouse.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    }

    // Check collision with food for the player
    food = food.filter(f => {
        let fx = f.x - player.x;
        let fy = f.y - player.y;
        let dist = Math.sqrt(fx * fx + fy * fy);
        if (dist < player.radius + f.radius) {
            player.radius += 0.5; // Grow player
            return false; // Remove food
        }
        return true;
    });

    // Move bots randomly and check collision with food
    bots.forEach(bot => {
        bot.x += Math.cos(bot.direction) * bot.speed;
        bot.y += Math.sin(bot.direction) * bot.speed;

        // Change direction when hitting the wall
        if (bot.x < 0 || bot.x > canvas.width) bot.direction = Math.PI - bot.direction;
        if (bot.y < 0 || bot.y > canvas.height) bot.direction = -bot.direction;

        // Collision with food
        food = food.filter(f => {
            let fx = f.x - bot.x;
            let fy = f.y - bot.y;
            let dist = Math.sqrt(fx * fx + fy * fy);
            if (dist < bot.radius + f.radius) {
                bot.radius += 0.5; // Grow bot
                return false; // Remove food
            }
            return true;
        });
    });
}

// Render loop
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();

    // Draw food
    food.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = f.color;
        ctx.fill();
        ctx.closePath();
    });

    // Draw bots
    bots.forEach(bot => {
        ctx.beginPath();
        ctx.arc(bot.x, bot.y, bot.radius, 0, Math.PI * 2);
        ctx.fillStyle = bot.color;
        ctx.fill();
        ctx.closePath();
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
