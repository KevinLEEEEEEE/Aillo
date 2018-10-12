import canvasManager from './components/canvasManager';
import history from './components/history3';

export default function myCanvas2d(canvas, maxStep = 5) {
  const cvs = Object.create(canvasManager);
  const cvsHistory = history(maxStep);

  cvs.canvas = canvas;
  cvs.context = canvas.getContext('2d');
  cvs.do = () => {

  };

  return cvs;
}
