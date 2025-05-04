export const GatewayClientState =
	{
		Disconnected: 0,
		Connecting: 1,
		Connected: 2,
		DisconnectSent: 3,
	};

export type GatewayClientState = typeof GatewayClientState[keyof typeof GatewayClientState] | number;
