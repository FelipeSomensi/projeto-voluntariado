export function formatDate(value) {
  return new Date(value).toLocaleDateString('pt-BR');
}

export function toDateInput(value) {
  const date = new Date(value);
  const pad = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}