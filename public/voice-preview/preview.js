'use strict';
async function init() {
  const status = document.getElementById('status');
  try {
    const response = await fetch('manifest.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('試聽資料載入失敗');
    const data = await response.json();
    const comparisonResponse = await fetch('comparisons.json', {
      cache: 'no-cache',
    });
    if (!comparisonResponse.ok) throw new Error('修正比較資料載入失敗');
    const comparisons = await comparisonResponse.json();
    for (const item of comparisons) {
      const card = document.createElement('article');
      card.className = 'voice';
      const title = document.createElement('h3');
      title.lang = 'ja';
      title.textContent = item.text;
      const note = document.createElement('p');
      note.textContent = item.note;
      const reading = document.createElement('p');
      reading.lang = 'ja';
      reading.className = 'muted';
      reading.textContent = item.reading;
      card.append(title, reading, note);
      if (item.referenceUrl) {
        const source = document.createElement('a');
        source.href = item.referenceUrl;
        source.target = '_blank';
        source.rel = 'noopener noreferrer';
        source.textContent = item.source + '・二手整理來源';
        card.append(source);
      }
      for (const version of ['before', 'after']) {
        const label = document.createElement('p');
        label.textContent = version === 'before' ? '修正前' : '修正後';
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.preload = 'none';
        audio.src = item[version];
        audio.setAttribute('aria-label', item.text + label.textContent);
        audio.addEventListener('error', () => {
          status.textContent = '播放失敗，請確認網路後重新整理。';
        });
        card.append(label, audio);
      }
      document.getElementById('comparison-cards').append(card);
    }
    const selector = document.getElementById('sample');
    const players = [];
    for (const sample of data.samples) {
      const option = document.createElement('option');
      option.value = sample.id;
      option.textContent = sample.focus;
      selector.append(option);
    }
    for (const voice of data.voices) {
      const card = document.createElement('article');
      card.className = 'voice';
      const title = document.createElement('h3');
      title.lang = 'ja';
      title.textContent = voice.name;
      const detail = document.createElement('p');
      detail.textContent = voice.candidate
        ? voice.note
        : '現役聲音・' + voice.style;
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.preload = 'none';
      audio.setAttribute('aria-label', voice.name + '試聽');
      const error = document.createElement('p');
      error.setAttribute('role', 'status');
      audio.addEventListener('error', () => {
        error.textContent = '播放失敗，請確認網路後切換句子重試。';
      });
      audio.addEventListener('play', () => {
        error.textContent = '';
        for (const other of document.querySelectorAll('audio'))
          if (other !== audio) other.pause();
      });
      const credit = document.createElement('p');
      credit.className = 'credit';
      credit.textContent = 'VOICEVOX:' + voice.name;
      card.append(title, detail, audio, error, credit);
      document
        .getElementById(voice.candidate ? 'male-voices' : 'current-voices')
        .append(card);
      players.push({ voice, audio, error });
    }
    function update() {
      const sample = data.samples.find((item) => item.id === selector.value);
      document.getElementById('sentence').textContent = sample.text;
      document.getElementById('reading').textContent = sample.reading;
      document.getElementById('focus').textContent =
        '比較重點：' + sample.focus;
      const source = document.getElementById('source');
      source.replaceChildren();
      if (sample.referenceUrl) {
        const link = document.createElement('a');
        link.href = sample.referenceUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = sample.source + '・二手台詞整理來源';
        source.append(link);
      } else source.textContent = '自撰比較句，非動畫台詞。';
      for (const player of players) {
        player.audio.pause();
        player.error.textContent = '';
        player.audio.src = player.voice.recordings.find(
          (item) => item.sample === sample.id,
        ).audio;
        player.audio.load();
      }
    }
    selector.addEventListener('change', update);
    for (const audio of document.querySelectorAll('#comparison-cards audio')) {
      audio.addEventListener('play', () => {
        for (const other of document.querySelectorAll('audio'))
          if (other !== audio) other.pause();
      });
    }
    selector.disabled = false;
    update();
    status.textContent = '';
    if (location.hash)
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
  } catch (error) {
    status.textContent =
      (error instanceof Error ? error.message : '載入失敗') +
      '；請連上網路後重新整理。';
  }
}
init();
