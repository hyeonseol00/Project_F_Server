export const splitAtFirstSpace = (command) => {
  const firstSpaceIdx = command.indexOf(' ');
  const firstPart = firstSpaceIdx !== -1 ? command.substring(0, firstSpaceIdx) : command;
  const secondPart = firstSpaceIdx !== -1 ? command.substring(firstSpaceIdx + 1) : "";

  return { firstPart, secondPart };
};
