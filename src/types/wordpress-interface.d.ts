// import type { Argument } from 'classnames';

type ClassName = import( 'classnames' ).Argument;
declare module '@wordpress/interface' {
	export const InterfaceSkeleton: React.FunctionComponent<{
		className?: ClassName,
		content?: React.ReactNode,
		drawer?: React.ReactNode,
		header?: React.ReactNode,
		footer?: React.ReactNode,
		notices?: React.ReactNode,
		secondarySidebar?: React.ReactNode,
		sidebar?: React.ReactNode,
		actions?: React.ReactNode,
		labels?: Partial<{
			drawer: string,
			header: string,
			body: string,
			secondarySidebar: string,
			sidebar: string,
			actions: string,
			footer: string,
		}>,

		// todo: requires @wordpress/components __unstableUseNavigateRegions
		shortcuts?: any,
	}>;

	// type ToggleProps<Comp extends React.ComponentType> = React.FunctionComponent<{
	// 	as?: Comp,
	// 	icon: React.ReactNode,
	// 	identifier: string,
	// 	name?: any,
	// 	scope: string,
	// 	selectedIcon?: React.ReactNode,
	// } & React.ComponentProps<Comp>>;

	// function ComplementaryAreaToggle<C extends React.ComponentType>( ...props: Parameters<ToggleProps<C>> ): ReturnType<ToggleProps<C>>;

	// export interface ComplementaryArea {
	// 	Toggle: typeof ComplementaryAreaToggle,
	// 	Slot:
	// }

	type ShortcutType = React.ComponentProps<typeof import( '@wordpress/components' ).Button>['shortcut'];

	export const ComplementaryArea: React.FunctionComponent<React.PropsWithChildren<{
		className?: string,
		closeLabel?: string,
		identifier?: string,
		header?: React.ReactNode,
		headerClassName?: string,
		icon?: React.ReactNode,
		isPinnable?: boolean,
		panelClassName?: string,
		scope: string,
		name?: string,
		selectedIcon?: React.ReactNode,
		smallScreenTitle?: string,
		title: string,
		toggleShortcut?: ShortcutType,
		isActiveByDefault?: boolean,
		showIconLabels?: boolean,
	}>> & {
		Slot: React.FunctionComponent<{
			scope: string,
		}>,
	};

	export const PinnedItems: React.FunctionComponent<{
		scope: string,
	}> & {
		Slot: React.FunctionComponent<{
			className?: ClassName,
			scope: string,
		}>,
	};

	export const store: import( '@wordpress/data' ).StoreDescriptor;
}
