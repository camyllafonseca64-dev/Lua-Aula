const phases = [
  {
    name: 'Lua Nova',
    description: 'A Lua fica entre a Terra e o Sol. Seu lado iluminado está voltado para longe de nós, por isso quase não a vemos.',
    illumination: 'Iluminação aparente: 0%',
    fraction: 0,
    day: 0
  },
  {
    name: 'Crescente Inicial',
    description: 'Um fino arco iluminado começa a aparecer no céu. A cada noite, a parte visível iluminada aumenta.',
    illumination: 'Iluminação aparente: cerca de 12%',
    fraction: 0.107,
    day: 3.2
  },
  {
    name: 'Quarto Crescente',
    description: 'Metade do disco lunar está iluminada. A Lua está a aproximadamente um quarto do caminho em sua órbita.',
    illumination: 'Iluminação aparente: cerca de 50%',
    fraction: 0.25,
    day: 7.4
  },
  {
    name: 'Gibosa Crescente',
    description: 'Mais da metade da Lua está iluminada, mas ela ainda não chegou à fase cheia. A porção iluminada continua crescendo.',
    illumination: 'Iluminação aparente: cerca de 88%',
    fraction: 0.39,
    day: 11.5
  },
  {
    name: 'Lua Cheia',
    description: 'A Terra fica aproximadamente entre o Sol e a Lua. Vemos todo o disco lunar iluminado.',
    illumination: 'Iluminação aparente: 100%',
    fraction: 0.5,
    day: 14.8
  },
  {
    name: 'Gibosa Minguante',
    description: 'Após a Lua Cheia, a parte iluminada que vemos começa a diminuir, embora ainda seja maior que a metade.',
    illumination: 'Iluminação aparente: cerca de 88%',
    fraction: 0.61,
    day: 18
  },
  {
    name: 'Quarto Minguante',
    description: 'Novamente vemos metade do disco iluminada, agora com a porção visível diminuindo a cada noite.',
    illumination: 'Iluminação aparente: cerca de 50%',
    fraction: 0.75,
    day: 22.1
  },
  {
    name: 'Minguante Final',
    description: 'Resta um arco fino de luz antes que a Lua retorne à fase Nova e um novo ciclo comece.',
    illumination: 'Iluminação aparente: cerca de 12%',
    fraction: 0.893,
    day: 26.3
  }
];

const questions = [
  {
    question: 'Em qual fase a Lua parece estar totalmente iluminada?',
    options: ['Lua Nova', 'Quarto Crescente', 'Lua Cheia', 'Minguante Final'],
    answer: 2
  },
  {
    question: 'Quanto tempo dura, em média, um ciclo completo das fases da Lua?',
    options: ['7 dias', '14 dias', '29,5 dias', '365 dias'],
    answer: 2
  },
  {
    question: 'O que acontece na Lua Nova?',
    options: ['Vemos todo o disco iluminado', 'A face iluminada fica voltada para longe da Terra', 'A Lua deixa de orbitar a Terra', 'A sombra da Terra cobre a Lua todo mês'],
    answer: 1
  },
  {
    question: 'Em qual fase vemos metade do disco iluminado enquanto a iluminação aumenta?',
    options: ['Quarto Crescente', 'Lua Cheia', 'Quarto Minguante', 'Lua Nova'],
    answer: 0
  },
  {
    question: 'Por que as fases da Lua acontecem?',
    options: ['A sombra das nuvens cobre partes da Lua', 'A Lua muda de tamanho', 'Vemos diferentes porções de sua metade iluminada pelo Sol', 'A Terra apaga a luz lunar'],
    answer: 2
  },
  {
    question: 'Qual fase vem depois da Lua Cheia?',
    options: ['Crescente Inicial', 'Quarto Crescente', 'Lua Nova', 'Gibosa Minguante'],
    answer: 3
  }
];

let moonId = 0;

