const chapters = [
  { title: 'Quantum Fundamentals', time: '8 min read', intro: 'Quantum computing begins with a deceptively small question: what if information could exist in more than one state at once?', type: 'Concepts & intuition' },
  { title: 'Mathematical Foundations', time: '10 min read', intro: 'The math of quantum mechanics is a language for possibility. Let us learn just enough of it to make the invisible legible.', type: 'Vectors & probability' },
  { title: 'Quantum Gates', time: '9 min read', intro: 'Gates are the verbs of a quantum program. With a handful of transformations, we can rotate, phase, and entangle our qubits.', type: 'Operations & transformations' },
  { title: 'Quantum Circuits', time: '11 min read', intro: 'A circuit turns a sequence of ideas into an experiment. Read one from left to right and watch a computation unfold.', type: 'Patterns & architecture' },
  { title: 'Quantum Algorithms', time: '12 min read', intro: 'Quantum algorithms are not magic shortcuts. They are carefully shaped interference patterns that make the right answers louder.', type: 'Search & discovery' },
  { title: 'Quantum Simulation', time: '10 min read', intro: 'Nature is already quantum. Simulation lets us borrow a quantum computer as a microscope for molecules, materials, and matter.', type: 'Models & experiments' },
  { title: 'Quantum Frameworks', time: '8 min read', intro: 'Tools turn theory into runnable circuits. Meet the frameworks, workflows, and habits that make quantum code useful.', type: 'Tools & practice' },
  { title: 'Quantum Applications', time: '9 min read', intro: 'The field is still young, but its questions are ambitious: new medicines, new materials, and new ways to sense the world.', type: 'Frontiers & impact' }
];

const fundamentalsTopics = [
  { title: 'Introduction', time: '8 min read', intro: 'Learn the core concepts that form the foundation of quantum computing. Understand how quantum mechanics works and why it enables new possibilities in computing.', type: 'Concepts & intuition' },
  { title: 'Qubit', time: '6 min read', intro: 'A qubit is the smallest unit of quantum information, with a state that can be described as a blend of two possibilities.', type: 'Concepts & intuition' },
  { title: 'Superposition', time: '7 min read', intro: 'A qubit can exist in a superposition of |0⟩ and |1⟩. Its probability amplitudes describe the likelihood of each result when the qubit is measured.', type: 'Concepts & intuition' },
  { title: 'Entanglement', time: '7 min read', intro: 'Quantum entanglement is a phenomenon where two or more quantum systems become connected through a shared quantum state, creating correlations that cannot be described independently.', type: 'Concepts & intuition' },
  { title: 'Measurement', time: '5 min read', intro: 'Measurement turns quantum possibility into a definite result and gives us the evidence we need to understand a computation.', type: 'Concepts & intuition' }
];

const state = { activeChapter: 0, activeTopic: 0, fundamentalsExpanded: false, completed: JSON.parse(localStorage.getItem('learn-quantum-progress') || '[]') };
const $ = (selector) => document.querySelector(selector);
const chapterList = $('#chapter-list');

function renderSidebar() {
  chapterList.innerHTML = chapters.map((chapter, index) => {
    const isFundamentals = index === 0;
    const chapterButton = `<button class="chapter-item ${index === state.activeChapter ? 'active' : ''} ${state.completed.includes(index) ? 'completed' : ''}" data-chapter="${index}" ${isFundamentals ? 'aria-expanded="' + state.fundamentalsExpanded + '"' : ''}>
      <span class="chapter-index">${String(index + 1).padStart(2, '0')}</span><span class="chapter-name">${chapter.title}</span>
      ${isFundamentals ? `<span class="chapter-toggle" aria-hidden="true">${state.fundamentalsExpanded ? '−' : '+'}</span>` : ''}
      ${state.completed.includes(index) ? '<span class="chapter-check">✓</span>' : ''}
    </button>`;
    if (!isFundamentals) return chapterButton;
    const topics = fundamentalsTopics.map((topic, topicIndex) => `<button class="chapter-topic ${state.activeChapter === 0 && state.activeTopic === topicIndex ? 'active' : ''}" data-topic="${topicIndex}">${topic.title}</button>`).join('');
    return `${chapterButton}<div class="chapter-submenu" ${state.fundamentalsExpanded ? '' : 'hidden'}>${topics}</div>`;
  }).join('');
  chapterList.querySelectorAll('[data-chapter]:not([data-chapter="0"])').forEach((button) => button.addEventListener('click', () => loadChapter(Number(button.dataset.chapter))));
  chapterList.querySelector('[data-chapter="0"]').addEventListener('click', (event) => { event.stopPropagation(); state.fundamentalsExpanded = !state.fundamentalsExpanded; renderSidebar(); });
  chapterList.querySelectorAll('[data-topic]').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); loadTopic(Number(button.dataset.topic)); }));
  const percent = Math.round((state.completed.length / chapters.length) * 100);
  $('#progress-percent').textContent = `${percent}%`;
  $('#progress-count').textContent = state.completed.length;
  $('#progress-bar').style.width = `${percent}%`;
}

