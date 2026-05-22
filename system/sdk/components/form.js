export function renderForm(fields = []) {
  return `
    <form class="yiqi-form">
      ${fields.map(f => `
        <label>${f.label}
          <input name="${f.name}" />
        </label>
      `).join("")}
      <button type="submit">Guardar</button>
    </form>
  `;
}
