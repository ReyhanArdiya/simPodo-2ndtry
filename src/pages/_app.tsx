import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { AppLayoutProps } from "next/app";
import Head from "next/head";
import { ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import wrapper from "../store";
import GlobalStyle from "../styles/global";
import theme from "../styles/theme";

config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above


const MyApp = ({ Component, pageProps }: AppLayoutProps) => {
	const getLayout = Component.getLayout || ((page: ReactNode) => page);

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
			{getLayout(<Component {...pageProps} />)}
		</ThemeProvider>
	);
};

export default wrapper.withRedux(MyApp);
