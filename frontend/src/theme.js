import { createGlobalStyle } from "styled-components";

export const Theme = {
	font: "'Sora', sans-serif",
	bgPrimary: "#FFFFFF",
	bgRed: "#fff3f9",
	border1: "#E5EAED",
	accent: "#1189ff",
	black: "#000000",
	bgSecondary: "#090A0A",
	lightAccent: "#fafafa",
	lightSecondary: "#ececec",
	secondary: "#090A0A",
	dark1: "#888",
	dark2: "#444",
};

export const GlobalStyle = createGlobalStyle`
    html {
        background-color: ${Theme.bgPrimary};
        font-family: ${Theme.font};
    }
    body {
        margin: 0;
        padding: 0;
    }
    :root {
        ${Object.keys(Theme).map((key) => `--${key}: ${Theme[key]};`)}
    }
`;