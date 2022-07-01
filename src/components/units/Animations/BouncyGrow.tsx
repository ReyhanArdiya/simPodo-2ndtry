import type { ReactNode } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import baseTransitionMs from "../../../styles/global/base-transition-ms";

/**
 * Activate bouncyGrow animation on appear. You can also pass different children and
 *`transitionKey` on each rerender to switch content while doing `bouncyGrow` animation.
 */
const BouncyGrow = ({
	children,
	transitionKey
}: {
	children: ReactNode;
	transitionKey: never;
}) => {
	return (
		<TransitionGroup component={null}>
			<CSSTransition
				appear
				classNames="bouncy-grow"
				key={transitionKey}
				timeout={baseTransitionMs}
			>
				{children}
			</CSSTransition>
		</TransitionGroup>
	);
};

export default BouncyGrow;