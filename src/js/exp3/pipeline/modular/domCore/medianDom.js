export default function averageDom() {
  const frag = document.createDocumentFragment();

  const span = document.createElement('span');

  span.innerHTML = 'median: ';

  frag.appendChild(span);

  const medianInput = document.createElement('input');

  frag.appendChild(medianInput);

  return { frag, medianInput };
}
