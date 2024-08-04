// Types

type SplashScreenNavigationType = {
	Welcome: undefined;
};

type AuthNavigationType = {
	Welcome: undefined;
	Login: undefined;
	Register: undefined;
	Splash: undefined;
};

type ScreenNavigationType = {
	CoinDetails: {
		coinUUID: string
	};
}

type HomeNavigationType = {
	Home: undefined;
	CoinDetails: {
		coinUUID: string;
	};
};

type SearchNavigationType = {
	SearchS: undefined;
}