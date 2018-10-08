export default function pos(index, w) {
  const x = index % w;
  const y = Math.floor(index / w);

  return { x, y };
}
