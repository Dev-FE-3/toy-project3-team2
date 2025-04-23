// 이메일
export const validateEmail = (value: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(value);
};

// 닉네임
export const validateNickname = (nickname: string) => {
  const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]{2,15}$/;

  return regex.test(nickname);
};

// 비밀번호
export const validatePassword = (password: string) => {
  if (password.length < 8 || password.length > 32) return false;

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return [hasLetter, hasNumber, hasSpecialChar].filter(Boolean).length >= 2;
};