function lessonTemplate(index) {
  if (index === 0) return topicTemplate(state.activeTopic);
  if (index === 1) return `
    <h2>Bits are either / or. Qubits can be both.</h2>
    <p>A classical bit is a tiny switch: it is <strong>0</strong> or <strong>1</strong>. A qubit is more like a compass needle. Before we look at it, it can point in a blend of directions, carrying a probability of being measured as either state.</p>
    <p>This is called <strong>superposition</strong>. It is not simply “being undecided.” It is a real physical state, and when we measure it, the possibilities resolve into one definite answer.</p>
    <div class="visual-card" id="superposition-demo">
      <div class="visual-card-header"><div><span class="card-label">Try it / 01</span><h3>Stretch a qubit between worlds</h3><p>Drag the slider to change the chance of measuring a 1.</p></div><span class="orbit-icon" aria-hidden="true">◌</span></div>
      <div class="qubit-stage"><div class="qubit-wrap"><div class="qubit" id="qubit-zero">0</div><span class="qubit-label">classical zero</span></div><div class="qubit-wrap"><div class="qubit super" id="qubit-super">0 + 1</div><span class="qubit-label">superposition</span></div><div class="qubit-wrap"><div class="qubit" id="qubit-one">1</div><span class="qubit-label">classical one</span></div></div>
      <label class="range-control"><span>0</span><input id="probability-slider" type="range" min="0" max="100" value="50"><span>1</span><strong class="range-value" id="probability-value">50 / 50</strong></label>
    </div>
    <h3>Possibility is only half the story</h3>
    <p>When qubits interact, their possibilities can become linked. This is <strong>entanglement</strong>: measuring one qubit tells you something about another, even when they are separated.</p>
    <div class="quiz"><span class="card-label">Quick check</span><h3>What happens when a qubit is measured?</h3><div class="quiz-options"><button class="quiz-option" data-correct="false">It stays in every state at once.</button><button class="quiz-option" data-correct="true">Its possibilities resolve to one result.</button><button class="quiz-option" data-correct="false">It becomes a classical computer.</button></div><p class="quiz-feedback" id="quiz-feedback"></p></div>`;
  if (index === 1) return `<h2>Vectors give possibility a shape.</h2><p>We represent a qubit as a vector: <strong>|ψ⟩ = α|0⟩ + β|1⟩</strong>. The numbers α and β are amplitudes. Their squared magnitudes become the probabilities we see when measuring.</p><div class="visual-card"><div class="visual-card-header"><div><span class="card-label">Explore / 02</span><h3>Amplitude is not probability</h3><p>Change the amplitude of |1⟩ and watch the probabilities rebalance.</p></div></div><div class="amplitude-bar"><div class="amplitude-column"><span id="amp-zero" style="height: 50%"></span><small>|0⟩</small></div><div class="amplitude-column"><span id="amp-one" style="height: 50%"></span><small>|1⟩</small></div></div><label class="range-control"><span>α</span><input id="amplitude-slider" type="range" min="0" max="100" value="50"><strong class="range-value" id="amplitude-value">50%</strong></label></div><h3>Normalize the universe</h3><p>Because something must happen when we measure, the probabilities always add up to one: <strong>|α|² + |β|² = 1</strong>. This simple rule is called normalization.</p><div class="code-block">state = [α, β]<br>probability(0) = |α|²<br>probability(1) = |β|²</div>`;
  if (index === 2) return `<h2>Gates are rotations for information.</h2><p>A gate changes a qubit's state. The <strong>Hadamard gate</strong>, or H, is a favorite first move: it turns a definite 0 into an even superposition of 0 and 1.</p><div class="visual-card"><div class="visual-card-header"><div><span class="card-label">Playground / 03</span><h3>Build a tiny transformation</h3><p>Choose a gate and see the circuit respond.</p></div></div><div class="gate-row"><div class="gate" id="input-gate">0</div><div class="wire"></div><div class="gate-button active" id="active-gate">H</div><div class="wire"></div><div class="gate target" id="output-gate">?</div></div><div class="gate-controls"><button class="gate-button active" data-gate="H">H · superpose</button><button class="gate-button" data-gate="X">X · flip</button><button class="gate-button" data-gate="Z">Z · phase</button></div></div><p>The X gate flips 0 to 1, much like a classical NOT. The Z gate leaves the measurement probabilities alone but changes the phase, which matters when waves interfere.</p>`;
  if (index === 3) return `<h2>Read a circuit like a sentence.</h2><p>Time flows from left to right. Each horizontal wire is a qubit, and each box is an operation. The small vertical connection below is where two qubits begin to share one quantum story.</p><div class="visual-card"><div class="visual-card-header"><div><span class="card-label">Circuit anatomy / 04</span><h3>A two-qubit hello world</h3><p>Hadamard plus controlled-not creates entanglement.</p></div></div><div class="circuit-diagram"><div class="circuit-line"><span>q₀</span><div class="c-wire"></div><b class="c-gate">H</b><div class="c-wire"></div><b class="c-gate">●</b><div class="c-wire"></div></div><div class="circuit-line"><span>q₁</span><div class="c-wire"></div><b class="c-gate empty"> </b><div class="c-wire"></div><b class="c-gate target">⊕</b><div class="c-wire"></div></div><div class="c-connector"></div></div></div><p>Run it and the pair lands in a shared state: measuring one gives you immediate information about the other. That correlation is the resource, not a faster-than-light message.</p>`;
  const endings = [
    ['Search for the useful interference.', 'Algorithms are choreographies for amplitudes. Grover amplifies a marked answer; Shor finds hidden periodicity. Both make probability do the heavy lifting.', 'Start with the question, then design the interference pattern that makes its answer stand out.'],
    ['Make a model, then listen closely.', 'A quantum simulator maps a problem onto qubits and lets their evolution reveal structure. Variational methods alternate between a quantum circuit and a classical optimizer.', 'The art is choosing a model that is expressive enough to be useful and small enough to run.'],
    ['Theory needs a place to run.', 'Frameworks such as Qiskit, Cirq, and PennyLane help you compose circuits, choose backends, inspect results, and move between simulation and hardware.', 'Good quantum software keeps the circuit readable: named parameters, small experiments, and measurements you can explain.'],
    ['The horizon is wide open.', 'Quantum sensing may detect tiny changes in fields. Chemistry may benefit from natural quantum representations. Optimization remains an active, honest research question.', 'The most interesting applications will be co-designed with the hardware. Keep learning, keep testing, and stay curious.']
  ][index - 4];
  return `<h2>${endings[0]}</h2><p>${endings[1]}</p><p>${endings[2]}</p><div class="code-block">chapter_${String(index + 1).padStart(2, '0')} = {<br>&nbsp;&nbsp;question: "What can a quantum system reveal?",<br>&nbsp;&nbsp;method: "Experiment, measure, learn"<br>}</div><div class="quiz"><span class="card-label">Reflection</span><h3>What idea from this chapter would you explain to a friend?</h3><button class="gate-button" id="reflection-button">Mark chapter complete ✓</button><p class="quiz-feedback" id="reflection-feedback"></p></div>`;
}

