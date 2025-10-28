(function(){
  const form = document.getElementById('quiz-form');
  const results = document.getElementById('results');
  const scenarios = document.getElementById('scenarios');
  const submitBtn = document.getElementById('submit-btn');
  const resetBtn = document.getElementById('reset-btn');

  function renderQuestion(q) {
    const fs = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = `Q${q.id}`;
    const title = document.createElement('div');
    title.className = 'question';
    title.textContent = q.prompt;
    fs.appendChild(legend);
    fs.appendChild(title);

    const letters = ['A','B','C','D'];
    for (const letter of letters) {
      const id = `q${q.id}_${letter}`;
      const wrapper = document.createElement('label');
      wrapper.className = 'option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${q.id}`;
      input.value = letter;
      input.id = id;
      const text = document.createElement('div');
      text.innerHTML = `<span class="badge">${letter}</span> ${q.options[letter]}`;
      wrapper.appendChild(input);
      wrapper.appendChild(text);
      fs.appendChild(wrapper);
    }

    return fs;
  }

  function render() {
    QUESTIONS.forEach(q => form.appendChild(renderQuestion(q)));
  }

  function grade() {
    let correct = 0;
    const details = [];
    for (const q of QUESTIONS) {
      const chosen = (new FormData(form)).get(`q${q.id}`);
      const ok = chosen === q.answer;
      if (ok) correct++;
      details.push({ id: q.id, chosen, answer: q.answer, ok, explanation: q.explanation });
    }
    return { correct, total: QUESTIONS.length, details };
  }

  function showResults(res) {
    results.classList.remove('hidden');
    scenarios.classList.remove('hidden');
    const pct = Math.round((res.correct / res.total) * 100);
    const gradeClass = pct >= 80 ? 'result-ok' : 'result-bad';
    results.innerHTML = `
      <h2>Results</h2>
      <div class="score ${gradeClass}">${res.correct}/${res.total} correct (${pct}%)</div>
      <div>${res.details.map(d => {
        const status = d.ok ? '<span class="result-ok">Correct</span>' : `<span class="result-bad">Wrong</span> (your: ${d.chosen || '—'}, correct: ${d.answer})`;
        return `<div style="margin:8px 0"><strong>Q${d.id}:</strong> ${status}<div class="expl">${d.explanation}</div></div>`;
      }).join('')}</div>
    `;
    results.scrollIntoView({ behavior: 'smooth' });
  }

  submitBtn.addEventListener('click', () => {
    const res = grade();
    showResults(res);
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    results.classList.add('hidden');
    scenarios.classList.add('hidden');
    results.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  render();
})();
