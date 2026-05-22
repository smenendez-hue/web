export function toast(msg) {
  const el = document.createElement("div");
  el.className = "yiqi-toast";
  el.innerText = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