function superpositionLessonTemplate() {
  return `<section class="qubit-lesson superposition-lesson">
    <div class="qubit-section"><h2>What is Superposition?</h2><p>Superposition is one of the fundamental properties of quantum mechanics. A qubit can be represented as a combination of its two computational basis states:</p><div class="qubit-equation">|ψ⟩ = α|0⟩ + β|1⟩</div><ul><li><strong>|0⟩</strong> and <strong>|1⟩</strong> are the basis states.</li><li><strong>α</strong> and <strong>β</strong> are probability amplitudes.</li><li><strong>|α|²</strong> represents the probability of measuring 0.</li><li><strong>|β|²</strong> represents the probability of measuring 1.</li></ul><p>The amplitudes must satisfy the normalization condition:</p><div class="qubit-equation">|α|² + |β|² = 1</div></div>
    <div class="qubit-section"><h2>A qubit in superposition</h2><p>A qubit does not have to be only <strong>|0⟩</strong> or <strong>|1⟩</strong> before measurement. For example:</p><div class="qubit-equation">|ψ⟩ = 1/√2 |0⟩ + 1/√2 |1⟩</div><p>This is an equal, or 50–50, superposition.</p><div class="probability-grid"><div><strong>P(0) = 50%</strong><span>Outcome 0</span></div><div><strong>P(1) = 50%</strong><span>Outcome 1</span></div></div></div>
    <div class="qubit-section"><h2>Probability amplitudes</h2><p>Probability amplitudes are the values used to describe the quantum state. Probabilities come from taking the magnitude squared of those amplitudes.</p><div class="amplitude-flow"><span>Amplitude<br><strong>α, β</strong></span><b>↓</b><span>Magnitude squared</span><b>↓</b><span>Probability<br><strong>|α|², |β|²</strong></span></div></div>
    <div class="qubit-section"><h2>Every qubit must be normalized</h2><div class="qubit-equation">|α|² + |β|² = 1</div><p>The probabilities of all possible measurement outcomes must add up to 100%. A different valid state could have:</p><div class="probability-grid"><div><strong>P(0) = 25%</strong><span>|α|² = 0.25</span></div><div><strong>P(1) = 75%</strong><span>|β|² = 0.75</span></div></div></div>
    <div class="qubit-section superposition-interactive"><span class="card-label">TRY IT / 01</span><h2>Stretch a qubit between worlds</h2><p>Drag the slider to change the chance of measuring a 1.</p><label class="probability-slider"><span>0</span><input id="probability-slider" type="range" min="0" max="100" value="50" aria-label="Probability of measuring 1"><span>100</span></label><div class="slider-readout"><strong id="superposition-zero">P(0) = 50%</strong><strong id="superposition-one">P(1) = 50%</strong></div></div>
    <div class="qubit-section"><h2>The 50–50 superposition</h2><div class="qubit-equation">|+⟩ = (|0⟩ + |1⟩) / √2</div><div class="split-flow"><strong>|+⟩</strong><div><i>↙</i><i>↘</i></div><div><em>50%</em><em>50%</em></div><div><span>|0⟩</span><span>|1⟩</span></div></div><p>Measuring this state in the computational basis gives 0 or 1 with equal probability.</p></div>
    <div class="qubit-section"><h2>Creating superposition</h2><p>The Hadamard gate can transform a basis state into an equal superposition:</p><div class="circuit-line-simple"><span>|0⟩</span><i>───</i><strong>H</strong><i>───</i><span>|+⟩</span></div><div class="qubit-equation">H|0⟩ = (|0⟩ + |1⟩) / √2</div><p>The complete behavior of the Hadamard gate belongs in the Quantum Gates lesson.</p></div>
    <div class="qubit-section"><h2>Superposition is not classical uncertainty</h2><div class="comparison-grid"><div><h3>Classical uncertainty</h3><p>A classical bit is already either 0 or 1. We simply do not know which value it has.</p></div><div><h3>Quantum superposition</h3><p>A qubit is described by a quantum state:</p><div class="inline-equation">|ψ⟩ = α|0⟩ + β|1⟩</div><p>The quantum state itself contains amplitudes for the possible outcomes.</p></div></div></div>
    <div class="qubit-section"><h2>What happens when we measure?</h2><div class="measure-flow"><strong>|ψ⟩ = α|0⟩ + β|1⟩</strong><span>↓</span><strong>Measurement</strong><div><i>↙</i><i>↘</i></div><div><em>0</em><em>1</em></div><div><em>|α|²</em><em>|β|²</em></div></div><p>Measurement produces a single classical result. The probabilities are:</p><div class="probability-grid"><div><strong>P(0) = |α|²</strong></div><div><strong>P(1) = |β|²</strong></div></div></div>
    <div class="qubit-section"><h2>Phase matters</h2><p>Relative phase distinguishes quantum states that have the same computational-basis probabilities.</p><div class="phase-grid"><div>|ψ₁⟩ = (|0⟩ + |1⟩) / √2</div><div>|ψ₂⟩ = (|0⟩ − |1⟩) / √2</div></div><p>These states have the same measurement probabilities in this basis, but they are different quantum states because their relative phases are different.</p></div>
    <div class="qubit-section"><h2>Superposition and interference</h2><p>Quantum amplitudes can reinforce or cancel each other as a computation changes the state.</p><div class="state-flow interference-flow"><span>Superposition</span><b>↓</b><strong>Amplitude manipulation</strong><b>↓</b><span>Interference</span><div><em>reinforce</em><em>cancel</em></div></div><p>Quantum algorithms use interference to increase useful outcomes and suppress unwanted outcomes.</p></div>
    <div class="qubit-section"><h2>Why does superposition matter?</h2><p>Superposition allows quantum algorithms to manipulate a quantum state containing amplitudes for multiple computational basis states. The algorithm then uses controlled operations and interference to shape the probability of each measurement outcome.</p></div>
    <aside class="key-idea"><span class="card-label">Key takeaway</span><p>Superposition allows a qubit to be represented as a combination of basis states. The amplitudes determine measurement probabilities, while relative phase influences how quantum states interfere.</p></aside>
  </section>`;
}

