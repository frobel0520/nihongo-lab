import { stages } from '../curriculum/lessons.mjs';

export function App() {
  return (
    <main>
      <h1>日本語 Lab</h1>
      <p>骨架已就緒，課程內容尚未建立。</p>
      <ul>
        {stages.map((stage) => (
          <li key={stage.id}>
            {stage.title}（{stage.lessons.length} 課）
          </li>
        ))}
      </ul>
    </main>
  );
}
