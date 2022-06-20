import type {
	NextComponentType,
	NextPageContext,
	NextLayoutComponentType
} from "next";
import type { AppProps } from "next/app";

declare module "next" {
	type NextLayoutComponentType<P = Record<string, unknown>> =
		NextComponentType<NextPageContext, unknown, P> & {
			getLayout?: (page: ReactNode) => ReactNode;
		};
}

declare module "next/app" {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type AppLayoutProps<P = Record<string, unknown>> = AppProps & {
		Component: NextLayoutComponentType;
	};
}
