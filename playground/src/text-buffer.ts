interface Piece {
	add: boolean;
	start: number;
	length: number;
}

export class PieceTable {
	private originalBuffer = "";
	private addBuffer = "";

	private pieces: Piece[];

	constructor(text = "") {
		this.originalBuffer = text;
		this.pieces = [
			{
				add: false,
				start: 0,
				length: text.length,
			},
		];
	}

	apply() {
		const str = this.getText();
		return new PieceTable(str);
	}

	private getPieceAndBufferOffset(posInBuffer: number) {
		if (posInBuffer < 0) throw new RangeError("Position cannot be negative.");

		let remainingLength = posInBuffer;

		for (let i = 0; i < this.pieces.length; i++) {
			const piece = this.pieces[i]!;
			if (remainingLength <= piece.length) {
				return { piece, index: i, bufferOffset: piece.start + remainingLength };
			}
			remainingLength -= piece.length;
		}

		if (this.pieces.length <= 0) {
			const piece: Piece = {
				add: false,
				length: 0,
				start: 0,
			};

			if (posInBuffer > piece.length) {
				throw new RangeError("position provided exceeds text length");
			}
			this.pieces.push(piece);
			return { piece, index: 0, bufferOffset: piece.start + posInBuffer };
		}

		throw new RangeError("position provided exceeds text length");
	}

	insert(pos: number, text: string) {
		const addBufferOffset = this.addBuffer.length;

		this.addBuffer += text;

		const {
			piece,
			index: pieceIndex,
			bufferOffset,
		} = this.getPieceAndBufferOffset(pos);

		if (
			piece.add &&
			piece.start + piece.length === bufferOffset &&
			piece.start + piece.length === addBufferOffset
		) {
			piece.length += text.length;
			return;
		}

		const toInsert: Piece[] = [
			{
				add: piece.add,
				start: piece.start,
				length: bufferOffset - piece.start,
			},
			{
				add: true,
				start: addBufferOffset,
				length: text.length,
			},
			{
				add: piece.add,
				start: bufferOffset,
				length: piece.length - (bufferOffset - piece.start),
			},
		].filter((p) => p.length > 0);

		this.pieces.splice(pieceIndex, 1, ...toInsert);
	}

	delete(start: number, length: number): void {
		if (length === 0) {
			return;
		}
		if (length < 0) {
			this.delete(start + length, -length);
			return;
		}
		if (start < 0) {
			throw new RangeError("start cannot be negative");
		}

		// First, find the affected pieces, since a delete can span multiple pieces
		const {
			piece: startPieceToDelete,
			index: startPieceIndexToDelete,
			bufferOffset: startPieceBufferOffsetToDelete,
		} = this.getPieceAndBufferOffset(start);

		const {
			piece: endPieceToDelete,
			index: endPieceIndexToDelete,
			bufferOffset: endPieceBufferOffsetToDelete,
		} = this.getPieceAndBufferOffset(start + length);

		// If the deletion happens in start and end of the same piece then adjust the window
		if (startPieceIndexToDelete === endPieceIndexToDelete) {
			const piece = startPieceToDelete;
			// deleting at the start of the piece?
			if (startPieceBufferOffsetToDelete === piece.start) {
				piece.start += length;
				piece.length -= length;

				return;
			}
			// deleting at the end of the piece?
			if (endPieceBufferOffsetToDelete === piece.start + piece.length) {
				piece.length -= length;

				return;
			}
		}

		const deletePieces: Piece[] = [
			{
				add: startPieceToDelete.add,
				start: startPieceToDelete.start,
				length: startPieceBufferOffsetToDelete - startPieceToDelete.start,
			},
			{
				add: endPieceToDelete.add,
				start: endPieceBufferOffsetToDelete,
				length:
					endPieceToDelete.length -
					(endPieceBufferOffsetToDelete - endPieceToDelete.start),
			},
		].filter((piece) => piece.length > 0);

		this.pieces.splice(
			startPieceIndexToDelete,
			endPieceIndexToDelete - startPieceIndexToDelete + 1,
			...deletePieces
		);
	}

	getText() {
		let str = "";
		for (const piece of this.pieces) {
			const buffer = piece.add ? this.addBuffer : this.originalBuffer;
			str += buffer.substring(piece.start, piece.start + piece.length);
		}
		return str;
	}

	length() {
		let length = 0;
		for (let i = 0; i < this.pieces.length; i++)
			length += this.pieces[i]!.length;
		return length;
	}

	empty() {
		return this.pieces.length === 0;
	}
}
