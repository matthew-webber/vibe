window.addEventListener('load', () => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const scoreContainer = document.getElementById('score-container');

  const tileSize = 20;
  let cols, rows;
  let snake, direction, food, score, loop;

  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - scoreContainer.offsetHeight;
    cols = Math.floor(canvas.width / tileSize);
    rows = Math.floor(canvas.height / tileSize);
  }

  function placeFood() {
    food = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows)
    };
  }

  function startGame() {
    resizeCanvas();
    snake = [{x: 5, y: 5}, {x: 4, y: 5}, {x:3, y:5}];
    direction = 'right';
    score = 0;
    scoreEl.textContent = score;
    placeFood();
    if (loop) clearInterval(loop);
    loop = setInterval(update, 100);
  }

  function turnLeft() {
    if (direction === 'up') direction = 'left';
    else if (direction === 'left') direction = 'down';
    else if (direction === 'down') direction = 'right';
    else if (direction === 'right') direction = 'up';
  }

  function turnRight() {
    if (direction === 'up') direction = 'right';
    else if (direction === 'right') direction = 'down';
    else if (direction === 'down') direction = 'left';
    else if (direction === 'left') direction = 'up';
  }

  function updateDirection(key) {
    if (key === 'ArrowUp' || key === 'w') direction = 'up';
    else if (key === 'ArrowDown' || key === 's') direction = 'down';
    else if (key === 'ArrowLeft' || key === 'a') direction = 'left';
    else if (key === 'ArrowRight' || key === 'd') direction = 'right';
  }

  if (isMobile) {
    canvas.addEventListener('touchstart', (e) => {
      const x = e.touches[0].clientX;
      if (x < canvas.width / 2) turnLeft();
      else turnRight();
    });
  } else {
    document.addEventListener('keydown', (e) => updateDirection(e.key));
  }

  window.addEventListener('resize', resizeCanvas);

  function update() {
    const head = Object.assign({}, snake[0]);
    if (direction === 'up') head.y -= 1;
    else if (direction === 'down') head.y += 1;
    else if (direction === 'left') head.x -= 1;
    else if (direction === 'right') head.x += 1;

    // collisions
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.some(s => s.x === head.x && s.y === head.y)) {
      startGame();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 1;
      scoreEl.textContent = score;
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'lime';
    for (let s of snake) {
      ctx.fillRect(s.x * tileSize, s.y * tileSize, tileSize, tileSize);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
  }

  startGame();
});
