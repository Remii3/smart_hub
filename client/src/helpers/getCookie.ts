function getCookie(name: string) {
  const cookie = {} as any;
  document.cookie.split(';').forEach((el) => {
    const [k, v] = el.split('=');
    cookie[k.trim()] = v;
  });
  return cookie[name];
}

export default getCookie;
