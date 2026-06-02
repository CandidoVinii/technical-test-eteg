import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    min-height: 100vh;
    min-height: 100dvh;
    overflow-x: hidden;
    font-family: ${({ theme }) => theme.fonts.family};
    font-size: ${({ theme }) => theme.fonts.sizeBase};
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.bgPage};
  }

  #root {
    min-height: 100vh;
    min-height: 100dvh;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
