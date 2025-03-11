/**
 * Enum for WebSocket Close Status Codes as defined in RFC 6455 Section 7.1.5.
 */
export enum WebSocketCloseCode
{
	/**
	 * 1000: Normal Closure. The connection successfully completed its purpose.
	 * */
	NormalClosure = 1000,

	/**
	 * 1001: Going Away. Indicates that an endpoint is "going away", such as a server shutting down or a browser navigating away from a page.
	 * */
	GoingAway = 1001,

	/**
	 * 1002: Protocol Error. Indicates that an endpoint is terminating the connection due to a protocol error.
	 * */
	ProtocolError = 1002,

	/**
	 * 1003: Unsupported Data. Indicates that an endpoint is terminating the connection because it received data it cannot accept.
	 * */
	UnsupportedData = 1003,

	/**
	 * 1004: Reserved. This code is reserved for future use and should not be used in a Close frame.
	 * */
	Reserved1004 = 1004,

	/**
	 * 1005: No Status Received. Reserved value indicating no status code was present. MUST NOT be used in a Close frame.
	 * */
	NoStatusReceived = 1005,

	/**
	 * 1006: Abnormal Closure. Reserved value indicating that the connection was closed abnormally. MUST NOT be used in a Close frame.
	 * */
	AbnormalClosure = 1006,

	/**
	 * 1007: Invalid Payload Data. Indicates that an endpoint is terminating the connection because it received data inconsistent with the message type (e.g., non-UTF-8 text data).
	 * */
	InvalidPayloadData = 1007,

	/**
	 * 1008: Policy Violation. Indicates that an endpoint is terminating the connection because it received a message that violates its policy.
	 * */
	PolicyViolation = 1008,

	/**
	 * 1009: Message Too Big. Indicates that an endpoint is terminating the connection because it received a message that is too large to handle.
	 * */
	MessageTooBig = 1009,

	/**
	 * 1010: Missing Extension. Indicates that the client is terminating the connection because it expected the server to negotiate one or more extensions, but the server didn't return them.
	 * */
	MissingExtension = 1010,

	/**
	 * 1011: Internal Error. Indicates that a server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.
	 * */
	InternalError = 1011,

	/**
	 * 1015: TLS Handshake Failure. Reserved value indicating that the connection was closed due to a failure in the TLS handshake. MUST NOT be used in a Close frame.
	 * */
	TlsHandshakeFailure = 1015,
}
