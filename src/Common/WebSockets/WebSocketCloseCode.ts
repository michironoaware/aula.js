/**
 * Enum for WebSocket Close Status Codes as defined in {@link https://www.rfc-editor.org/rfc/rfc6455#section-7.1.5 RFC 6455}.
 */
export const WebSocketCloseCode =
{
	/**
	 * Indicates a normal closure, meaning that the purpose for which the connection was established has been fulfilled.
	 */
	NormalClosure: 1000,

	/**
	 * Indicates that an endpoint is "going away", such as a server going down or a browser having navigated away from a page.
	 */
	GoingAway: 1001,

	/**
	 * Indicates that an endpoint is terminating the connection due to a protocol error.
	 */
	ProtocolError: 1002,

	/**
	 * Indicates that an endpoint is terminating the connection because it has received a type of data it cannot accept
	 * (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).
	 */
	UnsupportedData: 1003,

	/**
	 * Reserved. The specific meaning might be defined in the future.
	 */
	Reserved1004: 1004,

	/**
	 * Is a reserved value and MUST NOT be set as a status code in a Close control frame by an endpoint
	 * It is designated for use in applications expecting a status code to indicate that no status code was actually present.
	 */
	NoStatusCode: 1005,

	/**
	 * Is a reserved value and MUST NOT be set as a status code in a Close control frame by an endpoint.
	 * It is designated for use in applications expecting a status code to indicate that the connection was closed abnormally,
	 * e.g., without sending or receiving a Close control frame.
	 */
	AbnormalClosure: 1006,

	/**
	 * Indicates that an endpoint is terminating the connection because it has received data within a message
	 * that was not consistent with the type of the message (e.g., non-UTF-8 [RFC3629] data within a text message).
	 */
	InvalidPayloadData: 1007,

	/**
	 * indicates that an endpoint is terminating the connection because it has received a message that violates its policy.
	 * This is a generic status code that can be returned when there is no other more suitable status code
	 * (e.g., 1003 or 1009) or if there is a need to hide specific details about the policy.
	 * */
	PolicyViolation: 1008,

	/**
	 * Indicates that an endpoint is terminating the connection because it has received a message that is too big for it to process.
	 * */
	MessageTooBig: 1009,

	/**
	 * Indicates that an endpoint (client) is terminating the connection because it has expected the server to
	 * negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake.
	 * The list of extensions that are needed SHOULD appear in the /reason/ part of the Close frame.
	 * Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
	 */
	MissingExtension: 1010,

	/**
	 * Indicates that a server is terminating the connection because it encountered
	 * an unexpected condition that prevented it from fulfilling the request.
	 * */
	InternalError: 1011,

	/**
	 * Reserved. Indicates that the connection was closed due to a failure to perform a TLS handshake
	 * (e.g., the server certificate can't be verified).
	 */
	TlsHandshakeFailure: 1015,
} as const;

Object.freeze(WebSocketCloseCode);

export type WebSocketCloseCode = typeof WebSocketCloseCode[keyof typeof WebSocketCloseCode];
