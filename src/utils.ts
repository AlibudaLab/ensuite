const getEnsNameFromEmail = (emlProof: string) => {
  const regex = /\b(\w+)\.ensuite\.eth\b/;
  const match = emlProof.match(regex);
  console.log(match);
  return match ? match[1] : null;
};

export { getEnsNameFromEmail };