function entanglementLessonTemplate() {
  return `<section class="qubit-lesson entanglement-lesson">
    <div class="qubit-section"><h2>Two qubits, one shared state.</h2><p>Unlike independent qubits, entangled qubits can be described by a joint quantum state. Measuring one qubit can reveal a strong correlation with the measurement outcome of another.</p></div>
    <div class="qubit-section"><span class="card-label">EXPLORE / 01</span><h2>A pair that behaves as one</h2><p>Two qubits have four computational basis states:</p><div class="basis-grid entangled-basis"><div><strong>|00⟩</strong></div><div><strong>|01⟩</strong></div><div><strong>|10⟩</strong></div><div><strong>|11⟩</strong></div></div><p>An entangled system is described using a joint state rather than treating the qubits as completely independent.</p><div class="qubit-equation">|Φ⁺⟩ = (|00⟩ + |11⟩) / √2</div><div class="probability-grid"><div><strong>|00⟩ → 50%</strong></div><div><strong>|11⟩ → 50%</strong></div><div><strong>|01⟩ → 0%</strong></div><div><strong>|10⟩ → 0%</strong></div></div></div>
    <div class="qubit-section entanglement-interactive"><span class="card-label">TRY IT / 01</span><h2>See two qubits move together</h2><p>Measure the pair and observe their correlated outcomes.</p><div class="pair-display"><div><span>Qubit A</span><strong id="entangled-qubit-a">|?⟩</strong></div><i>─────────────</i><div><span>Qubit B</span><strong id="entangled-qubit-b">|?⟩</strong></div><small>ENTANGLED</small></div><button class="measure-pair-button" id="measure-entangled-button" type="button">Measure</button><p class="simulation-note" id="entangled-measurement-note">Educational simulation: this pair always returns matching results.</p></div>
    <div class="qubit-section"><h2>Why is entanglement different?</h2><div class="comparison-grid"><div><h3>Classical correlation</h3><p>Two systems can have related values because of how they were prepared.</p></div><div><h3>Quantum entanglement</h3><p>The combined quantum state cannot be written as two independent single-qubit states:</p><div class="inline-equation">|ψ⟩ ≠ |ψ₁⟩ ⊗ |ψ₂⟩</div></div></div></div>
    <div class="qubit-section"><h2>Creating entanglement</h2><p>Quantum gates can create an entangled state. The Hadamard gate creates a superposition, and the CNOT gate links the qubits to produce an entangled state.</p><div class="creation-flow"><span>|00⟩</span><b>↓</b><strong>H</strong><b>↓</b><strong>CNOT</strong><b>↓</b><span>(|00⟩ + |11⟩) / √2</span></div><div class="circuit-sketch"><div>q₀: ── <b>H</b> ── <strong>●</strong> ──</div><div>q₁: ───────── <strong>⊕</strong> ──</div><i>                │</i></div><p>The complete behavior of these gates belongs in the Quantum Gates lesson.</p></div>
    <div class="qubit-section"><h2>Measurement and entanglement</h2><p>For <strong>|Φ⁺⟩ = (|00⟩ + |11⟩) / √2</strong>, the possible results are:</p><div class="probability-grid"><div><strong>|00⟩ → 50%</strong></div><div><strong>|11⟩ → 50%</strong></div></div><p>If the first qubit is measured as 0, the second is also found as 0 for this state. If the first is measured as 1, the second is also found as 1. This is a correlation in the joint quantum state.</p></div>
    <div class="qubit-section"><h2>Entanglement is not faster-than-light communication</h2><p>Entanglement produces strong correlations between measurement outcomes, but it cannot be used by itself to send information faster than light.</p></div>
    <div class="qubit-section"><h2>Why does entanglement matter?</h2><p>Entanglement is an important resource for several areas of quantum technology:</p><ul class="hardware-list"><li>Quantum computing</li><li>Quantum communication</li><li>Quantum teleportation</li><li>Quantum cryptography</li><li>Quantum error correction</li></ul></div>
    <aside class="key-idea"><span class="card-label">Key idea</span><p>Entanglement allows multiple quantum systems to share a joint state whose correlations cannot always be explained by considering each system independently.</p></aside>
  </section>`;
}

