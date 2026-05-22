export function renderTable(data = []) {
  if (!data.length) return "<p>Sin datos</p>";

  const cols = Object.keys(data[0]);

  return `
    <table class="yiqi-table">
      <thead>
        <tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            ${cols.map(c => `<td>${row[c]}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}
