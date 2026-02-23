export function getRandomAlphaNumeric(length:number):string 
{
  let s = '';
  while(s.length < length) {
    s += Math.random().toString(36).slice(2);
  }

  return s.slice(0, length);
};