function topicTemplate(topicIndex) {
  const topics = [
    fundamentalsIntroductionTemplate(),
    `<section class="qubit-lesson">
      <div class="qubit-section"><h2>The qubit is quantum information's small compass.</h2><p>A qubit has two familiar basis states, <strong>|0⟩</strong> and <strong>|1⟩</strong>. Unlike a classical bit, its complete state can include a carefully described combination of both.</p></div>
      <div class="qubit-section"><h2>Two states, one system</h2><p><strong>|0⟩</strong> and <strong>|1⟩</strong> are the computational basis states of a qubit. They are the reference states used to describe and measure a quantum system.</p><div class="basis-grid"><div class="basis-card"><strong>|0⟩</strong><span>Basis state 0</span></div><div class="basis-card"><strong>|1⟩</strong><span>Basis state 1</span></div></div></div>
      <div class="qubit-section"><h2>A qubit can exist in superposition</h2><p>A general single-qubit state is represented as:</p><div class="qubit-equation">|ψ⟩ = α|0⟩ + β|1⟩</div><ul><li>α and β are complex probability amplitudes.</li><li>|α|² is the probability of measuring 0.</li><li>|β|² is the probability of measuring 1.</li><li>|α|² + |β|² = 1.</li></ul></div>
      <div class="qubit-section"><h2>What do the amplitudes mean?</h2><div class="probability-grid"><div><strong>P(0) = |α|²</strong><span>Probability of measuring 0</span></div><div><strong>P(1) = |β|²</strong><span>Probability of measuring 1</span></div></div><p>For example:</p><div class="qubit-equation">|ψ⟩ = 1/√2 |0⟩ + 1/√2 |1⟩</div><p>This state gives <strong>P(0) = 50%</strong> and <strong>P(1) = 50%</strong>.</p></div>
      <div class="qubit-section"><h2>Superposition is not simply '0 and 1 at the same time'</h2><p>A qubit is described by a quantum state containing amplitudes for possible measurement outcomes. Measurement samples that state and produces one classical result.</p><div class="state-flow"><span>Quantum state</span><b>↓</b><strong>|ψ⟩ = α|0⟩ + β|1⟩</strong><b>↓</b><span>Measurement</span><div><i>↙</i><i>↘</i></div><div><em>0</em><em>1</em></div></div></div>
      <div class="qubit-section"><h2>Phase matters</h2><p>Relative phase can distinguish states even when their computational-basis probabilities match.</p><div class="phase-grid"><div>|ψ₁⟩ = 1/√2(|0⟩ + |1⟩)</div><div>|ψ₂⟩ = 1/√2(|0⟩ − |1⟩)</div></div><p>These states have the same probabilities when measured in the computational basis, but they are different quantum states because of their relative phase. Interference makes that difference observable.</p></div>
      <div class="qubit-section"><h2>Visualizing a qubit</h2><p>A single qubit can be represented geometrically using the Bloch sphere. <strong>|0⟩</strong> is at the north pole, <strong>|1⟩</strong> is at the south pole, and other pure qubit states appear on the surface.</p><div class="bloch-wrap"><div class="bloch-sphere" aria-label="Bloch sphere showing zero at the north pole and one at the south pole"><span class="bloch-axis"></span><span class="bloch-equator"></span><b class="bloch-zero">|0⟩</b><b class="bloch-one">|1⟩</b><span class="bloch-state">|ψ⟩</span></div><div class="bloch-labels"><span>north pole</span><span>south pole</span></div></div><div class="qubit-equation">|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩</div></div>
      <div class="qubit-section"><h2>Qubit vs Classical Bit</h2><div class="comparison-grid"><div><h3>Classical Bit</h3><ul><li>Stores 0 or 1</li><li>Definite classical state</li><li>Classical logic operations</li></ul></div><div><h3>Qubit</h3><ul><li>State described by α|0⟩ + β|1⟩</li><li>Can exist in superposition</li><li>Has probability amplitudes and phase</li><li>Manipulated using quantum operations</li></ul></div></div></div>
      <div class="qubit-section"><h2>What happens when we measure a qubit?</h2><p>Measurement converts the quantum state into a classical result. For <strong>|ψ⟩ = α|0⟩ + β|1⟩</strong>, measurement gives 0 with probability |α|² or 1 with probability |β|².</p><div class="measure-flow"><strong>|ψ⟩</strong><span>↓</span><strong>Measurement</strong><div><i>↙</i><i>↘</i></div><div><em>0</em><em>1</em></div></div></div>
      <div class="qubit-section"><h2>One qubit → many qubits</h2><div class="state-counts"><span>1 qubit → <strong>2</strong> basis states</span><span>2 qubits → <strong>4</strong> basis states</span><span>3 qubits → <strong>8</strong> basis states</span><span>n qubits → <strong>2ⁿ</strong> basis states</span></div><div class="basis-line">|00⟩ &nbsp; |01⟩ &nbsp; |10⟩ &nbsp; |11⟩</div><p>For n qubits, the computational basis contains 2ⁿ states. This does <strong>not</strong> mean n qubits simply store 2ⁿ classical bits. The quantum system is described using amplitudes associated with those basis states.</p></div>
      <div class="qubit-section"><h2>Where do physical qubits come from?</h2><p>Qubits can be built from several physical systems, each with different engineering tradeoffs:</p><ul class="hardware-list"><li>Superconducting circuits</li><li>Trapped ions</li><li>Photons</li><li>Neutral atoms</li><li>Spin-based qubits</li></ul></div>
      <aside class="key-idea"><span class="card-label">Key idea</span><p>A qubit is not simply a faster version of a classical bit. It is a quantum system whose state is described by amplitudes, allowing superposition, phase, interference, and, when multiple qubits interact, entanglement.</p></aside>
    </section>`,
    superpositionLessonTemplate(),
    entanglementLessonTemplate(),
    `<h2>Measurement turns possibility into evidence.</h2><p>When we measure a qubit, its possible outcomes resolve to one definite result. Repeating the same experiment lets us estimate the probabilities encoded in the original state.</p><div class="quiz"><span class="card-label">Quick check</span><h3>What happens when a qubit is measured?</h3><div class="quiz-options"><button class="quiz-option" data-correct="false">It stays in every state at once.</button><button class="quiz-option" data-correct="true">Its possibilities resolve to one result.</button><button class="quiz-option" data-correct="false">It becomes a classical computer.</button></div><p class="quiz-feedback" id="quiz-feedback"></p></div>`
  ];
  return topics[topicIndex];
}

