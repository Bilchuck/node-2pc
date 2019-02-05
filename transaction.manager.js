

const payAndShip = (data) => {
  const prepare1 = preparePayment();
  const prepare2 = prepareShipping();
  try {
    const [result1, result2] = await Promise.all([prepare1, prepare2]);
  } catch {
    throw 
  }
};
