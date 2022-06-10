import { createGlobalStyle, ThemeProvider } from "styled-components";
import cssReset from "../styles/global/css-reset";
import theme from "../styles/theme";
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

import Head from "next/head";
import animations from "../styles/global/animations";

const GlobalStyle = createGlobalStyle`
	${cssReset}
	${animations}
`;

const MyApp = ({ Component, pageProps }) => {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle/>
			<Head>
				<meta
					content="width=device-width, initial-scale=1.0"
					name="viewport"
				/>
				<title>simPodo</title>
			</Head>
			<Component {...pageProps} />
		</ThemeProvider>
	);
};

export default MyApp;