function renderContents() {
  const headings = [...$('#lesson-body').querySelectorAll('h2, h3')];
  $('#page-contents').innerHTML = headings.map((heading, index) => { const id = `section-${index}`; heading.id = id; return `<button data-target="${id}">${heading.textContent}</button>`; }).join('');
  $('#page-contents').querySelectorAll('button').forEach((button) => button.addEventListener('click', () => document.getElementById(button.dataset.target).scrollIntoView({ behavior: 'smooth' })));
}

function wireInteractions(index) {
  document.querySelectorAll('[data-lesson-topic]').forEach((button) => button.addEventListener('click', () => loadTopic(Number(button.dataset.lessonTopic))));
  const stateSlider = $('#fundamentals-state-slider');
  if (stateSlider) stateSlider.addEventListener('input', (event) => {
    const value = Number(event.target.value);
    const probability = Math.round(value);
    $('#fundamentals-state-value').textContent = `${100 - probability}% |0⟩ + ${probability}% |1⟩`;
    $('#fundamentals-state-zero').style.height = `${100 - probability}%`;
    $('#fundamentals-state-one').style.height = `${probability}%`;
    $('#fundamentals-state-probability').textContent = `P(1) = ${probability}%`;
  });
  const measureButton = $('#fundamentals-measure-button');
  if (measureButton) measureButton.addEventListener('click', () => {
    const result = Math.random() < .5 ? '0' : '1';
    $('#fundamentals-measure-result').textContent = result;
    $('#fundamentals-measure-feedback').textContent = `One measurement returned ${result}. Run it again to see the distribution emerge.`;
  });
  const entangledMeasureButton = $('#measure-entangled-button');
  if (entangledMeasureButton) entangledMeasureButton.addEventListener('click', () => {
    const result = Math.random() < .5 ? '0' : '1';
    $('#entangled-qubit-a').textContent = `|${result}⟩`;
    $('#entangled-qubit-b').textContent = `|${result}⟩`;
    $('#entangled-measurement-note').textContent = `Measured ${result}${result}. Both qubits match because this simulation represents |Φ⁺⟩.`;
  });
  document.querySelectorAll('[data-fundamental-answer]').forEach((button) => button.addEventListener('click', () => {
    const correct = button.dataset.fundamentalAnswer === 'true';
    document.querySelectorAll('[data-fundamental-answer]').forEach((item) => item.disabled = true);
    button.classList.add(correct ? 'correct' : 'wrong');
    $('#fundamentals-quiz-feedback').textContent = correct ? 'Correct. The amplitudes are complex numbers; their squared magnitudes give measurement probabilities.' : 'Not quite. Amplitudes describe the state, while squared magnitudes become probabilities.';
  }));
  const slider = $('#probability-slider');
  if (slider) slider.addEventListener('input', (event) => {
    const value = Number(event.target.value);
    const zero = 100 - value;
    const legacyReadout = $('#probability-value');
    const legacyQubit = $('#qubit-super');
    const superpositionZero = $('#superposition-zero');
    const superpositionOne = $('#superposition-one');
    if (legacyReadout) legacyReadout.textContent = `${zero} / ${value}`;
    if (legacyQubit) legacyQubit.style.transform = `rotate(${(value - 50) / 2}deg) scale(${1 + Math.abs(value - 50) / 500})`;
    if (superpositionZero) superpositionZero.textContent = `P(0) = ${zero}%`;
    if (superpositionOne) superpositionOne.textContent = `P(1) = ${value}%`;
  });
  const amplitude = $('#amplitude-slider');
  if (amplitude) amplitude.addEventListener('input', (event) => { const value = Number(event.target.value); $('#amplitude-value').textContent = `${value}%`; $('#amp-zero').style.height = `${100 - value}%`; $('#amp-one').style.height = `${value}%`; });
  document.querySelectorAll('[data-gate]').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('[data-gate]').forEach((item) => item.classList.remove('active')); button.classList.add('active'); const gate = button.dataset.gate; $('#active-gate').textContent = gate; $('#output-gate').textContent = gate === 'H' ? '0+1' : gate === 'X' ? '1' : '−'; $('#output-gate').style.fontSize = gate === 'H' ? '12px' : '24px'; }));
  document.querySelectorAll('.quiz-option').forEach((button) => button.addEventListener('click', () => { const correct = button.dataset.correct === 'true'; document.querySelectorAll('.quiz-option').forEach((item) => item.disabled = true); button.classList.add(correct ? 'correct' : 'wrong'); $('#quiz-feedback').textContent = correct ? 'Exactly. Measurement turns possibility into a definite result.' : 'Close. A qubit resolves to one result when we measure it.'; if (correct) completeChapter(index); }));
  const reflectionButton = $('#reflection-button');
  if (reflectionButton) reflectionButton.addEventListener('click', () => { completeChapter(index); $('#reflection-feedback').textContent = 'Chapter saved to your progress.'; reflectionButton.textContent = 'Chapter complete ✓'; });
}

