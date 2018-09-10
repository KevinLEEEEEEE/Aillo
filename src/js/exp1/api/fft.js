const _fft = {
  mul(a, b) {
    return {
      real: a.real * b.real - a.imag * b.imag,
      imag: a.real * b.imag + a.imag * b.real,
    };
  },

  add(a, b) {
    return {
      real: a.real + b.real,
      imag: a.imag + b.imag,
    };
  },

  sub(a, b) {
    return {
      real: a.real - b.real,
      imag: a.imag - b.imag,
    };
  },

  reverse(array) {

  },
};

export default function fft(array) {

}
