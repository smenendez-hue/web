export function openModal(content) {
  const el = document.createElement("div");
  el.className = "yiqi-modal";
  el.innerHTML = `<div class="box">${content}</div>`;
  document.body.appendChild(el);
}
