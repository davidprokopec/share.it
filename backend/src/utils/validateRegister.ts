import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  const pattern = /^[a-zA-Z]*$/;

  if (!pattern.test(options.username)) {
    return [
      {
        field: "username",
        message: "Uživatelské jméno může obsahovat pouze písmena a-Z",
      },
    ];
  }

  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Nesprávný e-mail",
      },
    ];
  }

  if (options.password !== options.passwordVerify) {
    return [
      {
        field: "password",
        message: " ",
      },
      {
        field: "passwordVerify",
        message: "Hesla se neshodují",
      },
    ];
  }

  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "Uživatelské jméno musí být delší než 2 znaky",
      },
    ];
  }

  if (options.password.length <= 4) {
    return [
      {
        field: "password",
        message: "Heslo musí být delší než 4 znaky",
      },
    ];
  }

  return null;
};