function fundamentalsIntroductionTemplate() {
  return `<section class="fundamentals-lesson">
    <div class="fundamentals-section">
      <h2>What is Quantum Computing?</h2>
      <p>Quantum computing is a way of processing information using the rules of quantum mechanics. Instead of treating information as only definite 0s and 1s, a quantum computer prepares, transforms, and measures <strong>quantum states</strong>.</p>
      <p>The goal is not to try every answer at once. The goal is to choreograph <strong>superposition</strong>, <strong>interference</strong>, and <strong>entanglement</strong> so useful answers become more likely when the system is measured.</p>
    </div>
    <div class="fundamentals-section">
      <h2>Classical Computing vs Quantum Computing</h2>
      <div class="fundamentals-comparison">
        <div><strong>Classical bit</strong><span>Stores one definite value: 0 or 1.</span><code>bit = 1</code></div>
        <div><strong>Qubit</strong><span>Uses amplitudes to describe a state built from |0⟩ and |1⟩.</span><code>|ψ⟩ = α|0⟩ + β|1⟩</code></div>
      </div>
      <p>A classical computer manipulates bits with logic gates. A quantum computer manipulates amplitudes with reversible quantum gates, then uses measurement to produce ordinary classical data.</p>
    </div>
    <div class="fundamentals-section">
      <h2>The qubit: a quantum unit of information</h2>
      <p>The basis states <strong>|0⟩</strong> and <strong>|1⟩</strong> are the quantum version of the two classical values. This notation gives us a compact language for describing <strong>quantum states</strong>. A general single-qubit state is written as:</p>
      <div class="fundamentals-formula">|ψ⟩ = α|0⟩ + β|1⟩<small>where α and β are complex amplitudes</small></div>
      <p>For a valid state, the total probability must equal one:</p>
      <div class="fundamentals-formula">|α|² + |β|² = 1<small>the normalization rule</small></div>
      <p>When measured in the computational basis, the probability of observing 0 is <strong>|α|²</strong>, and the probability of observing 1 is <strong>|β|²</strong>.</p>
    </div>
    <div class="fundamentals-section fundamentals-interactive">
      <div><h2>Explore a quantum state</h2><p>Move the slider to change the probability of measuring 1. The state remains a quantum description until measurement.</p></div>
      <div class="fundamentals-state-visual"><div class="fundamentals-bar"><span id="fundamentals-state-zero"></span><small>|0⟩</small></div><div class="fundamentals-bar one"><span id="fundamentals-state-one"></span><small>|1⟩</small></div></div>
      <label class="fundamentals-range"><span>0</span><input id="fundamentals-state-slider" type="range" min="0" max="100" value="50"><span>1</span></label>
      <div class="fundamentals-state-readout"><strong id="fundamentals-state-value">50% |0⟩ + 50% |1⟩</strong><span id="fundamentals-state-probability">P(1) = 50%</span></div>
    </div>
    <div class="fundamentals-section">
      <h2>Superposition and interference</h2>
      <p><strong>Superposition</strong> means a state can contain amplitudes for multiple outcomes. Those amplitudes behave like waves: quantum gates can make them reinforce one another or cancel one another.</p>
      <p>This interference is the source of quantum advantage in algorithms. A useful algorithm arranges the interference so the outcomes that answer its question are amplified.</p>
      <div class="fundamentals-diagram" aria-label="A visual showing amplitudes combining through interference"><span class="wave wave-a">∿</span><span class="plus">+</span><span class="wave wave-b">∿</span><span class="equals">=</span><span class="wave wave-result">∿∿</span><small>amplitudes combine before measurement</small></div>
    </div>
    <div class="fundamentals-section">
      <h2>Entanglement</h2>
      <p><strong>Entanglement</strong> is a shared quantum state that cannot be fully described by assigning an independent state to each qubit. A familiar example is:</p>
      <div class="fundamentals-formula">|Φ⁺⟩ = (|00⟩ + |11⟩) / √2<small>the two results are correlated when measured</small></div>
      <p>If one qubit in this pair is measured as 0, the other is also found as 0. If it is measured as 1, the other is also 1. Entanglement creates correlations; it does not allow faster-than-light communication.</p>
    </div>
    <div class="fundamentals-section fundamentals-measurement">
      <div><h2>Measurement</h2><p>Measurement converts a quantum state into a classical result. For a state α|0⟩ + β|1⟩, one run returns either 0 or 1, with probabilities |α|² and |β|².</p></div>
      <div class="measurement-demo"><div class="measurement-result" id="fundamentals-measure-result">?</div><button class="gate-button" id="fundamentals-measure-button" type="button">Measure once</button><p id="fundamentals-measure-feedback">A measurement samples the state and gives one definite result.</p></div>
    </div>
    <div class="fundamentals-section">
      <h2>Why quantum computing is important</h2>
      <p>Quantum computers are promising for problems whose structure is naturally quantum or where carefully designed interference can reveal hidden patterns. They are not faster for every task, and useful machines remain difficult to build.</p>
      <div class="fundamentals-applications"><span>Drug discovery</span><span>Materials science</span><span>Optimization research</span><span>Quantum simulation</span><span>Secure communications</span><span>Precision sensing</span></div>
      <p>These are possible <strong>real-world applications</strong>, not guaranteed advantages. In practice, the most credible near-term value comes from exploring chemistry, materials, sensing, and hybrid quantum-classical methods alongside continued research.</p>
    </div>
    <div class="fundamentals-quiz"><span class="card-label">Quick check</span><h3>What do |α|² and |β|² represent?</h3><div class="quiz-options"><button type="button" data-fundamental-answer="false">The names of two quantum gates.</button><button type="button" data-fundamental-answer="true">The probabilities of measuring 0 and 1.</button><button type="button" data-fundamental-answer="false">Two classical bits stored in one qubit.</button></div><p id="fundamentals-quiz-feedback"></p></div>
  </section>`;
}

