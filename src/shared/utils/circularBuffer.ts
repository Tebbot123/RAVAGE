export default class CircularBuffer<T> {
	private buffer: T[];

	private readonly capacity: number;
	private head: number = 0;
	private tail: number = 0;
	private length: number = 0;

	private is_full: boolean = false;

	constructor(capacity: number) {
		this.capacity = capacity;
		this.buffer = new Array<T>();
	}

	isEmpty() {
		return this.buffer.size() === 0;
	}

	enqueue(value: T) {
		let temp;
		if (this.is_full) {
			temp = this.buffer[this.tail];
		}

		this.buffer[this.tail] = value;
		this.tail = (this.tail + 1) % this.capacity;

		if (this.is_full) {
			this.head = (this.head + 1) % this.capacity;
		} else if (this.tail === this.head) {
			this.is_full = true;
		}

		this.length++;
		return temp;
	}

	dequeue() {
		assert(!this.isEmpty(), "Buffer is empty");
		const item = this.buffer[this.head];
		this.head = (this.head + 1) % this.capacity;
		this.is_full = false;
		return item;
	}

	last() {
		const tail = (this.tail - 1) % this.capacity;
		return this.buffer[tail];
	}

	peek() {
		return this.buffer[this.head];
	}
}
