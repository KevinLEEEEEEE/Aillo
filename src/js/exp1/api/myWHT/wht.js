const _ = {
  grayCode(n) {
    return n ^ (n >> 1);
  },
};

const wht = () => {
  console.log(_.grayCode(1));
};

const iwht = () => {

};

export default {
  wht,
  iwht,
};