function completeChapter(index) { if (!state.completed.includes(index)) { state.completed.push(index); localStorage.setItem('learn-quantum-progress', JSON.stringify(state.completed)); renderSidebar(); showToast('Chapter added to your progress'); } }
function loadChapter(index) { state.activeChapter = Math.max(0, Math.min(chapters.length - 1, index)); if (state.activeChapter === 0) return loadTopic(state.activeTopic); const chapter = chapters[state.activeChapter]; $('#lesson-number').textContent = String(state.activeChapter + 1).padStart(2, '0'); $('#lesson-category').textContent = chapter.title.toUpperCase(); $('#lesson-title').innerHTML = titleMarkup(state.activeChapter); $('#lesson-intro').textContent = chapter.intro; $('#lesson-type').textContent = chapter.type; $('#next-number').textContent = state.activeChapter < 7 ? String(state.activeChapter + 2).padStart(2, '0') : '—'; $('#next-title').textContent = state.activeChapter < 7 ? chapters[state.activeChapter + 1].title : 'Field guide complete'; $('#next-time').textContent = state.activeChapter < 7 ? chapters[state.activeChapter + 1].time : 'You made it'; $('#previous-title').textContent = state.activeChapter > 1 ? chapters[state.activeChapter - 1].title : 'Quantum Fundamentals'; $('#footer-next-title').textContent = state.activeChapter < 7 ? chapters[state.activeChapter + 1].title : 'Finish'; $('#previous-button').disabled = false; $('#next-button').disabled = false; $('#next-button small').textContent = 'Next chapter'; $('#lesson-body').innerHTML = lessonTemplate(state.activeChapter); $('#mobile-breadcrumb').innerHTML = `Chapter ${String(state.activeChapter + 1).padStart(2, '0')} <span>/</span> ${chapter.title}`; renderSidebar(); renderContents(); wireInteractions(state.activeChapter); window.scrollTo({ top: 0, behavior: 'smooth' }); if (window.innerWidth <= 900) $('#sidebar').classList.remove('open'); }
function loadTopic(topicIndex) { state.activeChapter = 0; state.activeTopic = Math.max(0, Math.min(fundamentalsTopics.length - 1, topicIndex)); const topic = fundamentalsTopics[state.activeTopic]; $('#lesson-number').textContent = '01'; $('#lesson-category').textContent = state.activeTopic === 0 ? 'QUANTUM FUNDAMENTALS  /  INTRODUCTION' : `QUANTUM FUNDAMENTALS  /  ${topic.title.toUpperCase()}`; $('#lesson-title').innerHTML = state.activeTopic === 0 ? 'Quantum Fundamentals' : state.activeTopic === 3 ? 'Entanglement<br><i>in connection.</i>' : topic.title; $('#lesson-intro').textContent = topic.intro; $('#lesson-type').textContent = topic.type; $('#next-number').textContent = state.activeTopic < fundamentalsTopics.length - 1 ? `01.${state.activeTopic + 2}` : '02'; $('#next-title').textContent = state.activeTopic < fundamentalsTopics.length - 1 ? fundamentalsTopics[state.activeTopic + 1].title : chapters[1].title; $('#next-time').textContent = state.activeTopic < fundamentalsTopics.length - 1 ? fundamentalsTopics[state.activeTopic + 1].time : chapters[1].time; $('#previous-title').textContent = state.activeTopic > 0 ? fundamentalsTopics[state.activeTopic - 1].title : 'Welcome'; $('#footer-next-title').textContent = state.activeTopic < fundamentalsTopics.length - 1 ? fundamentalsTopics[state.activeTopic + 1].title : chapters[1].title; $('#previous-button').disabled = state.activeTopic === 0; $('#next-button').disabled = false; $('#next-button small').textContent = 'Next'; $('#lesson-body').innerHTML = lessonTemplate(0); $('#mobile-breadcrumb').innerHTML = `Chapter 01 <span>/</span> ${topic.title}`; $('#doc-breadcrumb').innerHTML = `Quantum Fundamentals <span>/</span> ${topic.title}`; renderSidebar(); renderContents(); wireInteractions(0); window.scrollTo({ top: 0, behavior: 'smooth' }); if (window.innerWidth <= 900) $('#sidebar').classList.remove('open'); }
function titleMarkup(index) { const titles = ['A new way to<br><i>think</i> about information.', 'The grammar of<br><i>possibility.</i>', 'Rotations for<br><i>information.</i>', 'Turn ideas into<br><i>experiments.</i>', 'Interference with<br><i>intention.</i>', 'Borrow a quantum<br><i>microscope.</i>', 'From theory to<br><i>runnable code.</i>', 'A horizon worth<br><i>exploring.</i>']; return titles[index]; }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.style.display = 'block'; setTimeout(() => toast.style.display = 'none', 2200); }

$('#previous-button').addEventListener('click', () => state.activeChapter === 0 ? loadTopic(state.activeTopic - 1) : loadChapter(state.activeChapter - 1));
$('#next-button').addEventListener('click', () => { completeChapter(state.activeChapter); if (state.activeChapter === 0 && state.activeTopic < fundamentalsTopics.length - 1) loadTopic(state.activeTopic + 1); else loadChapter(state.activeChapter + 1); });
$('#collapse-button').addEventListener('click', () => $('#sidebar').classList.toggle('collapsed'));
$('#menu-button').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
document.addEventListener('keydown', (event) => { if (event.key === '/' && document.activeElement.tagName !== 'INPUT') { event.preventDefault(); $('#search-input').focus(); } });
$('#search-input').addEventListener('input', (event) => { const query = event.target.value.toLowerCase().trim(); const results = $('#search-results'); if (!query) { results.hidden = true; return; } const matches = chapters.map((chapter, index) => ({ chapter, index })).filter(({ chapter }) => `${chapter.title} ${chapter.intro} ${chapter.type}`.toLowerCase().includes(query)); results.innerHTML = matches.length ? matches.map(({ chapter, index }) => `<button data-result="${index}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${chapter.title}</strong><small>${chapter.type}</small></button>`).join('') : '<p>No chapters found</p>'; results.hidden = false; results.querySelectorAll('[data-result]').forEach((result) => result.addEventListener('click', () => { loadChapter(Number(result.dataset.result)); results.hidden = true; $('#search-input').value = ''; })); });

loadChapter(0);
