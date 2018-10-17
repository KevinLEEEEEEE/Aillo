export default function averageDom() {
  const frag = document.createDocumentFragment();

  const span = document.createElement('span');

  span.innerHTML = 'average: ';

  frag.appendChild(span);

  const averageInput = document.createElement('input');

  frag.appendChild(averageInput);

  return { frag, averageInput };
}
