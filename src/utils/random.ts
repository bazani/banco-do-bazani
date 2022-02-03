export const random = (length: number): string => {
  let result = '';
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charsLength = characters.length;

  for (let index = 0; index < charsLength; index++) {
    result += characters.charAt(Math.floor(Math.random() * charsLength));
  }

  return result;
}
