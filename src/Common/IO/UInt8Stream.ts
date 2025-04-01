import { InvalidOperationError } from "../../Common/InvalidOperationError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { ValueOutOfRangeError } from "../../Common/ValueOutOfRangeError.js";

export class UInt8Stream extends WritableStream<Uint8Array>
{
	#_buffer: ArrayBuffer;
	#_bufferView: Uint8Array;
	#_nextPosition: number = 0;
	#_closed: boolean = false;

	constructor(initialLength: number)
	{
		const write = (bytes: Uint8Array) =>
		{
			if (this.#_buffer.byteLength - this.#_nextPosition < bytes.length)
			{
				this.#_buffer = this.#_buffer.transfer(this.#_buffer.byteLength + bytes.length);
				this.#_bufferView = new Uint8Array(this.#_buffer);
			}

			this.#_bufferView.set(bytes, this.#_nextPosition);
			this.#_nextPosition += bytes.length;
		};

		const close = () =>
		{
			this.#_bufferView = new Uint8Array(this.#_buffer, 0, this.#_nextPosition);
			this.#_closed = true;
		};

		super({ write, close });
		ThrowHelper.TypeError.throwIfNotType(initialLength, "number");
		ValueOutOfRangeError.throwIfLessThan(initialLength, 1);

		this.#_buffer = new ArrayBuffer(initialLength);
		this.#_bufferView = new Uint8Array(this.#_buffer);
	}

	public get written()
	{
		if (!this.#_closed)
		{
			throw new InvalidOperationError("Cannot read a stream that is not closed.");
		}

		return this.#_bufferView;
	}
}