function moonMarkup(fraction, label, sizeClass = '') {
  const radius = 50;
  const center = 50;
  const phaseAngle = Math.PI * 2 * fraction;
  const waxing = fraction <= 0.5;
  const side = waxing ? 1 : -1;
  const pathPoints = [];
  const id = `lunar-surface-${moonId}`;
  moonId += 1;

  if (fraction > 0.001 && fraction < 0.999) {
    for (let step = 0; step <= 40; step += 1) {
      const angle = -Math.PI / 2 + side * Math.PI * step / 40;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      pathPoints.push(`${step === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`);
    }

    for (let step = 40; step >= 0; step -= 1) {
      const y = -radius + radius * 2 * step / 40;
      const edge = Math.sqrt(Math.max(0, radius * radius - y * y));
      const x = center + Math.cos(phaseAngle) * edge;
      pathPoints.push(`L${x.toFixed(2)} ${(center + y).toFixed(2)}`);
    }
  } else if (fraction >= 0.999) {
    pathPoints.push('M0 50 A50 50 0 1 0 100 50 A50 50 0 1 0 0 50');
  }

  const imagePosition = 'x="-21" y="-16" width="142" height="142"';
  const light = pathPoints.length
    ? `<path fill="url(#${id}-photo)" d="${pathPoints.join(' ')} Z"/>`
    : '';
  return `<span class="moon ${sizeClass}" role="img" aria-label="${label}"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="${id}-clip"><circle cx="50" cy="50" r="49.5"/></clipPath><pattern id="${id}-photo" width="100" height="100" patternUnits="userSpaceOnUse"><image href="assets/lua-apollo-17.jpg" ${imagePosition} preserveAspectRatio="none"/></pattern></defs><g clip-path="url(#${id}-clip)"><rect width="100" height="100" fill="url(#${id}-photo)"/><circle cx="50" cy="50" r="50" fill="#080d19" opacity=".76"/>${light}</g></svg></span>`;
}

document.querySelector('.hero-moon').outerHTML = moonMarkup(0.5, 'Lua iluminada', 'moon--hero');

const phasePicker = document.querySelector('#phase-picker');
const phaseMoon = document.querySelector('#phase-moon');
const phaseName = document.querySelector('#phase-name');
const phaseDescription = document.querySelector('#phase-description');
const phasePosition = document.querySelector('#phase-position');
const phaseIllumination = document.querySelector('#phase-illumination');

function renderPhases() {
  phasePicker.innerHTML = phases.map((phase, index) => `
    <button class="phase-option" type="button" data-phase="${index}" aria-pressed="${index === 0}">
      ${moonMarkup(phase.fraction, phase.name)}
      <span>${phase.name}</span>
    </button>
  `).join('');
}

function selectPhase(index) {
  const phase = phases[index];
  phasePicker.querySelectorAll('.phase-option').forEach((button, buttonIndex) => {
    button.setAttribute('aria-pressed', String(buttonIndex === index));
  });
  phaseMoon.innerHTML = moonMarkup(phase.fraction, phase.name, 'moon--detail');
  phaseName.textContent = phase.name;
  phaseDescription.textContent = phase.description;
  phasePosition.textContent = `FASE ${String(index + 1).padStart(2, '0')} DE 08`;
  phaseIllumination.textContent = phase.illumination;
}

renderPhases();
selectPhase(0);
phasePicker.addEventListener('click', event => {
  const button = event.target.closest('[data-phase]');
  if (button) selectPhase(Number(button.dataset.phase));
});

const cycleLength = 29.5;
const cycleDay = document.querySelector('#cycle-day');
const simulationMoon = document.querySelector('#simulation-moon');
const simulationPhase = document.querySelector('#simulation-phase');
const cycleProgress = document.querySelector('#cycle-progress');
const startButton = document.querySelector('#start-button');
const pauseButton = document.querySelector('#pause-button');
const resetButton = document.querySelector('#reset-button');
const speedSlider = document.querySelector('#speed-slider');
const speedValue = document.querySelector('#speed-value');
const markerContainer = document.querySelector('#cycle-phase-markers');
let elapsedDays = 0;
let speed = Number(speedSlider.value);
let animationFrame = null;
let previousFrameTime = null;

markerContainer.innerHTML = phases.map(phase => `
  <span class="cycle-marker">${moonMarkup(phase.fraction, phase.name)}<span>${phase.name.replace(' ', '\u00a0')}</span></span>
`).join('');

function phaseAtDay(day) {
  let current = phases[0];
  for (const phase of phases) {
    if (day >= phase.day) current = phase;
    else break;
  }
  return current;
}

function renderSimulation() {
  const fraction = elapsedDays / cycleLength;
  const phase = phaseAtDay(elapsedDays);
  cycleDay.textContent = elapsedDays.toFixed(1).replace('.', ',');
  simulationPhase.textContent = phase.name;
  simulationMoon.innerHTML = moonMarkup(fraction, phase.name);
  simulationMoon.setAttribute('aria-label', `${phase.name}, dia ${elapsedDays.toFixed(1)} do ciclo`);
  cycleProgress.style.width = `${fraction * 100}%`;
}

function animateCycle(timestamp) {
  if (previousFrameTime !== null) {
    elapsedDays = (elapsedDays + (timestamp - previousFrameTime) / 1000 * speed) % cycleLength;
    renderSimulation();
  }
  previousFrameTime = timestamp;
  animationFrame = requestAnimationFrame(animateCycle);
}

function startSimulation() {
  if (animationFrame !== null) return;
  previousFrameTime = null;
  animationFrame = requestAnimationFrame(animateCycle);
  startButton.disabled = true;
  pauseButton.disabled = false;
}

function pauseSimulation() {
  if (animationFrame === null) return;
  cancelAnimationFrame(animationFrame);
  animationFrame = null;
  previousFrameTime = null;
  startButton.disabled = false;
  pauseButton.disabled = true;
}

startButton.addEventListener('click', startSimulation);
pauseButton.addEventListener('click', pauseSimulation);
resetButton.addEventListener('click', () => {
  pauseSimulation();
  elapsedDays = 0;
  renderSimulation();
});
speedSlider.addEventListener('input', () => {
  speed = Number(speedSlider.value);
  speedValue.textContent = speed.toFixed(1).replace('.', ',');
});
renderSimulation();

const quizCard = document.querySelector('#quiz-card');
const quizResult = document.querySelector('#quiz-result');
const questionText = document.querySelector('#question-text');
const optionsContainer = document.querySelector('#quiz-options');
const quizFeedback = document.querySelector('#quiz-feedback');
const quizScore = document.querySelector('#quiz-score');
const quizProgress = document.querySelector('#quiz-progress');
const quizProgressLabel = document.querySelector('#quiz-progress-label');
const nextQuestion = document.querySelector('#next-question');
const finalScore = document.querySelector('#final-score');
const resultMessage = document.querySelector('#result-message');
let questionIndex = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const current = questions[questionIndex];
  answered = false;
  quizProgressLabel.textContent = `PERGUNTA ${questionIndex + 1} DE ${questions.length}`;
  quizProgress.style.width = `${questionIndex / questions.length * 100}%`;
  questionText.textContent = current.question;
  quizFeedback.textContent = '';
  quizFeedback.classList.remove('is-incorrect');
  nextQuestion.hidden = true;
  nextQuestion.innerHTML = questionIndex === questions.length - 1
    ? 'Ver resultado <span aria-hidden="true">→</span>'
    : 'Próxima pergunta <span aria-hidden="true">→</span>';
  optionsContainer.innerHTML = current.options.map((option, index) => `
    <button class="quiz-option" type="button" data-answer="${index}">${option}</button>
  `).join('');
}

optionsContainer.addEventListener('click', event => {
  const button = event.target.closest('[data-answer]');
  if (!button || answered) return;
  answered = true;
  const selected = Number(button.dataset.answer);
  const correct = questions[questionIndex].answer;
  optionsContainer.querySelectorAll('.quiz-option').forEach((option, index) => {
    option.disabled = true;
    if (index === correct) option.classList.add('is-correct');
  });
  if (selected === correct) {
    score += 1;
    quizFeedback.textContent = 'Correto! Você está no caminho certo.';
  } else {
    button.classList.add('is-incorrect');
    quizFeedback.textContent = 'Não foi dessa vez. A alternativa destacada é a correta.';
    quizFeedback.classList.add('is-incorrect');
  }
  quizScore.textContent = String(score);
  quizProgress.style.width = `${(questionIndex + 1) / questions.length * 100}%`;
  nextQuestion.hidden = false;
});

nextQuestion.addEventListener('click', () => {
  if (!answered) return;
  questionIndex += 1;
  if (questionIndex < questions.length) {
    renderQuestion();
    return;
  }
  quizCard.hidden = true;
  quizResult.hidden = false;
  finalScore.textContent = `${score} de ${questions.length}`;
  resultMessage.textContent = score === questions.length
    ? 'Impressionante! Você conhece muito bem as fases da Lua.'
    : score >= 4
      ? 'Muito bem! Você já sabe bastante sobre o ciclo lunar.'
      : 'Boa jornada! Explore as fases e tente novamente para aprender ainda mais.';
});

document.querySelector('#restart-quiz').addEventListener('click', () => {
  questionIndex = 0;
  score = 0;
  quizScore.textContent = '0';
  quizCard.hidden = false;
  quizResult.hidden = true;
  renderQuestion();
});

renderQuestion();
